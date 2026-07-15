import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Search, Settings, RotateCcw, Download, Upload, Database, Keyboard,
  Monitor, Moon, Sun, ChevronRight, X,
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

/* ─── Helpers ─── */
function renderControl(def: SettingDef, value: unknown, onChange: (v: unknown) => void) {
  switch (def.type) {
    case "toggle":
      return <SettingToggle def={def} value={!!value} onChange={onChange as (v: boolean) => void} />;
    case "slider":
      return <SettingSlider def={def} value={Number(value)} onChange={onChange as (v: number) => void} />;
    case "select":
      return <SettingSelect def={def} value={String(value)} onChange={onChange as (v: string) => void} />;
    case "input":
    case "number":
      return <SettingInput def={def} value={value as string | number} onChange={onChange as (v: string) => void} />;
    case "color":
      return <SettingColor def={def} value={String(value)} onChange={onChange as (v: string) => void} />;
  }
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${q})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <span key={i} className="rounded-sm bg-primary/20 text-primary">{p}</span>
      : p,
  );
}

/* ─── Search indexing ─── */
interface SearchIndex {
  setting: SettingDef;
  score: number;
}

function buildSearchIndex(query: string): SearchIndex[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const qWords = q.split(/\s+/).filter(Boolean);
  const results: SearchIndex[] = [];

  for (const s of SETTINGS) {
    const haystacks = [
      s.title.toLowerCase(),
      s.description.toLowerCase(),
      ...s.keywords.map((k) => k.toLowerCase()),
      ...s.aliases.map((a) => a.toLowerCase()),
    ];
    let score = 0;
    for (const h of haystacks) {
      if (h === q) { score += 100; break; }
      if (h.startsWith(q)) { score += 50; break; }
      if (h.includes(q)) { score += 20; break; }
      const words = h.split(/\s+/);
      for (const w of qWords) {
        if (words.some((hw) => hw.startsWith(w))) score += 5;
        else if (words.some((hw) => hw.includes(w))) score += 2;
      }
    }
    if (score > 0) results.push({ setting: s, score });
  }
  return results.sort((a, b) => b.score - a.score);
}

/* ─── Page component ─── */
export function SettingsPage() {
  const { settings, update, load, loaded } = useSettings();
  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("general");
  const [busy, setBusy] = useState<string | null>(null);
  const [stats, setStats] = useState<{ media: number; folders: number; playlists: number; blobsMB: number } | null>(null);
  const [dbSize, setDbSize] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionsRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    if (!loaded) void load();
  }, [load, loaded]);

  useEffect(() => {
    (async () => {
      try {
        const [media, folders, playlists, blobs] = await Promise.all([
          db().media.count(),
          db().folders.count(),
          db().playlists.count(),
          db().blobs.toArray(),
        ]);
        const totalBytes = blobs.reduce((s, b) => s + (b.blob.size ?? 0), 0);
        setStats({ media, folders, playlists, blobsMB: totalBytes / (1024 * 1024) });
      } catch { /* */ }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const estimation = await navigator.storage?.estimate?.();
        if (estimation?.usage != null) setDbSize(`${(estimation.usage / (1024 * 1024)).toFixed(0)} MB`);
      } catch { /* */ }
    })();
  }, []);

  const current = settings;

  const set = useCallback(async (patch: Partial<AppSettings>) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try { await update(patch); }
    catch (e) { toast.error("Failed to save: " + (e as Error).message); }
    finally { savingRef.current = false; setSaving(false); }
  }, [update]);

  const handleChange = useCallback((key: keyof AppSettings, value: unknown) => {
    set({ [key]: value } as Partial<AppSettings>);
  }, [set]);

  const restoreDefaults = async () => {
    if (!confirm("Reset all settings to defaults?")) return;
    setSaving(true);
    try {
      await update(DEFAULT_SETTINGS);
      toast.success("Settings restored to defaults");
    } catch (e) {
      toast.error("Reset failed: " + (e as Error).message);
    } finally { setSaving(false); }
  };

  const onExport = async () => {
    setBusy("export");
    try {
      const blob = await exportBackup();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `church-media-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded");
    } catch (e) { toast.error("Export failed: " + (e as Error).message); }
    finally { setBusy(null); }
  };

  const onImport = async (file: File) => {
    const mode = confirm("Replace existing library? Cancel to merge.") ? "replace" as const : "merge" as const;
    setBusy("import");
    try {
      await importBackup(file, { mode });
      toast.success("Backup restored — reloading…");
      setTimeout(() => window.location.reload(), 500);
    } catch (e) { toast.error("Import failed: " + (e as Error).message); setBusy(null); }
  };

  const wipeAll = async () => {
    if (!confirm("Delete ALL local data? This cannot be undone.")) return;
    await db().delete();
    window.location.reload();
  };

  /* ── Search index ── */
  const searchResults = useMemo(() => buildSearchIndex(search), [search]);
  const filteredDefs = useMemo(() => {
    if (!search.trim()) return null;
    return new Set(searchResults.map((r) => r.setting.key));
  }, [search, searchResults]);
  const activeCatFromSearch = useMemo(() => {
    if (!search.trim() || searchResults.length === 0) return null;
    return searchResults[0].setting.category;
  }, [search, searchResults]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      const cat = searchResults[0].setting.category;
      scrollToSection(cat);
    }
  };

  const scrollToSection = (catId: string) => {
    const el = document.getElementById(`settings-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(catId);
    }
  };

  /* ── IntersectionObserver ── */
  useEffect(() => {
    if (!scrollRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          sectionsRef.current.set(entry.target.id, entry);
        }
        const visible = Array.from(sectionsRef.current.values())
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id.replace("settings-", ""));
        }
      },
      { root: scrollRef.current, threshold: 0, rootMargin: "-48px 0px -60% 0px" },
    );

    const cats = Object.keys(CATEGORY_META);
    for (const id of cats) {
      const el = document.getElementById(`settings-${id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [loaded]);

  /* ── Category filtering for sidebar ── */
  const visibleCategories = useMemo(() => {
    if (!search.trim()) return Object.entries(CATEGORY_META);
    const cats = new Set(searchResults.map((r) => r.setting.category));
    return Object.entries(CATEGORY_META).filter(([id]) => cats.has(id));
  }, [search, searchResults]);

  /* ── Per-category settings ── */
  const settingsByCategory = useMemo(() => {
    const map = new Map<string, SettingDef[]>();
    for (const s of SETTINGS) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return map;
  }, []);

  /* ── Render helpers ── */
  const renderSetting = (def: SettingDef) => {
    const value = (current as unknown as Record<string, unknown>)[def.key];
    if (filteredDefs && !filteredDefs.has(def.key)) return null;
    return (
      <div key={def.key}>
        {renderControl(def, value, (v) => handleChange(def.key, v))}
      </div>
    );
  };

  const renderCategory = ([id, meta]: [string, typeof CATEGORY_META[string]]) => {
    const defs = settingsByCategory.get(id) ?? [];
    const visible = defs.filter((d) => !filteredDefs || filteredDefs.has(d.key));
    if (filteredDefs && visible.length === 0) return null;

    const sectionLabel = search.trim()
      ? searchResults.find((r) => r.setting.category === id)?.setting.title ?? meta.title
      : meta.title;

    return (
      <section key={id} id={`settings-${id}`} className="scroll-mt-12">
        <div className="mb-4 mt-2 flex items-center gap-2.5">
          <meta.icon className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">{highlightText(meta.title, search)}</h2>
        </div>
        {defs.map(renderSetting)}
      </section>
    );
  };

  const themeIcon = current.theme === "dark" ? Moon : current.theme === "light" ? Sun : Monitor;

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

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* ── Sidebar ── */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-muted/10">
        <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-border/50 px-4">
          <Settings className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Settings</span>
          {saving && <div className="ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" />}
        </div>
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search settings…"
              className="h-8 w-full rounded-lg border border-border/50 bg-background pl-8 pr-7 text-xs text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); searchInputRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/40 hover:text-muted-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {visibleCategories.map(([id, meta]) => {
            const active = activeSection === id;
            const Icon = meta.icon;
            return (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all duration-150",
                  active
                    ? "bg-primary/10 text-primary shadow-xs"
                    : "text-muted-foreground/70 hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{meta.title}</span>
                {active && <ChevronRight className="ml-auto h-3 w-3 shrink-0 text-primary/60" />}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-border/50 px-3 py-2.5">
          <button
            onClick={restoreDefaults}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground/60 transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/50 px-6">
          <h1 className="text-sm font-semibold text-foreground">
            {search ? `"${search}"` : "Settings"}
            {search && searchResults.length > 0 && (
              <span className="ml-2 text-[11px] font-normal text-muted-foreground/50">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </span>
            )}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground/50">
              {saving ? "Saving…" : "All changes saved"}
            </span>
            <div className={cn("h-1.5 w-1.5 rounded-full", saving ? "bg-amber-500" : "bg-emerald-500")} />
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-6">
            {search && searchResults.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-16">
                <Search className="h-8 w-8 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground/50">No settings found</p>
              </div>
            )}
            {Object.entries(CATEGORY_META).map(renderCategory)}

            {/* ── Utility sections (always visible when not searching) ── */}
            {!search.trim() && (
              <>
                {/* ── Keyboard Shortcuts ── */}
                <section id="settings-shortcuts" className="scroll-mt-12">
                  <div className="mb-4 mt-2 flex items-center gap-2.5">
                    <Keyboard className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h2>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card px-3 py-6 text-center shadow-xs">
                    <Keyboard className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground/70">
                      Keyboard shortcut customization is available from the Shortcuts page.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/50">
                      Navigate to <span className="font-medium text-foreground/60">Shortcuts</span> in the main sidebar.
                    </p>
                  </div>
                </section>

                {/* ── Remote Control ── */}
                <section id="settings-remote" className="scroll-mt-12">
                  <div className="mb-4 mt-2 flex items-center gap-2.5">
                    <span className="flex h-4 w-4 items-center justify-center">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" /></svg>
                    </span>
                    <h2 className="text-sm font-semibold text-foreground">Remote Control</h2>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card px-3 py-6 text-center shadow-xs">
                    <Keyboard className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground/70">
                      Remote control functionality is coming in a future update.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/50">
                      Control presentations from mobile devices over your local network.
                    </p>
                  </div>
                </section>

                {/* ── Backup & Restore ── */}
                <section id="settings-backup" className="scroll-mt-12">
                  <div className="mb-4 mt-2 flex items-center gap-2.5">
                    <Download className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">Backup & Restore</h2>
                  </div>
                  <SettingCard>
                    <div className="px-3 py-3">
                      <p className="mb-3 text-sm text-foreground/80">Create a complete backup of all your data including media files, playlists, and settings.</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={onExport}
                          disabled={busy === "export"}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {busy === "export" ? "Exporting…" : "Export Backup"}
                        </button>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-accent">
                          <Upload className="h-3.5 w-3.5" />
                          {busy === "import" ? "Importing…" : "Import Backup"}
                          <input type="file" accept=".zip,application/zip" hidden onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
                        </label>
                      </div>
                    </div>
                  </SettingCard>
                </section>

                {/* ── Storage ── */}
                <section id="settings-storage" className="scroll-mt-12">
                  <div className="mb-4 mt-2 flex items-center gap-2.5">
                    <Database className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">Storage</h2>
                  </div>
                  <SettingCard title="Database Statistics">
                    {stats ? (
                      <div className="grid grid-cols-2 gap-3 px-3 py-2.5 sm:grid-cols-4">
                        <StatCard label="Media Files" value={stats.media} />
                        <StatCard label="Folders" value={stats.folders} />
                        <StatCard label="Playlists" value={stats.playlists} />
                        <StatCard label="Used Space" value={`${stats.blobsMB.toFixed(1)} MB`} />
                      </div>
                    ) : (
                      <div className="px-3 py-3 text-sm text-muted-foreground">Loading statistics…</div>
                    )}
                    {dbSize && (
                      <div className="flex items-center gap-2 border-t border-border/20 px-3 py-2.5">
                        <Database className="h-3.5 w-3.5 text-muted-foreground/40" />
                        <span className="text-xs text-muted-foreground/50">Browser storage usage: {dbSize}</span>
                      </div>
                    )}
                  </SettingCard>
                  <div className="mt-3">
                    <SettingCard>
                      <div className="px-3 py-2.5">
                        <button
                          onClick={wipeAll}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-all hover:bg-destructive/20"
                        >
                          <Database className="h-3.5 w-3.5" />
                          Delete All Data
                        </button>
                        <p className="mt-1.5 text-xs text-muted-foreground/50">Permanently removes all local media, playlists, and settings.</p>
                      </div>
                    </SettingCard>
                  </div>
                </section>

                {/* ── About ── */}
                <section id="settings-about" className="scroll-mt-12">
                  <div className="mb-4 mt-2 flex items-center gap-2.5">
                    <span className="flex h-4 w-4 items-center justify-center">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                    <h2 className="text-sm font-semibold text-foreground">About</h2>
                  </div>
                  <SettingCard title="Church Media">
                    <div className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Monitor className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">Church Media</div>
                          <div className="text-xs text-muted-foreground/60">Projection Software</div>
                        </div>
                      </div>
                    </div>
                  </SettingCard>
                  <SettingCard title="Version Info">
                    <div className="divide-y divide-border/10 px-3 py-1">
                      {[
                        ["Application Version", "1.0.0"],
                        ["Database Version", "1"],
                        ["Build", import.meta.env.PROD ? "Production" : "Development"],
                        ["Framework", "React + TanStack Start"],
                        ["Storage", dbSize ?? "Unknown"],
                        ["Renderer", "HTML/CSS (Tailwind)"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between py-1.5">
                          <span className="text-xs text-muted-foreground/60">{label}</span>
                          <span className="text-xs font-medium text-foreground/80">{value}</span>
                        </div>
                      ))}
                    </div>
                  </SettingCard>
                  <SettingCard title="License">
                    <div className="px-3 py-3 text-sm text-muted-foreground/70">
                      <p>Church Media is free and open-source software for church media projection.</p>
                      <p className="mt-1 text-xs text-muted-foreground/50">All data is stored locally. No telemetry or data collection.</p>
                    </div>
                  </SettingCard>
                </section>
              </>
            )}

            {/* Bottom padding */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
