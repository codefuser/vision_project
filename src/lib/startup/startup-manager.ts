import { preloadAllData } from "@/lib/loader/data-preloader";
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

const MIN_DISPLAY_MS = 1800;

class StartupManager {
  private listeners = new Set<ProgressListener>();
  private _done = false;
  private _progress: StartupProgress = { percent: 0, message: "Starting…", done: false };

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
    const startTime = Date.now();
    const totalWeight = steps.reduce((s, st) => s + st.weight, 0);

    let accumulated = 0;
    for (const step of steps) {
      const pct = Math.round((accumulated / totalWeight) * 100);
      this.emit({ percent: Math.min(pct, 99), message: step.label, done: false });
      try {
        await step.run();
      } catch {
        // step-level errors never block startup
      }
      accumulated += step.weight;
    }

    this.emit({ percent: 100, message: "Ready", done: false });

    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_DISPLAY_MS) {
      await new Promise((r) => setTimeout(r, MIN_DISPLAY_MS - elapsed));
    }

    this._done = true;
    this.emit({ percent: 100, message: "Ready", done: true });
  }
}

export const startupManager = new StartupManager();

export function buildSteps(): StartupStep[] {
  return [
    {
      id: "db",
      label: "Initializing Database…",
      weight: 3,
      run: async () => {
        const { db } = await import("@/db/schema");
        db();
      },
    },
    {
      id: "settings",
      label: "Loading Settings…",
      weight: 4,
      run: async () => {
        const { useSettings } = await import("@/stores/settings.store");
        await useSettings.getState().load();
      },
    },
    {
      id: "shortcuts",
      label: "Initializing Keyboard Shortcuts…",
      weight: 3,
      run: async () => {
        const { shortcutManager } = await import("@/lib/shortcuts/manager");
        shortcutManager.install();
      },
    },
    {
      id: "projection",
      label: "Initializing Projection Engine…",
      weight: 5,
      run: async () => {
        const { useProjection } = await import("@/stores/projection.store");
        await useProjection.getState().init();
      },
    },
    {
      id: "bootstrap-engine",
      label: "Preparing Projection Engine…",
      weight: 4,
      run: async () => {
        const { projectionEngine } = await import("@/projection");
        projectionEngine.bootstrap();
      },
    },
    {
      id: "session-init",
      label: "Starting Service Session…",
      weight: 3,
      run: async () => {
        // Close any sessions that were left active from a previous page load
        await closeOrphanedSessions();
        // Create the new session for this browser session
        const session = await createSession();
        // Register the active session ID in the store
        useSessionHistory.getState().setActiveSessionId(session.id);
        // Wire up the auto-recorder
        sessionRecorder.start(session.id);
      },
    },
    {
      id: "songs",
      label: "Loading Songs…",
      weight: 10,
      run: async () => {
        await preloadAllData();
      },
    },
    {
      id: "bible",
      label: "Loading Bible…",
      weight: 10,
      run: async () => {
        // preloadAllData includes bible — already done above
      },
    },
    {
      id: "devhub",
      label: "Loading Developer Hub…",
      weight: 8,
      run: async () => {
        await ensurePreloaded();
      },
    },
    {
      id: "themes",
      label: "Preloading Theme Library…",
      weight: 6,
      run: async () => {
        const [{ TEMPLATE_PRESETS }, { themeCache }] = await Promise.all([
          import("@/lib/templates/presets"),
          import("@/features/workspace/theme-gallery/ThemeCache"),
        ]);
        themeCache.prewarm(TEMPLATE_PRESETS);
      },
    },
    {
      id: "library",
      label: "Preparing Media Library…",
      weight: 8,
      run: async () => {
        const { listFolders, listAllMedia } = await import("@/db/repo");
        await Promise.allSettled([listFolders(), listAllMedia()]);
      },
    },
    {
      id: "playlists",
      label: "Preparing Playlists…",
      weight: 5,
      run: async () => {
        const { listPlaylists } = await import("@/db/repo");
        await listPlaylists();
      },
    },
    {
      id: "ui",
      label: "Preloading Common UI…",
      weight: 8,
      run: async () => {
        await Promise.allSettled([
          import("@/components/FolderTree"),
          import("@/components/Dropzone"),
          import("@/components/Thumb"),
          import("@/components/RenameDialog"),
          import("@/components/MediaDeleteDialog"),
          import("@/components/MoveMediaDialog"),
        ]);
      },
    },
    {
      id: "pages",
      label: "Preloading Pages…",
      weight: 12,
      run: async () => {
        await Promise.allSettled([
          import("@/features/library/LibraryPage"),
          import("@/features/playlists/PlaylistsPage"),
          import("@/features/playlists/PlaylistEditor"),
          import("@/features/settings/SettingsPage"),
          import("@/features/devhub/DeveloperHubPage"),
          import("@/features/devhub/RoadmapPage"),
          import("@/features/devhub/ContactPage"),
          import("@/features/workspace/ProjectionWorkspace"),
          import("@/features/history/SessionListPage"),
        ]);
      },
    },
    {
      id: "finalize",
      label: "Finalizing Startup…",
      weight: 5,
      run: async () => {
        await new Promise((r) => setTimeout(r, 50));
      },
    },
  ];
}
