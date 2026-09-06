/**
 * Live Viewer Page for Mobile & Public Viewers.
 * View-only public livestream showing authoritative live projection in real time.
 *
 * NO CONTROL CAPABILITIES. NO SEARCH. NO TABS. VIEW-ONLY.
 */
import { useEffect, useState, useRef } from "react";
import { useViewerLiveQr } from "../live-qr-client.store";
import {
  Radio,
  WifiOff,
  Clock,
  BookOpen,
  Music,
  Image as ImageIcon,
  FileText,
  Maximize2,
  Minimize2,
  Tv,
  Loader2,
} from "lucide-react";

interface LiveViewerPageProps {
  tokenFromQuery?: string;
}

export function LiveViewerPage({ tokenFromQuery }: LiveViewerPageProps) {
  const { token, connectionStatus, liveState, errorMessage, connect, disconnect } =
    useViewerLiveQr();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const mountedRef = useRef(false);

  // Extract token from prop or URL search param
  const activeToken =
    tokenFromQuery ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("t") || ""
      : "");

  useEffect(() => {
    if (activeToken) {
      void connect(activeToken);
    }
  }, [activeToken, connect]);

  // Clean disconnect only when component completely leaves DOM
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Do not disconnect immediately if navigating within /live
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/live")) {
        void disconnect();
      }
    };
  }, [disconnect]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // ── EXPIRED OR INVALID STATE ───────────────────────────────────────────────
  if (connectionStatus === "expired" || connectionStatus === "invalid") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#070b14] px-4 text-center text-white select-none">
        <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-red-950/20 p-8 backdrop-blur-md shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400">
            <Clock className="h-7 w-7" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Live Link Expired</h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {errorMessage ||
              "This live projection link is no longer active. Please request a new QR code from the projection operator."}
          </p>
        </div>
      </div>
    );
  }

  // ── MISSING TOKEN STATE ────────────────────────────────────────────────────
  if (!activeToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#070b14] px-4 text-center text-white select-none">
        <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card/60 p-8 backdrop-blur-md shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <Radio className="h-7 w-7 animate-pulse" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Vision Projector Live</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Please scan a valid Live Projection QR code to watch the livestream.
          </p>
        </div>
      </div>
    );
  }

  const isLiveActive =
    liveState && liveState.isLive && !liveState.blackScreen && liveState.type !== "none";

  return (
    <div className="flex min-h-screen flex-col bg-[#070b14] text-white select-none overflow-x-hidden">
      {/* ── TOP HEADER ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#0a0f1d]/90 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-400">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-bold tracking-wider uppercase text-white/90">
                Vision Projector
              </h1>
              {connectionStatus === "connected" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              ) : connectionStatus === "disconnected" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-medium text-red-400">
                  Reconnecting...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  Connecting
                </span>
              )}
            </div>
            <p className="text-[10px] text-white/50">Viewer Stream • Token: {token || activeToken}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </header>

      {/* ── MAIN CONTENT VIEWPORT ───────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {/* CONNECTION LOSS NOTIFICATION */}
        {connectionStatus === "disconnected" && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-300">
            <WifiOff className="h-4 w-4 shrink-0 animate-pulse" />
            <span>Connection lost. Automatically reconnecting to live stream...</span>
          </div>
        )}

        {/* 1. BLACK SCREEN MUTED */}
        {liveState?.blackScreen ? (
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm max-w-md w-full my-auto shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 mb-3">
              <Tv className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white/80">Projector Muted</p>
            <p className="text-xs text-white/40 mt-1">
              Screen has been temporarily blacked out by the operator.
            </p>
          </div>
        ) : !isLiveActive ? (
          /* 2. INITIAL CONNECTING OR WAITING FOR PROJECTION */
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm max-w-md w-full my-auto shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-4">
              <Radio className="h-7 w-7 animate-pulse" />
            </div>
            <h2 className="text-base font-bold text-white/90">
              {connectionStatus === "connecting"
                ? "Connecting to Live Projection..."
                : "Waiting for Live Projection"}
            </h2>
            <p className="text-xs text-white/50 mt-2 leading-relaxed">
              {connectionStatus === "connecting"
                ? "Establishing live link with church presentation..."
                : "No content is currently being projected. Verses, songs, or media will automatically appear here when projected live."}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {connectionStatus === "connected"
                ? "Listening to live session"
                : "Connecting to realtime channel..."}
            </div>
          </div>
        ) : (
          /* 3. ACTIVE LIVE PROJECTION */
          <div className="w-full max-w-3xl flex flex-col items-center my-auto transition-all duration-300">
            {/* TYPE A: BIBLE VERSE */}
            {liveState.type === "bible_verse" && (
              <div className="w-full rounded-2xl border border-white/15 bg-gradient-to-b from-[#11192e] to-[#0d1322] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                {/* Verse Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                      {liveState.reference || liveState.title}
                    </h2>
                  </div>
                  {liveState.translation && (
                    <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-xs font-semibold text-white/80">
                      {liveState.translation}
                    </span>
                  )}
                </div>

                {/* Verse Scripture Text */}
                <div className="py-2">
                  <p className="text-lg sm:text-2xl font-serif leading-relaxed sm:leading-loose text-white/95 whitespace-pre-wrap selection:bg-sky-500/30">
                    {liveState.verseText || "Scripture verse"}
                  </p>
                </div>
              </div>
            )}

            {/* TYPE B: SONG SLIDE */}
            {liveState.type === "song_slide" && (
              <div className="w-full rounded-2xl border border-white/15 bg-gradient-to-b from-[#11192e] to-[#0d1322] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                {/* Song Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Music className="h-4 w-4" />
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                      {liveState.songTitle || liveState.title}
                    </h2>
                  </div>
                  {typeof liveState.slideIndex === "number" && (
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                      Slide {liveState.slideIndex}
                    </span>
                  )}
                </div>

                {/* Song Lyric Lines */}
                <div className="py-2 space-y-2">
                  {liveState.lines && liveState.lines.length > 0 ? (
                    liveState.lines.map((line, idx) => (
                      <p
                        key={idx}
                        className="text-lg sm:text-2xl font-medium leading-relaxed text-white/95 text-center"
                      >
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="text-base text-white/60 text-center italic">
                      Singing presentation in progress...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TYPE C: MEDIA (IMAGE) */}
            {liveState.type === "image" && (
              <div className="w-full rounded-2xl border border-white/15 bg-gradient-to-b from-[#11192e] to-[#0d1322] p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center">
                <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                      <ImageIcon className="h-4 w-4" />
                    </span>
                    <h2 className="text-sm sm:text-base font-semibold text-white/90 truncate">
                      {liveState.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                    Live Image
                  </span>
                </div>

                {/* Actual Projected Image */}
                <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl bg-black/60 border border-white/10 shadow-lg">
                  {liveState.imageDataUrl ? (
                    <img
                      src={liveState.imageDataUrl}
                      alt={liveState.title}
                      className="max-h-[70vh] w-full object-contain rounded-xl transition-transform duration-300"
                    />
                  ) : (
                    <div className="py-20 text-center text-xs text-white/40">
                      <ImageIcon className="mx-auto h-10 w-10 mb-2 text-white/20" />
                      Loading projected image...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TYPE D: MEDIA (VIDEO) */}
            {liveState.type === "video" && (
              <div className="w-full rounded-2xl border border-white/15 bg-gradient-to-b from-[#11192e] to-[#0d1322] p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center">
                <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
                      <Tv className="h-4 w-4" />
                    </span>
                    <h2 className="text-sm sm:text-base font-semibold text-white/90 truncate">
                      {liveState.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-pink-500/15 border border-pink-500/30 px-2 py-0.5 text-[10px] font-semibold text-pink-400">
                    Video Playing
                  </span>
                </div>

                <div className="w-full max-h-[70vh] aspect-video flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black/80 border border-white/10 shadow-lg relative">
                  {liveState.imageDataUrl && (
                    <img
                      src={liveState.imageDataUrl}
                      alt="Video Poster"
                      className="absolute inset-0 h-full w-full object-cover opacity-30"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center text-center p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 mb-2 animate-pulse">
                      <Tv className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-white">Video Playing on Main Screen</p>
                    <p className="text-xs text-white/50 mt-1">{liveState.title}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE E: LIVE TEXT / ANNOUNCEMENT / SERMON */}
            {(liveState.type === "live_text" ||
              liveState.type === "announcement" ||
              liveState.type === "sermon_point") && (
              <div className="w-full rounded-2xl border border-white/15 bg-gradient-to-b from-[#11192e] to-[#0d1322] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                      <FileText className="h-4 w-4" />
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                      {liveState.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                    Live Text
                  </span>
                </div>

                <div className="py-2">
                  <p className="text-lg sm:text-2xl font-medium leading-relaxed sm:leading-loose text-white/95 whitespace-pre-wrap text-center">
                    {liveState.textContent || liveState.title}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="py-3 px-4 text-center border-t border-white/5 text-[10px] text-white/40">
        Vision Projector • Live Viewer Stream • View Only
      </footer>
    </div>
  );
}
