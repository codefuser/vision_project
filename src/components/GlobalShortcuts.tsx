import { useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { shortcutManager } from "@/lib/shortcuts/manager";
import { useShortcut } from "@/lib/shortcuts/use-shortcut";
import { useWorkspace, type WorkspaceTab } from "@/features/workspace/workspace.store";
import { useProjection } from "@/stores/projection.store";

/**
 * GlobalShortcuts — mounted once near the application root. Installs the
 * shortcut manager and registers every "always on" shortcut. Module-specific
 * shortcuts (Bible, Songs, Playlist Editor, etc.) register themselves from
 * inside their own components.
 *
 * Browser-reserved shortcuts avoided:
 *   Ctrl+R, Ctrl+L, Ctrl+T, Ctrl+W, Ctrl+N, Ctrl+P, Ctrl+F, Ctrl+Tab,
 *   Alt+Left, Alt+Right, F5, Ctrl+Shift+R, Ctrl+J, Ctrl+H, Ctrl+D,
 *   F11 (browser fullscreen — cannot be intercepted)
 */
export function GlobalShortcuts() {
  const navigate = useNavigate();
  const router = useRouter();
  const setActiveTab = useWorkspace((s) => s.setActiveTab);
  const sidebarCollapsed = useWorkspace((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useWorkspace((s) => s.setSidebarCollapsed);
  const togglePanel = useWorkspace((s) => s.togglePanel);
  const setGalleryOpen = useWorkspace((s) => s.setGalleryOpen);

  const projectorOpen = useProjection((s) => s.projectorOpen);
  const openProjector = useProjection((s) => s.openProjector);
  const closeProjector = useProjection((s) => s.closeProjector);
  const send = useProjection((s) => s.send);
  const state = useProjection((s) => s.state);

  useEffect(() => {
    shortcutManager.install();
    return () => shortcutManager.uninstall();
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // NAVIGATION — number row 1–4: workspace tabs (navigate to /project)
  // ─────────────────────────────────────────────────────────────────────
  const tabShortcut = (id: WorkspaceTab) => () => {
    setActiveTab(id);
    if (router.state.location.pathname !== "/project") {
      void navigate({ to: "/project" });
    }
  };
  useShortcut({
    id: "tab.media",
    label: "Open Media tab",
    category: "navigation",
    description: "Switch to the Media library tab",
    keys: ["1"],
    handler: tabShortcut("media"),
  });
  useShortcut({
    id: "tab.bible",
    label: "Open Bible tab",
    category: "navigation",
    description: "Switch to the Bible search tab",
    keys: ["2"],
    handler: tabShortcut("bible"),
  });
  useShortcut({
    id: "tab.songs",
    label: "Open Songs tab",
    category: "navigation",
    description: "Switch to the Songs tab",
    keys: ["3"],
    handler: tabShortcut("songs"),
  });
  useShortcut({
    id: "tab.text",
    label: "Open Text tab",
    category: "navigation",
    description: "Switch to the Text tab",
    keys: ["4"],
    handler: tabShortcut("text"),
  });

  // 5 → Theme Gallery (opens dialog, navigates to /project if needed)
  useShortcut({
    id: "tab.themes",
    label: "Open Theme Gallery",
    category: "navigation",
    description: "Open the Theme Gallery browser",
    keys: ["5"],
    handler: () => {
      const isProject = router.state.location.pathname === "/project";
      if (!isProject) {
        void navigate({ to: "/project" }).then(() => {
          setTimeout(() => setGalleryOpen(true), 150);
        });
      } else {
        setGalleryOpen(true);
      }
    },
  });

  // 6–0: page navigation
  useShortcut({
    id: "nav.playlists.num",
    label: "Go to Playlists",
    category: "navigation",
    description: "Navigate to the Playlists page",
    keys: ["6"],
    handler: () => void navigate({ to: "/playlists" }),
  });
  useShortcut({
    id: "nav.history.num",
    label: "Go to Service History",
    category: "navigation",
    description: "Navigate to the Service History page",
    keys: ["7"],
    handler: () => void navigate({ to: "/history" }),
  });
  useShortcut({
    id: "nav.settings.num",
    label: "Go to Settings",
    category: "navigation",
    description: "Navigate to the Settings page",
    keys: ["8"],
    handler: () => void navigate({ to: "/settings" }),
  });
  useShortcut({
    id: "nav.shortcuts.num",
    label: "Go to Shortcut Center",
    category: "navigation",
    description: "Navigate to the Keyboard Shortcut Center",
    keys: ["9"],
    handler: () => void navigate({ to: "/shortcuts" }),
  });
  useShortcut({
    id: "nav.library.num",
    label: "Go to Library",
    category: "navigation",
    description: "Navigate to the Media Library page",
    keys: ["0"],
    handler: () => void navigate({ to: "/library" }),
  });

  // ─────────────────────────────────────────────────────────────────────
  // SEARCH FOCUS — Alt+number: switch tab + focus its search input
  // ─────────────────────────────────────────────────────────────────────
  const focusSearch = (id: WorkspaceTab) => () => {
    setActiveTab(id);
    if (router.state.location.pathname !== "/project") {
      void navigate({ to: "/project" });
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("workspace:focus-search", { detail: { tab: id } }));
    }, 60);
  };
  useShortcut({
    id: "search.media",
    label: "Focus Media search",
    category: "navigation",
    description: "Switch to Media tab and focus the search box",
    keys: ["Alt+1"],
    handler: focusSearch("media"),
  });
  useShortcut({
    id: "search.bible",
    label: "Focus Bible search",
    category: "navigation",
    description: "Switch to Bible tab and focus the search box",
    keys: ["Alt+2"],
    handler: focusSearch("bible"),
  });
  useShortcut({
    id: "search.songs",
    label: "Focus Songs search",
    category: "navigation",
    description: "Switch to Songs tab and focus the search box",
    keys: ["Alt+3"],
    handler: focusSearch("songs"),
  });
  useShortcut({
    id: "search.text",
    label: "Focus Text search",
    category: "navigation",
    description: "Switch to Text tab and focus the search box",
    keys: ["Alt+4"],
    handler: focusSearch("text"),
  });

  // Alt+5 → open theme gallery + focus its search
  useShortcut({
    id: "search.themes",
    label: "Focus Theme search",
    category: "navigation",
    description: "Open Theme Gallery and focus the search box",
    keys: ["Alt+5"],
    handler: () => {
      const isProject = router.state.location.pathname === "/project";
      if (!isProject) {
        void navigate({ to: "/project" }).then(() => {
          setTimeout(() => {
            setGalleryOpen(true);
            setTimeout(() => window.dispatchEvent(new CustomEvent("theme-gallery:focus-search")), 150);
          }, 150);
        });
      } else {
        setGalleryOpen(true);
        setTimeout(() => window.dispatchEvent(new CustomEvent("theme-gallery:focus-search")), 150);
      }
    },
  });

  useShortcut({
    id: "search.playlists",
    label: "Go to Playlists page",
    category: "navigation",
    description: "Navigate to the Playlists page",
    keys: ["Alt+6"],
    handler: () => void navigate({ to: "/playlists" }),
  });
  useShortcut({
    id: "search.history",
    label: "Focus History search",
    category: "navigation",
    description: "Go to History page and focus search",
    keys: ["Alt+7"],
    handler: () => {
      void navigate({ to: "/history" });
      setTimeout(() => window.dispatchEvent(new CustomEvent("history:focus-search")), 100);
    },
  });
  useShortcut({
    id: "search.settings",
    label: "Focus Settings search",
    category: "navigation",
    description: "Go to Settings page and focus search",
    keys: ["Alt+8"],
    handler: () => {
      void navigate({ to: "/settings" });
      setTimeout(() => window.dispatchEvent(new CustomEvent("settings:focus-search")), 100);
    },
  });

  // ─────────────────────────────────────────────────────────────────────
  // SIDEBAR NAVIGATION — Alt+Letter routes
  // ─────────────────────────────────────────────────────────────────────
  const goTo = (to: string) => () => { void navigate({ to }); };
  useShortcut({
    id: "nav.library",
    label: "Go to Library",
    category: "navigation",
    description: "Navigate to the Media Library",
    keys: ["Alt+L"],
    handler: goTo("/library"),
  });
  useShortcut({
    id: "nav.playlists",
    label: "Go to Playlists",
    category: "navigation",
    description: "Navigate to Playlists",
    keys: ["Alt+Y"],
    handler: goTo("/playlists"),
  });
  useShortcut({
    id: "nav.history",
    label: "Go to Service History",
    category: "navigation",
    description: "Navigate to Service History",
    keys: ["Alt+H"],
    handler: goTo("/history"),
  });
  useShortcut({
    id: "nav.project",
    label: "Go to Project workspace",
    category: "navigation",
    description: "Navigate to the Projection workspace",
    keys: ["Alt+J"],
    handler: goTo("/project"),
  });
  useShortcut({
    id: "nav.settings",
    label: "Go to Settings",
    category: "navigation",
    description: "Navigate to Settings",
    keys: ["Alt+,"],
    handler: goTo("/settings"),
  });
  useShortcut({
    id: "nav.shortcuts",
    label: "Open Shortcut Center",
    category: "navigation",
    description: "Open the Keyboard Shortcut Center",
    keys: ["F1"],
    handler: goTo("/shortcuts"),
  });

  // ─────────────────────────────────────────────────────────────────────
  // WINDOW / LAYOUT
  // ─────────────────────────────────────────────────────────────────────
  useShortcut({
    id: "window.sidebar",
    label: "Toggle Sidebar",
    category: "window",
    description: "Collapse or expand the main navigation sidebar",
    keys: ["Alt+Shift+S"],
    handler: () => setSidebarCollapsed(!sidebarCollapsed),
    allowInInput: true,
  });
  useShortcut({
    id: "window.preview",
    label: "Toggle Preview Panel",
    category: "window",
    description: "Show or hide the Live Preview panel",
    keys: ["Alt+Shift+P"],
    handler: () => togglePanel("preview"),
    allowInInput: true,
  });
  useShortcut({
    id: "window.text-format",
    label: "Toggle Text Format Panel",
    category: "window",
    description: "Show or hide the Text Formatting panel",
    keys: ["Alt+Shift+T"],
    handler: () => togglePanel("textFormat"),
    allowInInput: true,
  });
  useShortcut({
    id: "window.tabs",
    label: "Toggle Workspace Tabs",
    category: "window",
    description: "Show or hide the right Workspace Tabs panel",
    keys: ["Alt+Shift+W"],
    handler: () => togglePanel("tabs"),
    allowInInput: true,
  });

  // Command Palette — Ctrl+Shift+Space (safe in all browsers on Windows)
  useShortcut({
    id: "window.command-palette",
    label: "Open Command Palette",
    category: "window",
    description: "Open the VS Code-style Command Palette (Ctrl+Shift+Space or Alt+K)",
    keys: ["Ctrl+Shift+Space", "Alt+K"],
    handler: () => {
      window.dispatchEvent(new CustomEvent("command-palette:open"));
    },
    allowInInput: true,
    priority: 100,
  });

  // ─────────────────────────────────────────────────────────────────────
  // PROJECTOR
  // ─────────────────────────────────────────────────────────────────────
  useShortcut({
    id: "projector.toggle",
    label: "Open / Close Projector",
    category: "projector",
    description: "Toggle the projector window open or closed",
    keys: ["F9"],
    handler: () => {
      if (projectorOpen) closeProjector();
      else void openProjector();
    },
  });
  useShortcut({
    id: "projector.stop",
    label: "Stop Projection",
    category: "projector",
    description: "Stop all projection (clear the projector screen)",
    keys: ["Escape"],
    handler: () => send({ type: "STOP" }),
  });
  useShortcut({
    id: "projector.clear",
    label: "Clear Screen (F10)",
    category: "projector",
    description: "Clear the projector screen immediately",
    keys: ["F10"],
    handler: () => send({ type: "STOP" }),
  });
  useShortcut({
    id: "projector.play-pause",
    label: "Play / Pause video",
    category: "projector",
    description: "Play or pause the currently loaded video",
    keys: ["Space"],
    handler: () => {
      if (!state) return;
      if (state.playing) send({ type: "PAUSE" });
      else send({ type: "PLAY" });
    },
  });
  useShortcut({
    id: "projector.next",
    label: "Next media",
    category: "media",
    description: "Advance to the next media item in the playlist",
    keys: ["ArrowRight"],
    handler: () => send({ type: "NEXT" }),
  });
  useShortcut({
    id: "projector.prev",
    label: "Previous media",
    category: "media",
    description: "Go back to the previous media item",
    keys: ["ArrowLeft"],
    handler: () => send({ type: "PREV" }),
  });
  useShortcut({
    id: "projector.black",
    label: "Toggle Black Screen",
    category: "projector",
    description: "Toggle the projector black/blank screen",
    keys: ["B"],
    handler: () => send({ type: "BLACK", value: !state?.black }),
  });
  useShortcut({
    id: "projector.mute",
    label: "Mute / Unmute",
    category: "projector",
    description: "Toggle audio mute on the projector",
    keys: ["M"],
    handler: () => send({ type: "MUTE", value: !state?.muted }),
  });
  useShortcut({
    id: "projector.loop",
    label: "Toggle Loop",
    category: "projector",
    description: "Toggle looping of the current media",
    keys: ["L"],
    handler: () => send({ type: "LOOP", value: !state?.loop }),
  });
  useShortcut({
    id: "projector.freeze",
    label: "Pause / Freeze Screen",
    category: "projector",
    description: "Pause the current media (freeze frame)",
    keys: ["Ctrl+Shift+F"],
    handler: () => {
      if (!state) return;
      if (state.playing) send({ type: "PAUSE" });
      else send({ type: "PLAY" });
    },
  });
  useShortcut({
    id: "projector.volume-up",
    label: "Volume Up",
    category: "projector",
    description: "Increase projector audio volume by 5%",
    keys: ["="],
    handler: () => {
      const next = Math.min(1, (state?.volume ?? 0.8) + 0.05);
      send({ type: "VOLUME", value: next });
    },
  });
  useShortcut({
    id: "projector.volume-down",
    label: "Volume Down",
    category: "projector",
    description: "Decrease projector audio volume by 5%",
    keys: ["-"],
    handler: () => {
      const next = Math.max(0, (state?.volume ?? 0.8) - 0.05);
      send({ type: "VOLUME", value: next });
    },
  });

  return null;
}
