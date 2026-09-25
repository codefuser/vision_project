/**
 * Remote Desktop Host Store (Zustand)
 * Manages the HOST machine's session lifecycle, screen capture via getDisplayMedia(),
 * controller connection authorization requests, WebRTC streaming, and native agent input dispatching.
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

interface HostState {
  session: RemoteDesktopSession | null;
  mediaStream: MediaStream | null;
  pendingRequest: ControllerConnectionRequest | null;
  nativeAgent: NativeAgentStatus;
  metrics: RemoteDesktopMetrics | null;
  controlEnabled: boolean;
  isInitializing: boolean;
  virtualCursor: { u: number; v: number; visible: boolean; lastMoved: number } | null;

  // Actions
  createSession: (customPin?: string) => Promise<RemoteDesktopSession | null>;
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

  createSession: async (customPin?: string) => {
    if (get().session && get().mediaStream) {
      return get().session;
    }

    set({ isInitializing: true });

    let stream: MediaStream;
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
        toast.error("Screen capture is not supported in this browser environment.");
        set({ isInitializing: false });
        return null;
      }

      // Request entire monitor capture for full desktop streaming
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
          frameRate: { ideal: 60, max: 60 },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: true,
      });
    } catch (err: any) {
      logger.warn("Host screen capture cancelled or failed", err);
      toast.error(
        err.name === "NotAllowedError"
          ? "Screen capture permission was denied."
          : "Failed to capture screen: " + (err.message || "Unknown error"),
      );
      set({ isInitializing: false });
      return null;
    }

    // Auto-teardown when the operator clicks the browser's native "Stop sharing" floating bar
    stream.getVideoTracks()[0]?.addEventListener("ended", () => {
      logger.info("Host browser screen capture stopped by user");
      void get().terminateSession("Host screen sharing was stopped.");
    });

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

    signaling.onMetricsUpdate = (metrics) => {
      set({ metrics });
    };

    // Subscribe to Supabase channel
    await signaling.subscribeToSession(sessionId);

    // Auto-connect native agent
    get().initNativeAgent();

    set({
      session: newSession,
      mediaStream: stream,
      isInitializing: false,
    });

    toast.success(`Remote Session Created: ${sessionId}`);
    return newSession;
  },

  approveRequest: async () => {
    const { pendingRequest, session, mediaStream } = get();
    if (!pendingRequest || !session || !mediaStream || !signaling) return;

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
