import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

const BUCKET_ICONS: Record<Bucket, string> = {
  All: "⊞", Favorites: "★", Recent: "↻", Custom: "⚙",
  Modern: "✦", Classic: "🏛", Bible: "📖", Worship: "♫",
  Prayer: "✠", Animated: "▶", Seasonal: "◈",
};

const SEARCH_FIELDS = ["name", "category", "mood", "animation", "tags", "color"] as const;

export function ThemeGalleryDialog({ open, onOpenChange }: Props) {
  const custom = useCustomTemplates((s) => s.templates);
  const saveCurrent = useCustomTemplates((s) => s.saveCurrent);
  const renameCustom = useCustomTemplates((s) => s.rename);

  const favorites = useThemeFavorites((s) => s.favorites);
  const recents = useThemeFavorites((s) => s.recents);
  const toggleFavorite = useThemeFavorites((s) => s.toggleFavorite);

  const [bucket, setBucket] = useState<Bucket>("All");
  const [query, setQuery] = useState("");
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setAppliedId(activeTemplateId());
      themeCache.prewarm(TEMPLATE_PRESETS);
      themeCache.prewarm(custom);
    }
  }, [open, custom]);

  const allBuiltin = useMemo(() => TEMPLATE_PRESETS, []);
  const all = useMemo(() => [...custom, ...allBuiltin], [custom, allBuiltin]);
  const byId = useMemo(() => new Map(all.map((t) => [t.id, t])), [all]);

  const bucketList = useMemo(() => {
    let list: TemplatePreset[];
    switch (bucket) {
      case "All":
        list = all;
        break;
      case "Custom":
        list = custom;
        break;
      case "Favorites":
        list = favorites.map((id) => byId.get(id)).filter(Boolean) as TemplatePreset[];
        break;
      case "Recent":
        list = recents.map((id) => byId.get(id)).filter(Boolean) as TemplatePreset[];
        break;
      case "Classic":
        list = all.filter((t) => t.mood === "classic");
        break;
      default:
        list = all.filter((t) => t.category === bucket);
        break;
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
    c.All = all.length;
    c.Custom = custom.length;
    c.Favorites = favorites.length;
    c.Recent = recents.length;
    c.Classic = all.filter((t) => t.mood === "classic").length;
    for (const cat of TEMPLATE_CATEGORIES) {
      if (cat === "Modern" || cat === "Bible" || cat === "Worship" || cat === "Prayer" || cat === "Animated" || cat === "Seasonal") {
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
    setNewName("");
    setSaveOpen(false);
    setBucket("Custom");
  }, [newName, saveCurrent]);

  const handleStartRename = useCallback((id: string) => {
    const preset = byId.get(id);
    if (preset) {
      setRenaming(id);
      setRenameValue(preset.name);
    }
  }, [byId]);

  const handleFinishRename = useCallback(() => {
    if (renaming && renameValue.trim()) {
      renameCustom(renaming, renameValue.trim());
    }
    setRenaming(null);
    setRenameValue("");
  }, [renaming, renameValue, renameCustom]);

  interface SideBtn { key: Bucket | "divider"; label: string; }
  const sideButtons: SideBtn[] = useMemo(() => [
    { key: "Favorites", label: "Favorites" },
    { key: "Recent", label: "Recent" },
    { key: "Custom", label: "Custom" },
    { key: "All", label: "All Themes" },
    { key: "divider", label: "—" },
    { key: "Modern", label: "Modern" },
    { key: "Classic", label: "Classic" },
    { key: "Worship", label: "Worship" },
    { key: "Bible", label: "Bible" },
    { key: "Prayer", label: "Prayer" },
    { key: "Animated", label: "Animated" },
    { key: "Seasonal", label: "Seasonal" },
  ], []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1320px] h-[90vh] flex flex-col gap-0 p-0 overflow-hidden" aria-describedby={undefined}>
        {/* ── Header ── */}
        <DialogHeader className="shrink-0 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              Theme Browser
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {allBuiltin.length} built-in{custom.length > 0 && ` · ${custom.length} custom`}
              </span>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, color, mood, tag…"
                  className="h-8 w-60 pl-7 text-xs"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={() => setSaveOpen(true)} className="h-8 gap-1 text-xs">
                <Save className="h-3 w-3" /> Save Current
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body: Sidebar + Grid ── */}
        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <aside className="w-40 shrink-0 overflow-y-auto border-r border-border bg-muted/10 p-1.5">
            {sideButtons.map((btn) => {
              if (btn.key === "divider") {
                return <div key="div" className="my-1.5 border-t border-border/40" />;
              }
              const bkey = btn.key as Bucket;
              return (
                <button
                  key={bkey}
                  onClick={() => setBucket(bkey)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-all duration-150",
                    bucket === bkey
                      ? "bg-primary/10 text-primary font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  <span className="w-4 text-center text-sm leading-none">{BUCKET_ICONS[bkey]}</span>
                  <span className="flex-1 truncate">{btn.label}</span>
                  <span className={cn(
                    "rounded px-1 text-[9px] font-medium",
                    bucket === bkey ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
                  )}>
                    {bucketCounts[bkey] ?? 0}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Grid area */}
          <main className="flex-1 min-w-0">
            <ThemeGrid
              items={bucketList}
              appliedId={appliedId}
              favorites={favorites}
              onApply={handleApply}
              onToggleFavorite={toggleFavorite}
              renaming={renaming}
              onRename={(id, name) => { renameCustom(id, name); setRenaming(null); }}
              onStartRename={handleStartRename}
            />
          </main>
        </div>

        {/* ── Save Dialog ── */}
        <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
          <DialogContent className="!max-w-md gap-3" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <Save className="h-4 w-4 text-primary" />
                Save Current as Template
              </DialogTitle>
            </DialogHeader>
            <Input
              autoFocus
              placeholder="Theme name (e.g. Sunday Morning)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            />
            <p className="text-[11px] text-muted-foreground">
              Captures current text styles, background, and logo settings.
            </p>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setSaveOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={!newName.trim()}>
                <Check className="h-3.5 w-3.5" /> Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Rename Dialog ── */}
        <Dialog open={!!renaming} onOpenChange={(v) => { if (!v) { setRenaming(null); setRenameValue(""); } }}>
          <DialogContent className="!max-w-sm gap-3" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <Pencil className="h-4 w-4 text-primary" />
                Rename Theme
              </DialogTitle>
            </DialogHeader>
            <Input
              autoFocus
              placeholder="Theme name"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleFinishRename(); }}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => { setRenaming(null); setRenameValue(""); }}>Cancel</Button>
              <Button size="sm" onClick={handleFinishRename} disabled={!renameValue.trim()}>
                <Check className="h-3.5 w-3.5" /> Rename
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
