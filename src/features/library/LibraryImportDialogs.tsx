import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Music,
  BookOpen,
  FileText,
  X,
  Check,
  Languages,
  Filter,
  CheckSquare,
  Square,
  ChevronRight,
  BookMarked,
} from "lucide-react";
import { getSongs, type Song } from "@/lib/songs/loader";
import { searchSongs, type SongHit } from "@/lib/songs/search";
import { getVerse, type BibleLang } from "@/lib/bible/loader";

const BOOK_NAMES_EN = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke",
  "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
  "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation",
];

const SONG_CATEGORIES = [
  "All",
  "Worship",
  "Praise",
  "Communion",
  "Offering",
  "Christmas",
  "Youth",
  "Easter",
  "Wedding",
  "Funeral",
  "Children",
  "Revival",
  "Prayer",
  "Fasting",
  "Mission",
];

// ─── 1. POWERFUL SONG BROWSER & MULTI-SONG IMPORT DIALOG ────────────────────
export function SongImportDialog({
  open,
  onClose,
  onImportBatch,
}: {
  open: boolean;
  onClose: () => void;
  onImportBatch: (songs: Song[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLang, setSelectedLang] = useState<"All" | "Tamil" | "English" | "Tanglish">("All");
  const [hits, setHits] = useState<SongHit[]>([]);
  const [selectedSongIds, setSelectedSongIds] = useState<Set<number>>(new Set());
  const [activePreviewHit, setActivePreviewHit] = useState<SongHit | null>(null);

  useEffect(() => {
    if (!open) return;
    const songs = getSongs();
    if (!songs) return;
    if (!query.trim()) {
      setHits(
        songs.slice(0, 80).map((s) => ({
          song: s,
          score: 0,
          firstLine: s.title,
          matchedLine: s.title,
          contextLines: [{ text: s.title, isMatch: true }],
          highlightTokens: [],
        })),
      );
    } else {
      setHits(searchSongs(query, songs, 100));
    }
  }, [open, query]);

  // Filter Hits by Category & Language
  const filteredHits = useMemo(() => {
    return hits.filter((h) => {
      if (selectedCategory !== "All") {
        if (h.song.category && !h.song.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }
      if (selectedLang !== "All") {
        if (selectedLang === "Tamil" && !/[\u0B80-\u0BFF]/.test(h.song.title + (h.song.slides[0] || ""))) return false;
        if (selectedLang === "English" && /[\u0B80-\u0BFF]/.test(h.song.title)) return false;
      }
      return true;
    });
  }, [hits, selectedCategory, selectedLang]);

  const toggleSelectSong = (songId: number) => {
    setSelectedSongIds((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) next.delete(songId);
      else next.add(songId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedSongIds.size === filteredHits.length) {
      setSelectedSongIds(new Set());
    } else {
      setSelectedSongIds(new Set(filteredHits.map((h) => h.song.id)));
    }
  };

  if (!open) return null;

  const allSongsMap = new Map(hits.map((h) => [h.song.id, h.song]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 select-none backdrop-blur-md">
      <div className="flex h-[88vh] w-full max-w-6xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <Music className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Song Browser & Batch Import</h2>
              <p className="text-[11px] text-muted-foreground">
                Search 16,000+ Christian songs across Tamil, Tanglish & English
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 3-Pane Browser Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Pane 1: Left Filters Sidebar */}
          <div className="w-56 shrink-0 border-r border-border bg-card/40 p-3 overflow-y-auto flex flex-col gap-4 text-xs">
            {/* Category Filters */}
            <div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <Filter className="h-3 w-3" /> Category
              </span>
              <div className="space-y-0.5">
                {SONG_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <ChevronRight className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Filters */}
            <div className="border-t border-border/50 pt-3">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <Languages className="h-3 w-3" /> Language
              </span>
              <div className="space-y-1">
                {(["All", "Tamil", "English", "Tanglish"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition ${
                      selectedLang === lang
                        ? "bg-purple-600 text-white font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <span>{lang}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pane 2: Center Results Grid */}
          <div className="flex flex-1 flex-col overflow-hidden bg-background">
            {/* Search Input & Select All Toolbar */}
            <div className="flex items-center justify-between gap-3 border-b border-border p-3 bg-muted/10">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, lyrics, Tamil or Tanglish…"
                  className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-accent"
              >
                {selectedSongIds.size === filteredHits.length && filteredHits.length > 0 ? (
                  <CheckSquare className="h-4 w-4 text-primary" />
                ) : (
                  <Square className="h-4 w-4 text-muted-foreground" />
                )}
                <span>Select All ({filteredHits.length})</span>
              </button>
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3">
              {filteredHits.map((h) => {
                const isChecked = selectedSongIds.has(h.song.id);
                const isInspected = activePreviewHit?.song.id === h.song.id;

                return (
                  <div
                    key={h.song.id}
                    onClick={() => setActivePreviewHit(h)}
                    className={`group relative flex flex-col justify-between cursor-pointer rounded-xl border p-3 shadow-sm transition ${
                      isInspected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-foreground line-clamp-1">{h.song.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectSong(h.song.id);
                          }}
                          className="shrink-0"
                        >
                          {isChecked ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          )}
                        </button>
                      </div>

                      <p className="mt-1 text-[11px] text-muted-foreground italic line-clamp-2 leading-relaxed">
                        {h.song.slides[0]?.split("\n").slice(0, 3).join(" / ")}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/40">
                      <span className="rounded bg-purple-500/10 px-1.5 py-0.5 font-semibold text-purple-400">
                        {h.song.slides.length} slides
                      </span>
                      {h.song.scale && <span className="uppercase font-mono">Key: {h.song.scale}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pane 3: Right Inspector Lyrics Preview */}
          <div className="w-80 shrink-0 border-l border-border bg-card/40 p-4 overflow-y-auto flex flex-col justify-between">
            {activePreviewHit ? (
              <div className="flex flex-col gap-3 text-xs">
                <div className="border-b border-border pb-2">
                  <h3 className="text-sm font-bold text-primary">{activePreviewHit.song.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    {activePreviewHit.song.scale && <span className="uppercase">Key: {activePreviewHit.song.scale}</span>}
                    <span>·</span>
                    <span>{activePreviewHit.song.slides.length} Slides</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Full Song Lyrics
                </span>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {activePreviewHit.song.slides.map((slide, idx) => (
                    <div key={idx} className="rounded-lg border border-border/60 bg-card p-2.5 shadow-sm">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Slide {idx + 1}</span>
                      <p className="mt-1 whitespace-pre-line text-foreground/90 leading-snug">{slide}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic">
                Select a song card to preview full lyrics & details.
              </div>
            )}

            {/* Import Action Footer */}
            <div className="pt-3 border-t border-border mt-3">
              <button
                disabled={selectedSongIds.size === 0}
                onClick={() => {
                  const selectedSongs = Array.from(selectedSongIds)
                    .map((id) => allSongsMap.get(id))
                    .filter(Boolean) as Song[];
                  onImportBatch(selectedSongs);
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                <span>Import Selected Songs ({selectedSongIds.size})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. MULTI-STEP BIBLE IMPORT DIALOG (WITH VERSE RANGE) ───────────────────
export function BibleImportDialog({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (verse: {
    book: number;
    bookName: string;
    chapter: number;
    verse: number;
    verseEnd: number;
    text: string;
    lang: BibleLang;
  }) => void;
}) {
  const [lang, setLang] = useState<BibleLang>("en");
  const [testament, setTestament] = useState<"all" | "ot" | "nt">("all");
  const [book, setBook] = useState(1); // Genesis
  const [chapter, setChapter] = useState(1);
  const [verseStart, setVerseStart] = useState(1);
  const [verseEnd, setVerseEnd] = useState(1);
  const [previewText, setPreviewText] = useState("");

  // Testament Books Filter
  const filteredBooks = useMemo(() => {
    return BOOK_NAMES_EN.map((name, idx) => ({ index: idx + 1, name })).filter((b) => {
      if (testament === "ot") return b.index <= 39;
      if (testament === "nt") return b.index >= 40;
      return true;
    });
  }, [testament]);

  useEffect(() => {
    if (!open) return;
    const start = Math.min(verseStart, verseEnd);
    const end = Math.max(verseStart, verseEnd);
    const lines: string[] = [];

    for (let v = start; v <= end; v++) {
      const line = getVerse(lang, book, chapter, v);
      if (line) lines.push(`[${v}] ${line}`);
    }

    setPreviewText(lines.join("\n\n") || "Verse text unavailable.");
  }, [open, lang, book, chapter, verseStart, verseEnd]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 select-none backdrop-blur-md">
      <div className="flex w-full max-w-xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Import Bible Passage</h2>
              <p className="text-[11px] text-muted-foreground">Multi-step verse range import workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* STEP 1: Language & Testament Bar */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">1. Language</label>
              <div className="mt-1 flex items-center rounded-lg border border-border bg-background p-1">
                <button
                  onClick={() => setLang("en")}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
                    lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  English (KJV)
                </button>
                <button
                  onClick={() => setLang("ta")}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
                    lang === "ta" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tamil (தமிழ்)
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">2. Testament</label>
              <div className="mt-1 flex items-center rounded-lg border border-border bg-background p-1">
                <button
                  onClick={() => setTestament("all")}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
                    testament === "all" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTestament("ot")}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
                    testament === "ot" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  OT (1-39)
                </button>
                <button
                  onClick={() => setTestament("nt")}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
                    testament === "nt" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  NT (40-66)
                </button>
              </div>
            </div>
          </div>

          {/* STEP 3, 4, 5: Book, Chapter & Verse Range */}
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-muted-foreground">3. Book</label>
              <select
                value={book}
                onChange={(e) => setBook(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-xs focus:outline-none"
              >
                {filteredBooks.map((b) => (
                  <option key={b.index} value={b.index}>
                    {b.index}. {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">4. Chapter</label>
              <input
                type="number"
                min="1"
                max="150"
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">5. Verse Start/End</label>
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="176"
                  value={verseStart}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setVerseStart(v);
                    if (verseEnd < v) setVerseEnd(v);
                  }}
                  className="w-full rounded-lg border border-input bg-background p-2 text-xs focus:outline-none text-center"
                />
                <span className="text-muted-foreground font-bold">-</span>
                <input
                  type="number"
                  min="1"
                  max="176"
                  value={verseEnd}
                  onChange={(e) => setVerseEnd(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background p-2 text-xs focus:outline-none text-center"
                />
              </div>
            </div>
          </div>

          {/* STEP 6: Live Verse Range Preview Card */}
          <div className="rounded-xl border border-border bg-muted/20 p-3.5">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                <BookMarked className="h-4 w-4" />
                {BOOK_NAMES_EN[book - 1]} {chapter}:{verseStart}
                {verseStart !== verseEnd && `-${verseEnd}`}
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-primary/20 text-primary">
                {lang === "en" ? "English" : "Tamil"}
              </span>
            </div>
            <p className="mt-2.5 whitespace-pre-line text-xs text-foreground/90 leading-relaxed italic max-h-40 overflow-y-auto pr-1">
              {previewText}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border p-3.5 bg-muted/10">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-accent">
            Cancel
          </button>
          <button
            onClick={() => {
              onImport({
                book,
                bookName: BOOK_NAMES_EN[book - 1],
                chapter,
                verse: Math.min(verseStart, verseEnd),
                verseEnd: Math.max(verseStart, verseEnd),
                text: previewText,
                lang,
              });
              onClose();
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md transition hover:bg-primary/90"
          >
            <Check className="h-4 w-4" />
            <span>Import Passage</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 3. TEXT IMPORT DIALOG ──────────────────────────────────────────────────
export function TextImportDialog({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (title: string, content: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 select-none backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-400" />
            <h2 className="text-sm font-semibold text-foreground">Create Announcement / Text</h2>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 text-xs">
          <div>
            <label className="font-medium text-muted-foreground">Title / Heading</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunday Service Announcement"
              className="mt-1 w-full rounded border border-input bg-background p-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="font-medium text-muted-foreground">Content Text</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type announcement body or note content…"
              className="mt-1 w-full rounded border border-input bg-background p-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-3">
          <button onClick={onClose} className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
            Cancel
          </button>
          <button
            disabled={!title.trim() || !content.trim()}
            onClick={() => {
              onImport(title, content);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Create Item</span>
          </button>
        </div>
      </div>
    </div>
  );
}
