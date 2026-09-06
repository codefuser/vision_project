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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg max-h-[85vh] bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              LIVE ON PROJECTOR
            </span>
          </div>

          <button
            type="button"
            onClick={() => setLiveModalOpen(false)}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Content Display */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentLive ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <Radio className="w-10 h-10 mx-auto opacity-30 animate-pulse" />
              <p className="font-semibold text-sm text-foreground">Projector is currently idle</p>
              <p className="text-xs max-w-xs mx-auto">
                Select any Verse, Song, Media, or Text item to start projecting.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Type Badge & Title */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-semibold uppercase tracking-wider">
                  {getTypeIcon()}
                  <span>{currentLive.type.replace("_", " ")}</span>
                </div>
                {isSongSlide && (
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    Slide {slideIndex + 1} of {totalSlides}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-foreground leading-tight">
                {currentLive.title}
              </h2>

              {/* Media Preview if Image */}
              {(currentLive.type === "image" || currentLive.type === "video") && (
                <div className="w-full aspect-video rounded-xl border border-border bg-muted/70 flex items-center justify-center overflow-hidden relative">
                  {mediaThumb ? (
                    <img
                      src={mediaThumb}
                      alt={currentLive.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      {currentLive.type === "video" ? (
                        <Film className="w-10 h-10 text-primary/70" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-primary/70" />
                      )}
                      <span className="text-xs uppercase font-mono">{currentLive.type}</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-emerald-400 font-bold">
                    ● PROJECTING
                  </div>
                </div>
              )}

              {/* Text / Lyric / Verse Details */}
              {currentLive.details && (
                <div className="p-4 rounded-xl border border-border/80 bg-muted/30 max-h-60 overflow-y-auto">
                  <p className="text-sm sm:text-base font-serif leading-relaxed text-foreground whitespace-pre-wrap text-center">
                    "{currentLive.details}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-3 border-t border-border bg-card flex flex-col gap-2 shrink-0">
          {/* Song Slide Step Controls if song is live */}
          {isSongSlide && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!hasPrevSlide}
                className="h-10 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-35 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <SkipBack className="w-4 h-4" /> Previous Slide
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasNextSlide}
                className="h-10 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-35 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
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
                "h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border",
                blackScreen
                  ? "bg-amber-500 text-black border-amber-500"
                  : "bg-muted text-foreground hover:bg-muted/80 border-border",
              )}
            >
              <Moon className="w-4 h-4" />
              <span>{blackScreen ? "Black Screen (ON)" : "Black Screen"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sendCommand({ action: "TRANSPORT", subAction: "CLEAR" });
                setLiveModalOpen(false);
              }}
              className="h-10 rounded-xl bg-muted text-foreground hover:bg-muted/80 border border-border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Square className="w-4 h-4 text-destructive" />
              <span>Clear Screen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
