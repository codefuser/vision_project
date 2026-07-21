
// Just copy the whole algorithm to test
const TA_VOWELS = {
  '\u0B85': 'a', '\u0B86': 'a', '\u0B87': 'i', '\u0B88': 'i', '\u0B89': 'u',
  '\u0B8A': 'u', '\u0B8E': 'e', '\u0B8F': 'e', '\u0B90': 'ai', '\u0B92': 'o',
  '\u0B93': 'o', '\u0B94': 'au',
};
const TA_SIGNS = {
  '\u0BBE': 'a', '\u0BBF': 'i', '\u0BC0': 'i', '\u0BC1': 'u', '\u0BC2': 'u',
  '\u0BC6': 'e', '\u0BC7': 'e', '\u0BC8': 'ai', '\u0BCA': 'o', '\u0BCB': 'o',
  '\u0BCC': 'au',
};
const TA_CONS = {
  '\u0B95': 'k', '\u0B99': 'n', '\u0B9A': 's', '\u0B9E': 'n', '\u0B9F': 't',
  '\u0BA3': 'n', '\u0BA4': 't', '\u0BA8': 'n', '\u0BA9': 'n', '\u0BAA': 'p',
  '\u0BAE': 'm', '\u0BAF': 'y', '\u0BB0': 'r', '\u0BB1': 'r', '\u0BB2': 'l',
  '\u0BB3': 'l', '\u0BB4': 'l', '\u0BB5': 'v', '\u0BB6': 's', '\u0BB7': 's',
  '\u0BB8': 's', '\u0BB9': 'h',
};
const VIRAMA = '\u0BCD';

function tamilToLatin(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (TA_VOWELS[c]) { out += TA_VOWELS[c]; continue; }
    if (TA_SIGNS[c]) { out += TA_SIGNS[c]; continue; }
    if (TA_CONS[c]) {
      out += TA_CONS[c];
      const next = s[i + 1];
      if (next === VIRAMA) { i++; continue; }
      if (next && TA_SIGNS[next]) continue;
      out += 'a';
      continue;
    }
    if (c === VIRAMA) continue;
    out += c.toLowerCase();
  }
  return out;
}

function tanglishNorm(s) {
  let t = s.toLowerCase().trim();
  if (/[\u0B80-\u0BFF]/.test(t)) t = tamilToLatin(t);
  t = t.replace(/dh/g, 'd').replace(/th/g, 't').replace(/zh/g, 'l')
       .replace(/sh/g, 's').replace(/ch/g, 's').replace(/ph/g, 'p')
       .replace(/gh/g, 'k').replace(/kh/g, 'k').replace(/ng/g, 'nk');
  t = t.replace(/b/g, 'p').replace(/g/g, 'k').replace(/d/g, 't')
       .replace(/j/g, 's').replace(/f/g, 'p').replace(/w/g, 'v').replace(/h/g, '');
  t = t.replace(/oo/g, 'u').replace(/ee/g, 'i').replace(/aa/g, 'a').replace(/ea/g, 'e'); 
  t = t.replace(/([ptkmnlrsvy])\1+/g, '$1');
  t = t.replace(/[^a-z\s]/g, '');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function songStem(s) {
  if (!s) return '';
  let latin = /[\u0B80-\u0BFF]/.test(s) ? tamilToLatin(s) : s;
  let t = latin.toLowerCase();
  t = t.replace(/dh/g, 'd').replace(/th/g, 't').replace(/zh/g, 'l')
       .replace(/sh/g, 's').replace(/ch/g, 's').replace(/ph/g, 'p')
       .replace(/gh/g, 'k').replace(/kh/g, 'k').replace(/ng/g, 'nk');
  t = t.replace(/b/g, 'p').replace(/g/g, 'k').replace(/d/g, 't')
       .replace(/j/g, 's').replace(/f/g, 'p').replace(/w/g, 'v').replace(/h/g, '');
  t = t.replace(/[aeiou]/g, '');
  t = t.replace(/([^\s])\1+/g, '$1');
  t = t.replace(/[^a-z\s]/g, '');
  return t.trim();
}

function editDist(a, b, maxDist) {
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

function getMatchIndices(lineTokens, qTokens) {
  if (!qTokens.length || !lineTokens.length) return [];
  const indices = new Set();
  for (const qt of qTokens) {
    let bestDist = Infinity;
    let bestIdx = -1;
    for (let i = 0; i < lineTokens.length; i++) {
      const lt = lineTokens[i];
      if (lt === qt) { bestIdx = i; bestDist = 0; break; }
      if (lt.includes(qt) || qt.includes(lt)) {
        if (1 < bestDist) { bestDist = 1; bestIdx = i; }
      }
      if (Math.abs(lt.length - qt.length) <= 3) {
        const threshold = Math.min(3, Math.max(lt.length, qt.length) * 0.4);
        const d = editDist(lt, qt, threshold);
        if (d <= threshold && d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
    }
    if (bestIdx !== -1) indices.add(bestIdx);
  }
  return Array.from(indices);
}

const query = 'umaku uthavi theavai illa neerea periyavar';
const qnTokens = tanglishNorm(query).split(/\s+/).filter(t => t.length >= 2);
const qsTokens = songStem(query).split(/\s+/).filter(t => t.length >= 2);

const targetLine = 'உமக்கு உதவி தேவையில்லை நீரே பெரியவர்';
const lineNormTokens = targetLine.split(/\s+/).map(tanglishNorm).filter(t => t.length >= 2);
const lineStemTokens = targetLine.split(/\s+/).map(songStem).filter(t => t.length >= 2);

console.log('Query Norm:', qnTokens);
console.log('Line Norm:', lineNormTokens);

let indices = getMatchIndices(lineNormTokens, qnTokens);
let ls = (indices.length / qnTokens.length) * 100;
console.log('Base Line Score:', ls, 'Indices matched:', indices);

if (ls > 0 && qsTokens.length && lineStemTokens.length) {
  const stemIndices = getMatchIndices(lineStemTokens, qsTokens);
  ls += (stemIndices.length / qsTokens.length) * 30;
  console.log('Stem bonus added, new score:', ls);
}

