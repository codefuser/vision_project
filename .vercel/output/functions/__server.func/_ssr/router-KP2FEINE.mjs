import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useNavigate, e as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { Q as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { c as create, p as persist, a as createJSONStorage } from "../_libs/zustand.mjs";
import { D as Dexie } from "../_libs/dexie.mjs";
import { D as Dialog$1, a as DialogPortal$1, b as DialogContent$1, c as DialogClose, d as DialogTitle$1, e as DialogOverlay$1, f as DialogDescription$1 } from "../_libs/radix-ui__react-dialog.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { M as MonitorPlay, P as PanelLeftClose, F as FolderTree, L as ListVideo, K as Keyboard, a as Moon, S as Sun, b as Monitor, X, c as Star, C as ChevronLeft, d as ChevronRight, B as BookOpen, e as Music, I as Image, T as Type, f as Send, g as Settings } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const appCss = "/assets/styles-bo9ooaW2.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function normaliseKey(k) {
  const v = k.trim();
  const map = {
    space: " ",
    spacebar: " ",
    esc: "escape",
    del: "delete",
    return: "enter",
    left: "arrowleft",
    right: "arrowright",
    up: "arrowup",
    down: "arrowdown"
  };
  const lower = v.toLowerCase();
  return map[lower] ?? lower;
}
function parseCombo(combo) {
  const parts = combo.split("+").map((p) => p.trim());
  const out = {
    key: "",
    ctrl: false,
    meta: false,
    mod: false,
    alt: false,
    shift: false
  };
  for (const p of parts) {
    const lp = p.toLowerCase();
    if (lp === "ctrl" || lp === "control") out.ctrl = true;
    else if (lp === "meta" || lp === "cmd" || lp === "command" || lp === "win") out.meta = true;
    else if (lp === "mod") out.mod = true;
    else if (lp === "alt" || lp === "option") out.alt = true;
    else if (lp === "shift") out.shift = true;
    else out.key = normaliseKey(p);
  }
  return out;
}
function eventMatches(e, c) {
  if (normaliseKey(e.key) !== c.key) return false;
  if (c.alt !== e.altKey) return false;
  if (c.shift !== e.shiftKey) return false;
  if (c.mod) {
    if (!(e.ctrlKey || e.metaKey)) return false;
  } else {
    if (c.ctrl !== e.ctrlKey) return false;
    if (c.meta !== e.metaKey) return false;
  }
  return true;
}
function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}
class ShortcutManagerImpl {
  shortcuts = /* @__PURE__ */ new Map();
  parsed = /* @__PURE__ */ new Map();
  activeScopes = /* @__PURE__ */ new Set(["global", "workspace"]);
  installed = false;
  listeners = /* @__PURE__ */ new Set();
  snapshot = [];
  install() {
    if (this.installed || typeof window === "undefined") return;
    this.installed = true;
    window.addEventListener("keydown", this.onKey, { capture: true });
  }
  uninstall() {
    if (!this.installed || typeof window === "undefined") return;
    this.installed = false;
    window.removeEventListener("keydown", this.onKey, { capture: true });
  }
  register(def) {
    this.shortcuts.set(def.id, def);
    this.parsed.set(def.id, def.keys.map(parseCombo));
    this.refreshSnapshot();
    return () => this.unregister(def.id);
  }
  unregister(id) {
    this.shortcuts.delete(id);
    this.parsed.delete(id);
    this.refreshSnapshot();
  }
  list() {
    return this.snapshot;
  }
  setScopeActive(scope, active) {
    if (active) this.activeScopes.add(scope);
    else this.activeScopes.delete(scope);
  }
  isScopeActive(scope) {
    return this.activeScopes.has(scope);
  }
  subscribe(fn) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  refreshSnapshot() {
    this.snapshot = Array.from(this.shortcuts.values());
    for (const l of this.listeners) l();
  }
  onKey = (e) => {
    const typing = isTypingTarget(e.target);
    const ordered = this.list().sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    for (const def of ordered) {
      const scope = def.scope ?? "global";
      if (!this.activeScopes.has(scope)) continue;
      if (typing && !def.allowInInput) continue;
      const combos = this.parsed.get(def.id) ?? [];
      for (const c of combos) {
        if (eventMatches(e, c)) {
          const res = def.handler(e);
          if (res !== false) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
        }
      }
    }
  };
}
const shortcutManager = new ShortcutManagerImpl();
function formatCombo(combo) {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return combo.split("+").map((p) => {
    const lp = p.trim().toLowerCase();
    if (lp === "mod") return isMac ? "⌘" : "Ctrl";
    if (lp === "ctrl" || lp === "control") return isMac ? "⌃" : "Ctrl";
    if (lp === "meta" || lp === "cmd" || lp === "command") return isMac ? "⌘" : "Win";
    if (lp === "alt" || lp === "option") return isMac ? "⌥" : "Alt";
    if (lp === "shift") return isMac ? "⇧" : "Shift";
    if (lp === "space" || lp === " ") return "Space";
    if (lp === "arrowleft") return "←";
    if (lp === "arrowright") return "→";
    if (lp === "arrowup") return "↑";
    if (lp === "arrowdown") return "↓";
    if (lp === "escape" || lp === "esc") return "Esc";
    if (lp === "enter" || lp === "return") return "Enter";
    if (lp === "delete" || lp === "del") return "Del";
    return p.trim().length === 1 ? p.trim().toUpperCase() : p.trim();
  }).join(" + ");
}
function useShortcut(def) {
  const handlerRef = reactExports.useRef(def.handler);
  handlerRef.current = def.handler;
  reactExports.useEffect(() => {
    const unregister = shortcutManager.register({
      ...def,
      handler: (e) => handlerRef.current(e)
    });
    return unregister;
  }, [def.id, def.scope, def.allowInInput, def.priority, def.keys.join("|")]);
}
function useShortcutScope(scope, active = true) {
  reactExports.useEffect(() => {
    if (!active) return;
    shortcutManager.setScopeActive(scope, true);
    return () => shortcutManager.setScopeActive(scope, false);
  }, [scope, active]);
}
const EMPTY_SHORTCUTS = [];
function useRegisteredShortcuts() {
  return reactExports.useSyncExternalStore(
    (cb) => shortcutManager.subscribe(cb),
    () => shortcutManager.list(),
    () => EMPTY_SHORTCUTS
  );
}
const useWorkspace = create()(
  persist(
    (set) => ({
      activeTab: "songs",
      visible: { preview: true, textFormat: true, tabs: true },
      textFormatCollapsed: false,
      tabsCollapsed: false,
      setActiveTab: (t) => set({ activeTab: t }),
      togglePanel: (key) => set((s) => ({ visible: { ...s.visible, [key]: !s.visible[key] } })),
      showPanel: (key) => set((s) => ({ visible: { ...s.visible, [key]: true } })),
      setTextFormatCollapsed: (v) => set({ textFormatCollapsed: v }),
      toggleTextFormatCollapsed: () => set((s) => ({ textFormatCollapsed: !s.textFormatCollapsed })),
      setTabsCollapsed: (v) => set({ tabsCollapsed: v }),
      toggleTabsCollapsed: () => set((s) => ({ tabsCollapsed: !s.tabsCollapsed }))
    }),
    {
      name: "church-media-workspace",
      storage: createJSONStorage(() => localStorage),
      version: 4
    }
  )
);
const DEFAULT_TEXT_STYLE = {
  fontFamily: "Inter",
  fontSizeVw: 5.2,
  fontWeight: 500,
  italic: false,
  underline: false,
  color: "#ffffff",
  textOpacity: 1,
  shadow: true,
  shadowColor: "#000000",
  shadowBlur: 20,
  outlineWidth: 0,
  outlineColor: "#000000",
  background: "#000000",
  bgOpacity: 1,
  align: "center",
  vAlign: "middle",
  lineHeight: 1.25,
  letterSpacing: 0,
  paddingVw: 6
};
const DEFAULT_REFERENCE_STYLE = {
  ...DEFAULT_TEXT_STYLE,
  fontSizeVw: 2.4,
  fontWeight: 600,
  letterSpacing: 2,
  paddingVw: 4,
  vAlign: "top",
  visible: true
};
const DEFAULT_TAMIL_STYLE = {
  ...DEFAULT_TEXT_STYLE,
  fontFamily: "Latha",
  fontSizeVw: 5,
  visible: true
};
const DEFAULT_ENGLISH_STYLE = {
  ...DEFAULT_TEXT_STYLE,
  visible: true
};
const DEFAULT_BACKGROUND = {
  kind: "color",
  color: "#000000",
  mediaId: null,
  fit: "cover",
  opacity: 1,
  blur: 0,
  brightness: 1,
  contrast: 1,
  zoom: 1,
  positionX: 50,
  positionY: 50,
  overlayColor: "#000000",
  overlayOpacity: 0,
  videoLoop: true,
  videoMuted: true,
  videoSpeed: 1
};
const DEFAULT_GROUPED_STYLES = {
  reference: DEFAULT_REFERENCE_STYLE,
  tamil: DEFAULT_TAMIL_STYLE,
  english: DEFAULT_ENGLISH_STYLE,
  background: DEFAULT_BACKGROUND
};
const CHANNEL = "church-projection";
function getChannel() {
  return new BroadcastChannel(CHANNEL);
}
const DEFAULT_SETTINGS = {
  theme: "dark",
  defaultImageDurationMs: 5e3,
  defaultTransition: "fade",
  defaultLoopMode: "none",
  defaultVolume: 0.8,
  autoplayVideo: true,
  muteOnStart: false,
  language: "en"
};
class ChurchMediaDB extends Dexie {
  folders;
  media;
  blobs;
  playlists;
  settings;
  logs;
  constructor() {
    super("church-media-db");
    this.version(1).stores({
      folders: "id, parentId, name, updatedAt",
      media: "id, folderId, type, name, createdAt, lastUsedAt, updatedAt",
      blobs: "id, kind",
      playlists: "id, name, updatedAt",
      settings: "key",
      logs: "++id, ts, level"
    });
  }
}
let _db = null;
function db() {
  if (typeof window === "undefined") {
    throw new Error("DB is browser-only");
  }
  if (!_db) _db = new ChurchMediaDB();
  return _db;
}
const MAX_LOGS = 1e3;
async function write(level, message, ctx) {
  if (typeof window === "undefined") return;
  try {
    const ctxStr = ctx instanceof Error ? `${ctx.message}
${ctx.stack ?? ""}` : ctx ? JSON.stringify(ctx) : void 0;
    await db().logs.add({ level, message, ctx: ctxStr, ts: Date.now() });
    const count = await db().logs.count();
    if (count > MAX_LOGS) {
      const excess = count - MAX_LOGS;
      const oldest = await db().logs.orderBy("ts").limit(excess).primaryKeys();
      await db().logs.bulkDelete(oldest);
    }
  } catch {
  }
}
const logger = {
  info: (msg, ctx) => {
    console.info("[church-media]", msg, ctx ?? "");
    void write("info", msg, ctx);
  },
  warn: (msg, ctx) => {
    console.warn("[church-media]", msg, ctx ?? "");
    void write("warn", msg, ctx);
  },
  error: (msg, ctx) => {
    console.error("[church-media]", msg, ctx ?? "");
    void write("error", msg, ctx);
  }
};
function hasScreenDetailsApi() {
  return typeof window !== "undefined" && typeof window.getScreenDetails === "function";
}
function toInfo(s, index) {
  return {
    id: `${s.label || "screen"}-${index}-${s.left}x${s.top}`,
    label: s.label || (s.isPrimary ? "Primary Display" : `Display ${index + 1}`),
    left: s.left,
    top: s.top,
    width: s.width,
    height: s.height,
    availLeft: s.availLeft,
    availTop: s.availTop,
    availWidth: s.availWidth,
    availHeight: s.availHeight,
    isPrimary: !!s.isPrimary,
    isInternal: !!s.isInternal,
    devicePixelRatio: s.devicePixelRatio || 1
  };
}
async function queryWindowManagementPermission() {
  if (typeof navigator === "undefined" || !navigator.permissions) return "unknown";
  try {
    const names = [
      "window-management",
      "window-placement"
    ];
    for (const name of names) {
      try {
        const status = await navigator.permissions.query({ name });
        return status.state;
      } catch {
      }
    }
  } catch (e) {
    logger.warn("permissions.query window-management failed", e);
  }
  return "unknown";
}
let cachedDetails = null;
async function requestScreenDetails() {
  if (!hasScreenDetailsApi()) return null;
  if (cachedDetails) return cachedDetails;
  try {
    const fn = window.getScreenDetails;
    cachedDetails = await fn.call(window);
    logger.info("Window Management permission granted", {
      screens: cachedDetails?.screens?.length ?? 0
    });
    return cachedDetails;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    logger.warn("getScreenDetails() rejected", msg);
    return null;
  }
}
async function getDisplayDiagnostics() {
  const supported = hasScreenDetailsApi();
  const permission = await queryWindowManagementPermission();
  const warnings = [];
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  if (!supported) {
    warnings.push(
      "This browser does not expose multi-screen details. Use Chrome, Edge, or Opera (v100+) for full projector support."
    );
    const w = typeof window !== "undefined" ? window : null;
    const single = w ? {
      id: "primary",
      label: "Primary Display",
      left: 0,
      top: 0,
      width: w.screen.width,
      height: w.screen.height,
      availLeft: 0,
      availTop: 0,
      availWidth: w.screen.availWidth,
      availHeight: w.screen.availHeight,
      isPrimary: true,
      isInternal: true,
      devicePixelRatio: w.devicePixelRatio || 1
    } : null;
    return {
      supported,
      permission,
      screenCount: single ? 1 : 0,
      primary: single,
      secondaries: [],
      all: single ? [single] : [],
      userAgent,
      warnings
    };
  }
  const details = cachedDetails;
  if (!details) {
    warnings.push(
      'Permission not yet granted. Click "Detect Displays" to enable multi-screen detection.'
    );
    return {
      supported,
      permission,
      screenCount: 0,
      primary: null,
      secondaries: [],
      all: [],
      userAgent,
      warnings
    };
  }
  const all = details.screens.map(toInfo);
  const primary = all.find((s) => s.isPrimary) ?? all[0] ?? null;
  const secondaries = all.filter((s) => !s.isPrimary);
  if (all.length === 1) {
    warnings.push(
      "Only one display detected. If a TV/projector is connected via HDMI, switch Windows to Extend mode (Win+P → Extend) — Duplicate mode hides the second screen from the browser."
    );
  }
  return {
    supported,
    permission,
    screenCount: all.length,
    primary,
    secondaries,
    all,
    userAgent,
    warnings
  };
}
function pickProjectorScreen(diag, preferredId) {
  if (preferredId) {
    const match = diag.all.find((s) => s.id === preferredId);
    if (match) return match;
  }
  const external = diag.secondaries.find((s) => !s.isInternal);
  if (external) return external;
  if (diag.secondaries[0]) return diag.secondaries[0];
  return diag.primary;
}
function buildPopupFeatures(screen) {
  if (!screen) return "popup=yes,width=1280,height=720";
  return [
    "popup=yes",
    `left=${Math.round(screen.availLeft)}`,
    `top=${Math.round(screen.availTop)}`,
    `width=${Math.round(screen.availWidth)}`,
    `height=${Math.round(screen.availHeight)}`
  ].join(",");
}
function moveWindowToScreen(win, screen) {
  if (!win || win.closed || !screen) return false;
  try {
    win.moveTo(screen.availLeft, screen.availTop);
    win.resizeTo(screen.availWidth, screen.availHeight);
    return true;
  } catch (e) {
    logger.warn("moveWindowToScreen failed", e);
    return false;
  }
}
const PREFERRED_SCREEN_KEY = "projector.preferredScreenId";
const useProjection = create((set, get) => ({
  projectorOpen: false,
  windowRef: null,
  channel: null,
  state: null,
  lastScreen: null,
  init: () => {
    if (get().channel) return;
    const ch = getChannel();
    ch.onmessage = (ev) => {
      const data = ev.data;
      if (data?.type === "STATE") set({ state: data });
      if (data?.type === "PROJECTOR_OPEN") set({ projectorOpen: true });
      if (data?.type === "PROJECTOR_CLOSED")
        set({ projectorOpen: false, windowRef: null, state: null });
    };
    set({ channel: ch });
  },
  openProjector: async (preferredScreenId) => {
    const existing = get().windowRef;
    if (existing && !existing.closed) {
      existing.focus();
      return { ok: true, window: existing, screen: get().lastScreen, reason: "already-open" };
    }
    const preferred = preferredScreenId ?? (typeof localStorage !== "undefined" ? localStorage.getItem(PREFERRED_SCREEN_KEY) : null);
    let targetScreen = null;
    try {
      await requestScreenDetails();
    } catch (e) {
      logger.warn("requestScreenDetails threw", e);
    }
    const diag = await getDisplayDiagnostics();
    logger.info("openProjector: display diagnostics", {
      supported: diag.supported,
      permission: diag.permission,
      screens: diag.screenCount,
      warnings: diag.warnings
    });
    targetScreen = pickProjectorScreen(diag, preferred);
    const features = buildPopupFeatures(targetScreen);
    const w = window.open("/project", "church-projector", features);
    if (!w) {
      logger.error("Projector popup blocked by browser");
      return {
        ok: false,
        window: null,
        screen: targetScreen,
        reason: "popup-blocked",
        message: "Popup blocked. Allow popups for this site and try again."
      };
    }
    set({ windowRef: w, projectorOpen: true, lastScreen: targetScreen });
    logger.info("Projector opened", {
      screen: targetScreen?.label,
      isPrimary: targetScreen?.isPrimary,
      size: targetScreen ? `${targetScreen.availWidth}x${targetScreen.availHeight}` : "default"
    });
    if (targetScreen && !targetScreen.isPrimary) {
      setTimeout(() => moveWindowToScreen(w, targetScreen), 250);
    }
    const timer = setInterval(() => {
      if (w.closed) {
        clearInterval(timer);
        set({ projectorOpen: false, windowRef: null, state: null });
        logger.info("Projector window closed");
      }
    }, 500);
    return { ok: true, window: w, screen: targetScreen };
  },
  closeProjector: () => {
    get().windowRef?.close();
    set({ projectorOpen: false, windowRef: null, state: null });
  },
  send: (cmd) => {
    const cur = get().state;
    if (cur) {
      let next = cur;
      switch (cmd.type) {
        case "LOAD_TEXT":
          next = {
            ...cur,
            mode: "text",
            currentMediaId: null,
            index: 0,
            total: 0,
            playing: false,
            black: false,
            textOverlay: cmd.overlay,
            textStyle: cmd.style ?? cur.textStyle,
            groupedStyles: cmd.styles ?? cur.groupedStyles
          };
          break;
        case "UPDATE_TEXT_STYLE":
          next = { ...cur, textStyle: cmd.style };
          break;
        case "UPDATE_STYLES":
          next = { ...cur, groupedStyles: cmd.styles };
          break;
        case "UPDATE_BACKGROUND":
          next = {
            ...cur,
            groupedStyles: {
              ...cur.groupedStyles ?? DEFAULT_GROUPED_STYLES,
              background: cmd.background
            }
          };
          break;
        case "UPDATE_LOGO":
          next = { ...cur, logo: cmd.logo };
          break;
        case "PLAY":
          next = { ...cur, playing: true };
          break;
        case "PAUSE":
          next = { ...cur, playing: false };
          break;
        case "STOP":
          next = {
            ...cur,
            playing: false,
            mode: "idle",
            currentMediaId: null,
            index: 0,
            total: 0,
            textOverlay: null
          };
          break;
        case "BLACK":
          next = { ...cur, black: cmd.value };
          break;
        case "MUTE":
          next = { ...cur, muted: cmd.value };
          break;
        case "VOLUME":
          next = { ...cur, volume: cmd.value };
          break;
        case "RATE":
          next = { ...cur, playbackRate: cmd.value };
          break;
        case "LOOP":
          next = { ...cur, loop: cmd.value };
          break;
      }
      if (next !== cur) set({ state: next });
    }
    get().channel?.postMessage(cmd);
  }
}));
class ProjectionEventBus {
  byType = /* @__PURE__ */ new Map();
  any = /* @__PURE__ */ new Set();
  on(type, listener) {
    const wrapped = listener;
    let set = this.byType.get(type);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      this.byType.set(type, set);
    }
    set.add(wrapped);
    return () => {
      set.delete(wrapped);
    };
  }
  onAny(listener) {
    this.any.add(listener);
    return () => {
      this.any.delete(listener);
    };
  }
  emit(event) {
    const set = this.byType.get(event.type);
    if (set) {
      for (const fn of set) {
        try {
          fn(event);
        } catch (err) {
          console.error("[projection] listener error for", event.type, err);
        }
      }
    }
    for (const fn of this.any) {
      try {
        fn(event);
      } catch (err) {
        console.error("[projection] anyListener error for", event.type, err);
      }
    }
  }
  clear() {
    this.byType.clear();
    this.any.clear();
  }
}
const projectionEvents = new ProjectionEventBus();
function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
const MAX_ENTRIES = 200;
class HistoryBuffer {
  entries = [];
  listeners = /* @__PURE__ */ new Set();
  append(content) {
    const entry = {
      id: uid(),
      contentId: content.id,
      type: content.type,
      title: content.title,
      sourceModule: content.source.module,
      projectedAt: Date.now()
    };
    const last = this.entries[0];
    if (last && last.contentId === entry.contentId && entry.projectedAt - last.projectedAt < 1500) {
      return last;
    }
    this.entries = [entry, ...this.entries].slice(0, MAX_ENTRIES);
    projectionEvents.emit({ type: "HISTORY_APPENDED", entry });
    this.notify();
    return entry;
  }
  list() {
    return this.entries;
  }
  clear() {
    if (!this.entries.length) return;
    this.entries = [];
    this.notify();
  }
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  notify() {
    for (const fn of this.listeners) {
      try {
        fn(this.entries);
      } catch (err) {
        console.error("[history] subscriber error", err);
      }
    }
  }
}
const projectionHistory = new HistoryBuffer();
const cache$2 = /* @__PURE__ */ new Map();
function acquireUrl(key, blob) {
  const existing = cache$2.get(key);
  if (existing) {
    existing.refs += 1;
    return existing.url;
  }
  const url2 = URL.createObjectURL(blob);
  cache$2.set(key, { url: url2, refs: 1 });
  return url2;
}
function releaseUrl(key) {
  const entry = cache$2.get(key);
  if (!entry) return;
  entry.refs -= 1;
  if (entry.refs <= 0) {
    URL.revokeObjectURL(entry.url);
    cache$2.delete(key);
  }
}
function isImageContent(c) {
  return c.type === "image";
}
function isVideoContent(c) {
  return c.type === "video";
}
function ImageRenderer({ content }) {
  const [url2, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!isImageContent(content)) return;
    const { blobId } = content.body;
    let cancelled = false;
    let acquired = false;
    (async () => {
      const rec = await db().blobs.get(blobId);
      if (!rec || cancelled) return;
      const u = acquireUrl(blobId, rec.blob);
      acquired = true;
      if (cancelled) {
        releaseUrl(blobId);
        return;
      }
      setUrl(u);
    })();
    return () => {
      cancelled = true;
      if (acquired) releaseUrl(blobId);
    };
  }, [content]);
  if (!isImageContent(content) || !url2) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: url2,
      alt: content.title,
      className: "absolute inset-0 h-full w-full object-contain",
      draggable: false
    }
  );
}
function VideoRenderer({ content, mode, playing, muted, volume }) {
  const [url2, setUrl] = reactExports.useState(null);
  const videoRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!isVideoContent(content)) return;
    const { blobId } = content.body;
    let cancelled = false;
    let acquired = false;
    (async () => {
      const rec = await db().blobs.get(blobId);
      if (!rec || cancelled) return;
      const u = acquireUrl(blobId, rec.blob);
      acquired = true;
      if (cancelled) {
        releaseUrl(blobId);
        return;
      }
      setUrl(u);
    })();
    return () => {
      cancelled = true;
      if (acquired) releaseUrl(blobId);
    };
  }, [content]);
  reactExports.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (mode === "preview") {
      v.muted = true;
    } else {
      v.muted = !!muted;
      if (typeof volume === "number") v.volume = volume;
    }
  }, [mode, muted, volume, url2]);
  reactExports.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing ?? true) {
      v.play().catch(() => void 0);
    } else {
      v.pause();
    }
  }, [playing, url2]);
  if (!isVideoContent(content) || !url2) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "video",
    {
      ref: videoRef,
      src: url2,
      className: "absolute inset-0 h-full w-full object-contain",
      playsInline: true,
      loop: mode === "preview" ? true : !!content.body.loop,
      autoPlay: true
    }
  );
}
function BibleRenderer(_props) {
  return null;
}
function SongRenderer(_props) {
  return null;
}
function TextRenderer(_props) {
  return null;
}
const registry = /* @__PURE__ */ new Map();
function registerRenderer(type, renderer) {
  registry.set(type, renderer);
}
function hasRenderer(type) {
  return registry.has(type);
}
registerRenderer("image", ImageRenderer);
registerRenderer("video", VideoRenderer);
registerRenderer("bible_verse", BibleRenderer);
registerRenderer("song_slide", SongRenderer);
registerRenderer("live_text", TextRenderer);
class ProjectionEngineImpl {
  state = { current: null, queue: [], index: 0 };
  bootstrapped = false;
  projectorWasOpen = false;
  /** Idempotent. Wires the engine to the underlying broadcast store. */
  bootstrap() {
    if (this.bootstrapped) return;
    this.bootstrapped = true;
    const store = useProjection.getState();
    store.init();
    useProjection.subscribe((s) => {
      if (s.projectorOpen !== this.projectorWasOpen) {
        this.projectorWasOpen = s.projectorOpen;
        projectionEvents.emit({
          type: s.projectorOpen ? "PROJECTOR_CONNECTED" : "PROJECTOR_DISCONNECTED"
        });
      }
    });
  }
  // ───────── read-side helpers (engine state, not React) ─────────
  getCurrent() {
    return this.state.current;
  }
  getQueue() {
    return this.state.queue;
  }
  getIndex() {
    return this.state.index;
  }
  canRender(type) {
    return hasRenderer(type);
  }
  // ───────── projection ─────────
  /**
   * Project a single piece of content. Replaces whatever is showing.
   * Returns the content for chaining/awaiting in adapters.
   */
  project(content) {
    this.bootstrap();
    const previous = this.state.current;
    this.state = { current: content, queue: [content], index: 0 };
    this.dispatchToWire(content);
    projectionEvents.emit({ type: "CONTENT_PROJECTED", content, previous });
    projectionHistory.append(content);
    return content;
  }
  /**
   * Project an ordered queue (e.g. a playlist) starting at `startIndex`.
   * Adapters that resolve their queue lazily on the projector side may
   * still call `project()` per item — both paths are supported.
   */
  projectQueue(items, startIndex = 0) {
    this.bootstrap();
    if (!items.length) return null;
    const safeIndex = Math.min(Math.max(0, startIndex), items.length - 1);
    const current = items[safeIndex];
    const previous = this.state.current;
    this.state = { current, queue: items.slice(), index: safeIndex };
    this.dispatchToWire(current, { queue: items, startIndex: safeIndex });
    projectionEvents.emit({ type: "CONTENT_PROJECTED", content: current, previous });
    projectionEvents.emit({ type: "QUEUE_ADVANCED", index: safeIndex, total: items.length });
    projectionHistory.append(current);
    return current;
  }
  /** Edit-in-place: applies a patch and rebroadcasts. Used for style edits. */
  replace(patch) {
    if (!this.state.current) return;
    const next = {
      ...this.state.current,
      ...patch,
      style: { ...this.state.current.style, ...patch.style ?? {} },
      updatedAt: Date.now()
    };
    this.state.current = next;
    if (this.state.queue.length) {
      this.state.queue[this.state.index] = next;
    }
    this.dispatchToWire(next);
    projectionEvents.emit({ type: "CONTENT_UPDATED", content: next });
  }
  clear() {
    const previous = this.state.current;
    this.state = { current: null, queue: [], index: 0 };
    useProjection.getState().send({ type: "STOP" });
    projectionEvents.emit({ type: "CONTENT_CLEARED", previous });
    projectionEvents.emit({ type: "PLAYBACK_STOPPED" });
  }
  // ───────── transport ─────────
  play() {
    useProjection.getState().send({ type: "PLAY" });
    projectionEvents.emit({ type: "PLAYBACK_STARTED" });
  }
  pause() {
    useProjection.getState().send({ type: "PAUSE" });
    projectionEvents.emit({ type: "PLAYBACK_PAUSED" });
  }
  stop() {
    this.clear();
  }
  next() {
    useProjection.getState().send({ type: "NEXT" });
  }
  prev() {
    useProjection.getState().send({ type: "PREV" });
  }
  setBlack(value) {
    useProjection.getState().send({ type: "BLACK", value });
    projectionEvents.emit({ type: value ? "BLACK_SCREEN_ENABLED" : "BLACK_SCREEN_DISABLED" });
  }
  setMuted(value) {
    useProjection.getState().send({ type: "MUTE", value });
  }
  setVolume(value) {
    const clamped = Math.min(1, Math.max(0, value));
    useProjection.getState().send({ type: "VOLUME", value: clamped });
  }
  seek(time) {
    useProjection.getState().send({ type: "SEEK", time });
  }
  // ───────── projector lifecycle ─────────
  openProjector() {
    useProjection.getState().openProjector();
  }
  closeProjector() {
    useProjection.getState().closeProjector();
  }
  // ───────── events ─────────
  on = projectionEvents.on.bind(projectionEvents);
  onAny = projectionEvents.onAny.bind(projectionEvents);
  // ───────── wire translation ─────────
  /**
   * Translate a universal content into legacy broadcast commands so the
   * existing ProjectionWindow renderer keeps working. Future content
   * types whose renderers live in the projector window will dispatch via
   * a future `PROJECT_CONTENT` wire command instead — this single method
   * is the only place that needs to change.
   */
  dispatchToWire(content, opts) {
    const store = useProjection.getState();
    const wasOpen = store.projectorOpen;
    if (!wasOpen) store.openProjector();
    const delay = wasOpen ? 0 : 400;
    let cmd = null;
    if (content.type === "image" || content.type === "video") {
      const body = content.body;
      if (opts?.queue && opts.queue.length > 1 && content.source.module === "media" && content.source.refId) {
        cmd = {
          type: "LOAD_PLAYLIST",
          playlistId: content.source.refId,
          startIndex: opts.startIndex ?? 0
        };
      } else {
        cmd = { type: "LOAD", mediaId: body.mediaId };
      }
    }
    if (cmd) {
      if (delay === 0) store.send(cmd);
      else setTimeout(() => useProjection.getState().send(cmd), delay);
    }
  }
}
const projectionEngine = new ProjectionEngineImpl();
function GlobalShortcuts() {
  const navigate = useNavigate();
  const router2 = useRouter();
  const setActiveTab = useWorkspace((s) => s.setActiveTab);
  const projectorOpen = useProjection((s) => s.projectorOpen);
  const openProjector = useProjection((s) => s.openProjector);
  const closeProjector = useProjection((s) => s.closeProjector);
  const send = useProjection((s) => s.send);
  const state = useProjection((s) => s.state);
  reactExports.useEffect(() => {
    shortcutManager.install();
    return () => shortcutManager.uninstall();
  }, []);
  const tabShortcut = (id) => () => {
    setActiveTab(id);
    if (router2.state.location.pathname !== "/project") {
      void navigate({ to: "/project" });
    }
  };
  useShortcut({
    id: "tab.media",
    label: "Open Media tab",
    category: "navigation",
    keys: ["1"],
    handler: tabShortcut("media")
  });
  useShortcut({
    id: "tab.bible",
    label: "Open Bible tab",
    category: "navigation",
    keys: ["2"],
    handler: tabShortcut("bible")
  });
  useShortcut({
    id: "tab.songs",
    label: "Open Songs tab",
    category: "navigation",
    keys: ["3"],
    handler: tabShortcut("songs")
  });
  useShortcut({
    id: "tab.text",
    label: "Open Text tab",
    category: "navigation",
    keys: ["4"],
    handler: tabShortcut("text")
  });
  const focusSearch = (id) => () => {
    setActiveTab(id);
    if (router2.state.location.pathname !== "/project") {
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
    keys: ["Alt+1"],
    handler: focusSearch("media")
  });
  useShortcut({
    id: "search.bible",
    label: "Focus Bible search",
    category: "navigation",
    keys: ["Alt+2"],
    handler: focusSearch("bible")
  });
  useShortcut({
    id: "search.songs",
    label: "Focus Songs search",
    category: "navigation",
    keys: ["Alt+3"],
    handler: focusSearch("songs")
  });
  useShortcut({
    id: "search.text",
    label: "Focus Text search",
    category: "navigation",
    keys: ["Alt+4"],
    handler: focusSearch("text")
  });
  const goTo = (to) => () => {
    void navigate({ to });
  };
  useShortcut({
    id: "nav.library",
    label: "Go to Library",
    category: "navigation",
    keys: ["Alt+L"],
    handler: goTo("/library")
  });
  useShortcut({
    id: "nav.playlists",
    label: "Go to Playlists",
    category: "navigation",
    keys: ["Alt+Y"],
    handler: goTo("/playlists")
  });
  useShortcut({
    id: "nav.project",
    label: "Go to Project",
    category: "navigation",
    keys: ["Alt+J"],
    handler: goTo("/project")
  });
  useShortcut({
    id: "nav.settings",
    label: "Go to Settings",
    category: "navigation",
    keys: ["Alt+,"],
    handler: goTo("/settings")
  });
  useShortcut({
    id: "nav.shortcuts",
    label: "Open Shortcut Center",
    category: "navigation",
    keys: ["F1"],
    handler: goTo("/shortcuts")
  });
  useShortcut({
    id: "projector.toggle",
    label: "Open / Close Projector",
    category: "projector",
    keys: ["F9"],
    handler: () => {
      if (projectorOpen) closeProjector();
      else void openProjector();
    }
  });
  useShortcut({
    id: "projector.stop",
    label: "Stop Projection",
    category: "projector",
    keys: ["Escape"],
    handler: () => projectionEngine.stop()
  });
  useShortcut({
    id: "projector.play-pause",
    label: "Play / Pause video",
    category: "projector",
    keys: ["Space"],
    handler: () => {
      if (!state) return;
      if (state.playing) send({ type: "PAUSE" });
      else send({ type: "PLAY" });
    }
  });
  useShortcut({
    id: "projector.next",
    label: "Next media",
    category: "media",
    keys: ["ArrowRight"],
    handler: () => send({ type: "NEXT" })
  });
  useShortcut({
    id: "projector.prev",
    label: "Previous media",
    category: "media",
    keys: ["ArrowLeft"],
    handler: () => send({ type: "PREV" })
  });
  useShortcut({
    id: "projector.black",
    label: "Toggle black screen",
    category: "projector",
    keys: ["B"],
    handler: () => send({ type: "BLACK", value: !state?.black })
  });
  return null;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Dialog = Dialog$1;
const DialogPortal = DialogPortal$1;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogOverlay$1,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogOverlay$1.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent$1,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogContent$1.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogTitle$1,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogTitle$1.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogDescription$1,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogDescription$1.displayName;
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const ORDER = [
  { id: "general", label: "General" },
  { id: "navigation", label: "Navigation" },
  { id: "media", label: "Media" },
  { id: "playlist", label: "Playlist" },
  { id: "projector", label: "Projector" },
  { id: "bible", label: "Bible" },
  { id: "songs", label: "Songs" },
  { id: "text", label: "Text" }
];
function ShortcutsDialog() {
  const [open, setOpen] = reactExports.useState(false);
  const [filter, setFilter] = reactExports.useState("");
  const all = useRegisteredShortcuts();
  useShortcut({
    id: "shortcuts.help",
    label: "Show keyboard shortcuts",
    category: "general",
    keys: ["F1", "?"],
    scope: "global",
    handler: () => setOpen((o) => !o)
  });
  reactExports.useEffect(() => {
    if (!open) setFilter("");
  }, [open]);
  const grouped = reactExports.useMemo(() => {
    const f = filter.toLowerCase();
    const matches = all.filter(
      (s) => !f || s.label.toLowerCase().includes(f) || s.keys.some((k) => k.toLowerCase().includes(f))
    );
    const map = /* @__PURE__ */ new Map();
    for (const s of matches) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return map;
  }, [all, filter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[80vh] max-w-2xl overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "border-b border-border p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Keyboard Shortcuts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: filter,
          onChange: (e) => setFilter(e.target.value),
          placeholder: "Filter shortcuts…",
          className: "mt-2 h-8 text-sm",
          autoFocus: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[60vh] space-y-5 overflow-y-auto p-4", children: [
      ORDER.map((cat) => {
        const items = grouped.get(cat.id);
        if (!items || !items.length) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: cat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: items.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center justify-between gap-3 rounded-md border border-border bg-card/40 px-3 py-1.5 text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex flex-wrap gap-1", children: s.keys.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "kbd",
                  {
                    className: "rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]",
                    children: formatCombo(k)
                  },
                  k
                )) })
              ]
            },
            s.id
          )) })
        ] }, cat.id);
      }),
      [...grouped.values()].every((a) => a.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "No matching shortcuts." })
    ] })
  ] }) });
}
const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_MIMES = ["video/mp4", "video/webm", "video/quicktime"];
const EXT_MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime"
};
function detectMime(file) {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MIME[ext] ?? "";
}
function classifyMime(mime) {
  if (IMAGE_MIMES.includes(mime)) return "image";
  if (VIDEO_MIMES.includes(mime)) return "video";
  return null;
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
function formatDuration(ms) {
  if (!ms || !Number.isFinite(ms)) return "—";
  const total = Math.round(ms / 1e3);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
const MAX_SIZE = 320;
async function generateImageThumb(file) {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, MAX_SIZE / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob = await new Promise(
    (res, rej) => canvas.toBlob((b) => b ? res(b) : rej(new Error("toBlob failed")), "image/webp", 0.85)
  );
  return { blob, width, height };
}
async function generateVideoThumb(file) {
  const url2 = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.src = url2;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("video load failed"));
    });
    const seekTo = Math.min(1, (video.duration || 0) * 0.1);
    await new Promise((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error("video seek failed"));
      try {
        video.currentTime = seekTo;
      } catch (e) {
        reject(e);
      }
    });
    const vw = video.videoWidth || 320;
    const vh = video.videoHeight || 180;
    const scale = Math.min(1, MAX_SIZE / Math.max(vw, vh));
    const w = Math.max(1, Math.round(vw * scale));
    const h = Math.max(1, Math.round(vh * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    const blob = await new Promise(
      (res, rej) => canvas.toBlob((b) => b ? res(b) : rej(new Error("toBlob failed")), "image/webp", 0.8)
    );
    return { blob, width: vw, height: vh, durationMs: Math.round((video.duration || 0) * 1e3) };
  } finally {
    URL.revokeObjectURL(url2);
  }
}
async function getSettings() {
  const row = await db().settings.get("app");
  if (!row) {
    await db().settings.put({ key: "app", value: DEFAULT_SETTINGS });
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...row.value };
}
async function saveSettings(patch) {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await db().settings.put({ key: "app", value: next });
  return next;
}
async function listFolders() {
  return db().folders.orderBy("name").toArray();
}
async function createFolder(name, parentId = null) {
  const now = Date.now();
  const rec = {
    id: uid(),
    name: name.trim() || "Untitled",
    parentId,
    createdAt: now,
    updatedAt: now
  };
  await db().folders.add(rec);
  return rec;
}
async function renameFolder(id, name) {
  await db().folders.update(id, { name: name.trim() || "Untitled", updatedAt: Date.now() });
}
async function deleteFolderDeep(id) {
  const all = await listFolders();
  const toDelete = /* @__PURE__ */ new Set();
  const collect = (fid) => {
    toDelete.add(fid);
    for (const f of all) if (f.parentId === fid) collect(f.id);
  };
  collect(id);
  await db().transaction("rw", db().folders, db().media, db().blobs, db().playlists, async () => {
    for (const fid of toDelete) {
      const items = await db().media.where("folderId").equals(fid).toArray();
      for (const m of items) await deleteMediaInternal(m);
      await db().folders.delete(fid);
    }
  });
}
async function deleteFolderOnly(id) {
  const all = await listFolders();
  const toDelete = /* @__PURE__ */ new Set();
  const collect = (fid) => {
    toDelete.add(fid);
    for (const f of all) if (f.parentId === fid) collect(f.id);
  };
  collect(id);
  await db().transaction("rw", db().folders, db().media, async () => {
    for (const fid of toDelete) {
      const items = await db().media.where("folderId").equals(fid).toArray();
      for (const m of items) {
        await db().media.update(m.id, { folderId: null, updatedAt: Date.now() });
      }
      await db().folders.delete(fid);
    }
  });
}
async function listMediaInFolder(folderId) {
  if (folderId === null) {
    return db().media.filter((m) => m.folderId === null).toArray();
  }
  return db().media.where("folderId").equals(folderId).toArray();
}
async function listAllMedia() {
  return db().media.toArray();
}
async function getMedia(id) {
  return db().media.get(id);
}
async function importFiles(files, folderId, onProgress) {
  const imported = [];
  const skipped = [];
  let done = 0;
  for (const file of files) {
    try {
      onProgress?.({ done, total: files.length, current: file.name });
      const mime = detectMime(file);
      const type = classifyMime(mime);
      if (!type) {
        skipped.push({ name: file.name, reason: "Unsupported format" });
        done++;
        continue;
      }
      const blobId = uid();
      let thumbBlobId = null;
      let width;
      let height;
      let durationMs;
      try {
        if (type === "image") {
          const t = await generateImageThumb(file);
          thumbBlobId = uid();
          await db().blobs.add({ id: thumbBlobId, blob: t.blob, kind: "thumb" });
          width = t.width;
          height = t.height;
        } else {
          const t = await generateVideoThumb(file);
          thumbBlobId = uid();
          await db().blobs.add({ id: thumbBlobId, blob: t.blob, kind: "thumb" });
          width = t.width;
          height = t.height;
          durationMs = t.durationMs;
        }
      } catch (e) {
        logger.warn(`Thumb generation failed for ${file.name}`, e);
      }
      await db().blobs.add({ id: blobId, blob: file, kind: "original" });
      const now = Date.now();
      const rec = {
        id: uid(),
        name: file.name,
        type,
        mime,
        size: file.size,
        durationMs,
        width,
        height,
        folderId,
        blobId,
        thumbBlobId,
        createdAt: now,
        updatedAt: now,
        lastUsedAt: null
      };
      await db().media.add(rec);
      imported.push(rec);
    } catch (e) {
      logger.error(`Import failed: ${file.name}`, e);
      skipped.push({ name: file.name, reason: e.message });
    } finally {
      done++;
      onProgress?.({ done, total: files.length, current: file.name });
    }
  }
  return { imported, skipped };
}
async function renameMedia(id, name) {
  await db().media.update(id, { name: name.trim() || "Untitled", updatedAt: Date.now() });
}
async function moveMedia(ids, folderId) {
  await db().transaction("rw", db().media, async () => {
    for (const id of ids) await db().media.update(id, { folderId, updatedAt: Date.now() });
  });
}
async function touchMedia(id) {
  await db().media.update(id, { lastUsedAt: Date.now() });
}
async function deleteMediaInternal(m) {
  if (m.blobId) await db().blobs.delete(m.blobId);
  if (m.thumbBlobId) await db().blobs.delete(m.thumbBlobId);
  await db().media.delete(m.id);
  const playlists = await db().playlists.toArray();
  for (const p of playlists) {
    const filtered = p.items.filter((it) => it.mediaId !== m.id);
    if (filtered.length !== p.items.length) {
      await db().playlists.update(p.id, { items: filtered, updatedAt: Date.now() });
    }
  }
}
async function deleteMedia(ids) {
  await db().transaction("rw", db().media, db().blobs, db().playlists, async () => {
    for (const id of ids) {
      const m = await db().media.get(id);
      if (m) await deleteMediaInternal(m);
    }
  });
}
async function duplicateMedia(ids) {
  const out = [];
  for (const id of ids) {
    const m = await db().media.get(id);
    if (!m) continue;
    const now = Date.now();
    const copy = {
      ...m,
      id: uid(),
      name: `${m.name} (copy)`,
      createdAt: now,
      updatedAt: now,
      lastUsedAt: null
    };
    await db().media.add(copy);
    out.push(copy);
  }
  return out;
}
async function listPlaylists() {
  return db().playlists.orderBy("updatedAt").reverse().toArray();
}
async function getPlaylist(id) {
  return db().playlists.get(id);
}
async function createPlaylist(name) {
  const now = Date.now();
  const rec = {
    id: uid(),
    name: name.trim() || "Untitled Playlist",
    items: [],
    createdAt: now,
    updatedAt: now
  };
  await db().playlists.add(rec);
  return rec;
}
async function renamePlaylist(id, name) {
  await db().playlists.update(id, {
    name: name.trim() || "Untitled Playlist",
    updatedAt: Date.now()
  });
}
async function deletePlaylist(id) {
  await db().playlists.delete(id);
}
async function duplicatePlaylist(id) {
  const p = await db().playlists.get(id);
  if (!p) return null;
  const now = Date.now();
  const copy = {
    ...p,
    id: uid(),
    name: `${p.name} (copy)`,
    items: p.items.map((it) => ({ ...it, id: uid() })),
    createdAt: now,
    updatedAt: now
  };
  await db().playlists.add(copy);
  return copy;
}
async function updatePlaylistItems(id, items) {
  await db().playlists.update(id, { items, updatedAt: Date.now() });
}
async function addMediaToPlaylist(playlistId, mediaIds) {
  const p = await db().playlists.get(playlistId);
  if (!p) return;
  const settings = await getSettings();
  const allMedia = await db().media.bulkGet(mediaIds);
  const newItems = allMedia.filter((m) => !!m).map((m) => ({
    id: uid(),
    mediaId: m.id,
    durationMs: m.type === "video" ? m.durationMs ?? settings.defaultImageDurationMs : settings.defaultImageDurationMs,
    transition: settings.defaultTransition
  }));
  await db().playlists.update(playlistId, {
    items: [...p.items, ...newItems],
    updatedAt: Date.now()
  });
}
const repo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMediaToPlaylist,
  createFolder,
  createPlaylist,
  deleteFolderDeep,
  deleteFolderOnly,
  deleteMedia,
  deletePlaylist,
  duplicateMedia,
  duplicatePlaylist,
  getMedia,
  getPlaylist,
  getSettings,
  importFiles,
  listAllMedia,
  listFolders,
  listMediaInFolder,
  listPlaylists,
  moveMedia,
  renameFolder,
  renameMedia,
  renamePlaylist,
  saveSettings,
  touchMedia,
  updatePlaylistItems
}, Symbol.toStringTag, { value: "Module" }));
const useSettings = create((set) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  load: async () => {
    const s = await getSettings();
    set({ settings: s, loaded: true });
    applyTheme(s.theme);
  },
  update: async (patch) => {
    const next = await saveSettings(patch);
    set({ settings: next });
    if (patch.theme) applyTheme(next.theme);
  }
}));
function applyTheme(mode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const dark = mode === "dark" || mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.classList.toggle("dark", dark);
}
const url$2 = "/__l5e/assets-v1/f58b918e-5918-4440-9531-6ebd29ef7792/en.bible.json";
const enAsset = {
  url: url$2
};
const url$1 = "/__l5e/assets-v1/689ae02f-6f95-4dfc-9985-3eadee0abd48/ta.bible.json";
const taAsset = {
  url: url$1
};
const ASSET_URL = {
  en: enAsset.url.replace(
    /^\/__l5e/,
    "https://813a3f87-806d-4f67-97c8-eb507322ee4d.lovableproject.com/__l5e"
  ),
  ta: taAsset.url.replace(
    /^\/__l5e/,
    "https://813a3f87-806d-4f67-97c8-eb507322ee4d.lovableproject.com/__l5e"
  )
};
const cache$1 = {};
const inflight$1 = {};
function getBible(lang) {
  return cache$1[lang];
}
async function loadBible(lang) {
  if (cache$1[lang]) return cache$1[lang];
  if (inflight$1[lang]) return inflight$1[lang];
  const p = fetch(ASSET_URL[lang]).then((r) => {
    if (!r.ok) throw new Error(`Failed to load ${lang} bible: ${r.status}`);
    return r.json();
  }).then((data) => {
    cache$1[lang] = data;
    delete inflight$1[lang];
    return data;
  }).catch((e) => {
    delete inflight$1[lang];
    throw e;
  });
  inflight$1[lang] = p;
  return p;
}
const useBibleStore = create()(
  persist(
    (set, get) => ({
      lang: "en",
      displayMode: "en",
      query: "",
      loading: false,
      loaded: { en: false, ta: false },
      error: null,
      favorites: [],
      setLang: async (l) => {
        set({ lang: l });
        await get().ensureLoaded(l);
      },
      setDisplayMode: async (m) => {
        set({ displayMode: m });
        if (m === "both") await get().ensureBoth();
        else {
          set({ lang: m });
          await get().ensureLoaded(m);
        }
      },
      setQuery: (q) => set({ query: q }),
      ensureLoaded: async (l) => {
        const lang = l ?? get().lang;
        if (get().loaded[lang]) return;
        set({ loading: true, error: null });
        try {
          await loadBible(lang);
          set((s) => ({ loaded: { ...s.loaded, [lang]: true }, loading: false }));
        } catch (e) {
          set({ loading: false, error: e.message });
        }
      },
      ensureBoth: async () => {
        set({ loading: true, error: null });
        try {
          await Promise.all([loadBible("en"), loadBible("ta")]);
          set({ loaded: { en: true, ta: true }, loading: false });
        } catch (e) {
          set({ loading: false, error: e.message });
        }
      },
      addFavorite: (fav) => set((s) => ({
        favorites: [
          {
            ...fav,
            displayMode: fav.displayMode ?? s.displayMode,
            id: `${fav.book}:${fav.chapter}:${fav.verse}`,
            addedAt: Date.now()
          },
          ...s.favorites.filter(
            (f) => !(f.book === fav.book && f.chapter === fav.chapter && f.verse === fav.verse)
          )
        ].slice(0, 200)
      })),
      removeFavorite: (id) => set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) }))
    }),
    {
      name: "vision-bible-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lang: s.lang, displayMode: s.displayMode, favorites: s.favorites }),
      version: 3,
      migrate: (persisted) => {
        const p = persisted;
        if (p?.favorites) {
          const seen = /* @__PURE__ */ new Set();
          p.favorites = p.favorites.map((f) => ({ ...f, id: `${f.book}:${f.chapter}:${f.verse}` })).filter((f) => seen.has(f.id) ? false : (seen.add(f.id), true));
        }
        return p;
      }
    }
  )
);
const url = "/__l5e/assets-v1/e7fe52aa-9bbe-4d44-93cc-ea0a1f3558d7/tamilsongs.json";
const asset = {
  url
};
const make = (index, code, name, nameTa, chapters, aliases, testament) => ({
  index,
  code,
  name,
  nameTa,
  chapters,
  testament,
  aliases: Array.from(
    /* @__PURE__ */ new Set([
      name.toLowerCase(),
      name.toLowerCase().replace(/\s+/g, ""),
      code.toLowerCase(),
      nameTa,
      nameTa.replace(/\s+/g, ""),
      ...aliases.map((a) => a.toLowerCase())
    ])
  )
});
const BIBLE_BOOKS = [
  make(
    0,
    "GEN",
    "Genesis",
    "ஆதியாகமம்",
    50,
    ["gen", "ge", "gn", "genisis", "genesys", "aathi", "aadhi", "aadi", "ஆதி", "ஆதிய"],
    "OT"
  ),
  make(
    1,
    "EXO",
    "Exodus",
    "யாத்திராகமம்",
    40,
    ["exo", "ex", "exod", "exudus", "exidus", "yathira", "yaathira", "யாத்", "யாத்திரா"],
    "OT"
  ),
  make(
    2,
    "LEV",
    "Leviticus",
    "லேவியராகமம்",
    27,
    ["lev", "le", "lv", "leviticus", "leviyar", "leviyara", "லேவி", "லேவியர"],
    "OT"
  ),
  make(
    3,
    "NUM",
    "Numbers",
    "எண்ணாகமம்",
    36,
    ["num", "nu", "nm", "nb", "ennaa", "ennakamam", "ennaagamam", "எண்", "எண்ணா"],
    "OT"
  ),
  make(
    4,
    "DEU",
    "Deuteronomy",
    "உபாகமம்",
    34,
    ["deu", "dt", "deut", "upakamam", "ubakamam", "upa", "உப", "உபா"],
    "OT"
  ),
  make(5, "JOS", "Joshua", "யோசுவா", 24, ["jos", "josh", "jsh", "yosuva", "yoshua", "யோசு"], "OT"),
  make(
    6,
    "JDG",
    "Judges",
    "நியாயாதிபதிகள்",
    21,
    ["jdg", "judg", "jg", "judges", "niyaayaa", "niyaya", "niyayadhibathigal", "நியா"],
    "OT"
  ),
  make(7, "RUT", "Ruth", "ரூத்", 4, ["rut", "ru", "rth", "ruth", "ரூத"], "OT"),
  make(
    8,
    "1SA",
    "1 Samuel",
    "1 சாமுவேல்",
    31,
    ["1sa", "1 sam", "1sam", "1 sa", "1s", "1 samuvel", "1samuvel", "1 saamuvel", "1 சாமு"],
    "OT"
  ),
  make(
    9,
    "2SA",
    "2 Samuel",
    "2 சாமுவேல்",
    24,
    ["2sa", "2 sam", "2sam", "2 sa", "2s", "2 samuvel", "2samuvel", "2 சாமு"],
    "OT"
  ),
  make(
    10,
    "1KI",
    "1 Kings",
    "1 இராஜாக்கள்",
    22,
    ["1ki", "1 ki", "1 kgs", "1kgs", "1k", "1 rajakkal", "1rajakkal", "1 இராஜா"],
    "OT"
  ),
  make(
    11,
    "2KI",
    "2 Kings",
    "2 இராஜாக்கள்",
    25,
    ["2ki", "2 ki", "2 kgs", "2kgs", "2k", "2 rajakkal", "2rajakkal", "2 இராஜா"],
    "OT"
  ),
  make(
    12,
    "1CH",
    "1 Chronicles",
    "1 நாளாகமம்",
    29,
    ["1ch", "1 chr", "1chr", "1 ch", "1 naalaa", "1naalaa", "1 நாளா"],
    "OT"
  ),
  make(
    13,
    "2CH",
    "2 Chronicles",
    "2 நாளாகமம்",
    36,
    ["2ch", "2 chr", "2chr", "2 ch", "2 naalaa", "2naalaa", "2 நாளா"],
    "OT"
  ),
  make(14, "EZR", "Ezra", "எஸ்றா", 10, ["ezr", "ez", "ezra", "esra", "எஸ்", "எஸ்றா"], "OT"),
  make(15, "NEH", "Nehemiah", "நெகேமியா", 13, ["neh", "ne", "nehemiah", "negemiya", "நெகே"], "OT"),
  make(16, "EST", "Esther", "எஸ்தர்", 10, ["est", "es", "esth", "esther", "ester", "எஸ்த"], "OT"),
  make(17, "JOB", "Job", "யோபு", 42, ["job", "jb", "yobu", "yopu", "யோபு"], "OT"),
  make(
    18,
    "PSA",
    "Psalms",
    "சங்கீதம்",
    150,
    [
      "psa",
      "ps",
      "pslm",
      "psalm",
      "psalms",
      "pss",
      "pslam",
      "sangee",
      "sangeetham",
      "sangeedham",
      "sangidham",
      "சங்",
      "சங்கீ"
    ],
    "OT"
  ),
  make(
    19,
    "PRO",
    "Proverbs",
    "நீதிமொழிகள்",
    31,
    ["pro", "pr", "prov", "prv", "proverbs", "neethi", "needhi", "நீதி"],
    "OT"
  ),
  make(
    20,
    "ECC",
    "Ecclesiastes",
    "பிரசங்கி",
    12,
    ["ecc", "ec", "eccl", "qoh", "prasangi", "pirasangi", "பிரச"],
    "OT"
  ),
  make(
    21,
    "SNG",
    "Song of Solomon",
    "உன்னதப்பாட்டு",
    8,
    ["sng", "song", "sos", "ss", "cant", "unnatha", "unnathapaattu", "உன்ன"],
    "OT"
  ),
  make(22, "ISA", "Isaiah", "ஏசாயா", 66, ["isa", "is", "isaiah", "esaya", "ஏசாயா", "ஏசா"], "OT"),
  make(
    23,
    "JER",
    "Jeremiah",
    "எரேமியா",
    52,
    ["jer", "je", "jr", "jeremiah", "eremiya", "எரேமியா", "எரே"],
    "OT"
  ),
  make(24, "LAM", "Lamentations", "புலம்பல்", 5, ["lam", "la", "pulambal", "புலம்"], "OT"),
  make(
    25,
    "EZK",
    "Ezekiel",
    "எசேக்கியேல்",
    48,
    ["ezk", "eze", "ezek", "esekiyel", "esekkiyel", "எசேக்", "எசே"],
    "OT"
  ),
  make(
    26,
    "DAN",
    "Daniel",
    "தானியேல்",
    12,
    ["dan", "da", "dn", "daniel", "thaniyel", "தானி"],
    "OT"
  ),
  make(27, "HOS", "Hosea", "ஓசியா", 14, ["hos", "ho", "hosea", "osiya", "ஓசி"], "OT"),
  make(28, "JOL", "Joel", "யோவேல்", 3, ["jol", "joel", "joe", "jl", "yovel", "யோவே"], "OT"),
  make(29, "AMO", "Amos", "ஆமோஸ்", 9, ["amo", "am", "amos", "aamos", "ஆமோ"], "OT"),
  make(
    30,
    "OBA",
    "Obadiah",
    "ஒபதியா",
    1,
    ["oba", "ob", "obadiah", "opathiya", "obadhiya", "ஒபதி"],
    "OT"
  ),
  make(31, "JON", "Jonah", "யோனா", 4, ["jon", "jnh", "jonah", "yona", "யோனா"], "OT"),
  make(32, "MIC", "Micah", "மீகா", 7, ["mic", "mi", "micah", "meega", "மீகா"], "OT"),
  make(33, "NAM", "Nahum", "நாகூம்", 3, ["nam", "nah", "na", "nahum", "naagoom", "நாகூ"], "OT"),
  make(34, "HAB", "Habakkuk", "ஆபகூக்", 3, ["hab", "hb", "habakkuk", "aabakook", "ஆபகூ"], "OT"),
  make(35, "ZEP", "Zephaniah", "செப்பனியா", 3, ["zep", "zeph", "zp", "seppaniya", "செப்ப"], "OT"),
  make(
    36,
    "HAG",
    "Haggai",
    "ஆகாய்",
    2,
    ["hag", "hg", "haggai", "aakaai", "aakai", "ஆகாய்", "ஆகா"],
    "OT"
  ),
  make(
    37,
    "ZEC",
    "Zechariah",
    "சகரியா",
    14,
    ["zec", "zech", "zc", "zechariah", "sakariya", "சகரி"],
    "OT"
  ),
  make(38, "MAL", "Malachi", "மல்கியா", 4, ["mal", "ml", "malachi", "malkiya", "மல்கி"], "OT"),
  make(
    39,
    "MAT",
    "Matthew",
    "மத்தேயு",
    28,
    ["mat", "mt", "matt", "matthew", "mathew", "mathayu", "matteyu", "மத்", "மத்தே"],
    "NT"
  ),
  make(
    40,
    "MRK",
    "Mark",
    "மாற்கு",
    16,
    ["mrk", "mk", "mr", "mark", "maaku", "marku", "maarku", "மாற்", "மாற்கு"],
    "NT"
  ),
  make(
    41,
    "LUK",
    "Luke",
    "லூக்கா",
    24,
    ["luk", "lk", "lu", "luke", "luka", "looka", "லூக்", "லூக்கா"],
    "NT"
  ),
  make(
    42,
    "JHN",
    "John",
    "யோவான்",
    21,
    ["jhn", "jn", "joh", "john", "yovan", "yovaan", "yova", "yo", "யோவா", "யோவான்", "யோ"],
    "NT"
  ),
  make(
    43,
    "ACT",
    "Acts",
    "அப்போஸ்தலர்",
    28,
    ["act", "ac", "acts", "appostalar", "apposthalar", "அப்போ"],
    "NT"
  ),
  make(
    44,
    "ROM",
    "Romans",
    "ரோமர்",
    16,
    ["rom", "ro", "rm", "romans", "romar", "ரோமர்", "ரோம"],
    "NT"
  ),
  make(
    45,
    "1CO",
    "1 Corinthians",
    "1 கொரிந்தியர்",
    16,
    ["1co", "1 cor", "1cor", "1 co", "1 korinthi", "1korinthi", "1 கொரி"],
    "NT"
  ),
  make(
    46,
    "2CO",
    "2 Corinthians",
    "2 கொரிந்தியர்",
    13,
    ["2co", "2 cor", "2cor", "2 co", "2 korinthi", "2korinthi", "2 கொரி"],
    "NT"
  ),
  make(
    47,
    "GAL",
    "Galatians",
    "கலாத்தியர்",
    6,
    ["gal", "ga", "galatians", "kalathiyar", "கலாத்"],
    "NT"
  ),
  make(
    48,
    "EPH",
    "Ephesians",
    "எபேசியர்",
    6,
    ["eph", "ep", "ephesians", "epesiyar", "எபேசி"],
    "NT"
  ),
  make(
    49,
    "PHP",
    "Philippians",
    "பிலிப்பியர்",
    4,
    ["php", "phil", "pp", "philippians", "pilippiyar", "பிலிப்"],
    "NT"
  ),
  make(
    50,
    "COL",
    "Colossians",
    "கொலோசேயர்",
    4,
    ["col", "co", "colossians", "koloseyar", "கொலோ"],
    "NT"
  ),
  make(
    51,
    "1TH",
    "1 Thessalonians",
    "1 தெசலோனிக்கேயர்",
    5,
    ["1th", "1 thess", "1thess", "1 th", "1 thesalo", "1thesalo", "1 தெசலோ"],
    "NT"
  ),
  make(
    52,
    "2TH",
    "2 Thessalonians",
    "2 தெசலோனிக்கேயர்",
    3,
    ["2th", "2 thess", "2thess", "2 th", "2 thesalo", "2thesalo", "2 தெசலோ"],
    "NT"
  ),
  make(
    53,
    "1TI",
    "1 Timothy",
    "1 தீமோத்தேயு",
    6,
    ["1ti", "1 tim", "1tim", "1 ti", "1 thimothey", "1thimothey", "1 தீமோ"],
    "NT"
  ),
  make(
    54,
    "2TI",
    "2 Timothy",
    "2 தீமோத்தேயு",
    4,
    ["2ti", "2 tim", "2tim", "2 ti", "2 thimothey", "2thimothey", "2 தீமோ"],
    "NT"
  ),
  make(55, "TIT", "Titus", "தீத்து", 3, ["tit", "ti", "titus", "theethu", "தீத்"], "NT"),
  make(
    56,
    "PHM",
    "Philemon",
    "பிலேமோன்",
    1,
    ["phm", "philem", "pm", "philemon", "pilemon", "பிலே"],
    "NT"
  ),
  make(57, "HEB", "Hebrews", "எபிரெயர்", 13, ["heb", "he", "hebrews", "epireyar", "எபிரெ"], "NT"),
  make(
    58,
    "JAS",
    "James",
    "யாக்கோபு",
    5,
    ["jas", "jm", "james", "yakkobu", "yaakkobu", "யாக்", "யாக்கோ"],
    "NT"
  ),
  make(
    59,
    "1PE",
    "1 Peter",
    "1 பேதுரு",
    5,
    ["1pe", "1 pet", "1pet", "1 pe", "1p", "1 pethuru", "1pethuru", "1 பேது"],
    "NT"
  ),
  make(
    60,
    "2PE",
    "2 Peter",
    "2 பேதுரு",
    3,
    ["2pe", "2 pet", "2pet", "2 pe", "2p", "2 pethuru", "2pethuru", "2 பேது"],
    "NT"
  ),
  make(
    61,
    "1JN",
    "1 John",
    "1 யோவான்",
    5,
    ["1jn", "1 jn", "1 john", "1jo", "1 jo", "1 yovan", "1yovan", "1 யோவா", "1 யோ"],
    "NT"
  ),
  make(
    62,
    "2JN",
    "2 John",
    "2 யோவான்",
    1,
    ["2jn", "2 jn", "2 john", "2jo", "2 yovan", "2yovan", "2 யோவா", "2 யோ"],
    "NT"
  ),
  make(
    63,
    "3JN",
    "3 John",
    "3 யோவான்",
    1,
    ["3jn", "3 jn", "3 john", "3jo", "3 yovan", "3yovan", "3 யோவா", "3 யோ"],
    "NT"
  ),
  make(64, "JUD", "Jude", "யூதா", 1, ["jud", "jude", "yutha", "யூதா"], "NT"),
  make(
    65,
    "REV",
    "Revelation",
    "வெளிப்படுத்தின விசேஷம்",
    22,
    [
      "rev",
      "re",
      "rv",
      "apoc",
      "revelation",
      "velipaduthina",
      "velippaduthina",
      "velipaduthina visesham",
      "வெளி",
      "வெளிப்",
      "வெளிப்படுத்தின"
    ],
    "NT"
  )
];
const TA_VOWELS = {
  "அ": "a",
  "ஆ": "a",
  "இ": "i",
  "ஈ": "i",
  "உ": "u",
  "ஊ": "u",
  "எ": "e",
  "ஏ": "e",
  "ஐ": "ai",
  "ஒ": "o",
  "ஓ": "o",
  "ஔ": "au"
};
const TA_SIGNS = {
  "ா": "a",
  "ி": "i",
  "ீ": "i",
  "ு": "u",
  "ூ": "u",
  "ெ": "e",
  "ே": "e",
  "ை": "ai",
  "ொ": "o",
  "ோ": "o",
  "ௌ": "au"
};
const TA_CONS = {
  "க": "k",
  "ங": "n",
  "ச": "s",
  "ஞ": "n",
  "ட": "t",
  "ண": "n",
  "த": "t",
  "ந": "n",
  "ன": "n",
  "ப": "p",
  "ம": "m",
  "ய": "y",
  "ர": "r",
  "ற": "r",
  "ல": "l",
  "ள": "l",
  "ழ": "l",
  "வ": "v",
  "ஶ": "s",
  "ஷ": "s",
  "ஸ": "s",
  "ஹ": "h"
};
const VIRAMA = "்";
function tamilToLatin(s) {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (TA_VOWELS[c]) {
      out += TA_VOWELS[c];
      continue;
    }
    if (TA_SIGNS[c]) {
      out += TA_SIGNS[c];
      continue;
    }
    if (TA_CONS[c]) {
      out += TA_CONS[c];
      const next = s[i + 1];
      if (next === VIRAMA) {
        i++;
        continue;
      }
      if (next && TA_SIGNS[next]) continue;
      out += "a";
      continue;
    }
    if (c === VIRAMA) continue;
    out += c.toLowerCase();
  }
  return out;
}
function tanglishLower(s) {
  let t = s.toLowerCase();
  t = t.replace(/dh/g, "d").replace(/th/g, "t").replace(/zh/g, "l").replace(/sh/g, "s").replace(/ch/g, "s").replace(/ph/g, "p").replace(/gh/g, "k").replace(/kh/g, "k").replace(/ng/g, "n");
  t = t.replace(/b/g, "p").replace(/g/g, "k").replace(/d/g, "t").replace(/j/g, "s").replace(/f/g, "p").replace(/w/g, "v").replace(/h/g, "");
  return t;
}
function tanglishStem(s) {
  let t = tanglishLower(s);
  t = t.replace(/[aeiou]/g, "");
  t = t.replace(/([^\s])\1+/g, "$1");
  t = t.replace(/[^a-z\s]/g, "");
  return t.trim();
}
function songStem(s) {
  if (!s) return "";
  const latin = /[\u0B80-\u0BFF]/.test(s) ? tamilToLatin(s) : s;
  return tanglishStem(latin);
}
function songLower(s) {
  const latin = /[\u0B80-\u0BFF]/.test(s) ? tamilToLatin(s) : s;
  return tanglishLower(latin).replace(/\s+/g, " ").trim();
}
let cache = null;
let userSongsRef = [];
let inflight = null;
function buildSlides(content) {
  return content.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
}
function buildSong(raw) {
  const title = (raw.title || "").trim();
  const content = (raw.content || "").trim();
  const slides = buildSlides(content);
  return {
    id: raw.id,
    title,
    content,
    artist: raw.artist ?? "",
    album: raw.album ?? "",
    scale: raw.scale ?? "",
    slides,
    userCreated: raw.userCreated,
    titleLower: songLower(title),
    contentLower: songLower(content),
    titleStem: songStem(title),
    contentStem: songStem(content),
    slideStems: slides.map(songStem)
  };
}
function buildFromRaw(r) {
  return buildSong({ id: r.id, title: r.t, content: r.c, artist: r.a, album: r.al, scale: r.s });
}
function getSongs() {
  if (!cache) return null;
  if (!userSongsRef.length) return cache;
  const userIds = new Set(userSongsRef.map((u) => u.id));
  return [...userSongsRef, ...cache.filter((c) => !userIds.has(c.id))];
}
function setUserSongs(songs) {
  userSongsRef = songs;
}
async function loadSongs() {
  if (cache) return cache;
  if (inflight) return inflight;
  const url2 = asset.url.replace(
    /^\/__l5e/,
    "https://813a3f87-806d-4f67-97c8-eb507322ee4d.lovableproject.com/__l5e"
  );
  inflight = fetch(url2).then((r) => {
    if (!r.ok) throw new Error(`Failed to load songs: ${r.status}`);
    return r.json();
  }).then((rows) => {
    cache = rows.map(buildFromRaw);
    inflight = null;
    return cache;
  }).catch((e) => {
    inflight = null;
    throw e;
  });
  return inflight;
}
function syncUserSongs(list) {
  setUserSongs(list.map((u) => buildSong({ ...u, userCreated: true })));
}
const USER_ID_BASE = 9e6;
const useSongsStore = create()(
  persist(
    (set, get) => ({
      query: "",
      loading: false,
      loaded: false,
      error: null,
      favorites: [],
      userSongs: [],
      selectedSongId: null,
      setQuery: (q) => set({ query: q }),
      ensureLoaded: async () => {
        if (get().loaded || get().loading) return;
        set({ loading: true, error: null });
        try {
          await loadSongs();
          syncUserSongs(get().userSongs);
          set({ loaded: true, loading: false });
        } catch (e) {
          set({ loading: false, error: e.message });
        }
      },
      addFavorite: (fav) => set((s) => ({
        favorites: [
          { ...fav, addedAt: Date.now() },
          ...s.favorites.filter((f) => f.id !== fav.id)
        ].slice(0, 500)
      })),
      removeFavorite: (id) => set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) })),
      selectSong: (id) => set({ selectedSongId: id }),
      addUserSong: (s) => {
        const id = get().userSongs.reduce((m, x) => Math.max(m, x.id), USER_ID_BASE) + 1;
        const next = [...get().userSongs, { ...s, id }];
        set({ userSongs: next });
        syncUserSongs(next);
        return id;
      },
      upsertUserSong: (s) => {
        const exists = get().userSongs.some((u) => u.id === s.id);
        const next = exists ? get().userSongs.map((u) => u.id === s.id ? s : u) : [...get().userSongs, s];
        set({ userSongs: next });
        syncUserSongs(next);
      },
      updateUserSong: (id, patch) => {
        const next = get().userSongs.map((u) => u.id === id ? { ...u, ...patch } : u);
        set({ userSongs: next });
        syncUserSongs(next);
      },
      removeUserSong: (id) => {
        const next = get().userSongs.filter((u) => u.id !== id);
        set({ userSongs: next });
        syncUserSongs(next);
        if (get().selectedSongId === id) set({ selectedSongId: null });
      }
    }),
    {
      name: "vision-songs-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ favorites: s.favorites, userSongs: s.userSongs }),
      version: 2,
      onRehydrateStorage: () => (state) => {
        if (state?.userSongs?.length) syncUserSongs(state.userSongs);
      }
    }
  )
);
const useMediaFavorites = create()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => set((s) => s.ids.includes(id) ? s : { ids: [id, ...s.ids].slice(0, 200) }),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      toggle: (id) => set(
        (s) => s.ids.includes(id) ? { ids: s.ids.filter((x) => x !== id) } : { ids: [id, ...s.ids].slice(0, 200) }
      ),
      has: (id) => get().ids.includes(id)
    }),
    { name: "vision-media-favorites", storage: createJSONStorage(() => localStorage), version: 1 }
  )
);
const useFavoritesDock = create()(
  persist(
    (set) => ({
      open: true,
      group: "bible",
      toggle: () => set((s) => ({ open: !s.open })),
      setOpen: (v) => set({ open: v }),
      setGroup: (g) => set({ group: g })
    }),
    { name: "vision-favorites-dock", storage: createJSONStorage(() => localStorage), version: 1 }
  )
);
let rafHandle = null;
function broadcastSoon(groups) {
  if (typeof window === "undefined") return;
  if (rafHandle != null) return;
  rafHandle = window.requestAnimationFrame(() => {
    rafHandle = null;
    try {
      const proj = useProjection.getState();
      proj.send({ type: "UPDATE_STYLES", styles: groups });
      proj.send({ type: "UPDATE_TEXT_STYLE", style: stripSection(groups.english) });
    } catch {
    }
  });
}
function stripSection(s) {
  const { visible: _v, ...rest } = s;
  return rest;
}
const useTextFormat = create()(
  persist(
    (set, get) => ({
      groups: { ...DEFAULT_GROUPED_STYLES },
      style: stripSection(DEFAULT_GROUPED_STYLES.english),
      setField: (group, key, value) => {
        set((s) => {
          const next = {
            ...s.groups,
            [group]: { ...s.groups[group], [key]: value }
          };
          return { groups: next, style: stripSection(next.english) };
        });
        broadcastSoon(get().groups);
      },
      set: (key, value) => {
        set((s) => {
          const next = {
            ...s.groups,
            english: { ...s.groups.english, [key]: value }
          };
          return { groups: next, style: stripSection(next.english) };
        });
        broadcastSoon(get().groups);
      },
      patchGroup: (group, partial) => {
        set((s) => {
          const next = {
            ...s.groups,
            [group]: { ...s.groups[group], ...partial }
          };
          return { groups: next, style: stripSection(next.english) };
        });
        broadcastSoon(get().groups);
      },
      setBackground: (partial) => {
        set((s) => {
          const next = {
            ...s.groups,
            background: { ...s.groups.background, ...partial }
          };
          return { groups: next, style: s.style };
        });
        try {
          useProjection.getState().send({
            type: "UPDATE_BACKGROUND",
            background: get().groups.background
          });
        } catch {
        }
        broadcastSoon(get().groups);
      },
      reset: () => {
        set({
          groups: { ...DEFAULT_GROUPED_STYLES },
          style: stripSection(DEFAULT_GROUPED_STYLES.english)
        });
        broadcastSoon(get().groups);
      },
      resetGroup: (group) => {
        set((s) => {
          const next = {
            ...s.groups,
            [group]: { ...DEFAULT_GROUPED_STYLES[group] }
          };
          return { groups: next, style: stripSection(next.english) };
        });
        broadcastSoon(get().groups);
      }
    }),
    {
      name: "vision-text-format",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted) => {
        const p = persisted;
        if (p?.groups) return p;
        if (p?.style) {
          const base = { ...p.style, visible: true };
          const groups = {
            reference: { ...DEFAULT_GROUPED_STYLES.reference },
            tamil: { ...base, fontFamily: "Latha" },
            english: base,
            background: { ...DEFAULT_GROUPED_STYLES.background, color: p.style.background }
          };
          return { groups, style: stripSection(groups.english) };
        }
        return {
          groups: DEFAULT_GROUPED_STYLES,
          style: stripSection(DEFAULT_GROUPED_STYLES.english)
        };
      }
    }
  )
);
function projectVerse(input) {
  const overlay = {
    reference: input.reference,
    text: input.text,
    translation: input.translation,
    subtext: input.subtext,
    subtranslation: input.subtranslation,
    referenceEn: input.referenceEn,
    referenceTa: input.referenceTa,
    textEn: input.textEn,
    textTa: input.textTa,
    mode: input.mode,
    kind: "bible_verse"
  };
  const groups = useTextFormat.getState().groups;
  const style = useTextFormat.getState().style;
  const store = useProjection.getState();
  if (!store.projectorOpen) store.openProjector();
  const send = () => useProjection.getState().send({ type: "LOAD_TEXT", overlay, style, styles: groups });
  if (store.projectorOpen) send();
  else setTimeout(send, 400);
  const now = Date.now();
  const content = {
    id: `bible:${input.translation}:${input.reference}`,
    type: "bible_verse",
    title: `${input.reference} (${input.translation})`,
    source: { module: "bible" },
    metadata: { book: input.book, chapter: input.chapter, verse: input.verse },
    style: {
      background: style.background,
      color: style.color,
      align: style.align,
      vAlign: style.vAlign
    },
    body: { reference: input.reference, text: input.text, translation: input.translation },
    createdAt: now,
    updatedAt: now
  };
  projectionEvents.emit({ type: "CONTENT_PROJECTED", content, previous: null });
  projectionHistory.append(content);
  return content;
}
function projectSongSlide(input) {
  const overlay = {
    reference: "",
    referenceEn: "",
    referenceTa: "",
    text: input.text,
    textEn: "",
    textTa: input.text,
    translation: "",
    mode: "ta",
    kind: "song_slide"
  };
  const groups = useTextFormat.getState().groups;
  const style = useTextFormat.getState().style;
  const store = useProjection.getState();
  if (!store.projectorOpen) store.openProjector();
  const send = () => useProjection.getState().send({ type: "LOAD_TEXT", overlay, style, styles: groups });
  if (store.projectorOpen) send();
  else setTimeout(send, 400);
  const now = Date.now();
  const lines = input.text.split(/\n/);
  const content = {
    id: `song:${input.songId}:${input.slideIndex}`,
    type: "song_slide",
    title: `${input.title} (slide ${input.slideIndex + 1})`,
    source: { module: "songs" },
    metadata: { songId: input.songId, slideIndex: input.slideIndex },
    style: {
      background: style.background,
      color: style.color,
      align: style.align,
      vAlign: style.vAlign
    },
    body: { songId: String(input.songId), slideIndex: input.slideIndex, lines },
    createdAt: now,
    updatedAt: now
  };
  projectionEvents.emit({ type: "CONTENT_PROJECTED", content, previous: null });
  projectionHistory.append(content);
  return content;
}
async function activateBibleFavorite(navigate, book, chapter, verse, savedMode) {
  const meta = BIBLE_BOOKS[book];
  if (!meta) return;
  const bs = useBibleStore.getState();
  if (savedMode && savedMode !== bs.displayMode) {
    await bs.setDisplayMode(savedMode);
  }
  if (bs.displayMode === "both") await bs.ensureBoth();
  else await bs.ensureLoaded(bs.displayMode);
  useWorkspace.getState().setActiveTab("bible");
  if (typeof window !== "undefined" && window.location.pathname !== "/project") {
    try {
      await Promise.resolve(navigate({ to: "/project" }));
    } catch {
    }
  }
  bs.setQuery(`${meta.name} ${chapter}`);
  const primary = bs.displayMode === "ta" ? "ta" : "en";
  const dp = getBible(primary);
  const dotxt = dp?.[book]?.[chapter - 1]?.[verse - 1];
  if (!dotxt) {
    toast.error("Verse not available yet — loading…");
    return;
  }
  const otherLang = bs.displayMode === "both" ? primary === "en" ? "ta" : "en" : null;
  const otherTxt = otherLang ? getBible(otherLang)?.[book]?.[chapter - 1]?.[verse - 1] : null;
  const refEn = `${meta.name} ${chapter}:${verse}`;
  const refTa = `${meta.nameTa} ${chapter}:${verse}`;
  const enTxt = primary === "en" ? dotxt : otherTxt ?? "";
  const taTxt = primary === "ta" ? dotxt : otherTxt ?? "";
  projectVerse({
    reference: bs.displayMode === "both" ? `${refTa} | ${refEn}` : primary === "ta" ? refTa : refEn,
    text: dotxt,
    translation: primary === "ta" ? "தமிழ்" : "KJV",
    subtext: otherTxt ?? void 0,
    subtranslation: otherTxt ? primary === "ta" ? "KJV" : "தமிழ்" : void 0,
    referenceEn: refEn,
    referenceTa: refTa,
    textEn: enTxt,
    textTa: taTxt,
    mode: bs.displayMode === "both" ? "both" : primary === "ta" ? "ta" : "en",
    book,
    chapter,
    verse
  });
}
async function activateMediaFavorite(mediaId) {
  const m = await getMedia(mediaId);
  if (!m) {
    toast.error("Media not found");
    return;
  }
  const proj = useProjection.getState();
  if (!proj.projectorOpen) proj.openProjector();
  const send = () => useProjection.getState().send({ type: "LOAD", mediaId });
  if (proj.projectorOpen) send();
  else setTimeout(send, 400);
  toast.success(`Projecting ${m.name}`);
}
async function activateSongFavorite(songId, slideIndex = 0) {
  await useSongsStore.getState().ensureLoaded();
  const song = getSongs()?.find((s) => s.id === songId);
  if (!song) {
    toast.error("Song not found");
    return;
  }
  const text = song.slides[slideIndex] ?? song.content;
  projectSongSlide({
    songId: song.id,
    slideIndex,
    totalSlides: song.slides.length || 1,
    title: song.title,
    text
  });
}
function GlobalFavoritesDock() {
  const { open, group, toggle, setGroup } = useFavoritesDock();
  const navigate = useNavigate();
  const bibleFavorites = useBibleStore((s) => s.favorites);
  const removeBibleFav = useBibleStore((s) => s.removeFavorite);
  const songFavorites = useSongsStore((s) => s.favorites);
  const removeSongFav = useSongsStore((s) => s.removeFavorite);
  const mediaFavIds = useMediaFavorites((s) => s.ids);
  const removeMediaFav = useMediaFavorites((s) => s.remove);
  const [mediaItems, setMediaItems] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      const items = (await Promise.all(mediaFavIds.map((id) => getMedia(id)))).filter(
        (m) => !!m
      );
      if (!cancelled) setMediaItems(items);
    })();
    return () => {
      cancelled = true;
    };
  }, [mediaFavIds]);
  useShortcut({
    id: "favorites.toggle-dock",
    label: "Toggle Favorites dock",
    category: "general",
    keys: ["Alt+Shift+F"],
    scope: "global",
    handler: () => toggle(),
    allowInInput: true
  });
  if (!open) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed right-0 top-12 z-40 flex flex-col items-center gap-1 rounded-l-lg border border-r-0 border-border bg-card/95 p-1 shadow-lg backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: toggle,
          title: "Open Favorites (Alt+Shift+F)",
          className: "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-amber-500 hover:bg-accent",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-current" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3 w-3 text-muted-foreground" })
    ] });
  }
  const counts = {
    bible: bibleFavorites.length,
    songs: songFavorites.length,
    media: mediaItems.length,
    text: 0
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed right-0 top-12 z-40 flex h-[calc(100vh-3.5rem)] w-56 flex-col rounded-l-lg border border-r-0 border-border bg-card/95 shadow-xl backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-9 shrink-0 items-center gap-1 border-b border-border bg-muted/40 px-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 text-amber-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wide", children: "Favorites" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: toggle,
          title: "Collapse",
          className: "ml-auto inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-0.5 border-b border-border bg-background/40 p-1", children: [
      { id: "bible", label: "Bible", icon: BookOpen },
      { id: "songs", label: "Songs", icon: Music },
      { id: "media", label: "Media", icon: Image },
      { id: "text", label: "Text", icon: Type }
    ].map((g) => {
      const Icon = g.icon;
      const active = g.id === group;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setGroup(g.id),
          title: g.label,
          className: cn(
            "inline-flex h-7 flex-1 cursor-pointer items-center justify-center gap-1 rounded px-1 text-[10px] font-medium transition",
            active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: counts[g.id] })
          ]
        },
        g.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto p-1", children: [
      group === "bible" && (bibleFavorites.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { hint: "Star a verse in the Bible tab." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: bibleFavorites.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        FavRow,
        {
          label: f.ref,
          sub: f.text,
          onActivate: () => activateBibleFavorite(navigate, f.book, f.chapter, f.verse, f.displayMode),
          onRemove: () => removeBibleFav(f.id)
        },
        f.id
      )) })),
      group === "media" && (mediaItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { hint: "Star media in the Library to pin it here." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: mediaItems.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        FavRow,
        {
          label: m.name,
          sub: m.type,
          onActivate: () => activateMediaFavorite(m.id),
          onRemove: () => removeMediaFav(m.id)
        },
        m.id
      )) })),
      group === "songs" && (songFavorites.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { hint: "Star a song in the Songs tab." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: songFavorites.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        FavRow,
        {
          label: f.title,
          onActivate: () => activateSongFavorite(f.id, 0),
          onRemove: () => removeSongFav(f.id)
        },
        f.id
      )) })),
      group === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { hint: "Text module coming soon." })
    ] })
  ] });
}
function Empty({ hint }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center px-3 text-center text-[10px] text-muted-foreground", children: hint });
}
function FavRow({
  label,
  sub,
  onActivate,
  onRemove
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "group flex items-center gap-1 rounded px-1.5 py-1 hover:bg-accent/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: onActivate,
        title: `Project ${label}`,
        className: "flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3 shrink-0 text-primary opacity-60 group-hover:opacity-100" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[11px] font-medium leading-tight", children: label }),
            sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[9px] text-muted-foreground", children: sub })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onRemove,
        title: "Remove favorite",
        className: "inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground opacity-0 transition hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
      }
    )
  ] });
}
function useShortcutFor(id) {
  const all = useRegisteredShortcuts();
  return all.find((s) => s.id === id);
}
function useShortcutTooltip(id, fallback) {
  const s = useShortcutFor(id);
  if (!s || !s.keys.length) return fallback;
  const combo = s.keys.map(formatCombo).join(" or ");
  return `${fallback} · ${combo}`;
}
const PRIMARY_NAV = [
  { to: "/library", label: "Library", icon: FolderTree, shortcutId: "nav.library" },
  { to: "/playlists", label: "Playlists", icon: ListVideo, shortcutId: "nav.playlists" },
  { to: "/project", label: "Project", icon: MonitorPlay, shortcutId: "nav.project" },
  { to: "/shortcuts", label: "Shortcuts", icon: Keyboard, shortcutId: "nav.shortcuts" }
];
const SETTINGS_NAV = {
  to: "/settings",
  label: "Settings",
  icon: Settings,
  shortcutId: "nav.settings"
};
const SIDEBAR_KEY = "church-media-sidebar-collapsed-v2";
function AppShell({ children }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { settings, update, load, loaded } = useSettings();
  const { projectorOpen, openProjector, closeProjector, init } = useProjection();
  const [collapsed, setCollapsed] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_KEY) === "1";
  });
  reactExports.useEffect(() => {
    init();
    projectionEngine.bootstrap();
    if (!loaded) void load();
  }, [init, load, loaded]);
  reactExports.useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
    } catch {
    }
  }, [collapsed]);
  const cycleTheme = () => {
    const order = ["light", "dark", "system"];
    const next = order[(order.indexOf(settings.theme) + 1) % order.length];
    void update({ theme: next });
  };
  const renderNavItem = (item) => {
    const active = pathname === item.to || pathname.startsWith(item.to + "/");
    const Icon = item.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { item, active, icon: Icon, collapsed }, item.to);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        style: { width: collapsed ? 56 : 224, willChange: "width" },
        className: "flex shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar transition-[width] duration-200 ease-out",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-14 shrink-0 items-center gap-2 overflow-hidden border-b border-sidebar-border px-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: collapsed ? () => setCollapsed(false) : void 0,
                "aria-label": collapsed ? "Expand sidebar" : "Church Media",
                title: collapsed ? "Expand sidebar" : "Church Media",
                className: cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform",
                  collapsed ? "cursor-pointer hover:scale-105" : "cursor-default"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorPlay, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "min-w-0 flex-1 truncate whitespace-nowrap text-sm font-semibold transition-opacity duration-200",
                  collapsed ? "pointer-events-none opacity-0" : "opacity-100"
                ),
                children: "Church Media"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setCollapsed(true),
                title: "Collapse sidebar",
                "aria-label": "Collapse sidebar",
                className: cn(
                  "inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[opacity,colors] duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  collapsed ? "pointer-events-none opacity-0" : "opacity-100"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftClose, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2", children: PRIMARY_NAV.map(renderNavItem) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden border-t border-sidebar-border p-2", children: [
            renderNavItem(SETTINGS_NAV),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "whitespace-nowrap px-2 pt-2 text-[10px] text-muted-foreground transition-opacity duration-200",
                  collapsed ? "pointer-events-none opacity-0" : "opacity-100"
                ),
                children: "Offline-first · Local only"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex h-10 shrink-0 items-center justify-end gap-1 border-b border-border bg-background px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProjectorToggleButton,
          {
            projectorOpen,
            onToggle: projectorOpen ? closeProjector : openProjector
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: cycleTheme,
            className: "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
            "aria-label": "Toggle theme",
            title: `Theme: ${settings.theme}`,
            children: settings.theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" }) : settings.theme === "light" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-hidden", children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalFavoritesDock, {})
  ] });
}
function NavItem({
  item,
  active,
  icon: Icon,
  collapsed
}) {
  const tooltip = useShortcutTooltip(item.shortcutId ?? "", item.label);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: item.to,
      title: tooltip,
      "aria-label": tooltip,
      className: cn(
        "relative flex h-9 cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2.5 text-sm transition-colors duration-150",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "min-w-0 flex-1 truncate whitespace-nowrap transition-[opacity,transform] duration-200 ease-out",
              collapsed ? "pointer-events-none -translate-x-1 opacity-0" : "translate-x-0 opacity-100"
            ),
            children: item.label
          }
        )
      ]
    }
  );
}
function ProjectorToggleButton({
  projectorOpen,
  onToggle
}) {
  const tooltip = useShortcutTooltip(
    "projector.toggle",
    projectorOpen ? "Close Projector" : "Open Projector"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: onToggle,
      title: tooltip,
      "aria-label": tooltip,
      className: cn(
        "inline-flex h-7 items-center gap-1.5 cursor-pointer rounded-md px-2.5 text-xs font-medium transition",
        projectorOpen ? "bg-destructive/15 text-destructive hover:bg-destructive/25" : "bg-primary text-primary-foreground hover:opacity-90"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorPlay, { className: "h-3.5 w-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: projectorOpen ? "Close Projector" : "Open Projector" })
      ]
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$8 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Church Media — Projection Software" },
      {
        name: "description",
        content: "Offline-first media projection software for churches. Images, posters, and videos."
      },
      { name: "theme-color", content: "#0a0a0a" },
      { property: "og:title", content: "Church Media — Projection Software" },
      {
        property: "og:description",
        content: "Offline-first media projection software for churches."
      },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@300;400;500;600;700&family=Noto+Serif+Tamil:wght@400;500;600;700&family=Mukta+Malar:wght@400;500;700&family=Catamaran:wght@400;500;700&family=Hind+Madurai:wght@400;500;600&family=Meera+Inimai&family=Pavanam&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$8.useRouteContext();
  const isProjectorPopup = typeof window !== "undefined" && window.opener != null && window.name === "church-projector";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    !isProjectorPopup && /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalShortcuts, {}),
    !isProjectorPopup && /* @__PURE__ */ jsxRuntimeExports.jsx(ShortcutsDialog, {}),
    isProjectorPopup ? /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-right", richColors: true, closeButton: true })
  ] });
}
const $$splitComponentImporter$6 = () => import("./shortcuts-BvdXuSrw.mjs");
const Route$7 = createFileRoute("/shortcuts")({
  head: () => ({
    meta: [{
      title: "Keyboard Shortcuts — Church Media"
    }, {
      name: "description",
      content: "Discover every keyboard shortcut available in the projection workspace."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./settings-Dcs3hjKE.mjs");
const Route$6 = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings — Church Media"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./project-BOogl3qx.mjs");
const Route$5 = createFileRoute("/project")({
  head: () => ({
    meta: [{
      title: "Project — Church Media"
    }, {
      name: "description",
      content: "Live projection control room."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./playlists-C9uVh6_G.mjs");
const Route$4 = createFileRoute("/playlists")({
  head: () => ({
    meta: [{
      title: "Playlists — Church Media"
    }, {
      name: "description",
      content: "Create and manage media playlists for services."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./library-CUgjR2D5.mjs");
const Route$3 = createFileRoute("/library")({
  head: () => ({
    meta: [{
      title: "Media Library — Church Media"
    }, {
      name: "description",
      content: "Manage images, posters, and videos for projection."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const Route$2 = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/library" });
  }
});
const $$splitComponentImporter$1 = () => import("./service._id-DRp1K-BE.mjs");
const Route$1 = createFileRoute("/service/$id")({
  head: () => ({
    meta: [{
      title: "Service Mode — Church Media"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./playlists._id-1qSBh_R5.mjs");
const Route = createFileRoute("/playlists/$id")({
  head: () => ({
    meta: [{
      title: "Edit Playlist — Church Media"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ShortcutsRoute = Route$7.update({
  id: "/shortcuts",
  path: "/shortcuts",
  getParentRoute: () => Route$8
});
const SettingsRoute = Route$6.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$8
});
const ProjectRoute = Route$5.update({
  id: "/project",
  path: "/project",
  getParentRoute: () => Route$8
});
const PlaylistsRoute = Route$4.update({
  id: "/playlists",
  path: "/playlists",
  getParentRoute: () => Route$8
});
const LibraryRoute = Route$3.update({
  id: "/library",
  path: "/library",
  getParentRoute: () => Route$8
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const ServiceIdRoute = Route$1.update({
  id: "/service/$id",
  path: "/service/$id",
  getParentRoute: () => Route$8
});
const PlaylistsIdRoute = Route.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => PlaylistsRoute
});
const PlaylistsRouteChildren = {
  PlaylistsIdRoute
};
const PlaylistsRouteWithChildren = PlaylistsRoute._addFileChildren(
  PlaylistsRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  LibraryRoute,
  PlaylistsRoute: PlaylistsRouteWithChildren,
  ProjectRoute,
  SettingsRoute,
  ShortcutsRoute,
  ServiceIdRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  renameFolder as $,
  useBibleStore as A,
  BIBLE_BOOKS as B,
  projectVerse as C,
  DEFAULT_SETTINGS as D,
  getBible as E,
  useShortcut as F,
  songLower as G,
  songStem as H,
  Input as I,
  getSongs as J,
  buildSlides as K,
  projectSongSlide as L,
  projectionEvents as M,
  projectionHistory as N,
  useShortcutScope as O,
  useShortcutTooltip as P,
  getChannel as Q,
  touchMedia as R,
  getSettings as S,
  getPlaylist as T,
  duplicatePlaylist as U,
  renamePlaylist as V,
  createPlaylist as W,
  deletePlaylist as X,
  listPlaylists as Y,
  listMediaInFolder as Z,
  listFolders as _,
  useSongsStore as a,
  createFolder as a0,
  deleteFolderDeep as a1,
  deleteFolderOnly as a2,
  moveMedia as a3,
  importFiles as a4,
  formatBytes as a5,
  useMediaFavorites as a6,
  duplicateMedia as a7,
  renameMedia as a8,
  deleteMedia as a9,
  addMediaToPlaylist as aa,
  projectionEngine as ab,
  Route$1 as ac,
  uid as ad,
  updatePlaylistItems as ae,
  Route as af,
  repo as ag,
  router as ah,
  useSettings as b,
  acquireUrl as c,
  db as d,
  DEFAULT_GROUPED_STYLES as e,
  formatCombo as f,
  getMedia as g,
  cn as h,
  DEFAULT_TEXT_STYLE as i,
  useProjection as j,
  Dialog as k,
  listAllMedia as l,
  DialogContent as m,
  DialogHeader as n,
  DialogTitle as o,
  DialogDescription as p,
  formatDuration as q,
  releaseUrl as r,
  DialogFooter as s,
  useTextFormat as t,
  useRegisteredShortcuts as u,
  DEFAULT_BACKGROUND as v,
  DEFAULT_ENGLISH_STYLE as w,
  DEFAULT_TAMIL_STYLE as x,
  DEFAULT_REFERENCE_STYLE as y,
  useWorkspace as z
};
