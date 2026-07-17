import type { FolderRecord, MediaRecord, PlaylistRecord } from "@/db/schema";
import { setCachedFolders, setCachedMedia, setCachedPlaylists } from "@/db/cache";

let preloadPromise: Promise<void> | null = null;

export function preloadAllData(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  preloadPromise = doPreload().catch(() => {});
  return preloadPromise;
}

async function doPreload(): Promise<void> {
  const [{ useBibleStore }, { useSongsStore }] = await Promise.all([
    import("@/lib/bible/store"),
    import("@/lib/songs/store"),
  ]);
  await Promise.allSettled([
    useBibleStore.getState().ensureBoth(),
    useSongsStore.getState().ensureLoaded(),
  ]);
}

let backgroundPreloaded = false;

export function preloadAllPageData() {
  if (backgroundPreloaded) return;
  backgroundPreloaded = true;
  setTimeout(() => {
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
  }, 1000);
}
