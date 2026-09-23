/**
 * Remote Desktop Page
 * Main container switching between Host and Controller modes.
 */

import { memo, useState } from "react";
import { Monitor, Laptop, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { RemoteDesktopHostView } from "./components/RemoteDesktopHostView";
import { RemoteDesktopControllerView } from "./components/RemoteDesktopControllerView";
import { useControllerRemoteDesktop } from "./stores/rd-controller.store";

export const RemoteDesktopPage = memo(function RemoteDesktopPage() {
  const [activeTab, setActiveTab] = useState<"host" | "controller">("host");
  const controllerStatus = useControllerRemoteDesktop((s) => s.status);
  const isControllerLive = controllerStatus === "connected";

  // If controller is currently streaming live, render viewer without tab bar interference
  if (isControllerLive) {
    return (
      <div className="h-full w-full bg-black">
        <RemoteDesktopControllerView />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background text-foreground select-none">
      {/* Top Tab Mode Switcher */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border/40">
          <button
            onClick={() => setActiveTab("host")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition",
              activeTab === "host"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Host Mode (Share Screen)</span>
          </button>

          <button
            onClick={() => setActiveTab("controller")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition",
              activeTab === "controller"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>Controller Mode (Connect)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Encrypted WebRTC P2P</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "host" ? <RemoteDesktopHostView /> : <RemoteDesktopControllerView />}
      </main>
    </div>
  );
});
