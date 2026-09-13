# Core Business Logic & Algorithms

## 1. Tanglish Transliteration Engine

Located in:
* `src/lib/text/tanglish.ts`: Transliteration logic and word replacement.
* `src/lib/text/church-dictionary.ts`: Curated worship vocabulary mapping (e.g. *karthar* → கர்த்தர், *yesu* → இயேசு, *allaelooyaa* → அல்லேலூயா).
* `src/lib/text/tamil-corpus.ts`: Extended Tamil vocabulary corpus.
* `src/lib/text/dictionary-index.ts`: Pre-indexed search trie.

### Live Word Boundary Conversion
When typing in `TextPanel.tsx` in **Tanglish → தமிழ்** mode, completed Romanized words are converted into proper Tamil script the moment the operator presses a boundary key (`Space`, `Enter`, comma, period, or punctuation):
```ts
const BOUNDARY_RE = /[\s.,;:!?()[\]{}"'\u0964\u0965/\\-]/;
```

---

## 2. Scripture Reference Parser & Search

Located in:
* `src/lib/bible/search.ts`: Reference parser and full-text search.
* `src/lib/bible/books.ts`: 66 books with English and Tamil aliases.

### Parsing Supported Formats:
* **Standard Reference**: `John 3:16`, `யோவான் 3:16`
* **Abbreviated Reference**: `Jn 3:16`, `யோவா 3:16`, `Gen 1:1`, `ஆதி 1:1`
* **Verse Ranges**: `Psalm 23:1-6`, `சங்கீதம் 23:1-6`
* **Whole Chapter**: `Psalm 23`, `சங்கீதம் 23`
* **Free-Text Search**: Full-text searching across all 31,102 verses in either Tamil or English with keyword highlighting.

---

## 3. Song Stemming & Web Worker Search

Located in:
* `src/lib/songs/search.ts`: Ranking and scoring algorithms.
* `src/lib/songs/normalize.ts`: String cleaning and phonetic stemming.
* `src/lib/songs/song-search.worker.ts`: Dedicated Web Worker.
* `src/lib/songs/use-song-search-worker.ts`: React hook interface.

### The Search Challenge:
A church song library typically holds between **15,000 and 20,000 songs**. Running fuzzy multi-word regexes or Tanglish transliteration checks across 20,000 records on every keystroke freezes the browser main thread.

### VersoLyn's Architecture:
1. **Precomputed Fields**: During cold download, every song is parsed into `titleStem`, `contentStem`, and `slideStems` where diacritics, punctuation, and casing are pre-normalized.
2. **Web Worker Offloading**:
   Keystrokes in `SongsPanel.tsx` are debounced to $120\text{ms}$ and posted to `song-search.worker.ts`.
3. **Multi-Stage Scoring**:
   * Exact Title Match: Highest score ($100+$ points).
   * Title Starts-With: $80$ points.
   * Tanglish Transliteration Match: $60$ points.
   * Lyrics Content Match: $40$ points.
   * Partial Stem Match: $20$ points.
4. The worker returns only the top 50 ranked hits, maintaining $60\text{fps}$ butter-smooth UI scrolling.

---

## 4. Slide Splitting Invariant

Song lyrics and live text items are split into presentation slides using the double newline delimiter:
```ts
export function buildSlides(content: string): string[] {
  return content
    .split(/\n\s*\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
```
* Each chunk becomes an individual projection slide.
* Operators can click through slides sequentially using spacebar, arrow keys, or mobile remote taps.

---

## 5. Service Playlists & Cue Execution

Located in `src/features/playlists/` and `src/features/service/ServiceMode.tsx`:
* **Playlist Cue Model**: Each item references a `mediaId` in the database, carrying duration overrides for images and custom transition styles (`fade`, `crossfade`, `zoom`, `dissolve`, `none`).
* **Operator Cue Notes**: Operators can add private notes to each cue (e.g. *"Play during opening prayer"*, *"Fade after verse 2"*).
* **Service Mode**: A high-contrast, distraction-free stage sheet showing:
  * Current cue thumbnail + metadata.
  * Next upcoming cue preview.
  * Elapsed time counter.
  * Large Previous / Next trigger buttons.
