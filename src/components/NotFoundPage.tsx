import { useCallback, useRef, useState } from "react";
import { FileQuestion, Home, ArrowLeft, RefreshCw, Copy, Camera, Bug, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function getTimestamp(): string {
  const d = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function getUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

function getAppVersion(): string {
  return "1.0.0";
}

const ERROR_CODE = "VP-404";

function buildReport(): string {
  return [
    "═ Vision Projector — 404 Report ═",
    "",
    `Error Code:    ${ERROR_CODE}`,
    `Title:         Page Not Found`,
    `Description:   The requested page does not exist or may have been moved.`,
    "",
    `URL:           ${getUrl()}`,
    `Timestamp:     ${getTimestamp()}`,
    `Version:       ${getAppVersion()}`,
    "",
    "═ End of Report ═",
  ].join("\n");
}

export function NotFoundPage() {
  const [techOpen, setTechOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    if (notifTimer.current) clearTimeout(notifTimer.current);
    notifTimer.current = setTimeout(() => setNotification(null), 2000);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildReport());
      showNotification("Report copied");
    } catch {
      showNotification("Could not copy");
    }
  }, [showNotification]);

  const handleScreenshot = useCallback(async () => {
    const c = document.createElement("canvas");
    const w = 640, h = 520;
    c.width = w * 2;
    c.height = h * 2;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);

    const isDark = document.documentElement.classList.contains("dark");
    const bg1 = isDark ? "#0f1117" : "#f1f5f9";
    const bg2 = isDark ? "#1a1b2e" : "#e2e8f0";
    const cardBg = isDark ? "rgba(30,32,48,0.92)" : "rgba(255,255,255,0.92)";
    const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
    const textSecondary = isDark ? "#94a3b8" : "#475569";
    const textMuted = isDark ? "#64748b" : "#94a3b8";

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, bg1);
    grad.addColorStop(1, bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cw = 560, ch = 440;
    const cx0 = (w - cw) / 2, cy0 = (h - ch) / 2;

    ctx.fillStyle = cardBg;
    ctx.beginPath();
    ctx.roundRect(cx0, cy0, cw, ch, 16);
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cx0, cy0, cw, ch, 16);
    ctx.stroke();

    // Icon circle
    const icx = cx, icy = cy0 + 60;
    ctx.fillStyle = "rgba(99,102,241,0.12)";
    ctx.beginPath();
    ctx.arc(icx, icy, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#818cf8";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", icx, icy + 1);

    ctx.fillStyle = "#818cf8";
    ctx.font = "bold 12px monospace";
    ctx.fillText(ERROR_CODE, cx, cy0 + 108);

    ctx.fillStyle = textPrimary;
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Page Not Found", cx, cy0 + 140);

    ctx.fillStyle = textSecondary;
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    const words = "The page you requested does not exist or may have been moved.".split(" ");
    const maxW = cw - 80;
    let line1 = "", line2 = "", current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (ctx.measureText(test).width > maxW) {
        if (!line1) { line1 = current; current = word; }
        else { line2 = current ? current + " " + word : word; break; }
      } else { current = test; }
    }
    if (!line1) line1 = current;
    else if (!line2) line2 = current;
    ctx.fillText(line1, cx, cy0 + 176);
    if (line2) ctx.fillText(line2, cx, cy0 + 196);

    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx0 + 32, cy0 + 230);
    ctx.lineTo(cx0 + cw - 32, cy0 + 230);
    ctx.stroke();

    const url = getUrl();
    const ts = getTimestamp();
    const ver = getAppVersion();
    ctx.textAlign = "left";
    ctx.fillStyle = textMuted;
    ctx.font = "11px sans-serif";
    const iy = cy0 + 255;
    ctx.fillText(`URL: ${url.length > 48 ? url.slice(0, 48) + "…" : url}`, cx0 + 40, iy);
    ctx.fillText(`Time: ${ts}`, cx0 + 40, iy + 22);
    ctx.fillText(`Version: ${ver}`, cx0 + 40, iy + 44);

    ctx.textAlign = "center";
    ctx.font = "10px sans-serif";
    ctx.fillText("Vision Projector — 404 Report", cx, cy0 + ch - 16);

    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/png"));
    if (!blob) { showNotification("Could not save"); return; }
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url2;
    a.download = `vision-projector-404-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url2);
    showNotification("Screenshot saved");
  }, [showNotification]);

  const handleGoHome = () => {
    if (typeof window !== "undefined") window.location.href = "/library";
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined") window.history.back();
  };

  const handleRetry = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  const ts = getTimestamp();
  const url = getUrl();
  const ver = getAppVersion();

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0b0c10 0%, #12131e 30%, #0f1117 60%, #0a0b12 100%)",
      }}
    >
      {/* Ambient radial lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-[0.015]"
          style={{ background: "radial-gradient(ellipse, #a5b4fc 0%, transparent 60%)" }} />
      </div>

      {/* Breadcrumb header */}
      <div className="relative z-10 flex h-10 shrink-0 items-center gap-1.5 border-b border-white/[0.04] px-4"
        style={{ background: "rgba(11,12,16,0.8)" }}>
        <a
          href="/library"
          className="text-[11px] text-white/40 transition-colors hover:text-white/80"
        >
          Home
        </a>
        <ChevronDown className="h-3 w-3 -rotate-90 text-white/20" />
        <span className="text-[11px] font-medium text-white/70">Page Not Found</span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6">
        <div className="w-full max-w-lg">
          {/* Notification */}
          {notification && (
            <div className="mb-4 text-center">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm">
                {notification}
              </span>
            </div>
          )}

          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] shadow-2xl"
          >
            {/* Glass shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-indigo-500/[0.03] pointer-events-none" />
            <div className="absolute -inset-40 pointer-events-none animate-err404-rotate"
              style={{ background: "radial-gradient(circle, rgba(129,140,248,0.03) 0%, transparent 70%)" }} />

            {/* Glass card */}
            <div className="relative" style={{ background: "rgba(18,19,30,0.7)", backdropFilter: "blur(32px)" }}>
              {/* Header */}
              <div className="flex flex-col items-center px-8 pt-12 pb-5 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[20px]"
                  style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)" }}>
                  <span className="text-4xl font-bold" style={{ color: "rgba(129,140,248,0.6)" }}>404</span>
                </div>
                <h1 className="text-2xl font-bold text-white/90">Page Not Found</h1>
                <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-white/50">
                  The page you requested does not exist or may have been moved. Check the URL or navigate home.
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background: "rgba(129,140,248,0.1)" }}>
                  <span className="text-[10px] font-mono font-semibold tracking-wider" style={{ color: "#818cf8" }}>
                    {ERROR_CODE}
                  </span>
                </div>
              </div>

              {/* Technical details */}
              <div className="border-t border-white/[0.06]">
                <button
                  onClick={() => setTechOpen(!techOpen)}
                  className="flex w-full items-center justify-between px-6 py-2.5 text-xs text-white/40 transition-colors hover:bg-white/[0.02] hover:text-white/70"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Bug className="h-3.5 w-3.5" />
                    Show Technical Details
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      techOpen && "rotate-180",
                    )}
                  />
                </button>
                {techOpen && (
                  <div className="border-t border-white/[0.06] px-6 py-4 space-y-2.5">
                    <InfoRow label="URL" value={url} />
                    <InfoRow label="Timestamp" value={ts} />
                    <InfoRow label="Version" value={ver} />
                    <InfoRow label="Code" value={ERROR_CODE} />
                  </div>
                )}
              </div>

              {/* Actions bar */}
              <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/70"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy Error
                  </button>
                  <button
                    onClick={handleScreenshot}
                    className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/70"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Save Screenshot
                  </button>
                </div>
                <span className="text-[9px] text-white/20">{ts}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={handleGoBack}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <button
              onClick={handleGoHome}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-medium transition-all"
              style={{
                background: "rgba(129,140,248,0.12)",
                border: "1px solid rgba(129,140,248,0.25)",
                color: "#a5b4fc",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(129,140,248,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(129,140,248,0.12)"; }}
            >
              <Home className="h-3.5 w-3.5" />
              Go Home
            </button>
            <button
              onClick={handleRetry}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider w-20 text-right text-white/30">
        {label}
      </span>
      <code className="text-[11px] font-mono break-all text-white/40">
        {value}
      </code>
    </div>
  );
}
