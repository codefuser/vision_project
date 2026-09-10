/**
 * Client (Viewer Phone) Live Projection Store.
 * View-Only subscriber to the authoritative live projection stream.
 *
 * Uses DUAL-CHANNEL sync:
 * 1. Supabase Realtime Presence (instant state on channel join from Supabase cluster)
 * 2. Supabase Realtime Broadcast (sub-50ms live updates as slides/verses change)
 * 3. Fallback request-response on connect / reconnect
 *
 * CANNOT CONTROL OR MUTATE PROJECTOR STATE.
 */
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import type { LiveProjectionPayload, LiveQrBroadcastMessage } from "./types";

const CHANNEL_PREFIX = "vp_live_";
const CLIENT_ID_KEY = "vp_live_viewer_client_id";

function getOrCreateViewerId(): string {
  if (typeof window === "undefined") return "v_ssr";
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = "v_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

export type ViewerConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "expired"
  | "invalid";

interface ViewerLiveQrState {
  token: string | null;
  connectionStatus: ViewerConnectionStatus;
  liveState: LiveProjectionPayload | null;
  lastReceivedAt: number | null;
  errorMessage: string | null;
  channel: RealtimeChannel | null;
  clientId: string;

  // Actions
  connect: (token: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

export const useViewerLiveQr = create<ViewerLiveQrState>((set, get) => ({
  token: null,
  connectionStatus: "idle",
  liveState: null,
  lastReceivedAt: null,
  errorMessage: null,
  channel: null,
  clientId: getOrCreateViewerId(),

  connect: async (rawToken: string) => {
    const token = rawToken.trim().toUpperCase();
    if (!token) {
      set({ connectionStatus: "invalid", errorMessage: "Invalid or missing token in URL." });
      return;
    }

    // If already connected or connecting to this exact token, do not rebuild channel
    const currentToken = get().token;
    const currentStatus = get().connectionStatus;
    const currentChannel = get().channel;
    if (
      currentToken === token &&
      currentChannel &&
      (currentStatus === "connected" || currentStatus === "connecting")
    ) {
      return;
    }

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    // Clean up previous channel if any
    const prevCh = get().channel;
    if (prevCh) {
      try {
        await supabase.removeChannel(prevCh);
      } catch (err) {
        logger.warn("Error cleaning up previous viewer channel", err);
      }
    }

    set({
      token,
      connectionStatus: "connecting",
      errorMessage: null,
    });

    const clientId = get().clientId;
    const channelName = `${CHANNEL_PREFIX}${token}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: clientId },
      },
    });

    // ── 1. Presence Sync: Instant projection state upon channel join ──
    channel.on("presence", { event: "sync" }, () => {
      try {
        const presenceMap = channel.presenceState();
        const hostPresence = presenceMap["host"];
        if (hostPresence && hostPresence.length > 0) {
          const hostData = hostPresence[0] as any;
          if (hostData?.liveState) {
            set({
              liveState: hostData.liveState,
              connectionStatus: "connected",
              lastReceivedAt: Date.now(),
              errorMessage: null,
            });
          }
        }
      } catch (e) {
        logger.warn("Error processing presence sync in viewer", e);
      }
    });

    // ── 2. Realtime Broadcast: Sub-50ms slide and verse projection updates ──
    channel.on("broadcast", { event: "msg" }, (payload) => {
      const msg = payload.payload as LiveQrBroadcastMessage;
      if (!msg) return;

      switch (msg.type) {
        case "LIVE_PROJECTION_UPDATE": {
          if (msg.token === token) {
            set({
              liveState: msg.payload,
              connectionStatus: "connected",
              lastReceivedAt: Date.now(),
              errorMessage: null,
            });
          }
          break;
        }

        case "SESSION_REVOKED": {
          if (msg.token === token) {
            set({
              connectionStatus: "expired",
              errorMessage: msg.reason || "This Live QR code is no longer active.",
            });
          }
          break;
        }
      }
    });

    // ── 3. Subscribe to channel ──
    channel.subscribe(async (status) => {
      logger.info(`Viewer Live QR channel [${channelName}] status: ${status}`);

      if (status === "SUBSCRIBED") {
        set({ connectionStatus: "connected", errorMessage: null });

        // Immediately request current projection state from host
        try {
          await channel.send({
            type: "broadcast",
            event: "msg",
            payload: {
              type: "REQUEST_CURRENT_STATE",
              clientId,
            },
          });
        } catch (e) {
          logger.warn("Viewer failed to send REQUEST_CURRENT_STATE", e);
        }
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        set({
          connectionStatus: "disconnected",
          errorMessage: "Connection lost. Reconnecting to live projection...",
        });

        // Auto-reconnect after 1.2 seconds
        if (!reconnectTimeout) {
          reconnectTimeout = setTimeout(() => {
            reconnectTimeout = null;
            if (get().token === token && get().connectionStatus === "disconnected") {
              void get().connect(token);
            }
          }, 1200);
        }
      }
    });

    set({ channel, token });
  },

  disconnect: async () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    const ch = get().channel;
    if (ch) {
      try {
        await supabase.removeChannel(ch);
      } catch (err) {
        logger.warn("Error disconnecting viewer channel", err);
      }
    }
    set({
      token: null,
      channel: null,
      connectionStatus: "idle",
      liveState: null,
      lastReceivedAt: null,
      errorMessage: null,
    });
  },
}));
