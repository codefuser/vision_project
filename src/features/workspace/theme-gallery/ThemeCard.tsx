import { memo, useMemo, useState, useCallback } from "react";
import type { TemplatePreset } from "@/lib/templates/presets";
import { cn } from "@/lib/utils";
import { Star, Copy, Trash2, Pencil, Check } from "lucide-react";

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
}

function ThemeCardInner({
  preset,
  isSelected,
  isFavorite,
  isCustom,
  onClick,
  onFavorite,
  onDuplicate,
  onRename,
  onDelete,
}: ThemeCardProps) {
  const [hovered, setHovered] = useState(false);

  const bgGradient = preset.background.gradient;
  const bgColor = preset.background.color ?? "#000000";
  const textColor = preset.text.color ?? "#ffffff";
  const fontFamily = preset.text.fontFamily ?? "Inter";
  const fontWeight = preset.text.fontWeight ?? 500;

  const sampleStyle: React.CSSProperties = useMemo(
    () => ({
      color: textColor,
      fontFamily,
      fontWeight,
      fontSize: "clamp(11px, 2.4vw, 20px)",
      lineHeight: 1.3,
      textShadow: preset.text.shadow
        ? `${preset.text.shadowColor ?? "#000"} 0 ${Math.min(preset.text.shadowBlur ?? 20, 30) * 0.15}px ${Math.min(preset.text.shadowBlur ?? 20, 30) * 0.3}px`
        : "none",
      textAlign: (preset.text.align ?? "center") as React.CSSProperties["textAlign"],
    }),
    [
      textColor,
      fontFamily,
      fontWeight,
      preset.text.shadow,
      preset.text.shadowColor,
      preset.text.shadowBlur,
      preset.text.align,
    ],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 select-none",
        "will-change-transform",
        isSelected
          ? "ring-2 ring-primary/40 shadow-xl shadow-primary/10 scale-[1.01]"
          : "shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.015]",
      )}
      style={{ contain: "layout style" } as React.CSSProperties}
    >
      {/* Animated border gradient — visible on hover/selected */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-[2px] rounded-[18px] opacity-0 transition-opacity duration-500",
          "bg-gradient-to-br from-primary/30 via-primary/10 to-primary/30 blur-sm",
          (hovered || isSelected) && "opacity-100",
        )}
      />

      {/* ── Preview ── */}
      <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
        <div className="absolute inset-0" style={{ background: bgGradient ?? bgColor }} />

        {/* Tamil preview */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4 py-3"
          style={sampleStyle}
        >
          <div className="line-clamp-3 text-balance leading-snug relative z-10">
            <span>கர்த்தர் என்</span>
            <br />
            <span className="opacity-80">மேய்ப்பராயிருக்கிறார்</span>
          </div>
        </div>

        {/* Darken overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300",
            hovered ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Active badge */}
        {isSelected && (
          <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground shadow-lg shadow-primary/20">
            <Check className="h-3 w-3" />
            Active
          </div>
        )}

        {/* Category badge */}
        {!isSelected && (
          <div className="absolute right-3 top-3 z-20">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider backdrop-blur-sm",
                isCustom ? "bg-purple-500/20 text-purple-200" : "bg-white/10 text-white/70",
              )}
            >
              {isCustom ? "Custom" : preset.category}
            </span>
          </div>
        )}

        {/* Hover actions */}
        <div
          className={cn(
            "absolute right-3 top-3 z-20 flex items-center gap-1 transition-all duration-200",
            hovered
              ? "translate-y-0 opacity-100"
              : "translate-y-[-6px] opacity-0 pointer-events-none",
          )}
        >
          <ActionBtn
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            title={isFavorite ? "Remove from favourites" : "Add to favourites"}
          >
            <Star className={cn("h-3.5 w-3.5", isFavorite && "fill-yellow-300 text-yellow-300")} />
          </ActionBtn>
          <ActionBtn
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
          </ActionBtn>
          {isCustom && onRename && (
            <ActionBtn
              onClick={(e) => {
                e.stopPropagation();
                onRename();
              }}
              title="Rename"
            >
              <Pencil className="h-3.5 w-3.5" />
            </ActionBtn>
          )}
          {isCustom && (
            <ActionBtn
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete"
              hoverBg="hover:bg-red-500/80"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </ActionBtn>
          )}
        </div>
      </div>

      {/* ── Info ── */}
      <div className="relative z-10 bg-card px-3.5 py-3 rounded-b-2xl">
        <div className="truncate text-[13px] font-semibold leading-snug text-foreground/90">
          {preset.name}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground/50 capitalize tracking-wide">
            {preset.category}
            {preset.mood ? ` · ${preset.mood}` : ""}
          </span>
          {isFavorite && <span className="text-[9px] text-yellow-500/70">★</span>}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  title,
  hoverBg,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  hoverBg?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/80 shadow-sm backdrop-blur-sm transition-all duration-150",
        "hover:bg-white/20 hover:text-white active:scale-90",
        hoverBg,
      )}
    >
      {children}
    </button>
  );
}

export const ThemeCard = memo(ThemeCardInner);
