import React, { useEffect, useRef } from "react";
import {
  Play,
  Eye,
  Pencil,
  Copy,
  Scissors,
  Clipboard,
  Layers,
  Trash2,
  Star,
  Info,
  FolderPlus,
  RotateCw,
  CheckSquare,
  FolderOpen,
  ExternalLink,
  FolderInput,
} from "lucide-react";
import type { LibraryItem } from "./types";

interface LibraryContextMenuProps {
  x: number;
  y: number;
  selectedItems: LibraryItem[];
  isCanvasBackground?: boolean;
  onClose: () => void;
  onOpen: (item: LibraryItem) => void;
  onPreview: (item: LibraryItem) => void;
  onProject: (item: LibraryItem) => void;
  onRename: (item: LibraryItem) => void;
  onDuplicate: (items: LibraryItem[]) => void;
  onMove: (items: LibraryItem[]) => void;
  onCopy: (items: LibraryItem[]) => void;
  onCut: (items: LibraryItem[]) => void;
  onPaste: () => void;
  onDelete: (items: LibraryItem[]) => void;
  onToggleFavorite: (item: LibraryItem) => void;
  onShowProperties: (item: LibraryItem) => void;
  onNewFolder?: () => void;
  onRefresh?: () => void;
  onSelectAll?: () => void;
}

export function LibraryContextMenu({
  x,
  y,
  selectedItems,
  isCanvasBackground,
  onClose,
  onOpen,
  onPreview,
  onProject,
  onRename,
  onDuplicate,
  onMove,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onToggleFavorite,
  onShowProperties,
  onNewFolder,
  onRefresh,
  onSelectAll,
}: LibraryContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const targetItem = selectedItems[0];
  const isFolderTarget = targetItem?.type === "folder" || !!targetItem?.folderRecord;

  // Adjust coordinates so menu stays inside viewport
  const adjustedX = Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 1000) - 220);
  const adjustedY = Math.min(y, (typeof window !== "undefined" ? window.innerHeight : 800) - 360);

  // Background Canvas Context Menu
  if (isCanvasBackground || !targetItem) {
    return (
      <div
        ref={menuRef}
        style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
        className="fixed z-50 w-52 overflow-hidden rounded-lg border border-border bg-popover/95 p-1 text-xs text-popover-foreground shadow-2xl backdrop-blur select-none"
      >
        <button
          onClick={() => {
            onPaste();
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <Clipboard className="h-3.5 w-3.5" />
          <span>Paste (Ctrl+V)</span>
        </button>

        <div className="my-1 h-px bg-border/60" />

        <button
          onClick={() => {
            onNewFolder?.();
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <FolderPlus className="h-3.5 w-3.5 text-amber-400" />
          <span>New Folder</span>
        </button>

        <button
          onClick={() => {
            onRefresh?.();
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <RotateCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>

        <div className="my-1 h-px bg-border/60" />

        <button
          onClick={() => {
            onSelectAll?.();
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <CheckSquare className="h-3.5 w-3.5" />
          <span>Select All (Ctrl+A)</span>
        </button>
      </div>
    );
  }

  // Folder Specific Desktop Context Menu
  if (isFolderTarget) {
    return (
      <div
        ref={menuRef}
        style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
        className="fixed z-50 w-52 overflow-hidden rounded-lg border border-border bg-popover/95 p-1 text-xs text-popover-foreground shadow-2xl backdrop-blur select-none"
      >
        <button
          onClick={() => {
            onOpen(targetItem);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 font-semibold hover:bg-accent"
        >
          <FolderOpen className="h-3.5 w-3.5 text-amber-400" />
          <span>Open</span>
        </button>

        <button
          onClick={() => {
            onOpen(targetItem);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Open in New Tab</span>
        </button>

        <div className="my-1 h-px bg-border/60" />

        <button
          onClick={() => {
            onRename(targetItem);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>Rename (F2)</span>
        </button>

        <button
          onClick={() => {
            onCopy(selectedItems);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Copy (Ctrl+C)</span>
        </button>

        <button
          onClick={() => {
            onCut(selectedItems);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <Scissors className="h-3.5 w-3.5" />
          <span>Cut (Ctrl+X)</span>
        </button>

        <button
          onClick={() => {
            onPaste();
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <Clipboard className="h-3.5 w-3.5" />
          <span>Paste (Ctrl+V)</span>
        </button>

        <button
          onClick={() => {
            onDuplicate(selectedItems);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Duplicate</span>
        </button>

        <button
          onClick={() => {
            onMove(selectedItems);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <FolderInput className="h-3.5 w-3.5" />
          <span>Move</span>
        </button>

        <div className="my-1 h-px bg-border/60" />

        <button
          onClick={() => {
            onDelete(selectedItems);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>

        <div className="my-1 h-px bg-border/60" />

        <button
          onClick={() => {
            onShowProperties(targetItem);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent text-muted-foreground"
        >
          <Info className="h-3.5 w-3.5" />
          <span>Properties</span>
        </button>
      </div>
    );
  }

  // Files Desktop Context Menu
  return (
    <div
      ref={menuRef}
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
      className="fixed z-50 w-52 overflow-hidden rounded-lg border border-border bg-popover/95 p-1 text-xs text-popover-foreground shadow-2xl backdrop-blur select-none"
    >
      <button
        onClick={() => {
          onProject(targetItem);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 font-semibold text-primary hover:bg-primary/10"
      >
        <Play className="h-3.5 w-3.5 fill-current" />
        <span>Project to Screen</span>
      </button>

      <button
        onClick={() => {
          onPreview(targetItem);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
      >
        <Eye className="h-3.5 w-3.5" />
        <span>Preview</span>
      </button>

      <div className="my-1 h-px bg-border/60" />

      <button
        onClick={() => {
          onRename(targetItem);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
      >
        <Pencil className="h-3.5 w-3.5" />
        <span>Rename (F2)</span>
      </button>

      <button
        onClick={() => {
          onMove(selectedItems);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
      >
        <FolderInput className="h-3.5 w-3.5" />
        <span>Move</span>
      </button>

      <button
        onClick={() => {
          onCopy(selectedItems);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
      >
        <Copy className="h-3.5 w-3.5" />
        <span>Copy (Ctrl+C)</span>
      </button>

      <button
        onClick={() => {
          onCut(selectedItems);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
      >
        <Scissors className="h-3.5 w-3.5" />
        <span>Cut (Ctrl+X)</span>
      </button>

      <button
        onClick={() => {
          onDelete(selectedItems);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Delete (Del)</span>
      </button>

      <div className="my-1 h-px bg-border/60" />

      <button
        onClick={() => {
          onToggleFavorite(targetItem);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
      >
        <Star className="h-3.5 w-3.5 text-amber-400" />
        <span>{targetItem.isFavorite ? "Unfavorite" : "Add to Favorites"}</span>
      </button>

      <button
        onClick={() => {
          onDuplicate(selectedItems);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
      >
        <Layers className="h-3.5 w-3.5" />
        <span>Duplicate</span>
      </button>

      <div className="my-1 h-px bg-border/60" />

      <button
        onClick={() => {
          onShowProperties(targetItem);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent text-muted-foreground"
      >
        <Info className="h-3.5 w-3.5" />
        <span>Properties</span>
      </button>
    </div>
  );
}
