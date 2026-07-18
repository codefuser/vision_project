import type { Song } from "./loader";
import { songStem, tanglishNorm } from "./normalize";

export interface SongHit {
  song: Song;
  score: number;
  firstLine: string;
  matchedLine: string;
  previousLine?: string;
  nextLine?: string;
  highlightTokens: string[];
}

interface LineEntry {
  text: string;
  normalized: string;
  normTokens: string[];
  stem: string;
  stemTokens: string[];
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
        const norm = tanglishNorm(text);
        lines.push({
          text,
          normalized: norm,
          normTokens: norm ? norm.split(/\s+/).filter(Boolean) : [],
          stem: songStem(text),
          stemTokens: songStem(text).split(/\s+/).filter(Boolean),
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

/** Fraction of query tokens (0–1) that have a close match in line's token array. */
function queryTokenCoverage(lineTokens: string[], qTokens: string[]): number {
  if (!qTokens.length) return 0;
  let matched = 0;
  for (const qt of qTokens) {
    for (const lt of lineTokens) {
      if (lt.includes(qt) || qt.includes(lt)) {
        matched++;
        break;
      }
      if (Math.abs(lt.length - qt.length) <= 3) {
        const threshold = Math.min(3, Math.max(lt.length, qt.length) * 0.4);
        if (editDist(lt, qt, threshold) <= threshold) {
          matched++;
          break;
        }
      }
    }
  }
  return matched / qTokens.length;
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
    if (data.titleNorm === qn.flat) titleScore = 200;
    else if (data.titleNorm.replace(/\s+/g, "").includes(qn.flat)) titleScore = 150;
    else if (qn.flat.includes(data.titleNorm.replace(/\s+/g, ""))) titleScore = 100;
    else if (qn.tokens.length) {
      const tNorm = data.titleNorm.replace(/\s+/g, "");
      const tTokens = data.titleNorm.split(/\s+/).filter((t) => t.length >= 2);
      titleScore = queryTokenCoverage(tTokens, qn.tokens) * 80;
    }

    if (titleScore === 0 && qs.length && data.titleStem) {
      const tStem = data.titleStem.split(/\s+/).filter((t) => t.length >= 2);
      titleScore = queryTokenCoverage(tStem, qs) * 40;
    }

    // --- line-level scoring ---
    let bestLine: LineEntry | null = null;
    let bestLineScore = 0;

    for (const line of data.lines) {
      let ls = 0;

      // Exact-substring match on flat (no-space) normalized strings
      if (line.normalized.replace(/\s+/g, "") === qn.flat) ls = 200;
      else if (line.normalized.replace(/\s+/g, "").includes(qn.flat)) ls = 160;
      else if (qn.flat.includes(line.normalized.replace(/\s+/g, ""))) ls = 120;
      else if (qn.tokens.length) {
        ls = queryTokenCoverage(line.normTokens, qn.tokens) * 100;
      }

      // Stem overlap bonus
      if (ls > 0 && qs.length && line.stemTokens.length) {
        ls += queryTokenCoverage(line.stemTokens, qs) * 30;
      }

      if (ls > bestLineScore) {
        bestLineScore = ls;
        bestLine = line;
      }
    }

    const total = titleScore + bestLineScore;

    if (total > 0 && (titleScore >= 30 || bestLineScore >= 40)) {
      let matchedText = data.firstLine;
      let prevText: string | undefined;
      let nextText: string | undefined;

      if (bestLine) {
        matchedText = bestLine.text;
        const idx = data.lines.indexOf(bestLine);
        if (idx > 0) {
          prevText = data.lines[idx - 1].text;
        }
        if (idx >= 0 && idx < data.lines.length - 1) {
          nextText = data.lines[idx + 1].text;
        }
      }

      hits.push({
        song,
        score: total,
        firstLine: data.firstLine,
        matchedLine: matchedText,
        previousLine: prevText,
        nextLine: nextText,
        highlightTokens: qn.tokens,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
