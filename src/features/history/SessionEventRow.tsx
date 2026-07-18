import { useState, useCallback, memo } from "react";
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
  RotateCcw,
  ExternalLink,
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

const CONTENT_TYPES = new Set<SessionEventType>([
  "BIBLE_PROJECTED", "SONG_PROJECTED", "IMAGE_PROJECTED", "VIDEO_PROJECTED",
  "TEXT_PROJECTED", "ANNOUNCEMENT_PROJECTED", "THEME_CHANGED", "FONT_CHANGED",
]);

const EVENT_META: Record<SessionEventType, EventMeta> = {
  SESSION_STARTED:     { icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-500/10", badge: "SYS", label: "Session Started" },
  SESSION_ENDED:       { icon: Square, color: "text-rose-400", bg: "bg-rose-500/10", badge: "SYS", label: "Session Ended" },
  PROJECTOR_OPENED:    { icon: Monitor, color: "text-blue-400", bg: "bg-blue-500/10", badge: "SYS", label: "Projector" },
  PROJECTOR_CLOSED:    { icon: MonitorOff, color: "text-slate-400", bg: "bg-slate-500/10", badge: "SYS", label: "Projector" },
  BIBLE_PROJECTED:     { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10", badge: "BIBLE", label: "Bible" },
  SONG_PROJECTED:      { icon: Music, color: "text-violet-400", bg: "bg-violet-500/10", badge: "SONG", label: "Song" },
  IMAGE_PROJECTED:     { icon: ImageIcon, color: "text-amber-400", bg: "bg-amber-500/10", badge: "IMAGE", label: "Image" },
  VIDEO_PROJECTED:     { icon: Video, color: "text-orange-400", bg: "bg-orange-500/10", badge: "VIDEO", label: "Video" },
  TEXT_PROJECTED:      { icon: Type, color: "text-teal-400", bg: "bg-teal-500/10", badge: "TEXT", label: "Text" },
  ANNOUNCEMENT_PROJECTED: { icon: Speaker, color: "text-yellow-400", bg: "bg-yellow-500/10", badge: "ANNC", label: "Annc" },
  PLAYBACK_STARTED:    { icon: Play, color: "text-green-400", bg: "bg-green-500/10", badge: "SYS", label: "Play" },
  PLAYBACK_PAUSED:     { icon: Pause, color: "text-yellow-400", bg: "bg-yellow-500/10", badge: "SYS", label: "Pause" },
  PLAYBACK_STOPPED:    { icon: Square, color: "text-slate-400", bg: "bg-slate-500/10", badge: "SYS", label: "Stop" },
  BLACK_SCREEN_ON:     { icon: Minus, color: "text-slate-300", bg: "bg-slate-300/8", badge: "SYS", label: "Black" },
  BLACK_SCREEN_OFF:    { icon: Minus, color: "text-slate-400", bg: "bg-slate-400/8", badge: "SYS", label: "Black" },
  BLANK_SCREEN_ON:     { icon: Minus, color: "text-slate-300", bg: "bg-slate-300/8", badge: "SYS", label: "Blank" },
  BLANK_SCREEN_OFF:    { icon: Minus, color: "text-slate-400", bg: "bg-slate-400/8", badge: "SYS", label: "Blank" },
  THEME_CHANGED:       { icon: Palette, color: "text-emerald-400", bg: "bg-emerald-500/10", badge: "THEME", label: "Theme" },
  FONT_CHANGED:        { icon: TextCursor, color: "text-indigo-400", bg: "bg-indigo-500/10", badge: "FONT", label: "Font" },
  PLAYLIST_OPENED:     { icon: List, color: "text-cyan-400", bg: "bg-cyan-500/10", badge: "SYS", label: "Playlist" },
  PLAYLIST_ADVANCED:   { icon: SkipForward, color: "text-cyan-300", bg: "bg-cyan-300/10", badge: "SYS", label: "Next" },
  SEARCH_PERFORMED:    { icon: Search, color: "text-purple-400", bg: "bg-purple-500/10", badge: "SYS", label: "Search" },
  MEDIA_IMPORTED:      { icon: Download, color: "text-lime-400", bg: "bg-lime-500/10", badge: "SYS", label: "Import" },
  MEDIA_DELETED:       { icon: Trash2, color: "text-rose-400", bg: "bg-rose-500/10", badge: "SYS", label: "Delete" },
};

function getMeta(eventType: SessionEventType): EventMeta {
  return (
    EVENT_META[eventType] ?? {
      icon: Sparkles,
      color: "text-muted-foreground",
      bg: "bg-muted",
      badge: "EVT",
      label: eventType,
    }
  );
}

interface Props {
  event: SessionEventRecord;
  showTime?: boolean;
}

export const SessionEventRow = memo(function SessionEventRow({ event, showTime }: Props) {
  const [expanded, setExpanded] = useState(false);
  const meta = getMeta(event.eventType);
  const hasDetail = !!event.detail;
  const Icon = meta.icon;
  const isContent = CONTENT_TYPES.has(event.eventType);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(event.label + (event.detail ? ` — ${event.detail}` : ""));
    toast.success("Copied");
  }, [event]);

  const handleProject = useCallback(() => {
    toast.success(`Re-project: ${event.label}`);
  }, [event]);

  return (
    <div className="group flex items-start gap-2.5 rounded-lg px-3 py-2 transition-all duration-150 hover:bg-muted/20">
      <div className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
        meta.bg,
      )}>
        <Icon className={cn("h-3.5 w-3.5", meta.color)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                meta.bg, meta.color,
              )}>
                {meta.badge}
              </span>
              <span className="text-sm font-medium text-foreground/85 truncate">
                {event.label}
              </span>
            </div>
            {event.detail && (
              <p className="mt-0.5 text-[11px] text-muted-foreground/50 line-clamp-1">
                {event.detail}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {isContent && (
              <>
                <button
                  onClick={handleProject}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40 opacity-0 transition-all duration-150 hover:bg-primary/10 hover:text-primary group-hover:opacity-100"
                  title="Project Again"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleCopy}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40 opacity-0 transition-all duration-150 hover:bg-accent/50 hover:text-foreground/70 group-hover:opacity-100"
                  title="Copy Reference"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            {hasDetail && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/30 hover:bg-accent/50 hover:text-foreground/60 transition-all duration-150"
              >
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-150", expanded && "rotate-180")} />
              </button>
            )}
          </div>
        </div>

        {hasDetail && expanded && (
          <div className="mt-1.5 rounded-md border border-white/5 bg-muted/20 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground/60">
            {event.detail}
          </div>
        )}
      </div>
    </div>
  );
});
