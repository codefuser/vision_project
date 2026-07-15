import {
  type ComponentType,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

/* ── Shared preload state (module-level, persists across route changes) ── */

let preloaded = false;
let preloadPromise: Promise<void> | null = null;
const pendingCallbacks: Array<() => void> = [];

export function ensurePreloaded() {
  if (!preloadPromise) {
    preloadPromise = Promise.all([
      import("./DeveloperHubPage"),
      import("./RoadmapPage"),
      import("./ContactPage"),
      import("./devhub-config"),
      import("./roadmap-data"),
    ]).then(() => {
      preloaded = true;
      const cbs = pendingCallbacks.slice();
      pendingCallbacks.length = 0;
      cbs.forEach((cb) => cb());
    });
  }
  return preloadPromise;
}

export function isPreloaded() {
  return preloaded;
}

export function onPreloaded(cb: () => void) {
  if (preloaded) {
    cb();
    return () => {};
  }
  pendingCallbacks.push(cb);
  return () => {
    const idx = pendingCallbacks.indexOf(cb);
    if (idx >= 0) pendingCallbacks.splice(idx, 1);
  };
}

/* ── Context to track first-load state ── */

const LoadedContext = createContext(false);

export function useIsDevHubLoaded() {
  return useContext(LoadedContext);
}

/* ── Full-screen blur loading overlay ── */

export function BlurLoadingOverlay({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/* ── Provider that loads everything once and wraps children ── */

export function DevHubProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(isPreloaded());
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (isPreloaded()) {
      setReady(true);
      return;
    }
    ensurePreloaded().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading Developer Hub…</p>
        </div>
      </div>
    );
  }

  return <LoadedContext.Provider value={true}>{children}</LoadedContext.Provider>;
}

/* ── Hook for route components to use the preloaded page ── */

export function useDevHubPage<T>(
  importFn: () => Promise<{ [key: string]: T }>,
  exportName: string,
): T | null {
  const [Comp, setComp] = useState<T | null>(null);

  const load = useCallback(() => {
    importFn().then((m) => setComp(() => m[exportName] as unknown as T));
  }, [importFn, exportName]);

  useEffect(() => {
    if (isPreloaded()) {
      load();
    } else {
      const unsub = onPreloaded(load);
      ensurePreloaded();
      return unsub;
    }
  }, [load]);

  return Comp;
}
