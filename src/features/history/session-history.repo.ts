/**
 * Session History Repository
 *
 * All Dexie reads/writes for sessions and session_events.
 * Pure async functions — no React, no Zustand. Consumed by the
 * session-recorder singleton and the UI hooks.
 */
import { db } from "@/db/schema";
import type {
  SessionRecord,
  SessionEventRecord,
  SessionEventType,
} from "@/db/schema";
import { uid } from "@/lib/uid";

// ─── APP VERSION ──────────────────────────────────────────────────────────────
const APP_VERSION = "1.0.0";

// ─── Session name generator ───────────────────────────────────────────────────

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function timeOfDay(hour: number): string {
  if (hour >= 5 && hour < 12) return "Morning Service";
  if (hour >= 12 && hour < 17) return "Afternoon Service";
  if (hour >= 17 && hour < 21) return "Evening Service";
  return "Night Service";
}

export function generateSessionName(date: Date): string {
  const day = DAYS[date.getDay()];
  const tod = timeOfDay(date.getHours());
  return `${day} ${tod}`;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ─── Create / End Session ─────────────────────────────────────────────────────

export async function createSession(): Promise<SessionRecord> {
  const now = new Date();
  const session: SessionRecord = {
    id: uid(),
    name: generateSessionName(now),
    date: toISODate(now),
    startedAt: now.getTime(),
    endedAt: null,
    status: "active",
    version: APP_VERSION,
    totalEvents: 0,
    bibleCount: 0,
    songCount: 0,
    imageCount: 0,
    videoCount: 0,
    textCount: 0,
    themeCount: 0,
  };
  await db().sessions.add(session);
  return session;
}

export async function endSession(
  id: string,
  endedAt: number = Date.now(),
): Promise<void> {
  // Recount from events for accuracy
  const events = await db().session_events.where("sessionId").equals(id).toArray();
  const counts = {
    totalEvents: events.length,
    bibleCount: events.filter((e) => e.eventType === "BIBLE_PROJECTED").length,
    songCount: events.filter((e) => e.eventType === "SONG_PROJECTED").length,
    imageCount: events.filter((e) => e.eventType === "IMAGE_PROJECTED").length,
    videoCount: events.filter((e) => e.eventType === "VIDEO_PROJECTED").length,
    textCount: events.filter((e) => e.eventType === "TEXT_PROJECTED").length,
    themeCount: events.filter((e) => e.eventType === "THEME_CHANGED").length,
  };
  await db().sessions.update(id, {
    endedAt,
    status: "ended",
    ...counts,
  });
}

export async function renameSession(id: string, name: string): Promise<void> {
  await db().sessions.update(id, { name: name.trim() || "Unnamed Service" });
}

/** Mark any leftover "active" sessions from a previous browser session as ended. */
export async function closeOrphanedSessions(): Promise<void> {
  const orphans = await db()
    .sessions.where("status")
    .equals("active")
    .toArray();
  const now = Date.now();
  for (const s of orphans) {
    await endSession(s.id, now);
  }
}

// ─── Log a single event ───────────────────────────────────────────────────────

export async function logEvent(
  sessionId: string,
  eventType: SessionEventType,
  label: string,
  opts?: {
    detail?: string | null;
    module?: string;
    metadata?: Record<string, unknown> | null;
  },
): Promise<void> {
  const record: SessionEventRecord = {
    id: uid(),
    sessionId,
    ts: Date.now(),
    eventType,
    label,
    detail: opts?.detail ?? null,
    module: opts?.module ?? "system",
    metadata: opts?.metadata ? JSON.stringify(opts.metadata) : null,
  };
  // Fire and forget — never block the projection path
  void db().session_events.add(record);
}

/** Batch-increment a single counter field on the session (non-blocking). */
export function bumpSessionCounter(
  sessionId: string,
  field: keyof Pick<
    SessionRecord,
    | "totalEvents"
    | "bibleCount"
    | "songCount"
    | "imageCount"
    | "videoCount"
    | "textCount"
    | "themeCount"
  >,
): void {
  void db()
    .sessions.where("id")
    .equals(sessionId)
    .modify((s) => {
      (s[field] as number) = ((s[field] as number) || 0) + 1;
      s.totalEvents = (s.totalEvents || 0) + 1;
    });
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export interface SessionListOptions {
  limit?: number;
  offset?: number;
  dateFrom?: string; // ISO date YYYY-MM-DD
  dateTo?: string;
}

export async function listSessions(
  opts: SessionListOptions = {},
): Promise<SessionRecord[]> {
  const { limit = 50, offset = 0, dateFrom, dateTo } = opts;

  let collection = db().sessions.orderBy("startedAt").reverse();

  if (dateFrom || dateTo) {
    // Filter by date string (ISO YYYY-MM-DD comparisons work lexicographically)
    collection = collection.filter((s) => {
      if (dateFrom && s.date < dateFrom) return false;
      if (dateTo && s.date > dateTo) return false;
      return true;
    });
  }

  return collection.offset(offset).limit(limit).toArray();
}

export async function getSession(id: string): Promise<SessionRecord | undefined> {
  return db().sessions.get(id);
}

export async function getSessionEvents(sessionId: string): Promise<SessionEventRecord[]> {
  return db()
    .session_events.where("sessionId")
    .equals(sessionId)
    .sortBy("ts");
}

export async function countSessions(): Promise<number> {
  return db().sessions.count();
}

/** Search sessions by name or date, returns up to `limit` results. */
export async function searchSessions(
  query: string,
  limit = 50,
): Promise<SessionRecord[]> {
  const q = query.toLowerCase().trim();
  if (!q) return listSessions({ limit });
  return db()
    .sessions.orderBy("startedAt")
    .reverse()
    .filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.date.includes(q),
    )
    .limit(limit)
    .toArray();
}

/** Search events within a single session by label or detail text. */
export async function searchSessionEvents(
  sessionId: string,
  query: string,
): Promise<SessionEventRecord[]> {
  const q = query.toLowerCase().trim();
  if (!q) return getSessionEvents(sessionId);
  return db()
    .session_events.where("sessionId")
    .equals(sessionId)
    .filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        (e.detail?.toLowerCase().includes(q) ?? false),
    )
    .sortBy("ts");
}

/** Search events across ALL sessions (for global search). */
export async function searchAllEvents(
  query: string,
  limit = 100,
): Promise<SessionEventRecord[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return db()
    .session_events.orderBy("ts")
    .reverse()
    .filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        (e.detail?.toLowerCase().includes(q) ?? false),
    )
    .limit(limit)
    .toArray();
}

export async function deleteSession(id: string): Promise<void> {
  await db().transaction("rw", db().sessions, db().session_events, async () => {
    await db().session_events.where("sessionId").equals(id).delete();
    await db().sessions.delete(id);
  });
}

// ─── Export helpers ───────────────────────────────────────────────────────────

export interface SessionExportData {
  session: SessionRecord;
  events: SessionEventRecord[];
}

export async function getSessionExportData(
  id: string,
): Promise<SessionExportData | null> {
  const session = await getSession(id);
  if (!session) return null;
  const events = await getSessionEvents(id);
  return { session, events };
}

// ─── Date range helpers (for filter chips) ────────────────────────────────────

export function dateRangeForFilter(
  filter: "today" | "yesterday" | "last7" | "last30" | "thisMonth" | "thisYear",
): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const todayStr = toISODate(now);

  const before = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return toISODate(d);
  };

  switch (filter) {
    case "today":
      return { dateFrom: todayStr, dateTo: todayStr };
    case "yesterday":
      return { dateFrom: before(1), dateTo: before(1) };
    case "last7":
      return { dateFrom: before(6), dateTo: todayStr };
    case "last30":
      return { dateFrom: before(29), dateTo: todayStr };
    case "thisMonth": {
      const m = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      return { dateFrom: `${m}-01`, dateTo: todayStr };
    }
    case "thisYear": {
      const y = now.getFullYear();
      return { dateFrom: `${y}-01-01`, dateTo: todayStr };
    }
  }
}
