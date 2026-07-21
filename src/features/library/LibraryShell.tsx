import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLibrary } from "@/stores/library.store";
import { useMediaFavorites } from "@/stores/media-favorites.store";
import { createFolder, renameFolder, deleteFolderDeep, moveMedia, duplicateMedia, deleteMedia, renameMedia } from "@/db/repo";
import type { FolderRecord, MediaRecord } from "@/db/schema";
import { LibraryToolbar } from "./LibraryToolbar";
import { LibraryTreeNav } from "./LibraryTreeNav";
import { LibraryExplorerGrid } from "./LibraryExplorerGrid";
import { LibraryPreviewPane } from "./LibraryPreviewPane";
import { LibraryContextMenu } from "./LibraryContextMenu";
import { SongImportDialog, BibleImportDialog, TextImportDialog } from "./LibraryImportDialogs";
import { FloatingActionButton } from "./FloatingActionButton";
import type { LibraryItem, CategoryFilter, SortField, SortOrder, ViewMode } from "./types";
import { MediaAdapter } from "@/projection";
import { projectSongSlide } from "@/projection/adapters/song.adapter";
import { projectVerse } from "@/projection/adapters/bible.adapter";
import { toast } from "sonner";
import { RenameDialog } from "@/components/RenameDialog";

export function LibraryShell() {
  const {
    folders,
    media,
    currentFolderId,
    selection,
    search,
    filter,
    loaded,
    setSearch,
    setFilter,
    setFolder,
    toggleSelect,
    clearSelection,
    selectAll,
    refreshAll,
    refreshMedia,
    refreshFolders,
  } = useLibrary();

  const favIds = useMediaFavorites((s) => s.ids);
  const toggleFav = useMediaFavorites((s) => s.toggle);
  const favSet = useMemo(() => new Set(favIds), [favIds]);

  // View States
  const [currentCategory, setCurrentCategory] = useState<CategoryFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Navigation History
  const [history, setHistory] = useState<(string | null)[]>([null]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Inspector & Context Menu State
  const [inspectedItem, setInspectedItem] = useState<LibraryItem | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: LibraryItem } | null>(null);

  // Dialog States
  const [showSongImport, setShowSongImport] = useState(false);
  const [showBibleImport, setShowBibleImport] = useState(false);
  const [showTextImport, setShowTextImport] = useState(false);
  const [renameTarget, setRenameTarget] = useState<LibraryItem | null>(null);

  // Custom Items (Songs, Bible Verses, Texts imported into Library)
  const [customItems, setCustomItems] = useState<LibraryItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("vision_library_custom_items_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("vision_library_custom_items_v1", JSON.stringify(customItems));
    } catch {}
  }, [customItems]);

  useEffect(() => {
    if (!loaded) void refreshAll();
  }, [loaded, refreshAll]);

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

  // Category & Search Filtering
  const filteredItems = useMemo(() => {
    let out = allLibraryItems;

    // Folder Scope
    if (currentFolderId !== null) {
      out = out.filter((item) => item.folderId === currentFolderId);
    }

    // Category Filter
    if (currentCategory === "songs") out = out.filter((i) => i.type === "song");
    else if (currentCategory === "bible") out = out.filter((i) => i.type === "bible");
    else if (currentCategory === "media") out = out.filter((i) => i.type === "image" || i.type === "video");
    else if (currentCategory === "images") out = out.filter((i) => i.type === "image");
    else if (currentCategory === "videos") out = out.filter((i) => i.type === "video");
    else if (currentCategory === "announcements") out = out.filter((i) => i.type === "text");
    else if (currentCategory === "favorites") out = out.filter((i) => i.isFavorite);

    // Search Query Filter
    const q = search.trim().toLowerCase();
    if (q) {
      out = out.filter((i) => i.name.toLowerCase().includes(q));
    }

    // Sort Order
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
        translation: item.bibleData.translation as any,
        book: item.bibleData.book,
        chapter: item.bibleData.chapter,
        verse: item.bibleData.verse,
      });
      toast.success(`Projecting Verse: ${item.name}`);
    }
  }, []);

  const handleItemDoubleClick = useCallback(
    (e: React.MouseEvent, item: LibraryItem) => {
      void projectItem(item);
    },
    [projectItem],
  );

  const handleContextMenu = useCallback((e: React.MouseEvent, item: LibraryItem) => {
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
    toast.success(`Imported Song: ${song.title}`);
  };

  const handleImportBible = (verse: { book: number; bookName: string; chapter: number; verse: number; text: string }) => {
    const newItem: LibraryItem = {
      id: `bible-${verse.book}-${verse.chapter}-${verse.verse}-${Date.now()}`,
      name: `${verse.bookName} ${verse.chapter}:${verse.verse}`,
      type: "bible",
      folderId: currentFolderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      bibleData: { ...verse, translation: "KJV" },
    };
    setCustomItems((prev) => [newItem, ...prev]);
    toast.success(`Imported Bible Verse: ${newItem.name}`);
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
    toast.success(`Created Text: ${title}`);
  };

  const handleCreateFolder = async (parentId: string | null = currentFolderId) => {
    const folder = await createFolder("New Folder", parentId);
    await refreshFolders();
    toast.success(`Created Folder: ${folder.name}`);
  };

  const handleDeleteItem = async (items: LibraryItem[]) => {
    const mediaIds = items.filter((i) => i.mediaRecord).map((i) => i.id);
    const customIds = new Set(items.filter((i) => !i.mediaRecord).map((i) => i.id));

    if (mediaIds.length) {
      await deleteMedia(mediaIds);
      await refreshMedia();
    }

    if (customIds.size) {
      setCustomItems((prev) => prev.filter((i) => !customIds.has(i.id)));
    }
    toast.success(`Deleted ${items.length} item(s)`);
  };

  const selectedItems = useMemo(() => {
    return filteredItems.filter((i) => selection.has(i.id));
  }, [filteredItems, selection]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Top Toolbar */}
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
        onNewFolder={() => void handleCreateFolder()}
        onImportClick={() => setShowSongImport(true)}
      />

      {/* 3-Pane Explorer Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Pane 1: Left Navigation Sidebar */}
        <div className="w-56 shrink-0 border-r border-border">
          <LibraryTreeNav
            currentCategory={currentCategory}
            currentFolderId={currentFolderId}
            folders={folders}
            categoryCounts={categoryCounts}
            folderCounts={folderCounts}
            onSelectCategory={setCurrentCategory}
            onSelectFolder={navigateToFolder}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={(f) => {
              const name = prompt("Rename folder:", f.name);
              if (name && name !== f.name) {
                renameFolder(f.id, name).then(refreshFolders);
              }
            }}
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

        {/* Pane 2: Center File Explorer Grid */}
        <LibraryExplorerGrid
          items={filteredItems}
          selection={selection}
          viewMode={viewMode}
          zoomLevel={zoomLevel}
          onItemClick={handleItemClick}
          onItemDoubleClick={handleItemDoubleClick}
          onContextMenu={handleContextMenu}
          onToggleFavorite={(item) => {
            if (item.mediaRecord) toggleFav(item.id);
          }}
        />

        {/* Pane 3: Right Inspector / Live Preview Pane */}
        <LibraryPreviewPane
          item={inspectedItem}
          onClose={() => setInspectedItem(null)}
          onProject={projectItem}
        />
      </div>

      {/* Status Bar Footer */}
      <footer className="flex h-6 items-center justify-between border-t border-border px-3 text-[11px] text-muted-foreground bg-muted/20">
        <div>
          <span>{filteredItems.length} items</span>
          {selection.size > 0 && <span className="ml-3 font-medium text-foreground">{selection.size} selected</span>}
        </div>
        <div className="flex items-center gap-3">
          <span>Church Content Library</span>
          <span>·</span>
          <span>Vision Projector v2.0</span>
        </div>
      </footer>

      {/* Floating Action Button */}
      <FloatingActionButton
        onNewFolder={() => void handleCreateFolder()}
        onImportSong={() => setShowSongImport(true)}
        onImportBible={() => setShowBibleImport(true)}
        onImportMedia={() => {
          // Open system file import
          const el = document.createElement("input");
          el.type = "file";
          el.multiple = true;
          el.onchange = async () => {
            if (el.files && el.files.length) {
              const { importFiles } = await import("@/db/repo");
              await importFiles(Array.from(el.files), currentFolderId);
              await refreshMedia();
              toast.success(`Imported ${el.files.length} file(s)`);
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
          selectedItems={selectedItems.length ? selectedItems : [contextMenu.item]}
          onClose={() => setContextMenu(null)}
          onOpen={projectItem}
          onPreview={setInspectedItem}
          onProject={projectItem}
          onRename={setRenameTarget}
          onDuplicate={(items) => {
            const mediaIds = items.filter((i) => i.mediaRecord).map((i) => i.id);
            if (mediaIds.length) {
              duplicateMedia(mediaIds).then(refreshMedia);
            }
          }}
          onMove={() => {}}
          onCopy={() => {}}
          onCut={() => {}}
          onPaste={() => {}}
          onDelete={handleDeleteItem}
          onToggleFavorite={(item) => {
            if (item.mediaRecord) toggleFav(item.id);
          }}
          onShowProperties={setInspectedItem}
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

      {/* Rename Dialog */}
      {renameTarget && (
        <RenameDialog
          open={!!renameTarget}
          initialName={renameTarget.name}
          title="Item"
          onCancel={() => setRenameTarget(null)}
          onSubmit={async (name) => {
            if (renameTarget.mediaRecord) {
              await renameMedia(renameTarget.id, name);
              await refreshMedia();
            } else {
              setCustomItems((prev) =>
                prev.map((i) => (i.id === renameTarget.id ? { ...i, name } : i)),
              );
            }
            setRenameTarget(null);
            toast.success("Renamed");
          }}
        />
      )}
    </div>
  );
}
