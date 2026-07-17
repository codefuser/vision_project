/**
 * SessionEventRow
 * A single row in the session timeline. Expandable on click to show full detail.
 */
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { SessionEventRecord, SessionEventType } from "@/db/schema";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// ─── Event type metadata ──────────────────────────────────────────────────────

interface EventMeta {
  emoji: string;
  color: string;         // Tailwind text color class
  bg: string;            // Tailwind bg class for the dot/badge
  badge: string;         // Short badge label
}

const EVENT_META: Record<SessionEventType, EventMeta> = {
  SESSION_STARTED:     { emoji: "⚡", color: "text-emerald-500", bg: "bg-emerald-500/15", badge: "SYSTEM" },
  SESSION_ENDED:       { emoji: "🔴", color: "text-rose-500",    bg: "bg-rose-500/15",    badge: "SYSTEM" },
  PROJECTOR_OPENED:    { emoji: "🖥",  color: "text-blue-500",   bg: "bg-blue-500/15",    badge: "SYSTEM" },
  PROJECTOR_CLOSED:    { emoji: "🖥",  color: "text-slate-500",  bg: "bg-slate-500/15",   badge: "SYSTEM" },
  BIBLE_PROJECTED:     { emoji: "📖", color: "text-blue-400",   bg: "bg-blue-400/15",    badge: "BIBLE"  },
  SONG_PROJECTED:      { emoji: "🎵", color: "text-violet-400", bg: "bg-violet-400/15",  badge: "SONG"   },
  IMAGE_PROJECTED:     { emoji: "🖼",  color: "text-amber-400",  bg: "bg-amber-400/15",   badge: "IMAGE"  },
  VIDEO_PROJECTED:     { emoji: "🎬", color: "text-orange-400", bg: "bg-orange-400/15",  badge: "VIDEO"  },
  TEXT_PROJECTED:      { emoji: "📝", color: "text-teal-400",   bg: "bg-teal-400/15",    badge: "TEXT"   },
  ANNOUNCEMENT_PROJECTED: { emoji: "📢", color: "text-yellow-400", bg: "bg-yellow-400/15", badge: "ANNC" },
  PLAYBACK_STARTED:    { emoji: "▶",  color: "text-green-400",  bg: "bg-green-400/15",   badge: "PLAY"   },
  PLAYBACK_PAUSED:     { emoji: "⏸",  color: "text-yellow-400", bg: "bg-yellow-400/15",  badge: "PAUSE"  },
  PLAYBACK_STOPPED:    { emoji: "⏹",  color: "text-slate-400",  bg: "bg-slate-400/15",   badge: "STOP"   },
  BLACK_SCREEN_ON:     { emoji: "⬛", color: "text-slate-300",  bg: "bg-slate-300/10",   badge: "BLACK"  },
  BLACK_SCREEN_OFF:    { emoji: "⬛", color: "text-slate-400",  bg: "bg-slate-400/10",   badge: "BLACK"  },
  BLANK_SCREEN_ON:     { emoji: "⬜", color: "text-slate-300",  bg: "bg-slate-300/10",   badge: "BLANK"  },
  BLANK_SCREEN_OFF:    { emoji: "⬜", color: "text-slate-400",  bg: "bg-slate-400/10",   badge: "BLANK"  },
  THEME_CHANGED:       { emoji: "🎨", color: "text-teal-400",   bg: "bg-teal-400/15",    badge: "THEME"  },
  FONT_CHANGED:        { emoji: "🔤", color: "text-indigo-400", bg: "bg-indigo-400/15",  badge: "FONT"   },
  PLAYLIST_OPENED:     { emoji: "📋", color: "text-cyan-400",   bg: "bg-cyan-400/15",    badge: "LIST"   },
  PLAYLIST_ADVANCED:   { emoji: "⏭",  color: "text-cyan-300",   bg: "bg-cyan-300/15",    badge: "NEXT"   },
  SEARCH_PERFORMED:    { emoji: "🔍", color: "text-purple-400", bg: "bg-purple-400/15",  badge: "SEARCH" },
  MEDIA_IMPORTED:      { emoji: "📥", color: "text-lime-400",   bg: "bg-lime-400/15",    badge: "IMPORT" },
  MEDIA_DELETED:       { emoji: "🗑",  color: "text-rose-400",   bg: "bg-rose-400/15",    badge: "DELETE" },
};

function getMeta(eventType: SessionEventType): EventMeta {
  return (
    EVENT_META[eventType] ?? {
      emoji: "•",
      color: "text-muted-foreground",
      bg: "bg-muted",
      badge: "EVENT",
    }
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  event: SessionEventRecord;
  isFirst?: boolean;
  isLast?: boolean;
  showConnector?: boolean;
}

export function SessionEventRow({
  event,
  isFirst = false,
  isLast = false,
  showConnector = true,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const meta = getMeta(event.eventType);
  const hasDetail = !!event.detail;
  const time = format(new Date(event.ts), "HH:mm");

  return (
    <div className="flex gap-3">
      {/* Time column */}
      <div className="w-11 shrink-0 pt-0.5 text-right text-[11px] tabular-nums text-muted-foreground/60">
        {time}
      </div>

      {/* Connector column */}
      <div className="flex shrink-0 flex-col items-center">
        {/* Top connector line */}
        <div
          className={cn(
            "w-px flex-shrink-0 bg-border",
            isFirst ? "h-3 opacity-0" : "h-3",
          )}
        />
        {/* Dot */}
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
            meta.bg,
          )}
        >
          <span role="img" aria-label={event.eventType} style={{ fontSize: 11 }}>
            {meta.emoji}
          </span>
        </div>
        {/* Bottom connector line */}
        {showConnector && !isLast && (
          <div className="w-px flex-1 bg-border" style={{ minHeight: 16 }} />
        )}
      </div>

      {/* Content column */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-0.5 pb-3",
          isLast && "pb-0",
        )}
      >
        <button
          onClick={() => hasDetail && setExpanded((v) => !v)}
          className={cn(
            "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
            hasDetail
              ? "cursor-pointer hover:bg-accent/40"
              : "cursor-default",
          )}
          disabled={!hasDetail}
        >
          <div className="min-w-0 flex-1">
            <span className={cn("text-sm font-medium leading-tight", meta.color)}>
              {event.label}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                meta.bg,
                meta.color,
              )}
            >
              {meta.badge}
            </span>
            {hasDetail &&
              (expanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
              ))}
          </div>
        </button>

        {/* Expanded detail */}
        {expanded && event.detail && (
          <div className="mx-2 mb-1 rounded-md bg-muted/40 px-3 py-2 text-[12px] leading-relaxed text-muted-foreground">
            {event.detail}
          </div>
        )}
      </div>
    </div>
  );
}
