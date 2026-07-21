import { useEffect, useRef, useState, useCallback } from "react";
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

export function useSongSearchWorker(songs: Song[] | null) {
  const workerRef = useRef<Worker | null>(null);
  const [isIndexed, setIsIndexed] = useState(false);
  const pendingQueryRef = useRef<{ query: string; resolve: (hits: SongHit[]) => void } | null>(null);

  // Initialize Worker
  useEffect(() => {
    const worker = getSearchWorker();
    workerRef.current = worker;
    if (!worker || !songs || !songs.length) return;

    worker.postMessage({
      type: "INDEX_ALL",
      payload: { songs },
    });

    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === "INDEXED_COMPLETE") {
        setIsIndexed(true);
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
      if (!worker || !isIndexed) {
        // Fallback to fast in-memory search if worker not ready
        const t0 = performance.now();
        const hits = searchSongs(q, songs, limit);
        return { hits, searchMs: performance.now() - t0 };
      }

      return new Promise((resolve) => {
        const queryId = ++queryCounter;
        const t0 = performance.now();

        const handleResult = (e: MessageEvent) => {
          if (e.data.type === "SEARCH_RESULTS" && e.data.queryId === queryId) {
            worker.removeEventListener("message", handleResult);
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
    [songs, isIndexed],
  );

  return { executeSearch, isIndexed };
}
