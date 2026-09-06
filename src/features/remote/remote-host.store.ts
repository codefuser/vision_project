/**
 * Host (Laptop) Remote Control Store.
 * Manages active session lifecycle, Supabase Realtime channel,
 * phone authentication verification, and bidirectional live application state synchronization.
 */
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { db } from "@/db/schema";
import { useTextItems } from "@/stores/text-items.store";
import { useProjection } from "@/stores/projection.store";
import { projectionEngine } from "@/projection/engine";
import { projectionHistory } from "@/projection/history";
import { projectVerse } from "@/projection/adapters/bible.adapter";
import { projectVerseAt } from "@/lib/bible/project-ref";
import { projectSongSlide } from "@/projection/adapters/song.adapter";
import { projectMediaById } from "@/projection/adapters/media.adapter";
import { projectTextSlide } from "@/projection/adapters/text.adapter";
import { useWorkspace, type WorkspaceTab } from "@/features/workspace/workspace.store";
import { useBibleStore } from "@/lib/bible/store";
import { useSongsStore } from "@/lib/songs/store";
import type {
  ActiveRemoteTab,
  RemoteBroadcastMessage,
  RemoteDevice,
  RemoteHostSyncState,
  RemoteRecentItem,
  RemoteSession,
} from "./types";
import {
  computeSessionToken,
  generateRandomId,
  generateSalt,
  sha256,
  verifyAuthProof,
} from "./remote-crypto";

const CHANNEL_PREFIX = "vp_remote_";

export function mapLaptopToRemoteTab(t: WorkspaceTab): ActiveRemoteTab {
  switch (t) {
    case "bible":
      return "verse";
    case "songs":
      return "song";
    case "media":
      return "media";
    case "text":
      return "text";
    default:
      return "verse";
  }
}

export function mapRemoteToLaptopTab(t: ActiveRemoteTab): WorkspaceTab {
  switch (t) {
    case "verse":
      return "bible";
    case "song":
    case "lyric":
      return "songs";
    case "media":
      return "media";
    case "text":
      return "text";
    default:
      return "bible";
  }
}

// Host remote store for session management and live application state synchronization

interface HostRemoteState {
  session: RemoteSession | null;
  isDialogOpen: boolean;
  channel: RealtimeChannel | null;
  tokens: Set<string>; // active authenticated tokens

  // Actions
  setDialogOpen: (open: boolean) => void;
  startSession: (customPassword?: string) => Promise<RemoteSession>;
  updatePassword: (newPassword: string) => Promise<void>;
  endSession: () => Promise<void>;
  broadcastSyncState: () => Promise<void>;
  broadcastDelta: (delta: Partial<RemoteHostSyncState>) => Promise<void>;
}

// Flag to prevent loop: Laptop updates store from Remote -> store subscription does not re-broadcast back to Remote
let isApplyingRemoteSync = false;

export const useHostRemote = create<HostRemoteState>((set, get) => ({
  session: null,
  isDialogOpen: false,
  channel: null,
  tokens: new Set<string>(),

  setDialogOpen: (open) => set({ isDialogOpen: open }),

  startSession: async (customPassword?: string) => {
    const existing = get().session;
    if (existing && get().channel) {
      return existing;
    }

    const sessionId = generateRandomId("vp", 6).toLowerCase();
    const salt = generateSalt(16);
    const passwordPlain = (customPassword || generateRandomId("pass", 4)).trim();
    const passwordHash = await sha256(`${passwordPlain}::${salt}::${sessionId}`);

    const newSession: RemoteSession = {
      sessionId,
      salt,
      passwordPlain,
      passwordHash,
      status: "waiting",
      createdAt: Date.now(),
      connectedDevices: [],
    };

    // Clean up previous channel if any
    const prevChannel = get().channel;
    if (prevChannel) {
      try {
        await supabase.removeChannel(prevChannel);
      } catch (e) {
        logger.warn("Error removing previous channel", e);
      }
    }

    const channelName = `${CHANNEL_PREFIX}${sessionId}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    channel.on("broadcast", { event: "msg" }, async (payload) => {
      const msg = payload.payload as RemoteBroadcastMessage;
      if (!msg) return;

      const currentSession = get().session;
      if (!currentSession || currentSession.sessionId !== sessionId) return;

      switch (msg.type) {
        case "AUTH_REQUEST": {
          const { clientNonce, authProof, device } = msg;
          const isValid = await verifyAuthProof(
            currentSession.passwordPlain,
            currentSession.salt,
            currentSession.sessionId,
            clientNonce,
            authProof,
          );

          if (isValid) {
            const token = await computeSessionToken(
              currentSession.sessionId,
              clientNonce,
              currentSession.passwordPlain,
            );
            get().tokens.add(token);

            const newDevice: RemoteDevice = {
              id: device.id,
              name: device.name || "Mobile Remote",
              userAgent: device.userAgent,
              connectedAt: Date.now(),
              lastSeenAt: Date.now(),
            };

            const updatedDevices = [
              ...currentSession.connectedDevices.filter((d) => d.id !== device.id),
              newDevice,
            ];

            set({
              session: {
                ...currentSession,
                status: "connected",
                connectedDevices: updatedDevices,
              },
            });

            toast.success(`Remote Connected: ${newDevice.name}`);

            try {
              // Prepare complete lightweight snapshot (< 5KB payload)
              const syncState = await buildSyncState();

              // Send full initial state sync to mobile immediately
              const sendRes = await channel.send({
                type: "broadcast",
                event: "msg",
                payload: {
                  type: "AUTH_RESPONSE",
                  clientNonce,
                  success: true,
                  sessionToken: token,
                  syncState,
                },
              });
              logger.info(`AUTH_RESPONSE broadcast status: ${sendRes}`);
            } catch (sendErr) {
              logger.error("Failed to send AUTH_RESPONSE", sendErr);
            }
          } else {
            logger.warn("Remote auth failed: incorrect password proof");
            try {
              await channel.send({
                type: "broadcast",
                event: "msg",
                payload: {
                  type: "AUTH_RESPONSE",
                  clientNonce,
                  success: false,
                  error: "Incorrect password. Access denied.",
                },
              });
            } catch (sendErr) {
              logger.error("Failed to send negative AUTH_RESPONSE", sendErr);
            }
          }
          break;
        }

        case "COMMAND": {
          const { sessionToken, command, clientId } = msg;
          if (!get().tokens.has(sessionToken)) {
            logger.warn("Remote command rejected: invalid session token", clientId);
            return;
          }

          // Update heartbeat
          const curSess = get().session;
          if (curSess) {
            const updated = curSess.connectedDevices.map((d) =>
              d.id === clientId ? { ...d, lastSeenAt: Date.now() } : d,
            );
            set({ session: { ...curSess, connectedDevices: updated } });
          }

          try {
            switch (command.action) {
              case "SYNC_TAB": {
                const targetLaptopTab = mapRemoteToLaptopTab(command.tab);
                if (useWorkspace.getState().activeTab !== targetLaptopTab) {
                  isApplyingRemoteSync = true;
                  useWorkspace.getState().setActiveTab(targetLaptopTab);
                  isApplyingRemoteSync = false;
                }
                break;
              }

              case "SYNC_SEARCH": {
                isApplyingRemoteSync = true;
                const { tab, query } = command;
                if (tab === "verse") {
                  useWorkspace.getState().setBibleSearch({ query });
                  useBibleStore.getState().setQuery(query);
                } else if (tab === "song" || tab === "lyric") {
                  useWorkspace.getState().setSongsSearch({ query });
                  useSongsStore.getState().setQuery(query);
                } else if (tab === "media") {
                  useWorkspace.getState().setMediaSearch({ query });
                } else if (tab === "text") {
                  useWorkspace.getState().setTextSearch({ query });
                }
                isApplyingRemoteSync = false;
                break;
              }

              case "SYNC_SELECT_SONG": {
                isApplyingRemoteSync = true;
                useWorkspace.getState().setSelectedSongId(command.songId);
                useSongsStore.getState().selectSong(command.songId);
                isApplyingRemoteSync = false;
                break;
              }

              case "SYNC_SELECT_TEXT": {
                isApplyingRemoteSync = true;
                useWorkspace.getState().setSelectedTextId(command.textId);
                isApplyingRemoteSync = false;
                break;
              }

              case "PROJECT_VERSE": {
                if (command.directInput) {
                  projectVerse(command.directInput);
                } else if (command.verseData) {
                  projectVerseAt(command.verseData);
                }
                break;
              }

              case "PROJECT_SONG_SLIDE": {
                projectSongSlide(command.input);
                break;
              }

              case "PROJECT_MEDIA": {
                await projectMediaById(command.mediaId);
                break;
              }

              case "PROJECT_TEXT": {
                projectTextSlide(command.input);
                break;
              }

              case "TRANSPORT": {
                if (command.subAction === "BLACK") {
                  projectionEngine.setBlack(Boolean(command.value));
                } else if (command.subAction === "CLEAR") {
                  projectionEngine.clear();
                } else if (command.subAction === "PLAY") {
                  projectionEngine.play();
                } else if (command.subAction === "PAUSE") {
                  projectionEngine.pause();
                } else if (command.subAction === "NEXT") {
                  projectionEngine.next();
                } else if (command.subAction === "PREV") {
                  projectionEngine.prev();
                }
                break;
              }

              case "REPROJECT_HISTORY": {
                const item = command.item;
                if (item.metadata?.verseData) {
                  projectVerseAt(item.metadata.verseData);
                } else if (item.metadata?.slideInput) {
                  projectSongSlide(item.metadata.slideInput);
                } else if (item.metadata?.mediaId) {
                  await projectMediaById(item.metadata.mediaId);
                } else if (item.metadata?.textInput) {
                  projectTextSlide(item.metadata.textInput);
                }
                break;
              }
            }

            // Sync updated state
            setTimeout(() => {
              void get().broadcastSyncState();
            }, 60);
          } catch (err) {
            logger.error("Failed to execute remote command", err);
          }
          break;
        }

        case "HEARTBEAT": {
          const curSess = get().session;
          if (curSess) {
            const updated = curSess.connectedDevices.map((d) =>
              d.id === msg.clientId ? { ...d, lastSeenAt: Date.now() } : d,
            );
            set({ session: { ...curSess, connectedDevices: updated } });
          }
          break;
        }
      }
    });

    channel.subscribe((status) => {
      logger.info(`Host remote channel [${channelName}] status: ${status}`);
    });

    set({ session: newSession, channel, tokens: new Set() });
    return newSession;
  },

  updatePassword: async (newPassword: string) => {
    const s = get().session;
    if (!s) return;
    const clean = newPassword.trim();
    const sessionId = s.sessionId.trim().toLowerCase();
    const passwordHash = await sha256(`${clean}::${s.salt}::${sessionId}`);
    set({
      session: {
        ...s,
        sessionId,
        passwordPlain: clean,
        passwordHash,
      },
      tokens: new Set(),
    });
    toast.info("Remote password updated. Connected remotes must reconnect.");
  },

  endSession: async () => {
    const ch = get().channel;
    if (ch) {
      try {
        await ch.send({
          type: "broadcast",
          event: "msg",
          payload: { type: "SESSION_ENDED", reason: "Host closed the session" },
        });
        await supabase.removeChannel(ch);
      } catch (e) {
        logger.warn("Error terminating remote channel", e);
      }
    }
    set({ session: null, channel: null, tokens: new Set() });
    toast.info("Remote control session ended.");
  },

  broadcastSyncState: async () => {
    const ch = get().channel;
    if (!ch) return;
    try {
      const syncState = await buildSyncState();
      await ch.send({
        type: "broadcast",
        event: "msg",
        payload: {
          type: "STATE_SYNC",
          syncState,
        },
      });
    } catch (e) {
      logger.warn("broadcastSyncState error", e);
    }
  },

  broadcastDelta: async (delta: Partial<RemoteHostSyncState>) => {
    const ch = get().channel;
    if (!ch) return;
    try {
      await ch.send({
        type: "broadcast",
        event: "msg",
        payload: {
          type: "STATE_DELTA",
          origin: "host",
          delta,
        },
      });
    } catch (e) {
      logger.warn("broadcastDelta error", e);
    }
  },
}));

/**
 * Builds the complete state snapshot for mobile synchronization.
 */
async function buildSyncState(): Promise<RemoteHostSyncState> {
  const ws = useWorkspace.getState();
  const cur = projectionEngine.getCurrent();
  const projState = useProjection.getState().state;

  // Active tab & search queries
  const activeTab = mapLaptopToRemoteTab(ws.activeTab);
  const searchQuery = {
    verse: ws.bibleSearch.query || useBibleStore.getState().query || "",
    song: ws.songsSearch.query || useSongsStore.getState().query || "",
    lyric: "",
    media: ws.mediaSearch.query || "",
    text: ws.textSearch.query || "",
  };

  // Currently live projection with exact metadata for card match
  let currentLive: RemoteHostSyncState["currentLive"] = null;
  if (cur) {
    currentLive = {
      id: cur.id,
      title: cur.title,
      type: cur.type,
      metadata: cur.metadata as Record<string, any>,
      details:
        cur.type === "bible_verse"
          ? String((cur.body as any)?.text || "").slice(0, 300)
          : cur.type === "song_slide"
            ? (cur.body as any)?.lines?.slice(0, 4)?.join("\n")
            : undefined,
    };
  }

  // Recent history (max 25 items)
  const recentHistory: RemoteRecentItem[] = projectionHistory
    .list()
    .slice(0, 25)
    .map((h) => ({
      id: h.id,
      title: h.title,
      type: h.type,
      projectedAt: h.projectedAt,
    }));

  // Load media items from Dexie (lightweight metadata for fast sync, no heavy base64 strings)
  let mediaList: RemoteHostSyncState["mediaList"] = [];
  try {
    const records = await db().media.orderBy("createdAt").reverse().limit(60).toArray();
    mediaList = records.map((m) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      durationMs: m.durationMs,
    }));
  } catch (err) {
    logger.warn("Failed to load media for remote sync", err);
  }

  // Load text items from store (trimmed to keep broadcast message well under 128KB)
  const textItems = useTextItems.getState().items;
  const textList = textItems.slice(0, 30).map((t) => ({
    id: t.id,
    title: t.title,
    content: (t.content || "").slice(0, 200),
  }));

  return {
    activeTab,
    searchQuery,
    selectedSongId: ws.selectedSongId,
    selectedTextId: ws.selectedTextId,
    currentLive,
    blackScreen: Boolean(projState?.black),
    recentHistory,
    mediaList,
    textList,
  };
}

// ── Workspace State Subscriptions (Laptop User -> Mobile Remote) ───────────────

if (typeof window !== "undefined") {
  let prevTab = useWorkspace.getState().activeTab;
  let prevSongsQuery = useWorkspace.getState().songsSearch.query;
  let prevBibleQuery = useWorkspace.getState().bibleSearch.query;
  let prevMediaQuery = useWorkspace.getState().mediaSearch.query;
  let prevTextQuery = useWorkspace.getState().textSearch.query;
  let prevSelectedSongId = useWorkspace.getState().selectedSongId;

  useWorkspace.subscribe((state) => {
    if (isApplyingRemoteSync) return;
    const { session, channel, broadcastDelta } = useHostRemote.getState();
    if (!session || !channel) return;

    // 1. Tab changed on laptop
    if (state.activeTab !== prevTab) {
      prevTab = state.activeTab;
      const remoteTab = mapLaptopToRemoteTab(state.activeTab);
      void broadcastDelta({ activeTab: remoteTab });
    }

    // 2. Search query changed on laptop
    if (state.songsSearch.query !== prevSongsQuery) {
      prevSongsQuery = state.songsSearch.query;
      void broadcastDelta({
        searchQuery: {
          verse: prevBibleQuery,
          song: prevSongsQuery,
          lyric: "",
          media: prevMediaQuery,
          text: prevTextQuery,
        },
      });
    }

    if (state.bibleSearch.query !== prevBibleQuery) {
      prevBibleQuery = state.bibleSearch.query;
      void broadcastDelta({
        searchQuery: {
          verse: prevBibleQuery,
          song: prevSongsQuery,
          lyric: "",
          media: prevMediaQuery,
          text: prevTextQuery,
        },
      });
    }

    if (state.mediaSearch.query !== prevMediaQuery) {
      prevMediaQuery = state.mediaSearch.query;
      void broadcastDelta({
        searchQuery: {
          verse: prevBibleQuery,
          song: prevSongsQuery,
          lyric: "",
          media: prevMediaQuery,
          text: prevTextQuery,
        },
      });
    }

    if (state.textSearch.query !== prevTextQuery) {
      prevTextQuery = state.textSearch.query;
      void broadcastDelta({
        searchQuery: {
          verse: prevBibleQuery,
          song: prevSongsQuery,
          lyric: "",
          media: prevMediaQuery,
          text: prevTextQuery,
        },
      });
    }

    // 3. Selected song changed on laptop
    if (state.selectedSongId !== prevSelectedSongId) {
      prevSelectedSongId = state.selectedSongId;
      void broadcastDelta({ selectedSongId: state.selectedSongId });
    }
  });

  // Projection Engine listener: auto-sync state when projection changes
  projectionEngine.onAny(() => {
    const { session, channel } = useHostRemote.getState();
    if (session && channel) {
      void useHostRemote.getState().broadcastSyncState();
    }
  });
}
