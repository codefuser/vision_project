import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Home,
  Music,
  BookOpen,
  Image as ImageIcon,
  Video as VideoIcon,
  Megaphone,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import type { FolderRecord } from "@/db/schema";
import type { CategoryFilter } from "./types";
import { cn } from "@/lib/utils";

interface LibraryTreeNavProps {
  currentCategory: CategoryFilter;
  currentFolderId: string | null;
  folders: FolderRecord[];
  categoryCounts: Record<CategoryFilter, number>;
  folderCounts: Record<string, number>;
  onSelectCategory: (cat: CategoryFilter) => void;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (parentId?: string | null) => void;
  onRenameFolder: (folder: FolderRecord) => void;
  onDeleteFolder: (folder: FolderRecord) => void;
  onDropItemToFolder: (itemId: string, targetFolderId: string | null) => void;
}

export function LibraryTreeNav({
  currentCategory,
  currentFolderId,
  folders,
  categoryCounts,
  folderCounts,
  onSelectCategory,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onDropItemToFolder,
}: LibraryTreeNavProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Build parent-child tree mapping
  const rootFolders = folders.filter((f) => !f.parentId);
  const folderChildrenMap = new Map<string, FolderRecord[]>();
  for (const f of folders) {
    if (f.parentId) {
      const list = folderChildrenMap.get(f.parentId) || [];
      list.push(f);
      folderChildrenMap.set(f.parentId, list);
    }
  }

  const renderFolderNode = (folder: FolderRecord, depth = 0) => {
    const children = folderChildrenMap.get(folder.id) || [];
    const hasChildren = children.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = currentFolderId === folder.id;
    const isDragOver = dragOverFolderId === folder.id;
    const count = folderCounts[folder.id] || 0;

    return (
      <div key={folder.id} className="flex flex-col">
        <div
          onClick={() => {
            onSelectFolder(folder.id);
            onSelectCategory("all");
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverFolderId(folder.id);
          }}
          onDragLeave={() => setDragOverFolderId(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverFolderId(null);
            const itemId = e.dataTransfer.getData("text/plain");
            if (itemId) onDropItemToFolder(itemId, folder.id);
          }}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={cn(
            "group flex h-7 cursor-pointer items-center justify-between pr-2 text-xs transition rounded-md my-0.5 select-none",
            isDragOver ? "bg-amber-400/20 border border-amber-400 ring-1 ring-amber-400" : "",
            isSelected
              ? "bg-primary text-primary-foreground font-medium shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            {/* Display disclosure arrow ONLY if folder has children */}
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(folder.id, e)}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded hover:bg-muted/50 transition"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            ) : (
              <span className="w-4 shrink-0" />
            )}

            {isExpanded ? (
              <FolderOpen className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            ) : (
              <Folder className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            )}
            <span className="truncate">{folder.name}</span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-[10px] tabular-nums px-1.5 py-0.2 rounded-full",
                isSelected
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {count}
            </span>
            <div className="hidden group-hover:flex items-center gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRenameFolder(folder);
                }}
                className="h-4 w-4 flex items-center justify-center rounded hover:bg-background/80"
                title="Rename (F2)"
              >
                <Pencil className="h-2.5 w-2.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(folder);
                }}
                className="h-4 w-4 flex items-center justify-center rounded hover:bg-destructive/20 text-destructive"
                title="Delete"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="flex flex-col">
            {children.map((child) => renderFolderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-card/40 p-2 border-r border-border select-none">
      {/* Home Root */}
      <button
        onClick={() => {
          onSelectCategory("all");
          onSelectFolder(null);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOverFolderId("root");
        }}
        onDragLeave={() => setDragOverFolderId(null)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverFolderId(null);
          const itemId = e.dataTransfer.getData("text/plain");
          if (itemId) onDropItemToFolder(itemId, null);
        }}
        className={cn(
          "flex h-8 cursor-pointer items-center justify-between rounded-md px-2.5 text-xs transition mb-2 font-semibold",
          dragOverFolderId === "root" ? "bg-amber-400/20 border border-amber-400 ring-1 ring-amber-400" : "",
          currentCategory === "all" && currentFolderId === null
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground hover:bg-accent",
        )}
      >
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          <span>Home</span>
        </div>
        <span className="text-[10px] tabular-nums font-mono opacity-80">
          {categoryCounts.all}
        </span>
      </button>

      {/* Categories */}
      <div className="mb-3 flex flex-col border-t border-border/50 pt-2">
        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
          File Categories
        </span>
        <button
          onClick={() => {
            onSelectCategory("songs");
            onSelectFolder(null);
          }}
          className={cn(
            "flex h-7 cursor-pointer items-center justify-between rounded-md px-2 text-xs transition my-0.5",
            currentCategory === "songs" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            <Music className="h-3.5 w-3.5 text-purple-400" />
            <span>Songs</span>
          </div>
          <span className="text-[10px] tabular-nums">{categoryCounts.songs}</span>
        </button>

        <button
          onClick={() => {
            onSelectCategory("bible");
            onSelectFolder(null);
          }}
          className={cn(
            "flex h-7 cursor-pointer items-center justify-between rounded-md px-2 text-xs transition my-0.5",
            currentCategory === "bible" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
            <span>Bible Verses</span>
          </div>
          <span className="text-[10px] tabular-nums">{categoryCounts.bible}</span>
        </button>

        <button
          onClick={() => {
            onSelectCategory("images");
            onSelectFolder(null);
          }}
          className={cn(
            "flex h-7 cursor-pointer items-center justify-between rounded-md px-2 text-xs transition my-0.5",
            currentCategory === "images" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="h-3.5 w-3.5 text-green-400" />
            <span>Images</span>
          </div>
          <span className="text-[10px] tabular-nums">{categoryCounts.images}</span>
        </button>

        <button
          onClick={() => {
            onSelectCategory("videos");
            onSelectFolder(null);
          }}
          className={cn(
            "flex h-7 cursor-pointer items-center justify-between rounded-md px-2 text-xs transition my-0.5",
            currentCategory === "videos" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            <VideoIcon className="h-3.5 w-3.5 text-rose-400" />
            <span>Videos</span>
          </div>
          <span className="text-[10px] tabular-nums">{categoryCounts.videos}</span>
        </button>

        <button
          onClick={() => {
            onSelectCategory("announcements");
            onSelectFolder(null);
          }}
          className={cn(
            "flex h-7 cursor-pointer items-center justify-between rounded-md px-2 text-xs transition my-0.5",
            currentCategory === "announcements" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            <Megaphone className="h-3.5 w-3.5 text-amber-400" />
            <span>Announcements</span>
          </div>
          <span className="text-[10px] tabular-nums">{categoryCounts.announcements}</span>
        </button>
      </div>

      {/* Folders Tree Section */}
      <div className="flex flex-col border-t border-border/60 pt-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Folders Tree
          </span>
          <button
            onClick={() => onCreateFolder(currentFolderId)}
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded hover:bg-accent text-muted-foreground hover:text-foreground"
            title="Create Folder"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-col mt-1">
          {rootFolders.length === 0 ? (
            <p className="px-2 py-2 text-[11px] text-muted-foreground/60 italic">
              No custom folders created.
            </p>
          ) : (
            rootFolders.map((f) => renderFolderNode(f, 0))
          )}
        </div>
      </div>
    </aside>
  );
}
