import { supabase } from "../supabase";

export type BibleLang = "en" | "ta";

/** Verses: data[bookIndex][chapterIndex0Based][verseIndex0Based] = string */
export type BibleData = string[][][];



const cache: Partial<Record<BibleLang, BibleData>> = {};
const inflight: Partial<Record<BibleLang, Promise<BibleData>>> = {};

export function isBibleLoaded(lang: BibleLang): boolean {
  return !!cache[lang];
}

export function getBible(lang: BibleLang): BibleData | undefined {
  return cache[lang];
}

export async function loadBible(lang: BibleLang): Promise<BibleData> {
  if (cache[lang]) return cache[lang]!;
  if (inflight[lang]) return inflight[lang]!;
  
  const tableName = lang === "en" ? "english_bible" : "tamil_bible";

  const p = supabase.from(tableName).select("*")
    .then(({ data, error }) => {
      if (error) throw error;
      
      const bibleData: BibleData = [];
      let isZeroIndexed = false;
      for (const row of (data as any[])) {
        if (Number(row.book) === 0) {
          isZeroIndexed = true;
          break;
        }
      }

      for (const row of (data as any[])) {
        const b = isZeroIndexed ? Number(row.book) : Number(row.book) - 1;
        const c = Number(row.chapter) - 1;
        const v = Number(row.versecount) - 1;
        
        if (!bibleData[b]) bibleData[b] = [];
        if (!bibleData[b][c]) bibleData[b][c] = [];
        bibleData[b][c][v] = row.verse;
      }
      
      cache[lang] = bibleData;
      delete inflight[lang];
      return bibleData;
    })
    .catch((e) => {
      delete inflight[lang];
      throw e;
    });
  inflight[lang] = p;
  return p;
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
