import { useEffect, useMemo, useRef, useCallback } from "react";
import { useShortcut, useShortcutScope } from "@/lib/shortcuts/use-shortcut";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { History, Radio, Calendar, Clock, Circle, Layers } from "lucide-react";
import { useSessionHistory } from "./session-history.store";
import { SessionCard } from "./SessionCard";
import { SessionSearchBar } from "./SessionSearchBar";
import { sessionRecorder } from "./session-recorder";
import type { SessionRecord } from "@/db/schema";
import { cn } from "@/lib/utils";

function getDateGroup(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return "This Week";
  if (isThisMonth(date)) return "This Month";
  return format(date, "MMMM yyyy");
}

type ListItem =
  | { kind: "header"; label: string }
  | { kind: "session-row"; sessions: SessionRecord[] };

function buildListItems(sessions: SessionRecord[]): ListItem[] {
  const items: ListItem[] = [];
  let lastGroup = "";
  let currentRow: SessionRecord[] = [];

  for (const session of sessions) {
    const group = getDateGroup(session.date);
    if (group !== lastGroup) {
      if (currentRow.length > 0) {
        items.push({ kind: "session-row", sessions: currentRow });
        currentRow = [];
      }
      items.push({ kind: "header", label: group });
      lastGroup = group;
    }
    currentRow.push(session);
    if (currentRow.length === 3) {
      items.push({ kind: "session-row", sessions: currentRow });
      currentRow = [];
    }
  }

  if (currentRow.length > 0) {
    items.push({ kind: "session-row", sessions: currentRow });
  }

  return items;
}

function formatDurationMs(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function SessionListPage() {
  const {
    sessions,
    totalSessions,
    isLoadingSessions,
    searchQuery,
    dateFilter,
    loadSessions,
    loadMoreSessions,
    setSearchQuery,
    setDateFilter,
  } = useSessionHistory();

  const activeSessionId = useSessionHistory((s) => s.activeSessionId);
  const setActiveSessionId = useSessionHistory((s) => s.setActiveSessionId);
  const parentRef = useRef<HTMLDivElement>(null);
  const searchInputId = "session-search-input";

  // ───────── History keyboard shortcuts ─────────
  useShortcutScope("history");

  useShortcut({
    id: "history.focus-search",
    label: "Focus session search",
    category: "history",
    description: "Focus the history search box",
    keys: ["/"],
    scope: "history",
    allowInInput: false,
    handler: () => {
      const el = document.getElementById(searchInputId) as HTMLInputElement | null;
      el?.focus();
    },
  });

  // Listen for the global focus-search event dispatched by Alt+7
  useEffect(() => {
    const handler = () => {
      const el = document.getElementById(searchInputId) as HTMLInputElement | null;
      el?.focus();
    };
    window.addEventListener("history:focus-search", handler);
    return () => window.removeEventListener("history:focus-search", handler);
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const listItems = useMemo(() => buildListItems(sessions), [sessions]);

  const rowVirtualizer = useVirtualizer({
    count: listItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = listItems[index];
      return item?.kind === "header" ? 36 : 200;
    },
    overscan: 3,
  });

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 300;
    if (nearBottom && !isLoadingSessions && sessions.length < totalSessions) {
      void loadMoreSessions();
    }
  }, [isLoadingSessions, loadMoreSessions, sessions.length, totalSessions]);

  const handleEndService = useCallback(() => {
    sessionRecorder.stop();
    setActiveSessionId(null);
    void loadSessions();
  }, [loadSessions, setActiveSessionId]);

  const virtualItems = rowVirtualizer.getVirtualItems();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaySessions = useMemo(
    () => sessions.filter((s) => s.date === todayStr).length,
    [sessions, todayStr],
  );
  const totalItems = useMemo(
    () => sessions.reduce((sum, s) => sum + s.totalEvents, 0),
    [sessions],
  );
  const totalDuration = useMemo(
    () =>
      sessions.reduce((sum, s) => {
        if (!s.endedAt) return sum;
        return sum + (s.endedAt - s.startedAt);
      }, 0),
    [sessions],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="shrink-0 border-b border-border/40 bg-background px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/[0.08]">
              <History className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Service History</h1>
              <p className="text-[10px] text-muted-foreground/60">
                {totalSessions} session{totalSessions !== 1 ? "s" : ""} recorded
              </p>
            </div>
          </div>

          {activeSessionId && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/[0.08] px-2 py-1 text-[10px] font-medium text-red-400">
                <Radio className="h-3 w-3 animate-pulse" />
                Recording
              </div>
              <button
                id="end-service-btn"
                onClick={handleEndService}
                className="rounded-md border border-border/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground/60 transition-all duration-150 hover:border-destructive/30 hover:bg-destructive/[0.08] hover:text-destructive"
              >
                End Service
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <SummaryWidget
            icon={Calendar}
            label="Today"
            value={String(todaySessions)}
            color="text-blue-400"
            bg="bg-blue-500/[0.08]"
          />
          <SummaryWidget
            icon={Circle}
            label="Total Sessions"
            value={String(totalSessions)}
            color="text-violet-400"
            bg="bg-violet-500/[0.08]"
          />
          <SummaryWidget
            icon={Layers}
            label="Items"
            value={String(totalItems)}
            color="text-amber-400"
            bg="bg-amber-500/[0.08]"
          />
          <SummaryWidget
            icon={Clock}
            label="Total Time"
            value={totalDuration > 0 ? formatDurationMs(totalDuration) : "—"}
            color="text-emerald-400"
            bg="bg-emerald-500/[0.08]"
          />
        </div>
      </div>

      <SessionSearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        filter={dateFilter}
        onFilterChange={setDateFilter}
      />

      {isLoadingSessions && sessions.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="text-xs">Loading sessions…</p>
          </div>
        </div>
      ) : listItems.length === 0 ? (
        <EmptyState hasQuery={!!searchQuery} />
      ) : (
        <div
          ref={parentRef}
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
          style={{ contain: "strict" }}
        >
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
              }}
            >
              {virtualItems.map((virtualRow) => {
                const item = listItems[virtualRow.index];
                if (!item) return null;

                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                  >
                    {item.kind === "header" ? (
                      <DateGroupHeader label={item.label} />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-4 pb-3">
                        {item.sessions.map((session) => (
                          <SessionCard
                            key={session.id}
                            session={session}
                            isActive={session.id === activeSessionId}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {isLoadingSessions && sessions.length > 0 && (
            <div className="flex justify-center py-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryWidget({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-card/40 px-3 py-2.5 transition-all duration-150 hover:bg-card/60">
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", bg)}>
        <Icon className={cn("h-4 w-4", color)} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold tabular-nums leading-tight text-foreground/90">
          {value}
        </div>
        <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/50">
          {label}
        </div>
      </div>
    </div>
  );
}

function DateGroupHeader({ label }: { label: string }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/80 px-4 py-1.5 backdrop-blur-xl">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/30" />
    </div>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/30">
        <span className="text-2xl opacity-50">{hasQuery ? "🔍" : "📋"}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground/80">
          {hasQuery ? "No sessions found" : "No sessions yet"}
        </p>
        <p className="mt-1 max-w-xs text-[11px] text-muted-foreground/60">
          {hasQuery
            ? "Try a different search term or clear the filters."
            : "Your service history will appear here automatically as you use Vision Projector."}
        </p>
      </div>
    </div>
  );
}
