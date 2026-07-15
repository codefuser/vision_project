import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Save, Sparkles, X, Check, Pencil, TrendingUp, Sparkle, Clock } from "lucide-react";
import { TEMPLATE_PRESETS, TEMPLATE_CATEGORIES, type TemplatePreset } from "@/lib/templates/presets";
import { useCustomTemplates } from "@/stores/custom-templates.store";
import { useThemeFavorites } from "@/stores/theme-favorites.store";
import { applyTemplate, activeTemplateId } from "@/lib/templates/apply";
import { useWorkspace } from "@/features/workspace/workspace.store";
import { cn } from "@/lib/utils";
import { ThemeGrid } from "./theme-gallery/ThemeGrid";
import { ThemeCard } from "./theme-gallery/ThemeCard";
import { ThemeAnimation } from "./theme-gallery/ThemeAnimation";
import { themeCache } from "./theme-gallery/ThemeCache";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; }

type Bucket =
  | "All" | "Favorites" | "Recent" | "Custom"
  | "Modern" | "Classic" | "Bible" | "Worship"
  | "Prayer" | "Animated" | "Seasonal";

const BUCKETS: Array<{ key: Bucket; label: string }> = [
  { key: "Favorites", label: "Favorites" },
  { key: "Recent", label: "Recent" },
  { key: "Custom", label: "Custom" },
  { key: "All", label: "All Themes" },
  { key: "Animated", label: "Animated" },
  { key: "Modern", label: "Modern" },
  { key: "Classic", label: "Classic" },
  { key: "Worship", label: "Worship" },
  { key: "Bible", label: "Bible" },
  { key: "Prayer", label: "Prayer" },
  { key: "Seasonal", label: "Seasonal" },
];

const STAFF_PICKS = [
  "animated-aurora-flow", "animated-heaven-light", "animated-nebula",
  "animated-light-rays", "animated-ocean-waves", "animated-velvet-motion",
  "animated-aurora-borealis", "animated-fireflies",
];

export function ThemeGalleryDialog({ open, onOpenChange }: Props) {
  const custom = useCustomTemplates((s) => s.templates);
  const saveCurrent = useCustomTemplates((s) => s.saveCurrent);
  const renameCustom = useCustomTemplates((s) => s.rename);

  const favorites = useThemeFavorites((s) => s.favorites);
  const recents = useThemeFavorites((s) => s.recents);
  const usage = useThemeFavorites((s) => s.usage);
  const toggleFavorite = useThemeFavorites((s) => s.toggleFavorite);
  const reorderFavorites = useThemeFavorites((s) => s.reorderFavorites);

  const wsGalleryBucket = useWorkspace((s) => s.galleryBucket);
  const wsGalleryQuery = useWorkspace((s) => s.galleryQuery);
  const setGalleryBucket = useWorkspace((s) => s.setGalleryBucket);
  const setGalleryQuery = useWorkspace((s) => s.setGalleryQuery);
  const [bucket, setBucket] = useState<Bucket>(() => wsGalleryBucket as Bucket || "All");
  const [query, setQuery] = useState(() => wsGalleryQuery);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [featuredHover, setFeaturedHover] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setAppliedId(activeTemplateId());
      themeCache.prewarm(TEMPLATE_PRESETS);
      themeCache.prewarm(custom);
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open, custom]);

  // Sync bucket/query to workspace store for persistence across sessions
  useEffect(() => { setGalleryBucket(bucket); }, [bucket]);
  useEffect(() => { setGalleryQuery(query); }, [query]);

  const allBuiltin = useMemo(() => TEMPLATE_PRESETS, []);
  const all = useMemo(() => [...custom, ...allBuiltin], [custom, allBuiltin]);
  const byId = useMemo(() => new Map(all.map((t) => [t.id, t])), [all]);

  const bucketList = useMemo(() => {
    let list: TemplatePreset[];
    switch (bucket) {
      case "All": list = all; break;
      case "Custom": list = custom; break;
      case "Favorites": list = favorites.map((id) => byId.get(id)).filter(Boolean) as TemplatePreset[]; break;
      case "Recent": list = recents.map((id) => byId.get(id)).filter(Boolean) as TemplatePreset[]; break;
      case "Classic": list = all.filter((t) => t.mood === "classic"); break;
      default: list = all.filter((t) => t.category === bucket); break;
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
        t.mood?.toLowerCase().includes(q) ||
        t.background.animation?.toLowerCase().includes(q) ||
        t.background.color?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bucket, all, custom, favorites, recents, byId, query]);

  const bucketCounts = useMemo(() => {
    const c = {} as Record<Bucket, number>;
    c.All = all.length; c.Custom = custom.length;
    c.Favorites = favorites.length; c.Recent = recents.length;
    c.Classic = all.filter((t) => t.mood === "classic").length;
    for (const cat of TEMPLATE_CATEGORIES) {
      if (["Modern", "Bible", "Worship", "Prayer", "Animated", "Seasonal"].includes(cat)) {
        c[cat as Bucket] = allBuiltin.filter((t) => t.category === cat).length;
      }
    }
    return c;
  }, [all, custom, favorites, recents, allBuiltin]);

  const featuredPicks = useMemo(() => {
    return STAFF_PICKS.map((id) => byId.get(id)).filter(Boolean) as TemplatePreset[];
  }, [byId]);

  const mostUsed = useMemo(() => {
    const sorted = Object.entries(usage).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return sorted.map(([id]) => byId.get(id)).filter(Boolean) as TemplatePreset[];
  }, [usage, byId]);

  const handleApply = useCallback((preset: TemplatePreset) => {
    applyTemplate(preset.id);
    setAppliedId(preset.id);
  }, []);

  const handleSave = useCallback(() => {
    if (!newName.trim()) return;
    saveCurrent(newName.trim());
    setNewName(""); setSaveOpen(false); setBucket("Custom");
  }, [newName, saveCurrent]);

  const handleStartRename = useCallback((id: string) => {
    const p = byId.get(id);
    if (p) { setRenaming(id); setRenameValue(p.name); }
  }, [byId]);

  const handleFinishRename = useCallback(() => {
    if (renaming && renameValue.trim()) renameCustom(renaming, renameValue.trim());
    setRenaming(null); setRenameValue("");
  }, [renaming, renameValue, renameCustom]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1360px] h-[92vh] flex flex-col gap-0 p-0 overflow-hidden" hideCloseButton aria-describedby={undefined}>
        {/* ═══ Header ═══ */}
        <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold leading-tight">Theme Browser</h2>
                <p className="text-[11px] text-muted-foreground/70 leading-tight">
                  {allBuiltin.length} built-in{custom.length > 0 && ` · ${custom.length} custom`}
                </p>
              </div>
            </div>

            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search themes…"
                className="h-10 w-full rounded-xl border-border/60 bg-muted/30 pl-10 pr-9 text-sm placeholder:text-muted-foreground/40 focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/10"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); searchRef.current?.focus(); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/40 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button size="sm" variant="outline" onClick={() => setSaveOpen(true)} className="h-9 gap-2 rounded-xl border-border/60 px-4 text-xs font-medium">
                <Save className="h-3.5 w-3.5" /> Save Current
              </Button>
              <button
                onClick={() => onOpenChange(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border/30 text-muted-foreground/60 transition-all duration-200 hover:border-foreground/20 hover:bg-accent hover:text-foreground hover:shadow-lg active:scale-95"
                title="Close Theme Browser"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* ═══ Body ═══ */}
        <div className="flex min-h-0 flex-1">
          <aside className="w-44 shrink-0 overflow-y-auto border-r border-border/60 bg-muted/[0.03] px-2.5 py-3">
            {BUCKETS.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setBucket(btn.key)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-all duration-150 mb-0.5",
                  bucket === btn.key
                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                    : "text-muted-foreground/70 hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <span className={cn("flex-1 truncate", bucket === btn.key && "text-primary")}>{btn.label}</span>
                <span className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none",
                  bucket === btn.key ? "bg-primary/15 text-primary" : "bg-muted/60 text-muted-foreground/60",
                )}>{bucketCounts[btn.key] ?? 0}</span>
              </button>
            ))}
          </aside>

          <main className="flex-1 min-w-0 flex flex-col">
            {/* ═══ Featured Strip ═══ */}
            {bucket === "All" && !query && (
              <div className="shrink-0 border-b border-border/40 px-6 py-4">
                <div className="flex items-center gap-6 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Staff Picks</span>
                  </div>
                  {mostUsed.length >= 3 && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Most Used</span>
                    </div>
                  )}
                  {recents.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Recent</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                  {/* Staff Picks row */}
                  {featuredPicks.slice(0, 6).map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApply(preset)}
                      onMouseEnter={() => setFeaturedHover(preset.id)}
                      onMouseLeave={() => setFeaturedHover(null)}
                      className={cn(
                        "group relative shrink-0 w-44 cursor-pointer overflow-hidden rounded-xl transition-all duration-200",
                        appliedId === preset.id
                          ? "ring-2 ring-primary/40 shadow-lg shadow-primary/10"
                          : "hover:shadow-xl hover:-translate-y-0.5",
                      )}
                    >
                      <div className="relative aspect-video overflow-hidden rounded-xl" style={{ background: preset.background.gradient ?? preset.background.color ?? "#000" }}>
                        <div className={cn(
                          "absolute inset-0 transition-opacity duration-300",
                          appliedId === preset.id || featuredHover === preset.id ? "opacity-100" : "opacity-0",
                        )}>
                          <ThemeAnimation animation={preset.background.animation ?? "none"} paused={featuredHover !== preset.id && appliedId !== preset.id} />
                        </div>
                        {/* Tamil preview */}
                        <div className="absolute inset-0 flex items-center justify-center px-2">
                          <span
                            className="text-[9px] font-semibold leading-tight text-center line-clamp-2"
                            style={{ color: preset.text.color ?? "#fff", fontFamily: preset.text.fontFamily, textShadow: "0 1px 4px rgba(0,0,0,.6)" }}
                          >
                            கர்த்தர் என் மேய்ப்பராயிருக்கிறார்
                          </span>
                        </div>
                        {appliedId === preset.id && (
                          <div className="absolute top-1.5 right-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[7px] font-semibold text-primary-foreground shadow-sm">
                            Active
                          </div>
                        )}
                      </div>
                      <div className="px-2 py-1.5 text-left bg-card/80 backdrop-blur-sm border-t border-border/30 rounded-b-xl">
                        <div className="truncate text-[10px] font-semibold text-foreground/80">{preset.name}</div>
                      </div>
                    </button>
                  ))}
                  {/* Most Used row */}
                  {mostUsed.slice(0, 4).map((preset) => (
                    <button
                      key={`mu-${preset.id}`}
                      onClick={() => handleApply(preset)}
                      className="group relative shrink-0 w-36 cursor-pointer overflow-hidden rounded-xl transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-xl" style={{ background: preset.background.gradient ?? preset.background.color ?? "#000" }}>
                        <div className={cn("absolute inset-0", mostUsed.length < 4 && "opacity-80")}>
                          {preset.background.animation && preset.background.animation !== "none" && (
                            <ThemeAnimation animation={preset.background.animation} paused />
                          )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center px-2">
                          <span className="text-[8px] font-medium leading-tight text-center line-clamp-2 text-white/90" style={{ fontFamily: preset.text.fontFamily, textShadow: "0 1px 4px rgba(0,0,0,.6)" }}>
                            கர்த்தர் என் மேய்ப்பராயிருக்கிறார்
                          </span>
                        </div>
                      </div>
                      <div className="px-2 py-1 text-left bg-card/60 backdrop-blur-sm border-t border-border/20 rounded-b-xl">
                        <div className="truncate text-[9px] font-medium text-foreground/60">{preset.name}</div>
                      </div>
                    </button>
                  ))}
                  {/* Recent row */}
                  {recents.slice(0, 4).map((id) => {
                    const preset = byId.get(id);
                    if (!preset) return null;
                    return (
                      <button
                        key={`re-${preset.id}`}
                        onClick={() => handleApply(preset)}
                        className="group relative shrink-0 w-28 cursor-pointer overflow-hidden rounded-xl transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <div className="relative aspect-video overflow-hidden rounded-xl" style={{ background: preset.background.gradient ?? preset.background.color ?? "#000" }}>
                          <div className="absolute inset-0 flex items-center justify-center px-1">
                            <span className="text-[7px] font-medium leading-tight text-center line-clamp-2 text-white/80" style={{ fontFamily: preset.text.fontFamily, textShadow: "0 1px 4px rgba(0,0,0,.6)" }}>
                              கர்த்தர் என் மேய்ப்பராயிருக்கிறார்
                            </span>
                          </div>
                        </div>
                        <div className="px-1.5 py-1 text-left bg-card/40 backdrop-blur-sm border-t border-border/10 rounded-b-xl">
                          <div className="truncate text-[8px] font-medium text-foreground/50">{preset.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="flex-1 min-h-0">
              <ThemeGrid
                items={bucketList}
                appliedId={appliedId}
                favorites={favorites}
                onApply={handleApply}
                onToggleFavorite={toggleFavorite}
                onReorderFavorites={bucket === "Favorites" ? reorderFavorites : undefined}
                renaming={renaming}
                onRename={(id, name) => { renameCustom(id, name); setRenaming(null); }}
                onStartRename={handleStartRename}
                dragEnabled={bucket === "Favorites" && bucketList.length > 1}
              />
            </div>
          </main>
        </div>

        {/* ═══ Save Dialog ═══ */}
        <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
          <DialogContent className="!max-w-md gap-4 p-6 rounded-2xl" hideCloseButton aria-describedby={undefined}>
            <div className="flex items-center gap-3 pb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Save className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Save Current as Template</h3>
                <p className="text-[11px] text-muted-foreground">Captures text styles, background, and logo.</p>
              </div>
            </div>
            <Input
              autoFocus
              placeholder="Theme name (e.g. Sunday Morning)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              className="h-10 rounded-xl border-border/60"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button size="sm" variant="ghost" onClick={() => setSaveOpen(false)} className="rounded-xl">Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={!newName.trim()} className="rounded-xl gap-1.5">
                <Check className="h-3.5 w-3.5" /> Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ═══ Rename Dialog ═══ */}
        <Dialog open={!!renaming} onOpenChange={(v) => { if (!v) { setRenaming(null); setRenameValue(""); } }}>
          <DialogContent className="!max-w-sm gap-4 p-6 rounded-2xl" hideCloseButton aria-describedby={undefined}>
            <div className="flex items-center gap-3 pb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Pencil className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Rename Theme</h3>
              </div>
            </div>
            <Input
              autoFocus
              placeholder="Theme name"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleFinishRename(); }}
              className="h-10 rounded-xl border-border/60"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button size="sm" variant="ghost" onClick={() => { setRenaming(null); setRenameValue(""); }} className="rounded-xl">Cancel</Button>
              <Button size="sm" onClick={handleFinishRename} disabled={!renameValue.trim()} className="rounded-xl gap-1.5">
                <Check className="h-3.5 w-3.5" /> Rename
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
