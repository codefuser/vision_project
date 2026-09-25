/**
 * Remote Desktop Host Store (Zustand)
 * Manages the HOST machine's session lifecycle, screen capture via getDisplayMedia(),
 * live multi-monitor switching via replaceTrack(), controller connection authorization,
 * WebRTC streaming, and native agent input dispatching.
 */

import { create } from "zustand";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { WebRTCSignalingManager } from "../services/webrtc-signaling";
import { nativeAgentClient } from "../services/native-agent-client";
import type {
  ControllerConnectionRequest,
  ControllerInfo,
  HostSessionStatus,
  NativeAgentStatus,
  RemoteDesktopInputEvent,
  RemoteDesktopMetrics,
  RemoteDesktopSession,
  WebRTCDiagnostics,
} from "../types";

function generateSessionCode(): { sessionId: string; pin: string } {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const sessionId = `RD-${random}`;
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  return { sessionId, pin };
}

/**
 * Capture host screen with fallback for restrictive browser environments
 */
async function acquireDisplayMedia(): Promise<MediaStream> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
    throw new Error("Screen capture is not supported in this browser environment.");
  }

  try {
    // Ideal: Monitor displaySurface preference with high framerate
    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: "monitor",
        frameRate: { ideal: 60, max: 60 },
        width: { ideal: 1920, max: 3840 },
        height: { ideal: 1080, max: 2160 },
      },
      audio: true,
    });
  } catch (firstErr: any) {
    if (firstErr.name === "NotAllowedError") {
      throw firstErr; // User cancelled the screen picker
    }
    logger.warn("Ideal displayMedia constraints failed, falling back to standard video", firstErr);
    // Fallback: simple video capture without audio or monitor constraint
    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: { ideal: 30, max: 60 },
      },
      audio: false,
    });
  }
}

interface HostState {
  session: RemoteDesktopSession | null;
  mediaStream: MediaStream | null;
  pendingRequest: ControllerConnectionRequest | null;
  nativeAgent: NativeAgentStatus;
  metrics: RemoteDesktopMetrics | null;
  diagnostics: WebRTCDiagnostics | null;
  controlEnabled: boolean;
  isInitializing: boolean;
  virtualCursor: { u: number; v: number; visible: boolean; lastMoved: number } | null;

  // Actions
  createSession: (customPin?: string) => Promise<RemoteDesktopSession | null>;
  startScreenCapture: () => Promise<MediaStream | null>;
  switchScreen: () => Promise<void>;
  approveRequest: () => Promise<void>;
  rejectRequest: (reason?: string) => Promise<void>;
  terminateSession: (reason?: string) => Promise<void>;
  emergencyStop: () => Promise<void>;
  toggleControlEnabled: (enabled?: boolean) => void;
  initNativeAgent: () => void;
  authenticateNativeAgent: (token: string) => void;
}

let signaling: WebRTCSignalingManager | null = null;
const hostId = `host_${Math.random().toString(36).substring(2, 9)}`;

export const useHostRemoteDesktop = create<HostState>((set, get) => ({
  session: null,
  mediaStream: null,
  pendingRequest: null,
  nativeAgent: { connected: false },
  metrics: null,
  diagnostics: null,
  controlEnabled: true,
  isInitializing: false,
  virtualCursor: null,

  initNativeAgent: () => {
    nativeAgentClient.onStatusChange = (status) => {
      set({ nativeAgent: status });
    };
    nativeAgentClient.connect();
  },

  authenticateNativeAgent: (token: string) => {
    nativeAgentClient.authenticate(token);
  },

  startScreenCapture: async () => {
    try {
      const stream = await acquireDisplayMedia();

      // Listen to track ending (e.g. user clicks browser "Stop sharing")
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.addEventListener("ended", () => {
          logger.info("Host browser screen capture stopped by user");
          set({ mediaStream: null });
          if (signaling) {
            void signaling.sendSignal("HOST_SCREEN_STATE", {
              active: false,
              reason: "Host stopped screen sharing.",
            });
          }
          toast.info("Screen sharing paused. Click 'Resume Screen Share' to continue.");
        });
      }

      set({ mediaStream: stream });
      return stream;
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        logger.info("User cancelled screen capture picker");
        toast.info("Screen capture was not selected.");
      } else {
        logger.error("Screen capture error", err);
        toast.error("Failed to capture screen: " + (err.message || "Unknown error"));
      }
      return null;
    }
  },

  switchScreen: async () => {
    try {
      const newStream = await acquireDisplayMedia();
      const newVideoTrack = newStream.getVideoTracks()[0];
      if (!newVideoTrack) return;

      const oldStream = get().mediaStream;
      if (oldStream) {
        oldStream.getTracks().forEach((t) => t.stop());
      }

      newVideoTrack.addEventListener("ended", () => {
        logger.info("Host browser screen capture stopped by user");
        set({ mediaStream: null });
        if (signaling) {
          void signaling.sendSignal("HOST_SCREEN_STATE", {
            active: false,
            reason: "Host stopped screen sharing.",
          });
        }
        toast.info("Screen sharing paused.");
      });

      set({ mediaStream: newStream });

      if (signaling) {
        await signaling.hostReplaceVideoTrack(newVideoTrack);
        await signaling.sendSignal("HOST_SCREEN_STATE", {
          active: true,
          monitorName: newVideoTrack.label,
        });
      }

      toast.success(`Display switched: ${newVideoTrack.label || "New Screen"}`);
    } catch (err: any) {
      if (err.name !== "NotAllowedError") {
        toast.error("Could not switch screen: " + (err.message || "Unknown error"));
      }
    }
  },

  createSession: async (customPin?: string) => {
    if (get().session && get().mediaStream) {
      return get().session;
    }

    set({ isInitializing: true });

    // Acquire screen capture
    let stream = get().mediaStream;
    if (!stream || !stream.getVideoTracks().some((t) => t.readyState === "live")) {
      stream = await get().startScreenCapture();
      if (!stream) {
        set({ isInitializing: false });
        return null;
      }
    }

    const { sessionId, pin: generatedPin } = generateSessionCode();
    const pin = (customPin || generatedPin).trim();

    const newSession: RemoteDesktopSession = {
      sessionId,
      pin,
      createdAt: Date.now(),
      status: "waiting_pairing",
    };

    // Initialize signaling manager
    signaling = new WebRTCSignalingManager("host", hostId);

    // Diagnostics & Metrics
    signaling.onMetricsUpdate = (metrics) => {
      set({ metrics });
    };

    signaling.onDiagnosticsUpdate = (diagnostics) => {
      set({ diagnostics });
    };

    // Subscribe to incoming controller events
    signaling.onSignalingMessage = (msg) => {
      const curSession = get().session;
      if (!curSession || curSession.sessionId !== msg.sessionId) return;

      if (msg.type === "PAIRING_REQUEST") {
        const req = msg.payload as ControllerConnectionRequest;
        // Verify PIN
        if (msg.payload.pin !== curSession.pin) {
          logger.warn("Controller submitted invalid PIN", msg.payload);
          void signaling?.sendSignal("PAIRING_APPROVAL", {
            accepted: false,
            reason: "Invalid pairing code/PIN",
          });
          return;
        }

        // Prompt host for explicit approval
        set({ pendingRequest: req });
        toast.info(`Connection request from "${req.controllerName || "Remote Controller"}"`, {
          duration: 10000,
        });
      } else if (msg.type === "SESSION_TERMINATED") {
        toast.info("Controller disconnected from remote session.");
        void get().terminateSession("Controller disconnected.");
      } else if (msg.type === "REQUEST_SCREEN_SHARE") {
        // Controller requests host to start/resume screen share
        toast.info("Controller requested screen share.");
        void get().startScreenCapture();
      }
    };

    // Forward incoming controller input events to native agent or virtual cursor
    signaling.onInputEvent = (inputEvent: RemoteDesktopInputEvent) => {
      if (!get().controlEnabled) return;

      if (
        inputEvent.type === "MOUSE_MOVE" &&
        inputEvent.u !== undefined &&
        inputEvent.v !== undefined
      ) {
        set({
          virtualCursor: {
            u: inputEvent.u,
            v: inputEvent.v,
            visible: true,
            lastMoved: Date.now(),
          },
        });
      }

      // Forward to local native agent for real OS hardware execution
      nativeAgentClient.executeInput(inputEvent);
    };

    // Subscribe to Supabase channel
    await signaling.subscribeToSession(sessionId);

    // Auto-connect native agent
    get().initNativeAgent();

    set({
      session: newSession,
      isInitializing: false,
    });

    toast.success(`Remote Session Created: ${sessionId}`);
    return newSession;
  },

  approveRequest: async () => {
    let { pendingRequest, session, mediaStream } = get();
    if (!pendingRequest || !session || !signaling) return;

    // Ensure we have an active screen stream
    if (!mediaStream || !mediaStream.getVideoTracks().some((t) => t.readyState === "live")) {
      mediaStream = await get().startScreenCapture();
      if (!mediaStream) {
        toast.error("Cannot approve connection without selecting a screen to share.");
        return;
      }
    }

    const controllerInfo: ControllerInfo = {
      id: pendingRequest.controllerId,
      name: pendingRequest.controllerName || "Remote Controller",
      userAgent: pendingRequest.userAgent,
      connectedAt: Date.now(),
    };

    // Send positive approval
    await signaling.sendSignal("PAIRING_APPROVAL", {
      accepted: true,
      sessionId: session.sessionId,
      controllerId: pendingRequest.controllerId,
    });

    // Notify controller of host screen state
    const videoTrack = mediaStream.getVideoTracks()[0];
    await signaling.sendSignal("HOST_SCREEN_STATE", {
      active: true,
      monitorName: videoTrack?.label,
    });

    // Start WebRTC stream transmission to controller
    await signaling.hostAddStreamAndOffer(mediaStream);

    set({
      session: {
        ...session,
        status: "connected",
        connectedController: controllerInfo,
      },
      pendingRequest: null,
    });

    toast.success(`Remote Access Granted to ${controllerInfo.name}`);
  },

  rejectRequest: async (reason = "Connection rejected by host") => {
    const { pendingRequest } = get();
    if (pendingRequest && signaling) {
      await signaling.sendSignal("PAIRING_APPROVAL", {
        accepted: false,
        reason,
      });
    }
    set({ pendingRequest: null });
    toast.info("Connection request declined.");
  },

  terminateSession: async (reason = "Host ended the remote session") => {
    if (signaling) {
      try {
        await signaling.sendSignal("SESSION_TERMINATED", { reason });
        await signaling.destroy();
      } catch (e) {
        logger.warn("Error tearing down host signaling", e);
      }
      signaling = null;
    }

    const { mediaStream } = get();
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
    }

    set({
      session: null,
      mediaStream: null,
      pendingRequest: null,
      metrics: null,
      diagnostics: null,
      virtualCursor: null,
    });

    toast.info(reason);
  },

  emergencyStop: async () => {
    toast.error("EMERGENCY STOP: Severing all remote access immediately.");
    await get().terminateSession("Emergency Stop triggered by Host.");
  },

  toggleControlEnabled: (enabled) => {
    const next = enabled !== undefined ? enabled : !get().controlEnabled;
    set({ controlEnabled: next });
    toast.info(next ? "Remote input control resumed" : "Remote input control paused");
  },
}));
