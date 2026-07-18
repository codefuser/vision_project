import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  FileQuestion,
  History,
  Home,
  ArrowLeft,
  RefreshCw,
  Copy,
  Camera,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Bug,
  MonitorPlay,
  Calendar,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/features/workspace/workspace.store";
import type { SessionRecord } from "@/db/schema";

export type ErrorCode = "VP-404" | "VP-500" | "VP-SESSION" | "VP-000" | `VP-${string}`;

export interface ErrorPageBreadcrumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export interface ErrorPageProps {
  errorCode: ErrorCode;
  title: string;
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: Error | null;
  sessionId?: string;
  sessionName?: string;
  appVersion?: string;
  recoverable?: boolean;
  recommendedAction?: "retry" | "home" | "back" | "history";
  backPath?: string;
  backLabel?: string;
  onRetry?: () => void;
  showHome?: boolean;
  showHistory?: boolean;
  breadcrumbs?: ErrorPageBreadcrumb[];
  recentSessions?: SessionRecord[];
  children?: ReactNode;
}

function getTimestamp(): string {
  return format(new Date(), "EEEE, MMMM d, yyyy 'at' h:mm:ss a");
}

function getUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

function getAppVersion(): string {
  return "1.0.0";
}

function buildDiagnosticReport(opts: {
  errorCode: string;
  title: string;
  message: string;
  error?: Error | null;
  sessionId?: string;
  url?: string;
  timestamp?: string;
  appVersion?: string;
}): string {
  const lines = [
    "═ Vision Projector — Error Report ═",
    "",
    `Error Code:    ${opts.errorCode}`,
    `Title:         ${opts.title}`,
    `Message:       ${opts.message}`,
    "",
    `Timestamp:     ${opts.timestamp ?? getTimestamp()}`,
    `URL:           ${opts.url ?? getUrl()}`,
    `Version:       ${opts.appVersion ?? getAppVersion()}`,
    opts.sessionId ? `Session ID:    ${opts.sessionId}` : null,
    "",
    opts.error ? `Error:         ${opts.error.message}` : null,
    opts.error?.stack ? `\nStack Trace:\n${opts.error.stack}` : null,
    "",
    "═ End of Report ═",
  ]
    .filter(Boolean)
    .join("\n");
  return lines;
}

const DEFAULT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "VP-404": FileQuestion,
  "VP-500": AlertTriangle,
  "VP-SESSION": History,
};

export function ErrorPage({
  errorCode = "VP-000",
  title,
  message,
  icon: IconOverride,
  error,
  sessionId,
  appVersion,
  recoverable = false,
  recommendedAction,
  backPath,
  backLabel = "Back",
  onRetry,
  showHome = true,
  showHistory = false,
  breadcrumbs,
  recentSessions,
  children,
}: ErrorPageProps) {
  const router = useRouter();
  const setErrorPageMode = useWorkspace((s) => s.setErrorPageMode);
  const [techOpen, setTechOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setErrorPageMode(true);
    return () => setErrorPageMode(false);
  }, [setErrorPageMode]);

  const Icon = IconOverride ?? DEFAULT_ICON_MAP[errorCode] ?? AlertCircle;

  const timestamp = getTimestamp();
  const url = getUrl();
  const version = appVersion ?? getAppVersion();

  const handleCopyError = useCallback(async () => {
    const report = buildDiagnosticReport({
      errorCode,
      title,
      message,
      error,
      sessionId,
      timestamp,
      url,
      appVersion: version,
    });
    try {
      await navigator.clipboard.writeText(report);
      toast.success("Diagnostic report copied");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }, [errorCode, title, message, error, sessionId, timestamp, url, version]);

  const handleSaveScreenshot = useCallback(async () => {
    const c = document.createElement("canvas");
    const w = 640;
    const h = 520;
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
    const accent = "#6366f1";

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, bg1);
    grad.addColorStop(1, bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Card
    const cw = 560;
    const ch = 440;
    const cx0 = (w - cw) / 2;
    const cy0 = (h - ch) / 2;
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
    const icx = cx;
    const icy = cy0 + 60;
    ctx.fillStyle = "rgba(239,68,68,0.12)";
    ctx.beginPath();
    ctx.arc(icx, icy, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ef4444";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", icx, icy + 1);

    // Error code
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(errorCode, cx, cy0 + 108);

    // Title
    ctx.fillStyle = textPrimary;
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(title, cx, cy0 + 140);

    // Message (two lines max)
    ctx.fillStyle = textSecondary;
    ctx.font = "13px sans-serif";
    const maxW = cw - 80;
    const words = message.split(" ");
    let line1 = "";
    let line2 = "";
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (ctx.measureText(test).width > maxW) {
        if (!line1) { line1 = current; current = word; }
        else { line2 = current ? current + " " + word : word; break; }
      } else {
        current = test;
      }
    }
    if (!line1) line1 = current;
    else if (!line2) line2 = current;
    ctx.fillText(line1, cx, cy0 + 170);
    if (line2) ctx.fillText(line2, cx, cy0 + 190);

    // Divider
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx0 + 32, cy0 + 220);
    ctx.lineTo(cx0 + cw - 32, cy0 + 220);
    ctx.stroke();

    // Info lines
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textMuted;
    ctx.font = "11px sans-serif";
    const infoY = cy0 + 245;
    ctx.fillText(`Time: ${timestamp}`, cx0 + 40, infoY);
    ctx.fillText(`URL: ${url.length > 50 ? url.slice(0, 50) + "…" : url}`, cx0 + 40, infoY + 22);
    ctx.fillText(`Version: ${version}`, cx0 + 40, infoY + 44);
    if (sessionId) {
      ctx.fillText(`Session: ${sessionId}`, cx0 + 40, infoY + 66);
    }

    // Footer
    ctx.textAlign = "center";
    ctx.fillStyle = textMuted;
    ctx.font = "10px sans-serif";
    ctx.fillText("Vision Projector — Error Report", cx, cy0 + ch - 16);

    const blob = await new Promise<Blob | null>((resolve) => c.toBlob(resolve, "image/png"));
    if (!blob) {
      toast.error("Could not generate screenshot");
      return;
    }
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `vision-projector-error-${errorCode.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    toast.success("Screenshot saved");
  }, [errorCode, title, message, sessionId, timestamp, url, version]);

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    } else {
      router.invalidate();
    }
  }, [onRetry, router]);

  const breadcrumbDef: ErrorPageBreadcrumb[] = breadcrumbs ?? [
    { label: "Home", to: "/library" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Breadcrumb header */}
      <div className="flex h-10 shrink-0 items-center gap-1.5 border-b border-border/40 bg-background/95 px-4 backdrop-blur-sm">
        {breadcrumbDef.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[11px]">
            {i > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
            )}
            {crumb.to ? (
              <Link
                to={crumb.to as any}
                params={crumb.params as any}
                className="text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground/80 font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Error content */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
        <div className="w-full max-w-lg">
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] shadow-2xl"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-destructive/[0.04] pointer-events-none" />
            <div className="absolute -inset-40 pointer-events-none animate-error-rotate" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)' }} />

            {/* Glass card */}
            <div className="relative bg-card/60 backdrop-blur-2xl">
              {/* Header */}
              <div className="flex flex-col items-center px-8 pt-10 pb-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
                  <Icon className="h-7 w-7 text-destructive" />
                </div>
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground/80 leading-relaxed">
                  {message}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1">
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-destructive">
                    {errorCode}
                  </span>
                </div>
              </div>

              {/* Technical details (collapsed by default) */}
              <div className="border-t border-white/[0.06]">
                <button
                  onClick={() => setTechOpen(!techOpen)}
                  className="flex w-full items-center justify-between px-6 py-2.5 text-xs text-muted-foreground/60 transition-colors hover:text-foreground hover:bg-white/[0.02]"
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
                    {error && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                          Error
                        </span>
                        <pre className="rounded-lg bg-black/20 p-3 text-[11px] leading-relaxed text-red-400 font-mono whitespace-pre-wrap break-all">
                          {error.message}
                        </pre>
                      </div>
                    )}
                    {error?.stack && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                          Stack Trace
                        </span>
                        <pre className="max-h-40 overflow-y-auto rounded-lg bg-black/20 p-3 text-[10px] leading-relaxed text-muted-foreground/60 font-mono whitespace-pre-wrap break-all">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    {sessionId && (
                      <InfoRow label="Session ID" value={sessionId} />
                    )}
                    <InfoRow label="URL" value={url} />
                    <InfoRow label="Timestamp" value={timestamp} />
                    <InfoRow label="Version" value={version} />
                  </div>
                )}
              </div>

              {/* Actions bar */}
              <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyError}
                    className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground/60 transition-all hover:bg-accent/50 hover:text-foreground"
                    title="Copy diagnostic report"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy Error
                  </button>
                  <button
                    onClick={handleSaveScreenshot}
                    className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground/60 transition-all hover:bg-accent/50 hover:text-foreground"
                    title="Save screenshot as PNG"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Save Screenshot
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground/30">
                    {timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {backPath && (
              <Link
                to={backPath as any}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-background/80 px-4 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur-sm transition-all hover:bg-accent hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {backLabel}
              </Link>
            )}
            {showHistory && (
              <Link
                to="/history"
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-background/80 px-4 text-xs font-medium shadow-sm backdrop-blur-sm transition-all hover:bg-accent hover:text-foreground",
                  recommendedAction === "history" &&
                    "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15",
                )}
              >
                <History className="h-3.5 w-3.5" />
                History
              </Link>
            )}
            {showHome && (
              <Link
                to="/library"
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-background/80 px-4 text-xs font-medium shadow-sm backdrop-blur-sm transition-all hover:bg-accent hover:text-foreground",
                  recommendedAction === "home" &&
                    "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15",
                )}
              >
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
            )}
            <button
              onClick={handleRetry}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-background/80 px-4 text-xs font-medium shadow-sm backdrop-blur-sm transition-all hover:bg-accent hover:text-foreground",
                recommendedAction === "retry" &&
                  "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15",
              )}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>

          {/* Recent sessions (for session-not-found errors) */}
          {recentSessions && recentSessions.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-border/20" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                  Recent Sessions
                </span>
                <div className="h-px flex-1 bg-border/20" />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {recentSessions.map((s) => (
                  <Link
                    key={s.id}
                    to="/history/$id"
                    params={{ id: s.id }}
                    className="group rounded-xl border border-white/[0.06] bg-card/40 p-3.5 backdrop-blur-sm transition-all hover:bg-card/60 hover:border-white/[0.10] hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/[0.08]">
                        <MonitorPlay className="h-3.5 w-3.5 text-primary/70" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                          {s.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(s.startedAt), "MMM d")}
                          <span>·</span>
                          <Clock className="h-3 w-3" />
                          {format(new Date(s.startedAt), "h:mm a")}
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 w-20 text-right">
        {label}
      </span>
      <code className="text-[11px] text-muted-foreground/60 font-mono break-all">
        {value}
      </code>
    </div>
  );
}
