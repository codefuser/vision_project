import type { Song } from "./loader";
import { songLower, songStem } from "./normalize";

export interface SongHit {
  song: Song;
  score: number;
  slideIndex: number;
  matched: string[];
  matchedLine?: string;
}

const queryCache = new Map<string, SongHit[]>();
const MAX_CACHE = 50;

function cachedSearch(query: string, songs: Song[], limit: number): SongHit[] {
  const cached = queryCache.get(query);
  if (cached) return cached.slice(0, limit);

  const hits = runSearch(query, songs, limit);
  if (hits.length > 0) {
    if (queryCache.size >= MAX_CACHE) {
      const firstKey = queryCache.keys().next().value;
      if (firstKey !== undefined) queryCache.delete(firstKey);
    }
    queryCache.set(query, hits);
    return hits;
  }

  if (query.length < 20) {
    const fallback = typoToleranceFallback(query, songs, limit);
    if (fallback.length > 0) {
      if (queryCache.size >= MAX_CACHE) {
        const firstKey = queryCache.keys().next().value;
        if (firstKey !== undefined) queryCache.delete(firstKey);
      }
      queryCache.set(query, fallback);
    }
    return fallback;
  }

  return [];
}

export function searchSongs(query: string, songs: Song[], limit = 80): SongHit[] {
  const q = query.trim();
  if (!q) return [];
  return cachedSearch(q, songs, limit);
}

function typoToleranceFallback(query: string, songs: Song[], limit: number): SongHit[] {
  const tokens = query.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const variants = new Set<string>();
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.length < 3) continue;
    for (let j = 0; j < t.length; j++) {
      const trimmed = t.slice(0, j) + t.slice(j + 1);
      const v = [...tokens.slice(0, i), trimmed, ...tokens.slice(i + 1)].join(" ");
      variants.add(v);
    }
  }
  const seen = new Set<number>();
  const out: SongHit[] = [];
  for (const v of variants) {
    const h = runSearch(v, songs, limit);
    for (const x of h) {
      if (seen.has(x.song.id)) continue;
      seen.add(x.song.id);
      out.push({ ...x, score: x.score - 50 });
      if (out.length >= limit) break;
    }
    if (out.length >= limit) break;
  }
  return out;
}

function runSearch(query: string, songs: Song[], limit: number): SongHit[] {
  const q = query.trim();
  if (!q) return [];
  const qLower = songLower(q);
  const qStem = songStem(q);
  const rawTokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  const tokens = rawTokens
    .map((t) => ({
      raw: t,
      lower: songLower(t),
      stem: songStem(t),
    }))
    .filter((t) => t.stem.length >= 1 || t.lower.length >= 2);

  if (!tokens.length) return [];

  const hits: SongHit[] = [];
  for (let i = 0; i < songs.length; i++) {
    const s = songs[i];
    let titleHits = 0;
    let titleStemHits = 0;
    let contentHits = 0;
    let contentStemHits = 0;
    const matched: string[] = [];
    let allMatched = true;

    for (const tok of tokens) {
      let found = false;
      if (tok.lower && s.titleLower.includes(tok.lower)) {
        titleHits++;
        matched.push(tok.raw);
        found = true;
      } else if (tok.stem.length >= 2 && s.titleStem.includes(tok.stem)) {
        titleStemHits++;
        matched.push(tok.raw);
        found = true;
      } else if (tok.lower && s.contentLower.includes(tok.lower)) {
        contentHits++;
        matched.push(tok.raw);
        found = true;
      } else if (tok.stem.length >= 2 && s.contentStem.includes(tok.stem)) {
        contentStemHits++;
        matched.push(tok.raw);
        found = true;
      }
      if (!found) {
        allMatched = false;
        break;
      }
    }
    if (!allMatched) continue;

    let score = titleHits * 220 + titleStemHits * 140 + contentHits * 30 + contentStemHits * 18;
    if (qLower && s.titleLower.includes(qLower)) score += 320;
    if (qStem && s.titleStem.includes(qStem)) score += 80;
    if (qLower && s.contentLower.includes(qLower)) score += 90;
    score -= Math.min(40, Math.floor(s.content.length / 400));

    let bestSlide = 0,
      bestScore = -1,
      matchedLine: string | undefined = undefined;

    for (let j = 0; j < s.slides.length; j++) {
      const slide = s.slides[j];
      const sl = slide.toLowerCase();
      const st = s.slideStems[j] ?? "";
      let sc = 0;
      for (const tok of tokens) {
        if (tok.lower && sl.includes(tok.lower)) sc += 6;
        else if (tok.stem.length >= 2 && st.includes(tok.stem)) sc += 4;
      }
      if (qLower && sl.includes(qLower)) sc += 12;
      
      if (sc > bestScore) {
        bestScore = sc;
        bestSlide = j;
        
        if (sc > 0) {
          const lines = slide.split('\n');
          for (const line of lines) {
            const ll = line.toLowerCase();
            const lst = songStem(line);
            let lineMatches = false;
            for (const tok of tokens) {
              if ((tok.lower && ll.includes(tok.lower)) || (tok.stem.length >= 2 && lst.includes(tok.stem))) {
                lineMatches = true;
                break;
              }
            }
            if (qLower && ll.includes(qLower)) lineMatches = true;
            
            if (lineMatches && line.trim() !== s.title.trim()) {
              matchedLine = line.trim();
              break;
            }
          }
        }
      }
    }

    hits.push({ song: s, score, slideIndex: bestSlide, matched, matchedLine });
    if (hits.length >= limit) break;
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
