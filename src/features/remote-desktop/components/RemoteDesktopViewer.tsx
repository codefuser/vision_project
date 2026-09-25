/**
 * Remote Desktop Viewer Component
 * Clean, distraction-free, full-screen remote desktop controller.
 * Directly streams the Host laptop's display and passes mouse and keyboard inputs
 * straight through without clutter, bottom shortcut bars, or invasive HUD badges.
 */

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  MousePointer2,
  Power,
  RotateCcw,
  AlertTriangle,
  Monitor,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useControllerRemoteDesktop } from "../stores/rd-controller.store";

export const RemoteDesktopViewer = memo(function RemoteDesktopViewer() {
  const {
    remoteStream,
    hostScreenState,
    connectionState,
    inputEnabled,
    sendInput,
    retryConnection,
    requestScreenShare,
    disconnect,
  } = useControllerRemoteDesktop();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ u: number; v: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Local video element playback state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Bind remote stream to video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (remoteStream) {
      if (video.srcObject !== remoteStream) {
        video.srcObject = remoteStream;
      }
      video
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch((err) => {
          console.warn("Autoplay remote stream error:", err);
        });
    } else {
      video.srcObject = null;
      setIsVideoPlaying(false);
      setVideoDimensions({ width: 0, height: 0 });
    }
  }, [remoteStream]);

  // Video element events
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const w = videoRef.current.videoWidth || 1920;
      const h = videoRef.current.videoHeight || 1080;
      setVideoDimensions({ width: w, height: h });
      videoRef.current
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch((e) => console.warn("Play on metadata error", e));
    }
  };

  const handlePlaying = () => {
    setIsVideoPlaying(true);
    if (videoRef.current) {
      setVideoDimensions({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  };

  // Handle Fullscreen state change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen toggle error", e);
    }
  };

  // ── Normalized Coordinate Calculation ──────────────────────────────────────
  // Translates client pointer coordinates inside the letterboxed/scaled video
  // into exact relative coordinates u, v in [0, 1] for the host's monitor.
  const calculateNormalizedCoordinates = useCallback(
    (e: React.MouseEvent | MouseEvent): { u: number; v: number } | null => {
      const video = videoRef.current;
      if (!video) return null;

      const rect = video.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      const videoWidth = video.videoWidth || 1920;
      const videoHeight = video.videoHeight || 1080;
      const videoRatio = videoWidth / videoHeight;
      const containerRatio = rect.width / rect.height;

      let renderedW = rect.width;
      let renderedH = rect.height;
      let offsetLeft = 0;
      let offsetTop = 0;

      // Handle CSS object-contain letterboxing / pillarboxing
      if (containerRatio > videoRatio) {
        // Pillarboxing (black bars on left & right)
        renderedW = rect.height * videoRatio;
        offsetLeft = (rect.width - renderedW) / 2;
      } else {
        // Letterboxing (black bars on top & bottom)
        renderedH = rect.width / videoRatio;
        offsetTop = (rect.height - renderedH) / 2;
      }

      const clientX = e.clientX - rect.left - offsetLeft;
      const clientY = e.clientY - rect.top - offsetTop;

      if (clientX < 0 || clientX > renderedW || clientY < 0 || clientY > renderedH) {
        return null;
      }

      const u = Math.max(0, Math.min(1, clientX / renderedW));
      const v = Math.max(0, Math.min(1, clientY / renderedH));

      return { u, v };
    },
    [],
  );

  // ── Throttled Mouse Movement ──────────────────────────────────────────────
  const lastMoveSentRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!inputEnabled) return;
      const coords = calculateNormalizedCoordinates(e);
      if (!coords) return;

      setCursorPos(coords);

      const now = performance.now();
      // Throttle mouse moves to ~60fps (14ms)
      if (now - lastMoveSentRef.current > 14) {
        lastMoveSentRef.current = now;
        sendInput({
          type: "MOUSE_MOVE",
          u: coords.u,
          v: coords.v,
        });
      }
    },
    [inputEnabled, calculateNormalizedCoordinates, sendInput],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!inputEnabled) return;
      const coords = calculateNormalizedCoordinates(e);
      if (!coords) return;

      setIsDragging(true);

      const button = (e.button === 2 ? 2 : e.button === 1 ? 1 : 0) as 0 | 1 | 2;
      sendInput({
        type: "MOUSE_DOWN",
        button,
        u: coords.u,
        v: coords.v,
      });
    },
    [inputEnabled, calculateNormalizedCoordinates, sendInput],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!inputEnabled) return;
      setIsDragging(false);
      const coords = calculateNormalizedCoordinates(e);

      const button = (e.button === 2 ? 2 : e.button === 1 ? 1 : 0) as 0 | 1 | 2;
      sendInput({
        type: "MOUSE_UP",
        button,
        u: coords?.u,
        v: coords?.v,
      });
    },
    [inputEnabled, calculateNormalizedCoordinates, sendInput],
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!inputEnabled) return;
      const coords = calculateNormalizedCoordinates(e);
      if (!coords) return;

      sendInput({
        type: "DOUBLE_CLICK",
        button: 0,
        u: coords.u,
        v: coords.v,
      });
    },
    [inputEnabled, calculateNormalizedCoordinates, sendInput],
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Suppress browser context menu on controller so right click directly reaches the host laptop
    e.preventDefault();
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!inputEnabled) return;
      const coords = calculateNormalizedCoordinates(e);

      sendInput({
        type: "MOUSE_WHEEL",
        deltaX: Math.sign(e.deltaX) * Math.min(Math.abs(e.deltaX), 120),
        deltaY: Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120),
        u: coords?.u,
        v: coords?.v,
      });
    },
    [inputEnabled, calculateNormalizedCoordinates, sendInput],
  );

  // ── Keyboard Listener ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!inputEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (!containerRef.current?.matches(":hover")) {
        return;
      }

      // Intercept browser default shortcuts (Ctrl+S, Ctrl+P, F5) so they forward cleanly to the remote host
      if (
        (e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "f")) ||
        e.key === "F5"
      ) {
        e.preventDefault();
      }

      sendInput({
        type: "KEY_DOWN",
        key: e.key,
        code: e.code,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (!containerRef.current?.matches(":hover")) return;

      sendInput({
        type: "KEY_UP",
        key: e.key,
        code: e.code,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [inputEnabled, sendInput]);

  // Determine stream readiness
  const hasLiveVideoTrack = Boolean(
    remoteStream &&
      remoteStream.getVideoTracks().some((t) => t.readyState === "live"),
  );
  const isStreamReady = isVideoPlaying && videoDimensions.width > 0 && hasLiveVideoTrack;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-black select-none overflow-hidden outline-none font-sans"
      tabIndex={0}
    >
      {/* ── Minimalist Floating Header (Top Right) ─────────────────────────── */}
      <header className="absolute top-3 right-4 z-40 flex items-center gap-2 pointer-events-auto opacity-75 hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center gap-2 bg-zinc-950/85 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 shadow-2xl">
          {/* Live Indicator */}
          {isStreamReady && (
            <div className="flex items-center gap-1.5 pr-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-300">Live</span>
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <div className="h-3 w-px bg-white/20" />

          {/* Disconnect Button */}
          <button
            onClick={disconnect}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 hover:bg-red-500/35 text-red-200 border border-red-500/30 transition cursor-pointer"
            title="Disconnect Remote Session"
          >
            <Power className="h-3.5 w-3.5" />
            <span>Disconnect</span>
          </button>
        </div>
      </header>

      {/* ── Interactive Screen Viewport ─────────────────────────────────────── */}
      <main
        className="flex-1 flex items-center justify-center relative overflow-hidden bg-black cursor-crosshair h-full w-full"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Video Stream Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={handleLoadedMetadata}
            onPlaying={handlePlaying}
            className={cn(
              "h-full w-full object-contain pointer-events-none transition-opacity duration-300",
              isStreamReady ? "opacity-100" : "opacity-0",
            )}
          />

          {/* ── Clean State Overlays (When Video Not Live) ───────────────────── */}
          {!isStreamReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-zinc-950/95 backdrop-blur-md">
              <div className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl">
                {connectionState === "failed" ? (
                  <>
                    <div className="mx-auto h-12 w-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-red-200">Remote Video Connection Failed</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Could not connect to the Host video stream. Please ensure the Host laptop has approved the connection and selected &quot;Entire Screen&quot;.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      <button
                        onClick={() => retryConnection()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow transition cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Retry Connection</span>
                      </button>
                      <button
                        onClick={() => disconnect()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border shadow transition cursor-pointer"
                      >
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </>
                ) : hostScreenState?.active === false ? (
                  <>
                    <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <Monitor className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-amber-200">
                        {hostScreenState.reason || "Host Stopped Screen Sharing"}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The Host laptop paused screen sharing. Click below to request screen sharing.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      <button
                        onClick={() => requestScreenShare()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 shadow transition cursor-pointer"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                        <span>Request Screen Share</span>
                      </button>
                      <button
                        onClick={() => disconnect()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border shadow transition cursor-pointer"
                      >
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-foreground">Connecting to Host Screen...</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Negotiating direct video stream with Host laptop. Please ensure the Host operator has approved the prompt and selected &quot;Entire Screen&quot;.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      <button
                        onClick={() => disconnect()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border shadow transition cursor-pointer"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Local Virtual Cursor Overlay */}
          {cursorPos && inputEnabled && isStreamReady && (
            <div
              className="absolute pointer-events-none z-20 transition-[transform] duration-75 ease-out"
              style={{
                left: `${cursorPos.u * 100}%`,
                top: `${cursorPos.v * 100}%`,
                transform: "translate(-2px, -2px)",
              }}
            >
              <div className="relative">
                <MousePointer2 className="h-4 w-4 fill-white text-zinc-950 drop-shadow-md" />
                {isDragging && (
                  <span className="absolute left-3 top-2 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
});
