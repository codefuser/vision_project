/**
 * Remote Desktop Controller View Component
 * Provides pairing code input, controller nickname configuration,
 * waiting-for-approval state, and embeds the interactive 16:9 RemoteDesktopViewer.
 */

import { memo, useState } from "react";
import {
  Laptop,
  ArrowRight,
  ShieldCheck,
  Clock,
  AlertCircle,
  Sparkles,
  Wifi,
  MousePointer,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useControllerRemoteDesktop } from "../stores/rd-controller.store";
import { RemoteDesktopViewer } from "./RemoteDesktopViewer";

export const RemoteDesktopControllerView = memo(function RemoteDesktopControllerView() {
  const {
    status,
    sessionId: activeSessionId,
    pin: activePin,
    controllerName,
    remoteStream,
    errorMessage,
    setControllerName,
    connect,
    disconnect,
  } = useControllerRemoteDesktop();

  const [inputSessionId, setInputSessionId] = useState("");
  const [inputPin, setInputPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSessionId || !inputPin) return;

    setIsSubmitting(true);
    await connect(inputSessionId, inputPin, controllerName);
    setIsSubmitting(false);
  };

  // Once connected, render the interactive remote viewer
  if (status === "connected") {
    return <RemoteDesktopViewer />;
  }

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto items-center justify-center p-4 sm:p-6 bg-background text-foreground">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-primary/10 text-primary items-center justify-center shadow-inner">
            <Laptop className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Connect to Remote Desktop</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Control the Host laptop&apos;s desktop, open applications, File Explorer, and system windows in real time.
          </p>
        </div>

        {/* Status: Waiting for approval */}
        {status === "waiting_approval" ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 text-center space-y-4 shadow-xl">
            <div className="relative mx-auto h-12 w-12">
              <span className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
              <div className="relative h-12 w-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40">
                <Clock className="h-6 w-6 animate-spin" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-amber-200">Waiting for Host Approval</h3>
              <p className="text-xs text-amber-300/80">
                Please look at the Host laptop. The operator must click &quot;Approve Connection&quot; to begin remote control.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => disconnect()}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 cursor-pointer transition"
              >
                Cancel Request
              </button>
            </div>
          </div>
        ) : (
          /* Form Entry */
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl space-y-5">
            {errorMessage && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 flex items-start gap-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Session ID */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rd-session-id"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Session ID
                </label>
                <input
                  id="rd-session-id"
                  type="text"
                  placeholder="e.g. RD-7492"
                  value={inputSessionId}
                  onChange={(e) => setInputSessionId(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-base font-mono font-bold tracking-wider placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary uppercase transition"
                  required
                />
              </div>

              {/* Security PIN */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rd-pin"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  6-Digit Security PIN
                </label>
                <input
                  id="rd-pin"
                  type="password"
                  maxLength={6}
                  placeholder="••••••"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-base font-mono font-bold tracking-widest placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  required
                />
              </div>

              {/* Controller Nickname */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rd-device-name"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Your Device Nickname
                </label>
                <input
                  id="rd-device-name"
                  type="text"
                  placeholder="e.g. Sound Booth Laptop"
                  value={controllerName}
                  onChange={(e) => setControllerName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !inputSessionId || !inputPin}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? "Connecting..." : "Connect to Remote Desktop"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground/80 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>P2P WebRTC Encrypted</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MousePointer className="h-3.5 w-3.5 text-primary" />
                <span>Sub-50ms Low Latency</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
