/**
 * Session Restore Dialog
 * Offers granular restore options for a past session.
 */
import { useState } from "react";
import { RotateCcw, ChevronDown, BookOpen, Music, Palette, ListVideo, Layers } from "lucide-react";
import type { SessionRecord, SessionEventRecord, SessionEventType } from "@/db/schema";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  session: SessionRecord;
  events: SessionEventRecord[];
}

interface RestoreOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void | Promise<void>;
}

export function SessionRestoreDialog({ session, events }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const bibleEvents = events.filter((e) => e.eventType === "BIBLE_PROJECTED");
  const songEvents = events.filter((e) => e.eventType === "SONG_PROJECTED");
  const lastTheme = [...events].reverse().find((e) => e.eventType === "THEME_CHANGED");
  const mediaEvents = events.filter(
    (e) =>
      e.eventType === "IMAGE_PROJECTED" || e.eventType === "VIDEO_PROJECTED",
  );
  const playlistEvent = events.find((e) => e.eventType === "PLAYLIST_OPENED");

  const handleRestoreTheme = () => {
    if (!lastTheme) {
      toast.info("No theme changes recorded in this session.");
      return;
    }
    // Navigate to project and note the theme to restore
    toast.success(`Theme "${lastTheme.label.replace("Theme → ", "")}" noted. Navigate to Project to apply.`);
    setOpen(false);
  };

  const handleRestoreBibleOrder = () => {
    if (!bibleEvents.length) {
      toast.info("No Bible verses projected in this session.");
      return;
    }
    const refs = bibleEvents.map((e) => e.label).join(", ");
    toast.success(`Bible order: ${bibleEvents.length} verses. References copied to clipboard.`);
    void navigator.clipboard.writeText(refs).catch(() => {/* ignore */});
    setOpen(false);
  };

  const handleRestorePlaylist = () => {
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
    } catch {/* ignore */}
    toast.info("Playlist reference not found. It may have been deleted.");
    setOpen(false);
  };

  const options: RestoreOption[] = [
    {
      id: "bible",
      label: "Restore Bible Order",
      description: `${bibleEvents.length} verses — copies references to clipboard`,
      icon: BookOpen,
      action: handleRestoreBibleOrder,
    },
    {
      id: "theme",
      label: "Restore Theme",
      description: lastTheme
        ? `Last used: ${lastTheme.label.replace("Theme → ", "")}`
        : "No theme changes in this session",
      icon: Palette,
      action: handleRestoreTheme,
    },
    {
      id: "playlist",
      label: "Restore Playlist",
      description: playlistEvent
        ? `Opens the playlist used in this session`
        : "No playlist was opened",
      icon: ListVideo,
      action: handleRestorePlaylist,
    },
    {
      id: "queue",
      label: "View Media Queue",
      description: `${mediaEvents.length} media items projected`,
      icon: Layers,
      action: () => {
        if (!mediaEvents.length) {
          toast.info("No media was projected in this session.");
          return;
        }
        toast.info(`${mediaEvents.length} media items projected. See timeline for details.`);
        setOpen(false);
      },
    },
    {
      id: "songs",
      label: "View Song Order",
      description: `${songEvents.length} song slides projected`,
      icon: Music,
      action: () => {
        if (!songEvents.length) {
          toast.info("No songs projected in this session.");
          return;
        }
        const names = [...new Set(songEvents.map((e) => e.label))].join(", ");
        toast.success(`Songs: ${names}`);
        setOpen(false);
      },
    },
  ];

  return (
    <div className="relative">
      <button
        id="session-restore-btn"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Restore
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-lg border border-border bg-popover shadow-xl">
            <div className="border-b border-border px-3 py-2">
              <p className="text-xs font-semibold text-foreground">Restore Options</p>
              <p className="text-[11px] text-muted-foreground">
                Best-effort — deleted items cannot be restored
              </p>
            </div>
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => void opt.action()}
                  className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition hover:bg-accent"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">{opt.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
