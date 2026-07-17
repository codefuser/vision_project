/**
 * SessionCard
 * A single session card displayed in the session list.
 * Shows session name, date, duration, and content counts.
 */
import { memo } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Music,
  Image as ImageIcon,
  Video,
  Type,
  Clock,
  ChevronRight,
  Circle,
} from "lucide-react";
import { format } from "date-fns";
import type { SessionRecord } from "@/db/schema";
import { cn } from "@/lib/utils";
import { SessionRestoreDialog } from "./SessionRestoreDialog";
import type { SessionEventRecord } from "@/db/schema";

interface Props {
  session: SessionRecord;
  events?: SessionEventRecord[]; // Only provided for active-session restore
  isActive?: boolean;
}

function formatDuration(startedAt: number, endedAt: number | null): string {
  if (!endedAt) return "Ongoing";
  const ms = endedAt - startedAt;
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function CountPill({
  icon: Icon,
  count,
  color,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  color: string;
  label: string;
}) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
        color,
      )}
      title={label}
    >
      <Icon className="h-2.5 w-2.5" />
      {count}
    </span>
  );
}

export const SessionCard = memo(function SessionCard({
  session,
  events,
  isActive = false,
}: Props) {
  const startTime = format(new Date(session.startedAt), "hh:mm a");
  const endTime = session.endedAt
    ? format(new Date(session.endedAt), "hh:mm a")
    : null;
  const duration = formatDuration(session.startedAt, session.endedAt);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-200",
        isActive
          ? "border-primary/60 bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
          : "border-border bg-card hover:border-border/80 hover:bg-card/90 hover:shadow-sm",
      )}
    >
      {/* Active recording indicator */}
      {isActive && (
        <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/10 px-4 py-1.5">
          <Circle className="h-2 w-2 fill-red-500 text-red-500 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Recording Now
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {session.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>{format(new Date(session.startedAt), "MMM d, yyyy")}</span>
              <span className="text-muted-foreground/30">·</span>
              <span>
                {startTime}
                {endTime && <> – {endTime}</>}
              </span>
              {!isActive && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {duration}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {/* Quick stats */}
            <span className="text-[11px] text-muted-foreground/60">
              {session.totalEvents} events
            </span>
          </div>
        </div>

        {/* Content count pills */}
        {session.totalEvents > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <CountPill
              icon={BookOpen}
              count={session.bibleCount}
              color="bg-blue-500/10 text-blue-400"
              label={`${session.bibleCount} Bible verses`}
            />
            <CountPill
              icon={Music}
              count={session.songCount}
              color="bg-violet-500/10 text-violet-400"
              label={`${session.songCount} songs`}
            />
            <CountPill
              icon={ImageIcon}
              count={session.imageCount}
              color="bg-amber-500/10 text-amber-400"
              label={`${session.imageCount} images`}
            />
            <CountPill
              icon={Video}
              count={session.videoCount}
              color="bg-orange-500/10 text-orange-400"
              label={`${session.videoCount} videos`}
            />
            <CountPill
              icon={Type}
              count={session.textCount}
              color="bg-teal-500/10 text-teal-400"
              label={`${session.textCount} text slides`}
            />
          </div>
        )}

        {/* Action row */}
        <div className="mt-3 flex items-center justify-between">
          {/* Restore button — only shown for ended sessions */}
          {!isActive && events && (
            <SessionRestoreDialog session={session} events={events} />
          )}
          {isActive && <div />}

          {/* Open detail link */}
          <Link
            to="/history/$id"
            params={{ id: session.id }}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            View Timeline
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
});
