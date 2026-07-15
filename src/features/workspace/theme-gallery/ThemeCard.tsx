import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { TemplatePreset } from "@/lib/templates/presets";
import { cn } from "@/lib/utils";
import { ThemeAnimation, getAnimationLabel } from "./ThemeAnimation";
import { Star, Copy, Trash2, Download, Info, Pencil } from "lucide-react";

interface ThemeCardProps {
  preset: TemplatePreset;
  isSelected: boolean;
  isFavorite: boolean;
  isCustom: boolean;
  onClick: () => void;
  onFavorite: () => void;
  onDuplicate: () => void;
  onRename?: () => void;
  onDelete: () => void;
  onExport?: () => void;
  onInfo?: () => void;
}

function ThemeCardInner({
  preset, isSelected, isFavorite, isCustom,
  onClick, onFavorite, onDuplicate, onRename, onDelete, onExport, onInfo,
}: ThemeCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible) return;
    ioRef.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            ioRef.current?.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px", threshold: 0 },
    );
    ioRef.current.observe(el);
    return () => ioRef.current?.disconnect();
  }, [visible]);

  const bgGradient = preset.background.gradient;
  const bgColor = preset.background.color ?? "#000000";
  const textColor = preset.text.color ?? "#ffffff";
  const fontFamily = preset.text.fontFamily ?? "Inter";
  const animation = preset.background.animation ?? "none";
  const isAnimated = animation !== "none";
  const fontWeight = preset.text.fontWeight ?? 500;

  const sampleStyle: React.CSSProperties = useMemo(() => ({
    color: textColor,
    fontFamily,
    fontWeight,
    fontSize: "clamp(10px, 2.2vw, 18px)",
    lineHeight: 1.3,
    textShadow: preset.text.shadow
      ? `${preset.text.shadowColor ?? "#000"} 0 ${Math.min(preset.text.shadowBlur ?? 20, 30) * 0.15}px ${Math.min(preset.text.shadowBlur ?? 20, 30) * 0.3}px`
      : "none",
    textAlign: preset.text.align ?? "center",
    letterSpacing: preset.text.letterSpacing ? `${preset.text.letterSpacing * 0.5}px` : "normal",
  }), [textColor, fontFamily, fontWeight, preset.text.shadow, preset.text.shadowColor, preset.text.shadowBlur, preset.text.align, preset.text.letterSpacing]);

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border bg-card transition-all duration-200 select-none",
        "will-change-transform",
        isSelected
          ? "border-primary ring-2 ring-primary/40 shadow-lg shadow-primary/20 scale-[1.02]"
          : "border-transparent hover:border-primary/40 hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02]",
      )}
      style={{ contain: "layout style", contentVisibility: "auto" } as React.CSSProperties}
    >
      {/* Preview area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
        {/* Base background */}
        <div
          className="absolute inset-0"
          style={{
            background: bgGradient ?? bgColor,
          }}
        />

        {/* Animated overlay */}
        {isAnimated && visible && (
          <ThemeAnimation animation={animation} paused={!hovered && !isSelected} />
        )}

        {/* Text sample overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-3" style={sampleStyle}>
          <div className="line-clamp-3">
            <span>For God so loved</span>
            <br />
            <span className="opacity-80">the world</span>
          </div>
        </div>

        {/* Hover gradient overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-200",
            hovered ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-primary-foreground shadow-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
            Active
          </div>
        )}

        {/* Animated badge */}
        {isAnimated && !isSelected && visible && (
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[8px] font-medium text-white/80 backdrop-blur-sm">
            <div className="h-1 w-1 animate-pulse rounded-full bg-green-400" />
            {getAnimationLabel(animation)}
          </div>
        )}

        {/* Quick actions — appear on hover */}
        <div
          className={cn(
            "absolute right-2 top-2 z-20 flex items-center gap-0.5 transition-all duration-150",
            hovered ? "translate-y-0 opacity-100" : "translate-y-[-4px] opacity-0 pointer-events-none",
          )}
        >
          <ActionBtn onClick={(e) => { e.stopPropagation(); onFavorite(); }} title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <Star className={cn("h-3 w-3", isFavorite && "fill-yellow-300 text-yellow-300")} />
          </ActionBtn>
          <ActionBtn onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Duplicate">
            <Copy className="h-3 w-3" />
          </ActionBtn>
          {isCustom && onRename && (
            <ActionBtn onClick={(e) => { e.stopPropagation(); onRename(); }} title="Rename">
              <Pencil className="h-3 w-3" />
            </ActionBtn>
          )}
          {isCustom && (
            <ActionBtn onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete" hoverBg="hover:bg-red-500">
              <Trash2 className="h-3 w-3" />
            </ActionBtn>
          )}
          {onExport && (
            <ActionBtn onClick={(e) => { e.stopPropagation(); onExport?.(); }} title="Export">
              <Download className="h-3 w-3" />
            </ActionBtn>
          )}
          {onInfo && (
            <ActionBtn onClick={(e) => { e.stopPropagation(); onInfo?.(); }} title="Details">
              <Info className="h-3 w-3" />
            </ActionBtn>
          )}
        </div>
      </div>

      {/* Info area */}
      <div className="border-t border-border/50 p-2.5">
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold leading-tight">{preset.name}</div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className={cn(
                "rounded px-1 py-[1px] text-[8px] font-medium leading-none",
                isCustom
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-muted/60 text-muted-foreground",
              )}>
                {isCustom ? "Custom" : preset.category}
              </span>
              {preset.mood && (
                <span className="text-[8px] text-muted-foreground/60 capitalize">{preset.mood}</span>
              )}
            </div>
          </div>
          <span className="shrink-0 text-[8px] text-muted-foreground/50">
            {isFavorite ? "★" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  children, onClick, title, hoverBg,
}: {
  children: React.ReactNode; onClick: (e: React.MouseEvent) => void; title: string; hoverBg?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/50 text-white/90 shadow-sm backdrop-blur-sm transition-all duration-150",
        "hover:bg-white/20 hover:text-white active:scale-90",
        hoverBg,
      )}
    >
      {children}
    </button>
  );
}

export const ThemeCard = memo(ThemeCardInner);
