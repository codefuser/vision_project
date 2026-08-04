import React from "react";
import { ChevronRight, Folder, Home, X } from "lucide-react";
import type { FolderRecord } from "@/db/schema";
import type { CategoryFilter } from "./types";
import { ShortcutTooltip } from "@/components/ShortcutTooltip";

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
      <ShortcutTooltip label="Go to Home Root">
        <button
          onClick={() => {
            onSelectCategory("all");
            onSelectFolder(null);
          }}
          className={`flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 transition hover:bg-accent hover:text-foreground ${dragOverRoot ? "bg-amber-400/20 ring-1 ring-amber-400 text-foreground" : ""}`}
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
      </ShortcutTooltip>

      {ancestors.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
          <ShortcutTooltip label={`Folder: ${folder.name}`}>
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
          </ShortcutTooltip>
        </React.Fragment>
      ))}

      {currentCategory !== "all" && (
        <>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold text-[11px] border border-blue-500/30 shrink-0">
            <span>Filter: {currentCategory.toUpperCase()}</span>
            <ShortcutTooltip label="Clear Category Filter">
              <button
                onClick={() => onSelectCategory("all")}
                className="ml-1 cursor-pointer rounded-full p-0.5 hover:bg-blue-500/30 transition text-blue-600 dark:text-blue-300"
              >
                <X className="h-3 w-3" />
              </button>
            </ShortcutTooltip>
          </span>
        </>
      )}
    </nav>
  );
}
