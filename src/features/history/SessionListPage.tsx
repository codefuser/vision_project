/**
 * SessionListPage — /history
 *
 * Service History landing page. Shows all sessions grouped by date
 * (Today / Yesterday / Last Week / Last Month / Older) with a sticky
 * search bar and date filter chips. Virtual scrolling for performance.
 */
import { useEffect, useMemo, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { History, Radio } from "lucide-react";
import { useSessionHistory } from "./session-history.store";
import { SessionCard } from "./SessionCard";
import { SessionSearchBar } from "./SessionSearchBar";
import { sessionRecorder } from "./session-recorder";
import type { SessionRecord } from "@/db/schema";
import { cn } from "@/lib/utils";

// ─── Date grouping ────────────────────────────────────────────────────────────

function getDateGroup(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00"); // Noon to avoid TZ issues
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return "This Week";
  if (isThisMonth(date)) return "This Month";
  return format(date, "MMMM yyyy");
}

type ListItem =
  | { kind: "header"; label: string }
  | { kind: "session"; session: SessionRecord };

function buildListItems(sessions: SessionRecord[]): ListItem[] {
  const items: ListItem[] = [];
  let lastGroup = "";

  for (const session of sessions) {
    const group = getDateGroup(session.date);
    if (group !== lastGroup) {
      items.push({ kind: "header", label: group });
      lastGroup = group;
    }
    items.push({ kind: "session", session });
  }

  return items;
}

// ─── Main component ───────────────────────────────────────────────────────────

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

  // Initial load
  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  // Build flat list items with date group headers
  const listItems = useMemo(() => buildListItems(sessions), [sessions]);

  const rowVirtualizer = useVirtualizer({
    count: listItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = listItems[index];
      return item?.kind === "header" ? 40 : 140;
    },
    overscan: 5,
  });

  // Infinite scroll: load more when near the bottom
  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (nearBottom && !isLoadingSessions && sessions.length < totalSessions) {
      void loadMoreSessions();
    }
  }, [isLoadingSessions, loadMoreSessions, sessions.length, totalSessions]);

  // End session handler
  const handleEndService = useCallback(() => {
    sessionRecorder.stop();
    setActiveSessionId(null);
    void loadSessions();
  }, [loadSessions, setActiveSessionId]);

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* ── Page Header ── */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <History className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">Service History</h1>
              <p className="text-[11px] text-muted-foreground">
                {totalSessions} session{totalSessions !== 1 ? "s" : ""} recorded
              </p>
            </div>
          </div>

          {/* Active session controls */}
          {activeSessionId && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-400">
                <Radio className="h-3 w-3 animate-pulse" />
                Recording
              </div>
              <button
                id="end-service-btn"
                onClick={handleEndService}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
              >
                End Service
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky Search Bar ── */}
      <SessionSearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        filter={dateFilter}
        onFilterChange={setDateFilter}
      />

      {/* ── Session List ── */}
      {isLoadingSessions && sessions.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm">Loading sessions…</p>
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
                      <div className="px-4 pb-3">
                        <SessionCard
                          session={item.session}
                          isActive={item.session.id === activeSessionId}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Load more indicator */}
          {isLoadingSessions && sessions.length > 0 && (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateGroupHeader({ label }: { label: string }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-2 backdrop-blur-sm">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/60" />
    </div>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40"
        style={{ fontSize: 28 }}
      >
        {hasQuery ? "🔍" : "📋"}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {hasQuery ? "No sessions found" : "No sessions yet"}
        </p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          {hasQuery
            ? "Try a different search term or clear the filters."
            : "Your service history will appear here automatically as you use Vision Projector."}
        </p>
      </div>
    </div>
  );
}
