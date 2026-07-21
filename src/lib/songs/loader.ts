import { supabase } from "../supabase";
import { songStem, songLower } from "./normalize";
import { get, set } from "idb-keyval";

export interface RawSong {
  id: number;
  title: string;
  content: string;
  scale?: string;
  updated_at?: string;
}

export interface Song {
  id: number;
  title: string;
  content: string;
  scale: string;
  slides: string[];
  userCreated?: boolean;
  titleLower: string;
  contentLower: string;
  titleStem: string;
  contentStem: string;
  slideStems: string[];
  updatedAt?: string;
}

let cache: Song[] | null = null;
let userSongsRef: Song[] = [];
let inflight: Promise<Song[]> | null = null;

const SONGS_CACHE_KEY = "vision_songs_cache_v3";
const LAST_SYNC_KEY = "vision_songs_last_sync_timestamp";

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
  updated_at?: string;
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
    updatedAt: raw.updated_at,
  };
}

function buildFromRaw(r: RawSong): Song {
  return buildSong({
    id: r.id,
    title: r.title,
    content: r.content,
    scale: r.scale,
    updated_at: r.updated_at,
  });
}

/** Returns library songs + any user-created songs. */
export function getSongs(): Song[] | null {
  if (!cache) return null;
  if (!userSongsRef.length) return cache;
  const userIds = new Set(userSongsRef.map((u) => u.id));
  return [...userSongsRef, ...cache.filter((c) => !userIds.has(c.id))];
}

export function isSongsLoaded(): boolean {
  return !!cache;
}

export function setUserSongs(songs: Song[]) {
  userSongsRef = songs;
}

/**
 * Offline-First Song Loader:
 * Reads songs 100% from IndexedDB for instant startup.
 * Triggers lightweight delta background sync only if Supabase data changed.
 */
export async function loadSongs(): Promise<Song[]> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      // 1. Try IndexedDB first for 100% offline-first instant startup
      const cachedRaw = await get<RawSong[]>(SONGS_CACHE_KEY);
      if (cachedRaw && cachedRaw.length > 0) {
        cache = cachedRaw.map(buildFromRaw);
        inflight = null;
        console.log(`[Songs] Loaded ${cache.length} songs instantly from IndexedDB`);

        // Build candidate search index immediately
        import("./search").then(({ buildSearchIndex }) => {
          const combined = getSongs();
          if (combined) buildSearchIndex(combined);
        });

        // 2. Trigger lightweight background delta sync (0 downloads if unchanged)
        backgroundDeltaSync().catch((err) =>
          console.warn("[Songs] Delta sync check error:", err),
        );

        return cache;
      }

      // 3. Cold boot fallback: Download dataset once and store in IndexedDB
      const data = await fullFetchFromSupabase();
      inflight = null;
      return data;
    } catch (e) {
      inflight = null;
      throw e;
    }
  })();
  return inflight;
}

async function fullFetchFromSupabase(): Promise<Song[]> {
  console.log("[Songs] Initial dataset download from Supabase…");
  const allRows: RawSong[] = [];
  let start = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("songs")
      .select("id, title, content, scale, updated_at")
      .range(start, start + limit - 1);
    if (error) throw error;
    allRows.push(...(data as RawSong[]));
    if (data.length < limit) break;
    start += limit;
  }

  const latestTs = allRows.reduce((max, r) => {
    if (!r.updated_at) return max;
    return r.updated_at > max ? r.updated_at : max;
  }, "");

  await set(SONGS_CACHE_KEY, allRows);
  if (latestTs) await set(LAST_SYNC_KEY, latestTs);

  cache = allRows.map(buildFromRaw);

  import("./search").then(({ buildSearchIndex }) => {
    const combined = getSongs();
    if (combined) buildSearchIndex(combined);
  });

  console.log(`[Songs] Dataset stored in IndexedDB: ${cache.length} songs`);
  return cache;
}

/**
 * Lightweight Background Delta Sync:
 * Queries Supabase for latest timestamp. If up-to-date, downloads ZERO songs.
 * If modified, fetches only updated rows and merges incrementally.
 */
async function backgroundDeltaSync(): Promise<void> {
  const lastSync = await get<string>(LAST_SYNC_KEY);

  // Ask Supabase for the latest single updated_at timestamp
  const { data: latestRows, error: checkErr } = await supabase
    .from("songs")
    .select("updated_at")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (checkErr || !latestRows || !latestRows.length) return;

  const remoteLatest = latestRows[0]?.updated_at;
  if (!remoteLatest) return;

  // If local timestamp matches remote latest, 0 bytes downloaded!
  if (lastSync && remoteLatest <= lastSync) {
    console.log("[Songs] Cache is up to date — 0 bytes downloaded.");
    return;
  }

  console.log(`[Songs] Delta update detected (${remoteLatest} > ${lastSync}). Syncing delta…`);

  // Fetch ONLY changed rows since lastSync
  let query = supabase.from("songs").select("id, title, content, scale, updated_at");
  if (lastSync) {
    query = query.gt("updated_at", lastSync);
  }

  const { data: changedRows, error: fetchErr } = await query;
  if (fetchErr || !changedRows || !changedRows.length) return;

  // Merge changed rows into cached dataset
  const cachedRaw = (await get<RawSong[]>(SONGS_CACHE_KEY)) || [];
  const rawMap = new Map<number, RawSong>(cachedRaw.map((r) => [r.id, r]));

  for (const row of changedRows as RawSong[]) {
    rawMap.set(row.id, row);
  }

  const updatedRaw = Array.from(rawMap.values());
  await set(SONGS_CACHE_KEY, updatedRaw);
  await set(LAST_SYNC_KEY, remoteLatest);

  cache = updatedRaw.map(buildFromRaw);

  // Update search index incrementally
  import("./search").then(({ buildSearchIndex }) => {
    const combined = getSongs();
    if (combined) buildSearchIndex(combined);
  });

  console.log(`[Songs] Merged ${changedRows.length} changed songs into IndexedDB`);
}
