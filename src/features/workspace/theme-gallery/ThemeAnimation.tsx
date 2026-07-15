import { useEffect, useRef } from "react";
import type { BackgroundAnimation } from "@/lib/broadcast";
import { cn } from "@/lib/utils";

let injected = false;
function injectAnimCSS() {
  if (injected) return;
  injected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes aurora-flow {
      0% { transform: translateX(-15%) translateY(-10%) scale(1); opacity: 0.55; }
      25% { transform: translateX(5%) translateY(-5%) scale(1.08); opacity: 0.75; }
      50% { transform: translateX(15%) translateY(10%) scale(0.95); opacity: 0.55; }
      75% { transform: translateX(-5%) translateY(5%) scale(1.05); opacity: 0.7; }
      100% { transform: translateX(-15%) translateY(-10%) scale(1); opacity: 0.55; }
    }
    @keyframes aurora-flow-2 {
      0% { transform: translateX(10%) translateY(5%) scale(0.9); opacity: 0.3; }
      33% { transform: translateX(-10%) translateY(-5%) scale(1.1); opacity: 0.55; }
      66% { transform: translateX(5%) translateY(10%) scale(0.95); opacity: 0.4; }
      100% { transform: translateX(10%) translateY(5%) scale(0.9); opacity: 0.3; }
    }
    @keyframes aurora-band {
      0% { transform: translateX(-20%) skewX(-5deg); opacity: 0.35; }
      50% { transform: translateX(20%) skewX(5deg); opacity: 0.65; }
      100% { transform: translateX(-20%) skewX(-5deg); opacity: 0.35; }
    }
    @keyframes aurora-borealis-flow {
      0% { transform: translateY(-5%) translateX(-10%) scale(1); opacity: 0.4; }
      33% { transform: translateY(5%) translateX(10%) scale(1.1); opacity: 0.7; }
      66% { transform: translateY(0%) translateX(-5%) scale(0.95); opacity: 0.5; }
      100% { transform: translateY(-5%) translateX(-10%) scale(1); opacity: 0.4; }
    }
    @keyframes aurora-borealis-band {
      0% { transform: translateX(-30%) skewX(-5deg); opacity: 0.25; }
      50% { transform: translateX(30%) skewX(5deg); opacity: 0.5; }
      100% { transform: translateX(-30%) skewX(-5deg); opacity: 0.25; }
    }
    @keyframes particles-float {
      0% { transform: translateY(100%) translateX(0) scale(1); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.6; }
      100% { transform: translateY(-100%) translateX(20px) scale(0.3); opacity: 0; }
    }
    @keyframes bokeh-float {
      0% { transform: translateY(100%) translateX(0) scale(1); opacity: 0; }
      20% { opacity: 0.5; }
      80% { opacity: 0.3; }
      100% { transform: translateY(-100%) translateX(-15px) scale(1.5); opacity: 0; }
    }
    @keyframes gradient-sweep {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes rays-rotate {
      0% { transform: rotate(0deg) scale(1); opacity: 0.18; }
      50% { opacity: 0.28; }
      100% { transform: rotate(360deg) scale(1); opacity: 0.18; }
    }
    @keyframes clouds-drift {
      0% { transform: translateX(-30%) translateY(0) scale(1); opacity: 0.2; }
      50% { transform: translateX(10%) translateY(-5%) scale(1.05); opacity: 0.38; }
      100% { transform: translateX(-30%) translateY(0) scale(1); opacity: 0.2; }
    }
    @keyframes clouds-drift-2 {
      0% { transform: translateX(20%) translateY(0) scale(1.2); opacity: 0.15; }
      50% { transform: translateX(-10%) translateY(5%) scale(1); opacity: 0.28; }
      100% { transform: translateX(20%) translateY(0) scale(1.2); opacity: 0.15; }
    }
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.05); }
    }
    @keyframes wave-motion {
      0% { transform: translateX(-10%) scaleY(1); opacity: 0.2; }
      50% { transform: translateX(10%) scaleY(1.2); opacity: 0.35; }
      100% { transform: translateX(-10%) scaleY(1); opacity: 0.2; }
    }
    @keyframes stars-twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }
    @keyframes rain-fall {
      0% { transform: translateY(-100%) translateX(0); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.4; }
      100% { transform: translateY(200%) translateX(-10px); opacity: 0; }
    }
    @keyframes fireflies-drift {
      0% { transform: translate(0, 0) scale(1); opacity: 0; }
      20% { opacity: 0.9; }
      80% { opacity: 0.7; }
      100% { transform: translate(30px, -60px) scale(0.5); opacity: 0; }
    }
    @keyframes cross-glow {
      0%, 100% { opacity: 0.2; filter: blur(4px); }
      50% { opacity: 0.55; filter: blur(2px); }
    }
    @keyframes gentle-rise {
      0% { transform: translateY(5%); opacity: 0.4; }
      50% { transform: translateY(-2%); opacity: 0.7; }
      100% { transform: translateY(5%); opacity: 0.4; }
    }
    @keyframes ribbon-flow {
      0% { transform: translateX(-25%) translateY(-10%) rotate(-2deg); opacity: 0.12; }
      25% { transform: translateX(5%) translateY(5%) rotate(1deg); opacity: 0.22; }
      50% { transform: translateX(25%) translateY(-5%) rotate(2deg); opacity: 0.12; }
      75% { transform: translateX(5%) translateY(10%) rotate(-1deg); opacity: 0.22; }
      100% { transform: translateX(-25%) translateY(-10%) rotate(-2deg); opacity: 0.12; }
    }
    @keyframes ribbon-flow-2 {
      0% { transform: translateX(25%) translateY(10%) rotate(2deg); opacity: 0.1; }
      25% { transform: translateX(-5%) translateY(-5%) rotate(-1deg); opacity: 0.18; }
      50% { transform: translateX(-25%) translateY(5%) rotate(-2deg); opacity: 0.1; }
      75% { transform: translateX(-5%) translateY(-10%) rotate(1deg); opacity: 0.18; }
      100% { transform: translateX(25%) translateY(10%) rotate(2deg); opacity: 0.1; }
    }
    @keyframes nebula-spin {
      0% { transform: rotate(0deg) scale(1); opacity: 0.18; }
      50% { transform: rotate(180deg) scale(1.15); opacity: 0.35; }
      100% { transform: rotate(360deg) scale(1); opacity: 0.18; }
    }
    @keyframes nebula-pulse {
      0%, 100% { opacity: 0.15; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(1.08); }
    }
    @keyframes galaxy-spin {
      0% { transform: rotate(0deg) scale(1); opacity: 0.2; }
      100% { transform: rotate(360deg) scale(1); opacity: 0.2; }
    }
    @keyframes bloom-expand {
      0% { transform: scale(0); opacity: 0.25; }
      50% { opacity: 0.15; }
      100% { transform: scale(2); opacity: 0; }
    }
    @keyframes flare-pulse {
      0%, 100% { opacity: 0; transform: scale(0.6); }
      20% { opacity: 0.2; transform: scale(1); }
      80% { opacity: 0.08; }
    }
    @keyframes smoke-drift {
      0% { transform: translateX(-10%) translateY(0) scale(1); opacity: 0.08; }
      50% { transform: translateX(10%) translateY(-15%) scale(1.3); opacity: 0.2; }
      100% { transform: translateX(-10%) translateY(0) scale(1); opacity: 0.08; }
    }
    @keyframes velvet-wave {
      0% { transform: translateX(-5%) skewX(0deg); opacity: 0.2; }
      50% { transform: translateX(5%) skewX(2deg); opacity: 0.38; }
      100% { transform: translateX(-5%) skewX(0deg); opacity: 0.2; }
    }
    @keyframes heaven-light-beam {
      0% { transform: translateY(-100%) translateX(10%) rotate(3deg); opacity: 0; }
      20% { opacity: 0.2; }
      80% { opacity: 0.12; }
      100% { transform: translateY(100%) translateX(-10%) rotate(-3deg); opacity: 0; }
    }
    @keyframes heaven-light-beam-2 {
      0% { transform: translateY(100%) translateX(-15%) rotate(-2deg); opacity: 0; }
      20% { opacity: 0.15; }
      80% { opacity: 0.1; }
      100% { transform: translateY(-100%) translateX(15%) rotate(2deg); opacity: 0; }
    }
    .preview-aurora { animation: aurora-flow 10s ease-in-out infinite; }
    .preview-aurora-2 { animation: aurora-flow-2 14s ease-in-out infinite; }
    .preview-aurora-band { animation: aurora-band 8s ease-in-out infinite; }
    .preview-aurora-borealis { animation: aurora-borealis-flow 12s ease-in-out infinite; }
    .preview-aurora-borealis-2 { animation: aurora-borealis-flow 16s ease-in-out infinite 3s; }
    .preview-aurora-borealis-band { animation: aurora-borealis-band 9s ease-in-out infinite; }
    .preview-particle { animation: particles-float 6s linear infinite; }
    .preview-bokeh { animation: bokeh-float 8s linear infinite; }
    .preview-gradient { background-size: 200% 200%; animation: gradient-sweep 6s ease infinite; }
    .preview-rays { animation: rays-rotate 20s linear infinite; }
    .preview-cloud { animation: clouds-drift 12s ease-in-out infinite; }
    .preview-cloud-2 { animation: clouds-drift-2 16s ease-in-out infinite; }
    .preview-glow { animation: glow-pulse 4s ease-in-out infinite; }
    .preview-wave { animation: wave-motion 5s ease-in-out infinite; }
    .preview-star { animation: stars-twinkle 3s ease-in-out infinite; }
    .preview-rain { animation: rain-fall 1.2s linear infinite; }
    .preview-firefly { animation: fireflies-drift 5s ease-in-out infinite; }
    .preview-cross { animation: cross-glow 3s ease-in-out infinite; }
    .preview-rise { animation: gentle-rise 7s ease-in-out infinite; }
    .preview-ribbon { animation: ribbon-flow 14s ease-in-out infinite; }
    .preview-ribbon-2 { animation: ribbon-flow-2 18s ease-in-out infinite; }
    .preview-nebula { animation: nebula-spin 25s linear infinite; }
    .preview-nebula-pulse { animation: nebula-pulse 8s ease-in-out infinite; }
    .preview-galaxy { animation: galaxy-spin 40s linear infinite; }
    .preview-bloom { animation: bloom-expand 4s ease-out infinite; }
    .preview-flare { animation: flare-pulse 3s ease-in-out infinite; }
    .preview-smoke { animation: smoke-drift 10s ease-in-out infinite; }
    .preview-velvet { animation: velvet-wave 6s ease-in-out infinite; }
    .preview-heaven { animation: heaven-light-beam 8s ease-in-out infinite; }
    .preview-heaven-2 { animation: heaven-light-beam-2 10s ease-in-out infinite 2s; }
    .paused .preview-aurora, .paused .preview-aurora-2, .paused .preview-aurora-band,
    .paused .preview-aurora-borealis, .paused .preview-aurora-borealis-2, .paused .preview-aurora-borealis-band,
    .paused .preview-particle, .paused .preview-bokeh, .paused .preview-gradient,
    .paused .preview-rays, .paused .preview-cloud, .paused .preview-cloud-2,
    .paused .preview-glow, .paused .preview-wave, .paused .preview-star,
    .paused .preview-rain, .paused .preview-firefly, .paused .preview-cross,
    .paused .preview-rise, .paused .preview-ribbon, .paused .preview-ribbon-2,
    .paused .preview-nebula, .paused .preview-nebula-pulse, .paused .preview-galaxy,
    .paused .preview-bloom, .paused .preview-flare, .paused .preview-smoke,
    .paused .preview-velvet, .paused .preview-heaven, .paused .preview-heaven-2 {
      animation-play-state: paused !important;
    }
  `;
  document.head.appendChild(style);
}

function useAnimStyles() {
  const loaded = useRef(false);
  useEffect(() => {
    if (!loaded.current) { injectAnimCSS(); loaded.current = true; }
  }, []);
}

interface AnimProps { paused?: boolean }

function AuroraAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-aurora absolute -inset-4 bg-gradient-to-b from-emerald-400/25 via-cyan-500/20 to-purple-500/20" />
      <div className="preview-aurora-2 absolute -inset-4 bg-gradient-to-t from-blue-400/15 via-indigo-500/10 to-pink-500/15" />
      <div className="preview-aurora-band absolute left-0 right-0 top-1/3 h-1/3 bg-gradient-to-r from-transparent via-green-400/10 to-transparent" />
    </div>
  );
}

function AuroraBorealisAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-aurora-borealis absolute -inset-4 bg-gradient-to-t from-pink-500/20 via-purple-500/25 to-cyan-400/15" />
      <div className="preview-aurora-borealis-2 absolute -inset-4 bg-gradient-to-b from-indigo-400/15 via-emerald-400/10 to-transparent" />
      <div className="preview-aurora-borealis-band absolute left-0 right-0 top-1/4 h-1/2 bg-gradient-to-r from-transparent via-pink-400/10 to-transparent" />
    </div>
  );
}

function ParticleAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="preview-particle absolute h-1 w-1 rounded-full bg-white/60"
          style={{ left: `${(i * 8.3) % 100}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${4 + (i % 3) * 2}s` }} />
      ))}
    </div>
  );
}

function GoldenParticleAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="preview-particle absolute h-1 w-1 rounded-full"
          style={{
            left: `${(i * 10) % 100}%`,
            background: i % 2 === 0 ? "#fbbf24" : "#f59e0b",
            boxShadow: "0 0 3px rgba(251,191,36,0.6)",
            animationDelay: `${i * 0.4}s`, animationDuration: `${5 + (i % 4) * 1.5}s`,
          }} />
      ))}
    </div>
  );
}

function BokehAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="preview-bokeh absolute rounded-full"
          style={{
            width: `${20 + (i % 3) * 15}px`, height: `${20 + (i % 3) * 15}px`,
            left: `${(i * 17) % 100}%`,
            background: i % 2 === 0 ? "rgba(255,255,255,0.08)" : "rgba(147,197,253,0.1)",
            filter: "blur(4px)",
            animationDelay: `${i * 1.2}s`, animationDuration: `${7 + i * 0.8}s`,
          }} />
      ))}
    </div>
  );
}

function GradientAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-gradient absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15), rgba(236,72,153,0.1), rgba(99,102,241,0.2))" }} />
    </div>
  );
}

function RaysAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-rays absolute inset-0"
        style={{ background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.04), transparent, rgba(255,255,255,0.06), transparent, rgba(255,255,255,0.03), transparent)", transformOrigin: "center" }} />
      <div className="preview-rays absolute inset-0"
        style={{ background: "conic-gradient(from 90deg, transparent, rgba(251,191,36,0.03), transparent, rgba(251,191,36,0.04), transparent)", transformOrigin: "center", animationDelay: "-10s" }} />
    </div>
  );
}

function CloudsAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-cloud absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-white/10 blur-xl" />
      <div className="preview-cloud-2 absolute -bottom-1/4 -right-1/4 h-[60%] w-[60%] rounded-full bg-white/8 blur-2xl" />
      <div className="preview-cloud absolute left-1/3 top-1/4 h-1/3 w-1/3 rounded-full bg-white/6 blur-3xl" style={{ animationDelay: "-6s" }} />
    </div>
  );
}

function GlowAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-glow absolute left-1/3 right-1/3 top-1/4 bottom-1/4 rounded-full bg-amber-400/15 blur-2xl" />
      <div className="preview-glow absolute left-1/2 right-1/4 top-1/2 bottom-1/3 rounded-full bg-orange-400/10 blur-3xl" style={{ animationDelay: "-2s" }} />
    </div>
  );
}

function FireGlowAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-glow absolute left-1/4 right-1/4 bottom-0 h-2/3 rounded-[50%] bg-red-500/15 blur-3xl" />
      <div className="preview-glow absolute left-1/3 right-1/3 bottom-0 h-1/2 rounded-[50%] bg-orange-400/10 blur-2xl" style={{ animationDelay: "-1.5s" }} />
    </div>
  );
}

function WaveAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-wave absolute -bottom-4 left-0 right-0 h-1/3 rounded-[50%] bg-blue-400/10" />
      <div className="preview-wave absolute -bottom-6 left-0 right-0 h-1/4 rounded-[50%] bg-cyan-400/8" style={{ animationDelay: "-2.5s" }} />
      <div className="preview-wave absolute -bottom-2 left-0 right-0 h-1/5 rounded-[50%] bg-blue-300/6" style={{ animationDelay: "-1.2s", animationDuration: "7s" }} />
    </div>
  );
}

function StarsAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="preview-star absolute h-0.5 w-0.5 rounded-full bg-white"
          style={{ left: `${(i * 6.7) % 100}%`, top: `${(i * 9.3) % 90}%`, animationDelay: `${i * 0.2}s`, animationDuration: `${2 + (i % 5) * 0.8}s` }} />
      ))}
    </div>
  );
}

function RainAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="preview-rain absolute h-3 w-px bg-white/30"
          style={{ left: `${(i * 5) % 100}%`, animationDelay: `${i * 0.06}s`, animationDuration: `${0.8 + (i % 3) * 0.3}s` }} />
      ))}
    </div>
  );
}

function SnowAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="preview-rain absolute h-1.5 w-1.5 rounded-full bg-white/50"
          style={{ left: `${(i * 5.6) % 100}%`, filter: "blur(0.5px)", animationDelay: `${i * 0.15}s`, animationDuration: `${2 + (i % 4) * 0.5}s` }} />
      ))}
    </div>
  );
}

function FirefliesAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="preview-firefly absolute h-1 w-1 rounded-full"
          style={{
            left: `${(i * 17) % 100}%`, top: `${((i * 13) % 100) - 20}%`,
            background: i % 2 === 0 ? "#fef08a" : "#fde047",
            boxShadow: "0 0 4px rgba(253,224,71,0.6)",
            animationDelay: `${i * 0.8}s`, animationDuration: `${4 + i * 0.5}s`,
          }} />
      ))}
    </div>
  );
}

function CrossAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", paused && "paused")}>
      <div className="preview-cross relative h-10 w-2 rounded bg-amber-400/30">
        <div className="absolute -left-3 top-3 h-2 w-8 rounded bg-amber-400/30" />
      </div>
    </div>
  );
}

function DustAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="preview-firefly absolute h-0.5 w-0.5 rounded-full bg-white/40"
          style={{ left: `${(i * 12.5) % 100}%`, top: `${(i * 15) % 80}%`, animationDelay: `${i * 0.6}s`, animationDuration: `${6 + i * 1.2}s` }} />
      ))}
    </div>
  );
}

function RiseAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-rise absolute inset-0 bg-gradient-to-t from-orange-400/10 via-amber-400/5 to-transparent" />
      <div className="preview-rise absolute left-1/3 right-1/3 top-1/3 h-1/4 rounded-full bg-amber-400/8 blur-2xl" style={{ animationDelay: "-3s" }} />
    </div>
  );
}

function RibbonAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-ribbon absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-[40%] bg-gradient-to-br from-purple-400/10 via-pink-400/8 to-transparent blur-2xl" />
      <div className="preview-ribbon-2 absolute -right-1/4 -bottom-1/4 h-3/4 w-3/4 rounded-[40%] bg-gradient-to-tl from-blue-400/8 via-indigo-400/10 to-transparent blur-2xl" />
    </div>
  );
}

function NebulaAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-nebula absolute -inset-8 rounded-full bg-gradient-to-br from-purple-600/10 via-pink-500/8 to-blue-600/15 blur-3xl" />
      <div className="preview-nebula-pulse absolute inset-0 bg-gradient-to-tr from-fuchsia-500/5 via-transparent to-cyan-400/8" />
      <div className="preview-nebula absolute -inset-4 rounded-full bg-gradient-to-tl from-blue-500/10 via-transparent to-purple-500/8 blur-3xl" style={{ animationDirection: "reverse", animationDuration: "35s" }} />
    </div>
  );
}

function GalaxyAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-galaxy absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/8 via-purple-400/5 to-blue-600/10 blur-2xl" />
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="preview-star absolute h-0.5 w-0.5 rounded-full bg-white"
          style={{
            left: `${(i * 5) % 100}%`, top: `${((i * 7) + 10) % 90}%`,
            opacity: 0.2 + (i % 5) * 0.15,
            animationDelay: `${i * 0.15}s`, animationDuration: `${1.5 + (i % 4) * 0.5}s`,
          }} />
      ))}
    </div>
  );
}

function BloomAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="preview-bloom absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={{ animationDelay: `${i * 1.3}s`, animationDuration: `${3.5 + i * 0.5}s` }} />
      ))}
    </div>
  );
}

function LensFlareAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="preview-flare absolute h-3 w-3 rounded-full"
          style={{
            left: `${30 + i * 25}%`, top: `${20 + i * 20}%`,
            background: i === 0 ? "radial-gradient(circle, rgba(255,255,255,0.15), transparent)" : "radial-gradient(circle, rgba(251,191,36,0.08), transparent)",
            filter: "blur(3px)",
            animationDelay: `${i * 1}s`, animationDuration: `${2.5 + i * 0.5}s`,
          }} />
      ))}
    </div>
  );
}

function SmokeAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-smoke absolute bottom-0 left-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-t from-white/5 via-white/3 to-transparent blur-3xl" />
      <div className="preview-smoke absolute bottom-0 right-1/4 h-2/3 w-1/3 rounded-full bg-gradient-to-t from-indigo-300/5 via-transparent to-transparent blur-3xl" style={{ animationDelay: "-3s" }} />
    </div>
  );
}

function VelvetAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-velvet absolute -inset-4 bg-gradient-to-r from-red-600/10 via-rose-500/8 to-pink-600/12 blur-3xl" />
      <div className="preview-velvet absolute -inset-4 bg-gradient-to-b from-rose-400/5 via-transparent to-red-500/10 blur-2xl" style={{ animationDelay: "-3s" }} />
    </div>
  );
}

function HeavenLightAnim({ paused }: AnimProps) {
  useAnimStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="preview-heaven absolute -left-4 -right-4 top-0 h-3/4 skew-y-3 bg-gradient-to-b from-amber-200/8 via-yellow-300/5 to-transparent blur-xl" />
      <div className="preview-heaven-2 absolute -left-4 -right-4 top-0 h-2/3 -skew-y-2 bg-gradient-to-b from-yellow-100/6 via-amber-200/4 to-transparent blur-2xl" />
    </div>
  );
}

const ANIM_MAP: Record<string, React.FC<AnimProps>> = {
  aurora: AuroraAnim,
  "aurora-borealis": AuroraBorealisAnim,
  particles: ParticleAnim,
  "golden-particles": GoldenParticleAnim,
  bokeh: BokehAnim,
  "gradient-shift": GradientAnim,
  "light-rays": RaysAnim,
  "cross-beam": RaysAnim,
  "stage-lights": RaysAnim,
  clouds: CloudsAnim,
  fog: CloudsAnim,
  "candle-glow": GlowAnim,
  "soft-glow": GlowAnim,
  "fire-glow": FireGlowAnim,
  ocean: WaveAnim,
  water: WaveAnim,
  "star-field": StarsAnim,
  rain: RainAnim,
  snow: SnowAnim,
  fireflies: FirefliesAnim,
  "floating-cross": CrossAnim,
  "floating-dust": DustAnim,
  "sky-motion": RiseAnim,
  sunrise: RiseAnim,
  sunset: RiseAnim,
  "abstract-worship": GradientAnim,
  sparkles: GoldenParticleAnim,
  ribbon: RibbonAnim,
  nebula: NebulaAnim,
  galaxy: GalaxyAnim,
  bloom: BloomAnim,
  "lens-flare": LensFlareAnim,
  smoke: SmokeAnim,
  velvet: VelvetAnim,
  "heaven-light": HeavenLightAnim,
};

export function ThemeAnimation({ animation, paused }: { animation: BackgroundAnimation; paused?: boolean }) {
  const Comp = ANIM_MAP[animation];
  if (!Comp) return null;
  return <Comp paused={paused} />;
}

export function getAnimationLabel(animation: BackgroundAnimation): string {
  const labels: Record<string, string> = {
    aurora: "Aurora",
    "aurora-borealis": "Aurora Borealis",
    particles: "Particles",
    "golden-particles": "Golden Particles",
    bokeh: "Bokeh",
    "gradient-shift": "Gradient",
    "light-rays": "Light Rays",
    "cross-beam": "Cross Beam",
    "stage-lights": "Stage Lights",
    clouds: "Clouds",
    fog: "Fog",
    "candle-glow": "Candle Glow",
    "soft-glow": "Soft Glow",
    "fire-glow": "Fire Glow",
    ocean: "Ocean",
    water: "Water",
    "star-field": "Stars",
    rain: "Rain",
    snow: "Snow",
    fireflies: "Fireflies",
    "floating-cross": "Cross",
    "floating-dust": "Dust",
    "sky-motion": "Sky Motion",
    sunrise: "Sunrise",
    sunset: "Sunset",
    "abstract-worship": "Abstract",
    sparkles: "Sparkles",
    ribbon: "Ribbon",
    nebula: "Nebula",
    galaxy: "Galaxy",
    bloom: "Bloom",
    "lens-flare": "Lens Flare",
    smoke: "Smoke",
    velvet: "Velvet",
    "heaven-light": "Heaven Light",
  };
  return labels[animation] ?? animation;
}
