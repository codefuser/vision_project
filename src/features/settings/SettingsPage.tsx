import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Search, Settings, RotateCcw, Download, Upload, Database, Keyboard,
  Monitor, Moon, Sun, ChevronRight, X, Star, History, Undo2, Redo2,
  Shield, Key, Wifi, Lock, Globe, HardDrive, Info, BookOpen, Palette,
  MonitorPlay, Type, Sparkles, Music, Image, Zap, Volume2, Video,
  Sliders, ArrowLeft, ArrowRight, ExternalLink, Github,
} from "lucide-react";
import { useSettings } from "@/stores/settings.store";
import { db, DEFAULT_SETTINGS, type AppSettings } from "@/db/schema";
import { exportBackup, importBackup } from "@/features/backup/backup";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SETTINGS, CATEGORY_META } from "./settings-defs";
import type { SettingDef } from "./settings-defs";
import {
  SettingToggle, SettingSlider, SettingSelect, SettingInput, SettingColor,
  SettingCard, StatCard,
} from "./SettingsControls";

/* ═══════════════════════════════════════════════════
   Custom Hooks
   ═══════════════════════════════════════════════════ */

const MAX_UNDO = 50;
const FAV_KEY = "church-media-settings-favorites";
const RECENT_KEY = "church-media-settings-recent";

function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]")); }
    catch { return new Set<string>(); }
  });
  const toggle = useCallback((key: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);
  return { favs, toggle };
}

function useUndoRedo(initial: AppSettings, onApply: (s: AppSettings) => void) {
  const stackRef = useRef<AppSettings[]>([initial]);
  const idxRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const push = useCallback((s: AppSettings) => {
    const idx = idxRef.current;
    stackRef.current = stackRef.current.slice(0, idx + 1);
    stackRef.current.push(s);
    if (stackRef.current.length > MAX_UNDO) stackRef.current.shift();
    idxRef.current = stackRef.current.length - 1;
    setCanUndo(idxRef.current > 0);
    setCanRedo(false);
  }, []);

  const undo = useCallback(() => {
    if (idxRef.current <= 0) return;
    idxRef.current--;
    onApply(stackRef.current[idxRef.current]);
    setCanUndo(idxRef.current > 0);
    setCanRedo(true);
  }, [onApply]);

  const redo = useCallback(() => {
    if (idxRef.current >= stackRef.current.length - 1) return;
    idxRef.current++;
    onApply(stackRef.current[idxRef.current]);
    setCanUndo(true);
    setCanRedo(idxRef.current < stackRef.current.length - 1);
  }, [onApply]);

  return { push, undo, redo, canUndo, canRedo };
}

function useRecentChanges() {
  const [recent, setRecent] = useState<Map<string, number>>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "{}");
      return new Map(Object.entries(raw));
    } catch { return new Map<string, number>(); }
  });
  const mark = useCallback((key: string) => {
    setRecent((prev) => {
      const next = new Map(prev);
      next.set(key, Date.now());
      const obj: Record<string, number> = {};
      for (const [k, v] of next) obj[k] = v;
      localStorage.setItem(RECENT_KEY, JSON.stringify(obj));
      return next;
    });
  }, []);
  return { recent, mark };
}

/* ═══════════════════════════════════════════════════
   Search Engine
   ═══════════════════════════════════════════════════ */

interface SearchHit {
  def: SettingDef;
  score: number;
}

function searchSettings(query: string): SearchHit[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const qWords = q.split(/\s+/).filter(Boolean);
  const results: SearchHit[] = [];

  for (const def of SETTINGS) {
    const haystacks = [
      def.title.toLowerCase(),
      def.description.toLowerCase(),
      ...def.keywords.map((k) => k.toLowerCase()),
      ...def.aliases.map((a) => a.toLowerCase()),
      ...def.tags.map((t) => t.toLowerCase()),
    ];
    let score = 0;
    for (const h of haystacks) {
      if (h === q) { score = Math.max(score, 100); break; }
      if (h.startsWith(q)) { score = Math.max(score, 50); continue; }
      if (h.includes(q)) { score = Math.max(score, 20); continue; }
      for (const w of qWords) {
        if (h.includes(w)) { score = Math.max(score, 5); }
      }
    }
    if (score > 0) results.push({ def, score });
  }
  return results.sort((a, b) => b.score - a.score);
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${q})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <span key={i} className="rounded-sm bg-primary/20 font-medium text-primary">{p}</span>
      : p,
  );
}

/* ═══════════════════════════════════════════════════
   Control Router
   ═══════════════════════════════════════════════════ */

function renderControl(
  def: SettingDef,
  value: unknown,
  onChange: (v: unknown) => void,
  starred?: boolean,
  onStar?: () => void,
) {
  const props = { def, starred, onStar };
  switch (def.type) {
    case "toggle":
      return <SettingToggle {...props} value={!!value} onChange={onChange as (v: boolean) => void} />;
    case "slider":
      return <SettingSlider {...props} value={Number(value)} onChange={onChange as (v: number) => void} />;
    case "select":
      return <SettingSelect {...props} value={String(value)} onChange={onChange as (v: string) => void} />;
    case "input":
    case "number":
      return <SettingInput {...props} value={value as string | number} onChange={onChange as (v: string) => void} />;
    case "color":
      return <SettingColor {...props} value={String(value)} onChange={onChange as (v: string) => void} />;
  }
}

/* ═══════════════════════════════════════════════════
   Main Settings Page
   ═══════════════════════════════════════════════════ */

export function SettingsPage() {
  const { settings, update, load, loaded } = useSettings();
  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("general");
  const [busy, setBusy] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [dbSize, setDbSize] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "favorites" | "recent">("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionsRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  const { favs, toggle: toggleFav } = useFavorites();
  const { recent, mark: markRecent } = useRecentChanges();

  /* ── Undo/Redo ── */
  const applyDirect = useCallback(async (s: AppSettings) => {
    savingRef.current = true;
    setSaving(true);
    try { await update(s as unknown as Partial<AppSettings>); }
    catch (e) { toast.error("Failed: " + (e as Error).message); }
    finally { savingRef.current = false; setSaving(false); }
  }, [update]);

  const { push: pushHistory, undo, redo, canUndo, canRedo } = useUndoRedo(settings, applyDirect);

  /* ── Load settings on mount ── */
  useEffect(() => {
    if (!loaded) void load();
  }, [load, loaded]);

  /* ── DB stats ── */
  useEffect(() => {
    (async () => {
      try {
        const [media, folders, playlists, blobs, songs, bible] = await Promise.all([
          db().media.count(), db().folders.count(), db().playlists.count(),
          db().blobs.toArray(), Promise.resolve(0), Promise.resolve(0),
        ]);
        const totalBytes = blobs.reduce((s, b) => s + (b.blob.size ?? 0), 0);
        setStats({ media, folders, playlists, storage: totalBytes / (1024 * 1024) });
      } catch { /* */ }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const est = await navigator.storage?.estimate?.();
        if (est?.usage != null) setDbSize(`${(est.usage / (1024 * 1024)).toFixed(0)} MB`);
      } catch { /* */ }
    })();
  }, []);

  /* ── Keyboard shortcuts (undo/redo) ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  /* ── Handler: change a single setting ── */
  const handleChange = useCallback((key: keyof AppSettings, value: unknown) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    const patch = { [key]: value } as Partial<AppSettings>;
    update(patch)
      .then(() => { markRecent(key); pushHistory({ ...settings, ...patch } as AppSettings); })
      .catch((e) => toast.error("Failed to save: " + (e as Error).message))
      .finally(() => { savingRef.current = false; setSaving(false); });
  }, [update, settings, markRecent, pushHistory]);

  /* ── Scrolling ── */
  const scrollToSection = useCallback((catId: string) => {
    const el = document.getElementById(`section-${catId}`);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); setActiveSection(catId); }
  }, []);

  /* ── IntersectionObserver ── */
  useEffect(() => {
    if (!scrollRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) sectionsRef.current.set(e.target.id, e);
        const visible = Array.from(sectionsRef.current.values())
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id.replace("section-", ""));
      },
      { root: scrollRef.current, threshold: 0, rootMargin: "-48px 0px -60% 0px" },
    );
    const ids = Object.keys(CATEGORY_META);
    for (const id of ids) {
      document.getElementById(`section-${id}`) && observer.observe(document.getElementById(`section-${id}`)!);
    }
    return () => observer.disconnect();
  }, [loaded, search, viewMode]);

  /* ── Search ── */
  const searchHits = useMemo(() => searchSettings(search), [search]);
  const hitKeys = useMemo(() => {
    if (!search.trim()) return null;
    return new Set(searchHits.map((h) => h.def.key));
  }, [search, searchHits]);

  const visibleCategories = useMemo(() => {
    if (viewMode === "favorites") return Object.entries(CATEGORY_META).filter(([, meta]) =>
      SETTINGS.some((s) => s.category === meta.title.toLowerCase() && favs.has(s.key)),
    );
    if (search.trim()) {
      const cats = new Set(searchHits.map((h) => h.def.category));
      return Object.entries(CATEGORY_META).filter(([id]) => cats.has(id));
    }
    return Object.entries(CATEGORY_META);
  }, [viewMode, search, searchHits, favs]);

  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchHits.length > 0) scrollToSection(searchHits[0].def.category);
  };

  /* ── Category settings map ── */
  const settingsByCategory = useMemo(() => {
    const map = new Map<string, SettingDef[]>();
    for (const s of SETTINGS) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return map;
  }, []);

  /* ── Reset handlers ── */
  const restoreDefaults = async () => {
    if (!confirm("Reset all settings to their default values? Changes cannot be undone.")) return;
    setSaving(true);
    try { await update(DEFAULT_SETTINGS); toast.success("All settings restored to defaults"); }
    catch (e) { toast.error("Reset failed: " + (e as Error).message); }
    finally { setSaving(false); }
  };

  const resetSection = async (catId: string) => {
    const defs = settingsByCategory.get(catId) ?? [];
    const patch: Partial<AppSettings> = {};
    for (const d of defs) {
      (patch as Record<string, unknown>)[d.key] = (DEFAULT_SETTINGS as unknown as Record<string, unknown>)[d.key];
    }
    setSaving(true);
    try { await update(patch); toast.success("Section reset to defaults"); }
    catch (e) { toast.error("Reset failed: " + (e as Error).message); }
    finally { setSaving(false); }
  };

  /* ── Backup/Import/Wipe ── */
  const onExport = async () => {
    setBusy("export");
    try {
      const blob = await exportBackup();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `vision-projector-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click(); URL.revokeObjectURL(url); toast.success("Backup downloaded");
    } catch (e) { toast.error("Export failed: " + (e as Error).message); }
    finally { setBusy(null); }
  };

  const onImport = async (file: File) => {
    const mode = confirm("Replace existing library? Cancel to merge.") ? "replace" as const : "merge" as const;
    setBusy("import");
    try {
      await importBackup(file, { mode });
      toast.success("Backup restored – reloading…");
      setTimeout(() => window.location.reload(), 500);
    } catch (e) { toast.error("Import failed: " + (e as Error).message); setBusy(null); }
  };

  const wipeAll = async () => {
    if (!confirm("Delete ALL local data? This cannot be undone.")) return;
    await db().delete();
    window.location.reload();
  };

  /* ── Loading ── */
  if (!loaded) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading settings…</p>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════ */

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* ─── SIDEBAR ─── */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-muted/8">
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-border/40 px-4">
          <Settings className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Settings</span>
          <div className={cn("ml-auto flex items-center gap-1", { "opacity-0": !saving })}>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          </div>
        </div>

        {/* Undo/Redo toolbar */}
        <div className="flex items-center gap-0.5 border-b border-border/20 px-2 py-1.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="cursor-pointer rounded p-1 text-muted-foreground/50 transition-colors hover:bg-accent/50 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="cursor-pointer rounded p-1 text-muted-foreground/50 transition-colors hover:bg-accent/50 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          <div className="ml-auto flex gap-0.5">
            <button
              onClick={() => setViewMode("all")}
              className={cn("cursor-pointer rounded px-2 py-1 text-[11px] font-medium transition-colors", viewMode === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground/50 hover:text-foreground")}
            >All</button>
            <button
              onClick={() => setViewMode("favorites")}
              className={cn("cursor-pointer rounded px-2 py-1 text-[11px] font-medium transition-colors", viewMode === "favorites" ? "bg-amber-500/10 text-amber-500" : "text-muted-foreground/50 hover:text-foreground")}
            ><Star className="mr-0.5 inline h-3 w-3 fill-current" />{favs.size}</button>
            <button
              onClick={() => setViewMode("recent")}
              className={cn("cursor-pointer rounded px-2 py-1 text-[11px] font-medium transition-colors", viewMode === "recent" ? "bg-primary/10 text-primary" : "text-muted-foreground/50 hover:text-foreground")}
            ><History className="mr-0.5 inline h-3 w-3" /></button>
          </div>
        </div>

        {/* Search */}
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search settings…"
              className="h-8 w-full rounded-md border border-border/40 bg-background/60 pl-8 pr-7 text-xs text-foreground outline-none placeholder:text-muted-foreground/30 transition-colors focus:border-primary/30 focus:bg-background focus:ring-1 focus:ring-primary/15"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); searchInputRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/30 hover:text-muted-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Category nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-3">
          {visibleCategories.map(([id, meta]) => {
            const active = activeSection === id;
            const Icon = meta.icon;
            return (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-xs font-medium transition-all duration-150",
                  active
                    ? "bg-primary/8 text-primary shadow-xs"
                    : "text-muted-foreground/60 hover:bg-accent/40 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{meta.title}</span>
                {active && <ChevronRight className="ml-auto h-3 w-3 shrink-0 text-primary/50" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border/30 px-3 py-2.5">
          <button
            onClick={restoreDefaults}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground/50 transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All Settings
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header bar */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/30 px-6">
          <h1 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {search ? (
              <>{highlightMatch(`"${search}"`, search)} <span className="text-[11px] font-normal text-muted-foreground/45">{searchHits.length} setting{searchHits.length !== 1 ? "s" : ""}</span></>
            ) : viewMode === "favorites" ? (
              <><Star className="h-3.5 w-3.5 text-amber-400" /> Favorites</>
            ) : viewMode === "recent" ? (
              <><History className="h-3.5 w-3.5" /> Recently Changed</>
            ) : "Settings"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground/40">
              {saving ? "Saving…" : "All changes saved"}
            </span>
            <div className={cn("h-1.5 w-1.5 rounded-full", saving ? "bg-amber-500" : "bg-emerald-500")} />
          </div>
        </div>

        {/* Scrollable area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-6">
            {/* Empty search */}
            {search && searchHits.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-20">
                <Search className="h-10 w-10 text-muted-foreground/15" />
                <p className="text-sm text-muted-foreground/45">No settings match "{search}"</p>
                <p className="text-xs text-muted-foreground/30">Try different keywords</p>
              </div>
            )}

            {/* Render categories */}
            {viewMode === "recent" ? (
              /* ── Recent Changes view ── */
              <RecentChangesView
                recent={recent}
                settings={settings}
                search={search}
                handleChange={handleChange}
                favs={favs}
                toggleFav={toggleFav}
              />
            ) : (
              /* ── Normal / Favorites view ── */
              Object.entries(CATEGORY_META).map(([id, meta]) => {
                const defs = settingsByCategory.get(id) ?? [];
                const visible = defs.filter((d) => !hitKeys || hitKeys.has(d.key));
                if (viewMode === "favorites") {
                  const favDefs = defs.filter((d) => favs.has(d.key));
                  if (favDefs.length === 0) return null;
                  return (
                    <CategorySection
                      key={id}
                      id={id}
                      meta={meta}
                      defs={favDefs}
                      settings={settings}
                      search={search}
                      handleChange={handleChange}
                      favs={favs}
                      toggleFav={toggleFav}
                      resetSection={() => resetSection(id)}
                    />
                  );
                }
                if (hitKeys && visible.length === 0) return null;
                return (
                  <CategorySection
                    key={id}
                    id={id}
                    meta={meta}
                    defs={visible}
                    settings={settings}
                    search={search}
                    handleChange={handleChange}
                    favs={favs}
                    toggleFav={toggleFav}
                    resetSection={() => resetSection(id)}
                  />
                );
              })
            )}

            {/* ── Utility sections (hidden during search) ── */}
            {!search.trim() && viewMode !== "recent" && viewMode !== "favorites" && (
              <>
                <UtilityKeyboardShortcuts />
                <UtilityRemoteControl />
                <UtilityBackup onExport={onExport} onImport={onImport} busy={busy} />
                <UtilityStorage stats={stats} dbSize={dbSize} wipeAll={wipeAll} />
                <UtilitySecurity />
                <UtilityAdvanced />
                <UtilityAbout dbSize={dbSize} />
              </>
            )}

            <div className="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Category Section Component
   ═══════════════════════════════════════════════════ */

function CategorySection({
  id, meta, defs, settings, search, handleChange, favs, toggleFav, resetSection,
}: {
  id: string; meta: { title: string; icon: typeof Settings }; defs: SettingDef[];
  settings: AppSettings; search: string; handleChange: (k: keyof AppSettings, v: unknown) => void;
  favs: Set<string>; toggleFav: (k: string) => void; resetSection: () => void;
}) {
  return (
    <section id={`section-${id}`} className="scroll-mt-12">
      <div className="mb-3 mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <meta.icon className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">{highlightMatch(meta.title, search)}</h2>
        </div>
        <button
          onClick={resetSection}
          className="cursor-pointer rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground/40 transition-colors hover:bg-accent/50 hover:text-muted-foreground"
        >
          Reset section
        </button>
      </div>
      <div className="rounded-lg border border-border/30 bg-card shadow-xs">
        <div className="divide-y divide-border/8">
          {defs.map((def) => {
            const value = (settings as unknown as Record<string, unknown>)[def.key];
            return (
              <div key={def.key}>
                {renderControl(def, value, (v) => handleChange(def.key, v), favs.has(def.key), () => toggleFav(def.key))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Recent Changes View
   ═══════════════════════════════════════════════════ */

function RecentChangesView({
  recent, settings, search, handleChange, favs, toggleFav,
}: {
  recent: Map<string, number>; settings: AppSettings; search: string;
  handleChange: (k: keyof AppSettings, v: unknown) => void; favs: Set<string>; toggleFav: (k: string) => void;
}) {
  const sorted = Array.from(recent.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-20">
        <History className="h-10 w-10 text-muted-foreground/15" />
        <p className="text-sm text-muted-foreground/45">No recent changes</p>
        <p className="text-xs text-muted-foreground/30">Changes you make will appear here</p>
      </div>
    );
  }

  const defMap = new Map(SETTINGS.map((d) => [d.key, d]));
  const catMap = CATEGORY_META;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5">
        <History className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Recently Changed</h2>
        <span className="text-[11px] text-muted-foreground/45">{sorted.length} settings</span>
      </div>
      {sorted.map(([key, ts]) => {
        const def = defMap.get(key as keyof AppSettings);
        if (!def) return null;
        const value = (settings as unknown as Record<string, unknown>)[def.key];
        const catMeta = catMap[def.category as keyof typeof catMap];
        return (
          <div key={key} className="mb-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 mb-1">
              {catMeta && <catMeta.icon className="h-3 w-3" />}
              <span>{catMeta?.title ?? def.category}</span>
              <span>·</span>
              <span>{formatTimeAgo(ts)}</span>
            </div>
            {renderControl(def, value, (v) => handleChange(def.key, v), favs.has(def.key), () => toggleFav(def.key))}
          </div>
        );
      })}
    </div>
  );
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

/* ═══════════════════════════════════════════════════
   Utility Sections
   ═══════════════════════════════════════════════════ */

function UtilityKeyboardShortcuts() {
  const [shortcuts] = useState<{ id: string; label: string; keys: string }[]>([
    { id: "fullscreen", label: "Toggle Fullscreen", keys: "F11" },
    { id: "black", label: "Black Screen", keys: "B" },
    { id: "logo", label: "Logo Screen", keys: "L" },
    { id: "countdown", label: "Start Countdown", keys: "C" },
    { id: "next", label: "Next Item", keys: "Right Arrow" },
    { id: "prev", label: "Previous Item", keys: "Left Arrow" },
    { id: "play", label: "Play / Pause", keys: "Space" },
    { id: "mute", label: "Toggle Mute", keys: "M" },
    { id: "volume-up", label: "Volume Up", keys: "Up Arrow" },
    { id: "volume-down", label: "Volume Down", keys: "Down Arrow" },
    { id: "undo", label: "Undo", keys: "Ctrl+Z" },
    { id: "redo", label: "Redo", keys: "Ctrl+Y" },
    { id: "search", label: "Search", keys: "Ctrl+F" },
    { id: "settings", label: "Open Settings", keys: "Ctrl+," },
  ]);
  const [searchS, setSearchS] = useState("");
  const filtered = shortcuts.filter((s) =>
    !searchS.trim() || s.label.toLowerCase().includes(searchS.toLowerCase()) || s.keys.toLowerCase().includes(searchS.toLowerCase()),
  );

  return (
    <section id="section-shortcuts" className="scroll-mt-12">
      <div className="mb-3 mt-2 flex items-center gap-2.5">
        <Keyboard className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h2>
      </div>
      <div className="rounded-lg border border-border/30 bg-card shadow-xs">
        <div className="px-4 py-2.5 border-b border-border/15">
          <div className="relative w-48">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/30" />
            <input
              value={searchS}
              onChange={(e) => setSearchS(e.target.value)}
              placeholder="Search shortcuts…"
              className="h-7 w-full rounded-md border border-border/30 bg-background/60 pl-7 pr-2 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-primary/30"
            />
          </div>
        </div>
        <div className="divide-y divide-border/8">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[13px] text-foreground/80">{s.label}</span>
              <kbd className="rounded-md border border-border/30 bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-xs">{s.keys}</kbd>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground/50">No shortcuts found</div>
        )}
      </div>
    </section>
  );
}

function UtilityRemoteControl() {
  return (
    <section id="section-remote-control" className="scroll-mt-12">
      <div className="mb-3 mt-2 flex items-center gap-2.5">
        <Wifi className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Remote Control</h2>
      </div>
      <div className="rounded-lg border border-border/30 bg-card px-4 py-5 text-center shadow-xs">
        <Wifi className="mx-auto mb-3 h-8 w-8 text-muted-foreground/25" />
        <p className="text-sm text-muted-foreground/60">
          Remote control lets you manage presentations from a phone, tablet, or another computer on the same network.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/40">
          Enable the settings above to configure remote access.
        </p>
      </div>
    </section>
  );
}

function UtilityBackup({ onExport, onImport, busy }: {
  onExport: () => Promise<void>; onImport: (file: File) => Promise<void>; busy: string | null;
}) {
  return (
    <section id="section-backup" className="scroll-mt-12">
      <div className="mb-3 mt-2 flex items-center gap-2.5">
        <Download className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Backup & Restore</h2>
      </div>
      <div className="rounded-lg border border-border/30 bg-card shadow-xs">
        <div className="divide-y divide-border/8">
          <div className="px-4 py-3">
            <p className="mb-3 text-sm text-foreground/75">Export a complete backup of all data, or restore from a previous backup.</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onExport}
                disabled={busy === "export"}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                {busy === "export" ? "Exporting…" : "Export Backup"}
              </button>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-accent">
                <Upload className="h-3.5 w-3.5" />
                {busy === "import" ? "Importing…" : "Import Backup"}
                <input type="file" accept=".zip,application/zip" hidden onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
              </label>
            </div>
          </div>
          <div className="px-4 py-3 text-xs text-muted-foreground/50">
            Backups include all media files, playlists, settings, and library data.
          </div>
        </div>
      </div>
    </section>
  );
}

function UtilityStorage({ stats, dbSize, wipeAll }: {
  stats: Record<string, number> | null; dbSize: string | null; wipeAll: () => Promise<void>;
}) {
  return (
    <section id="section-storage" className="scroll-mt-12">
      <div className="mb-3 mt-2 flex items-center gap-2.5">
        <HardDrive className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Storage</h2>
      </div>
      <div className="rounded-lg border border-border/30 bg-card shadow-xs">
        <div className="px-4 py-2.5 border-b border-border/15">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/45">Database Statistics</h3>
        </div>
        {stats ? (
          <div className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-4">
            <StatCard label="Media Files" value={stats.media} />
            <StatCard label="Folders" value={stats.folders} />
            <StatCard label="Playlists" value={stats.playlists} />
            <StatCard label="Used Space" value={`${(stats.storage ?? 0).toFixed(1)} MB`} />
          </div>
        ) : (
          <div className="px-4 py-3 text-sm text-muted-foreground/50">Loading statistics…</div>
        )}
        {dbSize && (
          <div className="flex items-center gap-2 border-t border-border/15 px-4 py-2.5">
            <Database className="h-3.5 w-3.5 text-muted-foreground/35" />
            <span className="text-xs text-muted-foreground/45">Browser storage: {dbSize}</span>
          </div>
        )}
      </div>
      <div className="mt-3 rounded-lg border border-border/30 bg-card shadow-xs">
        <div className="px-4 py-3">
          <button
            onClick={wipeAll}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-destructive/25 bg-destructive/8 px-3.5 py-1.5 text-xs font-medium text-destructive transition-all hover:bg-destructive/15"
          >
            <Database className="h-3.5 w-3.5" />
            Delete All Data
          </button>
          <p className="mt-1.5 text-xs text-muted-foreground/45">Permanently removes all local media, playlists, and settings.</p>
        </div>
      </div>
    </section>
  );
}

function UtilitySecurity() {
  return (
    <section id="section-security" className="scroll-mt-12">
      <div className="mb-3 mt-2 flex items-center gap-2.5">
        <Shield className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Security</h2>
      </div>
      <div className="rounded-lg border border-border/30 bg-card px-4 py-5 text-center shadow-xs">
        <Lock className="mx-auto mb-3 h-8 w-8 text-muted-foreground/25" />
        <p className="text-sm text-muted-foreground/60">
          Protect your settings and data with password-based access control and encryption.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/40">
          Configure security options using the settings above.
        </p>
      </div>
    </section>
  );
}

function UtilityAdvanced() {
  return (
    <section id="section-advanced" className="scroll-mt-12">
      <div className="mb-3 mt-2 flex items-center gap-2.5">
        <Sliders className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Advanced</h2>
      </div>
      <div className="rounded-lg border border-border/30 bg-card shadow-xs">
        <div className="divide-y divide-border/8">
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground/45 leading-relaxed">
              Advanced settings include developer mode, logging level, and experimental features.
              Use these with caution.
            </p>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-[13px] text-foreground/70">Application Logs</span>
            <span className="text-[11px] text-muted-foreground/45">Viewable in Developer Console</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-[13px] text-foreground/70">Version</span>
            <span className="text-[11px] text-muted-foreground/45">1.0.0</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function UtilityAbout({ dbSize }: { dbSize: string | null }) {
  return (
    <section id="section-about" className="scroll-mt-12">
      <div className="mb-3 mt-2 flex items-center gap-2.5">
        <Info className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">About</h2>
      </div>
      <div className="rounded-lg border border-border/30 bg-card shadow-xs">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <MonitorPlay className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Vision Projector</div>
              <div className="text-xs text-muted-foreground/60">Church Presentation Software</div>
            </div>
          </div>
        </div>
        <div className="border-t border-border/15 divide-y divide-border/8">
          {[
            ["Version", "1.0.0"],
            ["Database Version", "1"],
            ["Build", import.meta.env.PROD ? "Production" : "Development"],
            ["Framework", "React + TanStack Start"],
            ["Storage", dbSize ?? "Unknown"],
            ["Renderer", "HTML/CSS (Tailwind)"],
            ["License", "MIT - Open Source"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-4 py-1.5">
              <span className="text-xs text-muted-foreground/60">{label}</span>
              <span className="text-xs font-medium text-foreground/75">{value}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border/15 px-4 py-3 text-xs text-muted-foreground/50 leading-relaxed">
          <p>Vision Projector is free and open-source software for church media projection.</p>
          <p className="mt-1">All data is stored locally. No telemetry or data collection.</p>
          <div className="mt-3 flex gap-3">
            <a href="#" className="inline-flex items-center gap-1 text-primary/70 hover:text-primary transition-colors"><Globe className="h-3 w-3" /> Website</a>
            <a href="#" className="inline-flex items-center gap-1 text-primary/70 hover:text-primary transition-colors"><Github className="h-3 w-3" /> GitHub</a>
            <a href="#" className="inline-flex items-center gap-1 text-primary/70 hover:text-primary transition-colors"><BookOpen className="h-3 w-3" /> Docs</a>
          </div>
        </div>
      </div>
    </section>
  );
}
