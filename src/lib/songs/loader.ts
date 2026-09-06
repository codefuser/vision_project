import { supabase } from "../supabase";
import { songStem, songLower } from "./normalize";
import { get, set } from "idb-keyval";
import { logger } from "@/lib/logger";

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

const SONGS_PRECOMPUTED_KEY = "vision_songs_precomputed_v4";
const SONGS_RAW_FALLBACK_KEY = "vision_songs_cache_v3";
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

export function buildFromRaw(r: RawSong): Song {
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
 * Reads precomputed Song objects directly from IndexedDB (< 30ms).
 * Zero re-stemming CPU penalty on refresh.
 * Triggers lightweight delta background sync only if Supabase data changed.
 */
export async function loadSongs(): Promise<Song[]> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      // 1. Try precomputed cache in IndexedDB for instant zero-CPU reload
      const precomputed = await get<Song[]>(SONGS_PRECOMPUTED_KEY);
      if (precomputed && precomputed.length > 0) {
        cache = precomputed;
        inflight = null;
        logger.info(`[Songs] Loaded ${cache.length} songs instantly from precomputed IndexedDB (<30ms)`);


        // Trigger lightweight background delta sync (0 downloads if unchanged)
        backgroundDeltaSync().catch((err) =>
          logger.warn("[Songs] Delta sync check error:", err),
        );

        return cache;
      }

      // 2. Fallback: check raw cache and upgrade it to precomputed
      const cachedRaw = await get<RawSong[]>(SONGS_RAW_FALLBACK_KEY);
      if (cachedRaw && cachedRaw.length > 0) {
        cache = cachedRaw.map(buildFromRaw);
        inflight = null;
        logger.info(`[Songs] Migrated ${cache.length} raw songs to precomputed cache`);

        // Save precomputed so future reloads are instant
        set(SONGS_PRECOMPUTED_KEY, cache).catch(() => {});


        backgroundDeltaSync().catch((err) =>
          logger.warn("[Songs] Delta sync check error:", err),
        );

        return cache;
      }

      // 3. Cold boot fallback: Fast parallel download from Supabase once
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

/**
 * Parallelized cold-boot download from Supabase.
 * Fetches batches of 6 concurrent requests instead of sequential round-trips.
 */
async function fullFetchFromSupabase(): Promise<Song[]> {
  logger.info("[Songs] Initial parallel dataset download from Supabase…");

  // First fetch total count to plan concurrent pages
  const { count } = await supabase
    .from("songs")
    .select("*", { count: "exact", head: true });

  const total = count && count > 0 ? count : 17000;
  const pageSize = 1000;
  const totalPages = Math.ceil(total / pageSize);
  const pageIndices = Array.from({ length: totalPages }, (_, i) => i);

  const allRows: RawSong[] = [];
  const CONCURRENCY = 6;

  // Process in concurrent batches
  for (let i = 0; i < pageIndices.length; i += CONCURRENCY) {
    const batch = pageIndices.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (page) => {
        const start = page * pageSize;
        const end = start + pageSize - 1;
        const { data, error } = await supabase
          .from("songs")
          .select("id, title, content, scale, updated_at")
          .range(start, end);
        if (error) throw error;
        return (data as RawSong[]) || [];
      }),
    );
    for (const rows of results) {
      allRows.push(...rows);
    }
  }

  const latestTs = allRows.reduce((max, r) => {
    if (!r.updated_at) return max;
    return r.updated_at > max ? r.updated_at : max;
  }, "");

  // Precompute search fields once during download
  const precomputed = allRows.map(buildFromRaw);

  await set(SONGS_PRECOMPUTED_KEY, precomputed);
  if (latestTs) await set(LAST_SYNC_KEY, latestTs);

  cache = precomputed;


  logger.info(`[Songs] Precomputed dataset stored in IndexedDB: ${precomputed.length} songs`);
  return precomputed;
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
    logger.info("[Songs] Cache is up to date — 0 bytes downloaded.");
    return;
  }

  logger.info(`[Songs] Delta update detected (${remoteLatest} > ${lastSync}). Syncing delta…`);

  // Fetch ONLY changed rows since lastSync
  let query = supabase.from("songs").select("id, title, content, scale, updated_at");
  if (lastSync) {
    query = query.gt("updated_at", lastSync);
  }

  const { data: changedRows, error: fetchErr } = await query;
  if (fetchErr || !changedRows || !changedRows.length) return;

  // Merge changed rows into precomputed dataset
  const precomputed = (await get<Song[]>(SONGS_PRECOMPUTED_KEY)) || cache || [];
  const songMap = new Map<number, Song>(precomputed.map((s) => [s.id, s]));

  for (const row of changedRows as RawSong[]) {
    songMap.set(row.id, buildFromRaw(row));
  }

  const updatedSongs = Array.from(songMap.values());
  await set(SONGS_PRECOMPUTED_KEY, updatedSongs);
  await set(LAST_SYNC_KEY, remoteLatest);

  cache = updatedSongs;


  logger.info(`[Songs] Merged ${changedRows.length} changed songs into precomputed IndexedDB`);
}
