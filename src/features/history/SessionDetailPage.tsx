/**
 * SessionDetailPage — /history/$id
 *
 * Full timeline view for a single service session.
 * Features: virtual scrolling timeline, sticky header with stats,
 * search within the session, restore options, export options.
 */
import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Music,
  Image as ImageIcon,
  Video,
  Type,
  Clock,
  Calendar,
  Palette,
  Search,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useSessionHistory } from "./session-history.store";
import { SessionTimeline } from "./SessionTimeline";
import { SessionRestoreDialog } from "./SessionRestoreDialog";
import { SessionExportMenu } from "./SessionExportMenu";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
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

function StatBadge({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 rounded-lg px-3 py-2", color)}>
      <Icon className="h-4 w-4 opacity-70" />
      <div>
        <div className="text-base font-bold tabular-nums leading-tight">{value}</div>
        <div className="text-[10px] opacity-70 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}

export function SessionDetailPage({ id }: Props) {
  const { openSession, openSessionEvents, isLoadingDetail, openSessionById, detailSearchQuery, setDetailSearchQuery } =
    useSessionHistory();

  useEffect(() => {
    void openSessionById(id);
  }, [id, openSessionById]);

  const handleSearchChange = useCallback(
    (q: string) => {
      void setDetailSearchQuery(q);
    },
    [setDetailSearchQuery],
  );

  if (isLoadingDetail) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading session…</p>
        </div>
      </div>
    );
  }

  if (!openSession) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-4xl opacity-30">🔍</div>
        <p className="text-sm text-muted-foreground">Session not found.</p>
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to History
        </Link>
      </div>
    );
  }

  const session = openSession;
  const events = openSessionEvents;
  const duration = formatDuration(session.startedAt, session.endedAt);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* ── Top Bar ── */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <Link
              to="/history"
              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
              title="Back to Service History"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-foreground">
                {session.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(session.startedAt), "EEEE, MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(session.startedAt), "h:mm a")}
                  {session.endedAt && (
                    <> – {format(new Date(session.endedAt), "h:mm a")}</>
                  )}
                  · {duration}
                </span>
                {session.status === "active" && (
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    Recording
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-2">
            <SessionRestoreDialog session={session} events={events} />
            <SessionExportMenu session={session} events={events} />
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="shrink-0 border-b border-border bg-muted/20 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <StatBadge
            icon={BookOpen}
            label="Bible"
            value={session.bibleCount}
            color="bg-blue-500/10 text-blue-400"
          />
          <StatBadge
            icon={Music}
            label="Songs"
            value={session.songCount}
            color="bg-violet-500/10 text-violet-400"
          />
          <StatBadge
            icon={ImageIcon}
            label="Images"
            value={session.imageCount}
            color="bg-amber-500/10 text-amber-400"
          />
          <StatBadge
            icon={Video}
            label="Videos"
            value={session.videoCount}
            color="bg-orange-500/10 text-orange-400"
          />
          <StatBadge
            icon={Type}
            label="Text"
            value={session.textCount}
            color="bg-teal-500/10 text-teal-400"
          />
          <StatBadge
            icon={Palette}
            label="Themes"
            value={session.themeCount}
            color="bg-teal-400/10 text-teal-300"
          />
          {/* Total */}
          <div className="ml-auto flex items-center self-center rounded-lg border border-border bg-card px-3 py-2">
            <div className="text-right">
              <div className="text-base font-bold tabular-nums leading-tight text-foreground">
                {session.totalEvents}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Total Events
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Timeline Search ── */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <input
            id="session-detail-search"
            type="text"
            value={detailSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search events in this session…"
            className="h-8 w-full rounded-md border border-border bg-muted/30 pl-9 pr-8 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition"
          />
          {detailSearchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        {detailSearchQuery && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {events.length} result{events.length !== 1 ? "s" : ""} for "{detailSearchQuery}"
          </p>
        )}
      </div>

      {/* ── Timeline ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border bg-muted/10 px-6 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Timeline
          </span>
        </div>
        <SessionTimeline events={events} />
      </div>
    </div>
  );
}
