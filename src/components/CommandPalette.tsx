/**
 * CommandPalette — VS Code-style command palette.
 *
 * Trigger: Ctrl+Shift+Space (or Alt+K) fires a CustomEvent "command-palette:open"
 * which this component listens to.
 *
 * Features:
 *   - Fuzzy search over all registered shortcuts
 *   - Extra static commands (navigation, actions)
 *   - Keyboard: ArrowUp/Down to navigate, Enter to execute, Escape to close
 *   - Premium design: glass blur, animated entry, shortcut badge
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  ArrowRight,
  Keyboard,
  BookOpen,
  Music,
  Type,
  Image as ImageIcon,
  ListVideo,
  History,
  Settings,
  Radio,
  MonitorStop,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Star,
  Palette,
} from "lucide-react";
import { useRegisteredShortcuts } from "@/lib/shortcuts/use-shortcut";
import { shortcutManager, formatCombo, type ShortcutDef } from "@/lib/shortcuts/manager";
import { cn } from "@/lib/utils";

// ── Static commands not tied to a registered shortcut ──────────────────────

interface StaticCommand {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

// Icons map for categories
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  navigation: <ArrowRight className="h-3.5 w-3.5" />,
  projector: <Radio className="h-3.5 w-3.5" />,
  media: <ImageIcon className="h-3.5 w-3.5" />,
  bible: <BookOpen className="h-3.5 w-3.5" />,
  songs: <Music className="h-3.5 w-3.5" />,
  text: <Type className="h-3.5 w-3.5" />,
  playlist: <ListVideo className="h-3.5 w-3.5" />,
  playlists: <ListVideo className="h-3.5 w-3.5" />,
  history: <History className="h-3.5 w-3.5" />,
  themes: <Palette className="h-3.5 w-3.5" />,
  window: <Settings className="h-3.5 w-3.5" />,
  general: <Keyboard className="h-3.5 w-3.5" />,
  favorites: <Star className="h-3.5 w-3.5" />,
};

/** Fuzzy-ish search: returns score 0..100 */
function scoreMatch(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 50;
  // Check if all chars in query appear in order in text
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  if (qi === q.length) return 20;
  return 0;
}

function scoreShortcut(query: string, def: ShortcutDef): number {
  const scores = [
    scoreMatch(query, def.label),
    scoreMatch(query, def.id),
    scoreMatch(query, def.category),
    scoreMatch(query, def.description ?? ""),
    def.keys.some((k) => scoreMatch(query, k) > 0) ? 30 : 0,
  ];
  return Math.max(...scores);
}

// ── Main component ──────────────────────────────────────────────────────────

export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const allShortcuts = useRegisteredShortcuts();

  // Build static commands from navigate
  const staticCommands = useMemo<StaticCommand[]>(
    () => [
      {
        id: "cmd.go.library",
        label: "Go to Library",
        category: "navigation",
        icon: <ImageIcon className="h-3.5 w-3.5" />,
        action: () => void navigate({ to: "/library" }),
        keywords: ["media", "library"],
      },
      {
        id: "cmd.go.playlists",
        label: "Go to Playlists",
        category: "navigation",
        icon: <ListVideo className="h-3.5 w-3.5" />,
        action: () => void navigate({ to: "/playlists" }),
        keywords: ["playlist"],
      },
      {
        id: "cmd.go.history",
        label: "Go to History",
        category: "navigation",
        icon: <History className="h-3.5 w-3.5" />,
        action: () => void navigate({ to: "/history" }),
        keywords: ["sessions", "history", "service"],
      },
      {
        id: "cmd.go.settings",
        label: "Go to Settings",
        category: "navigation",
        icon: <Settings className="h-3.5 w-3.5" />,
        action: () => void navigate({ to: "/settings" }),
        keywords: ["preferences", "config"],
      },
      {
        id: "cmd.go.project",
        label: "Go to Project Workspace",
        category: "navigation",
        icon: <Radio className="h-3.5 w-3.5" />,
        action: () => void navigate({ to: "/project" }),
        keywords: ["projector", "workspace", "live"],
      },
      {
        id: "cmd.go.shortcuts",
        label: "Open Shortcut Center",
        category: "navigation",
        icon: <Keyboard className="h-3.5 w-3.5" />,
        action: () => void navigate({ to: "/shortcuts" }),
        keywords: ["keyboard", "shortcuts", "help"],
      },
    ],
    [navigate],
  );

  // Merge shortcuts + static commands into a unified list
  type ResultItem =
    | { kind: "shortcut"; def: ShortcutDef; score: number }
    | { kind: "command"; cmd: StaticCommand; score: number };

  const results = useMemo<ResultItem[]>(() => {
    if (!query.trim()) {
      // Show recently used + most used + static commands when no query
      const recentIds = shortcutManager.getMetaSnapshot().recentlyUsed;
      const recent = recentIds
        .map((id) => allShortcuts.find((s) => s.id === id))
        .filter((s): s is ShortcutDef => !!s)
        .map((def) => ({ kind: "shortcut" as const, def, score: 100 }));
      const statics = staticCommands.map((cmd) => ({ kind: "command" as const, cmd, score: 50 }));
      return [...recent, ...statics].slice(0, 12);
    }

    const shortcutResults: ResultItem[] = allShortcuts
      .map((def) => ({ kind: "shortcut" as const, def, score: scoreShortcut(query, def) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    const staticResults: ResultItem[] = staticCommands
      .map((cmd) => ({
        kind: "command" as const,
        cmd,
        score: Math.max(
          scoreMatch(query, cmd.label),
          ...(cmd.keywords ?? []).map((k) => scoreMatch(query, k)),
        ),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return [...shortcutResults, ...staticResults].slice(0, 20);
  }, [query, allShortcuts, staticCommands]);

  // Reset active index when results change
  useEffect(() => setActiveIdx(0), [results.length]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIdx(0);
  }, []);

  const execute = useCallback(
    (item: ResultItem) => {
      close();
      if (item.kind === "command") {
        setTimeout(() => item.cmd.action(), 50);
      } else {
        // Fire the shortcut handler directly
        setTimeout(() => {
          const def = allShortcuts.find((s) => s.id === item.def.id);
          if (def) def.handler(new KeyboardEvent("keydown"));
        }, 50);
      }
    },
    [close, allShortcuts],
  );

  // Listen for "command-palette:open" global event
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 30);
    };
    window.addEventListener("command-palette:open", handler);
    return () => window.removeEventListener("command-palette:open", handler);
  }, []);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = results[activeIdx];
        if (item) execute(item);
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true } as never);
  }, [open, results, activeIdx, execute, close]);

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector(`[data-active="true"]`) as HTMLElement | null;
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={close}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/60 shadow-2xl"
        style={{
          background: "rgba(12,12,18,0.96)",
          backdropFilter: "blur(24px)",
          animation: "cp-enter 0.15s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-2.5 border-b border-border/40 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, shortcuts, navigation…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            aria-label="Command palette search"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="shrink-0 rounded border border-border/50 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto py-1.5" role="listbox">
          {results.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
              <Search className="h-8 w-8 opacity-20" />
              <span>No results for &ldquo;{query}&rdquo;</span>
            </div>
          )}

          {!query.trim() && results.length > 0 && (
            <div className="px-3 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Recent &amp; Suggestions
            </div>
          )}

          {results.map((item, i) => {
            const isActive = i === activeIdx;
            if (item.kind === "shortcut") {
              const def = item.def;
              const icon = CATEGORY_ICONS[def.category] ?? <Keyboard className="h-3.5 w-3.5" />;
              return (
                <button
                  key={def.id}
                  data-active={isActive}
                  onClick={() => execute(item)}
                  onMouseEnter={() => setActiveIdx(i)}
                  role="option"
                  aria-selected={isActive}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors duration-75",
                    isActive
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                      isActive ? "bg-primary/20 text-primary" : "bg-muted/40",
                    )}
                  >
                    {icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">{def.label}</span>
                    {def.description && (
                      <span className="block truncate text-[10px] text-muted-foreground/60">
                        {def.description}
                      </span>
                    )}
                  </span>
                  {def.keys.length > 0 && (
                    <span className="flex shrink-0 items-center gap-1">
                      {def.keys.slice(0, 2).map((k) => (
                        <kbd
                          key={k}
                          className="rounded border border-border/40 bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/70"
                        >
                          {formatCombo(k)}
                        </kbd>
                      ))}
                    </span>
                  )}
                </button>
              );
            } else {
              const cmd = item.cmd;
              return (
                <button
                  key={cmd.id}
                  data-active={isActive}
                  onClick={() => execute(item)}
                  onMouseEnter={() => setActiveIdx(i)}
                  role="option"
                  aria-selected={isActive}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors duration-75",
                    isActive
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                      isActive ? "bg-primary/20 text-primary" : "bg-muted/40",
                    )}
                  >
                    {cmd.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">{cmd.label}</span>
                    <span className="block truncate text-[10px] text-muted-foreground/60">
                      {cmd.category}
                    </span>
                  </span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                </button>
              );
            }
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-border/30 px-4 py-2">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <kbd className="rounded border border-border/40 bg-muted/30 px-1 py-0.5 font-mono text-[9px]">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <kbd className="rounded border border-border/40 bg-muted/30 px-1 py-0.5 font-mono text-[9px]">↵</kbd>
            execute
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <kbd className="rounded border border-border/40 bg-muted/30 px-1 py-0.5 font-mono text-[9px]">Esc</kbd>
            close
          </span>
          <span className="ml-auto text-[10px] text-muted-foreground/30">
            Ctrl+Shift+Space
          </span>
        </div>
      </div>

      <style>{`
        @keyframes cp-enter {
          from { opacity: 0; transform: scale(0.97) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
