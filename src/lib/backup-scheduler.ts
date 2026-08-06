/**
 * Automatic backup scheduler.
 *
 * Runs while the app is open: when `automaticBackup` is enabled, a backup is
 * created every `backupInterval` hours (same export pipeline as the manual
 * "Export Backup" button). Re-schedules reactively whenever the setting
 * changes, and clears itself when automatic backups are turned off.
 */
import { useSettings } from "@/stores/settings.store";
import { exportBackup } from "@/features/backup/backup";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

let timer: ReturnType<typeof setTimeout> | null = null;
let started = false;

function clear() {
  if (timer) clearTimeout(timer);
  timer = null;
}

function reschedule() {
  clear();
  const { automaticBackup, backupInterval } = useSettings.getState().settings;
  if (!automaticBackup) return;
  const hours = Math.max(1, Math.min(168, backupInterval || 24));
  timer = setTimeout(() => {
    void runBackup();
    reschedule();
  }, hours * 60 * 60 * 1000);
}

async function runBackup() {
  try {
    const blob = await exportBackup();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `versolyn-autobackup-${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Automatic backup created");
  } catch (e) {
    logger.error("Automatic backup failed", e);
    toast.error("Automatic backup failed: " + (e as Error).message);
  }
}

/** Start (idempotent) — call once from the app shell. */
export function initBackupScheduler() {
  if (started || typeof window === "undefined") return;
  started = true;
  useSettings.subscribe(() => reschedule());
  reschedule();
}
