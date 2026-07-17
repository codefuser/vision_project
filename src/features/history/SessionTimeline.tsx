/**
 * SessionTimeline
 * Renders the full ordered event list for a session using virtual scrolling
 * for performance with thousands of events.
 */
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { SessionEventRecord } from "@/db/schema";
import { SessionEventRow } from "./SessionEventRow";

interface Props {
  events: SessionEventRecord[];
}

export function SessionTimeline({ events }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 text-4xl opacity-30">📋</div>
        <p className="text-sm font-medium text-muted-foreground">No events recorded</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Events will appear here as the service progresses.
        </p>
      </div>
    );
  }

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto"
      style={{ contain: "strict" }}
    >
      {/* Virtualizer spacer */}
      <div
        style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}
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
            const event = events[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="px-4"
              >
                <SessionEventRow
                  event={event}
                  isFirst={virtualRow.index === 0}
                  isLast={virtualRow.index === events.length - 1}
                  showConnector
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
