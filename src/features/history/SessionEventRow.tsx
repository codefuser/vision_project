import { useState, useCallback, memo } from "react";
import {
  ChevronDown,
  BookOpen,
  Music,
  Image as ImageIcon,
  Video,
  Type,
  Palette,
  RotateCcw,
  Copy,
  Clock,
} from "lucide-react";
import type { SessionEventRecord } from "@/db/schema";
import type { ContentGroup } from "./content-groups";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  group: ContentGroup;
}

const CONTENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  song: Music,
  bible: BookOpen,
  image: ImageIcon,
  video: Video,
  text: Type,
  theme: Palette,
  system: Type,
};

const CONTENT_COLORS: Record<string, string> = {
  song: "text-violet-400",
  bible: "text-blue-400",
  image: "text-amber-400",
  video: "text-orange-400",
  text: "text-teal-400",
  theme: "text-emerald-400",
  system: "text-muted-foreground/50",
};

const CONTENT_BG: Record<string, string> = {
  song: "bg-violet-500/10",
  bible: "bg-blue-500/10",
  image: "bg-amber-500/10",
  video: "bg-orange-500/10",
  text: "bg-teal-500/10",
  theme: "bg-emerald-500/10",
  system: "bg-muted/30",
};

export const SessionEventRow = memo(function SessionEventRow({ group }: Props) {
  const [expanded, setExpanded] = useState(false);
  const Icon = CONTENT_ICONS[group.contentType] ?? Type;
  const color = CONTENT_COLORS[group.contentType] ?? "text-foreground/70";
  const bg = CONTENT_BG[group.contentType] ?? "bg-muted";
  const isExpandable = group.count > 1 || !!group.detail || group.contentType === "bible";

  const handleProject = useCallback(() => {
    toast.success(`Project: ${group.label}`);
  }, [group.label]);

  const handleCopy = useCallback(() => {
    const text = group.events.map((e) => `${e.label}${e.detail ? ` — ${e.detail}` : ""}`).join("\n");
    void navigator.clipboard.writeText(text).catch(() => {});
    toast.success(`Copied ${group.count} item${group.count > 1 ? "s" : ""}`);
  }, [group]);

  return (
    <div className="group relative pl-3 transition-all duration-150">
      <div className={cn(
        "absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-colors duration-150",
        color.replace("text-", "bg-").replace("-400", "-500/30"),
      )} />

      <div className={cn(
        "rounded-lg border border-transparent transition-all duration-150",
        expanded ? "bg-muted/[0.03] border-white/[0.03]" : "hover:bg-muted/[0.02]",
      )}>
        <div
          className="flex items-start gap-2.5 px-3 py-2 cursor-pointer"
          onClick={() => isExpandable && setExpanded((v) => !v)}
        >
          <div className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            bg,
          )}>
            <Icon className={cn("h-3.5 w-3.5", color)} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground/85 truncate">
                {group.label}
              </span>
              {group.contentType === "system" && (
                <span className="rounded bg-muted/30 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">
                  SYS
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {group.detail && (
                <span className="text-[10px] text-muted-foreground/50 line-clamp-1">
                  {group.detail}
                </span>
              )}
              {group.duration > 1000 && (
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/30 shrink-0">
                  <Clock className="h-2.5 w-2.5" />
                  {formatDuration(group.duration)}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); handleProject(); }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/30 opacity-0 transition-all duration-150 hover:bg-primary/10 hover:text-primary group-hover:opacity-100"
              title="Project Again"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/30 opacity-0 transition-all duration-150 hover:bg-accent/50 hover:text-foreground/60 group-hover:opacity-100"
              title="Copy"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            {isExpandable && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/30 hover:bg-accent/50 hover:text-foreground/60 transition-all duration-150"
              >
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-150", expanded && "rotate-180")} />
              </button>
            )}
          </div>
        </div>

        {expanded && group.events.length > 0 && (
          <div className="px-3 pb-2 pl-[52px] space-y-0.5">
            {group.contentType === "bible" && group.book && (
              <div className="mb-1.5 flex items-center gap-2 px-2 py-1 rounded-md bg-muted/10">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40">
                  {group.book} {group.chapter}:{group.verseStart}–{group.verseEnd}
                </span>
                <span className="text-[9px] text-muted-foreground/30">
                  · {group.count} verse{group.count > 1 ? "s" : ""}
                </span>
              </div>
            )}
            {group.events.map((evt, idx) => (
              <div key={evt.id} className="flex items-start gap-2 py-1 group/row">
                <span className="mt-0.5 shrink-0 text-[9px] font-semibold tabular-nums text-muted-foreground/30 w-6 text-right">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] leading-relaxed text-muted-foreground/60 line-clamp-2">
                    {evt.detail ?? evt.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground/30 mt-0.5 block">
                    {format(new Date(evt.ts), "h:mm:ss a")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min > 0) return `${min}m ${sec}s`;
  return `${sec}s`;
}
