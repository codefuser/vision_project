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
  { id: "anim-moving-grid", name: "Moving Grid", bg: "#0a0e1a", gradient: "linear-gradient(135deg,#0a0e1a,#141a2e,#1a1f3a)", color: "#94a3b8", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["grid", "tech", "modern", "sleek"], animation: "moving-grid", weight: 300, letterSpacing: 3, shadow: "light", description: "A precision grid drifts horizontally through deep space. Clean, modern, architectural." },
  { id: "anim-warp-grid", name: "Warp Grid", bg: "#0a0015", gradient: "linear-gradient(180deg,#0a0015,#1a0030,#2d0060)", color: "#c4b5fd", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["grid", "warp", "perspective", "depth"], animation: "warp-grid", weight: 300, letterSpacing: 2, description: "A perspective grid warps and pulses, pulling the eye into infinite depth. Cinematic and immersive." },
  { id: "anim-neon-grid", name: "Neon Grid", bg: "#050510", gradient: "radial-gradient(ellipse at 50% 50%,#0a0a2e,#050510 80%)", color: "#67e8f9", fontEn: "Catamaran", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["neon", "grid", "cyber", "glow"], animation: "neon-grid", weight: 500, shadow: "light", description: "Brilliant neon cyan lines trace a glowing grid against a dark cyber backdrop. Futuristic worship." },
  { id: "anim-perspective-tunnel", name: "Perspective Tunnel", bg: "#020208", gradient: "radial-gradient(ellipse at 50% 50%,#0f172a,#020208 80%)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["tunnel", "perspective", "depth", "travel"], animation: "perspective-tunnel", weight: 300, letterSpacing: 4, description: "Concentric rectangles pulse inward creating a tunnel through space. Mesmerising depth." },
  { id: "anim-light-tunnel", name: "Light Tunnel", bg: "#0f0a00", gradient: "radial-gradient(ellipse at 50% 50%,#78350f,#0f0a00 80%)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["tunnel", "light", "golden", "warm"], animation: "light-tunnel", shadow: "deep", description: "A radiant golden tunnel rotates slowly, drawing the spirit upward. Warm and transcendent." },
  { id: "anim-infinite-space", name: "Infinite Space", bg: "#000510", gradient: "radial-gradient(ellipse at 50% 50%,#0a1628,#000510 80%)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["space", "stars", "deep", "cosmic"], animation: "infinite-space", weight: 300, letterSpacing: 2, description: "Countless stars drift at multiple depths creating a parallax cosmos. The heavens declare." },
  { id: "anim-galaxy-motion", name: "Galaxy Motion", bg: "#020014", gradient: "radial-gradient(ellipse at 40% 50%,#1a0a3e,#020014 80%)", color: "#f0e6ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["galaxy", "spiral", "cosmic", "purple"], animation: "galaxy-motion", weight: 300, letterSpacing: 3, description: "A massive spiral galaxy rotates with subtle gas clouds. Awe and wonder at creation." },
  { id: "anim-deep-ocean", name: "Deep Ocean", bg: "#020d1a", gradient: "linear-gradient(180deg,#020d1a,#042f4a,#0a5c7a)", color: "#e0f2fe", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "cool", tags: ["ocean", "deep", "waves", "mystery"], animation: "deep-ocean", weight: 300, lineHeight: 1.4, description: "Light filters through deep ocean layers as currents move silently below. Deep and mysterious." },
  { id: "anim-aurora-sky", name: "Aurora Sky", bg: "#02061a", gradient: "linear-gradient(180deg,#02061a,#0a1a3e,#1a2e4a)", color: "#ccfbf1", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["aurora", "sky", "northern", "ethereal"], animation: "aurora-sky", weight: 300, letterSpacing: 2, description: "Emerald and teal aurora curtains ripple across a polar sky. Ethereal and majestic." },
  { id: "anim-bokeh-lights", name: "Bokeh Lights", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 50%,#1a1a2e,#0a0a0a 80%)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "dark", tags: ["bokeh", "lights", "cinematic", "blur"], animation: "bokeh-lights", weight: 300, description: "Soft, blurred circles of light drift at different depths. Cinematic and dreamy." },
  { id: "anim-floating-glass", name: "Floating Glass Shapes", bg: "#0a0e1a", gradient: "radial-gradient(ellipse at 50% 50%,#1a2240,#0a0e1a 80%)", color: "#e2e8f0", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "modern", tags: ["glass", "shapes", "modern", "reflective"], animation: "floating-glass", weight: 300, letterSpacing: 1, description: "Translucent geometric shapes float and rotate, catching light like frosted glass. Contemporary elegance." },
  { id: "anim-soft-ink", name: "Soft Ink", bg: "#0a0806", gradient: "radial-gradient(ellipse at 50% 50%,#1a1410,#0a0806 80%)", color: "#f5f5f4", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "dark", tags: ["ink", "organic", "flow", "artistic"], animation: "soft-ink", weight: 400, description: "Dark ink blooms and disperses in slow motion like pigment in water. Artistic and meditative." },
  { id: "anim-paper-texture", name: "Paper Texture Motion", bg: "#f5f0e8", color: "#292524", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "light", tags: ["paper", "texture", "organic", "warm"], animation: "paper-texture", shadow: "none", weight: 400, description: "A subtle paper grain shifts and breathes like living parchment. Warm and organic." },
  { id: "anim-light-rays-cinematic", name: "Light Rays", bg: "#1a0a00", gradient: "radial-gradient(circle at 50% 50%,#d97706,#1a0a00 80%)", color: "#fffbeb", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "dramatic", tags: ["light", "rays", "glory", "golden"], animation: "light-rays-cinematic", weight: 600, shadow: "deep", description: "Majestic golden light rays rotate and sweep across a dark backdrop. Glory and transcendence." },
  { id: "anim-spotlights", name: "Spotlights", bg: "#050505", gradient: "radial-gradient(ellipse at 50% 0%,#1a1a3e,#050505 80%)", color: "#e0e7ff", fontEn: "Catamaran", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["spotlight", "stage", "beam", "dramatic"], animation: "spotlights", weight: 600, description: "Dual spotlights sweep across a dark stage, creating an atmosphere of expectation." },
  { id: "anim-blue-nebula", name: "Blue Nebula", bg: "#000a1a", gradient: "radial-gradient(ellipse at 30% 60%,#0a2e5e,#000a1a 80%)", color: "#bfdbfe", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["nebula", "blue", "cosmic", "gas"], animation: "blue-nebula", weight: 300, letterSpacing: 3, description: "A luminous blue nebula swirls with deep indigo gases. Vast and humbling." },
  { id: "anim-golden-worship", name: "Golden Worship", bg: "#1a0e00", gradient: "radial-gradient(circle at 50% 50%,#f59e0b,#78350f 70%)", color: "#fffbeb", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["gold", "worship", "glory", "warm"], animation: "golden-worship", weight: 500, shadow: "deep", description: "Warm golden light radiates from the centre like the glory of the Lord. Reverent worship." },
  { id: "anim-abstract-lines", name: "Abstract Lines", bg: "#080a12", gradient: "linear-gradient(135deg,#080a12,#141a2e,#1a1f3a)", color: "#67e8f9", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "modern", tags: ["lines", "abstract", "modern", "minimal"], animation: "abstract-lines", weight: 300, letterSpacing: 2, description: "Thin horizontal lines flow and pulse rhythmically. Minimalist motion for modern worship." },
  { id: "anim-wave-mesh", name: "Wave Mesh", bg: "#020d1a", gradient: "linear-gradient(180deg,#020d1a,#0a2e4a,#106080)", color: "#e0f2fe", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "cool", tags: ["wave", "mesh", "grid", "deformation"], animation: "wave-mesh", weight: 300, letterSpacing: 1, description: "A subtle mesh grid undulates like waves across the ocean surface. Organic and hypnotic." },
  { id: "anim-fluid-motion", name: "Fluid Motion", bg: "#060612", gradient: "linear-gradient(135deg,#060612,#1a0a3e,#2e1065)", color: "#f0e6ff", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "dramatic", tags: ["fluid", "gradient", "flow", "purple"], animation: "fluid-motion", weight: 300, letterSpacing: 2, description: "Liquid gradients flow and blend like oil on water. Rich, deep, and hypnotic." },
  { id: "anim-water-reflection", name: "Water Reflection", bg: "#061a2e", gradient: "linear-gradient(180deg,#061a2e,#0a3a5e,#1a5a7e)", color: "#f0f9ff", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "cool", tags: ["water", "reflection", "ripple", "shimmer"], animation: "water-reflection", weight: 300, lineHeight: 1.4, description: "A reflective water surface ripples with shimmering light. Calm and contemplative." },
  { id: "anim-digital-horizon", name: "Digital Horizon", bg: "#02060a", gradient: "linear-gradient(180deg,#02060a,#0a1a2e,#1a3a5e)", color: "#7dd3fc", fontEn: "Inter", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["horizon", "digital", "grid", "dawn"], animation: "digital-horizon", weight: 300, letterSpacing: 2, description: "A clean digital horizon line with subtle grid extending into the distance. Modern and expansive." },
  { id: "anim-blue-fog", name: "Blue Fog", bg: "#020d1a", gradient: "linear-gradient(180deg,#020d1a,#0a1a3e,#1a2e4a)", color: "#e0e7ff", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "cool", tags: ["fog", "atmospheric", "mist", "blue"], animation: "blue-fog", weight: 400, description: "Layered blue fog drifts slowly at different depths. Atmospheric and contemplative." },
  { id: "anim-golden-dust-cinematic", name: "Golden Dust Cinematic", bg: "#1a0e06", gradient: "radial-gradient(ellipse at 50% 50%,#3a2010,#1a0e06 80%)", color: "#fde68a", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["gold", "dust", "cinematic", "premium"], animation: "golden-dust-cinematic", shadow: "deep", description: "Premium golden dust motes suspended in warm light. Cinematic worship atmosphere." },
  { id: "anim-cross-light", name: "Cross Light", bg: "#050508", gradient: "radial-gradient(ellipse at 50% 50%,#1a1a2e,#050508 80%)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "dramatic", tags: ["cross", "light", "reveal", "sacred"], animation: "cross-light", shadow: "deep", description: "A beam of light reveals a sacred cross shape in the darkness. Powerful and reverent." },
  { id: "anim-morning-sky", name: "Morning Sky", bg: "#0a0a1a", gradient: "linear-gradient(180deg,#0a0a1a,#2a1a3e,#6a3a5e)", color: "#fce7f3", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "gentle", tags: ["morning", "sky", "dawn", "peaceful"], animation: "morning-sky", weight: 400, description: "A dawn sky transitions with soft clouds catching the first light. Peaceful and hopeful." },
  { id: "anim-evening-glow", name: "Evening Glow", bg: "#1a0e08", gradient: "linear-gradient(180deg,#1a0e08,#3a1a1a,#6a2a1a)", color: "#fed7aa", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Animated", mood: "warm", tags: ["evening", "sunset", "warm", "glow"], animation: "evening-glow", weight: 400, shadow: "deep", description: "A warm sunset glow fades through amber and rose. Evening worship atmosphere." },
  { id: "anim-dark-theatre", name: "Dark Theatre", bg: "#030303", gradient: "radial-gradient(ellipse at 50% 30%,#1a1a2e,#030303 80%)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "dark", tags: ["theatre", "dark", "stage", "dramatic"], animation: "dark-theatre", weight: 300, letterSpacing: 2, description: "A dark theatre with a single subtle light source. Focused and undistracted." },
  { id: "anim-stage-ambient", name: "Stage Ambient", bg: "#0a0a12", gradient: "radial-gradient(ellipse at 50% 0%,#2a2a4e,#0a0a12 80%)", color: "#c7d2fe", fontEn: "Catamaran", fontTa: "Catamaran", category: "Animated", mood: "cool", tags: ["stage", "ambient", "light", "atmosphere"], animation: "stage-ambient", weight: 400, description: "Ambient stage lighting shifts subtly across the backdrop. Live worship atmosphere." },
  { id: "anim-minimal-motion", name: "Minimal Motion", bg: "#0a0a0a", color: "#f5f5f5", fontEn: "Inter", fontTa: "Mukta Malar", category: "Animated", mood: "dark", tags: ["minimal", "clean", "subtle", "pure"], animation: "minimal-motion", weight: 300, shadow: "none", letterSpacing: 3, description: "The purest minimal motion background. Nothing but the Word in quiet movement." },
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
  { id: "prayer-candlelight", name: "Candlelight", bg: "#1a0f08", gradient: "radial-gradient(circle at 50% 70%,#3a1e0a,#0a0604 80%)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Prayer", mood: "warm", tags: ["amber", "candle", "warm", "prayer"], animation: "golden-worship", shadow: "deep", description: "Flickering candle warmth. Quiet, reverent, intimate." },
  { id: "prayer-incense", name: "Incense", bg: "#1c0f1a", gradient: "linear-gradient(180deg,#1c0f1a,#3b1f3a)", color: "#fbcfe8", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Prayer", mood: "gentle", tags: ["purple", "mystery", "drift", "prayer"], animation: "blue-fog", lineHeight: 1.35, description: "Soft drifting mist in violet. Prayer like incense rising." },
];

const SEASONAL_THEMES: BuildOpts[] = [
  { id: "seasonal-evergreen", name: "Evergreen", bg: "#064e3b", color: "#fbbf24", fontEn: "Georgia", fontTa: "Noto Serif Tamil", category: "Seasonal", mood: "warm", tags: ["green", "gold", "christmas", "festive"], shadow: "soft", letterSpacing: 1.5, description: "Festive evergreen with gold serif. Christmas joy." },
  { id: "seasonal-new-dawn", name: "New Dawn", bg: "#020617", gradient: "linear-gradient(135deg,#020617,#1e3a8a)", color: "#fef3c7", fontEn: "Inter", fontTa: "Catamaran", category: "Seasonal", mood: "dramatic", tags: ["sparkle", "new-year", "stars", "fresh"], animation: "golden-dust-cinematic", weight: 600, description: "New Year sparkle over deep blue. Fresh start ahead." },
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
