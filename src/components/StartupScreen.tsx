import { useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import { MonitorPlay } from "lucide-react";
import { startupManager, buildSteps } from "@/lib/startup/startup-manager";

const PARTICLE_COUNT = 10;
const BAR_COLORS = ["#4F8CFF", "#7C5CFF", "#45D6FF", "#7C5CFF", "#4F8CFF"];
const BAR_DELAYS = [0, 0.15, 0.3, 0.15, 0];

export function StartupScreen({ onReady, children }: { onReady: () => void; children: ReactNode }) {
  const [progress, setProgress] = useState(startupManager.progress);
  const [smoothPercent, setSmoothPercent] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [complete, setComplete] = useState(false);

  const currentPercentRef = useRef(0);
  const targetPercentRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 2,
      duration: 14 + Math.random() * 20,
      delay: Math.random() * 18,
    }));
  }, []);

  // Update target percentage when startupManager emits progress
  useEffect(() => {
    const unsub = startupManager.subscribe((p) => {
      setProgress(p);
      targetPercentRef.current = p.percent;
    });
    return unsub;
  }, []);

  // Smooth continuous step loop going strictly 1, 2, 3... 100 without skipping numbers
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const target = targetPercentRef.current;

      // Increase current by 1 step at a time up to target (or up to 100 if done)
      if (current < target) {
        current += 1;
        setSmoothPercent(current);
      } else if (progress.done && current < 100) {
        current += 1;
        setSmoothPercent(current);
      }

      if (progress.done && current >= 100) {
        clearInterval(interval);
        setComplete(true);
        setTimeout(() => setFadeOut(true), 250);
        setTimeout(() => {
          setShowApp(true);
          onReady();
        }, 600);
      }
    }, 20); // ~20ms per step for smooth numbers

    return () => clearInterval(interval);
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
            className={`absolute h-20 w-20 rounded-full blur-xl transition-all duration-500 ${
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

        <div style={{ animation: "startup-fade-in-up 0.6s ease-out 0.15s both" }}>
          <LoadingBars complete={complete} />
        </div>

        <div
          className="flex flex-col items-center gap-2.5"
          style={{ animation: "startup-fade-in-up 0.6s ease-out 0.3s both" }}
        >
          <StatusMessage message={progress.message} />

          <div
            className="flex items-center gap-2 text-xs tabular-nums"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <div
              className="relative h-1 w-48 overflow-hidden rounded-full"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full w-full rounded-full transition-all duration-150 ease-out"
                style={{
                  width: `${smoothPercent}%`,
                  background: "linear-gradient(90deg, #4F8CFF, #7C5CFF, #45D6FF)",
                  boxShadow: "0 0 6px rgba(79,140,255,0.3)",
                }}
              />
            </div>
            <span className="min-w-[3ch] text-right">{smoothPercent}%</span>
          </div>
        </div>

        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>
          Online-first · Cloud Database Ready
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
    }, 100);
    return () => clearTimeout(t1);
  }, [message, displayed]);

  return (
    <p
      className={`h-4 text-center text-xs transition-opacity duration-150 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ color: "rgba(255,255,255,0.4)" }}
    >
      {displayed}
    </p>
  );
}
