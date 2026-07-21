import React, { useRef, useState, useMemo } from "react";
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
import type { FolderRecord } from "@/db/schema";
import { formatBytes, formatDuration } from "@/lib/files";
import { Thumb } from "@/components/Thumb";
import { getVerse, type BibleLang } from "@/lib/bible/loader";
import { cn } from "@/lib/utils";

interface LibraryExplorerGridProps {
  items: LibraryItem[];
  subfolders: FolderRecord[];
  selection: Set<string>;
  viewMode: ViewMode;
  zoomLevel: number;
  bibleLang: BibleLang;
  inlineEditingId: string | null;
  inlineCreatingFolder: boolean;
  onInlineRenameSubmit: (id: string, newName: string) => void;
  onInlineCreateSubmit: (name: string) => void;
  onInlineCancel: () => void;
  onItemClick: (e: React.MouseEvent, item: LibraryItem, index: number) => void;
  onItemDoubleClick: (e: React.MouseEvent, item: LibraryItem) => void;
  onFolderDoubleClick: (folderId: string) => void;
  onContextMenu: (e: React.MouseEvent, item: LibraryItem | null) => void;
  onToggleFavorite: (item: LibraryItem) => void;
}

export function LibraryExplorerGrid({
  items,
  subfolders,
  selection,
  viewMode,
  zoomLevel,
  bibleLang,
  inlineEditingId,
  inlineCreatingFolder,
  onInlineRenameSubmit,
  onInlineCreateSubmit,
  onInlineCancel,
  onItemClick,
  onItemDoubleClick,
  onFolderDoubleClick,
  onContextMenu,
  onToggleFavorite,
}: LibraryExplorerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Inline editing state for textbox
  const [editingText, setEditingText] = useState("");
  const [creatingFolderName, setCreatingFolderName] = useState("New Folder");

  // Rubberband selection state
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
    let baseWidth = 220;
    if (viewMode === "large-icons") baseWidth = 280;
    if (viewMode === "small-icons") baseWidth = 150;
    const itemWidth = Math.max(130, Math.floor(baseWidth * zoomLevel));
    return {
      gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
    };
  }, [viewMode, zoomLevel]);

  const hasContent = items.length > 0 || subfolders.length > 0 || inlineCreatingFolder;

  if (!hasContent) {
    return (
      <div
        onContextMenu={(e) => onContextMenu(e, null)}
        className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground select-none"
      >
        <Folder className="mb-2 h-12 w-12 text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground">This folder is empty</p>
        <p className="mt-1 text-xs opacity-70">
          Upload media or import songs and Bible verses to add content.
        </p>
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
      onContextMenu={(e) => {
        if (e.target === containerRef.current) onContextMenu(e, null);
      }}
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
        {/* Render Inline Folder Creation Card */}
        {inlineCreatingFolder && (
          <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-primary bg-primary/10 p-3 shadow-md">
            <Folder className="h-6 w-6 text-amber-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={creatingFolderName}
              onChange={(e) => setCreatingFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onInlineCreateSubmit(creatingFolderName);
                if (e.key === "Escape") onInlineCancel();
              }}
              onBlur={() => onInlineCreateSubmit(creatingFolderName)}
              className="w-full rounded border border-primary bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none"
            />
          </div>
        )}

        {/* Render Subfolder Cards */}
        {subfolders.map((folder) => {
          const isRenaming = inlineEditingId === folder.id;
          return (
            <div
              key={folder.id}
              onDoubleClick={() => onFolderDoubleClick(folder.id)}
              className="group relative flex items-center gap-3 cursor-pointer overflow-hidden rounded-xl border border-border bg-card/80 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400/60 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                <Folder className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                {isRenaming ? (
                  <input
                    type="text"
                    autoFocus
                    defaultValue={folder.name}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onInlineRenameSubmit(folder.id, (e.target as HTMLInputElement).value);
                      if (e.key === "Escape") onInlineCancel();
                    }}
                    onBlur={(e) => onInlineRenameSubmit(folder.id, e.target.value)}
                    className="w-full rounded border border-primary bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none"
                  />
                ) : (
                  <>
                    <p className="truncate text-xs font-semibold text-foreground">{folder.name}</p>
                    <span className="text-[10px] text-muted-foreground">Folder</span>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Render File Cards */}
        {items.map((item, index) => {
          const selected = selection.has(item.id);
          const isRenaming = inlineEditingId === item.id;

          // Fetch Bible verse text dynamically for active language
          const verseText =
            item.type === "bible" && item.bibleData
              ? getVerse(bibleLang, item.bibleData.book, item.bibleData.chapter, item.bibleData.verse) ||
                item.bibleData.text ||
                "Verse text not found."
              : "";

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
                      {item.songData.slides[0]?.split("\n").slice(0, 4).map((line, i) => (
                        <p key={i} className="truncate italic">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : item.type === "bible" && item.bibleData ? (
                  /* Dynamic Verse Preview Card for Bible Items */
                  <div className="flex h-full w-full flex-col justify-between p-2.5 bg-gradient-to-br from-blue-950/40 via-card to-background">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        <BookOpen className="h-3 w-3" /> Bible Verse
                      </span>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {bibleLang === "en" ? "English" : "Tamil"}
                      </span>
                    </div>

                    <div className="my-1 flex flex-col justify-center">
                      <p className="text-[11px] font-bold text-primary">
                        {item.bibleData.bookName} {item.bibleData.chapter}:{item.bibleData.verse}
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-foreground/85 line-clamp-3 italic leading-tight">
                        "{verseText}"
                      </p>
                    </div>
                  </div>
                ) : item.type === "text" ? (
                  <div className="flex h-full w-full flex-col justify-between p-2.5 bg-gradient-to-br from-amber-950/40 via-card to-background">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      <Megaphone className="h-3 w-3" /> Announcement
                    </span>
                    <p className="text-[11px] text-foreground/80 line-clamp-3 leading-tight">
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
                {isRenaming ? (
                  <input
                    type="text"
                    autoFocus
                    defaultValue={item.name}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onInlineRenameSubmit(item.id, (e.target as HTMLInputElement).value);
                      if (e.key === "Escape") onInlineCancel();
                    }}
                    onBlur={(e) => onInlineRenameSubmit(item.id, e.target.value)}
                    className="w-full rounded border border-primary bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none"
                  />
                ) : (
                  <>
                    <p className="truncate text-xs font-semibold text-foreground" title={item.name}>
                      {item.name}
                    </p>
                    <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="capitalize">{item.type}</span>
                      <span className="tabular-nums">
                        {item.size ? formatBytes(item.size) : item.durationMs ? formatDuration(item.durationMs) : ""}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
