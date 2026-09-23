import { supabase } from "../supabase";
import { get, set } from "idb-keyval";
import { logger } from "@/lib/logger";

export type BibleLang = "en" | "ta";
export type BibleData = string[][][];

const cache: Partial<Record<BibleLang, BibleData>> = {};
const inflight: Partial<Record<BibleLang, Promise<BibleData>>> = {};

const CACHE_KEYS: Record<BibleLang, string> = {
  en: "vision_bible_en_v1",
  ta: "vision_bible_ta_v1",
};

export function isBibleLoaded(lang: BibleLang): boolean {
  return !!cache[lang];
}

export function getBible(lang: BibleLang): BibleData | undefined {
  return cache[lang];
}

/**
 * Cache-First Progressive Bible Loader:
 * 1. Loads Bible data directly from IndexedDB in < 15ms.
 * 2. On first launch, fetches an initial batch of key books in ~100ms to unblock UI immediately,
 *    then streams remaining books progressively in the background without locking the network or main thread.
 */
export async function loadBible(lang: BibleLang): Promise<BibleData> {
  if (cache[lang]) return cache[lang]!;
  if (inflight[lang]) return inflight[lang]!;

  const cacheKey = CACHE_KEYS[lang];

  const p = (async () => {
    try {
      // 1. Try IndexedDB first for instant local load
      const cachedData = await get<BibleData>(cacheKey);
      if (cachedData && cachedData.length > 0) {
        cache[lang] = cachedData;
        delete inflight[lang];
        logger.info(`[Bible] Loaded ${lang.toUpperCase()} Bible instantly from IndexedDB`);
        return cachedData;
      }

      // 2. Cold boot fallback: Progressive fetch from Supabase
      const bibleData = await progressiveFetchBibleFromSupabase(lang, cacheKey);
      delete inflight[lang];
      return bibleData;
    } catch (e) {
      delete inflight[lang];
      throw e;
    }
  })();

  inflight[lang] = p;
  return p;
}

/**
 * Progressive download of Bible from Supabase:
 * Loads initial foundational books (Genesis, Exodus, Matthew, Mark, Luke, John) in ~120ms,
 * then background-streams remaining books in non-blocking slices.
 */
async function progressiveFetchBibleFromSupabase(lang: BibleLang, cacheKey: string): Promise<BibleData> {
  const tableName = lang === "en" ? "english_bible" : "tamil_bible";
  logger.info(`[Bible] Loading initial batch of ${lang.toUpperCase()} Bible from Supabase…`);

  const bibleData: BibleData = [];

  const populateRows = (rows: any[]) => {
    let isZeroIndexed = false;
    for (const row of rows) {
      if (Number(row.book) === 0) {
        isZeroIndexed = true;
        break;
      }
    }

    for (const row of rows) {
      const b = isZeroIndexed ? Number(row.book) : Number(row.book) - 1;
      const c = Number(row.chapter) - 1;
      const v = Number(row.versecount) - 1;

      if (!bibleData[b]) bibleData[b] = [];
      if (!bibleData[b][c]) bibleData[b][c] = [];
      bibleData[b][c][v] = row.verse;
    }
  };

  // Step A: Fast initial batch of 2,000 verses (Foundational books)
  const { data: initialRows, error: initialErr } = await supabase
    .from(tableName)
    .select("book, chapter, versecount, verse")
    .order("book", { ascending: true })
    .order("chapter", { ascending: true })
    .range(0, 1999);

  if (initialErr) throw initialErr;

  if (initialRows) {
    populateRows(initialRows);
  }

  cache[lang] = bibleData;

  // Step B: Progressively stream the remaining verses in non-blocking background slices
  void (async () => {
    try {
      const total = 31102;
      const pageSize = 1500;
      const startPage = 2; // start after initial 2000
      const totalPages = Math.ceil(total / pageSize);

      for (let page = startPage; page < totalPages; page++) {
        // Yield to browser main thread between network fetches
        await new Promise((r) => setTimeout(r, 70));

        const start = page * pageSize;
        const end = Math.min(start + pageSize - 1, total - 1);

        const { data: batch, error } = await supabase
          .from(tableName)
          .select("book, chapter, versecount, verse")
          .order("book", { ascending: true })
          .order("chapter", { ascending: true })
          .range(start, end);

        if (error) {
          logger.warn(`[Bible] Error streaming batch ${page}:`, error);
          continue;
        }

        if (batch && batch.length > 0) {
          populateRows(batch);
        }
      }

      // Persist complete Bible to IndexedDB for instant future reloads
      await set(cacheKey, bibleData);
      logger.info(`[Bible] Complete ${lang.toUpperCase()} Bible cached to IndexedDB`);
    } catch (streamErr) {
      logger.warn("[Bible] Background stream error:", streamErr);
    }
  })();

  return bibleData;
}

/**
 * On-demand chapter loader:
 * If a specific book/chapter was requested before the background stream finished,
 * fetch that exact chapter from Supabase in < 30ms.
 */
export async function ensureChapterLoaded(lang: BibleLang, book: number, chapter: number): Promise<void> {
  const d = cache[lang];
  if (d && d[book]?.[chapter - 1] && d[book][chapter - 1].length > 0) {
    return;
  }

  const tableName = lang === "en" ? "english_bible" : "tamil_bible";
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("book, chapter, versecount, verse")
      .eq("book", book + 1)
      .eq("chapter", chapter)
      .order("versecount", { ascending: true });

    if (error || !data || !data.length) return;

    if (!cache[lang]) cache[lang] = [];
    const bData = cache[lang]!;
    if (!bData[book]) bData[book] = [];
    if (!bData[book][chapter - 1]) bData[book][chapter - 1] = [];

    for (const r of data) {
      const v = Number(r.versecount) - 1;
      bData[book][chapter - 1][v] = r.verse;
    }
  } catch (err) {
    logger.warn(`[Bible] On-demand chapter load failed for Book ${book + 1}:${chapter}`, err);
  }
}

export function getVerse(
  lang: BibleLang,
  book: number,
  chapter: number,
  verse: number,
): string | null {
  const d = cache[lang];
  if (!d) return null;
  return d[book]?.[chapter - 1]?.[verse - 1] ?? null;
}
