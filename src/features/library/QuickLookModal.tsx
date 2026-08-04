import React, { useEffect } from "react";
import { X, Play, Music, BookOpen, ImageIcon, VideoIcon, Megaphone, Star, ExternalLink } from "lucide-react";
import type { LibraryItem } from "./types";
import { formatBytes, formatDuration } from "@/lib/files";
import { Thumb } from "@/components/Thumb";
import { getVerse, type BibleLang } from "@/lib/bible/loader";
import { cn } from "@/lib/utils";

import { ShortcutTooltip } from "@/components/ShortcutTooltip";

interface QuickLookModalProps {
  item: LibraryItem | null;
  open: boolean;
  bibleLang: BibleLang;
  onClose: () => void;
  onProject: (item: LibraryItem) => void;
}

export function QuickLookModal({ item, open, bibleLang, onClose, onProject }: QuickLookModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !item) return null;

  let fullPassageText = "";
  if (item.type === "bible" && item.bibleData) {
    const start = item.bibleData.verse;
    const end = item.bibleData.verseEnd || start;
    const lines: string[] = [];
    for (let v = start; v <= end; v++) {
      const line = getVerse(bibleLang, item.bibleData.book, item.bibleData.chapter, v);
      if (line) lines.push(`[${v}] ${line}`);
    }
    fullPassageText = lines.join("\n\n") || item.bibleData.text || "";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="relative flex h-[80vh] w-[85vw] max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-card/95 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/50 px-4 bg-muted/30">
          <div className="flex items-center gap-2 min-w-0">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              {item.type}
            </span>
            <span className="truncate text-sm font-semibold text-foreground">{item.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onProject(item)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Project Live
            </button>
            <ShortcutTooltip label="Close (ESC or Space)">
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground transition"
              >
                <X className="h-4 w-4" />
              </button>
            </ShortcutTooltip>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden p-6">
          {item.mediaRecord ? (
            <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-black/60 border border-white/10 p-2">
              <Thumb media={item.mediaRecord} className="h-full w-full object-contain rounded-lg" />
            </div>
          ) : item.type === "song" && item.songData ? (
            <div className="flex h-full w-full flex-col overflow-y-auto rounded-xl bg-muted/20 border border-border/60 p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">{item.songData.title}</h2>
              <div className="grid gap-3">
                {item.songData.slides.map((slide, idx) => (
                  <div key={idx} className="rounded-lg border border-border/80 bg-card p-4 shadow-sm">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Slide {idx + 1} of {item.songData?.slides.length}
                    </span>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-medium">{slide}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : item.type === "bible" && item.bibleData ? (
            <div className="flex h-full w-full flex-col overflow-y-auto rounded-xl bg-amber-500/5 border border-amber-500/20 p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-500/20">
                <h2 className="text-lg font-bold text-amber-500">{item.name}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  {bibleLang.toUpperCase()} Translation
                </span>
              </div>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground font-serif">
                {fullPassageText}
              </p>
            </div>
          ) : item.type === "text" && item.textData ? (
            <div className="flex h-full w-full flex-col overflow-y-auto rounded-xl bg-card border border-border/60 p-6">
              <h2 className="text-lg font-bold text-foreground mb-3">{item.name}</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground font-mono">
                {item.textData.content}
              </p>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No direct preview available.
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="flex h-10 shrink-0 items-center justify-between border-t border-border/50 px-4 bg-muted/20 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {item.size ? <span>Size: {formatBytes(item.size)}</span> : null}
            {item.width && item.height ? (
              <span>
                Dimensions: {item.width} × {item.height}
              </span>
            ) : null}
            {item.durationMs ? <span>Duration: {formatDuration(item.durationMs)}</span> : null}
          </div>
          <div className="text-[11px] opacity-70">Press Space or ESC to close</div>
        </div>
      </div>
    </div>
  );
}
