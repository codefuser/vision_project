import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Settings, Palette, MonitorPlay, Type, Sparkles, BookOpen, Music,
  Image, Zap, Play, Volume2, Video, Keyboard, Wifi, Download, HardDrive,
  Shield, Sliders, Info, ChevronRight, RotateCcw, Upload, Database, Check,
  Monitor, Moon, Sun,
} from "lucide-react";
import { useSettings } from "@/stores/settings.store";
import { db, DEFAULT_SETTINGS, type AppSettings, type ThemeMode } from "@/db/schema";
import { exportBackup, importBackup } from "@/features/backup/backup";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  SettingToggle, SettingSlider, SettingSelect, SettingInput, SettingColor,
  SettingCard, StatCard,
} from "./SettingsControls";

type Category = {
  id: string; label: string; icon: typeof Settings;
};

const CATEGORIES: Category[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "projection", label: "Projection", icon: MonitorPlay },
  { id: "text-formatting", label: "Text Formatting", icon: Type },
  { id: "themes", label: "Themes", icon: Sparkles },
  { id: "bible", label: "Bible", icon: BookOpen },
  { id: "songs", label: "Songs", icon: Music },
  { id: "media", label: "Media", icon: Image },
  { id: "search", label: "Search", icon: Search },
  { id: "performance", label: "Performance", icon: Zap },
  { id: "audio", label: "Audio", icon: Volume2 },
  { id: "video", label: "Video", icon: Video },
  { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
  { id: "remote", label: "Remote Control", icon: Wifi },
  { id: "backup", label: "Backup & Restore", icon: Download },
  { id: "storage", label: "Storage", icon: HardDrive },
  { id: "security", label: "Security", icon: Shield },
  { id: "advanced", label: "Advanced", icon: Sliders },
  { id: "about", label: "About", icon: Info },
];

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const STARTUP_OPTIONS = [
  { value: "restore", label: "Restore Last Session" },
  { value: "new", label: "Start Fresh" },
  { value: "blank", label: "Blank Workspace" },
];

const PAGE_OPTIONS = [
  { value: "library", label: "Library" },
  { value: "project", label: "Project" },
  { value: "playlists", label: "Playlists" },
  { value: "settings", label: "Settings" },
];

const RESOLUTION_OPTIONS = [
  { value: "1920x1080", label: "1920 × 1080 (Full HD)" },
  { value: "3840x2160", label: "3840 × 2160 (4K)" },
  { value: "1280x720", label: "1280 × 720 (HD)" },
  { value: "1024x768", label: "1024 × 768 (XGA)" },
];

const SORT_OPTIONS = [
  { value: "title", label: "Title" },
  { value: "recent", label: "Recently Used" },
  { value: "created", label: "Date Added" },
  { value: "artist", label: "Artist" },
];

const LOG_LEVEL_OPTIONS = [
  { value: "error", label: "Errors Only" },
  { value: "warn", label: "Warnings" },
  { value: "info", label: "Information" },
  { value: "debug", label: "Debug" },
];

export function SettingsPage() {
  const { settings, update, load, loaded } = useSettings();
  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [busy, setBusy] = useState<string | null>(null);
  const [stats, setStats] = useState<{ media: number; folders: number; playlists: number; blobsMB: number } | null>(null);
  const [dbSize, setDbSize] = useState<string | null>(null);

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
      } catch { /* stats best-effort */ }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const estimation = await navigator.storage?.estimate?.();
        if (estimation?.usage != null) {
          const mb = estimation.usage / (1024 * 1024);
          setDbSize(`${mb.toFixed(0)} MB`);
        }
      } catch { /* */ }
    })();
  }, []);

  const current = settings;

  const set = async (p: Partial<AppSettings>) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await update(p);
    } catch (e) {
      toast.error("Failed to save: " + (e as Error).message);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const restoreDefaults = async () => {
    if (!confirm("Reset all settings to defaults?")) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await update(DEFAULT_SETTINGS);
      toast.success("Settings restored to defaults");
    } catch (e) {
      toast.error("Reset failed: " + (e as Error).message);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return CATEGORIES;
    const q = search.toLowerCase();
    return CATEGORIES.filter((c) => c.label.toLowerCase().includes(q));
  }, [search]);

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
    } catch (e) {
      toast.error("Export failed: " + (e as Error).message);
    } finally { setBusy(null); }
  };

  const onImport = async (file: File) => {
    const mode = confirm("Replace existing library? Cancel to merge.") ? "replace" as const : "merge" as const;
    setBusy("import");
    try {
      await importBackup(file, { mode });
      toast.success("Backup restored — reloading…");
      setTimeout(() => window.location.reload(), 500);
    } catch (e) {
      toast.error("Import failed: " + (e as Error).message);
      setBusy(null);
    }
  };

  const wipeAll = async () => {
    if (!confirm("Delete ALL local data? This cannot be undone.")) return;
    await db().delete();
    window.location.reload();
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
      {/* Sidebar */}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="h-8 w-full rounded-lg border border-border/50 bg-background pl-8 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {filteredCategories.map((cat) => {
            const active = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all duration-150",
                  active
                    ? "bg-primary/10 text-primary shadow-xs"
                    : "text-muted-foreground/70 hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{cat.label}</span>
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

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/50 px-6">
          <h1 className="text-sm font-semibold text-foreground">
            {CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "Settings"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground/50">
              {saving ? "Saving…" : "All changes saved"}
            </span>
            <div className={cn("h-1.5 w-1.5 rounded-full", saving ? "bg-amber-500" : "bg-emerald-500")} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-6">
            {activeCategory === "general" && <GeneralSettings current={current} set={set} themeIcon={themeIcon} restoreDefaults={restoreDefaults} />}
            {activeCategory === "appearance" && <AppearanceSettings current={current} set={set} />}
            {activeCategory === "projection" && <ProjectionSettings current={current} set={set} />}
            {activeCategory === "text-formatting" && <TextFormattingSettings current={current} set={set} />}
            {activeCategory === "themes" && <ThemeSettings current={current} set={set} />}
            {activeCategory === "bible" && <BibleSettings current={current} set={set} />}
            {activeCategory === "songs" && <SongSettings current={current} set={set} />}
            {activeCategory === "media" && <MediaSettings current={current} set={set} />}
            {activeCategory === "search" && <SearchSettings current={current} set={set} />}
            {activeCategory === "performance" && <PerformanceSettings current={current} set={set} />}
            {activeCategory === "audio" && <AudioSettings current={current} set={set} />}
            {activeCategory === "video" && <VideoSettings current={current} set={set} />}
            {activeCategory === "shortcuts" && <ShortcutsSettings />}
            {activeCategory === "remote" && <RemoteSettings />}
            {activeCategory === "backup" && <BackupSettings onExport={onExport} onImport={onImport} busy={busy} />}
            {activeCategory === "storage" && <StorageSettings stats={stats} dbSize={dbSize} wipeAll={wipeAll} />}
            {activeCategory === "security" && <SecuritySettings current={current} set={set} />}
            {activeCategory === "advanced" && <AdvancedSettings current={current} set={set} />}
            {activeCategory === "about" && <AboutSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CATEGORY SETTINGS ─── */

function GeneralSettings({ current, set, themeIcon: ThemeIcon, restoreDefaults }: {
  current: AppSettings; set: (p: Partial<AppSettings>) => void; themeIcon: typeof Sun; restoreDefaults: () => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">General</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Application-wide preferences</p>

      <SettingCard title="Theme & Appearance">
        <SettingSelect label="Theme" value={current.theme} options={THEME_OPTIONS} onChange={(v) => set({ theme: v as ThemeMode })} />
        <SettingColor label="Accent Color" value={current.accentColor} onChange={(v) => set({ accentColor: v })} description="Primary brand color used throughout the UI" />
        <SettingSelect label="Language" value={current.language} options={[{ value: "en", label: "English" }]} onChange={(v) => set({ language: v })} description="UI language (more coming soon)" />
      </SettingCard>

      <SettingCard title="Startup & Behavior">
        <SettingSelect label="Default Startup Page" value={current.defaultStartupPage} options={PAGE_OPTIONS} onChange={(v) => set({ defaultStartupPage: v as AppSettings["defaultStartupPage"] })} />
        <SettingSelect label="Startup Behavior" value={current.startupBehavior} options={STARTUP_OPTIONS} onChange={(v) => set({ startupBehavior: v as AppSettings["startupBehavior"] })} />
        <SettingToggle label="Auto-Save" checked={current.autoSave} onChange={(v) => set({ autoSave: v })} description="Automatically save changes as you work" />
        <SettingInput label="Recent Projects" value={current.recentProjects} type="number" min={0} max={50} onChange={(v) => set({ recentProjects: Math.max(0, Math.min(50, Number(v))) })} />
      </SettingCard>

      <SettingCard title="Updates">
        <SettingToggle label="Check for Updates" checked={current.checkUpdates} onChange={(v) => set({ checkUpdates: v })} description="Automatically check for new versions" />
        <SettingToggle label="Launch at System Startup" checked={current.autoLaunch} onChange={(v) => set({ autoLaunch: v })} description="Auto-launch when your computer starts" />
      </SettingCard>
    </div>
  );
}

function AppearanceSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Customize the look and feel of the interface</p>

      <SettingCard title="Layout">
        <SettingToggle label="Compact Mode" checked={current.compactMode} onChange={(v) => set({ compactMode: v })} description="Tighter spacing for more content on screen" />
        <SettingSlider label="Sidebar Width" value={current.sidebarWidth} min={180} max={320} unit="px" onChange={(v) => set({ sidebarWidth: v })} />
        <SettingSlider label="UI Scale" value={current.uiScale} min={75} max={150} step={5} unit="%" onChange={(v) => set({ uiScale: v })} />
        <SettingSlider label="Icon Size" value={current.iconSize} min={12} max={24} unit="px" onChange={(v) => set({ iconSize: v })} />
      </SettingCard>

      <SettingCard title="Visual Effects">
        <SettingToggle label="Blur Effects" checked={current.blurEffects} onChange={(v) => set({ blurEffects: v })} description="Backdrop blur on modals and panels" />
        <SettingToggle label="Glass Effects" checked={current.glassEffects} onChange={(v) => set({ glassEffects: v })} description="Frosted glass appearance on surfaces" />
        <SettingToggle label="Reduced Motion" checked={!current.preloadDatasets} onChange={(v) => set({ preloadDatasets: v })} description="Minimize animations (prefers-reduced-motion)" />
      </SettingCard>
    </div>
  );
}

function ProjectionSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Projection</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Defaults for the projection output</p>

      <SettingCard title="Display">
        <SettingSelect label="Resolution" value={current.projectorResolution} options={RESOLUTION_OPTIONS} onChange={(v) => set({ projectorResolution: v })} description="Output resolution for the projector window" />
        <SettingSlider label="Safe Margins" value={current.safeMargins} min={0} max={20} unit="%" onChange={(v) => set({ safeMargins: v })} description="Safe area boundary as percentage of screen" />
      </SettingCard>

      <SettingCard title="Media Defaults">
        <SettingInput label="Image Duration" value={Math.round(current.defaultImageDurationMs / 1000)} type="number" min={1} max={3600} suffix="seconds" onChange={(v) => set({ defaultImageDurationMs: Math.max(1, Number(v)) * 1000 })} />
        <SettingSelect label="Default Transition" value={current.defaultTransition} options={[
          { value: "fade", label: "Fade" },
          { value: "crossfade", label: "Crossfade" },
          { value: "zoom", label: "Zoom" },
          { value: "dissolve", label: "Dissolve" },
          { value: "none", label: "None" },
        ]} onChange={(v) => set({ defaultTransition: v as AppSettings["defaultTransition"] })} />
        <SettingSelect label="Default Loop Mode" value={current.defaultLoopMode} options={[
          { value: "none", label: "No Loop" },
          { value: "single", label: "Loop Single" },
          { value: "playlist", label: "Loop Playlist" },
        ]} onChange={(v) => set({ defaultLoopMode: v as AppSettings["defaultLoopMode"] })} />
      </SettingCard>

      <SettingCard title="Playback">
        <SettingSlider label="Default Volume" value={Math.round(current.defaultVolume * 100)} min={0} max={100} unit="%" onChange={(v) => set({ defaultVolume: v / 100 })} />
        <SettingToggle label="Autoplay Videos" checked={current.autoplayVideo} onChange={(v) => set({ autoplayVideo: v })} />
        <SettingToggle label="Mute on Start" checked={current.muteOnStart} onChange={(v) => set({ muteOnStart: v })} />
        <SettingToggle label="Auto Transition" checked={current.autoTransition} onChange={(v) => set({ autoTransition: v })} description="Automatically advance to next item" />
      </SettingCard>

      <SettingCard title="Screens">
        <SettingToggle label="Black Screen" checked={current.blackScreen} onChange={(v) => set({ blackScreen: v })} description="Show black screen between items" />
        <SettingToggle label="Logo Screen" checked={current.logoScreen} onChange={(v) => set({ logoScreen: v })} description="Show logo when no content is projected" />
        <SettingToggle label="Freeze on Idle" checked={current.freezeScreen} onChange={(v) => set({ freezeScreen: v })} description="Freeze current display when idle" />
        <SettingInput label="Countdown Duration" value={current.countdownSeconds} type="number" min={3} max={300} suffix="seconds" onChange={(v) => set({ countdownSeconds: Math.max(3, Number(v)) })} />
      </SettingCard>
    </div>
  );
}

function TextFormattingSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Text Formatting</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Default text styles for projected content</p>

      <SettingCard title="Fonts">
        <SettingInput label="Default Font" value={current.defaultFont} onChange={(v) => set({ defaultFont: v })} placeholder="Inter" />
        <SettingInput label="Fallback Font" value={current.fallbackFont} onChange={(v) => set({ fallbackFont: v })} placeholder="sans-serif" />
      </SettingCard>

      <SettingCard title="Size & Weight">
        <SettingSlider label="Font Size" value={current.fontSize} min={12} max={200} unit="px" onChange={(v) => set({ fontSize: v })} />
        <SettingSlider label="Font Weight" value={current.fontWeight} min={300} max={900} step={100} onChange={(v) => set({ fontWeight: v })} />
        <SettingSlider label="Line Spacing" value={current.lineSpacing} min={1} max={3} step={0.1} onChange={(v) => set({ lineSpacing: v })} />
        <SettingSlider label="Letter Spacing" value={current.letterSpacing} min={-2} max={8} step={0.5} unit="px" onChange={(v) => set({ letterSpacing: v })} />
      </SettingCard>

      <SettingCard title="Effects">
        <SettingToggle label="Text Shadow" checked={current.shadowEnabled} onChange={(v) => set({ shadowEnabled: v })} />
        <SettingToggle label="Text Outline" checked={current.outlineEnabled} onChange={(v) => set({ outlineEnabled: v })} />
        <SettingToggle label="Text Glow" checked={current.glowEnabled} onChange={(v) => set({ glowEnabled: v })} description="Adds a soft glow effect around text" />
      </SettingCard>
    </div>
  );
}

function ThemeSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Themes</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Manage theme and template behavior</p>

      <SettingCard title="Behavior">
        <SettingToggle label="Animated Themes" checked={current.animatedThemesEnabled} onChange={(v) => set({ animatedThemesEnabled: v })} description="Enable animated background themes" />
        <SettingToggle label="Auto-Apply Theme" checked={current.themeAutoApply} onChange={(v) => set({ themeAutoApply: v })} description="Automatically apply theme when selected" />
        <SettingSlider label="Transition Speed" value={current.themeTransitionSpeed} min={100} max={2000} step={100} unit="ms" onChange={(v) => set({ themeTransitionSpeed: v })} />
      </SettingCard>
    </div>
  );
}

function BibleSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Bible</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Bible display and search preferences</p>

      <SettingCard title="Display">
        <SettingSelect label="Default Translation" value={current.defaultTranslation} options={[
          { value: "en", label: "English" },
          { value: "ta", label: "Tamil" },
        ]} onChange={(v) => set({ defaultTranslation: v })} />
        <SettingToggle label="Tamil First" checked={current.tamilFirst} onChange={(v) => set({ tamilFirst: v })} description="Show Tamil text as the primary reference" />
        <SettingToggle label="Parallel Mode" checked={current.parallelMode} onChange={(v) => set({ parallelMode: v })} description="Show English and Tamil side by side" />
      </SettingCard>

      <SettingCard title="References">
        <SettingToggle label="Book Abbreviations" checked={current.bookAbbreviations} onChange={(v) => set({ bookAbbreviations: v })} />
        <SettingToggle label="Verse Numbering" checked={current.verseNumbering} onChange={(v) => set({ verseNumbering: v })} />
      </SettingCard>

      <SettingCard title="Search">
        <SettingToggle label="Tanglish Search" checked={current.tanglishSearch} onChange={(v) => set({ tanglishSearch: v })} description="Search Tamil text using Roman characters" />
        <SettingToggle label="Phonetic Search" checked={current.phoneticSearch} onChange={(v) => set({ phoneticSearch: v })} description="Match phonetically similar words" />
      </SettingCard>
    </div>
  );
}

function SongSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Songs</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Song library and search preferences</p>

      <SettingCard title="General">
        <SettingSelect label="Default Language" value={current.songsDefaultLanguage} options={[
          { value: "ta", label: "Tamil" },
          { value: "en", label: "English" },
        ]} onChange={(v) => set({ songsDefaultLanguage: v })} />
        <SettingSelect label="Default Sorting" value={current.defaultSorting} options={SORT_OPTIONS} onChange={(v) => set({ defaultSorting: v })} />
      </SettingCard>

      <SettingCard title="Search & Display">
        <SettingToggle label="Tanglish Search" checked={current.tanglishSearchEnabled} onChange={(v) => set({ tanglishSearchEnabled: v })} description="Search using Romanized Tamil" />
        <SettingToggle label="Auto-Load Lyrics" checked={current.autoLoadLyrics} onChange={(v) => set({ autoLoadLyrics: v })} description="Preload lyrics when song is selected" />
      </SettingCard>
    </div>
  );
}

function MediaSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Media</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Media library and playback defaults</p>

      <SettingCard title="Playback">
        <SettingInput label="Default Image Duration" value={Math.round(current.imageDurationMs / 1000)} type="number" min={1} max={3600} suffix="seconds" onChange={(v) => set({ imageDurationMs: Math.max(1, Number(v)) * 1000 })} />
        <SettingToggle label="Autoplay Videos" checked={current.videoAutoplay} onChange={(v) => set({ videoAutoplay: v })} />
        <SettingToggle label="Loop Media" checked={current.mediaLoop} onChange={(v) => set({ mediaLoop: v })} />
      </SettingCard>

      <SettingCard title="Performance">
        <SettingToggle label="Hardware Acceleration" checked={current.hardwareAcceleration} onChange={(v) => set({ hardwareAcceleration: v })} />
        <SettingSelect label="Thumbnail Quality" value={current.thumbnailQuality} options={[
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ]} onChange={(v) => set({ thumbnailQuality: v })} />
      </SettingCard>
    </div>
  );
}

function SearchSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Search</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Search behavior and limits</p>

      <SettingCard title="General">
        <SettingToggle label="Instant Search" checked={current.instantSearch} onChange={(v) => set({ instantSearch: v })} description="Show results as you type" />
        <SettingToggle label="Search History" checked={current.searchHistory} onChange={(v) => set({ searchHistory: v })} description="Remember recent searches" />
        <SettingInput label="Max Results" value={current.maxResults} type="number" min={10} max={500} onChange={(v) => set({ maxResults: Math.max(10, Math.min(500, Number(v))) })} />
      </SettingCard>
    </div>
  );
}

function PerformanceSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Performance</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Optimize application performance</p>

      <SettingCard title="Rendering">
        <SettingToggle label="GPU Rendering" checked={current.gpuRendering} onChange={(v) => set({ gpuRendering: v })} description="Use GPU for rendering when available" />
      </SettingCard>

      <SettingCard title="Data">
        <SettingToggle label="Preload Datasets" checked={current.preloadDatasets} onChange={(v) => set({ preloadDatasets: v })} description="Load Bible and Songs data in the background" />
        <SettingToggle label="Lazy Loading" checked={current.lazyLoading} onChange={(v) => set({ lazyLoading: v })} description="Load media thumbnails on demand" />
      </SettingCard>
    </div>
  );
}

function AudioSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Audio</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Audio output settings</p>

      <SettingCard title="Output">
        <SettingSelect label="Output Device" value={current.outputDevice} options={[
          { value: "default", label: "System Default" },
        ]} onChange={(v) => set({ outputDevice: v })} description="Audio output device for media playback" />
        <SettingSlider label="Volume" value={Math.round(current.audioVolume * 100)} min={0} max={100} unit="%" onChange={(v) => set({ audioVolume: v / 100 })} />
      </SettingCard>

      <SettingCard title="Transitions">
        <SettingInput label="Fade In" value={current.fadeInMs} type="number" min={0} max={5000} step={100} suffix="ms" onChange={(v) => set({ fadeInMs: Number(v) })} />
        <SettingInput label="Fade Out" value={current.fadeOutMs} type="number" min={0} max={5000} step={100} suffix="ms" onChange={(v) => set({ fadeOutMs: Number(v) })} />
        <SettingToggle label="Mute on Startup" checked={current.muteOnStartup} onChange={(v) => set({ muteOnStartup: v })} />
      </SettingCard>
    </div>
  );
}

function VideoSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Video</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Video playback and rendering</p>

      <SettingCard title="Playback">
        <SettingToggle label="Hardware Decoding" checked={current.hardwareDecoding} onChange={(v) => set({ hardwareDecoding: v })} />
        <SettingSelect label="Frame Rate" value={String(current.frameRate)} options={[
          { value: "24", label: "24 FPS" },
          { value: "30", label: "30 FPS" },
          { value: "60", label: "60 FPS" },
        ]} onChange={(v) => set({ frameRate: Number(v) })} />
      </SettingCard>
    </div>
  );
}

function ShortcutsSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Customize keyboard shortcuts</p>

      <SettingCard title="Shortcut Editor">
        <div className="py-4 text-center text-sm text-muted-foreground">
          <Keyboard className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
          <p>Keyboard shortcut customization is available from the Shortcuts page.</p>
          <p className="mt-1 text-xs text-muted-foreground/50">
            Navigate to the <span className="font-medium text-foreground/70">Shortcuts</span> page in the sidebar to view and customize all shortcuts.
          </p>
        </div>
      </SettingCard>
    </div>
  );
}

function RemoteSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Remote Control</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Control the application remotely</p>

      <SettingCard title="Network">
        <div className="py-4 text-center text-sm text-muted-foreground">
          <Wifi className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
          <p>Remote control functionality is coming in a future update.</p>
          <p className="mt-1 text-xs text-muted-foreground/50">
            This will allow controlling presentations from mobile devices and secondary computers over your local network.
          </p>
        </div>
      </SettingCard>
    </div>
  );
}

function BackupSettings({ onExport, onImport, busy }: {
  onExport: () => Promise<void>; onImport: (file: File) => Promise<void>; busy: string | null;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Backup & Restore</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Export and import your data</p>

      <SettingCard title="Backup">
        <div className="py-3">
          <p className="mb-3 text-sm text-foreground/80">Create a complete backup of all your data including media files, playlists, and settings.</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExport}
              disabled={busy === "export"}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              {busy === "export" ? "Exporting…" : "Export Backup"}
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-accent">
              <Upload className="h-3.5 w-3.5" />
              {busy === "import" ? "Importing…" : "Import Backup"}
              <input type="file" accept=".zip,application/zip" hidden onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
            </label>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Restore">
        <div className="py-3">
          <p className="text-sm text-muted-foreground">
            Restoring a backup will replace your current library. You can choose to replace or merge when importing.
          </p>
        </div>
      </SettingCard>
    </div>
  );
}

function StorageSettings({ stats, dbSize, wipeAll }: {
  stats: { media: number; folders: number; playlists: number; blobsMB: number } | null;
  dbSize: string | null; wipeAll: () => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Storage</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Manage local data and storage</p>

      <SettingCard title="Database Statistics">
        {stats ? (
          <div className="grid grid-cols-2 gap-3 py-2 sm:grid-cols-4">
            <StatCard label="Media Files" value={stats.media} />
            <StatCard label="Folders" value={stats.folders} />
            <StatCard label="Playlists" value={stats.playlists} />
            <StatCard label="Used Space" value={`${stats.blobsMB.toFixed(1)} MB`} />
          </div>
        ) : (
          <div className="py-3 text-sm text-muted-foreground">Loading statistics…</div>
        )}
        {dbSize && (
          <div className="flex items-center gap-2 border-t border-border/20 pt-3">
            <Database className="h-3.5 w-3.5 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground/60">Browser storage usage: {dbSize}</span>
          </div>
        )}
      </SettingCard>

      <SettingCard title="Actions">
        <div className="py-2">
          <button
            onClick={wipeAll}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive transition-all hover:bg-destructive/20"
          >
            <Database className="h-3.5 w-3.5" />
            Delete All Data
          </button>
          <p className="mt-2 text-xs text-muted-foreground/50">This permanently removes all local media, playlists, and settings.</p>
        </div>
      </SettingCard>
    </div>
  );
}

function SecuritySettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Security</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Application security settings</p>

      <SettingCard title="Access Control">
        <SettingToggle label="Lock Settings" checked={current.lockSettings} onChange={(v) => set({ lockSettings: v })} description="Require confirmation before changing settings" />
        <SettingToggle label="Require Password" checked={current.requirePassword} onChange={(v) => set({ requirePassword: v })} description="Password-protect settings access" />
        <SettingToggle label="Read-Only Mode" checked={current.readOnlyMode} onChange={(v) => set({ readOnlyMode: v })} description="Prevent accidental changes to content" />
      </SettingCard>
    </div>
  );
}

function AdvancedSettings({ current, set }: { current: AppSettings; set: (p: Partial<AppSettings>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Advanced</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Advanced configuration and tools</p>

      <SettingCard title="Developer">
        <SettingToggle label="Developer Mode" checked={current.developerMode} onChange={(v) => set({ developerMode: v })} description="Enable developer tools and debug information" />
        <SettingSelect label="Log Level" value={current.logLevel} options={LOG_LEVEL_OPTIONS} onChange={(v) => set({ logLevel: v })} />
      </SettingCard>
    </div>
  );
}

function AboutSettings() {
  const [estimatedDbSize, setEstimatedDbSize] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const est = await navigator.storage?.estimate?.();
        if (est?.usage != null) setEstimatedDbSize(`${(est.usage / (1024 * 1024)).toFixed(1)} MB`);
      } catch { /* */ }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">About</h2>
      <p className="-mt-3 text-xs text-muted-foreground/60">Application information</p>

      <SettingCard title="Church Media">
        <div className="py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MonitorPlay className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Church Media</div>
              <div className="text-xs text-muted-foreground">Projection Software</div>
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Version Info">
        <div className="divide-y divide-border/20 py-1">
          {[
            ["Application Version", "1.0.0"],
            ["Database Version", "1"],
            ["Build", import.meta.env.PROD ? "Production" : "Development"],
            ["Framework", "React + TanStack Start"],
            ["Storage", estimatedDbSize ?? "Unknown"],
            ["Renderer", "HTML/CSS (Tailwind)"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-muted-foreground/70">{label}</span>
              <span className="text-xs font-medium text-foreground/80">{value}</span>
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard title="License">
        <div className="py-3 text-sm text-muted-foreground">
          <p>Church Media is free and open-source software for church media projection.</p>
          <p className="mt-1 text-xs text-muted-foreground/50">
            All data is stored locally. No telemetry or data collection.
          </p>
        </div>
      </SettingCard>
    </div>
  );
}
