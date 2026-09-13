import { useEffect, useState, useMemo } from "react";
import { Search, Music, ArrowLeft, ChevronRight, SkipBack, SkipForward, Loader2, Sparkles } from "lucide-react";
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
  } = useRemoteClient();

  const query = searchQuery.song || "";
  const [songs, setSongs] = useState<RemoteSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [optimisticLiveSlide, setOptimisticLiveSlide] = useState<{
    songId: number;
    slideIndex: number;
  } | null>(null);

  // Clear optimistic override once currentLive catches up
  useEffect(() => {
    if (!optimisticLiveSlide) return;
    if (
      currentLive?.type === "song_slide" &&
      currentLive.metadata?.songId === optimisticLiveSlide.songId &&
      currentLive.metadata?.slideIndex === optimisticLiveSlide.slideIndex
    ) {
      setOptimisticLiveSlide(null);
    } else if (currentLive && currentLive.type !== "song_slide") {
      setOptimisticLiveSlide(null);
    }
  }, [currentLive, optimisticLiveSlide]);

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

  const [activeSong, setActiveSong] = useState<RemoteSong | null>(null);

  // Synchronized selected song from local list or context
  const selectedSong = useMemo(() => {
    if (activeSong) return activeSong;
    if (!selectedSongId) return null;
    return songs.find((s) => s.id === selectedSongId) ?? null;
  }, [activeSong, songs, selectedSongId]);

  // Context song from laptop (either currently live song or laptop selected song)
  const contextSong = useMemo(() => {
    if (currentLive?.type === "song_slide" && currentLive.metadata?.songId) {
      const match = songs.find((s) => s.id === currentLive.metadata?.songId);
      if (match) return match;
      if (currentLive.title) {
        return {
          id: currentLive.metadata.songId as number,
          title: currentLive.title.replace(/\s*\(slide\s*\d+\)$/i, ""),
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
    setOptimisticLiveSlide({ songId: song.id, slideIndex: slideIdx });
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
        {/* Sticky Sub-Header */}
        <div className="p-3 border-b border-border/80 flex items-center justify-between bg-card/80 backdrop-blur-md shrink-0 shadow-xs">
          <button
            type="button"
            onClick={() => {
              setActiveSong(null);
              setSelectedSongId(null);
            }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold py-1.5 px-3 rounded-lg bg-muted/70 cursor-pointer active:scale-95 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          <div className="text-right min-w-0 flex-1 ml-3">
            <span className="text-xs font-bold text-foreground truncate block leading-tight">
              {selectedSong.title}
            </span>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              {selectedSong.scale && (
                <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.2 rounded font-semibold">
                  Scale: {selectedSong.scale}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground font-mono">
                {selectedSong.slides.length} Slides
              </span>
            </div>
          </div>
        </div>

        {/* Slides List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-28">
          {selectedSong.slides.map((slideText, idx) => {
            const isOptimisticMatch =
              optimisticLiveSlide !== null &&
              optimisticLiveSlide.songId === selectedSong.id &&
              optimisticLiveSlide.slideIndex === idx;

            const isHostLiveMatch =
              currentLive?.type === "song_slide" &&
              ((currentLive.metadata?.songId === selectedSong.id &&
                currentLive.metadata?.slideIndex === idx) ||
                (currentLive.title.includes(selectedSong.title) &&
                  currentLive.title.includes(`slide ${idx + 1}`)));

            const isLive = isOptimisticMatch || (!optimisticLiveSlide && isHostLiveMatch);

            return (
              <div
                key={idx}
                onClick={() => handleProjectSlide(selectedSong, idx)}
                className={cn(
                  "p-4 rounded-2xl border transition cursor-pointer select-none active:scale-[0.98] text-left relative",
                  isLive
                    ? "bg-primary/10 border-primary ring-2 ring-primary/40 shadow-sm"
                    : "bg-card border-border/80 hover:border-primary/40 hover:bg-card/90",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider font-mono">
                    Slide {idx + 1} of {selectedSong.slides.length}
                  </span>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/80 font-medium">
                      Tap to Project
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-foreground whitespace-pre-line leading-relaxed">
                  {slideText}
                </p>
              </div>
            );
          })}
        </div>

        {/* Floating Quick Slide Navigation Bar */}
        <div className="fixed bottom-28 inset-x-0 p-3 pointer-events-none flex justify-center z-25">
          <div className="pointer-events-auto flex items-center gap-2 bg-card/95 backdrop-blur-md border border-border/80 px-4 py-2 rounded-2xl shadow-xl">
            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={activeSlideIndex <= 0}
              className="h-8 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-semibold flex items-center gap-1 disabled:opacity-30 cursor-pointer active:scale-95 transition"
            >
              <SkipBack className="w-3.5 h-3.5" /> Prev
            </button>
            <span className="text-xs font-mono font-bold text-foreground px-2">
              {activeSlideIndex + 1} / {selectedSong.slides.length}
            </span>
            <button
              type="button"
              onClick={handleNextSlide}
              disabled={activeSlideIndex >= selectedSong.slides.length - 1}
              className="h-8 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 hover:opacity-90 disabled:opacity-30 cursor-pointer active:scale-95 transition shadow-xs"
            >
              Next <SkipForward className="w-3.5 h-3.5" />
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
      <div className="p-3 border-b border-border/80 bg-card/60 backdrop-blur-md shrink-0 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setSearchQuery("song", e.target.value)}
            placeholder="Search Tamil songs, Tanglish or lyrics..."
            className="w-full h-10 pl-9 pr-9 text-sm rounded-xl border border-input bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
          {loading ? (
            <div className="absolute right-3 top-3 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          ) : query ? (
            <button
              type="button"
              onClick={() => setSearchQuery("song", "")}
              className="absolute right-2.5 top-2.5 px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground font-medium rounded cursor-pointer"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span>{songs.length} songs available</span>
          <span className="font-medium">Tap song to view slides</span>
        </div>
      </div>

      {/* Songs List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-28">
        {/* Current Song on Laptop Context Banner */}
        {contextSong && !query && (
          <div
            onClick={() => {
              setActiveSong(contextSong);
              setSelectedSongId(contextSong.id);
            }}
            className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between cursor-pointer active:scale-[0.98] transition mb-3 shadow-xs"
          >
            <div className="min-w-0 flex-1 mr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-0.5">
                <Sparkles className="w-3 h-3" />
                Active on Projector / Workspace
              </span>
              <p className="text-xs font-bold text-foreground truncate">{contextSong.title}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold shrink-0 shadow-xs">
              View Slides
            </span>
          </div>
        )}

        {loading && !songs.length ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
            <p className="text-xs text-muted-foreground">Searching song library...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground space-y-2">
            <Music className="w-8 h-8 mx-auto opacity-30" />
            <p className="font-semibold text-sm text-foreground">No songs found</p>
            <p className="text-xs max-w-xs mx-auto">
              {query
                ? `No songs matching "${query}". Try searching in English Tanglish script.`
                : "No songs available in library."}
            </p>
          </div>
        ) : (
          songs.map((song) => {
            const isLive =
              (optimisticLiveSlide !== null && optimisticLiveSlide.songId === song.id) ||
              (currentLive?.type === "song_slide" &&
                (currentLive.metadata?.songId === song.id || currentLive.title.includes(song.title)));

            return (
              <div
                key={song.id}
                onClick={() => {
                  setActiveSong(song);
                  setSelectedSongId(song.id);
                }}
                className={cn(
                  "p-3.5 rounded-2xl border transition cursor-pointer active:scale-[0.98] flex items-center justify-between gap-2 text-left",
                  isLive
                    ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/40"
                    : "bg-card border-border/80 hover:border-primary/40 hover:bg-card/90",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-xs font-bold text-foreground truncate">{song.title}</p>
                    {isLive && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/30 shrink-0">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    {song.scale && (
                      <span className="font-mono bg-muted/80 px-1.5 py-0.2 rounded font-medium">
                        {song.scale}
                      </span>
                    )}
                    <span>{song.slides.length} slides</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
