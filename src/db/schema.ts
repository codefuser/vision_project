import Dexie, { type Table } from "dexie";

export type MediaType = "image" | "video";
export type TransitionType = "fade" | "crossfade" | "zoom" | "dissolve" | "none";
export type LoopMode = "single" | "playlist" | "none";
export type ThemeMode = "light" | "dark" | "system";

export interface FolderRecord {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface MediaRecord {
  id: string;
  name: string;
  type: MediaType;
  mime: string;
  size: number;
  durationMs?: number;
  width?: number;
  height?: number;
  folderId: string | null;
  blobId: string;
  thumbBlobId: string | null;
  createdAt: number;
  updatedAt: number;
  lastUsedAt: number | null;
}

export interface BlobRecord {
  id: string;
  blob: Blob;
  kind: "original" | "thumb";
}

export interface PlaylistItem {
  id: string;
  mediaId: string;
  durationMs: number; // image duration; for videos uses video's own length unless overridden
  transition: TransitionType;
  muted?: boolean;
  /** Operator notes shown in Service Mode (cue sheet). */
  notes?: string;
  /** Optional title override for the cue list. */
  label?: string;
}

export interface PlaylistRecord {
  id: string;
  name: string;
  items: PlaylistItem[];
  createdAt: number;
  updatedAt: number;
}

export type ScrollbarStyle = "thin" | "auto" | "hidden";
export type SpacingMode = "compact" | "normal" | "comfortable";
export type AspectRatio = "16:9" | "4:3" | "16:10" | "21:9";
export type TextAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "middle" | "bottom";
export type StrokeJoin = "miter" | "round" | "bevel";
export type BookNameStyle = "full" | "abbreviated" | "short";
export type VerseSplit = "single" | "range" | "chapter";
export type SongSearchMode = "title" | "lyrics" | "both";
export type GIFPlayback = "animate" | "once" | "pause";
export type ScalingMode = "fill" | "fit" | "stretch" | "tile";
export type ScalingAlgorithm = "nearest" | "bilinear" | "bicubic";
export type DefaultCodec = "h264" | "h265" | "vp9" | "av1";

export interface AppSettings {
  // General
  theme: ThemeMode;
  accentColor: string;
  language: string;
  autoSave: boolean;
  startupBehavior: "restore" | "new" | "blank";
  checkUpdates: boolean;
  autoLaunch: boolean;
  recentProjects: number;
  defaultStartupPage: "library" | "project" | "playlists" | "settings";
  telemetry: boolean;

  // Appearance
  compactMode: boolean;
  sidebarWidth: number;
  uiScale: number;
  iconSize: number;
  blurEffects: boolean;
  glassEffects: boolean;
  animationsEnabled: boolean;
  reduceMotion: boolean;
  roundedCorners: number;
  blurStrength: number;
  accentOpacity: number;
  scrollbarStyle: ScrollbarStyle;
  cardRadius: number;
  spacing: SpacingMode;

  // Projection
  defaultImageDurationMs: number;
  defaultTransition: TransitionType;
  defaultLoopMode: LoopMode;
  defaultVolume: number;
  autoplayVideo: boolean;
  muteOnStart: boolean;
  projectorResolution: string;
  safeMargins: number;
  fadeDurationMs: number;
  blackScreen: boolean;
  logoScreen: boolean;
  freezeScreen: boolean;
  blankScreenEnabled: boolean;
  countdownSeconds: number;
  autoTransition: boolean;
  defaultDisplay: string;
  transitionDuration: number;
  aspectRatio: AspectRatio;
  refreshRate: number;
  defaultBackground: string;
  projectorBrightness: number;

  // Text Formatting
  defaultFont: string;
  fallbackFont: string;
  fontSize: number;
  fontWeight: number;
  lineSpacing: number;
  letterSpacing: number;
  shadowEnabled: boolean;
  outlineEnabled: boolean;
  glowEnabled: boolean;
  tamilFont: string;
  englishFont: string;
  referenceFont: string;
  italic: boolean;
  underline: boolean;
  textAlign: TextAlign;
  verticalAlign: VerticalAlign;
  textWidth: number;
  maxWidth: number;
  textMargin: number;
  textPadding: number;
  shadowBlur: number;
  shadowOpacity: number;
  glowColor: string;
  outlineWidth: number;
  outlineColor: string;
  strokeJoin: StrokeJoin;
  textOpacity: number;
  referenceOpacity: number;

  // Themes
  defaultThemeId: string;
  animatedThemesEnabled: boolean;
  themeTransitionSpeed: number;
  themeAutoApply: boolean;
  backgroundOpacity: number;
  backgroundBlur: number;
  particlesEnabled: boolean;
  lightRaysEnabled: boolean;
  starsEnabled: boolean;
  fogEnabled: boolean;
  smokeEnabled: boolean;
  rainEnabled: boolean;
  snowEnabled: boolean;
  bokehEnabled: boolean;
  auroraEnabled: boolean;
  meshGradientEnabled: boolean;
  motionBackgroundEnabled: boolean;
  videoBackgroundEnabled: boolean;

  // Bible
  defaultTranslation: string;
  tamilFirst: boolean;
  parallelMode: boolean;
  bookAbbreviations: boolean;
  verseNumbering: boolean;
  tanglishSearch: boolean;
  phoneticSearch: boolean;
  defaultVersion: string;
  tamilVersion: string;
  englishVersion: string;
  referencePosition: "top" | "bottom" | "overlay";
  referenceSize: number;
  bookNameStyle: BookNameStyle;
  autoAdvance: boolean;
  verseSplit: VerseSplit;
  showReference: boolean;
  verseAnimation: boolean;

  // Songs
  songsDefaultLanguage: string;
  tanglishSearchEnabled: boolean;
  defaultSorting: string;
  autoLoadLyrics: boolean;
  defaultSearchMode: SongSearchMode;
  fuzzySearch: boolean;
  soundSimilarSearch: boolean;
  autoCapitalization: boolean;
  songCacheSize: number;

  // Media
  imageDurationMs: number;
  videoAutoplay: boolean;
  mediaLoop: boolean;
  hardwareAcceleration: boolean;
  thumbnailQuality: string;
  gifPlayback: GIFPlayback;
  imageScaling: ScalingMode;
  videoScaling: ScalingMode;

  // Search
  instantSearch: boolean;
  maxResults: number;
  searchHistory: boolean;
  cacheSize: number;
  searchDelay: number;
  indexAutomatically: boolean;
  backgroundIndexing: boolean;

  // Performance
  gpuRendering: boolean;
  preloadDatasets: boolean;
  lazyLoading: boolean;
  memoryCache: boolean;
  themeCache: boolean;
  imageCache: boolean;
  videoCache: boolean;
  songCache: boolean;
  bibleCache: boolean;
  preloadSongs: boolean;
  preloadBible: boolean;
  databaseOptimization: boolean;

  // Audio
  outputDevice: string;
  audioVolume: number;
  fadeInMs: number;
  fadeOutMs: number;
  muteOnStartup: boolean;
  masterVolume: number;
  defaultOutput: string;
  microphone: string;
  audioDelay: number;
  previewVolume: number;

  // Video
  hardwareDecoding: boolean;
  frameRate: number;
  defaultResolution: string;
  defaultCodec: DefaultCodec;
  imageQuality: number;
  videoQuality: number;
  scalingAlgorithm: ScalingAlgorithm;

  // Keyboard Shortcuts
  shortcutsCustom: Record<string, string>;

  // Remote Control
  remoteEnabled: boolean;
  qrCodeEnabled: boolean;
  pinCode: string;
  webRemoteEnabled: boolean;
  mobileRemoteEnabled: boolean;
  remoteLatency: number;
  remoteReconnect: boolean;

  // Backup
  automaticBackup: boolean;
  backupInterval: number;
  cloudBackup: boolean;
  backupLocation: string;

  // Security
  lockSettings: boolean;
  requirePassword: boolean;
  readOnlyMode: boolean;
  settingsPassword: string;
  encryptDatabase: boolean;
  backupEncryption: boolean;

  // Advanced
  factoryResetToken: string;
  developerMode: boolean;
  logLevel: string;
  experimentalFeatures: boolean;
}

export interface SettingsRecord {
  key: "app";
  value: AppSettings;
}

export interface LogRecord {
  id?: number;
  level: "info" | "warn" | "error";
  message: string;
  ctx?: string;
  ts: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  // General
  theme: "dark",
  accentColor: "#6366f1",
  language: "en",
  autoSave: true,
  startupBehavior: "restore",
  checkUpdates: false,
  autoLaunch: false,
  recentProjects: 10,
  defaultStartupPage: "library",
  telemetry: false,

  // Appearance
  compactMode: false,
  sidebarWidth: 224,
  uiScale: 100,
  iconSize: 16,
  blurEffects: true,
  glassEffects: true,
  animationsEnabled: true,
  reduceMotion: false,
  roundedCorners: 8,
  blurStrength: 100,
  accentOpacity: 100,
  scrollbarStyle: "thin",
  cardRadius: 12,
  spacing: "normal",

  // Projection
  defaultImageDurationMs: 5000,
  defaultTransition: "fade",
  defaultLoopMode: "none",
  defaultVolume: 0.8,
  autoplayVideo: true,
  muteOnStart: false,
  projectorResolution: "1920x1080",
  safeMargins: 5,
  fadeDurationMs: 500,
  blackScreen: false,
  logoScreen: false,
  freezeScreen: false,
  blankScreenEnabled: false,
  countdownSeconds: 10,
  autoTransition: false,
  defaultDisplay: "default",
  transitionDuration: 500,
  aspectRatio: "16:9",
  refreshRate: 60,
  defaultBackground: "#000000",
  projectorBrightness: 100,

  // Text Formatting
  defaultFont: "Inter",
  fallbackFont: "sans-serif",
  fontSize: 48,
  fontWeight: 700,
  lineSpacing: 1.5,
  letterSpacing: 0,
  shadowEnabled: true,
  outlineEnabled: false,
  glowEnabled: false,
  tamilFont: "Noto Sans Tamil",
  englishFont: "Inter",
  referenceFont: "Inter",
  italic: false,
  underline: false,
  textAlign: "center",
  verticalAlign: "middle",
  textWidth: 80,
  maxWidth: 90,
  textMargin: 16,
  textPadding: 24,
  shadowBlur: 4,
  shadowOpacity: 60,
  glowColor: "#ffffff",
  outlineWidth: 2,
  outlineColor: "#000000",
  strokeJoin: "round",
  textOpacity: 100,
  referenceOpacity: 70,

  // Themes
  defaultThemeId: "worship-royal-sapphire",
  animatedThemesEnabled: true,
  themeTransitionSpeed: 300,
  themeAutoApply: true,
  backgroundOpacity: 100,
  backgroundBlur: 0,
  particlesEnabled: true,
  lightRaysEnabled: false,
  starsEnabled: false,
  fogEnabled: false,
  smokeEnabled: false,
  rainEnabled: false,
  snowEnabled: false,
  bokehEnabled: false,
  auroraEnabled: false,
  meshGradientEnabled: false,
  motionBackgroundEnabled: false,
  videoBackgroundEnabled: false,

  // Bible
  defaultTranslation: "en",
  tamilFirst: true,
  parallelMode: false,
  bookAbbreviations: true,
  verseNumbering: true,
  tanglishSearch: true,
  phoneticSearch: false,
  defaultVersion: "KJV",
  tamilVersion: "TCV",
  englishVersion: "KJV",
  referencePosition: "bottom",
  referenceSize: 14,
  bookNameStyle: "abbreviated",
  autoAdvance: false,
  verseSplit: "single",
  showReference: true,
  verseAnimation: false,

  // Songs
  songsDefaultLanguage: "ta",
  tanglishSearchEnabled: true,
  defaultSorting: "title",
  autoLoadLyrics: true,
  defaultSearchMode: "both",
  fuzzySearch: true,
  soundSimilarSearch: false,
  autoCapitalization: true,
  songCacheSize: 500,

  // Media
  imageDurationMs: 5000,
  videoAutoplay: true,
  mediaLoop: false,
  hardwareAcceleration: true,
  thumbnailQuality: "high",
  gifPlayback: "animate",
  imageScaling: "fit",
  videoScaling: "fit",

  // Search
  instantSearch: true,
  maxResults: 100,
  searchHistory: true,
  cacheSize: 500,
  searchDelay: 150,
  indexAutomatically: true,
  backgroundIndexing: true,

  // Performance
  gpuRendering: true,
  preloadDatasets: true,
  lazyLoading: true,
  memoryCache: true,
  themeCache: true,
  imageCache: true,
  videoCache: true,
  songCache: true,
  bibleCache: true,
  preloadSongs: true,
  preloadBible: true,
  databaseOptimization: true,

  // Audio
  outputDevice: "default",
  audioVolume: 0.8,
  fadeInMs: 300,
  fadeOutMs: 300,
  muteOnStartup: false,
  masterVolume: 100,
  defaultOutput: "default",
  microphone: "default",
  audioDelay: 0,
  previewVolume: 50,

  // Video
  hardwareDecoding: true,
  frameRate: 60,
  defaultResolution: "1920x1080",
  defaultCodec: "h264",
  imageQuality: 90,
  videoQuality: 80,
  scalingAlgorithm: "bilinear",

  // Keyboard Shortcuts
  shortcutsCustom: {},

  // Remote Control
  remoteEnabled: false,
  qrCodeEnabled: true,
  pinCode: "",
  webRemoteEnabled: true,
  mobileRemoteEnabled: true,
  remoteLatency: 0,
  remoteReconnect: true,

  // Backup
  automaticBackup: false,
  backupInterval: 24,
  cloudBackup: false,
  backupLocation: "",

  // Security
  lockSettings: false,
  requirePassword: false,
  readOnlyMode: false,
  settingsPassword: "",
  encryptDatabase: false,
  backupEncryption: false,

  // Advanced
  factoryResetToken: "",
  developerMode: false,
  logLevel: "info",
  experimentalFeatures: false,
};

export class ChurchMediaDB extends Dexie {
  folders!: Table<FolderRecord, string>;
  media!: Table<MediaRecord, string>;
  blobs!: Table<BlobRecord, string>;
  playlists!: Table<PlaylistRecord, string>;
  settings!: Table<SettingsRecord, "app">;
  logs!: Table<LogRecord, number>;

  constructor() {
    super("church-media-db");
    this.version(1).stores({
      folders: "id, parentId, name, updatedAt",
      media: "id, folderId, type, name, createdAt, lastUsedAt, updatedAt",
      blobs: "id, kind",
      playlists: "id, name, updatedAt",
      settings: "key",
      logs: "++id, ts, level",
    });
  }
}

let _db: ChurchMediaDB | null = null;
export function db(): ChurchMediaDB {
  if (typeof window === "undefined") {
    // SSR safety: return a stub that throws if used during render
    throw new Error("DB is browser-only");
  }
  if (!_db) _db = new ChurchMediaDB();
  return _db;
}
