import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Radio,
  Copy,
  Check,
  Download,
  ExternalLink,
  Trash2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Globe,
} from "lucide-react";
import { useHostLiveQr } from "../live-qr-host.store";
import { PRESET_DURATIONS } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LiveQrDialog() {
  const {
    session,
    isDialogOpen,
    setDialogOpen,
    generateSession,
    revokeSession,
    remainingTime,
    isExpired,
  } = useHostLiveQr();

  const [selectedHours, setSelectedHours] = useState<number>(6);
  const [customHoursInput, setCustomHoursInput] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customHost, setCustomHost] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Determine base origin
  const baseOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const effectiveOrigin = customHost.trim()
    ? customHost.trim().replace(/\/+$/, "")
    : session?.customHost || baseOrigin;

  const liveUrl =
    session && !isExpired
      ? `${effectiveOrigin}/live?t=${encodeURIComponent(session.token)}`
      : "";

  // Render QR Code Data URL whenever active liveUrl changes
  useEffect(() => {
    if (!liveUrl) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(
      liveUrl,
      {
        width: 280,
        margin: 2,
        color: {
          dark: "#0a0f1d", // deep obsidian
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      },
      (err, url) => {
        if (err) {
          console.error("Live QR render error:", err);
        } else if (url) {
          setQrDataUrl(url);
        }
      },
    );
  }, [liveUrl]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const hours = isCustomMode
        ? Math.max(1, Math.min(720, parseInt(customHoursInput, 10) || 6))
        : selectedHours;

      await generateSession(hours, customHost);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!liveUrl) return;
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    toast.success("Live Viewer link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl || !session) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `live-projection-qr-${session.token}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("QR Code image downloaded");
  };

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const formattedExpiry = session
    ? new Date(session.expiresAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) +
      " (" +
      new Date(session.expiresAt).toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      }) +
      ")"
    : "";

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-border/80 bg-background shadow-2xl">
        {/* Header with clear branding */}
        <div className="border-b border-border/70 bg-gradient-to-r from-sky-950/40 via-background to-background p-5">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  Live Projection QR
                  {session && !isExpired && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  )}
                  {session && isExpired && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      Expired
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  View-only public livestream of whatever is currently projected.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4">
          {/* Notice: Viewers cannot control */}
          <div className="flex items-start gap-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 p-2.5 text-xs text-sky-300/90">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-sky-400" />
            <p>
              <strong>View-Only:</strong> Viewers only watch what is on the projector. They cannot
              control slides, search, select songs, or change anything.
            </p>
          </div>

          {/* ACTIVE QR VIEW */}
          {session && !isExpired ? (
            <div className="space-y-4">
              {/* Expiry Countdown Box */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-sky-400" /> Expires:
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{formattedExpiry}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-muted-foreground">Remaining:</p>
                  <p className="text-sm font-mono font-bold text-sky-400 mt-0.5">{remainingTime}</p>
                </div>
              </div>

              {/* High-Resolution QR Code */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 bg-muted/20">
                {qrDataUrl ? (
                  <div className="p-2.5 rounded-xl bg-white shadow-md">
                    <img
                      src={qrDataUrl}
                      alt={`Live QR Code for ${session.token}`}
                      className="h-52 w-52 object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-52 w-52 flex items-center justify-center text-xs text-muted-foreground">
                    Generating QR code...
                  </div>
                )}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground">Token:</span>
                  <span className="font-mono text-xs font-bold text-foreground tracking-wider bg-accent/60 px-2 py-0.5 rounded">
                    {session.token}
                  </span>
                </div>
              </div>

              {/* Public Link Box with Copy Button */}
              <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 p-1.5 pl-3">
                <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  readOnly
                  value={liveUrl}
                  className="flex-1 bg-transparent text-xs font-mono text-foreground select-all outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex h-7 items-center gap-1 rounded bg-secondary px-2.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Action Buttons: Download QR, Open Preview, Revoke */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-accent text-foreground transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-sky-400" />
                  Download QR
                </button>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-accent text-foreground transition cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
                  Open Viewer
                </a>
              </div>

              {/* Revoke & Regenerate options */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={revokeSession}
                  className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  Revoke QR Code
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Generate a new QR with a new code and reset expiry"
                >
                  <RefreshCw className="h-3 w-3" />
                  Generate New QR
                </button>
              </div>
            </div>
          ) : (
            /* CONFIGURATION & CREATION VIEW */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">
                  Select QR Validity Duration:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {PRESET_DURATIONS.map((opt) => (
                    <button
                      key={opt.hours}
                      type="button"
                      onClick={() => {
                        setSelectedHours(opt.hours);
                        setIsCustomMode(false);
                      }}
                      className={cn(
                        "rounded-lg border px-2 py-2 text-xs font-medium transition cursor-pointer text-center",
                        !isCustomMode && selectedHours === opt.hours
                          ? "border-sky-500 bg-sky-500/15 text-sky-400 font-semibold shadow-sm"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:text-foreground",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(true)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-xs font-medium transition cursor-pointer text-center",
                      isCustomMode
                        ? "border-sky-500 bg-sky-500/15 text-sky-400 font-semibold shadow-sm"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:text-foreground",
                    )}
                  >
                    Custom
                  </button>
                </div>

                {isCustomMode && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Hours:</span>
                    <input
                      type="number"
                      min={1}
                      max={720}
                      value={customHoursInput}
                      onChange={(e) => setCustomHoursInput(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-24 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-sky-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-muted-foreground">(1 to 720 hours)</span>
                  </div>
                )}
              </div>

              {/* Custom Host Override (Useful when testing localhost or deploying to public domain) */}
              {isLocalhost && (
                <div className="space-y-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
                  <label className="text-[11px] font-medium text-amber-300 block">
                    Public Domain / Network Host (Optional):
                  </label>
                  <input
                    type="text"
                    value={customHost}
                    onChange={(e) => setCustomHost(e.target.value)}
                    placeholder="https://live.yourchurch.org or http://192.168.1.50:5173"
                    className="w-full rounded border border-border bg-background/80 px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-sky-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    If viewing from outside local network, enter your public website URL.
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="w-full inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 text-xs font-semibold text-white shadow hover:bg-sky-600 disabled:opacity-50 transition cursor-pointer"
              >
                <Radio className="h-4 w-4" />
                {generating ? "Generating..." : "Generate Live QR"}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
