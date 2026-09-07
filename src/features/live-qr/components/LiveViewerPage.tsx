/**
 * Live Viewer Page for Mobile & Public Viewers.
 *
 * True live mirror of the church projector preview:
 * - Direct 16:9 proportional stage rendering (identical to desktop preview)
 * - Identical fonts, sizes, weights, shadows, colors, and background themes
 * - Aspect-preserving direct media projection (object-fit: contain, full resolution)
 * - Instant blackout screen synchronization
 * - Strictly view-only (no operator controls, no database searching, no editing)
 * - Completely removes legacy card UI containers and slide badges
 */
import { useEffect, useState, useRef } from "react";
import { useViewerLiveQr } from "../live-qr-client.store";
import { ProjectionRenderer } from "@/components/ProjectionRenderer";
import type { TextOverlay } from "@/lib/broadcast";
import {
  Radio,
  WifiOff,
  Clock,
  Maximize2,
  Minimize2,
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

  // Extract token from prop or URL search param (?t=TOKEN)
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

  // Clean disconnect only when component leaves DOM
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/live")) {
        void disconnect();
      }
    };
  }, [disconnect]);

  // Track fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // ── EXPIRED OR INVALID SESSION ──────────────────────────────────────────────
  if (connectionStatus === "expired" || connectionStatus === "invalid") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center text-white select-none">
        <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-neutral-900/90 p-8 backdrop-blur-md shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400">
            <Clock className="h-7 w-7" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Live Link Expired</h1>
          <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
            {errorMessage ||
              "This live projection link is no longer active. Please scan a fresh QR code from the projection operator."}
          </p>
        </div>
      </div>
    );
  }

  // ── MISSING TOKEN STATE ────────────────────────────────────────────────────
  if (!activeToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center text-white select-none">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 backdrop-blur-md shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <Radio className="h-7 w-7 animate-pulse" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Vision Projector Live</h1>
          <p className="mt-2 text-xs text-neutral-400">
            Please scan a valid Live Projection QR code to watch the livestream mirror.
          </p>
        </div>
      </div>
    );
  }

  // ── SYNTHESIZE TEXT OVERLAY (FALLBACK FOR LEGACY OR PARTIAL PAYLOADS) ───────
  const textOverlay: TextOverlay | null =
    liveState?.textOverlay ??
    (liveState?.type === "song_slide" && liveState.lines && liveState.lines.length > 0
      ? {
          reference: "",
          referenceEn: "",
          referenceTa: "",
          text: liveState.lines.join("\n"),
          textEn: "",
          textTa: liveState.lines.join("\n"),
          translation: "",
          mode: "ta",
          kind: "song_slide",
        }
      : liveState?.type === "bible_verse" && liveState.verseText
        ? {
            reference: liveState.reference || liveState.title,
            text: liveState.verseText,
            translation: liveState.translation || "Bible",
            kind: "bible_verse",
          }
        : liveState?.textContent
          ? {
              reference: liveState.title,
              text: liveState.textContent,
              kind: liveState.type as any,
            }
          : null);

  const mediaUrl = liveState?.mediaUrl || liveState?.imageDataUrl || null;
  const isBlack = Boolean(liveState?.blackScreen);

  return (
    <div className="flex h-screen w-screen flex-col bg-black text-white select-none overflow-hidden">
      {/* ── MINIMAL FLOATING STATUS BAR (NON-INTRUSIVE MIRROR HEADER) ────────── */}
      <header className="shrink-0 flex h-11 items-center justify-between border-b border-white/10 bg-black/80 px-3 sm:px-4 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-sky-400">
            <Radio className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider uppercase text-white/90">
              Vision Live
            </span>
            {connectionStatus === "connected" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            ) : connectionStatus === "disconnected" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-medium text-red-400">
                <WifiOff className="h-2.5 w-2.5" /> Reconnecting
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                <Loader2 className="h-2.5 w-2.5 animate-spin" /> Connecting
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle session code indicator */}
          <span className="hidden sm:inline-block text-[11px] text-white/40 font-mono">
            Token: {token || activeToken}
          </span>

          {/* Fullscreen toggle button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 hover:text-white transition cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </header>

      {/* ── LIVE PROJECTION MIRROR CANVAS (EDGE-TO-EDGE, ZERO CARDS) ───────── */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center">
        <ProjectionRenderer
          textOverlay={textOverlay}
          textStyle={liveState?.textStyle}
          groupedStyles={liveState?.groupedStyles}
          logo={liveState?.logo}
          mediaUrl={mediaUrl}
          mediaType={liveState?.mediaType}
          black={isBlack}
          scalingMode={liveState?.scalingMode ?? "auto"}
          idleMessage="Vision Projector"
          className="h-full w-full"
        />

        {/* Temporary Reconnect Banner (Floating Toast if connection drops) */}
        {connectionStatus === "disconnected" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border border-amber-500/40 bg-neutral-900/95 px-4 py-1.5 text-xs text-amber-300 shadow-2xl backdrop-blur-md pointer-events-none">
            <WifiOff className="h-3.5 w-3.5 shrink-0 animate-pulse text-amber-400" />
            <span>Connection interrupted. Reconnecting automatically...</span>
          </div>
        )}
      </main>
    </div>
  );
}
