import React, { useRef, useState, useMemo, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
import { useDragAutoScroll } from "./useDragAutoScroll";

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
  onDropItemsToFolder: (itemIds: string[], targetFolderId: string | null) => void;
  onSelectMultiple: (itemIds: string[], append: boolean) => void;
  onTriggerRename: (id: string) => void;
}

type UnifiedNode =
  | { type: "creating_folder"; id: "creating_folder" }
  | { type: "subfolder"; data: FolderRecord; id: string }
  | { type: "item"; data: LibraryItem; index: number; id: string };

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
  onDropItemsToFolder,
  onSelectMultiple,
  onTriggerRename,
}: LibraryExplorerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useDragAutoScroll(containerRef, 12, 50);

  const [creatingFolderName, setCreatingFolderName] = useState("New Folder");
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [dragBox, setDragBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const allNodes = useMemo<UnifiedNode[]>(() => {
    const nodes: UnifiedNode[] = [];
    if (inlineCreatingFolder) {
      nodes.push({ type: "creating_folder", id: "creating_folder" });
    }
    subfolders.forEach((folder) => {
      nodes.push({ type: "subfolder", data: folder, id: folder.id });
    });
    items.forEach((item, index) => {
      nodes.push({ type: "item", data: item, index, id: item.id });
    });
    return nodes;
  }, [subfolders, items, inlineCreatingFolder]);

  // Measure container width for responsive virtualization
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragBox({
      startX: e.clientX - rect.left + containerRef.current.scrollLeft,
      startY: e.clientY - rect.top + containerRef.current.scrollTop,
      currentX: e.clientX - rect.left + containerRef.current.scrollLeft,
      currentY: e.clientY - rect.top + containerRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragBox || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragBox((prev) =>
      prev
        ? {
            ...prev,
            currentX: e.clientX - rect.left + containerRef.current!.scrollLeft,
            currentY: e.clientY - rect.top + containerRef.current!.scrollTop,
          }
        : null,
    );
  };

  const gap = 16;
  let baseWidth = 220;
  if (viewMode === "large-icons") baseWidth = 280;
  if (viewMode === "small-icons") baseWidth = 150;
  if (viewMode === "list" || viewMode === "details") baseWidth = Math.max(300, containerWidth - gap * 2); // full width list mode

  const itemWidth = Math.max(130, Math.floor(baseWidth * zoomLevel));
  const itemsPerRow = Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
  const rowCount = Math.ceil(allNodes.length / itemsPerRow);

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragBox && containerRef.current) {
      const startX = Math.min(dragBox.startX, dragBox.currentX);
      const startY = Math.min(dragBox.startY, dragBox.currentY);
      const endX = Math.max(dragBox.startX, dragBox.currentX);
      const endY = Math.max(dragBox.startY, dragBox.currentY);
      
      const isDragSignificant = Math.abs(dragBox.currentX - dragBox.startX) > 5 || Math.abs(dragBox.currentY - dragBox.startY) > 5;
      
      if (isDragSignificant) {
        const idsToSelect: string[] = [];
        
        allNodes.forEach((node, idx) => {
          const rowIndex = Math.floor(idx / itemsPerRow);
          const colIndex = idx % itemsPerRow;
          
          let top = 0;
          if (viewMode === "list" || viewMode === "details") {
            top = rowIndex * (48 + gap);
          } else {
            top = rowIndex * (itemWidth * 0.625 + 64 + gap); // folder is different height but this is an approximation for grid
          }
          
          const left = colIndex * (itemWidth + gap) + 16;
          const bottom = top + (viewMode === "list" ? 48 : (itemWidth * 0.625 + 64));
          const right = left + itemWidth;
          
          if (left < endX && right > startX && top < endY && bottom > startY) {
            if (node.type === "item") idsToSelect.push(node.data.id);
            else if (node.type === "subfolder") idsToSelect.push(node.data.id);
          }
        });
        
        onSelectMultiple(idsToSelect, e.shiftKey || e.ctrlKey || e.metaKey);
      }
    }
    setDragBox(null);
  };

  const lastClickRef = useRef<{ id: string; time: number } | null>(null);

  const handleDragStart = (e: React.DragEvent, item: LibraryItem) => {
    const selectedIds = selection.has(item.id) ? Array.from(selection) : [item.id];
    e.dataTransfer.setData("application/json", JSON.stringify(selectedIds));
    e.dataTransfer.setData("text/plain", item.id);

    const ghost = document.createElement("div");
    ghost.className = "fixed pointer-events-none z-50 flex items-center gap-2 rounded-xl bg-purple-600 px-3 py-2 text-white shadow-2xl font-bold text-xs border border-purple-400/40 backdrop-blur";
    ghost.innerHTML = `<span>📁 Moving ${selectedIds.length} item(s)</span>`;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    setTimeout(() => { document.body.removeChild(ghost); }, 0);
  };

  const handleItemNodeClick = (e: React.MouseEvent, node: UnifiedNode, index: number) => {
    if (node.type === "subfolder") {
      // For subfolders, selection click logic could go here if implemented, but we just want to track slow double click
    } else if (node.type === "item") {
      onItemClick(e, node.data, index);
    }
    
    // Slow double click inline rename
    const now = Date.now();
    if (lastClickRef.current?.id === node.id) {
      const diff = now - lastClickRef.current.time;
      if (diff > 300 && diff < 1000 && selection.has(node.id)) {
        onTriggerRename(node.id);
      }
    }
    lastClickRef.current = { id: node.id, time: now };
  };

  // Setup virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => containerRef.current,
    estimateSize: (index) => {
      const firstNode = allNodes[index * itemsPerRow];
      if (firstNode?.type === "subfolder" || firstNode?.type === "creating_folder") {
        return 64 + gap; // folder height + gap
      }
      if (viewMode === "list" || viewMode === "details") {
        return 48 + gap; // List mode item height
      }
      return itemWidth * 0.625 + 64 + gap; // card thumbnail + footer + gap
    },
    overscan: 5,
  });

  useEffect(() => {
    const handleScrollTo = (e: Event) => {
      const id = (e as CustomEvent).detail.id;
      const idx = allNodes.findIndex((n) => 'id' in n && n.id === id);
      if (idx !== -1) {
        const rowIndex = Math.floor(idx / itemsPerRow);
        rowVirtualizer.scrollToIndex(rowIndex, { align: "auto" });
      }
    };
    window.addEventListener("library-scroll-to", handleScrollTo);
    return () => window.removeEventListener("library-scroll-to", handleScrollTo);
  }, [allNodes, itemsPerRow, rowVirtualizer]);

  const hasContent = allNodes.length > 0;

  if (!hasContent) {
    return (
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, null);
        }}
        className="flex h-full flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground select-none"
      >
        <Folder className="mb-2 h-12 w-12 text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground">This folder is empty</p>
        <p className="mt-1 text-xs opacity-70">Upload media or import songs and Bible verses to add content.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => {
        e.preventDefault();
        if (e.target === containerRef.current) onContextMenu(e, null);
      }}
      className="relative flex-1 min-w-0 overflow-y-auto p-4 select-none outline-none"
      tabIndex={0} // for keyboard nav
    >
      {/* Rubberband Selection Box */}
      {dragBox && (
        <div
          className="pointer-events-none absolute z-30 border border-primary bg-primary/20 rounded shadow-sm"
          style={{
            left: `${Math.min(dragBox.startX, dragBox.currentX)}px`,
            top: `${Math.min(dragBox.startY, dragBox.currentY)}px`,
            width: `${Math.abs(dragBox.currentX - dragBox.startX)}px`,
            height: `${Math.abs(dragBox.currentY - dragBox.startY)}px`,
          }}
        />
      )}

      {/* Virtualized Container */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowNodes = allNodes.slice(virtualRow.index * itemsPerRow, virtualRow.index * itemsPerRow + itemsPerRow);

          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size - gap}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: "grid",
                gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
                gap: `${gap}px`,
              }}
            >
              {rowNodes.map((node) => {
                if (node.type === "creating_folder") {
                  return (
                    <div
                      key="creating_folder"
                      className="flex h-16 items-center gap-3 overflow-hidden rounded-xl border border-primary bg-primary/10 p-3 shadow-md"
                    >
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
                  );
                }

                if (node.type === "subfolder") {
                  const folder = node.data;
                  const isRenaming = inlineEditingId === folder.id;
                  const isDragOver = dragOverFolderId === folder.id;

                  return (
                    <div
                      key={folder.id}
                      onClick={(e) => handleItemNodeClick(e, node, 0)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onFolderDoubleClick(folder.id);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onContextMenu(e, null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverFolderId(folder.id);
                      }}
                      onDragLeave={() => setDragOverFolderId(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverFolderId(null);
                        try {
                          const dataStr = e.dataTransfer.getData("application/json");
                          const itemIds: string[] = dataStr ? JSON.parse(dataStr) : [e.dataTransfer.getData("text/plain")];
                          if (itemIds.length) {
                            onDropItemsToFolder(itemIds, folder.id);
                          }
                        } catch {
                          const singleId = e.dataTransfer.getData("text/plain");
                          if (singleId) onDropItemsToFolder([singleId], folder.id);
                        }
                      }}
                      className={cn(
                        "group relative flex h-16 items-center gap-3 cursor-pointer overflow-hidden rounded-xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                        isDragOver
                          ? "border-amber-400 bg-amber-400/20 ring-2 ring-amber-400 scale-[1.02]"
                          : "border-border bg-card/80 hover:border-amber-400/60",
                      )}
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
                }

                // File Item
                const item = node.data;
                const index = node.index;
                const selected = selection.has(item.id);
                const isRenaming = inlineEditingId === item.id;

                const verseText =
                  item.type === "bible" && item.bibleData
                    ? getVerse(bibleLang, item.bibleData.book, item.bibleData.chapter, item.bibleData.verse) ||
                      item.bibleData.text ||
                      "Verse text not found."
                    : "";

                if (viewMode === "list" || viewMode === "details") {
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={(e) => handleItemNodeClick(e, node, index)}
                      onDoubleClick={(e) => onItemDoubleClick(e, item)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        onContextMenu(e, item);
                      }}
                      className={cn(
                        "group relative flex items-center h-12 cursor-pointer overflow-hidden rounded-lg border bg-card shadow-sm transition",
                        selected ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/50",
                      )}
                    >
                      <div className="flex items-center gap-3 px-3 min-w-0 flex-1">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-black/40 flex items-center justify-center">
                           {item.mediaRecord ? (
                             <Thumb media={item.mediaRecord} className="h-full w-full object-cover" />
                           ) : item.type === "song" ? <Music className="h-4 w-4 text-purple-400" /> :
                             item.type === "bible" ? <BookOpen className="h-4 w-4 text-blue-400" /> :
                             <Megaphone className="h-4 w-4 text-amber-400" />}
                        </div>
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
                            className="w-64 rounded border border-primary bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none"
                          />
                        ) : (
                          <p className="truncate text-xs font-semibold text-foreground flex-1">{item.name}</p>
                        )}
                        {viewMode === "details" && (
                          <>
                            <span className="w-24 shrink-0 text-[10px] text-muted-foreground capitalize">{item.type}</span>
                            <span className="w-24 shrink-0 text-[10px] text-muted-foreground text-right tabular-nums">
                               {item.size ? formatBytes(item.size) : item.durationMs ? formatDuration(item.durationMs) : ""}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={(e) => handleItemNodeClick(e, node, index)}
                    onDoubleClick={(e) => onItemDoubleClick(e, item)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onContextMenu(e, item);
                    }}
                    className={cn(
                      "group relative flex flex-col h-full cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                      selected ? "border-primary ring-2 ring-primary bg-primary/5" : "border-border hover:border-primary/50",
                    )}
                  >
                    {/* Thumbnail / Document Preview Card Area */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40 border-b border-border/40 shrink-0">
                      {item.mediaRecord ? (
                        <Thumb media={item.mediaRecord} className="h-full w-full object-cover" />
                      ) : item.type === "song" && item.songData ? (
                        <div className="flex h-full w-full flex-col justify-between p-2.5 bg-gradient-to-br from-purple-950/40 via-card to-background">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                              <Music className="h-3 w-3" /> Song
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
                        <div className="flex h-full w-full flex-col justify-between p-2.5 bg-gradient-to-br from-blue-950/40 via-card to-background">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                              <BookOpen className="h-3 w-3" /> Bible
                            </span>
                            <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                              {bibleLang === "en" ? "EN" : "TA"}
                            </span>
                          </div>

                          <div className="my-1 flex flex-col justify-center">
                            <p className="text-[11px] font-bold text-primary truncate">
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
                            <Megaphone className="h-3 w-3" /> Alert
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
                    <div className="px-3 py-2 flex flex-col justify-center flex-1">
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
          );
        })}
      </div>
    </div>
  );
}
