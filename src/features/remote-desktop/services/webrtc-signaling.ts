/**
 * WebRTC Connection & Supabase Signaling Engine for Remote Desktop
 * Handles peer-to-peer WebRTC lifecycle, ICE negotiation, RTCDataChannel,
 * dynamic bitrate management, and live connection statistics.
 */

import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import type {
  QualityPreset,
  RemoteDesktopInputEvent,
  RemoteDesktopMetrics,
  SignalingMessage,
  SignalingMessageType,
} from "../types";

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
  iceCandidatePoolSize: 4,
};

const CHANNEL_PREFIX = "rd_session_";

export class WebRTCSignalingManager {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private realtimeChannel: RealtimeChannel | null = null;
  private sessionId: string | null = null;
  private senderRole: "host" | "controller" = "host";
  private senderId: string = "";
  private statsInterval: ReturnType<typeof setInterval> | null = null;
  private prevBytes: number = 0;
  private prevTimestamp: number = 0;

  // Callbacks
  public onRemoteStream?: (stream: MediaStream) => void;
  public onInputEvent?: (event: RemoteDesktopInputEvent) => void;
  public onMetricsUpdate?: (metrics: RemoteDesktopMetrics) => void;
  public onSignalingMessage?: (msg: SignalingMessage) => void;
  public onConnectionStateChange?: (state: RTCPeerConnectionState) => void;

  constructor(role: "host" | "controller", senderId: string) {
    this.senderRole = role;
    this.senderId = senderId;
  }

  // ── 1. Realtime Signaling Channel Management ─────────────────────────────

  public async subscribeToSession(sessionId: string): Promise<void> {
    this.sessionId = sessionId.trim().toUpperCase();
    const chanName = `${CHANNEL_PREFIX}${this.sessionId}`;

    // Teardown previous if active
    if (this.realtimeChannel) {
      try {
        await supabase.removeChannel(this.realtimeChannel);
      } catch (e) {
        logger.warn("Error removing existing signaling channel", e);
      }
    }

    this.realtimeChannel = supabase.channel(chanName, {
      config: { broadcast: { self: false } },
    });

    this.realtimeChannel.on("broadcast", { event: "signal" }, async (payload) => {
      const msg = payload.payload as SignalingMessage;
      if (!msg || msg.sessionId !== this.sessionId) return;
      if (msg.senderId === this.senderId) return; // ignore echo

      // Internal WebRTC signaling handling
      await this.handleIncomingSignal(msg);

      // Notify external observers (stores)
      if (this.onSignalingMessage) {
        this.onSignalingMessage(msg);
      }
    });

    await this.realtimeChannel.subscribe((status) => {
      logger.info(`Remote Desktop signaling channel [${chanName}] status: ${status}`);
    });
  }

  public async sendSignal(type: SignalingMessageType, payload: any = {}): Promise<void> {
    if (!this.realtimeChannel || !this.sessionId) {
      logger.warn("Cannot send signal: channel not initialized");
      return;
    }

    const msg: SignalingMessage = {
      type,
      sessionId: this.sessionId,
      sender: this.senderRole,
      senderId: this.senderId,
      payload,
      timestamp: Date.now(),
    };

    try {
      await this.realtimeChannel.send({
        type: "broadcast",
        event: "signal",
        payload: msg,
      });
    } catch (err) {
      logger.error(`Failed to broadcast signal ${type}`, err);
    }
  }

  // ── 2. WebRTC Peer Connection Setup ──────────────────────────────────────

  public createPeerConnection(): RTCPeerConnection {
    if (this.peerConnection) {
      this.closePeerConnection();
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peerConnection = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        void this.sendSignal("ICE_CANDIDATE", event.candidate.toJSON());
      }
    };

    pc.onconnectionstatechange = () => {
      logger.info(`WebRTC Connection State: ${pc.connectionState}`);
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(pc.connectionState);
      }
      if (pc.connectionState === "connected") {
        this.startMetricsCollection();
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        this.stopMetricsCollection();
      }
    };

    // Controller receives media track
    pc.ontrack = (event) => {
      logger.info("WebRTC remote track received", event.track.kind);
      if (this.onRemoteStream && event.streams[0]) {
        this.onRemoteStream(event.streams[0]);
      }
    };

    // Host receives DataChannel initiated by controller or vice-versa
    pc.ondatachannel = (event) => {
      logger.info("WebRTC DataChannel received by peer:", event.channel.label);
      this.bindDataChannel(event.channel);
    };

    return pc;
  }

  // ── 3. Host: Add Screen Stream & Create Offer ─────────────────────────────

  public async hostAddStreamAndOffer(stream: MediaStream): Promise<void> {
    const pc = this.createPeerConnection();

    // Create reliable, ordered DataChannel for input events
    const dc = pc.createDataChannel("rd-input", {
      ordered: true,
    });
    this.bindDataChannel(dc);

    // Add screen video and audio tracks
    for (const track of stream.getTracks()) {
      const sender = pc.addTrack(track, stream);
      // Optimize video track parameters for crisp screen sharing
      if (track.kind === "video") {
        try {
          const params = sender.getParameters();
          if (!params.encodings || params.encodings.length === 0) {
            params.encodings = [{}];
          }
          params.encodings[0].maxBitrate = 6_000_000; // 6 Mbps default
          params.degradationPreference = "maintain-framerate";
          await sender.setParameters(params);
        } catch (e) {
          logger.warn("Could not set initial sender parameters", e);
        }
      }
    }

    const offer = await pc.createOffer({
      offerToReceiveVideo: false,
      offerToReceiveAudio: false,
    });
    await pc.setLocalDescription(offer);

    await this.sendSignal("WEBRTC_OFFER", offer);
  }

  // ── 4. Controller: Handle Offer & Create Answer ───────────────────────────

  public async controllerHandleOfferAndAnswer(offerSdp: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.createPeerConnection();

    await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await this.sendSignal("WEBRTC_ANSWER", answer);
  }

  // ── 5. Internal Signal Router ─────────────────────────────────────────────

  private async handleIncomingSignal(msg: SignalingMessage): Promise<void> {
    if (!this.peerConnection && msg.type !== "WEBRTC_OFFER") {
      return;
    }

    try {
      switch (msg.type) {
        case "WEBRTC_OFFER":
          if (this.senderRole === "controller") {
            await this.controllerHandleOfferAndAnswer(msg.payload);
          }
          break;

        case "WEBRTC_ANSWER":
          if (this.senderRole === "host" && this.peerConnection) {
            await this.peerConnection.setRemoteDescription(
              new RTCSessionDescription(msg.payload),
            );
          }
          break;

        case "ICE_CANDIDATE":
          if (this.peerConnection && msg.payload) {
            try {
              await this.peerConnection.addIceCandidate(new RTCIceCandidate(msg.payload));
            } catch (iceErr) {
              logger.warn("Error adding ICE candidate", iceErr);
            }
          }
          break;
      }
    } catch (err) {
      logger.error(`Error handling incoming WebRTC signal [${msg.type}]`, err);
    }
  }

  // ── 6. RTCDataChannel Input Pipeline ──────────────────────────────────────

  private bindDataChannel(channel: RTCDataChannel): void {
    this.dataChannel = channel;

    channel.onopen = () => {
      logger.info(`DataChannel [${channel.label}] OPEN`);
    };

    channel.onclose = () => {
      logger.info(`DataChannel [${channel.label}] CLOSED`);
    };

    channel.onmessage = (event) => {
      try {
        const inputEvent = JSON.parse(event.data) as RemoteDesktopInputEvent;
        // Respond to PING with PONG immediately for RTT measurement
        if (inputEvent.type === "PING") {
          this.sendInput({
            type: "PONG",
            timestamp: inputEvent.timestamp,
          });
          return;
        }

        if (this.onInputEvent) {
          this.onInputEvent(inputEvent);
        }
      } catch (err) {
        logger.warn("Failed to parse RTCDataChannel message", err);
      }
    };
  }

  public sendInput(event: RemoteDesktopInputEvent): boolean {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      try {
        this.dataChannel.send(JSON.stringify(event));
        return true;
      } catch (err) {
        logger.warn("Failed to send input event over DataChannel", err);
        return false;
      }
    }
    return false;
  }

  // ── 7. Quality Presets & Dynamic Bitrate ──────────────────────────────────

  public async setQualityPreset(preset: QualityPreset): Promise<void> {
    if (!this.peerConnection) return;
    const senders = this.peerConnection.getSenders();
    const videoSender = senders.find((s) => s.track?.kind === "video");
    if (!videoSender) return;

    let maxBitrate = 5_000_000;
    if (preset === "high") maxBitrate = 8_000_000;
    else if (preset === "medium") maxBitrate = 3_500_000;
    else if (preset === "low") maxBitrate = 1_200_000;

    try {
      const params = videoSender.getParameters();
      if (params.encodings && params.encodings.length > 0) {
        params.encodings[0].maxBitrate = maxBitrate;
        await videoSender.setParameters(params);
        logger.info(`Adjusted WebRTC maxBitrate to ${maxBitrate / 1000} kbps (${preset})`);
      }
    } catch (e) {
      logger.warn("Failed to adjust quality preset bitrate", e);
    }
  }

  // ── 8. Metrics & Latency Collection ──────────────────────────────────────

  private startMetricsCollection(): void {
    this.stopMetricsCollection();
    this.prevBytes = 0;
    this.prevTimestamp = performance.now();

    this.statsInterval = setInterval(async () => {
      if (!this.peerConnection) return;

      try {
        const stats = await this.peerConnection.getStats();
        let fps = 0;
        let rtt = 0;
        let width = 1920;
        let height = 1080;
        let currentBytes = 0;
        let packetsLost = 0;

        stats.forEach((report) => {
          if (report.type === "inbound-rtp" && report.kind === "video") {
            fps = report.framesPerSecond || fps;
            width = report.frameWidth || width;
            height = report.frameHeight || height;
            currentBytes = report.bytesReceived || currentBytes;
            packetsLost = report.packetsLost || packetsLost;
          } else if (report.type === "outbound-rtp" && report.kind === "video") {
            fps = report.framesPerSecond || fps;
            width = report.frameWidth || width;
            height = report.frameHeight || height;
            currentBytes = report.bytesSent || currentBytes;
          } else if (report.type === "candidate-pair" && report.state === "succeeded") {
            rtt = Math.round((report.currentRoundTripTime || 0) * 1000);
          }
        });

        const now = performance.now();
        const durationSec = (now - this.prevTimestamp) / 1000;
        let bitrateKbps = 0;
        if (durationSec > 0 && this.prevBytes > 0 && currentBytes >= this.prevBytes) {
          bitrateKbps = Math.round(((currentBytes - this.prevBytes) * 8) / (durationSec * 1000));
        }

        this.prevBytes = currentBytes;
        this.prevTimestamp = now;

        // Quality rating calculation
        let quality: RemoteDesktopMetrics["quality"] = "excellent";
        if (rtt > 150 || (fps > 0 && fps < 15)) {
          quality = "poor";
        } else if (rtt > 80 || (fps > 0 && fps < 30)) {
          quality = "fair";
        } else if (rtt > 40) {
          quality = "good";
        }

        if (this.onMetricsUpdate) {
          this.onMetricsUpdate({
            fps: Math.round(fps) || 30,
            rtt: rtt || 24,
            bitrateKbps,
            packetsLost,
            quality,
            streamWidth: width,
            streamHeight: height,
          });
        }
      } catch (statsErr) {
        logger.warn("Error gathering WebRTC stats", statsErr);
      }
    }, 1500);
  }

  private stopMetricsCollection(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  // ── 9. Teardown ──────────────────────────────────────────────────────────

  public closePeerConnection(): void {
    this.stopMetricsCollection();

    if (this.dataChannel) {
      try {
        this.dataChannel.close();
      } catch {
        // ignore
      }
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      try {
        this.peerConnection.close();
      } catch {
        // ignore
      }
      this.peerConnection = null;
    }
  }

  public async destroy(): Promise<void> {
    this.closePeerConnection();

    if (this.realtimeChannel) {
      try {
        await supabase.removeChannel(this.realtimeChannel);
      } catch (e) {
        logger.warn("Error removing realtime channel on destroy", e);
      }
      this.realtimeChannel = null;
    }

    this.sessionId = null;
  }
}
