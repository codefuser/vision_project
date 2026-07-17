import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TemplatePreset } from "@/lib/templates/presets";
import { ThemeCard } from "./ThemeCard";
import { useCustomTemplates } from "@/stores/custom-templates.store";

const GAP = 24;
const INFO_HEIGHT = 72;

interface ThemeGridProps {
  items: TemplatePreset[];
  appliedId: string | null;
  favorites: string[];
  onApply: (preset: TemplatePreset) => void;
  onToggleFavorite: (id: string) => void;
  onReorderFavorites?: (ids: string[]) => void;
  renaming: string | null;
  onRename: (id: string, name: string) => void;
  onStartRename: (id: string) => void;
  dragEnabled?: boolean;
}

export function ThemeGrid({
  items,
  appliedId,
  favorites,
  onApply,
  onToggleFavorite,
  onReorderFavorites,
  renaming,
  onRename,
  onStartRename,
  dragEnabled,
}: ThemeGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [dims, setDims] = useState({ w: 900, h: 600 });
  const duplicateCustom = useCustomTemplates((s) => s.duplicate);
  const removeCustom = useCustomTemplates((s) => s.remove);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const cols = useMemo(() => {
    if (dims.w >= 1100) return 4;
    if (dims.w >= 820) return 3;
    if (dims.w >= 540) return 2;
    return 1;
  }, [dims.w]);

  const cardWidth = useMemo(() => {
    return (dims.w - (cols - 1) * GAP) / cols;
  }, [dims.w, cols]);

  const cardHeight = useMemo(() => cardWidth * (9 / 16) + INFO_HEIGHT, [cardWidth]);
  const rowHeight = cardHeight + GAP;
  const totalRows = Math.ceil(items.length / cols);
  const totalHeight = totalRows * rowHeight - GAP;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
  const endRow = Math.min(totalRows, Math.ceil((scrollTop + dims.h) / rowHeight) + 1);

  const visibleItems = useMemo(() => {
    const start = startRow * cols;
    const end = Math.min(items.length, endRow * cols);
    return items.slice(start, end).map((item, i) => ({
      item,
      absIndex: start + i,
      row: startRow + Math.floor(i / cols),
      col: i % cols,
    }));
  }, [items, startRow, endRow, cols]);

  const scrollRaf = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      if (scrollRaf.current !== null) return;
      scrollRaf.current = requestAnimationFrame(() => {
        setScrollTop(el.scrollTop);
        setDims((d) => ({ ...d, h: el.clientHeight }));
        scrollRaf.current = null;
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (scrollRaf.current !== null) {
        cancelAnimationFrame(scrollRaf.current);
      }
    };
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, idx: number) => {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIdx: number) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === dropIdx || !onReorderFavorites) return;
      const reordered = [...items];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dropIdx, 0, moved);
      onReorderFavorites(reordered.map((t) => t.id));
      setDragIndex(null);
    },
    [dragIndex, items, onReorderFavorites],
  );

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/30">
            <span className="text-lg text-muted-foreground/40">∅</span>
          </div>
          <p className="text-sm text-muted-foreground/60">{bucketEmptyMessage(favorites.length)}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto overflow-x-hidden px-6 pt-6"
    >
      <div className="relative will-change-transform" style={{ height: totalHeight }}>
        {visibleItems.map(({ item, absIndex, row, col }) => (
          <div
            key={item.id}
            className="absolute"
            style={{
              top: row * rowHeight,
              left: col * (cardWidth + GAP),
              width: cardWidth,
              contain: "layout paint",
            } as React.CSSProperties}
            draggable={dragEnabled}
            onDragStart={dragEnabled ? (e) => handleDragStart(e, absIndex) : undefined}
            onDragOver={
              dragEnabled
                ? (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }
                : undefined
            }
            onDrop={dragEnabled ? (e) => handleDrop(e, absIndex) : undefined}
          >
            <ThemeCard
              preset={item}
              isSelected={appliedId === item.id}
              isFavorite={favorites.includes(item.id)}
              isCustom={item.id.startsWith("custom-")}
              onClick={() => onApply(item)}
              onFavorite={() => onToggleFavorite(item.id)}
              onDuplicate={() => duplicateCustom(item)}
              onRename={item.id.startsWith("custom-") ? () => onStartRename(item.id) : undefined}
              onDelete={() => removeCustom(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function bucketEmptyMessage(favCount: number) {
  if (favCount === 0) return "Tap the star on any theme to add it to your favourites.";
  return "No themes match this filter.";
}
