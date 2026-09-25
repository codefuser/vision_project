/**
 * Remote Desktop Controller Store (Zustand)
 * Manages the CONTROLLER machine's connection to the HOST, WebRTC media reception,
 * input dispatching over RTCDataChannel, quality adjustment, screen state detection,
 * and comprehensive diagnostic telemetry.
 */

import { create } from "zustand";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { WebRTCSignalingManager } from "../services/webrtc-signaling";
import type {
  ControllerConnectionStatus,
  HostScreenState,
  QualityPreset,
  RemoteDesktopInputEvent,
  RemoteDesktopMetrics,
  WebRTCDiagnostics,
  ZoomLevel,
} from "../types";

interface ControllerState {
  status: ControllerConnectionStatus;
  sessionId: string;
  pin: string;
  controllerName: string;
  remoteStream: MediaStream | null;
  hostScreenState: HostScreenState | null;
  metrics: RemoteDesktopMetrics | null;
  diagnostics: WebRTCDiagnostics | null;
  connectionState: RTCPeerConnectionState | "disconnected";
  iceConnectionState: RTCIceConnectionState | "disconnected";
  quality: QualityPreset;
  zoom: ZoomLevel;
  inputEnabled: boolean;
  isFullscreen: boolean;
  errorMessage: string | null;
  lastPingMs: number;

  // Actions
  setControllerName: (name: string) => void;
  setZoom: (zoom: ZoomLevel) => void;
  setQuality: (quality: QualityPreset) => void;
  toggleInputEnabled: () => void;
  setIsFullscreen: (full: boolean) => void;
  connect: (sessionId: string, pin: string, name?: string) => Promise<boolean>;
  retryConnection: () => Promise<boolean>;
  requestScreenShare: () => Promise<void>;
  sendInput: (event: RemoteDesktopInputEvent) => boolean;
  disconnect: () => Promise<void>;
}

let signaling: WebRTCSignalingManager | null = null;
const controllerId = `ctrl_${Math.random().toString(36).substring(2, 9)}`;

export const useControllerRemoteDesktop = create<ControllerState>((set, get) => ({
  status: "disconnected",
  sessionId: "",
  pin: "",
  controllerName:
    typeof window !== "undefined"
      ? localStorage.getItem("vp_rd_controller_name") || "Controller Laptop"
      : "Controller Laptop",
  remoteStream: null,
  hostScreenState: null,
  metrics: null,
  diagnostics: null,
  connectionState: "disconnected",
  iceConnectionState: "disconnected",
  quality: "auto",
  zoom: "fit",
  inputEnabled: true,
  isFullscreen: false,
  errorMessage: null,
  lastPingMs: 0,

  setControllerName: (name: string) => {
    const clean = name.trim();
    if (typeof window !== "undefined") {
      localStorage.setItem("vp_rd_controller_name", clean);
    }
    set({ controllerName: clean });
  },

  setZoom: (zoom: ZoomLevel) => set({ zoom }),

  setQuality: (quality: QualityPreset) => {
    set({ quality });
    if (signaling) {
      void signaling.setQualityPreset(quality);
      signaling.sendInput({
        type: "QUALITY_CHANGE",
        quality,
      });
    }
  },

  toggleInputEnabled: () => {
    const next = !get().inputEnabled;
    set({ inputEnabled: next });
    toast.info(next ? "Remote Control Input Active" : "View-Only Mode Active (Input Muted)");
  },

  setIsFullscreen: (full: boolean) => set({ isFullscreen: full }),

  connect: async (sessionId: string, pin: string, name?: string) => {
    const cleanSessionId = sessionId.trim().toUpperCase();
    const cleanPin = pin.trim();
    const effectiveName = (name || get().controllerName || "Controller Laptop").trim();

    if (!cleanSessionId || !cleanPin) {
      toast.error("Please enter a valid Session ID and PIN code.");
      return false;
    }

    set({
      status: "connecting",
      sessionId: cleanSessionId,
      pin: cleanPin,
      controllerName: effectiveName,
      errorMessage: null,
      remoteStream: null,
      hostScreenState: null,
      diagnostics: null,
      connectionState: "connecting",
      iceConnectionState: "new",
    });

    if (signaling) {
      await signaling.destroy();
      signaling = null;
    }

    signaling = new WebRTCSignalingManager("controller", controllerId);

    // Track stream arrival
    signaling.onRemoteStream = (stream) => {
      logger.info("Controller received live remote media stream");
      set({
        remoteStream: stream,
        status: "connected",
        hostScreenState: { active: true },
      });
      toast.success("Connected to Host Desktop!");
    };

    // Track metrics
    signaling.onMetricsUpdate = (metrics) => {
      set({ metrics, lastPingMs: metrics.rtt });
    };

    // Track live connection diagnostics
    signaling.onDiagnosticsUpdate = (diagnostics) => {
      set({
        diagnostics,
        connectionState: diagnostics.connectionState,
        iceConnectionState: diagnostics.iceConnectionState,
      });
    };

    signaling.onConnectionStateChange = (state) => {
      set({ connectionState: state });
      if (state === "failed") {
        set({
          errorMessage: "WebRTC connection failed. Check network or retry.",
        });
      }
    };

    signaling.onIceConnectionStateChange = (state) => {
      set({ iceConnectionState: state });
    };

    signaling.onTrackEnded = (track) => {
      if (track.kind === "video") {
        logger.info("Remote video track ended from host");
        set({
          hostScreenState: {
            active: false,
            reason: "Host stopped screen sharing.",
          },
        });
        toast.info("Host stopped screen sharing.");
      }
    };

    // Track incoming signals
    signaling.onSignalingMessage = (msg) => {
      if (msg.type === "PAIRING_APPROVAL") {
        if (msg.payload.accepted) {
          logger.info("Host approved connection request!");
          set({ status: "connected" });
          toast.success("Host approved connection! Starting stream...");
        } else {
          const reason = msg.payload.reason || "Connection request rejected by host.";
          logger.warn("Host rejected connection", reason);
          set({
            status: "error",
            errorMessage: reason,
          });
          toast.error(reason);
          void get().disconnect();
        }
      } else if (msg.type === "HOST_SCREEN_STATE") {
        set({ hostScreenState: msg.payload });
        if (msg.payload.active === false && msg.payload.reason) {
          toast.info(msg.payload.reason);
        }
      } else if (msg.type === "SESSION_TERMINATED") {
        const reason = msg.payload?.reason || "Host terminated the session.";
        toast.info(reason);
        set({
          status: "disconnected",
          remoteStream: null,
          errorMessage: reason,
        });
        void get().disconnect();
      }
    };

    try {
      await signaling.subscribeToSession(cleanSessionId);

      // Send pairing request
      set({ status: "waiting_approval" });
      await signaling.sendSignal("PAIRING_REQUEST", {
        pin: cleanPin,
        controllerId,
        controllerName: effectiveName,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Web Controller",
        timestamp: Date.now(),
      });

      return true;
    } catch (err: any) {
      logger.error("Controller connection failed", err);
      set({
        status: "error",
        errorMessage: err.message || "Failed to connect to session",
      });
      toast.error("Failed to connect to host session.");
      return false;
    }
  },

  retryConnection: async () => {
    const { sessionId, pin, controllerName } = get();
    if (!sessionId || !pin) return false;
    toast.info("Retrying connection to Host...");
    return get().connect(sessionId, pin, controllerName);
  },

  requestScreenShare: async () => {
    if (signaling) {
      await signaling.sendSignal("REQUEST_SCREEN_SHARE", {
        requestedAt: Date.now(),
      });
      toast.info("Requested Host to start/resume screen sharing.");
    }
  },

  sendInput: (event: RemoteDesktopInputEvent): boolean => {
    if (!get().inputEnabled || get().status !== "connected" || !signaling) {
      return false;
    }

    return signaling.sendInput(event);
  },

  disconnect: async () => {
    if (signaling) {
      try {
        await signaling.sendSignal("SESSION_TERMINATED", {
          reason: "Controller disconnected.",
        });
        await signaling.destroy();
      } catch (e) {
        logger.warn("Error destroying controller signaling", e);
      }
      signaling = null;
    }

    set({
      status: "disconnected",
      remoteStream: null,
      hostScreenState: null,
      metrics: null,
      diagnostics: null,
      connectionState: "disconnected",
      iceConnectionState: "disconnected",
    });
  },
}));
