import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Music,
  BookOpen,
  Image as ImageIcon,
  Video as VideoIcon,
  Megaphone,
  Presentation,
  ListMusic,
  Star,
  Clock,
  Trash2,
  Plus,
  MoreVertical,
  Pencil,
  Copy,
  Layers,
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

const SYSTEM_CATEGORIES: { id: CategoryFilter; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "All Content", icon: Layers },
  { id: "songs", label: "Songs", icon: Music },
  { id: "bible", label: "Bible Verses", icon: BookOpen },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: VideoIcon },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "presentations", label: "Presentations", icon: Presentation },
  { id: "playlists", label: "Playlists", icon: ListMusic },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "recent", label: "Recently Used", icon: Clock },
  { id: "trash", label: "Trash", icon: Trash2 },
];

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

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Build tree from flat folder list (root folders have parentId === null)
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
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = currentFolderId === folder.id;
    const count = folderCounts[folder.id] || 0;

    return (
      <div key={folder.id} className="flex flex-col">
        <div
          onClick={() => onSelectFolder(folder.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const itemId = e.dataTransfer.getData("text/plain");
            if (itemId) onDropItemToFolder(itemId, folder.id);
          }}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          className={cn(
            "group flex h-7 cursor-pointer items-center justify-between pr-2 text-xs transition rounded-md my-0.5",
            isSelected ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            {children.length > 0 ? (
              <button
                onClick={(e) => toggleExpand(folder.id, e)}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded hover:bg-muted/50"
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
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
            <span className={cn("text-[10px] tabular-nums px-1 rounded-full", isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {count}
            </span>
            <div className="hidden group-hover:flex items-center gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRenameFolder(folder);
                }}
                className="h-4 w-4 flex items-center justify-center rounded hover:bg-background/80"
                title="Rename folder"
              >
                <Pencil className="h-2.5 w-2.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(folder);
                }}
                className="h-4 w-4 flex items-center justify-center rounded hover:bg-destructive/20 text-destructive"
                title="Delete folder"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
        </div>

        {isExpanded && children.length > 0 && (
          <div className="flex flex-col">
            {children.map((child) => renderFolderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-card/40 p-2 border-r border-border select-none">
      {/* System Categories Section */}
      <div className="mb-3 flex flex-col">
        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
          Library Categories
        </span>
        {SYSTEM_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = currentCategory === cat.id && currentFolderId === null;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onSelectFolder(null);
              }}
              className={cn(
                "flex h-8 cursor-pointer items-center justify-between rounded-md px-2.5 text-xs transition my-0.5",
                isSelected ? "bg-primary text-primary-foreground font-medium shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", isSelected ? "text-primary-foreground" : "text-primary/70")} />
                <span>{cat.label}</span>
              </div>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] tabular-nums font-mono",
                  isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom User Folders Section */}
      <div className="flex flex-col border-t border-border/60 pt-3">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Custom Folders
          </span>
          <button
            onClick={() => onCreateFolder(null)}
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded hover:bg-accent text-muted-foreground hover:text-foreground"
            title="Create Root Folder"
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
