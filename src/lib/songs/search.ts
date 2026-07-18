import type { Song } from "./loader";
import { songLower, songStem } from "./normalize";

export type MatchType = string;

export interface PreviewSnippet {
  previousLine?: string;
  matchedLine: string;
  nextLine?: string;
  highlightTokens: string[];
}

export interface SongHit {
  song: Song;
  score: number;
  slideIndex: number;
  matchType: MatchType;
  snippet?: PreviewSnippet;
  // Backwards compatibility for UI during transition
  matchedLine?: string; 
  matched?: string[];
}

const queryCache = new Map<string, SongHit[]>();
const MAX_CACHE = 100;

/** Bounded Levenshtein on strings (useful for stems or short words) */
function lev(a: string, b: string, max: number): number {
  const al = a.length;
  const bl = b.length;
  if (Math.abs(al - bl) > max) return Infinity;
  let prev = new Array(bl + 1);
  let curr = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) prev[j] = j;
  for (let i = 1; i <= al; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return Infinity;
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }
  return prev[bl];
}

// ----------------------------------------------------
// INVERTED INDEX (Stage 5 execution)
// ----------------------------------------------------

interface TokenLocation {
  songId: number;
  slideIdx: number;
  lineIdx: number;
  matchType: MatchType;
  scoreWeight: number;
}

let cachedSongsRef: Song[] | null = null;
const invertedIndex = new Map<string, TokenLocation[]>();
const songMap = new Map<number, Song>();
let indexKeys: string[] = [];

function buildIndex(songs: Song[]) {
  if (cachedSongsRef === songs) return;
  invertedIndex.clear();
  songMap.clear();
  cachedSongsRef = songs;

  for (const song of songs) {
    songMap.set(song.id, song);
    
    const indexToken = (tokenStr: string, loc: TokenLocation) => {
      const stem = songStem(tokenStr);
      if (!stem || stem.length === 0) return;
      let list = invertedIndex.get(stem);
      if (!list) {
        list = [];
        invertedIndex.set(stem, list);
      }
      list.push(loc);
    };

    // 1. Index Title (Weight: 10000)
    const titleWords = song.title.split(/\s+/);
    for (const w of titleWords) {
      indexToken(w, { songId: song.id, slideIdx: 0, lineIdx: -1, matchType: "Title Exact", scoreWeight: 10000 });
    }

    // 2. Index Slides (Weight: Chorus 5000, Verse 3000)
    for (let slideIdx = 0; slideIdx < song.slides.length; slideIdx++) {
      const slideStr = song.slides[slideIdx];
      const slideLower = songLower(slideStr);
      
      let matchType = "Verse";
      if (slideLower.startsWith("chorus") || slideLower.includes("[chorus]")) {
        matchType = "Chorus";
      } else if (slideLower.startsWith("bridge") || slideLower.includes("[bridge]")) {
        matchType = "Bridge";
      } else {
        const verseMatch = slideLower.match(/verse\s*(\d+)/);
        if (verseMatch) {
          matchType = `Verse ${verseMatch[1]}`;
        }
      }
      
      const scoreWeight = matchType === "Chorus" ? 5000 : 3000;

      const lines = slideStr.split("\n");
      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const lineStr = lines[lineIdx];
        if (lineStr.trim() === song.title.trim()) continue; // skip inline titles

        const words = lineStr.split(/\s+/);
        for (const w of words) {
          indexToken(w, { songId: song.id, slideIdx, lineIdx, matchType, scoreWeight });
        }
      }
    }
  }
  indexKeys = Array.from(invertedIndex.keys());
}

export function searchSongs(query: string, songs: Song[], limit = 120): SongHit[] {
  const q = query.trim();
  if (!q) return [];
  
  buildIndex(songs);

  const cached = queryCache.get(q);
  if (cached) return cached.slice(0, limit);

  const hits = runSearch(q, limit);
  
  if (queryCache.size >= MAX_CACHE) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey !== undefined) queryCache.delete(firstKey);
  }
  queryCache.set(q, hits);
  
  return hits;
}

function runSearch(query: string, limit: number): SongHit[] {
  const qLower = songLower(query);
  
  // Stage 1 & 2: Normalization
  const rawTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const qTokens = rawTokens
    .map((t) => ({ raw: t, lower: songLower(t), stem: songStem(t) }))
    .filter((t) => t.stem.length >= 1 || t.lower.length >= 2);

  if (!qTokens.length) return [];

  // Track scores per song ID
  const songScores = new Map<number, { 
    score: number, 
    slideIdx: number, 
    lineIdx: number, 
    matchType: MatchType, 
    tokensMatched: Set<string> 
  }>();

  for (const qTok of qTokens) {
    // Find all index keys that match this query token
    const matchedKeys: string[] = [];
    
    // Stage 3 & 4: Exact, Prefix, or Bounded Levenshtein (Fuzzy)
    for (const key of indexKeys) {
      if (key === qTok.stem) {
        matchedKeys.push(key);
      } else if (qTok.stem.length >= 3 && key.startsWith(qTok.stem)) {
        matchedKeys.push(key);
      } else if (qTok.stem.length >= 4 && key.length >= 4) {
        // Fuzzy match on vocabulary (extremely fast since vocab is small)
        if (lev(qTok.stem, key, 1) <= 1) {
          matchedKeys.push(key);
        }
      }
    }

    // Accumulate scores for songs that contain these matched keys
    for (const key of matchedKeys) {
      const locations = invertedIndex.get(key);
      if (!locations) continue;
      
      const isFuzzy = key !== qTok.stem && !key.startsWith(qTok.stem);
      const fuzzyPenalty = isFuzzy ? 0.6 : 1.0;

      for (const loc of locations) {
        let current = songScores.get(loc.songId);
        if (!current) {
          current = { score: 0, slideIdx: loc.slideIdx, lineIdx: loc.lineIdx, matchType: loc.matchType, tokensMatched: new Set() };
          songScores.set(loc.songId, current);
        }
        
        if (!current.tokensMatched.has(qTok.stem)) {
          current.tokensMatched.add(qTok.stem);
          
          let addedScore = loc.scoreWeight * fuzzyPenalty;
          
          let mt = loc.matchType;
          if (mt === "Title Exact" && isFuzzy) mt = "Title Fuzzy";
          
          current.score += addedScore;
          
          // Keep highest priority match type and location
          const currentWeight = current.matchType.startsWith("Title") ? 10000 : current.matchType === "Chorus" ? 5000 : 0;
          if (loc.scoreWeight > currentWeight) {
             current.matchType = mt;
             current.slideIdx = loc.slideIdx;
             current.lineIdx = loc.lineIdx;
          }
        }
      }
    }
  }

  const hits: SongHit[] = [];

  for (const [songId, data] of songScores.entries()) {
    const song = songMap.get(songId);
    if (!song) continue;
    
    let finalScore = data.score;
    let mt = data.matchType;

    // Full String Exact Match Boost
    if (qLower && song.titleLower.includes(qLower)) {
      finalScore += 20000;
      mt = "Title Exact";
    }

    // Stage 7: Set Intersection - Must match at least half the query tokens
    if (data.tokensMatched.size < Math.ceil(qTokens.length / 2)) {
      continue; 
    }

    // Stage 9: Snippet Generation
    let snippet: PreviewSnippet | undefined = undefined;
    let matchedLineFallback: string | undefined = undefined;

    if (data.lineIdx >= 0) {
      const slide = song.slides[data.slideIdx];
      if (slide) {
        const lines = slide.split("\n").map(l => l.trim());
        const lIdx = data.lineIdx;
        matchedLineFallback = lines[lIdx] || "";
        snippet = {
          previousLine: lIdx > 0 ? lines[lIdx - 1] : undefined,
          matchedLine: matchedLineFallback,
          nextLine: lIdx < lines.length - 1 ? lines[lIdx + 1] : undefined,
          highlightTokens: qTokens.map(t => t.lower).filter(Boolean)
        };
      }
    } else {
      // It's a title match, grab first lyrics as context
      if (song.slides.length > 0) {
        const lines = song.slides[0].split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length > 0) {
          matchedLineFallback = lines[0];
          snippet = {
            previousLine: undefined,
            matchedLine: lines[0],
            nextLine: lines.length > 1 ? lines[1] : undefined,
            highlightTokens: qTokens.map(t => t.lower).filter(Boolean)
          };
        }
      }
    }

    hits.push({
      song,
      score: finalScore,
      slideIndex: data.slideIdx,
      matchType: mt,
      snippet,
      matchedLine: matchedLineFallback,
      matched: qTokens.map(t => t.raw)
    });
  }

  // Stage 8: Sort Results
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
