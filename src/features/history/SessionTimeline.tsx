import { useMemo, useState, useCallback } from "react";
import {
  BookOpen,
  Music,
  Image as ImageIcon,
  Video,
  Type,
  Palette,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import type { SessionEventRecord, SessionEventType } from "@/db/schema";
import { SessionEventRow } from "./SessionEventRow";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  events: SessionEventRecord[];
}

const CONTENT_TYPES = new Set<SessionEventType>([
  "BIBLE_PROJECTED", "SONG_PROJECTED", "IMAGE_PROJECTED", "VIDEO_PROJECTED",
  "TEXT_PROJECTED", "ANNOUNCEMENT_PROJECTED", "THEME_CHANGED", "FONT_CHANGED",
]);

interface EventCard {
  id: string;
  eventType: SessionEventType;
  label: string;
  detail: string | null;
  events: SessionEventRecord[];
  count: number;
}

interface TimeBucket {
  minuteKey: string;
  ts: number;
  cards: EventCard[];
}

function getMinuteKey(ts: number): string {
  return format(new Date(ts), "h:mm a");
}

function buildTimeline(events: SessionEventRecord[]): TimeBucket[] {
  const contentEvents = events.filter((e) => CONTENT_TYPES.has(e.eventType));

  if (!contentEvents.length) return [];

  const buckets = new Map<string, EventCard[]>();

  let i = 0;
  while (i < contentEvents.length) {
    const event = contentEvents[i];
    const minuteKey = getMinuteKey(event.ts);

    const card: EventCard = {
      id: event.id,
      eventType: event.eventType,
      label: event.label,
      detail: event.detail,
      events: [event],
      count: 1,
    };

    if (event.eventType === "SONG_PROJECTED") {
      let j = i + 1;
      while (
        j < contentEvents.length &&
        contentEvents[j].eventType === "SONG_PROJECTED" &&
        contentEvents[j].label === event.label
      ) {
        card.events.push(contentEvents[j]);
        card.count++;
        j++;
      }
      card.detail = `Slides 1–${card.count}`;
      i = j;
    } else {
      i++;
    }

    const existing = buckets.get(minuteKey) ?? [];
    existing.push(card);
    buckets.set(minuteKey, existing);
  }

  return Array.from(buckets.entries())
    .map(([minuteKey, cards]) => ({
      minuteKey,
      ts: cards[0].events[0].ts,
      cards,
    }))
    .sort((a, b) => a.ts - b.ts);
}

export function SessionTimeline({ events }: Props) {
  const [showSystem, setShowSystem] = useState(false);

  const timeline = useMemo(() => buildTimeline(events), [events]);
  const systemEvents = useMemo(
    () => events.filter((e) => !CONTENT_TYPES.has(e.eventType)),
    [events],
  );

  const toggleSystem = useCallback(() => {
    setShowSystem((v) => !v);
  }, []);

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 text-2xl opacity-30">📋</div>
        <p className="text-xs font-medium text-muted-foreground/60">No events recorded</p>
        <p className="mt-1 text-[10px] text-muted-foreground/40">
          Events will appear here as the service progresses.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="py-2">
        {timeline.map((bucket) => (
          <div key={bucket.minuteKey}>
            <TimeSeparator label={bucket.minuteKey} />

            {bucket.cards.map((card) => (
              <SessionEventRow key={card.id} event={card.events[0]} />
            ))}
          </div>
        ))}

        {systemEvents.length > 0 && (
          <div className="mt-2 border-t border-border/20 pt-2">
            <button
              onClick={toggleSystem}
              className="flex w-full items-center gap-2 px-4 py-2 text-left transition-all duration-150 hover:bg-muted/20"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-muted/40">
                {showSystem ? (
                  <EyeOff className="h-3 w-3 text-muted-foreground/50" />
                ) : (
                  <Eye className="h-3 w-3 text-muted-foreground/50" />
                )}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground/50">
                {showSystem ? "Hide" : "Show"} {systemEvents.length} system event{systemEvents.length !== 1 ? "s" : ""}
              </span>
            </button>

            {showSystem && (
              <div>
                {systemEvents.map((event) => (
                  <SessionEventRow key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TimeSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-1.5">
      <div className="h-px flex-1 bg-border/20" />
      <span className="shrink-0 text-[10px] font-semibold tabular-nums text-muted-foreground/40">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/20" />
    </div>
  );
}
