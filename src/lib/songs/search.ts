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
}

export interface SongSearchData {
  firstLine: string;
  lines: LineEntry[];
  titleNorm: string;
  titleStem: string;
  titleLower: string;
}

let searchIndex = new Map<number, SongSearchData>();
let tokenInvertedIndex = new Map<string, Set<number>>();
let stemInvertedIndex = new Map<string, Set<number>>();
let indexedSongsId: string | null = null;

function songsId(songs: Song[]): string {
  return songs.map((s) => `${s.id}:${s.content.length}`).join(",");
}

function addIndexToken(map: Map<string, Set<number>>, token: string, songId: number) {
  if (!token || token.length < 2) return;
  let set = map.get(token);
  if (!set) {
    set = new Set<number>();
    map.set(token, set);
  }
  set.add(songId);
}

export function buildSearchIndex(songs: Song[]) {
  searchIndex.clear();
  tokenInvertedIndex.clear();
  stemInvertedIndex.clear();

  let totalLines = 0;

  for (const song of songs) {
    const lines: LineEntry[] = [];
    const titleNorm = tanglishNorm(song.title);
    const titleStem = song.titleStem || songStem(song.title);
    const titleLower = songLower(song.title);

    for (const t of titleNorm.split(/\s+/)) addIndexToken(tokenInvertedIndex, t, song.id);
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
      titleNorm,
      titleStem,
      titleLower,
    });
  }

  indexedSongsId = songsId(songs);
  console.log(
    `[Songs Search] Built Inverted Candidate Index: ${searchIndex.size} songs, ${totalLines} lines`,
  );
}

const queryCache = new Map<string, SongHit[]>();
const MAX_CACHE = 100;

export function searchSongs(query: string, songs: Song[], limit = 120): SongHit[] {
  const q = query.trim();
  if (!q) return [];

  const currentId = songsId(songs);
  if (!searchIndex.size || indexedSongsId !== currentId) {
    buildSearchIndex(songs);
  }

  const cached = queryCache.get(q);
  if (cached) return cached.slice(0, limit);

  const hits = runCandidateSearch(q, songs, limit);

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

  // Prefix matching on tokens if candidates < 10
  if (candidates.size < 10 && qTokens.length > 0) {
    for (const qt of qTokens) {
      if (qt.length < 3) continue;
      for (const [token, ids] of tokenInvertedIndex.entries()) {
        if (token.startsWith(qt) || qt.startsWith(token)) {
          for (const id of ids) candidates.add(id);
          if (candidates.size >= 50) break;
        }
      }
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

function runCandidateSearch(query: string, songs: Song[], limit: number): SongHit[] {
  const qn = normTokens(query);
  const qs = stemTokens(query);
  if (!qn.flat) return [];

  const rawQueryLower = query.toLowerCase().trim();
  const qRawTokens = query.trim().split(/\s+/).filter(Boolean);

  const candidateIds = getCandidateSongIds(qn.tokens, qs, songs);
  const songLookup = new Map(songs.map((s) => [s.id, s]));

  const hits: SongHit[] = [];

  for (const songId of candidateIds) {
    const song = songLookup.get(songId);
    if (!song) continue;
    const data = searchIndex.get(songId);
    if (!data) continue;

    // --- TITLE SCORING ---
    let titleScore = 0;
    const titleLower = data.titleLower;

    if (titleLower === rawQueryLower || data.titleNorm === qn.flat) {
      titleScore = 1000;
    } else if (titleLower.includes(rawQueryLower) || data.titleNorm.includes(qn.flat)) {
      titleScore = 750;
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

      if (lineFlat === qn.flat || line.text.toLowerCase() === rawQueryLower) {
        ls = 600;
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
