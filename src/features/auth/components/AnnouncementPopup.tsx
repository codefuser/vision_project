import { memo, useEffect, useState } from "react";
import { fetchLatestActiveAnnouncement, dismissAnnouncement } from "../services/announcements";
import { useAuthStore } from "../auth.store";
import type { AnnouncementItem } from "../types";
import { Bell, X, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const AnnouncementPopup = memo(function AnnouncementPopup() {
  const profile = useAuthStore((s) => s.profile);
  const [announcement, setAnnouncement] = useState<AnnouncementItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for announcements after a brief delay so initial load is instant
    const timer = setTimeout(async () => {
      const item = await fetchLatestActiveAnnouncement(profile?.church_name);
      if (item) {
        setAnnouncement(item);
        setIsVisible(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [profile?.church_name]);

  if (!announcement || !isVisible) return null;

  const handleDismiss = () => {
    dismissAnnouncement(announcement.id);
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-xl p-4 shadow-2xl space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
              {announcement.type === "ad" ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">
                {announcement.type === "ad" ? "Featured" : "Church Notice"}
              </span>
              <h4 className="text-xs font-bold text-foreground leading-snug">
                {announcement.title}
              </h4>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md transition cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {announcement.message}
        </p>

        {announcement.action_label && announcement.action_url && (
          <div className="pt-1 flex items-center justify-end gap-2">
            <a
              href={announcement.action_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-xs cursor-pointer"
            >
              {announcement.action_label}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
});
