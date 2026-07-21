import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLibrary } from "@/stores/library.store";
import { useMediaFavorites } from "@/stores/media-favorites.store";
import { createFolder, renameFolder, deleteFolderDeep, moveMedia, duplicateMedia, deleteMedia, renameMedia } from "@/db/repo";
import type { FolderRecord } from "@/db/schema";
import { LibraryToolbar } from "./LibraryToolbar";
import { LibraryTreeNav } from "./LibraryTreeNav";
import { LibraryExplorerGrid } from "./LibraryExplorerGrid";
import { LibraryPreviewPane } from "./LibraryPreviewPane";
import { LibraryContextMenu } from "./LibraryContextMenu";
import { SongImportDialog, BibleImportDialog, TextImportDialog } from "./LibraryImportDialogs";
import { FloatingActionButton } from "./FloatingActionButton";
import type { LibraryItem, CategoryFilter, SortField, SortOrder, ViewMode } from "./types";
import type { Song } from "@/lib/songs/loader";
import type { BibleLang } from "@/lib/bible/loader";
import { MediaAdapter } from "@/projection";
import { projectSongSlide } from "@/projection/adapters/song.adapter";
import { projectVerse } from "@/projection/adapters/bible.adapter";
import { toast } from "sonner";

export function LibraryShell() {
  const {
    folders,
    media,
    currentFolderId,
    selection,
    search,
    loaded,
    setSearch,
    setFolder,
    toggleSelect,
    clearSelection,
    refreshAll,
    refreshMedia,
    refreshFolders,
  } = useLibrary();

  const favIds = useMediaFavorites((s) => s.ids);
  const toggleFav = useMediaFavorites((s) => s.toggle);
  const favSet = useMemo(() => new Set(favIds), [favIds]);

  // Resizable Panel Widths (VS Code style splitters)
  const [leftWidth, setLeftWidth] = useState(240);
  const [rightWidth, setRightWidth] = useState(320);

  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  // View & Language States
  const [currentCategory, setCurrentCategory] = useState<CategoryFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [bibleLang, setBibleLang] = useState<BibleLang>("en");

  // Navigation History
  const [history, setHistory] = useState<(string | null)[]>([null]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Inline Editing & Creation State
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineCreatingFolder, setInlineCreatingFolder] = useState(false);

  // Clipboard Buffer (Ctrl+C, Ctrl+X, Ctrl+V)
  const [clipboard, setClipboard] = useState<{ action: "copy" | "cut"; items: LibraryItem[] } | null>(null);

  // Context Menu State
  const [inspectedItem, setInspectedItem] = useState<LibraryItem | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: LibraryItem | null } | null>(null);

  // Dialog States
  const [showSongImport, setShowSongImport] = useState(false);
  const [showBibleImport, setShowBibleImport] = useState(false);
  const [showTextImport, setShowTextImport] = useState(false);

  // Custom Items
  const [customItems, setCustomItems] = useState<LibraryItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("vision_file_manager_custom_items_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("vision_file_manager_custom_items_v1", JSON.stringify(customItems));
    } catch {}
  }, [customItems]);

  useEffect(() => {
    if (!loaded) void refreshAll();
  }, [loaded, refreshAll]);

  // Resizable Panels Event Listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft.current) {
        setLeftWidth(Math.max(160, Math.min(450, e.clientX)));
      } else if (isResizingRight.current) {
        setRightWidth(Math.max(220, Math.min(550, window.innerWidth - e.clientX)));
      }
    };

    const handleMouseUp = () => {
      isResizingLeft.current = false;
      isResizingRight.current = false;
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Transform MediaRecords + CustomItems into unified LibraryItem array
  const allLibraryItems = useMemo<LibraryItem[]>(() => {
    const mediaItems: LibraryItem[] = media.map((m) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      folderId: m.folderId,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      size: m.size,
      mime: m.mime,
      durationMs: m.durationMs,
      width: m.width,
      height: m.height,
      blobId: m.blobId,
      thumbBlobId: m.thumbBlobId,
      mediaRecord: m,
      isFavorite: favSet.has(m.id),
    }));

    return [...mediaItems, ...customItems];
  }, [media, customItems, favSet]);

  // Subfolders under current folder context
  const currentSubfolders = useMemo(() => {
    return folders.filter((f) => f.parentId === currentFolderId);
  }, [folders, currentFolderId]);

  // Filtered File Items
  const filteredItems = useMemo(() => {
    let out = allLibraryItems;

    if (currentFolderId !== null) {
      out = out.filter((item) => item.folderId === currentFolderId);
    }

    if (currentCategory === "songs") out = out.filter((i) => i.type === "song");
    else if (currentCategory === "bible") out = out.filter((i) => i.type === "bible");
    else if (currentCategory === "media") out = out.filter((i) => i.type === "image" || i.type === "video");
    else if (currentCategory === "images") out = out.filter((i) => i.type === "image");
    else if (currentCategory === "videos") out = out.filter((i) => i.type === "video");
    else if (currentCategory === "announcements") out = out.filter((i) => i.type === "text");
    else if (currentCategory === "favorites") out = out.filter((i) => i.isFavorite);

    const q = search.trim().toLowerCase();
    if (q) {
      out = out.filter((i) => i.name.toLowerCase().includes(q));
    }

    return [...out].sort((a, b) => {
      let valA: any = a[sortField] ?? "";
      let valB: any = b[sortField] ?? "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [allLibraryItems, currentFolderId, currentCategory, search, sortField, sortOrder]);

  const selectedItems = useMemo(() => {
    return filteredItems.filter((i) => selection.has(i.id));
  }, [filteredItems, selection]);

  // Unique Folder Validation
  const validateUniqueFolder = useCallback(
    (name: string, targetFolderId: string | null = currentFolderId, excludeFolderId?: string) => {
      const trimmed = name.trim().toLowerCase();
      const existing = folders.find(
        (f) => f.parentId === targetFolderId && f.name.trim().toLowerCase() === trimmed && f.id !== excludeFolderId,
      );
      if (existing) {
        toast.error("A folder with this name already exists.");
        return false;
      }
      return true;
    },
    [folders, currentFolderId],
  );

  // Folder Creation Action
  const handleCreateFolderSubmit = async (name: string) => {
    setInlineCreatingFolder(false);
    if (!name.trim()) return;
    if (!validateUniqueFolder(name, currentFolderId)) return;
    const folder = await createFolder(name.trim(), currentFolderId);
    await refreshFolders();
    toast.success(`Created Folder: ${folder.name}`);
  };

  // Inline Rename Action
  const handleInlineRenameSubmit = async (id: string, newName: string) => {
    setInlineEditingId(null);
    if (!newName.trim()) return;

    // Check if target is a folder
    const folderTarget = folders.find((f) => f.id === id);
    if (folderTarget) {
      if (!validateUniqueFolder(newName, folderTarget.parentId, folderTarget.id)) return;
      await renameFolder(id, newName.trim());
      await refreshFolders();
      toast.success("Folder renamed");
      return;
    }

    // Check if target is media item
    const itemTarget = allLibraryItems.find((i) => i.id === id);
    if (itemTarget) {
      if (itemTarget.mediaRecord) {
        await renameMedia(id, newName.trim());
        await refreshMedia();
      } else {
        setCustomItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, name: newName.trim() } : i)),
        );
      }
      toast.success("Item renamed");
    }
  };

  // Desktop Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // F2: Start Inline Rename
      if (e.key === "F2" && selectedItems.length === 1) {
        e.preventDefault();
        setInlineEditingId(selectedItems[0].id);
        return;
      }

      // Delete: Remove Selected
      if ((e.key === "Delete" || e.key === "Backspace") && selectedItems.length > 0) {
        e.preventDefault();
        const mediaIds = selectedItems.filter((i) => i.mediaRecord).map((i) => i.id);
        const customIds = new Set(selectedItems.filter((i) => !i.mediaRecord).map((i) => i.id));
        if (mediaIds.length) {
          deleteMedia(mediaIds).then(refreshMedia);
        }
        if (customIds.size) {
          setCustomItems((prev) => prev.filter((i) => !customIds.has(i.id)));
        }
        toast.success(`Deleted ${selectedItems.length} item(s)`);
        return;
      }

      // Ctrl+A: Select All
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        filteredItems.forEach((i) => toggleSelect(i.id, true));
        return;
      }

      // Ctrl+C: Copy
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c" && selectedItems.length > 0) {
        e.preventDefault();
        setClipboard({ action: "copy", items: selectedItems });
        toast.info(`Copied ${selectedItems.length} item(s) to clipboard`);
        return;
      }

      // Ctrl+X: Cut
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "x" && selectedItems.length > 0) {
        e.preventDefault();
        setClipboard({ action: "cut", items: selectedItems });
        toast.info(`Cut ${selectedItems.length} item(s)`);
        return;
      }

      // Ctrl+V: Paste
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v" && clipboard) {
        e.preventDefault();
        if (clipboard.action === "cut") {
          const mediaIds = clipboard.items.filter((i) => i.mediaRecord).map((i) => i.id);
          if (mediaIds.length) {
            moveMedia(mediaIds, currentFolderId).then(refreshMedia);
          }
          setCustomItems((prev) =>
            prev.map((i) => (clipboard.items.some((c) => c.id === i.id) ? { ...i, folderId: currentFolderId } : i)),
          );
          toast.success(`Moved ${clipboard.items.length} item(s) to current folder`);
          setClipboard(null);
        } else {
          const mediaIds = clipboard.items.filter((i) => i.mediaRecord).map((i) => i.id);
          if (mediaIds.length) {
            duplicateMedia(mediaIds).then(refreshMedia);
          }
          toast.success(`Pasted ${clipboard.items.length} item(s)`);
        }
        return;
      }

      // Esc: Clear selection & Cancel inline editing
      if (e.key === "Escape") {
        clearSelection();
        setInlineEditingId(null);
        setInlineCreatingFolder(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItems, filteredItems, clipboard, currentFolderId, toggleSelect, clearSelection, refreshMedia]);

  // Counts Calculation
  const categoryCounts = useMemo<Record<CategoryFilter, number>>(() => {
    const counts: Record<CategoryFilter, number> = {
      all: allLibraryItems.length,
      songs: allLibraryItems.filter((i) => i.type === "song").length,
      bible: allLibraryItems.filter((i) => i.type === "bible").length,
      media: allLibraryItems.filter((i) => i.type === "image" || i.type === "video").length,
      images: allLibraryItems.filter((i) => i.type === "image").length,
      videos: allLibraryItems.filter((i) => i.type === "video").length,
      announcements: allLibraryItems.filter((i) => i.type === "text").length,
      presentations: 0,
      playlists: 0,
      favorites: allLibraryItems.filter((i) => i.isFavorite).length,
      recent: allLibraryItems.slice(0, 20).length,
      trash: 0,
    };
    return counts;
  }, [allLibraryItems]);

  const folderCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    for (const item of allLibraryItems) {
      if (item.folderId) {
        counts[item.folderId] = (counts[item.folderId] || 0) + 1;
      }
    }
    return counts;
  }, [allLibraryItems]);

  // Navigation History Handling
  const navigateToFolder = useCallback(
    (folderId: string | null) => {
      setFolder(folderId);
      const nextHistory = history.slice(0, historyIdx + 1);
      nextHistory.push(folderId);
      setHistory(nextHistory);
      setHistoryIdx(nextHistory.length - 1);
    },
    [history, historyIdx, setFolder],
  );

  const goBack = useCallback(() => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      setFolder(history[prevIdx]);
    }
  }, [history, historyIdx, setFolder]);

  const goForward = useCallback(() => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      setFolder(history[nextIdx]);
    }
  }, [history, historyIdx, setFolder]);

  const goUp = useCallback(() => {
    if (!currentFolderId) return;
    const current = folders.find((f) => f.id === currentFolderId);
    navigateToFolder(current?.parentId ?? null);
  }, [currentFolderId, folders, navigateToFolder]);

  // Actions
  const handleItemClick = useCallback(
    (e: React.MouseEvent, item: LibraryItem, index: number) => {
      toggleSelect(item.id, e.ctrlKey || e.metaKey);
      setInspectedItem(item);
    },
    [toggleSelect],
  );

  const projectItem = useCallback(async (item: LibraryItem) => {
    if (item.mediaRecord) {
      await MediaAdapter.projectMedia(item.mediaRecord);
      toast.success(`Projecting ${item.name}`);
    } else if (item.songData) {
      projectSongSlide({ songId: item.songData.id, slideIndex: 0 });
      toast.success(`Projecting Song: ${item.name}`);
    } else if (item.bibleData) {
      await projectVerse({
        translation: bibleLang === "en" ? "KJV" : ("TCV" as any),
        book: item.bibleData.book,
        chapter: item.bibleData.chapter,
        verse: item.bibleData.verse,
      });
      toast.success(`Projecting Verse (${bibleLang.toUpperCase()}): ${item.name}`);
    }
  }, [bibleLang]);

  const handleItemDoubleClick = useCallback(
    (e: React.MouseEvent, item: LibraryItem) => {
      void projectItem(item);
    },
    [projectItem],
  );

  const handleContextMenu = useCallback((e: React.MouseEvent, item: LibraryItem | null) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  }, []);

  // Import Handler Logic
  const handleImportSong = (song: Song) => {
    const newItem: LibraryItem = {
      id: `song-${song.id}-${Date.now()}`,
      name: song.title,
      type: "song",
      folderId: currentFolderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      songData: song,
    };
    setCustomItems((prev) => [newItem, ...prev]);
    toast.success(`Imported Song to current folder: ${song.title}`);
  };

  const handleImportBible = (verse: { book: number; bookName: string; chapter: number; verse: number; text: string; lang: BibleLang }) => {
    const newItem: LibraryItem = {
      id: `bible-${verse.book}-${verse.chapter}-${verse.verse}-${Date.now()}`,
      name: `${verse.bookName} ${verse.chapter}:${verse.verse}`,
      type: "bible",
      folderId: currentFolderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      bibleData: { ...verse, translation: verse.lang },
    };
    setCustomItems((prev) => [newItem, ...prev]);
    toast.success(`Imported Verse to current folder: ${newItem.name}`);
  };

  const handleCreateText = (title: string, content: string) => {
    const newItem: LibraryItem = {
      id: `text-${Date.now()}`,
      name: title,
      type: "text",
      folderId: currentFolderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      textData: { content },
    };
    setCustomItems((prev) => [newItem, ...prev]);
    toast.success(`Created Text in current folder: ${title}`);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Top File Explorer Toolbar */}
      <LibraryToolbar
        currentCategory={currentCategory}
        currentFolderId={currentFolderId}
        folders={folders}
        search={search}
        viewMode={viewMode}
        zoomLevel={zoomLevel}
        sortField={sortField}
        sortOrder={sortOrder}
        canGoBack={historyIdx > 0}
        canGoForward={historyIdx < history.length - 1}
        onGoBack={goBack}
        onGoForward={goForward}
        onGoUp={goUp}
        onRefresh={refreshAll}
        onSearchChange={setSearch}
        onCategoryChange={setCurrentCategory}
        onFolderChange={navigateToFolder}
        onViewModeChange={setViewMode}
        onZoomChange={setZoomLevel}
        onSortChange={setSortField}
        onToggleSortOrder={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        onNewFolder={() => setInlineCreatingFolder(true)}
        onUploadClick={() => {
          const el = document.createElement("input");
          el.type = "file";
          el.multiple = true;
          el.onchange = async () => {
            if (el.files && el.files.length) {
              const { importFiles } = await import("@/db/repo");
              await importFiles(Array.from(el.files), currentFolderId);
              await refreshMedia();
              toast.success(`Uploaded ${el.files.length} file(s) to current folder`);
            }
          };
          el.click();
        }}
      />

      {/* Resizable 3-Pane Explorer Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Pane 1: Left Navigation Sidebar */}
        <div style={{ width: `${leftWidth}px` }} className="shrink-0">
          <LibraryTreeNav
            currentCategory={currentCategory}
            currentFolderId={currentFolderId}
            folders={folders}
            categoryCounts={categoryCounts}
            folderCounts={folderCounts}
            onSelectCategory={setCurrentCategory}
            onSelectFolder={navigateToFolder}
            onCreateFolder={() => setInlineCreatingFolder(true)}
            onRenameFolder={(f) => setInlineEditingId(f.id)}
            onDeleteFolder={(f) => {
              if (confirm(`Delete folder "${f.name}"?`)) {
                deleteFolderDeep(f.id).then(refreshFolders);
              }
            }}
            onDropItemToFolder={async (itemId, folderId) => {
              await moveMedia([itemId], folderId);
              await refreshMedia();
            }}
          />
        </div>

        {/* Left Resize Splitter Handle */}
        <div
          onMouseDown={() => {
            isResizingLeft.current = true;
            document.body.style.cursor = "col-resize";
          }}
          className="w-1 cursor-col-resize hover:bg-primary/50 transition bg-border/40 select-none"
          title="Drag to resize left tree panel"
        />

        {/* Pane 2: Center File Explorer Grid */}
        <LibraryExplorerGrid
          items={filteredItems}
          subfolders={currentSubfolders}
          selection={selection}
          viewMode={viewMode}
          zoomLevel={zoomLevel}
          bibleLang={bibleLang}
          inlineEditingId={inlineEditingId}
          inlineCreatingFolder={inlineCreatingFolder}
          onInlineRenameSubmit={handleInlineRenameSubmit}
          onInlineCreateSubmit={handleCreateFolderSubmit}
          onInlineCancel={() => {
            setInlineEditingId(null);
            setInlineCreatingFolder(false);
          }}
          onItemClick={handleItemClick}
          onItemDoubleClick={handleItemDoubleClick}
          onFolderDoubleClick={navigateToFolder}
          onContextMenu={handleContextMenu}
          onToggleFavorite={(item) => {
            if (item.mediaRecord) toggleFav(item.id);
          }}
        />

        {/* Right Resize Splitter Handle */}
        <div
          onMouseDown={() => {
            isResizingRight.current = true;
            document.body.style.cursor = "col-resize";
          }}
          className="w-1 cursor-col-resize hover:bg-primary/50 transition bg-border/40 select-none"
          title="Drag to resize right inspector panel"
        />

        {/* Pane 3: Right Inspector / Live Preview Pane */}
        <div style={{ width: `${rightWidth}px` }} className="shrink-0">
          <LibraryPreviewPane
            item={inspectedItem}
            bibleLang={bibleLang}
            onBibleLangChange={setBibleLang}
            onClose={() => setInspectedItem(null)}
            onProject={projectItem}
          />
        </div>
      </div>

      {/* Status Bar Footer */}
      <footer className="flex h-6 items-center justify-between border-t border-border px-3 text-[11px] text-muted-foreground bg-muted/20 select-none">
        <div>
          <span>{filteredItems.length} items</span>
          {selection.size > 0 && <span className="ml-3 font-medium text-foreground">{selection.size} selected</span>}
        </div>
        <div className="flex items-center gap-3">
          <span>File Manager</span>
          <span>·</span>
          <span>Windows Explorer View</span>
        </div>
      </footer>

      {/* Floating Action Button */}
      <FloatingActionButton
        onNewFolder={() => setInlineCreatingFolder(true)}
        onImportSong={() => setShowSongImport(true)}
        onImportBible={() => setShowBibleImport(true)}
        onImportMedia={() => {
          const el = document.createElement("input");
          el.type = "file";
          el.multiple = true;
          el.onchange = async () => {
            if (el.files && el.files.length) {
              const { importFiles } = await import("@/db/repo");
              await importFiles(Array.from(el.files), currentFolderId);
              await refreshMedia();
              toast.success(`Uploaded ${el.files.length} file(s)`);
            }
          };
          el.click();
        }}
        onCreateText={() => setShowTextImport(true)}
      />

      {/* Right Click Context Menu */}
      {contextMenu && (
        <LibraryContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          selectedItems={contextMenu.item ? (selectedItems.length ? selectedItems : [contextMenu.item]) : []}
          isCanvasBackground={!contextMenu.item}
          onClose={() => setContextMenu(null)}
          onOpen={projectItem}
          onPreview={setInspectedItem}
          onProject={projectItem}
          onRename={(item) => setInlineEditingId(item.id)}
          onDuplicate={(items) => {
            const mediaIds = items.filter((i) => i.mediaRecord).map((i) => i.id);
            if (mediaIds.length) {
              duplicateMedia(mediaIds).then(refreshMedia);
            }
          }}
          onMove={() => {}}
          onCopy={(items) => {
            setClipboard({ action: "copy", items });
            toast.info(`Copied ${items.length} item(s)`);
          }}
          onCut={(items) => {
            setClipboard({ action: "cut", items });
            toast.info(`Cut ${items.length} item(s)`);
          }}
          onPaste={() => {
            if (!clipboard) return;
            if (clipboard.action === "cut") {
              const mediaIds = clipboard.items.filter((i) => i.mediaRecord).map((i) => i.id);
              if (mediaIds.length) {
                moveMedia(mediaIds, currentFolderId).then(refreshMedia);
              }
              setCustomItems((prev) =>
                prev.map((i) => (clipboard.items.some((c) => c.id === i.id) ? { ...i, folderId: currentFolderId } : i)),
              );
              toast.success(`Moved ${clipboard.items.length} item(s)`);
              setClipboard(null);
            } else {
              const mediaIds = clipboard.items.filter((i) => i.mediaRecord).map((i) => i.id);
              if (mediaIds.length) {
                duplicateMedia(mediaIds).then(refreshMedia);
              }
              toast.success(`Pasted ${clipboard.items.length} item(s)`);
            }
          }}
          onDelete={(items) => {
            const mediaIds = items.filter((i) => i.mediaRecord).map((i) => i.id);
            const customIds = new Set(items.filter((i) => !i.mediaRecord).map((i) => i.id));
            if (mediaIds.length) {
              deleteMedia(mediaIds).then(refreshMedia);
            }
            if (customIds.size) {
              setCustomItems((prev) => prev.filter((i) => !customIds.has(i.id)));
            }
            toast.success(`Deleted ${items.length} item(s)`);
          }}
          onToggleFavorite={(item) => {
            if (item.mediaRecord) toggleFav(item.id);
          }}
          onShowProperties={setInspectedItem}
          onNewFolder={() => setInlineCreatingFolder(true)}
          onRefresh={refreshAll}
          onSelectAll={() => filteredItems.forEach((i) => toggleSelect(i.id, true))}
        />
      )}

      {/* Import Modals */}
      <SongImportDialog
        open={showSongImport}
        onClose={() => setShowSongImport(false)}
        onImport={handleImportSong}
      />
      <BibleImportDialog
        open={showBibleImport}
        onClose={() => setShowBibleImport(false)}
        onImport={handleImportBible}
      />
      <TextImportDialog
        open={showTextImport}
        onClose={() => setShowTextImport(false)}
        onImport={handleCreateText}
      />
    </div>
  );
}
