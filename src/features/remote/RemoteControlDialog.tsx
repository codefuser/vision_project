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
} from "lucide-react";
import { useHostRemote } from "./remote-host.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function RemoteControlDialog() {
  const { session, isDialogOpen, setDialogOpen, startSession, updatePassword, endSession } =
    useHostRemote();

  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [customHost, setCustomHost] = useState("");
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Render QR Code onto canvas whenever URL or session changes
  useEffect(() => {
    if (!canvasRef.current || !remoteUrl) return;

    QRCode.toCanvas(
      canvasRef.current,
      remoteUrl,
      {
        width: 220,
        margin: 2,
        color: {
          dark: "#0f172a", // slate-900
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      },
      (err) => {
        if (err) console.error("QR render error:", err);
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
      <DialogContent className="sm:max-w-[480px] bg-card border-border p-6 select-none max-h-[90vh] overflow-y-auto">
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

            {/* QR Code Canvas */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-border shadow-sm">
              <canvas ref={canvasRef} className="rounded" />
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

            {/* Connected devices list */}
            {session.connectedDevices.length > 0 && (
              <div className="rounded-lg border border-border p-2 space-y-1.5 bg-muted/10">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground px-1">
                  Connected Phones
                </span>
                {session.connectedDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between text-xs px-2 py-1 rounded bg-background border border-border/50"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Smartphone className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-medium truncate">{device.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-semibold shrink-0">Live</span>
                  </div>
                ))}
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
