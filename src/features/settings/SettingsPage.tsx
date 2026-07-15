import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Search, Settings, RotateCcw, Download, Upload, Keyboard,
  Monitor, Sun, Moon, ChevronRight, X,
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
  SettingCard,
} from "./SettingsControls";

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
  const results: SearchHit[] = [];
  for (const def of SETTINGS) {
    const haystacks = [def.title.toLowerCase(), def.description.toLowerCase(), ...def.keywords.map((k) => k.toLowerCase())];
    let score = 0;
    for (const h of haystacks) {
      if (h === q) { score = Math.max(score, 100); break; }
      if (h.startsWith(q)) { score = Math.max(score, 50); continue; }
      if (h.includes(q)) { score = Math.max(score, 20); continue; }
    }
    if (score > 0) results.push({ def, score });
  }
  return results.sort((a, b) => b.score - a.score);
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <span key={i} className="rounded-sm bg-primary/20 font-medium text-primary">{p}</span>
      : p,
  );
}

/* ═══════════════════════════════════════════════════
   Control Router
   ═══════════════════════════════════════════════════ */

function renderControl(def: SettingDef, value: unknown, onChange: (v: unknown) => void) {
  switch (def.type) {
    case "toggle": return <SettingToggle def={def} value={!!value} onChange={onChange as (v: boolean) => void} />;
    case "slider": return <SettingSlider def={def} value={Number(value)} onChange={onChange as (v: number) => void} />;
    case "select": return <SettingSelect def={def} value={String(value)} onChange={onChange as (v: string) => void} />;
    case "input": case "number": return <SettingInput def={def} value={value as string | number} onChange={onChange as (v: string) => void} />;
    case "color": return <SettingColor def={def} value={String(value)} onChange={onChange as (v: string) => void} />;
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const sectionsRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    if (!loaded) void load();
  }, [load, loaded]);

  /* ── Change handler ── */
  const handleChange = useCallback((key: keyof AppSettings, value: unknown) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    update({ [key]: value } as Partial<AppSettings>)
      .catch((e) => toast.error("Failed to save: " + (e as Error).message))
      .finally(() => { savingRef.current = false; setSaving(false); });
  }, [update]);

  /* ── Reset section ── */
  const resetSection = useCallback(async (catId: string) => {
    const defs = SETTINGS.filter((s) => s.category === catId);
    if (defs.length === 0) return;
    const patch: Partial<AppSettings> = {};
    for (const d of defs) (patch as Record<string, unknown>)[d.key] = (DEFAULT_SETTINGS as unknown as Record<string, unknown>)[d.key];
    setSaving(true);
    try { await update(patch); toast.success(`${CATEGORY_META[catId]?.title ?? catId} reset to defaults`); }
    catch (e) { toast.error("Reset failed: " + (e as Error).message); }
    finally { setSaving(false); }
  }, [update]);

  /* ── Reset all ── */
  const resetAll = useCallback(async () => {
    if (!confirm("Reset all settings to their default values?")) return;
    setSaving(true);
    try { await update(DEFAULT_SETTINGS); toast.success("All settings restored to defaults"); }
    catch (e) { toast.error("Reset failed: " + (e as Error).message); }
    finally { setSaving(false); }
  }, [update]);

  /* ── Scrolling ── */
  const scrollTo = useCallback((catId: string) => {
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
    for (const id of Object.keys(CATEGORY_META)) {
      const el = document.getElementById(`section-${id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [loaded, search]);

  /* ── Search ── */
  const searchHits = useMemo(() => searchSettings(search), [search]);
  const hitKeys = useMemo(() => {
    if (!search.trim()) return null;
    return new Set(searchHits.map((h) => h.def.key));
  }, [search, searchHits]);

  const visibleCategories = useMemo(() => {
    if (!search.trim()) return Object.entries(CATEGORY_META);
    const cats = new Set(searchHits.map((h) => h.def.category));
    return Object.entries(CATEGORY_META).filter(([id]) => cats.has(id) || id === "keyboard-shortcuts");
  }, [search, searchHits]);

  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchHits.length > 0) scrollTo(searchHits[0].def.category);
  };

  /* ── Backup handlers ── */
  const onExport = useCallback(async () => {
    setBusy("export");
    try {
      const blob = await exportBackup();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `vision-projector-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click(); URL.revokeObjectURL(url); toast.success("Backup downloaded");
    } catch (e) { toast.error("Export failed: " + (e as Error).message); }
    finally { setBusy(null); }
  }, []);

  const onImport = useCallback(async (file: File) => {
    const mode = confirm("Replace existing library? Cancel to merge.") ? "replace" as const : "merge" as const;
    setBusy("import");
    try {
      await importBackup(file, { mode });
      toast.success("Backup restored – reloading…");
      setTimeout(() => window.location.reload(), 500);
    } catch (e) { toast.error("Import failed: " + (e as Error).message); setBusy(null); }
  }, []);

  /* ── Settings by category ── */
  const byCategory = useMemo(() => {
    const map = new Map<string, SettingDef[]>();
    for (const s of SETTINGS) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return map;
  }, []);

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

  const themeIcon = settings.theme === "dark" ? Moon : settings.theme === "light" ? Sun : Monitor;

  /* ════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════ */

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* ─── SIDEBAR ─── */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-muted/5">
        <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-border/30 px-4">
          <Settings className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Settings</span>
          {saving && <div className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />}
        </div>

        {/* Search */}
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/35" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search settings…"
              className="h-8 w-full rounded-md border border-border/30 bg-background/50 pl-8 pr-7 text-xs text-foreground outline-none placeholder:text-muted-foreground/25 transition-colors focus:border-primary/30 focus:bg-background/70 focus:ring-1 focus:ring-primary/15"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/25 hover:text-muted-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Category nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          {visibleCategories.map(([id, meta]) => {
            const active = activeSection === id;
            const Icon = meta.icon;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-xs font-medium transition-all duration-150",
                  active ? "bg-primary/8 text-primary shadow-xs" : "text-muted-foreground/55 hover:bg-accent/40 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{meta.title}</span>
                {active && <ChevronRight className="ml-auto h-3 w-3 shrink-0 text-primary/45" />}
              </button>
            );
          })}
        </nav>

        {/* Reset all */}
        <div className="border-t border-border/25 px-3 py-2.5">
          <button
            onClick={resetAll}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground/45 transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All Settings
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header bar */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/25 px-6">
          <h1 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {search ? (
              <>{highlightMatch(`"${search}"`, search)} <span className="text-[11px] font-normal text-muted-foreground/40">{searchHits.length} result{searchHits.length !== 1 ? "s" : ""}</span></>
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
                <Search className="h-10 w-10 text-muted-foreground/12" />
                <p className="text-sm text-muted-foreground/40">No settings match "{search}"</p>
                <p className="text-xs text-muted-foreground/25">Try a different search term</p>
              </div>
            )}

            {/* Category sections */}
            {Object.entries(CATEGORY_META).map(([id, meta]) => {
              if (id === "keyboard-shortcuts") return null; // render separately
              const defs = byCategory.get(id) ?? [];
              const visible = defs.filter((d) => !hitKeys || hitKeys.has(d.key));
              if (hitKeys && visible.length === 0) return null;
              const Icon = meta.icon;
              return (
                <section key={id} id={`section-${id}`} className="scroll-mt-12 mb-8">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-semibold text-foreground">{highlightMatch(meta.title, search)}</h2>
                    </div>
                    <button
                      onClick={() => resetSection(id)}
                      className="cursor-pointer rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground/35 transition-colors hover:bg-accent/50 hover:text-muted-foreground"
                    >
                      Reset section
                    </button>
                  </div>
                  <div className="rounded-lg border border-border/25 bg-card shadow-xs">
                    <div className="divide-y divide-border/6">
                      {visible.map((def) => {
                        const value = (settings as unknown as Record<string, unknown>)[def.key];
                        return <div key={def.key}>{renderControl(def, value, (v) => handleChange(def.key, v))}</div>;
                      })}
                    </div>
                  </div>
                </section>
              );
            })}

            {/* ── Keyboard Shortcuts ── */}
            {(!search.trim() || (hitKeys && (search.toLowerCase().includes("keyboard") || search.toLowerCase().includes("shortcut")))) && (
              <KeyboardShortcutsSection search={search} />
            )}

            {/* ── Backup & Restore ── */}
            {!search.trim() && (
              <BackupSection onExport={onExport} onImport={onImport} busy={busy} settings={settings} handleChange={handleChange} byCategory={byCategory} />
            )}

            <div className="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Keyboard Shortcuts Section
   ═══════════════════════════════════════════════════ */

function KeyboardShortcutsSection({ search }: { search: string }) {
  const [query, setQuery] = useState("");
  const shortcuts = [
    { id: "fullscreen", label: "Toggle Fullscreen", keys: "F11" },
    { id: "black", label: "Black Screen", keys: "B" },
    { id: "logo", label: "Logo Screen", keys: "L" },
    { id: "countdown", label: "Start Countdown", keys: "C" },
    { id: "next", label: "Next Item", keys: "→" },
    { id: "prev", label: "Previous Item", keys: "←" },
    { id: "play", label: "Play / Pause", keys: "Space" },
    { id: "mute", label: "Toggle Mute", keys: "M" },
    { id: "vol-up", label: "Volume Up", keys: "↑" },
    { id: "vol-down", label: "Volume Down", keys: "↓" },
    { id: "search", label: "Search", keys: "Ctrl+F" },
    { id: "settings", label: "Open Settings", keys: "Ctrl+," },
  ];

  const filtered = shortcuts.filter((s) =>
    !query.trim() || s.label.toLowerCase().includes(query.toLowerCase()) || s.keys.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section id="section-keyboard-shortcuts" className="scroll-mt-12 mb-8">
      <div className="mb-3 flex items-center gap-2.5">
        <Keyboard className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h2>
      </div>
      <div className="rounded-lg border border-border/25 bg-card shadow-xs">
        <div className="border-b border-border/12 px-4 py-2">
          <div className="relative w-48">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/25" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shortcuts…"
              className="h-7 w-full rounded-md border border-border/25 bg-background/50 pl-7 pr-2 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/25 focus:border-primary/30"
            />
          </div>
        </div>
        <div className="divide-y divide-border/6">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[13px] text-foreground/80">{s.label}</span>
              <kbd className="rounded-md border border-border/25 bg-muted/25 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-xs">{s.keys}</kbd>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground/45">No shortcuts found</div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Backup Section
   ═══════════════════════════════════════════════════ */

function BackupSection({ onExport, onImport, busy, settings, handleChange, byCategory }: {
  onExport: () => Promise<void>; onImport: (file: File) => Promise<void>; busy: string | null;
  settings: AppSettings; handleChange: (k: keyof AppSettings, v: unknown) => void;
  byCategory: Map<string, SettingDef[]>;
}) {
  return (
    <section id="section-backup" className="scroll-mt-12 mb-8">
      <div className="mb-3 flex items-center gap-2.5">
        <Download className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Backup & Restore</h2>
      </div>
      <div className="rounded-lg border border-border/25 bg-card shadow-xs">
        <div className="divide-y divide-border/6">
          {/* Backup settings */}
          {byCategory.get("backup")?.map((def) => {
            const value = (settings as unknown as Record<string, unknown>)[def.key];
            return <div key={def.key}>{renderControl(def, value, (v) => handleChange(def.key, v))}</div>;
          })}

          {/* Export / Import */}
          <div className="px-4 py-3">
            <p className="mb-3 text-sm text-foreground/70">Export a backup of all your data, or restore from a previous backup.</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onExport}
                disabled={busy === "export"}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                {busy === "export" ? "Exporting…" : "Export Backup"}
              </button>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background/70 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-accent">
                <Upload className="h-3.5 w-3.5" />
                {busy === "import" ? "Importing…" : "Import Backup"}
                <input type="file" accept=".zip,application/zip" hidden onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
              </label>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground/40">Backups include all media files, playlists, settings, and library data.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
