import { useEffect, useState } from "react";
import {
  Smartphone,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  Music,
  Film,
  Type,
  Moon,
  Square,
  LogOut,
  RefreshCw,
  History,
  Radio,
  Power,
  ChevronRight,
  SkipBack,
  SkipForward,
  Maximize2,
  Tv,
} from "lucide-react";
import { useRemoteClient } from "../remote-client.store";
import { MobileQrScanner } from "./MobileQrScanner";
import { MobileVerseTab } from "./MobileVerseTab";
import { MobileSongTab } from "./MobileSongTab";
import { MobileMediaTab } from "./MobileMediaTab";
import { MobileTextTab } from "./MobileTextTab";
import { MobileRecentSheet } from "./MobileRecentSheet";
import { MobileLiveNowModal } from "./MobileLiveNowModal";
import { cn } from "@/lib/utils";

export function MobileRemoteApp() {
  const {
    status,
    sessionId,
    salt,
    errorMessage,
    currentLive,
    blackScreen,
    activeTab,
    recentHistory,
    remoteControlMode,
    isHostDisabled,
    setSessionCredentials,
    authenticate,
    setRemoteControlMode,
    setActiveTab,
    sendCommand,
    disconnect,
    restoreSavedSession,
    setLiveModalOpen,
  } = useRemoteClient();

  const [password, setPassword] = useState("");
  const [manualSession, setManualSession] = useState("");
  const [manualSalt, setManualSalt] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showRecentSheet, setShowRecentSheet] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  // Parse URL query parameters on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const s = params.get("s");
    const slt = params.get("salt");

    if (s && slt) {
      setSessionCredentials(s, slt);
    } else {
      restoreSavedSession();
    }
  }, [setSessionCredentials, restoreSavedSession]);

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) return;

    setAuthenticating(true);
    try {
      await authenticate(password);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleManualSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSession.trim()) return;
    setSessionCredentials(manualSession.trim(), manualSalt.trim() || "default_salt");
  };

  const handleQrScanned = (scannedSessionId: string, scannedSalt: string) => {
    setShowScanner(false);
    setSessionCredentials(scannedSessionId, scannedSalt);
  };

  // Helper for live song transport
  const isLiveSong = currentLive?.type === "song_slide";
  const songSlideIndex =
    typeof currentLive?.metadata?.slideIndex === "number"
      ? (currentLive.metadata.slideIndex as number)
      : undefined;
  const songTotalSlides =
    typeof currentLive?.metadata?.totalSlides === "number"
      ? (currentLive.metadata.totalSlides as number)
      : undefined;

  // ── STATE 1: NO SESSION ID (LANDING / SCAN) ─────────────────────────────────
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20 text-foreground flex flex-col items-center justify-center p-4 select-none">
        {showScanner && (
          <MobileQrScanner
            onScan={handleQrScanned}
            onClose={() => setShowScanner(false)}
          />
        )}

        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary border border-primary/20 mx-auto flex items-center justify-center shadow-xl shadow-primary/5 ring-4 ring-primary/5">
              <Smartphone className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">VersoLyn Remote</h1>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">
                Wireless Church Presentation Controller
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md shadow-lg space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scan the QR code displayed on the laptop or enter the session credentials to begin live control.
            </p>

            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer shadow-md shadow-primary/20"
            >
              <ScanLine className="w-5 h-5" /> Scan Host QR Code
            </button>
          </div>

          <form
            onSubmit={handleManualSessionSubmit}
            className="p-4 rounded-xl border border-border/60 bg-muted/40 text-left space-y-3 text-xs"
          >
            <span className="font-semibold text-foreground/80 block">Or connect manually:</span>
            <input
              type="text"
              value={manualSession}
              onChange={(e) => setManualSession(e.target.value)}
              placeholder="Session ID (e.g. vp-7x8a2)"
              className="w-full h-9 px-3 rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={!manualSession.trim()}
              className="w-full h-9 rounded-lg bg-secondary text-secondary-foreground font-semibold text-xs disabled:opacity-40 cursor-pointer active:scale-[0.98] transition"
            >
              Continue to Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── STATE 2: ENTER PASSWORD ─────────────────────────────────────────────────
  if (status !== "connected") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20 text-foreground flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-sm space-y-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 mx-auto flex items-center justify-center shadow-lg ring-4 ring-primary/5">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">Enter Session Password</h1>
            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted border border-border font-mono text-xs text-muted-foreground">
              <span>Session:</span>
              <span className="font-bold text-foreground">{sessionId}</span>
            </div>
          </div>

          <form
            onSubmit={handleConnect}
            className="p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md shadow-lg space-y-4"
          >
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-foreground/90 block">
                Session Passphrase
              </label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter 4-6 digit passphrase..."
                className="w-full h-12 px-3 text-base font-mono tracking-widest rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-center font-bold"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 text-left">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authenticating || !password.trim()}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition cursor-pointer disabled:opacity-50 shadow-md shadow-primary/20"
            >
              {authenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                "Connect to Projector"
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={disconnect}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 cursor-pointer transition"
          >
            Scan a different session
          </button>
        </div>
      </div>
    );
  }

  // ── STATE 3: AUTHENTICATED REMOTE CONTROLLER ────────────────────────────────
  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden select-none">
      {/* Recent History Sheet Drawer */}
      {showRecentSheet && (
        <MobileRecentSheet onClose={() => setShowRecentSheet(false)} />
      )}

      {/* Live Now Detailed Modal */}
      <MobileLiveNowModal />

      {/* Top Header Bar */}
      <header className="h-14 px-3 border-b border-border/80 bg-card/85 backdrop-blur-md flex items-center justify-between shrink-0 z-20 shadow-xs">
        {/* Connection & Session Badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-emerald-400 tracking-tight">ONLINE</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
            {sessionId}
          </span>
        </div>

        {/* Center Mode Switcher Pill */}
        <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/70">
          <button
            type="button"
            onClick={() => setRemoteControlMode("full")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1",
              remoteControlMode === "full"
                ? "bg-emerald-500 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Full Control: Tabs sync with laptop"
          >
            <Power className="w-3 h-3" />
            Sync
          </button>
          <button
            type="button"
            onClick={() => setRemoteControlMode("projection_only")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1",
              remoteControlMode === "projection_only"
                ? "bg-slate-700 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Solo Browse: Browse privately without moving laptop screen"
          >
            Solo
          </button>
        </div>

        {/* Quick Actions Cluster */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Recent History Button */}
          <button
            type="button"
            onClick={() => setShowRecentSheet(true)}
            className="h-8.5 px-2 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs flex items-center gap-1 cursor-pointer transition active:scale-95 border border-border/50"
            title="Recent Projections"
          >
            <History className="w-3.5 h-3.5 text-primary" />
            {recentHistory.length > 0 && (
              <span className="text-[10px] bg-primary/20 text-primary font-mono font-bold px-1 rounded">
                {recentHistory.length}
              </span>
            )}
          </button>

          {/* Black Screen Toggle */}
          <button
            type="button"
            onClick={() =>
              sendCommand({ action: "TRANSPORT", subAction: "BLACK", value: !blackScreen })
            }
            className={cn(
              "h-8.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 border",
              blackScreen
                ? "bg-amber-500 text-black border-amber-600 shadow-xs"
                : "bg-secondary/80 text-secondary-foreground hover:bg-secondary border-border/50",
            )}
            title="Toggle Blackout Screen"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="text-[11px]">{blackScreen ? "BLACK" : "Black"}</span>
          </button>

          {/* Clear Screen */}
          <button
            type="button"
            onClick={() => sendCommand({ action: "TRANSPORT", subAction: "CLEAR" })}
            className="h-8.5 px-2 rounded-lg bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:text-destructive text-xs flex items-center gap-1 cursor-pointer transition active:scale-95 border border-border/50"
            title="Clear projector stage"
          >
            <Square className="w-3.5 h-3.5" />
          </button>

          {/* Disconnect */}
          <button
            type="button"
            onClick={disconnect}
            className="h-8.5 w-8.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Disconnect session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Host Disabled Warning Banner */}
      {isHostDisabled && (
        <div className="px-3 py-2 bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 font-medium shrink-0 animate-pulse">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Projection control has been disabled by the laptop host.</span>
        </div>
      )}

      {/* Main Tab Body — Persistent Keep-Alive for Instant 0ms Tab Switching */}
      <main className="flex-1 overflow-hidden relative">
        <div className={cn("h-full w-full", activeTab !== "verse" && "hidden")}>
          <MobileVerseTab />
        </div>
        <div className={cn("h-full w-full", activeTab !== "song" && "hidden")}>
          <MobileSongTab />
        </div>
        <div className={cn("h-full w-full", activeTab !== "media" && "hidden")}>
          <MobileMediaTab />
        </div>
        <div className={cn("h-full w-full", activeTab !== "text" && "hidden")}>
          <MobileTextTab />
        </div>
      </main>

      {/* Docked "Now Playing / Live on Stage" Mini-Bar (Right above bottom nav) */}
      <div className="shrink-0 border-t border-border/80 bg-card/95 backdrop-blur-lg px-3 py-2 z-20 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          {/* Live Info (Tap to expand modal) */}
          <div
            onClick={() => setLiveModalOpen(true)}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group py-0.5 active:opacity-80 transition"
          >
            <div className="relative shrink-0">
              <span
                className={cn(
                  "w-3 h-3 rounded-full flex items-center justify-center",
                  currentLive ? "bg-emerald-500/20" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    currentLive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground",
                  )}
                />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {currentLive ? "LIVE ON STAGE" : "STAGE IDLE"}
                </span>
                {songSlideIndex !== undefined && songTotalSlides !== undefined && (
                  <span className="text-[10px] text-muted-foreground font-mono font-bold bg-muted px-1.5 py-0.2 rounded">
                    {songSlideIndex + 1}/{songTotalSlides}
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition leading-tight mt-0.5">
                {currentLive ? currentLive.title : "No content currently projected"}
              </p>
            </div>
          </div>

          {/* Quick Slide Navigation Buttons (if projecting song or queue) */}
          {isLiveSong && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => sendCommand({ action: "TRANSPORT", subAction: "PREV" })}
                disabled={songSlideIndex !== undefined && songSlideIndex <= 0}
                className="h-8 w-8 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-30 cursor-pointer active:scale-95 transition"
                title="Previous Slide"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => sendCommand({ action: "TRANSPORT", subAction: "NEXT" })}
                disabled={
                  songSlideIndex !== undefined &&
                  songTotalSlides !== undefined &&
                  songSlideIndex >= songTotalSlides - 1
                }
                className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 cursor-pointer active:scale-95 transition shadow-xs"
                title="Next Slide"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Expand Full Preview Button */}
          <button
            type="button"
            onClick={() => setLiveModalOpen(true)}
            className="h-8 px-2 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition active:scale-95 shrink-0"
            title="Open Full Live Modal"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Stage</span>
          </button>
        </div>
      </div>

      {/* Bottom Category Navigation Bar (Thumb Friendly) */}
      <nav className="h-14 px-4 border-t border-border/80 bg-card/95 backdrop-blur-md flex items-center justify-around shrink-0 text-xs font-semibold z-20 pb-safe shadow-md">
        <button
          type="button"
          onClick={() => setActiveTab("verse")}
          className={cn(
            "flex-1 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition cursor-pointer active:scale-95",
            activeTab === "verse"
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <BookOpen className={cn("w-4 h-4 transition", activeTab === "verse" && "scale-110")} />
          <span className="text-[11px]">Verse</span>
          {activeTab === "verse" && (
            <span className="w-1 h-1 rounded-full bg-primary -mt-0.5 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("song")}
          className={cn(
            "flex-1 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition cursor-pointer active:scale-95",
            activeTab === "song"
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Music className={cn("w-4 h-4 transition", activeTab === "song" && "scale-110")} />
          <span className="text-[11px]">Song</span>
          {activeTab === "song" && (
            <span className="w-1 h-1 rounded-full bg-primary -mt-0.5 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={cn(
            "flex-1 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition cursor-pointer active:scale-95",
            activeTab === "media"
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Film className={cn("w-4 h-4 transition", activeTab === "media" && "scale-110")} />
          <span className="text-[11px]">Media</span>
          {activeTab === "media" && (
            <span className="w-1 h-1 rounded-full bg-primary -mt-0.5 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("text")}
          className={cn(
            "flex-1 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition cursor-pointer active:scale-95",
            activeTab === "text"
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Type className={cn("w-4 h-4 transition", activeTab === "text" && "scale-110")} />
          <span className="text-[11px]">Text</span>
          {activeTab === "text" && (
            <span className="w-1 h-1 rounded-full bg-primary -mt-0.5 animate-pulse" />
          )}
        </button>
      </nav>
    </div>
  );
}
