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
import { getSongs } from "@/lib/songs/loader";
import { searchSongs } from "@/lib/songs/search";
import { getBible } from "@/lib/bible/loader";
import { search as searchBible } from "@/lib/bible/search";
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
      return "songs";
    case "media":
      return "media";
    case "text":
      return "text";
    default:
      return "bible";
  }
}

// In-memory cache for base64 thumbnail URLs
const thumbDataCache = new Map<string, string>();

async function getThumbnailBase64(blobId?: string | null): Promise<string | undefined> {
  if (!blobId) return undefined;
  if (thumbDataCache.has(blobId)) return thumbDataCache.get(blobId);

  try {
    const rec = await db().blobs.get(blobId);
    if (!rec?.blob) return undefined;

    // If already a small thumb blob (<= 25KB), read it directly
    if (
      rec.blob.size <= 25 * 1024 &&
      (rec.kind === "thumb" || rec.blob.type === "image/webp" || rec.blob.type === "image/jpeg")
    ) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          if (res) thumbDataCache.set(blobId, res);
          resolve(res);
        };
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(rec.blob);
      });
    }

    // For any image (original or larger thumb), resize via an offscreen canvas to compact 240x135 JPEG
    if (
      typeof window !== "undefined" &&
      (rec.blob.type.startsWith("image/") || rec.kind === "thumb" || rec.kind === "original")
    ) {
      return new Promise((resolve) => {
        const url = URL.createObjectURL(rec.blob);
        const img = new Image();
        img.onload = () => {
          try {
            const maxW = 240;
            const maxH = 135;
            const w = img.naturalWidth || img.width || 240;
            const h = img.naturalHeight || img.height || 135;
            const scale = Math.min(maxW / w, maxH / h, 1);
            const cw = Math.max(1, Math.round(w * scale));
            const ch = Math.max(1, Math.round(h * scale));

            const canvas = document.createElement("canvas");
            canvas.width = cw;
            canvas.height = ch;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              URL.revokeObjectURL(url);
              resolve(undefined);
              return;
            }
            ctx.drawImage(img, 0, 0, cw, ch);
            URL.revokeObjectURL(url);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.65);
            thumbDataCache.set(blobId, dataUrl);
            resolve(dataUrl);
          } catch {
            URL.revokeObjectURL(url);
            resolve(undefined);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(undefined);
        };
        img.src = url;
      });
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export async function broadcastMediaThumbnails(): Promise<void> {
  const { session, channel } = useHostRemote.getState();
  if (!session || !channel) return;

  try {
    const records = await db().media.orderBy("createdAt").reverse().limit(60).toArray();
    const batchSize = 3;
    let currentBatch: Record<string, string> = {};
    let count = 0;

    for (const m of records) {
      const blobId = m.thumbBlobId ?? m.blobId;
      if (!blobId) continue;
      const dataUrl = await getThumbnailBase64(blobId);
      if (dataUrl) {
        currentBatch[m.id] = dataUrl;
        count++;

        if (count >= batchSize) {
          await channel.send({
            type: "broadcast",
            event: "msg",
            payload: {
              type: "STATE_DELTA",
              origin: "host",
              delta: { mediaThumbnails: currentBatch },
            },
          });
          currentBatch = {};
          count = 0;
          await new Promise((r) => setTimeout(r, 70));
        }
      }
    }

    if (Object.keys(currentBatch).length > 0) {
      await channel.send({
        type: "broadcast",
        event: "msg",
        payload: {
          type: "STATE_DELTA",
          origin: "host",
          delta: { mediaThumbnails: currentBatch },
        },
      });
    }
  } catch (err) {
    logger.warn("Failed to broadcast media thumbnails", err);
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
  toggleDeviceEnabled: (deviceId: string, enabled: boolean) => Promise<void>;
  disconnectDevice: (deviceId: string) => Promise<void>;
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

            const existingDev = currentSession.connectedDevices.find((d) => d.id === device.id);
            const newDevice: RemoteDevice = {
              id: device.id,
              name: device.name || existingDev?.name || "Mobile Remote",
              userAgent: device.userAgent || existingDev?.userAgent || "Unknown",
              connectedAt: existingDev?.connectedAt || Date.now(),
              lastSeenAt: Date.now(),
              enabled: existingDev?.enabled ?? true,
              remoteMode: existingDev?.remoteMode ?? "full",
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

              // Progressive media thumbnails delivery in background without blocking auth
              setTimeout(() => {
                void broadcastMediaThumbnails();
              }, 250);
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
          const currentDev = curSess?.connectedDevices.find((d) => d.id === clientId);
          if (curSess) {
            const updated = curSess.connectedDevices.map((d) =>
              d.id === clientId ? { ...d, lastSeenAt: Date.now() } : d,
            );
            set({ session: { ...curSess, connectedDevices: updated } });
          }

          // Server-side authorization check: if device was disabled by laptop host, reject projection & commands
          if (currentDev && currentDev.enabled === false) {
            logger.warn(`Remote command rejected: device ${currentDev.name} (${clientId}) is disabled by host`);
            void channel.send({
              type: "broadcast",
              event: "msg",
              payload: {
                type: "DEVICE_PERMISSION_STATUS",
                deviceId: clientId,
                clientId,
                enabled: false,
              },
            });
            return;
          }

          try {
            switch (command.action) {
              case "SYNC_TAB": {
                // If device is in 'full' remote mode and enabled, sync to laptop and other remotes
                if (currentDev && currentDev.enabled !== false && currentDev.remoteMode !== "projection_only") {
                  const laptopTab = mapRemoteToLaptopTab(command.tab);
                  isApplyingRemoteSync = true;
                  try {
                    useWorkspace.getState().setActiveTab(laptopTab);
                  } finally {
                    isApplyingRemoteSync = false;
                  }
                  // Bi-directionally broadcast to all other remotes that activeTab has changed
                  void channel.send({
                    type: "broadcast",
                    event: "msg",
                    payload: {
                      type: "STATE_DELTA",
                      origin: "host",
                      originClientId: clientId,
                      delta: { activeTab: command.tab },
                    },
                  });
                }
                break;
              }

              case "SET_DEVICE_REMOTE_MODE": {
                if (curSess) {
                  const updated = curSess.connectedDevices.map((d) =>
                    d.id === clientId ? { ...d, remoteMode: command.mode } : d,
                  );
                  set({ session: { ...curSess, connectedDevices: updated } });
                }
                break;
              }

              case "SYNC_SEARCH": {
                // Independent search: do not change laptop search query
                break;
              }

              case "SYNC_SELECT_SONG": {
                // Independent browsing: do not force laptop UI
                break;
              }

              case "SYNC_SELECT_TEXT": {
                // Independent browsing
                break;
              }

              case "REQUEST_MEDIA_THUMBS": {
                void broadcastMediaThumbnails();
                break;
              }

              case "SEARCH_SONGS": {
                const q = command.query.trim();
                const reqId = command.requestId;
                const songs = getSongs();
                let hits: Array<{ id: number; title: string; slides: string[]; scale: string }> = [];
                if (songs && songs.length > 0 && q) {
                  const rawHits = searchSongs(q, songs, 25);
                  hits = rawHits.map((h) => ({
                    id: h.song.id,
                    title: h.song.title,
                    slides: h.song.slides,
                    scale: h.song.scale,
                  }));
                }
                void channel.send({
                  type: "broadcast",
                  event: "msg",
                  payload: {
                    type: "SONG_SEARCH_RESULTS",
                    requestId: reqId,
                    hits,
                  },
                });
                break;
              }

              case "SEARCH_VERSES": {
                const q = command.query.trim();
                const reqId = command.requestId;
                const lang = command.lang || "ta";
                const bibleData = getBible(lang);
                let hits: Array<{ book: number; chapter: number; verse: number; text: string; bookName: string }> = [];
                if (bibleData && q) {
                  const rawHits = searchBible(q, bibleData, lang, 25);
                  hits = rawHits.map((h) => ({
                    book: h.book,
                    chapter: h.chapter,
                    verse: h.verse,
                    text: h.text,
                    bookName: h.bookNameLocal || h.bookName,
                  }));
                }
                void channel.send({
                  type: "broadcast",
                  event: "msg",
                  payload: {
                    type: "VERSE_SEARCH_RESULTS",
                    requestId: reqId,
                    hits,
                  },
                });
                break;
              }

              case "GET_CHAPTER_VERSES": {
                const reqId = command.requestId;
                const lang = command.lang || "ta";
                const bibleData = getBible(lang);
                const verses: string[] = [];
                if (bibleData && bibleData[command.book]?.[command.chapter - 1]) {
                  verses.push(...(bibleData[command.book][command.chapter - 1] || []));
                }
                void channel.send({
                  type: "broadcast",
                  event: "msg",
                  payload: {
                    type: "CHAPTER_VERSES_RESPONSE",
                    requestId: reqId,
                    book: command.book,
                    chapter: command.chapter,
                    verses,
                  },
                });
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
                  void get().broadcastDelta({ blackScreen: Boolean(command.value) });
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

            // Sync updated state instantly without artificial setTimeout delay
            void get().broadcastSyncState();
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

  toggleDeviceEnabled: async (deviceId: string, enabled: boolean) => {
    const s = get().session;
    const ch = get().channel;
    if (!s) return;

    const updated = s.connectedDevices.map((d) =>
      d.id === deviceId ? { ...d, enabled } : d,
    );
    set({ session: { ...s, connectedDevices: updated } });

    // Inform the specific mobile client about its permission status
    if (ch) {
      try {
        await ch.send({
          type: "broadcast",
          event: "msg",
          payload: {
            type: "DEVICE_PERMISSION_STATUS",
            deviceId,
            clientId: deviceId,
            enabled,
          },
        });
      } catch (err) {
        logger.warn("Failed to send DEVICE_PERMISSION_STATUS", err);
      }
    }

    toast.info(enabled ? "Device enabled for projection" : "Device disabled from projection");
  },

  disconnectDevice: async (deviceId: string) => {
    const s = get().session;
    const ch = get().channel;
    if (!s) return;

    const deviceToDisconnect = s.connectedDevices.find((d) => d.id === deviceId);
    const updated = s.connectedDevices.filter((d) => d.id !== deviceId);
    set({ session: { ...s, connectedDevices: updated } });

    // Send disconnect notification to client
    if (ch) {
      try {
        await ch.send({
          type: "broadcast",
          event: "msg",
          payload: {
            type: "DEVICE_DISCONNECTED",
            deviceId,
            clientId: deviceId,
            reason: "Disconnected by host",
          },
        });
      } catch (err) {
        logger.warn("Failed to send DEVICE_DISCONNECTED", err);
      }
    }

    toast.info(`Disconnected ${deviceToDisconnect?.name || "device"}`);
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

  // Load media items from Dexie (lightweight metadata for fast sync)
  let mediaList: RemoteHostSyncState["mediaList"] = [];
  const mediaThumbnails: Record<string, string> = {};
  try {
    const records = await db().media.orderBy("createdAt").reverse().limit(60).toArray();
    mediaList = records.map((m) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      durationMs: m.durationMs,
    }));

    // Include pre-cached thumbnails in initial sync for immediate render
    for (const m of records.slice(0, 10)) {
      const blobId = m.thumbBlobId ?? m.blobId;
      if (blobId && thumbDataCache.has(blobId)) {
        mediaThumbnails[m.id] = thumbDataCache.get(blobId)!;
      }
    }
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
    selectedSongId: ws.selectedSongId,
    selectedTextId: ws.selectedTextId,
    currentLive,
    blackScreen: Boolean(projState?.black),
    recentHistory,
    mediaList,
    mediaThumbnails,
    textList,
  };
}

// ── Workspace State Subscriptions (Laptop User -> Mobile Remote) ───────────────

if (typeof window !== "undefined") {
  let prevSelectedSongId = useWorkspace.getState().selectedSongId;
  let prevActiveTab = useWorkspace.getState().activeTab;

  useWorkspace.subscribe((state) => {
    if (isApplyingRemoteSync) return;
    const { session, channel, broadcastDelta } = useHostRemote.getState();
    if (!session || !channel) return;

    // Active tab changed on laptop -> broadcast to remotes
    if (state.activeTab !== prevActiveTab) {
      prevActiveTab = state.activeTab;
      const remoteTab = mapLaptopToRemoteTab(state.activeTab);
      void broadcastDelta({ activeTab: remoteTab });
    }

    // Selected song changed on laptop (shared song context for remote browsing)
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
