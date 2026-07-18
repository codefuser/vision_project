import { useMemo, useState, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Music,
  BookOpen,
  Image as ImageIcon,
  Video,
  Type,
  Palette,
} from "lucide-react";
import type { SessionEventRecord } from "@/db/schema";
import { SessionEventRow } from "./SessionEventRow";
import { buildContentGroups, buildSystemGroups } from "./content-groups";
import type { ContentGroup } from "./content-groups";
import { format } from "date-fns";

interface Props {
  events: SessionEventRecord[];
}

interface TimeBucket {
  minuteKey: string;
  ts: number;
  groups: ContentGroup[];
}

function getMinuteKey(ts: number): string {
  return format(new Date(ts), "h:mm a");
}

function bucketGroups(groups: ContentGroup[]): TimeBucket[] {
  const buckets = new Map<string, ContentGroup[]>();
  for (const g of groups) {
    const key = getMinuteKey(g.startTs);
    const existing = buckets.get(key) ?? [];
    existing.push(g);
    buckets.set(key, existing);
  }
  return Array.from(buckets.entries())
    .map(([minuteKey, groups]) => ({
      minuteKey,
      ts: groups[0].startTs,
      groups,
    }))
    .sort((a, b) => a.ts - b.ts);
}

const CONTENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  song: Music,
  bible: BookOpen,
  image: ImageIcon,
  video: Video,
  text: Type,
  theme: Palette,
};

export function SessionTimeline({ events }: Props) {
  const [showSystem, setShowSystem] = useState(false);

  const contentGroups = useMemo(() => buildContentGroups(events), [events]);
  const systemGroups = useMemo(
    () => buildSystemGroups(events),
    [events],
  );
  const timeline = useMemo(() => bucketGroups(contentGroups), [contentGroups]);

  const toggleSystem = useCallback(() => {
    setShowSystem((v) => !v);
  }, []);

  if (!contentGroups.length && !systemGroups.length) {
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
        {timeline.length === 0 && contentGroups.length > 0 ? (
          <span className="px-4 text-[10px] text-muted-foreground/30">
            All content
          </span>
        ) : null}

        {timeline.map((bucket) => (
          <div key={bucket.minuteKey}>
            <TimeSeparator label={bucket.minuteKey} />

            {bucket.groups.map((group) => (
              <SessionEventRow key={group.id} group={group} />
            ))}
          </div>
        ))}

        {systemGroups.length > 0 && (
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
                {showSystem ? "Hide" : "Show"} {systemGroups.length} system event{systemGroups.length !== 1 ? "s" : ""}
              </span>
            </button>

            {showSystem && (
              <div>
                {systemGroups.map((group) => (
                  <SessionEventRow key={group.id} group={group} />
                ))}
              </div>
            )}
          </div>
        )}

        {contentGroups.length > 0 && (
          <div className="mt-3 border-t border-border/10 px-4 pt-2 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <ContentSummary
                icon={Music}
                label="Songs"
                count={contentGroups.filter((g) => g.contentType === "song").length}
                slides={contentGroups.filter((g) => g.contentType === "song").reduce((s, g) => s + g.count, 0)}
                color="text-violet-400"
              />
              <ContentSummary
                icon={BookOpen}
                label="Bible"
                count={contentGroups.filter((g) => g.contentType === "bible").length}
                slides={contentGroups.filter((g) => g.contentType === "bible").reduce((s, g) => s + g.count, 0)}
                color="text-blue-400"
              />
              <ContentSummary
                icon={ImageIcon}
                label="Images"
                count={contentGroups.filter((g) => g.contentType === "image").length}
                color="text-amber-400"
              />
              <ContentSummary
                icon={Video}
                label="Videos"
                count={contentGroups.filter((g) => g.contentType === "video").length}
                color="text-orange-400"
              />
              <ContentSummary
                icon={Type}
                label="Text"
                count={contentGroups.filter((g) => g.contentType === "text").length}
                color="text-teal-400"
              />
              <ContentSummary
                icon={Palette}
                label="Themes"
                count={contentGroups.filter((g) => g.contentType === "theme").length}
                color="text-emerald-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContentSummary({
  icon: Icon,
  label,
  count,
  slides,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  slides?: number;
  color: string;
}) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3 w-3 text-muted-foreground/40" />
      <span className="text-[10px] text-muted-foreground/50">
        <span className={cn("font-semibold", color)}>{count}</span>
        {label}
        {slides !== undefined && (
          <span className="text-muted-foreground/30"> · {slides} slides</span>
        )}
      </span>
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

function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}
