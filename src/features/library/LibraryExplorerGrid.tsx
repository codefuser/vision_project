import React, { useRef, useState, useMemo } from "react";
import {
  Music,
  BookOpen,
  Image as ImageIcon,
  Video as VideoIcon,
  Megaphone,
  Folder,
  Star,
  Layers,
} from "lucide-react";
import type { LibraryItem, ViewMode } from "./types";
import type { FolderRecord } from "@/db/schema";
import { formatBytes, formatDuration } from "@/lib/files";
import { Thumb } from "@/components/Thumb";
import { cn } from "@/lib/utils";

interface LibraryExplorerGridProps {
  items: LibraryItem[];
  subfolders: FolderRecord[];
  selection: Set<string>;
  viewMode: ViewMode;
  zoomLevel: number;
  onItemClick: (e: React.MouseEvent, item: LibraryItem, index: number) => void;
  onItemDoubleClick: (e: React.MouseEvent, item: LibraryItem) => void;
  onFolderDoubleClick: (folderId: string) => void;
  onContextMenu: (e: React.MouseEvent, item: LibraryItem) => void;
  onToggleFavorite: (item: LibraryItem) => void;
}

export function LibraryExplorerGrid({
  items,
  subfolders,
  selection,
  viewMode,
  zoomLevel,
  onItemClick,
  onItemDoubleClick,
  onFolderDoubleClick,
  onContextMenu,
  onToggleFavorite,
}: LibraryExplorerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rubberband drag selection state
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

  const gridStyle = useMemo(() => {
    let baseWidth = 200;
    if (viewMode === "large-icons") baseWidth = 260;
    if (viewMode === "small-icons") baseWidth = 140;
    const itemWidth = Math.max(120, Math.floor(baseWidth * zoomLevel));
    return {
      gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
    };
  }, [viewMode, zoomLevel]);

  const hasContent = items.length > 0 || subfolders.length > 0;

  if (!hasContent) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground select-none">
        <Folder className="mb-2 h-12 w-12 text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground">This folder is empty</p>
        <p className="mt-1 text-xs opacity-70">
          Upload media or import songs and Bible verses to add content.
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
            {/* Render Subfolders */}
            {subfolders.map((folder) => (
              <tr
                key={folder.id}
                onDoubleClick={() => onFolderDoubleClick(folder.id)}
                className="cursor-pointer border-b border-border/30 transition hover:bg-accent/60 text-foreground font-medium"
              >
                <td className="py-2 px-3 text-center">
                  <Folder className="h-4 w-4 text-amber-400" />
                </td>
                <td className="py-2 px-3">{folder.name}</td>
                <td className="py-2 px-3 text-muted-foreground">Folder</td>
                <td className="py-2 px-3 text-muted-foreground">—</td>
                <td className="py-2 px-3 tabular-nums text-muted-foreground">
                  {new Date(folder.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}

            {/* Render Items */}
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

  // Render Grid Cards View
  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative flex-1 overflow-y-auto p-4 select-none"
    >
      {dragBox && (
        <div
          className="pointer-events-none absolute z-30 border border-primary bg-primary/20 rounded"
          style={{
            left: `${Math.min(dragBox.startX, dragBox.currentX)}px`,
            top: `${Math.min(dragBox.startY, dragBox.currentY)}px`,
            width: `${Math.abs(dragBox.currentX - dragBox.startX)}px`,
            height: `${Math.abs(dragBox.currentY - dragBox.startX)}px`,
          }}
        />
      )}

      <div className="grid gap-4" style={gridStyle}>
        {/* Render Subfolder Cards */}
        {subfolders.map((folder) => (
          <div
            key={folder.id}
            onDoubleClick={() => onFolderDoubleClick(folder.id)}
            className="group relative flex items-center gap-3 cursor-pointer overflow-hidden rounded-xl border border-border bg-card/80 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400/60 hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
              <Folder className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{folder.name}</p>
              <span className="text-[10px] text-muted-foreground">Folder</span>
            </div>
          </div>
        ))}

        {/* Render Item File Cards */}
        {items.map((item, index) => {
          const selected = selection.has(item.id);

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
              onClick={(e) => onItemClick(e, item, index)}
              onDoubleClick={(e) => onItemDoubleClick(e, item)}
              onContextMenu={(e) => onContextMenu(e, item)}
              className={cn(
                "group relative flex flex-col cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                selected ? "border-primary ring-2 ring-primary bg-primary/5" : "border-border hover:border-primary/50",
              )}
            >
              {/* Thumbnail / Document Preview Card Area */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40 border-b border-border/40">
                {item.mediaRecord ? (
                  <Thumb media={item.mediaRecord} className="h-full w-full object-cover" />
                ) : item.type === "song" && item.songData ? (
                  /* Miniature Document Preview for Songs */
                  <div className="flex h-full w-full flex-col justify-between p-2.5 bg-gradient-to-br from-purple-950/40 via-card to-background">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        <Music className="h-3 w-3" /> Song Document
                      </span>
                      <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-purple-300">
                        {item.songData.slides.length} slides
                      </span>
                    </div>

                    <div className="my-1 space-y-1 text-[10.5px] leading-tight text-foreground/80 line-clamp-3">
                      {item.songData.slides[0]?.split("\n").slice(0, 3).map((line, i) => (
                        <p key={i} className="truncate italic">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : item.type === "bible" && item.bibleData ? (
                  <div className="flex h-full w-full flex-col justify-between p-2.5 bg-gradient-to-br from-blue-950/40 via-card to-background">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      <BookOpen className="h-3 w-3" /> Bible Verse
                    </span>
                    <p className="text-[11px] font-semibold text-primary line-clamp-2">
                      {item.bibleData.bookName} {item.bibleData.chapter}:{item.bibleData.verse}
                    </p>
                  </div>
                ) : item.type === "text" ? (
                  <div className="flex h-full w-full flex-col justify-between p-2.5 bg-gradient-to-br from-amber-950/40 via-card to-background">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      <Megaphone className="h-3 w-3" /> Text / Announcement
                    </span>
                    <p className="text-[11px] text-foreground/80 line-clamp-2">
                      {item.textData?.content}
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Folder className="h-10 w-10 text-amber-400" />
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
              <div className="px-3 py-2">
                <p className="truncate text-xs font-semibold text-foreground" title={item.name}>
                  {item.name}
                </p>
                <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
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
