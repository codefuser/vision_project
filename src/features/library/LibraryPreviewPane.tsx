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
  Calendar,
  HardDrive,
  Maximize2,
} from "lucide-react";
import type { LibraryItem } from "./types";
import { formatBytes, formatDuration } from "@/lib/files";
import { Thumb } from "@/components/Thumb";

interface LibraryPreviewPaneProps {
  item: LibraryItem | null;
  onClose: () => void;
  onProject: (item: LibraryItem) => void;
}

export function LibraryPreviewPane({ item, onClose, onProject }: LibraryPreviewPaneProps) {
  if (!item) {
    return (
      <aside className="flex h-full w-72 shrink-0 flex-col items-center justify-center border-l border-border bg-card/30 p-4 text-center text-xs text-muted-foreground select-none">
        <Info className="mb-2 h-8 w-8 text-muted-foreground/40" />
        <p className="font-medium text-foreground">No item selected</p>
        <p className="mt-1 text-[11px] opacity-70">
          Select any song, Bible verse, media, or text file to inspect properties & preview.
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
      <div className="my-4 overflow-hidden rounded-lg border border-border bg-black/40 p-2 shadow-inner">
        {item.mediaRecord ? (
          <Thumb media={item.mediaRecord} className="aspect-video w-full rounded" />
        ) : item.type === "song" && item.songData ? (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 bg-muted/20 rounded font-sans text-xs">
            <span className="font-bold text-primary">{item.songData.title}</span>
            {item.songData.scale && (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Key: {item.songData.scale}
              </span>
            )}
            <div className="mt-1 space-y-1.5 text-[11px] text-muted-foreground">
              {item.songData.slides.slice(0, 3).map((slide, i) => (
                <div key={i} className="rounded border border-border/40 bg-background/60 p-1.5">
                  <p className="line-clamp-3 whitespace-pre-line">{slide}</p>
                </div>
              ))}
              {item.songData.slides.length > 3 && (
                <span className="text-[10px] italic opacity-60">
                  +{item.songData.slides.length - 3} more slides
                </span>
              )}
            </div>
          </div>
        ) : item.type === "bible" && item.bibleData ? (
          <div className="flex flex-col gap-2 p-3 bg-muted/20 rounded text-xs">
            <span className="font-bold text-primary">
              {item.bibleData.bookName} {item.bibleData.chapter}:{item.bibleData.verse}
            </span>
            <p className="mt-1 text-[11px] text-foreground leading-relaxed italic">
              "{item.bibleData.text}"
            </p>
            <span className="text-[10px] text-muted-foreground uppercase">
              Translation: {item.bibleData.translation}
            </span>
          </div>
        ) : item.type === "text" && item.textData ? (
          <div className="p-3 text-xs bg-muted/20 rounded max-h-48 overflow-y-auto whitespace-pre-wrap">
            {item.textData.content}
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-muted/10 rounded">
            <Folder className="h-10 w-10 text-amber-400 opacity-60" />
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => onProject(item)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
      >
        <Play className="h-3.5 w-3.5 fill-current" />
        <span>Project to Screen</span>
      </button>

      {/* File Properties & Metadata Grid */}
      <div className="mt-6 flex flex-col gap-2.5 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
          Item Properties
        </span>

        <div className="flex items-center justify-between border-b border-border/40 py-1">
          <span className="text-muted-foreground">Type</span>
          <span className="font-medium capitalize text-foreground">{item.type}</span>
        </div>

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
          <span className="font-medium tabular-nums text-foreground">
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
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
