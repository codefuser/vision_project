import { useEffect, useState, useMemo } from "react";
import { Search, Music, ArrowLeft, ChevronRight, SkipBack, SkipForward, Loader2 } from "lucide-react";
import { useRemoteClient } from "../remote-client.store";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface RemoteSong {
  id: number;
  title: string;
  slides: string[];
  scale?: string;
}

export function MobileSongTab() {
  const {
    sendCommand,
    currentLive,
    searchQuery,
    setSearchQuery,
    selectedSongId,
    setSelectedSongId,
    requestSongSearch,
    recentHistory,
  } = useRemoteClient();

  const query = searchQuery.song || "";
  const [songs, setSongs] = useState<RemoteSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const debouncedQuery = useDebounce(query, 150);

  // Search or load initial song list on demand
  useEffect(() => {
    let active = true;
    const q = debouncedQuery.trim();

    async function performSearch() {
      setLoading(true);
      try {
        const results = await requestSongSearch(q || "a");
        if (active) {
          setSongs(results as RemoteSong[]);
        }
      } catch {
        if (active) setSongs([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void performSearch();
    return () => {
      active = false;
    };
  }, [debouncedQuery, requestSongSearch]);

  // Synchronized selected song from local list or context
  const selectedSong = useMemo(() => {
    if (!selectedSongId) return null;
    return songs.find((s) => s.id === selectedSongId) ?? null;
  }, [songs, selectedSongId]);

  // Context song from laptop (either currently live song or laptop selected song)
  const contextSong = useMemo(() => {
    if (currentLive?.type === "song_slide" && currentLive.metadata?.songId) {
      const match = songs.find((s) => s.id === currentLive.metadata?.songId);
      if (match) return match;
      if (currentLive.title) {
        return {
          id: currentLive.metadata.songId as number,
          title: currentLive.title,
          slides: [currentLive.details || ""],
          scale: "",
        };
      }
    }
    if (selectedSongId) {
      return songs.find((s) => s.id === selectedSongId) ?? null;
    }
    return null;
  }, [songs, currentLive, selectedSongId]);

  const handleProjectSlide = (song: RemoteSong, slideIdx: number) => {
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
            onClick={() => setSelectedSongId(null)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium py-1 px-2 rounded-lg bg-muted/60 cursor-pointer"
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
              ((currentLive.metadata?.songId === selectedSong.id &&
                currentLive.metadata?.slideIndex === idx) ||
                (currentLive.title.includes(selectedSong.title) &&
                  currentLive.title.includes(`slide ${idx + 1}`)));

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
            onChange={(e) => setSearchQuery("song", e.target.value)}
            placeholder="Search songs or lyrics..."
            className="w-full h-10 pl-9 pr-9 text-sm rounded-xl border border-input bg-background placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {loading ? (
            <div className="absolute right-3 top-3 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          ) : query ? (
            <button
              type="button"
              onClick={() => setSearchQuery("song", "")}
              className="absolute right-2.5 top-2.5 px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span>{songs.length} songs available</span>
          <span>Tap song to view slides</span>
        </div>
      </div>

      {/* Songs List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-24">
        {/* Current Song on Laptop context banner */}
        {contextSong && !query && (
          <div
            onClick={() => {
              setSelectedSongId(contextSong.id);
              setActiveSlideIndex(
                currentLive?.metadata?.slideIndex !== undefined
                  ? (currentLive.metadata.slideIndex as number)
                  : 0,
              );
            }}
            className="p-3 rounded-xl border border-primary/40 bg-primary/10 shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.98] transition mb-3"
          >
            <div className="min-w-0 flex-1 pr-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {currentLive?.metadata?.songId === contextSong.id
                    ? "Currently Projecting"
                    : "Selected on Laptop"}
                </span>
              </div>
              <p className="font-bold text-sm text-foreground truncate">{contextSong.title}</p>
              <p className="text-xs text-muted-foreground truncate">{contextSong.slides[0]}</p>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shrink-0 shadow-xs">
              View Slides
            </div>
          </div>
        )}

        {songs.length === 0 && !loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs space-y-1">
            <Music className="w-8 h-8 mx-auto opacity-30 mb-2" />
            <p className="font-medium text-foreground">No songs found</p>
            <p>Try searching another title or phrase</p>
          </div>
        ) : (
          songs.map((song) => {
            const isLive =
              currentLive?.type === "song_slide" &&
              (currentLive.metadata?.songId === song.id || currentLive.title.includes(song.title));

            return (
              <div
                key={song.id}
                onClick={() => {
                  setSelectedSongId(song.id);
                  setActiveSlideIndex(0);
                }}
                className={cn(
                  "p-3 rounded-xl border transition cursor-pointer select-none active:scale-[0.98] flex items-center justify-between text-left",
                  isLive
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-card border-border hover:border-primary/40",
                )}
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-foreground truncate">
                      {song.title}
                    </span>
                    {isLive && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30 shrink-0">
                        LIVE
                      </span>
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
