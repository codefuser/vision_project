import React, { useState, useRef, useEffect } from "react";
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
  ChevronDown,
  MoreHorizontal,
  Image as ImageIcon,
  Check,
  Maximize2,
  Eye,
  Sparkles,
  Folder,
  Home,
  FolderOpen,
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

interface LibraryToolbarProps {
  currentCategory: CategoryFilter;
  currentFolderId: string | null;
  folders: FolderRecord[];
  search: string;
  searchScope: "folder" | "library" | "selected";
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
  onSearchScopeChange: (scope: "folder" | "library" | "selected") => void;
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
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [foldersFirst, setFoldersFirst] = useState(true);

  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreDropdown(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Scope Options
  const scopeOptions: DropdownOption<"folder" | "library" | "selected">[] = [
    { value: "folder", label: "Current Folder", icon: <Folder className="h-3.5 w-3.5 text-amber-400" /> },
    { value: "library", label: "Entire Library", icon: <Home className="h-3.5 w-3.5 text-blue-400" /> },
    { value: "selected", label: "Selected Folder", icon: <FolderOpen className="h-3.5 w-3.5 text-purple-400" /> },
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
        return <List className="h-3.5 w-3.5 text-purple-400" />;
      case "details":
        return <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />;
      case "gallery":
        return <ImageIcon className="h-3.5 w-3.5 text-rose-400" />;
      default:
        return <Eye className="h-3.5 w-3.5" />;
    }
  };

  return (
    <header className="flex flex-col border-b border-[#2D3348] bg-[#111827]/90 backdrop-blur-md select-none shrink-0">
      {/* ==================================================
          ROW 1 = NAVIGATION ONLY
          ================================================== */}
      <div className="flex h-10 items-center justify-between gap-2 border-b border-[#2D3348]/60 px-3 overflow-x-auto no-scrollbar">
        {/* Left Navigation Buttons & Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#2D3348] bg-[#111827] text-muted-foreground hover:bg-[#1F2937] hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            title="Back (Alt+Left)"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#2D3348] bg-[#111827] text-muted-foreground hover:bg-[#1F2937] hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            title="Forward (Alt+Right)"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onGoUp}
            disabled={!currentFolderId}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#2D3348] bg-[#111827] text-muted-foreground hover:bg-[#1F2937] hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            title="Up One Folder"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onRefresh}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#2D3348] bg-[#111827] text-muted-foreground hover:bg-[#1F2937] hover:text-foreground transition shrink-0"
            title="Refresh Library"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-[#2D3348]/80 shrink-0" />

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
          <div className="relative flex items-center w-44 sm:w-56">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search library…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-7 w-full rounded-md border border-[#2D3348] bg-[#111827] pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Search Scope Custom Dropdown */}
          <CustomDropdown
            value={searchScope}
            options={scopeOptions}
            onChange={onSearchScopeChange}
            align="right"
            title="Search Scope"
          />

          <div className="mx-1 h-4 w-px bg-[#2D3348]/80 shrink-0" />

          {/* New Folder & Upload Buttons in Row 1 */}
          <button
            onClick={onNewFolder}
            className="flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-[#2D3348] bg-[#111827] text-xs font-semibold text-foreground hover:bg-[#1F2937] hover:border-amber-400/50 transition shrink-0"
          >
            <FolderPlus className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">New Folder</span>
          </button>

          <button
            onClick={onUploadClick}
            className="flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-blue-500/50 bg-blue-600/20 text-xs font-bold text-blue-400 hover:bg-blue-600/30 transition shadow-sm shrink-0"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          ROW 2 = FILE OPERATIONS ONLY
          ================================================== */}
      <div className="flex h-10 items-center justify-between gap-2 px-3 overflow-x-auto select-none no-scrollbar">
        {/* File Operation Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onCutClick}
            disabled={selectedCount === 0}
            className="flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-[#2D3348] bg-[#111827] text-xs font-semibold text-muted-foreground hover:bg-[#1F2937] hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            title="Cut (Ctrl+X)"
          >
            <Scissors className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cut</span>
          </button>
          <button
            onClick={onCopyClick}
            disabled={selectedCount === 0}
            className="flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-[#2D3348] bg-[#111827] text-xs font-semibold text-muted-foreground hover:bg-[#1F2937] hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            title="Copy (Ctrl+C)"
          >
            <Copy className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={onPasteClick}
            className="flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-[#2D3348] bg-[#111827] text-xs font-semibold text-muted-foreground hover:bg-[#1F2937] hover:text-foreground transition shrink-0"
            title="Paste (Ctrl+V)"
          >
            <Clipboard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>
          <button
            onClick={onDuplicateClick}
            disabled={selectedCount === 0}
            className="flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-[#2D3348] bg-[#111827] text-xs font-semibold text-muted-foreground hover:bg-[#1F2937] hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            title="Duplicate"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Duplicate</span>
          </button>
          <button
            onClick={onDeleteClick}
            disabled={selectedCount === 0}
            className="flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-rose-500/40 bg-rose-500/10 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
            title="Delete (Del)"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>

          <div className="mx-1 h-4 w-px bg-[#2D3348]/80 shrink-0" />

          {/* Auto-Project Mode Toggle Button */}
          {onToggleAutoProject && (
            <button
              onClick={onToggleAutoProject}
              className={cn(
                "flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md text-xs font-bold transition shadow-sm border shrink-0",
                autoProjectEnabled
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                  : "border-[#2D3348] bg-[#111827] text-muted-foreground hover:bg-[#1F2937] hover:text-foreground"
              )}
              title="Single-click on any item immediately projects it live"
            >
              <Zap className={cn("h-3.5 w-3.5", autoProjectEnabled ? "fill-emerald-400 text-emerald-400" : "")} />
              <span className="hidden lg:inline">Auto Project: {autoProjectEnabled ? "ON" : "OFF"}</span>
            </button>
          )}

          <div className="mx-1 h-4 w-px bg-[#2D3348]/80 shrink-0" />

          {/* Panel Toggle Buttons */}
          <div className="flex items-center rounded-md border border-[#2D3348] bg-[#111827] p-0.5 shrink-0">
            {onToggleLeftCollapsed && (
              <button
                onClick={onToggleLeftCollapsed}
                className={cn(
                  "flex h-6 px-2 cursor-pointer items-center justify-center rounded text-xs transition gap-1",
                  !isLeftCollapsed ? "bg-[#1F2937] text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
                title="Toggle Folder Tree (Ctrl+B)"
              >
                <PanelLeft className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden xl:inline text-[10px]">Tree</span>
              </button>
            )}
            {onToggleRightCollapsed && (
              <button
                onClick={onToggleRightCollapsed}
                className={cn(
                  "flex h-6 px-2 cursor-pointer items-center justify-center rounded text-xs transition gap-1",
                  !isRightCollapsed ? "bg-[#1F2937] text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
                title="Toggle Details Inspector (Ctrl+])"
              >
                <PanelRight className="h-3.5 w-3.5 text-blue-400" />
                <span className="hidden xl:inline text-[10px]">Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Sort, View, Zoom Controls */}
        <div className="flex items-center gap-2 shrink-0">
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

          <button
            onClick={onToggleSortOrder}
            className="flex h-7 px-2 cursor-pointer items-center gap-1 rounded-md border border-[#2D3348] bg-[#111827] text-xs font-semibold text-muted-foreground hover:bg-[#1F2937] hover:text-foreground transition shrink-0"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline text-[11px]">{sortOrder === "asc" ? "Asc" : "Desc"}</span>
          </button>

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

          {/* Zoom Slider */}
          <div className="hidden lg:flex items-center gap-1 border border-[#2D3348] bg-[#111827] rounded-md px-2 h-7 shrink-0">
            <button
              onClick={() => onZoomChange(Math.max(0.6, zoomLevel - 0.15))}
              className="h-5 w-5 rounded flex items-center justify-center hover:bg-[#1F2937] text-muted-foreground hover:text-foreground"
              title="Zoom Out"
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="text-[11px] font-mono font-bold w-9 text-center text-foreground">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => onZoomChange(Math.min(2.0, zoomLevel + 0.15))}
              className="h-5 w-5 rounded flex items-center justify-center hover:bg-[#1F2937] text-muted-foreground hover:text-foreground"
              title="Zoom In"
            >
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>

          {/* More (⋯) Overflow Menu */}
          <div ref={moreMenuRef} className="relative shrink-0">
            <button
              onClick={() => setShowMoreDropdown(!showMoreDropdown)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#2D3348] bg-[#111827] text-muted-foreground hover:bg-[#1F2937] hover:text-foreground transition"
              title="More options (⋯)"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMoreDropdown && (
              <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[190px] rounded-xl border border-[#2D3348] bg-[#111827]/95 p-1.5 shadow-2xl backdrop-blur-md select-none text-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 block">
                  Quick Actions
                </span>

                <button
                  onClick={() => {
                    setFoldersFirst(!foldersFirst);
                    setShowMoreDropdown(false);
                  }}
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-foreground hover:bg-[#1F2937]"
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
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-foreground hover:bg-[#1F2937]"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-blue-400" />
                  <span>Reset Zoom (100%)</span>
                </button>

                <button
                  onClick={() => {
                    setShowHiddenFiles(!showHiddenFiles);
                    setShowMoreDropdown(false);
                  }}
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-foreground hover:bg-[#1F2937]"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-amber-400" />
                    <span>Show Hidden Files</span>
                  </div>
                  {showHiddenFiles && <Check className="h-3.5 w-3.5 text-blue-400" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
