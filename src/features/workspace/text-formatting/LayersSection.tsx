import { Layers, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useBackground } from "@/stores/background.store";
import { cn } from "@/lib/utils";
import { SwitchRow } from "./shared";

export function LayersSection() {
  const bg = useBackground();
  return (
    <div className="space-y-2.5">
      <div className="rounded-md border border-border bg-background/40 p-2.5">
        <div className="mb-2.5 flex items-center gap-2 border-b border-border/60 pb-2">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wide">Projection Layers</span>
          <span className="ml-auto text-[10px] text-muted-foreground">Drag to reorder</span>
        </div>

        <div className="space-y-1">
          <LayerRow
            label="Theme Background"
            enabled={bg.themeBackgroundEnabled}
            onChange={(v) => bg.set("themeBackgroundEnabled", v)}
            disabled={bg.customBackgroundEnabled}
            subtitle="Auto-applied by themes"
          />
          <LayerRow
            label="Custom Background"
            enabled={bg.customBackgroundEnabled}
            onChange={(v) => bg.set("customBackgroundEnabled", v)}
            subtitle="Overrides theme bg"
          />
          <LayerRow
            label="Projection Background"
            enabled={bg.backgroundEnabled}
            onChange={(v) => bg.set("backgroundEnabled", v)}
            subtitle="Color / Media / Video"
          />
          <LayerRow
            label="Logo Overlay"
            enabled={bg.logoEnabled}
            onChange={(v) => bg.set("logoEnabled", v)}
            subtitle="Image watermark"
          />
          <LayerRow
            label="Motion Effects"
            enabled={bg.motionEnabled}
            onChange={(v) => bg.set("motionEnabled", v)}
            subtitle="Animations"
          />
          <LayerRow
            label="Particles"
            enabled={bg.particlesEnabled}
            onChange={(v) => bg.set("particlesEnabled", v)}
            disabled={!bg.motionEnabled}
            subtitle="Sparkles, fog, etc."
          />
          <LayerRow
            label="Text Shadow"
            enabled={bg.textShadowEnabled}
            onChange={(v) => bg.set("textShadowEnabled", v)}
            subtitle="Drop shadow on text"
          />
          <LayerRow
            label="Text Stroke"
            enabled={bg.textStrokeEnabled}
            onChange={(v) => bg.set("textStrokeEnabled", v)}
            subtitle="Outline on text"
          />
        </div>
      </div>

      {bg.customBackgroundEnabled && (
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[10px] text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>Custom Background is ON — applying a theme will NOT change your background image.</span>
        </div>
      )}
    </div>
  );
}

function LayerRow({
  label, enabled, onChange, disabled, subtitle,
}: {
  label: string; enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean; subtitle: string;
}) {
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-accent/30",
      disabled && "opacity-50",
    )}>
      {enabled ? (
        <Eye className="h-3 w-3 shrink-0 text-muted-foreground" />
      ) : (
        <EyeOff className="h-3 w-3 shrink-0 text-muted-foreground" />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium">{label}</div>
        <div className="truncate text-[9px] text-muted-foreground">{subtitle}</div>
      </div>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 cursor-pointer accent-primary"
      />
    </div>
  );
}
