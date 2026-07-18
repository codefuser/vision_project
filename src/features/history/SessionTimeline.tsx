import { useMemo, useState, useCallback } from "react";
import {
  BookOpen,
  Music,
  Image as ImageIcon,
  Video,
  Type,
  Palette,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import type { SessionEventRecord, SessionEventType } from "@/db/schema";
import { SessionEventRow } from "./SessionEventRow";
import { cn } from "@/lib/utils";

interface Props {
  events: SessionEventRecord[];
}

type GroupKey =
  | "BIBLE"
  | "SONG"
  | "IMAGE"
  | "VIDEO"
  | "TEXT"
  | "THEME"
  | "SYSTEM"
  | "OTHER";

const CONTENT_TYPES: SessionEventType[] = [
  "BIBLE_PROJECTED",
  "SONG_PROJECTED",
  "IMAGE_PROJECTED",
  "VIDEO_PROJECTED",
  "TEXT_PROJECTED",
  "ANNOUNCEMENT_PROJECTED",
];

function getGroupKey(eventType: SessionEventType): GroupKey {
  if (eventType === "BIBLE_PROJECTED") return "BIBLE";
  if (eventType === "SONG_PROJECTED") return "SONG";
  if (eventType === "IMAGE_PROJECTED") return "IMAGE";
  if (eventType === "VIDEO_PROJECTED") return "VIDEO";
  if (eventType === "TEXT_PROJECTED" || eventType === "ANNOUNCEMENT_PROJECTED") return "TEXT";
  if (eventType === "THEME_CHANGED") return "THEME";
  return "SYSTEM";
}

const GROUP_CONFIG: Record<GroupKey, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  bg: string;
  border: string;
}> = {
  BIBLE:  { icon: BookOpen, label: "Bible", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  SONG:   { icon: Music, label: "Songs", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  IMAGE:  { icon: ImageIcon, label: "Images", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  VIDEO:  { icon: Video, label: "Videos", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  TEXT:   { icon: Type, label: "Text", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  THEME:  { icon: Palette, label: "Themes", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  SYSTEM: { icon: Sparkles, label: "System", color: "text-muted-foreground", bg: "bg-muted", border: "border-border/30" },
  OTHER:  { icon: Sparkles, label: "Other", color: "text-muted-foreground", bg: "bg-muted", border: "border-border/30" },
};

interface EventGroup {
  key: GroupKey;
  events: SessionEventRecord[];
}

function buildGroups(events: SessionEventRecord[]): EventGroup[] {
  const groups: EventGroup[] = [];
  let currentGroup: EventGroup | null = null;

  for (const event of events) {
    const key = getGroupKey(event.eventType);

    if (key === "SYSTEM") {
      if (currentGroup && currentGroup.key !== "SYSTEM") {
        groups.push(currentGroup);
        currentGroup = null;
      }
      groups.push({ key: "SYSTEM", events: [event] });
      continue;
    }

    if (currentGroup && currentGroup.key === key) {
      currentGroup.events.push(event);
    } else {
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = { key, events: [event] };
    }
  }

  if (currentGroup) {
    groups.push(currentGroup);
  }

  return groups;
}

export function SessionTimeline({ events }: Props) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const groups = useMemo(() => buildGroups(events), [events]);

  const toggleGroup = useCallback((key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
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
      <div className="relative">
        {groups.map((group) => {
          const config = GROUP_CONFIG[group.key];
          const Icon = config.icon;
          const groupKey = `${group.key}-${group.events[0].id}`;
          const isCollapsed = collapsedGroups.has(groupKey);

          if (group.key === "SYSTEM") {
            return (
              <div key={groupKey}>
                {group.events.map((event) => (
                  <SessionEventRow key={event.id} event={event} />
                ))}
              </div>
            );
          }

          return (
            <div key={groupKey} className="group">
              <button
                onClick={() => toggleGroup(groupKey)}
                className={cn(
                  "flex w-full items-center gap-2 border-b border-l-2 px-4 py-2 text-left transition-all duration-150",
                  config.border,
                  "hover:bg-muted/20",
                )}
              >
                <div className={cn("flex h-5 w-5 items-center justify-center rounded-md", config.bg)}>
                  <Icon className={cn("h-3 w-3", config.color)} />
                </div>
                <span className="flex-1 text-[11px] font-semibold text-foreground/70">
                  {config.label}
                </span>
                <span className="rounded-md bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-muted-foreground/50">
                  {group.events.length}
                </span>
                <ChevronDown className={cn(
                  "h-3 w-3 text-muted-foreground/30 transition-transform duration-150",
                  !isCollapsed && "rotate-180",
                )} />
              </button>

              {!isCollapsed && (
                <div>
                  {group.events.map((event) => (
                    <SessionEventRow key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
