import { supabase } from "../supabase";
import { get, set } from "idb-keyval";

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
 * Cache-First Bible Loader:
 * Loads Bible data directly from IndexedDB in < 15ms.
 * First launch fetches from Supabase once and persists to IndexedDB.
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
        console.log(`[Bible] Loaded ${lang.toUpperCase()} Bible instantly from IndexedDB`);
        return cachedData;
      }

      // 2. Cold boot fallback: fetch from Supabase once
      const bibleData = await fetchBibleFromSupabase(lang);
      await set(cacheKey, bibleData);
      cache[lang] = bibleData;
      delete inflight[lang];
      console.log(`[Bible] Persisted ${lang.toUpperCase()} Bible to IndexedDB`);
      return bibleData;
    } catch (e) {
      delete inflight[lang];
      throw e;
    }
  })();

  inflight[lang] = p;
  return p;
}

async function fetchBibleFromSupabase(lang: BibleLang): Promise<BibleData> {
  const tableName = lang === "en" ? "english_bible" : "tamil_bible";
  console.log(`[Bible] Initial download of ${lang.toUpperCase()} Bible from Supabase…`);

  const allRows: any[] = [];
  let start = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .range(start, start + limit - 1);
    if (error) throw error;
    allRows.push(...data);
    if (data.length < limit) break;
    start += limit;
  }

  const bibleData: BibleData = [];
  let isZeroIndexed = false;
  for (const row of allRows) {
    if (Number(row.book) === 0) {
      isZeroIndexed = true;
      break;
    }
  }

  for (const row of allRows) {
    const b = isZeroIndexed ? Number(row.book) : Number(row.book) - 1;
    const c = Number(row.chapter) - 1;
    const v = Number(row.versecount) - 1;

    if (!bibleData[b]) bibleData[b] = [];
    if (!bibleData[b][c]) bibleData[b][c] = [];
    bibleData[b][c][v] = row.verse;
  }

  return bibleData;
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
