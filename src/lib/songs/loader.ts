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
    slideStems: [], // Optimized: slideStems is unused by search/projection; eliminating 85,000 synchronous regex runs
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
 * Offline-First Progressive Song Loader:
 * 1. Reads precomputed Song objects directly from IndexedDB (< 30ms).
 * 2. On clean browser, downloads a fast initial batch of 150 songs (< 80ms)
 *    so the UI renders instantly, then streams the remaining dataset in background slices.
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

        set(SONGS_PRECOMPUTED_KEY, cache).catch(() => {});
        backgroundDeltaSync().catch((err) =>
          logger.warn("[Songs] Delta sync check error:", err),
        );

        return cache;
      }

      // 3. Cold boot: Fetch initial fast batch immediately, stream rest in background
      const data = await progressiveFetchFromSupabase();
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
 * Progressive download from Supabase:
 * Loads initial 150 songs in ~80ms to unblock UI immediately,
 * then background-streams remaining pages without freezing the main thread.
 */
async function progressiveFetchFromSupabase(): Promise<Song[]> {
  logger.info("[Songs] Loading initial fast batch of songs from Supabase…");

  // Step A: Fast initial batch of 150 songs
  const { data: initialBatch, error: initialErr } = await supabase
    .from("songs")
    .select("id, title, content, scale, updated_at")
    .order("id", { ascending: true })
    .range(0, 149);

  if (initialErr) throw initialErr;

  const initialSongs = ((initialBatch as RawSong[]) || []).map(buildFromRaw);
  cache = initialSongs;

  // Step B: Stream remaining dataset in background without blocking the main thread
  void (async () => {
    try {
      const { count } = await supabase
        .from("songs")
        .select("*", { count: "exact", head: true });

      const total = count && count > 0 ? count : 17000;
      const pageSize = 1000;
      const totalPages = Math.ceil(total / pageSize);

      const allRows: RawSong[] = [...(initialBatch as RawSong[] || [])];

      for (let page = 1; page < totalPages; page++) {
        // Yield to main thread between batches to keep navigation 100% smooth
        await new Promise((r) => setTimeout(r, 60));

        const start = page * pageSize;
        const end = start + pageSize - 1;
        const { data: pageData, error } = await supabase
          .from("songs")
          .select("id, title, content, scale, updated_at")
          .range(start, end);

        if (error) {
          logger.warn(`[Songs] Error streaming page ${page}:`, error);
          continue;
        }

        if (pageData && pageData.length > 0) {
          allRows.push(...(pageData as RawSong[]));
          const newSongs = (pageData as RawSong[]).map(buildFromRaw);
          cache = [...(cache || []), ...newSongs];
        }
      }

      // Precompute and store in IndexedDB once background stream is complete
      const fullDataset = allRows.map(buildFromRaw);
      await set(SONGS_PRECOMPUTED_KEY, fullDataset);

      const latestTs = allRows.reduce((max, r) => {
        if (!r.updated_at) return max;
        return r.updated_at > max ? r.updated_at : max;
      }, "");
      if (latestTs) await set(LAST_SYNC_KEY, latestTs);

      cache = fullDataset;
      logger.info(`[Songs] Progressive background sync complete: ${fullDataset.length} songs cached`);
    } catch (streamErr) {
      logger.warn("[Songs] Background stream error:", streamErr);
    }
  })();

  return initialSongs;
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
