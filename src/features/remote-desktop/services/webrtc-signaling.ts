/**
 * WebRTC Connection & Supabase Signaling Engine for Remote Desktop
 * Handles peer-to-peer WebRTC lifecycle, early ICE candidate queuing,
 * multi-track MediaStream binding, dynamic bitrate management,
 * live telemetry, and real-time connection diagnostics.
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
  WebRTCDiagnostics,
} from "../types";

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
  ],
  iceCandidatePoolSize: 4,
};

const CHANNEL_PREFIX = "rd_session_";

export class WebRTCSignalingManager {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private realtimeChannel: RealtimeChannel | null = null;
  private remoteMediaStream: MediaStream | null = null;
  private videoSender: RTCRtpSender | null = null;
  private sessionId: string | null = null;
  private senderRole: "host" | "controller" = "host";
  private senderId: string = "";

  // ICE candidates arriving before setRemoteDescription must be buffered
  private earlyCandidatesQueue: RTCIceCandidateInit[] = [];
  private iceCandidatesSent: number = 0;
  private iceCandidatesReceived: number = 0;
  private signalingState: "connected" | "connecting" | "disconnected" = "disconnected";

  // Metrics tracking
  private statsInterval: ReturnType<typeof setInterval> | null = null;
  private prevBytes: number = 0;
  private prevTimestamp: number = 0;
  private lastMetrics: RemoteDesktopMetrics = {
    fps: 0,
    rtt: 0,
    bitrateKbps: 0,
    packetsLost: 0,
    quality: "good",
    streamWidth: 0,
    streamHeight: 0,
  };

  // Callbacks
  public onRemoteStream?: (stream: MediaStream) => void;
  public onInputEvent?: (event: RemoteDesktopInputEvent) => void;
  public onMetricsUpdate?: (metrics: RemoteDesktopMetrics) => void;
  public onDiagnosticsUpdate?: (diagnostics: WebRTCDiagnostics) => void;
  public onSignalingMessage?: (msg: SignalingMessage) => void;
  public onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  public onIceConnectionStateChange?: (state: RTCIceConnectionState) => void;
  public onTrackEnded?: (track: MediaStreamTrack) => void;

  constructor(role: "host" | "controller", senderId: string) {
    this.senderRole = role;
    this.senderId = senderId;
  }

  // ── 1. Realtime Signaling Channel Management ─────────────────────────────

  public async subscribeToSession(sessionId: string): Promise<void> {
    this.sessionId = sessionId.trim().toUpperCase();
    const chanName = `${CHANNEL_PREFIX}${this.sessionId}`;
    this.signalingState = "connecting";
    this.emitDiagnostics();

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
      if (status === "SUBSCRIBED") {
        this.signalingState = "connected";
      } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
        this.signalingState = "disconnected";
      }
      this.emitDiagnostics();
    });
  }

  public async sendSignal(type: SignalingMessageType, payload: any = {}): Promise<void> {
    if (!this.realtimeChannel || !this.sessionId) {
      logger.warn(`Cannot send signal [${type}]: channel not initialized`);
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

    this.earlyCandidatesQueue = [];
    this.iceCandidatesSent = 0;
    this.iceCandidatesReceived = 0;

    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peerConnection = pc;

    // ICE Candidate generation
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.iceCandidatesSent++;
        void this.sendSignal("ICE_CANDIDATE", event.candidate.toJSON());
        this.emitDiagnostics();
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      logger.info(`WebRTC Connection State: ${pc.connectionState}`);
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(pc.connectionState);
      }
      this.emitDiagnostics();

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

    // ICE connection state changes (essential for diagnosing NAT/firewall punch failures)
    pc.oniceconnectionstatechange = () => {
      logger.info(`WebRTC ICE Connection State: ${pc.iceConnectionState}`);
      if (this.onIceConnectionStateChange) {
        this.onIceConnectionStateChange(pc.iceConnectionState);
      }
      this.emitDiagnostics();
    };

    // Controller receives media track
    pc.ontrack = (event) => {
      logger.info(`WebRTC remote track received: [kind=${event.track.kind}, id=${event.track.id}]`);

      // Ensure composite MediaStream contains all tracks
      if (event.streams && event.streams[0]) {
        this.remoteMediaStream = event.streams[0];
      } else {
        if (!this.remoteMediaStream) {
          this.remoteMediaStream = new MediaStream();
        }
        if (!this.remoteMediaStream.getTracks().some((t) => t.id === event.track.id)) {
          this.remoteMediaStream.addTrack(event.track);
        }
      }

      // Track mute / unmute / ended lifecycle
      event.track.onunmute = () => {
        logger.info(`Remote track unmuted and streaming active: ${event.track.kind}`);
        this.emitRemoteStream();
        this.emitDiagnostics();
      };

      event.track.onmute = () => {
        logger.warn(`Remote track muted: ${event.track.kind}`);
        this.emitDiagnostics();
      };

      event.track.onended = () => {
        logger.info(`Remote track ended: ${event.track.kind}`);
        if (this.onTrackEnded) {
          this.onTrackEnded(event.track);
        }
        this.emitDiagnostics();
      };

      this.emitRemoteStream();
      this.emitDiagnostics();
    };

    // Host receives DataChannel initiated by controller or vice-versa
    pc.ondatachannel = (event) => {
      logger.info("WebRTC DataChannel received by peer:", event.channel.label);
      this.bindDataChannel(event.channel);
    };

    return pc;
  }

  private emitRemoteStream(): void {
    if (this.remoteMediaStream && this.onRemoteStream) {
      this.onRemoteStream(this.remoteMediaStream);
    }
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
      if (track.kind === "video") {
        this.videoSender = sender;
      }
    }

    const offer = await pc.createOffer({
      offerToReceiveVideo: false,
      offerToReceiveAudio: false,
    });
    await pc.setLocalDescription(offer);

    // Apply optimal encoding parameters after localDescription is set
    if (this.videoSender) {
      try {
        const params = this.videoSender.getParameters();
        if (!params.encodings || params.encodings.length === 0) {
          params.encodings = [{}];
        }
        params.encodings[0].maxBitrate = 6_000_000; // 6 Mbps default
        params.degradationPreference = "maintain-framerate";
        await this.videoSender.setParameters(params);
      } catch (e) {
        logger.warn("Could not set initial sender parameters", e);
      }
    }

    await this.sendSignal("WEBRTC_OFFER", offer);
    this.emitDiagnostics();
  }

  /**
   * Replace the active video track on the Host without renegotiating WebRTC.
   * Useful when switching monitors or display surfaces live.
   */
  public async hostReplaceVideoTrack(newTrack: MediaStreamTrack): Promise<boolean> {
    if (!this.videoSender) {
      logger.warn("Cannot replace video track: videoSender is null");
      return false;
    }
    try {
      await this.videoSender.replaceTrack(newTrack);
      logger.info(`Host replaced video track live with: ${newTrack.label}`);
      this.emitDiagnostics();
      return true;
    } catch (err) {
      logger.error("Failed to replace video track", err);
      return false;
    }
  }

  // ── 4. Controller: Handle Offer & Create Answer ───────────────────────────

  public async controllerHandleOfferAndAnswer(offerSdp: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.createPeerConnection();

    await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));

    // Drain any ICE candidates received prior to setRemoteDescription
    await this.drainEarlyCandidates();

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await this.sendSignal("WEBRTC_ANSWER", answer);
    this.emitDiagnostics();
  }

  // ── 5. Internal Signal Router & Candidate Drainage ────────────────────────

  private async handleIncomingSignal(msg: SignalingMessage): Promise<void> {
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
            // Drain any ICE candidates that arrived before host set remote answer
            await this.drainEarlyCandidates();
            this.emitDiagnostics();
          }
          break;

        case "ICE_CANDIDATE":
          this.iceCandidatesReceived++;
          if (
            this.peerConnection &&
            this.peerConnection.remoteDescription &&
            this.peerConnection.remoteDescription.type
          ) {
            try {
              await this.peerConnection.addIceCandidate(new RTCIceCandidate(msg.payload));
            } catch (iceErr) {
              logger.warn("Error adding live ICE candidate", iceErr);
            }
          } else {
            // Buffer candidate until remote description is ready
            this.earlyCandidatesQueue.push(msg.payload);
          }
          this.emitDiagnostics();
          break;
      }
    } catch (err) {
      logger.error(`Error handling incoming WebRTC signal [${msg.type}]`, err);
    }
  }

  private async drainEarlyCandidates(): Promise<void> {
    if (!this.peerConnection || !this.peerConnection.remoteDescription) return;

    if (this.earlyCandidatesQueue.length > 0) {
      logger.info(`Draining ${this.earlyCandidatesQueue.length} buffered early ICE candidates`);
      while (this.earlyCandidatesQueue.length > 0) {
        const cand = this.earlyCandidatesQueue.shift();
        if (cand && this.peerConnection) {
          try {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(cand));
          } catch (err) {
            logger.warn("Error adding buffered ICE candidate", err);
          }
        }
      }
    }
  }

  // ── 6. RTCDataChannel Input Pipeline ──────────────────────────────────────

  private bindDataChannel(channel: RTCDataChannel): void {
    this.dataChannel = channel;

    channel.onopen = () => {
      logger.info(`DataChannel [${channel.label}] OPEN`);
      this.emitDiagnostics();
    };

    channel.onclose = () => {
      logger.info(`DataChannel [${channel.label}] CLOSED`);
      this.emitDiagnostics();
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

  // ── 7. Quality Presets & Dynamic Adaptive Bitrate ─────────────────────────

  public async setQualityPreset(preset: QualityPreset): Promise<void> {
    if (!this.peerConnection) return;
    const senders = this.peerConnection.getSenders();
    const videoSender = senders.find((s) => s.track?.kind === "video") || this.videoSender;
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
        let width = 0;
        let height = 0;
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

        this.lastMetrics = {
          fps: Math.round(fps),
          rtt: rtt || 0,
          bitrateKbps,
          packetsLost,
          quality,
          streamWidth: width,
          streamHeight: height,
        };

        if (this.onMetricsUpdate) {
          this.onMetricsUpdate(this.lastMetrics);
        }

        this.emitDiagnostics();
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

  // ── 9. Diagnostics Snapshot Generator ────────────────────────────────────

  public getDiagnostics(): WebRTCDiagnostics {
    const pc = this.peerConnection;
    const stream = this.remoteMediaStream;
    const videoTracks = stream ? stream.getVideoTracks() : [];
    const audioTracks = stream ? stream.getAudioTracks() : [];
    const primaryVideoTrack = videoTracks[0];

    return {
      connectionState: pc?.connectionState || "disconnected",
      iceConnectionState: pc?.iceConnectionState || "disconnected",
      signalingState: this.signalingState,
      videoTracksCount: videoTracks.length,
      audioTracksCount: audioTracks.length,
      hasVideoTrack: videoTracks.length > 0,
      hasAudioTrack: audioTracks.length > 0,
      videoTrackReadyState: primaryVideoTrack?.readyState,
      videoTrackMuted: primaryVideoTrack?.muted,
      isStreamActive: Boolean(stream?.active && videoTracks.some((t) => t.readyState === "live")),
      resolutionWidth: this.lastMetrics.streamWidth,
      resolutionHeight: this.lastMetrics.streamHeight,
      fps: this.lastMetrics.fps,
      bitrateKbps: this.lastMetrics.bitrateKbps,
      rttMs: this.lastMetrics.rtt,
      iceCandidatesSent: this.iceCandidatesSent,
      iceCandidatesReceived: this.iceCandidatesReceived,
      lastUpdated: Date.now(),
    };
  }

  private emitDiagnostics(): void {
    if (this.onDiagnosticsUpdate) {
      this.onDiagnosticsUpdate(this.getDiagnostics());
    }
  }

  // ── 10. Teardown ─────────────────────────────────────────────────────────

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

    this.videoSender = null;
    this.remoteMediaStream = null;
    this.earlyCandidatesQueue = [];
    this.emitDiagnostics();
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
    this.signalingState = "disconnected";
    this.emitDiagnostics();
  }
}
