import React, { useState, useEffect } from "react";
import { Search, Music, BookOpen, FileText, X, Check, Languages } from "lucide-react";
import { getSongs, type Song } from "@/lib/songs/loader";
import { searchSongs, type SongHit } from "@/lib/songs/search";
import { getBible, getVerse, type BibleLang } from "@/lib/bible/loader";
import type { LibraryItem } from "./types";

// ─── 1. SONG IMPORT DIALOG ──────────────────────────────────────────────────
export function SongImportDialog({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (song: Song) => void;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SongHit[]>([]);
  const [selectedHit, setSelectedHit] = useState<SongHit | null>(null);

  useEffect(() => {
    if (!open) return;
    const songs = getSongs();
    if (!songs) return;
    if (!query.trim()) {
      setHits(
        songs.slice(0, 50).map((s) => ({
          song: s,
          score: 0,
          firstLine: s.title,
          matchedLine: s.title,
          contextLines: [{ text: s.title, isMatch: true }],
          highlightTokens: [],
        })),
      );
    } else {
      setHits(searchSongs(query, songs, 50));
    }
  }, [open, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 select-none backdrop-blur-sm">
      <div className="flex h-[80vh] w-full max-w-3xl flex-col rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-purple-400" />
            <h2 className="text-sm font-semibold text-foreground">Import Song to File Manager</h2>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-border bg-muted/20">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 16,000+ songs by title or lyrics…"
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>

        {/* Split View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Song Search Results List */}
          <div className="w-1/2 overflow-y-auto border-r border-border p-2">
            {hits.map((h) => (
              <div
                key={h.song.id}
                onClick={() => setSelectedHit(h)}
                className={`flex cursor-pointer flex-col rounded-lg p-2.5 my-1 text-xs transition border ${
                  selectedHit?.song.id === h.song.id
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border/40 hover:bg-accent hover:border-border"
                }`}
              >
                <span className="font-semibold text-foreground">{h.song.title}</span>
                <span className="line-clamp-1 text-[11px] text-muted-foreground mt-0.5">
                  {h.matchedLine}
                </span>
              </div>
            ))}
          </div>

          {/* Song Lyrics Preview */}
          <div className="w-1/2 overflow-y-auto p-4 bg-muted/10">
            {selectedHit ? (
              <div className="flex flex-col gap-3 text-xs">
                <h3 className="text-sm font-bold text-primary">{selectedHit.song.title}</h3>
                {selectedHit.song.scale && (
                  <span className="text-[10px] uppercase text-muted-foreground">
                    Key: {selectedHit.song.scale}
                  </span>
                )}
                <div className="space-y-2 mt-2">
                  {selectedHit.song.slides.map((slide, idx) => (
                    <div key={idx} className="rounded border border-border/50 bg-card p-2.5 shadow-sm">
                      <p className="whitespace-pre-line text-foreground/90">{slide}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Select a song to preview lyrics.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border p-3">
          <button onClick={onClose} className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
            Cancel
          </button>
          <button
            disabled={!selectedHit}
            onClick={() => {
              if (selectedHit) {
                onImport(selectedHit.song);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Import Song</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 2. BIBLE IMPORT DIALOG ──────────────────────────────────────────────────
export function BibleImportDialog({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (verse: { book: number; bookName: string; chapter: number; verse: number; text: string; lang: BibleLang }) => void;
}) {
  const [lang, setLang] = useState<BibleLang>("en");
  const [book, setBook] = useState(1); // Genesis
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(1);
  const [text, setText] = useState("");

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

  useEffect(() => {
    if (!open) return;
    const verseText = getVerse(lang, book, chapter, verse) || "Verse text not found.";
    setText(verseText);
  }, [open, lang, book, chapter, verse]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 select-none backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h2 className="text-sm font-semibold text-foreground">Import Bible Verse</h2>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4 text-xs">
          {/* Language Selector */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-2">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Languages className="h-4 w-4 text-primary" />
              <span>Language:</span>
            </span>
            <div className="flex items-center gap-1 rounded bg-background p-0.5 border border-border">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                English (KJV)
              </button>
              <button
                onClick={() => setLang("ta")}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  lang === "ta" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tamil (தமிழ்)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Book</label>
              <select
                value={book}
                onChange={(e) => setBook(Number(e.target.value))}
                className="mt-1 w-full rounded border border-input bg-background p-1.5 focus:outline-none"
              >
                {BOOK_NAMES_EN.map((name, i) => (
                  <option key={i} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Chapter</label>
              <input
                type="number"
                min="1"
                max="150"
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="mt-1 w-full rounded border border-input bg-background p-1.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Verse</label>
              <input
                type="number"
                min="1"
                max="176"
                value={verse}
                onChange={(e) => setVerse(Number(e.target.value))}
                className="mt-1 w-full rounded border border-input bg-background p-1.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-1 rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary">
                {BOOK_NAMES_EN[book - 1]} {chapter}:{verse}
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                {lang === "en" ? "English" : "Tamil"}
              </span>
            </div>
            <p className="mt-2 text-foreground leading-relaxed italic line-clamp-4">"{text}"</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-3">
          <button onClick={onClose} className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
            Cancel
          </button>
          <button
            onClick={() => {
              onImport({
                book,
                bookName: BOOK_NAMES_EN[book - 1],
                chapter,
                verse,
                text,
                lang,
              });
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Import Verse</span>
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
