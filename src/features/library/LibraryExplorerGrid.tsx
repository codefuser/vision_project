import React, { useRef, useState, useCallback, useMemo } from "react";
import {
  Music,
  BookOpen,
  Image as ImageIcon,
  Video as VideoIcon,
  Megaphone,
  Folder,
  Star,
} from "lucide-react";
import type { LibraryItem, ViewMode } from "./types";
import { formatBytes, formatDuration } from "@/lib/files";
import { Thumb } from "@/components/Thumb";
import { cn } from "@/lib/utils";

interface LibraryExplorerGridProps {
  items: LibraryItem[];
  selection: Set<string>;
  viewMode: ViewMode;
  zoomLevel: number;
  onItemClick: (e: React.MouseEvent, item: LibraryItem, index: number) => void;
  onItemDoubleClick: (e: React.MouseEvent, item: LibraryItem) => void;
  onContextMenu: (e: React.MouseEvent, item: LibraryItem) => void;
  onToggleFavorite: (item: LibraryItem) => void;
  onDropItemToFolder?: (itemId: string, folderId: string) => void;
}

export function LibraryExplorerGrid({
  items,
  selection,
  viewMode,
  zoomLevel,
  onItemClick,
  onItemDoubleClick,
  onContextMenu,
  onToggleFavorite,
  onDropItemToFolder,
}: LibraryExplorerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rubberband rectangle selection box calculation state
  const [dragBox, setDragBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragBox({
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      currentX: e.clientX - rect.left,
      currentY: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragBox || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragBox((prev) =>
      prev
        ? {
            ...prev,
            currentX: e.clientX - rect.left,
            currentY: e.clientY - rect.top,
          }
        : null,
    );
  };

  const handleMouseUp = () => {
    setDragBox(null);
  };

  // Compute Grid Columns based on viewMode & zoomLevel
  const gridStyle = useMemo(() => {
    let baseWidth = 180;
    if (viewMode === "large-icons") baseWidth = 240;
    if (viewMode === "small-icons") baseWidth = 120;
    const itemWidth = Math.max(100, Math.floor(baseWidth * zoomLevel));
    return {
      gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
    };
  }, [viewMode, zoomLevel]);

  if (!items.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground select-none">
        <Folder className="mb-2 h-12 w-12 text-muted-foreground/30" />
        <p className="text-sm font-medium">Folder is empty</p>
        <p className="mt-1 text-xs opacity-70">
          Import songs, Bible verses, media, or text using the toolbar or bottom + button.
        </p>
      </div>
    );
  }

  // Render Details List View
  if (viewMode === "list" || viewMode === "details") {
    return (
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative flex-1 overflow-y-auto p-2 select-none"
      >
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 text-[11px] font-semibold text-muted-foreground">
              <th className="py-2 px-3 w-8"></th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Size / Length</th>
              <th className="py-2 px-3">Date Added</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const selected = selection.has(item.id);
              return (
                <tr
                  key={item.id}
                  onClick={(e) => onItemClick(e, item, index)}
                  onDoubleClick={(e) => onItemDoubleClick(e, item)}
                  onContextMenu={(e) => onContextMenu(e, item)}
                  className={cn(
                    "cursor-pointer border-b border-border/30 transition hover:bg-accent/60",
                    selected ? "bg-primary/15 font-medium text-primary" : "text-foreground",
                  )}
                >
                  <td className="py-2 px-3 text-center">
                    <TypeIcon type={item.type} />
                  </td>
                  <td className="py-2 px-3 font-medium">
                    <div className="flex items-center gap-2 truncate max-w-md">
                      <span>{item.name}</span>
                      {item.isFavorite && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                    </div>
                  </td>
                  <td className="py-2 px-3 capitalize text-muted-foreground">{item.type}</td>
                  <td className="py-2 px-3 tabular-nums text-muted-foreground">
                    {item.size ? formatBytes(item.size) : item.durationMs ? formatDuration(item.durationMs) : "—"}
                  </td>
                  <td className="py-2 px-3 tabular-nums text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Render Grid Card View
  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative flex-1 overflow-y-auto p-4 select-none"
    >
      {/* Rubberband Drag Selection Rectangle */}
      {dragBox && (
        <div
          className="pointer-events-none absolute z-30 border border-primary bg-primary/20 rounded"
          style={{
            left: `${Math.min(dragBox.startX, dragBox.currentX)}px`,
            top: `${Math.min(dragBox.startY, dragBox.currentY)}px`,
            width: `${Math.abs(dragBox.currentX - dragBox.startX)}px`,
            height: `${Math.abs(dragBox.currentY - dragBox.startY)}px`,
          }}
        />
      )}

      <div className="grid gap-3.5" style={gridStyle}>
        {items.map((item, index) => {
          const selected = selection.has(item.id);

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", item.id);
              }}
              onClick={(e) => onItemClick(e, item, index)}
              onDoubleClick={(e) => onItemDoubleClick(e, item)}
              onContextMenu={(e) => onContextMenu(e, item)}
              className={cn(
                "group relative flex flex-col cursor-pointer overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                selected ? "border-primary ring-2 ring-primary bg-primary/5" : "border-border hover:border-primary/50",
              )}
            >
              {/* Thumbnail / File Card Preview Area */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/30 flex items-center justify-center">
                {item.mediaRecord ? (
                  <Thumb media={item.mediaRecord} className="aspect-video w-full object-cover" />
                ) : item.type === "song" ? (
                  <div className="flex flex-col items-center gap-1.5 p-2 text-center text-purple-400">
                    <Music className="h-8 w-8" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Song</span>
                  </div>
                ) : item.type === "bible" ? (
                  <div className="flex flex-col items-center gap-1.5 p-2 text-center text-blue-400">
                    <BookOpen className="h-8 w-8" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Bible Verse</span>
                  </div>
                ) : item.type === "text" ? (
                  <div className="flex flex-col items-center gap-1.5 p-2 text-center text-amber-400">
                    <Megaphone className="h-8 w-8" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Text / Announcement</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 p-2 text-center text-amber-400">
                    <Folder className="h-10 w-10 text-amber-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Folder</span>
                  </div>
                )}

                {/* Favorite Star Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item);
                  }}
                  className={cn(
                    "absolute top-1.5 right-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-black/60 backdrop-blur text-amber-400 transition",
                    item.isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  )}
                  title="Favorite"
                >
                  <Star className={cn("h-3.5 w-3.5", item.isFavorite && "fill-current")} />
                </button>
              </div>

              {/* Card Label Footer */}
              <div className="px-2.5 py-2">
                <p className="truncate text-xs font-medium text-foreground" title={item.name}>
                  {item.name}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="capitalize">{item.type}</span>
                  <span className="tabular-nums">
                    {item.size ? formatBytes(item.size) : item.durationMs ? formatDuration(item.durationMs) : ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case "song":
      return <Music className="h-4 w-4 text-purple-400" />;
    case "bible":
      return <BookOpen className="h-4 w-4 text-blue-400" />;
    case "image":
      return <ImageIcon className="h-4 w-4 text-green-400" />;
    case "video":
      return <VideoIcon className="h-4 w-4 text-rose-400" />;
    case "text":
      return <Megaphone className="h-4 w-4 text-amber-400" />;
    default:
      return <Folder className="h-4 w-4 text-amber-400" />;
  }
}
