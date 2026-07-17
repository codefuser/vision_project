import { useEffect, useState, type ReactNode } from "react";
import { MonitorPlay } from "lucide-react";
import { startupManager, buildSteps } from "@/lib/startup/startup-manager";

export function StartupScreen({ onReady, children }: { onReady: () => void; children: ReactNode }) {
  const [progress, setProgress] = useState(startupManager.progress);
  const [fadeOut, setFadeOut] = useState(false);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const unsub = startupManager.subscribe(setProgress);
    return unsub;
  }, []);

  useEffect(() => {
    if (progress.done) {
      setFadeOut(true);
      const t = setTimeout(() => {
        setShowApp(true);
        onReady();
      }, 400);
      return () => clearTimeout(t);
    }
  }, [progress.done, onReady]);

  useEffect(() => {
    const steps = buildSteps();
    startupManager.execute(steps);
  }, []);

  if (showApp) {
    return <>{children}</>;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <LogoIcon />
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Vision Projector
          </h1>
          <p className="text-sm text-muted-foreground">Church Presentation Software</p>
        </div>

        <LoadingRing progress={progress.percent} />

        <div className="flex flex-col items-center gap-2">
          <StatusMessage message={progress.message} />
          <div className="flex items-center gap-2">
            <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span className="min-w-[3ch] text-right text-xs tabular-nums text-muted-foreground">
              {progress.percent}%
            </span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-muted-foreground/50">
          Offline-first · Local only
        </div>
      </div>
    </div>
  );
}

function LogoIcon() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <div className="absolute inset-0 rounded-2xl bg-primary/10" />
      <MonitorPlay className="relative h-8 w-8 text-primary" />
    </div>
  );
}

function LoadingRing({ progress }: { progress: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute">
        <div className="h-10 w-10 animate-pulse rounded-full bg-primary/5" />
      </div>
    </div>
  );
}

function StatusMessage({ message }: { message: string }) {
  const [displayed, setDisplayed] = useState(message);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message === displayed) return;
    setVisible(false);
    const t1 = setTimeout(() => {
      setDisplayed(message);
      setVisible(true);
    }, 200);
    return () => clearTimeout(t1);
  }, [message, displayed]);

  return (
    <p
      className={`h-5 text-center text-sm text-muted-foreground transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {displayed}
    </p>
  );
}
