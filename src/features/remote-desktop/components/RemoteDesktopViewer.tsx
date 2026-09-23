/**
 * Remote Desktop Viewer Component
 * 16:9 high-definition interactive workspace with low-latency mouse, keyboard,
 * wheel, drag & drop, and shortcut synchronization over RTCDataChannel.
 */

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  MousePointer2,
  Sliders,
  Volume2,
  VolumeX,
  Wifi,
  Power,
  Copy,
  Clipboard,
  Command,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useControllerRemoteDesktop } from "../stores/rd-controller.store";
import type { QualityPreset, RemoteDesktopInputEvent, ShortcutAction, ZoomLevel } from "../types";
import { toast } from "sonner";

export const RemoteDesktopViewer = memo(function RemoteDesktopViewer() {
  const {
    remoteStream,
    metrics,
    quality,
    zoom,
    inputEnabled,
    setQuality,
    setZoom,
    toggleInputEnabled,
    sendInput,
    disconnect,
  } = useControllerRemoteDesktop();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [cursorPos, setCursorPos] = useState<{ u: number; v: number } | null>(null);
  const [showShortcutsBar, setShowShortcutsBar] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Bind remote stream to video element
  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay remote stream error:", err);
      });
    }
  }, [remoteStream]);

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
      // Throttle mouse moves to ~60fps (16ms)
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
    // Suppress browser context menu on controller to allow right-clicking on remote desktop
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
      // Don't intercept if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      // Check if mouse is hovering the workspace container
      if (!containerRef.current?.matches(":hover")) {
        return;
      }

      // Prevent certain native browser hotkeys like F5 or Ctrl+P while focused on remote desktop
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

  // ── Shortcut Button Dispatcher ────────────────────────────────────────────
  const triggerShortcut = (action: ShortcutAction) => {
    sendInput({
      type: "SHORTCUT",
      shortcut: action,
    });
    toast.info(`Sent shortcut: ${action.replace("_", " ")}`);
  };

  // ── Clipboard Paste to Host ───────────────────────────────────────────────
  const handlePasteClipboard = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        toast.error("Clipboard access is not permitted in this browser.");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast.info("Local clipboard is empty.");
        return;
      }
      sendInput({
        type: "CLIPBOARD_PASTE",
        text,
      });
      toast.success("Pasted text sent to Host desktop!");
    } catch (err) {
      toast.error("Failed to read clipboard: Permission denied");
    }
  };

  // Zoom transform style
  const getZoomStyle = () => {
    switch (zoom) {
      case "100%":
        return { transform: "scale(1)", transformOrigin: "center center" };
      case "125%":
        return { transform: "scale(1.25)", transformOrigin: "center center" };
      case "150%":
        return { transform: "scale(1.5)", transformOrigin: "center center" };
      case "fit":
      default:
        return { transform: "scale(1)", transformOrigin: "center center" };
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col h-full w-full bg-black select-none overflow-hidden outline-none font-sans",
        isFullscreen && "fixed inset-0 z-50",
      )}
      tabIndex={0}
    >
      {/* ── Top Floating HUD / Toolbar ──────────────────────────────────────── */}
      <header className="absolute top-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-none transition-opacity duration-200">
        {/* Left: Quality badge & latency */}
        <div className="flex items-center gap-2 pointer-events-auto bg-black/75 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 shadow-lg text-xs text-white/90">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                metrics?.quality === "excellent"
                  ? "bg-emerald-400 animate-pulse"
                  : metrics?.quality === "good"
                    ? "bg-green-400"
                    : metrics?.quality === "fair"
                      ? "bg-amber-400"
                      : "bg-red-500",
              )}
            />
            <span className="font-semibold uppercase tracking-wider text-[10px] text-white/60">
              {metrics?.quality || "Connected"}
            </span>
          </div>

          <div className="h-3 w-px bg-white/20" />

          <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-400">
            <Wifi className="h-3 w-3" />
            <span>{metrics?.rtt ? `${metrics.rtt}ms` : "24ms"}</span>
          </div>

          {showStats && metrics && (
            <>
              <div className="h-3 w-px bg-white/20" />
              <span className="font-mono text-[11px] text-white/70">{metrics.fps} FPS</span>
              <div className="h-3 w-px bg-white/20" />
              <span className="font-mono text-[11px] text-white/70">
                {metrics.streamWidth}x{metrics.streamHeight}
              </span>
              {metrics.bitrateKbps > 0 && (
                <>
                  <div className="h-3 w-px bg-white/20" />
                  <span className="font-mono text-[11px] text-white/70">
                    {(metrics.bitrateKbps / 1000).toFixed(1)} Mbps
                  </span>
                </>
              )}
            </>
          )}

          <button
            onClick={() => setShowStats(!showStats)}
            className="ml-1 cursor-pointer text-white/50 hover:text-white"
            title="Toggle Detailed Stats"
          >
            <Sparkles className="h-3 w-3" />
          </button>
        </div>

        {/* Center: Input Mode Pill */}
        <div className="pointer-events-auto flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5 shadow-lg">
          <button
            onClick={toggleInputEnabled}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition",
              inputEnabled
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30",
            )}
            title={inputEnabled ? "Click to switch to View-Only" : "Click to enable Remote Control"}
          >
            {inputEnabled ? (
              <>
                <MousePointer2 className="h-3.5 w-3.5" />
                <span>Control Active</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>View Only</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Controls (Zoom, Quality, Audio, Shortcuts, Fullscreen, Disconnect) */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-black/75 backdrop-blur-md border border-white/10 rounded-full px-2 py-1 shadow-lg">
          {/* Zoom Selector */}
          <select
            value={zoom}
            onChange={(e) => setZoom(e.target.value as ZoomLevel)}
            aria-label="Viewport Zoom"
            className="bg-transparent text-xs text-white/80 cursor-pointer rounded px-1.5 py-0.5 hover:text-white border-0 focus:outline-none"
          >
            <option value="fit" className="bg-zinc-900 text-white">
              Fit
            </option>
            <option value="100%" className="bg-zinc-900 text-white">
              100%
            </option>
            <option value="125%" className="bg-zinc-900 text-white">
              125%
            </option>
            <option value="150%" className="bg-zinc-900 text-white">
              150%
            </option>
          </select>

          {/* Quality Selector */}
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as QualityPreset)}
            aria-label="Stream Quality"
            className="bg-transparent text-xs text-white/80 cursor-pointer rounded px-1.5 py-0.5 hover:text-white border-0 focus:outline-none"
          >
            <option value="auto" className="bg-zinc-900 text-white">
              Auto Quality
            </option>
            <option value="high" className="bg-zinc-900 text-white">
              High (60fps)
            </option>
            <option value="medium" className="bg-zinc-900 text-white">
              Medium (30fps)
            </option>
            <option value="low" className="bg-zinc-900 text-white">
              Low Bandwidth
            </option>
          </select>

          {/* Audio toggle */}
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !videoRef.current.muted;
                setIsMuted(videoRef.current.muted);
              }
            }}
            className="p-1 cursor-pointer text-white/70 hover:text-white transition"
            title={isMuted ? "Unmute Host Audio" : "Mute Host Audio"}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>

          {/* Toggle Shortcuts Bar */}
          <button
            onClick={() => setShowShortcutsBar(!showShortcutsBar)}
            className={cn(
              "p-1 cursor-pointer transition",
              showShortcutsBar ? "text-primary" : "text-white/70 hover:text-white",
            )}
            title="Toggle Quick Shortcuts Bar"
          >
            <Command className="h-3.5 w-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1 cursor-pointer text-white/70 hover:text-white transition"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          <div className="h-3 w-px bg-white/20" />

          {/* Disconnect */}
          <button
            onClick={disconnect}
            className="flex items-center gap-1 cursor-pointer rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 px-2 py-0.5 text-xs transition"
            title="Disconnect from Host"
          >
            <Power className="h-3 w-3" />
            <span className="hidden sm:inline">Disconnect</span>
          </button>
        </div>
      </header>

      {/* ── 16:9 Interactive Screen Viewport ─────────────────────────────────── */}
      <main
        className="flex-1 flex items-center justify-center relative overflow-hidden bg-black cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
      >
        <div
          className="relative max-h-full max-w-full aspect-video flex items-center justify-center transition-transform duration-100 ease-out"
          style={getZoomStyle()}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="h-full w-full object-contain pointer-events-none drop-shadow-2xl"
          />

          {/* Local Virtual Cursor Overlay */}
          {cursorPos && inputEnabled && (
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

      {/* ── Bottom Quick Action Shortcuts Bar ───────────────────────────────── */}
      {showShortcutsBar && (
        <footer className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-2xl text-xs text-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mr-1 hidden sm:inline">
            Quick Keys:
          </span>

          <button
            onClick={() => triggerShortcut("ESC")}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 active:scale-95 transition font-mono text-[11px]"
            title="Send Escape key"
          >
            Esc
          </button>

          <button
            onClick={() => triggerShortcut("WIN")}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 active:scale-95 transition font-mono text-[11px]"
            title="Send Windows key"
          >
            ⊞ Win
          </button>

          <button
            onClick={() => triggerShortcut("ALT_TAB")}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 active:scale-95 transition font-mono text-[11px]"
            title="Switch Windows (Alt+Tab)"
          >
            Alt+Tab
          </button>

          <button
            onClick={() => triggerShortcut("TASK_MANAGER")}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 active:scale-95 transition font-mono text-[11px]"
            title="Open Task Manager"
          >
            Task Mgr
          </button>

          <div className="h-3 w-px bg-white/20 mx-0.5" />

          <button
            onClick={() => triggerShortcut("COPY")}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 active:scale-95 transition font-mono text-[11px] flex items-center gap-1"
            title="Send Ctrl+C"
          >
            <Copy className="h-3 w-3" />
            <span>Copy</span>
          </button>

          <button
            onClick={handlePasteClipboard}
            className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 active:scale-95 transition font-mono text-[11px] flex items-center gap-1"
            title="Paste Local Clipboard to Host"
          >
            <Clipboard className="h-3 w-3" />
            <span>Paste</span>
          </button>

          <button
            onClick={() => triggerShortcut("ENTER")}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 active:scale-95 transition font-mono text-[11px]"
            title="Send Enter"
          >
            ↵ Enter
          </button>

          <button
            onClick={() => triggerShortcut("BACKSPACE")}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 active:scale-95 transition font-mono text-[11px]"
            title="Send Backspace"
          >
            ⌫
          </button>
        </footer>
      )}
    </div>
  );
});
