import { memo, useMemo, useState } from "react";
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
        ? `${preset.text.shadowColor ?? "#000"} 0 2px 4px`
        : "none",
      textAlign: (preset.text.align ?? "center") as React.CSSProperties["textAlign"],
    }),
    [
      textColor,
      fontFamily,
      fontWeight,
      preset.text.shadow,
      preset.text.shadowColor,
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
        "group relative cursor-pointer overflow-hidden rounded-xl transition-transform duration-200 select-none bg-card border border-border/50",
        "will-change-transform",
        isSelected
          ? "ring-2 ring-primary border-transparent scale-[1.01]"
          : "hover:border-primary/50 hover:scale-[1.01]",
      )}
      style={{ contentVisibility: "auto" } as React.CSSProperties}
    >
      <div className="relative overflow-hidden w-full h-full" style={{ aspectRatio: "16 / 9", background: bgGradient ?? bgColor }}>
        {/* Scripture sample preview */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
          style={sampleStyle}
        >
          <div className="relative z-10 text-balance leading-snug max-w-[95%] mx-auto flex flex-col items-center">
            <div className="text-[clamp(8px,1.6vw,14px)] font-semibold opacity-70 tracking-wider uppercase mb-0.5 text-center">
              Psalm 23:1
            </div>
            <div className="text-[clamp(10px,2.2vw,18px)] leading-tight text-center">
              கர்த்தர் என் மேய்ப்பராயிருக்கிறார்
            </div>
          </div>
        </div>

        {/* Hover actions overlay */}
        {hovered && (
          <div className="absolute inset-0 bg-black/40 flex items-start justify-end p-2 gap-1 z-20">
            <ActionBtn
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              title={isFavorite ? "Remove from favourites" : "Add to favourites"}
            >
              <Star className={cn("h-4 w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
            </ActionBtn>
            <ActionBtn
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </ActionBtn>
            {isCustom && onRename && (
              <ActionBtn
                onClick={(e) => {
                  e.stopPropagation();
                  onRename();
                }}
                title="Rename"
              >
                <Pencil className="h-4 w-4" />
              </ActionBtn>
            )}
            {isCustom && (
              <ActionBtn
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title="Delete"
                hoverBg="hover:bg-red-500 hover:text-white text-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </ActionBtn>
            )}
          </div>
        )}

        {/* Active badge */}
        {isSelected && (
          <div className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
            <Check className="h-3 w-3" />
            ACTIVE
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="relative z-10 px-3 py-2.5">
        <div className="truncate text-sm font-semibold text-foreground">
          {preset.name}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {isCustom ? "Custom" : preset.category}
          </span>
          {isFavorite && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
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
        "flex h-8 w-8 items-center justify-center rounded-md bg-black/60 text-white/90 transition-colors",
        "hover:bg-white/20 hover:text-white",
        hoverBg,
      )}
    >
      {children}
    </button>
  );
}

export const ThemeCard = memo(ThemeCardInner);
