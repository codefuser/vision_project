import { useBibleStore } from "@/lib/bible/store";
import { useSongsStore } from "@/lib/songs/store";

let preloadPromise: Promise<void> | null = null;

export function preloadAllData(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  preloadPromise = Promise.all([
    useBibleStore.getState().ensureBoth(),
    useSongsStore.getState().ensureLoaded(),
  ]).then(() => undefined);
  return preloadPromise;
}
