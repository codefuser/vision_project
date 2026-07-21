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
}

export function LibraryBreadcrumb({
  currentCategory,
  currentFolderId,
  folders,
  onSelectCategory,
  onSelectFolder,
}: LibraryBreadcrumbProps) {
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
        className="flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 transition hover:bg-accent hover:text-foreground"
        title="Go to Home Root"
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
            }`}
          >
            <Folder className="h-3.5 w-3.5 text-amber-400" />
            <span className="truncate max-w-[120px]">{folder.name}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
