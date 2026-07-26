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
  Play,
  Film,
  Check,
} from "lucide-react";
import type { LibraryItem, ViewMode } from "./types";
import type { FolderRecord } from "@/db/schema";
import { formatBytes, formatDuration } from "@/lib/files";
import { Thumb } from "@/components/Thumb";
import { getVerse, type BibleLang } from "@/lib/bible/loader";
import { cn } from "@/lib/utils";
import { useDragAutoScroll } from "./useDragAutoScroll";
import { ShortcutTooltip } from "@/components/ShortcutTooltip";

interface LibraryExplorerGridProps {
  items: LibraryItem[];
  allLibraryItems?: LibraryItem[];
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
  onUploadClick?: () => void;
}

type UnifiedNode =
  | { type: "creating_folder"; id: "creating_folder" }
  | { type: "subfolder"; data: FolderRecord; id: string }
  | { type: "item"; data: LibraryItem; index: number; id: string };

export function LibraryExplorerGrid({
  items,
  allLibraryItems,
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
  onUploadClick,
}: LibraryExplorerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useDragAutoScroll(containerRef, 12, 50);

  const [creatingFolderName, setCreatingFolderName] = useState("New Folder");
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [dragBox, setDragBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  // Initial width estimate fallback so itemsPerRow is > 1 on initial render
  const [containerWidth, setContainerWidth] = useState(() => {
    if (typeof window !== "undefined") return Math.max(600, window.innerWidth - 560);
    return 800;
  });

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
    const itemList = allLibraryItems || items;
    for (const item of itemList) {
      if (item.folderId) {
        const list = map.get(item.folderId) || [];
        if (list.length < 4) list.push(item);
        map.set(item.folderId, list);
      }
    }
    return map;
  }, [allLibraryItems, items]);

  // Calculate actual total items inside each folder
  const folderChildCountMap = useMemo(() => {
    const map = new Map<string, number>();
    const itemList = allLibraryItems || items;
    for (const item of itemList) {
      if (item.folderId) {
        map.set(item.folderId, (map.get(item.folderId) || 0) + 1);
      }
    }
    for (const sub of subfolders) {
      if (sub.parentId) {
        map.set(sub.parentId, (map.get(sub.parentId) || 0) + 1);
      }
    }
    return map;
  }, [allLibraryItems, items, subfolders]);

  // Measure container width for responsive virtualization
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
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
  let baseWidth = 220;
  if (viewMode === "large-icons") baseWidth = 250;
  else if (viewMode === "medium-icons" || viewMode === "grid") baseWidth = 180;
  else if (viewMode === "small-icons") baseWidth = 130;
  else if (viewMode === "gallery") baseWidth = 240;
  else if (viewMode === "list" || viewMode === "details") baseWidth = Math.max(300, containerWidth - gap * 2);

  const itemWidth = Math.max(110, Math.floor(baseWidth * zoomLevel));
  const effectiveContainerW = Math.max(400, containerWidth);
  const itemsPerRow = viewMode === "list" || viewMode === "details" ? 1 : Math.max(1, Math.floor((effectiveContainerW + gap) / (itemWidth + gap)));
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

          const rowH = viewMode === "small-icons" ? 44 : viewMode === "list" || viewMode === "details" ? 40 : itemWidth * 0.625 + 75;
          const top = rowIndex * (rowH + gap);
          const left = colIndex * (itemWidth + gap) + 16;
          const bottom = top + rowH;
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

  const handleDragFolderStart = (e: React.DragEvent, folderId: string) => {
    const selectedIds = selection.has(folderId) ? Array.from(selection) : [folderId];
    e.dataTransfer.setData("application/json", JSON.stringify(selectedIds));
    e.dataTransfer.setData("text/plain", folderId);

    const ghost = document.createElement("div");
    ghost.className =
      "fixed pointer-events-none z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-black shadow-2xl font-bold text-xs border border-amber-300 backdrop-blur";
    ghost.innerHTML = `<span>📁 Moving ${selectedIds.length} folder(s)</span>`;
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
      if (viewMode === "list" || viewMode === "details") return 40 + gap;
      if (viewMode === "small-icons") return 44 + gap;
      return itemWidth * 0.625 + 75 + gap;
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
        <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-muted/40 border border-border/80 shadow-inner">
          <Folder className="h-12 w-12 text-muted-foreground/40" />
        </div>
        <h3 className="text-base font-bold text-foreground">This Folder is Empty</h3>
        <p className="mt-1 text-xs max-w-sm text-muted-foreground opacity-80">
          Drag and drop media files directly into this area, or use the shortcuts below to add content.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onUploadClick?.()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 active:scale-95 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Files
          </button>
          <button
            onClick={() => onInlineCreateSubmit("New Folder")}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-accent active:scale-95 cursor-pointer"
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
      {/* Selection Marquee Box */}
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
                      className="flex h-12 items-center gap-3 overflow-hidden rounded-xl border border-primary bg-primary/10 p-2 shadow-md"
                    >
                      <Folder className="h-5 w-5 text-amber-400 shrink-0" />
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

                  // Small Icons View: Compact Tile
                  if (viewMode === "small-icons") {
                    return (
                      <div
                        key={folder.id}
                        draggable
                        onDragStart={(e) => handleDragFolderStart(e, folder.id)}
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
                        className={cn(
                          "group flex h-10 cursor-pointer items-center gap-2 rounded-lg border bg-card/80 px-2.5 shadow-sm transition hover:border-amber-400/60 select-none",
                          isDragOver ? "border-amber-400 bg-amber-400/20 ring-2 ring-amber-400" : "border-border"
                        )}
                        title={folder.name}
                      >
                        <Folder className="h-4 w-4 shrink-0 text-amber-400" />
                        <span className="truncate text-xs font-semibold text-foreground group-hover:text-amber-400">
                          {folder.name}
                        </span>
                      </div>
                    );
                  }

                  // List / Details View
                  if (viewMode === "list" || viewMode === "details") {
                    return (
                      <div
                        key={folder.id}
                        draggable
                        onDragStart={(e) => handleDragFolderStart(e, folder.id)}
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
                        className={cn(
                          "group flex h-10 cursor-pointer items-center gap-3 rounded-lg border bg-card px-3 shadow-sm transition hover:border-amber-400/60 select-none",
                          isDragOver ? "border-amber-400 bg-amber-400/20 ring-2 ring-amber-400" : "border-border"
                        )}
                        title={folder.name}
                      >
                        <Folder className="h-5 w-5 shrink-0 text-amber-400" />
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
                            <span className="truncate text-xs font-semibold text-foreground group-hover:text-amber-400">
                              {folder.name}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{folderChildCountMap.get(folder.id) || 0} items</span>
                      </div>
                    );
                  }

                  // Folder Grid Card (Unified Card UI V2)
                  return (
                    <div
                      key={folder.id}
                      draggable
                      onDragStart={(e) => handleDragFolderStart(e, folder.id)}
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
                        const raw = e.dataTransfer.getData("application/json");
                        if (raw) {
                          try {
                            const ids = JSON.parse(raw);
                            if (Array.isArray(ids)) onDropItemsToFolder(ids, folder.id);
                          } catch (err) {}
                        } else {
                          const singleId = e.dataTransfer.getData("text/plain");
                          if (singleId) onDropItemsToFolder([singleId], folder.id);
                        }
                      }}
                      className={cn(
                        "group relative flex flex-col cursor-pointer overflow-hidden rounded-xl border bg-[#111827] shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:bg-[#161F33] select-none",
                        isDragOver
                          ? "border-amber-400 bg-amber-500/20 ring-2 ring-amber-400 scale-[1.02]"
                          : "border-[#2D3348] hover:border-amber-400/60"
                      )}
                      title={folder.name}
                    >
                      {/* Top-Left Media Badge */}
                      <span className="absolute top-2 left-2 z-10 rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-black bg-amber-400 shadow-sm backdrop-blur">
                        FOLDER
                      </span>

                      {/* Folder 16:10 Thumbnail Graphic Box */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-amber-950/20 flex items-center justify-center border-b border-[#2D3348]">
                        {quadItems.length > 0 ? (
                          <div className="grid h-full w-full grid-cols-2 gap-1 p-1 bg-black/40">
                            {quadItems.map((qItem, idx) => (
                              <div key={idx} className="relative overflow-hidden rounded bg-black/60 flex items-center justify-center">
                                {qItem.mediaRecord ? (
                                  <Thumb media={qItem.mediaRecord} className="h-full w-full object-cover" />
                                ) : qItem.type === "song" ? (
                                  <Music className="h-3.5 w-3.5 text-purple-400" />
                                ) : qItem.type === "bible" ? (
                                  <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                                ) : (
                                  <Megaphone className="h-3.5 w-3.5 text-blue-400" />
                                )}
                              </div>
                            ))}
                            {Array.from({ length: Math.max(0, 4 - quadItems.length) }).map((_, idx) => (
                              <div key={`empty-${idx}`} className="rounded bg-white/5" />
                            ))}
                          </div>
                        ) : (
                          <Folder className="h-12 w-12 text-amber-400/80 group-hover:scale-110 transition-transform duration-200" />
                        )}
                      </div>

                      {/* Footer Info Box */}
                      <div className="p-2.5 flex flex-col justify-between flex-1 min-h-[54px]">
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
                            className="w-full rounded border border-amber-400 bg-background px-1 text-xs text-foreground focus:outline-none"
                          />
                        ) : (
                          <>
                            <p className="line-clamp-2 text-xs font-semibold text-foreground group-hover:text-amber-400 transition-colors leading-snug">
                              {folder.name}
                            </p>
                            <span className="text-[10px] text-muted-foreground font-mono block mt-1">
                              {folderChildCountMap.get(folder.id) || 0} item(s)
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

                if (viewMode === "small-icons") {
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
                        "group flex h-10 cursor-pointer items-center gap-2 rounded-lg border bg-[#111827]/90 px-2.5 text-xs shadow-sm transition",
                        selected ? "border-blue-500 bg-blue-600/15 ring-1 ring-blue-500" : "border-[#2D3348] hover:border-blue-500/50"
                      )}
                      title={item.name}
                    >
                      <div className="h-5 w-5 shrink-0 overflow-hidden rounded bg-black/40 flex items-center justify-center">
                        {item.mediaRecord ? (
                          <Thumb media={item.mediaRecord} className="h-full w-full object-cover" />
                        ) : item.type === "song" ? (
                          <Music className="h-3 w-3 text-purple-400" />
                        ) : item.type === "bible" ? (
                          <BookOpen className="h-3 w-3 text-blue-400" />
                        ) : (
                          <Megaphone className="h-3 w-3 text-amber-400" />
                        )}
                      </div>
                      <span className="truncate font-medium text-foreground">{item.name}</span>
                    </div>
                  );
                }

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
                        "group relative flex items-center h-10 cursor-pointer overflow-hidden rounded-lg border bg-[#111827]/90 px-3 text-xs shadow-sm transition",
                        selected ? "border-blue-500 bg-blue-600/15 ring-1 ring-blue-500" : "border-[#2D3348] hover:border-blue-500/50"
                      )}
                      title={item.name}
                    >
                      <div className="h-6 w-6 shrink-0 overflow-hidden rounded bg-black/40 flex items-center justify-center mr-3">
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
                            className="w-full rounded border border-blue-500 bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none"
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

                // Gallery View Mode: Full-bleed edge-to-edge media preview with hover title
                if (viewMode === "gallery") {
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
                        "group relative flex flex-col cursor-pointer overflow-hidden rounded-xl border bg-black shadow-md transition hover:-translate-y-0.5 hover:shadow-xl select-none aspect-[4/3]",
                        selected ? "border-blue-500 ring-2 ring-blue-500" : "border-[#2D3348] hover:border-blue-400"
                      )}
                      title={item.name}
                    >
                      <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-black/60">
                        {item.mediaRecord ? (
                          <Thumb media={item.mediaRecord} className="h-full w-full object-cover transition group-hover:scale-105 duration-300" />
                        ) : item.type === "song" ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center text-purple-400 bg-purple-950/40 h-full w-full">
                            <Music className="h-10 w-10 mb-2 opacity-90" />
                            <span className="text-xs font-bold text-purple-300">{item.name}</span>
                          </div>
                        ) : item.type === "bible" ? (
                          <div className="flex flex-col items-center justify-center p-3 text-center text-amber-400 bg-amber-950/40 h-full w-full">
                            <BookOpen className="h-10 w-10 mb-2 opacity-90" />
                            <span className="text-xs font-bold text-amber-300">{item.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-3 text-center text-blue-400 bg-blue-950/40 h-full w-full">
                            <Megaphone className="h-10 w-10 mb-2 opacity-90" />
                            <span className="text-xs font-bold text-blue-300">{item.name}</span>
                          </div>
                        )}

                        {/* Top Left Badge */}
                        <span
                          className={cn(
                            "absolute top-2 left-2 rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white backdrop-blur shadow-sm",
                            item.type === "song" ? "bg-purple-600/80" : item.type === "bible" ? "bg-amber-600/80" : item.type === "video" ? "bg-purple-600/80" : "bg-black/70"
                          )}
                        >
                          {item.type}
                        </span>

                        {/* Hover Overlay Title Block */}
                        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-end">
                          <p className="line-clamp-2 text-xs font-bold text-white leading-snug">{item.name}</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">{item.size ? formatBytes(item.size) : item.type}</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // File Grid Cards (Unified Card UI V2)
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
                      "group relative flex flex-col cursor-pointer overflow-hidden rounded-xl border bg-[#111827] shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:bg-[#161F33] select-none",
                      selected
                        ? "border-blue-500 bg-blue-600/15 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20"
                        : "border-[#2D3348] hover:border-blue-500/60"
                    )}
                    title={item.name}
                  >
                    {/* Top-Left Media Type Badge */}
                    <span
                      className={cn(
                        "absolute top-2 left-2 z-10 rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white backdrop-blur shadow-md",
                        item.type === "image"
                          ? "bg-emerald-600/90"
                          : item.type === "video"
                          ? "bg-purple-600/90"
                          : item.type === "song"
                          ? "bg-purple-600/90"
                          : item.type === "bible"
                          ? "bg-amber-600/90"
                          : "bg-blue-600/90"
                      )}
                    >
                      {item.type}
                    </span>

                    {/* Selected Checkmark Badge (Top Right) */}
                    {selected && (
                      <div className="absolute top-2 right-2 z-20 h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md animate-in fade-in duration-150">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Quick Hover Action Buttons (Top Right when NOT selected) */}
                    {!selected && (
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <ShortcutTooltip label={item.isFavorite ? "Unfavorite" : "Favorite"}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(item);
                            }}
                            className="h-6 w-6 rounded-md bg-black/70 hover:bg-amber-500 text-white hover:text-black flex items-center justify-center backdrop-blur transition shadow cursor-pointer"
                          >
                            <Star className={cn("h-3.5 w-3.5", item.isFavorite ? "fill-amber-400 text-amber-400" : "")} />
                          </button>
                        </ShortcutTooltip>
                      </div>
                    )}

                    {/* Proportional 16:10 Thumbnail Graphic Box */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 flex items-center justify-center border-b border-[#2D3348]">
                      {item.mediaRecord ? (
                        <>
                          <Thumb media={item.mediaRecord} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="h-9 w-9 rounded-full bg-black/70 backdrop-blur border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                                <Play className="h-4 w-4 fill-white ml-0.5" />
                              </div>
                            </div>
                          )}
                        </>
                      ) : item.type === "song" ? (
                        <div className="flex flex-col items-center justify-center p-3 text-center text-purple-400 bg-gradient-to-br from-purple-950 via-purple-900/40 to-black h-full w-full">
                          <Music className="h-9 w-9 mb-1 text-purple-400 opacity-90 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-[10px] font-bold text-purple-300">
                            {item.songData?.slides.length || 0} Slides
                          </span>
                        </div>
                      ) : item.type === "bible" ? (
                        <div className="flex flex-col items-center justify-center p-3 text-center text-amber-400 bg-gradient-to-br from-amber-950 via-amber-900/40 to-black h-full w-full">
                          <BookOpen className="h-9 w-9 mb-1 text-amber-400 opacity-90 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-[10px] font-bold text-amber-300">Passage</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 text-center text-blue-400 bg-gradient-to-br from-blue-950 via-blue-900/40 to-black h-full w-full">
                          <Megaphone className="h-9 w-9 mb-1 text-blue-400 opacity-90 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-[10px] font-bold text-blue-300">Announcement</span>
                        </div>
                      )}

                      {/* Duration / Resolution overlay badge */}
                      {item.durationMs ? (
                        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-mono font-medium text-white backdrop-blur shadow">
                          {formatDuration(item.durationMs)}
                        </span>
                      ) : item.width && item.height ? (
                        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-mono font-medium text-white backdrop-blur shadow">
                          {item.width}×{item.height}
                        </span>
                      ) : null}
                    </div>

                    {/* Card Footer Info */}
                    <div className="p-2.5 flex flex-col justify-between flex-1 min-h-[54px]">
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
                          className="w-full rounded border border-blue-500 bg-background px-1 text-xs text-foreground focus:outline-none"
                        />
                      ) : (
                        <>
                          <p className="line-clamp-2 text-xs font-semibold text-foreground group-hover:text-blue-400 transition-colors leading-snug">
                            {item.name}
                          </p>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                            <span>{item.size ? formatBytes(item.size) : item.type}</span>
                            {item.songData && <span className="text-purple-400 font-semibold">Song</span>}
                            {item.bibleData && <span className="text-amber-400 font-semibold">{bibleLang.toUpperCase()}</span>}
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
