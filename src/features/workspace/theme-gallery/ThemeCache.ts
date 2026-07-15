import type { TemplatePreset } from "@/lib/templates/presets";

interface PreviewMeta {
  bgColor: string;
  gradient: string | null;
  textColor: string;
  fontFamily: string;
}

class ThemeCacheManager {
  private presets = new Map<string, TemplatePreset>();
  private previews = new Map<string, PreviewMeta>();

  getPreset(id: string): TemplatePreset | undefined {
    return this.presets.get(id);
  }

  setPreset(preset: TemplatePreset): void {
    this.presets.set(preset.id, preset);
  }

  getPreview(id: string): PreviewMeta | undefined {
    return this.previews.get(id);
  }

  setPreview(id: string, meta: PreviewMeta): void {
    this.previews.set(id, meta);
  }

  invalidate(id: string): void {
    this.presets.delete(id);
    this.previews.delete(id);
  }

  clear(): void {
    this.presets.clear();
    this.previews.clear();
  }

  prewarm(presets: TemplatePreset[]): void {
    for (const p of presets) {
      if (!this.presets.has(p.id)) {
        this.presets.set(p.id, p);
        this.previews.set(p.id, {
          bgColor: p.background.gradient ?? p.background.color ?? "#000000",
          gradient: p.background.gradient ?? null,
          textColor: p.text.color ?? "#ffffff",
          fontFamily: p.text.fontFamily ?? "Inter",
        });
      }
    }
  }
}

export const themeCache = new ThemeCacheManager();
