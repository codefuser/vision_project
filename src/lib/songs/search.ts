import type { Song } from "./loader";
import { songStem, tanglishNorm } from "./normalize";

export interface SongHit {
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
  firstLine: string;
  lines: LineEntry[];
  titleNorm: string;
  titleStem: string;
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
        const normTokens = [];
        const stemTokens = [];
        const validRawTokens = [];
        
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
    });
  }
  indexedSongsId = songsId(songs);
  console.log(`[Songs] Indexed ${searchIndex.size} songs, ${totalLines} lines`);
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
      const normTokens = [];
      const stemTokens = [];
      const validRawTokens = [];
      
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
  });
  queryCache.clear(); // invalidate cache since data changed
}

export function removeSearchIndex(songId: number) {
  if (!searchIndex) return;
  searchIndex.delete(songId);
  queryCache.clear();
}

export function markSearchIndexUpdated(songs: Song[]) {
  indexedSongsId = songsId(songs);
}

function editDist(a: string, b: string, maxDist: number): number {
  const an = a.length;
  const bn = b.length;
  if (Math.abs(an - bn) > maxDist) return maxDist + 1;
  if (an === 0) return bn;
  if (bn === 0) return an;
  let prev = new Int32Array(bn + 1);
  let curr = new Int32Array(bn + 1);
  for (let j = 0; j <= bn; j++) prev[j] = j;
  for (let i = 1; i <= an; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > maxDist) return maxDist + 1;
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }
  return prev[bn];
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

function getMatchIndices(lineTokens: string[], qTokens: string[]): number[] {
  if (!qTokens.length || !lineTokens.length) return [];
  const indices = new Set<number>();
  for (const qt of qTokens) {
    let bestDist = Infinity;
    let bestIdx = -1;
    for (let i = 0; i < lineTokens.length; i++) {
      const lt = lineTokens[i];
      if (lt === qt) { bestIdx = i; bestDist = 0; break; }
      if (lt.includes(qt) || qt.includes(lt)) {
        if (1 < bestDist) { bestDist = 1; bestIdx = i; }
      }
      if (Math.abs(lt.length - qt.length) <= 3) {
        const threshold = Math.min(3, Math.max(lt.length, qt.length) * 0.4);
        const d = editDist(lt, qt, threshold);
        if (d <= threshold && d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
    }
    if (bestIdx !== -1) indices.add(bestIdx);
  }
  return Array.from(indices);
}

function runSearch(query: string, songs: Song[], limit: number): SongHit[] {
  const qn = normTokens(query);
  const qs = stemTokens(query);
  if (!qn.flat) return [];

  const hits: SongHit[] = [];

  for (const song of songs) {
    const data = searchIndex!.get(song.id);
    if (!data) continue;

    // --- title score ---
    let titleScore = 0;
    if (data.titleNorm === qn.flat) titleScore = 300;
    else if (data.titleNorm.replace(/\s+/g, "").includes(qn.flat)) titleScore = 200;
    else if (qn.flat.includes(data.titleNorm.replace(/\s+/g, ""))) titleScore = 150;
    else if (qn.tokens.length) {
      const tTokens = data.titleNorm.split(/\s+/).filter((t) => t.length >= 2);
      const indices = getMatchIndices(tTokens, qn.tokens);
      titleScore = (indices.length / qn.tokens.length) * 80;
    }

    if (titleScore === 0 && qs.length && data.titleStem) {
      const tStem = data.titleStem.split(/\s+/).filter((t) => t.length >= 2);
      const indices = getMatchIndices(tStem, qs);
      titleScore = (indices.length / qs.length) * 40;
    }

    // --- line-level scoring ---
    let bestLine: LineEntry | null = null;
    let bestLineScore = 0;
    let bestHighlightTokens: string[] = [];

    for (const line of data.lines) {
      let ls = 0;
      let indices: number[] = [];

      // Exact-substring match on flat (no-space) normalized strings
      if (line.normalized.replace(/\s+/g, "") === qn.flat) {
        ls = 250;
        indices = line.rawTokens.map((_, i) => i);
      } else if (line.normalized.replace(/\s+/g, "").includes(qn.flat)) {
        ls = 160;
        indices = getMatchIndices(line.normTokens, qn.tokens);
      } else if (qn.flat.includes(line.normalized.replace(/\s+/g, ""))) {
        ls = 120;
        indices = getMatchIndices(line.normTokens, qn.tokens);
      } else if (qn.tokens.length) {
        indices = getMatchIndices(line.normTokens, qn.tokens);
        ls = (indices.length / qn.tokens.length) * 100;
      }

      // Stem overlap bonus
      if (ls > 0 && qs.length && line.stemTokens.length) {
        const stemIndices = getMatchIndices(line.stemTokens, qs);
        ls += (stemIndices.length / qs.length) * 30;
        for (const idx of stemIndices) if (!indices.includes(idx)) indices.push(idx);
      }

      if (ls > bestLineScore) {
        bestLineScore = ls;
        bestLine = line;
        bestHighlightTokens = indices.map((i) => line.rawTokens[i]).filter(Boolean);
      }
    }

    const total = titleScore + bestLineScore;

    if (total > 0 && (titleScore >= 30 || bestLineScore >= 40)) {
      let matchedText = data.firstLine;
      const contextLines: { text: string; isMatch: boolean }[] = [];

      if (bestLine) {
        matchedText = bestLine.text;
        const idx = data.lines.indexOf(bestLine);
        
        let startIdx = Math.max(0, idx - 1);
        let endIdx = Math.min(data.lines.length - 1, idx + 1);
        
        if (idx === 0) {
          endIdx = Math.min(data.lines.length - 1, 2); // Show first 3 lines
        } else if (idx === data.lines.length - 1) {
          startIdx = Math.max(0, data.lines.length - 3); // Show last 3 lines
        }
        
        for (let i = startIdx; i <= endIdx; i++) {
          contextLines.push({
            text: data.lines[i].text,
            isMatch: i === idx
          });
        }
      } else {
         contextLines.push({ text: data.firstLine, isMatch: true });
      }

      // Always pass the raw query tokens + matched Tamil words to the highlighter
      const finalHighlightTokens = Array.from(new Set([...qn.tokens, ...bestHighlightTokens]));

      hits.push({
        song,
        score: total,
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
