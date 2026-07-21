import { supabase } from "../supabase";
import { songStem, songLower } from "./normalize";

export interface RawSong {
  id: number;
  title: string;
  content: string;
  scale: string;
}

export interface Song {
  id: number;
  title: string;
  content: string;
  scale: string;
  /** Stanzas split on blank lines. */
  slides: string[];
  /** Marks a user-created song so we can edit / delete it. */
  userCreated?: boolean;
  // Search indexes — all pre-computed once on build:
  titleLower: string;
  contentLower: string;
  titleStem: string;
  contentStem: string;
  slideStems: string[];
}

let cache: Song[] | null = null;
let userSongsRef: Song[] = [];
let inflight: Promise<Song[]> | null = null;

export function buildSlides(content: string): string[] {
  return content
    .split(/\n\s*\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildSong(raw: {
  id: number;
  title: string;
  content: string;
  scale?: string;
  userCreated?: boolean;
}): Song {
  const title = (raw.title || "").trim();
  const content = (raw.content || "").trim();
  const slides = buildSlides(content);
  return {
    id: raw.id,
    title,
    content,
    scale: raw.scale ?? "",
    slides,
    userCreated: raw.userCreated,
    titleLower: songLower(title),
    contentLower: songLower(content),
    titleStem: songStem(title),
    contentStem: songStem(content),
    slideStems: slides.map(songStem),
  };
}

function buildFromRaw(r: RawSong): Song {
  return buildSong({ id: r.id, title: r.title, content: r.content, scale: r.scale });
}

/** Returns library songs + any user-created songs (user overrides win by id). */
export function getSongs(): Song[] | null {
  if (!cache) return null;
  if (!userSongsRef.length) return cache;
  const userIds = new Set(userSongsRef.map((u) => u.id));
  return [...userSongsRef, ...cache.filter((c) => !userIds.has(c.id))];
}

export function isSongsLoaded(): boolean {
  return !!cache;
}

/** Called by the songs store whenever the persisted user-songs list changes
 *  so subsequent searches include them without re-fetching the library. */
export function setUserSongs(songs: Song[]) {
  userSongsRef = songs;
}

import { get, set } from "idb-keyval";

const CACHE_KEY = "vision_songs_cache_v2";

export async function loadSongs(): Promise<Song[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  
  inflight = (async () => {
    try {
      // 1. Try IndexedDB first for instant load
      const cachedRaw = await get<RawSong[]>(CACHE_KEY);
      if (cachedRaw && cachedRaw.length > 0) {
        cache = cachedRaw.map(buildFromRaw);
        inflight = null;
        console.log(`[Songs] Loaded ${cache.length} songs from IndexedDB`);
        
        // 2. Background sync with Supabase
        syncSongsFromSupabase().catch((err) => console.error("Background sync failed:", err));
        
        return cache;
      }
      
      // 3. If no cache, block and load from Supabase
      const data = await syncSongsFromSupabase();
      inflight = null;
      return data;
    } catch (e) {
      inflight = null;
      throw e;
    }
  })();
  return inflight;
}

async function syncSongsFromSupabase(): Promise<Song[]> {
  const allRows: RawSong[] = [];
  let start = 0;
  const limit = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from("songs")
      .select("id, title, content, scale")
      .range(start, start + limit - 1);
    if (error) throw error;
    allRows.push(...(data as RawSong[]));
    if (data.length < limit) break;
    start += limit;
  }
  
  await set(CACHE_KEY, allRows);
  cache = allRows.map(buildFromRaw);
  
  // Rebuild the search index with the fresh data (including user overrides)
  import("./search").then(({ buildSearchIndex }) => {
    const combined = getSongs();
    if (combined) buildSearchIndex(combined);
  });
  
  console.log(`[Songs] Synced ${cache.length} songs from Supabase`);
  return cache;
}
