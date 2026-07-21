/**
  * Dedicated Web Worker for Song Search Engine.
  * Runs tokenization, phonetic normalization, inverted index candidate retrieval,
  * Levenshtein, Jaro-Winkler, and multi-tier ranking off the main UI thread.
  */

import type { Song } from "./loader";
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
}

interface SongSearchData {
  song: Song;
  firstLine: string;
  lines: LineEntry[];
  titleNorm: string;
  titleStem: string;
  titleLower: string;
  allTrigrams: Set<string>;
}

// In-Memory Inverted Index Structures
const songsMap = new Map<number, SongSearchData>();
const tokenInvertedIndex = new Map<string, Set<number>>();
const trigramInvertedIndex = new Map<string, Set<number>>();
const stemInvertedIndex = new Map<string, Set<number>>();

function addInvertedIndex(indexMap: Map<string, Set<number>>, key: string, songId: number) {
  if (!key) return;
  let set = indexMap.get(key);
  if (!set) {
    set = new Set<number>();
    indexMap.set(key, set);
  }
  set.add(songId);
}

function indexSong(song: Song) {
  const lines: LineEntry[] = [];
  const songTrigrams = new Set<string>();

  // Title indexing
  const titleNorm = tanglishNorm(song.title);
  const titleStem = song.titleStem || songStem(song.title);
  const titleLower = songLower(song.title);

  for (const t of titleNorm.split(/\s+/)) {
    if (t.length >= 2) addInvertedIndex(tokenInvertedIndex, t, song.id);
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
          for (const tri of getTrigrams(norm)) {
            songTrigrams.add(tri);
            addInvertedIndex(trigramInvertedIndex, tri, song.id);
          }
        }
      }

      lines.push({
        text,
        normalized: normTokens.join(" "),
        normTokens,
        stem: stemTokens.join(" "),
        stemTokens,
        rawTokens: validRawTokens,
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
    allTrigrams: songTrigrams,
  });
}

function clearAllIndexes() {
  songsMap.clear();
  tokenInvertedIndex.clear();
  trigramInvertedIndex.clear();
  stemInvertedIndex.clear();
}

function getCandidateSongIds(qTokens: string[], qStems: string[], qTrigrams: string[]): Set<number> {
  const candidates = new Set<number>();

  for (const qt of qTokens) {
    const ids = tokenInvertedIndex.get(qt);
    if (ids) for (const id of ids) candidates.add(id);
  }
  for (const qs of qStems) {
    const ids = stemInvertedIndex.get(qs);
    if (ids) for (const id of ids) candidates.add(id);
  }
  for (const tri of qTrigrams) {
    const ids = trigramInvertedIndex.get(tri);
    if (ids) for (const id of ids) candidates.add(id);
  }

  // If query is short or no token hits, include top 500 fallback songs
  if (candidates.size === 0) {
    let count = 0;
    for (const id of songsMap.keys()) {
      candidates.add(id);
      count++;
      if (count >= 500) break;
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

function evaluateSearch(query: string, limit = 120): SongHitWorker[] {
  const q = query.trim();
  if (!q) return [];

  const start = performance.now();
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
      const tTokens = data.titleNorm.split(/\s+/).filter((t) => t.length >= 2);
      const { indices, scoreBonus } = getMatchIndices(tTokens, qTokens);
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

      const lineFlat = line.normalized.replace(/\s+/g, "");

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
  return hits.slice(0, limit);
}

// Worker Message Handler
self.onmessage = (e: MessageEvent) => {
  const { type, payload, queryId } = e.data;

  if (type === "INDEX_ALL") {
    clearAllIndexes();
    const songs: Song[] = payload.songs;
    for (const song of songs) {
      indexSong(song);
    }
    self.postMessage({ type: "INDEXED_COMPLETE", totalSongs: songsMap.size });
  } else if (type === "UPDATE_SONG") {
    const song: Song = payload.song;
    indexSong(song);
    self.postMessage({ type: "SONG_UPDATED", songId: song.id });
  } else if (type === "REMOVE_SONG") {
    const songId: number = payload.songId;
    songsMap.delete(songId);
    self.postMessage({ type: "SONG_REMOVED", songId });
  } else if (type === "SEARCH") {
    const t0 = performance.now();
    const hits = evaluateSearch(payload.query, payload.limit ?? 120);
    const searchMs = performance.now() - t0;
    self.postMessage({ type: "SEARCH_RESULTS", queryId, hits, searchMs });
  }
};
