import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MonitorPlay } from "lucide-react";
import { startupManager, buildSteps } from "@/lib/startup/startup-manager";

const PARTICLE_COUNT = 14;

export function StartupScreen({ onReady, children }: { onReady: () => void; children: ReactNode }) {
  const [progress, setProgress] = useState(startupManager.progress);
  const [fadeOut, setFadeOut] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [complete, setComplete] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 15,
    }));
  }, []);

  useEffect(() => {
    const unsub = startupManager.subscribe(setProgress);
    return unsub;
  }, []);

  useEffect(() => {
    if (progress.done) {
      setComplete(true);
      const t1 = setTimeout(() => setFadeOut(true), 600);
      const t2 = setTimeout(() => {
        setShowApp(true);
        onReady();
      }, 1100);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="startup-particle"
            style={{
              left: `${p.left}%`,
              bottom: "-10px",
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: "hsl(var(--primary))",
              opacity: 0.15,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo with animated glow */}
        <div className="relative flex items-center justify-center">
          <div
            className={`absolute h-20 w-20 rounded-full bg-primary/10 blur-xl transition-all duration-700 ${
              complete ? "scale-150 opacity-0" : "opacity-100"
            }`}
            style={{ animation: "startup-glow-pulse 3s ease-in-out infinite" }}
          />
          <div
            className="relative flex h-16 w-16 items-center justify-center"
            style={{ animation: "startup-logo-breath 3s ease-in-out infinite" }}
          >
            <div className="absolute inset-0 rounded-2xl border border-primary/20 bg-primary/8" />
            <MonitorPlay className="relative h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ animation: "startup-fade-in-up 0.6s ease-out" }}
          >
            Vision Projector
          </h1>
          <p
            className="text-sm text-muted-foreground/70"
            style={{ animation: "startup-fade-in-up 0.6s ease-out 0.15s both" }}
          >
            Church Presentation Software
          </p>
        </div>

        {/* Loader */}
        <Loader progress={progress.percent} complete={complete} />

        {/* Status & Progress */}
        <div className="flex flex-col items-center gap-3">
          <StatusMessage message={progress.message} />
          <div className="flex items-center gap-3">
            <div className="relative h-1.5 w-56 overflow-hidden rounded-full bg-muted/60">
              <div
                className="relative h-full w-full rounded-full"
                style={{
                  clipPath: `inset(0 ${100 - progress.percent}% 0 0)`,
                  transition: "clip-path 0.5s ease-out",
                }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/80 via-primary to-primary/60" />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "startup-shimmer 2s linear infinite",
                  }}
                />
                <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm" />
              </div>
            </div>
            <span className="min-w-[3ch] text-right text-xs tabular-nums text-muted-foreground/60">
              {progress.percent}%
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-1 text-[10px] text-muted-foreground/30">
          Offline-first · Local only
        </div>
      </div>
    </div>
  );
}

function Loader({ progress, complete }: { progress: number; complete: boolean }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rotating arcs (ornamental) */}
      <div
        className="absolute"
        style={{
          animation: "startup-arc-spin 4s linear infinite",
          opacity: 0.3,
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeDasharray="28 170"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </div>
      <div
        className="absolute"
        style={{
          animation: "startup-arc-spin-reverse 5s linear infinite",
          opacity: 0.2,
        }}
      >
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r="40"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.8"
            strokeDasharray="20 190"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Progress ring */}
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2.5"
          opacity="0.3"
        />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center dot */}
      <div
        className={`absolute h-2 w-2 rounded-full bg-primary transition-all duration-700 ${
          complete ? "scale-150 opacity-0" : "opacity-60"
        }`}
      />
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
      className={`h-4 text-center text-xs text-muted-foreground/50 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {displayed}
    </p>
  );
}
