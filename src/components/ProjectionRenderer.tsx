import { useEffect, useRef, useState, type RefObject } from "react";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { LogoLayer } from "@/components/LogoLayer";
import { TextOverlayRenderer } from "@/components/TextOverlayRenderer";
import {
  DEFAULT_GROUPED_STYLES,
  DEFAULT_TEXT_STYLE,
  type GroupedStyles,
  type LogoBroadcast,
  type TextOverlay,
  type TextStyle,
} from "@/lib/broadcast";
import type { ProjectionScaling } from "@/db/schema";
import { getObjectFit } from "@/lib/projection-scaling";
import { cn } from "@/lib/utils";
import { Tv, Play } from "lucide-react";

export const STAGE_ASPECT = 16 / 9;
export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

export interface ProjectionRendererProps {
  /** Text overlay payload (lyrics, scripture, announcement) */
  textOverlay?: TextOverlay | null;
  /** Legacy or base text style */
  textStyle?: TextStyle | null;
  /** Grouped styles for reference, tamil, english, background */
  groupedStyles?: GroupedStyles | null;
  /** Logo overlay configuration */
  logo?: LogoBroadcast | null;
  /** Media source URL (data URL or blob URL) */
  mediaUrl?: string | null;
  /** Type of projected media */
  mediaType?: "image" | "video" | null;
  /** Transport black screen mute */
  black?: boolean;
  /** Aspect ratio scaling mode for media */
  scalingMode?: ProjectionScaling;
  /** Output display aspect ratio (width / height, defaults to 16/9) */
  screenAspect?: number;
  /** Stage fitting mode: "stage" (16:9 mirror letterboxed) or "fill" (adaptive mobile full screen) */
  fitMode?: "stage" | "fill";
  /** Video element ref (e.g. for preview transport control) */
  videoRef?: RefObject<HTMLVideoElement | null>;
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onTimeUpdate?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onDurationChange?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  /** Idle placeholder label */
  idleMessage?: string;
  className?: string;
}

export function useFittedStage(ref: RefObject<HTMLDivElement | null>, aspect: number) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      let width = rect.width;
      let height = width / aspect;
      if (height > rect.height) {
        height = rect.height;
        width = height * aspect;
      }
      setSize((current) => {
        if (
          current &&
          Math.abs(current.width - width) < 0.5 &&
          Math.abs(current.height - height) < 0.5
        ) {
          return current;
        }
        return { width, height };
      });
    };

    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, [aspect, ref]);

  return size;
}

/**
 * Universal projection output renderer.
 * Renders an exact 16:9 stage mirror of what is shown on the church projector:
 *  - Proportional 16:9 letterboxed canvas (works seamlessly on mobile phones, tablets, laptops, TVs)
 *  - Rich background layers (gradients, colors, overlays)
 *  - Full typographic fidelity for Tamil & English scriptures and song lyrics
 *  - Aspect-fit media presentation without cards or borders
 *  - Logo overlays and instant blackout support
 */
export function ProjectionRenderer({
  textOverlay,
  textStyle,
  groupedStyles,
  logo,
  mediaUrl,
  mediaType,
  black = false,
  scalingMode = "auto",
  screenAspect,
  fitMode = "stage",
  videoRef,
  onLoadedMetadata,
  onTimeUpdate,
  onDurationChange,
  idleMessage = "VersoLyn",
  className,
}: ProjectionRendererProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const isFillMode = fitMode === "fill";
  const aspect = screenAspect ?? STAGE_ASPECT;
  const size = useFittedStage(hostRef, aspect);
  const effectiveGroups = groupedStyles ?? DEFAULT_GROUPED_STYLES;
  const scale = size ? size.width / STAGE_WIDTH : 1;
  const objectFit = getObjectFit(scalingMode);

  const hasMedia = Boolean(mediaUrl);
  const hasText = Boolean(
    textOverlay && (textOverlay.text || textOverlay.textTa || textOverlay.textEn || textOverlay.reference),
  );
  const isIdle = !black && !hasMedia && !hasText;

  // Render media safely (prevent video tag crash on base64 image data URLs)
  const renderMedia = () => {
    if (!mediaUrl) return null;
    const isVideoDataUrl = mediaType === "video" && mediaUrl.startsWith("data:");
    const isRealVideo = mediaType === "video" && !isVideoDataUrl;

    if (isRealVideo) {
      return (
        <video
          ref={videoRef}
          src={mediaUrl}
          className="absolute inset-0 h-full w-full"
          style={{ objectFit }}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onDurationChange={onDurationChange}
        />
      );
    }

    return (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        <img
          src={mediaUrl}
          alt=""
          className="absolute inset-0 h-full w-full select-none"
          style={{ objectFit }}
          draggable={false}
        />
        {mediaType === "video" && (
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-[11px] font-medium text-white/90 border border-white/15 backdrop-blur-md shadow-lg pointer-events-none">
            <Play className="h-3 w-3 text-red-500 fill-current animate-pulse" />
            <span>Playing on projector</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={hostRef}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-black select-none",
        className,
      )}
    >
      {/* Container: In fill mode it adapts to the entire mobile viewport; in stage mode it enforces 16:9 */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-black shadow-2xl",
          isFillMode ? "h-full w-full" : "",
        )}
        style={
          isFillMode
            ? { width: "100%", height: "100%" }
            : {
                width: size ? `${size.width}px` : "100%",
                height: size ? `${size.height}px` : "100%",
                aspectRatio: "16 / 9",
              }
        }
      >
        {/* Layer A: Media (Image / Video) */}
        {!black && hasMedia && mediaUrl && (
          <div className="absolute inset-0 h-full w-full overflow-hidden bg-black">
            {renderMedia()}
            <LogoLayer logo={logo} />
          </div>
        )}

        {/* Layer B: Text Stage */}
        {!black && !hasMedia && hasText && textOverlay && (
          isFillMode ? (
            /* Adaptive Mobile Full-Screen Layout (no letterbox black bars on phone) */
            <div className="absolute inset-0 flex flex-col overflow-hidden bg-black">
              <BackgroundLayer background={effectiveGroups.background} />
              <div className="relative flex flex-1 flex-col justify-center items-center px-6 py-8 z-10 select-none overflow-y-auto">
                {/* Reference Pill Header */}
                {effectiveGroups.reference.visible && textOverlay.reference && (
                  <div className="mb-4 text-center shrink-0">
                    <span
                      className="inline-block rounded-full bg-black/40 px-4 py-1 text-xs md:text-sm font-bold tracking-wider backdrop-blur-md border border-white/15 text-sky-400 shadow-md"
                      style={{
                        fontFamily: `"${effectiveGroups.reference.fontFamily || "system-ui"}", system-ui, sans-serif`,
                        color: effectiveGroups.reference.color || "#38bdf8",
                      }}
                    >
                      {textOverlay.reference}
                    </span>
                  </div>
                )}
                {/* Body Text */}
                <div className="flex-1 flex flex-col justify-center items-center w-full max-w-xl text-center my-auto">
                  <p
                    className="whitespace-pre-line text-xl sm:text-2xl font-bold leading-relaxed tracking-wide text-white drop-shadow-md"
                    style={{
                      fontFamily: `"${effectiveGroups.tamil.fontFamily || "system-ui"}", system-ui, sans-serif`,
                      color: effectiveGroups.tamil.color || "#ffffff",
                      textAlign: effectiveGroups.tamil.align || "center",
                    }}
                  >
                    {textOverlay.textTa || textOverlay.text}
                  </p>
                  {textOverlay.mode === "both" && textOverlay.textEn && textOverlay.textEn !== textOverlay.textTa && (
                    <p
                      className="mt-4 whitespace-pre-line text-sm sm:text-base font-medium leading-relaxed text-neutral-300 drop-shadow-md"
                      style={{
                        fontFamily: `"${effectiveGroups.english.fontFamily || "system-ui"}", system-ui, sans-serif`,
                        color: effectiveGroups.english.color || "#d4d4d8",
                        textAlign: effectiveGroups.english.align || "center",
                      }}
                    >
                      {textOverlay.textEn}
                    </p>
                  )}
                </div>
              </div>
              <LogoLayer logo={logo} />
            </div>
          ) : (
            /* Strict 16:9 Scaled Canvas (for Desktop Monitor Stage Mirror) */
            <div
              className="relative overflow-hidden bg-black"
              style={{
                width: `${STAGE_WIDTH}px`,
                height: `${STAGE_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <BackgroundLayer background={effectiveGroups.background} />
              <TextOverlayRenderer
                overlay={textOverlay}
                style={textStyle ?? DEFAULT_TEXT_STYLE}
                styles={effectiveGroups}
                withBackground={false}
              />
              <LogoLayer logo={logo} />
            </div>
          )
        )}

        {/* Layer C: Idle Standby */}
        {isIdle && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070b14] text-white/40">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 text-white/20 mb-3 shadow-inner">
              <Tv className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold tracking-wider text-white/60 uppercase">
              {idleMessage}
            </p>
            <p className="text-xs text-white/30 mt-1">Live Projection Standby</p>
          </div>
        )}

        {/* Layer D: Black Screen Override */}
        {black && (
          <div className="absolute inset-0 bg-black z-20 flex items-center justify-center pointer-events-none">
            {/* Pure black screen matching projector */}
          </div>
        )}
      </div>
    </div>
  );
}
