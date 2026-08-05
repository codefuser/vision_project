import { create } from "zustand";
import { DEFAULT_SETTINGS, type AppSettings } from "@/db/schema";
import { getSettings, saveSettings } from "@/db/repo";
import { useTextFormat } from "@/lib/text-format/store";
import { useBackground } from "@/stores/background.store";
import { useLogo } from "@/stores/logo.store";
import { applyTemplate } from "@/lib/templates/apply";

interface SettingsStore {
  settings: AppSettings;
  loaded: boolean;
  load: () => Promise<void>;
  update: (patch: Partial<AppSettings>) => Promise<void>;
}

export const useSettings = create<SettingsStore>((set) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  load: async () => {
    const s = await getSettings();
    set({ settings: s, loaded: true });
    applyTheme(s.theme);
  },
  update: async (patch) => {
    const next = await saveSettings(patch);
    set({ settings: next });
    if (patch.theme) applyTheme(next.theme);
    applySettingsEffects(next, patch);
  },
}));

export function applyTheme(mode: AppSettings["theme"]) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const dark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
}

/* ═══════════════════════════════════════════════════════════════════
   Effect sync — every setting below immediately drives the running
   application (projection engine, preview, theme, logo, motion).
   The text-format store broadcasts to the projector + Live Preview so
   changes appear instantly with zero reload.
   ═══════════════════════════════════════════════════════════════════ */

const TYPOGRAPHY_KEYS = new Set<keyof AppSettings>([
  "tamilFont",
  "englishFont",
  "referenceFont",
  "fontSize",
  "fontWeight",
  "lineSpacing",
  "letterSpacing",
  "textWidth",
  "textAlign",
  "verticalAlign",
  "shadowEnabled",
  "shadowBlur",
  "shadowOpacity",
  "outlineEnabled",
  "outlineWidth",
  "outlineColor",
  "textOpacity",
  "referenceOpacity",
]);

/** Map settings typography values onto the shared projection style model. */
function buildTypographyPatch(s: AppSettings) {
  return {
    fontSizeVw: s.fontSize / 19.2, // px → % of the 1920px design stage
    fontWeight: s.fontWeight,
    lineHeight: s.lineSpacing,
    letterSpacing: s.letterSpacing,
    paddingVw: (100 - s.textWidth) / 2,
    align: s.textAlign,
    vAlign: s.verticalAlign,
    shadow: s.shadowEnabled,
    shadowBlur: s.shadowBlur,
    shadowOpacity: s.shadowOpacity / 100,
    outlineWidth: s.outlineEnabled ? s.outlineWidth : 0,
    outlineColor: s.outlineColor,
    textOpacity: s.textOpacity / 100,
  };
}

function applySettingsEffects(next: AppSettings, patch: Partial<AppSettings>) {
  const patchKeys = Object.keys(patch) as Array<keyof AppSettings>;

  // ── Typography → live projection style (reference / tamil / english) ──
  if (patchKeys.some((k) => TYPOGRAPHY_KEYS.has(k))) {
    const tf = useTextFormat.getState();
    const base = buildTypographyPatch(next);
    tf.setGroups({
      reference: {
        ...tf.groups.reference,
        ...base,
        fontFamily: next.referenceFont,
        textOpacity: next.referenceOpacity / 100,
      },
      tamil: { ...tf.groups.tamil, ...base, fontFamily: next.tamilFont },
      english: { ...tf.groups.english, ...base, fontFamily: next.englishFont },
      background: tf.groups.background,
    });
  }

  // ── Projected background ──
  if (patchKeys.includes("backgroundOpacity")) {
    useTextFormat.getState().setBackground({ opacity: next.backgroundOpacity / 100 });
  }
  if (patchKeys.includes("defaultBackground")) {
    useTextFormat.getState().setBackground({ color: next.defaultBackground });
  }

  // ── Animated theme backgrounds → master motion toggle ──
  if (patchKeys.includes("animatedThemesEnabled")) {
    useBackground.getState().set("motionEnabled", next.animatedThemesEnabled);
  }

  // ── Default theme → applies the preset to projected styling ──
  if (patchKeys.includes("defaultThemeId") && next.defaultThemeId) {
    applyTemplate(next.defaultThemeId);
  }

  // ── Logo overlay master ──
  if (patchKeys.includes("logoScreen")) {
    useLogo.getState().setEnabled(next.logoScreen);
  }
}
