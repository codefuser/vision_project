import { memo } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Music,
  Image as ImageIcon,
  Video,
  Type,
  Clock,
  Palette,
  ChevronRight,
  Circle,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import type { SessionRecord, SessionEventRecord } from "@/db/schema";
import { cn } from "@/lib/utils";
import { SessionRestoreDialog } from "./SessionRestoreDialog";
import { SessionExportMenu } from "./SessionExportMenu";

interface Props {
  session: SessionRecord;
  events?: SessionEventRecord[];
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

function TypeChip({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
        color,
      )}
    >
      {label}
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
        "group relative overflow-hidden rounded-xl border transition-all duration-150 ease-out",
        isActive
          ? "border-primary/40 bg-primary/[0.04] shadow-[0_0_0_1px_rgba(var(--primary),0.08)]"
          : "border-white/5 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:bg-card/80 hover:border-white/10",
      )}
    >
      {isActive && (
        <div className="flex items-center gap-2 border-b border-primary/15 bg-primary/[0.06] px-3 py-1.5">
          <Circle className="h-1.5 w-1.5 fill-red-500 text-red-500 animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Recording Now
          </span>
        </div>
      )}

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors duration-150">
              {session.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground/60">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(session.startedAt), "MMM d, yyyy")}
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span>
                {startTime}
                {endTime && <> – {endTime}</>}
              </span>
              {!isActive && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {duration}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground/60">
              {session.totalEvents} events
            </span>
          </div>
        </div>

        {session.totalEvents > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <CountIcon
              icon={BookOpen}
              count={session.bibleCount}
              color="text-blue-400"
            />
            <CountIcon
              icon={Music}
              count={session.songCount}
              color="text-violet-400"
            />
            <CountIcon
              icon={ImageIcon}
              count={session.imageCount}
              color="text-amber-400"
            />
            <CountIcon
              icon={Video}
              count={session.videoCount}
              color="text-orange-400"
            />
            <CountIcon
              icon={Type}
              count={session.textCount}
              color="text-teal-400"
            />
            <CountIcon
              icon={Palette}
              count={session.themeCount}
              color="text-emerald-400"
            />
          </div>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-1">
          <TypeChip
            label="Bible"
            count={session.bibleCount}
            color="bg-blue-500/10 text-blue-400"
          />
          <TypeChip
            label="Songs"
            count={session.songCount}
            color="bg-violet-500/10 text-violet-400"
          />
          <TypeChip
            label="Images"
            count={session.imageCount}
            color="bg-amber-500/10 text-amber-400"
          />
          <TypeChip
            label="Videos"
            count={session.videoCount}
            color="bg-orange-500/10 text-orange-400"
          />
          <TypeChip
            label="Text"
            count={session.textCount}
            color="bg-teal-500/10 text-teal-400"
          />
          <TypeChip
            label="Themes"
            count={session.themeCount}
            color="bg-emerald-500/10 text-emerald-400"
          />
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
          {!isActive && events && events.length > 0 && (
            <div className="flex items-center gap-1.5">
              <SessionRestoreDialog session={session} events={events} />
              <SessionExportMenu session={session} events={events} />
            </div>
          )}
          {!isActive && (!events || events.length === 0) && (
            <div />
          )}
          {isActive && <div />}

          <Link
            to="/history/$id"
            params={{ id: session.id }}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground/60 transition-all duration-150 hover:bg-accent/50 hover:text-foreground"
          >
            View Timeline
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
});

function CountIcon({
  icon: Icon,
  count,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  color: string;
}) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
        color,
      )}
    >
      <Icon className="h-3 w-3" />
      {count}
    </span>
  );
}
