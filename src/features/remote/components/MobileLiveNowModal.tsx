import { X, Moon, Square, SkipBack, SkipForward, Radio, Film, Image as ImageIcon, BookOpen, Music, Type } from "lucide-react";
import { useRemoteClient } from "../remote-client.store";
import { cn } from "@/lib/utils";

export function MobileLiveNowModal() {
  const {
    isLiveModalOpen,
    setLiveModalOpen,
    currentLive,
    blackScreen,
    sendCommand,
    mediaThumbnails,
  } = useRemoteClient();

  if (!isLiveModalOpen) return null;

  const isSongSlide = currentLive?.type === "song_slide";
  const songMeta = currentLive?.metadata;
  const slideIndex = typeof songMeta?.slideIndex === "number" ? songMeta.slideIndex : 0;
  const totalSlides = typeof songMeta?.totalSlides === "number" ? songMeta.totalSlides : 1;
  const hasNextSlide = isSongSlide && slideIndex < totalSlides - 1;
  const hasPrevSlide = isSongSlide && slideIndex > 0;

  const handleNext = () => {
    if (!songMeta) return;
    sendCommand({ action: "TRANSPORT", subAction: "NEXT" });
  };

  const handlePrev = () => {
    if (!songMeta) return;
    sendCommand({ action: "TRANSPORT", subAction: "PREV" });
  };

  const getTypeIcon = () => {
    switch (currentLive?.type) {
      case "bible_verse":
        return <BookOpen className="w-3.5 h-3.5" />;
      case "song_slide":
        return <Music className="w-3.5 h-3.5" />;
      case "image":
        return <ImageIcon className="w-3.5 h-3.5" />;
      case "video":
        return <Film className="w-3.5 h-3.5" />;
      case "text":
        return <Type className="w-3.5 h-3.5" />;
      default:
        return <Radio className="w-3.5 h-3.5" />;
    }
  };

  const mediaThumb = currentLive?.metadata?.mediaId
    ? mediaThumbnails[currentLive.metadata.mediaId]
    : undefined;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4"
      onClick={() => setLiveModalOpen(false)}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] bg-card border border-border/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-border/80 bg-muted/40 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              LIVE ON PROJECTOR
            </span>
          </div>

          <button
            type="button"
            onClick={() => setLiveModalOpen(false)}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Content Display */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentLive ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <Radio className="w-12 h-12 mx-auto opacity-30 animate-pulse" />
              <p className="font-bold text-base text-foreground">Projector is Currently Idle</p>
              <p className="text-xs max-w-xs mx-auto text-muted-foreground/80">
                Select any Verse, Song, Media, or Text item in the remote tabs to project live to the congregation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Type Badge & Header Info */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-bold uppercase tracking-wider">
                  {getTypeIcon()}
                  <span>{currentLive.type.replace("_", " ")}</span>
                </div>
                {isSongSlide && (
                  <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    Slide {slideIndex + 1} of {totalSlides}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground leading-tight">
                  {currentLive.title}
                </h2>
              </div>

              {/* Media Preview if Image or Video */}
              {(currentLive.type === "image" || currentLive.type === "video") && (
                <div className="w-full aspect-video rounded-2xl border border-border bg-slate-950 flex items-center justify-center overflow-hidden relative shadow-inner">
                  {mediaThumb ? (
                    <img
                      src={mediaThumb}
                      alt={currentLive.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      {currentLive.type === "video" ? (
                        <Film className="w-12 h-12 text-primary/70" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-primary/70" />
                      )}
                      <span className="text-xs uppercase font-mono">{currentLive.type}</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/40">
                    ● PROJECTING
                  </div>
                </div>
              )}

              {/* Text / Lyric / Verse Stage Simulation Card */}
              {currentLive.details && (
                <div className="p-5 rounded-2xl border border-border/80 bg-slate-950 text-white min-h-[120px] max-h-72 overflow-y-auto flex items-center justify-center shadow-inner relative">
                  <p className="text-base sm:text-lg font-medium leading-relaxed whitespace-pre-wrap text-center font-sans">
                    {currentLive.details}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-3.5 border-t border-border/80 bg-card/95 flex flex-col gap-2 shrink-0">
          {/* Song Slide Step Controls if song is live */}
          {isSongSlide && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!hasPrevSlide}
                className="h-11 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-30 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 border border-border/50"
              >
                <SkipBack className="w-4 h-4" /> Previous Slide
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasNextSlide}
                className="h-11 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-primary/20 active:scale-95"
              >
                Next Slide <SkipForward className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Transport Controls */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                sendCommand({ action: "TRANSPORT", subAction: "BLACK", value: !blackScreen })
              }
              className={cn(
                "h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border active:scale-95",
                blackScreen
                  ? "bg-amber-500 text-black border-amber-500 shadow-xs"
                  : "bg-muted/70 text-foreground hover:bg-muted border-border/70",
              )}
            >
              <Moon className="w-4 h-4" />
              <span>{blackScreen ? "Black Screen (ACTIVE)" : "Blackout Screen"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sendCommand({ action: "TRANSPORT", subAction: "CLEAR" });
                setLiveModalOpen(false);
              }}
              className="h-11 rounded-xl bg-muted/70 text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border border-border/70 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Square className="w-4 h-4 text-destructive" />
              <span>Clear Projection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
