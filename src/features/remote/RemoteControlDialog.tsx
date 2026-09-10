import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Smartphone,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  PowerOff,
  Wifi,
  ShieldCheck,
  Users,
  Power,
  UserX,
} from "lucide-react";
import { useHostRemote } from "./remote-host.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatLastSeen(lastSeenAt: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - lastSeenAt) / 1000));
  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  return `${diffMin}m ago`;
}

export function RemoteControlDialog() {
  const {
    session,
    isDialogOpen,
    setDialogOpen,
    startSession,
    updatePassword,
    endSession,
    toggleDeviceEnabled,
    disconnectDevice,
  } = useHostRemote();

  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [customHost, setCustomHost] = useState("");
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Auto-init password placeholder when opening if no session
  useEffect(() => {
    if (isDialogOpen && !session && !passwordInput) {
      setPasswordInput(Math.floor(1000 + Math.random() * 9000).toString());
    }
  }, [isDialogOpen, session, passwordInput]);

  // Determine target origin for mobile URL
  const baseOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const effectiveOrigin = customHost ? customHost.trim().replace(/\/+$/, "") : baseOrigin;

  const remoteUrl = session
    ? `${effectiveOrigin}/remote?s=${encodeURIComponent(session.sessionId)}&salt=${encodeURIComponent(session.salt)}`
    : "";

  // Render QR Code as a reliable Data URL whenever URL or session changes
  useEffect(() => {
    if (!remoteUrl) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(
      remoteUrl,
      {
        width: 260,
        margin: 2,
        color: {
          dark: "#0f172a", // slate-900
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      },
      (err, url) => {
        if (err) {
          console.error("QR render error:", err);
        } else if (url) {
          setQrDataUrl(url);
        }
      },
    );
  }, [remoteUrl]);

  const handleStart = async () => {
    setStarting(true);
    try {
      await startSession(passwordInput);
    } finally {
      setStarting(false);
    }
  };

  const handleCopy = () => {
    if (!remoteUrl) return;
    navigator.clipboard.writeText(remoteUrl);
    setCopied(true);
    toast.success("Remote URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border p-6 select-none max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Smartphone className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg">Remote Control via Mobile</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Control Bible verses, songs, lyrics, media, and text from your phone during church
            service.
          </DialogDescription>
        </DialogHeader>

        {!session ? (
          /* ── START SESSION SETUP ────────────────────────────── */
          <div className="space-y-4 pt-3">
            <div className="rounded-lg border border-border/70 bg-muted/30 p-4 space-y-3">
              <label className="text-xs font-semibold text-foreground block">
                Set Remote Password (PIN)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="e.g. 1234 or church"
                  className="w-full h-10 px-3 pr-10 text-sm font-mono tracking-wider rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Mobile users will scan the QR code and enter this password to gain control. Plain-text
                password is never transmitted.
              </p>
            </div>

            <button
              type="button"
              onClick={handleStart}
              disabled={starting}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Smartphone className="w-4 h-4" />
              {starting ? "Starting Session..." : "Start Remote Control Session"}
            </button>
          </div>
        ) : (
          /* ── ACTIVE SESSION DETAILS & QR CODE ──────────────── */
          <div className="space-y-4 pt-2">
            {/* Status indicator bar */}
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border",
                session.connectedDevices.length > 0
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    session.connectedDevices.length > 0
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-amber-500",
                  )}
                />
                <span>
                  {session.connectedDevices.length > 0
                    ? `${session.connectedDevices.length} Phone${session.connectedDevices.length > 1 ? "s" : ""} Connected`
                    : "Waiting for Phone to Connect..."}
                </span>
              </div>
              <span className="font-mono text-[11px] opacity-80 uppercase tracking-wider">
                ID: {session.sessionId}
              </span>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-border shadow-sm min-h-[250px]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Remote QR Code"
                  className="w-[220px] h-[220px] object-contain rounded"
                />
              ) : (
                <div className="w-[220px] h-[220px] flex items-center justify-center text-slate-400 text-xs font-medium">
                  Generating QR Code...
                </div>
              )}
              <div className="mt-2 text-center">
                <p className="text-xs font-semibold text-slate-900">Scan with Phone Camera</p>
                <p className="text-[10px] text-slate-500">
                  Open your phone camera or QR scanner to connect instantly
                </p>
              </div>
            </div>

            {/* Session Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Remote Password
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm tracking-wider text-foreground">
                    {showPassword ? session.passwordPlain : "••••"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground"
                    title={showPassword ? "Hide" : "Show"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3 text-primary" /> Active Devices
                </span>
                <span className="font-semibold text-sm text-foreground block">
                  {session.connectedDevices.length}{" "}
                  <span className="text-xs font-normal text-muted-foreground">connected</span>
                </span>
              </div>
            </div>

            {/* Multi-Device Management: Connected Phones list */}
            {session.connectedDevices.length > 0 && (
              <div className="rounded-xl border border-border/80 p-3 space-y-2.5 bg-muted/20">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    Connected Devices ({session.connectedDevices.length})
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Live control permissions
                  </span>
                </div>

                <div className="space-y-2">
                  {session.connectedDevices.map((device) => {
                    const isEnabled = device.enabled !== false;
                    return (
                      <div
                        key={device.id}
                        className={cn(
                          "flex items-center justify-between gap-2 p-2.5 rounded-lg border transition-all",
                          isEnabled
                            ? "bg-background/80 border-border shadow-xs"
                            : "bg-muted/40 border-dashed border-amber-500/30 opacity-80",
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold",
                              isEnabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                            )}
                          >
                            <Smartphone className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-foreground truncate">
                                {device.name}
                              </span>
                              <span
                                className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0",
                                  device.remoteMode === "projection_only"
                                    ? "bg-blue-500/15 text-blue-400"
                                    : "bg-purple-500/15 text-purple-400",
                                )}
                              >
                                {device.remoteMode === "projection_only" ? "Proj Only" : "Full Remote"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <span
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                    isEnabled ? "bg-emerald-500 animate-pulse" : "bg-amber-500",
                                  )}
                                />
                                {isEnabled ? "Authorized" : "Disabled"}
                              </span>
                              <span>•</span>
                              <span>Seen {formatLastSeen(device.lastSeenAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons: ON/OFF toggle and Disconnect */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleDeviceEnabled(device.id, !isEnabled)}
                            className={cn(
                              "h-7 px-2.5 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 border",
                              isEnabled
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                                : "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25",
                            )}
                            title={
                              isEnabled
                                ? "Disable remote projection for this device"
                                : "Enable remote projection for this device"
                            }
                          >
                            <Power className="w-3 h-3" />
                            {isEnabled ? "ON" : "OFF"}
                          </button>

                          <button
                            type="button"
                            onClick={() => disconnectDevice(device.id)}
                            className="h-7 w-7 rounded-md border border-border bg-background hover:bg-destructive/15 hover:text-destructive hover:border-destructive/30 text-muted-foreground transition flex items-center justify-center cursor-pointer"
                            title="Disconnect device"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Localhost IP helper */}
            {isLocalhost && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 space-y-1.5 text-xs text-amber-200">
                <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Local Wi-Fi Connection Tip</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Phones cannot open &quot;localhost&quot;. If your phone is on the same Wi-Fi, enter
                  your laptop&apos;s Wi-Fi IP below (e.g. <code>http://192.168.1.5:3000</code>) to
                  update the QR code:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customHost}
                    onChange={(e) => setCustomHost(e.target.value)}
                    placeholder="http://192.168.1.xxx:3000"
                    className="flex-1 h-8 px-2.5 text-xs font-mono rounded border border-border bg-background text-foreground"
                  />
                  {customHost && (
                    <button
                      type="button"
                      onClick={() => setCustomHost("")}
                      className="px-2 h-8 text-xs rounded border border-border text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Copy URL & Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 h-9 rounded-md border border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Mobile Link"}
              </button>

              <button
                type="button"
                onClick={endSession}
                className="h-9 px-3 rounded-md bg-destructive/15 text-destructive hover:bg-destructive/25 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="End session and disconnect all remotes"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>End Session</span>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
