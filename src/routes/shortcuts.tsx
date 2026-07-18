import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
import {
  Keyboard,
  Search,
  Star,
  Clock,
  TrendingUp,
  AlertTriangle,
  Download,
  Printer,
  BookOpen,
  Music,
  Type,
  Image as ImageIcon,
  ListVideo,
  History,
  Settings,
  Radio,
  LayoutDashboard,
  Palette,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  useRegisteredShortcuts,
  useShortcutMeta,
} from "@/lib/shortcuts/use-shortcut";
import {
  formatCombo,
  shortcutManager,
  type ShortcutCategory,
  type ShortcutDef,
} from "@/lib/shortcuts/manager";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shortcuts")({
  head: () => ({
    meta: [
      { title: "Shortcut Center — Vision Projector" },
      {
        name: "description",
        content:
          "Complete keyboard shortcut reference for Vision Projector. Search, filter, and explore every shortcut.",
      },
    ],
  }),
  component: ShortcutsPage,
});

// ── Category definitions ─────────────────────────────────────────────────────

const ALL_CATEGORIES: { id: ShortcutCategory | "all" | "favorites" | "recent" | "conflict"; label: string; icon: React.ReactNode; hint: string }[] =
  [
    { id: "all", label: "All", icon: <Keyboard className="h-3.5 w-3.5" />, hint: "Every registered shortcut" },
    { id: "favorites", label: "Favorites", icon: <Star className="h-3.5 w-3.5" />, hint: "Starred shortcuts" },
    { id: "recent", label: "Recent", icon: <Clock className="h-3.5 w-3.5" />, hint: "Recently used" },
    { id: "conflict", label: "Conflicts", icon: <AlertTriangle className="h-3.5 w-3.5" />, hint: "Duplicate key bindings" },
    { id: "navigation", label: "Navigation", icon: <LayoutDashboard className="h-3.5 w-3.5" />, hint: "Tabs and routes" },
    { id: "projector", label: "Projector", icon: <Radio className="h-3.5 w-3.5" />, hint: "Projector control" },
    { id: "bible", label: "Bible", icon: <BookOpen className="h-3.5 w-3.5" />, hint: "Bible search & navigation" },
    { id: "songs", label: "Songs", icon: <Music className="h-3.5 w-3.5" />, hint: "Lyrics and song control" },
    { id: "text", label: "Text", icon: <Type className="h-3.5 w-3.5" />, hint: "Free-form text items" },
    { id: "media", label: "Media", icon: <ImageIcon className="h-3.5 w-3.5" />, hint: "Library & playback" },
    { id: "playlist", label: "Playlist", icon: <ListVideo className="h-3.5 w-3.5" />, hint: "Playlist editor" },
    { id: "history", label: "History", icon: <History className="h-3.5 w-3.5" />, hint: "Service history" },
    { id: "themes", label: "Themes", icon: <Palette className="h-3.5 w-3.5" />, hint: "Theme gallery" },
    { id: "window", label: "Window", icon: <LayoutDashboard className="h-3.5 w-3.5" />, hint: "Layout & panels" },
    { id: "general", label: "General", icon: <Settings className="h-3.5 w-3.5" />, hint: "App-wide actions" },
  ];

// ── Row component ─────────────────────────────────────────────────────────────

function ShortcutRow({
  def,
  isFavorite,
  usageCount,
  isConflicted,
  filter,
}: {
  def: ShortcutDef;
  isFavorite: boolean;
  usageCount: number;
  isConflicted: boolean;
  filter: string;
}) {
  const toggleFav = () => shortcutManager.toggleFavorite(def.id);

  const highlight = (text: string) => {
    if (!filter.trim()) return text;
    const regex = new RegExp(`(${filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((p, i) =>
      regex.test(p) ? (
        <mark key={i} className="rounded-sm bg-primary/20 text-primary">
          {p}
        </mark>
      ) : (
        p
      ),
    );
  };

  return (
    <li
      className={cn(
        "group flex items-center justify-between gap-4 px-4 py-2.5 transition-colors duration-75 hover:bg-muted/20",
        isConflicted && "bg-amber-500/5",
      )}
    >
      {/* Favorite star */}
      <button
        onClick={toggleFav}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className={cn(
          "shrink-0 rounded p-0.5 transition-colors",
          isFavorite
            ? "text-amber-400"
            : "text-transparent hover:text-muted-foreground group-hover:text-muted-foreground/50",
        )}
      >
        <Star className={cn("h-3.5 w-3.5", isFavorite && "fill-current")} />
      </button>

      {/* Label */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium">{highlight(def.label)}</span>
          {isConflicted && (
            <span title="Key conflict">
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-400" />
            </span>
          )}
          {usageCount > 0 && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
              ×{usageCount}
            </span>
          )}
        </div>
        {def.description && (
          <div className="truncate text-[10px] text-muted-foreground/60">{def.description}</div>
        )}
        <div className="truncate text-[9px] text-muted-foreground/40">{def.id}</div>
      </div>

      {/* Scope badge */}
      {def.scope && def.scope !== "global" && def.scope !== "workspace" && (
        <span className="shrink-0 rounded border border-border/50 bg-muted/30 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground/60">
          {def.scope}
        </span>
      )}

      {/* Keys */}
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
        {def.keys.map((k) => (
          <kbd
            key={k}
            className="rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] font-medium shadow-sm"
            style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.3)" }}
          >
            {highlight(formatCombo(k))}
          </kbd>
        ))}
      </div>
    </li>
  );
}

// ── Export helpers ────────────────────────────────────────────────────────────

function exportJSON(shortcuts: ShortcutDef[]) {
  const data = shortcuts.map((s) => ({
    id: s.id,
    label: s.label,
    category: s.category,
    keys: s.keys,
    scope: s.scope ?? "global",
    description: s.description ?? "",
  }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vision-projector-shortcuts.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportCSV(shortcuts: ShortcutDef[]) {
  const rows = [
    ["ID", "Label", "Category", "Keys", "Scope", "Description"],
    ...shortcuts.map((s) => [
      s.id,
      s.label,
      s.category,
      s.keys.join(" | "),
      s.scope ?? "global",
      s.description ?? "",
    ]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vision-projector-shortcuts.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Main page ─────────────────────────────────────────────────────────────────

function ShortcutsPage() {
  const all = useRegisteredShortcuts();
  const { recentlyUsed, favoriteIds, usageCounts, conflicts } = useShortcutMeta();
  const [filter, setFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const searchRef = useRef<HTMLInputElement>(null);

  // Listen for focus-search event
  useEffect(() => {
    const h = () => searchRef.current?.focus();
    window.addEventListener("settings:focus-search", h);
    return () => window.removeEventListener("settings:focus-search", h);
  }, []);

  const conflictedIds = useMemo(() => {
    const ids = new Set<string>();
    conflicts.forEach((c) => c.ids.forEach((id) => ids.add(id)));
    return ids;
  }, [conflicts]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let pool = all;

    // Category filter
    if (activeCategory === "favorites") {
      pool = pool.filter((s) => favoriteSet.has(s.id));
    } else if (activeCategory === "recent") {
      const recent = recentlyUsed.map((id) => pool.find((s) => s.id === id)).filter(Boolean) as ShortcutDef[];
      pool = recent;
    } else if (activeCategory === "conflict") {
      pool = pool.filter((s) => conflictedIds.has(s.id));
    } else if (activeCategory !== "all") {
      pool = pool.filter((s) => s.category === activeCategory);
    }

    // Text search
    if (q) {
      pool = pool.filter(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.keys.some((k) => formatCombo(k).toLowerCase().includes(q) || k.toLowerCase().includes(q)) ||
          (s.description ?? "").toLowerCase().includes(q),
      );
    }

    // Sort by label
    if (activeCategory !== "recent") {
      pool = [...pool].sort((a, b) => a.label.localeCompare(b.label));
    }

    return pool;
  }, [all, filter, activeCategory, favoriteSet, recentlyUsed, conflictedIds]);

  // Group by category when in "all" mode
  const grouped = useMemo(() => {
    if (activeCategory !== "all" && !filter.trim()) return null;
    const map = new Map<string, ShortcutDef[]>();
    for (const s of filtered) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return map;
  }, [filtered, activeCategory, filter]);

  const conflictCount = conflicts.length;

  return (
    <div className="h-full overflow-y-auto print:overflow-visible">
      <div className="mx-auto max-w-5xl p-6 print:max-w-full print:p-4">

        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
            <Keyboard className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Shortcut Center</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {all.length} shortcuts registered across {ALL_CATEGORIES.filter((c) => !["all", "favorites", "recent", "conflict"].includes(c.id)).length} categories.
              {conflictCount > 0 && (
                <span className="ml-2 text-amber-400">
                  ⚠️ {conflictCount} conflict{conflictCount !== 1 ? "s" : ""} detected.
                </span>
              )}
            </p>
          </div>
          {/* Export buttons */}
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              title="Print shortcut list"
              className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <button
              onClick={() => exportJSON(all)}
              title="Export as JSON"
              className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
              JSON
            </button>
            <button
              onClick={() => exportCSV(all)}
              title="Export as CSV"
              className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4 print:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            id="shortcuts-search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder='Search by action, key, or category… try "bible" or "Ctrl"'
            className="h-10 pl-9 pr-10"
            autoFocus
          />
          {filter && (
            <button
              onClick={() => setFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="mb-5 flex flex-wrap gap-1.5 print:hidden">
          {ALL_CATEGORIES.map((cat) => {
            const count =
              cat.id === "all"
                ? all.length
                : cat.id === "favorites"
                  ? favoriteIds.length
                  : cat.id === "recent"
                    ? recentlyUsed.length
                    : cat.id === "conflict"
                      ? conflictCount
                      : all.filter((s) => s.category === cat.id).length;
            if (count === 0 && cat.id !== "all") return null;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
                  activeCategory === cat.id
                    ? cat.id === "conflict"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : cat.id === "favorites"
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                        : "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/50 bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <span className={cn(activeCategory === cat.id ? "" : "opacity-60")}>{cat.icon}</span>
                {cat.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                    activeCategory === cat.id ? "bg-primary/20" : "bg-muted/60",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Conflicts banner */}
        {conflictCount > 0 && activeCategory === "conflict" && (
          <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400">
            <strong className="font-semibold">{conflictCount} key conflict{conflictCount !== 1 ? "s" : ""} found.</strong>{" "}
            These shortcuts share the same key combo and scope — only the highest-priority one will fire.
            <ul className="mt-2 space-y-1 text-amber-400/80">
              {conflicts.map((c, i) => (
                <li key={i}>
                  <kbd className="rounded border border-amber-500/30 bg-amber-500/10 px-1 py-0.5 font-mono text-[10px]">
                    {formatCombo(c.combo)}
                  </kbd>{" "}
                  in <span className="font-mono">{c.scope}</span> → {c.ids.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/40 py-16 text-center">
            <Keyboard className="mx-auto h-10 w-10 text-muted-foreground/20" />
            <p className="mt-3 text-sm text-muted-foreground">
              {filter ? `No shortcuts match "${filter}"` : "No shortcuts in this category yet."}
            </p>
            {filter && (
              <button onClick={() => setFilter("")} className="mt-2 text-xs text-primary hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : grouped ? (
          // Grouped by category (all view or search across categories)
          <div className="space-y-4">
            {ALL_CATEGORIES.filter((c) => !["all", "favorites", "recent", "conflict"].includes(c.id)).map((cat) => {
              const items = grouped.get(cat.id as ShortcutCategory);
              if (!items || items.length === 0) return null;
              return (
                <section key={cat.id} className="overflow-hidden rounded-xl border border-border/60 bg-card print:break-inside-avoid">
                  <header className="flex items-center gap-2 border-b border-border/40 bg-muted/20 px-4 py-2.5">
                    <span className="text-muted-foreground">{cat.icon}</span>
                    <h2 className="text-sm font-semibold">{cat.label}</h2>
                    <span className="text-[10px] text-muted-foreground/60">{cat.hint}</span>
                    <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      {items.length}
                    </span>
                  </header>
                  <ul className="divide-y divide-border/40">
                    {items.map((s) => (
                      <ShortcutRow
                        key={s.id}
                        def={s}
                        isFavorite={favoriteSet.has(s.id)}
                        usageCount={usageCounts.get(s.id) ?? 0}
                        isConflicted={conflictedIds.has(s.id)}
                        filter={filter}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          // Flat list (single category or recent)
          <section className="overflow-hidden rounded-xl border border-border/60 bg-card">
            <ul className="divide-y divide-border/40">
              {filtered.map((s) => (
                <ShortcutRow
                  key={s.id}
                  def={s}
                  isFavorite={favoriteSet.has(s.id)}
                  usageCount={usageCounts.get(s.id) ?? 0}
                  isConflicted={conflictedIds.has(s.id)}
                  filter={filter}
                />
              ))}
            </ul>
          </section>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-[10px] text-muted-foreground/40 print:hidden">
          Showing {filtered.length} of {all.length} shortcuts · Press{" "}
          <kbd className="rounded border border-border/40 bg-muted/30 px-1 py-0.5 font-mono text-[9px]">Ctrl+Shift+Space</kbd> for the Command Palette
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          kbd { border: 1px solid #ccc; background: #f5f5f5; color: black; }
        }
      `}</style>
    </div>
  );
}
