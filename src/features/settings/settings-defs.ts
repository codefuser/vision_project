import type { AppSettings } from "@/db/schema";
import {
  Settings,
  MonitorPlay,
  Type,
  Sparkles,
  Keyboard,
  Download,
  Info,
  type LucideIcon,
} from "lucide-react";
import { FONT_OPTIONS } from "@/lib/fonts";
import { TEMPLATE_PRESETS } from "@/lib/templates/presets";

export interface SettingDef {
  key: keyof AppSettings;
  title: string;
  description: string;
  keywords: string[];
  type: "toggle" | "slider" | "select" | "input" | "color" | "number";
  category: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  /** Transform the stored setting value into the slider's display range. */
  mapFromSetting?: (v: number) => number;
  /** Transform the slider's display value back into the stored setting. */
  mapToSetting?: (v: number) => number;
}

const FONT_OPTIONS_TS = FONT_OPTIONS as { value: string; label: string }[];

const THEME_OPTIONS = TEMPLATE_PRESETS.map((t) => ({ value: t.id, label: t.name })).sort(
  (a, b) => a.label.localeCompare(b.label),
);

const ALL: SettingDef[] = [
  // ════════════════ General ════════════════
  {
    key: "theme",
    title: "Theme",
    description: "Switch between light, dark, or system theme instantly",
    keywords: ["dark mode", "light mode", "system", "appearance", "night", "day", "interface"],
    type: "select",
    category: "general",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ],
  },
  {
    key: "defaultStartupPage",
    title: "Startup Page",
    description: "Page shown when the application launches (applied on next launch)",
    keywords: ["start", "home", "landing", "default", "launch", "welcome"],
    type: "select",
    category: "general",
    options: [
      { value: "library", label: "Library" },
      { value: "project", label: "Project" },
      { value: "playlists", label: "Playlists" },
      { value: "settings", label: "Settings" },
    ],
  },
  {
    key: "autoSave",
    title: "Auto Save",
    description: "Automatically record formatting changes to the undo history as you work",
    keywords: ["save", "auto", "persist", "automatic", "backup"],
    type: "toggle",
    category: "general",
  },

  // ════════════════ Projection ════════════════
  {
    key: "defaultBackground",
    title: "Default Background",
    description: "Background color used for projected output (applies instantly)",
    keywords: ["background", "color", "default", "empty", "idle", "black", "bg"],
    type: "color",
    category: "projection",
  },
  {
    key: "projectionScaling",
    title: "Projection Scaling",
    description: "How content is scaled to fill the connected display. Auto (Fit) is recommended for all screen types.",
    keywords: ["scaling", "aspect ratio", "letterbox", "pillarbox", "fit", "fill", "stretch", "original", "bars", "display", "tv", "projector", "widescreen", "4:3", "adapt"],
    type: "select",
    category: "projection",
    options: [
      { value: "auto", label: "Auto (Recommended) — Fit with black bars" },
      { value: "fit", label: "Fit — Letterbox / pillarbox (black bars)" },
      { value: "fill", label: "Fill — Crop to fill, no bars" },
      { value: "stretch", label: "Stretch — Distort to fill screen" },
      { value: "original", label: "Original Size — No scaling" },
    ],
  },
  {
    key: "logoScreen",
    title: "Logo Overlay",
    description: "Show the logo overlay on projected output (enables the logo layer)",
    keywords: ["logo", "brand", "overlay", "idle", "watermark", "splash"],
    type: "toggle",
    category: "projection",
  },
  {
    key: "defaultVolume",
    title: "Default Volume",
    description: "Startup volume for projected media (applied when the projector opens)",
    keywords: ["volume", "sound", "audio", "default", "level", "gain"],
    type: "slider",
    category: "projection",
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
    mapFromSetting: (v) => v * 100,
    mapToSetting: (v) => v / 100,
  },
  {
    key: "muteOnStart",
    title: "Mute On Start",
    description: "Start projected media muted (applied when the projector opens)",
    keywords: ["mute", "muted", "silent", "start", "audio", "volume"],
    type: "toggle",
    category: "projection",
  },

  // ════════════════ Typography ════════════════
  {
    key: "tamilFont",
    title: "Tamil Font",
    description: "Font family for Tamil projected text (applies instantly)",
    keywords: ["tamil", "font", "tamil font", "tamil text", "language", "typeface"],
    type: "select",
    category: "typography",
    options: FONT_OPTIONS_TS,
  },
  {
    key: "englishFont",
    title: "English Font",
    description: "Font family for English projected text (applies instantly)",
    keywords: ["english", "font", "english font", "latin", "text", "typeface"],
    type: "select",
    category: "typography",
    options: FONT_OPTIONS_TS,
  },
  {
    key: "referenceFont",
    title: "Reference Font",
    description: "Font family for Bible reference and verse numbers (applies instantly)",
    keywords: ["reference", "font", "bible", "verse", "citation", "typeface"],
    type: "select",
    category: "typography",
    options: FONT_OPTIONS_TS,
  },
  {
    key: "fontSize",
    title: "Font Size",
    description: "Size of projected text in pixels (applies instantly)",
    keywords: ["font", "size", "text", "scale", "large", "small"],
    type: "slider",
    category: "typography",
    min: 12,
    max: 200,
    step: 1,
    unit: "px",
  },
  {
    key: "fontWeight",
    title: "Font Weight",
    description: "Thickness of text characters (applies instantly)",
    keywords: ["font", "weight", "bold", "thickness", "light", "medium", "heavy"],
    type: "slider",
    category: "typography",
    min: 300,
    max: 900,
    step: 100,
  },
  {
    key: "lineSpacing",
    title: "Line Height",
    description: "Vertical space between lines of text (applies instantly)",
    keywords: ["line", "spacing", "height", "leading", "vertical", "gap"],
    type: "slider",
    category: "typography",
    min: 1,
    max: 3,
    step: 0.1,
  },
  {
    key: "letterSpacing",
    title: "Letter Spacing",
    description: "Space between characters in pixels (applies instantly)",
    keywords: ["letter", "spacing", "tracking", "kerning", "character", "width"],
    type: "slider",
    category: "typography",
    min: -2,
    max: 8,
    step: 0.5,
    unit: "px",
  },
  {
    key: "textWidth",
    title: "Text Width",
    description: "Maximum width of text as percentage of screen (applies instantly)",
    keywords: ["width", "text", "content", "container", "area", "wide"],
    type: "slider",
    category: "typography",
    min: 30,
    max: 100,
    step: 5,
    unit: "%",
  },
  {
    key: "textAlign",
    title: "Horizontal Alignment",
    description: "Horizontal alignment of projected text (applies instantly)",
    keywords: ["align", "left", "center", "right", "text", "horizontal"],
    type: "select",
    category: "typography",
    options: [
      { value: "left", label: "Left" },
      { value: "center", label: "Center" },
      { value: "right", label: "Right" },
    ],
  },
  {
    key: "verticalAlign",
    title: "Vertical Alignment",
    description: "Vertical alignment of text on screen (applies instantly)",
    keywords: ["vertical", "align", "top", "middle", "bottom", "center"],
    type: "select",
    category: "typography",
    options: [
      { value: "top", label: "Top" },
      { value: "middle", label: "Middle" },
      { value: "bottom", label: "Bottom" },
    ],
  },
  {
    key: "shadowEnabled",
    title: "Shadow",
    description: "Add a drop shadow behind text for readability (applies instantly)",
    keywords: ["shadow", "text", "drop", "depth", "effect", "readability"],
    type: "toggle",
    category: "typography",
  },
  {
    key: "shadowBlur",
    title: "Shadow Blur",
    description: "Softness of the text shadow (applies instantly)",
    keywords: ["shadow", "blur", "softness", "spread", "radius"],
    type: "slider",
    category: "typography",
    min: 0,
    max: 20,
    step: 0.5,
    unit: "px",
  },
  {
    key: "shadowOpacity",
    title: "Shadow Opacity",
    description: "Strength of the text shadow (applies instantly)",
    keywords: ["shadow", "opacity", "strength", "alpha", "transparency"],
    type: "slider",
    category: "typography",
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
  },
  {
    key: "outlineEnabled",
    title: "Outline",
    description: "Add an outline stroke around text characters (applies instantly)",
    keywords: ["outline", "stroke", "border", "text", "edge", "contour"],
    type: "toggle",
    category: "typography",
  },
  {
    key: "outlineWidth",
    title: "Outline Width",
    description: "Thickness of the text outline in pixels (applies instantly)",
    keywords: ["outline", "width", "stroke", "thickness", "border"],
    type: "slider",
    category: "typography",
    min: 0,
    max: 10,
    step: 0.5,
    unit: "px",
  },
  {
    key: "outlineColor",
    title: "Outline Color",
    description: "Color of the text outline stroke (applies instantly)",
    keywords: ["outline", "color", "stroke", "border", "edge"],
    type: "color",
    category: "typography",
  },
  {
    key: "textOpacity",
    title: "Text Opacity",
    description: "Opacity of projected text (applies instantly)",
    keywords: ["text", "opacity", "transparency", "alpha", "fade"],
    type: "slider",
    category: "typography",
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
  },
  {
    key: "referenceOpacity",
    title: "Reference Opacity",
    description: "Opacity of Bible reference text (applies instantly)",
    keywords: ["reference", "opacity", "verse", "citation", "bible", "alpha"],
    type: "slider",
    category: "typography",
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
  },

  // ════════════════ Theme Presets & Styling ════════════════
  {
    key: "defaultThemeId",
    title: "Default Theme",
    description: "Theme preset applied to projected text styling (applies instantly)",
    keywords: ["theme", "default", "template", "preset", "style", "background"],
    type: "select",
    category: "theme",
    options: THEME_OPTIONS,
  },
  {
    key: "animatedThemesEnabled",
    title: "Animated Backgrounds",
    description: "Enable motion effects in theme backgrounds (applies instantly)",
    keywords: ["animated", "theme", "animation", "motion", "background", "dynamic"],
    type: "toggle",
    category: "theme",
  },
  {
    key: "backgroundOpacity",
    title: "Background Opacity",
    description: "Opacity level of the projected background (applies instantly)",
    keywords: ["background", "opacity", "transparency", "alpha", "theme"],
    type: "slider",
    category: "theme",
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
  },

  // ════════════════ Backup & Restore ════════════════
  {
    key: "automaticBackup",
    title: "Automatic Backup",
    description: "Create periodic backups automatically while the app is open",
    keywords: ["backup", "auto", "automatic", "scheduled", "periodic"],
    type: "toggle",
    category: "backup",
  },
  {
    key: "backupInterval",
    title: "Backup Interval",
    description: "Hours between automatic backups",
    keywords: ["backup", "interval", "hours", "frequency", "period"],
    type: "number",
    category: "backup",
    min: 1,
    max: 168,
    unit: "h",
  },
];

export const SETTINGS: SettingDef[] = ALL;
export const CATEGORIES: string[] = [...new Set(ALL.map((s) => s.category))];

export const CATEGORY_META: Record<string, { title: string; icon: LucideIcon }> = {
  general: { title: "General", icon: Settings },
  projection: { title: "Projection", icon: MonitorPlay },
  typography: { title: "Typography", icon: Type },
  theme: { title: "Theme", icon: Sparkles },
  "keyboard-shortcuts": { title: "Keyboard Shortcuts", icon: Keyboard },
  backup: { title: "Backup & Restore", icon: Download },
  about: { title: "About", icon: Info },
};


