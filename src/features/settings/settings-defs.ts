import type { AppSettings } from "@/db/schema";
import {
  Settings, Palette, MonitorPlay, Type, Sparkles, BookOpen, Music,
  Image, Search, Zap, Volume2, Video, Keyboard, Wifi, Download,
  HardDrive, Shield, Sliders, Info, type LucideIcon,
} from "lucide-react";

export interface SettingDef {
  key: keyof AppSettings;
  title: string;
  description: string;
  keywords: string[];
  aliases: string[];
  type: "toggle" | "slider" | "select" | "input" | "color" | "number";
  category: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export interface CategoryDef {
  id: string;
  title: string;
  icon: LucideIcon;
  settings: SettingDef[];
}

const ALL: SettingDef[] = [
  // ── General ──
  { key: "theme", title: "Theme", description: "Switch between light, dark, or system theme", keywords: ["dark", "light", "system", "mode", "appearance", "color scheme", "night"], aliases: ["color-theme", "ui-theme"], type: "select", category: "general", options: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "system", label: "System" }] },
  { key: "accentColor", title: "Accent Color", description: "Primary brand color used throughout the interface", keywords: ["primary", "brand", "theme color", "highlight"], aliases: ["primary-color", "brand-color"], type: "color", category: "general" },
  { key: "language", title: "Language", description: "UI display language", keywords: ["locale", "i18n", "region", "translation"], aliases: ["locale", "ui-language"], type: "select", category: "general", options: [{ value: "en", label: "English" }] },
  { key: "autoSave", title: "Auto-Save", description: "Automatically save changes as you work", keywords: ["save", "persist", "automatic", "backup"], aliases: ["autosave", "save-automatically"], type: "toggle", category: "general" },
  { key: "startupBehavior", title: "Startup Behavior", description: "What to show when the application launches", keywords: ["launch", "boot", "start", "restore", "session"], aliases: ["launch-behavior", "on-startup"], type: "select", category: "general", options: [{ value: "restore", label: "Restore Last Session" }, { value: "new", label: "Start Fresh" }, { value: "blank", label: "Blank Workspace" }] },
  { key: "checkUpdates", title: "Check for Updates", description: "Automatically check for new versions on startup", keywords: ["updates", "version", "upgrade", "new release", "auto-update"], aliases: ["auto-update", "update-check"], type: "toggle", category: "general" },
  { key: "autoLaunch", title: "Launch at System Startup", description: "Start the application when your computer boots", keywords: ["boot", "startup", "auto-start", "system", "login"], aliases: ["auto-start", "open-at-login"], type: "toggle", category: "general" },
  { key: "recentProjects", title: "Recent Projects Limit", description: "Number of recent projects to remember", keywords: ["recent", "history", "projects", "limit", "max"], aliases: ["recent-count", "max-recent"], type: "number", category: "general", min: 0, max: 50 },
  { key: "defaultStartupPage", title: "Default Startup Page", description: "Page to show on launch", keywords: ["start", "home", "landing", "default page", "launch"], aliases: ["home-page", "start-page"], type: "select", category: "general", options: [{ value: "library", label: "Library" }, { value: "project", label: "Project" }, { value: "playlists", label: "Playlists" }, { value: "settings", label: "Settings" }] },

  // ── Appearance ──
  { key: "compactMode", title: "Compact Mode", description: "Tighter spacing for more content on screen", keywords: ["density", "spacing", "compact", "tight", "small", "padding"], aliases: ["compact-ui", "dense"], type: "toggle", category: "appearance" },
  { key: "sidebarWidth", title: "Sidebar Width", description: "Width of the navigation sidebar", keywords: ["sidebar", "nav", "panel", "width", "size"], aliases: ["nav-width", "sidebar-size"], type: "slider", category: "appearance", min: 180, max: 320, unit: "px" },
  { key: "uiScale", title: "UI Scale", description: "Scale the entire user interface", keywords: ["zoom", "size", "scaling", "dpi", "magnification", "display"], aliases: ["zoom-level", "display-scale"], type: "slider", category: "appearance", min: 75, max: 150, step: 5, unit: "%" },
  { key: "iconSize", title: "Icon Size", description: "Size of toolbar and navigation icons", keywords: ["icons", "size", "toolbar", "symbols"], aliases: ["icon-scale", "toolbar-icons"], type: "slider", category: "appearance", min: 12, max: 24, unit: "px" },
  { key: "blurEffects", title: "Blur Effects", description: "Enable backdrop blur on modals and panels", keywords: ["blur", "glass", "frosted", "transparency", "effects", "backdrop"], aliases: ["backdrop-blur", "frosted-glass"], type: "toggle", category: "appearance" },
  { key: "glassEffects", title: "Glass Effects", description: "Frosted glass appearance on surfaces", keywords: ["glass", "frosted", "translucent", "transparency", "effects", "acrylic"], aliases: ["acrylic", "mica"], type: "toggle", category: "appearance" },

  // ── Projection ──
  { key: "defaultImageDurationMs", title: "Image Duration", description: "Default duration for still images in seconds", keywords: ["image", "duration", "time", "seconds", "slide", "photo", "display time"], aliases: ["image-time", "slide-duration"], type: "number", category: "projection", min: 1, max: 3600, unit: "s" },
  { key: "defaultTransition", title: "Transition Effect", description: "Default transition between slides", keywords: ["transition", "effect", "animation", "crossfade", "fade", "zoom", "dissolve"], aliases: ["slide-transition", "transition-effect"], type: "select", category: "projection", options: [{ value: "fade", label: "Fade" }, { value: "crossfade", label: "Crossfade" }, { value: "zoom", label: "Zoom" }, { value: "dissolve", label: "Dissolve" }, { value: "none", label: "None" }] },
  { key: "defaultLoopMode", title: "Loop Mode", description: "Default loop behavior for playlists", keywords: ["loop", "repeat", "cycle", "playlist", "continuous", "auto"], aliases: ["repeat-mode", "loop-playlist"], type: "select", category: "projection", options: [{ value: "none", label: "No Loop" }, { value: "single", label: "Loop Single" }, { value: "playlist", label: "Loop Playlist" }] },
  { key: "defaultVolume", title: "Default Volume", description: "Starting volume level for media playback", keywords: ["volume", "sound", "audio", "level", "loudness", "gain"], aliases: ["audio-volume", "sound-level"], type: "slider", category: "projection", min: 0, max: 100, step: 5, unit: "%" },
  { key: "autoplayVideo", title: "Autoplay Videos", description: "Automatically start video playback when selected", keywords: ["video", "autoplay", "play", "media", "auto start"], aliases: ["video-autoplay", "auto-play"], type: "toggle", category: "projection" },
  { key: "muteOnStart", title: "Mute on Start", description: "Start video playback with audio muted", keywords: ["mute", "audio", "sound", "silent", "start", "video"], aliases: ["start-muted", "mute-startup"], type: "toggle", category: "projection" },
  { key: "projectorResolution", title: "Projector Resolution", description: "Output resolution for the projector window", keywords: ["resolution", "display", "output", "screen", "monitor", "4k", "1080p", "hd"], aliases: ["output-resolution", "display-resolution"], type: "select", category: "projection", options: [{ value: "1920x1080", label: "1920 × 1080 (Full HD)" }, { value: "3840x2160", label: "3840 × 2160 (4K)" }, { value: "1280x720", label: "1280 × 720 (HD)" }, { value: "1024x768", label: "1024 × 768 (XGA)" }] },
  { key: "safeMargins", title: "Safe Margins", description: "Safe area boundary as percentage of screen", keywords: ["safe", "margin", "boundary", "padding", "area", "overscan", "border"], aliases: ["safe-area", "action-margins"], type: "slider", category: "projection", min: 0, max: 20, unit: "%" },
  { key: "fadeDurationMs", title: "Fade Duration", description: "Duration of crossfade transitions in milliseconds", keywords: ["fade", "crossfade", "transition", "duration", "speed", "animation"], aliases: ["crossfade-duration", "transition-speed"], type: "number", category: "projection", min: 100, max: 5000, step: 100, unit: "ms" },
  { key: "blackScreen", title: "Black Screen Between Items", description: "Show a black screen briefly between projected items", keywords: ["black", "screen", "blank", "between", "gap", "interval"], aliases: ["blackout", "blank-between"], type: "toggle", category: "projection" },
  { key: "logoScreen", title: "Logo Screen", description: "Show logo when no content is projected", keywords: ["logo", "brand", "idle", "empty", "placeholder"], aliases: ["idle-screen", "brand-screen"], type: "toggle", category: "projection" },
  { key: "freezeScreen", title: "Freeze on Idle", description: "Freeze current display when system is idle", keywords: ["freeze", "idle", "pause", "hold", "screen", "inactive"], aliases: ["idle-freeze", "pause-on-idle"], type: "toggle", category: "projection" },
  { key: "countdownSeconds", title: "Countdown Duration", description: "Default countdown timer duration in seconds", keywords: ["countdown", "timer", "seconds", "count", "clock", "duration"], aliases: ["timer-duration", "countdown-time"], type: "number", category: "projection", min: 3, max: 300, unit: "s" },
  { key: "autoTransition", title: "Auto Transition", description: "Automatically advance to the next item", keywords: ["auto", "transition", "advance", "next", "automatic", "play through"], aliases: ["auto-advance", "autoplay"], type: "toggle", category: "projection" },

  // ── Text Formatting ──
  { key: "defaultFont", title: "Default Font Family", description: "Primary font for projected text content", keywords: ["font", "typeface", "family", "text", "typography", "type"], aliases: ["font-family", "primary-font"], type: "input", category: "text-formatting", placeholder: "Inter" },
  { key: "fallbackFont", title: "Fallback Font", description: "Secondary font when the primary font is unavailable", keywords: ["font", "fallback", "backup", "secondary", "sans-serif", "serif"], aliases: ["backup-font", "secondary-font"], type: "input", category: "text-formatting", placeholder: "sans-serif" },
  { key: "fontSize", title: "Font Size", description: "Default font size for projected text", keywords: ["font", "size", "text", "scale", "large", "small"], aliases: ["text-size", "font-scale"], type: "slider", category: "text-formatting", min: 12, max: 200, unit: "px" },
  { key: "fontWeight", title: "Font Weight", description: "Thickness of text characters", keywords: ["font", "weight", "bold", "thickness", "light", "semibold", "medium"], aliases: ["boldness", "text-weight"], type: "slider", category: "text-formatting", min: 300, max: 900, step: 100 },
  { key: "lineSpacing", title: "Line Spacing", description: "Vertical space between lines of text", keywords: ["line", "spacing", "leading", "height", "vertical", "gap"], aliases: ["line-height", "leading"], type: "slider", category: "text-formatting", min: 1, max: 3, step: 0.1 },
  { key: "letterSpacing", title: "Letter Spacing", description: "Horizontal space between characters", keywords: ["letter", "spacing", "tracking", "kerning", "character", "width"], aliases: ["tracking", "character-spacing"], type: "slider", category: "text-formatting", min: -2, max: 8, step: 0.5, unit: "px" },
  { key: "shadowEnabled", title: "Text Shadow", description: "Add a drop shadow behind projected text", keywords: ["shadow", "text", "drop", "depth", "effect", "readability"], aliases: ["drop-shadow", "text-shadow"], type: "toggle", category: "text-formatting" },
  { key: "outlineEnabled", title: "Text Outline", description: "Add an outline stroke around text characters", keywords: ["outline", "stroke", "border", "text", "edge", "contour"], aliases: ["stroke", "text-outline"], type: "toggle", category: "text-formatting" },
  { key: "glowEnabled", title: "Text Glow", description: "Add a soft glow effect behind text", keywords: ["glow", "neon", "text", "light", "bloom", "radiance"], aliases: ["neon-glow", "text-glow"], type: "toggle", category: "text-formatting" },

  // ── Themes ──
  { key: "defaultThemeId", title: "Default Theme", description: "Theme applied to new projects", keywords: ["theme", "template", "default", "preset", "style"], aliases: ["default-template", "start-theme"], type: "input", category: "themes", placeholder: "worship-royal-sapphire" },
  { key: "animatedThemesEnabled", title: "Animated Themes", description: "Enable animated background themes", keywords: ["animated", "theme", "animation", "motion", "background", "dynamic"], aliases: ["enable-animations", "theme-motion"], type: "toggle", category: "themes" },
  { key: "themeTransitionSpeed", title: "Theme Transition Speed", description: "Speed of theme switching animation in milliseconds", keywords: ["theme", "transition", "speed", "animation", "switch", "duration"], aliases: ["theme-switch-speed", "animation-speed"], type: "slider", category: "themes", min: 100, max: 2000, step: 100, unit: "ms" },
  { key: "themeAutoApply", title: "Auto-Apply Theme", description: "Automatically apply theme styles when selected", keywords: ["theme", "auto", "apply", "instant", "preview"], aliases: ["auto-apply", "instant-apply"], type: "toggle", category: "themes" },

  // ── Bible ──
  { key: "defaultTranslation", title: "Default Translation", description: "Primary Bible translation for display", keywords: ["bible", "translation", "version", "scripture", "text", "word"], aliases: ["bible-version", "scripture-translation"], type: "select", category: "bible", options: [{ value: "en", label: "English" }, { value: "ta", label: "Tamil" }] },
  { key: "tamilFirst", title: "Tamil First", description: "Show Tamil text as the primary reference", keywords: ["tamil", "primary", "language", "order", "priority", "first"], aliases: ["tamil-priority", "prefer-tamil"], type: "toggle", category: "bible" },
  { key: "parallelMode", title: "Parallel Mode", description: "Show English and Tamil translations side by side", keywords: ["parallel", "dual", "side by side", "bilingual", "both", "languages"], aliases: ["dual-pane", "side-by-side"], type: "toggle", category: "bible" },
  { key: "bookAbbreviations", title: "Book Abbreviations", description: "Use abbreviated book names in references", keywords: ["book", "abbreviation", "short", "name", "reference", "shorthand"], aliases: ["short-names", "abbreviated-books"], type: "toggle", category: "bible" },
  { key: "verseNumbering", title: "Verse Numbering", description: "Show verse numbers in scripture display", keywords: ["verse", "number", "reference", "scripture", "chapter"], aliases: ["show-verses", "verse-numbers"], type: "toggle", category: "bible" },
  { key: "tanglishSearch", title: "Tanglish Bible Search", description: "Search Tamil Bible using Roman characters", keywords: ["tamil", "tanglish", "search", "roman", "transliteration", "english"], aliases: ["roman-search", "tamil-roman"], type: "toggle", category: "bible" },
  { key: "phoneticSearch", title: "Phonetic Bible Search", description: "Match phonetically similar words during search", keywords: ["phonetic", "sound", "similar", "fuzzy", "search", "approximate"], aliases: ["fuzzy-search", "sound-search"], type: "toggle", category: "bible" },

  // ── Songs ──
  { key: "songsDefaultLanguage", title: "Song Language", description: "Default language for the song library", keywords: ["song", "language", "tamil", "english", "lyrics", "worship"], aliases: ["lyric-language", "song-lang"], type: "select", category: "songs", options: [{ value: "ta", label: "Tamil" }, { value: "en", label: "English" }] },
  { key: "tanglishSearchEnabled", title: "Tanglish Song Search", description: "Search songs using Romanized Tamil text", keywords: ["tamil", "tanglish", "search", "roman", "song", "lyrics"], aliases: ["song-tanglish", "roman-lyric-search"], type: "toggle", category: "songs" },
  { key: "defaultSorting", title: "Song Sorting", description: "Default sort order for song listings", keywords: ["sort", "order", "song", "list", "arrange", "alphabetical"], aliases: ["sort-order", "list-order"], type: "select", category: "songs", options: [{ value: "title", label: "Title" }, { value: "recent", label: "Recently Used" }, { value: "created", label: "Date Added" }, { value: "artist", label: "Artist" }] },
  { key: "autoLoadLyrics", title: "Auto-Load Lyrics", description: "Preload lyrics when a song is selected", keywords: ["lyrics", "auto", "load", "prefetch", "song", "cache"], aliases: ["preload-lyrics", "cache-lyrics"], type: "toggle", category: "songs" },

  // ── Media ──
  { key: "imageDurationMs", title: "Image Duration", description: "Default display duration for images in seconds", keywords: ["image", "duration", "time", "photo", "slide", "seconds"], aliases: ["image-time", "photo-duration"], type: "number", category: "media", min: 1, max: 3600, unit: "s" },
  { key: "videoAutoplay", title: "Autoplay Videos", description: "Automatically start video playback", keywords: ["video", "autoplay", "play", "start", "media"], aliases: ["auto-start-video", "video-auto"], type: "toggle", category: "media" },
  { key: "mediaLoop", title: "Loop Media", description: "Loop media playback continuously", keywords: ["loop", "repeat", "media", "video", "cycle", "continuous"], aliases: ["repeat-media", "loop-playback"], type: "toggle", category: "media" },
  { key: "hardwareAcceleration", title: "Hardware Acceleration", description: "Use GPU acceleration for media rendering", keywords: ["gpu", "hardware", "acceleration", "render", "performance", "graphics"], aliases: ["gpu-accel", "hardware-render"], type: "toggle", category: "media" },
  { key: "thumbnailQuality", title: "Thumbnail Quality", description: "Quality level for generated thumbnails", keywords: ["thumbnail", "quality", "preview", "image", "resolution", "thumb"], aliases: ["preview-quality", "thumb-quality"], type: "select", category: "media", options: [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }] },

  // ── Search ──
  { key: "instantSearch", title: "Instant Search", description: "Show results as you type", keywords: ["instant", "search", "type", "live", "real-time", "results"], aliases: ["live-search", "real-time-search"], type: "toggle", category: "search" },
  { key: "searchHistory", title: "Search History", description: "Remember recent search queries", keywords: ["history", "search", "recent", "remember", "queries", "log"], aliases: ["remember-searches", "search-log"], type: "toggle", category: "search" },
  { key: "maxResults", title: "Maximum Results", description: "Maximum number of search results to display", keywords: ["max", "results", "limit", "search", "count", "maximum"], aliases: ["result-limit", "max-search-results"], type: "number", category: "search", min: 10, max: 500 },

  // ── Performance ──
  { key: "gpuRendering", title: "GPU Rendering", description: "Use GPU for rendering when available", keywords: ["gpu", "render", "graphics", "performance", "hardware", "acceleration"], aliases: ["gpu-acceleration", "render-engine"], type: "toggle", category: "performance" },
  { key: "preloadDatasets", title: "Preload Datasets", description: "Load Bible and Songs data in the background", keywords: ["preload", "data", "background", "cache", "load", "bible", "songs"], aliases: ["background-load", "data-prefetch"], type: "toggle", category: "performance" },
  { key: "lazyLoading", title: "Lazy Loading", description: "Load media thumbnails on demand", keywords: ["lazy", "load", "on-demand", "thumbnail", "deferred", "performance"], aliases: ["defer-load", "on-demand"], type: "toggle", category: "performance" },

  // ── Audio ──
  { key: "outputDevice", title: "Output Device", description: "Audio output device for media playback", keywords: ["audio", "output", "device", "speaker", "sound", "playback"], aliases: ["audio-device", "sound-output"], type: "select", category: "audio", options: [{ value: "default", label: "System Default" }] },
  { key: "audioVolume", title: "Volume", description: "Default audio volume level", keywords: ["volume", "audio", "sound", "level", "loudness"], aliases: ["sound-volume", "audio-level"], type: "slider", category: "audio", min: 0, max: 100, step: 5, unit: "%" },
  { key: "fadeInMs", title: "Audio Fade In", description: "Duration of audio fade-in effect", keywords: ["fade", "in", "audio", "transition", "ramp", "smooth"], aliases: ["fade-in", "ramp-in"], type: "number", category: "audio", min: 0, max: 5000, step: 100, unit: "ms" },
  { key: "fadeOutMs", title: "Audio Fade Out", description: "Duration of audio fade-out effect", keywords: ["fade", "out", "audio", "transition", "ramp", "smooth"], aliases: ["fade-out", "ramp-out"], type: "number", category: "audio", min: 0, max: 5000, step: 100, unit: "ms" },
  { key: "muteOnStartup", title: "Mute on Startup", description: "Start with audio muted", keywords: ["mute", "silent", "startup", "audio", "sound", "quiet"], aliases: ["start-muted", "silent-start"], type: "toggle", category: "audio" },

  // ── Video ──
  { key: "hardwareDecoding", title: "Hardware Decoding", description: "Use hardware-accelerated video decoding", keywords: ["video", "decoding", "hardware", "gpu", "codec", "h264", "hevc"], aliases: ["gpu-decode", "hardware-decode"], type: "toggle", category: "video" },
  { key: "frameRate", title: "Frame Rate", description: "Target frame rate for video playback", keywords: ["fps", "frame", "rate", "video", "smooth", "refresh"], aliases: ["target-fps", "playback-fps"], type: "select", category: "video", options: [{ value: "24", label: "24 FPS" }, { value: "30", label: "30 FPS" }, { value: "60", label: "60 FPS" }] },

  // ── Security ──
  { key: "lockSettings", title: "Lock Settings", description: "Require confirmation before changing settings", keywords: ["lock", "protect", "confirm", "settings", "security"], aliases: ["protect-settings", "settings-lock"], type: "toggle", category: "security" },
  { key: "requirePassword", title: "Require Password", description: "Password-protect access to settings", keywords: ["password", "protect", "secure", "auth", "access", "lock"], aliases: ["password-protect", "auth-required"], type: "toggle", category: "security" },
  { key: "readOnlyMode", title: "Read-Only Mode", description: "Prevent accidental changes to content", keywords: ["read", "only", "lock", "protect", "prevent", "changes"], aliases: ["locked-mode", "prevent-changes"], type: "toggle", category: "security" },

  // ── Advanced ──
  { key: "developerMode", title: "Developer Mode", description: "Enable developer tools and debug information", keywords: ["developer", "debug", "tools", "console", "dev", "inspect"], aliases: ["dev-mode", "debug-mode"], type: "toggle", category: "advanced" },
  { key: "logLevel", title: "Log Level", description: "Verbosity level for application logging", keywords: ["log", "logging", "debug", "verbose", "error", "warn", "info"], aliases: ["logging-level", "verbosity"], type: "select", category: "advanced", options: [{ value: "error", label: "Errors Only" }, { value: "warn", label: "Warnings" }, { value: "info", label: "Information" }, { value: "debug", label: "Debug" }] },
  { key: "factoryResetToken", title: "Factory Reset Token", description: "Token required for factory reset operations", keywords: ["reset", "factory", "token", "wipe", "restore"], aliases: ["reset-token", "wipe-token"], type: "input", category: "advanced", placeholder: "Not set" },
];

export const SETTINGS: SettingDef[] = ALL;
export const CATEGORIES: string[] = [...new Set(ALL.map((s) => s.category))];

export const CATEGORY_META: Record<string, { title: string; icon: LucideIcon }> = {
  general: { title: "General", icon: Settings },
  appearance: { title: "Appearance", icon: Palette },
  projection: { title: "Projection", icon: MonitorPlay },
  "text-formatting": { title: "Text Formatting", icon: Type },
  themes: { title: "Themes", icon: Sparkles },
  bible: { title: "Bible", icon: BookOpen },
  songs: { title: "Songs", icon: Music },
  media: { title: "Media", icon: Image },
  search: { title: "Search", icon: Search },
  performance: { title: "Performance", icon: Zap },
  audio: { title: "Audio", icon: Volume2 },
  video: { title: "Video", icon: Video },
  security: { title: "Security", icon: Shield },
  advanced: { title: "Advanced", icon: Sliders },
};
