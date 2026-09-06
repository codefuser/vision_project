/**
 * Host (Laptop) Remote Control Store.
 * Manages active session lifecycle, Supabase Realtime channel,
 * phone authentication verification, and command execution into existing projection adapters.
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
import { projectVerse } from "@/projection/adapters/bible.adapter";
import { projectVerseAt } from "@/lib/bible/project-ref";
import { projectSongSlide } from "@/projection/adapters/song.adapter";
import { projectMediaById } from "@/projection/adapters/media.adapter";
import { projectTextSlide } from "@/projection/adapters/text.adapter";
import type {
  RemoteBroadcastMessage,
  RemoteDevice,
  RemoteHostSyncState,
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
}

export const useHostRemote = create<HostRemoteState>((set, get) => ({
  session: null,
  isDialogOpen: false,
  channel: null,
  tokens: new Set<string>(),

  setDialogOpen: (open) => set({ isDialogOpen: open }),

  startSession: async (customPassword?: string) => {
    // If a session already exists and is active, return it
    const existing = get().session;
    if (existing && get().channel) {
      return existing;
    }

    const sessionId = generateRandomId("vp", 6);
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
      await supabase.removeChannel(prevChannel);
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

            // Record connected device
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

            // Prepare initial state sync
            const syncState = await buildSyncState();

            // Send success response back to phone
            await channel.send({
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
          } else {
            logger.warn("Remote auth failed: incorrect password proof");
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
          }
          break;
        }

        case "COMMAND": {
          const { sessionToken, command, clientId } = msg;
          if (!get().tokens.has(sessionToken)) {
            logger.warn("Remote command rejected: invalid or expired session token", clientId);
            return;
          }

          // Update device heartbeat
          const curSess = get().session;
          if (curSess) {
            const updated = curSess.connectedDevices.map((d) =>
              d.id === clientId ? { ...d, lastSeenAt: Date.now() } : d,
            );
            set({ session: { ...curSess, connectedDevices: updated } });
          }

          // Execute command via existing adapters
          try {
            switch (command.action) {
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
            }

            // Sync updated state to all connected remotes
            setTimeout(() => {
              void get().broadcastSyncState();
            }, 50);
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
    const passwordHash = await sha256(`${clean}::${s.salt}::${s.sessionId}`);
    set({
      session: {
        ...s,
        passwordPlain: clean,
        passwordHash,
      },
      tokens: new Set(), // Invalidate previous client tokens
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
}));

/**
 * Builds the current projection and library snapshot to sync with remotes.
 */
async function buildSyncState(): Promise<RemoteHostSyncState> {
  const cur = projectionEngine.getCurrent();
  const projState = useProjection.getState().state;

  let currentLive: RemoteHostSyncState["currentLive"] = null;
  if (cur) {
    currentLive = {
      title: cur.title,
      type: cur.type,
      details:
        cur.type === "bible_verse"
          ? (cur.body as any)?.text
          : cur.type === "song_slide"
            ? (cur.body as any)?.lines?.join("\n")
            : undefined,
    };
  }

  // Load media items from Dexie
  let mediaList: RemoteHostSyncState["mediaList"] = [];
  try {
    const records = await db().media.orderBy("createdAt").reverse().limit(100).toArray();
    mediaList = records.map((m) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      durationMs: m.durationMs,
    }));
  } catch (err) {
    logger.warn("Failed to load media for remote sync", err);
  }

  // Load text items from store
  const textItems = useTextItems.getState().items;
  const textList = textItems.slice(0, 50).map((t) => ({
    id: t.id,
    title: t.title,
    content: t.content,
  }));

  return {
    currentLive,
    blackScreen: Boolean(projState?.black),
    mediaList,
    textList,
  };
}

// Hook into projection engine events to auto-sync state when projector changes
if (typeof window !== "undefined") {
  projectionEngine.onAny(() => {
    const { session, channel } = useHostRemote.getState();
    if (session && channel) {
      void useHostRemote.getState().broadcastSyncState();
    }
  });
}
