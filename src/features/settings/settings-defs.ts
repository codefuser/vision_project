import type { AppSettings } from "@/db/schema";
import {
  Settings, MonitorPlay, Type, Sparkles, BookOpen, Music,
  Image, Wifi, Download, Keyboard, type LucideIcon,
} from "lucide-react";

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
}

const ALL: SettingDef[] = [
  // ════════════════ General ════════════════
  { key: "theme", title: "Theme", description: "Switch between light, dark, or system theme", keywords: ["dark mode", "light mode", "system", "appearance", "night", "day", "interface"], type: "select", category: "general", options: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "system", label: "System" }] },
  { key: "language", title: "Language", description: "UI display language for the application", keywords: ["locale", "i18n", "region", "translation"], type: "select", category: "general", options: [{ value: "en", label: "English" }] },
  { key: "defaultStartupPage", title: "Startup Page", description: "Page shown when the application launches", keywords: ["start", "home", "landing", "default", "launch", "welcome"], type: "select", category: "general", options: [{ value: "library", label: "Library" }, { value: "project", label: "Project" }, { value: "playlists", label: "Playlists" }, { value: "settings", label: "Settings" }] },
  { key: "startupBehavior", title: "Restore Last Session", description: "Reopen the previous workspace on launch", keywords: ["restore", "session", "launch", "startup", "remember", "previous"], type: "toggle", category: "general" },
  { key: "autoSave", title: "Auto Save", description: "Automatically save changes as you work", keywords: ["save", "auto", "persist", "automatic", "backup"], type: "toggle", category: "general" },

  // ════════════════ Projection ════════════════
  { key: "defaultDisplay", title: "Default Display", description: "Name or identifier of the output display", keywords: ["display", "monitor", "screen", "output", "projector"], type: "input", category: "projection", placeholder: "default" },
  { key: "projectorResolution", title: "Resolution", description: "Output resolution for the projector window", keywords: ["resolution", "display", "output", "screen", "monitor", "4k", "1080p", "hd"], type: "select", category: "projection", options: [{ value: "1920x1080", label: "1920 × 1080 (Full HD)" }, { value: "3840x2160", label: "3840 × 2160 (4K)" }, { value: "1280x720", label: "1280 × 720 (HD)" }, { value: "1024x768", label: "1024 × 768 (XGA)" }] },
  { key: "aspectRatio", title: "Aspect Ratio", description: "Display aspect ratio for projection output", keywords: ["aspect", "ratio", "16:9", "4:3", "widescreen", "screen"], type: "select", category: "projection", options: [{ value: "16:9", label: "16:9 (Widescreen)" }, { value: "4:3", label: "4:3 (Standard)" }, { value: "16:10", label: "16:10 (Wide)" }, { value: "21:9", label: "21:9 (Ultrawide)" }] },
  { key: "defaultTransition", title: "Transition", description: "Default transition effect between projected items", keywords: ["transition", "effect", "animation", "crossfade", "fade", "zoom", "dissolve", "slide"], type: "select", category: "projection", options: [{ value: "fade", label: "Fade" }, { value: "crossfade", label: "Crossfade" }, { value: "zoom", label: "Zoom" }, { value: "dissolve", label: "Dissolve" }, { value: "none", label: "None" }] },
  { key: "transitionDuration", title: "Transition Duration", description: "Duration of transitions between items in milliseconds", keywords: ["transition", "duration", "speed", "animation", "time", "crossfade"], type: "slider", category: "projection", min: 100, max: 3000, step: 100, unit: "ms" },
  { key: "fadeDurationMs", title: "Fade Duration", description: "Duration of crossfade between items in milliseconds", keywords: ["fade", "crossfade", "duration", "speed", "transition", "animation"], type: "number", category: "projection", min: 100, max: 5000, step: 100, unit: "ms" },
  { key: "defaultBackground", title: "Default Background", description: "Background color shown when no content is projected", keywords: ["background", "color", "default", "empty", "idle", "black", "bg"], type: "color", category: "projection" },
  { key: "blackScreen", title: "Black Screen", description: "Show a black screen between projected items", keywords: ["black", "screen", "blank", "between", "gap", "interval"], type: "toggle", category: "projection" },
  { key: "logoScreen", title: "Logo Screen", description: "Show logo when no content is projected", keywords: ["logo", "brand", "idle", "empty", "placeholder", "splash"], type: "toggle", category: "projection" },
  { key: "countdownSeconds", title: "Countdown Duration", description: "Default timer duration in seconds", keywords: ["countdown", "timer", "seconds", "count", "clock", "duration"], type: "number", category: "projection", min: 3, max: 300, unit: "s" },
  { key: "safeMargins", title: "Safe Margins", description: "Safe area boundary as percentage of screen", keywords: ["safe", "margin", "boundary", "padding", "overscan", "border", "area"], type: "slider", category: "projection", min: 0, max: 20, unit: "%" },
  { key: "autoTransition", title: "Auto Transition", description: "Automatically advance to the next item in a playlist", keywords: ["auto", "transition", "advance", "next", "automatic", "play"], type: "toggle", category: "projection" },

  // ════════════════ Text Formatting ════════════════
  { key: "tamilFont", title: "Tamil Font", description: "Font family for Tamil scripture text", keywords: ["tamil", "font", "tamil font", "tamil text", "language", "typeface"], type: "input", category: "text-formatting", placeholder: "Noto Sans Tamil" },
  { key: "englishFont", title: "English Font", description: "Font family for English scripture text", keywords: ["english", "font", "english font", "latin", "text", "typeface"], type: "input", category: "text-formatting", placeholder: "Inter" },
  { key: "referenceFont", title: "Reference Font", description: "Font family for Bible reference and verse numbers", keywords: ["reference", "font", "bible", "verse", "citation", "typeface"], type: "input", category: "text-formatting", placeholder: "Inter" },
  { key: "fontSize", title: "Font Size", description: "Size of projected text in pixels", keywords: ["font", "size", "text", "scale", "large", "small"], type: "slider", category: "text-formatting", min: 12, max: 200, unit: "px" },
  { key: "fontWeight", title: "Font Weight", description: "Thickness of text characters", keywords: ["font", "weight", "bold", "thickness", "light", "medium", "heavy"], type: "slider", category: "text-formatting", min: 300, max: 900, step: 100 },
  { key: "lineSpacing", title: "Line Height", description: "Vertical space between lines of text", keywords: ["line", "spacing", "height", "leading", "vertical", "gap"], type: "slider", category: "text-formatting", min: 1, max: 3, step: 0.1 },
  { key: "letterSpacing", title: "Letter Spacing", description: "Space between characters in pixels", keywords: ["letter", "spacing", "tracking", "kerning", "character", "width"], type: "slider", category: "text-formatting", min: -2, max: 8, step: 0.5, unit: "px" },
  { key: "textWidth", title: "Text Width", description: "Maximum width of text as percentage of screen", keywords: ["width", "text", "content", "container", "area", "wide"], type: "slider", category: "text-formatting", min: 30, max: 100, step: 5, unit: "%" },
  { key: "textAlign", title: "Horizontal Alignment", description: "Horizontal alignment of projected text", keywords: ["align", "left", "center", "right", "text", "horizontal"], type: "select", category: "text-formatting", options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }] },
  { key: "verticalAlign", title: "Vertical Alignment", description: "Vertical alignment of text on screen", keywords: ["vertical", "align", "top", "middle", "bottom", "center"], type: "select", category: "text-formatting", options: [{ value: "top", label: "Top" }, { value: "middle", label: "Middle" }, { value: "bottom", label: "Bottom" }] },
  { key: "shadowEnabled", title: "Shadow", description: "Add a drop shadow behind text for readability", keywords: ["shadow", "text", "drop", "depth", "effect", "readability"], type: "toggle", category: "text-formatting" },
  { key: "shadowBlur", title: "Shadow Blur", description: "Softness of the text shadow", keywords: ["shadow", "blur", "softness", "spread", "radius"], type: "slider", category: "text-formatting", min: 0, max: 20, step: 0.5, unit: "px" },
  { key: "shadowOpacity", title: "Shadow Opacity", description: "Strength of the text shadow", keywords: ["shadow", "opacity", "strength", "alpha", "transparency"], type: "slider", category: "text-formatting", min: 0, max: 100, step: 5, unit: "%" },
  { key: "outlineEnabled", title: "Outline", description: "Add an outline stroke around text characters", keywords: ["outline", "stroke", "border", "text", "edge", "contour"], type: "toggle", category: "text-formatting" },
  { key: "outlineWidth", title: "Outline Width", description: "Thickness of the text outline in pixels", keywords: ["outline", "width", "stroke", "thickness", "border"], type: "slider", category: "text-formatting", min: 0, max: 10, step: 0.5, unit: "px" },
  { key: "outlineColor", title: "Outline Color", description: "Color of the text outline stroke", keywords: ["outline", "color", "stroke", "border", "edge"], type: "color", category: "text-formatting" },
  { key: "glowEnabled", title: "Text Glow", description: "Add a soft glow effect behind text", keywords: ["glow", "neon", "text", "light", "bloom", "radiance"], type: "toggle", category: "text-formatting" },
  { key: "glowColor", title: "Glow Color", description: "Color of the text glow effect", keywords: ["glow", "color", "neon", "light", "bloom", "tint"], type: "color", category: "text-formatting" },
  { key: "textOpacity", title: "Text Opacity", description: "Opacity of projected text", keywords: ["text", "opacity", "transparency", "alpha", "fade"], type: "slider", category: "text-formatting", min: 0, max: 100, step: 5, unit: "%" },
  { key: "referenceOpacity", title: "Reference Opacity", description: "Opacity of Bible reference text", keywords: ["reference", "opacity", "verse", "citation", "bible", "alpha"], type: "slider", category: "text-formatting", min: 0, max: 100, step: 5, unit: "%" },

  // ════════════════ Themes ════════════════
  { key: "defaultThemeId", title: "Default Theme", description: "Theme applied to new projects", keywords: ["theme", "default", "template", "preset", "style"], type: "input", category: "themes", placeholder: "worship-royal-sapphire" },
  { key: "animatedThemesEnabled", title: "Animated Themes", description: "Enable motion effects in theme backgrounds", keywords: ["animated", "theme", "animation", "motion", "background", "dynamic"], type: "toggle", category: "themes" },
  { key: "themeTransitionSpeed", title: "Animation Speed", description: "Speed of theme animations in milliseconds", keywords: ["animation", "speed", "theme", "transition", "duration", "motion"], type: "slider", category: "themes", min: 100, max: 2000, step: 100, unit: "ms" },
  { key: "backgroundOpacity", title: "Background Opacity", description: "Opacity level of the theme background", keywords: ["background", "opacity", "transparency", "alpha", "theme"], type: "slider", category: "themes", min: 0, max: 100, step: 5, unit: "%" },
  { key: "animationPreset", title: "Animation Preset", description: "Visual animation style for the background", keywords: ["animation", "preset", "effect", "particles", "rays", "aurora", "clouds", "mesh", "worship"], type: "select", category: "themes", options: [{ value: "none", label: "None" }, { value: "light-rays", label: "Light Rays" }, { value: "soft-particles", label: "Soft Particles" }, { value: "golden-worship", label: "Golden Worship" }, { value: "blue-nebula", label: "Blue Nebula" }, { value: "aurora", label: "Aurora" }, { value: "floating-dust", label: "Floating Dust" }, { value: "moving-clouds", label: "Moving Clouds" }, { value: "wave-mesh", label: "Wave Mesh" }] },

  // ════════════════ Bible ════════════════
  { key: "defaultTranslation", title: "Default Translation", description: "Primary Bible translation language", keywords: ["bible", "translation", "language", "version", "scripture"], type: "select", category: "bible", options: [{ value: "en", label: "English" }, { value: "ta", label: "Tamil" }] },
  { key: "tamilVersion", title: "Tamil Version", description: "Tamil Bible version identifier", keywords: ["tamil", "bible", "version", "tamil bible", "translation"], type: "input", category: "bible", placeholder: "TCV" },
  { key: "englishVersion", title: "English Version", description: "English Bible version identifier", keywords: ["english", "bible", "version", "kjv", "niv", "esv"], type: "input", category: "bible", placeholder: "KJV" },
  { key: "tamilFirst", title: "Tamil First", description: "Show Tamil text as the primary reference", keywords: ["tamil", "primary", "language", "order", "priority"], type: "toggle", category: "bible" },
  { key: "parallelMode", title: "Parallel Bible", description: "Show English and Tamil translations side by side", keywords: ["parallel", "dual", "side by side", "bilingual", "both"], type: "toggle", category: "bible" },
  { key: "verseNumbering", title: "Verse Numbers", description: "Show verse numbers in scripture display", keywords: ["verse", "number", "reference", "scripture", "chapter"], type: "toggle", category: "bible" },
  { key: "showReference", title: "Show Reference", description: "Display the scripture reference on screen", keywords: ["reference", "verse", "citation", "display", "show"], type: "toggle", category: "bible" },
  { key: "referencePosition", title: "Reference Position", description: "Position of the scripture reference on screen", keywords: ["reference", "position", "top", "bottom", "overlay", "placement"], type: "select", category: "bible", options: [{ value: "bottom", label: "Bottom" }, { value: "top", label: "Top" }, { value: "overlay", label: "Overlay" }] },
  { key: "referenceSize", title: "Reference Size", description: "Font size of the scripture reference in pixels", keywords: ["reference", "size", "font", "verse", "text", "small"], type: "slider", category: "bible", min: 8, max: 48, unit: "px" },
  { key: "verseSplit", title: "Verse Split Mode", description: "How multiple verses are displayed", keywords: ["verse", "split", "single", "range", "chapter", "display"], type: "select", category: "bible", options: [{ value: "single", label: "Single Verse" }, { value: "range", label: "Verse Range" }, { value: "chapter", label: "Full Chapter" }] },
  { key: "verseAnimation", title: "Verse Animation", description: "Animate verse transitions in the display", keywords: ["verse", "animation", "transition", "effect", "bible", "motion"], type: "toggle", category: "bible" },

  // ════════════════ Songs ════════════════
  { key: "defaultSearchMode", title: "Search Mode", description: "Default search method for finding songs", keywords: ["search", "mode", "title", "lyrics", "song"], type: "select", category: "songs", options: [{ value: "title", label: "By Title" }, { value: "lyrics", label: "By Lyrics" }, { value: "both", label: "Title & Lyrics" }] },
  { key: "defaultSorting", title: "Song Sorting", description: "Default sort order for the song library", keywords: ["sort", "order", "song", "list", "arrange", "alphabetical"], type: "select", category: "songs", options: [{ value: "title", label: "Title" }, { value: "recent", label: "Recently Used" }, { value: "created", label: "Date Added" }, { value: "artist", label: "Artist" }] },
  { key: "autoLoadLyrics", title: "Auto Load Lyrics", description: "Automatically load lyrics when a song is selected", keywords: ["lyrics", "auto", "load", "prefetch", "song"], type: "toggle", category: "songs" },

  // ════════════════ Media ════════════════
  { key: "imageDurationMs", title: "Image Duration", description: "Display duration for still images in seconds", keywords: ["image", "duration", "time", "photo", "slide", "seconds"], type: "number", category: "media", min: 1, max: 3600, unit: "s" },
  { key: "videoAutoplay", title: "Autoplay Video", description: "Automatically start video playback when selected", keywords: ["video", "autoplay", "play", "start", "media"], type: "toggle", category: "media" },
  { key: "mediaLoop", title: "Loop Video", description: "Loop video playback continuously", keywords: ["loop", "repeat", "video", "cycle", "continuous"], type: "toggle", category: "media" },
  { key: "imageScaling", title: "Image Scaling", description: "How images fit the screen", keywords: ["image", "scaling", "fit", "fill", "stretch", "tile"], type: "select", category: "media", options: [{ value: "fill", label: "Fill Screen" }, { value: "fit", label: "Fit Within" }, { value: "stretch", label: "Stretch" }, { value: "tile", label: "Tile" }] },
  { key: "videoScaling", title: "Video Scaling", description: "How videos fit the screen", keywords: ["video", "scaling", "fit", "fill", "stretch"], type: "select", category: "media", options: [{ value: "fill", label: "Fill Screen" }, { value: "fit", label: "Fit Within" }, { value: "stretch", label: "Stretch" }] },

  // ════════════════ Remote Control ════════════════
  { key: "remoteEnabled", title: "Enable Remote", description: "Allow remote devices to control presentations", keywords: ["remote", "control", "enable", "network", "device"], type: "toggle", category: "remote-control" },
  { key: "qrCodeEnabled", title: "QR Code", description: "Show a QR code for quick remote connection", keywords: ["qr", "code", "scan", "connect", "remote"], type: "toggle", category: "remote-control" },
  { key: "pinCode", title: "PIN Code", description: "PIN required to connect remotely", keywords: ["pin", "code", "security", "remote", "password"], type: "input", category: "remote-control", placeholder: "Not set" },
  { key: "remoteReconnect", title: "Auto Reconnect", description: "Reconnect automatically if the connection drops", keywords: ["reconnect", "auto", "remote", "connection", "retry"], type: "toggle", category: "remote-control" },

  // ════════════════ Backup ════════════════
  { key: "automaticBackup", title: "Automatic Backup", description: "Create periodic backups automatically", keywords: ["backup", "auto", "automatic", "scheduled", "periodic"], type: "toggle", category: "backup" },
  { key: "backupInterval", title: "Backup Interval", description: "Hours between automatic backups", keywords: ["backup", "interval", "hours", "frequency", "period"], type: "number", category: "backup", min: 1, max: 168, unit: "h" },
];

export const SETTINGS: SettingDef[] = ALL;
export const CATEGORIES: string[] = [...new Set(ALL.map((s) => s.category))];

export const CATEGORY_META: Record<string, { title: string; icon: LucideIcon }> = {
  general: { title: "General", icon: Settings },
  projection: { title: "Projection", icon: MonitorPlay },
  "text-formatting": { title: "Text Formatting", icon: Type },
  themes: { title: "Themes", icon: Sparkles },
  bible: { title: "Bible", icon: BookOpen },
  songs: { title: "Songs", icon: Music },
  media: { title: "Media", icon: Image },
  "remote-control": { title: "Remote Control", icon: Wifi },
  backup: { title: "Backup & Restore", icon: Download },
  "keyboard-shortcuts": { title: "Keyboard Shortcuts", icon: Keyboard },
};
