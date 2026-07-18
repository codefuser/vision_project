import type { Song } from "./loader";
import { songLower, songStem } from "./normalize";

export interface SongHit {
  song: Song;
  score: number;
  matchType: string;
  firstLine: string;
  matchedLine: string;
  nextLine?: string;
  highlightTokens: string[];
}

interface LineEntry {
  text: string;
  normalized: string;
  stem: string;
  slideIndex: number;
}

interface SongSearchData {
  firstLine: string;
  lines: LineEntry[];
  titleLower: string;
  titleStem: string;
}

let searchIndex: Map<number, SongSearchData> | null = null;
let indexedSongsId: string | null = null;

function getSongsId(songs: Song[]): string {
  return songs.map((s) => `${s.id}:${s.content.length}`).join(",");
}

export function buildSearchIndex(songs: Song[]) {
  searchIndex = new Map();
  for (const song of songs) {
    const lines: LineEntry[] = [];
    for (let si = 0; si < song.slides.length; si++) {
      const slideLines = song.slides[si]
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      for (const text of slideLines) {
        lines.push({
          text,
          normalized: songLower(text),
          stem: songStem(text),
          slideIndex: si,
        });
      }
    }
    const firstLine = lines.length > 0 ? lines[0].text : song.title;
    searchIndex.set(song.id, {
      firstLine,
      lines,
      titleLower: song.titleLower,
      titleStem: song.titleStem,
    });
  }
  indexedSongsId = getSongsId(songs);
}

const queryCache = new Map<string, SongHit[]>();
const MAX_CACHE = 100;

export function searchSongs(query: string, songs: Song[], limit = 120): SongHit[] {
  const q = query.trim();
  if (!q) return [];

  const currentId = getSongsId(songs);
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

function runSearch(query: string, songs: Song[], limit: number): SongHit[] {
  const qLower = songLower(query);
  const qStem = songStem(query);
  if (!qLower) return [];

  const rawTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const qTokensLower = qLower.split(/\s+/).filter(Boolean);

  const hits: SongHit[] = [];

  for (const song of songs) {
    const data = searchIndex!.get(song.id);
    if (!data) continue;

    let score = 0;
    let matchType = "";
    let matchedLine: LineEntry | null = null;

    // Title matching (highest priority)
    if (song.titleLower === qLower) {
      score += 20000;
      matchType = "Title Exact";
    } else if (song.titleLower.startsWith(qLower)) {
      score += 15000;
      matchType = "Title Prefix";
    } else if (song.titleLower.includes(qLower)) {
      score += 10000;
      matchType = "Title Match";
    }

    if (score === 0 && qTokensLower.length > 0) {
      let matchedTokens = 0;
      for (const t of qTokensLower) {
        if (song.titleLower.includes(t)) matchedTokens++;
      }
      if (matchedTokens === qTokensLower.length) {
        score += 8000;
        matchType = "Title Words";
      }
    }

    // Line-level content matching
    let bestLine: LineEntry | null = null;
    let bestLineScore = 0;

    for (const line of data.lines) {
      let lineScore = 0;

      if (line.normalized.includes(qLower)) {
        lineScore += 5000;
      }

      if (qTokensLower.length > 0) {
        let matched = 0;
        for (const t of qTokensLower) {
          if (line.normalized.includes(t)) matched++;
        }
        lineScore += matched * 500;
      }

      if (lineScore > bestLineScore) {
        bestLineScore = lineScore;
        bestLine = line;
      }
    }

    if (bestLine && bestLineScore > 0) {
      score += bestLineScore;
      if (!matchType) matchType = "Lyrics Match";
      matchedLine = bestLine;
    }

    // Stem fallback (sound-alike)
    if (score === 0 && qStem.length >= 3) {
      if (data.titleStem.includes(qStem)) {
        score += 1000;
        matchType = "Title Sound-alike";
      } else {
        for (const line of data.lines) {
          if (line.stem.includes(qStem)) {
            score += 500;
            matchType = "Lyrics Sound-alike";
            matchedLine = line;
            break;
          }
        }
      }
    }

    if (score > 0) {
      let matchedText = data.firstLine;
      let nextText: string | undefined;

      if (matchedLine) {
        matchedText = matchedLine.text;
        const lineIdx = data.lines.indexOf(matchedLine);
        if (lineIdx >= 0 && lineIdx < data.lines.length - 1) {
          nextText = data.lines[lineIdx + 1].text;
        }
      }

      hits.push({
        song,
        score,
        matchType: matchType || "Match",
        firstLine: data.firstLine,
        matchedLine: matchedText,
        nextLine: nextText,
        highlightTokens: qTokensLower,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
