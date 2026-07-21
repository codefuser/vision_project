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
} from "lucide-react";
import type { LibraryItem } from "./types";
import { formatBytes, formatDuration } from "@/lib/files";
import { Thumb } from "@/components/Thumb";
import { projectSongSlide } from "@/projection/adapters/song.adapter";
import { toast } from "sonner";

interface LibraryPreviewPaneProps {
  item: LibraryItem | null;
  onClose: () => void;
  onProject: (item: LibraryItem) => void;
}

export function LibraryPreviewPane({ item, onClose, onProject }: LibraryPreviewPaneProps) {
  if (!item) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col items-center justify-center border-l border-border bg-card/30 p-4 text-center text-xs text-muted-foreground select-none">
        <Info className="mb-2 h-8 w-8 text-muted-foreground/40" />
        <p className="font-medium text-foreground">No item selected</p>
        <p className="mt-1 text-[11px] opacity-70">
          Select any file to inspect properties & preview slides.
        </p>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-card/60 p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2 min-w-0">
          <TypeIcon type={item.type} />
          <span className="truncate text-xs font-semibold text-foreground">{item.name}</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Close inspector"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Preview Thumbnail / Content View */}
      <div className="my-3 overflow-hidden rounded-lg border border-border bg-black/40 p-2 shadow-inner">
        {item.mediaRecord ? (
          <Thumb media={item.mediaRecord} className="aspect-video w-full rounded" />
        ) : item.type === "song" && item.songData ? (
          <div className="flex flex-col gap-1.5 p-2 bg-muted/20 rounded text-xs">
            <span className="font-bold text-primary">{item.songData.title}</span>
            {item.songData.scale && (
              <span className="text-[10px] uppercase text-muted-foreground">
                Key: {item.songData.scale}
              </span>
            )}
          </div>
        ) : item.type === "bible" && item.bibleData ? (
          <div className="flex flex-col gap-2 p-3 bg-muted/20 rounded text-xs">
            <span className="font-bold text-primary">
              {item.bibleData.bookName} {item.bibleData.chapter}:{item.bibleData.verse}
            </span>
            <p className="mt-1 text-[11px] text-foreground leading-relaxed italic">
              "{item.bibleData.text}"
            </p>
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-muted/10 rounded">
            <Folder className="h-10 w-10 text-amber-400 opacity-60" />
          </div>
        )}
      </div>

      {/* Individual Slide Cards Section for Songs */}
      {item.type === "song" && item.songData && (
        <div className="my-3 flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Slides ({item.songData.slides.length})
          </span>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {item.songData.slides.map((slideText, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-lg border border-border/60 bg-card p-2.5 shadow-sm transition hover:border-primary/60"
              >
                <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground mb-1">
                  <span>Slide {idx + 1}</span>
                  <button
                    onClick={() => {
                      projectSongSlide({ songId: item.songData!.id, slideIndex: idx });
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

      {/* Primary Action Button */}
      {item.type !== "song" && (
        <button
          onClick={() => onProject(item)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Project to Screen</span>
        </button>
      )}

      {/* File Properties Grid */}
      <div className="mt-4 flex flex-col gap-2 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
          File Properties
        </span>

        <div className="flex items-center justify-between border-b border-border/40 py-1">
          <span className="text-muted-foreground">Type</span>
          <span className="font-medium capitalize text-foreground">{item.type}</span>
        </div>

        {item.size !== undefined && (
          <div className="flex items-center justify-between border-b border-border/40 py-1">
            <span className="text-muted-foreground">Size</span>
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
            <span className="text-muted-foreground">Dimensions</span>
            <span className="font-medium tabular-nums text-foreground">{item.width} × {item.height}</span>
          </div>
        ) : null}
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
