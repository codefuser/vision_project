import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCw,
  Search,
  FolderPlus,
  SlidersHorizontal,
  Grid,
  List,
  LayoutGrid,
  ZoomIn,
  ZoomOut,
  Upload,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Layers,
} from "lucide-react";
import { LibraryBreadcrumb } from "./LibraryBreadcrumb";
import type { CategoryFilter, SortField, SortOrder, ViewMode } from "./types";
import type { FolderRecord } from "@/db/schema";
import { cn } from "@/lib/utils";

interface LibraryToolbarProps {
  currentCategory: CategoryFilter;
  currentFolderId: string | null;
  folders: FolderRecord[];
  search: string;
  searchScope: "folder" | "library";
  viewMode: ViewMode;
  zoomLevel: number;
  sortField: SortField;
  sortOrder: SortOrder;
  selectedCount: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoUp: () => void;
  onRefresh: () => void;
  onSearchChange: (s: string) => void;
  onSearchScopeChange: (scope: "folder" | "library") => void;
  onCategoryChange: (cat: CategoryFilter) => void;
  onFolderChange: (id: string | null) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onZoomChange: (zoom: number) => void;
  onSortChange: (field: SortField) => void;
  onToggleSortOrder: () => void;
  onNewFolder: () => void;
  onUploadClick: () => void;
  onCutClick: () => void;
  onCopyClick: () => void;
  onPasteClick: () => void;
  onDuplicateClick: () => void;
  onDeleteClick: () => void;
  onDropItemsToFolder: (itemIds: string[], targetFolderId: string | null) => void;
}

export function LibraryToolbar({
  currentCategory,
  currentFolderId,
  folders,
  search,
  searchScope,
  viewMode,
  zoomLevel,
  sortField,
  sortOrder,
  selectedCount,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onGoUp,
  onRefresh,
  onSearchChange,
  onSearchScopeChange,
  onCategoryChange,
  onFolderChange,
  onViewModeChange,
  onZoomChange,
  onSortChange,
  onToggleSortOrder,
  onNewFolder,
  onUploadClick,
  onCutClick,
  onCopyClick,
  onPasteClick,
  onDuplicateClick,
  onDeleteClick,
  onDropItemsToFolder,
}: LibraryToolbarProps) {
  return (
    <header className="flex shrink-0 flex-col border-b border-border bg-card/60 backdrop-blur select-none">
      {/* Upper Command Bar */}
      <div className="flex h-11 items-center justify-between gap-2 px-3 py-1.5 border-b border-border/40">
        {/* Navigation History */}
        <div className="flex items-center gap-1">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            title="Forward"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onGoUp}
            disabled={!currentFolderId}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            title="Up to parent folder"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={onRefresh}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
            title="Refresh File Manager"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Center Path Breadcrumb */}
        <div className="flex flex-1 max-w-xl items-center rounded-md border border-input bg-background/80 px-2">
          <LibraryBreadcrumb
            currentCategory={currentCategory}
            currentFolderId={currentFolderId}
            folders={folders}
            onSelectCategory={onCategoryChange}
            onSelectFolder={onFolderChange}
            onDropItemsToFolder={onDropItemsToFolder}
          />
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center gap-1">
          <div className="relative w-60">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search File Manager…"
              className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={searchScope}
            onChange={(e) => onSearchScopeChange(e.target.value as "folder" | "library")}
            className="h-8 cursor-pointer rounded border border-input bg-background px-2 text-xs focus:outline-none"
            title="Search Scope"
          >
            <option value="folder">Current Folder</option>
            <option value="library">Entire Library</option>
          </select>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onNewFolder}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium transition hover:bg-accent"
            title="New Folder"
          >
            <FolderPlus className="h-3.5 w-3.5 text-amber-400" />
            <span>New Folder</span>
          </button>
          <button
            onClick={onUploadClick}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            title="Upload Files to current folder"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Lower Quick Action Toolbar & View Controls */}
      <div className="flex h-9 items-center justify-between gap-2 px-3 text-xs bg-muted/20">
        {/* Quick Clipboard Actions */}
        <div className="flex items-center gap-1 border-r border-border/60 pr-3">
          <button
            onClick={onCutClick}
            disabled={selectedCount === 0}
            className="flex h-7 px-2 cursor-pointer items-center gap-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            title="Cut (Ctrl+X)"
          >
            <Scissors className="h-3.5 w-3.5" />
            <span>Cut</span>
          </button>
          <button
            onClick={onCopyClick}
            disabled={selectedCount === 0}
            className="flex h-7 px-2 cursor-pointer items-center gap-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            title="Copy (Ctrl+C)"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </button>
          <button
            onClick={onPasteClick}
            className="flex h-7 px-2 cursor-pointer items-center gap-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
            title="Paste (Ctrl+V)"
          >
            <Clipboard className="h-3.5 w-3.5" />
            <span>Paste</span>
          </button>
          <button
            onClick={onDuplicateClick}
            disabled={selectedCount === 0}
            className="flex h-7 px-2 cursor-pointer items-center gap-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            title="Duplicate"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={onDeleteClick}
            disabled={selectedCount === 0}
            className="flex h-7 px-2 cursor-pointer items-center gap-1 rounded hover:bg-destructive/20 text-destructive disabled:opacity-30 disabled:pointer-events-none"
            title="Delete (Del)"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>

        {/* Sort & View Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => onSortChange(e.target.value as SortField)}
              className="h-7 cursor-pointer rounded border border-input bg-background px-2 text-xs focus:outline-none"
            >
              <option value="name">Name</option>
              <option value="type">Type</option>
              <option value="createdAt">Date Created</option>
              <option value="size">Size</option>
            </select>
            <button
              onClick={onToggleSortOrder}
              className="flex h-7 px-2 cursor-pointer items-center gap-1 rounded border border-input bg-background text-[11px] hover:bg-accent"
              title="Toggle Sort Order"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
            </button>
          </div>

          <div className="flex items-center rounded border border-input bg-background p-0.5">
            <button
              onClick={() => onViewModeChange("large-icons")}
              className={cn(
                "flex h-6 w-6 cursor-pointer items-center justify-center rounded transition",
                viewMode === "large-icons" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              title="Large Icons"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "flex h-6 w-6 cursor-pointer items-center justify-center rounded transition",
                viewMode === "grid" || viewMode === "medium-icons" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              title="Medium Grid"
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "flex h-6 w-6 cursor-pointer items-center justify-center rounded transition",
                viewMode === "list" || viewMode === "details" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              title="Details List"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-1 border-l border-border/60 pl-2">
            <ZoomOut className="h-3 w-3 text-muted-foreground" />
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              className="h-1 w-16 cursor-pointer accent-primary"
              title={`Zoom: ${Math.round(zoomLevel * 100)}%`}
            />
            <ZoomIn className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
