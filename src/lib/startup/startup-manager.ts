import { preloadAllData, preloadAllPageData } from "@/lib/loader/data-preloader";
import { ensurePreloaded } from "@/features/devhub/devhub-loader";
import { closeOrphanedSessions, createSession } from "@/features/history/session-history.repo";
import { sessionRecorder } from "@/features/history/session-recorder";
import { useSessionHistory } from "@/features/history/session-history.store";

export interface StartupProgress {
  percent: number;
  message: string;
  done: boolean;
}

export type ProgressListener = (p: StartupProgress) => void;

export interface StartupStep {
  id: string;
  label: string;
  weight: number;
  run: () => Promise<void>;
}

class StartupManager {
  private listeners = new Set<ProgressListener>();
  private _done = false;
  private _progress: StartupProgress = { percent: 0, message: "Preparing local cache…", done: false };

  subscribe(fn: ProgressListener): () => void {
    this.listeners.add(fn);
    fn(this._progress);
    return () => this.listeners.delete(fn);
  }

  get done() {
    return this._done;
  }

  get progress() {
    return this._progress;
  }

  private emit(p: StartupProgress) {
    this._progress = p;
    for (const l of this.listeners) l(p);
  }

  async execute(steps: StartupStep[]): Promise<void> {
    const totalWeight = steps.reduce((s, st) => s + st.weight, 0);

    let accumulated = 0;
    for (const step of steps) {
      const realRatio = (accumulated / totalWeight) * 100;
      const pct = Math.round(realRatio);
      this.emit({ percent: Math.min(pct, 99), message: step.label, done: false });
      try {
        await step.run();
      } catch {
        // step-level errors never block startup
      }
      accumulated += step.weight;
    }

    this.emit({ percent: 100, message: "Ready", done: false });
    this._done = true;
    this.emit({ percent: 100, message: "Ready", done: true });
  }
}

export const startupManager = new StartupManager();

export function buildSteps(): StartupStep[] {
  return [
    {
      id: "db",
      label: "Preparing local cache…",
      weight: 10,
      run: async () => {
        const { db } = await import("@/db/schema");
        db();
      },
    },
    {
      id: "settings",
      label: "Loading Settings…",
      weight: 10,
      run: async () => {
        const { useSettings } = await import("@/stores/settings.store");
        await useSettings.getState().load();
      },
    },
    {
      id: "songs",
      label: "Loading Song Library…",
      weight: 35,
      run: async () => {
        const { useSongsStore } = await import("@/lib/songs/store");
        await useSongsStore.getState().ensureLoaded();
      },
    },
    {
      id: "bible",
      label: "Loading Bible…",
      weight: 25,
      run: async () => {
        const { loadBible } = await import("@/lib/bible/loader");
        await Promise.all([loadBible("en"), loadBible("ta")]);
      },
    },
    {
      id: "projection",
      label: "Initializing Projection Engine…",
      weight: 10,
      run: async () => {
        const { useProjection } = await import("@/stores/projection.store");
        await useProjection.getState().init();
        const { projectionEngine } = await import("@/projection");
        projectionEngine.bootstrap();
      },
    },
    {
      id: "session-init",
      label: "Finalizing startup…",
      weight: 5,
      run: async () => {
        await closeOrphanedSessions().catch(() => {});
        const session = await createSession().catch(() => null);
        if (session) {
          useSessionHistory.getState().setActiveSessionId(session.id);
          sessionRecorder.start(session.id);
        }
        preloadAllPageData();
      },
    },
  ];
}
