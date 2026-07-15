import { useEffect, useRef } from "react";
import type { BackgroundAnimation } from "@/lib/broadcast";
import { cn } from "@/lib/utils";

type AnimProps = { paused?: boolean };

let injected = false;
function injectAnimCSS() {
  if (injected) return;
  injected = true;
  const s = document.createElement("style");
  s.textContent = `
/* ── Architectural / Church ── */
@keyframes beam-drift { 0%{transform:translateX(-40%) rotate(-3deg);opacity:0} 15%{opacity:.18} 85%{opacity:.12} 100%{transform:translateX(60%) rotate(3deg);opacity:0} }
@keyframes beam-drift-2 { 0%{transform:translateX(30%) rotate(2deg);opacity:0} 20%{opacity:.1} 80%{opacity:.08} 100%{transform:translateX(-50%) rotate(-2deg);opacity:0} }
@keyframes window-arch { 0%,100%{opacity:.12} 50%{opacity:.25} }
@keyframes pillar-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@keyframes stained-glass-drift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(4px,-3px) scale(1.02)} 66%{transform:translate(-3px,2px) scale(.98)} }
@keyframes stage-warm-pulse { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:.35;transform:scale(1.05)} }

/* ── Nature ── */
@keyframes wave-move { 0%{transform:translateX(-8%) scaleY(1)} 50%{transform:translateX(4%) scaleY(1.1)} 100%{transform:translateX(-8%) scaleY(1)} }
@keyframes wave-move-2 { 0%{transform:translateX(5%) scaleY(1)} 50%{transform:translateX(-5%) scaleY(.92)} 100%{transform:translateX(5%) scaleY(1)} }
@keyframes horizon-shimmer { 0%,100%{opacity:.3} 50%{opacity:.55} }
@keyframes reflect-ripple { 0%{transform:scale(.3);opacity:.4} 100%{transform:scale(2.5);opacity:0} }
@keyframes cloud-drift { 0%{transform:translateX(-25%) translateY(0)} 50%{transform:translateX(5%) translateY(-3%)} 100%{transform:translateX(-25%) translateY(0)} }
@keyframes cloud-drift-2 { 0%{transform:translateX(20%) translateY(0)} 50%{transform:translateX(-8%) translateY(2%)} 100%{transform:translateX(20%) translateY(0)} }
@keyframes fog-move { 0%{transform:translateX(-30%) scale(1);opacity:.08} 50%{transform:translateX(10%) scale(1.08);opacity:.16} 100%{transform:translateX(-30%) scale(1);opacity:.08} }
@keyframes fog-move-2 { 0%{transform:translateX(20%) scale(1);opacity:.05} 50%{transform:translateX(-15%) scale(1.12);opacity:.12} 100%{transform:translateX(20%) scale(1);opacity:.05} }
@keyframes star-twinkle { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
@keyframes star-drift { 0%{transform:translateY(100vh) translateX(0)} 100%{transform:translateY(-10vh) translateX(30px)} }
@keyframes star-drift-2 { 0%{transform:translateY(120vh) translateX(0)} 100%{transform:translateY(-20vh) translateX(-20px)} }
@keyframes aurora-wave { 0%{transform:translateX(-20%) skewX(-2deg);opacity:.08} 50%{transform:translateX(20%) skewX(2deg);opacity:.2} 100%{transform:translateX(-20%) skewX(-2deg);opacity:.08} }
@keyframes aurora-wave-2 { 0%{transform:translateX(15%) skewX(1deg);opacity:.05} 50%{transform:translateX(-15%) skewX(-1deg);opacity:.15} 100%{transform:translateX(15%) skewX(1deg);opacity:.05} }
@keyframes nebula-rotate { 0%{transform:rotate(0deg) scale(1)} 100%{transform:rotate(360deg) scale(1)} }
@keyframes nebula-pulse { 0%,100%{opacity:.1;transform:scale(1)} 50%{opacity:.22;transform:scale(1.06)} }
@keyframes mountain-drift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-5px)} }
@keyframes sun-glow { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.35;transform:scale(1.08)} }
@keyframes tree-sway { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(.5deg)} }
@keyframes light-shaft { 0%{transform:translateX(-20%) rotate(-2deg);opacity:0} 30%{opacity:.08} 70%{opacity:.06} 100%{transform:translateX(30%) rotate(2deg);opacity:0} }
@keyframes flame-dance { 0%,100%{transform:translateY(0) scale(1);opacity:.7} 25%{transform:translateY(-2px) scale(1.03);opacity:.85} 50%{transform:translateY(1px) scale(.97);opacity:.7} 75%{transform:translateY(-1px) scale(1.01);opacity:.8} }
@keyframes flame-dance-2 { 0%,100%{transform:translateY(0) scale(1);opacity:.5} 33%{transform:translateY(-3px) scale(1.05);opacity:.7} 66%{transform:translateY(2px) scale(.95);opacity:.45} }
@keyframes candle-glow-pulse { 0%,100%{opacity:.08;transform:scale(1)} 50%{opacity:.18;transform:scale(1.1)} }

/* ── Abstract ── */
@keyframes geo-rotate-y { 0%{transform:rotateY(0deg)} 100%{transform:rotateY(360deg)} }
@keyframes geo-float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
@keyframes geo-float-2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(6px) rotate(-2deg)} }
@keyframes silk-wave { 0%,100%{transform:translateX(-15%) skewX(-1deg)} 50%{transform:translateX(15%) skewX(1deg)} }
@keyframes silk-wave-2 { 0%,100%{transform:translateX(10%) skewX(1deg)} 50%{transform:translateX(-10%) skewX(-1deg)} }
@keyframes glass-bend { 0%,100%{transform:translate(0,0) scale(1)} 25%{transform:translate(5px,-4px) scale(1.03)} 50%{transform:translate(-3px,3px) scale(.97)} 75%{transform:translate(4px,-2px) scale(1.01)} }
@keyframes glass-bend-2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-5px,3px) scale(.98)} 66%{transform:translate(4px,-4px) scale(1.04)} }
@keyframes mesh-point { 0%,100%{transform:translateY(0)} 25%{transform:translateY(-5px)} 50%{transform:translateY(0)} 75%{transform:translateY(3px)} }
@keyframes mesh-point-2 { 0%,100%{transform:translateY(0)} 25%{transform:translateY(3px)} 50%{transform:translateY(-5px)} 75%{transform:translateY(0)} }
@keyframes arch-line-scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
@keyframes arch-line-scan-2 { 0%{transform:translateX(50%)} 100%{transform:translateX(-150%)} }
@keyframes gold-shimmer { 0%{transform:translateX(-100%) skewX(-25deg)} 100%{transform:translateX(200%) skewX(-25deg)} }
@keyframes gold-float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(2deg)} }
@keyframes gold-float-2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(4px) rotate(-3deg)} }
@keyframes bokeh-premium { 0%{transform:translate(-30px,30px) scale(.8);opacity:0} 20%{opacity:.45} 80%{opacity:.3} 100%{transform:translate(30px,-30px) scale(1.2);opacity:0} }
@keyframes bokeh-premium-2 { 0%{transform:translate(20px,40px) scale(1);opacity:0} 25%{opacity:.35} 75%{opacity:.25} 100%{transform:translate(-20px,-40px) scale(.7);opacity:0} }
@keyframes velvet-drape { 0%,100%{transform:translateX(0) scaleY(1)} 50%{transform:translateX(8px) scaleY(1.03)} }
@keyframes velvet-drape-2 { 0%,100%{transform:translateX(0) scaleY(1)} 50%{transform:translateX(-6px) scaleY(.97)} }
@keyframes ethereal-float { 0%,100%{transform:translate(0,0) scale(1);opacity:.06} 33%{transform:translate(8px,-5px) scale(1.05);opacity:.14} 66%{transform:translate(-5px,4px) scale(.95);opacity:.1} }
@keyframes ethereal-float-2 { 0%,100%{transform:translate(0,0) scale(1);opacity:.04} 33%{transform:translate(-6px,8px) scale(.95);opacity:.1} 66%{transform:translate(5px,-4px) scale(1.06);opacity:.08} }

/* ── Stage / Theatre ── */
@keyframes stage-spotlight { 0%{transform:rotate(-10deg) scaleY(1);opacity:.12} 50%{transform:rotate(8deg) scaleY(1.08);opacity:.2} 100%{transform:rotate(-10deg) scaleY(1);opacity:.12} }
@keyframes stage-spotlight-2 { 0%{transform:rotate(5deg) scaleY(1);opacity:.08} 50%{transform:rotate(-12deg) scaleY(.92);opacity:.16} 100%{transform:rotate(5deg) scaleY(1);opacity:.08} }
@keyframes stage-vignette { 0%,100%{opacity:.35} 50%{opacity:.5} }
@keyframes ambient-pulse { 0%,100%{opacity:.06;transform:scale(1)} 50%{opacity:.14;transform:scale(1.08)} }

.s-beam { animation: beam-drift 10s ease-in-out infinite }
.s-beam-2 { animation: beam-drift-2 13s ease-in-out infinite }
.s-window { animation: window-arch 6s ease-in-out infinite }
.s-pillar { animation: pillar-float 8s ease-in-out infinite }
.s-glass { animation: stained-glass-drift 12s ease-in-out infinite }
.s-stage { animation: stage-warm-pulse 7s ease-in-out infinite }
.s-wave { animation: wave-move 6s ease-in-out infinite }
.s-wave-2 { animation: wave-move-2 8s ease-in-out infinite }
.s-shimmer { animation: horizon-shimmer 5s ease-in-out infinite }
.s-ripple { animation: reflect-ripple 5s ease-out infinite }
.s-cloud { animation: cloud-drift 14s ease-in-out infinite }
.s-cloud-2 { animation: cloud-drift-2 18s ease-in-out infinite }
.s-fog { animation: fog-move 16s ease-in-out infinite }
.s-fog-2 { animation: fog-move-2 20s ease-in-out infinite }
.s-star { animation: star-twinkle 3s ease-in-out infinite }
.s-star-drift { animation: star-drift 25s linear infinite }
.s-star-drift-2 { animation: star-drift-2 35s linear infinite }
.s-aurora { animation: aurora-wave 12s ease-in-out infinite }
.s-aurora-2 { animation: aurora-wave-2 16s ease-in-out infinite }
.s-nebula { animation: nebula-rotate 50s linear infinite }
.s-nebula-pulse { animation: nebula-pulse 10s ease-in-out infinite }
.s-mountain { animation: mountain-drift 14s ease-in-out infinite }
.s-sun { animation: sun-glow 8s ease-in-out infinite }
.s-tree { animation: tree-sway 6s ease-in-out infinite }
.s-shaft { animation: light-shaft 12s ease-in-out infinite }
.s-flame { animation: flame-dance 3s ease-in-out infinite }
.s-flame-2 { animation: flame-dance-2 4s ease-in-out infinite }
.s-candle-glow { animation: candle-glow-pulse 5s ease-in-out infinite }
.s-geo-y { animation: geo-rotate-y 20s linear infinite }
.s-geo-float { animation: geo-float 8s ease-in-out infinite }
.s-geo-float-2 { animation: geo-float-2 10s ease-in-out infinite }
.s-silk { animation: silk-wave 14s ease-in-out infinite }
.s-silk-2 { animation: silk-wave-2 18s ease-in-out infinite }
.s-glass-bend { animation: glass-bend 12s ease-in-out infinite }
.s-glass-bend-2 { animation: glass-bend-2 15s ease-in-out infinite }
.s-mesh { animation: mesh-point 4s ease-in-out infinite }
.s-mesh-2 { animation: mesh-point-2 5s ease-in-out infinite }
.s-arch-scan { animation: arch-line-scan 6s ease-in-out infinite }
.s-arch-scan-2 { animation: arch-line-scan-2 8s ease-in-out infinite }
.s-gold-shimmer { animation: gold-shimmer 4s ease-in-out infinite }
.s-gold-float { animation: gold-float 9s ease-in-out infinite }
.s-gold-float-2 { animation: gold-float-2 11s ease-in-out infinite }
.s-bokeh { animation: bokeh-premium 12s ease-in-out infinite }
.s-bokeh-2 { animation: bokeh-premium-2 16s ease-in-out infinite }
.s-velvet { animation: velvet-drape 10s ease-in-out infinite }
.s-velvet-2 { animation: velvet-drape-2 12s ease-in-out infinite }
.s-ether { animation: ethereal-float 14s ease-in-out infinite }
.s-ether-2 { animation: ethereal-float-2 18s ease-in-out infinite }
.s-spotlight { animation: stage-spotlight 14s ease-in-out infinite }
.s-spotlight-2 { animation: stage-spotlight-2 18s ease-in-out infinite }
.s-vignette { animation: stage-vignette 8s ease-in-out infinite }
.s-ambient { animation: ambient-pulse 10s ease-in-out infinite }

.paused .s-beam,.paused .s-beam-2,.paused .s-window,.paused .s-pillar,.paused .s-glass,
.paused .s-stage,.paused .s-wave,.paused .s-wave-2,.paused .s-shimmer,.paused .s-ripple,
.paused .s-cloud,.paused .s-cloud-2,.paused .s-fog,.paused .s-fog-2,.paused .s-star,
.paused .s-star-drift,.paused .s-star-drift-2,.paused .s-aurora,.paused .s-aurora-2,
.paused .s-nebula,.paused .s-nebula-pulse,.paused .s-mountain,.paused .s-sun,.paused .s-tree,
.paused .s-shaft,.paused .s-flame,.paused .s-flame-2,.paused .s-candle-glow,.paused .s-geo-y,
.paused .s-geo-float,.paused .s-geo-float-2,.paused .s-silk,.paused .s-silk-2,
.paused .s-glass-bend,.paused .s-glass-bend-2,.paused .s-mesh,.paused .s-mesh-2,
.paused .s-arch-scan,.paused .s-arch-scan-2,.paused .s-gold-shimmer,.paused .s-gold-float,
.paused .s-gold-float-2,.paused .s-bokeh,.paused .s-bokeh-2,.paused .s-velvet,.paused .s-velvet-2,
.paused .s-ether,.paused .s-ether-2,.paused .s-spotlight,.paused .s-spotlight-2,
.paused .s-vignette,.paused .s-ambient {
  animation-play-state:paused !important;
}
  `;
  document.head.appendChild(s);
}

function useStyles() {
  const r = useRef(false);
  useEffect(() => {
    if (!r.current) {
      injectAnimCSS();
      r.current = true;
    }
  }, []);
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 1 — Golden Worship Stage
   ════════════════════════════════════════════════════════════════════════════ */
function GoldenStage({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%,rgba(251,191,36,.18),rgba(217,119,6,.08),rgba(120,53,15,.04),transparent)",
        }}
      />
      <div
        className="s-beam absolute -left-[10%] -top-[5%] h-[180%] w-[40%]"
        style={{
          background: "linear-gradient(135deg,rgba(253,224,71,.08),transparent 70%)",
          transformOrigin: "left top",
        }}
      />
      <div
        className="s-beam-2 absolute -right-[10%] -top-[5%] h-[160%] w-[35%]"
        style={{
          background: "linear-gradient(225deg,rgba(251,191,36,.06),transparent 70%)",
          transformOrigin: "right top",
        }}
      />
      <div
        className="s-stage absolute left-[20%] right-[20%] top-[65%] h-[30%]"
        style={{
          background: "linear-gradient(180deg,transparent,rgba(251,191,36,.06))",
          clipPath: "polygon(5% 0%,95% 0%,100% 100%,0% 100%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 2 — Morning Light Through Windows
   ════════════════════════════════════════════════════════════════════════════ */
function ChurchWindows({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(251,146,60,.1),rgba(251,191,36,.05),rgba(147,51,234,.03))",
        }}
      />
      {[25, 50, 75].map((p, i) => (
        <div
          key={i}
          className={cn("absolute bottom-0 w-[12%]", i === 1 && "s-window")}
          style={{
            left: `${p - 6}%`,
            height: "70%",
            background: "rgba(255,255,255,.03)",
            borderTop: "3px solid rgba(255,255,255,.06)",
            borderTopLeftRadius: "40% 20%",
            borderTopRightRadius: "40% 20%",
          }}
        >
          <div
            className="absolute inset-x-[15%] top-[10%] bottom-[5%]"
            style={{ background: "linear-gradient(180deg,rgba(253,224,71,.06),transparent)" }}
          />
        </div>
      ))}
      <div
        className="s-beam absolute -left-[5%] top-0 h-full w-[25%] opacity-[.06]"
        style={{
          background: "linear-gradient(135deg,rgba(253,224,71,.15),transparent 70%)",
          transformOrigin: "left top",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 3 — Cathedral Glass Reflections
   ════════════════════════════════════════════════════════════════════════════ */
function CathedralGlass({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg,#0a0a2e,#1a0a3e,#2a0a4e)" }}
      />
      {[
        "rgba(147,51,234,.12)",
        "rgba(59,130,246,.1)",
        "rgba(236,72,153,.08)",
        "rgba(251,191,36,.1)",
        "rgba(34,211,238,.08)",
        "rgba(168,85,247,.1)",
      ].map((c, i) => (
        <div
          key={i}
          className={cn(
            "s-glass absolute rounded-lg",
            i % 2 === 0 ? "s-glass-bend" : "s-glass-bend-2",
          )}
          style={{
            left: `${8 + i * 16}%`,
            top: `${12 + (i % 3) * 20}%`,
            width: `${10 + (i % 4) * 6}%`,
            height: `${30 + (i % 3) * 15}%`,
            background: c,
            clipPath: `polygon(${50 + (i % 3) * 5}% 0%,100% ${30 + i * 5}%,${80 - i * 10}% 100%,0% ${70 - i * 10}%)`,
            filter: "blur(2px)",
          }}
        />
      ))}
      <div
        className="s-shimmer absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg,transparent 30%,rgba(255,255,255,.02) 50%,transparent 70%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 4 — Ocean Horizon
   ════════════════════════════════════════════════════════════════════════════ */
function OceanHorizon({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#020d1a 40%,#06304a 45%,#0a4a6a 50%,#105a7a 55%,#0a3a5a 60%,#020d1a)",
        }}
      />
      <div
        className="s-shimmer absolute left-0 right-0 top-[44%] h-[3%]"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(103,232,249,.15),rgba(147,197,253,.2),rgba(103,232,249,.15),transparent)",
          filter: "blur(3px)",
        }}
      />
      <div
        className="s-wave absolute -bottom-[5%] left-0 right-0 h-[20%] rounded-[50%]"
        style={{ background: "rgba(6,78,100,.15)", filter: "blur(4px)" }}
      />
      <div
        className="s-wave-2 absolute -bottom-[8%] left-0 right-0 h-[15%] rounded-[50%]"
        style={{ background: "rgba(8,100,130,.1)", filter: "blur(6px)" }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 5 — Calm Lake Reflection
   ════════════════════════════════════════════════════════════════════════════ */
function CalmLake({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#020d1a 35%,#042a3e 42%,#063a4e 45%,#084a5e 48%,#0a3a4e 55%,#042a3e 65%,#020d1a)",
        }}
      />
      <div
        className="s-shimmer absolute left-0 right-0 top-[42%] h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(147,197,253,.2),rgba(147,197,253,.3),transparent)",
        }}
      />
      <div
        className="s-wave absolute inset-x-[10%] -bottom-[2%] h-[15%] rounded-[50%]"
        style={{ background: "rgba(10,90,110,.08)", filter: "blur(8px)" }}
      />
      <div style={{ position: "absolute", left: "45%", top: "43%", width: "10%", height: "2%" }}>
        <div
          className="s-ripple absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-cyan-400"
          style={{ boxShadow: "0 0 2px rgba(103,232,249,.3)" }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 6 — Cloud Layers
   ════════════════════════════════════════════════════════════════════════════ */
function CloudLayers({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#0a1628,#1a2e4a,#2a4060)" }}
      />
      <div
        className="s-cloud absolute -left-[20%] -top-[5%] h-[35%] w-[140%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(255,255,255,.04),transparent)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="s-cloud-2 absolute -left-[10%] top-[20%] h-[30%] w-[120%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(255,255,255,.03),transparent)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="s-cloud absolute -left-[30%] top-[45%] h-[25%] w-[160%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(255,255,255,.025),transparent)",
          filter: "blur(50px)",
          animationDelay: "-7s",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 7 — Moving Fog
   ════════════════════════════════════════════════════════════════════════════ */
function MovingFog({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#0a0e1a,#1a2240,#0a0e1a)" }}
      />
      <div
        className="s-fog absolute -left-[25%] -top-[10%] h-[60%] w-[150%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(148,163,184,.04),transparent)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="s-fog-2 absolute -left-[10%] top-[30%] h-[50%] w-[130%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(148,163,184,.03),transparent)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="s-fog absolute -left-[30%] top-[55%] h-[40%] w-[160%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(100,116,139,.025),transparent)",
          filter: "blur(70px)",
          animationDelay: "-8s",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 8 — Night Sky Stars
   ════════════════════════════════════════════════════════════════════════════ */
function NightSky({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%,#0a0a2e,#020214,#000005)" }}
      />
      <div
        className="s-aurora absolute -inset-4"
        style={{
          background: "linear-gradient(180deg,rgba(99,102,241,.04),transparent)",
          filter: "blur(30px)",
        }}
      />
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="s-star absolute rounded-full bg-white"
          style={{
            left: `${(i * 3.3 + 1.7) % 100}%`,
            top: `${(i * 7.1 + 3.2) % 90}%`,
            width: `${1 + (i % 3) * 0.5}px`,
            height: `${1 + (i % 3) * 0.5}px`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${2 + (i % 5) * 0.8}s`,
            opacity: 0.2 + (i % 5) * 0.15,
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 9 — Aurora Curtain
   ════════════════════════════════════════════════════════════════════════════ */
function AuroraCurtain({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%,#02061a,#020210,#000005)" }}
      />
      <div
        className="s-aurora absolute -left-[10%] -top-[5%] h-[60%] w-[130%]"
        style={{
          background:
            "linear-gradient(180deg,rgba(52,211,153,.08),rgba(16,185,129,.04),transparent)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="s-aurora-2 absolute -left-[5%] top-[25%] h-[50%] w-[120%]"
        style={{
          background:
            "linear-gradient(180deg,rgba(103,232,249,.06),rgba(45,212,191,.03),transparent)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="s-aurora absolute -left-[15%] top-[45%] h-[40%] w-[140%]"
        style={{
          background:
            "linear-gradient(180deg,rgba(167,139,250,.05),rgba(139,92,246,.03),transparent)",
          filter: "blur(45px)",
          animationDelay: "-6s",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 10 — Deep Space
   ════════════════════════════════════════════════════════════════════════════ */
function DeepSpace({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 40% 50%,#0a0020,#020010,#000005)" }}
      />
      <div
        className="s-nebula absolute -inset-1/2 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg,transparent,rgba(99,102,241,.03),rgba(168,85,247,.02),transparent,rgba(139,92,246,.03),transparent)",
          transformOrigin: "center",
        }}
      />
      <div
        className="s-nebula-pulse absolute -inset-1/3 rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(99,102,241,.04),transparent)",
          filter: "blur(40px)",
        }}
      />
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="s-star absolute rounded-full bg-white"
          style={{
            left: `${(i * 4.1 + 2.3) % 100}%`,
            top: `${(i * 6.7 + 1.8) % 100}%`,
            width: `${0.5 + (i % 4) * 0.4}px`,
            height: `${0.5 + (i % 4) * 0.4}px`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${1.5 + (i % 6) * 0.6}s`,
            opacity: 0.1 + (i % 5) * 0.12,
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 11 — Mountain Sunrise
   ════════════════════════════════════════════════════════════════════════════ */
function MountainSunrise({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#1a0a2e,#3a1a3e,#6a2a3e,#a04a3e)" }}
      />
      <div
        className="s-sun absolute left-1/2 top-[45%] h-[20%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse,rgba(253,224,71,.12),rgba(251,146,60,.06),transparent)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="s-mountain absolute bottom-0 left-0 right-0 h-[45%]"
        style={{
          background: "#0a0a1a",
          clipPath:
            "polygon(0% 100%,8% 55%,15% 60%,22% 40%,30% 50%,38% 30%,45% 42%,52% 25%,58% 38%,65% 20%,72% 35%,78% 28%,85% 40%,92% 32%,100% 45%,100% 100%)",
        }}
      />
      <div
        className="s-mountain absolute bottom-0 left-0 right-0 h-[35%] opacity-60"
        style={{
          background: "#1a0a1e",
          clipPath:
            "polygon(0% 100%,12% 50%,20% 55%,30% 42%,40% 48%,50% 35%,60% 45%,70% 30%,80% 42%,90% 35%,100% 48%,100% 100%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 12 — Forest Light
   ════════════════════════════════════════════════════════════════════════════ */
function ForestLight({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#063016,#0a4a1a,#063016)" }}
      />
      {[15, 28, 42, 58, 72, 85].map((p, i) => (
        <div
          key={i}
          className={cn("s-tree absolute bottom-0", i % 2 === 0 && "s-mountain")}
          style={{
            left: `${p}%`,
            width: `${3 + (i % 3)}%`,
            height: `${60 + (i % 4) * 10}%`,
            background: "linear-gradient(180deg,transparent,rgba(0,0,0,.15))",
            borderLeft: `${1 + (i % 2)}px solid rgba(0,0,0,.2)`,
            borderRight: `${1 + (i % 2)}px solid rgba(0,0,0,.2)`,
            transformOrigin: "bottom center",
          }}
        />
      ))}
      {[20, 50, 80].map((p, i) => (
        <div
          key={`sh-${i}`}
          className="s-shaft absolute"
          style={{
            left: `${p}%`,
            top: 0,
            width: "15%",
            height: "100%",
            background: "linear-gradient(180deg,rgba(253,224,71,.04),transparent 70%)",
            transformOrigin: "left top",
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 13 — Warm Candle Glow
   ════════════════════════════════════════════════════════════════════════════ */
function CandleGlow({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 80%,#1a0f08,#0a0604)" }}
      />
      {[30, 50, 70].map((p, i) => (
        <div
          key={i}
          className="candle-group"
          style={{ position: "absolute", left: `${p}%`, bottom: "15%" }}
        >
          <div
            className="absolute -bottom-[5%] left-1/2 h-[15%] w-[4%] -translate-x-1/2 rounded-sm"
            style={{
              background: "linear-gradient(180deg,rgba(253,224,71,.15),rgba(120,53,15,.1))",
            }}
          />
          <div
            className={cn("s-flame absolute -top-[5%] left-1/2 h-[12%] w-[6%] -translate-x-1/2")}
            style={{
              background:
                "radial-gradient(ellipse,rgba(253,224,71,.2),rgba(251,146,60,.08),transparent)",
              borderRadius: "50% 50% 20% 20%",
              filter: "blur(1px)",
            }}
          />
          <div
            className={cn("s-flame-2 absolute -top-[8%] left-1/2 h-[18%] w-[10%] -translate-x-1/2")}
            style={{
              background: "radial-gradient(ellipse,rgba(251,191,36,.08),transparent)",
              filter: "blur(3px)",
            }}
          />
        </div>
      ))}
      <div
        className="s-candle-glow absolute inset-x-[15%] bottom-0 h-[40%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(251,191,36,.06),transparent)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 14 — Premium Abstract Geometry
   ════════════════════════════════════════════════════════════════════════════ */
function PremiumGeo({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%,#0a0a2e,#040412)" }}
      />
      <div
        className="s-geo-y absolute left-1/2 top-1/3 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2"
        style={{ transformStyle: "preserve-3d", perspective: "600px" }}
      >
        <div
          className="absolute inset-0 border border-indigo-400/10 rounded-lg"
          style={{ transform: "translateZ(20px)" }}
        />
        <div
          className="absolute inset-[15%] border border-purple-400/8 rounded-lg"
          style={{ transform: "translateZ(-10px)" }}
        />
        <div
          className="absolute inset-[30%] border border-cyan-400/6 rounded-lg"
          style={{ transform: "translateZ(10px)" }}
        />
      </div>
      <div className="s-geo-float absolute left-[15%] top-[55%] h-[12%] w-[12%] border border-indigo-400/8 rounded-full" />
      <div className="s-geo-float-2 absolute right-[20%] top-[20%] h-[8%] w-[8%] border border-purple-400/6 rounded-full" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 15 — Floating Silk Fabric
   ════════════════════════════════════════════════════════════════════════════ */
function FloatingSilk({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg,#0a0a2e,#1a1a4e,#2a1a4e)" }}
      />
      <div
        className="s-silk absolute -left-[20%] -top-[10%] h-[70%] w-[60%] rounded-full"
        style={{
          background:
            "linear-gradient(135deg,rgba(167,139,250,.06),rgba(139,92,246,.03),transparent)",
          filter: "blur(30px)",
          transformOrigin: "center",
        }}
      />
      <div
        className="s-silk-2 absolute -right-[15%] -bottom-[10%] h-[65%] w-[55%] rounded-full"
        style={{
          background:
            "linear-gradient(225deg,rgba(99,102,241,.05),rgba(129,140,248,.03),transparent)",
          filter: "blur(30px)",
          transformOrigin: "center",
        }}
      />
      <div
        className="s-silk absolute left-[20%] top-[25%] h-[40%] w-[35%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(192,132,252,.04),transparent)",
          filter: "blur(40px)",
          animationDelay: "-7s",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 16 — Liquid Glass
   ════════════════════════════════════════════════════════════════════════════ */
function LiquidGlass({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg,#0a122e,#1a2250,#0a122e)" }}
      />
      <div
        className="s-glass-bend absolute left-[10%] top-[15%] h-[30%] w-[25%] rounded-3xl"
        style={{
          background: "rgba(147,197,253,.02)",
          border: "1px solid rgba(147,197,253,.06)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        className="s-glass-bend-2 absolute right-[15%] top-[45%] h-[25%] w-[20%] rounded-2xl"
        style={{
          background: "rgba(167,139,250,.015)",
          border: "1px solid rgba(167,139,250,.05)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        className="s-gold-shimmer absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg,transparent 35%,rgba(255,255,255,.015) 50%,transparent 65%)",
        }}
      />
      <div
        className="s-geo-float absolute left-[55%] top-[15%] h-[18%] w-[18%] rounded-full"
        style={{ border: "1px solid rgba(103,232,249,.05)", background: "rgba(103,232,249,.01)" }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 17 — Elegant Mesh
   ════════════════════════════════════════════════════════════════════════════ */
function ElegantMesh({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%,#0a0e1a,#060810)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.02) 1px,transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn("absolute h-[3%] w-[3%] rounded-full", i % 2 === 0 ? "s-mesh" : "s-mesh-2")}
          style={{
            left: `${25 + i * 18}%`,
            top: `${30 + (i % 2) * 30}%`,
            background: `rgba(148,163,184,.04)`,
            transition: "all .3s",
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
      <div
        className="s-ambient absolute left-1/4 right-1/4 top-1/4 bottom-1/4"
        style={{
          background: "radial-gradient(ellipse,rgba(99,102,241,.03),transparent)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 18 — Modern Architectural Motion
   ════════════════════════════════════════════════════════════════════════════ */
function ArchitecturalMotion({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg,#0a0e1a,#141a2e,#1a1f3a)" }}
      />
      <div
        className="s-arch-scan absolute left-[15%] top-0 h-full w-px"
        style={{
          background:
            "linear-gradient(180deg,transparent,rgba(148,163,184,.06),rgba(148,163,184,.08),rgba(148,163,184,.06),transparent)",
        }}
      />
      <div
        className="s-arch-scan-2 absolute right-[25%] top-0 h-full w-px"
        style={{
          background:
            "linear-gradient(180deg,transparent,rgba(148,163,184,.04),rgba(148,163,184,.06),rgba(148,163,184,.04),transparent)",
        }}
      />
      <div className="s-pillar absolute bottom-0 left-[8%] h-[70%] w-[2%] bg-gradient-to-t from-white/5 via-transparent to-transparent" />
      <div
        className="s-pillar absolute bottom-0 right-[12%] h-[65%] w-[2%] bg-gradient-to-t from-white/4 via-transparent to-transparent"
        style={{ animationDelay: "-4s" }}
      />
      <div className="s-ambient absolute left-0 right-0 top-[30%] h-px bg-gradient-to-r from-transparent via-indigo-400/6 to-transparent" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 19 — Ambient Light Beams
   ════════════════════════════════════════════════════════════════════════════ */
function AmbientBeams({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%,#0a0e1a,#050810)" }}
      />
      <div
        className="s-beam absolute -left-[5%] top-0 h-full w-[30%] opacity-[.06]"
        style={{
          background: "linear-gradient(135deg,rgba(147,197,253,.1),transparent 70%)",
          transformOrigin: "left top",
        }}
      />
      <div
        className="s-beam-2 absolute -right-[5%] top-0 h-full w-[25%] opacity-[.04]"
        style={{
          background: "linear-gradient(225deg,rgba(167,139,250,.08),transparent 70%)",
          transformOrigin: "right top",
        }}
      />
      <div
        className="s-ambient absolute left-[30%] right-[30%] top-[20%] h-[30%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(99,102,241,.03),transparent)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 20 — Dark Auditorium
   ════════════════════════════════════════════════════════════════════════════ */
function DarkAuditorium({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%,#0a0a12,#030306)" }}
      />
      <div
        className="s-vignette absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%,transparent 50%,rgba(0,0,0,.3) 100%)",
        }}
      />
      <div
        className="s-stage absolute left-[20%] right-[20%] top-[35%] h-[30%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(255,255,255,.01),transparent)",
          filter: "blur(20px)",
        }}
      />
      <div
        className="s-shimmer absolute left-[30%] right-[30%] top-[35%] h-px"
        style={{
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 21 — Stage Spotlights
   ════════════════════════════════════════════════════════════════════════════ */
function StageSpotlights({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%,#0a0a1e,#03030a)" }}
      />
      <div
        className="s-spotlight absolute -left-[10%] -top-[5%] h-[120%] w-[60%]"
        style={{
          background: "linear-gradient(135deg,rgba(99,102,241,.06),transparent 60%)",
          transformOrigin: "left top",
        }}
      />
      <div
        className="s-spotlight-2 absolute -right-[10%] -top-[5%] h-[120%] w-[60%]"
        style={{
          background: "linear-gradient(225deg,rgba(168,85,247,.04),transparent 60%)",
          transformOrigin: "right top",
        }}
      />
      <div
        className="s-vignette absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%,transparent 40%,rgba(0,0,0,.2) 100%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 22 — Luxury Gold Motion
   ════════════════════════════════════════════════════════════════════════════ */
function LuxuryGold({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%,#1a0e06,#0a0604)" }}
      />
      <div
        className="s-gold-float absolute left-[20%] top-[20%] h-[25%] w-[18%] rounded-[60%_40%]"
        style={{
          background: "linear-gradient(135deg,rgba(251,191,36,.04),rgba(217,119,6,.02))",
          border: "1px solid rgba(251,191,36,.05)",
          borderRadius: "40% 60% 45% 55%",
        }}
      />
      <div
        className="s-gold-float-2 absolute right-[25%] top-[45%] h-[20%] w-[15%] rounded-[50%_40%]"
        style={{
          background: "linear-gradient(225deg,rgba(253,224,71,.03),rgba(217,119,6,.02))",
          border: "1px solid rgba(251,191,36,.04)",
          borderRadius: "55% 45% 50% 50%",
        }}
      />
      <div
        className="s-gold-shimmer absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg,transparent 30%,rgba(253,224,71,.02) 50%,transparent 70%)",
        }}
      />
      <div
        className="s-shimmer absolute left-1/3 right-1/3 top-[45%] h-px"
        style={{
          background: "linear-gradient(90deg,transparent,rgba(251,191,36,.04),transparent)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 23 — Premium Bokeh
   ════════════════════════════════════════════════════════════════════════════ */
function PremiumBokeh({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%,#0a0a1a,#05050e)" }}
      />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className={cn(i % 2 === 0 ? "s-bokeh" : "s-bokeh-2")}
          style={{
            position: "absolute",
            left: `${10 + ((i * 11) % 80)}%`,
            top: `${15 + ((i * 7) % 70)}%`,
            width: `${20 + (i % 5) * 15}px`,
            height: `${20 + (i % 5) * 15}px`,
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(147,197,253,.03)" : "rgba(167,139,250,.025)",
            filter: `blur(${3 + (i % 4)}px)`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 24 — Velvet Background
   ════════════════════════════════════════════════════════════════════════════ */
function VelvetBackground({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg,#1a0a0a,#2a0a1a,#1a0a0e)" }}
      />
      <div
        className="s-velvet absolute -left-[10%] top-0 h-full w-[60%] rounded-[50%]"
        style={{
          background: "radial-gradient(ellipse,rgba(139,30,30,.03),transparent)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="s-velvet-2 absolute -right-[10%] -bottom-[10%] h-[80%] w-[50%] rounded-[50%]"
        style={{
          background: "radial-gradient(ellipse,rgba(120,20,40,.025),transparent)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="s-gold-shimmer absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg,transparent 30%,rgba(200,150,100,.008) 50%,transparent 70%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SCENE 25 — Ethereal Glow
   ════════════════════════════════════════════════════════════════════════════ */
function EtherealGlow({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%,#0a0a2e,#050518)" }}
      />
      <div
        className="s-ether absolute left-[20%] top-[10%] h-[40%] w-[35%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(167,139,250,.04),transparent)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="s-ether-2 absolute right-[15%] bottom-[10%] h-[35%] w-[30%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(99,102,241,.03),transparent)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="s-ether absolute left-[45%] top-[45%] h-[25%] w-[20%] rounded-full"
        style={{
          background: "radial-gradient(ellipse,rgba(192,132,252,.025),transparent)",
          filter: "blur(40px)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="s-gold-shimmer absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg,transparent 30%,rgba(255,255,255,.01) 50%,transparent 70%)",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAP
   ════════════════════════════════════════════════════════════════════════════ */
const ANIM_MAP: Record<string, React.FC<AnimProps>> = {
  "golden-stage": GoldenStage,
  "church-windows": ChurchWindows,
  "cathedral-glass": CathedralGlass,
  "ocean-horizon": OceanHorizon,
  "calm-lake": CalmLake,
  "cloud-layers": CloudLayers,
  "moving-fog": MovingFog,
  "night-sky": NightSky,
  "aurora-curtain": AuroraCurtain,
  "deep-space": DeepSpace,
  "mountain-sunrise": MountainSunrise,
  "forest-light": ForestLight,
  "candle-glow": CandleGlow,
  "premium-geo": PremiumGeo,
  "floating-silk": FloatingSilk,
  "liquid-glass": LiquidGlass,
  "elegant-mesh": ElegantMesh,
  "architectural-motion": ArchitecturalMotion,
  "ambient-beams": AmbientBeams,
  "dark-auditorium": DarkAuditorium,
  "stage-spotlights": StageSpotlights,
  "luxury-gold": LuxuryGold,
  "premium-bokeh": PremiumBokeh,
  "velvet-background": VelvetBackground,
  "ethereal-glow": EtherealGlow,
};

export function ThemeAnimation({
  animation,
  paused,
}: {
  animation: BackgroundAnimation;
  paused?: boolean;
}) {
  const Comp = ANIM_MAP[animation];
  if (!Comp) return null;
  return <Comp paused={paused} />;
}

export function getAnimationLabel(animation: BackgroundAnimation): string {
  const labels: Record<string, string> = {
    "golden-stage": "Golden Stage",
    "church-windows": "Church Windows",
    "cathedral-glass": "Cathedral Glass",
    "ocean-horizon": "Ocean Horizon",
    "calm-lake": "Calm Lake",
    "cloud-layers": "Cloud Layers",
    "moving-fog": "Moving Fog",
    "night-sky": "Night Sky",
    "aurora-curtain": "Aurora Curtain",
    "deep-space": "Deep Space",
    "mountain-sunrise": "Mountain Sunrise",
    "forest-light": "Forest Light",
    "candle-glow": "Candle Glow",
    "premium-geo": "Premium Geometry",
    "floating-silk": "Floating Silk",
    "liquid-glass": "Liquid Glass",
    "elegant-mesh": "Elegant Mesh",
    "architectural-motion": "Architectural",
    "ambient-beams": "Ambient Beams",
    "dark-auditorium": "Dark Auditorium",
    "stage-spotlights": "Stage Spotlights",
    "luxury-gold": "Luxury Gold",
    "premium-bokeh": "Premium Bokeh",
    "velvet-background": "Velvet",
    "ethereal-glow": "Ethereal Glow",
  };
  return labels[animation] ?? animation;
}
