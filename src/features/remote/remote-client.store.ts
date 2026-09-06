/**
 * Mobile Remote Client Store.
 * Connects to the host laptop's Supabase Realtime channel,
 * handles cryptographic authentication challenge-response,
 * dispatches touch commands, and syncs live projector state.
 */
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import type {
  RemoteAuthResponsePayload,
  RemoteBroadcastMessage,
  RemoteCommandAction,
  RemoteHostSyncState,
} from "./types";
import { computeAuthProof, generateRandomId } from "./remote-crypto";

const CHANNEL_PREFIX = "vp_remote_";
const CLIENT_ID_KEY = "vp_remote_client_id";
const SAVED_SESSION_KEY = "vp_remote_saved_session";

function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "mobile-unknown";
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = generateRandomId("dev", 8);
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

function detectDeviceName(): string {
  if (typeof window === "undefined") return "Mobile Device";
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android Phone";
  return "Mobile Browser";
}

export type ClientConnectionStatus =
  | "idle"
  | "connecting"
  | "authenticating"
  | "connected"
  | "error";

interface RemoteClientState {
  status: ClientConnectionStatus;
  sessionId: string;
  salt: string;
  sessionToken: string | null;
  errorMessage: string | null;
  channel: RealtimeChannel | null;
  clientId: string;

  // Synced from host
  currentLive: RemoteHostSyncState["currentLive"];
  blackScreen: boolean;
  mediaList: RemoteHostSyncState["mediaList"];
  textList: RemoteHostSyncState["textList"];

  // Actions
  setSessionCredentials: (sessionId: string, salt: string) => void;
  authenticate: (password: string) => Promise<boolean>;
  sendCommand: (action: RemoteCommandAction) => Promise<void>;
  disconnect: () => void;
  restoreSavedSession: () => void;
}

export const useRemoteClient = create<RemoteClientState>((set, get) => ({
  status: "idle",
  sessionId: "",
  salt: "",
  sessionToken: null,
  errorMessage: null,
  channel: null,
  clientId: getOrCreateClientId(),

  currentLive: null,
  blackScreen: false,
  mediaList: [],
  textList: [],

  setSessionCredentials: (sessionId, salt) => {
    set({ sessionId: sessionId.trim(), salt: salt.trim(), errorMessage: null });
  },

  authenticate: async (password: string): Promise<boolean> => {
    const { sessionId, salt, clientId } = get();
    if (!sessionId || !salt) {
      set({ status: "error", errorMessage: "Missing session ID or salt. Please re-scan QR." });
      return false;
    }

    set({ status: "authenticating", errorMessage: null });

    // Clean up any existing channel
    const prevChannel = get().channel;
    if (prevChannel) {
      await supabase.removeChannel(prevChannel);
    }

    const channelName = `${CHANNEL_PREFIX}${sessionId}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    const clientNonce = generateRandomId("nonce", 12);
    const authProof = await computeAuthProof(password, salt, sessionId, clientNonce);
    const deviceName = detectDeviceName();

    return new Promise<boolean>((resolve) => {
      let resolved = false;

      // Timeout handler: 10s
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          set({
            status: "error",
            errorMessage: "Connection timed out. Ensure laptop has started the session.",
          });
          resolve(false);
        }
      }, 10000);

      // Listen for host responses
      channel.on("broadcast", { event: "msg" }, (payload) => {
        const msg = payload.payload as RemoteBroadcastMessage;
        if (!msg) return;

        if (msg.type === "AUTH_RESPONSE" && msg.clientNonce === clientNonce) {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);

            const res = msg as RemoteAuthResponsePayload;
            if (res.success && res.sessionToken) {
              set({
                status: "connected",
                sessionToken: res.sessionToken,
                errorMessage: null,
                currentLive: res.syncState?.currentLive ?? null,
                blackScreen: Boolean(res.syncState?.blackScreen),
                mediaList: res.syncState?.mediaList ?? [],
                textList: res.syncState?.textList ?? [],
              });

              // Save session to sessionStorage for automatic page reload recovery
              try {
                sessionStorage.setItem(
                  SAVED_SESSION_KEY,
                  JSON.stringify({
                    sessionId,
                    salt,
                    sessionToken: res.sessionToken,
                  }),
                );
              } catch {
                // Ignore storage quota
              }

              resolve(true);
            } else {
              set({
                status: "error",
                errorMessage: res.error || "Incorrect password. Access denied.",
              });
              resolve(false);
            }
          }
        } else if (msg.type === "STATE_SYNC") {
          set({
            currentLive: msg.syncState.currentLive,
            blackScreen: msg.syncState.blackScreen,
            mediaList: msg.syncState.mediaList,
            textList: msg.syncState.textList,
          });
        } else if (msg.type === "SESSION_ENDED") {
          get().disconnect();
          set({
            status: "error",
            errorMessage: msg.reason || "The host has ended this remote control session.",
          });
        }
      });

      // Subscribe and send auth request once connected
      channel.subscribe(async (subStatus) => {
        if (subStatus === "SUBSCRIBED") {
          try {
            await channel.send({
              type: "broadcast",
              event: "msg",
              payload: {
                type: "AUTH_REQUEST",
                clientNonce,
                authProof,
                device: {
                  id: clientId,
                  name: deviceName,
                  userAgent: navigator.userAgent,
                },
              },
            });
          } catch (err) {
            logger.error("Failed to send auth request", err);
          }
        }
      });

      set({ channel });
    });
  },

  sendCommand: async (action: RemoteCommandAction) => {
    const { channel, sessionId, sessionToken, clientId, status } = get();
    if (status !== "connected" || !channel || !sessionToken) {
      logger.warn("Cannot send command: not connected");
      return;
    }

    // Gentle haptic feedback if supported
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Ignore unsupported vibrate
      }
    }

    try {
      await channel.send({
        type: "broadcast",
        event: "msg",
        payload: {
          type: "COMMAND",
          sessionId,
          sessionToken,
          clientId,
          command: action,
        },
      });
    } catch (err) {
      logger.error("Failed to send command over channel", err);
    }
  },

  disconnect: () => {
    const ch = get().channel;
    if (ch) {
      try {
        void supabase.removeChannel(ch);
      } catch {
        // Ignore
      }
    }
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(SAVED_SESSION_KEY);
      } catch {
        // Ignore
      }
    }
    set({
      status: "idle",
      sessionToken: null,
      channel: null,
      currentLive: null,
    });
  },

  restoreSavedSession: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(SAVED_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.sessionId && parsed?.salt && parsed?.sessionToken) {
          set({
            sessionId: parsed.sessionId,
            salt: parsed.salt,
            sessionToken: parsed.sessionToken,
          });
        }
      }
    } catch {
      // Ignore
    }
  },
}));
