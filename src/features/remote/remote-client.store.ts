/**
 * Mobile Remote Client Store.
 * Connects to the host laptop's Supabase Realtime channel,
 * handles cryptographic authentication challenge-response,
 * dispatches touch commands, and syncs live application state bidirectionally.
 */
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import type {
  ActiveRemoteTab,
  RemoteAuthResponsePayload,
  RemoteBroadcastMessage,
  RemoteCommandAction,
  RemoteHostSyncState,
  RemoteRecentItem,
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
  activeTab: ActiveRemoteTab;
  searchQuery: {
    verse: string;
    song: string;
    lyric: string;
    media: string;
    text: string;
  };
  selectedSongId: number | null;
  selectedTextId: string | null;
  currentLive: RemoteHostSyncState["currentLive"];
  blackScreen: boolean;
  recentHistory: RemoteRecentItem[];
  mediaList: RemoteHostSyncState["mediaList"];
  textList: RemoteHostSyncState["textList"];

  // Actions
  setSessionCredentials: (sessionId: string, salt: string) => void;
  authenticate: (password: string) => Promise<boolean>;
  setActiveTab: (tab: ActiveRemoteTab) => void;
  setSearchQuery: (tab: ActiveRemoteTab, query: string) => void;
  setSelectedSongId: (songId: number | null) => void;
  reprojectHistory: (item: RemoteRecentItem) => void;
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

  activeTab: "verse",
  searchQuery: {
    verse: "",
    song: "",
    lyric: "",
    media: "",
    text: "",
  },
  selectedSongId: null,
  selectedTextId: null,
  currentLive: null,
  blackScreen: false,
  recentHistory: [],
  mediaList: [],
  textList: [],

  setSessionCredentials: (sessionId, salt) => {
    set({
      sessionId: (sessionId || "").trim().toLowerCase(),
      salt: (salt || "").trim(),
      errorMessage: null,
    });
  },

  authenticate: async (password: string): Promise<boolean> => {
    const rawSessionId = get().sessionId || "";
    const rawSalt = get().salt || "";
    const sessionId = rawSessionId.trim().toLowerCase();
    const salt = rawSalt.trim();
    const { clientId } = get();

    if (!sessionId || !salt) {
      set({ status: "error", errorMessage: "Missing session ID or salt. Please re-scan QR." });
      return false;
    }

    set({ status: "authenticating", errorMessage: null });

    // Clean up any existing channel
    const prevChannel = get().channel;
    if (prevChannel) {
      try {
        await supabase.removeChannel(prevChannel);
      } catch (e) {
        logger.warn("Error removing previous channel on client", e);
      }
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

      // Timeout handler: 15s
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          set({
            status: "error",
            errorMessage: "Connection timed out. Ensure laptop has started the session.",
          });
          resolve(false);
        }
      }, 15000);

      // Listen for host messages
      channel.on("broadcast", { event: "msg" }, (payload) => {
        const msg = payload.payload as RemoteBroadcastMessage;
        if (!msg) return;

        if (msg.type === "AUTH_RESPONSE" && msg.clientNonce === clientNonce) {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);

            const res = msg as RemoteAuthResponsePayload;
            if (res.success && res.sessionToken) {
              const sync = res.syncState;
              set({
                status: "connected",
                sessionToken: res.sessionToken,
                errorMessage: null,
                activeTab: sync?.activeTab ?? "verse",
                searchQuery: sync?.searchQuery ?? {
                  verse: "",
                  song: "",
                  lyric: "",
                  media: "",
                  text: "",
                },
                selectedSongId: sync?.selectedSongId ?? null,
                selectedTextId: sync?.selectedTextId ?? null,
                currentLive: sync?.currentLive ?? null,
                blackScreen: Boolean(sync?.blackScreen),
                recentHistory: sync?.recentHistory ?? [],
                mediaList: sync?.mediaList ?? [],
                textList: sync?.textList ?? [],
              });

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
                // Ignore quota
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
          const sync = msg.syncState;
          set({
            activeTab: sync.activeTab ?? get().activeTab,
            searchQuery: sync.searchQuery ?? get().searchQuery,
            selectedSongId: sync.selectedSongId ?? get().selectedSongId,
            selectedTextId: sync.selectedTextId ?? get().selectedTextId,
            currentLive: sync.currentLive,
            blackScreen: sync.blackScreen,
            recentHistory: sync.recentHistory ?? get().recentHistory,
            mediaList: sync.mediaList ?? get().mediaList,
            textList: sync.textList ?? get().textList,
          });
        } else if (msg.type === "STATE_DELTA") {
          // Delta received from host
          if (msg.origin === "host") {
            const delta = msg.delta;
            set((s) => ({
              activeTab: delta.activeTab ?? s.activeTab,
              searchQuery: delta.searchQuery
                ? { ...s.searchQuery, ...delta.searchQuery }
                : s.searchQuery,
              selectedSongId:
                delta.selectedSongId !== undefined ? delta.selectedSongId : s.selectedSongId,
              selectedTextId:
                delta.selectedTextId !== undefined ? delta.selectedTextId : s.selectedTextId,
              currentLive: delta.currentLive !== undefined ? delta.currentLive : s.currentLive,
              blackScreen: delta.blackScreen !== undefined ? delta.blackScreen : s.blackScreen,
              recentHistory: delta.recentHistory ?? s.recentHistory,
            }));
          }
        } else if (msg.type === "SESSION_ENDED") {
          get().disconnect();
          set({
            status: "error",
            errorMessage: msg.reason || "The host has ended this remote control session.",
          });
        }
      });

      // Subscribe and send auth request once connected
      channel.subscribe(async (subStatus, err) => {
        logger.info(`Client channel [${channelName}] status: ${subStatus}`);
        if (subStatus === "SUBSCRIBED") {
          try {
            const sendRes = await channel.send({
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
            logger.info(`AUTH_REQUEST send result: ${sendRes}`);
          } catch (sendErr) {
            logger.error("Failed to send auth request", sendErr);
          }
        } else if (subStatus === "CHANNEL_ERROR" || subStatus === "TIMED_OUT") {
          logger.warn(`Channel subscription error: ${subStatus}`, err);
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            set({
              status: "error",
              errorMessage: `Network error (${subStatus}). Check internet connection and verify laptop session is active.`,
            });
            resolve(false);
          }
        }
      });

      set({ channel });
    });
  },

  setActiveTab: (tab: ActiveRemoteTab) => {
    set({ activeTab: tab });
    void get().sendCommand({ action: "SYNC_TAB", tab });
  },

  setSearchQuery: (tab: ActiveRemoteTab, query: string) => {
    set((s) => ({
      searchQuery: {
        ...s.searchQuery,
        [tab]: query,
      },
    }));
    void get().sendCommand({ action: "SYNC_SEARCH", tab, query });
  },

  setSelectedSongId: (songId: number | null) => {
    set({ selectedSongId: songId });
    void get().sendCommand({ action: "SYNC_SELECT_SONG", songId });
  },

  reprojectHistory: (item: RemoteRecentItem) => {
    void get().sendCommand({ action: "REPROJECT_HISTORY", item });
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
        // Ignore
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
            sessionId: String(parsed.sessionId).trim().toLowerCase(),
            salt: String(parsed.salt).trim(),
            sessionToken: parsed.sessionToken,
          });
        }
      }
    } catch {
      // Ignore
    }
  },
}));
