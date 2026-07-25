import React, { useState } from "react";
import {
  Play,
  X,
  Music,
  BookOpen,
  Image as ImageIcon,
  Video as VideoIcon,
  Megaphone,
  Folder,
  Info,
  Languages,
  Copy,
  Pencil,
  Trash2,
  Layers,
  FolderInput,
  Star,
  Clock,
  FileText,
  Sliders,
  Activity,
  Tag,
  Check,
} from "lucide-react";
import type { LibraryItem } from "./types";
import type { FolderRecord } from "@/db/schema";
import { formatBytes, formatDuration } from "@/lib/files";
import { Thumb } from "@/components/Thumb";
import { projectSongSlide } from "@/projection/adapters/song.adapter";
import { getVerse, type BibleLang } from "@/lib/bible/loader";
import { projectVerse } from "@/projection/adapters/bible.adapter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LibraryPreviewPaneProps {
  item: LibraryItem | null;
  folders: FolderRecord[];
  allMedia: any[];
  bibleLang: BibleLang;
  onBibleLangChange: (lang: BibleLang) => void;
  onClose: () => void;
  onProject: (item: LibraryItem) => void;
  onRename?: (item: LibraryItem) => void;
  onDelete?: (items: LibraryItem[]) => void;
  onDuplicate?: (items: LibraryItem[]) => void;
}

type TabType = "preview" | "properties" | "metadata" | "history";

export function LibraryPreviewPane({
  item,
  folders,
  allMedia,
  bibleLang,
  onBibleLangChange,
  onClose,
  onProject,
  onRename,
  onDelete,
  onDuplicate,
}: LibraryPreviewPaneProps) {
  const [activeTab, setActiveTab] = useState<TabType>("preview");
  const [userRating, setUserRating] = useState<number>(item?.rating || 0);

  if (!item) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col items-center justify-center border-l border-border bg-card/30 p-4 text-center text-xs text-muted-foreground select-none">
        <Info className="mb-2 h-8 w-8 text-muted-foreground/40" />
        <p className="font-medium text-foreground">No item selected</p>
        <p className="mt-1 text-[11px] opacity-70">
          Select any file or folder to inspect metadata, view properties & project content.
        </p>
      </aside>
    );
  }

  // Calculate Bible details
  let isOldTestament = true;
  let verseRangeText = "";
  let fullPassageText = "";

  if (item.type === "bible" && item.bibleData) {
    isOldTestament = item.bibleData.book <= 39;
    const start = item.bibleData.verse;
    const end = item.bibleData.verseEnd || start;
    verseRangeText = start === end ? `${start}` : `${start}-${end}`;

    const lines: string[] = [];
    for (let v = start; v <= end; v++) {
      const line = getVerse(bibleLang, item.bibleData.book, item.bibleData.chapter, v);
      if (line) lines.push(`[${v}] ${line}`);
    }
    fullPassageText = lines.join("\n\n") || item.bibleData.text || "Verse text unavailable.";
  }

  // Calculate Folder stats
  let subfolderCount = 0;
  let folderItemCount = 0;
  let folderParentName = "Home Root";

  if (item.folderRecord) {
    subfolderCount = folders.filter((f) => f.parentId === item.folderRecord!.id).length;
    folderItemCount = allMedia.filter((m) => m.folderId === item.folderRecord!.id).length;
    if (item.folderRecord.parentId) {
      const parent = folders.find((f) => f.id === item.folderRecord!.parentId);
      if (parent) folderParentName = parent.name;
    }
  }

  // Folder Path construction
  const getFolderPath = (folderId: string | null): string => {
    if (!folderId) return "/ (Root)";
    const chain: string[] = [];
    let curr: string | null = folderId;
    while (curr) {
      const found = folders.find((f) => f.id === curr);
      if (!found) break;
      chain.unshift(found.name);
      curr = found.parentId;
    }
    return "/" + chain.join("/");
  };

  const folderPathStr = getFolderPath(item.folderId);
  const aspectRatio = item.width && item.height ? (item.width / item.height).toFixed(2) : null;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-hidden border-l border-border bg-card/60 select-none">
      {/* Header with Title and Close Button */}
      <div className="flex items-center justify-between p-3 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2 min-w-0">
          <TypeIcon type={item.type} />
          <span className="truncate text-xs font-bold text-foreground">{item.name}</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Close Inspector"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Inspector Tabs */}
      <div className="flex items-center border-b border-border bg-muted/20 px-2 text-[11px] font-medium text-muted-foreground">
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex-1 py-2 text-center transition border-b-2 font-semibold",
            activeTab === "preview"
              ? "border-primary text-primary bg-accent/40"
              : "border-transparent hover:text-foreground"
          )}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab("properties")}
          className={cn(
            "flex-1 py-2 text-center transition border-b-2 font-semibold",
            activeTab === "properties"
              ? "border-primary text-primary bg-accent/40"
              : "border-transparent hover:text-foreground"
          )}
        >
          Props
        </button>
        <button
          onClick={() => setActiveTab("metadata")}
          className={cn(
            "flex-1 py-2 text-center transition border-b-2 font-semibold",
            activeTab === "metadata"
              ? "border-primary text-primary bg-accent/40"
              : "border-transparent hover:text-foreground"
          )}
        >
          Meta
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex-1 py-2 text-center transition border-b-2 font-semibold",
            activeTab === "history"
              ? "border-primary text-primary bg-accent/40"
              : "border-transparent hover:text-foreground"
          )}
        >
          History
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === "preview" && (
          <div className="space-y-4">
            {/* Visual Thumbnail Box */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/80 bg-muted/40 shadow-inner flex items-center justify-center">
              {item.mediaRecord ? (
                <Thumb media={item.mediaRecord} className="h-full w-full object-cover" />
              ) : item.type === "song" ? (
                <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center text-primary">
                  <Music className="h-10 w-10 opacity-80" />
                  <span className="text-xs font-bold">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {item.songData?.slides.length || 0} Slides
                  </span>
                </div>
              ) : item.type === "bible" ? (
                <div className="flex flex-col items-center justify-center gap-1 p-4 text-center text-amber-400">
                  <BookOpen className="h-10 w-10 opacity-80" />
                  <span className="text-xs font-bold">{item.name}</span>
                  <span className="text-[10px] text-amber-300/80">
                    {isOldTestament ? "Old Testament" : "New Testament"}
                  </span>
                </div>
              ) : item.type === "text" ? (
                <div className="flex flex-col items-center justify-center gap-1 p-4 text-center text-blue-400">
                  <Megaphone className="h-10 w-10 opacity-80" />
                  <span className="text-xs font-bold">{item.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-amber-400">
                  <Folder className="h-10 w-10 opacity-80" />
                  <span className="text-xs font-bold">{item.name}</span>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => onProject(item)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" />
              Project Live
            </button>

            {/* Content Snippet */}
            {item.songData && (
              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Slide Preview (1 of {item.songData.slides.length})
                </span>
                <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap font-medium">
                  {item.songData.slides[0] || "No slide content"}
                </p>
              </div>
            )}

            {item.type === "bible" && item.bibleData && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    Passage Snippet
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onBibleLangChange("en")}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                        bibleLang === "en" ? "bg-amber-500 text-black" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => onBibleLangChange("ta")}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                        bibleLang === "ta" ? "bg-amber-500 text-black" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      TA
                    </button>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap font-serif">
                  {fullPassageText}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "properties" && (
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-border bg-card p-3 space-y-2">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground font-medium">Type</span>
                <span className="font-semibold text-foreground uppercase">{item.type}</span>
              </div>
              {item.mime && (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">MIME</span>
                  <span className="font-mono text-[11px] text-foreground">{item.mime}</span>
                </div>
              )}
              {item.size ? (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">File Size</span>
                  <span className="font-semibold text-foreground">{formatBytes(item.size)}</span>
                </div>
              ) : null}
              {item.width && item.height ? (
                <>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Resolution</span>
                    <span className="font-semibold text-foreground">
                      {item.width} × {item.height}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Aspect Ratio</span>
                    <span className="font-semibold text-foreground">{aspectRatio}:1</span>
                  </div>
                </>
              ) : null}
              {item.durationMs ? (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Duration</span>
                  <span className="font-semibold text-foreground">{formatDuration(item.durationMs)}</span>
                </div>
              ) : null}
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground font-medium">Folder Path</span>
                <span className="font-mono text-[10px] text-primary truncate max-w-[140px]" title={folderPathStr}>
                  {folderPathStr}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "metadata" && (
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-border bg-card p-3 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground font-medium">Created Date</span>
                <span className="font-medium text-foreground">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground font-medium">Modified Date</span>
                <span className="font-medium text-foreground">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground font-medium">Projection Count</span>
                <span className="font-bold text-emerald-400">
                  {item.projectionCount || 0} times
                </span>
              </div>

              {/* Star Rating Control */}
              <div className="pt-2">
                <span className="text-muted-foreground font-medium block mb-1.5">Asset Rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setUserRating(star);
                        item.rating = star;
                        toast.success(`Set rating to ${star} stars`);
                      }}
                      className="cursor-pointer transition hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          star <= (userRating || item.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-border bg-card p-3 space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground font-semibold border-b border-border/40 pb-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Activity & History Log</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1" />
                  <div>
                    <p className="text-foreground font-medium">Item Imported</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1" />
                  <div>
                    <p className="text-foreground font-medium">Last Metadata Sync</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(item.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between gap-1 text-xs">
        {onRename && (
          <button
            onClick={() => onRename(item)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-foreground hover:bg-accent font-medium transition"
          >
            <Pencil className="h-3.5 w-3.5" />
            Rename
          </button>
        )}
        {onDuplicate && (
          <button
            onClick={() => onDuplicate([item])}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-foreground hover:bg-accent font-medium transition"
          >
            <Copy className="h-3.5 w-3.5" />
            Duplicate
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete([item])}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
            title="Delete Item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case "song":
      return <Music className="h-4 w-4 text-primary shrink-0" />;
    case "bible":
      return <BookOpen className="h-4 w-4 text-amber-400 shrink-0" />;
    case "image":
      return <ImageIcon className="h-4 w-4 text-emerald-400 shrink-0" />;
    case "video":
      return <VideoIcon className="h-4 w-4 text-purple-400 shrink-0" />;
    case "text":
    case "announcement":
      return <Megaphone className="h-4 w-4 text-blue-400 shrink-0" />;
    case "folder":
      return <Folder className="h-4 w-4 text-amber-500 shrink-0" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground shrink-0" />;
  }
}
