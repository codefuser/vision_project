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
import { formatBytes } from "@/lib/files";
import { toast } from "sonner";

// Undo Stack Action Types
type UndoAction =
  | { type: "move"; items: LibraryItem[]; previousFolderId: string | null; targetFolderId: string | null }
  | { type: "delete"; items: LibraryItem[] }
  | { type: "rename"; id: string; oldName: string; newName: string }
  | { type: "createFolder"; folderId: string; folderName: string };

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

  // Rigid Resizable Panel Widths
  const [leftWidth, setLeftWidth] = useState(() => {
    if (typeof window === "undefined") return 240;
    return Number(window.localStorage.getItem("lib_left_w")) || 240;
  });
  const [rightWidth, setRightWidth] = useState(() => {
    if (typeof window === "undefined") return 320;
    return Number(window.localStorage.getItem("lib_right_w")) || 320;
  });

  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  // View & Language States
  const [currentCategory, setCurrentCategory] = useState<CategoryFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [bibleLang, setBibleLang] = useState<BibleLang>("en");
  const [searchScope, setSearchScope] = useState<"folder" | "library">("folder");

  // Navigation History
  const [history, setHistory] = useState<(string | null)[]>([null]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Range Selection Tracker
  const lastClickedIndexRef = useRef<number | null>(null);

  // Undo Stack (`Ctrl+Z`)
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [redoStack, setRedoStack] = useState<UndoAction[]>([]);

  const pushUndo = useCallback((action: UndoAction) => {
    setUndoStack((prev) => [...prev.slice(-30), action]);
    setRedoStack([]);
  }, []);

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

  useEffect(() => {
    try {
      window.localStorage.setItem("lib_left_w", String(leftWidth));
      window.localStorage.setItem("lib_right_w", String(rightWidth));
    } catch {}
  }, [leftWidth, rightWidth]);

  // Panel Drag-to-Resize Listeners
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

  const currentSubfolders = useMemo(() => {
    return folders.filter((f) => f.parentId === currentFolderId);
  }, [folders, currentFolderId]);

  const filteredItems = useMemo(() => {
    let out = allLibraryItems;

    if (currentFolderId !== null && searchScope === "folder") {
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
      out = out.filter((i) => {
        if (i.name.toLowerCase().includes(q)) return true;
        if (i.type === "song" && i.songData) {
          return i.songData.slides.some((slide) => slide.toLowerCase().includes(q));
        }
        if (i.type === "bible" && i.bibleData) {
          if (i.bibleData.text && i.bibleData.text.toLowerCase().includes(q)) return true;
          // also search book name
          if (i.bibleData.bookName.toLowerCase().includes(q)) return true;
        }
        if (i.type === "text" && i.textData) {
          return i.textData.content.toLowerCase().includes(q);
        }
        return false;
      });
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

  const totalFolderSizeBytes = useMemo(() => {
    return filteredItems.reduce((acc, item) => acc + (item.size || 0), 0);
  }, [filteredItems]);

  // Execute Undo (`Ctrl+Z`)
  const handleUndo = useCallback(async () => {
    if (undoStack.length === 0) {
      toast.info("Nothing to undo.");
      return;
    }

    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, lastAction]);

    if (lastAction.type === "move") {
      const mediaIds = lastAction.items.filter((i) => i.mediaRecord).map((i) => i.id);
      if (mediaIds.length) {
        await moveMedia(mediaIds, lastAction.previousFolderId);
        await refreshMedia();
      }
      setCustomItems((prev) =>
        prev.map((i) =>
          lastAction.items.some((c) => c.id === i.id) ? { ...i, folderId: lastAction.previousFolderId } : i,
        ),
      );
      toast.success(`Undid Move: Restored ${lastAction.items.length} item(s)`);
    } else if (lastAction.type === "delete") {
      const customRestores = lastAction.items.filter((i) => !i.mediaRecord);
      if (customRestores.length) {
        setCustomItems((prev) => [...customRestores, ...prev]);
      }
      toast.success(`Undid Delete: Restored ${lastAction.items.length} item(s)`);
    } else if (lastAction.type === "rename") {
      const folderTarget = folders.find((f) => f.id === lastAction.id);
      if (folderTarget) {
        await renameFolder(lastAction.id, lastAction.oldName);
        await refreshFolders();
      } else {
        await renameMedia(lastAction.id, lastAction.oldName);
        await refreshMedia();
        setCustomItems((prev) =>
          prev.map((i) => (i.id === lastAction.id ? { ...i, name: lastAction.oldName } : i)),
        );
      }
      toast.success(`Undid Rename: Restored "${lastAction.oldName}"`);
    } else if (lastAction.type === "createFolder") {
      await deleteFolderDeep(lastAction.folderId);
      await refreshFolders();
      toast.success(`Undid Folder Creation: Removed "${lastAction.folderName}"`);
    }
  }, [undoStack, folders, refreshMedia, refreshFolders]);

  // Execute Redo (`Ctrl+Y`)
  const handleRedo = useCallback(async () => {
    if (redoStack.length === 0) {
      toast.info("Nothing to redo.");
      return;
    }

    const lastAction = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, lastAction]);

    if (lastAction.type === "move") {
      const mediaIds = lastAction.items.filter((i) => i.mediaRecord).map((i) => i.id);
      if (mediaIds.length) {
        await moveMedia(mediaIds, lastAction.targetFolderId);
        await refreshMedia();
      }
      setCustomItems((prev) =>
        prev.map((i) =>
          lastAction.items.some((c) => c.id === i.id) ? { ...i, folderId: lastAction.targetFolderId } : i,
        ),
      );
      toast.success(`Redid Move: Moved ${lastAction.items.length} item(s)`);
    } else if (lastAction.type === "delete") {
      const mediaIds = lastAction.items.filter((i) => i.mediaRecord).map((i) => i.id);
      const customIds = new Set(lastAction.items.filter((i) => !i.mediaRecord).map((i) => i.id));
      if (mediaIds.length) {
        await deleteMedia(mediaIds);
        await refreshMedia();
      }
      if (customIds.size) {
        setCustomItems((prev) => prev.filter((i) => !customIds.has(i.id)));
      }
      toast.success(`Redid Delete: Removed ${lastAction.items.length} item(s)`);
    } else if (lastAction.type === "rename") {
      const folderTarget = folders.find((f) => f.id === lastAction.id);
      if (folderTarget) {
        await renameFolder(lastAction.id, lastAction.newName);
        await refreshFolders();
      } else {
        await renameMedia(lastAction.id, lastAction.newName);
        await refreshMedia();
        setCustomItems((prev) =>
          prev.map((i) => (i.id === lastAction.id ? { ...i, name: lastAction.newName } : i)),
        );
      }
      toast.success(`Redid Rename: Renamed to "${lastAction.newName}"`);
    } else if (lastAction.type === "createFolder") {
      await createFolder(lastAction.folderName, currentFolderId);
      await refreshFolders();
      toast.success(`Redid Folder Creation: Created "${lastAction.folderName}"`);
    }
  }, [redoStack, folders, currentFolderId, refreshMedia, refreshFolders]);

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

  const handleCreateFolderSubmit = async (name: string) => {
    setInlineCreatingFolder(false);
    if (!name.trim()) return;
    if (!validateUniqueFolder(name, currentFolderId)) return;
    const folder = await createFolder(name.trim(), currentFolderId);
    await refreshFolders();
    pushUndo({ type: "createFolder", folderId: folder.id, folderName: folder.name });
    toast.success(`Created Folder: ${folder.name} (Ctrl+Z to Undo)`);
  };

  const handleInlineRenameSubmit = async (id: string, newName: string) => {
    setInlineEditingId(null);
    if (!newName.trim()) return;

    const folderTarget = folders.find((f) => f.id === id);
    if (folderTarget) {
      if (folderTarget.name === newName.trim()) return;
      if (!validateUniqueFolder(newName, folderTarget.parentId, folderTarget.id)) return;
      await renameFolder(id, newName.trim());
      await refreshFolders();
      pushUndo({ type: "rename", id, oldName: folderTarget.name, newName: newName.trim() });
      toast.success("Folder renamed (Ctrl+Z to Undo)");
      return;
    }

    const itemTarget = allLibraryItems.find((i) => i.id === id);
    if (itemTarget) {
      if (itemTarget.name === newName.trim()) return;
      if (itemTarget.mediaRecord) {
        await renameMedia(id, newName.trim());
        await refreshMedia();
      } else {
        setCustomItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, name: newName.trim() } : i)),
        );
      }
      pushUndo({ type: "rename", id, oldName: itemTarget.name, newName: newName.trim() });
      toast.success("Item renamed (Ctrl+Z to Undo)");
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Ctrl+Y or Ctrl+Shift+Z: Redo
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault();
        void handleRedo();
        return;
      }

      // Ctrl+Z: Undo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        void handleUndo();
        return;
      }

      const navigableNodes = [...currentSubfolders, ...filteredItems.filter((i) => i.type !== "folder")];

      // Grid Navigation
      const getNextIdx = (key: string, currentIdx: number) => {
        if (key === "ArrowDown" || key === "ArrowRight") return currentIdx < navigableNodes.length - 1 ? currentIdx + 1 : 0;
        if (key === "ArrowUp" || key === "ArrowLeft") return currentIdx > 0 ? currentIdx - 1 : navigableNodes.length - 1;
        if (key === "Home") return 0;
        if (key === "End") return navigableNodes.length - 1;
        if (key === "PageDown") return Math.min(navigableNodes.length - 1, currentIdx + 10);
        if (key === "PageUp") return Math.max(0, currentIdx - 10);
        return -1;
      };

      const currentIdx = navigableNodes.findIndex((n) => selection.has(n.id));
      const nextIdx = getNextIdx(e.key, currentIdx === -1 ? 0 : currentIdx);

      if (nextIdx !== -1 && navigableNodes.length > 0) {
        e.preventDefault();
        const nextNode = navigableNodes[nextIdx];
        const nextId = nextNode.id;
        
        if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
          clearSelection();
          toggleSelect(nextId, false);
        } else {
          toggleSelect(nextId, true);
        }
        
        // Dispatch event for virtualized grid to scroll
        window.dispatchEvent(new CustomEvent("library-scroll-to", { detail: { id: nextId } }));
        
        if ("mediaRecord" in nextNode || "songData" in nextNode || "bibleData" in nextNode || "textData" in nextNode) {
          setInspectedItem(nextNode as LibraryItem);
        } else {
          setInspectedItem(null);
        }
        
        lastClickedIndexRef.current = nextIdx;
        return;
      }

      // Enter: Project / Open Selected Item
      if (e.key === "Enter" && selectedItems.length === 1) {
        e.preventDefault();
        void projectItem(selectedItems[0]);
        return;
      }

      // F2: Inline Rename
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
        pushUndo({ type: "delete", items: selectedItems });
        toast.success(`Deleted ${selectedItems.length} item(s) (Ctrl+Z to Undo)`);
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
        toast.info(`Copied ${selectedItems.length} item(s)`);
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
          pushUndo({
            type: "move",
            items: clipboard.items,
            previousFolderId: clipboard.items[0]?.folderId ?? null,
            targetFolderId: currentFolderId,
          });
          toast.success(`Moved ${clipboard.items.length} item(s) (Ctrl+Z to Undo)`);
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

      if (e.key === "Escape") {
        clearSelection();
        setInlineEditingId(null);
        setInlineCreatingFolder(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItems, filteredItems, clipboard, currentFolderId, handleUndo, pushUndo, toggleSelect, clearSelection, refreshMedia]);

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

  // Click & Selection Handling (Single, Ctrl, Shift)
  const handleItemClick = useCallback(
    (e: React.MouseEvent, item: LibraryItem, index: number) => {
      if (e.shiftKey && lastClickedIndexRef.current !== null) {
        // Shift + Click Range Selection
        const start = Math.min(lastClickedIndexRef.current, index);
        const end = Math.max(lastClickedIndexRef.current, index);
        clearSelection();
        for (let i = start; i <= end; i++) {
          toggleSelect(filteredItems[i].id, true);
        }
      } else {
        toggleSelect(item.id, e.ctrlKey || e.metaKey);
        lastClickedIndexRef.current = index;
      }
      setInspectedItem(item);
    },
    [filteredItems, toggleSelect, clearSelection],
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
      toast.success(`Projecting Passage (${bibleLang.toUpperCase()}): ${item.name}`);
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

  const handleRenameSubmit = useCallback(
    async (id: string, newName: string) => {
      if (!newName.trim() || !id) {
        setInlineEditingId(null);
        return;
      }

      const isFolder = folders.some((f) => f.id === id);
      try {
        if (isFolder) {
          const old = folders.find((f) => f.id === id);
          if (old?.name !== newName.trim()) {
            if (!validateUniqueFolder(newName.trim(), currentFolderId, id)) return;
            await renameFolder(id, newName.trim());
            pushUndo({ type: "rename", id, oldName: old!.name, newName: newName.trim() });
          }
          await refreshFolders();
        } else {
          const old = customItems.find((i) => i.id === id) || allLibraryItems.find((i) => i.id === id);
          if (old?.name !== newName.trim()) {
            await renameMedia(id, newName.trim());
            setCustomItems((prev) => prev.map((i) => (i.id === id ? { ...i, name: newName.trim() } : i)));
            pushUndo({ type: "rename", id, oldName: old!.name, newName: newName.trim() });
          }
          await refreshMedia();
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to rename item");
      } finally {
        setInlineEditingId(null);
      }
    },
    [folders, customItems, allLibraryItems, currentFolderId, validateUniqueFolder, refreshFolders, refreshMedia, pushUndo],
  );

  const handleSelectMultiple = useCallback((ids: string[], append: boolean) => {
    setSelection((prev) => {
      const next = append ? new Set(prev) : new Set<string>();
      ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  // Drop Items to Target Folder Action
  const handleDropItemsToFolder = useCallback(
    async (itemIds: string[], targetFolderId: string | null) => {
      const movedItems = allLibraryItems.filter((i) => itemIds.includes(i.id));
      if (movedItems.length === 0) return;

      const previousFolderId = movedItems[0].folderId;
      const mediaIds = movedItems.filter((i) => i.mediaRecord).map((i) => i.id);

      if (mediaIds.length) {
        await moveMedia(mediaIds, targetFolderId);
        await refreshMedia();
      }

      setCustomItems((prev) =>
        prev.map((i) => (itemIds.includes(i.id) ? { ...i, folderId: targetFolderId } : i)),
      );

      pushUndo({
        type: "move",
        items: movedItems,
        previousFolderId,
        targetFolderId,
      });

      toast.success(`Moved ${movedItems.length} item(s) to folder. (Ctrl+Z to Undo)`);
    },
    [allLibraryItems, pushUndo, refreshMedia],
  );

  // Imports & Actions
  const handleImportSongBatch = (songs: Song[]) => {
    const newItems: LibraryItem[] = songs.map((s, idx) => ({
      id: `song-${s.id}-${Date.now()}-${idx}`,
      name: s.title,
      type: "song",
      folderId: currentFolderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      songData: s,
    }));
    setCustomItems((prev) => [...newItems, ...prev]);
    toast.success(`Imported ${songs.length} Song(s)`);
  };

  const handleImportBible = (verse: {
    book: number;
    bookName: string;
    chapter: number;
    verse: number;
    verseEnd: number;
    text: string;
    lang: BibleLang;
  }) => {
    const rangeStr = verse.verse === verse.verseEnd ? `${verse.verse}` : `${verse.verse}-${verse.verseEnd}`;
    const newItem: LibraryItem = {
      id: `bible-${verse.book}-${verse.chapter}-${verse.verse}-${verse.verseEnd}-${Date.now()}`,
      name: `${verse.bookName} ${verse.chapter}:${rangeStr}`,
      type: "bible",
      folderId: currentFolderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      bibleData: { ...verse, translation: verse.lang },
    };
    setCustomItems((prev) => [newItem, ...prev]);
    toast.success(`Imported Bible Passage: ${newItem.name}`);
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

  const handleDeleteItems = (items: LibraryItem[]) => {
    const mediaIds = items.filter((i) => i.mediaRecord).map((i) => i.id);
    const customIds = new Set(items.filter((i) => !i.mediaRecord).map((i) => i.id));
    if (mediaIds.length) {
      deleteMedia(mediaIds).then(refreshMedia);
    }
    if (customIds.size) {
      setCustomItems((prev) => prev.filter((i) => !customIds.has(i.id)));
    }
    pushUndo({ type: "delete", items });
    toast.success(`Deleted ${items.length} item(s) (Ctrl+Z to Undo)`);
  };

  const handleDuplicateItems = (items: LibraryItem[]) => {
    const mediaIds = items.filter((i) => i.mediaRecord).map((i) => i.id);
    if (mediaIds.length) {
      duplicateMedia(mediaIds).then(refreshMedia);
    }
    toast.success(`Duplicated ${items.length} item(s)`);
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex h-full w-full flex-col overflow-hidden bg-background select-none"
    >
      {/* Top Quick Action Toolbar */}
      <LibraryToolbar
        currentCategory={currentCategory}
        currentFolderId={currentFolderId}
        folders={folders}
        search={search}
        searchScope={searchScope}
        onSearchScopeChange={setSearchScope}
        viewMode={viewMode}
        zoomLevel={zoomLevel}
        sortField={sortField}
        sortOrder={sortOrder}
        selectedCount={selectedItems.length}
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
              toast.success(`Uploaded ${el.files.length} file(s)`);
            }
          };
          el.click();
        }}
        onCutClick={() => {
          if (selectedItems.length) {
            setClipboard({ action: "cut", items: selectedItems });
            toast.info(`Cut ${selectedItems.length} item(s)`);
          }
        }}
        onCopyClick={() => {
          if (selectedItems.length) {
            setClipboard({ action: "copy", items: selectedItems });
            toast.info(`Copy ${selectedItems.length} item(s)`);
          }
        }}
        onPasteClick={() => {
          if (!clipboard) return;
          if (clipboard.action === "cut") {
            handleDropItemsToFolder(clipboard.items.map((i) => i.id), currentFolderId);
            setClipboard(null);
          } else {
            const mediaIds = clipboard.items.filter((i) => i.mediaRecord).map((i) => i.id);
            if (mediaIds.length) {
              duplicateMedia(mediaIds).then(refreshMedia);
            }
            toast.success(`Pasted ${clipboard.items.length} item(s)`);
          }
        }}
        onDuplicateClick={() => handleDuplicateItems(selectedItems)}
        onDeleteClick={() => handleDeleteItems(selectedItems)}
        onDropItemsToFolder={handleDropItemsToFolder}
      />

      {/* Rigid 3-Pane Explorer Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Pane 1: Left Navigation Sidebar */}
        <div style={{ width: `${leftWidth}px` }} className="h-full shrink-0 overflow-hidden border-r border-border">
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
            onDropItemToFolder={(itemId, folderId) => handleDropItemsToFolder([itemId], folderId)}
          />
        </div>

        {/* Left Resize Splitter Handle */}
        <div
          onMouseDown={() => {
            isResizingLeft.current = true;
            document.body.style.cursor = "col-resize";
          }}
          className="w-1 shrink-0 cursor-col-resize hover:bg-primary/50 transition bg-border/40 select-none"
          title="Drag to resize left tree panel"
        />

        {/* Pane 2: Center File Explorer Grid */}
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
          <LibraryExplorerGrid
            items={filteredItems.filter((i) => i.type !== "folder")}
            subfolders={currentSubfolders}
            selection={selection}
            viewMode={viewMode}
            zoomLevel={zoomLevel}
            bibleLang={bibleLang}
            inlineEditingId={inlineEditingId}
            inlineCreatingFolder={inlineCreatingFolder}
            onInlineRenameSubmit={handleRenameSubmit}
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
            onDropItemsToFolder={handleDropItemsToFolder}
            onSelectMultiple={handleSelectMultiple}
            onTriggerRename={setInlineEditingId}
          />
        </div>

        {/* Right Resize Splitter Handle */}
        <div
          onMouseDown={() => {
            isResizingRight.current = true;
            document.body.style.cursor = "col-resize";
          }}
          className="w-1 shrink-0 cursor-col-resize hover:bg-primary/50 transition bg-border/40 select-none"
          title="Drag to resize right inspector panel"
        />

        {/* Pane 3: Right Docked Inspector / Live Preview Pane */}
        <div style={{ width: `${rightWidth}px` }} className="h-full shrink-0 overflow-hidden border-l border-border">
          <LibraryPreviewPane
            item={inspectedItem}
            folders={folders}
            allMedia={allLibraryItems}
            bibleLang={bibleLang}
            onBibleLangChange={setBibleLang}
            onClose={() => setInspectedItem(null)}
            onProject={projectItem}
            onRename={(i) => setInlineEditingId(i.id)}
            onDelete={handleDeleteItems}
            onDuplicate={handleDuplicateItems}
          />
        </div>
      </div>

      {/* Status Bar Footer */}
      <footer className="flex h-6 items-center justify-between border-t border-border px-3 text-[11px] text-muted-foreground bg-muted/20 select-none">
        <div className="flex items-center gap-3">
          <span>{filteredItems.length} items</span>
          <span>·</span>
          <span>{currentSubfolders.length} folders</span>
          <span>·</span>
          <span>{formatBytes(totalFolderSizeBytes)}</span>
          {selection.size > 0 && <span className="ml-3 font-semibold text-foreground">{selection.size} selected</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Local Cache Synced
          </span>
          <span>·</span>
          <span>Digital Asset Manager (DAM)</span>
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
          onDuplicate={handleDuplicateItems}
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
              handleDropItemsToFolder(clipboard.items.map((i) => i.id), currentFolderId);
              setClipboard(null);
            } else {
              const mediaIds = clipboard.items.filter((i) => i.mediaRecord).map((i) => i.id);
              if (mediaIds.length) {
                duplicateMedia(mediaIds).then(refreshMedia);
              }
              toast.success(`Pasted ${clipboard.items.length} item(s)`);
            }
          }}
          onDelete={handleDeleteItems}
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
        onImportBatch={handleImportSongBatch}
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
