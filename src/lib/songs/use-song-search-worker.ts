import { useEffect, useRef, useCallback } from "react";
import type { Song } from "./loader";
import type { SongHitWorker } from "./song-search.worker";
import { searchSongs, buildSearchIndex, type SongHit } from "./search";

let globalWorker: Worker | null = null;
let queryCounter = 0;

function getSearchWorker(): Worker | null {
  if (typeof window === "undefined") return null;
  if (!globalWorker) {
    try {
      globalWorker = new Worker(new URL("./song-search.worker.ts", import.meta.url), {
        type: "module",
      });
    } catch {
      globalWorker = null;
    }
  }
  return globalWorker;
}

/**
 * Compute a lightweight fingerprint of the songs array for change detection.
 * Uses song count + sum of (id * content.length) — fast, no string allocation.
 */
function songFingerprint(songs: Song[]): string {
  let sum = 0;
  for (const s of songs) {
    sum += s.id + s.content.length;
  }
  return `${songs.length}:${sum}`;
}

export function updateWorkerSong(song: Song) {
  const w = getSearchWorker();
  if (w) {
    w.postMessage({ type: "UPDATE_SONG", payload: { song } });
  }
}

export function removeWorkerSong(songId: number) {
  const w = getSearchWorker();
  if (w) {
    w.postMessage({ type: "REMOVE_SONG", payload: { songId } });
  }
}

let isGlobalIndexed = false;

export function useSongSearchWorker(songs: Song[] | null) {
  const workerRef = useRef<Worker | null>(null);
  const isIndexedRef = useRef(isGlobalIndexed);
  /**
   * Track the fingerprint of the songs array most recently sent to the worker.
   * Only re-send INDEX_ALL when the actual content changes.
   */
  const indexedFingerprintRef = useRef<string>("");
  /**
   * ID of the most recent search request. Used to drop stale responses —
   * if a newer query fires before the worker replies, we ignore the old reply.
   */
  const latestQueryIdRef = useRef<number>(0);

  // Initialize Worker and index — only when songs content actually changes
  useEffect(() => {
    if (!songs || !songs.length) return;

    const fingerprint = songFingerprint(songs);
    // Guard: if we already indexed this exact dataset or worker is already globally indexed, skip INDEX_ALL
    if (fingerprint === indexedFingerprintRef.current || (isGlobalIndexed && indexedFingerprintRef.current)) {
      indexedFingerprintRef.current = fingerprint;
      return;
    }

    const worker = getSearchWorker();
    workerRef.current = worker;
    if (!worker) return;

    isIndexedRef.current = false;
    indexedFingerprintRef.current = fingerprint;

    worker.postMessage({
      type: "INDEX_ALL",
      payload: { songs },
    });

    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === "INDEXED_COMPLETE") {
        isIndexedRef.current = true;
        isGlobalIndexed = true;
      } else if (e.data.type === "INDEX_PROGRESS" && e.data.ready) {
        isIndexedRef.current = true;
      }
    };

    worker.addEventListener("message", handleMessage);
    return () => {
      worker.removeEventListener("message", handleMessage);
    };
  }, [songs]);

  // Execute Search via Worker with Main-Thread Fallback
  const executeSearch = useCallback(
    async (query: string, limit = 120): Promise<{ hits: SongHit[]; searchMs: number }> => {
      const q = query.trim();
      if (!q || !songs) return { hits: [], searchMs: 0 };

      const worker = workerRef.current;
      if (!worker || !isIndexedRef.current) {
        // Fallback to fast in-memory search if worker not ready
        const t0 = performance.now();
        const hits = searchSongs(q, songs, limit);
        return { hits, searchMs: performance.now() - t0 };
      }

      const queryId = ++queryCounter;
      latestQueryIdRef.current = queryId;

      return new Promise((resolve) => {
        const t0 = performance.now();

        const handleResult = (e: MessageEvent) => {
          if (e.data.type === "SEARCH_RESULTS" && e.data.queryId === queryId) {
            worker.removeEventListener("message", handleResult);

            // Drop stale responses — a newer query was issued while we awaited
            if (queryId !== latestQueryIdRef.current) return;

            const hits: SongHit[] = e.data.hits.map((h: SongHitWorker) => ({
              song: h.song,
              score: h.score,
              firstLine: h.firstLine,
              matchedLine: h.matchedLine,
              contextLines: h.contextLines,
              highlightTokens: h.highlightTokens,
            }));
            resolve({ hits, searchMs: e.data.searchMs || performance.now() - t0 });
          }
        };

        worker.addEventListener("message", handleResult);
        worker.postMessage({
          type: "SEARCH",
          queryId,
          payload: { query: q, limit },
        });
      });
    },
    [songs],
  );

  return { executeSearch, isIndexed: isIndexedRef.current };
}
