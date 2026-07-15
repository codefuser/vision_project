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
/* ── Grid family ── */
@keyframes grid-h { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes grid-v { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
@keyframes grid-warp { 0%,100%{transform:scaleY(1) skewX(0deg)} 50%{transform:scaleY(1.06) skewX(1.5deg)} }
@keyframes grid-line-pulse { 0%,100%{opacity:.15} 50%{opacity:.35} }
@keyframes neon-flicker { 0%,100%{opacity:.9} 5%{opacity:.5} 10%{opacity:.9} 15%{opacity:.7} 20%{opacity:.95} }
@keyframes neon-glow { 0%,100%{box-shadow:0 0 8px rgba(103,232,249,.4),0 0 20px rgba(103,232,249,.2)} 50%{box-shadow:0 0 16px rgba(103,232,249,.6),0 0 40px rgba(103,232,249,.3)} }

/* ── Tunnel family ── */
@keyframes tunnel-spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
@keyframes tunnel-scale { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
@keyframes ring-pulse { 0%,100%{transform:scale(1);opacity:.3} 50%{transform:scale(1.08);opacity:.15} }
@keyframes tunnel-depth { 0%{transform:scale(.92) translateZ(0);opacity:.2} 50%{transform:scale(1.02) translateZ(0);opacity:.35} 100%{transform:scale(.92) translateZ(0);opacity:.2} }

/* ── Space family ── */
@keyframes star-drift-1 { 0%{transform:translateY(0) translateX(0)} 100%{transform:translateY(-120vh) translateX(20px)} }
@keyframes star-drift-2 { 0%{transform:translateY(0) translateX(0)} 100%{transform:translateY(-100vh) translateX(-15px)} }
@keyframes star-drift-3 { 0%{transform:translateY(0) translateX(0)} 100%{transform:translateY(-80vh) translateX(10px)} }
@keyframes star-twinkle { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
@keyframes spiral-rotate { 0%{transform:rotate(0deg) scale(1)} 100%{transform:rotate(360deg) scale(1)} }
@keyframes nebula-pulse { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.3;transform:scale(1.05)} }

/* ── Wave/Ocean family ── */
@keyframes wave-slide { 0%{transform:translateX(-10%)} 100%{transform:translateX(10%)} }
@keyframes wave-sine { 0%{transform:translateX(-15%) scaleY(1)} 50%{transform:translateX(5%) scaleY(1.15)} 100%{transform:translateX(-15%) scaleY(1)} }
@keyframes ripple-expand { 0%{transform:scale(0);opacity:.4} 100%{transform:scale(3);opacity:0} }
@keyframes shimmer { 0%{transform:translateX(-100%) skewX(-20deg)} 100%{transform:translateX(200%) skewX(-20deg)} }
@keyframes reflection-drift { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(4px) scaleY(.96)} }

/* ── Light effects ── */
@keyframes beam-sweep { 0%{transform:translateX(-100%) rotate(-5deg)} 100%{transform:translateX(200%) rotate(5deg)} }
@keyframes beam-rotate { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
@keyframes glow-breathe { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:.45;transform:scale(1.06)} }
@keyframes light-pulse { 0%,100%{opacity:.15} 50%{opacity:.4} }
@keyframes flare-sequence { 0%,100%{opacity:0;transform:scale(.5)} 30%{opacity:.3;transform:scale(1)} 70%{opacity:.1} }
@keyframes spotlight-sway { 0%{transform:rotate(-8deg) scaleY(1)} 50%{transform:rotate(8deg) scaleY(1.08)} 100%{transform:rotate(-8deg) scaleY(1)} }
@keyframes conic-rotate { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }

/* ── Abstract/Organic ── */
@keyframes line-flow { 0%{transform:translateX(0)} 100%{transform:translateX(-100%)} }
@keyframes blob-drift { 0%,100%{transform:translate(0,0) scale(1)} 25%{transform:translate(10px,-8px) scale(1.04)} 50%{transform:translate(-5px,5px) scale(.97)} 75%{transform:translate(8px,3px) scale(1.02)} }
@keyframes mesh-undulate { 0%,100%{transform:translateY(0) scale(1,1)} 25%{transform:translateY(-3px) scale(1,.97)} 50%{transform:translateY(0) scale(1,1.03)} 75%{transform:translateY(3px) scale(1,.98)} }
@keyframes float-rotate { 0%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(3deg)} 100%{transform:translateY(0) rotate(0deg)} }
@keyframes ink-bloom { 0%{transform:scale(.3);opacity:.5} 50%{transform:scale(1.2);opacity:.15} 100%{transform:scale(.3);opacity:.5} }
@keyframes grain-shift { 0%{transform:translate(0,0)} 25%{transform:translate(-2px,1px)} 50%{transform:translate(1px,-1px)} 75%{transform:translate(-1px,2px)} 100%{transform:translate(0,0)} }

/* ── Cinematic ── */
@keyframes fog-drift-1 { 0%{transform:translateX(-20%) translateY(0);opacity:.12} 50%{transform:translateX(10%) translateY(-5%);opacity:.2} 100%{transform:translateX(-20%) translateY(0);opacity:.12} }
@keyframes fog-drift-2 { 0%{transform:translateX(15%) translateY(0);opacity:.08} 50%{transform:translateX(-10%) translateY(3%);opacity:.16} 100%{transform:translateX(15%) translateY(0);opacity:.08} }
@keyframes dust-float { 0%{transform:translateY(100%) translateX(0);opacity:0} 20%{opacity:.5} 80%{opacity:.3} 100%{transform:translateY(-100%) translateX(20px);opacity:0} }
@keyframes cross-reveal { 0%{opacity:0;transform:scale(.6) rotate(5deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }
@keyframes cross-glow-pulse { 0%,100%{opacity:.25;filter:blur(3px)} 50%{opacity:.55;filter:blur(1px)} }
@keyframes vignette-breathe { 0%,100%{opacity:.4} 50%{opacity:.55} }
@keyframes horizon-pulse { 0%,100%{opacity:.3} 50%{opacity:.6} }
@keyframes stage-bloom { 0%,100%{opacity:.08;transform:scale(1)} 50%{opacity:.18;transform:scale(1.12)} }

/* ── Collision-Free Animation Classes ── */
.cg{will-change:transform}.cg-h{animation:grid-h 24s linear infinite}.cg-v{animation:grid-v 20s linear infinite}
.cg-warp{animation:grid-warp 8s ease-in-out infinite}.cg-lp{animation:grid-line-pulse 4s ease-in-out infinite}
.cg-neon{animation:neon-flicker 3s step-end infinite}.cg-ng{animation:neon-glow 3s ease-in-out infinite}
.ct-spin{animation:tunnel-spin 30s linear infinite}.ct-scale{animation:tunnel-scale 6s ease-in-out infinite}
.ct-ring{animation:ring-pulse 5s ease-in-out infinite}.ct-depth{animation:tunnel-depth 7s ease-in-out infinite}
.cs-s1{animation:star-drift-1 30s linear infinite}.cs-s2{animation:star-drift-2 22s linear infinite}
.cs-s3{animation:star-drift-3 16s linear infinite}.cs-tw{animation:star-twinkle 3s ease-in-out infinite}
.cs-sp{animation:spiral-rotate 50s linear infinite}.cs-np{animation:nebula-pulse 8s ease-in-out infinite}
.cw-sl{animation:wave-slide 6s ease-in-out infinite}.cwn{animation:wave-sine 8s ease-in-out infinite}
.cw-rp{animation:ripple-expand 4s ease-out infinite}.cwm{animation:shimmer 3s ease-in-out infinite}
.cw-rf{animation:reflection-drift 5s ease-in-out infinite}
.cl-sw{animation:beam-sweep 8s ease-in-out infinite}.cl-rt{animation:beam-rotate 20s linear infinite}
.cl-gb{animation:glow-breathe 5s ease-in-out infinite}.cl-lp{animation:light-pulse 6s ease-in-out infinite}
.cl-fl{animation:flare-sequence 5s ease-in-out infinite}.cl-sw{animation:spotlight-sway 12s ease-in-out infinite}
.cl-cr{animation:conic-rotate 25s linear infinite}
.ca-lf{animation:line-flow 12s linear infinite}.ca-bd{animation:blob-drift 12s ease-in-out infinite}
.ca-mu{animation:mesh-undulate 4s ease-in-out infinite}.ca-fr{animation:float-rotate 8s ease-in-out infinite}
.ca-ib{animation:ink-bloom 8s ease-in-out infinite}.ca-gr{animation:grain-shift 3s linear infinite}
.cc-f1{animation:fog-drift-1 14s ease-in-out infinite}.cc-f2{animation:fog-drift-2 18s ease-in-out infinite}
.cc-du{animation: dust-float 8s linear infinite}.cc-cr{animation:cross-reveal 6s ease-out infinite}
.cc-cg{animation:cross-glow-pulse 3s ease-in-out infinite}
.cc-vb{animation:vignette-breathe 6s ease-in-out infinite}.cc-hp{animation:horizon-pulse 4s ease-in-out infinite}
.cc-sb{animation:stage-bloom 8s ease-in-out infinite}

.paused .cg-h,.paused .cg-v,.paused .cg-warp,.paused .cg-lp,.paused .cg-neon,.paused .cg-ng,
.paused .ct-spin,.paused .ct-scale,.paused .ct-ring,.paused .ct-depth,
.paused .cs-s1,.paused .cs-s2,.paused .cs-s3,.paused .cs-tw,.paused .cs-sp,.paused .cs-np,
.paused .cw-sl,.paused .cwn,.paused .cw-rp,.paused .cwm,.paused .cw-rf,
.paused .cl-sw,.paused .cl-rt,.paused .cl-gb,.paused .cl-lp,.paused .cl-fl,.paused .cl-cr,
.paused .ca-lf,.paused .ca-bd,.paused .ca-mu,.paused .ca-fr,.paused .ca-ib,.paused .ca-gr,
.paused .cc-f1,.paused .cc-f2,.paused .cc-du,.paused .cc-cr,.paused .cc-cg,.paused .cc-vb,.paused .cc-hp,.paused .cc-sb {
  animation-play-state:paused !important;
}
  `;
  document.head.appendChild(s);
}

function useStyles() {
  const r = useRef(false);
  useEffect(() => { if (!r.current) { injectAnimCSS(); r.current = true; } }, []);
}

/* ════════════════════════════════════════════════════════════════════════════
   GRID FAMILY
   ════════════════════════════════════════════════════════════════════════════ */

function MovingGrid({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cg cg-h absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.05) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="cg cg-v absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.03) 1px,transparent 1px)", backgroundSize: "96px 96px", animationDirection: "reverse" }} />
      <div className="cg cg-lp absolute left-1/3 right-1/3 top-1/4 bottom-1/4 rounded-full bg-blue-500/5 blur-3xl" />
    </div>
  );
}

function WarpGrid({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden perspective-1000", paused && "paused")}>
      <div className={cn("cg cg-warp absolute inset-0")} style={{ transform: "perspective(600px) rotateX(60deg)", transformOrigin: "50% 0%" }}>
        <div className="cg cg-h absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(196,181,253,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(196,181,253,.08) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="cg cg-v absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(196,181,253,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(196,181,253,.04) 1px,transparent 1px)", backgroundSize: "80px 80px", animationDirection: "reverse" }} />
      </div>
      <div className="cg cg-lp absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/8 to-transparent blur-2xl" />
    </div>
  );
}

function NeonGrid({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cg cg-h absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(103,232,249,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(103,232,249,.12) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />
      <div className="cg cg-v absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(103,232,249,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(103,232,249,.06) 1px,transparent 1px)", backgroundSize: "26px 26px", animationDirection: "reverse" }} />
      <div className="cg cg-neon absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(103,232,249,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(103,232,249,.2) 1px,transparent 1px)", backgroundSize: "156px 156px" }} />
      <div className="cg cg-lp absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ boxShadow: "0 0 60px rgba(103,232,249,.3),0 0 120px rgba(103,232,249,.1)" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TUNNEL FAMILY
   ════════════════════════════════════════════════════════════════════════════ */

function PerspectiveTunnel({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {[0.3, 0.5, 0.7, 0.85, 1.0].map((s, i) => (
        <div key={i} className={cn("ct-spin absolute inset-0", i % 2 === 0 && "ct-depth")}
          style={{ animationDelay: `${i * -3}s`, animationDuration: `${25 + i * 5}s` }}>
          <div className="absolute inset-[10%] rounded-[40%] border border-white/10" style={{ opacity: 0.1 + i * 0.04 }} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent blur-3xl" />
    </div>
  );
}

function LightTunnel({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {[0.2, 0.4, 0.6, 0.8, 1.0].map((s, i) => (
        <div key={i} className={cn("ct-spin absolute inset-0", i % 2 === 0 && "ct-scale")}
          style={{ animationDelay: `${i * -4}s`, animationDuration: `${30 + i * 4}s` }}>
          <div className="absolute inset-[8%] rounded-[40%] border border-amber-400/15" style={{ opacity: 0.08 + i * 0.04 }} />
        </div>
      ))}
      <div className="cg cg-lp absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle,rgba(251,191,36,.2),transparent)", filter: "blur(20px)" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SPACE FAMILY
   ════════════════════════════════════════════════════════════════════════════ */

function Stars({ count, color = "#fff", driftClass = "cs-s1" }: { count: number; color?: string; driftClass?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn("cs-tw absolute rounded-full", driftClass)}
          style={{
            left: `${(i * 7.3 + 2) % 100}%`, top: `${(i * 11.7 + 5) % 100}%`,
            width: `${1 + (i % 3) * 0.5}px`, height: `${1 + (i % 3) * 0.5}px`,
            background: color,
            animationDelay: `${i * 0.15}s`, animationDuration: `${1.5 + (i % 4) * 0.8}s`,
          }} />
      ))}
    </>
  );
}

function InfiniteSpace({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cs-s1"><Stars count={25} color="#e0e7ff" driftClass="cs-s1" /></div>
      <div className="cs-s2"><Stars count={18} color="#93c5fd" driftClass="cs-s2" /></div>
      <div className="cs-s3"><Stars count={10} color="#f0f9ff" driftClass="cs-s3" /></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-indigo-500/5" />
    </div>
  );
}

function GalaxyMotion({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cs-sp absolute -inset-1/2 rounded-full" style={{ background: "conic-gradient(from 0deg,transparent,rgba(168,85,247,.06),rgba(103,232,249,.04),transparent,rgba(168,85,247,.08),transparent)", transformOrigin: "center" }} />
      <div className="cs-sp absolute -inset-1/3 rounded-full" style={{ background: "conic-gradient(from 90deg,transparent,rgba(196,181,253,.05),transparent)", transformOrigin: "center", animationDirection: "reverse", animationDuration: "70s" }} />
      <Stars count={30} color="#e0e7ff" driftClass="cs-s1" />
    </div>
  );
}

function BlueNebula({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cs-np absolute -inset-1/4 rounded-full" style={{ background: "radial-gradient(ellipse at 40% 60%,rgba(59,130,246,.15),rgba(30,64,175,.08),transparent)", filter: "blur(40px)" }} />
      <div className="cs-np absolute -inset-1/3 rounded-full" style={{ background: "radial-gradient(ellipse at 60% 40%,rgba(147,197,253,.1),transparent)", filter: "blur(60px)", animationDelay: "-4s" }} />
      <div className="cs-np absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%,rgba(96,165,250,.05),transparent)", filter: "blur(30px)", animationDelay: "-2s" }} />
      <Stars count={15} color="#bfdbfe" driftClass="cs-s2" />
    </div>
  );
}

function AuroraSky({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cc-f1 absolute -inset-4 rounded-full" style={{ background: "linear-gradient(180deg,rgba(52,211,153,.12),rgba(16,185,129,.06),transparent)", filter: "blur(40px)" }} />
      <div className="cc-f2 absolute -inset-4 rounded-full" style={{ background: "linear-gradient(180deg,rgba(103,232,249,.08),rgba(45,212,191,.05),transparent)", filter: "blur(50px)" }} />
      <div className="cg cg-lp absolute left-1/4 right-1/4 top-1/3 h-1/4 rounded-full bg-gradient-to-r from-transparent via-emerald-400/8 to-transparent blur-2xl" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   OCEAN / WATER FAMILY
   ════════════════════════════════════════════════════════════════════════════ */

function DeepOcean({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cwn absolute -bottom-6 left-0 right-0 h-1/3 rounded-[50%] bg-cyan-500/8 blur-xl" />
      <div className="cwn absolute -bottom-10 left-0 right-0 h-1/4 rounded-[50%] bg-blue-400/5 blur-2xl" style={{ animationDelay: "-3s" }} />
      <div className="cwn absolute -bottom-4 left-0 right-0 h-1/5 rounded-[50%] bg-teal-400/4 blur-xl" style={{ animationDelay: "-1.5s", animationDuration: "10s" }} />
      <div className="cg cg-lp absolute inset-x-[20%] top-[15%] h-1 rounded-full bg-blue-300/10 blur-sm" style={{ boxShadow: "0 0 20px rgba(147,197,253,.15)" }} />
      <Stars count={8} color="#e0f2fe" driftClass="cs-s3" />
    </div>
  );
}

function WaterReflection({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 40%,rgba(20,90,120,.15) 45%,rgba(20,90,120,.08) 50%,transparent 55%)" }} />
      <div className="cwn absolute inset-x-0 top-[44%] h-[12%] rounded-[50%] bg-cyan-400/6 blur-lg" />
      <div className="cw-rf absolute inset-x-0 top-[42%] h-[16%] rounded-[50%] bg-blue-300/4 blur-xl" style={{ animationDelay: "-2s" }} />
      <div className="cwm absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ animationDuration: "4s" }} />
      <div className="cwn absolute -bottom-4 inset-x-0 h-1/6 rounded-[50%] bg-cyan-500/6 blur-2xl" style={{ animationDelay: "-4s" }} />
    </div>
  );
}

function WaveMesh({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div style={{ backgroundImage: "linear-gradient(rgba(103,232,249,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(103,232,249,.04) 1px,transparent 1px)", backgroundSize: "32px 32px" }} className="ca-mu absolute inset-0" />
      <div className="cwn absolute -bottom-8 left-0 right-0 h-[30%] rounded-[50%] bg-cyan-400/8 blur-xl" />
      <div className="cwn absolute -bottom-12 left-0 right-0 h-[20%] rounded-[50%] bg-blue-500/5 blur-2xl" style={{ animationDelay: "-2s" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LIGHT / RAYS FAMILY
   ════════════════════════════════════════════════════════════════════════════ */

function LightRaysCinematic({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cl-cr absolute -inset-1/2" style={{ background: "conic-gradient(from 0deg,transparent,rgba(251,191,36,.04),transparent,rgba(251,191,36,.06),transparent,rgba(217,119,6,.03),transparent)", transformOrigin: "center" }} />
      <div className="cl-cr absolute -inset-1/3" style={{ background: "conic-gradient(from 120deg,transparent,rgba(255,255,255,.03),transparent,rgba(251,191,36,.04),transparent)", transformOrigin: "center", animationDirection: "reverse", animationDuration: "35s" }} />
      <div className="cg cg-lp absolute left-1/2 top-1/3 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle,rgba(251,191,36,.2),transparent)", filter: "blur(15px)" }} />
    </div>
  );
}

function Spotlights({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cl-sw absolute -left-1/4 -top-1/4 h-[150%] w-[80%]" style={{ background: "linear-gradient(135deg,rgba(99,102,241,.08),transparent 60%)", transformOrigin: "left top" }} />
      <div className="cl-sw absolute -right-1/4 -top-1/4 h-[150%] w-[80%]" style={{ background: "linear-gradient(225deg,rgba(168,85,247,.06),transparent 60%)", transformOrigin: "right top", animationDelay: "-6s" }} />
      <div className="cl-sw absolute left-1/4 -top-1/4 h-[120%] w-[60%]" style={{ background: "linear-gradient(180deg,rgba(255,255,255,.03),transparent 60%)", transformOrigin: "center top", animationDelay: "-3s" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   BOKEH / GLASS / ABSTRACT
   ════════════════════════════════════════════════════════════════════════════ */

function BokehLights({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {[18, 28, 38, 48, 58].map((s, i) => (
        <div key={i} className="cs-s1 absolute rounded-full"
          style={{
            width: `${s}px`, height: `${s}px`,
            left: `${(i * 19 + 5) % 100}%`, top: `${(i * 13 + 10) % 80}%`,
            background: i % 2 === 0 ? "rgba(255,255,255,.06)" : "rgba(147,197,253,.08)",
            filter: `blur(${Math.max(2, s * 0.15)}px)`,
            animationDelay: `${i * 1.5}s`, animationDuration: `${12 + i * 2}s`,
          }} />
      ))}
    </div>
  );
}

function FloatingGlass({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="ca-fr absolute rounded-2xl backdrop-blur-sm"
          style={{
            left: `${10 + i * 18}%`, top: `${15 + (i % 3) * 25}%`,
            width: `${40 + i * 12}px`, height: `${40 + (i % 2) * 20}px`,
            border: "1px solid rgba(255,255,255,.08)",
            background: i % 2 === 0 ? "rgba(255,255,255,.02)" : "rgba(147,197,253,.03)",
            animationDelay: `${i * 1.2}s`, animationDuration: `${6 + i * 1.5}s`,
            transform: `rotate(${i * 25}deg)`,
          }} />
      ))}
    </div>
  );
}

function SoftInk({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="ca-bd absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full" style={{ background: "radial-gradient(circle,rgba(120,80,60,.15),transparent)", filter: "blur(50px)" }} />
      <div className="ca-bd absolute -right-1/4 -bottom-1/4 h-2/3 w-2/3 rounded-full" style={{ background: "radial-gradient(circle,rgba(80,60,50,.12),transparent)", filter: "blur(60px)", animationDelay: "-6s" }} />
      <div className="ca-ib absolute left-1/3 top-1/3 h-1/4 w-1/4 rounded-full" style={{ background: "radial-gradient(circle,rgba(100,70,50,.08),transparent)", filter: "blur(30px)" }} />
    </div>
  );
}

function PaperTexture({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="ca-gr absolute inset-0 opacity-[.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "256px 256px" }} />
      <div className="cc-f1 absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-amber-100/10" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FLUID / ORGANIC
   ════════════════════════════════════════════════════════════════════════════ */

function FluidMotion({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="ca-bd absolute -inset-1/4 rounded-full" style={{ background: "radial-gradient(ellipse at 40% 50%,rgba(168,85,247,.12),rgba(99,102,241,.08),transparent)", filter: "blur(50px)" }} />
      <div className="ca-bd absolute -inset-1/3 rounded-full" style={{ background: "radial-gradient(ellipse at 60% 40%,rgba(139,92,246,.08),transparent)", filter: "blur(60px)", animationDelay: "-6s" }} />
      <div className="ca-bd absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(192,132,252,.05),transparent)", filter: "blur(40px)", animationDelay: "-3s" }} />
    </div>
  );
}

function AbstractLines({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="ca-lf absolute left-0 right-0 h-px"
          style={{
            top: `${20 + i * 16}%`,
            background: `linear-gradient(90deg,transparent,rgba(103,232,249,${0.04 + i * 0.02}),transparent)`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${8 + i * 2}s`,
          }} />
      ))}
    </div>
  );
}

function MorningSky({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cc-f1 absolute -inset-4 rounded-full" style={{ background: "linear-gradient(180deg,rgba(249,168,212,.12),rgba(244,114,182,.06),transparent)", filter: "blur(50px)" }} />
      <div className="cc-f2 absolute -inset-4 rounded-full" style={{ background: "linear-gradient(180deg,rgba(251,191,36,.06),rgba(251,146,60,.04),transparent)", filter: "blur(60px)" }} />
      <div className="cg cg-lp absolute left-1/4 right-1/4 top-[15%] h-16 rounded-full" style={{ background: "radial-gradient(ellipse,rgba(253,224,71,.08),transparent)", filter: "blur(20px)" }} />
    </div>
  );
}

function EveningGlow({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cs-np absolute -inset-1/4" style={{ background: "radial-gradient(ellipse at 50% 80%,rgba(251,146,60,.12),rgba(239,68,68,.06),transparent)", filter: "blur(50px)" }} />
      <div className="cs-np absolute -inset-1/3" style={{ background: "radial-gradient(ellipse at 40% 60%,rgba(251,191,36,.08),rgba(217,119,6,.04),transparent)", filter: "blur(60px)", animationDelay: "-4s" }} />
      <div className="cs-np absolute left-1/3 right-1/3 bottom-[15%] h-20 rounded-full" style={{ background: "radial-gradient(ellipse,rgba(251,146,60,.06),transparent)", filter: "blur(30px)", animationDelay: "-2s" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   CINEMATIC / ATMOSPHERIC
   ════════════════════════════════════════════════════════════════════════════ */

function BlueFog({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cc-f1 absolute -inset-4 rounded-full" style={{ background: "radial-gradient(ellipse at 40% 60%,rgba(96,165,250,.1),transparent)", filter: "blur(60px)" }} />
      <div className="cc-f2 absolute -inset-4 rounded-full" style={{ background: "radial-gradient(ellipse at 60% 40%,rgba(147,197,253,.07),transparent)", filter: "blur(80px)" }} />
      <div className="cc-f1 absolute left-0 right-0 top-1/3 h-1/3" style={{ background: "linear-gradient(180deg,transparent,rgba(191,219,254,.05),transparent)", filter: "blur(40px)", animationDelay: "-5s" }} />
    </div>
  );
}

function GoldenDustCinematic({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="cc-du absolute h-1 w-px rounded-full"
          style={{
            left: `${(i * 6.3 + 3) % 100}%`,
            background: i % 2 === 0 ? "#fbbf24" : "#f59e0b",
            boxShadow: `0 0 ${2 + (i % 3)}px rgba(251,191,36,.4)`,
            animationDelay: `${i * 0.5}s`, animationDuration: `${6 + (i % 4) * 2}s`,
          }} />
      ))}
      <div className="cg cg-lp absolute left-1/2 top-1/3 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle,rgba(251,191,36,.1),transparent)", filter: "blur(30px)" }} />
    </div>
  );
}

function GoldenWorship({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cl-gb absolute left-1/4 right-1/4 top-1/5 bottom-1/5 rounded-full" style={{ background: "radial-gradient(ellipse,rgba(251,191,36,.12),rgba(217,119,6,.06),transparent)", filter: "blur(40px)" }} />
      <div className="cl-gb absolute left-1/3 right-1/3 top-1/4 bottom-1/4 rounded-full" style={{ background: "radial-gradient(ellipse,rgba(253,224,71,.06),transparent)", filter: "blur(30px)", animationDelay: "-2.5s" }} />
      <div className="cl-lp absolute inset-x-[30%] top-[25%] h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(253,224,71,.15),transparent)" }} />
    </div>
  );
}

function DarkTheatre({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cc-vb absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.02),transparent 60%)" }} />
      <div className="cl-gb absolute left-1/3 right-1/3 top-1/4 h-1 rounded-full bg-white/5 blur-sm" />
    </div>
  );
}

function StageAmbient({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cc-sb absolute left-1/4 right-1/4 top-0 h-1/2" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(99,102,241,.06),transparent)", filter: "blur(40px)" }} />
      <div className="cc-sb absolute left-1/3 right-1/3 top-0 h-1/3" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(167,139,250,.04),transparent)", filter: "blur(30px)", animationDelay: "-4s" }} />
      <div className="cl-lp absolute inset-x-[20%] top-[10%] h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(199,210,254,.1),transparent)" }} />
    </div>
  );
}

function MinimalMotion({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cc-vb absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.01),transparent 70%)" }} />
      <div className="cl-lp absolute left-1/3 right-1/3 top-1/2 h-px bg-white/5 blur-sm" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOG / AMBIENT
   ════════════════════════════════════════════════════════════════════════════ */

function DigitalHorizon({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden", paused && "paused")}>
      <div className="cg-h absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(125,211,252,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(125,211,252,.04) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="cc-hp absolute left-0 right-0 top-[45%] h-px bg-cyan-400/30 blur-sm" style={{ boxShadow: "0 0 12px rgba(103,232,249,.2)" }} />
      <div className="cc-f1 absolute left-0 right-0 top-[30%] h-1/4" style={{ background: "linear-gradient(180deg,rgba(125,211,252,.03),transparent)", filter: "blur(30px)" }} />
    </div>
  );
}

function CrossLight({ paused }: AnimProps) {
  useStyles();
  return (
    <div className={cn("absolute inset-0 overflow-hidden flex items-center justify-center", paused && "paused")}>
      <div className="cc-cr relative flex items-center justify-center">
        <div className="absolute h-16 w-4 rounded bg-gradient-to-b from-amber-300/30 to-amber-400/10" />
        <div className="absolute -left-6 top-6 h-4 w-16 rounded bg-gradient-to-r from-amber-300/30 to-amber-400/10" />
      </div>
      <div className="cc-cg absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle,rgba(251,191,36,.1),transparent)", filter: "blur(15px)" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAP
   ════════════════════════════════════════════════════════════════════════════ */

const ANIM_MAP: Record<string, React.FC<AnimProps>> = {
  "moving-grid": MovingGrid,
  "warp-grid": WarpGrid,
  "neon-grid": NeonGrid,
  "perspective-tunnel": PerspectiveTunnel,
  "light-tunnel": LightTunnel,
  "infinite-space": InfiniteSpace,
  "galaxy-motion": GalaxyMotion,
  "deep-ocean": DeepOcean,
  "aurora-sky": AuroraSky,
  "bokeh-lights": BokehLights,
  "floating-glass": FloatingGlass,
  "soft-ink": SoftInk,
  "paper-texture": PaperTexture,
  "light-rays-cinematic": LightRaysCinematic,
  spotlights: Spotlights,
  "blue-nebula": BlueNebula,
  "golden-worship": GoldenWorship,
  "abstract-lines": AbstractLines,
  "wave-mesh": WaveMesh,
  "fluid-motion": FluidMotion,
  "water-reflection": WaterReflection,
  "digital-horizon": DigitalHorizon,
  "blue-fog": BlueFog,
  "golden-dust-cinematic": GoldenDustCinematic,
  "cross-light": CrossLight,
  "morning-sky": MorningSky,
  "evening-glow": EveningGlow,
  "dark-theatre": DarkTheatre,
  "stage-ambient": StageAmbient,
  "minimal-motion": MinimalMotion,
};

export function ThemeAnimation({ animation, paused }: { animation: BackgroundAnimation; paused?: boolean }) {
  const Comp = ANIM_MAP[animation];
  if (!Comp) return null;
  return <Comp paused={paused} />;
}

export function getAnimationLabel(animation: BackgroundAnimation): string {
  const labels: Record<string, string> = {
    "moving-grid": "Moving Grid",
    "warp-grid": "Warp Grid",
    "neon-grid": "Neon Grid",
    "perspective-tunnel": "Tunnel",
    "light-tunnel": "Light Tunnel",
    "infinite-space": "Infinite Space",
    "galaxy-motion": "Galaxy Motion",
    "deep-ocean": "Deep Ocean",
    "aurora-sky": "Aurora Sky",
    "bokeh-lights": "Bokeh Lights",
    "floating-glass": "Glass",
    "soft-ink": "Soft Ink",
    "paper-texture": "Paper Texture",
    "light-rays-cinematic": "Light Rays",
    spotlights: "Spotlights",
    "blue-nebula": "Blue Nebula",
    "golden-worship": "Golden Worship",
    "abstract-lines": "Abstract Lines",
    "wave-mesh": "Wave Mesh",
    "fluid-motion": "Fluid Motion",
    "water-reflection": "Water Reflection",
    "digital-horizon": "Digital Horizon",
    "blue-fog": "Blue Fog",
    "golden-dust-cinematic": "Golden Dust",
    "cross-light": "Cross Light",
    "morning-sky": "Morning Sky",
    "evening-glow": "Evening Glow",
    "dark-theatre": "Dark Theatre",
    "stage-ambient": "Stage Ambient",
    "minimal-motion": "Minimal Motion",
  };
  return labels[animation] ?? animation;
}
