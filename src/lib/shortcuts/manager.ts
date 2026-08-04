/**
 * Centralised application-wide keyboard shortcut manager.
 *
 * Modules never bind `window.addEventListener("keydown", ...)` directly.
 * They `register(shortcut)` and the manager dispatches matching events
 * exactly once, respecting active scopes / priorities and ignoring keys
 * typed into text inputs unless `allowInInput` is set.
 *
 * Future Settings UI can list/edit every registered shortcut by reading
 * `listShortcuts()` — no per-module wiring required.
 */
export type ShortcutCategory =
  | "general"
  | "navigation"
  | "media"
  | "playlist"
  | "playlists"
  | "projector"
  | "bible"
  | "songs"
  | "text"
  | "favorites"
  | "themes"
  | "history"
  | "window";

/** Logical scope under which a shortcut is active. */
export type ShortcutScope =
  | "global"
  | "workspace"
  | "playlist-editor"
  | "service-mode"
  | "bible"
  | "songs"
  | "text"
  | "media"
  | "history"
  | "theme-gallery";

export interface ShortcutDef {
  /** Stable id, e.g. "tabs.media". */
  id: string;
  /** Human-readable label for help dialog. */
  label: string;
  category: ShortcutCategory;
  /**
   * Key combo descriptor. Multiple combos can map to the same id.
   *   "Alt+1" | "Ctrl+Enter" | "Escape" | "ArrowLeft" | "Space" | "Delete"
   * Modifiers: Ctrl, Meta (Cmd), Alt, Shift. `Mod` matches Ctrl OR Meta.
   */
  keys: string[];
  scope?: ShortcutScope;
  /** Defaults to false. Set true for shortcuts you want active inside <input>. */
  allowInInput?: boolean;
  /** Called when matched. Return false to allow further handlers; default: stop. */
  handler: (e: KeyboardEvent) => void | boolean;
  /** Higher runs first. Default 0. */
  priority?: number;
  /** Brief description shown in Shortcut Center. */
  description?: string;
}

/** A conflict is two shortcuts sharing an identical key combo + scope. */
export interface ShortcutConflict {
  combo: string;
  scope: ShortcutScope;
  ids: string[];
}

interface ParsedCombo {
  key: string;
  ctrl: boolean;
  meta: boolean;
  mod: boolean; // Ctrl OR Meta
  alt: boolean;
  shift: boolean;
}

function normaliseKey(k: string): string {
  const v = k.trim();
  const map: Record<string, string> = {
    space: " ",
    spacebar: " ",
    esc: "escape",
    del: "delete",
    return: "enter",
    left: "arrowleft",
    right: "arrowright",
    up: "arrowup",
    down: "arrowdown",
  };
  const lower = v.toLowerCase();
  return map[lower] ?? lower;
}

function parseCombo(combo: string): ParsedCombo {
  const parts = combo.split("+").map((p) => p.trim());
  const out: ParsedCombo = {
    key: "",
    ctrl: false,
    meta: false,
    mod: false,
    alt: false,
    shift: false,
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

/** Normalise a combo string for conflict comparison */
function canonicalCombo(combo: string): string {
  const c = parseCombo(combo);
  const mods: string[] = [];
  if (c.mod) mods.push("mod");
  else {
    if (c.ctrl) mods.push("ctrl");
    if (c.meta) mods.push("meta");
  }
  if (c.alt) mods.push("alt");
  if (c.shift) mods.push("shift");
  mods.push(c.key);
  return mods.join("+");
}

function eventMatches(e: KeyboardEvent, c: ParsedCombo): boolean {
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

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

const MAX_RECENT = 10;

export interface ShortcutMetaSnapshot {
  recentlyUsed: string[];
  favoriteIds: string[];
  usageCounts: Map<string, number>;
  conflicts: ShortcutConflict[];
}

class ShortcutManagerImpl {
  private shortcuts = new Map<string, ShortcutDef>();
  private parsed = new Map<string, ParsedCombo[]>();
  private activeScopes = new Set<ShortcutScope>(["global", "workspace"]);
  private installed = false;
  private listeners = new Set<() => void>();
  private snapshot: ShortcutDef[] = [];
  private metaSnapshot: ShortcutMetaSnapshot = {
    recentlyUsed: [],
    favoriteIds: [],
    usageCounts: new Map(),
    conflicts: [],
  };

  /** Usage count per shortcut ID */
  private usageCounts = new Map<string, number>();
  /** Recently fired shortcut IDs (most-recent first) */
  private recentlyUsed: string[] = [];
  /** Favorited shortcut IDs (persisted in localStorage) */
  private favoriteIds: Set<string>;

  constructor() {
    // Restore favorites from localStorage
    const stored =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("vp-shortcut-favorites")
        : null;
    try {
      this.favoriteIds = new Set(stored ? (JSON.parse(stored) as string[]) : []);
    } catch {
      this.favoriteIds = new Set();
    }
    this.refreshMetaSnapshot();
  }

  install(): void {
    if (this.installed || typeof window === "undefined") return;
    this.installed = true;
    window.addEventListener("keydown", this.onKey, { capture: true });
  }
  uninstall(): void {
    if (!this.installed || typeof window === "undefined") return;
    this.installed = false;
    window.removeEventListener("keydown", this.onKey, { capture: true } as never);
  }

  register(def: ShortcutDef): () => void {
    this.shortcuts.set(def.id, def);
    this.parsed.set(def.id, def.keys.map(parseCombo));
    this.refreshSnapshot();
    return () => this.unregister(def.id);
  }
  unregister(id: string): void {
    this.shortcuts.delete(id);
    this.parsed.delete(id);
    this.refreshSnapshot();
  }
  list(): ShortcutDef[] {
    return this.snapshot;
  }

  setScopeActive(scope: ShortcutScope, active: boolean): void {
    if (active) this.activeScopes.add(scope);
    else this.activeScopes.delete(scope);
  }
  isScopeActive(scope: ShortcutScope): boolean {
    return this.activeScopes.has(scope);
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  private refreshSnapshot(): void {
    this.snapshot = Array.from(this.shortcuts.values());
    this.refreshMetaSnapshot();
  }

  private refreshMetaSnapshot(): void {
    this.metaSnapshot = {
      recentlyUsed: [...this.recentlyUsed],
      favoriteIds: [...this.favoriteIds],
      usageCounts: new Map(this.usageCounts),
      conflicts: this.computeConflicts(),
    };
    for (const l of this.listeners) l();
  }

  // ── Usage tracking ──────────────────────────────────────────────────────────

  getUsageCount(id: string): number {
    return this.usageCounts.get(id) ?? 0;
  }

  getMetaSnapshot(): ShortcutMetaSnapshot {
    return this.metaSnapshot;
  }

  private recordUsage(id: string): void {
    this.usageCounts.set(id, (this.usageCounts.get(id) ?? 0) + 1);
    this.recentlyUsed = [id, ...this.recentlyUsed.filter((x) => x !== id)].slice(0, MAX_RECENT);
    this.refreshMetaSnapshot();
  }

  // ── Favorites ───────────────────────────────────────────────────────────────

  isFavorite(id: string): boolean {
    return this.favoriteIds.has(id);
  }

  toggleFavorite(id: string): void {
    if (this.favoriteIds.has(id)) this.favoriteIds.delete(id);
    else this.favoriteIds.add(id);
    this.persistFavorites();
    this.refreshMetaSnapshot();
  }

  private persistFavorites(): void {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem("vp-shortcut-favorites", JSON.stringify([...this.favoriteIds]));
    } catch {
      /* ignore */
    }
  }

  // ── Conflict detection ──────────────────────────────────────────────────────

  private computeConflicts(): ShortcutConflict[] {
    // Map of "scope::canonical-combo" → [ids...]
    const map = new Map<string, string[]>();
    for (const def of this.shortcuts.values()) {
      const scope = def.scope ?? "global";
      for (const key of def.keys) {
        const canonical = canonicalCombo(key);
        const k = `${scope}::${canonical}`;
        const arr = map.get(k) ?? [];
        arr.push(def.id);
        map.set(k, arr);
      }
    }
    const conflicts: ShortcutConflict[] = [];
    for (const [key, ids] of map.entries()) {
      if (ids.length > 1) {
        const [scopeStr, combo] = key.split("::");
        conflicts.push({ combo, scope: scopeStr as ShortcutScope, ids });
      }
    }
    return conflicts;
  }

  // ── Key dispatch ─────────────────────────────────────────────────────────────

  private onKey = (e: KeyboardEvent): void => {
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
            this.recordUsage(def.id);
            return;
          }
        }
      }
    }
  };
}

export const shortcutManager = new ShortcutManagerImpl();

/** Pretty-print a combo for the help dialog. */
export function formatCombo(combo: string): string {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return combo
    .split("+")
    .map((p) => {
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
      if (lp === "backspace") return "⌫";
      if (lp === "tab") return "Tab";
      return p.trim().length === 1 ? p.trim().toUpperCase() : p.trim();
    })
    .join(isMac ? "" : " + ");
}
