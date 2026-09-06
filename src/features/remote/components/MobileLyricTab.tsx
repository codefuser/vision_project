import { useEffect, useState, useMemo } from "react";
import { Search, FileText, Check } from "lucide-react";
import { loadSongs, getSongs, type Song } from "@/lib/songs/loader";
import { useRemoteClient } from "../remote-client.store";
import { cn } from "@/lib/utils";

interface LyricSlideMatch {
  song: Song;
  slideIndex: number;
  slideText: string;
  matchedLine: string;
}

export function MobileLyricTab() {
  const { sendCommand, currentLive } = useRemoteClient();

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function init() {
      const existing = getSongs();
      if (existing && existing.length > 0) {
        setSongs(existing);
        return;
      }
      setLoading(true);
      try {
        const loaded = await loadSongs();
        if (active) setSongs(loaded || []);
      } finally {
        if (active) setLoading(false);
      }
    }
    void init();
    return () => {
      active = false;
    };
  }, []);

  // Search across all slides of all songs
  const matches: LyricSlideMatch[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const results: LyricSlideMatch[] = [];

    for (const song of songs) {
      for (let slideIdx = 0; slideIdx < song.slides.length; slideIdx++) {
        const slideText = song.slides[slideIdx];
        const lower = slideText.toLowerCase();

        if (lower.includes(q)) {
          // Find exact matching line
          const lines = slideText.split(/\n/);
          const matchedLine = lines.find((l) => l.toLowerCase().includes(q)) || lines[0] || "";

          results.push({
            song,
            slideIndex: slideIdx,
            slideText,
            matchedLine,
          });

          if (results.length >= 50) break;
        }
      }
      if (results.length >= 50) break;
    }

    return results;
  }, [songs, query]);

  const handleProject = (m: LyricSlideMatch) => {
    sendCommand({
      action: "PROJECT_SONG_SLIDE",
      input: {
        songId: m.song.id,
        slideIndex: m.slideIndex,
        totalSlides: m.song.slides.length,
        title: m.song.title,
        text: m.slideText,
      },
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Search Header */}
      <div className="p-3 border-b border-border bg-card/60 backdrop-blur shrink-0 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lyrics phrase (e.g. உம்மைத்தான், holy)..."
            className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-input bg-background placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-2.5 px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground px-1">
          Instant lyric search across all songs. Tap any slide card to project immediately.
        </p>
      </div>

      {/* Lyric Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-24">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            Loading songs library for lyrics search...
          </div>
        ) : !query.trim() ? (
          <div className="text-center py-12 text-muted-foreground text-xs space-y-1">
            <FileText className="w-8 h-8 mx-auto opacity-30 mb-2" />
            <p className="font-medium text-foreground">Type a lyric line to search</p>
            <p>Find any song instantly even if you don&apos;t know the title</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs space-y-1">
            <p className="font-medium text-foreground">No lyrics match &quot;{query}&quot;</p>
            <p>Try fewer words or check spelling</p>
          </div>
        ) : (
          matches.map((m, idx) => {
            const isLive =
              currentLive?.type === "song_slide" &&
              currentLive.title.includes(m.song.title) &&
              currentLive.details?.includes(m.matchedLine);

            return (
              <div
                key={`${m.song.id}-${m.slideIndex}-${idx}`}
                onClick={() => handleProject(m)}
                className={cn(
                  "p-3.5 rounded-xl border transition cursor-pointer select-none active:scale-[0.98] text-left",
                  isLive
                    ? "bg-primary/10 border-primary ring-1 ring-primary/40 shadow-sm"
                    : "bg-card border-border hover:border-primary/40",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-xs text-primary truncate block">
                      {m.song.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Slide {m.slideIndex + 1} of {m.song.slides.length}
                    </span>
                  </div>

                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      Tap to Project
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-foreground whitespace-pre-line leading-relaxed">
                  {m.slideText}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
