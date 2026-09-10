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
import { toast } from "sonner";
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
const REMOTE_MODE_KEY = "vp_remote_mode";

const pendingSongRequests = new Map<string, (results: any[]) => void>();
const pendingVerseRequests = new Map<string, (results: any[]) => void>();
const pendingChapterRequests = new Map<string, (verses: string[]) => void>();

function getInitialRemoteMode(): "full" | "projection_only" {
  if (typeof window === "undefined") return "full";
  const saved = localStorage.getItem(REMOTE_MODE_KEY);
  return saved === "projection_only" ? "projection_only" : "full";
}

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

  // Remote Control Mode: ON (full bidirectional tab sync) vs OFF (projection-only control)
  remoteControlMode: "full" | "projection_only";
  isHostDisabled: boolean;

  // Device-local UI state (independent search on mobile phone)
  activeTab: ActiveRemoteTab;
  searchQuery: {
    verse: string;
    song: string;
    media: string;
    text: string;
  };
  isLiveModalOpen: boolean;

  // Globally synchronized state from host
  selectedSongId: number | null;
  selectedTextId: string | null;
  currentLive: RemoteHostSyncState["currentLive"];
  blackScreen: boolean;
  recentHistory: RemoteRecentItem[];
  mediaList: RemoteHostSyncState["mediaList"];
  mediaThumbnails: Record<string, string>;
  textList: RemoteHostSyncState["textList"];

  // Actions
  setSessionCredentials: (sessionId: string, salt: string) => void;
  authenticate: (password: string) => Promise<boolean>;
  setRemoteControlMode: (mode: "full" | "projection_only") => void;
  setActiveTab: (tab: ActiveRemoteTab) => void;
  setSearchQuery: (tab: ActiveRemoteTab, query: string) => void;
  setSelectedSongId: (songId: number | null) => void;
  setLiveModalOpen: (open: boolean) => void;
  reprojectHistory: (item: RemoteRecentItem) => void;
  sendCommand: (action: RemoteCommandAction) => Promise<void>;
  disconnect: () => void;
  restoreSavedSession: () => void;
  requestMediaThumbnails: () => void;
  requestSongSearch: (query: string) => Promise<Array<{ id: number; title: string; slides: string[]; scale: string }>>;
  requestVerseSearch: (query: string, lang?: "en" | "ta") => Promise<Array<{ book: number; chapter: number; verse: number; text: string; bookName: string }>>;
  requestChapterVerses: (book: number, chapter: number, lang?: "en" | "ta") => Promise<string[]>;
}

export const useRemoteClient = create<RemoteClientState>((set, get) => ({
  status: "idle",
  sessionId: "",
  salt: "",
  sessionToken: null,
  errorMessage: null,
  channel: null,
  clientId: getOrCreateClientId(),

  remoteControlMode: getInitialRemoteMode(),
  isHostDisabled: false,

  activeTab: "verse",
  searchQuery: {
    verse: "",
    song: "",
    media: "",
    text: "",
  },
  isLiveModalOpen: false,

  selectedSongId: null,
  selectedTextId: null,
  currentLive: null,
  blackScreen: false,
  recentHistory: [],
  mediaList: [],
  mediaThumbnails: {},
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
              const shouldSyncTab = get().remoteControlMode === "full" && Boolean(sync?.activeTab);
              set({
                status: "connected",
                sessionToken: res.sessionToken,
                errorMessage: null,
                isHostDisabled: false,
                activeTab: shouldSyncTab ? sync!.activeTab! : get().activeTab,
                selectedSongId: sync?.selectedSongId ?? null,
                selectedTextId: sync?.selectedTextId ?? null,
                currentLive: sync?.currentLive ?? null,
                blackScreen: Boolean(sync?.blackScreen),
                recentHistory: sync?.recentHistory ?? [],
                mediaList: sync?.mediaList ?? [],
                mediaThumbnails: sync?.mediaThumbnails ?? {},
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

              // Notify host of our remote control mode
              void get().sendCommand({
                action: "SET_DEVICE_REMOTE_MODE",
                mode: get().remoteControlMode,
              });

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
          const shouldSyncTab = get().remoteControlMode === "full" && Boolean(sync.activeTab);
          set((s) => ({
            activeTab: shouldSyncTab ? sync.activeTab! : s.activeTab,
            currentLive: sync.currentLive,
            blackScreen: sync.blackScreen,
            recentHistory: sync.recentHistory ?? s.recentHistory,
            mediaList: sync.mediaList ?? s.mediaList,
            mediaThumbnails: sync.mediaThumbnails
              ? { ...s.mediaThumbnails, ...sync.mediaThumbnails }
              : s.mediaThumbnails,
            textList: sync.textList ?? s.textList,
          }));
        } else if (msg.type === "STATE_DELTA") {
          // Delta received from host
          if (msg.origin === "host") {
            const delta = msg.delta;
            const isFromOtherClient = msg.originClientId !== get().clientId;
            const shouldSyncTab =
              get().remoteControlMode === "full" &&
              Boolean(delta.activeTab) &&
              isFromOtherClient;

            set((s) => ({
              activeTab: shouldSyncTab ? delta.activeTab! : s.activeTab,
              currentLive: delta.currentLive !== undefined ? delta.currentLive : s.currentLive,
              blackScreen: delta.blackScreen !== undefined ? delta.blackScreen : s.blackScreen,
              recentHistory: delta.recentHistory ?? s.recentHistory,
              mediaThumbnails: delta.mediaThumbnails
                ? { ...s.mediaThumbnails, ...delta.mediaThumbnails }
                : s.mediaThumbnails,
              mediaList: delta.mediaList ?? s.mediaList,
              textList: delta.textList ?? s.textList,
            }));
          }
        } else if (msg.type === "DEVICE_PERMISSION_STATUS") {
          if (msg.deviceId === get().clientId) {
            set({ isHostDisabled: !msg.enabled });
            if (!msg.enabled) {
              toast.warning("Projection control disabled by laptop host");
            } else {
              toast.success("Projection control re-enabled by laptop host");
            }
          }
        } else if (msg.type === "DEVICE_DISCONNECTED") {
          if (msg.deviceId === get().clientId) {
            get().disconnect();
            set({
              status: "error",
              errorMessage: msg.reason || "Device disconnected by laptop host.",
            });
            toast.error("Disconnected by laptop host");
          }
        } else if (msg.type === "SONG_SEARCH_RESULTS") {
          const cb = pendingSongRequests.get(msg.requestId);
          if (cb) {
            pendingSongRequests.delete(msg.requestId);
            cb(msg.hits);
          }
        } else if (msg.type === "VERSE_SEARCH_RESULTS") {
          const cb = pendingVerseRequests.get(msg.requestId);
          if (cb) {
            pendingVerseRequests.delete(msg.requestId);
            cb(msg.hits);
          }
        } else if (msg.type === "CHAPTER_VERSES_RESPONSE") {
          const cb = pendingChapterRequests.get(msg.requestId);
          if (cb) {
            pendingChapterRequests.delete(msg.requestId);
            cb(msg.verses);
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

  setRemoteControlMode: (mode: "full" | "projection_only") => {
    set({ remoteControlMode: mode });
    try {
      localStorage.setItem(REMOTE_MODE_KEY, mode);
    } catch {
      // Ignore
    }
    void get().sendCommand({ action: "SET_DEVICE_REMOTE_MODE", mode });
    toast.info(
      mode === "full"
        ? "Full Remote Control (ON): Tabs will sync with laptop"
        : "Projection-Only Mode (OFF): Tabs browse independently",
    );
  },

  setActiveTab: (tab: ActiveRemoteTab) => {
    set({ activeTab: tab });
    const { remoteControlMode, status } = get();
    // If in Full Remote Control mode, broadcast tab switch to laptop & other remotes
    if (remoteControlMode === "full" && status === "connected") {
      void get().sendCommand({ action: "SYNC_TAB", tab });
    }
  },

  setSearchQuery: (tab: ActiveRemoteTab, query: string) => {
    // Independent search on mobile: only update local search query!
    set((s) => ({
      searchQuery: {
        ...s.searchQuery,
        [tab]: query,
      },
    }));
  },

  setSelectedSongId: (songId: number | null) => {
    // Local browsing selection
    set({ selectedSongId: songId });
  },

  setLiveModalOpen: (open: boolean) => {
    set({ isLiveModalOpen: open });
  },

  requestMediaThumbnails: () => {
    void get().sendCommand({ action: "REQUEST_MEDIA_THUMBS" });
  },

  reprojectHistory: (item: RemoteRecentItem) => {
    void get().sendCommand({ action: "REPROJECT_HISTORY", item });
  },

  requestSongSearch: async (query: string) => {
    const q = query.trim();
    if (!q) return [];
    const requestId = generateRandomId("srch", 6);
    const hostPromise = new Promise<any[]>((resolve) => {
      pendingSongRequests.set(requestId, resolve);
      setTimeout(() => {
        if (pendingSongRequests.has(requestId)) {
          pendingSongRequests.delete(requestId);
          resolve([]);
        }
      }, 500);
    });

    void get().sendCommand({ action: "SEARCH_SONGS", query: q, requestId });
    const hostResults = await hostPromise;
    if (hostResults.length > 0) return hostResults;

    // Fallback: direct lightweight Supabase REST query
    try {
      const { data } = await supabase
        .from("songs")
        .select("id, title, content, scale")
        .ilike("title", `%${q}%`)
        .limit(30);

      if (data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          title: r.title,
          slides: (r.content || "")
            .split(/\n\s*\n+/)
            .map((s: string) => s.trim())
            .filter(Boolean),
          scale: r.scale || "",
        }));
      }
    } catch {
      // Ignore
    }
    return [];
  },

  requestVerseSearch: async (query: string, lang = "ta") => {
    const q = query.trim();
    if (!q) return [];
    const requestId = generateRandomId("vsrch", 6);
    const hostPromise = new Promise<any[]>((resolve) => {
      pendingVerseRequests.set(requestId, resolve);
      setTimeout(() => {
        if (pendingVerseRequests.has(requestId)) {
          pendingVerseRequests.delete(requestId);
          resolve([]);
        }
      }, 500);
    });

    void get().sendCommand({ action: "SEARCH_VERSES", query: q, lang: lang as "en" | "ta", requestId });
    const hostResults = await hostPromise;
    if (hostResults.length > 0) return hostResults;

    // Fallback direct lightweight Supabase REST query
    try {
      const tableName = lang === "en" ? "english_bible" : "tamil_bible";
      const { data } = await supabase
        .from(tableName)
        .select("book, chapter, versecount, verse")
        .ilike("verse", `%${q}%`)
        .limit(30);

      if (data && data.length > 0) {
        return data.map((r: any) => ({
          book: Number(r.book),
          chapter: Number(r.chapter),
          verse: Number(r.versecount),
          text: r.verse,
          bookName: "",
        }));
      }
    } catch {
      // Ignore
    }
    return [];
  },

  requestChapterVerses: async (book: number, chapter: number, lang = "ta") => {
    const requestId = generateRandomId("chvs", 6);
    const hostPromise = new Promise<string[]>((resolve) => {
      pendingChapterRequests.set(requestId, resolve);
      setTimeout(() => {
        if (pendingChapterRequests.has(requestId)) {
          pendingChapterRequests.delete(requestId);
          resolve([]);
        }
      }, 500);
    });

    void get().sendCommand({ action: "GET_CHAPTER_VERSES", book, chapter, lang: lang as "en" | "ta", requestId });
    const hostResults = await hostPromise;
    if (hostResults.length > 0) return hostResults;

    // Fallback direct lightweight Supabase REST query
    try {
      const tableName = lang === "en" ? "english_bible" : "tamil_bible";
      const { data } = await supabase
        .from(tableName)
        .select("verse")
        .eq("book", book)
        .eq("chapter", chapter)
        .order("versecount");

      if (data && data.length > 0) {
        return data.map((r: any) => r.verse);
      }
    } catch {
      // Ignore
    }
    return [];
  },

  sendCommand: async (action: RemoteCommandAction) => {
    const { channel, sessionId, sessionToken, clientId, status, isHostDisabled } = get();
    if (status !== "connected" || !channel || !sessionToken) {
      logger.warn("Cannot send command: not connected");
      return;
    }

    if (isHostDisabled) {
      const isProjectionAction =
        action.action.startsWith("PROJECT_") ||
        action.action === "TRANSPORT" ||
        action.action === "REPROJECT_HISTORY";
      if (isProjectionAction) {
        toast.warning("Projection control disabled by laptop host");
        return;
      }
    }

    // Gentle haptic feedback if supported
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Ignore
      }
    }

    // Instant optimistic state updates on mobile for 0ms response latency
    if (action.action === "PROJECT_SONG_SLIDE") {
      set({
        currentLive: {
          type: "song_slide",
          title: `${action.input.title} (slide ${action.input.slideIndex + 1})`,
          details: action.input.text,
          metadata: {
            songId: action.input.songId,
            slideIndex: action.input.slideIndex,
            totalSlides: action.input.totalSlides,
          },
        },
        blackScreen: false,
      });
    } else if (action.action === "PROJECT_VERSE") {
      if (action.directInput) {
        set({
          currentLive: {
            type: "bible_verse",
            title: action.directInput.reference,
            details: action.directInput.text,
          },
          blackScreen: false,
        });
      }
    } else if (action.action === "PROJECT_MEDIA") {
      const mediaItem = get().mediaList.find((m) => m.id === action.mediaId);
      if (mediaItem) {
        set({
          currentLive: {
            type: mediaItem.type,
            title: mediaItem.name,
            id: `media:${mediaItem.id}`,
            metadata: { mediaId: mediaItem.id },
          },
          blackScreen: false,
        });
      }
    } else if (action.action === "PROJECT_TEXT") {
      set({
        currentLive: {
          type: "text",
          title: action.input.title,
          details: action.input.text,
        },
        blackScreen: false,
      });
    } else if (action.action === "TRANSPORT") {
      if (action.subAction === "BLACK") {
        set({ blackScreen: Boolean(action.value) });
      } else if (action.subAction === "CLEAR") {
        set({ currentLive: null });
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
