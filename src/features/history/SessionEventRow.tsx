import { useState, useCallback } from "react";
import {
  ChevronDown,
  BookOpen,
  Music,
  Image as ImageIcon,
  Video,
  Type,
  Palette,
  Play,
  Copy,
  Monitor,
  MonitorOff,
  Square,
  Pause,
  List,
  SkipForward,
  Search,
  Download,
  Trash2,
  Speaker,
  Minus,
  Sparkles,
  TextCursor,
} from "lucide-react";
import type { SessionEventRecord, SessionEventType } from "@/db/schema";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EventMeta {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  badge: string;
  label: string;
}

const EVENT_META: Record<SessionEventType, EventMeta> = {
  SESSION_STARTED:     { icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-500/10", badge: "SYSTEM", label: "Session Started" },
  SESSION_ENDED:       { icon: Square, color: "text-rose-400", bg: "bg-rose-500/10", badge: "SYSTEM", label: "Session Ended" },
  PROJECTOR_OPENED:    { icon: Monitor, color: "text-blue-400", bg: "bg-blue-500/10", badge: "SYSTEM", label: "Projector Opened" },
  PROJECTOR_CLOSED:    { icon: MonitorOff, color: "text-slate-400", bg: "bg-slate-500/10", badge: "SYSTEM", label: "Projector Closed" },
  BIBLE_PROJECTED:     { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10", badge: "BIBLE", label: "Bible" },
  SONG_PROJECTED:      { icon: Music, color: "text-violet-400", bg: "bg-violet-500/10", badge: "SONG", label: "Song" },
  IMAGE_PROJECTED:     { icon: ImageIcon, color: "text-amber-400", bg: "bg-amber-500/10", badge: "IMAGE", label: "Image" },
  VIDEO_PROJECTED:     { icon: Video, color: "text-orange-400", bg: "bg-orange-500/10", badge: "VIDEO", label: "Video" },
  TEXT_PROJECTED:      { icon: Type, color: "text-teal-400", bg: "bg-teal-500/10", badge: "TEXT", label: "Text" },
  ANNOUNCEMENT_PROJECTED: { icon: Speaker, color: "text-yellow-400", bg: "bg-yellow-500/10", badge: "ANNC", label: "Announcement" },
  PLAYBACK_STARTED:    { icon: Play, color: "text-green-400", bg: "bg-green-500/10", badge: "PLAY", label: "Playback Started" },
  PLAYBACK_PAUSED:     { icon: Pause, color: "text-yellow-400", bg: "bg-yellow-500/10", badge: "PAUSE", label: "Playback Paused" },
  PLAYBACK_STOPPED:    { icon: Square, color: "text-slate-400", bg: "bg-slate-500/10", badge: "STOP", label: "Playback Stopped" },
  BLACK_SCREEN_ON:     { icon: Minus, color: "text-slate-300", bg: "bg-slate-300/8", badge: "BLACK", label: "Black Screen" },
  BLACK_SCREEN_OFF:    { icon: Minus, color: "text-slate-400", bg: "bg-slate-400/8", badge: "BLACK", label: "Black Screen Off" },
  BLANK_SCREEN_ON:     { icon: Minus, color: "text-slate-300", bg: "bg-slate-300/8", badge: "BLANK", label: "Blank Screen" },
  BLANK_SCREEN_OFF:    { icon: Minus, color: "text-slate-400", bg: "bg-slate-400/8", badge: "BLANK", label: "Blank Screen Off" },
  THEME_CHANGED:       { icon: Palette, color: "text-emerald-400", bg: "bg-emerald-500/10", badge: "THEME", label: "Theme" },
  FONT_CHANGED:        { icon: TextCursor, color: "text-indigo-400", bg: "bg-indigo-500/10", badge: "FONT", label: "Font" },
  PLAYLIST_OPENED:     { icon: List, color: "text-cyan-400", bg: "bg-cyan-500/10", badge: "LIST", label: "Playlist" },
  PLAYLIST_ADVANCED:   { icon: SkipForward, color: "text-cyan-300", bg: "bg-cyan-300/10", badge: "NEXT", label: "Playlist Next" },
  SEARCH_PERFORMED:    { icon: Search, color: "text-purple-400", bg: "bg-purple-500/10", badge: "SEARCH", label: "Search" },
  MEDIA_IMPORTED:      { icon: Download, color: "text-lime-400", bg: "bg-lime-500/10", badge: "IMPORT", label: "Media Imported" },
  MEDIA_DELETED:       { icon: Trash2, color: "text-rose-400", bg: "bg-rose-500/10", badge: "DELETE", label: "Media Deleted" },
};

function getMeta(eventType: SessionEventType): EventMeta {
  return (
    EVENT_META[eventType] ?? {
      icon: Sparkles,
      color: "text-muted-foreground",
      bg: "bg-muted",
      badge: "EVENT",
      label: eventType,
    }
  );
}

function isContentEvent(eventType: SessionEventType): boolean {
  return ["BIBLE_PROJECTED", "SONG_PROJECTED", "IMAGE_PROJECTED", "VIDEO_PROJECTED", "TEXT_PROJECTED", "ANNOUNCEMENT_PROJECTED"].includes(eventType);
}

interface Props {
  event: SessionEventRecord;
}

export function SessionEventRow({ event }: Props) {
  const [expanded, setExpanded] = useState(false);
  const meta = getMeta(event.eventType);
  const hasDetail = !!event.detail;
  const time = format(new Date(event.ts), "HH:mm");
  const Icon = meta.icon;

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(event.label + (event.detail ? ` — ${event.detail}` : ""));
    toast.success("Copied to clipboard");
  }, [event]);

  const isContent = isContentEvent(event.eventType);

  return (
    <div className="group flex gap-3 px-4 py-1.5 transition-colors duration-150 hover:bg-muted/20">
      <div className="w-10 shrink-0 pt-2 text-right text-[10px] tabular-nums text-muted-foreground/40 font-medium">
        {time}
      </div>

      <div className="flex shrink-0 flex-col items-center pt-2">
        <div className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          meta.bg,
        )}>
          <Icon className={cn("h-2.5 w-2.5", meta.color)} />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider",
                meta.bg, meta.color,
              )}>
                {meta.badge}
              </span>
              <span className="text-xs font-medium text-foreground/80 truncate">
                {event.label}
              </span>
            </div>
            {event.detail && (
              <p className="mt-0.5 text-[10px] text-muted-foreground/50 line-clamp-1">
                {event.detail}
              </p>
            )}
          </div>

          {isContent && (
            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <button
                onClick={handleCopy}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/40 hover:bg-accent/50 hover:text-foreground/70 transition-all duration-150"
                title="Copy"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {hasDetail && expanded && (
          <div className="mt-1.5 rounded-md border border-white/5 bg-muted/20 px-2.5 py-1.5 text-[10px] leading-relaxed text-muted-foreground/60">
            {event.detail}
          </div>
        )}

        {hasDetail && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-0.5 flex items-center gap-1 text-[9px] font-medium text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-150"
          >
            <ChevronDown className={cn(
              "h-2.5 w-2.5 transition-transform duration-150",
              expanded && "rotate-180",
            )} />
            {expanded ? "Less" : "More"}
          </button>
        )}
      </div>
    </div>
  );
}
