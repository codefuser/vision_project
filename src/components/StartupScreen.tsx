import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MonitorPlay } from "lucide-react";
import { startupManager, buildSteps } from "@/lib/startup/startup-manager";

const PARTICLE_COUNT = 10;

const BAR_COLORS = ["#4F8CFF", "#7C5CFF", "#45D6FF", "#7C5CFF", "#4F8CFF"];

const BAR_DELAYS = [0, 0.15, 0.3, 0.15, 0];

export function StartupScreen({ onReady, children }: { onReady: () => void; children: ReactNode }) {
  const [progress, setProgress] = useState(startupManager.progress);
  const [fadeOut, setFadeOut] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [complete, setComplete] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 2,
      duration: 14 + Math.random() * 20,
      delay: Math.random() * 18,
    }));
  }, []);

  useEffect(() => {
    const unsub = startupManager.subscribe(setProgress);
    return unsub;
  }, []);

  useEffect(() => {
    if (progress.done) {
      setComplete(true);
      const t1 = setTimeout(() => setFadeOut(true), 500);
      const t2 = setTimeout(() => {
        setShowApp(true);
        onReady();
      }, 1000);
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
              background: "#4F8CFF",
              opacity: 0.12,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-7">
        <div className="relative flex items-center justify-center">
          <div
            className={`absolute h-20 w-20 rounded-full blur-xl transition-all duration-700 ${
              complete ? "scale-150 opacity-0" : "opacity-100"
            }`}
            style={{
              background: "radial-gradient(circle, #4F8CFF 0%, #7C5CFF 50%, transparent 70%)",
              animation: "startup-glow-pulse 3.5s ease-in-out infinite",
            }}
          />
          <div
            className="relative flex h-16 w-16 items-center justify-center"
            style={{ animation: "startup-logo-breath 3.5s ease-in-out infinite" }}
          >
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5" />
            <MonitorPlay className="relative h-8 w-8" style={{ color: "#4F8CFF" }} />
          </div>
        </div>

        <div
          className="flex flex-col items-center gap-1"
          style={{ animation: "startup-fade-in-up 0.6s ease-out" }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Vision Projector
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Church Presentation Software
          </p>
        </div>

        <div
          style={{ animation: "startup-fade-in-up 0.6s ease-out 0.15s both" }}
        >
          <LoadingBars complete={complete} />
        </div>

        <div
          className="flex flex-col items-center gap-2.5"
          style={{ animation: "startup-fade-in-up 0.6s ease-out 0.3s both" }}
        >
          <StatusMessage message={progress.message} />

          <div className="flex items-center gap-2 text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.35)" }}>
            <div className="relative h-1 w-48 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full w-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress.percent}%`,
                  background: "linear-gradient(90deg, #4F8CFF, #7C5CFF, #45D6FF)",
                  boxShadow: "0 0 6px rgba(79,140,255,0.3)",
                }}
              />
            </div>
            <span className="min-w-[3ch] text-right">{progress.percent}%</span>
          </div>
        </div>

        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>
          Offline-first · Local only
        </div>
      </div>
    </div>
  );
}

function LoadingBars({ complete }: { complete: boolean }) {
  return (
    <div className="flex items-end gap-[5px]" style={{ height: 32 }}>
      {BAR_COLORS.map((color, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 5,
            height: 32,
            background: color,
            borderRadius: 3,
            transformOrigin: "bottom",
            animation: complete
              ? "none"
              : `startup-bar-wave 1.2s ease-in-out ${BAR_DELAYS[i]}s infinite`,
            transition: "opacity 0.5s",
            opacity: complete ? 0.3 : 1,
            boxShadow: `0 0 6px ${color}40`,
          }}
        />
      ))}
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
      className={`h-4 text-center text-xs transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ color: "rgba(255,255,255,0.4)" }}
    >
      {displayed}
    </p>
  );
}
