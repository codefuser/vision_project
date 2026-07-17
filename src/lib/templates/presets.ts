import type { BackgroundConfig, SectionStyle } from "@/lib/broadcast";
import type { LogoSettings } from "@/stores/logo.store";

export type TemplateCategory =
  | "Worship" | "Bible" | "Prayer" | "Seasonal" | "Events"
  | "Modern" | "Minimal" | "Specialty";

export type ThemeMood =
  | "classic" | "modern" | "warm" | "cool" | "dark" | "light"
  | "dramatic" | "gentle" | "luxury" | "earthy" | "vibrant" | "serene";

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
  "Modern", "Minimal", "Specialty",
];

const shadowSoft = { shadow: true, shadowColor: "#000000", shadowBlur: 22 };
const shadowDeep = { shadow: true, shadowColor: "#000000", shadowBlur: 40 };
const shadowLight = { shadow: true, shadowColor: "#000000", shadowBlur: 12 };

const T = (text: Partial<SectionStyle>): Partial<SectionStyle> => ({
  align: "center",
  vAlign: "middle",
  lineHeight: 1.35,
  ...shadowSoft,
  ...text,
});

interface BuildOpts {
  id: string;
  name: string;
  category: TemplateCategory;
  description?: string;
  bg: string;
  gradient?: string;
  color?: string;
  refColor?: string;
  fontEn?: string;
  fontTa?: string;
  weight?: number;
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
  const fontTa = o.fontTa ?? "Noto Sans Tamil";
  const color = o.color ?? "#ffffff";
  const sh =
    o.shadow === "none"
      ? { shadow: false, shadowBlur: 0 }
      : o.shadow === "deep"
        ? shadowDeep
        : o.shadow === "light"
          ? shadowLight
          : shadowSoft;
  return {
    id: o.id,
    name: o.name,
    category: o.category,
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
      reference: {
        ...(o.refColor ? { color: o.refColor } : {}),
        ...(o.shadow !== "none" ? { shadow: true, shadowBlur: 20, shadowColor: "#000000" } : {}),
      },
      tamil: { fontFamily: fontTa, fontSizeVw: o.tamilSize ?? 5 },
      english: { fontFamily: fontEn },
    },
    background: {
      kind: "color",
      color: o.bg,
      gradient: o.gradient ?? null,
      ...(o.bgOpacity != null ? { opacity: o.bgOpacity } : {}),
      ...(o.bgColor ? { overlayColor: o.bgColor } : {}),
    },
    logo: o.logo,
  };
};

/* ── SVG pattern helpers ── */
const svg = (content: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${content}</svg>`)}")`;

const circles = (cx: number, cy: number, r: number, fill: string) =>
  `<circle cx="${cx}%" cy="${cy}%" r="${r}" fill="${fill}"/>`;

const polygon = (points: string, fill: string, opacity = "0.08") =>
  `<polygon points="${points}" fill="${fill}" opacity="${opacity}"/>`;

/* ──────── 1. Cathedral Glass ──────── */
/* Stained-glass coloured blobs on dark base */
const CATHEDRAL_GLASS =
  `radial-gradient(circle 350px at 20% 30%,rgba(147,51,234,.15),transparent),` +
  `radial-gradient(circle 300px at 75% 25%,rgba(59,130,246,.12),transparent),` +
  `radial-gradient(circle 280px at 85% 70%,rgba(236,72,153,.1),transparent),` +
  `radial-gradient(circle 250px at 15% 80%,rgba(251,191,36,.08),transparent),` +
  `linear-gradient(135deg,#0a0a2e,#1a0a3e,#2a0a4e)`;

/* ──────── 2. Morning Light ──────── */
/* Diagonal light beams striking from upper-left */
const MORNING_LIGHT =
  `linear-gradient(135deg,rgba(253,224,71,.08) 0%,rgba(253,224,71,.02) 25%,transparent 40%),` +
  `linear-gradient(150deg,transparent 30%,rgba(253,224,71,.04) 42%,transparent 55%),` +
  `linear-gradient(120deg,transparent 50%,rgba(251,146,60,.03) 60%,transparent 70%),` +
  `linear-gradient(180deg,#0a0a1a,#1a0a2e)`;

/* ──────── 3. Royal Crown ──────── */
/* Central radiance with gold accent, deep purple base */
const ROYAL_CROWN =
  `radial-gradient(ellipse 400px 500px at 50% 30%,rgba(251,191,36,.12),transparent),` +
  `radial-gradient(ellipse 300px 300px at 50% 60%,rgba(147,51,234,.1),transparent),` +
  `linear-gradient(180deg,#0a0014,#1a0a2e)`;

/* ──────── 4. Rose Window ──────── */
/* Circular stained-glass rose window pattern using conic gradient */
const ROSE_WINDOW =
  `conic-gradient(from 0deg at 50% 35%,` +
  `rgba(147,51,234,.08),rgba(59,130,246,.06),rgba(236,72,153,.08),` +
  `rgba(251,191,36,.06),rgba(16,185,129,.06),rgba(147,51,234,.08)),` +
  `radial-gradient(circle 200px at 50% 35%,rgba(255,255,255,.03),transparent),` +
  `linear-gradient(180deg,#0a0a2e,#050518)`;

/* ──────── 5. Gothic Arches ──────── */
/* Pointed arch shapes using SVG overlay on dark gradient */
const GOTHIC_ARCHES = svg(
  `<rect width="100%" height="100%" fill="none"/>` +
  `<path d="M5,100 L5,40 Q5,5 15,5 L20,5 Q30,5 30,40 L30,100" fill="rgba(148,163,184,.04)"/>` +
  `<path d="M38,100 L38,30 Q38,0 50,0 L55,0 Q65,0 65,30 L65,100" fill="rgba(148,163,184,.05)"/>` +
  `<path d="M72,100 L72,40 Q72,5 82,5 L87,5 Q97,5 97,40 L97,100" fill="rgba(148,163,184,.04)"/>`
) + `,linear-gradient(180deg,#0a0a0a,#1a0a1a)`;

/* ──────── 6. Stone Pillars ──────── */
/* Vertical pillar-like bands */
const STONE_PILLARS =
  `repeating-linear-gradient(90deg,transparent 0,transparent 7%,rgba(148,163,184,.03) 7.5%,rgba(148,163,184,.03) 8%,transparent 8.5%),` +
  `repeating-linear-gradient(90deg,transparent 0,transparent 12%,rgba(148,163,184,.02) 12.5%,rgba(148,163,184,.02) 13%,transparent 13.5%),` +
  `linear-gradient(180deg,#1a1a1a,#0a0a0a)`;

/* ──────── 7. Royal Gold ──────── */
/* Gold mesh gradient with shimmer */
const ROYAL_GOLD =
  `radial-gradient(circle 250px at 30% 30%,rgba(253,224,71,.1),transparent),` +
  `radial-gradient(circle 200px at 70% 60%,rgba(251,191,36,.08),transparent),` +
  `conic-gradient(from 30deg at 50% 50%,rgba(251,191,36,.02),rgba(217,119,6,.01),rgba(251,191,36,.02),transparent),` +
  `linear-gradient(135deg,#1a0e06,#0a0604)`;

/* ──────── 8. Royal Sapphire ──────── */
/* Deep blue with diamond-pattern highlights */
const ROYAL_SAPPHIRE =
  `radial-gradient(circle 300px at 20% 20%,rgba(59,130,246,.12),transparent),` +
  `radial-gradient(circle 250px at 80% 80%,rgba(30,58,138,.1),transparent),` +
  `conic-gradient(from 45deg at 50% 50%,transparent,rgba(59,130,246,.02),transparent,rgba(59,130,246,.02),transparent),` +
  `linear-gradient(135deg,#0a0a2e,#050518)`;

/* ──────── 9. Royal Crimson ──────── */
/* Deep red with corner glow */
const ROYAL_CRIMSON =
  `radial-gradient(circle 400px at 80% 20%,rgba(220,38,38,.1),transparent),` +
  `radial-gradient(circle 200px at 20% 80%,rgba(251,191,36,.06),transparent),` +
  `linear-gradient(135deg,#1a0505,#0a0202)`;

/* ──────── 10. Royal Emerald ──────── */
/* Deep green with wave-like gradient bands */
const ROYAL_EMERALD =
  `repeating-linear-gradient(160deg,transparent 0,transparent 30px,rgba(16,185,129,.03) 30px,rgba(16,185,129,.03) 32px,transparent 32px),` +
  `radial-gradient(circle 300px at 50% 30%,rgba(52,211,153,.08),transparent),` +
  `linear-gradient(135deg,#001a0a,#000a04)`;

/* ──────── 11. Cathedral Vault ──────── */
/* Dark with arched ceiling light */
const CATHEDRAL_VAULT =
  `radial-gradient(ellipse 600px 300px at 50% 0%,rgba(148,163,184,.06),transparent),` +
  `repeating-linear-gradient(90deg,transparent 0,transparent 40px,rgba(148,163,184,.02) 40px,rgba(148,163,184,.02) 41px,transparent 41px),` +
  `linear-gradient(180deg,#0a0a0a,#050505)`;

/* ──────── 12. Modern Stage ──────── */
/* Spotlight from above, warm amber */
const MODERN_STAGE =
  `radial-gradient(ellipse 500px 300px at 50% 0%,rgba(251,191,36,.08),transparent),` +
  `linear-gradient(180deg,rgba(251,191,36,.02),transparent 40%),` +
  `linear-gradient(180deg,#0a0a12,#030308)`;

/* ──────── 13. Contemporary Blue ──────── */
/* Modern diagonal split with geometric accent */
const CONTEMPORARY_BLUE =
  `linear-gradient(160deg,rgba(59,130,246,.08) 0%,rgba(59,130,246,.08) 35%,transparent 35.5%),` +
  `radial-gradient(circle 200px at 75% 70%,rgba(99,102,241,.06),transparent),` +
  `linear-gradient(180deg,#0a0a1a,#050510)`;

/* ──────── 14. Worship Night ──────── */
/* Deep dark with warm light streaks from bottom */
const WORSHIP_NIGHT =
  `linear-gradient(0deg,rgba(251,191,36,.06) 0%,transparent 30%),` +
  `radial-gradient(ellipse 400px 200px at 50% 100%,rgba(239,68,68,.04),transparent),` +
  `linear-gradient(180deg,#050005,#0a0005)`;

/* ──────── 15. Praise Rising ──────── */
/* Warm upward-moving gradient suggests rising */
const PRAISE_RISING =
  `linear-gradient(0deg,rgba(251,191,36,.1) 0%,rgba(234,88,12,.04) 40%,transparent 70%),` +
  `radial-gradient(circle 200px at 30% 80%,rgba(251,146,60,.06),transparent),` +
  `linear-gradient(180deg,#0a0500,#1a0a00)`;

/* ──────── 16. Glass Worship ──────── */
/* Frosted glass multi-layer with reflections */
const GLASS_WORSHIP =
  `linear-gradient(135deg,rgba(148,163,184,.06) 0%,rgba(99,102,241,.04) 40%,rgba(167,139,250,.03) 60%,rgba(148,163,184,.02) 100%),` +
  `linear-gradient(170deg,transparent 40%,rgba(255,255,255,.02) 42%,transparent 44%),` +
  `linear-gradient(180deg,#0a0a1a,#0a0a14)`;

/* ──────── 17. Hexagon Dark ──────── */
/* Subtle hexagon pattern overlay */
const HEXAGON_DARK = svg(
  `<defs><pattern id="h" width="40" height="69.28" patternUnits="userSpaceOnUse">` +
  `<polygon points="20 0,40 11.55,40 34.64,20 46.19,0 34.64,0 11.55" fill="rgba(148,163,184,.04)"/>` +
  `<polygon points="20 23.1,40 34.64,40 57.73,20 69.28,0 57.73,0 34.64" fill="rgba(148,163,184,.03)"/>` +
  `</pattern></defs><rect width="100%" height="100%" fill="url(#h)"/>`
) + `,linear-gradient(135deg,#050508,#0a0a14)`;

/* ──────── 18. Geometric Blue ──────── */
/* Triangle mesh pattern */
const GEOMETRIC_BLUE = svg(
  `<defs><pattern id="t" width="60" height="52" patternUnits="userSpaceOnUse">` +
  `<polygon points="30 0,60 15,60 37,30 52,0 37,0 15" fill="rgba(59,130,246,.04)"/>` +
  `<polygon points="30 26,60 41,60 63,30 78,0 63,0 41" fill="rgba(99,102,241,.03)"/>` +
  `</pattern></defs><rect width="100%" height="100%" fill="url(#t)"/>`
) + `,linear-gradient(135deg,#0a0a2e,#050518)`;

/* ──────── 19. Diamond Silver ──────── */
/* Diamond pattern on silver-dark */
const DIAMOND_SILVER = svg(
  `<defs><pattern id="d" width="50" height="50" patternUnits="userSpaceOnUse">` +
  `<polygon points="25 0,50 25,25 50,0 25" fill="rgba(148,163,184,.03)"/>` +
  `</pattern></defs><rect width="100%" height="100%" fill="url(#d)"/>`
) + `,linear-gradient(135deg,#0a0a14,#141420)`;

/* ──────── 20. Polygon Mesh ──────── */
/* Connected polygon network */
const POLYGON_MESH = svg(
  `<line x1="20" y1="20" x2="60" y2="10" stroke="rgba(99,102,241,.04)" stroke-width="1"/>` +
  `<line x1="60" y1="10" x2="80" y2="40" stroke="rgba(99,102,241,.04)" stroke-width="1"/>` +
  `<line x1="80" y1="40" x2="50" y2="70" stroke="rgba(99,102,241,.03)" stroke-width="1"/>` +
  `<line x1="50" y1="70" x2="20" y2="20" stroke="rgba(99,102,241,.03)" stroke-width="1"/>` +
  `<line x1="20" y1="20" x2="80" y2="80" stroke="rgba(99,102,241,.02)" stroke-width="1"/>` +
  `<polygon points="20,20 60,10 80,40" fill="rgba(99,102,241,.03)" opacity="0.5"/>`
) + `,linear-gradient(135deg,#050510,#0a0a1a)`;

/* ──────── 21. Circular Flow ──────── */
/* Overlapping circles composition */
const CIRCULAR_FLOW =
  `radial-gradient(circle 180px at 25% 25%,rgba(99,102,241,.08),transparent),` +
  `radial-gradient(circle 220px at 75% 30%,rgba(167,139,250,.06),transparent),` +
  `radial-gradient(circle 160px at 50% 70%,rgba(59,130,246,.05),transparent),` +
  `radial-gradient(circle 200px at 85% 80%,rgba(139,92,246,.04),transparent),` +
  `linear-gradient(135deg,#0a0a2e,#050518)`;

/* ──────── 22. Grid Modern ──────── */
/* Clean modern grid */
const GRID_MODERN =
  `repeating-linear-gradient(90deg,transparent 0,transparent 50px,rgba(148,163,184,.02) 50px,rgba(148,163,184,.02) 51px,transparent 51px),` +
  `repeating-linear-gradient(0deg,transparent 0,transparent 50px,rgba(148,163,184,.02) 50px,rgba(148,163,184,.02) 51px,transparent 51px),` +
  `linear-gradient(135deg,#0a0a0a,#141414)`;

/* ──────── 23. Luxury Gold ──────── */
/* Premium gold with shimmer line */
const LUXURY_GOLD =
  `linear-gradient(135deg,transparent 35%,rgba(253,224,71,.04) 45%,transparent 55%),` +
  `radial-gradient(circle 200px at 50% 40%,rgba(251,191,36,.08),transparent),` +
  `linear-gradient(180deg,#0a0604,#050302)`;

/* ──────── 24. Elegant Dark ──────── */
/* Sophisticated dark with subtle corner ornament */
const ELEGANT_DARK = svg(
  `<path d="M0,0 L30,0 L30,5 L5,5 L5,30 L0,30 Z" fill="rgba(148,163,184,.04)"/>` +
  `<path d="M100,0 L70,0 L70,5 L95,5 L95,30 L100,30 Z" fill="rgba(148,163,184,.04)"/>`
) + `,linear-gradient(135deg,#050505,#0a0a0a)`;

/* ──────── 25. Elegant Light ──────── */
/* Clean light with subtle shadow box */
const ELEGANT_LIGHT =
  `radial-gradient(ellipse 300px 200px at 50% 30%,rgba(99,102,241,.03),transparent),` +
  `linear-gradient(180deg,#f8fafc,#f0f4f8)`;

/* ──────── 26. Premium Dark ──────── */
/* True black with subtle center radiance */
const PREMIUM_DARK =
  `radial-gradient(ellipse 400px 300px at 50% 40%,rgba(148,163,184,.03),transparent),` +
  `linear-gradient(180deg,#050505,#000000)`;

/* ──────── 27. Premium Light ──────── */
/* Clean light with soft shadow */
const PREMIUM_LIGHT =
  `radial-gradient(ellipse 300px 200px at 50% 30%,rgba(148,163,184,.03),transparent),` +
  `linear-gradient(180deg,#ffffff,#f8fafc)`;

/* ──────── 28. Ice Crystal ──────── */
/* Frosty blue crystalline pattern */
const ICE_CRYSTAL = svg(
  `<defs><pattern id="i" width="60" height="60" patternUnits="userSpaceOnUse">` +
  `<path d="M30 0 L35 15 L30 30 L25 15 Z" fill="rgba(147,197,253,.03)"/>` +
  `<path d="M0 30 L15 35 L30 30 L15 25 Z" fill="rgba(147,197,253,.03)"/>` +
  `<path d="M60 30 L45 35 L30 30 L45 25 Z" fill="rgba(147,197,253,.03)"/>` +
  `</pattern></defs><rect width="100%" height="100%" fill="url(#i)"/>`
) + `,linear-gradient(135deg,#0a1420,#0a1a2e)`;

/* ──────── 29. Wave Motion ──────── */
/* Gentle wave shapes at bottom */
const WAVE_MOTION = svg(
  `<path d="M0,90 Q25,80 50,90 T100,90 L100,100 L0,100 Z" fill="rgba(148,163,184,.03)"/>` +
  `<path d="M0,95 Q25,88 50,95 T100,95 L100,100 L0,100 Z" fill="rgba(148,163,184,.02)"/>`
) + `,linear-gradient(180deg,#0a0a1a,#050510)`;

/* ──────── 30. Mountain Silhouette ──────── */
/* Layered mountain shapes */
const MOUNTAIN_SILHOUETTE = svg(
  `<polygon points="0,80 15,45 30,60 45,35 60,50 75,30 90,55 100,40 100,100 0,100" fill="rgba(0,0,0,.15)"/>` +
  `<polygon points="0,90 20,60 40,75 55,50 70,65 85,45 100,60 100,100 0,100" fill="rgba(0,0,0,.1)"/>`
) + `,linear-gradient(180deg,#1a0a2e,#3a1a3e)`;

/* ──────── 31. Light Rays ──────── */
/* Diagonal rays from top-left */
const LIGHT_RAYS =
  `linear-gradient(140deg,rgba(253,224,71,.06) 0%,transparent 20%,rgba(253,224,71,.04) 25%,transparent 40%,rgba(253,224,71,.02) 45%,transparent 60%,rgba(253,224,71,.02) 65%,transparent 80%),` +
  `linear-gradient(180deg,#0a0a1a,#050510)`;

/* ──────── 32. Center Spotlight ──────── */
/* Strong central radiance */
const CENTER_SPOTLIGHT =
  `radial-gradient(ellipse 500px 400px at 50% 40%,rgba(255,255,255,.04),rgba(251,191,36,.02),transparent),` +
  `linear-gradient(180deg,#0a0a12,#030308)`;

/* ──────── 33. Corner Frame ──────── */
/* Decorative corner elements framing the content */
const CORNER_FRAME = svg(
  `<path d="M5,5 L25,5 L25,10 L10,10 L10,25 L5,25 Z" fill="rgba(148,163,184,.06)"/>` +
  `<path d="M95,5 L75,5 L75,10 L90,10 L90,25 L95,25 Z" fill="rgba(148,163,184,.06)"/>` +
  `<path d="M5,95 L25,95 L25,90 L10,90 L10,75 L5,75 Z" fill="rgba(148,163,184,.06)"/>` +
  `<path d="M95,95 L75,95 L75,90 L90,90 L90,75 L95,75 Z" fill="rgba(148,163,184,.06)"/>`
) + `,linear-gradient(135deg,#0a0a14,#0a0a0a)`;

/* ──────── 34. Radiant Burst ──────── */
/* Lines radiating from center */
const RADIANT_BURST =
  `conic-gradient(from 0deg at 50% 40%,rgba(253,224,71,.02) 0deg,transparent 10deg,rgba(253,224,71,.02) 20deg,transparent 30deg,rgba(253,224,71,.02) 40deg,transparent 50deg,rgba(253,224,71,.02) 60deg,transparent 70deg,rgba(253,224,71,.02) 80deg,transparent 90deg,rgba(253,224,71,.02) 100deg,transparent 110deg,rgba(253,224,71,.02) 120deg,transparent 130deg,rgba(253,224,71,.02) 140deg,transparent 150deg,rgba(253,224,71,.01) 160deg,transparent 170deg,rgba(253,224,71,.01) 180deg,transparent 190deg,rgba(253,224,71,.01) 200deg,transparent 210deg,rgba(253,224,71,.01) 220deg,transparent 230deg,rgba(253,224,71,.01) 240deg,transparent 250deg,rgba(253,224,71,.01) 260deg,transparent 270deg,rgba(253,224,71,.01) 280deg,transparent 290deg,rgba(253,224,71,.01) 300deg,transparent 310deg,rgba(253,224,71,.01) 320deg,transparent 330deg,rgba(253,224,71,.01) 340deg,transparent 350deg),` +
  `radial-gradient(ellipse 300px 200px at 50% 40%,rgba(253,224,71,.04),transparent),` +
  `linear-gradient(180deg,#0a0014,#05000a)`;

/* ──────── 36. Bible Parchment ──────── */
/* Warm parchment texture */
const BIBLE_PARCHMENT =
  `repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(0,0,0,.01) 3px,rgba(0,0,0,.01) 4px,transparent 4px),` +
  `radial-gradient(ellipse 400px 300px at 50% 40%,rgba(251,191,36,.04),transparent),` +
  `linear-gradient(135deg,#2a1a0a,#1a0e06)`;

/* ──────── 37. Scripture Light ──────── */
/* Warm golden light on dark */
const SCRIPTURE_LIGHT =
  `radial-gradient(ellipse 350px 250px at 50% 30%,rgba(253,224,71,.06),transparent),` +
  `linear-gradient(180deg,rgba(253,224,71,.02),transparent 50%),` +
  `linear-gradient(180deg,#0a0a1a,#050510)`;

/* ──────── 38. Candlelight Prayer ──────── */
/* Warm glow from bottom center */
const CANDLELIGHT_PRAYER =
  `radial-gradient(ellipse 300px 350px at 50% 85%,rgba(251,191,36,.08),rgba(251,146,60,.03),transparent),` +
  `linear-gradient(180deg,#0a0500,#050200)`;

/* ──────── 39. Silent Prayer ──────── */
/* Deep blue, calm, minimal */
const SILENT_PRAYER =
  `radial-gradient(ellipse 250px 200px at 50% 40%,rgba(99,102,241,.03),transparent),` +
  `linear-gradient(180deg,#0a0a1a,#050510)`;

/* ──────── 40. Ancient Scroll ──────── */
/* Vintage scroll tones with horizontal lines suggesting text */
const ANCIENT_SCROLL =
  `repeating-linear-gradient(0deg,transparent 0,transparent 40px,rgba(0,0,0,.02) 40px,rgba(0,0,0,.02) 41px,transparent 41px),` +
  `radial-gradient(ellipse 500px 300px at 50% 50%,rgba(251,191,36,.03),transparent),` +
  `linear-gradient(135deg,#1a1410,#0a0806)`;

/* ──────── 41. Easter Glory ──────── */
/* Gold burst on dark */
const EASTER_GLORY =
  `radial-gradient(circle 350px at 50% 30%,rgba(253,224,71,.1),rgba(255,255,255,.02),transparent),` +
  `linear-gradient(135deg,rgba(253,224,71,.04),transparent 50%),` +
  `linear-gradient(180deg,#0a0a1a,#050510)`;

/* ──────── 42. Advent Hope ──────── */
/* Deep purple with anticipation glow */
const ADVENT_HOPE =
  `radial-gradient(ellipse 300px 250px at 50% 30%,rgba(147,51,234,.08),transparent),` +
  `linear-gradient(180deg,rgba(147,51,234,.03),transparent 60%),` +
  `linear-gradient(180deg,#0a0014,#05000a)`;

/* ──────── 43. Christmas Joy ──────── */
/* Red and gold festive */
const CHRISTMAS_JOY =
  `radial-gradient(circle 250px at 30% 30%,rgba(220,38,38,.08),transparent),` +
  `radial-gradient(circle 200px at 70% 60%,rgba(251,191,36,.06),transparent),` +
  `linear-gradient(135deg,#0a000a,#1a0505)`;

/* ──────── 44. Thanksgiving Harvest ──────── */
/* Warm autumn gradient mesh */
const THANKSGIVING =
  `radial-gradient(circle 250px at 20% 30%,rgba(251,191,36,.08),transparent),` +
  `radial-gradient(circle 200px at 80% 70%,rgba(234,88,12,.06),transparent),` +
  `radial-gradient(circle 180px at 50% 50%,rgba(180,120,60,.04),transparent),` +
  `linear-gradient(135deg,#1a0e00,#0a0500)`;

/* ──────── 45. Youth Rally ──────── */
/* Vibrant energetic mesh */
const YOUTH_RALLY =
  `radial-gradient(circle 250px at 25% 30%,rgba(59,130,246,.1),transparent),` +
  `radial-gradient(circle 200px at 75% 60%,rgba(16,185,129,.08),transparent),` +
  `radial-gradient(circle 180px at 50% 80%,rgba(139,92,246,.06),transparent),` +
  `linear-gradient(135deg,#0a0a2e,#050518)`;

/* ──────── 46. Baptism ──────── */
/* Clean blue-white, water theme */
const BAPTISM =
  `radial-gradient(ellipse 300px 200px at 50% 30%,rgba(147,197,253,.05),transparent),` +
  `linear-gradient(170deg,rgba(147,197,253,.03),transparent 50%),` +
  `linear-gradient(180deg,#0a1420,#050e15)`;

/* ──────── 47. Wedding ──────── */
/* Elegant white-gold */
const WEDDING =
  `radial-gradient(circle 250px at 50% 30%,rgba(253,224,71,.06),transparent),` +
  `linear-gradient(170deg,transparent 40%,rgba(255,255,255,.02) 42%,transparent 44%),` +
  `linear-gradient(135deg,#1a1a2e,#0a0a1a)`;

/* ──────── 48. High Contrast ──────── */
/* Pure black, maximum readability */
const HIGH_CONTRAST = `#000000`;

/* ──────── 49. Broadcast Ready ──────── */
/* TV-optimized with subtle scan line */
const BROADCAST =
  `repeating-linear-gradient(0deg,transparent 0,transparent 2px,rgba(0,0,0,.02) 2px,rgba(0,0,0,.02) 3px,transparent 3px),` +
  `radial-gradient(ellipse 400px 300px at 50% 40%,rgba(59,130,246,.03),transparent),` +
  `linear-gradient(180deg,#050508,#0a0a0a)`;

/* ──────── 50. Minimal Warm ──────── */
/* Warm beige with subtle texture */
const MINIMAL_WARM =
  `repeating-linear-gradient(90deg,transparent 0,transparent 4px,rgba(0,0,0,.01) 4px,rgba(0,0,0,.01) 5px,transparent 5px),` +
  `linear-gradient(135deg,#f5f0e8,#f0e8dc)`;

/* ──────── Theme definitions ──────── */

const THEMES: BuildOpts[] = [
  /* === Cathedral / Church === */
  { id: "cathedral-glass", name: "Cathedral Glass", bg: "#0a0a2e", gradient: CATHEDRAL_GLASS, color: "#f0e6ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", letterSpacing: 2, category: "Worship", mood: "dramatic", tags: ["cathedral", "stained glass", "colorful"] },
  { id: "morning-light", name: "Morning Light", bg: "#0a0a1a", gradient: MORNING_LIGHT, color: "#fefce8", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", category: "Worship", mood: "warm", tags: ["morning", "light", "beams"] },
  { id: "gothic-arches", name: "Gothic Arches", bg: "#0a0a0a", gradient: GOTHIC_ARCHES, color: "#e2e8f0", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "classic", tags: ["gothic", "arches", "cathedral"] },
  { id: "stone-pillars", name: "Stone Pillars", bg: "#1a1a1a", gradient: STONE_PILLARS, color: "#f1f5f9", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "classic", tags: ["stone", "pillars", "traditional"] },
  { id: "rose-window", name: "Rose Window", bg: "#0a0a2e", gradient: ROSE_WINDOW, color: "#f3e8ff", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", letterSpacing: 2, category: "Worship", mood: "dramatic", tags: ["rose", "window", "circular"] },
  { id: "cathedral-vault", name: "Cathedral Vault", bg: "#0a0a0a", gradient: CATHEDRAL_VAULT, color: "#e2e8f0", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", category: "Worship", mood: "dark", tags: ["vaulted", "ceiling", "arched"] },

  /* === Royal / Luxury === */
  { id: "royal-crown", name: "Royal Crown", bg: "#0a0014", gradient: ROYAL_CROWN, color: "#fef3c7", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "dramatic", tags: ["royal", "crown", "purple"] },
  { id: "royal-gold", name: "Royal Gold", bg: "#1a0e06", gradient: ROYAL_GOLD, color: "#fffbeb", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "luxury", tags: ["royal", "gold", "premium"] },
  { id: "royal-sapphire", name: "Royal Sapphire", bg: "#0a0a2e", gradient: ROYAL_SAPPHIRE, color: "#f0f4ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "cool", tags: ["royal", "sapphire", "blue"] },
  { id: "royal-crimson", name: "Royal Crimson", bg: "#1a0505", gradient: ROYAL_CRIMSON, color: "#fef2f2", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "dramatic", tags: ["royal", "crimson", "red"] },
  { id: "royal-emerald", name: "Royal Emerald", bg: "#001a0a", gradient: ROYAL_EMERALD, color: "#ecfdf5", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "cool", tags: ["royal", "emerald", "green"] },
  { id: "luxury-gold", name: "Luxury Gold", bg: "#0a0604", gradient: LUXURY_GOLD, color: "#fef3c7", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Modern", mood: "luxury", tags: ["luxury", "gold", "premium"] },

  /* === Contemporary Worship === */
  { id: "modern-stage", name: "Modern Stage", bg: "#0a0a12", gradient: MODERN_STAGE, color: "#fef3c7", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 600, shadow: "deep", category: "Worship", mood: "modern", tags: ["modern", "stage", "spotlight"] },
  { id: "contemporary-blue", name: "Contemporary Blue", bg: "#0a0a1a", gradient: CONTEMPORARY_BLUE, color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "modern", tags: ["contemporary", "blue", "clean"] },
  { id: "worship-night", name: "Worship Night", bg: "#050005", gradient: WORSHIP_NIGHT, color: "#fef2f2", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "dramatic", tags: ["night", "worship", "ambient"] },
  { id: "praise-rising", name: "Praise Rising", bg: "#0a0500", gradient: PRAISE_RISING, color: "#fffbeb", fontEn: "Montserrat", fontTa: "Catamaran", weight: 600, shadow: "soft", category: "Worship", mood: "warm", tags: ["praise", "rising", "warm"] },
  { id: "glass-worship", name: "Glass Worship", bg: "#0a0a1a", gradient: GLASS_WORSHIP, color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", category: "Worship", mood: "modern", tags: ["glass", "frosted", "modern"] },
  /* === Geometric / Pattern === */
  { id: "hexagon-dark", name: "Hexagon Dark", bg: "#050508", gradient: HEXAGON_DARK, color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Modern", mood: "dark", tags: ["hexagon", "pattern", "geometric"] },
  { id: "geometric-blue", name: "Geometric Blue", bg: "#0a0a2e", gradient: GEOMETRIC_BLUE, color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Modern", mood: "cool", tags: ["geometric", "blue", "mesh"] },
  { id: "diamond-silver", name: "Diamond Silver", bg: "#0a0a14", gradient: DIAMOND_SILVER, color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Modern", mood: "cool", tags: ["diamond", "silver", "pattern"] },
  { id: "polygon-mesh", name: "Polygon Mesh", bg: "#050510", gradient: POLYGON_MESH, color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Modern", mood: "modern", tags: ["polygon", "mesh", "network"] },
  { id: "circular-flow", name: "Circular Flow", bg: "#0a0a2e", gradient: CIRCULAR_FLOW, color: "#f0e6ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", category: "Modern", mood: "cool", tags: ["circular", "flow", "circles"] },
  { id: "grid-modern", name: "Grid Modern", bg: "#0a0a0a", gradient: GRID_MODERN, color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Modern", mood: "dark", tags: ["grid", "modern", "clean"] },

  /* === Premium / Elegant === */
  { id: "elegant-dark", name: "Elegant Dark", bg: "#050505", gradient: ELEGANT_DARK, color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", category: "Modern", mood: "dark", tags: ["elegant", "dark", "sophisticated"] },
  { id: "elegant-light", name: "Elegant Light", bg: "#f8fafc", gradient: ELEGANT_LIGHT, color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "none", category: "Modern", mood: "light", tags: ["elegant", "light", "clean"] },
  { id: "premium-dark", name: "Premium Dark", bg: "#000000", gradient: PREMIUM_DARK, color: "#f8fafc", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", category: "Modern", mood: "dark", tags: ["premium", "dark", "luxury"] },
  { id: "premium-light", name: "Premium Light", bg: "#ffffff", gradient: PREMIUM_LIGHT, color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "none", category: "Modern", mood: "light", tags: ["premium", "light", "clean"] },
  { id: "corner-frame", name: "Corner Frame", bg: "#0a0a14", gradient: CORNER_FRAME, color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Modern", mood: "dark", tags: ["corner", "frame", "elegant"] },
  { id: "light-rays", name: "Light Rays", bg: "#0a0a1a", gradient: LIGHT_RAYS, color: "#fefce8", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", category: "Worship", mood: "warm", tags: ["light", "rays", "beams"] },

  /* === Nature / Organic === */
  { id: "wave-motion", name: "Wave Motion", bg: "#0a0a1a", gradient: WAVE_MOTION, color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", category: "Specialty", mood: "cool", tags: ["wave", "ocean", "flow"] },
  { id: "mountain-silhouette", name: "Mountain Silhouette", bg: "#1a0a2e", gradient: MOUNTAIN_SILHOUETTE, color: "#fce7f3", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", category: "Specialty", mood: "dramatic", tags: ["mountain", "silhouette", "landscape"] },
  { id: "ice-crystal", name: "Ice Crystal", bg: "#0a1420", gradient: ICE_CRYSTAL, color: "#e0f2fe", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", category: "Specialty", mood: "cool", tags: ["ice", "crystal", "frost"] },
  { id: "radiant-burst", name: "Radiant Burst", bg: "#0a0014", gradient: RADIANT_BURST, color: "#fefce8", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Worship", mood: "dramatic", tags: ["radiant", "burst", "glory"] },

  /* === Bible / Scripture === */
  { id: "bible-parchment", name: "Bible Parchment", bg: "#2a1a0a", gradient: BIBLE_PARCHMENT, color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "soft", category: "Bible", mood: "classic", tags: ["parchment", "vintage", "scroll"] },
  { id: "scripture-light", name: "Scripture Light", bg: "#0a0a1a", gradient: SCRIPTURE_LIGHT, color: "#fefce8", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Bible", mood: "warm", tags: ["scripture", "light", "word"] },
  { id: "ancient-scroll", name: "Ancient Scroll", bg: "#1a1410", gradient: ANCIENT_SCROLL, color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", category: "Bible", mood: "earthy", tags: ["ancient", "scroll", "vintage"] },

  /* === Prayer === */
  { id: "candlelight-prayer", name: "Candlelight Prayer", bg: "#0a0500", gradient: CANDLELIGHT_PRAYER, color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", category: "Prayer", mood: "warm", tags: ["candle", "prayer", "warm"] },
  { id: "silent-prayer", name: "Silent Prayer", bg: "#0a0a1a", gradient: SILENT_PRAYER, color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 300, shadow: "deep", category: "Prayer", mood: "serene", tags: ["silent", "prayer", "peaceful"] },

  /* === Seasonal / Events === */
  { id: "easter-glory", name: "Easter Glory", bg: "#0a0a1a", gradient: EASTER_GLORY, color: "#fefce8", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 600, shadow: "deep", category: "Seasonal", mood: "warm", tags: ["easter", "glory", "resurrection"] },
  { id: "advent-hope", name: "Advent Hope", bg: "#0a0014", gradient: ADVENT_HOPE, color: "#f3e8ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Seasonal", mood: "dramatic", tags: ["advent", "hope", "purple"] },
  { id: "christmas-joy", name: "Christmas Joy", bg: "#0a000a", gradient: CHRISTMAS_JOY, color: "#fef2f2", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", category: "Seasonal", mood: "warm", tags: ["christmas", "joy", "festive"] },
  { id: "thanksgiving", name: "Thanksgiving", bg: "#1a0e00", gradient: THANKSGIVING, color: "#fff7ed", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "soft", category: "Seasonal", mood: "warm", tags: ["thanksgiving", "harvest", "autumn"] },

  /* === Events === */
  { id: "youth-rally", name: "Youth Rally", bg: "#0a0a2e", gradient: YOUTH_RALLY, color: "#e0e7ff", fontEn: "Montserrat", fontTa: "Catamaran", weight: 700, shadow: "soft", category: "Events", mood: "vibrant", tags: ["youth", "rally", "vibrant"] },
  { id: "baptism", name: "Baptism", bg: "#0a1420", gradient: BAPTISM, color: "#e0f2fe", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", category: "Events", mood: "serene", tags: ["baptism", "water", "clean"] },
  { id: "wedding", name: "Wedding", bg: "#1a1a2e", gradient: WEDDING, color: "#fefce8", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", category: "Events", mood: "warm", tags: ["wedding", "gold", "elegant"] },

  /* === Minimal === */
  { id: "minimal-black", name: "Minimal Black", bg: "#000000", color: "#ffffff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "soft", category: "Minimal", mood: "dark", tags: ["minimal", "black", "clean"] },
  { id: "minimal-white", name: "Minimal White", bg: "#ffffff", color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "none", category: "Minimal", mood: "light", tags: ["minimal", "white", "clean"] },
  { id: "minimal-warm", name: "Warm Minimal", bg: "#f5f0e8", gradient: MINIMAL_WARM, color: "#1a1410", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "none", category: "Minimal", mood: "warm", tags: ["minimal", "warm", "beige"] },

  /* === Specialty === */
  { id: "high-contrast", name: "High Contrast", bg: "#000000", gradient: HIGH_CONTRAST, color: "#ffffff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 700, shadow: "none", category: "Specialty", mood: "dark", tags: ["high contrast", "accessible", "bold"] },
  { id: "broadcast-ready", name: "Broadcast Ready", bg: "#050508", gradient: BROADCAST, color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 600, shadow: "deep", category: "Specialty", mood: "modern", tags: ["broadcast", "tv", "professional"] },
];

export const TEMPLATE_PRESETS: TemplatePreset[] = THEMES.map(build);
