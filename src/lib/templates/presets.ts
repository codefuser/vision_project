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

/* ── Brightness-based typography auto-selection ── */
function hexBrightness(hex: string): number {
  const c = hex.replace("#", "");
  if (c.length < 6) return 0.5;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

type ShadowLevel = "soft" | "deep" | "none" | "light";

interface TypographyPreset {
  color: string;
  refColor: string;
  shadow: ShadowLevel;
  fontEn: string;
  fontTa: string;
  weight: number;
}

function typographyFor(bg: string, mood?: ThemeMood): TypographyPreset {
  const b = hexBrightness(bg);
  const isWarm = mood === "warm" || mood === "earthy" || mood === "luxury";
  const isVibrant = mood === "vibrant" || mood === "dramatic";
  const isSerene = mood === "serene" || mood === "gentle";
  const isLight = mood === "light";
  const isClassic = mood === "classic";

  if (b > 0.55) {
    return {
      color: isWarm ? "#1a1410" : "#0f172a",
      refColor: isWarm ? "#8b7355" : "#3b82f6",
      shadow: "none",
      fontEn: isClassic ? "Lora" : "Inter",
      fontTa: isClassic ? "Noto Serif Tamil" : "Noto Sans Tamil",
      weight: isVibrant ? 600 : 400,
    };
  }
  if (b > 0.3) {
    return {
      color: isWarm ? "#fef3c7" : "#e2e8f0",
      refColor: isWarm ? "#fcd34d" : "#94a3b8",
      shadow: "light",
      fontEn: isClassic ? "Lora" : "Inter",
      fontTa: isClassic ? "Noto Serif Tamil" : "Noto Sans Tamil",
      weight: isVibrant ? 600 : 500,
    };
  }
  if (isSerene) {
    return {
      color: "#e0e7ff", refColor: "#a5b4fc", shadow: "deep",
      fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 300,
    };
  }
  if (isVibrant) {
    return {
      color: "#e0e7ff", refColor: "#67e8f9", shadow: "soft",
      fontEn: "Montserrat", fontTa: "Catamaran", weight: 700,
    };
  }
  if (isClassic) {
    return {
      color: "#f1f5f9", refColor: "#cbd5e1", shadow: "deep",
      fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500,
    };
  }
  if (isWarm) {
    return {
      color: "#fef3c7", refColor: "#fbbf24", shadow: "deep",
      fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500,
    };
  }
  if (isLight) {
    return {
      color: "#f1f5f9", refColor: "#94a3b8", shadow: "deep",
      fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400,
    };
  }
  return {
    color: "#f1f5f9", refColor: "#94a3b8", shadow: "deep",
    fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400,
  };
}

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
  gradient: string;
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
  const t = typographyFor(o.bg, o.mood);
  const fontEn = o.fontEn ?? t.fontEn;
  const fontTa = o.fontTa ?? t.fontTa;
  const color = o.color ?? t.color;
  const sh =
    o.shadow === "none"
      ? { shadow: false, shadowBlur: 0 }
      : o.shadow ?? t.shadow === "deep"
        ? shadowDeep
        : o.shadow ?? t.shadow === "light"
          ? shadowLight
          : o.shadow ?? t.shadow === "soft"
            ? shadowSoft
            : shadowDeep;
  return {
    id: o.id,
    name: o.name,
    category: o.category,
    description: o.description ?? `${o.name} — premium gradient presentation theme.`,
    mood: o.mood,
    tags: o.tags,
    text: {
      ...T({ fontFamily: fontEn, color, fontWeight: o.weight ?? t.weight }),
      ...sh,
      ...(o.lineHeight ? { lineHeight: o.lineHeight } : {}),
      ...(o.letterSpacing != null ? { letterSpacing: o.letterSpacing } : {}),
      ...(o.padding != null ? { paddingVw: o.padding } : {}),
      ...(o.align ? { align: o.align } : {}),
      ...(o.vAlign ? { vAlign: o.vAlign } : {}),
    },
    perGroup: {
      reference: {
        color: o.refColor ?? t.refColor,
        ...(sh.shadow ? { shadow: true, shadowBlur: 20, shadowColor: "#000000" } : {}),
      },
      tamil: { fontFamily: fontTa, fontSizeVw: o.tamilSize ?? 5 },
      english: { fontFamily: fontEn },
    },
    background: {
      kind: "color",
      color: o.bg,
      gradient: o.gradient,
      ...(o.bgOpacity != null ? { opacity: o.bgOpacity } : {}),
      ...(o.bgColor ? { overlayColor: o.bgColor } : {}),
    },
    logo: o.logo,
  };
};

/* ═══════════════════════════════════════════════════════════════════
   50 PREMIUM GRADIENT THEMES
   Pure CSS gradients only. No SVG. No decorations. No patterns.
   Each theme: 3-6 gradient layers with unique color, direction, mood.
   ═══════════════════════════════════════════════════════════════════ */

const THEMES: BuildOpts[] = [
  {
    id: "morning-light", name: "Morning Light",
    bg: "#f9d423",
    gradient: `linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['morning', 'sunrise', 'golden', 'warm'],
    shadow: "deep"
  },
  {
    id: "sunrise", name: "Sunrise",
    bg: "#f83600",
    gradient: `linear-gradient(135deg, #f83600 0%, #f9d423 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['sunrise', 'dawn', 'orange', 'dramatic'],
    shadow: "deep"
  },
  {
    id: "sunset", name: "Sunset",
    bg: "#fa709a",
    gradient: `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['sunset', 'dusk', 'pink', 'warm'],
    shadow: "deep"
  },
  {
    id: "ocean", name: "Ocean",
    bg: "#00c6ff",
    gradient: `linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['ocean', 'sea', 'blue', 'water'],
    shadow: "deep"
  },
  {
    id: "forest", name: "Forest",
    bg: "#11998e",
    gradient: `linear-gradient(135deg, #11998e 0%, #38ef7d 100%)`,
    category: "Bible", mood: "vibrant",
    tags: ['forest', 'green', 'nature'],
    shadow: "deep"
  },
  {
    id: "aurora", name: "Aurora",
    bg: "#8E2DE2",
    gradient: `linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['aurora', 'purple', 'ethereal'],
    shadow: "deep"
  },
  {
    id: "galaxy", name: "Galaxy",
    bg: "#cc2b5e",
    gradient: `linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['galaxy', 'space', 'pink'],
    shadow: "deep"
  },
  {
    id: "royal-purple", name: "Royal Purple",
    bg: "#654ea3",
    gradient: `linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['royal', 'purple', 'premium'],
    shadow: "deep"
  },
  {
    id: "royal-blue", name: "Royal Blue",
    bg: "#2193b0",
    gradient: `linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['royal', 'blue', 'premium'],
    shadow: "deep"
  },
  {
    id: "royal-green", name: "Royal Green",
    bg: "#02aab0",
    gradient: `linear-gradient(135deg, #02aab0 0%, #00cdac 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['royal', 'green', 'premium'],
    shadow: "deep"
  },
  {
    id: "royal-gold", name: "Royal Gold",
    bg: "#ffb347",
    gradient: `linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['royal', 'gold', 'shimmer'],
    shadow: "deep"
  },
  {
    id: "emerald", name: "Emerald",
    bg: "#348F50",
    gradient: `linear-gradient(135deg, #348F50 0%, #56B4D3 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['emerald', 'gem', 'green'],
    shadow: "deep"
  },
  {
    id: "sapphire", name: "Sapphire",
    bg: "#1cb5e0",
    gradient: `linear-gradient(135deg, #000046 0%, #1cb5e0 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['sapphire', 'gem', 'blue'],
    shadow: "deep"
  },
  {
    id: "ruby", name: "Ruby",
    bg: "#e52d27",
    gradient: `linear-gradient(135deg, #e52d27 0%, #b31217 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['ruby', 'gem', 'red'],
    shadow: "deep"
  },
  {
    id: "rose", name: "Rose",
    bg: "#ff7eb3",
    gradient: `linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%)`,
    category: "Bible", mood: "vibrant",
    tags: ['rose', 'pink', 'delicate'],
    shadow: "deep"
  },
  {
    id: "copper", name: "Copper",
    bg: "#e65c00",
    gradient: `linear-gradient(135deg, #e65c00 0%, #F9D423 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['copper', 'orange', 'metal'],
    shadow: "deep"
  },
  {
    id: "silver", name: "Silver",
    bg: "#bdc3c7",
    gradient: `linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)`,
    category: "Modern", mood: "cool",
    tags: ['silver', 'gray', 'metal'],
    shadow: "deep"
  },
  {
    id: "graphite", name: "Graphite",
    bg: "#2b5876",
    gradient: `linear-gradient(135deg, #2b5876 0%, #4e4376 100%)`,
    category: "Modern", mood: "dark",
    tags: ['graphite', 'dark', 'neutral'],
    shadow: "deep"
  },
  {
    id: "midnight", name: "Midnight",
    bg: "#314755",
    gradient: `linear-gradient(135deg, #314755 0%, #26a0da 100%)`,
    category: "Events", mood: "vibrant",
    tags: ['midnight', 'navy', 'night'],
    shadow: "deep"
  },
  {
    id: "carbon", name: "Carbon",
    bg: "#141E30",
    gradient: `linear-gradient(135deg, #141E30 0%, #243B55 100%)`,
    category: "Modern", mood: "dark",
    tags: ['carbon', 'black', 'minimal'],
    shadow: "deep"
  },
  {
    id: "obsidian", name: "Obsidian",
    bg: "#000000",
    gradient: `linear-gradient(135deg, #434343 0%, #000000 100%)`,
    category: "Modern", mood: "dark",
    tags: ['obsidian', 'black', 'pure'],
    shadow: "deep"
  },
  {
    id: "pearl", name: "Pearl",
    bg: "#70e1f5",
    gradient: `linear-gradient(135deg, #70e1f5 0%, #ffd194 100%)`,
    category: "Modern", mood: "vibrant",
    tags: ['pearl', 'cyan', 'warm'],
    shadow: "deep"
  },
  {
    id: "ivory", name: "Ivory",
    bg: "#00c6ff",
    gradient: `radial-gradient(circle, #00c6ff 0%, #0072ff 100%)`,
    category: "Modern", mood: "vibrant",
    tags: ['ivory', 'blue', 'radial'],
    shadow: "deep"
  },
  {
    id: "champagne", name: "Champagne",
    bg: "#f6d365",
    gradient: `linear-gradient(135deg, #f6d365 0%, #fda085 100%)`,
    category: "Modern", mood: "vibrant",
    tags: ['champagne', 'orange', 'warm'],
    shadow: "deep"
  },
  {
    id: "wine", name: "Wine",
    bg: "#b224ef",
    gradient: `linear-gradient(135deg, #b224ef 0%, #7579ff 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['wine', 'purple', 'rich'],
    shadow: "deep"
  },
  {
    id: "lavender", name: "Lavender",
    bg: "#c471f5",
    gradient: `linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['lavender', 'pink', 'gentle'],
    shadow: "deep"
  },
  {
    id: "sky", name: "Sky",
    bg: "#4facfe",
    gradient: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['sky', 'blue', 'peaceful'],
    shadow: "deep"
  },
  {
    id: "rain", name: "Rain",
    bg: "#43e97b",
    gradient: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`,
    category: "Events", mood: "vibrant",
    tags: ['rain', 'green', 'fresh'],
    shadow: "deep"
  },
  {
    id: "cloud", name: "Cloud",
    bg: "#89f7fe",
    gradient: `linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)`,
    category: "Minimal", mood: "vibrant",
    tags: ['cloud', 'blue', 'clean'],
    shadow: "deep"
  },
  {
    id: "twilight", name: "Twilight",
    bg: "#6a11cb",
    gradient: `linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['twilight', 'purple', 'blue'],
    shadow: "deep"
  },
  {
    id: "velvet", name: "Velvet",
    bg: "#f78ca0",
    gradient: `linear-gradient(135deg, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['velvet', 'rich', 'pink'],
    shadow: "deep"
  },
  {
    id: "minimal-black", name: "Minimal Black",
    bg: "#000000",
    gradient: `#000000`,
    category: "Minimal", mood: "dark",
    tags: ['minimal', 'black', 'pure'],
    shadow: "deep"
  },
  {
    id: "minimal-white", name: "Minimal White",
    bg: "#ffffff",
    gradient: `#ffffff`,
    category: "Minimal", mood: "light",
    tags: ['minimal', 'white', 'pure'],
    shadow: "deep"
  },
  {
    id: "modern-navy", name: "Modern Navy",
    bg: "#a18cd1",
    gradient: `linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)`,
    category: "Modern", mood: "vibrant",
    tags: ['navy', 'modern', 'pink'],
    shadow: "deep"
  },
  {
    id: "deep-ocean", name: "Deep Ocean",
    bg: "#ff0844",
    gradient: `linear-gradient(135deg, #ff0844 0%, #ffb199 100%)`,
    category: "Modern", mood: "vibrant",
    tags: ['ocean', 'deep', 'red'],
    shadow: "deep"
  },
  {
    id: "dark-purple", name: "Dark Purple",
    bg: "#93a5cf",
    gradient: `linear-gradient(135deg, #93a5cf 0%, #e4efe9 100%)`,
    category: "Modern", mood: "vibrant",
    tags: ['purple', 'dark', 'moody'],
    shadow: "deep"
  },
  {
    id: "warm-sand", name: "Warm Sand",
    bg: "#43e97b",
    gradient: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['sand', 'warm', 'green'],
    shadow: "deep"
  },
  {
    id: "golden-light", name: "Golden Light",
    bg: "#f83600",
    gradient: `linear-gradient(135deg, #f83600 0%, #f9d423 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['golden', 'light', 'warm'],
    shadow: "deep"
  },
  {
    id: "cool-blue", name: "Cool Blue",
    bg: "#00c6fb",
    gradient: `linear-gradient(135deg, #00c6fb 0%, #005bea 100%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['blue', 'cool', 'fresh'],
    shadow: "deep"
  },
  {
    id: "soft-pink", name: "Soft Pink",
    bg: "#ff9a9e",
    gradient: `linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['pink', 'soft', 'gentle'],
    shadow: "deep"
  },
  {
    id: "pastel-green", name: "Pastel Green",
    bg: "#a1c4fd",
    gradient: `linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['green', 'pastel', 'blue'],
    shadow: "deep"
  },
  {
    id: "steel", name: "Steel",
    bg: "#667eea",
    gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
    category: "Modern", mood: "vibrant",
    tags: ['steel', 'purple', 'cool'],
    shadow: "deep"
  },
  {
    id: "electric-blue", name: "Electric Blue",
    bg: "#89f7fe",
    gradient: `linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)`,
    category: "Events", mood: "vibrant",
    tags: ['electric', 'blue', 'cyan'],
    shadow: "deep"
  },
  {
    id: "crimson", name: "Crimson",
    bg: "#ff0844",
    gradient: `linear-gradient(135deg, #ff0844 0%, #ffb199 100%)`,
    category: "Events", mood: "vibrant",
    tags: ['crimson', 'red', 'bold'],
    shadow: "deep"
  },
  {
    id: "olive", name: "Olive",
    bg: "#cd9cf2",
    gradient: `linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['olive', 'purple', 'natural'],
    shadow: "deep"
  },
  {
    id: "chocolate", name: "Chocolate",
    bg: "#f6d365",
    gradient: `linear-gradient(135deg, #f6d365 0%, #fda085 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['chocolate', 'orange', 'warm'],
    shadow: "deep"
  },
  {
    id: "indigo", name: "Indigo",
    bg: "#c471f5",
    gradient: `linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['indigo', 'purple', 'deep'],
    shadow: "deep"
  },
  {
    id: "arctic", name: "Arctic",
    bg: "#4facfe",
    gradient: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['arctic', 'ice', 'frost'],
    shadow: "deep"
  },
  {
    id: "stone", name: "Stone",
    bg: "#43e97b",
    gradient: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`,
    category: "Minimal", mood: "vibrant",
    tags: ['stone', 'green', 'neutral'],
    shadow: "deep"
  },
  {
    id: "smoke", name: "Smoke",
    bg: "#8E2DE2",
    gradient: `linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)`,
    category: "Modern", mood: "vibrant",
    tags: ['smoke', 'purple', 'moody'],
    shadow: "deep"
  },
];

export const TEMPLATE_PRESETS: TemplatePreset[] = THEMES.map(build);
