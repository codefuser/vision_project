import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Save, Check, X, Sparkles, Star, Copy, Search, SlidersHorizontal } from "lucide-react";
import { ProjectionTextStage } from "@/components/ProjectionTextStage";
import {
  DEFAULT_TAMIL_STYLE, DEFAULT_ENGLISH_STYLE, DEFAULT_REFERENCE_STYLE,
  DEFAULT_BACKGROUND, DEFAULT_TEXT_STYLE,
  type GroupedStyles, type LogoBroadcast, type TextOverlay,
} from "@/lib/broadcast";
import { TEMPLATE_PRESETS, TEMPLATE_CATEGORIES, type TemplatePreset, type TemplateCategory, type ThemeMood } from "@/lib/templates/presets";
import { useCustomTemplates } from "@/stores/custom-templates.store";
import { useThemeFavorites } from "@/stores/theme-favorites.store";
import { applyTemplate, activeTemplateId } from "@/lib/templates/apply";
import { useLogo } from "@/stores/logo.store";
import { cn } from "@/lib/utils";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; }

type Bucket = "All" | "Favorites" | "Recent" | "Custom" | TemplateCategory;

const SAMPLE_OVERLAY: TextOverlay = {
  reference: "சங்கீதம் 23:1",
  text: "கர்த்தர் என் மேய்ப்பராயிருக்கிறார்",
  subtext: "The Lord is my shepherd",
  translation: "தமிழ்",
  subtranslation: "ENG",
  kind: "song_slide",
};

function presetToGroups(preset: TemplatePreset): GroupedStyles {
  const baseText = preset.text ?? {};
  return {
    reference: { ...DEFAULT_REFERENCE_STYLE, ...baseText, ...(preset.perGroup?.reference ?? {}) },
    tamil: { ...DEFAULT_TAMIL_STYLE, ...baseText, ...(preset.perGroup?.tamil ?? {}) },
    english: { ...DEFAULT_ENGLISH_STYLE, ...baseText, ...(preset.perGroup?.english ?? {}) },
    background: {
      ...DEFAULT_BACKGROUND, ...preset.background,
      animation: preset.background.animation ?? "none",
      gradient: preset.background.gradient ?? null,
    },
  };
}

function presetToLogo(preset: TemplatePreset, fallback: ReturnType<typeof useLogo.getState>): LogoBroadcast {
  if (preset.logo) {
    return {
      enabled: preset.logo.enabled,
      current: fallback.current,
      settings: { ...fallback.settings, ...(preset.logo.settings ?? {}) },
    };
  }
  return { enabled: false, current: fallback.current, settings: fallback.settings };
}

const MOOD_EMOJIS: Record<string, string> = {
  classic: "🏛️", modern: "✨", warm: "🔥", cool: "❄️",
  dark: "🌑", light: "☀️", dramatic: "⚡", gentle: "🌸",
};

const SEARCH_TAGS = [
  "dark", "light", "blue", "gold", "green", "purple", "red", "white", "black",
  "serif", "sans", "bold", "thin", "gradient", "solid", "animated",
  "modern", "classic", "minimal", "worship", "bible", "prayer",
];

export function ThemeGalleryDialog({ open, onOpenChange }: Props) {
  const custom = useCustomTemplates((s) => s.templates);
  const removeCustom = useCustomTemplates((s) => s.remove);
  const saveCurrent = useCustomTemplates((s) => s.saveCurrent);
  const duplicateCustom = useCustomTemplates((s) => s.duplicate);
  const logo = useLogo();

  const favorites = useThemeFavorites((s) => s.favorites);
  const recents = useThemeFavorites((s) => s.recents);
  const toggleFavorite = useThemeFavorites((s) => s.toggleFavorite);
  const mostUsedFn = useThemeFavorites((s) => s.mostUsed);

  const [bucket, setBucket] = useState<Bucket>("All");
  const [query, setQuery] = useState("");
  const [previewing, setPreviewing] = useState<TemplatePreset | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(activeTemplateId());
  const [saveOpen, setSaveOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [moodFilter, setMoodFilter] = useState<ThemeMood | "">("");

  const allBuiltin = useMemo(() => TEMPLATE_PRESETS, []);
  const all = useMemo(() => [...custom, ...allBuiltin], [custom, allBuiltin]);
  const byId = useMemo(() => new Map(all.map((t) => [t.id, t])), [all]);
  const mostUsedIds = useMemo(() => mostUsedFn(12), [mostUsedFn, recents, favorites]);

  const bucketList = useMemo(() => {
    let list: TemplatePreset[];
    if (bucket === "All") list = all;
    else if (bucket === "Custom") list = custom;
    else if (bucket === "Favorites") list = favorites.map((id) => byId.get(id)).filter(Boolean) as TemplatePreset[];
    else if (bucket === "Recent") list = recents.map((id) => byId.get(id)).filter(Boolean) as TemplatePreset[];
    else list = all.filter((t) => t.category === bucket);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
        t.mood?.includes(q) ||
        t.background.color?.toLowerCase().includes(q)
      );
    }
    if (moodFilter) {
      list = list.filter((t) => t.mood === moodFilter);
    }
    return list;
  }, [bucket, all, custom, favorites, recents, mostUsedIds, byId, query, moodFilter]);

  const onApply = (preset: TemplatePreset) => {
    applyTemplate(preset.id);
    setAppliedId(preset.id);
    setPreviewing(null);
    onOpenChange(false);
  };

  const onSave = () => {
    if (!newName.trim()) return;
    saveCurrent(newName.trim());
    setNewName("");
    setSaveOpen(false);
    setBucket("Custom");
  };

  const sideButtons: Array<{ key: Bucket; label: string; count: number; icon?: string }> = [
    { key: "All", label: "All Themes", count: all.length },
    { key: "Favorites", label: "Favorites", count: favorites.length, icon: "★" },
    { key: "Recent", label: "Recent", count: recents.length, icon: "🕒" },
    { key: "Custom", label: "Custom", count: custom.length, icon: "🛠" },
    ...TEMPLATE_CATEGORIES.map((c) => {
      const icons: Record<string, string> = {
        Worship: "🎵", Bible: "📖", Prayer: "🙏",
        Seasonal: "🎄", Events: "🎉", Modern: "✨",
        Animated: "🎬", Minimal: "◇",
      };
      return { key: c as Bucket, label: c, count: allBuiltin.filter((t) => t.category === c).length, icon: icons[c] ?? "" };
    }),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1320px] h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Theme Gallery
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {allBuiltin.length} built-in{custom.length > 0 ? ` · ${custom.length} custom` : ""}
              </span>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, tag, mood, color…"
                  className="h-8 w-64 pl-7 text-xs"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border text-muted-foreground transition hover:bg-accent",
                  showFilters && "border-primary/40 bg-primary/10 text-primary",
                )}
                title="Toggle mood filters"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
              <Button size="sm" variant="outline" onClick={() => setSaveOpen(true)}>
                <Save className="h-3.5 w-3.5" /> Save Current
              </Button>
            </div>
          </div>
          {showFilters && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2">
              <span className="mr-1 text-[10px] font-medium text-muted-foreground">Mood:</span>
              <button
                onClick={() => setMoodFilter("")}
                className={cn("rounded-md border px-2 py-1 text-[10px] transition cursor-pointer", !moodFilter ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background text-muted-foreground hover:bg-accent")}
              >
                All
              </button>
              {(["classic", "modern", "warm", "cool", "dark", "light", "dramatic", "gentle"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMoodFilter(moodFilter === m ? "" : m)}
                  className={cn("rounded-md border px-2 py-1 text-[10px] transition cursor-pointer", moodFilter === m ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background text-muted-foreground hover:bg-accent")}
                >
                  {MOOD_EMOJIS[m]} {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="flex min-h-0 flex-1">
          {/* Compact sidebar */}
          <aside className="w-44 shrink-0 overflow-y-auto border-r border-border bg-muted/10 p-1.5 text-xs">
            {/* System buckets */}
            <div className="mb-1.5 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground/60">System</div>
            {sideButtons.slice(0, 4).map(({ key, label, count, icon }) => (
              <button
                key={key}
                onClick={() => setBucket(key)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition",
                  bucket === key ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-muted-foreground",
                )}
              >
                {icon && <span className="w-4 text-center text-sm leading-none">{icon}</span>}
                <span className="flex-1 truncate">{label}</span>
                <span className={cn("rounded px-1 text-[9px]", bucket === key ? "bg-primary/20" : "bg-muted")}>{count}</span>
              </button>
            ))}

            {/* Content categories */}
            <div className="mb-1.5 mt-3 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground/60">Categories</div>
            {sideButtons.slice(4).map(({ key, label, count, icon }) => (
              <button
                key={key}
                onClick={() => setBucket(key)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition",
                  bucket === key ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-muted-foreground",
                )}
              >
                {icon && <span className="w-4 text-center text-sm leading-none">{icon}</span>}
                <span className="flex-1 truncate">{label}</span>
                <span className={cn("rounded px-1 text-[9px]", bucket === key ? "bg-primary/20" : "bg-muted")}>{count}</span>
              </button>
            ))}
          </aside>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-3">
            {bucketList.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                {bucket === "Custom" ? "No saved themes yet. Use \"Save Current as Template\"."
                  : bucket === "Favorites" ? "Tap ★ on any theme to add it here."
                  : bucket === "Recent" ? "No recently applied themes yet."
                  : "No themes match this filter."}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {bucketList.map((preset) => (
                  <ThumbCard
                    key={preset.id}
                    preset={preset}
                    isActive={appliedId === preset.id}
                    isCustom={preset.id.startsWith("custom-")}
                    isFavorite={favorites.includes(preset.id)}
                    onClick={() => setPreviewing(preset)}
                    onToggleFavorite={() => toggleFavorite(preset.id)}
                    onApply={() => onApply(preset)}
                    onDuplicate={() => duplicateCustom(preset)}
                    onDelete={() => { removeCustom(preset.id); if (appliedId === preset.id) setAppliedId(null); }}
                    logoBase={logo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Large preview dialog */}
        <Dialog open={!!previewing} onOpenChange={(v) => !v && setPreviewing(null)}>
          <DialogContent className="!max-w-[1100px] gap-3 p-4">
            {previewing && (
              <>
                <DialogHeader className="flex-row items-center justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2 text-base">
                      {previewing.name}
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                        {previewing.category}
                      </span>
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground">{previewing.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    {previewing.mood && <span>{MOOD_EMOJIS[previewing.mood]} {previewing.mood}</span>}
                    {previewing.tags?.slice(0, 3).map((t) => (
                      <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[9px]">#{t}</span>
                    ))}
                  </div>
                </DialogHeader>
                <div className="overflow-hidden rounded-lg border border-border bg-black" style={{ aspectRatio: "16 / 9" }}>
                  <ProjectionTextStage
                    overlay={SAMPLE_OVERLAY}
                    textStyle={DEFAULT_TEXT_STYLE}
                    groupedStyles={presetToGroups(previewing)}
                    logo={presetToLogo(previewing, logo)}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Button variant="ghost" size="sm" onClick={() => duplicateCustom(previewing)}>
                    <Copy className="h-3.5 w-3.5" /> Duplicate as Custom
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setPreviewing(null)}>
                      <X className="h-3.5 w-3.5" /> Cancel
                    </Button>
                    <Button onClick={() => onApply(previewing)}>
                      <Check className="h-3.5 w-3.5" /> Apply Theme
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Save as custom dialog */}
        <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
          <DialogContent className="!max-w-md gap-3">
            <DialogHeader>
              <DialogTitle className="text-base">Save current style as template</DialogTitle>
            </DialogHeader>
            <Input
              autoFocus
              placeholder="Theme name (e.g. Sunday Worship)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSave(); }}
            />
            <p className="text-[11px] text-muted-foreground">
              Captures current Reference, Tamil, and English text styles plus background and logo settings.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSaveOpen(false)}>Cancel</Button>
              <Button onClick={onSave} disabled={!newName.trim()}><Save className="h-3.5 w-3.5" /> Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

// ────────── Theme Card ──────────
function ThumbCard({
  preset, isActive, isCustom, isFavorite, onClick, onToggleFavorite, onApply, onDuplicate, onDelete, logoBase,
}: {
  preset: TemplatePreset; isActive: boolean; isCustom: boolean; isFavorite: boolean;
  onClick: () => void; onToggleFavorite: () => void; onApply: () => void;
  onDuplicate: () => void; onDelete: () => void;
  logoBase: ReturnType<typeof useLogo.getState>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { setVisible(true); io.disconnect(); break; }
        }
      },
      { root: null, rootMargin: "300px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  const groups = useMemo(() => (visible ? presetToGroups(preset) : null), [visible, preset]);
  const logo = useMemo(() => (visible ? presetToLogo(preset, logoBase) : null), [visible, preset, logoBase]);
  const placeholderBg = preset.background.gradient ?? preset.background.color ?? "#000";
  const isAnimated = preset.background.animation && preset.background.animation !== "none";

  const MOOD_COLORS: Record<string, string> = {
    classic: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    modern: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    warm: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
    cool: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200",
    dark: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    light: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    dramatic: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
    gentle: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border bg-card transition-all duration-200",
        isActive
          ? "border-primary ring-2 ring-primary/40 shadow-md"
          : "border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5",
      )}
      style={{ contentVisibility: "auto", containIntrinsicSize: "260px 200px" } as React.CSSProperties}
    >
      {/* Preview area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
        {visible && groups && logo ? (
          <ProjectionTextStage
            overlay={SAMPLE_OVERLAY}
            textStyle={DEFAULT_TEXT_STYLE}
            groupedStyles={groups}
            logo={logo}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: placeholderBg }} />
        )}

        {/* Hover overlay for quick apply */}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/0 transition-all duration-200 group-hover:bg-black/40">
          <button
            onClick={(e) => { e.stopPropagation(); onApply(); }}
            className="translate-y-2 rounded-lg bg-primary px-4 py-1.5 text-[11px] font-semibold text-primary-foreground opacity-0 shadow-lg transition-all duration-200 hover:opacity-90 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Apply Theme
          </button>
        </div>

        {/* Active badge */}
        {isActive && (
          <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-primary-foreground shadow-sm">
            <Check className="h-2.5 w-2.5" /> Active
          </span>
        )}

        {/* Animated badge */}
        {isAnimated && (
          <span className="absolute left-2 bottom-2 z-20 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            Animated
          </span>
        )}

        {/* Top-right actions */}
        <div className="absolute right-2 top-2 z-20 flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            title={isFavorite ? "Remove from favourites" : "Add to favourites"}
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 shadow-sm transition hover:bg-black/80 group-hover:opacity-100",
              isFavorite && "opacity-100",
            )}
          >
            <Star className={cn("h-3 w-3", isFavorite && "fill-yellow-300 text-yellow-300")} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            title="Duplicate as custom theme"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 shadow-sm transition hover:bg-black/80 group-hover:opacity-100"
          >
            <Copy className="h-3 w-3" />
          </button>
          {isCustom && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              title="Delete custom theme"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 shadow-sm transition hover:bg-red-500 group-hover:opacity-100"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Info area */}
      <div className="border-t border-border p-2.5">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[12px] font-semibold">{preset.name}</span>
              {preset.mood && (
                <span className={cn("shrink-0 rounded px-1 py-0.5 text-[8px] font-medium leading-none", MOOD_COLORS[preset.mood] ?? "bg-muted text-muted-foreground")}>
                  {preset.mood}
                </span>
              )}
            </div>
            {preset.tags && preset.tags.length > 0 && (
              <div className="mt-0.5 flex flex-wrap gap-1">
                {preset.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded bg-muted/60 px-1 text-[8px] leading-none text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className={cn(
            "shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide",
            isCustom ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200" : "bg-muted text-muted-foreground",
          )}>
            {isCustom ? "Custom" : preset.category}
          </span>
        </div>
      </div>
    </div>
  );
}
