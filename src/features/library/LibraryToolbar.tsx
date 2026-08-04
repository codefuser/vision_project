import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
  PanelLeft,
  PanelRight,
  Zap,
  MoreHorizontal,
  Image as ImageIcon,
  Check,
  Maximize2,
  Folder,
  Home,
  FileText,
  Clock,
  HardDrive,
  Tag,
  ArrowUpDown,
} from "lucide-react";
import { LibraryBreadcrumb } from "./LibraryBreadcrumb";
import type { CategoryFilter, SortField, SortOrder, ViewMode } from "./types";
import type { FolderRecord } from "@/db/schema";
import { cn } from "@/lib/utils";
import { CustomDropdown, type DropdownOption } from "@/components/ui/CustomDropdown";
import { ShortcutTooltip } from "@/components/ShortcutTooltip";

const ZOOM_PRESETS = [50, 75, 90, 100, 110, 125, 150, 175, 200];

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
  isLeftCollapsed?: boolean;
  isRightCollapsed?: boolean;
  autoProjectEnabled?: boolean;
  onToggleLeftCollapsed?: () => void;
  onToggleRightCollapsed?: () => void;
  onToggleAutoProject?: () => void;
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
  isLeftCollapsed,
  isRightCollapsed,
  autoProjectEnabled,
  onToggleLeftCollapsed,
  onToggleRightCollapsed,
  onToggleAutoProject,
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
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [foldersFirst, setFoldersFirst] = useState(true);

  const currentPercent = Math.round(zoomLevel * 100);
  const [zoomInputText, setZoomInputText] = useState(String(currentPercent));

  useEffect(() => {
    setZoomInputText(String(currentPercent));
  }, [currentPercent]);

  const handleZoomInputCommit = () => {
    const parsed = parseInt(zoomInputText.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(50, Math.min(200, parsed));
      onZoomChange(clamped / 100);
      setZoomInputText(String(clamped));
    } else {
      setZoomInputText(String(currentPercent));
    }
  };

  const handleZoomNext = () => {
    const next = ZOOM_PRESETS.find((p) => p > currentPercent);
    if (next) onZoomChange(next / 100);
    else onZoomChange(2.0);
  };

  const handleZoomPrev = () => {
    const prev = [...ZOOM_PRESETS].reverse().find((p) => p < currentPercent);
    if (prev) onZoomChange(prev / 100);
    else onZoomChange(0.5);
  };

  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [moreCoords, setMoreCoords] = useState<{ top: number; right: number }>({ top: 0, right: 0 });

  const updateMorePosition = () => {
    if (!moreButtonRef.current) return;
    const rect = moreButtonRef.current.getBoundingClientRect();
    setMoreCoords({
      top: rect.bottom + 4,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  };

  useLayoutEffect(() => {
    if (showMoreDropdown) updateMorePosition();
  }, [showMoreDropdown]);

  useEffect(() => {
    if (!showMoreDropdown) return;

    const handleScrollOrResize = () => updateMorePosition();
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreButtonRef.current &&
        !moreButtonRef.current.contains(e.target as Node) &&
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node)
      ) {
        setShowMoreDropdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMoreDropdown(false);
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMoreDropdown]);

  // Search Scope Options (2 options only)
  const scopeOptions: DropdownOption<"folder" | "library">[] = [
    { value: "folder", label: "Current Folder", icon: <Folder className="h-3.5 w-3.5 text-amber-400" /> },
    { value: "library", label: "Entire Library", icon: <Home className="h-3.5 w-3.5 text-blue-400" /> },
  ];

  // View Options
  const viewOptions: DropdownOption<ViewMode>[] = [
    { value: "large-icons", label: "Large Icons", icon: <LayoutGrid className="h-4 w-4 text-amber-400" /> },
    { value: "medium-icons", label: "Medium Icons", icon: <Grid className="h-4 w-4 text-blue-400" /> },
    { value: "small-icons", label: "Small Icons", icon: <Grid className="h-3.5 w-3.5 text-slate-400" /> },
    { value: "list", label: "List", icon: <List className="h-4 w-4 text-purple-400" /> },
    { value: "details", label: "Details", icon: <SlidersHorizontal className="h-4 w-4 text-emerald-400" /> },
    { value: "gallery", label: "Gallery", icon: <ImageIcon className="h-4 w-4 text-rose-400" /> },
  ];

  // Sort Options
  const sortOptions: DropdownOption<SortField>[] = [
    { value: "name", label: "Name", icon: <FileText className="h-3.5 w-3.5 text-blue-400" /> },
    { value: "createdAt", label: "Date Created", icon: <Clock className="h-3.5 w-3.5 text-emerald-400" /> },
    { value: "size", label: "File Size", icon: <HardDrive className="h-3.5 w-3.5 text-purple-400" /> },
    { value: "type", label: "File Type", icon: <Tag className="h-3.5 w-3.5 text-amber-400" /> },
  ];

  const getViewModeLabel = (mode: ViewMode) => {
    switch (mode) {
      case "large-icons":
        return "Large Icons";
      case "medium-icons":
      case "grid":
        return "Medium Icons";
      case "small-icons":
        return "Small Icons";
      case "list":
        return "List";
      case "details":
        return "Details";
      case "gallery":
        return "Gallery";
      default:
        return "View";
    }
  };

  const renderViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case "large-icons":
        return <LayoutGrid className="h-3.5 w-3.5 text-amber-400" />;
      case "medium-icons":
      case "grid":
        return <Grid className="h-3.5 w-3.5 text-blue-400" />;
      case "small-icons":
        return <Grid className="h-3.5 w-3.5 text-slate-400" />;
      case "list":
        return <List className="h-4 w-4 text-purple-400" />;
      case "details":
        return <SlidersHorizontal className="h-4 w-4 text-emerald-400" />;
      case "gallery":
        return <ImageIcon className="h-4 w-4 text-rose-400" />;
      default:
        return <Grid className="h-3.5 w-3.5" />;
    }
  };

  const moreMenuPortal = showMoreDropdown ? (
    <div
      ref={moreMenuRef}
      style={{
        position: "fixed",
        top: `${moreCoords.top}px`,
        right: `${moreCoords.right}px`,
        zIndex: 99999,
      }}
      className="min-w-[220px] max-h-[420px] overflow-y-auto rounded-xl border border-border bg-popover/98 p-1.5 shadow-2xl backdrop-blur-md select-none text-xs space-y-1 custom-scrollbar transition-opacity duration-75 opacity-100 text-popover-foreground"
    >
      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 block">
        Quick Actions
      </span>

      <button
        onClick={() => {
          setFoldersFirst(!foldersFirst);
          setShowMoreDropdown(false);
        }}
        className="flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition"
      >
        <div className="flex items-center gap-2">
          <Folder className="h-3.5 w-3.5 text-amber-400" />
          <span>Folders First</span>
        </div>
        {foldersFirst && <Check className="h-3.5 w-3.5 text-blue-400" />}
      </button>

      <button
        onClick={() => {
          onZoomChange(1.0);
          setShowMoreDropdown(false);
        }}
        className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition"
      >
        <Maximize2 className="h-3.5 w-3.5 text-blue-400" />
        <span>Reset Zoom (100%)</span>
      </button>
    </div>
  ) : null;

  return (
    <header className="flex flex-col border-b border-border bg-card/90 backdrop-blur-md select-none shrink-0">
      {/* ==================================================
          ROW 1 = NAVIGATION ONLY
          ================================================== */}
      <div className="flex h-10 items-center justify-between gap-2 border-b border-border/60 px-3 overflow-x-auto no-scrollbar">
        {/* Left Navigation Buttons & Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <ShortcutTooltip id="library.back" label="Back">
            <button
              onClick={onGoBack}
              disabled={!canGoBack}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </ShortcutTooltip>

          <ShortcutTooltip id="library.forward" label="Forward">
            <button
              onClick={onGoForward}
              disabled={!canGoForward}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </ShortcutTooltip>

          <ShortcutTooltip id="library.up" label="Up One Folder">
            <button
              onClick={onGoUp}
              disabled={!currentFolderId}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </ShortcutTooltip>

          <ShortcutTooltip id="library.refresh" label="Refresh Library">
            <button
              onClick={onRefresh}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition shrink-0"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </ShortcutTooltip>

          <div className="mx-1 h-4 w-px bg-border/80 shrink-0" />

          {/* Breadcrumb Path Display */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <LibraryBreadcrumb
              currentCategory={currentCategory}
              currentFolderId={currentFolderId}
              folders={folders}
              onSelectCategory={onCategoryChange}
              onSelectFolder={onFolderChange}
              onDropItemsToFolder={onDropItemsToFolder}
            />
          </div>
        </div>

        {/* Right Search Input Box & Scope Dropdown + Folder Creation */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center w-40 sm:w-52">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search library…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-7 w-full rounded-md border border-border bg-background pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Search Scope Custom Dropdown (Exact Left Alignment) */}
          <CustomDropdown
            value={searchScope}
            options={scopeOptions}
            onChange={onSearchScopeChange}
            align="left"
            title="Search Scope"
          />

          <div className="mx-1 h-4 w-px bg-border/80 shrink-0" />

          {/* New Folder & Upload Buttons in Row 1 */}
          <ShortcutTooltip id="library.new-folder" label="New Folder">
            <button
              onClick={onNewFolder}
              className="flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background text-xs font-semibold text-foreground hover:bg-accent hover:border-amber-400/50 transition shrink-0"
            >
              <FolderPlus className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">New Folder</span>
            </button>
          </ShortcutTooltip>

          <ShortcutTooltip id="library.upload" label="Upload Files">
            <button
              onClick={onUploadClick}
              className="flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-blue-500/50 bg-blue-600/20 text-xs font-bold text-blue-500 dark:text-blue-400 hover:bg-blue-600/30 transition shadow-xs shrink-0"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload</span>
            </button>
          </ShortcutTooltip>
        </div>
      </div>

      {/* ==================================================
          ROW 2 = FILE OPERATIONS ONLY
          ================================================== */}
      <div className="flex h-10 items-center justify-between gap-2 px-3 overflow-x-auto select-none no-scrollbar">
        {/* File Operation Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <ShortcutTooltip id="library.cut" label="Cut Selected">
            <button
              onClick={onCutClick}
              disabled={selectedCount === 0}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            >
              <Scissors className="h-3.5 w-3.5 text-amber-400" />
            </button>
          </ShortcutTooltip>

          <ShortcutTooltip id="library.copy" label="Copy Selected">
            <button
              onClick={onCopyClick}
              disabled={selectedCount === 0}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            >
              <Copy className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </ShortcutTooltip>

          <ShortcutTooltip id="library.paste" label="Paste Items">
            <button
              onClick={onPasteClick}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition shrink-0"
            >
              <Clipboard className="h-3.5 w-3.5 text-emerald-400" />
            </button>
          </ShortcutTooltip>

          <ShortcutTooltip label="Duplicate Items">
            <button
              onClick={onDuplicateClick}
              disabled={selectedCount === 0}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            >
              <Layers className="h-3.5 w-3.5 text-purple-400" />
            </button>
          </ShortcutTooltip>

          <ShortcutTooltip id="library.delete" label="Delete Selected">
            <button
              onClick={onDeleteClick}
              disabled={selectedCount === 0}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </ShortcutTooltip>

          <div className="mx-1 h-4 w-px bg-border/80 shrink-0" />

          {/* Auto-Project Mode Toggle Button */}
          {onToggleAutoProject && (
            <ShortcutTooltip label="Single-click on any item immediately projects it live">
              <button
                onClick={onToggleAutoProject}
                className={cn(
                  "flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md text-xs font-bold transition shadow-xs border shrink-0",
                  autoProjectEnabled
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-500/25"
                    : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Zap className={cn("h-3.5 w-3.5", autoProjectEnabled ? "fill-emerald-400 text-emerald-400" : "")} />
                <span className="hidden sm:inline">Auto Project: {autoProjectEnabled ? "ON" : "OFF"}</span>
              </button>
            </ShortcutTooltip>
          )}

          <div className="mx-1 h-4 w-px bg-border/80 shrink-0" />

          {/* Panel Toggle Buttons */}
          <div className="flex items-center rounded-md border border-border bg-background p-0.5 shrink-0">
            {onToggleLeftCollapsed && (
              <ShortcutTooltip id="library.toggle-tree" label="Toggle Folder Tree">
                <button
                  onClick={onToggleLeftCollapsed}
                  className={cn(
                    "flex h-6 px-2 cursor-pointer items-center justify-center rounded text-xs transition gap-1",
                    !isLeftCollapsed ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <PanelLeft className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[10px]">Tree</span>
                </button>
              </ShortcutTooltip>
            )}
            {onToggleRightCollapsed && (
              <ShortcutTooltip id="library.toggle-details" label="Toggle Details Inspector">
                <button
                  onClick={onToggleRightCollapsed}
                  className={cn(
                    "flex h-6 px-2 cursor-pointer items-center justify-center rounded text-xs transition gap-1",
                    !isRightCollapsed ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <PanelRight className="h-3.5 w-3.5 text-blue-400" />
                  <span className="hidden sm:inline text-[10px]">Details</span>
                </button>
              </ShortcutTooltip>
            )}
          </div>
        </div>

        {/* Right Sort, View, Zoom Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Sort Custom Dropdown */}
          <CustomDropdown
            value={sortField}
            options={sortOptions}
            onChange={(val) => onSortChange(val as SortField)}
            triggerIcon={<SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />}
            triggerLabel={`Sort: ${sortField.charAt(0).toUpperCase() + sortField.slice(1)}`}
            align="right"
            title="Sort Options"
          />

          <ShortcutTooltip label="Toggle Sort Order">
            <button
              onClick={onToggleSortOrder}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition shrink-0"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-blue-400" />
            </button>
          </ShortcutTooltip>

          {/* View Custom Dropdown */}
          <CustomDropdown
            value={viewMode}
            options={viewOptions}
            onChange={(val) => onViewModeChange(val as ViewMode)}
            triggerIcon={renderViewModeIcon(viewMode)}
            triggerLabel={getViewModeLabel(viewMode)}
            align="right"
            title="View Options"
          />

          {/* Redesigned Preset-based & Editable Zoom Field Control: [-] [100%] [+] */}
          <div className="hidden md:flex items-center gap-1 border border-border bg-background rounded-md px-1 h-7 shrink-0 select-none">
            <ShortcutTooltip label="Zoom Out (Previous Preset)">
              <button
                onClick={handleZoomPrev}
                className="h-5 w-5 rounded flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ZoomOut className="h-3 w-3" />
              </button>
            </ShortcutTooltip>

            <div className="flex items-center">
              <input
                type="text"
                value={zoomInputText}
                onChange={(e) => setZoomInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleZoomInputCommit();
                }}
                onBlur={handleZoomInputCommit}
                onDoubleClick={() => onZoomChange(1.0)}
                className="w-8 text-center text-[11px] font-mono font-bold bg-transparent text-foreground focus:outline-none focus:bg-accent rounded px-0.5"
              />
              <span className="text-[10px] font-mono text-muted-foreground -ml-0.5">%</span>
            </div>

            <ShortcutTooltip label="Zoom In (Next Preset)">
              <button
                onClick={handleZoomNext}
                className="h-5 w-5 rounded flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ZoomIn className="h-3 w-3" />
              </button>
            </ShortcutTooltip>
          </div>

          {/* More (⋯) Overflow Menu */}
          <div className="shrink-0">
            <ShortcutTooltip label="More Options">
              <button
                ref={moreButtonRef}
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </ShortcutTooltip>

            {typeof document !== "undefined" && moreMenuPortal && createPortal(moreMenuPortal, document.body)}
          </div>
        </div>
      </div>
    </header>
  );
}
