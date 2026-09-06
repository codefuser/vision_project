import { useEffect, useState, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";
import { BIBLE_BOOKS, type BibleBookMeta } from "@/lib/bible/books";
import { loadBible, getBible, type BibleLang } from "@/lib/bible/loader";
import { search, getChapterVerses, type VerseHit } from "@/lib/bible/search";
import { useRemoteClient } from "../remote-client.store";
import { cn } from "@/lib/utils";

export function MobileVerseTab() {
  const { sendCommand, currentLive, searchQuery, setSearchQuery } = useRemoteClient();

  const query = searchQuery.verse || "";
  const [lang, setLang] = useState<BibleLang>("ta");
  const [loadingBible, setLoadingBible] = useState(false);
  const [activeBook, setActiveBook] = useState<BibleBookMeta | null>(null);
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [activeTestament, setActiveTestament] = useState<"OT" | "NT">("NT");

  // Load Bible data on mount
  useEffect(() => {
    let active = true;
    async function init() {
      if (!getBible("ta") || !getBible("en")) {
        setLoadingBible(true);
        try {
          await Promise.allSettled([loadBible("ta"), loadBible("en")]);
        } finally {
          if (active) setLoadingBible(false);
        }
      }
    }
    void init();
    return () => {
      active = false;
    };
  }, []);

  const bibleData = getBible(lang);

  // Compute search hits or chapter verses
  const results: VerseHit[] = useMemo(() => {
    if (!bibleData) return [];

    const q = query.trim();
    if (q) {
      return search(q, bibleData, lang, 40);
    }

    // Default: show current book & chapter
    const bookIndex = activeBook ? activeBook.index : 42; // default John (index 42 in 0-indexed)
    return getChapterVerses(bookIndex, activeChapter, bibleData, lang);
  }, [query, bibleData, lang, activeBook, activeChapter]);

  const handleProject = (hit: VerseHit) => {
    sendCommand({
      action: "PROJECT_VERSE",
      verseData: {
        book: hit.book,
        chapter: hit.chapter,
        verse: hit.verse,
      },
    });
  };

  const otBooks = BIBLE_BOOKS.filter((b) => b.testament === "OT");
  const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === "NT");

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Search and Language bar */}
      <div className="p-3 border-b border-border space-y-2 bg-card/60 backdrop-blur shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setSearchQuery("verse", e.target.value)}
              placeholder="Search verse (e.g. John 3:16, ps 23)..."
              className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-input bg-background placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setSearchQuery("verse", "")}
                className="absolute right-2.5 top-2.5 px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowBookPicker(true)}
            className="h-10 px-3 rounded-xl border border-border bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="truncate max-w-[80px]">
              {activeBook ? (lang === "ta" ? activeBook.nameTa : activeBook.name) : "Books"}
            </span>
          </button>
        </div>

        {/* Language & quick chapter selector pills */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => setLang("ta")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition cursor-pointer",
                lang === "ta" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition cursor-pointer",
                lang === "en" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              English
            </button>
          </div>

          {!query && activeBook && (
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[55%]">
              <span className="text-[11px] text-muted-foreground shrink-0 font-medium">Ch:</span>
              {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setActiveChapter(ch)}
                  className={cn(
                    "min-w-[26px] h-6 px-1.5 text-xs rounded font-medium shrink-0 cursor-pointer",
                    activeChapter === ch
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  {ch}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verses Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-24">
        {loadingBible ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            Loading Bible verses...
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs space-y-1">
            <BookOpen className="w-8 h-8 mx-auto opacity-30 mb-2" />
            <p className="font-medium text-foreground">No verses found</p>
            <p>Try searching &quot;John 3:16&quot;, &quot;Psalm 23&quot; or &quot;யோவான் 3:16&quot;</p>
          </div>
        ) : (
          results.map((hit) => {
            const isLive =
              currentLive?.type === "bible_verse" &&
              ((currentLive.metadata?.book === hit.book &&
                currentLive.metadata?.chapter === hit.chapter &&
                currentLive.metadata?.verse === hit.verse) ||
                currentLive.title.includes(`${hit.chapter}:${hit.verse}`));

            return (
              <div
                key={`${hit.book}:${hit.chapter}:${hit.verse}`}
                onClick={() => handleProject(hit)}
                className={cn(
                  "p-3.5 rounded-xl border transition cursor-pointer active:scale-[0.98] select-none text-left relative",
                  isLive
                    ? "bg-primary/10 border-primary shadow-sm ring-1 ring-primary/40"
                    : "bg-card border-border hover:border-primary/50 hover:bg-card/80",
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-primary flex items-center gap-1.5">
                    {hit.bookNameLocal} {hit.chapter}:{hit.verse}
                  </span>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground/70 font-medium">
                      Tap to Project
                    </span>
                  )}
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3">
                  {hit.text}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Book Picker Modal / Sheet */}
      {showBookPicker && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-end">
          <div className="bg-card border-t border-border rounded-t-2xl max-h-[85vh] flex flex-col p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-semibold text-sm">Select Bible Book</span>
              <button
                type="button"
                onClick={() => setShowBookPicker(false)}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* OT / NT Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted/60 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTestament("OT")}
                className={cn(
                  "py-1.5 rounded-md font-medium transition cursor-pointer",
                  activeTestament === "OT"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                Old Testament (பழைய ஏற்பாடு)
              </button>
              <button
                type="button"
                onClick={() => setActiveTestament("NT")}
                className={cn(
                  "py-1.5 rounded-md font-medium transition cursor-pointer",
                  activeTestament === "NT"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                New Testament (புதிய ஏற்பாடு)
              </button>
            </div>

            {/* Books Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 py-1">
              {(activeTestament === "OT" ? otBooks : ntBooks).map((book) => (
                <button
                  key={book.index}
                  type="button"
                  onClick={() => {
                    setActiveBook(book);
                    setActiveChapter(1);
                    setSearchQuery("verse", "");
                    setShowBookPicker(false);
                  }}
                  className={cn(
                    "p-2.5 rounded-lg border text-left text-xs transition cursor-pointer",
                    activeBook?.index === book.index
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border bg-card hover:bg-muted text-foreground",
                  )}
                >
                  <span className="font-medium block truncate">
                    {lang === "ta" ? book.nameTa : book.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    {book.chapters} chapters
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
