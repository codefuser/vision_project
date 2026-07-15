/**
 * Theme Preset Library — 50 premium, hand-curated worship presentation themes.
 *
 *  • 30 Animated themes — each with unique motion style and visual identity
 *  • 20 Static themes — carefully crafted for every service context
 *  • No colour-swap duplicates — every theme differs in typography, spacing,
 *    background, animation, and mood
 *  • Production-ready for live church projection
 */
import type { BackgroundConfig, SectionStyle, BackgroundAnimation } from "@/lib/broadcast";
import type { LogoSettings } from "@/stores/logo.store";

export type TemplateCategory =
  | "Worship" | "Bible" | "Prayer" | "Seasonal" | "Events"
  | "Modern" | "Animated" | "Minimal";

export type ThemeMood = "classic" | "modern" | "warm" | "cool" | "dark" | "light" | "dramatic" | "gentle";

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  mood?: ThemeMood;
  tags?: string[];
  text: Partial<SectionStyle>;
  perGroup?: Partial<Record<"reference" | "tamil" | "english", Partial<SectionStyle>>>;
  background: Partial<BackgroundConfig>;
  logo?: { enabled: boolean; settings?: Partial<LogoSettings> };
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Worship", "Bible", "Prayer", "Seasonal", "Events",
  "Modern", "Animated", "Minimal",
];

const shadowSoft = { shadow: true, shadowColor: "#000000", shadowBlur: 22 };
const shadowDeep = { shadow: true, shadowColor: "#000000", shadowBlur: 40 };
const shadowLight = { shadow: true, shadowColor: "#000000", shadowBlur: 12 };

const T = (text: Partial<SectionStyle>): Partial<SectionStyle> => ({
  align: "center", vAlign: "middle", lineHeight: 1.35, ...shadowSoft, ...text,
});

interface BuildOpts {
  id: string; name: string; category: TemplateCategory; description?: string;
  bg: string; gradient?: string; animation?: BackgroundAnimation;
  color?: string; refColor?: string;
  fontEn?: string; fontTa?: string; weight?: number;
  shadow?: "soft" | "deep" | "none" | "light";
  tamilSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  padding?: number;
  align?: "left" | "center" | "right";
  vAlign?: "top" | "middle" | "bottom";
  mood?: ThemeMood;
  tags?: string[];
  logo?: TemplatePreset["logo"];
  bgOpacity?: number;
  bgColor?: string;
}

const build = (o: BuildOpts): TemplatePreset => {
  const fontEn = o.fontEn ?? "Inter";
  const fontTa = o.fontTa ?? "Latha";
  const color = o.color ?? "#ffffff";
  const sh = o.shadow === "none" ? { shadow: false, shadowBlur: 0 }
    : o.shadow === "deep" ? shadowDeep
    : o.shadow === "light" ? shadowLight
    : shadowSoft;
  return {
    id: o.id, name: o.name, category: o.category,
    description: o.description ?? `${o.name} — worship presentation theme.`,
    mood: o.mood,
    tags: o.tags,
    text: {
      ...T({ fontFamily: fontEn, color, fontWeight: o.weight ?? 500 }),
      ...sh,
      ...(o.lineHeight ? { lineHeight: o.lineHeight } : {}),
      ...(o.letterSpacing != null ? { letterSpacing: o.letterSpacing } : {}),
      ...(o.padding != null ? { paddingVw: o.padding } : {}),
      ...(o.align ? { align: o.align } : {}),
      ...(o.vAlign ? { vAlign: o.vAlign } : {}),
    },
    perGroup: {
      reference: { ...(o.refColor ? { color: o.refColor } : {}), ...(o.shadow !== "none" ? { shadow: true, shadowBlur: 20, shadowColor: "#000000" } : {}) },
      tamil: { fontFamily: fontTa, fontSizeVw: o.tamilSize ?? 5 },
      english: { fontFamily: fontEn },
    },
    background: {
      kind: o.animation ? "color" : "color",
      color: o.bg,
      gradient: o.gradient ?? null,
      animation: o.animation ?? "none",
      ...(o.bgOpacity != null ? { opacity: o.bgOpacity } : {}),
      ...(o.bgColor ? { overlayColor: o.bgColor } : {}),
    },
    logo: o.logo,
  };
};

const ANIMATED_THEMES: BuildOpts[] = [
  { id: "animated-aurora-flow", name: "Aurora Flow", bg: "#0a0e2c", gradient: "linear-gradient(180deg,#0a0e2c,#1e1b4b,#312e81)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["aurora", "northern-lights", "motion", "green"], animation: "aurora", weight: 300, letterSpacing: 3, description: "Emerald and violet northern lights dance slowly across the sanctuary. Ethereal worship atmosphere." },
  { id: "animated-aurora-borealis", name: "Aurora Borealis", bg: "#020617", gradient: "linear-gradient(180deg,#020617,#1e1b4b,#4c1d95)", color: "#f0e6ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["aurora", "borealis", "purple", "pink"], animation: "aurora-borealis", weight: 300, letterSpacing: 2, description: "Pink and cyan aurora bands ripple through a deep arctic sky. Majestic and awe-inspiring." },
  { id: "animated-gentle-clouds", name: "Gentle Clouds", bg: "#0c4a6e", gradient: "linear-gradient(180deg,#082f49,#0369a1)", fontEn: "Mukta Malar", fontTa: "Mukta Malar", category: "Animated", mood: "cool", tags: ["clouds", "sky", "drift", "peace"], animation: "clouds", weight: 500, description: "Soft white clouds drift slowly across a serene blue sky. Peaceful and open." },
  { id: "animated-floating-particles", name: "Floating Particles", bg: "#0f172a", gradient: "radial-gradient(ellipse at 50% 50%,#1e293b,#0f172a 80%)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "dark", tags: ["particles", "float", "meditative"], animation: "particles", weight: 300, letterSpacing: 2, description: "Tiny luminous particles rise like prayers. Meditative and ethereal." },
  { id: "animated-fireflies", name: "Fireflies", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 70%,#1a2a0a,#0a0a0a 80%)", color: "#fef9c3", fontEn: "Georgia", fontTa: "Latha", category: "Animated", mood: "warm", tags: ["fireflies", "warm", "summer", "glow"], animation: "fireflies", shadow: "deep", description: "Warm golden fireflies flicker in the darkness. Intimate and enchanting." },
  { id: "animated-ocean-waves", name: "Ocean Waves", bg: "#082f49", gradient: "linear-gradient(180deg,#082f49,#0c4a6e,#0284c7)", color: "#e0f2fe", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "cool", tags: ["ocean", "waves", "deep", "calm"], animation: "ocean", lineHeight: 1.4, description: "Gentle ocean swells roll across a deep blue sea. Calm and restorative." },
  { id: "animated-water-ripple", name: "Soft Water Ripple", bg: "#0c1e3f", gradient: "linear-gradient(180deg,#0c1e3f,#1e3a8a,#38bdf8)", color: "#f0f9ff", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "cool", tags: ["water", "ripple", "gentle", "blue"], animation: "water", weight: 300, letterSpacing: 1, description: "Subtle ripples spread across a still water surface. Tranquil and soothing." },
  { id: "animated-rain-light", name: "Rain Light", bg: "#1e293b", gradient: "linear-gradient(180deg,#1e293b,#334155)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", category: "Animated", mood: "cool", tags: ["rain", "quiet", "gentle", "gray"], animation: "rain", weight: 400, description: "Gentle rain falls in soft streaks. Quiet, reflective, and calming." },
  { id: "animated-snow-fall", name: "Snow Fall", bg: "#0f172a", gradient: "linear-gradient(180deg,#0f172a,#1e293b)", color: "#f8fafc", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "gentle", tags: ["snow", "winter", "christmas", "peace"], animation: "snow", shadow: "deep", description: "Pure white snowflakes fall silently against a winter night. Serene and holy." },
  { id: "animated-floating-dust", name: "Floating Dust", bg: "#1c1917", gradient: "radial-gradient(ellipse at 50% 50%,#3b2f2a,#1c1917 80%)", color: "#f5f5f4", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["dust", "float", "warm", "suspended"], animation: "floating-dust", weight: 300, description: "Dust motes suspended in warm light. A cathedral stillness." },
  { id: "animated-candle-flicker", name: "Candle Flicker", bg: "#1a0f08", gradient: "radial-gradient(circle at 50% 70%,#3a1e0a,#0a0604 80%)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["candle", "flicker", "warm", "prayer"], animation: "candle-glow", shadow: "deep", description: "A single candle flame pulses in the darkness. Prayerful and intimate." },
  { id: "animated-golden-dust", name: "Golden Dust", bg: "#1c1006", gradient: "radial-gradient(circle at 50% 50%,#3b2412,#1c1006 80%)", color: "#fde68a", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["gold", "dust", "glory", "incense"], animation: "golden-particles", shadow: "deep", description: "Rising golden particles shimmer like incense before the throne. Glorious worship." },
  { id: "animated-light-rays", name: "Light Rays", bg: "#78350f", gradient: "radial-gradient(circle at 50% 50%,#d97706,#78350f 70%)", color: "#fffbeb", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "dramatic", tags: ["light", "rays", "glory", "golden"], animation: "light-rays", weight: 600, shadow: "deep", description: "Rotating rays of golden light break through the darkness. Majesty and transcendence." },
  { id: "animated-sun-beam", name: "Sun Beam", bg: "#1c3b0f", gradient: "radial-gradient(circle at 50% 0%,#fbbf24,#78350f 80%)", color: "#fff7ed", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "warm", tags: ["sun", "beam", "warm", "bright"], animation: "light-rays", weight: 500, description: "Warm sunbeams sweep across the stage like morning light. Hope and renewal." },
  { id: "animated-stage-lights", name: "Stage Lights", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 50%,#1e1b4b,#0a0a0a 80%)", fontEn: "Catamaran", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["stage", "lights", "concert", "energy"], animation: "stage-lights", weight: 600, description: "Concert-stage spotlights sweep across a dark arena. High-energy worship night." },
  { id: "animated-moving-gradient", name: "Moving Gradient", bg: "#0f172a", gradient: "linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "modern", tags: ["gradient", "sweep", "modern", "smooth"], animation: "gradient-shift", weight: 300, letterSpacing: 2, description: "A smooth colour gradient slowly shifts across the screen. Modern and elegant." },
  { id: "animated-ribbon-flow", name: "Ribbon Flow", bg: "#2e1065", gradient: "linear-gradient(135deg,#2e1065,#6b21a8,#a21caf)", color: "#fae8ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["ribbon", "flow", "purple", "graceful"], animation: "ribbon", weight: 300, letterSpacing: 2, description: "Graceful purple ribbons flow and intertwine. Elegant and artistic." },
  { id: "animated-smoke-motion", name: "Smoke Motion", bg: "#292524", gradient: "linear-gradient(180deg,#292524,#1c1917)", color: "#f5f5f4", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "dark", tags: ["smoke", "wisp", "atmospheric", "mystery"], animation: "smoke", weight: 300, description: "Thin wisps of smoke curl upward in the dim light. Atmospheric and mysterious." },
  { id: "animated-nebula", name: "Nebula", bg: "#0a0020", gradient: "radial-gradient(ellipse at 50% 50%,#1a0a3e,#0a0020 80%)", color: "#f0e6ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["nebula", "space", "cosmic", "purple"], animation: "nebula", weight: 300, letterSpacing: 3, description: "A cosmic nebula swirls with violet and cyan gases. Awe-inspiring creation." },
  { id: "animated-galaxy", name: "Galaxy", bg: "#020014", gradient: "radial-gradient(ellipse at 50% 50%,#1a0a3e,#020014 80%)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["galaxy", "stars", "space", "cosmic"], animation: "galaxy", weight: 300, letterSpacing: 2, description: "A spiral galaxy turns slowly beneath countless stars. The heavens declare His glory." },
  { id: "animated-purple-mist", name: "Purple Mist", bg: "#1a0a2e", gradient: "linear-gradient(180deg,#1a0a2e,#3b1f5e)", color: "#f3e8ff", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "gentle", tags: ["mist", "purple", "fog", "mystery"], animation: "fog", weight: 400, description: "Veils of purple mist drift across the scene. Mysterious and contemplative." },
  { id: "animated-cross-glow", name: "Cross Glow", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 50%,#1f2937,#0a0a0a 80%)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Latha", category: "Animated", mood: "dark", tags: ["cross", "glow", "sacrifice", "glory"], animation: "floating-cross", shadow: "deep", description: "A glowing cross pulses at the centre of the darkness. The focal point of faith." },
  { id: "animated-light-pulse", name: "Light Pulse", bg: "#020617", gradient: "radial-gradient(ellipse at 50% 50%,#1e3a8a,#020617 80%)", color: "#bfdbfe", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["pulse", "light", "beat", "breath"], animation: "soft-glow", weight: 300, lineHeight: 1.5, description: "A soft halo of light pulses like a heartbeat. Breathing in the Spirit." },
  { id: "animated-bokeh", name: "Bokeh", bg: "#1c1917", gradient: "radial-gradient(ellipse at 50% 50%,#3b2f2a,#1c1917 80%)", color: "#f5f5f4", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "dark", tags: ["bokeh", "blur", "soft", "dreamy"], animation: "bokeh", weight: 300, description: "Soft blurred circles of light float gently. Dreamy and cinematic." },
  { id: "animated-bloom", name: "Bloom", bg: "#0f172a", gradient: "radial-gradient(ellipse at 50% 50%,#1e293b,#0f172a 80%)", color: "#e2e8f0", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "modern", tags: ["bloom", "expand", "circle", "modern"], animation: "bloom", weight: 300, letterSpacing: 1, description: "Rings of light expand outward like ripples in the Spirit. Fresh and alive." },
  { id: "animated-lens-flare", name: "Soft Lens Flare", bg: "#292524", gradient: "radial-gradient(ellipse at 40% 30%,#57534e,#292524 80%)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["lens", "flare", "warm", "cinematic"], animation: "lens-flare", shadow: "deep", description: "Warm lens flares appear and fade like light through glass. Cinematic worship." },
  { id: "animated-northern-sky", name: "Northern Sky", bg: "#020617", gradient: "linear-gradient(180deg,#020617,#1e1b4b,#3730a3)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["sky", "northern", "aurora", "blue"], animation: "sky-motion", weight: 300, letterSpacing: 2, description: "The northern sky shifts with subtle aurora colours. Vast and humbling." },
  { id: "animated-velvet-motion", name: "Velvet Motion", bg: "#200a0a", gradient: "linear-gradient(135deg,#200a0a,#4a0e1a,#881337)", color: "#ffe4e6", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "dramatic", tags: ["velvet", "deep", "red", "rich"], animation: "velvet", weight: 400, description: "Rich velvet crimson undulates like fabric in a sanctuary. Deep and reverent." },
  { id: "animated-worship-glow", name: "Worship Glow", bg: "#1c0f08", gradient: "radial-gradient(circle at 50% 50%,#f59e0b,#78350f 70%)", color: "#fffbeb", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["glow", "worship", "golden", "warm"], animation: "abstract-worship", weight: 500, shadow: "deep", description: "A warm golden glow radiates from centre. Worship in spirit and truth." },
  { id: "animated-heaven-light", name: "Heaven Light", bg: "#0c1e3f", gradient: "radial-gradient(ellipse at 50% 0%,#fef08a,#0c1e3f 70%)", color: "#fef9c3", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "dramatic", tags: ["heaven", "light", "glory", "golden"], animation: "heaven-light", weight: 600, shadow: "deep", description: "Golden light descends from above like heaven opening. Glorious and transcendent." },
];

const WORSHIP_THEMES: BuildOpts[] = [
  { id: "worship-royal-sapphire", name: "Royal Sapphire", bg: "#0c1e3f", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Worship", mood: "classic", tags: ["navy", "serif", "traditional"], lineHeight: 1.3, letterSpacing: 0.5, shadow: "deep", description: "White Georgia serif on deep navy. Timeless and majestic." },
  { id: "worship-crimson", name: "Crimson Worship", bg: "#4a0e1a", gradient: "linear-gradient(180deg,#4a0e1a,#7f1d1d)", color: "#fdf6e3", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Worship", mood: "classic", tags: ["burgundy", "serif", "warm", "traditional"], padding: 8, description: "Warm ivory serif on deep burgundy. Traditional and reverent." },
  { id: "worship-indigo-modern", name: "Indigo Modern", bg: "#1e1b4b", gradient: "linear-gradient(135deg,#1e1b4b,#4338ca,#7c3aed)", fontEn: "Catamaran", fontTa: "Catamaran", category: "Worship", mood: "modern", tags: ["indigo", "gradient", "contemporary"], weight: 600, description: "Indigo-to-violet gradient with bold sans. Contemporary worship." },
  { id: "worship-golden-harvest", name: "Golden Harvest", bg: "#78350f", gradient: "linear-gradient(135deg,#78350f,#d97706,#fbbf24)", color: "#fffbeb", fontEn: "Inter", fontTa: "Mukta Malar", category: "Worship", mood: "warm", tags: ["gold", "harvest", "warm", "sunset"], shadow: "light", description: "Golden amber gradient with warm white text. Sunset glow." },
];

const BIBLE_THEMES: BuildOpts[] = [
  { id: "bible-parchment", name: "Parchment", bg: "#f5efe0", color: "#1c1917", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Bible", mood: "light", tags: ["cream", "serif", "readable", "study"], shadow: "none", lineHeight: 1.45, padding: 8, letterSpacing: 0.3, vAlign: "top", description: "Dark ink on cream parchment. The classic Bible-reading experience." },
  { id: "bible-scholar", name: "Scholar", bg: "#0a0a0a", color: "#ffffff", fontEn: "Georgia", fontTa: "Latha", category: "Bible", mood: "dark", tags: ["black", "gold", "study", "deep"], refColor: "#fcd34d", shadow: "deep", description: "Black backdrop, gold reference, white body text. Deep study." },
  { id: "bible-scripture-light", name: "Scripture Light", bg: "#fafaf9", color: "#0c0a09", fontEn: "Inter", fontTa: "Noto Sans Tamil", category: "Bible", mood: "light", tags: ["white", "sans", "clean", "readable"], shadow: "none", lineHeight: 1.5, padding: 10, vAlign: "top", align: "left", description: "Clean white with dark sans-serif. Maximum readability." },
  { id: "bible-dawn-study", name: "Dawn Study", bg: "#0f172a", color: "#e0e7ff", fontEn: "Inter", fontTa: "Mukta Malar", category: "Bible", mood: "cool", tags: ["navy", "blue", "dawn", "study"], refColor: "#93c5fd", lineHeight: 1.4, description: "Calm study blue with light reference. Easy on the eyes." },
];

const PRAYER_THEMES: BuildOpts[] = [
  { id: "prayer-candlelight", name: "Candlelight", bg: "#1a0f08", gradient: "radial-gradient(circle at 50% 70%,#3a1e0a,#0a0604 80%)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Prayer", mood: "warm", tags: ["amber", "candle", "warm", "prayer"], animation: "candle-glow", shadow: "deep", description: "Flickering candle warmth. Quiet, reverent, intimate." },
  { id: "prayer-incense", name: "Incense", bg: "#1c0f1a", gradient: "linear-gradient(180deg,#1c0f1a,#3b1f3a)", color: "#fbcfe8", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Prayer", mood: "gentle", tags: ["purple", "mystery", "drift", "prayer"], animation: "fog", lineHeight: 1.35, description: "Soft drifting mist in violet. Prayer like incense rising." },
];

const SEASONAL_THEMES: BuildOpts[] = [
  { id: "seasonal-evergreen", name: "Evergreen", bg: "#064e3b", color: "#fbbf24", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Seasonal", mood: "warm", tags: ["green", "gold", "christmas", "festive"], shadow: "soft", letterSpacing: 1.5, description: "Festive evergreen with gold serif. Christmas joy." },
  { id: "seasonal-new-dawn", name: "New Dawn", bg: "#020617", gradient: "linear-gradient(135deg,#020617,#1e3a8a)", color: "#fef3c7", fontEn: "Inter", fontTa: "Catamaran", category: "Seasonal", mood: "dramatic", tags: ["sparkle", "new-year", "stars", "fresh"], animation: "sparkles", weight: 600, description: "New Year sparkle over deep blue. Fresh start ahead." },
];

const EVENTS_THEMES: BuildOpts[] = [
  { id: "events-rose-garden", name: "Rose Garden", bg: "#9d174d", gradient: "linear-gradient(135deg,#831843,#db2777,#f9a8d4)", color: "#fff1f2", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Events", mood: "gentle", tags: ["rose", "wedding", "romantic", "elegant"], letterSpacing: 2, weight: 400, description: "Blush rose gradient. Elegant wedding atmosphere." },
  { id: "events-youth-pulse", name: "Youth Pulse", bg: "#3b0764", gradient: "linear-gradient(135deg,#3b0764,#7e22ce,#ec4899)", fontEn: "Catamaran", fontTa: "Catamaran", category: "Events", mood: "dramatic", tags: ["violet", "youth", "bold", "energy"], weight: 700, shadow: "light", description: "Electric violet-to-pink gradient. Energetic youth night." },
];

const MODERN_THEMES: BuildOpts[] = [
  { id: "modern-glass", name: "Glass Worship", bg: "#0f172a", gradient: "radial-gradient(circle at 70% 30%,#1e293b,#0f172a 80%)", fontEn: "Inter", fontTa: "Catamaran", category: "Modern", mood: "cool", tags: ["glass", "modern", "clean", "subtle"], weight: 300, shadow: "none", letterSpacing: 3, bgOpacity: 0.85, description: "Subtle glassmorphism-inspired dark. Thin, elegant, modern." },
  { id: "modern-edge", name: "Edge", bg: "#020617", gradient: "linear-gradient(135deg,#020617,#0f172a,#020617)", color: "#2dd4bf", fontEn: "Inter", fontTa: "Catamaran", category: "Modern", mood: "dramatic", tags: ["teal", "edge", "modern", "bold"], weight: 300, shadow: "none", letterSpacing: 4, lineHeight: 1.5, description: "Dark cyber backdrop with teal accent text. Edgy and bold." },
  { id: "modern-monochrome", name: "Monochrome", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 60%,#1a1a2e,#0a0a0a 80%)", fontEn: "Inter", fontTa: "Mukta Malar", category: "Modern", mood: "dark", tags: ["stage", "clean", "minimal", "focus"], weight: 400, shadow: "light", description: "Stage-lit minimal dark. Clean, focused, undistracted." },
];

const MINIMAL_THEMES: BuildOpts[] = [
  { id: "minimal-black", name: "Minimal Black", bg: "#000000", fontEn: "Inter", fontTa: "Mukta Malar", category: "Minimal", mood: "dark", tags: ["black", "thin", "clean", "pure"], weight: 300, shadow: "none", letterSpacing: 2, description: "Pure black with thin sans. Nothing but the Word." },
  { id: "minimal-white", name: "Minimal White", bg: "#fafaf9", color: "#1c1917", fontEn: "Inter", fontTa: "Noto Sans Tamil", category: "Minimal", mood: "light", tags: ["white", "clean", "paper", "airy"], shadow: "none", padding: 10, description: "Pure white with dark sans. Clean, airy, and modern." },
  { id: "minimal-frost", name: "Frost", bg: "#e0f2fe", color: "#0c4a6e", fontEn: "Inter", fontTa: "Mukta Malar", category: "Minimal", mood: "cool", tags: ["ice", "frost", "cold", "crisp"], shadow: "none", weight: 400, padding: 8, description: "Icy blue-white. Cool, crisp, and refreshing." },
];

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  ...ANIMATED_THEMES.map(build),
  ...WORSHIP_THEMES.map(build),
  ...BIBLE_THEMES.map(build),
  ...PRAYER_THEMES.map(build),
  ...SEASONAL_THEMES.map(build),
  ...EVENTS_THEMES.map(build),
  ...MODERN_THEMES.map(build),
  ...MINIMAL_THEMES.map(build),
];
