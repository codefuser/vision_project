import React, { useEffect, useRef } from "react";
import {
  Play,
  Eye,
  Pencil,
  Copy,
  FolderInput,
  Trash2,
  Star,
  Info,
  ExternalLink,
  Scissors,
  Clipboard,
} from "lucide-react";
import type { LibraryItem } from "./types";

interface LibraryContextMenuProps {
  x: number;
  y: number;
  selectedItems: LibraryItem[];
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
}

export function LibraryContextMenu({
  x,
  y,
  selectedItems,
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
}: LibraryContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!selectedItems.length) return null;
  const single = selectedItems.length === 1 ? selectedItems[0] : null;

  return (
    <div
      ref={menuRef}
      style={{ top: `${y}px`, left: `${x}px` }}
      className="fixed z-50 min-w-[180px] rounded-lg border border-border bg-popover/95 p-1 text-xs shadow-xl backdrop-blur select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {single && (
        <>
          <button
            onClick={() => {
              onProject(single);
              onClose();
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 font-medium text-primary hover:bg-primary/10"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Project Now</span>
          </button>
          <button
            onClick={() => {
              onPreview(single);
              onClose();
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Open in Preview</span>
          </button>
          <div className="my-1 border-t border-border/50" />
        </>
      )}

      {single && (
        <button
          onClick={() => {
            onRename(single);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Rename</span>
        </button>
      )}

      <button
        onClick={() => {
          onDuplicate(selectedItems);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
      >
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Duplicate</span>
      </button>

      <button
        onClick={() => {
          onMove(selectedItems);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
      >
        <FolderInput className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Move to Folder…</span>
      </button>

      <div className="my-1 border-t border-border/50" />

      {single && (
        <button
          onClick={() => {
            onToggleFavorite(single);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <Star className="h-3.5 w-3.5 text-amber-400" />
          <span>{single.isFavorite ? "Remove Favorite" : "Add to Favorites"}</span>
        </button>
      )}

      {single && (
        <button
          onClick={() => {
            onShowProperties(single);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
        >
          <Info className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Properties</span>
        </button>
      )}

      <div className="my-1 border-t border-border/50" />

      <button
        onClick={() => {
          onDelete(selectedItems);
          onClose();
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Delete ({selectedItems.length})</span>
      </button>
    </div>
  );
}
