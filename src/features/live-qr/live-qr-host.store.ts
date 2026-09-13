/**
 * Host (Laptop Operator) Live Projection QR Store.
 * Manages fixed public token lifecycle, duration/expiration, Supabase Realtime channel,
 * presence tracking, and authoritative live projection broadcasts.
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
import { projectionEvents } from "@/projection/event-bus";
import { projectionHistory } from "@/projection/history";
import { useProjection } from "@/stores/projection.store";
import type { ProjectionContent } from "@/projection/content.types";
import type {
  LiveQrHostSession,
  LiveProjectionPayload,
  LiveQrBroadcastMessage,
} from "./types";
import { LIVE_QR_STORAGE_KEY } from "./types";
import { useTextFormat } from "@/lib/text-format/store";
import { useLogo } from "@/stores/logo.store";
import { useSettings } from "@/stores/settings.store";
import type { TextOverlay } from "@/lib/broadcast";
import type { ProjectionScaling } from "@/db/schema";

const CHANNEL_PREFIX = "vp_live_";

// In-memory cache for the most recent projection content emitted by any adapter
let latestEmittedContent: ProjectionContent | null = null;

// Image preview cache (in-memory data URLs)
const liveThumbCache = new Map<string, string>();

async function getOptimizedMediaDataUrl(blobId?: string | null): Promise<string | undefined> {
  if (!blobId) return undefined;
  if (liveThumbCache.has(blobId)) return liveThumbCache.get(blobId);

  try {
    const rec = await db().blobs.get(blobId);
    if (!rec?.blob) return undefined;

    // Small images (<= 25KB): encode directly without transcoding
    if (rec.blob.size <= 25 * 1024 && rec.blob.type.startsWith("image/")) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result) liveThumbCache.set(blobId, result);
          resolve(result);
        };
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(rec.blob);
      });
    }

    // High-resolution image/thumb: render to compact 640px JPEG canvas (<25KB payload)
    if (typeof window !== "undefined") {
      return new Promise((resolve) => {
        const url = URL.createObjectURL(rec.blob);
        const img = new Image();
        img.onload = () => {
          try {
            const maxDim = 1280;
            let w = img.naturalWidth || img.width || 1280;
            let h = img.naturalHeight || img.height || 720;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, w);
            canvas.height = Math.max(1, h);
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              URL.revokeObjectURL(url);
              resolve(undefined);
              return;
            }
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, w, h);
            URL.revokeObjectURL(url);

            const result = canvas.toDataURL("image/jpeg", 0.82);
            liveThumbCache.set(blobId, result);
            resolve(result);
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

    // Fallback reader
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result && result.length < 150000) {
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

const getMediaDataUrl = getOptimizedMediaDataUrl;

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

export function isEligibleHostEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  const p = window.location.pathname;
  if (p.startsWith("/live") || p.startsWith("/remote")) return false;
  if (window.opener && window.name === "church-projector") return false;
  return true;
}

function loadSavedSession(): LiveQrHostSession | null {
  if (!isEligibleHostEnvironment()) return null;
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

/**
 * Resolves authoritative live projection payload using multiple fallbacks:
 * 1. projectionEngine.getCurrent()
 * 2. latestEmittedContent (from CONTENT_PROJECTED event bus)
 * 3. useProjection.getState().state (textOverlay and currentMediaId)
 * 4. projectionHistory.list()[0]
 */
async function resolveCurrentLivePayload(): Promise<LiveProjectionPayload> {
  const projState = useProjection.getState().state;
  const cur =
    projState?.textOverlay && latestEmittedContent
      ? latestEmittedContent
      : projectionEngine.getCurrent() || latestEmittedContent;
  const blackScreen = Boolean(projState?.black);

  const textFormat = useTextFormat.getState();
  const effectiveGroups = projState?.groupedStyles ?? textFormat.groups;
  const effectiveStyle = projState?.textStyle ?? textFormat.style;
  const logoState = useLogo.getState();
  const effectiveLogo = projState?.logo ?? {
    enabled: logoState.enabled,
    current: logoState.current,
    settings: logoState.settings,
  };
  const effectiveScaling =
    projState?.projectionScaling ??
    (useSettings.getState().settings.projectionScaling as ProjectionScaling) ??
    "auto";

  // Sanitize logo to ensure payload does not breach Supabase Realtime 256KB limits
  const sanitizedLogo = effectiveLogo
    ? {
        enabled: effectiveLogo.enabled,
        settings: effectiveLogo.settings,
        current: effectiveLogo.current
          ? {
              id: effectiveLogo.current.id,
              name: effectiveLogo.current.name,
              dataUrl:
                effectiveLogo.current.dataUrl?.startsWith("data:") &&
                effectiveLogo.current.dataUrl.length > 30000
                  ? ""
                  : effectiveLogo.current.dataUrl,
            }
          : null,
      }
    : null;

  // ── Source 1: Universal ProjectionContent (Engine / Adapter authoritative state) ──
  if (cur) {
    const basePayload: Partial<LiveProjectionPayload> = {
      isLive: true,
      title: cur.title || "Live Presentation",
      type: cur.type,
      textStyle: effectiveStyle,
      groupedStyles: effectiveGroups,
      logo: sanitizedLogo,
      scalingMode: effectiveScaling,
      blackScreen,
      updatedAt: Date.now(),
    };

    switch (cur.type) {
      case "image": {
        const body = cur.body as any;
        let imageDataUrl: string | undefined;

        if (body?.blobId) {
          imageDataUrl = await getOptimizedMediaDataUrl(body.blobId);
        }
        if (!imageDataUrl && body?.mediaId) {
          const mediaItem = await db().media.get(body.mediaId);
          if (mediaItem?.blobId) {
            imageDataUrl = await getOptimizedMediaDataUrl(mediaItem.blobId);
          }
          if (!imageDataUrl && mediaItem?.thumbBlobId) {
            imageDataUrl = await getOptimizedMediaDataUrl(mediaItem.thumbBlobId);
          }
        }

        return {
          ...basePayload,
          isLive: true,
          title: cur.title || "Image Projection",
          type: "image",
          mediaType: "image",
          imageDataUrl,
          mediaUrl: imageDataUrl,
          textOverlay: null,
          blackScreen,
          updatedAt: Date.now(),
        };
      }

      case "video": {
        const body = cur.body as any;
        let posterDataUrl: string | undefined;

        if (body?.blobId) {
          posterDataUrl = await getOptimizedMediaDataUrl(body.blobId);
        }
        if (!posterDataUrl && body?.mediaId) {
          const mediaItem = await db().media.get(body.mediaId);
          if (mediaItem?.thumbBlobId) {
            posterDataUrl = await getOptimizedMediaDataUrl(mediaItem.thumbBlobId);
          } else if (mediaItem?.blobId) {
            posterDataUrl = await getOptimizedMediaDataUrl(mediaItem.blobId);
          }
        }

        return {
          ...basePayload,
          isLive: true,
          title: cur.title || "Video Projection",
          type: "video",
          mediaType: "video",
          imageDataUrl: posterDataUrl,
          mediaUrl: posterDataUrl,
          textOverlay: null,
          blackScreen,
          updatedAt: Date.now(),
        };
      }

      case "live_text":
      case "announcement":
      case "sermon_point": {
        const body = cur.body as any;
        const meta = cur.metadata as any;
        const rawText = body?.text || body?.heading || cur.title || "";
        const lines = rawText ? rawText.split("\n") : [];
        const slideIdx =
          typeof body?.slideIndex === "number"
            ? body.slideIndex + 1
            : typeof meta?.slideIndex === "number"
              ? meta.slideIndex + 1
              : undefined;
        const totalSlides =
          typeof meta?.totalSlides === "number" ? meta.totalSlides : undefined;
        const cleanTitle =
          meta?.title ||
          cur.title?.replace(/\s*\(slide\s*\d+(\/\d+)?\)$/i, "") ||
          "Announcement";

        const overlay: TextOverlay = {
          reference: cleanTitle,
          referenceTa: cleanTitle,
          referenceEn: cleanTitle,
          text: rawText,
          textTa: rawText,
          textEn: rawText,
          mode: "both",
          kind: "live_text",
        };

        return {
          ...basePayload,
          isLive: true,
          title: cur.title || cleanTitle,
          type: "live_text",
          reference: cleanTitle,
          verseText: rawText,
          textContent: rawText,
          lines,
          slideIndex: slideIdx,
          totalSlides,
          textOverlay: overlay,
          mediaUrl: null,
          imageDataUrl: null,
          mediaType: null,
          blackScreen,
          updatedAt: Date.now(),
        };
      }

      case "song_slide": {
        const body = cur.body as any;
        const meta = cur.metadata as any;
        const lines = Array.isArray(body?.lines)
          ? body.lines
          : typeof body?.text === "string"
            ? body.text.split("\n")
            : [];
        const joinedText = lines.join("\n");
        const songTitle =
          cur.title?.replace(/\s*\(slide\s*\d+\)$/i, "") || "Song Lyrics";
        const slideIdx =
          typeof body?.slideIndex === "number"
            ? body.slideIndex + 1
            : typeof meta?.slideIndex === "number"
              ? meta.slideIndex + 1
              : undefined;
        const totalSlides =
          typeof meta?.totalSlides === "number" ? meta.totalSlides : undefined;

        const overlay: TextOverlay = projState?.textOverlay ?? {
          reference: "",
          referenceEn: "",
          referenceTa: "",
          text: joinedText,
          textEn: "",
          textTa: joinedText,
          translation: "",
          mode: "ta",
          kind: "song_slide",
        };

        return {
          ...basePayload,
          isLive: true,
          title: cur.title,
          type: "song_slide",
          songTitle,
          reference: songTitle,
          verseText: joinedText,
          textContent: joinedText,
          slideIndex: slideIdx,
          totalSlides,
          lines,
          textOverlay: overlay,
          mediaUrl: null,
          imageDataUrl: null,
          mediaType: null,
          blackScreen,
          updatedAt: Date.now(),
        };
      }

      case "bible_verse": {
        const body = cur.body as any;
        const rawText = body?.text || "";
        const overlay: TextOverlay = projState?.textOverlay ?? {
          reference: body?.reference || cur.title,
          text: rawText,
          translation: body?.translation || "Bible",
          subtext: body?.subtext,
          subtranslation: body?.subtranslation,
          referenceEn: body?.referenceEn,
          referenceTa: body?.referenceTa,
          textEn: body?.textEn,
          textTa: body?.textTa,
          mode: body?.mode,
          kind: "bible_verse",
        };

        return {
          ...basePayload,
          isLive: true,
          title: cur.title,
          type: "bible_verse",
          reference: body?.reference || cur.title,
          verseText: rawText,
          textContent: rawText,
          translation: body?.translation || "Bible",
          textOverlay: overlay,
          mediaUrl: null,
          imageDataUrl: null,
          mediaType: null,
          blackScreen,
          updatedAt: Date.now(),
        };
      }

      default: {
        return {
          ...basePayload,
          isLive: true,
          title: cur.title,
          type: cur.type,
          mediaUrl: null,
          imageDataUrl: null,
          blackScreen,
          updatedAt: Date.now(),
        };
      }
    }
  }

  // ── Source 2: Active textOverlay from useProjection state (fallback) ──
  if (
    projState?.textOverlay &&
    (projState.textOverlay.text ||
      projState.textOverlay.textTa ||
      projState.textOverlay.textEn ||
      projState.textOverlay.reference)
  ) {
    const ov = projState.textOverlay;
    const isSong = ov.kind === "song_slide";
    const isBible = ov.kind === "bible_verse";
    const rawText = ov.text || ov.textTa || ov.textEn || "";
    const lines = rawText ? rawText.split("\n") : [];

    return {
      isLive: true,
      title: ov.reference || (isSong ? "Song Lyrics" : isBible ? "Bible Verse" : "Text"),
      type: isSong ? "song_slide" : isBible ? "bible_verse" : "live_text",
      reference: ov.reference,
      verseText: rawText,
      translation: ov.translation || "Bible",
      songTitle: ov.reference || "Song",
      lines,
      textContent: rawText,
      textOverlay: ov,
      textStyle: effectiveStyle,
      groupedStyles: effectiveGroups,
      logo: sanitizedLogo,
      scalingMode: effectiveScaling,
      mediaUrl: null,
      imageDataUrl: null,
      mediaType: null,
      blackScreen,
      updatedAt: Date.now(),
    };
  }

  // ── Source 3: Active currentMediaId from useProjection ──
  if (projState?.currentMediaId) {
    const media = await db().media.get(projState.currentMediaId);
    if (media) {
      let imageDataUrl: string | undefined;
      // Prioritize full quality original blobId!
      if (media.blobId) {
        imageDataUrl = await getOptimizedMediaDataUrl(media.blobId);
      }
      if (!imageDataUrl && media.thumbBlobId) {
        imageDataUrl = await getOptimizedMediaDataUrl(media.thumbBlobId);
      }

      return {
        isLive: true,
        title: media.name,
        type: media.type === "video" ? "video" : "image",
        mediaType: media.type === "video" ? "video" : "image",
        imageDataUrl,
        mediaUrl: imageDataUrl,
        mediaId: media.id,
        textOverlay: null,
        textStyle: effectiveStyle,
        groupedStyles: effectiveGroups,
        logo: effectiveLogo,
        scalingMode: effectiveScaling,
        blackScreen,
        updatedAt: Date.now(),
      };
    }
  }

  // ── Source 4: Idle / No Projection ──
  return {
    isLive: false,
    title: "No Active Projection",
    type: "none",
    textOverlay: null,
    textStyle: effectiveStyle,
    groupedStyles: effectiveGroups,
    logo: effectiveLogo,
    scalingMode: effectiveScaling,
    blackScreen,
    updatedAt: Date.now(),
  };
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

    // Setup Supabase Realtime channel with both broadcast and presence support
    const channelName = `${CHANNEL_PREFIX}${token}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: "host" },
      },
    });

    // Update store state FIRST so get().channel and get().session are valid immediately
    set({
      session: newSession,
      channel,
      isExpired: false,
      remainingTime: formatRemainingTime(expiresAt),
    });

    // Listen for new viewer join requests to instantly reply
    channel.on("broadcast", { event: "msg" }, async (payload) => {
      const msg = payload.payload as LiveQrBroadcastMessage;
      if (!msg) return;

      if (msg.type === "REQUEST_CURRENT_STATE") {
        await get().broadcastCurrentLive();
      }
    });

    // Also listen on local BroadcastChannel for instant same-browser viewer requests
    try {
      const localReqBc = new BroadcastChannel(`vp_live_req_${token}`);
      localReqBc.onmessage = async (ev) => {
        if (ev.data?.type === "REQUEST_CURRENT_STATE") {
          await get().broadcastCurrentLive();
        }
      };
    } catch {}

    channel.subscribe(async (status) => {
      logger.info(`Live QR Host Channel [${channelName}] status: ${status}`);
      if (status === "SUBSCRIBED") {
        await get().broadcastCurrentLive();
      }
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
      const payload = await resolveCurrentLivePayload();

      // 1. Broadcast event for connected viewers over Supabase Realtime
      await channel.send({
        type: "broadcast",
        event: "msg",
        payload: {
          type: "LIVE_PROJECTION_UPDATE",
          token: session.token,
          payload,
        },
      });

      // 2. Also broadcast over local BroadcastChannel for zero-latency local tab sync
      try {
        const localBc = new BroadcastChannel(`vp_live_local_${session.token}`);
        localBc.postMessage({
          type: "LIVE_PROJECTION_UPDATE",
          token: session.token,
          payload,
        });
        localBc.close();
      } catch {}

      // 3. Track presence so newly connecting viewers receive current projection instantly on join!
      // Keep presence state lightweight by omitting heavy media data URLs and large logos
      const presenceState: Partial<LiveProjectionPayload> = {
        isLive: payload.isLive,
        title: payload.title,
        type: payload.type,
        reference: payload.reference,
        verseText: payload.verseText,
        translation: payload.translation,
        songTitle: payload.songTitle,
        slideIndex: payload.slideIndex,
        totalSlides: payload.totalSlides,
        lines: payload.lines,
        textContent: payload.textContent,
        mediaType: payload.mediaType,
        mediaUrl:
          payload.mediaUrl && payload.mediaUrl.length <= 35000
            ? payload.mediaUrl
            : undefined,
        imageDataUrl:
          payload.imageDataUrl && payload.imageDataUrl.length <= 35000
            ? payload.imageDataUrl
            : undefined,
        textOverlay: payload.textOverlay,
        textStyle: payload.textStyle,
        groupedStyles: payload.groupedStyles,
        scalingMode: payload.scalingMode,
        blackScreen: payload.blackScreen,
        updatedAt: payload.updatedAt,
      };

      // Strip large dataUrls from presence logo
      if (payload.logo) {
        presenceState.logo = {
          enabled: payload.logo.enabled,
          settings: payload.logo.settings,
          current: payload.logo.current
            ? {
                id: payload.logo.current.id,
                name: payload.logo.current.name,
                dataUrl:
                  payload.logo.current.dataUrl?.startsWith("data:") &&
                  payload.logo.current.dataUrl.length > 5000
                    ? ""
                    : payload.logo.current.dataUrl,
              }
            : null,
        };
      }

      // Only track presence if channel is joined/subscribed
      const isSubscribed =
        channel.state === "joined" || (channel as any).subState === "joined";
      if (isSubscribed) {
        await channel.track({
          role: "host",
          liveState: presenceState,
          token: session.token,
          updatedAt: Date.now(),
        }).catch((e) => logger.warn("Host track presence error", e));
      }
    } catch (err) {
      logger.warn("Failed to broadcast live projection to viewers", err);
    }
  },
}));

// ── Background Auto-Resume & Realtime Projection Listeners ────────────────────

let broadcastDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastBroadcastTimestamp = 0;

export function triggerHostLiveBroadcast() {
  const { session } = useHostLiveQr.getState();
  if (!session || !session.active || Date.now() >= session.expiresAt) return;

  if (broadcastDebounceTimer) {
    clearTimeout(broadcastDebounceTimer);
    broadcastDebounceTimer = null;
  }

  const now = Date.now();
  if (now - lastBroadcastTimestamp > 60) {
    lastBroadcastTimestamp = now;
    void useHostLiveQr.getState().broadcastCurrentLive();
  } else {
    broadcastDebounceTimer = setTimeout(() => {
      broadcastDebounceTimer = null;
      lastBroadcastTimestamp = Date.now();
      void useHostLiveQr.getState().broadcastCurrentLive();
    }, 25);
  }
}

if (isEligibleHostEnvironment()) {
  // 0. Cache all projection adapter events immediately into latestEmittedContent
  projectionEvents.on("CONTENT_PROJECTED", (e) => {
    latestEmittedContent = e.content;
    triggerHostLiveBroadcast();
  });

  projectionEvents.on("CONTENT_CLEARED", () => {
    latestEmittedContent = null;
    triggerHostLiveBroadcast();
  });

  // 1. Resume saved session if still valid
  const saved = loadSavedSession();
  if (saved && saved.active && saved.expiresAt > Date.now()) {
    const channelName = `${CHANNEL_PREFIX}${saved.token}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: "host" },
      },
    });

    channel.on("broadcast", { event: "msg" }, async (payload) => {
      const msg = payload.payload as LiveQrBroadcastMessage;
      if (!msg) return;

      if (msg.type === "REQUEST_CURRENT_STATE") {
        void useHostLiveQr.getState().broadcastCurrentLive();
      }
    });

    // Also listen on local BroadcastChannel for instant same-browser requests
    try {
      const localReqBc = new BroadcastChannel(`vp_live_req_${saved.token}`);
      localReqBc.onmessage = async (ev) => {
        if (ev.data?.type === "REQUEST_CURRENT_STATE") {
          void useHostLiveQr.getState().broadcastCurrentLive();
        }
      };
    } catch {}

    useHostLiveQr.setState({
      session: saved,
      channel,
      isExpired: false,
      remainingTime: formatRemainingTime(saved.expiresAt),
    });

    channel.subscribe(async (status) => {
      logger.info(`Live QR Host Channel auto-resumed [${channelName}]: ${status}`);
      if (status === "SUBSCRIBED") {
        void useHostLiveQr.getState().broadcastCurrentLive();
      }
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

  // 3. Periodic projection broadcast heartbeat (every 5 seconds while session is active)
  setInterval(() => {
    const { session, channel } = useHostLiveQr.getState();
    if (session && session.active && Date.now() < session.expiresAt && channel) {
      const isSubscribed =
        channel.state === "joined" || (channel as any).subState === "joined";
      if (isSubscribed) {
        void useHostLiveQr.getState().broadcastCurrentLive();
      }
    }
  }, 5000);

  // 4. Projection Engine listener: whenever anything is projected, broadcast automatically
  projectionEngine.onAny(() => {
    triggerHostLiveBroadcast();
  });

  // 5. Projection Store subscriber: when black screen, clear, or overlay changes, broadcast automatically
  useProjection.subscribe(() => {
    triggerHostLiveBroadcast();
  });

  // 6. Formatting Store subscriber: when fonts, colors, or themes change, mirror live instantly
  useTextFormat.subscribe(() => {
    triggerHostLiveBroadcast();
  });

  // 7. Logo Store subscriber: when logo is toggled or customized, mirror live instantly
  useLogo.subscribe(() => {
    triggerHostLiveBroadcast();
  });

  // 8. Settings Store subscriber: when scaling mode changes, mirror live instantly
  useSettings.subscribe(() => {
    triggerHostLiveBroadcast();
  });
}
