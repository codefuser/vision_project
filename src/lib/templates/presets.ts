import type { BackgroundConfig, SectionStyle } from "@/lib/broadcast";
import type { LogoSettings } from "@/stores/logo.store";

export type TemplateCategory =
  | "Worship" | "Bible" | "Prayer" | "Seasonal" | "Events" | "Modern" | "Minimal" | "Specialty";

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
  "Worship",
  "Bible",
  "Prayer",
  "Seasonal",
  "Events",
  "Modern",
  "Minimal",
  "Specialty",
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

/* ── Worship — Royal / Regal ── */
const WORSHIP_ROYAL: BuildOpts[] = [
  { id: "worship-royal-sapphire", name: "Royal Sapphire", bg: "#0a0a2e", gradient: "radial-gradient(ellipse at 50% 30%,rgba(59,130,246,.18),rgba(30,58,138,.12),#0a0a2e 85%)", color: "#f0f4ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "cool", category: "Worship", tags: ["royal", "sapphire", "blue", "elegant"] },
  { id: "worship-royal-crimson", name: "Royal Crimson", bg: "#1a0a0a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(220,38,38,.15),rgba(127,29,29,.1),#1a0a0a 85%)", color: "#fef2f2", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Worship", tags: ["royal", "crimson", "red", "dramatic"] },
  { id: "worship-royal-purple", name: "Royal Purple", bg: "#0a001a", gradient: "radial-gradient(ellipse at 50% 35%,rgba(147,51,234,.2),rgba(88,28,135,.12),#0a001a 85%)", color: "#f3e8ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Worship", tags: ["royal", "purple", "regal"] },
  { id: "worship-royal-gold", name: "Royal Gold", bg: "#1a0e06", gradient: "radial-gradient(ellipse at 50% 50%,rgba(251,191,36,.15),rgba(146,64,14,.08),#1a0e06 85%)", color: "#fffbeb", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "warm", category: "Worship", tags: ["royal", "gold", "luxury"] },
  { id: "worship-royal-emerald", name: "Royal Emerald", bg: "#001a0a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(16,185,129,.15),rgba(6,78,60,.1),#001a0a 85%)", color: "#ecfdf5", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "cool", category: "Worship", tags: ["royal", "emerald", "green"] },
  { id: "worship-royal-silver", name: "Royal Silver", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 30%,rgba(148,163,184,.2),rgba(71,85,105,.1),#0a0a1a 85%)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "cool", category: "Worship", tags: ["royal", "silver", "elegant"] },
];

/* ── Worship — Cathedral / Church ── */
const WORSHIP_CATHEDRAL: BuildOpts[] = [
  { id: "worship-cathedral-stone", name: "Cathedral Stone", bg: "#1a1a1a", gradient: "linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 30%,#222 60%,#1a1a1a 100%)", color: "#f1f5f9", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "classic", category: "Worship", tags: ["cathedral", "stone", "classic"] },
  { id: "worship-stained-glass", name: "Stained Glass", bg: "#0a0a2e", gradient: "linear-gradient(135deg,rgba(147,51,234,.15),rgba(59,130,246,.1),rgba(236,72,153,.08),rgba(251,191,36,.1))", color: "#f0e6ff", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "dramatic", category: "Worship", tags: ["stained", "glass", "colorful"] },
  { id: "worship-marble-pillars", name: "Marble Pillars", bg: "#2a2a2a", gradient: "linear-gradient(180deg,#3a3a3a 0%,#4a4a4a 25%,#353535 50%,#2a2a2a 100%)", color: "#f8fafc", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "classic", category: "Worship", tags: ["marble", "pillars", "grand"] },
  { id: "worship-vaulted-ceiling", name: "Vaulted Ceiling", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 0%,rgba(148,163,184,.08) 0%,transparent 60%),linear-gradient(180deg,#0a0a0a,#050505)", color: "#e2e8f0", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", letterSpacing: 2, mood: "dark", category: "Worship", tags: ["vaulted", "ceiling", "cathedral"] },
  { id: "worship-organ-pipes", name: "Organ Pipes", bg: "#050505", gradient: "repeating-linear-gradient(90deg,transparent,transparent 4%,rgba(148,163,184,.03) 4%,rgba(148,163,184,.03) 5%),linear-gradient(180deg,#1a1a1a,#050505)", color: "#e2e8f0", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dark", category: "Worship", tags: ["organ", "pipes", "church"] },
  { id: "worship-choir-loft", name: "Choir Loft", bg: "#1a0a0a", gradient: "radial-gradient(ellipse at 50% 60%,rgba(251,191,36,.06),transparent 70%),linear-gradient(180deg,#1a0a0a,#0a0505)", color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "warm", category: "Worship", tags: ["choir", "loft", "warm"] },
];

/* ── Worship — Contemporary ── */
const WORSHIP_CONTEMPORARY: BuildOpts[] = [
  { id: "worship-modern-stage", name: "Modern Stage", bg: "#0a0a12", gradient: "radial-gradient(ellipse at 50% 80%,rgba(251,191,36,.08),transparent 60%),linear-gradient(180deg,#0a0a12,#030308)", color: "#fef3c7", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 600, shadow: "deep", mood: "modern", category: "Worship", tags: ["modern", "stage", "contemporary"] },
  { id: "worship-auditorium", name: "Auditorium", bg: "#050508", gradient: "radial-gradient(ellipse at 50% 40%,rgba(99,102,241,.08),transparent 60%),linear-gradient(180deg,#0a0a14,#050508)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "modern", category: "Worship", tags: ["auditorium", "stage", "blue"] },
  { id: "worship-worship-night", name: "Worship Night", bg: "#0a0005", gradient: "radial-gradient(ellipse at 50% 70%,rgba(239,68,68,.06),rgba(251,191,36,.04),transparent 70%),linear-gradient(180deg,#0a0005,#050002)", color: "#fef2f2", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Worship", tags: ["night", "worship", "ambient"] },
  { id: "worship-praise-rising", name: "Praise Rising", bg: "#1a0a00", gradient: "linear-gradient(180deg,rgba(251,191,36,.08),rgba(234,88,12,.04),#1a0a00 80%)", color: "#fffbeb", fontEn: "Montserrat", fontTa: "Catamaran", weight: 600, shadow: "soft", mood: "warm", category: "Worship", tags: ["praise", "rising", "warm"] },
  { id: "worship-worship-dawn", name: "Worship Dawn", bg: "#1a1410", gradient: "linear-gradient(180deg,rgba(251,146,60,.06),rgba(251,191,36,.04),rgba(147,51,234,.02),#1a1410 90%)", color: "#ffedd5", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "warm", category: "Worship", tags: ["dawn", "morning", "gentle"] },
  { id: "worship-sunlight-beams", name: "Sunlight Beams", bg: "#0a0a1a", gradient: "linear-gradient(135deg,rgba(253,224,71,.08),transparent 40%,rgba(147,197,253,.04) 70%,transparent),linear-gradient(180deg,#0a0a1a,#050510)", color: "#fefce8", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "warm", category: "Worship", tags: ["sunlight", "beams", "light"] },
];

/* ── Worship — Traditional ── */
const WORSHIP_TRADITIONAL: BuildOpts[] = [
  { id: "worship-hymn-books", name: "Hymn Books", bg: "#0a0a2e", gradient: "radial-gradient(ellipse at 50% 30%,rgba(251,191,36,.08),#0a0a2e 80%)", color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "classic", category: "Worship", tags: ["hymn", "traditional", "classic"] },
  { id: "worship-gospel-joy", name: "Gospel Joy", bg: "#1a0a00", gradient: "linear-gradient(135deg,rgba(251,191,36,.12),rgba(234,88,12,.08),rgba(220,38,38,.04))", color: "#fff7ed", fontEn: "Montserrat", fontTa: "Catamaran", weight: 600, shadow: "soft", mood: "warm", category: "Worship", tags: ["gospel", "joy", "vibrant"] },
  { id: "worship-revival-fire", name: "Revival Fire", bg: "#0a0000", gradient: "radial-gradient(ellipse at 50% 80%,rgba(239,68,68,.12),rgba(251,146,60,.06),transparent 70%),linear-gradient(180deg,#1a0505,#0a0000)", color: "#fef2f2", fontEn: "Montserrat", fontTa: "Catamaran", weight: 700, shadow: "deep", mood: "dramatic", category: "Worship", tags: ["revival", "fire", "passion"] },
  { id: "worship-sanctuary", name: "Sanctuary", bg: "#14100a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(180,120,60,.08),transparent 70%),linear-gradient(180deg,#1a1410,#0a0806)", color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "warm", category: "Worship", tags: ["sanctuary", "wood", "warm"] },
  { id: "worship-altar-call", name: "Altar Call", bg: "#0a0500", gradient: "radial-gradient(ellipse at 50% 60%,rgba(251,191,36,.1),rgba(180,120,60,.04),transparent 70%),linear-gradient(180deg,#0a0500,#050200)", color: "#fefce8", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "warm", category: "Worship", tags: ["altar", "prayer", "soft"] },
];

/* ── Worship — Sacred ── */
const WORSHIP_SACRED: BuildOpts[] = [
  { id: "worship-holy-light", name: "Holy Light", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.06),rgba(253,224,71,.04),transparent 70%),linear-gradient(180deg,#0a0a1a,#050510)", color: "#f0f4ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "gentle", category: "Worship", tags: ["holy", "light", "sacred"] },
  { id: "worship-divine-mercy", name: "Divine Mercy", bg: "#0a1420", gradient: "radial-gradient(ellipse at 50% 40%,rgba(147,197,253,.08),rgba(59,130,246,.04),transparent 70%),linear-gradient(180deg,#0a1420,#050a12)", color: "#e0f2fe", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "gentle", category: "Worship", tags: ["divine", "mercy", "peaceful"] },
  { id: "worship-sacred-heart", name: "Sacred Heart", bg: "#1a0505", gradient: "radial-gradient(ellipse at 50% 40%,rgba(220,38,38,.1),rgba(251,191,36,.04),transparent 70%),linear-gradient(180deg,#1a0505,#0a0202)", color: "#fef2f2", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Worship", tags: ["sacred", "heart", "love"] },
  { id: "worship-trinity", name: "Trinity", bg: "#0a0a1a", gradient: "linear-gradient(135deg,rgba(59,130,246,.08),rgba(147,51,234,.06),rgba(251,191,36,.04)),linear-gradient(180deg,#0a0a1a,#050510)", color: "#f0f4ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "cool", category: "Worship", tags: ["trinity", "three", "divine"] },
  { id: "worship-pentecost", name: "Pentecost", bg: "#1a0500", gradient: "radial-gradient(ellipse at 50% 60%,rgba(239,68,68,.1),rgba(251,146,60,.06),transparent 70%),linear-gradient(180deg,#1a0500,#0a0200)", color: "#fef2f2", fontEn: "Montserrat", fontTa: "Catamaran", weight: 700, shadow: "deep", mood: "vibrant", category: "Worship", tags: ["pentecost", "fire", "spirit"] },
  { id: "worship-advent-purple", name: "Advent Purple", bg: "#0a0014", gradient: "radial-gradient(ellipse at 50% 30%,rgba(147,51,234,.12),rgba(88,28,135,.06),#0a0014 85%)", color: "#f3e8ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Worship", tags: ["advent", "purple", "hope"] },
  { id: "worship-easter-joy", name: "Easter Joy", bg: "#0a0a2e", gradient: "radial-gradient(ellipse at 50% 30%,rgba(253,224,71,.12),rgba(255,255,255,.04),#0a0a2e 85%)", color: "#fefce8", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "warm", category: "Worship", tags: ["easter", "joy", "gold"] },
  { id: "worship-christmas-star", name: "Christmas Star", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 30% 20%,rgba(253,224,71,.1),transparent 60%),linear-gradient(180deg,#0a0a1a,#050510)", color: "#fefce8", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", letterSpacing: 2, mood: "warm", category: "Worship", tags: ["christmas", "star", "nativity"] },
];

/* ── Bible ── */
const BIBLE_THEMES: BuildOpts[] = [
  { id: "bible-ancient-parchment", name: "Ancient Parchment", bg: "#2a1a0a", gradient: "linear-gradient(180deg,#3a2a1a,#2a1a0a,#1a0e06)", color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "soft", mood: "classic", category: "Bible", tags: ["parchment", "ancient", "scroll"] },
  { id: "bible-scripture-scroll", name: "Scripture Scroll", bg: "#1a1410", gradient: "linear-gradient(135deg,#2a2018,#1a1410,#0a0806)", color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "soft", mood: "classic", category: "Bible", tags: ["scroll", "scripture", "vintage"] },
  { id: "bible-scholar", name: "Bible Scholar", bg: "#0a1a0a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(34,197,94,.06),#0a1a0a 85%)", color: "#ecfdf5", fontEn: "Georgia", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "earthy", category: "Bible", tags: ["scholar", "study", "green"] },
  { id: "bible-torah-scroll", name: "Torah Scroll", bg: "#0a0a2e", gradient: "linear-gradient(135deg,rgba(59,130,246,.06),rgba(30,58,138,.04),#0a0a2e)", color: "#e0e7ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "classic", category: "Bible", tags: ["torah", "scroll", "blue"] },
  { id: "bible-gospel-light", name: "Gospel Light", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 30%,rgba(253,224,71,.08),rgba(255,255,255,.02),#0a0a1a 85%)", color: "#fefce8", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "warm", category: "Bible", tags: ["gospel", "light", "radiant"] },
  { id: "bible-scripture-study", name: "Scripture Study", bg: "#1a1410", gradient: "radial-gradient(ellipse at 50% 40%,rgba(251,191,36,.06),transparent 70%),linear-gradient(180deg,#1a1410,#0a0806)", color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "soft", mood: "warm", category: "Bible", tags: ["study", "learning", "warm"] },
  { id: "bible-bible-journey", name: "Bible Journey", bg: "#0a1a0a", gradient: "linear-gradient(135deg,rgba(34,197,94,.04),rgba(22,163,74,.03),#0a1a0a)", color: "#ecfdf5", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "earthy", category: "Bible", tags: ["journey", "nature", "growth"] },
  { id: "bible-word-of-god", name: "Word of God", bg: "#0a000a", gradient: "radial-gradient(ellipse at 50% 30%,rgba(220,38,38,.08),rgba(251,191,36,.04),#0a000a 85%)", color: "#fef2f2", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 600, shadow: "deep", mood: "dramatic", category: "Bible", tags: ["word", "god", "bible"] },
  { id: "bible-biblical-times", name: "Biblical Times", bg: "#1a1410", gradient: "linear-gradient(180deg,#2a1a0a,#1a1410,#0a0806)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", weight: 400, shadow: "soft", mood: "earthy", category: "Bible", tags: ["biblical", "times", "historical"] },
  { id: "bible-covenant", name: "Covenant", bg: "#00001a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(99,102,241,.08),rgba(147,51,234,.04),#00001a 85%)", color: "#e0e7ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "cool", category: "Bible", tags: ["covenant", "promise", "blue"] },
  { id: "bible-prophecy", name: "Prophecy", bg: "#0a0014", gradient: "radial-gradient(ellipse at 50% 30%,rgba(147,51,234,.1),rgba(251,191,36,.04),#0a0014 85%)", color: "#f3e8ff", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Bible", tags: ["prophecy", "vision", "purple"] },
  { id: "bible-wisdom", name: "Wisdom", bg: "#0a0a2e", gradient: "linear-gradient(135deg,rgba(99,102,241,.06),rgba(148,163,184,.04),#0a0a2e)", color: "#e0e7ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "cool", category: "Bible", tags: ["wisdom", "proverbs", "elegant"] },
  { id: "bible-psalm", name: "Psalm", bg: "#0a1420", gradient: "radial-gradient(ellipse at 50% 40%,rgba(147,197,253,.06),rgba(59,130,246,.03),#0a1420 85%)", color: "#e0f2fe", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "serene", category: "Bible", tags: ["psalm", "peaceful", "blue"] },
  { id: "bible-proverb", name: "Proverb", bg: "#1a1400", gradient: "radial-gradient(ellipse at 50% 30%,rgba(251,191,36,.08),rgba(146,64,14,.04),#1a1400 85%)", color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "soft", mood: "warm", category: "Bible", tags: ["proverb", "wisdom", "gold"] },
  { id: "bible-revelation", name: "Revelation", bg: "#0a0005", gradient: "radial-gradient(ellipse at 50% 30%,rgba(147,51,234,.1),rgba(239,68,68,.04),transparent 70%),linear-gradient(180deg,#0a0005,#050002)", color: "#f3e8ff", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 600, shadow: "deep", mood: "dramatic", category: "Bible", tags: ["revelation", "apocalypse", "vision"] },
];

/* ── Prayer ── */
const PRAYER_THEMES: BuildOpts[] = [
  { id: "prayer-candlelight", name: "Candlelight Prayer", bg: "#0a0500", gradient: "radial-gradient(ellipse at 50% 80%,rgba(251,191,36,.08),rgba(234,88,12,.03),transparent 60%),linear-gradient(180deg,#0a0500,#050200)", color: "#fef3c7", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "warm", category: "Prayer", tags: ["candle", "prayer", "quiet"] },
  { id: "prayer-silent", name: "Silent Prayer", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(99,102,241,.04),transparent 70%),linear-gradient(180deg,#0a0a1a,#050510)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 300, shadow: "deep", mood: "serene", category: "Prayer", tags: ["silent", "quiet", "peaceful"] },
  { id: "prayer-meditation", name: "Meditation", bg: "#001a0a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(52,211,153,.04),transparent 70%),linear-gradient(180deg,#001a0a,#000a04)", color: "#ecfdf5", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 300, shadow: "deep", mood: "serene", category: "Prayer", tags: ["meditation", "calm", "green"] },
  { id: "prayer-contemplation", name: "Contemplation", bg: "#0a0014", gradient: "radial-gradient(ellipse at 50% 30%,rgba(167,139,250,.04),transparent 70%),linear-gradient(180deg,#0a0014,#05000a)", color: "#f3e8ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "gentle", category: "Prayer", tags: ["contemplation", "purple", "soft"] },
  { id: "prayer-intercession", name: "Intercession", bg: "#0a0005", gradient: "radial-gradient(ellipse at 50% 40%,rgba(239,68,68,.06),rgba(251,191,36,.03),transparent 70%),linear-gradient(180deg,#0a0005,#050002)", color: "#fef2f2", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Prayer", tags: ["intercession", "prayer", "earnest"] },
  { id: "prayer-gratitude", name: "Gratitude", bg: "#1a0e06", gradient: "radial-gradient(ellipse at 50% 50%,rgba(251,191,36,.06),transparent 60%),linear-gradient(180deg,#1a0e06,#0a0604)", color: "#fffbeb", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "warm", category: "Prayer", tags: ["gratitude", "thankful", "warm"] },
  { id: "prayer-surrender", name: "Surrender", bg: "#0a0a14", gradient: "radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.03),transparent 70%),linear-gradient(180deg,#0a0a14,#05050a)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 300, shadow: "deep", mood: "gentle", category: "Prayer", tags: ["surrender", "peace", "white"] },
  { id: "prayer-seek-first", name: "Seek First", bg: "#0a0a00", gradient: "radial-gradient(ellipse at 50% 30%,rgba(253,224,71,.06),transparent 60%),linear-gradient(180deg,#0a0a00,#050500)", color: "#fefce8", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "warm", category: "Prayer", tags: ["seek", "kingdom", "gold"] },
  { id: "prayer-quiet-time", name: "Quiet Time", bg: "#0a0a12", gradient: "linear-gradient(180deg,rgba(148,163,184,.03),#0a0a12)", color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "serene", category: "Prayer", tags: ["quiet", "time", "still"] },
  { id: "prayer-sanctuary-peace", name: "Sanctuary Peace", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(147,197,253,.04),rgba(167,139,250,.02),transparent 60%),linear-gradient(180deg,#0a0a1a,#050510)", color: "#f0f4ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "serene", category: "Prayer", tags: ["sanctuary", "peace", "calm"] },
];

/* ── Seasonal ── */
const SEASONAL_THEMES: BuildOpts[] = [
  { id: "seasonal-advent-hope", name: "Advent Hope", bg: "#0a0014", gradient: "radial-gradient(ellipse at 50% 30%,rgba(147,51,234,.1),rgba(30,27,75,.06),#0a0014 85%)", color: "#f3e8ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Seasonal", tags: ["advent", "hope", "purple"] },
  { id: "seasonal-christmas-joy", name: "Christmas Joy", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(220,38,38,.08),rgba(251,191,36,.04),rgba(16,185,129,.02),#0a0a1a 85%)", color: "#fef2f2", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "warm", category: "Seasonal", tags: ["christmas", "joy", "holiday"] },
  { id: "seasonal-epiphany", name: "Epiphany", bg: "#0a0a2e", gradient: "radial-gradient(ellipse at 30% 20%,rgba(253,224,71,.1),transparent 60%),linear-gradient(180deg,#0a0a2e,#050518)", color: "#fefce8", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "warm", category: "Seasonal", tags: ["epiphany", "star", "reveal"] },
  { id: "seasonal-lent", name: "Lent", bg: "#0a050a", gradient: "linear-gradient(180deg,rgba(147,51,234,.06),rgba(88,28,135,.04),#0a050a)", color: "#f3e8ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "dark", category: "Seasonal", tags: ["lent", "repentance", "purple"] },
  { id: "seasonal-easter-glory", name: "Easter Glory", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 30%,rgba(253,224,71,.12),rgba(255,255,255,.04),#0a0a1a 85%)", color: "#fefce8", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 600, shadow: "deep", mood: "warm", category: "Seasonal", tags: ["easter", "glory", "resurrection"] },
  { id: "seasonal-pentecost-fire", name: "Pentecost Fire", bg: "#0a0000", gradient: "radial-gradient(ellipse at 50% 60%,rgba(239,68,68,.1),rgba(251,146,60,.06),transparent 70%),linear-gradient(180deg,#1a0202,#0a0000)", color: "#fef2f2", fontEn: "Montserrat", fontTa: "Catamaran", weight: 700, shadow: "deep", mood: "vibrant", category: "Seasonal", tags: ["pentecost", "fire", "spirit"] },
  { id: "seasonal-harvest-gold", name: "Harvest Gold", bg: "#1a1400", gradient: "radial-gradient(ellipse at 50% 50%,rgba(251,191,36,.08),rgba(217,119,6,.04),#1a1400 85%)", color: "#fffbeb", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "soft", mood: "warm", category: "Seasonal", tags: ["harvest", "gold", "thanksgiving"] },
  { id: "seasonal-thanksgiving", name: "Thanksgiving", bg: "#1a0e00", gradient: "linear-gradient(135deg,rgba(251,191,36,.08),rgba(234,88,12,.06),rgba(180,120,60,.04))", color: "#fff7ed", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "soft", mood: "warm", category: "Seasonal", tags: ["thanksgiving", "harvest", "autumn"] },
  { id: "seasonal-new-year", name: "New Year", bg: "#0a0a2e", gradient: "radial-gradient(ellipse at 50% 30%,rgba(253,224,71,.08),rgba(148,163,184,.04),#0a0a2e 85%)", color: "#fefce8", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "modern", category: "Seasonal", tags: ["new year", "fresh", "start"] },
  { id: "seasonal-summer-praise", name: "Summer Praise", bg: "#0a1a1a", gradient: "radial-gradient(ellipse at 50% 30%,rgba(103,232,249,.06),rgba(251,191,36,.04),#0a1a1a 85%)", color: "#ecfeff", fontEn: "Montserrat", fontTa: "Catamaran", weight: 500, shadow: "soft", mood: "vibrant", category: "Seasonal", tags: ["summer", "praise", "bright"] },
];

/* ── Events ── */
const EVENTS_THEMES: BuildOpts[] = [
  { id: "events-youth-rally", name: "Youth Rally", bg: "#0a0a2e", gradient: "linear-gradient(135deg,rgba(59,130,246,.1),rgba(16,185,129,.06),rgba(139,92,246,.04))", color: "#e0e7ff", fontEn: "Montserrat", fontTa: "Catamaran", weight: 700, shadow: "soft", mood: "vibrant", category: "Events", tags: ["youth", "rally", "vibrant"] },
  { id: "events-conference", name: "Conference", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(99,102,241,.06),transparent 60%),linear-gradient(180deg,#0a0a1a,#050510)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 600, shadow: "deep", mood: "modern", category: "Events", tags: ["conference", "event", "modern"] },
  { id: "events-camp-meeting", name: "Camp Meeting", bg: "#0a1a0a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(34,197,94,.04),rgba(22,163,74,.03),#0a1a0a 85%)", color: "#ecfdf5", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "earthy", category: "Events", tags: ["camp", "outdoor", "nature"] },
  { id: "events-revival", name: "Revival", bg: "#0a0000", gradient: "radial-gradient(ellipse at 50% 60%,rgba(239,68,68,.1),rgba(251,146,60,.06),transparent 60%),linear-gradient(180deg,#1a0202,#0a0000)", color: "#fef2f2", fontEn: "Montserrat", fontTa: "Catamaran", weight: 700, shadow: "deep", mood: "vibrant", category: "Events", tags: ["revival", "fire", "passion"] },
  { id: "events-wedding", name: "Wedding", bg: "#1a1a2e", gradient: "radial-gradient(ellipse at 50% 30%,rgba(253,224,71,.08),rgba(255,255,255,.04),#1a1a2e 85%)", color: "#fefce8", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "warm", category: "Events", tags: ["wedding", "gold", "elegant"] },
  { id: "events-baptism", name: "Baptism", bg: "#0a1420", gradient: "radial-gradient(ellipse at 50% 40%,rgba(147,197,253,.06),rgba(59,130,246,.03),#0a1420 85%)", color: "#e0f2fe", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "serene", category: "Events", tags: ["baptism", "water", "clean"] },
  { id: "events-communion", name: "Communion", bg: "#0a0505", gradient: "radial-gradient(ellipse at 50% 40%,rgba(220,38,38,.06),rgba(251,191,36,.03),#0a0505 85%)", color: "#fef2f2", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Events", tags: ["communion", "sacrament", "red"] },
  { id: "events-memorial", name: "Memorial", bg: "#0a0a14", gradient: "linear-gradient(180deg,rgba(148,163,184,.04),#0a0a14)", color: "#e2e8f0", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "gentle", category: "Events", tags: ["memorial", "remembrance", "gentle"] },
  { id: "events-ordination", name: "Ordination", bg: "#0a0014", gradient: "radial-gradient(ellipse at 50% 30%,rgba(147,51,234,.08),rgba(251,191,36,.04),#0a0014 85%)", color: "#f3e8ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "dramatic", category: "Events", tags: ["ordination", "calling", "purple"] },
  { id: "events-mission", name: "Mission", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(251,191,36,.04),rgba(59,130,246,.03),#0a0a1a 85%)", color: "#f0f4ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "modern", category: "Events", tags: ["mission", "global", "world"] },
];

/* ── Modern ── */
const MODERN_THEMES: BuildOpts[] = [
  { id: "modern-glass-worship", name: "Glass Worship", bg: "#0a0a1a", gradient: "linear-gradient(135deg,rgba(148,163,184,.06),rgba(99,102,241,.04),rgba(167,139,250,.03),#0a0a1a)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "modern", category: "Modern", tags: ["glass", "frosted", "modern"] },
  { id: "modern-edge", name: "Edge", bg: "#050505", gradient: "linear-gradient(135deg,#0a0a1a,#050505,#0a0a0a)", color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 600, shadow: "deep", mood: "dark", category: "Modern", tags: ["edge", "sharp", "dark"] },
  { id: "modern-monochrome", name: "Monochrome", bg: "#050505", gradient: "linear-gradient(180deg,rgba(148,163,184,.04),#050505)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "dark", category: "Modern", tags: ["monochrome", "black", "white"] },
  { id: "modern-monochrome-light", name: "Monochrome Light", bg: "#f8fafc", gradient: "linear-gradient(180deg,rgba(148,163,184,.08),#f8fafc)", color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "none", mood: "light", category: "Modern", tags: ["monochrome", "light", "clean"] },
  { id: "modern-premium-dark", name: "Premium Dark", bg: "#000000", gradient: "radial-gradient(ellipse at 50% 30%,rgba(148,163,184,.04),transparent 70%),linear-gradient(180deg,#050505,#000000)", color: "#f8fafc", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "dark", category: "Modern", tags: ["premium", "dark", "luxury"] },
  { id: "modern-premium-light", name: "Premium Light", bg: "#fafafa", gradient: "radial-gradient(ellipse at 50% 30%,rgba(99,102,241,.04),transparent 70%),linear-gradient(180deg,#ffffff,#f0f0f0)", color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "none", mood: "light", category: "Modern", tags: ["premium", "light", "clean"] },
  { id: "modern-luxury", name: "Luxury", bg: "#050302", gradient: "radial-gradient(ellipse at 50% 30%,rgba(251,191,36,.08),transparent 60%),linear-gradient(180deg,#0a0604,#050302)", color: "#fef3c7", fontEn: "Playfair Display", fontTa: "Noto Serif Tamil", weight: 500, shadow: "deep", mood: "luxury", category: "Modern", tags: ["luxury", "gold", "premium"] },
  { id: "modern-sleek", name: "Sleek", bg: "#050508", gradient: "linear-gradient(135deg,rgba(99,102,241,.04),rgba(139,92,246,.03),#050508)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "modern", category: "Modern", tags: ["sleek", "tech", "modern"] },
  { id: "modern-contemporary", name: "Contemporary", bg: "#0a0a1a", gradient: "linear-gradient(180deg,rgba(59,130,246,.06),#0a0a1a)", color: "#e0e7ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "modern", category: "Modern", tags: ["contemporary", "blue", "clean"] },
  { id: "modern-urban", name: "Urban", bg: "#0a0a0a", gradient: "linear-gradient(180deg,rgba(148,163,184,.04),#0a0a0a)", color: "#e2e8f0", fontEn: "Montserrat", fontTa: "Catamaran", weight: 600, shadow: "deep", mood: "dark", category: "Modern", tags: ["urban", "city", "modern"] },
  { id: "modern-minimalist", name: "Minimalist", bg: "#fafafa", gradient: "linear-gradient(180deg,#ffffff,#f5f5f5)", color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "none", mood: "light", category: "Modern", tags: ["minimalist", "clean", "simple"] },
  { id: "modern-pure-white", name: "Pure White", bg: "#ffffff", gradient: "radial-gradient(ellipse at 50% 30%,rgba(148,163,184,.03),transparent 70%)", color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "none", mood: "light", category: "Modern", tags: ["pure", "white", "clean"] },
  { id: "modern-deep-black", name: "Deep Black", bg: "#000000", gradient: "radial-gradient(ellipse at 50% 30%,rgba(148,163,184,.02),transparent 60%)", color: "#f8fafc", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "dark", category: "Modern", tags: ["deep", "black", "pure"] },
  { id: "modern-charcoal", name: "Charcoal", bg: "#0a0a0a", gradient: "linear-gradient(180deg,#141414,#0a0a0a,#050505)", color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "dark", category: "Modern", tags: ["charcoal", "gray", "dark"] },
  { id: "modern-slate", name: "Slate", bg: "#0a0a14", gradient: "linear-gradient(180deg,rgba(148,163,184,.04),#0a0a14)", color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "cool", category: "Modern", tags: ["slate", "blue-gray", "modern"] },
];

/* ── Minimal ── */
const MINIMAL_THEMES: BuildOpts[] = [
  { id: "minimal-black", name: "Minimal Black", bg: "#000000", color: "#ffffff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "soft", mood: "dark", category: "Minimal", tags: ["black", "minimal", "clean"] },
  { id: "minimal-white", name: "Minimal White", bg: "#ffffff", color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "none", mood: "light", category: "Minimal", tags: ["white", "minimal", "clean"] },
  { id: "minimal-warm-gray", name: "Warm Minimal", bg: "#1a1410", gradient: "linear-gradient(180deg,#1a1410,#14100a)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "warm", category: "Minimal", tags: ["warm", "gray", "minimal"] },
  { id: "minimal-cool-gray", name: "Cool Minimal", bg: "#0a0a14", gradient: "linear-gradient(180deg,#0a0a14,#050510)", color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "cool", category: "Minimal", tags: ["cool", "gray", "minimal"] },
  { id: "minimal-soft-gray", name: "Soft Gray", bg: "#141414", gradient: "radial-gradient(ellipse at 50% 30%,rgba(148,163,184,.03),#141414)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "dark", category: "Minimal", tags: ["soft", "gray", "subtle"] },
  { id: "minimal-warm-cream", name: "Warm Cream", bg: "#f5f0e8", gradient: "radial-gradient(ellipse at 50% 30%,rgba(251,191,36,.03),#f5f0e8)", color: "#1a1410", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "none", mood: "warm", category: "Minimal", tags: ["cream", "warm", "soft"] },
  { id: "minimal-frost", name: "Frost", bg: "#0a1420", gradient: "linear-gradient(180deg,rgba(147,197,253,.04),#0a1420)", color: "#e0f2fe", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "cool", category: "Minimal", tags: ["frost", "cold", "blue"] },
  { id: "minimal-shadow", name: "Shadow", bg: "#050505", gradient: "radial-gradient(ellipse at 50% 60%,rgba(0,0,0,.2),#050505)", color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 300, shadow: "deep", mood: "dark", category: "Minimal", tags: ["shadow", "dark", "depth"] },
  { id: "minimal-airy", name: "Airy", bg: "#f0f4f8", gradient: "linear-gradient(180deg,#f8fafc,#f0f4f8)", color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "none", mood: "light", category: "Minimal", tags: ["airy", "light", "open"] },
  { id: "minimal-pure", name: "Pure", bg: "#fafafa", color: "#1a1a1a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "none", mood: "light", category: "Minimal", tags: ["pure", "clean", "simple"] },
  { id: "minimal-subtle", name: "Subtle", bg: "#0a0a0a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.02),#0a0a0a)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 300, shadow: "deep", mood: "dark", category: "Minimal", tags: ["subtle", "dark", "soft"] },
  { id: "minimal-clean", name: "Clean", bg: "#ffffff", color: "#0f172a", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "none", mood: "light", category: "Minimal", tags: ["clean", "white", "modern"] },
];

/* ── Specialty ── */
const SPECIALTY_THEMES: BuildOpts[] = [
  { id: "specialty-high-contrast-black", name: "High Contrast Black", bg: "#000000", color: "#ffffff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 700, shadow: "none", mood: "dark", category: "Specialty", tags: ["high contrast", "accessible", "bold"] },
  { id: "specialty-high-contrast-white", name: "High Contrast White", bg: "#ffffff", color: "#000000", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 700, shadow: "none", mood: "light", category: "Specialty", tags: ["high contrast", "accessible", "bold"] },
  { id: "specialty-large-print", name: "Large Print", bg: "#050505", color: "#ffffff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 700, shadow: "deep", mood: "dark", category: "Specialty", tags: ["large print", "readable", "big"] },
  { id: "specialty-accessible", name: "Accessible", bg: "#0a0a1a", color: "#f0f4ff", fontEn: "Open Sans", fontTa: "Noto Sans Tamil", weight: 600, shadow: "deep", mood: "cool", category: "Specialty", tags: ["accessible", "wcag", "readable"] },
  { id: "specialty-dark-mode", name: "Dark Mode", bg: "#000000", gradient: "radial-gradient(ellipse at 50% 30%,rgba(99,102,241,.03),#000000)", color: "#e2e8f0", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 400, shadow: "deep", mood: "dark", category: "Specialty", tags: ["dark mode", "eye-friendly"] },
  { id: "specialty-outdoor", name: "Outdoor Bright", bg: "#f0f4f8", color: "#0f172a", fontEn: "Montserrat", fontTa: "Catamaran", weight: 700, shadow: "none", mood: "light", category: "Specialty", tags: ["outdoor", "bright", "sunlight"] },
  { id: "specialty-projector", name: "Projector Optimized", bg: "#050505", color: "#ffffff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 600, shadow: "deep", mood: "dark", category: "Specialty", tags: ["projector", "optimized", "clear"] },
  { id: "specialty-stream", name: "Stream Ready", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 50% 40%,rgba(99,102,241,.04),#0a0a1a)", color: "#f0f4ff", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 500, shadow: "deep", mood: "modern", category: "Specialty", tags: ["stream", "broadcast", "video"] },
  { id: "specialty-broadcast", name: "Broadcast", bg: "#0a0a0a", gradient: "linear-gradient(180deg,rgba(59,130,246,.04),#0a0a0a)", color: "#f1f5f9", fontEn: "Inter", fontTa: "Noto Sans Tamil", weight: 600, shadow: "deep", mood: "modern", category: "Specialty", tags: ["broadcast", "tv", "professional"] },
  { id: "specialty-dawn-light", name: "Dawn Light", bg: "#f5f0e8", gradient: "linear-gradient(135deg,rgba(251,146,60,.04),rgba(253,224,71,.03),#f5f0e8)", color: "#1a1410", fontEn: "Lora", fontTa: "Noto Serif Tamil", weight: 400, shadow: "none", mood: "warm", category: "Specialty", tags: ["dawn", "light", "morning"] },
  { id: "specialty-evening-calm", name: "Evening Calm", bg: "#0a0a1a", gradient: "linear-gradient(180deg,rgba(147,51,234,.04),rgba(30,27,75,.03),#0a0a1a)", color: "#f3e8ff", fontEn: "Cormorant Garamond", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "serene", category: "Specialty", tags: ["evening", "calm", "sunset"] },
  { id: "specialty-vintage", name: "Vintage Worship", bg: "#1a1410", gradient: "linear-gradient(135deg,#2a2018,#1a1410,#0a0806)", color: "#fef3c7", fontEn: "Georgia", fontTa: "Noto Serif Tamil", weight: 400, shadow: "deep", mood: "classic", category: "Specialty", tags: ["vintage", "classic", "warm"] },
];

const ALL_THEMES: BuildOpts[] = [
  ...WORSHIP_ROYAL,
  ...WORSHIP_CATHEDRAL,
  ...WORSHIP_CONTEMPORARY,
  ...WORSHIP_TRADITIONAL,
  ...WORSHIP_SACRED,
  ...BIBLE_THEMES,
  ...PRAYER_THEMES,
  ...SEASONAL_THEMES,
  ...EVENTS_THEMES,
  ...MODERN_THEMES,
  ...MINIMAL_THEMES,
  ...SPECIALTY_THEMES,
];

export const TEMPLATE_PRESETS: TemplatePreset[] = ALL_THEMES.map(build);
