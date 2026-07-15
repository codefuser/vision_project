import { useState } from "react";
import { Sparkles, Save, Copy, RotateCcw, Search, Star, Download, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextFormat } from "@/lib/text-format/store";
import { useThemeFavorites } from "@/stores/theme-favorites.store";
import { useCustomTemplates } from "@/stores/custom-templates.store";
import { TEMPLATE_PRESETS } from "@/lib/templates/presets";
import { applyTemplate, activeTemplateId } from "@/lib/templates/apply";
import { ThemeGalleryDialog } from "../ThemeGalleryDialog";
import { TemplatesStrip } from "../TemplatesStrip";
import { Toggle } from "./shared";

export function ThemeSection() {
  const groups = useTextFormat((s) => s.groups);
  const reset = useTextFormat((s) => s.reset);
  const saveCurrent = useCustomTemplates((s) => s.saveCurrent);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(activeTemplateId());
  const activePreset = activeId
    ? TEMPLATE_PRESETS.find((t) => t.id === activeId) ?? null
    : null;

  const handleApply = (id: string) => {
    applyTemplate(id);
    setActiveId(id);
  };

  const handleSaveAsTemplate = () => {
    const name = prompt("Name this theme:");
    if (name?.trim()) {
      saveCurrent(name.trim());
    }
  };

  const handleDuplicate = () => {
    saveCurrent(`${activePreset?.name ?? "Untitled"} (Copy)`);
  };

  return (
    <div>
      <TemplatesStrip />

      {/* Theme quick actions */}
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => handleSaveAsTemplate()}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-[10px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <Save className="h-3 w-3" /> Save
        </button>
        <button
          onClick={handleDuplicate}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-[10px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <Copy className="h-3 w-3" /> Duplicate
        </button>
        <button
          onClick={() => setGalleryOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-[10px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <FolderOpen className="h-3 w-3" /> Browse
        </button>
        <button
          onClick={reset}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-[10px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {activePreset && (
        <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="flex-1 truncate text-[11px] font-medium">{activePreset.name}</span>
            <button
              onClick={() => handleApply(activePreset.id)}
              className="cursor-pointer rounded bg-primary px-2 py-0.5 text-[9px] font-medium text-primary-foreground transition hover:opacity-90"
            >
              Re-apply
            </button>
          </div>
          <div className="mt-0.5 text-[10px] text-muted-foreground">{activePreset.description}</div>
        </div>
      )}

      <ThemeGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
      />
    </div>
  );
}
