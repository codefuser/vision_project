import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { useAuthStore } from "../auth.store";

const STATS_KEY = "versolyn_local_presence_stats";
const HEARTBEAT_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

interface LocalStats {
  activeDates: string[]; // YYYY-MM-DD
  totalMinutes: number;
  sessionCount: number;
}

function getLocalStats(): LocalStats {
  if (typeof window === "undefined") {
    return { activeDates: [], totalMinutes: 0, sessionCount: 0 };
  }
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : { activeDates: [], totalMinutes: 0, sessionCount: 0 };
  } catch {
    return { activeDates: [], totalMinutes: 0, sessionCount: 0 };
  }
}

function recordLocalActivity() {
  if (typeof window === "undefined") return;
  try {
    const stats = getLocalStats();
    const today = new Date().toISOString().slice(0, 10);
    if (!stats.activeDates.includes(today)) {
      stats.activeDates.push(today);
    }
    stats.totalMinutes += 2;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

function getDeviceInfo(): string {
  if (typeof window === "undefined") return "Server";
  const ua = navigator.userAgent;
  let os = "Desktop";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  let browser = "Browser";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

  return `${os} / ${browser}`;
}

class PresenceTracker {
  private logId: string | null = null;
  private sessionStart: number = Date.now();
  private intervalTimer: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;

  public init() {
    if (this.isRunning || typeof window === "undefined") return;
    this.isRunning = true;
    this.sessionStart = Date.now();

    // Increment local session count
    try {
      const stats = getLocalStats();
      stats.sessionCount = (stats.sessionCount || 0) + 1;
      const today = new Date().toISOString().slice(0, 10);
      if (!stats.activeDates.includes(today)) {
        stats.activeDates.push(today);
      }
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }

    // Start initial heartbeat
    void this.sendHeartbeat();

    // Recurring heartbeat every 2 minutes
    this.intervalTimer = setInterval(() => {
      void this.sendHeartbeat();
      recordLocalActivity();
    }, HEARTBEAT_INTERVAL_MS);

    // Final heartbeat on window unload
    window.addEventListener("beforeunload", () => {
      this.sendFinalHeartbeat();
    });
  }

  private async sendHeartbeat() {
    try {
      const profile = useAuthStore.getState().profile;
      const user = useAuthStore.getState().user;
      const elapsedSeconds = Math.round((Date.now() - this.sessionStart) / 1000);

      const churchName = profile?.church_name || "Unregistered Church";
      const city = profile?.city || "Unknown Location";
      const state = profile?.state || "";

      if (!this.logId) {
        // Initial insert
        const { data, error } = await supabase
          .from("app_usage_logs")
          .insert({
            user_id: user?.id || null,
            church_name: churchName,
            city,
            state,
            device_info: getDeviceInfo(),
            session_start: new Date(this.sessionStart).toISOString(),
            last_heartbeat: new Date().toISOString(),
            duration_seconds: elapsedSeconds,
          })
          .select("id")
          .maybeSingle();

        if (!error && data?.id) {
          this.logId = data.id;
        }
      } else {
        // Update existing session
        await supabase
          .from("app_usage_logs")
          .update({
            church_name: churchName,
            city,
            last_heartbeat: new Date().toISOString(),
            duration_seconds: elapsedSeconds,
          })
          .eq("id", this.logId);
      }
    } catch (err) {
      // Silent fail if tables not yet migrated
      logger.info("[Presence] Heartbeat cycle processed (DB pending or offline)");
    }
  }

  private sendFinalHeartbeat() {
    if (!this.logId) return;
    try {
      const elapsedSeconds = Math.round((Date.now() - this.sessionStart) / 1000);
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/app_usage_logs?id=eq.${this.logId}`;
      const headers = {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      };
      const body = JSON.stringify({
        last_heartbeat: new Date().toISOString(),
        duration_seconds: elapsedSeconds,
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        // Use sendBeacon for reliable teardown telemetry
        navigator.sendBeacon(url, blob);
      }
    } catch {
      // ignore
    }
  }

  public getStatsSummary() {
    const stats = getLocalStats();
    return {
      totalDays: stats.activeDates.length,
      totalHours: (stats.totalMinutes / 60).toFixed(1),
      totalSessions: stats.sessionCount,
    };
  }
}

export const presenceTracker = new PresenceTracker();
