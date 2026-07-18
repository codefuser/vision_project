import { useEffect, useMemo, useCallback } from "react";
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
  Layers,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { useSessionHistory } from "./session-history.store";
import type { SessionEventRecord } from "@/db/schema";
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

export function SessionDetailPage({ id }: Props) {
  const {
    openSession,
    openSessionEvents,
    isLoadingDetail,
    openSessionById,
    detailSearchQuery,
    setDetailSearchQuery,
  } = useSessionHistory();

  useEffect(() => {
    void openSessionById(id);
  }, [id, openSessionById]);

  const handleSearchChange = useCallback(
    (q: string) => {
      void setDetailSearchQuery(q);
    },
    [setDetailSearchQuery],
  );

  const events = openSessionEvents;
  const stats = useMemo(() => ({
    bibleCount: events.filter((e) => e.eventType === "BIBLE_PROJECTED").length,
    songCount: events.filter((e) => e.eventType === "SONG_PROJECTED").length,
    imageCount: events.filter((e) => e.eventType === "IMAGE_PROJECTED").length,
    videoCount: events.filter((e) => e.eventType === "VIDEO_PROJECTED").length,
    textCount: events.filter((e) => e.eventType === "TEXT_PROJECTED" || e.eventType === "ANNOUNCEMENT_PROJECTED").length,
    themeCount: events.filter((e) => e.eventType === "THEME_CHANGED").length,
  }), [events]);

  if (isLoadingDetail) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-xs">Loading session…</p>
        </div>
      </div>
    );
  }

  if (!openSession) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <span className="text-2xl opacity-30">🔍</span>
        <p className="text-xs text-muted-foreground">Session not found.</p>
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity duration-150"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to History
        </Link>
      </div>
    );
  }

  const session = openSession;
  const duration = formatDuration(session.startedAt, session.endedAt);
  const totalItems = stats.bibleCount + stats.songCount + stats.imageCount + stats.videoCount + stats.textCount;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="shrink-0 border-b border-border/40 bg-background px-4 py-2.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5 min-w-0">
            <Link
              to="/history"
              className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/50 text-muted-foreground/60 transition-all duration-150 hover:bg-accent/50 hover:text-foreground"
              title="Back to Service History"
            >
              <ArrowLeft className="h-3 w-3" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-foreground/90">
                {session.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground/50">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(session.startedAt), "EEEE, MMMM d, yyyy")}
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(session.startedAt), "h:mm a")}
                  {session.endedAt && (
                    <> – {format(new Date(session.endedAt), "h:mm a")}</>
                  )}
                  · {duration}
                </span>
                {session.status === "active" && (
                  <span className="flex items-center gap-1 text-red-400/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    Recording
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <SessionRestoreDialog session={session} events={events} />
            <SessionExportMenu session={session} events={events} />
          </div>
        </div>
      </div>

      <div className="shrink-0 border-b border-border/30 bg-muted/[0.02] px-4 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40" />
          <input
            id="session-detail-search"
            type="text"
            value={detailSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search songs, Bible, media, text…"
            className="h-7 w-full rounded-md border border-border/40 bg-muted/20 pl-7 pr-7 text-[11px] text-foreground placeholder:text-muted-foreground/30 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/15 transition"
          />
          {detailSearchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors duration-150"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <SessionTimeline events={events} />
        </div>

        <div className="hidden lg:flex w-48 shrink-0 flex-col border-l border-border/30 bg-muted/[0.01]">
          <div className="border-b border-border/20 px-3 py-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/30">
              Details
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            <StatSection
              icon={Clock}
              label="Session Duration"
              value={duration}
            />
            <StatSection
              icon={Layers}
              label="Items Projected"
              value={String(totalItems)}
            />

            <div className="border-t border-border/20 pt-3 space-y-1.5">
              <StatRowWithCount icon={Music} label="Songs" count={stats.songCount} color="text-violet-400" />
              <StatRowWithCount icon={BookOpen} label="Bible" count={stats.bibleCount} color="text-blue-400" />
              <StatRowWithCount icon={ImageIcon} label="Images" count={stats.imageCount} color="text-amber-400" />
              <StatRowWithCount icon={Video} label="Videos" count={stats.videoCount} color="text-orange-400" />
              <StatRowWithCount icon={Type} label="Text" count={stats.textCount} color="text-teal-400" />
              <StatRowWithCount icon={Palette} label="Themes" count={stats.themeCount} color="text-emerald-400" />
            </div>

            <div className="border-t border-border/20 pt-3 space-y-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">
                Restore
              </p>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] text-foreground/70 transition-all duration-150 hover:bg-primary/10 hover:text-primary">
                <RotateCcw className="h-3 w-3" />
                Entire Service
              </button>
              {stats.songCount > 0 && (
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground/60 transition-all duration-150 hover:bg-violet-500/10 hover:text-violet-400">
                  <Music className="h-3 w-3" />
                  Songs Only
                </button>
              )}
              {stats.bibleCount > 0 && (
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground/60 transition-all duration-150 hover:bg-blue-500/10 hover:text-blue-400">
                  <BookOpen className="h-3 w-3" />
                  Bible Only
                </button>
              )}
              {(stats.imageCount > 0 || stats.videoCount > 0) && (
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground/60 transition-all duration-150 hover:bg-amber-500/10 hover:text-amber-400">
                  <ImageIcon className="h-3 w-3" />
                  Media Only
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatSection({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-muted-foreground/40" />
        <span className="text-sm font-semibold tabular-nums leading-tight text-foreground/80">
          {value}
        </span>
      </div>
      <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/30 mt-0.5">
        {label}
      </div>
    </div>
  );
}

function StatRowWithCount({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-muted-foreground/40" />
        <span className="text-[10px] text-muted-foreground/60">{label}</span>
      </div>
      <span className={cn("text-xs font-semibold tabular-nums", color)}>
        {count}
      </span>
    </div>
  );
}
