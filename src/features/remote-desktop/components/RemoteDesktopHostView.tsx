/**
 * Remote Desktop Host View Component
 * Provides session initialization, pairing code & PIN generation, approval modal,
 * active streaming preview, live display switching, native agent connectivity status,
 * WebRTC diagnostics, and emergency termination.
 */

import { memo, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Monitor,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Power,
  Play,
  Pause,
  Laptop,
  Clock,
  Terminal,
  Activity,
  RotateCcw,
  Sparkles,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHostRemoteDesktop } from "../stores/rd-host.store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const RemoteDesktopHostView = memo(function RemoteDesktopHostView() {
  const {
    session,
    mediaStream,
    pendingRequest,
    nativeAgent,
    diagnostics,
    controlEnabled,
    isInitializing,
    createSession,
    startScreenCapture,
    switchScreen,
    approveRequest,
    rejectRequest,
    terminateSession,
    emergencyStop,
    toggleControlEnabled,
    initNativeAgent,
    authenticateNativeAgent,
  } = useHostRemoteDesktop();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [pairingPinInput, setPairingPinInput] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize native agent listener on mount
  useEffect(() => {
    initNativeAgent();
  }, [initNativeAgent]);

  // Bind preview stream
  useEffect(() => {
    if (previewVideoRef.current) {
      if (mediaStream) {
        previewVideoRef.current.srcObject = mediaStream;
        previewVideoRef.current.play().catch(() => {});
      } else {
        previewVideoRef.current.srcObject = null;
      }
    }
  }, [mediaStream]);

  // Generate QR Code containing pairing info
  useEffect(() => {
    if (session) {
      const payload = JSON.stringify({
        sessionId: session.sessionId,
        pin: session.pin,
      });
      QRCode.toDataURL(payload, {
        width: 180,
        margin: 1,
        color: { dark: "#0f172a", light: "#ffffff" },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => setQrDataUrl(null));
    } else {
      setQrDataUrl(null);
    }
  }, [session]);

  const copyToClipboard = (text: string, isPin = false) => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      if (isPin) {
        setCopiedPin(true);
        setTimeout(() => setCopiedPin(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
      toast.success(`Copied ${isPin ? "PIN" : "Session ID"} to clipboard`);
    }
  };

  const isScreenSharingActive = Boolean(
    mediaStream && mediaStream.getVideoTracks().some((t) => t.readyState === "live"),
  );

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto p-4 sm:p-6 bg-background text-foreground space-y-6 max-w-5xl mx-auto">
      {/* ── Persistent Floating Active Indicator (When Connected) ─────────── */}
      {session?.status === "connected" && (
        <div className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-red-950/90 backdrop-blur-md border border-red-500/50 rounded-xl px-4 py-3 shadow-2xl text-red-200">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-sm font-bold tracking-wide">
              REMOTE CONTROL ACTIVE: Controlled by{" "}
              <span className="text-white underline">
                {session.connectedController?.name || "Remote Controller"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleControlEnabled()}
              className="text-xs px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 text-white cursor-pointer transition font-medium"
            >
              {controlEnabled ? "Pause Input" : "Resume Input"}
            </button>
            <button
              onClick={emergencyStop}
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-lg transition active:scale-95"
            >
              STOP REMOTE ACCESS
            </button>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <Monitor className="h-6 w-6 text-primary" />
            <span>Host Remote Desktop</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Securely stream your entire desktop and authorize remote mouse and keyboard control.
          </p>
        </div>

        {session ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-card hover:bg-muted cursor-pointer transition"
            >
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>Diagnostics</span>
            </button>

            <button
              onClick={() => toggleControlEnabled()}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border cursor-pointer transition",
                controlEnabled
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20",
              )}
            >
              {controlEnabled ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{controlEnabled ? "Pause Input" : "Resume Input"}</span>
            </button>

            <button
              onClick={() => terminateSession("Host terminated session.")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer shadow transition"
            >
              <Power className="h-3.5 w-3.5" />
              <span>End Session</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => createSession()}
            disabled={isInitializing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-lg transition active:scale-95 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            <span>{isInitializing ? "Starting Stream..." : "Create Remote Session"}</span>
          </button>
        )}
      </div>

      {/* ── Diagnostics Strip (When Toggled) ─────────────────────────────────── */}
      {showDiagnostics && (
        <div className="rounded-xl border border-white/10 bg-zinc-900/90 p-4 text-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="h-4 w-4" />
              <span>Host WebRTC Diagnostics</span>
            </span>
            <span className="text-[11px] text-muted-foreground">Live Telemetry</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
            <div className="bg-black/40 p-2 rounded border border-white/5">
              <span className="text-white/50 block text-[10px]">WebRTC Peer</span>
              <span className="font-bold capitalize">{diagnostics?.connectionState || "Idle"}</span>
            </div>
            <div className="bg-black/40 p-2 rounded border border-white/5">
              <span className="text-white/50 block text-[10px]">ICE State</span>
              <span className="font-bold capitalize">{diagnostics?.iceConnectionState || "Idle"}</span>
            </div>
            <div className="bg-black/40 p-2 rounded border border-white/5">
              <span className="text-white/50 block text-[10px]">Signaling</span>
              <span className="font-bold capitalize">{diagnostics?.signalingState || "Connected"}</span>
            </div>
            <div className="bg-black/40 p-2 rounded border border-white/5">
              <span className="text-white/50 block text-[10px]">Screen Capture</span>
              <span className="font-bold text-emerald-400">
                {isScreenSharingActive ? "Active" : "Stopped"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Native Agent Status Banner ───────────────────────────────────────── */}
      <div
        className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          nativeAgent.connected
            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
            : nativeAgent.requiresAuth
              ? "bg-blue-950/20 border-blue-500/30 text-blue-300"
              : "bg-amber-950/20 border-amber-500/30 text-amber-300",
        )}
      >
        <div className="flex items-start gap-3">
          <Terminal className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="flex-1 text-sm space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <span>
                {nativeAgent.connected
                  ? "Native OS Companion Agent Active"
                  : nativeAgent.requiresAuth
                    ? "Companion Agent Detected (Pairing Required)"
                    : "In-Browser Screen Streaming Active (Companion Ready)"}
              </span>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold",
                  nativeAgent.connected
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : nativeAgent.requiresAuth
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30",
                )}
              >
                {nativeAgent.connected
                  ? "Hardware Input Active"
                  : nativeAgent.requiresAuth
                    ? "Authentication Required"
                    : "Companion Optional"}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {nativeAgent.connected
                ? `Connected to local input bridge on 127.0.0.1:48123 (${nativeAgent.os?.toUpperCase()} - ${nativeAgent.screenWidth}x${nativeAgent.screenHeight}). Outside OS windows (File Explorer, Settings, Desktop icons, Task Manager) will receive hardware clicks and keystrokes.`
                : nativeAgent.requiresAuth
                  ? "The local agent is running. Enter the 6-digit Pairing PIN displayed in the terminal window to authorize hardware control."
                  : "Desktop streaming works in-browser! For unrestricted hardware control into external Windows apps (File Explorer, Settings, Desktop shortcuts), run 'native-agent/run-agent.bat' on this machine."}
            </p>
            {nativeAgent.requiresAuth && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="password"
                  value={pairingPinInput}
                  onChange={(e) => setPairingPinInput(e.target.value)}
                  placeholder="Enter 6-digit PIN"
                  className="px-2.5 py-1 text-xs rounded-lg border border-blue-500/40 bg-background text-foreground w-36 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && pairingPinInput.trim()) {
                      authenticateNativeAgent(pairingPinInput.trim());
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-blue-500/40 hover:bg-blue-500/20"
                  onClick={() => {
                    if (pairingPinInput.trim()) {
                      authenticateNativeAgent(pairingPinInput.trim());
                    }
                  }}
                >
                  Authorize Agent
                </Button>
                {nativeAgent.authError && (
                  <span className="text-[11px] text-destructive">{nativeAgent.authError}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Active Session Card OR Getting Started Guide ─────────────────────── */}
      {session ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 2 Cols: Session Details & Pairing Card */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Session Credentials
                </span>
                <span
                  className={cn(
                    "text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5",
                    session.status === "connected"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {session.status === "connected" ? "Connected" : "Waiting for Controller..."}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Session ID */}
                <div className="bg-muted/40 rounded-lg p-3.5 border border-border/50">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Session ID
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-mono font-bold tracking-wider text-primary">
                      {session.sessionId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(session.sessionId, false)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition"
                      title="Copy Session ID"
                    >
                      {copiedCode ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 6-Digit PIN */}
                <div className="bg-muted/40 rounded-lg p-3.5 border border-border/50">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Security PIN
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-mono font-bold tracking-widest text-emerald-400">
                      {session.pin}
                    </span>
                    <button
                      onClick={() => copyToClipboard(session.pin, true)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition"
                      title="Copy Security PIN"
                    >
                      {copiedPin ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Connected Controller Info */}
              {session.connectedController ? (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3">
                  <Laptop className="h-8 w-8 text-emerald-400 shrink-0" />
                  <div className="text-sm">
                    <div className="font-semibold text-emerald-200">
                      {session.connectedController.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-sm">
                      {session.connectedController.userAgent}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/20 border border-dashed border-border/80 rounded-lg p-5 text-center text-sm text-muted-foreground flex flex-col items-center justify-center space-y-2">
                  <Clock className="h-6 w-6 text-muted-foreground/60 animate-spin" />
                  <p>Share the Session ID and PIN with the Controller laptop.</p>
                  <p className="text-xs text-muted-foreground/80">
                    A connection prompt will appear here for your explicit authorization.
                  </p>
                </div>
              )}
            </div>

            {/* Security Guarantee */}
            <div className="rounded-xl border border-border/60 bg-card/50 p-4 text-xs text-muted-foreground space-y-2">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Zero-Knowledge & End-to-End Encrypted</span>
              </div>
              <p>
                Remote desktop streaming operates strictly over peer-to-peer WebRTC (DTLS-SRTP). No
                screen images, keystrokes, or private files are stored on any server. You can sever
                access at any time using the STOP REMOTE ACCESS button.
              </p>
            </div>
          </div>

          {/* Right Col: Live Screen Preview Thumbnail & Multi-Monitor Controls */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Live Stream Preview</span>
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isScreenSharingActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400",
                  )}
                />
              </div>

              <div className="aspect-video bg-black rounded-lg overflow-hidden border border-border/50 relative flex items-center justify-center">
                <video
                  ref={previewVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn(
                    "h-full w-full object-contain pointer-events-none",
                    !isScreenSharingActive && "hidden",
                  )}
                />

                {!isScreenSharingActive && (
                  <div className="text-center p-4 space-y-2 text-xs text-muted-foreground">
                    <Monitor className="h-8 w-8 mx-auto text-muted-foreground/60" />
                    <p>Screen sharing paused</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => startScreenCapture()}
                    >
                      Resume Screen Share
                    </Button>
                  </div>
                )}
              </div>

              {/* Display & Monitor Switcher */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 flex-1 flex items-center gap-1.5"
                  onClick={() => switchScreen()}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Switch Display</span>
                </Button>
              </div>

              {qrDataUrl && (
                <div className="pt-2 flex flex-col items-center text-center">
                  <img
                    src={qrDataUrl}
                    alt="Remote Desktop Pairing QR"
                    className="h-28 w-28 rounded border border-border/40 p-1 bg-white"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1">
                    Scan for instant pairing
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State / How it works */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-semibold text-base">Select Entire Screen</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Click &quot;Create Remote Session&quot; and choose &quot;Entire Screen&quot; in the
              browser picker to share your desktop, open apps, File Explorer, and system windows.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-semibold text-base">Share Pairing PIN</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A unique temporary Session ID and 6-digit PIN are generated. Enter these on the
              Controller laptop to request access.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-semibold text-base">Explicit Approval</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No controller can view or interact with your screen until you explicitly review their
              device name and click &quot;Approve Connection&quot;.
            </p>
          </div>
        </div>
      )}

      {/* ── High-Priority Host Approval Modal ──────────────────────────────── */}
      {pendingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Remote Control Request</h3>
                <p className="text-xs text-muted-foreground">
                  An external controller is requesting access to your desktop.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/40 border border-border/60 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Device Name:</span>
                <span className="font-semibold text-foreground">
                  {pendingRequest.controllerName || "Unknown Controller"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User Agent:</span>
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {pendingRequest.userAgent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested At:</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(pendingRequest.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Approving grants this controller the ability to view your screen and remotely
                control your mouse and keyboard.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => rejectRequest("Host declined the connection request.")}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition"
              >
                Decline
              </button>
              <button
                onClick={() => approveRequest()}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg transition active:scale-95"
              >
                Approve Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
