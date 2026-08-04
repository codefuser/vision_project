import type { SessionEventRecord } from "@/db/schema";

export type ContentGroupType =
  | "song"
  | "bible"
  | "image"
  | "video"
  | "text"
  | "theme"
  | "system";

export interface ContentGroup {
  id: string;
  contentType: ContentGroupType;
  label: string;
  detail: string | null;
  events: SessionEventRecord[];
  count: number;
  startTs: number;
  endTs: number;
  duration: number;
  book?: string;
  chapter?: number;
  verseStart?: number;
  verseEnd?: number;
}

export interface ContentStats {
  uniqueSongs: number;
  slidesViewed: number;
  bibleRefs: number;
  versesViewed: number;
  images: number;
  videos: number;
  themesUsed: number;
  textItems: number;
  sessionDuration: string;
}

const CONTENT_EVENT_TYPES = new Set([
  "BIBLE_PROJECTED", "SONG_PROJECTED", "IMAGE_PROJECTED", "VIDEO_PROJECTED",
  "TEXT_PROJECTED", "ANNOUNCEMENT_PROJECTED", "THEME_CHANGED",
]);

function stripSongSlide(label: string): string {
  return label.replace(/\s*\(slide\s+\d+\)$/, "");
}

interface BibleRef {
  book: string;
  chapter: number;
  verse: number;
}

const BIBLE_RE = /^(\d?\s*\w+(?:\s+\w+)?)\s+(\d+):(\d+)/;

function parseBibleRef(label: string): BibleRef | null {
  const m = BIBLE_RE.exec(label);
  if (!m) return null;
  return {
    book: m[1].trim(),
    chapter: Number(m[2]),
    verse: Number(m[3]),
  };
}

function formatBibleRange(card: { book: string; chapter: number; verseStart: number; verseEnd: number }): string {
  if (card.verseStart === card.verseEnd) {
    return `${card.book} ${card.chapter}:${card.verseStart}`;
  }
  return `${card.book} ${card.chapter}:${card.verseStart}-${card.verseEnd}`;
}

export function buildContentGroups(events: SessionEventRecord[]): ContentGroup[] {
  const contentEvents = events.filter((e) => CONTENT_EVENT_TYPES.has(e.eventType));
  if (!contentEvents.length) return [];

  const groups: ContentGroup[] = [];
  let i = 0;

  while (i < contentEvents.length) {
    const event = contentEvents[i];
    const et = event.eventType;

    if (et === "SONG_PROJECTED") {
      const baseLabel = stripSongSlide(event.label);
      const merged: SessionEventRecord[] = [event];
      let j = i + 1;
      while (
        j < contentEvents.length &&
        contentEvents[j].eventType === "SONG_PROJECTED" &&
        stripSongSlide(contentEvents[j].label) === baseLabel
      ) {
        merged.push(contentEvents[j]);
        j++;
      }
      const count = merged.length;
      const startTs = merged[0].ts;
      const endTs = merged[count - 1].ts;
      groups.push({
        id: `song:${startTs}:${baseLabel.replace(/\s+/g, "_")}`,
        contentType: "song",
        label: baseLabel,
        detail: `Slides 1–${count}`,
        events: merged,
        count,
        startTs,
        endTs,
        duration: endTs - startTs,
      });
      i = j;
      continue;
    }

    if (et === "BIBLE_PROJECTED") {
      const ref = parseBibleRef(event.label);
      if (!ref) {
        groups.push(singleGroup(event, "bible"));
        i++;
        continue;
      }
      const merged: SessionEventRecord[] = [event];
      let j = i + 1;
      while (
        j < contentEvents.length &&
        contentEvents[j].eventType === "BIBLE_PROJECTED"
      ) {
        const nextRef = parseBibleRef(contentEvents[j].label);
        if (
          nextRef &&
          nextRef.book === ref.book &&
          nextRef.chapter === ref.chapter
        ) {
          merged.push(contentEvents[j]);
          j++;
        } else {
          break;
        }
      }
      const verses = merged.map((e) => parseBibleRef(e.label)!.verse);
      const verseStart = Math.min(...verses);
      const verseEnd = Math.max(...verses);
      const count = merged.length;
      const startTs = merged[0].ts;
      const endTs = merged[count - 1].ts;
      groups.push({
        id: `bible:${startTs}:${ref.book}_${ref.chapter}`,
        contentType: "bible",
        label: formatBibleRange({ book: ref.book, chapter: ref.chapter, verseStart, verseEnd }),
        detail: `${count} verse${count > 1 ? "s" : ""}`,
        events: merged,
        count,
        startTs,
        endTs,
        duration: endTs - startTs,
        book: ref.book,
        chapter: ref.chapter,
        verseStart,
        verseEnd,
      });
      i = j;
      continue;
    }

    if (et === "IMAGE_PROJECTED") {
      groups.push(singleGroup(event, "image"));
      i++;
      continue;
    }

    if (et === "VIDEO_PROJECTED") {
      groups.push(singleGroup(event, "video"));
      i++;
      continue;
    }

    if (et === "TEXT_PROJECTED" || et === "ANNOUNCEMENT_PROJECTED") {
      groups.push(singleGroup(event, "text"));
      i++;
      continue;
    }

    if (et === "THEME_CHANGED") {
      groups.push(singleGroup(event, "theme"));
      i++;
      continue;
    }

    i++;
  }

  return groups;
}

function singleGroup(event: SessionEventRecord, contentType: ContentGroupType): ContentGroup {
  return {
    id: `${contentType}:${event.ts}:${event.id}`,
    contentType,
    label: event.label,
    detail: event.detail,
    events: [event],
    count: 1,
    startTs: event.ts,
    endTs: event.ts,
    duration: 0,
  };
}

export function buildSystemGroups(events: SessionEventRecord[]): ContentGroup[] {
  const systemEvents = events.filter((e) => !CONTENT_EVENT_TYPES.has(e.eventType));
  return systemEvents.map((e) => ({
    id: `system:${e.ts}:${e.id}`,
    contentType: "system" as const,
    label: e.label,
    detail: e.detail,
    events: [e],
    count: 1,
    startTs: e.ts,
    endTs: e.ts,
    duration: 0,
  }));
}

export function computeContentStats(groups: ContentGroup[], sessionDuration: string): ContentStats {
  const uniqueSongs = new Set(
    groups.filter((g) => g.contentType === "song").map((g) => g.label),
  ).size;

  const slidesViewed = groups
    .filter((g) => g.contentType === "song")
    .reduce((sum, g) => sum + g.count, 0);

  const bibleRefs = groups.filter((g) => g.contentType === "bible").length;

  const versesViewed = groups
    .filter((g) => g.contentType === "bible")
    .reduce((sum, g) => sum + g.count, 0);

  const images = groups.filter((g) => g.contentType === "image").length;
  const videos = groups.filter((g) => g.contentType === "video").length;
  const themesUsed = groups.filter((g) => g.contentType === "theme").length;
  const textItems = groups.filter((g) => g.contentType === "text").length;

  return {
    uniqueSongs,
    slidesViewed,
    bibleRefs,
    versesViewed,
    images,
    videos,
    themesUsed,
    textItems,
    sessionDuration,
  };
}
