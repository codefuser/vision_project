import { useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import { MonitorPlay } from "lucide-react";
import { startupManager, buildSteps } from "@/lib/startup/startup-manager";
import { VersoLynLogo } from "@/components/ui/VersoLynLogo";

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
          {/* Subtle soft ambient outer glow behind logo */}
          <div
            className={`absolute h-36 w-36 rounded-full blur-2xl transition-opacity duration-700 pointer-events-none ${
              complete ? "opacity-0" : "opacity-35 dark:opacity-45"
            }`}
            style={{
              background:
                "radial-gradient(circle, rgba(79,140,255,0.45) 0%, rgba(124,92,255,0.35) 50%, transparent 75%)",
            }}
          />
          <div
            className="relative flex items-center justify-center transition-transform duration-300"
            style={{ animation: "startup-logo-breath 3.5s ease-in-out infinite" }}
          >
            <VersoLynLogo className="h-32 w-32 md:h-40 md:w-40 object-contain transition-transform duration-300 select-none" />
          </div>
        </div>

        <div
          className="flex flex-col items-center gap-1"
          style={{ animation: "startup-fade-in-up 0.6s ease-out" }}
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            VersoLyn
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
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

          <div className="flex items-center gap-2 text-xs tabular-nums text-foreground/80">
            <div className="relative h-1.5 w-60 md:w-72 overflow-hidden rounded-full border border-border/40 bg-muted/80 dark:bg-muted/30 shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-150 ease-out bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-500 dark:via-indigo-500 dark:to-sky-400 shadow-sm"
                style={{
                  width: `${smoothPercent}%`,
                  boxShadow: "0 0 8px rgba(79,140,255,0.4)",
                }}
              />
            </div>
            <span className="min-w-[3ch] text-right font-semibold text-foreground/80">{smoothPercent}%</span>
          </div>
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
      className={`h-4 text-center text-xs font-medium text-muted-foreground transition-opacity duration-150 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {displayed}
    </p>
  );
}
