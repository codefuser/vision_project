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
import { Tv } from "lucide-react";

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
  videoRef,
  onLoadedMetadata,
  onTimeUpdate,
  onDurationChange,
  idleMessage = "Vision Projector",
  className,
}: ProjectionRendererProps) {
  const hostRef = useRef<HTMLDivElement>(null);
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

  return (
    <div
      ref={hostRef}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-black select-none",
        className,
      )}
    >
      {/* 16:9 Proportional Fitted Stage */}
      <div
        className="relative shrink-0 overflow-hidden bg-black shadow-2xl"
        style={{
          width: size ? `${size.width}px` : "100%",
          height: size ? `${size.height}px` : "100%",
          aspectRatio: "16 / 9",
        }}
      >
        {/* Layer A: Media (Image / Video) */}
        {!black && hasMedia && mediaUrl && (
          <div className="absolute inset-0 h-full w-full overflow-hidden bg-black">
            {mediaType === "video" ? (
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
            ) : (
              <img
                src={mediaUrl}
                alt=""
                className="absolute inset-0 h-full w-full select-none"
                style={{ objectFit }}
                draggable={false}
              />
            )}
            {/* Logo overlay on top of media */}
            <LogoLayer logo={logo} />
          </div>
        )}

        {/* Layer B: Text Stage (1920x1080 scaled) */}
        {!black && !hasMedia && hasText && textOverlay && (
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
