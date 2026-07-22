import React from "react";
import { ChevronRight, Folder, Home } from "lucide-react";
import type { FolderRecord } from "@/db/schema";
import type { CategoryFilter } from "./types";

interface LibraryBreadcrumbProps {
  currentCategory: CategoryFilter;
  currentFolderId: string | null;
  folders: FolderRecord[];
  onSelectCategory: (cat: CategoryFilter) => void;
  onSelectFolder: (folderId: string | null) => void;
  onDropItemsToFolder?: (itemIds: string[], targetFolderId: string | null) => void;
}

export function LibraryBreadcrumb({
  currentCategory,
  currentFolderId,
  folders,
  onSelectCategory,
  onSelectFolder,
  onDropItemsToFolder,
}: LibraryBreadcrumbProps) {
  const [dragOverFolderId, setDragOverFolderId] = React.useState<string | null>(null);
  const [dragOverRoot, setDragOverRoot] = React.useState(false);

  const handleDrop = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    setDragOverFolderId(null);
    setDragOverRoot(false);
    if (!onDropItemsToFolder) return;
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      const itemIds: string[] = dataStr ? JSON.parse(dataStr) : [e.dataTransfer.getData("text/plain")];
      if (itemIds.length) {
        onDropItemsToFolder(itemIds, folderId);
      }
    } catch {
      const singleId = e.dataTransfer.getData("text/plain");
      if (singleId) onDropItemsToFolder([singleId], folderId);
    }
  };

  const ancestors: FolderRecord[] = [];
  if (currentFolderId) {
    let curr: FolderRecord | undefined = folders.find((f) => f.id === currentFolderId);
    const seen = new Set<string>();
    while (curr && !seen.has(curr.id)) {
      seen.add(curr.id);
      ancestors.unshift(curr);
      curr = curr.parentId ? folders.find((f) => f.id === curr!.parentId) : undefined;
    }
  }

  return (
    <nav className="flex items-center gap-1 overflow-x-auto py-1 text-xs text-muted-foreground select-none">
      <button
        onClick={() => {
          onSelectCategory("all");
          onSelectFolder(null);
        }}
        className={`flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 transition hover:bg-accent hover:text-foreground ${dragOverRoot ? "bg-amber-400/20 ring-1 ring-amber-400 text-foreground" : ""}`}
        title="Go to Home Root"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOverRoot(true);
        }}
        onDragLeave={() => setDragOverRoot(false)}
        onDrop={(e) => handleDrop(e, null)}
      >
        <Home className="h-3.5 w-3.5 text-primary" />
        <span className="font-semibold text-foreground">Home</span>
      </button>

      {ancestors.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
          <button
            onClick={() => onSelectFolder(folder.id)}
            className={`flex cursor-pointer items-center gap-1 rounded px-1.5 py-1 transition hover:bg-accent hover:text-foreground ${
              index === ancestors.length - 1 ? "font-medium text-foreground" : ""
            } ${dragOverFolderId === folder.id ? "bg-amber-400/20 ring-1 ring-amber-400" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverFolderId(folder.id);
            }}
            onDragLeave={() => setDragOverFolderId(null)}
            onDrop={(e) => handleDrop(e, folder.id)}
          >
            <Folder className="h-3.5 w-3.5 text-amber-400" />
            <span className="truncate max-w-[120px]">{folder.name}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
