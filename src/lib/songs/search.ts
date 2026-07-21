import type { Song } from "./loader";
import {
  songStem,
  tanglishNorm,
  songLower,
  editDist,
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
}

export interface SongSearchData {
  firstLine: string;
  lines: LineEntry[];
  titleNorm: string;
  titleStem: string;
  titleLower: string;
}

let searchIndex: Map<number, SongSearchData> | null = null;
let indexedSongsId: string | null = null;

function songsId(songs: Song[]): string {
  return songs.map((s) => `${s.id}:${s.content.length}`).join(",");
}

export function buildSearchIndex(songs: Song[]) {
  searchIndex = new Map();
  let totalLines = 0;

  for (const song of songs) {
    const lines: LineEntry[] = [];
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
    totalLines += lines.length;
    const firstLine = lines.length > 0 ? lines[0].text : song.title;
    searchIndex.set(song.id, {
      firstLine,
      lines,
      titleNorm: tanglishNorm(song.title),
      titleStem: song.titleStem,
      titleLower: songLower(song.title),
    });
  }
  indexedSongsId = songsId(songs);
  console.log(`[Songs] Indexed ${searchIndex.size} songs, ${totalLines} lines`);

  // Cache pre-computed index to IndexedDB asynchronously
  const serialized = Array.from(searchIndex.entries());
  void setCachedSearchIndex(indexedSongsId, serialized);
}

export function updateSearchIndex(song: Song) {
  if (!searchIndex) return;
  const lines: LineEntry[] = [];
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
  searchIndex.set(song.id, {
    firstLine,
    lines,
    titleNorm: tanglishNorm(song.title),
    titleStem: song.titleStem,
    titleLower: songLower(song.title),
  });
  queryCache.clear();
}

export function removeSearchIndex(songId: number) {
  if (!searchIndex) return;
  searchIndex.delete(songId);
  queryCache.clear();
}

export function markSearchIndexUpdated(songs: Song[]) {
  indexedSongsId = songsId(songs);
}

const queryCache = new Map<string, SongHit[]>();
const MAX_CACHE = 100;

export function searchSongs(query: string, songs: Song[], limit = 120): SongHit[] {
  const q = query.trim();
  if (!q) return [];

  const currentId = songsId(songs);
  if (!searchIndex || indexedSongsId !== currentId) {
    buildSearchIndex(songs);
  }

  const cached = queryCache.get(q);
  if (cached) return cached.slice(0, limit);

  const hits = runSearch(q, songs, limit);

  if (queryCache.size >= MAX_CACHE) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey !== undefined) queryCache.delete(firstKey);
  }
  queryCache.set(q, hits);

  return hits;
}

function normTokens(s: string): { tokens: string[]; flat: string } {
  const n = tanglishNorm(s);
  if (!n) return { tokens: [], flat: "" };
  return {
    tokens: n.split(/\s+/).filter((t) => t.length >= 2),
    flat: n.replace(/\s+/g, ""),
  };
}

function stemTokens(s: string): string[] {
  return songStem(s)
    .split(/\s+/)
    .filter((t) => t.length >= 2);
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

      // 3. Substring match for tokens of at least 4 chars
      if (lt.length >= 4 && qt.length >= 4 && (lt.includes(qt) || qt.includes(lt))) {
        if (1 < bestDist) {
          bestDist = 1;
          bestIdx = i;
          totalBonus += 25;
        }
      }

      // 4. Prefix match for 3+ chars
      if (lt.length >= 3 && qt.length >= 3 && (lt.startsWith(qt) || qt.startsWith(lt))) {
        if (1.5 < bestDist) {
          bestDist = 1.5;
          bestIdx = i;
          totalBonus += 20;
        }
      }

      // 5. Typo tolerance via Levenshtein or Trigram similarity
      if (Math.abs(lt.length - qt.length) <= 3) {
        const threshold = Math.min(3, Math.max(1, Math.floor(Math.max(lt.length, qt.length) * 0.4)));
        const d = editDist(lt, qt, threshold);
        if (d <= threshold && d < bestDist) {
          bestDist = d;
          bestIdx = i;
          totalBonus += 15;
        } else {
          const sim = trigramSimilarity(lt, qt);
          if (sim >= 0.6 && 2 < bestDist) {
            bestDist = 2;
            bestIdx = i;
            totalBonus += 10;
          }
        }
      }
    }
    if (bestIdx !== -1) indices.add(bestIdx);
  }

  return { indices: Array.from(indices), scoreBonus: totalBonus };
}

function runSearch(query: string, songs: Song[], limit: number): SongHit[] {
  const qn = normTokens(query);
  const qs = stemTokens(query);
  if (!qn.flat) return [];

  const rawQueryLower = query.toLowerCase().trim();
  const qRawTokens = query.trim().split(/\s+/).filter(Boolean);

  const hits: SongHit[] = [];

  for (const song of songs) {
    const data = searchIndex!.get(song.id);
    if (!data) continue;

    // --- TITLE SCORING ---
    let titleScore = 0;
    const titleLower = data.titleLower;

    if (titleLower === rawQueryLower || data.titleNorm === qn.flat) {
      titleScore = 1000; // Rank 1: Exact title match
    } else if (titleLower.includes(rawQueryLower) || data.titleNorm.includes(qn.flat)) {
      titleScore = 750; // Rank 2: Title contains query
    } else if (qn.tokens.length) {
      const tTokens = data.titleNorm.split(/\s+/).filter((t) => t.length >= 2);
      const { indices, scoreBonus } = getMatchIndices(tTokens, qn.tokens);
      if (indices.length > 0) {
        titleScore = (indices.length / qn.tokens.length) * 200 + scoreBonus;
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

      // Exact line match
      if (lineFlat === qn.flat || line.text.toLowerCase() === rawQueryLower) {
        ls = 600; // Rank 3: Exact lyric match
        indices = line.rawTokens.map((_, i) => i);
      } else if (lineFlat.includes(qn.flat)) {
        ls = 450;
        const res = getMatchIndices(line.normTokens, qn.tokens, line.stemTokens, qs);
        indices = res.indices;
      } else if (qn.flat.includes(lineFlat) && lineFlat.length >= 4) {
        ls = 350;
        const res = getMatchIndices(line.normTokens, qn.tokens, line.stemTokens, qs);
        indices = res.indices;
      } else if (qn.tokens.length) {
        const res = getMatchIndices(line.normTokens, qn.tokens, line.stemTokens, qs);
        indices = res.indices;
        if (indices.length > 0) {
          ls = (indices.length / qn.tokens.length) * 150 + res.scoreBonus;
        }
      }

      // Line Position Ranking Bonuses
      if (ls > 0) {
        if (li === 0) {
          ls += 250; // Rank 4: First line match bonus
        } else if (li === totalLines - 1) {
          ls += 100; // Rank 6: Last line match bonus
        } else {
          ls += 150; // Rank 5: Middle line / chorus match bonus
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

    if (totalScore > 0 && (titleScore >= 100 || bestLineScore >= 100)) {
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
        new Set([...qRawTokens, ...qn.tokens, ...bestHighlightTokens]),
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
