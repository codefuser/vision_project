/**
 * Live Projection QR feature types and protocol definitions.
 * Provides view-only public streaming of the authoritative live projection.
 */
import type { ProjectionContentType } from "@/projection/content.types";
import type { GroupedStyles, LogoBroadcast, TextOverlay, TextStyle } from "@/lib/broadcast";
import type { ProjectionScaling } from "@/db/schema";

export interface LiveQrHostSession {
  token: string;
  createdAt: number;
  expiresAt: number;
  durationHours: number;
  customHost?: string;
  active: boolean;
}

export type LiveProjectionType = ProjectionContentType | "none";

export interface LiveProjectionPayload {
  isLive: boolean;
  title: string;
  type: LiveProjectionType;
  // Mirror projection rendering properties
  textOverlay?: TextOverlay | null;
  textStyle?: TextStyle | null;
  groupedStyles?: GroupedStyles | null;
  logo?: LogoBroadcast | null;
  scalingMode?: ProjectionScaling;
  mediaUrl?: string | null;
  mediaId?: string | null;
  // Bible verse specifics (backward-compat)
  reference?: string;
  verseText?: string;
  translation?: string;
  // Song slide specifics (backward-compat)
  songTitle?: string;
  slideIndex?: number;
  totalSlides?: number;
  lines?: string[];
  // Media specifics
  mediaType?: "image" | "video";
  imageDataUrl?: string; // High-efficiency preview data URL for images
  // Live text specifics
  textContent?: string;
  // Transport state
  blackScreen: boolean;
  updatedAt: number;
}

export type LiveQrBroadcastMessage =
  | {
      type: "LIVE_PROJECTION_UPDATE";
      token: string;
      payload: LiveProjectionPayload;
    }
  | {
      type: "REQUEST_CURRENT_STATE";
      clientId: string;
    }
  | {
      type: "SESSION_REVOKED";
      token: string;
      reason?: string;
    };

export const LIVE_QR_STORAGE_KEY = "vp_live_qr_host_session";

export interface DurationOption {
  label: string;
  hours: number;
}

export const PRESET_DURATIONS: DurationOption[] = [
  { label: "1 Hour", hours: 1 },
  { label: "3 Hours", hours: 3 },
  { label: "6 Hours", hours: 6 },
  { label: "12 Hours", hours: 12 },
  { label: "1 Day", hours: 24 },
  { label: "3 Days", hours: 72 },
  { label: "7 Days", hours: 168 },
];
