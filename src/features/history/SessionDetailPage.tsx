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
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { useSessionHistory } from "./session-history.store";
import { SessionTimeline } from "./SessionTimeline";
import { SessionRestoreDialog } from "./SessionRestoreDialog";
import { SessionExportMenu } from "./SessionExportMenu";
import { buildContentGroups, computeContentStats } from "./content-groups";
import type { ContentStats } from "./content-groups";
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

  const stats: ContentStats = useMemo(() => {
    const duration = openSession
      ? formatDuration(openSession.startedAt, openSession.endedAt)
      : "—";
    const groups = buildContentGroups(openSessionEvents);
    return computeContentStats(groups, duration);
  }, [openSessionEvents, openSession]);

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
  const events = openSessionEvents;

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
                  · {stats.sessionDuration}
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

        <div className="hidden lg:flex w-52 shrink-0 flex-col border-l border-border/30 bg-muted/[0.01]">
          <div className="border-b border-border/20 px-3 py-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/30">
              Session Overview
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            <StatSection
              icon={Clock}
              label="Duration"
              value={stats.sessionDuration}
            />

            <div className="border-t border-border/20 pt-3 space-y-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">
                Music
              </p>
              <StatRow
                icon={Music}
                label="Unique Songs"
                value={String(stats.uniqueSongs)}
                color="text-violet-400"
              />
              <StatRow
                icon={Sparkles}
                label="Slides Viewed"
                value={String(stats.slidesViewed)}
                color="text-violet-300"
              />
            </div>

            <div className="border-t border-border/20 pt-3 space-y-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">
                Scripture
              </p>
              <StatRow
                icon={BookOpen}
                label="References"
                value={String(stats.bibleRefs)}
                color="text-blue-400"
              />
              <StatRow
                icon={BookOpen}
                label="Verses Viewed"
                value={String(stats.versesViewed)}
                color="text-blue-300"
              />
            </div>

            <div className="border-t border-border/20 pt-3 space-y-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">
                Media
              </p>
              <StatRow
                icon={ImageIcon}
                label="Images"
                value={String(stats.images)}
                color="text-amber-400"
              />
              <StatRow
                icon={Video}
                label="Videos"
                value={String(stats.videos)}
                color="text-orange-400"
              />
            </div>

            <div className="border-t border-border/20 pt-3 space-y-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">
                Other
              </p>
              <StatRow
                icon={Palette}
                label="Themes"
                value={String(stats.themesUsed)}
                color="text-emerald-400"
              />
              <StatRow
                icon={Type}
                label="Text Items"
                value={String(stats.textItems)}
                color="text-teal-400"
              />
            </div>

            <div className="border-t border-border/20 pt-3 space-y-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">
                Total
              </p>
              <StatRow
                icon={Layers}
                label="Content Items"
                value={String(stats.uniqueSongs + stats.bibleRefs + stats.images + stats.videos + stats.themesUsed + stats.textItems)}
                color="text-foreground/80"
              />
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

function StatRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-muted-foreground/40" />
        <span className="text-[10px] text-muted-foreground/60">{label}</span>
      </div>
      <span className={cn("text-xs font-semibold tabular-nums", color)}>
        {value}
      </span>
    </div>
  );
}
