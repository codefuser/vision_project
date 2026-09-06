/**
 * Host (Laptop Operator) Live Projection QR Store.
 * Manages fixed public token lifecycle, duration/expiration, Supabase Realtime channel,
 * and authoritative live projection broadcasts.
 *
 * COMPLETELY DECOUPLED FROM REMOTE CONTROL.
 */
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { db } from "@/db/schema";
import { projectionEngine } from "@/projection/engine";
import { useProjection } from "@/stores/projection.store";
import type {
  LiveQrHostSession,
  LiveProjectionPayload,
  LiveQrBroadcastMessage,
} from "./types";
import { LIVE_QR_STORAGE_KEY } from "./types";

const CHANNEL_PREFIX = "vp_live_";

// Thumbnail / preview cache
const liveThumbCache = new Map<string, string>();

async function getMediaDataUrl(blobId?: string | null): Promise<string | undefined> {
  if (!blobId) return undefined;
  if (liveThumbCache.has(blobId)) return liveThumbCache.get(blobId);

  try {
    const rec = await db().blobs.get(blobId);
    if (!rec?.blob) return undefined;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Cache if reasonable size
        if (result && result.length < 200000) {
          liveThumbCache.set(blobId, result);
        }
        resolve(result);
      };
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(rec.blob);
    });
  } catch (err) {
    logger.warn("Failed to load image blob for Live QR preview", err);
    return undefined;
  }
}

function generateLiveToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function formatRemainingTime(expiresAt: number): string {
  const diffMs = expiresAt - Date.now();
  if (diffMs <= 0) return "Expired";

  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${mins}m`;
  }
  if (hours > 0) {
    return `${hours}h ${mins}m ${secs}s`;
  }
  return `${mins}m ${secs}s`;
}

interface HostLiveQrState {
  session: LiveQrHostSession | null;
  isDialogOpen: boolean;
  channel: RealtimeChannel | null;
  isExpired: boolean;
  remainingTime: string;

  // Actions
  setDialogOpen: (open: boolean) => void;
  generateSession: (durationHours: number, customHost?: string) => Promise<LiveQrHostSession>;
  revokeSession: () => Promise<void>;
  broadcastCurrentLive: () => Promise<void>;
  updateCountdown: () => void;
}

function loadSavedSession(): LiveQrHostSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LIVE_QR_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LiveQrHostSession;
    if (parsed && parsed.token && parsed.expiresAt) {
      if (parsed.expiresAt > Date.now() && parsed.active) {
        return parsed;
      }
    }
  } catch (e) {
    logger.warn("Failed to load saved live QR session", e);
  }
  return null;
}

export const useHostLiveQr = create<HostLiveQrState>((set, get) => ({
  session: loadSavedSession(),
  isDialogOpen: false,
  channel: null,
  isExpired: false,
  remainingTime: "",

  setDialogOpen: (open) => {
    set({ isDialogOpen: open });
    if (open) {
      get().updateCountdown();
    }
  },

  updateCountdown: () => {
    const s = get().session;
    if (!s) {
      set({ remainingTime: "", isExpired: false });
      return;
    }
    const expired = Date.now() >= s.expiresAt;
    set({
      isExpired: expired,
      remainingTime: formatRemainingTime(s.expiresAt),
    });
  },

  generateSession: async (durationHours: number, customHost?: string) => {
    const prevChannel = get().channel;
    if (prevChannel) {
      try {
        await supabase.removeChannel(prevChannel);
      } catch (err) {
        logger.warn("Error removing previous live QR channel", err);
      }
    }

    const token = generateLiveToken();
    const createdAt = Date.now();
    const expiresAt = createdAt + durationHours * 3600 * 1000;

    const newSession: LiveQrHostSession = {
      token,
      createdAt,
      expiresAt,
      durationHours,
      customHost: customHost?.trim() || undefined,
      active: true,
    };

    localStorage.setItem(LIVE_QR_STORAGE_KEY, JSON.stringify(newSession));

    // Setup Supabase Realtime channel for this public token
    const channelName = `${CHANNEL_PREFIX}${token}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    // Listen for new viewer join requests to instantly send current state
    channel.on("broadcast", { event: "msg" }, async (payload) => {
      const msg = payload.payload as LiveQrBroadcastMessage;
      if (!msg) return;

      if (msg.type === "REQUEST_CURRENT_STATE") {
        // Send immediate live projection state snapshot
        await get().broadcastCurrentLive();
      }
    });

    channel.subscribe((status) => {
      logger.info(`Live QR Host Channel [${channelName}] status: ${status}`);
      if (status === "SUBSCRIBED") {
        void get().broadcastCurrentLive();
      }
    });

    set({
      session: newSession,
      channel,
      isExpired: false,
      remainingTime: formatRemainingTime(expiresAt),
    });

    toast.success("Live Projection QR generated successfully!");
    return newSession;
  },

  revokeSession: async () => {
    const s = get().session;
    const ch = get().channel;

    if (ch && s) {
      try {
        await ch.send({
          type: "broadcast",
          event: "msg",
          payload: {
            type: "SESSION_REVOKED",
            token: s.token,
            reason: "Session revoked by projection operator.",
          },
        });
        await supabase.removeChannel(ch);
      } catch (err) {
        logger.warn("Error revoking Live QR channel", err);
      }
    }

    localStorage.removeItem(LIVE_QR_STORAGE_KEY);
    set({
      session: null,
      channel: null,
      isExpired: true,
      remainingTime: "",
    });

    toast.info("Live Projection QR revoked.");
  },

  broadcastCurrentLive: async () => {
    const { session, channel } = get();
    if (!session || !session.active || Date.now() >= session.expiresAt) {
      return;
    }
    if (!channel) return;

    try {
      const cur = projectionEngine.getCurrent();
      const projState = useProjection.getState().state;
      const blackScreen = Boolean(projState?.black);

      let payload: LiveProjectionPayload;

      if (!cur) {
        payload = {
          isLive: false,
          title: "No Active Projection",
          type: "none",
          blackScreen,
          updatedAt: Date.now(),
        };
      } else {
        const basePayload: Partial<LiveProjectionPayload> = {
          isLive: true,
          title: cur.title || "Live Presentation",
          type: cur.type,
          blackScreen,
          updatedAt: Date.now(),
        };

        switch (cur.type) {
          case "bible_verse": {
            const body = cur.body as any;
            payload = {
              ...basePayload,
              isLive: true,
              title: cur.title,
              type: "bible_verse",
              reference: body?.reference || cur.title,
              verseText: body?.text || "",
              translation: body?.translation || "Bible",
              blackScreen,
              updatedAt: Date.now(),
            };
            break;
          }

          case "song_slide": {
            const body = cur.body as any;
            payload = {
              ...basePayload,
              isLive: true,
              title: cur.title,
              type: "song_slide",
              songTitle: cur.title,
              slideIndex: typeof body?.slideIndex === "number" ? body.slideIndex + 1 : undefined,
              lines: Array.isArray(body?.lines) ? body.lines : [],
              blackScreen,
              updatedAt: Date.now(),
            };
            break;
          }

          case "image": {
            const body = cur.body as any;
            let imageDataUrl: string | undefined;

            // Try to find thumbnail first for high-speed delivery
            if (body?.mediaId) {
              const mediaItem = await db().media.get(body.mediaId);
              if (mediaItem?.thumbBlobId) {
                imageDataUrl = await getMediaDataUrl(mediaItem.thumbBlobId);
              }
            }
            if (!imageDataUrl && body?.blobId) {
              imageDataUrl = await getMediaDataUrl(body.blobId);
            }

            payload = {
              ...basePayload,
              isLive: true,
              title: cur.title || "Image Projection",
              type: "image",
              mediaType: "image",
              imageDataUrl,
              blackScreen,
              updatedAt: Date.now(),
            };
            break;
          }

          case "video": {
            const body = cur.body as any;
            let posterDataUrl: string | undefined;

            if (body?.mediaId) {
              const mediaItem = await db().media.get(body.mediaId);
              if (mediaItem?.thumbBlobId) {
                posterDataUrl = await getMediaDataUrl(mediaItem.thumbBlobId);
              }
            }

            payload = {
              ...basePayload,
              isLive: true,
              title: cur.title || "Video Projection",
              type: "video",
              mediaType: "video",
              imageDataUrl: posterDataUrl,
              blackScreen,
              updatedAt: Date.now(),
            };
            break;
          }

          case "live_text":
          case "announcement":
          case "sermon_point": {
            const body = cur.body as any;
            payload = {
              ...basePayload,
              isLive: true,
              title: cur.title,
              type: cur.type,
              textContent: body?.text || body?.heading || cur.title,
              blackScreen,
              updatedAt: Date.now(),
            };
            break;
          }

          default: {
            payload = {
              ...basePayload,
              isLive: true,
              title: cur.title,
              type: cur.type,
              blackScreen,
              updatedAt: Date.now(),
            };
            break;
          }
        }
      }

      await channel.send({
        type: "broadcast",
        event: "msg",
        payload: {
          type: "LIVE_PROJECTION_UPDATE",
          token: session.token,
          payload,
        },
      });
    } catch (err) {
      logger.warn("Failed to broadcast live projection to viewers", err);
    }
  },
}));

// ── Background Auto-Resume & Realtime Projection Listener ─────────────────────

if (typeof window !== "undefined") {
  // 1. Resume saved session if still valid
  const saved = loadSavedSession();
  if (saved && saved.active && saved.expiresAt > Date.now()) {
    const channelName = `${CHANNEL_PREFIX}${saved.token}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    channel.on("broadcast", { event: "msg" }, async (payload) => {
      const msg = payload.payload as LiveQrBroadcastMessage;
      if (!msg) return;

      if (msg.type === "REQUEST_CURRENT_STATE") {
        void useHostLiveQr.getState().broadcastCurrentLive();
      }
    });

    channel.subscribe((status) => {
      logger.info(`Live QR Host Channel auto-resumed [${channelName}]: ${status}`);
      if (status === "SUBSCRIBED") {
        void useHostLiveQr.getState().broadcastCurrentLive();
      }
    });

    useHostLiveQr.setState({
      session: saved,
      channel,
      isExpired: false,
      remainingTime: formatRemainingTime(saved.expiresAt),
    });
  }

  // 2. Countdown timer interval (updates every second when session exists)
  setInterval(() => {
    const { session, updateCountdown, isExpired } = useHostLiveQr.getState();
    if (session) {
      updateCountdown();
      if (!isExpired && Date.now() >= session.expiresAt) {
        useHostLiveQr.setState({ isExpired: true });
      }
    }
  }, 1000);

  // 3. Projection Engine listener: whenever anything is projected, broadcast automatically
  projectionEngine.onAny(() => {
    const { session } = useHostLiveQr.getState();
    if (session && session.active && Date.now() < session.expiresAt) {
      void useHostLiveQr.getState().broadcastCurrentLive();
    }
  });

  // 4. Projection Store subscriber: when black screen or clear changes, broadcast automatically
  useProjection.subscribe(() => {
    const { session } = useHostLiveQr.getState();
    if (session && session.active && Date.now() < session.expiresAt) {
      void useHostLiveQr.getState().broadcastCurrentLive();
    }
  });
}
