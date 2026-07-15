import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Save, Sparkles, X, Check, Pencil } from "lucide-react";
import { TEMPLATE_PRESETS, TEMPLATE_CATEGORIES, type TemplatePreset } from "@/lib/templates/presets";
import { useCustomTemplates } from "@/stores/custom-templates.store";
import { useThemeFavorites } from "@/stores/theme-favorites.store";
import { applyTemplate, activeTemplateId } from "@/lib/templates/apply";
import { cn } from "@/lib/utils";
import { ThemeGrid } from "./theme-gallery/ThemeGrid";
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

export function ThemeGalleryDialog({ open, onOpenChange }: Props) {
  const custom = useCustomTemplates((s) => s.templates);
  const saveCurrent = useCustomTemplates((s) => s.saveCurrent);
  const renameCustom = useCustomTemplates((s) => s.rename);

  const favorites = useThemeFavorites((s) => s.favorites);
  const recents = useThemeFavorites((s) => s.recents);
  const toggleFavorite = useThemeFavorites((s) => s.toggleFavorite);
  const reorderFavorites = useThemeFavorites((s) => s.reorderFavorites);

  const [bucket, setBucket] = useState<Bucket>("All");
  const [query, setQuery] = useState("");
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setAppliedId(activeTemplateId());
      themeCache.prewarm(TEMPLATE_PRESETS);
      themeCache.prewarm(custom);
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open, custom]);

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
      <DialogContent className="!max-w-[1360px] h-[92vh] flex flex-col gap-0 p-0 overflow-hidden" aria-describedby={undefined}>
        {/* ═══ Header ═══ */}
        <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5">
          <div className="flex items-center gap-4">
            {/* Left: Title */}
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

            {/* Center: Search */}
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

            {/* Right: Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <Button size="sm" variant="outline" onClick={() => setSaveOpen(true)} className="h-9 gap-2 rounded-xl border-border/60 px-4 text-xs font-medium">
                <Save className="h-3.5 w-3.5" /> Save Current
              </Button>
              <button
                onClick={() => onOpenChange(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border/30 text-muted-foreground/60 transition-all duration-200 hover:border-foreground/20 hover:bg-accent hover:text-foreground hover:shadow-lg active:scale-95"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* ═══ Body ═══ */}
        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <aside className="w-44 shrink-0 overflow-y-auto border-r border-border/60 bg-muted/[0.03] px-2.5 py-3">
            {BUCKETS.map((btn) => (
              <button
                key={btn.key}
                onClick={() => { setBucket(btn.key); searchRef.current?.focus(); }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-all duration-150 mb-0.5",
                  bucket === btn.key
                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                    : "text-muted-foreground/70 hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <span className={cn(
                  "flex-1 truncate",
                  bucket === btn.key && "text-primary",
                )}>{btn.label}</span>
                <span className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none",
                  bucket === btn.key ? "bg-primary/15 text-primary" : "bg-muted/60 text-muted-foreground/60",
                )}>
                  {bucketCounts[btn.key] ?? 0}
                </span>
              </button>
            ))}
          </aside>

          {/* Grid */}
          <main className="flex-1 min-w-0">
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
          </main>
        </div>

        {/* ═══ Save Dialog ═══ */}
        <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
          <DialogContent className="!max-w-md gap-4 p-6 rounded-2xl" aria-describedby={undefined}>
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
          <DialogContent className="!max-w-sm gap-4 p-6 rounded-2xl" aria-describedby={undefined}>
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
