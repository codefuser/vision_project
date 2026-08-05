/**
 * Projection Scaling Utility
 *
 * Maps the user's chosen `ProjectionScaling` mode to the correct CSS
 * `object-fit` value for `<img>` and `<video>` elements.  Also provides
 * human-readable labels used by the UI.
 */
import type { CSSProperties } from "react";
import type { ProjectionScaling } from "@/db/schema";

/** Maps a ProjectionScaling mode → CSS object-fit value. */
export function getObjectFit(mode: ProjectionScaling): CSSProperties["objectFit"] {
  switch (mode) {
    case "fill":
      return "cover";     // crop to fill, no bars, no distortion
    case "stretch":
      return "fill";      // distort to fill exactly, no bars
    case "original":
      return "none";      // natural resolution, centred, may overflow
    case "fit":
    case "auto":
    default:
      return "contain";   // letterbox/pillarbox with black gutter — safe for any TV
  }
}

/**
 * Human-readable labels for each scaling mode.
 * Useful for UI buttons / badges.
 */
export const SCALING_LABELS: Record<ProjectionScaling, string> = {
  auto:     "Auto",
  fit:      "Fit",
  fill:     "Fill",
  stretch:  "Stretch",
  original: "Original",
};

/** One-line description shown in tooltips / preview badges. */
export const SCALING_DESCRIPTIONS: Record<ProjectionScaling, string> = {
  auto:     "Fit content with black bars (recommended for all TVs)",
  fit:      "Letterbox / pillarbox — content never cropped or distorted",
  fill:     "Crop to fill screen — edges may be cut off",
  stretch:  "Distort to fill — no bars, aspect ratio not preserved",
  original: "Display at native resolution — may overflow on small screens",
};
