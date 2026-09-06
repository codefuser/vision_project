/**
 * Dedicated Web Worker for Song Search Engine.
 * Runs tokenization, phonetic normalization, inverted index candidate retrieval,
 * Levenshtein, Jaro-Winkler, and multi-tier ranking off the main UI thread.
 *
 * Performance optimizations (DO NOT change search logic):
 *  - LRU query result cache (100 entries) — cache is invalidated on INDEX_ALL.
 *  - Pre-computed lineFlat, titleNormTokens stored in index entries — no runtime replace/split.
 *  - Sorted token array built at index time for O(log N) prefix lookup.
 *  - Stale query guard: only posts SEARCH_RESULTS when queryId matches latest.
 */

import type { Song } from "./loader";
import { get } from "idb-keyval";
import {
  songStem,
  tanglishNorm,
  songLower,
  editDist,
  damerauLevenshtein,
  jaroWinkler,
  trigramSimilarity,
  getTrigrams,
} from "./normalize";

export interface SongHitWorker {
  songId: number;
  song: Song;
  score: number;
  firstLine: string;
  matchedLine: string;
  contextLines: { text: string; isMatch: boolean }[];
  highlightTokens: string[];
}

interface LineEntry {
  text: string;
  normalized: string;
  normTokens: string[];
  stem: string;
  stemTokens: string[];
  rawTokens: string[];
  /** Pre-computed: normalized.replace(/\s+/g, "") — avoids hot-loop allocation */
  lineFlat: string;
}

interface SongSearchData {
  song: Song;
  firstLine: string;
  lines: LineEntry[];
  titleNorm: string;
  titleStem: string;
  titleLower: string;
  /** Pre-computed: titleNorm.split(/\s+/).filter(t => t.length >= 2) */
  titleNormTokens: string[];
  allTrigrams: Set<string>;
}

// ── In-Memory Inverted Index Structures ───────────────────────────────────────
const songsMap = new Map<number, SongSearchData>();
const tokenInvertedIndex = new Map<string, Set<number>>();
const trigramInvertedIndex = new Map<string, Set<number>>();
const stemInvertedIndex = new Map<string, Set<number>>();

/**
 * Sorted array of all indexed tokens — used for O(log N) binary prefix search
 * instead of iterating the entire token map.
 */
let sortedTokens: string[] = [];
let tokensDirty = true; // rebuilt lazily on first search after indexing

// ── LRU Query Cache ───────────────────────────────────────────────────────────
const MAX_QUERY_CACHE = 100;
const queryCache = new Map<string, SongHitWorker[]>();

function queryCacheGet(key: string): SongHitWorker[] | undefined {
  const val = queryCache.get(key);
  if (val === undefined) return undefined;
  // Move to end (most-recently-used)
  queryCache.delete(key);
  queryCache.set(key, val);
  return val;
}

function queryCacheSet(key: string, val: SongHitWorker[]): void {
  if (queryCache.has(key)) queryCache.delete(key);
  if (queryCache.size >= MAX_QUERY_CACHE) {
    // Evict least-recently-used (first entry)
    const firstKey = queryCache.keys().next().value;
    if (firstKey !== undefined) queryCache.delete(firstKey);
  }
  queryCache.set(key, val);
}

function clearQueryCache(): void {
  queryCache.clear();
}

// ── Latest query ID guard (drop stale responses) ─────────────────────────────
let latestQueryId = 0;

// ── Index helpers ─────────────────────────────────────────────────────────────
function addInvertedIndex(indexMap: Map<string, Set<number>>, key: string, songId: number) {
  if (!key) return;
  let set = indexMap.get(key);
  if (!set) {
    set = new Set<number>();
    indexMap.set(key, set);
  }
  set.add(songId);
}

function buildSortedTokens(): void {
  sortedTokens = Array.from(tokenInvertedIndex.keys()).sort();
  tokensDirty = false;
}

/** Binary search — finds first index where sortedTokens[i] >= prefix */
function lowerBound(arr: string[], prefix: string): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] < prefix) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function indexSong(song: Song) {
  const lines: LineEntry[] = [];
  const songTrigrams = new Set<string>();

  // Title indexing
  const titleNorm = tanglishNorm(song.title);
  const titleStem = song.titleStem || songStem(song.title);
  const titleLower = songLower(song.title);
  const titleNormTokens = titleNorm.split(/\s+/).filter((t) => t.length >= 2);

  for (const t of titleNormTokens) {
    addInvertedIndex(tokenInvertedIndex, t, song.id);
  }
  for (const s of titleStem.split(/\s+/)) {
    if (s.length >= 2) addInvertedIndex(stemInvertedIndex, s, song.id);
  }
  for (const tri of getTrigrams(titleNorm)) {
    songTrigrams.add(tri);
    addInvertedIndex(trigramInvertedIndex, tri, song.id);
  }

  // Slide lines indexing
  for (const slide of song.slides) {
    const slideLines = slide
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    for (const text of slideLines) {
      const rawTokensArray = text.split(/\s+/);
      const normTokens: string[] = [];
      const stemTokens: string[] = [];
      const validRawTokens: string[] = [];

      for (const raw of rawTokensArray) {
        const norm = tanglishNorm(raw);
        const stem = songStem(raw);
        if (norm && stem) {
          normTokens.push(norm);
          stemTokens.push(stem);
          validRawTokens.push(raw);

          if (norm.length >= 2) addInvertedIndex(tokenInvertedIndex, norm, song.id);
          if (stem.length >= 2) addInvertedIndex(stemInvertedIndex, stem, song.id);
        }
      }

      const normalized = normTokens.join(" ");
      lines.push({
        text,
        normalized,
        normTokens,
        stem: stemTokens.join(" "),
        stemTokens,
        rawTokens: validRawTokens,
        // Pre-compute lineFlat once — eliminates hot-loop .replace() calls
        lineFlat: normalized.replace(/\s+/g, ""),
      });
    }
  }

  const firstLine = lines.length > 0 ? lines[0].text : song.title;

  songsMap.set(song.id, {
    song,
    firstLine,
    lines,
    titleNorm,
    titleStem,
    titleLower,
    titleNormTokens,
    allTrigrams: songTrigrams,
  });
}

function clearAllIndexes() {
  songsMap.clear();
  tokenInvertedIndex.clear();
  trigramInvertedIndex.clear();
  stemInvertedIndex.clear();
  sortedTokens = [];
  tokensDirty = true;
  clearQueryCache();
}

// ── Candidate lookup ──────────────────────────────────────────────────────────

function getCandidateSongIds(qTokens: string[], qStems: string[], qTrigrams: string[]): Set<number> {
  const candidates = new Set<number>();
  const MAX_CANDIDATES = 120;

  // 1. Exact token matches (titles & lyrics) — instant O(1)
  for (const qt of qTokens) {
    const ids = tokenInvertedIndex.get(qt);
    if (ids) {
      for (const id of ids) {
        candidates.add(id);
        if (candidates.size >= MAX_CANDIDATES) return candidates;
      }
    }
  }

  // 2. Sound-alike stem matches — instant O(1)
  for (const qs of qStems) {
    const ids = stemInvertedIndex.get(qs);
    if (ids) {
      for (const id of ids) {
        candidates.add(id);
        if (candidates.size >= MAX_CANDIDATES) return candidates;
      }
    }
  }

  // 3. Prefix matching via binary search on sorted tokens — O(log N + k)
  if (candidates.size < 40 && qTokens.length > 0) {
    if (tokensDirty) buildSortedTokens();
    for (const qt of qTokens) {
      if (qt.length < 2) continue;
      const start = lowerBound(sortedTokens, qt);
      for (let i = start; i < sortedTokens.length; i++) {
        const tok = sortedTokens[i];
        if (!tok.startsWith(qt)) break;
        const ids = tokenInvertedIndex.get(tok);
        if (ids) {
          for (const id of ids) {
            candidates.add(id);
            if (candidates.size >= MAX_CANDIDATES) return candidates;
          }
        }
      }
    }
  }

  // 3b. Fuzzy token match for typos (edit distance <= 1) if candidates are few (< 30)
  if (candidates.size < 30 && qTokens.length > 0) {
    if (tokensDirty) buildSortedTokens();
    for (const qt of qTokens) {
      if (qt.length < 3) continue;
      for (let i = 0; i < sortedTokens.length; i++) {
        const tok = sortedTokens[i];
        if (Math.abs(tok.length - qt.length) <= 1) {
          if (damerauLevenshtein(tok, qt) <= 1) {
            const ids = tokenInvertedIndex.get(tok);
            if (ids) {
              for (const id of ids) {
                candidates.add(id);
                if (candidates.size >= MAX_CANDIDATES) return candidates;
              }
            }
          }
        }
      }
    }
  }

  // 4. Trigrams ONLY if candidates are still very few (< 15) — strictly capped
  if (candidates.size < 15 && qTrigrams.length > 0) {
    for (const tri of qTrigrams) {
      const ids = trigramInvertedIndex.get(tri);
      if (ids) {
        for (const id of ids) {
          candidates.add(id);
          if (candidates.size >= 50) break;
        }
      }
      if (candidates.size >= 50) break;
    }
  }

  // 5. Fallback top songs if absolutely zero hits
  if (candidates.size === 0) {
    let count = 0;
    for (const id of songsMap.keys()) {
      candidates.add(id);
      count++;
      if (count >= 50) break;
    }
  }

  return candidates;
}

// ── Token match scoring ───────────────────────────────────────────────────────

function getMatchIndices(
  lineTokens: string[],
  qTokens: string[],
  lineStems?: string[],
  qStems?: string[],
): { indices: number[]; scoreBonus: number } {
  if (!qTokens.length || !lineTokens.length) return { indices: [], scoreBonus: 0 };
  const indices = new Set<number>();
  let totalBonus = 0;

  for (let qIdx = 0; qIdx < qTokens.length; qIdx++) {
    const qt = qTokens[qIdx];
    const qs = qStems?.[qIdx] ?? "";
    let matchedInLine = false;

    // Fast pass 1: Exact, prefix, or sound-alike stem match (O(1) string checks)
    for (let i = 0; i < lineTokens.length; i++) {
      const lt = lineTokens[i];
      const ls = lineStems?.[i] ?? "";

      // Exact token match
      if (lt === qt) {
        indices.add(i);
        totalBonus += 50;
        matchedInLine = true;
        break;
      }

      // Prefix match
      if (lt.startsWith(qt) && qt.length >= 2) {
        indices.add(i);
        totalBonus += 40;
        matchedInLine = true;
        break;
      }

      // Sound-alike stem match
      if (qs && ls && (ls === qs || ls.startsWith(qs) || qs.startsWith(ls))) {
        indices.add(i);
        totalBonus += 35;
        matchedInLine = true;
        break;
      }

      // Substring match for 3+ chars
      if (lt.length >= 3 && qt.length >= 3 && lt.includes(qt)) {
        indices.add(i);
        totalBonus += 25;
        matchedInLine = true;
        break;
      }
    }

    // Fast pass 2: Only run edit distance if NO token matched and token is long enough (>= 4)
    if (!matchedInLine && qt.length >= 4) {
      for (let i = 0; i < lineTokens.length; i++) {
        const lt = lineTokens[i];
        if (Math.abs(lt.length - qt.length) <= 1) {
          const d = damerauLevenshtein(lt, qt);
          if (d <= 1) {
            indices.add(i);
            totalBonus += 20;
            break;
          }
        }
      }
    }
  }

  return { indices: Array.from(indices), scoreBonus: totalBonus };
}

// ── Main scoring function ─────────────────────────────────────────────────────

function evaluateSearch(query: string, limit = 120): SongHitWorker[] {
  const q = query.trim();
  if (!q) return [];

  // LRU cache hit — no work needed
  const cacheKey = `${q}:${limit}`;
  const cached = queryCacheGet(cacheKey);
  if (cached) return cached;

  const qNorm = tanglishNorm(q);
  const qTokens = qNorm.split(/\s+/).filter((t) => t.length >= 2);
  const qFlat = qNorm.replace(/\s+/g, "");
  const qStems = songStem(q)
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  const qTrigrams = getTrigrams(qNorm);
  const rawQueryLower = q.toLowerCase().trim();
  const qRawTokens = q.split(/\s+/).filter(Boolean);

  const candidateIds = getCandidateSongIds(qTokens, qStems, qTrigrams);
  const hits: SongHitWorker[] = [];

  for (const songId of candidateIds) {
    const data = songsMap.get(songId);
    if (!data) continue;

    // --- TITLE SCORING ---
    let titleScore = 0;
    const titleLower = data.titleLower;

    if (titleLower === rawQueryLower || data.titleNorm === qFlat) {
      titleScore = 1000;
    } else if (titleLower.includes(rawQueryLower) || data.titleNorm.includes(qFlat)) {
      titleScore = 750;
    } else if (qTokens.length) {
      // Use pre-computed titleNormTokens — no runtime split
      const { indices, scoreBonus } = getMatchIndices(data.titleNormTokens, qTokens);
      if (indices.length > 0) {
        titleScore = (indices.length / qTokens.length) * 200 + scoreBonus;
      }
    }

    // --- LYRIC LINE SCORING ---
    let bestLine: LineEntry | null = null;
    let bestLineIndex = -1;
    let bestLineScore = 0;
    let bestHighlightTokens: string[] = [];

    const totalLines = data.lines.length;

    for (let li = 0; li < totalLines; li++) {
      const line = data.lines[li];
      let ls = 0;
      let indices: number[] = [];

      // Use pre-computed lineFlat — no runtime .replace()
      const lineFlat = line.lineFlat;

      if (lineFlat === qFlat || line.text.toLowerCase() === rawQueryLower) {
        ls = 950;
        indices = line.rawTokens.map((_, i) => i);
      } else if (lineFlat.includes(qFlat)) {
        ls = 750;
        const res = getMatchIndices(line.normTokens, qTokens, line.stemTokens, qStems);
        indices = res.indices;
      } else if (qFlat.includes(lineFlat) && lineFlat.length >= 4) {
        ls = 600;
        const res = getMatchIndices(line.normTokens, qTokens, line.stemTokens, qStems);
        indices = res.indices;
      } else if (qTokens.length) {
        const res = getMatchIndices(line.normTokens, qTokens, line.stemTokens, qStems);
        indices = res.indices;
        if (indices.length > 0) {
          ls = (indices.length / qTokens.length) * 550 + res.scoreBonus;
        }
      }

      // Fair line ranking (slight bonus for early lines, but quality of match dominates)
      if (ls > 0) {
        if (li === 0) {
          ls += 30;
        } else if (li < 4) {
          ls += 20;
        }
      }

      if (ls > bestLineScore) {
        bestLineScore = ls;
        bestLine = line;
        bestLineIndex = li;
        bestHighlightTokens = indices.map((i) => line.rawTokens[i]).filter(Boolean);
      }
    }

    const totalScore = titleScore + bestLineScore;

    if (totalScore > 0 && (titleScore >= 80 || bestLineScore >= 80)) {
      let matchedText = data.firstLine;
      const contextLines: { text: string; isMatch: boolean }[] = [];

      if (totalLines > 0) {
        const matchIdx = bestLineIndex >= 0 ? bestLineIndex : 0;
        const isTitleMatchOnly = bestLineIndex < 0;

        // 4-line contextual preview window centered on the match:
        // 1 line before, matched line, 2 lines after (or closest available 4 lines)
        let startIdx = matchIdx - 1;
        if (startIdx < 0) startIdx = 0;
        if (startIdx + 4 > totalLines) {
          startIdx = Math.max(0, totalLines - 4);
        }
        const endIdx = Math.min(totalLines - 1, startIdx + 3);

        for (let i = startIdx; i <= endIdx; i++) {
          contextLines.push({
            text: data.lines[i].text,
            isMatch: !isTitleMatchOnly && i === matchIdx,
          });
        }
        matchedText = data.lines[matchIdx]?.text || data.firstLine;
      } else {
        contextLines.push({ text: data.firstLine, isMatch: true });
      }

      const finalHighlightTokens = Array.from(
        new Set([...qRawTokens, ...qTokens, ...bestHighlightTokens]),
      );

      hits.push({
        songId: data.song.id,
        song: data.song,
        score: totalScore,
        firstLine: data.firstLine,
        matchedLine: matchedText,
        contextLines,
        highlightTokens: finalHighlightTokens,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  const result = hits.slice(0, limit);

  queryCacheSet(cacheKey, result);
  return result;
}

// ── Chunked Background Indexing State ─────────────────────────────────────────
let indexingGeneration = 0;
let isIndexing = false;
const CHUNK_SIZE = 1000;

function startIndexing(songs: Song[]) {
  clearAllIndexes();
  const currentGen = ++indexingGeneration;
  isIndexing = true;
  let cursor = 0;

  function runNextChunk() {
    if (currentGen !== indexingGeneration) return; // Stale indexing job canceled

    const end = Math.min(cursor + CHUNK_SIZE, songs.length);
    for (let i = cursor; i < end; i++) {
      indexSong(songs[i]);
    }
    cursor = end;
    tokensDirty = true;

    // After first chunk, notify that initial search is ready so queries return immediately
    if (cursor === Math.min(CHUNK_SIZE, songs.length)) {
      self.postMessage({
        type: "INDEX_PROGRESS",
        indexed: cursor,
        total: songs.length,
        ready: true,
      });
    }

    if (cursor < songs.length) {
      // Yield to worker event loop so any incoming SEARCH messages are processed immediately!
      setTimeout(runNextChunk, 0);
    } else {
      isIndexing = false;
      buildSortedTokens();
      self.postMessage({
        type: "INDEXED_COMPLETE",
        totalSongs: songsMap.size,
      });
    }
  }

  runNextChunk();
}

// ── Worker Message Handler ────────────────────────────────────────────────────
self.onmessage = (e: MessageEvent) => {
  const { type, payload, queryId } = e.data;

  if (type === "INIT_FROM_STORAGE") {
    // Attempt to load precomputed songs directly from IndexedDB without main thread serialization
    get<Song[]>("vision_songs_precomputed_v4")
      .then((cachedSongs) => {
        if (cachedSongs && cachedSongs.length > 0) {
          startIndexing(cachedSongs);
        } else {
          self.postMessage({ type: "STORAGE_EMPTY" });
        }
      })
      .catch(() => {
        self.postMessage({ type: "STORAGE_EMPTY" });
      });
  } else if (type === "INDEX_ALL") {
    const songs: Song[] = payload.songs;
    // If we already have all these songs indexed and not running, don't re-index!
    if (songsMap.size === songs.length && !isIndexing) {
      self.postMessage({ type: "INDEXED_COMPLETE", totalSongs: songsMap.size });
      return;
    }
    startIndexing(songs);
  } else if (type === "UPDATE_SONG") {
    const song: Song = payload.song;
    indexSong(song);
    tokensDirty = true;
    clearQueryCache(); // invalidate stale results
    self.postMessage({ type: "SONG_UPDATED", songId: song.id });
  } else if (type === "REMOVE_SONG") {
    const songId: number = payload.songId;
    songsMap.delete(songId);
    tokensDirty = true;
    clearQueryCache();
    self.postMessage({ type: "SONG_REMOVED", songId });
  } else if (type === "SEARCH") {
    // Track latest query so we can drop stale responses on the hook side
    latestQueryId = queryId;
    const t0 = performance.now();
    const hits = evaluateSearch(payload.query, payload.limit ?? 120);
    const searchMs = performance.now() - t0;
    // Only post if this query is still the latest (guards against race in very fast typing)
    if (queryId === latestQueryId) {
      self.postMessage({ type: "SEARCH_RESULTS", queryId, hits, searchMs });
    }
  }
};
