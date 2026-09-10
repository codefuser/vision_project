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

  // Screen Wake Lock: Keep phone screen awake during live service
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        }
      } catch {
        // Ignore
      }
    };
    void requestWakeLock();
    return () => {
      wakeLock?.release?.().catch(() => {});
    };
  }, []);

  return (
    <div className="relative h-screen w-screen bg-black text-white select-none overflow-hidden flex items-center justify-center">
      {/* ── LIVE PROJECTION MIRROR CANVAS (EDGE-TO-EDGE, TRUE 1:1 PROJECTION MIRROR) ───────── */}
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

      {/* ── MINIMAL FLOATING FULLSCREEN TOGGLE (NON-INTRUSIVE, AUTO-BLENDING) ────────── */}
      <div className="absolute top-3 right-3 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/85 border border-white/15 text-white/50 hover:text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-40 hover:opacity-100 cursor-pointer shadow-xl active:scale-95"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
