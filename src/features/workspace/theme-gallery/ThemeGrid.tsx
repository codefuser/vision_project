import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TemplatePreset } from "@/lib/templates/presets";
import { ThemeCard } from "./ThemeCard";
import { useCustomTemplates } from "@/stores/custom-templates.store";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 264;
const GAP = 16;
const ROW_HEIGHT = 240 + GAP;

interface ThemeGridProps {
  items: TemplatePreset[];
  appliedId: string | null;
  favorites: string[];
  onApply: (preset: TemplatePreset) => void;
  onToggleFavorite: (id: string) => void;
  renaming: string | null;
  onRename: (id: string, name: string) => void;
  onStartRename: (id: string) => void;
}

export function ThemeGrid({
  items, appliedId, favorites, onApply, onToggleFavorite,
  renaming, onRename, onStartRename,
}: ThemeGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(800);
  const [containerHeight, setContainerHeight] = useState(600);
  const duplicateCustom = useCustomTemplates((s) => s.duplicate);
  const removeCustom = useCustomTemplates((s) => s.remove);

  const cols = useMemo(() => {
    if (containerWidth <= 0) return 3;
    return Math.max(2, Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP)));
  }, [containerWidth]);

  const totalRows = useMemo(() => Math.ceil(items.length / cols), [items.length, cols]);

  const visibleStartRow = useMemo(() => {
    return Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 1);
  }, [scrollTop]);

  const visibleEndRow = useMemo(() => {
    return Math.min(totalRows, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + 1);
  }, [scrollTop, containerHeight, totalRows]);

  const visibleItems = useMemo(() => {
    const start = visibleStartRow * cols;
    const end = Math.min(items.length, visibleEndRow * cols);
    return items.slice(start, end).map((item, i) => ({
      item,
      index: start + i,
      row: visibleStartRow + Math.floor(i / cols),
    }));
  }, [items, visibleStartRow, visibleEndRow, cols]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      setScrollTop(el.scrollTop);
      setContainerHeight(el.clientHeight);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
        setContainerHeight(entry.contentRect.height);
      }
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    setContainerHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        <p className="text-center">
          <span className="block text-lg">∅</span>
          No themes match this filter.
        </p>
      </div>
    );
  }

  const totalHeight = totalRows * ROW_HEIGHT - GAP;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto overflow-x-hidden"
    >
      <div
        className="relative w-full will-change-transform"
        style={{ height: totalHeight }}
      >
        {visibleItems.map(({ item, index, row }) => {
          const col = index % cols;
          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                top: row * ROW_HEIGHT,
                left: col * (CARD_WIDTH + GAP),
                width: CARD_WIDTH,
              }}
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
          );
        })}
      </div>
    </div>
  );
}
