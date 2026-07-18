import { useState } from "react";
import { RotateCcw, ChevronDown, BookOpen, Music, Palette, Image as ImageIcon, Layers, RefreshCw } from "lucide-react";
import type { SessionRecord, SessionEventRecord } from "@/db/schema";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  session: SessionRecord;
  events: SessionEventRecord[];
}

export function SessionRestoreDialog({ session, events }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const bibleEvents = events.filter((e) => e.eventType === "BIBLE_PROJECTED");
  const songEvents = events.filter((e) => e.eventType === "SONG_PROJECTED");
  const mediaEvents = events.filter((e) => e.eventType === "IMAGE_PROJECTED" || e.eventType === "VIDEO_PROJECTED");
  const lastTheme = [...events].reverse().find((e) => e.eventType === "THEME_CHANGED");
  const playlistEvent = events.find((e) => e.eventType === "PLAYLIST_OPENED");

  const handleCopyBibleRefs = () => {
    if (!bibleEvents.length) {
      toast.info("No Bible verses projected in this session.");
      return;
    }
    const refs = bibleEvents.map((e) => e.label).join(", ");
    void navigator.clipboard.writeText(refs).catch(() => {});
    toast.success(`${bibleEvents.length} Bible references copied`);
    setOpen(false);
  };

  const handleCopySongNames = () => {
    if (!songEvents.length) {
      toast.info("No songs projected in this session.");
      return;
    }
    const names = [...new Set(songEvents.map((e) => e.label))].join(", ");
    void navigator.clipboard.writeText(names).catch(() => {});
    toast.success(`${songEvents.length} song references copied`);
    setOpen(false);
  };

  const handleRestoreTheme = () => {
    if (!lastTheme) {
      toast.info("No theme changes recorded.");
      return;
    }
    toast.success(`Theme "${lastTheme.label.replace("Theme → ", "")}" noted for restore.`);
    setOpen(false);
  };

  const handleOpenPlaylist = () => {
    const meta = playlistEvent?.metadata;
    if (!meta) {
      toast.info("No playlist was opened in this session.");
      return;
    }
    try {
      const { sourceRefId } = JSON.parse(meta) as { sourceRefId?: string };
      if (sourceRefId) {
        void navigate({ to: "/playlists/$id", params: { id: sourceRefId } });
        setOpen(false);
        return;
      }
    } catch {}
    toast.info("Playlist reference not found.");
    setOpen(false);
  };

  const allItemsCount = bibleEvents.length + songEvents.length + mediaEvents.length;
  const sections: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
    count: number;
    active: boolean;
  }[] = [
    {
      id: "bible",
      label: "Bible",
      icon: BookOpen,
      action: handleCopyBibleRefs,
      count: bibleEvents.length,
      active: bibleEvents.length > 0,
    },
    {
      id: "songs",
      label: "Songs",
      icon: Music,
      action: handleCopySongNames,
      count: songEvents.length,
      active: songEvents.length > 0,
    },
    {
      id: "theme",
      label: "Theme",
      icon: Palette,
      action: handleRestoreTheme,
      count: lastTheme ? 1 : 0,
      active: !!lastTheme,
    },
    {
      id: "media",
      label: "Media",
      icon: ImageIcon,
      action: () => {
        if (!mediaEvents.length) {
          toast.info("No media projected.");
          return;
        }
        toast.success(`${mediaEvents.length} media items noted. See timeline.`);
        setOpen(false);
      },
      count: mediaEvents.length,
      active: mediaEvents.length > 0,
    },
    {
      id: "playlist",
      label: "Playlist",
      icon: Layers,
      action: handleOpenPlaylist,
      count: playlistEvent ? 1 : 0,
      active: !!playlistEvent,
    },
  ];

  return (
    <div className="relative">
      <button
        id="session-restore-btn"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-150 hover:opacity-90"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Restore
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border border-white/5 bg-popover/95 backdrop-blur-xl shadow-xl">
            <div className="border-b border-white/5 px-3 py-2.5">
              <p className="text-xs font-semibold text-foreground/90">
                Restore from Session
              </p>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                {allItemsCount} items · Best-effort restore
              </p>
            </div>

            <div className="p-1.5 space-y-0.5">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => s.action()}
                    disabled={!s.active}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150",
                      s.active
                        ? "hover:bg-accent/60 cursor-pointer"
                        : "opacity-30 cursor-not-allowed",
                    )}
                  >
                    <div className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg",
                      s.active ? "bg-primary/10" : "bg-muted/30",
                    )}>
                      <Icon className={cn(
                        "h-3.5 w-3.5",
                        s.active ? "text-primary" : "text-muted-foreground/50",
                      )} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-xs font-medium",
                        s.active ? "text-foreground/80" : "text-muted-foreground/50",
                      )}>
                        {s.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground/40">
                        {s.count} item{s.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ChevronDown className="h-3 w-3 -rotate-90 text-muted-foreground/30 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}
