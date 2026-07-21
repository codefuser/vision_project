/**
  * Advanced Tamil & Tanglish normalization pipeline.
  * Provides Unicode NFC normalization, consonant skeleton stemming,
  * Damerau-Levenshtein distance, Jaro-Winkler similarity, and N-gram trigrams.
  */

const TA_VOWELS: Record<string, string> = {
  "\u0B85": "a",
  "\u0B86": "a",
  "\u0B87": "i",
  "\u0B88": "i",
  "\u0B89": "u",
  "\u0B8A": "u",
  "\u0B8E": "e",
  "\u0B8F": "e",
  "\u0B90": "ai",
  "\u0B92": "o",
  "\u0B93": "o",
  "\u0B94": "au",
};
const TA_SIGNS: Record<string, string> = {
  "\u0BBE": "a",
  "\u0BBF": "i",
  "\u0BC0": "i",
  "\u0BC1": "u",
  "\u0BC2": "u",
  "\u0BC6": "e",
  "\u0BC7": "e",
  "\u0BC8": "ai",
  "\u0BCA": "o",
  "\u0BCB": "o",
  "\u0BCC": "au",
};
const TA_CONS: Record<string, string> = {
  "\u0B95": "k",
  "\u0B99": "n",
  "\u0B9A": "s",
  "\u0B9E": "n",
  "\u0B9F": "t",
  "\u0BA3": "n",
  "\u0BA4": "t",
  "\u0BA8": "n",
  "\u0BA9": "n",
  "\u0BAA": "p",
  "\u0BAE": "m",
  "\u0BAF": "y",
  "\u0BB0": "r",
  "\u0BB1": "r",
  "\u0BB2": "l",
  "\u0BB3": "l",
  "\u0BB4": "l",
  "\u0BB5": "v",
  "\u0BB6": "s",
  "\u0BB7": "s",
  "\u0BB8": "s",
  "\u0BB9": "h",
};
const VIRAMA = "\u0BCD";

/** Transliterate Tamil text to a permissive Latin form (lowercase). */
export function tamilToLatin(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (TA_VOWELS[c]) {
      out += TA_VOWELS[c];
      continue;
    }
    if (TA_SIGNS[c]) {
      out += TA_SIGNS[c];
      continue;
    }
    if (TA_CONS[c]) {
      out += TA_CONS[c];
      const next = s[i + 1];
      if (next === VIRAMA) {
        i++;
        continue;
      }
      if (next && TA_SIGNS[next]) continue;
      out += "a";
      continue;
    }
    if (c === VIRAMA) continue;
    out += c.toLowerCase();
  }
  return out;
}

/** Lowercase + lossless digraph and voicing normalization. */
export function tanglishLower(s: string): string {
  let t = s.toLowerCase();
  t = t
    .replace(/dh/g, "d")
    .replace(/th/g, "t")
    .replace(/zh/g, "l")
    .replace(/sh/g, "s")
    .replace(/ch/g, "s")
    .replace(/ph/g, "p")
    .replace(/gh/g, "k")
    .replace(/kh/g, "k")
    .replace(/ng/g, "nk");
  t = t
    .replace(/b/g, "p")
    .replace(/g/g, "k")
    .replace(/d/g, "t")
    .replace(/j/g, "s")
    .replace(/f/g, "p")
    .replace(/w/g, "v")
    .replace(/h/g, "");
  return t;
}

/** Aggressive Tanglish normalization */
export function tanglishNorm(s: string): string {
  let t = s.toLowerCase().trim();
  if (/[\u0B80-\u0BFF]/.test(t)) t = tamilToLatin(t);
  t = t
    .replace(/dh/g, "d")
    .replace(/th/g, "t")
    .replace(/zh/g, "l")
    .replace(/sh/g, "s")
    .replace(/ch/g, "s")
    .replace(/ph/g, "p")
    .replace(/gh/g, "k")
    .replace(/kh/g, "k")
    .replace(/ng/g, "nk");
  t = t
    .replace(/b/g, "p")
    .replace(/g/g, "k")
    .replace(/d/g, "t")
    .replace(/j/g, "s")
    .replace(/f/g, "p")
    .replace(/w/g, "v")
    .replace(/h/g, "");
  t = t.replace(/oo/g, "u").replace(/ee/g, "i").replace(/aa/g, "a").replace(/ea/g, "e");
  t = t.replace(/([ptkmnlrsvy])\1+/g, "$1");
  t = t.replace(/[^a-z\s]/g, "");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

/** Consonant skeleton — initial vowels collapsed so sound-alikes match. */
export function songStem(s: string): string {
  if (!s) return "";
  const latin = /[\u0B80-\u0BFF]/.test(s) ? tamilToLatin(s) : s;
  let t = tanglishLower(latin);
  t = t.replace(/^[aeiou]+/g, "");
  t = t.replace(/\s+[aeiou]+/g, " ");
  t = t.replace(/[aeiou]/g, "");
  t = t.replace(/([^\s])\1+/g, "$1");
  t = t.replace(/[^a-z\s]/g, "");
  return t.trim();
}

/** Damerau-Levenshtein distance (handles insertions, deletions, substitutions, and transpositions). */
export function damerauLevenshtein(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const d: number[][] = Array.from({ length: an + 1 }, () => new Array(bn + 1).fill(0));
  for (let i = 0; i <= an; i++) d[i][0] = i;
  for (let j = 0; j <= bn; j++) d[0][j] = j;

  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost, // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }
  return d[an][bn];
}

/** Jaro-Winkler Similarity (returns 0..1, great for prefix & typo match) */
export function jaroWinkler(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  const l1 = s1.length;
  const l2 = s2.length;
  if (l1 === 0 || l2 === 0) return 0.0;

  const matchDistance = Math.floor(Math.max(l1, l2) / 2) - 1;
  const s1Matches = new Array(l1).fill(false);
  const s2Matches = new Array(l2).fill(false);

  let matches = 0;
  for (let i = 0; i < l1; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, l2);
    for (let j = start; j < end; j++) {
      if (s2Matches[j]) continue;
      if (s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < l1; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }

  const jaro = (matches / l1 + matches / l2 + (matches - transpositions / 2) / matches) / 3;

  // Winkler prefix scale
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(l1, l2)); i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }

  return jaro + prefix * 0.1 * (1 - jaro);
}

/** Extract character trigrams for n-gram similarity matching */
export function getTrigrams(s: string): string[] {
  const str = `  ${s.toLowerCase()}  `;
  const trigrams: string[] = [];
  for (let i = 0; i < str.length - 2; i++) {
    trigrams.push(str.slice(i, i + 3));
  }
  return trigrams;
}

/** Compute Dice coefficient similarity between two strings using character trigrams */
export function trigramSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const triA = getTrigrams(a);
  const triB = getTrigrams(b);
  const mapB = new Map<string, number>();
  for (const t of triB) mapB.set(t, (mapB.get(t) ?? 0) + 1);
  let matches = 0;
  for (const t of triA) {
    const count = mapB.get(t);
    if (count && count > 0) {
      matches++;
      mapB.set(t, count - 1);
    }
  }
  return (2 * matches) / (triA.length + triB.length);
}

/** Bounded Levenshtein distance */
export function editDist(a: string, b: string, maxDist: number): number {
  const an = a.length;
  const bn = b.length;
  if (Math.abs(an - bn) > maxDist) return maxDist + 1;
  if (an === 0) return bn;
  if (bn === 0) return an;
  let prev = new Int32Array(bn + 1);
  let curr = new Int32Array(bn + 1);
  for (let j = 0; j <= bn; j++) prev[j] = j;
  for (let i = 1; i <= an; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > maxDist) return maxDist + 1;
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }
  return prev[bn];
}

/** Best-effort vowel-preserving normalization */
export function songLower(s: string): string {
  const latin = /[\u0B80-\u0BFF]/.test(s) ? tamilToLatin(s) : s;
  return tanglishLower(latin).replace(/\s+/g, " ").trim();
}

/* End of normalize.ts */
