import { useEffect, useState } from "react";
import {
  Smartphone,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  Music,
  FileText,
  Film,
  Type,
  Moon,
  Square,
  LogOut,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useRemoteClient } from "../remote-client.store";
import { MobileQrScanner } from "./MobileQrScanner";
import { MobileVerseTab } from "./MobileVerseTab";
import { MobileSongTab } from "./MobileSongTab";
import { MobileLyricTab } from "./MobileLyricTab";
import { MobileMediaTab } from "./MobileMediaTab";
import { MobileTextTab } from "./MobileTextTab";
import { cn } from "@/lib/utils";

type ActiveTab = "verse" | "song" | "lyric" | "media" | "text";

export function MobileRemoteApp() {
  const {
    status,
    sessionId,
    salt,
    sessionToken,
    errorMessage,
    currentLive,
    blackScreen,
    setSessionCredentials,
    authenticate,
    sendCommand,
    disconnect,
    restoreSavedSession,
  } = useRemoteClient();

  const [password, setPassword] = useState("");
  const [manualSession, setManualSession] = useState("");
  const [manualSalt, setManualSalt] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("verse");
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

  // ── STATE 1: NO SESSION ID (LANDING / SCAN) ─────────────────────────────────
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 select-none">
        {showScanner && (
          <MobileQrScanner
            onScan={handleQrScanned}
            onClose={() => setShowScanner(false)}
          />
        )}

        <div className="w-full max-w-sm space-y-6 text-center">
          {/* Logo / Badge */}
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 mx-auto flex items-center justify-center shadow-lg">
              <Smartphone className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Vision Projector</h1>
            <p className="text-xs text-muted-foreground">Mobile Remote Controller</p>
          </div>

          {/* Scan QR Button */}
          <div className="p-5 rounded-2xl border border-border bg-card/70 backdrop-blur shadow-sm space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scan the QR code displayed on the laptop screen to connect to live church projection.
            </p>

            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer shadow-md"
            >
              <ScanLine className="w-5 h-5" /> Scan QR Code
            </button>
          </div>

          {/* Manual Entry Fallback */}
          <form
            onSubmit={handleManualSessionSubmit}
            className="p-4 rounded-xl border border-border/70 bg-muted/30 text-left space-y-3 text-xs"
          >
            <span className="font-semibold text-foreground/80 block">Or enter manually:</span>
            <input
              type="text"
              value={manualSession}
              onChange={(e) => setManualSession(e.target.value)}
              placeholder="Session ID (e.g. vp-7x8a2)"
              className="w-full h-9 px-3 rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!manualSession.trim()}
              className="w-full h-8 rounded-lg bg-secondary text-secondary-foreground font-medium text-xs disabled:opacity-40"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── STATE 2: ENTER PASSWORD ─────────────────────────────────────────────────
  if (status !== "connected") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-sm space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 mx-auto flex items-center justify-center shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-lg font-bold">Enter Remote Password</h1>
            <span className="text-[11px] font-mono text-muted-foreground uppercase">
              Session: {sessionId}
            </span>
          </div>

          <form
            onSubmit={handleConnect}
            className="p-5 rounded-2xl border border-border bg-card/80 backdrop-blur shadow-sm space-y-4"
          >
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-foreground block">
                Session Password
              </label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password set on laptop..."
                className="w-full h-11 px-3 text-sm font-mono tracking-wider rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
              />
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 text-left">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authenticating || !password.trim()}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition cursor-pointer disabled:opacity-50 shadow"
            >
              {authenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                "Connect to Projector"
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={disconnect}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 cursor-pointer"
          >
            Scan a different QR Code
          </button>
        </div>
      </div>
    );
  }

  // ── STATE 3: AUTHENTICATED REMOTE CONTROLLER ────────────────────────────────
  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="h-12 px-3 border-b border-border bg-card/80 backdrop-blur flex items-center justify-between shrink-0 z-20">
        {/* Status indicator */}
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="min-w-0 truncate">
            {currentLive ? (
              <span className="text-xs font-semibold text-foreground truncate block">
                {currentLive.title}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Connected • Projector Ready</span>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Black toggle */}
          <button
            type="button"
            onClick={() =>
              sendCommand({ action: "TRANSPORT", subAction: "BLACK", value: !blackScreen })
            }
            className={cn(
              "h-8 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer",
              blackScreen
                ? "bg-amber-500 text-black font-semibold"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            )}
            title="Black Screen toggle"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="text-[11px]">{blackScreen ? "Black ON" : "Black"}</span>
          </button>

          {/* Clear screen */}
          <button
            type="button"
            onClick={() => sendCommand({ action: "TRANSPORT", subAction: "CLEAR" })}
            className="h-8 px-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs flex items-center gap-1 cursor-pointer"
            title="Clear projector to idle"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Clear</span>
          </button>

          {/* Disconnect */}
          <button
            type="button"
            onClick={disconnect}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive flex items-center justify-center cursor-pointer"
            title="Disconnect"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 5 Category Navigation Tabs */}
      <nav className="h-11 px-2 border-b border-border bg-muted/40 flex items-center justify-around shrink-0 text-xs font-medium z-10">
        <button
          type="button"
          onClick={() => setActiveTab("verse")}
          className={cn(
            "flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer",
            activeTab === "verse"
              ? "bg-background text-foreground shadow-sm font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span>Verse</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("song")}
          className={cn(
            "flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer",
            activeTab === "song"
              ? "bg-background text-foreground shadow-sm font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Music className="w-3.5 h-3.5 text-primary" />
          <span>Song</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("lyric")}
          className={cn(
            "flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer",
            activeTab === "lyric"
              ? "bg-background text-foreground shadow-sm font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <FileText className="w-3.5 h-3.5 text-primary" />
          <span>Lyric</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={cn(
            "flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer",
            activeTab === "media"
              ? "bg-background text-foreground shadow-sm font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Film className="w-3.5 h-3.5 text-primary" />
          <span>Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("text")}
          className={cn(
            "flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer",
            activeTab === "text"
              ? "bg-background text-foreground shadow-sm font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Type className="w-3.5 h-3.5 text-primary" />
          <span>Text</span>
        </button>
      </nav>

      {/* Main Tab Body */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "verse" && <MobileVerseTab />}
        {activeTab === "song" && <MobileSongTab />}
        {activeTab === "lyric" && <MobileLyricTab />}
        {activeTab === "media" && <MobileMediaTab />}
        {activeTab === "text" && <MobileTextTab />}
      </main>
    </div>
  );
}
