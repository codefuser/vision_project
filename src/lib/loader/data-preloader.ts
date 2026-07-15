let preloadPromise: Promise<void> | null = null;

export function preloadAllData(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  preloadPromise = doPreload().catch(() => {});
  return preloadPromise;
}

async function doPreload(): Promise<void> {
  const { useBibleStore } = await import("@/lib/bible/store");
  const { useSongsStore } = await import("@/lib/songs/store");
  await Promise.allSettled([
    useBibleStore.getState().ensureBoth(),
    useSongsStore.getState().ensureLoaded(),
  ]);
}
