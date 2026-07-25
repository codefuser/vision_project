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
  Upload,
  FolderPlus,
  ArrowUpDown,
  FileText,
  Plus,
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

  // Map items to folder for 2x2 folder quadrant preview
  const folderChildItemsMap = useMemo(() => {
    const map = new Map<string, LibraryItem[]>();
    for (const item of items) {
      if (item.folderId) {
        const list = map.get(item.folderId) || [];
        if (list.length < 4) list.push(item);
        map.set(item.folderId, list);
      }
    }
    return map;
  }, [items]);

  // Measure container width for responsive layout calculation
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
        : null
    );
  };

  const gap = 16;
  let baseWidth = 200;
  if (viewMode === "large-icons") baseWidth = 240;
  else if (viewMode === "medium-icons" || viewMode === "grid") baseWidth = 160;
  else if (viewMode === "small-icons") baseWidth = 110;
  else if (viewMode === "gallery") baseWidth = 220;
  else if (viewMode === "list" || viewMode === "details") baseWidth = Math.max(300, containerWidth - gap * 2);

  const itemWidth = Math.max(90, Math.floor(baseWidth * zoomLevel));
  const itemsPerRow = Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
  const rowCount = Math.ceil(allNodes.length / itemsPerRow);

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragBox && containerRef.current) {
      const startX = Math.min(dragBox.startX, dragBox.currentX);
      const startY = Math.min(dragBox.startY, dragBox.currentY);
      const endX = Math.max(dragBox.startX, dragBox.currentX);
      const endY = Math.max(dragBox.startY, dragBox.currentY);

      const isDragSignificant =
        Math.abs(dragBox.currentX - dragBox.startX) > 5 || Math.abs(dragBox.currentY - dragBox.startY) > 5;

      if (isDragSignificant) {
        const idsToSelect: string[] = [];
        allNodes.forEach((node, idx) => {
          const rowIndex = Math.floor(idx / itemsPerRow);
          const colIndex = idx % itemsPerRow;

          const top = rowIndex * (viewMode === "list" || viewMode === "details" ? 48 + gap : itemWidth * 0.75 + 64 + gap);
          const left = colIndex * (itemWidth + gap) + 16;
          const bottom = top + (viewMode === "list" ? 48 : itemWidth * 0.75 + 64);
          const right = left + itemWidth;

          if (left < endX && right > startX && top < endY && bottom > startY) {
            idsToSelect.push(node.id);
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
    ghost.className =
      "fixed pointer-events-none z-50 flex items-center gap-2 rounded-xl bg-purple-600 px-3 py-2 text-white shadow-2xl font-bold text-xs border border-purple-400/40 backdrop-blur";
    ghost.innerHTML = `<span>📁 Moving ${selectedIds.length} item(s)</span>`;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
  };

  const handleItemNodeClick = (e: React.MouseEvent, node: UnifiedNode, index: number) => {
    if (node.type === "item") {
      onItemClick(e, node.data, index);
    }

    const now = Date.now();
    if (lastClickRef.current?.id === node.id) {
      const diff = now - lastClickRef.current.time;
      if (diff > 300 && diff < 1000 && selection.has(node.id)) {
        onTriggerRename(node.id);
      }
    }
    lastClickRef.current = { id: node.id, time: now };
  };

  // Virtualizer setup
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => containerRef.current,
    estimateSize: (index) => {
      if (viewMode === "list" || viewMode === "details") return 44 + gap;
      return itemWidth * 0.75 + 64 + gap;
    },
    overscan: 5,
  });

  useEffect(() => {
    const handleScrollTo = (e: Event) => {
      const id = (e as CustomEvent).detail.id;
      const idx = allNodes.findIndex((n) => n.id === id);
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
        <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted/40 border border-border/80 shadow-inner">
          <Folder className="h-12 w-12 text-muted-foreground/40" />
        </div>
        <h3 className="text-base font-bold text-foreground">This Folder is Empty</h3>
        <p className="mt-1 text-xs max-w-sm text-muted-foreground opacity-80">
          Drag and drop media files directly into this area, or use the shortcuts below to add content.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              const el = document.createElement("input");
              el.type = "file";
              el.multiple = true;
              el.click();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 active:scale-95"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Files
          </button>
          <button
            onClick={() => onInlineCreateSubmit("New Folder")}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-accent active:scale-95"
          >
            <FolderPlus className="h-3.5 w-3.5 text-amber-400" />
            New Folder
          </button>
        </div>
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
      tabIndex={0}
    >
      {/* Selection Box */}
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

      {/* Details Table Header */}
      {viewMode === "details" && (
        <div className="sticky top-0 z-20 mb-2 flex h-8 items-center border-b border-border bg-card/90 px-3 text-[11px] font-bold text-muted-foreground backdrop-blur">
          <div className="w-10"></div>
          <div className="flex-1 font-bold">Name</div>
          <div className="w-24">Type</div>
          <div className="w-24">Size</div>
          <div className="w-32">Date Created</div>
        </div>
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
                display: viewMode === "details" || viewMode === "list" ? "flex" : "grid",
                flexDirection: viewMode === "details" || viewMode === "list" ? "column" : undefined,
                gridTemplateColumns:
                  viewMode !== "details" && viewMode !== "list"
                    ? `repeat(${itemsPerRow}, minmax(0, 1fr))`
                    : undefined,
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
                  const quadItems = folderChildItemsMap.get(folder.id) || [];

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
                        "group relative flex cursor-pointer overflow-hidden rounded-xl border transition hover:-translate-y-0.5 hover:shadow-md select-none",
                        viewMode === "list" || viewMode === "details"
                          ? "h-11 items-center gap-3 px-3 bg-card border-border hover:border-amber-400/60"
                          : "flex-col p-3 border-border bg-card/80 hover:border-amber-400/60",
                        isDragOver ? "border-amber-400 bg-amber-400/20 ring-2 ring-amber-400 scale-[1.02]" : ""
                      )}
                    >
                      {/* 2x2 Quad Preview or Single Folder Icon */}
                      <div
                        className={cn(
                          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-amber-400/10 text-amber-400",
                          viewMode === "list" || viewMode === "details" ? "h-7 w-7" : "aspect-video w-full mb-2"
                        )}
                      >
                        {quadItems.length > 0 && viewMode !== "list" && viewMode !== "details" ? (
                          <div className="grid h-full w-full grid-cols-2 gap-0.5 p-1 bg-black/40 rounded-lg">
                            {quadItems.map((qItem, idx) => (
                              <div key={idx} className="relative overflow-hidden rounded bg-muted flex items-center justify-center">
                                {qItem.mediaRecord ? (
                                  <Thumb media={qItem.mediaRecord} className="h-full w-full object-cover" />
                                ) : qItem.type === "song" ? (
                                  <Music className="h-3 w-3 text-purple-400" />
                                ) : qItem.type === "bible" ? (
                                  <BookOpen className="h-3 w-3 text-blue-400" />
                                ) : (
                                  <Megaphone className="h-3 w-3 text-amber-400" />
                                )}
                              </div>
                            ))}
                            {Array.from({ length: Math.max(0, 4 - quadItems.length) }).map((_, idx) => (
                              <div key={`empty-${idx}`} className="rounded bg-muted/20" />
                            ))}
                          </div>
                        ) : (
                          <Folder className="h-6 w-6" />
                        )}
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
                            <p className="truncate text-xs font-semibold text-foreground group-hover:text-amber-400">
                              {folder.name}
                            </p>
                            <span className="text-[10px] text-muted-foreground block">
                              {quadItems.length} child items
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }

                // File Items
                const item = node.data;
                const index = node.index;
                const selected = selection.has(item.id);
                const isRenaming = inlineEditingId === item.id;

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
                        "group relative flex items-center h-11 cursor-pointer overflow-hidden rounded-lg border bg-card px-3 text-xs shadow-sm transition",
                        selected ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="h-7 w-7 shrink-0 overflow-hidden rounded bg-black/40 flex items-center justify-center mr-3">
                        {item.mediaRecord ? (
                          <Thumb media={item.mediaRecord} className="h-full w-full object-cover" />
                        ) : item.type === "song" ? (
                          <Music className="h-3.5 w-3.5 text-purple-400" />
                        ) : item.type === "bible" ? (
                          <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                        ) : (
                          <Megaphone className="h-3.5 w-3.5 text-amber-400" />
                        )}
                      </div>

                      <div className="flex-1 truncate font-medium text-foreground">
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
                          item.name
                        )}
                      </div>

                      {viewMode === "details" && (
                        <>
                          <div className="w-24 uppercase text-[10px] font-bold text-muted-foreground">{item.type}</div>
                          <div className="w-24 text-[11px] text-muted-foreground">{item.size ? formatBytes(item.size) : "-"}</div>
                          <div className="w-32 text-[11px] text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</div>
                        </>
                      )}
                    </div>
                  );
                }

                // Grid / Icon / Gallery Card
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
                      "group relative flex flex-col cursor-pointer overflow-hidden rounded-xl border bg-card/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                      selected ? "border-primary bg-primary/10 ring-2 ring-primary" : "border-border hover:border-primary/50"
                    )}
                  >
                    {/* Visual Thumbnail Box */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-black/40 flex items-center justify-center">
                      {item.mediaRecord ? (
                        <Thumb media={item.mediaRecord} className="h-full w-full object-cover transition group-hover:scale-105 duration-200" />
                      ) : item.type === "song" ? (
                        <div className="flex flex-col items-center justify-center p-2 text-center text-purple-400">
                          <Music className="h-8 w-8 mb-1 opacity-90" />
                          <span className="text-[10px] font-bold text-purple-300">
                            {item.songData?.slides.length || 0} Slides
                          </span>
                        </div>
                      ) : item.type === "bible" ? (
                        <div className="flex flex-col items-center justify-center p-2 text-center text-blue-400">
                          <BookOpen className="h-8 w-8 mb-1 opacity-90" />
                          <span className="text-[10px] font-bold text-blue-300">Passage</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-center text-amber-400">
                          <Megaphone className="h-8 w-8 mb-1 opacity-90" />
                        </div>
                      )}

                      <span className="absolute top-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                        {item.type}
                      </span>
                    </div>

                    {/* Footer Info */}
                    <div className="p-2.5">
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
                          className="w-full rounded border border-primary bg-background px-1 text-xs text-foreground focus:outline-none"
                        />
                      ) : (
                        <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary">
                          {item.name}
                        </p>
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
