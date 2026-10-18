import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import type { AnnouncementItem } from "../types";

const DISMISSED_ANNOUNCEMENTS_KEY = "versolyn_dismissed_announcements";

function getDismissedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function dismissAnnouncement(id: string) {
  if (typeof window === "undefined") return;
  try {
    const ids = getDismissedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(DISMISSED_ANNOUNCEMENTS_KEY, JSON.stringify(ids));
    }
  } catch {
    // ignore
  }
}

export async function fetchLatestActiveAnnouncement(churchName?: string): Promise<AnnouncementItem | null> {
  try {
    const dismissed = getDismissedIds();

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error || !data || data.length === 0) return null;

    // Filter by dismissed & target
    for (const item of data as AnnouncementItem[]) {
      if (dismissed.includes(item.id)) continue;

      if (!item.target_church || item.target_church === "all") {
        return item;
      }

      if (churchName && item.target_church.toLowerCase() === churchName.toLowerCase()) {
        return item;
      }
    }

    return null;
  } catch (err) {
    logger.info("[Announcements] Active check completed (table pending or offline)");
    return null;
  }
}
