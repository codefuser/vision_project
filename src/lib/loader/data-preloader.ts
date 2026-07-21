import type { FolderRecord, MediaRecord, PlaylistRecord } from "@/db/schema";
import { setCachedFolders, setCachedMedia, setCachedPlaylists } from "@/db/cache";
import { loadBible } from "@/lib/bible/loader";
import { loadSongs } from "@/lib/songs/loader";

let preloadPromise: Promise<void> | null = null;

export function preloadAllData(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  preloadPromise = doPreload().catch(() => {});
  return preloadPromise;
}

async function doPreload(): Promise<void> {
  // Pre-load Songs and both Bibles (EN + Tamil) into memory during application startup
  await Promise.allSettled([
    loadSongs(),
    loadBible("en"),
    loadBible("ta"),
  ]);

  // Pre-build search index for Songs
  const [{ getSongs }, { buildSearchIndex }] = await Promise.all([
    import("@/lib/songs/loader"),
    import("@/lib/songs/search"),
  ]);
  const songs = getSongs();
  if (songs) buildSearchIndex(songs);
}

let backgroundPreloaded = false;

export function preloadAllPageData() {
  if (backgroundPreloaded) return;
  backgroundPreloaded = true;
  import("@/db/repo").then(async ({ listFolders, listAllMedia, listPlaylists }) => {
    const [folders, media, playlists] = await Promise.all([
      listFolders().catch(() => [] as FolderRecord[]),
      listAllMedia().catch(() => [] as MediaRecord[]),
      listPlaylists().catch(() => [] as PlaylistRecord[]),
    ]);
    setCachedFolders(folders);
    setCachedMedia(media);
    setCachedPlaylists(playlists);
  });
}
