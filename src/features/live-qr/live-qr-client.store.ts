/**
 * Client (Viewer Phone) Live Projection Store.
 * View-Only subscriber to the authoritative live projection stream.
 *
 * CANNOT CONTROL OR MUTATE PROJECTOR STATE.
 */
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import type { LiveProjectionPayload, LiveQrBroadcastMessage } from "./types";

const CHANNEL_PREFIX = "vp_live_";

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

  // Actions
  connect: (token: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

export const useViewerLiveQr = create<ViewerLiveQrState>((set, get) => ({
  token: null,
  connectionStatus: "idle",
  liveState: null,
  lastReceivedAt: null,
  errorMessage: null,
  channel: null,

  connect: async (rawToken: string) => {
    const token = rawToken.trim().toUpperCase();
    if (!token) {
      set({ connectionStatus: "invalid", errorMessage: "No token provided." });
      return;
    }

    // Clean up previous connection if any
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

    const channelName = `${CHANNEL_PREFIX}${token}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

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
              errorMessage: msg.reason || "This Live QR session has ended.",
            });
          }
          break;
        }
      }
    });

    channel.subscribe((status) => {
      logger.info(`Viewer Live QR channel [${channelName}] status: ${status}`);
      if (status === "SUBSCRIBED") {
        set({ connectionStatus: "connected" });
        // Immediately request current projection snapshot from host
        void channel.send({
          type: "broadcast",
          event: "msg",
          payload: {
            type: "REQUEST_CURRENT_STATE",
            clientId: `viewer_${Math.random().toString(36).slice(2, 8)}`,
          },
        });
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        set({
          connectionStatus: "disconnected",
          errorMessage: "Unable to connect to live projection server.",
        });
      }
    });

    set({ channel, token });
  },

  disconnect: async () => {
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
