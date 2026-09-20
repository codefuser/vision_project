import { useEffect, useState, useMemo } from "react";
import { Search, BookOpen, Loader2, X, ChevronRight, Hash } from "lucide-react";
import { BIBLE_BOOKS, type BibleBookMeta } from "@/lib/bible/books";
import { parseReference } from "@/lib/bible/search";
import type { BibleLang } from "@/lib/bible/loader";
import { useRemoteClient } from "../remote-client.store";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface VerseItem {
  book: number;
  bookName: string;
  bookNameLocal: string;
  chapter: number;
  verse: number;
  text: string;
}

export function MobileVerseTab() {
  const {
    sendCommand,
    currentLive,
    searchQuery,
    setSearchQuery,
    requestVerseSearch,
    requestChapterVerses,
    selectedVerseData,
  } = useRemoteClient();

  const query = searchQuery.verse || "";
  const [lang, setLang] = useState<BibleLang>("ta");
  const [loading, setLoading] = useState(false);
  // Default book John (index 42)
  const [activeBook, setActiveBook] = useState<BibleBookMeta>(() => BIBLE_BOOKS[42]);
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [chapterVerses, setChapterVerses] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<VerseItem[]>([]);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showChapterPicker, setShowChapterPicker] = useState(false);
  const [activeTestament, setActiveTestament] = useState<"OT" | "NT">("NT");
  const [bookFilterQuery, setBookFilterQuery] = useState("");
  const [optimisticLiveVerse, setOptimisticLiveVerse] = useState<{
    book: number;
    chapter: number;
    verse: number;
  } | null>(null);

  // Clear optimistic override once currentLive catches up or switches
  useEffect(() => {
    if (!optimisticLiveVerse) return;
    if (
      currentLive?.type === "bible_verse" &&
      currentLive.metadata?.book === optimisticLiveVerse.book &&
      currentLive.metadata?.chapter === optimisticLiveVerse.chapter &&
      currentLive.metadata?.verse === optimisticLiveVerse.verse
    ) {
      setOptimisticLiveVerse(null);
    } else if (currentLive && currentLive.type !== "bible_verse") {
      setOptimisticLiveVerse(null);
    }
  }, [currentLive, optimisticLiveVerse]);

  const debouncedQuery = useDebounce(query, 150);

  // Auto-navigate to the book+chapter when laptop projects a verse
  // This ensures the phone mirrors the laptop without the user having to search
  useEffect(() => {
    if (currentLive?.type !== "bible_verse") return;
    const book = currentLive.metadata?.book as number | undefined;
    const chapter = currentLive.metadata?.chapter as number | undefined;
    if (book === undefined || !chapter) return;
    const bookMeta = BIBLE_BOOKS[book];
    if (!bookMeta) return;
    // Only auto-navigate when not actively searching
    if (debouncedQuery.trim()) return;
    setActiveBook((prev) => (prev.index === book ? prev : bookMeta));
    setActiveChapter((prev) => (prev === chapter ? prev : chapter));
  }, [currentLive, debouncedQuery]);

  // Use host-pushed chapter verses instantly (skip GET_CHAPTER_VERSES round-trip)
  useEffect(() => {
    if (!selectedVerseData) return;
    if (
      selectedVerseData.book === activeBook.index &&
      selectedVerseData.chapter === activeChapter
    ) {
      setChapterVerses(selectedVerseData.verses);
      setLoading(false);
    }
  }, [selectedVerseData, activeBook.index, activeChapter]);

  // 1. Fetch verses for selected book & chapter when not searching
  useEffect(() => {
    let active = true;
    if (debouncedQuery.trim()) return;

    // Skip network call if the host already pushed this chapter's verses
    if (
      selectedVerseData &&
      selectedVerseData.book === activeBook.index &&
      selectedVerseData.chapter === activeChapter
    ) {
      return;
    }

    async function loadChapter() {
      setLoading(true);
      try {
        const verses = await requestChapterVerses(activeBook.index, activeChapter, lang);
        if (active) {
          setChapterVerses(verses);
        }
      } catch {
        if (active) setChapterVerses([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadChapter();
    return () => {
      active = false;
    };
  }, [activeBook.index, activeChapter, lang, debouncedQuery, requestChapterVerses, selectedVerseData]);


  // 2. Perform search when query changes
  useEffect(() => {
    let active = true;
    const q = debouncedQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    async function doSearch() {
      setLoading(true);
      try {
        // Fast local reference parser first
        const parsed = parseReference(q);
        if (parsed && parsed.chapter) {
          const chVerses = await requestChapterVerses(parsed.book.index, parsed.chapter, lang);
          if (active) {
            const hits: VerseItem[] = [];
            const vStart = parsed.verse || 1;
            const vEnd = parsed.verseEnd || parsed.verse || chVerses.length;
            for (let v = vStart; v <= Math.min(vEnd, chVerses.length); v++) {
              const text = chVerses[v - 1];
              if (text) {
                hits.push({
                  book: parsed.book.index,
                  bookName: parsed.book.name,
                  bookNameLocal: lang === "ta" ? parsed.book.nameTa : parsed.book.name,
                  chapter: parsed.chapter,
                  verse: v,
                  text,
                });
              }
            }
            setSearchResults(hits);
          }
          return;
        }

        // Full text verse search on demand
        const hits = await requestVerseSearch(q, lang);
        if (active) {
          setSearchResults(
            hits.map((h) => {
              const b = BIBLE_BOOKS[h.book] || { name: "", nameTa: "" };
              return {
                book: h.book,
                bookName: b.name,
                bookNameLocal: lang === "ta" ? b.nameTa : b.name,
                chapter: h.chapter,
                verse: h.verse,
                text: h.text,
              };
            }),
          );
        }
      } catch {
        if (active) setSearchResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void doSearch();
    return () => {
      active = false;
    };
  }, [debouncedQuery, lang, requestVerseSearch, requestChapterVerses]);

  // Current display list
  const results: VerseItem[] = useMemo(() => {
    const q = debouncedQuery.trim();
    if (q) return searchResults;

    const bookNameLocal = lang === "ta" ? activeBook.nameTa : activeBook.name;
    return chapterVerses.map((text, idx) => ({
      book: activeBook.index,
      bookName: activeBook.name,
      bookNameLocal,
      chapter: activeChapter,
      verse: idx + 1,
      text,
    }));
  }, [debouncedQuery, searchResults, chapterVerses, activeBook, activeChapter, lang]);

  const handleProject = (hit: VerseItem) => {
    setOptimisticLiveVerse({
      book: hit.book,
      chapter: hit.chapter,
      verse: hit.verse,
    });
    sendCommand({
      action: "PROJECT_VERSE",
      verseData: {
        book: hit.book,
        chapter: hit.chapter,
        verse: hit.verse,
      },
      directInput: {
        reference: `${hit.bookNameLocal} ${hit.chapter}:${hit.verse}`,
        text: hit.text,
        translation: lang === "ta" ? "Tamil" : "English",
        book: hit.book,
        chapter: hit.chapter,
        verse: hit.verse,
      },
    });
  };

  const otBooks = BIBLE_BOOKS.filter((b) => b.testament === "OT");
  const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === "NT");

  const filteredBooks = useMemo(() => {
    const list = activeTestament === "OT" ? otBooks : ntBooks;
    if (!bookFilterQuery.trim()) return list;
    const q = bookFilterQuery.toLowerCase().trim();
    return list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.nameTa.toLowerCase().includes(q) ||
        b.aliases.some((a) => a.toLowerCase().includes(q)),
    );
  }, [activeTestament, otBooks, ntBooks, bookFilterQuery]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Search & Navigation Control Header */}
      <div className="p-3 border-b border-border/80 space-y-2 bg-card/60 backdrop-blur-md shrink-0">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setSearchQuery("verse", e.target.value)}
            placeholder="Search verse (e.g. John 3:16, Ps 23, அன்பு)..."
            className="w-full h-10 pl-9 pr-9 text-sm rounded-xl border border-input bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
          {loading ? (
            <div className="absolute right-3 top-3 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          ) : query ? (
            <button
              type="button"
              onClick={() => setSearchQuery("verse", "")}
              className="absolute right-2.5 top-2.5 px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground font-medium rounded cursor-pointer"
            >
              Clear
            </button>
          ) : null}
        </div>

        {/* Book, Chapter & Language Selector Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Book & Chapter Pills */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setShowBookPicker(true)}
              className="h-8.5 px-2.5 rounded-lg border border-border bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs font-semibold flex items-center gap-1.5 min-w-0 max-w-[130px] truncate cursor-pointer transition active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">
                {lang === "ta" ? activeBook.nameTa : activeBook.name}
              </span>
            </button>

            {!query && (
              <button
                type="button"
                onClick={() => setShowChapterPicker(true)}
                className="h-8.5 px-2.5 rounded-lg border border-border bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs font-semibold flex items-center gap-1 cursor-pointer transition active:scale-95 shrink-0"
                title="Select chapter"
              >
                <Hash className="w-3 h-3 text-primary" />
                <span>Ch. {activeChapter}</span>
              </button>
            )}
          </div>

          {/* Language Toggle */}
          <div className="flex rounded-lg border border-border bg-muted/60 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setLang("ta")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer",
                lang === "ta"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer",
                lang === "en"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Verses List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-28">
        {loading && !results.length ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
            <p className="text-xs text-muted-foreground">Loading passage scriptures...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground space-y-2">
            <BookOpen className="w-8 h-8 mx-auto opacity-30" />
            <p className="font-semibold text-sm text-foreground">No verses found</p>
            <p className="text-xs max-w-xs mx-auto">
              {query
                ? `No scripture matching "${query}". Try searching by book name like "John 3:16" or Tamil keywords.`
                : "No verses available in this chapter."}
            </p>
          </div>
        ) : (
          results.map((hit) => {
            const isOptimisticMatch =
              optimisticLiveVerse !== null &&
              optimisticLiveVerse.book === hit.book &&
              optimisticLiveVerse.chapter === hit.chapter &&
              optimisticLiveVerse.verse === hit.verse;

            const isHostLiveMatch =
              currentLive?.type === "bible_verse" &&
              ((currentLive.metadata?.book === hit.book &&
                currentLive.metadata?.chapter === hit.chapter &&
                currentLive.metadata?.verse === hit.verse) ||
                currentLive.title.includes(`${hit.bookNameLocal} ${hit.chapter}:${hit.verse}`) ||
                currentLive.title.includes(`${hit.bookName} ${hit.chapter}:${hit.verse}`) ||
                currentLive.title.includes(`${hit.chapter}:${hit.verse}`));

            const isLive = isOptimisticMatch || (!optimisticLiveVerse && isHostLiveMatch);

            return (
              <div
                key={`${hit.book}:${hit.chapter}:${hit.verse}`}
                onClick={() => handleProject(hit)}
                className={cn(
                  "p-3.5 rounded-xl border transition cursor-pointer active:scale-[0.98] select-none text-left relative",
                  isLive
                    ? "bg-primary/10 border-primary shadow-sm ring-2 ring-primary/40"
                    : "bg-card border-border/80 hover:border-primary/50 hover:bg-card/90",
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">
                      {hit.bookNameLocal} {hit.chapter}:{hit.verse}
                    </span>
                  </div>

                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/80 font-medium">
                      Tap to Project
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-foreground/90 leading-relaxed">
                  {hit.text}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Book Picker Modal / Sheet */}
      {showBookPicker && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-card border-t border-border rounded-t-2xl max-h-[85vh] flex flex-col p-4 space-y-3 animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <span className="font-bold text-sm">Select Bible Book</span>
              <button
                type="button"
                onClick={() => {
                  setShowBookPicker(false);
                  setBookFilterQuery("");
                }}
                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Book Filter Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={bookFilterQuery}
                onChange={(e) => setBookFilterQuery(e.target.value)}
                placeholder="Type to filter books..."
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-input bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* OT / NT Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTestament("OT")}
                className={cn(
                  "py-1.5 rounded-lg font-bold transition cursor-pointer",
                  activeTestament === "OT"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground",
                )}
              >
                Old Testament ({otBooks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTestament("NT")}
                className={cn(
                  "py-1.5 rounded-lg font-bold transition cursor-pointer",
                  activeTestament === "NT"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground",
                )}
              >
                New Testament ({ntBooks.length})
              </button>
            </div>

            {/* Books Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 py-1">
              {filteredBooks.map((book) => (
                <button
                  key={book.index}
                  type="button"
                  onClick={() => {
                    setActiveBook(book);
                    setActiveChapter(1);
                    setSearchQuery("verse", "");
                    setShowBookPicker(false);
                    setBookFilterQuery("");
                    setShowChapterPicker(true);
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between",
                    activeBook.index === book.index
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border/80 bg-card hover:bg-muted/60 text-foreground",
                  )}
                >
                  <div className="min-w-0">
                    <span className="font-semibold block truncate">
                      {lang === "ta" ? book.nameTa : book.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono block">
                      {book.chapters} Ch.
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chapter Picker Modal / Sheet */}
      {showChapterPicker && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-card border-t border-border rounded-t-2xl max-h-[75vh] flex flex-col p-4 space-y-3 animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div>
                <span className="font-bold text-sm block">
                  Select Chapter: {lang === "ta" ? activeBook.nameTa : activeBook.name}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {activeBook.chapters} total chapters
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowChapterPicker(false)}
                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chapters Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-5 sm:grid-cols-8 gap-2 py-2">
              {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => {
                    setActiveChapter(ch);
                    setShowChapterPicker(false);
                  }}
                  className={cn(
                    "h-11 rounded-xl border text-sm font-bold flex items-center justify-center transition cursor-pointer active:scale-95",
                    activeChapter === ch
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border/80 bg-card hover:bg-muted text-foreground",
                  )}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
