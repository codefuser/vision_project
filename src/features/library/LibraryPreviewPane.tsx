import React from "react";
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
} from "lucide-react";
import type { LibraryItem } from "./types";
import type { FolderRecord } from "@/db/schema";
import { formatBytes, formatDuration } from "@/lib/files";
import { Thumb } from "@/components/Thumb";
import { projectSongSlide } from "@/projection/adapters/song.adapter";
import { getVerse, type BibleLang } from "@/lib/bible/loader";
import { projectVerse } from "@/projection/adapters/bible.adapter";
import { toast } from "sonner";
import { useDragAutoScroll } from "./useDragAutoScroll";

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
  const scrollRef = React.useRef<HTMLElement>(null);
  useDragAutoScroll(scrollRef, 8, 40);

  if (!item) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col items-center justify-center border-l border-border bg-card/30 p-4 text-center text-xs text-muted-foreground select-none">
        <Info className="mb-2 h-8 w-8 text-muted-foreground/40" />
        <p className="font-medium text-foreground">No item selected</p>
        <p className="mt-1 text-[11px] opacity-70">
          Select any file or folder to inspect metadata & preview content.
        </p>
      </aside>
    );
  }

  // Calculate Testament & Verse Range Text for Bible items
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

  // Calculate folder stats if item is a folder
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

  return (
    <aside ref={scrollRef} className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-card/60 p-4 select-none">
      {/* Inspector Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
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

      {/* Main High-Res Preview Box */}
      <div className="my-3 overflow-hidden rounded-xl border border-border bg-black/40 p-2 shadow-inner">
        {item.mediaRecord ? (
          (item.mediaRecord.type as any) === "audio" ? (
            <div className="flex flex-col items-center justify-center aspect-video bg-gradient-to-br from-indigo-950 to-slate-900 rounded-lg p-4 shadow-inner border border-indigo-500/20">
              <Music className="h-12 w-12 text-indigo-400 opacity-80 mb-4 drop-shadow-lg" />
              <div className="flex items-center justify-center gap-1 h-12 w-full">
                {[30, 50, 80, 40, 60, 90, 70, 100, 50, 40, 80, 60, 40, 70, 90, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-indigo-500/80 rounded-full"
                    style={{ height: `${h}%`, opacity: 0.5 + (h / 200) }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Thumb media={item.mediaRecord} className="aspect-video w-full rounded-lg object-contain bg-black/60 shadow-inner" />
          )
        ) : item.type === "song" && item.songData ? (
          <div className="flex flex-col gap-2 p-3 bg-gradient-to-br from-purple-950/40 to-black/40 border border-purple-500/30 rounded-lg text-xs shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Music className="w-24 h-24" />
            </div>
            <span className="font-bold text-purple-300 text-sm">{item.songData.title}</span>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground z-10">
              {item.songData.scale && <span className="uppercase font-mono font-semibold text-purple-200 bg-purple-500/20 px-1.5 py-0.5 rounded">Key: {item.songData.scale}</span>}
              <span>·</span>
              <span className="font-medium text-foreground">{item.songData.slides.length} Slides</span>
            </div>
          </div>
        ) : item.type === "bible" && item.bibleData ? (
          <div className="flex flex-col gap-2 p-3 bg-gradient-to-br from-blue-950/40 to-black/40 border border-blue-500/30 rounded-lg text-xs shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BookOpen className="w-24 h-24" />
            </div>
            <div className="flex items-center justify-between z-10">
              <span className="font-bold text-blue-300 text-sm">
                {item.bibleData.bookName} {item.bibleData.chapter}:{verseRangeText}
              </span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-100 shadow-sm">
                {bibleLang === "en" ? "KJV" : "TCV"}
              </span>
            </div>
            <p className="mt-1 text-[11.5px] text-foreground/90 leading-relaxed italic line-clamp-6 whitespace-pre-line z-10 relative">
              <span className="text-blue-400 text-lg absolute -top-1 -left-2 opacity-30">"</span>
              {fullPassageText}
              <span className="text-blue-400 text-lg absolute -bottom-3 opacity-30 ml-1">"</span>
            </p>
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-amber-950/20 to-black/40 border border-amber-500/20 rounded-lg shadow-inner">
            <Folder className="h-16 w-16 text-amber-400 opacity-60 drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Bible Language Switcher & Copy Trigger */}
      {item.type === "bible" && item.bibleData && (
        <div className="mb-3 flex flex-col gap-2 rounded-lg border border-border bg-card p-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <Languages className="h-3.5 w-3.5 text-primary" />
              <span>Language:</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onBibleLangChange("en")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  bibleLang === "en" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                English
              </button>
              <button
                onClick={() => onBibleLangChange("ta")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  bibleLang === "ta" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Tamil
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              void navigator.clipboard.writeText(`${item.name}\n${fullPassageText}`);
              toast.success("Verse copied to clipboard");
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded bg-muted/40 py-1 text-[11px] font-medium hover:bg-accent"
          >
            <Copy className="h-3 w-3 text-muted-foreground" />
            <span>Copy Verse Text</span>
          </button>
        </div>
      )}

      {/* Slide Cards Preview for Songs */}
      {item.type === "song" && item.songData && (
        <div className="my-2 flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Song Slides ({item.songData.slides.length})
          </span>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {item.songData.slides.map((slideText, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-lg border border-border/60 bg-card p-2.5 shadow-sm transition hover:border-primary/60"
              >
                <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground mb-1">
                  <span>Slide {idx + 1}</span>
                  <button
                    onClick={() => {
                      projectSongSlide({
                        songId: item.songData!.id,
                        slideIndex: idx,
                        totalSlides: item.songData!.slides.length,
                        title: item.songData!.title,
                        text: slideText,
                      });
                      toast.success(`Projected Slide ${idx + 1}`);
                    }}
                    className="flex h-5 items-center gap-1 rounded bg-primary/10 px-1.5 text-primary hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <Play className="h-2.5 w-2.5 fill-current" />
                    <span>Project</span>
                  </button>
                </div>
                <p className="whitespace-pre-line text-xs text-foreground/90 leading-tight">
                  {slideText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type-Specific Action Buttons */}
      <div className="my-2 flex flex-col gap-2">
        {item.type !== "song" && item.type !== "folder" && (
          <button
            onClick={() => {
              if (item.type === "bible" && item.bibleData) {
                void projectVerse({
                  translation: bibleLang === "en" ? "KJV" : ("TCV" as any),
                  book: item.bibleData.book,
                  chapter: item.bibleData.chapter,
                  verse: item.bibleData.verse,
                  reference: `${item.bibleData.bookName} ${item.bibleData.chapter}:${item.bibleData.verse}`,
                  text: fullPassageText,
                });
                toast.success(`Projecting Passage (${bibleLang.toUpperCase()})`);
              } else {
                onProject(item);
              }
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Project to Screen</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-1.5">
          {onRename && (
            <button
              onClick={() => onRename(item)}
              className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-card py-1.5 text-xs font-medium hover:bg-accent"
            >
              <Pencil className="h-3 w-3 text-muted-foreground" />
              <span>Rename</span>
            </button>
          )}
          {onDuplicate && item.type !== "folder" && (
            <button
              onClick={() => onDuplicate([item])}
              className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-card py-1.5 text-xs font-medium hover:bg-accent"
            >
              <Layers className="h-3 w-3 text-muted-foreground" />
              <span>Duplicate</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete([item])}
              className="flex items-center justify-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 col-span-2"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete File</span>
            </button>
          )}
        </div>
      </div>

      {/* Comprehensive Type-Specific Metadata Section */}
      <div className="mt-3 flex flex-col gap-2 text-xs border-t border-border/60 pt-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Metadata & Properties
        </span>

        <div className="flex items-center justify-between border-b border-border/40 py-1">
          <span className="text-muted-foreground">Type</span>
          <span className="font-semibold capitalize text-foreground">{item.type}</span>
        </div>

        {/* Folder Metadata */}
        {item.folderRecord && (
          <>
            <div className="flex items-center justify-between border-b border-border/40 py-1">
              <span className="text-muted-foreground">Parent Location</span>
              <span className="font-medium text-foreground">{folderParentName}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 py-1">
              <span className="text-muted-foreground">Subfolders</span>
              <span className="font-medium text-foreground">{subfolderCount}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 py-1">
              <span className="text-muted-foreground">Contained Files</span>
              <span className="font-medium text-foreground">{folderItemCount}</span>
            </div>
          </>
        )}

        {/* Bible Verse Metadata */}
        {item.bibleData && (
          <div className="flex items-center justify-between border-b border-border/40 py-1">
            <span className="text-muted-foreground">Testament</span>
            <span className="font-medium text-foreground">{isOldTestament ? "Old Testament" : "New Testament"}</span>
          </div>
        )}

        {/* Song Metadata */}
        {item.songData && (
          <>
            <div className="flex items-center justify-between border-b border-border/40 py-1">
              <span className="text-muted-foreground">Scale / Key</span>
              <span className="font-medium uppercase text-foreground">{item.songData.scale || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 py-1">
              <span className="text-muted-foreground">Slides Count</span>
              <span className="font-medium text-foreground">{item.songData.slides.length}</span>
            </div>
          </>
        )}

        {/* Media Metadata */}
        {item.size !== undefined && (
          <div className="flex items-center justify-between border-b border-border/40 py-1">
            <span className="text-muted-foreground">File Size</span>
            <span className="font-medium tabular-nums text-foreground">{formatBytes(item.size)}</span>
          </div>
        )}

        {item.durationMs !== undefined && (
          <div className="flex items-center justify-between border-b border-border/40 py-1">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium tabular-nums text-foreground">{formatDuration(item.durationMs)}</span>
          </div>
        )}

        {item.width && item.height ? (
          <div className="flex items-center justify-between border-b border-border/40 py-1">
            <span className="text-muted-foreground">Resolution</span>
            <span className="font-medium tabular-nums text-foreground">{item.width} × {item.height}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between border-b border-border/40 py-1">
          <span className="text-muted-foreground">Created</span>
          <span className="font-medium text-muted-foreground tabular-nums">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </aside>
  );
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case "song":
      return <Music className="h-4 w-4 text-purple-400" />;
    case "bible":
      return <BookOpen className="h-4 w-4 text-blue-400" />;
    case "image":
      return <ImageIcon className="h-4 w-4 text-green-400" />;
    case "video":
      return <VideoIcon className="h-4 w-4 text-rose-400" />;
    case "text":
      return <Megaphone className="h-4 w-4 text-amber-400" />;
    default:
      return <Folder className="h-4 w-4 text-amber-400" />;
  }
}
