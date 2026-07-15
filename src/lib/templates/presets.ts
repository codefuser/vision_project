/**
 * Theme Preset Library — 50 premium, hand-curated worship presentation themes.
 *
 * Design philosophy:
 *  • Quality over quantity — each theme has a unique visual identity
 *  • No colour-swap duplicates — every theme differs in typography,
 *    spacing, background style, animation, and mood
 *  • Balanced coverage across service contexts
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

// ───────── Builder helpers ─────────
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

const WORSHIP_THEMES: BuildOpts[] = [
  { id: "worship-royal-sapphire", name: "Royal Sapphire", bg: "#0c1e3f", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Worship", mood: "classic", tags: ["navy", "serif", "traditional"], lineHeight: 1.3, letterSpacing: 0.5, shadow: "deep", description: "White Georgia serif on deep navy. Timeless and majestic." },
  { id: "worship-emerald-grace", name: "Emerald Grace", bg: "#0f3b2e", gradient: "linear-gradient(135deg,#0f3b2e,#1a6b4e)", fontEn: "Inter", fontTa: "Mukta Malar", category: "Worship", mood: "modern", tags: ["green", "sans", "contemporary"], weight: 500, letterSpacing: 1, description: "Crisp white sans on rich emerald gradient. Fresh and alive." },
  { id: "worship-crimson", name: "Crimson Worship", bg: "#4a0e1a", gradient: "linear-gradient(180deg,#4a0e1a,#7f1d1d)", color: "#fdf6e3", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Worship", mood: "classic", tags: ["burgundy", "serif", "warm"], padding: 8, description: "Warm ivory serif on deep burgundy. Traditional and reverent." },
  { id: "worship-ivory", name: "Classic Ivory", bg: "#f5efe0", color: "#1f2937", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Worship", mood: "light", tags: ["cream", "serif", "daylight"], shadow: "none", lineHeight: 1.4, padding: 6, description: "Dark serif on warm cream. Bible-page calm and readable." },
  { id: "worship-indigo-modern", name: "Indigo Modern", bg: "#1e1b4b", gradient: "linear-gradient(135deg,#1e1b4b,#4338ca,#7c3aed)", fontEn: "Catamaran", fontTa: "Catamaran", category: "Worship", mood: "modern", tags: ["indigo", "gradient", "contemporary"], weight: 600, description: "Indigo-to-violet gradient with bold sans. Contemporary worship." },
  { id: "worship-golden-hour", name: "Golden Hour", bg: "#78350f", gradient: "linear-gradient(135deg,#78350f,#d97706,#fbbf24)", color: "#fffbeb", fontEn: "Inter", fontTa: "Mukta Malar", category: "Worship", mood: "warm", tags: ["gold", "amber", "warm"], shadow: "light", description: "Golden amber gradient with warm white text. Sunset glow." },
  { id: "worship-stone", name: "Stone Sanctuary", bg: "#292524", gradient: "radial-gradient(ellipse at 50% 50%,#44403c,#292524 80%)", color: "#f5f5f4", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Worship", mood: "dark", tags: ["stone", "serif", "quiet"], shadow: "deep", description: "Quiet stone-gray sanctuary. Calm and grounded." },
  { id: "worship-rosewater", name: "Rosewater", bg: "#831843", gradient: "linear-gradient(135deg,#500724,#be185d,#f9a8d4)", color: "#fff1f2", fontEn: "Inter", fontTa: "Catamaran", category: "Worship", mood: "gentle", tags: ["rose", "pink", "gentle"], weight: 400, description: "Soft rose-to-blush gradient. Tender and welcoming." },
  { id: "worship-charcoal", name: "Charcoal Worship", bg: "#171717", color: "#fafafa", fontEn: "Inter", fontTa: "Mukta Malar", category: "Worship", mood: "dark", tags: ["black", "sans", "bold"], weight: 700, shadow: "light", description: "Bold white sans on near-black. Clean and powerful." },
  { id: "worship-sky", name: "Sky Worship", bg: "#0c4a6e", gradient: "linear-gradient(180deg,#0c4a6e,#0284c7)", fontEn: "Mukta Malar", fontTa: "Mukta Malar", category: "Worship", mood: "cool", tags: ["blue", "sky", "open"], weight: 500, letterSpacing: 2, description: "Morning sky-blue gradient. Open, airy, hopeful." },
];

const BIBLE_THEMES: BuildOpts[] = [
  { id: "bible-parchment", name: "Parchment", bg: "#f5efe0", color: "#1c1917", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Bible", mood: "light", tags: ["cream", "serif", "readable"], shadow: "none", lineHeight: 1.45, padding: 8, letterSpacing: 0.3, vAlign: "top", description: "Dark ink on cream parchment. The classic Bible-reading experience." },
  { id: "bible-scholar", name: "Scholar", bg: "#0a0a0a", color: "#ffffff", fontEn: "Georgia", fontTa: "Latha", category: "Bible", mood: "dark", tags: ["black", "gold", "study"], refColor: "#fcd34d", shadow: "deep", description: "Black backdrop, gold reference, white body text. Deep study." },
  { id: "bible-scripture-light", name: "Scripture Light", bg: "#fafaf9", color: "#0c0a09", fontEn: "Inter", fontTa: "Noto Sans Tamil", category: "Bible", mood: "light", tags: ["white", "sans", "clean"], shadow: "none", lineHeight: 1.5, padding: 10, vAlign: "top", align: "left", description: "Clean white with dark sans-serif. Maximum readability." },
  { id: "bible-dawn", name: "Dawn Study", bg: "#0f172a", color: "#e0e7ff", fontEn: "Inter", fontTa: "Mukta Malar", category: "Bible", mood: "cool", tags: ["navy", "blue", "dawn"], refColor: "#93c5fd", lineHeight: 1.4, description: "Calm study blue with light reference. Easy on the eyes." },
  { id: "bible-monastery", name: "Monastery", bg: "#292524", color: "#fde68a", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Bible", mood: "warm", tags: ["brown", "warm", "quiet"], shadow: "deep", lineHeight: 1.35, padding: 8, description: "Warm brown leather tones with amber text. Quiet reverence." },
];

const PRAYER_THEMES: BuildOpts[] = [
  { id: "prayer-candlelight", name: "Candlelight", bg: "#1a0f08", gradient: "radial-gradient(circle at 50% 70%,#3a1e0a,#0a0604 80%)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Prayer", mood: "warm", tags: ["amber", "candle", "warm"], animation: "candle-glow", shadow: "deep", description: "Flickering candle warmth. Quiet, reverent, intimate." },
  { id: "prayer-twilight", name: "Twilight Prayer", bg: "#1e1b4b", gradient: "linear-gradient(180deg,#0f0a2e,#312e81)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Catamaran", category: "Prayer", mood: "cool", tags: ["indigo", "twilight", "stars"], animation: "particles", shadow: "deep", description: "Indigo twilight with drifting particles. Still and searching." },
  { id: "prayer-quiet-night", name: "Quiet Night", bg: "#0a0a0a", color: "#e5e7eb", fontEn: "Georgia", fontTa: "Latha", category: "Prayer", mood: "dark", tags: ["black", "silent", "night"], animation: "soft-glow", shadow: "deep", lineHeight: 1.4, description: "Silent night with a soft halo. Complete stillness." },
  { id: "prayer-incense", name: "Incense", bg: "#1c0f1a", gradient: "linear-gradient(180deg,#1c0f1a,#3b1f3a)", color: "#fbcfe8", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Prayer", mood: "gentle", tags: ["purple", "mystery", "drift"], animation: "fog", lineHeight: 1.35, description: "Soft drifting mist in violet. Prayer like incense rising." },
];

const SEASONAL_THEMES: BuildOpts[] = [
  { id: "seasonal-evergreen", name: "Evergreen", bg: "#064e3b", color: "#fbbf24", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Seasonal", mood: "warm", tags: ["green", "gold", "christmas"], shadow: "soft", letterSpacing: 1.5, description: "Festive evergreen with gold serif. Christmas joy." },
  { id: "seasonal-starry-night", name: "Starry Night", bg: "#0a0e2c", color: "#fef3c7", fontEn: "Georgia", fontTa: "Latha", category: "Seasonal", mood: "dramatic", tags: ["stars", "night", "christmas"], animation: "star-field", shadow: "deep", description: "Twinkling stars over a midnight sky. The nativity waits." },
  { id: "seasonal-easter-dawn", name: "Easter Dawn", bg: "#7c2d12", gradient: "linear-gradient(180deg,#7c2d12,#fb923c 50%,#fde68a)", color: "#fff7ed", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Seasonal", mood: "dramatic", tags: ["sunrise", "easter", "orange"], animation: "sunrise", weight: 600, shadow: "none", description: "Resurrection morning sunrise. He is risen." },
  { id: "seasonal-harvest", name: "Harvest Gold", bg: "#92400e", gradient: "linear-gradient(135deg,#92400e,#d97706)", color: "#fffbeb", fontEn: "Inter", fontTa: "Mukta Malar", category: "Seasonal", mood: "warm", tags: ["gold", "harvest", "thanksgiving"], animation: "golden-particles", weight: 500, description: "Golden harvest with warm particles. Grateful and abundant." },
  { id: "seasonal-spring", name: "Spring Meadow", bg: "#15803d", gradient: "linear-gradient(135deg,#15803d,#4ade80)", color: "#ffffff", fontEn: "Inter", fontTa: "Catamaran", category: "Seasonal", mood: "light", tags: ["green", "spring", "bright"], weight: 700, shadow: "light", description: "Bright spring green. Fresh, alive, and joyful." },
  { id: "seasonal-new-year", name: "New Dawn", bg: "#020617", gradient: "linear-gradient(135deg,#020617,#1e3a8a)", color: "#fef3c7", fontEn: "Inter", fontTa: "Catamaran", category: "Seasonal", mood: "dramatic", tags: ["sparkle", "new-year", "stars"], animation: "sparkles", weight: 600, description: "New Year sparkle over deep blue. Fresh start ahead." },
];

const EVENTS_THEMES: BuildOpts[] = [
  { id: "events-rose-garden", name: "Rose Garden", bg: "#9d174d", gradient: "linear-gradient(135deg,#831843,#db2777,#f9a8d4)", color: "#fff1f2", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Events", mood: "gentle", tags: ["rose", "wedding", "romantic"], letterSpacing: 2, weight: 400, description: "Blush rose gradient. Elegant wedding atmosphere." },
  { id: "events-conference", name: "Conference Navy", bg: "#0c1c33", gradient: "linear-gradient(135deg,#0c1c33,#1e3a8a)", fontEn: "Catamaran", fontTa: "Catamaran", category: "Events", mood: "modern", tags: ["navy", "professional", "logo"], weight: 600, letterSpacing: 1.5, logo: { enabled: true, settings: { position: "top-right", widthPct: 8 } }, description: "Professional navy gradient with logo placement. Conference ready." },
  { id: "events-broadcast", name: "Broadcast Black", bg: "#000000", gradient: "radial-gradient(ellipse at 50% 50%,#1f2937,#000000 70%)", fontEn: "Catamaran", fontTa: "Catamaran", category: "Events", mood: "dark", tags: ["black", "broadcast", "stage"], weight: 500, shadow: "deep", logo: { enabled: true, settings: { position: "bottom-right", widthPct: 7 } }, description: "Broadcast-grade black with logo. Stage-ready presentation." },
  { id: "events-youth-pulse", name: "Youth Pulse", bg: "#3b0764", gradient: "linear-gradient(135deg,#3b0764,#7e22ce,#ec4899)", fontEn: "Catamaran", fontTa: "Catamaran", category: "Events", mood: "dramatic", tags: ["violet", "youth", "bold"], weight: 700, shadow: "light", description: "Electric violet-to-pink gradient. Energetic youth night." },
];

const MODERN_THEMES: BuildOpts[] = [
  { id: "modern-glass", name: "Glass Worship", bg: "#0f172a", gradient: "radial-gradient(circle at 70% 30%,#1e293b,#0f172a 80%)", fontEn: "Inter", fontTa: "Catamaran", category: "Modern", mood: "cool", tags: ["glass", "modern", "clean"], weight: 300, shadow: "none", letterSpacing: 3, bgOpacity: 0.85, description: "Subtle glassmorphism-inspired dark. Thin, elegant, modern." },
  { id: "modern-neon", name: "Neon Scripture", bg: "#020617", gradient: "linear-gradient(135deg,#020617,#0f172a,#020617)", color: "#2dd4bf", fontEn: "Inter", fontTa: "Catamaran", category: "Modern", mood: "dramatic", tags: ["neon", "teal", "cyber"], weight: 300, shadow: "none", letterSpacing: 4, lineHeight: 1.5, description: "Dark cyber backdrop with teal accent text. Edgy and bold." },
  { id: "modern-clean-stage", name: "Clean Stage", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 60%,#1a1a2e,#0a0a0a 80%)", fontEn: "Inter", fontTa: "Mukta Malar", category: "Modern", mood: "dark", tags: ["stage", "clean", "minimal"], weight: 400, shadow: "light", description: "Stage-lit minimal dark. Clean, focused, undistracted." },
  { id: "modern-ocean", name: "Ocean Worship", bg: "#082f49", gradient: "linear-gradient(180deg,#082f49,#0c4a6e)", color: "#e0f7fa", fontEn: "Inter", fontTa: "Mukta Malar", category: "Modern", mood: "cool", tags: ["ocean", "teal", "deep"], animation: "ocean", lineHeight: 1.4, description: "Deep ocean blues with slow wave motion. Vast and peaceful." },
  { id: "modern-galaxy", name: "Galaxy Night", bg: "#0a0e2c", gradient: "radial-gradient(ellipse at 50% 50%,#1e1b4b,#0a0e2c 80%)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Catamaran", category: "Modern", mood: "dramatic", tags: ["galaxy", "space", "purple"], animation: "abstract-worship", weight: 300, letterSpacing: 2, description: "Deep space purple with abstract motion. Cosmic worship." },
  { id: "modern-premium-dark", name: "Premium Dark", bg: "#09090b", gradient: "linear-gradient(135deg,#09090b,#18181b)", color: "#fafafa", fontEn: "Inter", fontTa: "Mukta Malar", category: "Modern", mood: "dark", tags: ["dark", "premium", "luxury"], weight: 300, shadow: "light", letterSpacing: 1.5, padding: 8, description: "Award-stage black with light sans. Premium and refined." },
  { id: "modern-elegant-gold", name: "Elegant Gold", bg: "#1c1006", gradient: "linear-gradient(135deg,#1c1006,#3b2412,#a16207)", color: "#fde68a", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Modern", mood: "warm", tags: ["gold", "elegant", "luxury"], weight: 400, letterSpacing: 2, shadow: "deep", description: "Dark bronze with gold serif text. Opulent and elegant." },
];

const ANIMATED_THEMES: BuildOpts[] = [
  { id: "animated-aurora", name: "Aurora", bg: "#0a0e2c", gradient: "linear-gradient(180deg,#0a0e2c,#1e1b4b,#312e81)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["aurora", "northern-lights", "motion"], animation: "aurora", weight: 300, letterSpacing: 3, description: "Soft northern lights dance across the stage. Ethereal and beautiful." },
  { id: "animated-clouds", name: "Cloud Worship", bg: "#0c4a6e", gradient: "linear-gradient(180deg,#0c4a6e,#0369a1)", fontEn: "Mukta Malar", fontTa: "Mukta Malar", category: "Animated", mood: "cool", tags: ["clouds", "sky", "drift"], animation: "clouds", weight: 500, description: "Slowly drifting clouds. Peaceful, open, and soaring." },
  { id: "animated-light-rays", name: "Light Rays", bg: "#78350f", gradient: "radial-gradient(circle at 50% 50%,#d97706,#78350f 70%)", color: "#fffbeb", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "dramatic", tags: ["light", "rays", "glory"], animation: "light-rays", weight: 600, shadow: "deep", description: "Rotating rays of golden glory. Majesty and transcendence." },
  { id: "animated-golden-particles", name: "Golden Dust", bg: "#1c1006", gradient: "radial-gradient(circle at 50% 50%,#3b2412,#1c1006 80%)", color: "#fde68a", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["gold", "particles", "warm"], animation: "golden-particles", shadow: "deep", description: "Rising golden particles. Worship as incense before the throne." },
  { id: "animated-ocean-waves", name: "Ocean Waves", bg: "#082f49", gradient: "linear-gradient(180deg,#082f49,#0c4a6e)", color: "#e0f2fe", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "cool", tags: ["ocean", "waves", "calm"], animation: "water", lineHeight: 1.4, description: "Gentle water surface. Calm, deep, and restorative." },
  { id: "animated-fire-glow", name: "Fire Glow", bg: "#450a0a", gradient: "radial-gradient(circle at 50% 100%,#dc2626,#450a0a 70%)", color: "#fff7ed", fontEn: "Catamaran", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["fire", "spirit", "passion"], animation: "fire-glow", weight: 700, description: "Living fire at the base. Holy Spirit passion and power." },
  { id: "animated-floating-cross", name: "Floating Cross", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 50%,#1f2937,#0a0a0a 80%)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Latha", category: "Animated", mood: "dark", tags: ["cross", "glory", "sacrifice"], animation: "floating-cross", shadow: "deep", description: "Drifting cross silhouettes against a dark sky. The focal point of faith." },
  { id: "animated-stage-lights", name: "Stage Lights", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 50%,#1e1b4b,#0a0a0a 80%)", fontEn: "Catamaran", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["stage", "lights", "concert"], animation: "stage-lights", weight: 600, description: "Sweeping concert stage spotlights. High-energy worship night." },
];

const MINIMAL_THEMES: BuildOpts[] = [
  { id: "minimal-black", name: "Minimal Black", bg: "#000000", fontEn: "Inter", fontTa: "Mukta Malar", category: "Minimal", mood: "dark", tags: ["black", "thin", "clean"], weight: 300, shadow: "none", letterSpacing: 2, description: "Pure black with thin sans. Nothing but the Word." },
  { id: "minimal-white", name: "Minimal White", bg: "#fafaf9", color: "#1c1917", fontEn: "Inter", fontTa: "Noto Sans Tamil", category: "Minimal", mood: "light", tags: ["white", "clean", "paper"], shadow: "none", padding: 10, description: "Pure white with dark sans. Clean, airy, and modern." },
  { id: "minimal-charcoal", name: "Minimal Charcoal", bg: "#1c1917", color: "#f5f5f4", fontEn: "Inter", fontTa: "Mukta Malar", category: "Minimal", mood: "dark", tags: ["charcoal", "editorial", "clean"], shadow: "none", letterSpacing: 1.5, weight: 400, description: "Editorial charcoal. Refined, calm, sophisticated." },
  { id: "minimal-slate", name: "Slate", bg: "#1e293b", color: "#f1f5f9", fontEn: "Inter", fontTa: "Mukta Malar", category: "Minimal", mood: "cool", tags: ["slate", "cool", "clean"], shadow: "none", weight: 400, description: "Cool slate blue. Professional and understated." },
  { id: "minimal-paper", name: "Paper", bg: "#fdf6e3", color: "#1f2937", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Minimal", mood: "light", tags: ["warm", "paper", "ink"], shadow: "none", lineHeight: 1.45, padding: 8, vAlign: "top", description: "Warm paper with dark ink serif. Like a fine-printed page." },
  { id: "minimal-frost", name: "Frost", bg: "#e0f2fe", color: "#0c4a6e", fontEn: "Inter", fontTa: "Mukta Malar", category: "Minimal", mood: "cool", tags: ["ice", "frost", "cold"], shadow: "none", weight: 400, padding: 8, description: "Icy blue-white. Cool, crisp, and refreshing." },
];

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  ...WORSHIP_THEMES.map(build),
  ...BIBLE_THEMES.map(build),
  ...PRAYER_THEMES.map(build),
  ...SEASONAL_THEMES.map(build),
  ...EVENTS_THEMES.map(build),
  ...MODERN_THEMES.map(build),
  ...ANIMATED_THEMES.map(build),
  ...MINIMAL_THEMES.map(build),
];
