import { useEffect, useState, useMemo } from "react";
import { Search, Music, ArrowLeft, ChevronRight, Play, SkipBack, SkipForward } from "lucide-react";
import { loadSongs, getSongs, type Song } from "@/lib/songs/loader";
import { useRemoteClient } from "../remote-client.store";
import { cn } from "@/lib/utils";

export function MobileSongTab() {
  const { sendCommand, currentLive } = useRemoteClient();

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

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

  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return songs.slice(0, 60);

    return songs
      .filter((s) => s.titleLower.includes(q) || s.id.toString() === q)
      .slice(0, 60);
  }, [songs, query]);

  const handleProjectSlide = (song: Song, slideIdx: number) => {
    setActiveSlideIndex(slideIdx);
    const text = song.slides[slideIdx] || "";
    sendCommand({
      action: "PROJECT_SONG_SLIDE",
      input: {
        songId: song.id,
        slideIndex: slideIdx,
        totalSlides: song.slides.length,
        title: song.title,
        text,
      },
    });
  };

  const handleNextSlide = () => {
    if (!selectedSong) return;
    const nextIdx = Math.min(activeSlideIndex + 1, selectedSong.slides.length - 1);
    handleProjectSlide(selectedSong, nextIdx);
  };

  const handlePrevSlide = () => {
    if (!selectedSong) return;
    const prevIdx = Math.max(activeSlideIndex - 1, 0);
    handleProjectSlide(selectedSong, prevIdx);
  };

  // ── Detail Slide View for Selected Song ─────────────────────────────────────
  if (selectedSong) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="p-3 border-b border-border flex items-center justify-between bg-card/70 backdrop-blur shrink-0">
          <button
            type="button"
            onClick={() => setSelectedSong(null)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium py-1 px-2 rounded-lg bg-muted/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Songs
          </button>
          <span className="text-xs font-semibold text-primary truncate max-w-[200px]">
            {selectedSong.title}
          </span>
        </div>

        {/* Slides List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-28">
          {selectedSong.slides.map((slideText, idx) => {
            const isLive =
              currentLive?.type === "song_slide" &&
              currentLive.title.includes(selectedSong.title) &&
              activeSlideIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => handleProjectSlide(selectedSong, idx)}
                className={cn(
                  "p-3.5 rounded-xl border transition cursor-pointer select-none active:scale-[0.98] text-left",
                  isLive
                    ? "bg-primary/10 border-primary ring-1 ring-primary/40 shadow-sm"
                    : "bg-card border-border hover:border-primary/40",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    Slide {idx + 1} of {selectedSong.slides.length}
                  </span>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Tap to Project</span>
                  )}
                </div>

                <p className="text-sm font-medium text-foreground whitespace-pre-line leading-relaxed">
                  {slideText}
                </p>
              </div>
            );
          })}
        </div>

        {/* Floating Bottom Navigator for Quick Slide Surfing */}
        <div className="fixed bottom-14 inset-x-0 p-3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none flex justify-center">
          <div className="pointer-events-auto flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border/80 px-4 py-2 rounded-2xl shadow-xl">
            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={activeSlideIndex <= 0}
              className="px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium flex items-center gap-1 hover:bg-secondary/80 disabled:opacity-40 cursor-pointer"
            >
              <SkipBack className="w-3.5 h-3.5" /> Prev Slide
            </button>
            <span className="text-xs font-mono font-bold text-foreground px-2">
              {activeSlideIndex + 1} / {selectedSong.slides.length}
            </span>
            <button
              type="button"
              onClick={handleNextSlide}
              disabled={activeSlideIndex >= selectedSong.slides.length - 1}
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:opacity-90 disabled:opacity-40 cursor-pointer"
            >
              Next Slide <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Song List View ──────────────────────────────────────────────────────────
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
            placeholder="Search song title or number..."
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
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span>{filteredSongs.length} songs</span>
          <span>Tap song to view slides</span>
        </div>
      </div>

      {/* Songs List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-24">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            Loading songs library...
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs space-y-1">
            <Music className="w-8 h-8 mx-auto opacity-30 mb-2" />
            <p className="font-medium text-foreground">No songs found</p>
            <p>Try searching another title or phrase</p>
          </div>
        ) : (
          filteredSongs.map((song) => {
            const isLive =
              currentLive?.type === "song_slide" && currentLive.title.includes(song.title);

            return (
              <div
                key={song.id}
                onClick={() => {
                  setSelectedSong(song);
                  setActiveSlideIndex(0);
                }}
                className={cn(
                  "p-3 rounded-xl border transition cursor-pointer select-none active:scale-[0.98] flex items-center justify-between text-left",
                  isLive
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:border-primary/40",
                )}
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-foreground truncate">
                      {song.title}
                    </span>
                    {isLive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {song.slides[0] || "No lyrics available"}
                  </p>
                  <span className="text-[10px] text-muted-foreground/60 font-mono mt-0.5 block">
                    {song.slides.length} slides {song.scale ? `• ${song.scale}` : ""}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
