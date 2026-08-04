import type { Song } from "./loader";
import {
  songStem,
  tanglishNorm,
  songLower,
  editDist,
  damerauLevenshtein,
  jaroWinkler,
  trigramSimilarity,
} from "./normalize";
import { getCachedSearchIndex, setCachedSearchIndex } from "./cache";

export interface SongHit {
  song: Song;
  score: number;
  firstLine: string;
  matchedLine: string;
  contextLines: { text: string; isMatch: boolean }[];
  highlightTokens: string[];
}

export interface LineEntry {
  text: string;
  normalized: string;
  normTokens: string[];
  stem: string;
  stemTokens: string[];
  rawTokens: string[];
  /** Pre-computed: normalized.replace(/\s+/g, "") — avoids hot-loop allocation */
  lineFlat: string;
}

export interface SongSearchData {
  firstLine: string;
  lines: LineEntry[];
  titleNorm: string;
  titleStem: string;
  titleLower: string;
  /** Pre-computed: titleNorm.split(/\s+/).filter(t => t.length >= 2) */
  titleNormTokens: string[];
}

let searchIndex = new Map<number, SongSearchData>();
let tokenInvertedIndex = new Map<string, Set<number>>();
let stemInvertedIndex = new Map<string, Set<number>>();

/**
 * Sorted array of all indexed tokens for O(log N) binary prefix search.
 * Rebuilt lazily on first search after an index update.
 */
let sortedTokens: string[] = [];
let tokensDirty = true;

/**
 * Stable songLookup map — built once in buildSearchIndex, updated incrementally.
 * Avoids creating a new Map on every search call.
 */
let songLookup = new Map<number, Song>();

/**
 * Monotonic version counter — incremented on every index change.
 * Replaces the O(N) songsId() string join for staleness detection.
 */
let indexVersion = 0;
let lastBuiltVersion = -1;

function addIndexToken(map: Map<string, Set<number>>, token: string, songId: number) {
  if (!token || token.length < 2) return;
  let set = map.get(token);
  if (!set) {
    set = new Set<number>();
    map.set(token, set);
  }
  set.add(songId);
}

function buildSortedTokens(): void {
  sortedTokens = Array.from(tokenInvertedIndex.keys()).sort();
  tokensDirty = false;
}

/** Binary search: first index where sortedTokens[i] >= prefix */
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

export function removeSearchIndex(songId: number) {
  searchIndex.delete(songId);
  songLookup.delete(songId);
  // Iterating all sets to delete is slow, but fine for single item deletion
  for (const set of tokenInvertedIndex.values()) {
    set.delete(songId);
  }
  for (const set of stemInvertedIndex.values()) {
    set.delete(songId);
  }
  tokensDirty = true;
  indexVersion++;
  queryCache.clear();
}

export function updateSearchIndex(song: Song) {
  removeSearchIndex(song.id);
  const lines: LineEntry[] = [];
  const titleNorm = tanglishNorm(song.title);
  const titleStem = song.titleStem || songStem(song.title);
  const titleLower = songLower(song.title);
  const titleNormTokens = titleNorm.split(/\s+/).filter((t) => t.length >= 2);

  for (const t of titleNormTokens) addIndexToken(tokenInvertedIndex, t, song.id);
  for (const s of titleStem.split(/\s+/)) addIndexToken(stemInvertedIndex, s, song.id);

  for (let si = 0; si < song.slides.length; si++) {
    const slideLines = song.slides[si]
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
          addIndexToken(tokenInvertedIndex, norm, song.id);
          addIndexToken(stemInvertedIndex, stem, song.id);
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
        lineFlat: normalized.replace(/\s+/g, ""),
      });
    }
  }

  songLookup.set(song.id, song);
  searchIndex.set(song.id, {
    firstLine: lines[0]?.text || song.title,
    lines,
    titleNorm,
    titleStem,
    titleLower,
    titleNormTokens,
  });
  tokensDirty = true;
  indexVersion++;
  queryCache.clear();
}

export function markSearchIndexUpdated(songs: Song[]) {
  // Rebuild lookup map to reflect current songs list
  songLookup = new Map(songs.map((s) => [s.id, s]));
  lastBuiltVersion = indexVersion;
  setCachedSearchIndex(String(indexVersion), { searchIndex, tokenInvertedIndex, stemInvertedIndex });
}

export function buildSearchIndex(songs: Song[]) {
  searchIndex.clear();
  tokenInvertedIndex.clear();
  stemInvertedIndex.clear();
  songLookup.clear();
  queryCache.clear();

  let totalLines = 0;

  for (const song of songs) {
    const lines: LineEntry[] = [];
    const titleNorm = tanglishNorm(song.title);
    const titleStem = song.titleStem || songStem(song.title);
    const titleLower = songLower(song.title);
    const titleNormTokens = titleNorm.split(/\s+/).filter((t) => t.length >= 2);

    for (const t of titleNormTokens) addIndexToken(tokenInvertedIndex, t, song.id);
    for (const s of titleStem.split(/\s+/)) addIndexToken(stemInvertedIndex, s, song.id);

    for (let si = 0; si < song.slides.length; si++) {
      const slideLines = song.slides[si]
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

            addIndexToken(tokenInvertedIndex, norm, song.id);
            addIndexToken(stemInvertedIndex, stem, song.id);
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
          lineFlat: normalized.replace(/\s+/g, ""),
        });
      }
    }
    totalLines += lines.length;
    const firstLine = lines.length > 0 ? lines[0].text : song.title;
    searchIndex.set(song.id, {
      firstLine,
      lines,
      titleNorm,
      titleStem,
      titleLower,
      titleNormTokens,
    });
    songLookup.set(song.id, song);
  }

  tokensDirty = true;
  indexVersion++;
  lastBuiltVersion = indexVersion;
  console.log(
    `[Songs Search] Built Inverted Candidate Index: ${searchIndex.size} songs, ${totalLines} lines`,
  );
}

// ── Query result LRU cache (main-thread fallback) ─────────────────────────────
const queryCache = new Map<string, SongHit[]>();
const MAX_CACHE = 100;

function queryCacheGet(key: string): SongHit[] | undefined {
  const val = queryCache.get(key);
  if (val === undefined) return undefined;
  queryCache.delete(key);
  queryCache.set(key, val);
  return val;
}

function queryCacheSet(key: string, val: SongHit[]): void {
  if (queryCache.has(key)) queryCache.delete(key);
  if (queryCache.size >= MAX_CACHE) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey !== undefined) queryCache.delete(firstKey);
  }
  queryCache.set(key, val);
}

import { supabase } from "../supabase";
import { buildSong } from "./loader";

export async function searchSongsOnline(query: string, limit = 120): Promise<SongHit[]> {
  const q = query.trim();
  try {
    let req = supabase.from("songs").select("*");
    if (q) {
      req = req.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
    }
    const { data, error } = await req.limit(limit);
    if (error || !data) return [];
    
    return data.map((raw: any) => {
      const song = buildSong(raw);
      const fl = song.slides[0]?.split("\n")[0] || song.title;
      return {
        song,
        score: 1,
        firstLine: fl,
        matchedLine: fl,
        contextLines: [{ text: fl, isMatch: true }],
        highlightTokens: [q],
      };
    });
  } catch {
    return [];
  }
}

export function searchSongs(query: string, songs: Song[], limit = 120): SongHit[] {
  const q = query.trim();
  if (!q) return [];

  // Re-index only if the version has changed since last build
  if (!searchIndex.size || lastBuiltVersion !== indexVersion) {
    buildSearchIndex(songs);
  }

  const cached = queryCacheGet(q);
  if (cached) return cached.slice(0, limit);

  const hits = runCandidateSearch(q, limit);

  queryCacheSet(q, hits);
  return hits;
}

// ── Candidate lookup ──────────────────────────────────────────────────────────

function getCandidateSongIds(qTokens: string[], qStems: string[], songs: Song[]): Set<number> {
  const candidates = new Set<number>();

  for (const qt of qTokens) {
    const ids = tokenInvertedIndex.get(qt);
    if (ids) for (const id of ids) candidates.add(id);
  }
  for (const qs of qStems) {
    const ids = stemInvertedIndex.get(qs);
    if (ids) for (const id of ids) candidates.add(id);
  }

  // Prefix matching via binary search — O(log N + k) instead of O(N)
  if (candidates.size < 10 && qTokens.length > 0) {
    if (tokensDirty) buildSortedTokens();
    for (const qt of qTokens) {
      if (qt.length < 3) continue;
      const start = lowerBound(sortedTokens, qt);
      for (let i = start; i < sortedTokens.length; i++) {
        const tok = sortedTokens[i];
        if (!tok.startsWith(qt)) break;
        const ids = tokenInvertedIndex.get(tok);
        if (ids) for (const id of ids) candidates.add(id);
        if (candidates.size >= 50) break;
      }
      if (candidates.size >= 50) break;
    }
  }

  // Fallback to top 100 songs if candidates empty
  if (candidates.size === 0) {
    for (let i = 0; i < Math.min(100, songs.length); i++) {
      candidates.add(songs[i].id);
    }
  }

  return candidates;
}

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
    let bestDist = Infinity;
    let bestIdx = -1;

    for (let i = 0; i < lineTokens.length; i++) {
      const lt = lineTokens[i];
      const ls = lineStems?.[i] ?? "";

      // 1. Exact token match
      if (lt === qt) {
        bestIdx = i;
        bestDist = 0;
        totalBonus += 50;
        break;
      }

      // 2. Sound-alike stem match
      if (qs && ls && (ls === qs || ls.includes(qs) || qs.includes(ls))) {
        if (0.5 < bestDist) {
          bestDist = 0.5;
          bestIdx = i;
          totalBonus += 35;
        }
      }

      // 3. Jaro-Winkler prefix & typo match
      const jw = jaroWinkler(lt, qt);
      if (jw >= 0.85 && 0.8 < bestDist) {
        bestDist = 0.8;
        bestIdx = i;
        totalBonus += Math.floor(jw * 30);
      }

      // 4. Substring match for 4+ chars
      if (lt.length >= 4 && qt.length >= 4 && (lt.includes(qt) || qt.includes(lt))) {
        if (1 < bestDist) {
          bestDist = 1;
          bestIdx = i;
          totalBonus += 25;
        }
      }

      // 5. Damerau-Levenshtein / Bounded edit distance
      if (Math.abs(lt.length - qt.length) <= 3) {
        const threshold = Math.min(3, Math.max(1, Math.floor(Math.max(lt.length, qt.length) * 0.4)));
        const d = damerauLevenshtein(lt, qt);
        if (d <= threshold && d < bestDist) {
          bestDist = d;
          bestIdx = i;
          totalBonus += 20;
        }
      }
    }
    if (bestIdx !== -1) indices.add(bestIdx);
  }

  return { indices: Array.from(indices), scoreBonus: totalBonus };
}

/**
 * runCandidateSearch — uses the stable songLookup map (no per-call Map construction).
 * songs param kept for fallback getCandidateSongIds only.
 */
function runCandidateSearch(query: string, limit: number): SongHit[] {
  const qNorm = tanglishNorm(query);
  if (!qNorm) return [];
  const qTokens = qNorm.split(/\s+/).filter((t) => t.length >= 2);
  const qFlat = qNorm.replace(/\s+/g, "");
  const qStems = songStem(query)
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  const rawQueryLower = query.toLowerCase().trim();
  const qRawTokens = query.trim().split(/\s+/).filter(Boolean);

  // Use stable songLookup; pass empty array since we only use it for the top-N fallback
  const candidateIds = getCandidateSongIds(qTokens, qStems, []);
  const hits: SongHit[] = [];

  for (const songId of candidateIds) {
    const song = songLookup.get(songId);
    if (!song) continue;
    const data = searchIndex.get(songId);
    if (!data) continue;

    // --- TITLE SCORING ---
    let titleScore = 0;
    const titleLower = data.titleLower;

    if (titleLower === rawQueryLower || data.titleNorm === qFlat) {
      titleScore = 1000;
    } else if (titleLower.includes(rawQueryLower) || data.titleNorm.includes(qFlat)) {
      titleScore = 750;
    } else if (qTokens.length) {
      // Use pre-computed titleNormTokens
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

      // Use pre-computed lineFlat
      const lineFlat = line.lineFlat;

      if (lineFlat === qFlat || line.text.toLowerCase() === rawQueryLower) {
        ls = 600;
        indices = line.rawTokens.map((_, i) => i);
      } else if (lineFlat.includes(qFlat)) {
        ls = 450;
        const res = getMatchIndices(line.normTokens, qTokens, line.stemTokens, qStems);
        indices = res.indices;
      } else if (qFlat.includes(lineFlat) && lineFlat.length >= 4) {
        ls = 350;
        const res = getMatchIndices(line.normTokens, qTokens, line.stemTokens, qStems);
        indices = res.indices;
      } else if (qTokens.length) {
        const res = getMatchIndices(line.normTokens, qTokens, line.stemTokens, qStems);
        indices = res.indices;
        if (indices.length > 0) {
          ls = (indices.length / qTokens.length) * 150 + res.scoreBonus;
        }
      }

      // Line Position Ranking Bonuses
      if (ls > 0) {
        if (li === 0) {
          ls += 250;
        } else if (li === totalLines - 1) {
          ls += 100;
        } else {
          ls += 150;
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

      if (bestLine && bestLineIndex >= 0) {
        matchedText = bestLine.text;
        const startIdx = Math.max(0, bestLineIndex - 1);
        const endIdx = Math.min(totalLines - 1, bestLineIndex + 1);

        for (let i = startIdx; i <= endIdx; i++) {
          contextLines.push({
            text: data.lines[i].text,
            isMatch: i === bestLineIndex,
          });
        }
      } else {
        contextLines.push({ text: data.firstLine, isMatch: true });
      }

      const finalHighlightTokens = Array.from(
        new Set([...qRawTokens, ...qTokens, ...bestHighlightTokens]),
      );

      hits.push({
        song,
        score: totalScore,
        firstLine: data.firstLine,
        matchedLine: matchedText,
        contextLines,
        highlightTokens: finalHighlightTokens,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
