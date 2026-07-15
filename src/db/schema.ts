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

  // Appearance
  compactMode: boolean;
  sidebarWidth: number;
  uiScale: number;
  iconSize: number;
  blurEffects: boolean;
  glassEffects: boolean;

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

  // Themes
  defaultThemeId: string;
  animatedThemesEnabled: boolean;
  themeTransitionSpeed: number;
  themeAutoApply: boolean;

  // Bible
  defaultTranslation: string;
  tamilFirst: boolean;
  parallelMode: boolean;
  bookAbbreviations: boolean;
  verseNumbering: boolean;
  tanglishSearch: boolean;
  phoneticSearch: boolean;

  // Songs
  songsDefaultLanguage: string;
  tanglishSearchEnabled: boolean;
  defaultSorting: string;
  autoLoadLyrics: boolean;

  // Media
  imageDurationMs: number;
  videoAutoplay: boolean;
  mediaLoop: boolean;
  hardwareAcceleration: boolean;
  thumbnailQuality: string;

  // Search
  instantSearch: boolean;
  maxResults: number;
  searchHistory: boolean;

  // Performance
  gpuRendering: boolean;
  preloadDatasets: boolean;
  lazyLoading: boolean;

  // Audio
  outputDevice: string;
  audioVolume: number;
  fadeInMs: number;
  fadeOutMs: number;
  muteOnStartup: boolean;

  // Video
  hardwareDecoding: boolean;
  frameRate: number;

  // Security
  lockSettings: boolean;
  requirePassword: boolean;
  readOnlyMode: boolean;

  // Advanced
  factoryResetToken: string;
  developerMode: boolean;
  logLevel: string;
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

  // Appearance
  compactMode: false,
  sidebarWidth: 224,
  uiScale: 100,
  iconSize: 16,
  blurEffects: true,
  glassEffects: true,

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

  // Themes
  defaultThemeId: "worship-royal-sapphire",
  animatedThemesEnabled: true,
  themeTransitionSpeed: 300,
  themeAutoApply: true,

  // Bible
  defaultTranslation: "en",
  tamilFirst: true,
  parallelMode: false,
  bookAbbreviations: true,
  verseNumbering: true,
  tanglishSearch: true,
  phoneticSearch: false,

  // Songs
  songsDefaultLanguage: "ta",
  tanglishSearchEnabled: true,
  defaultSorting: "title",
  autoLoadLyrics: true,

  // Media
  imageDurationMs: 5000,
  videoAutoplay: true,
  mediaLoop: false,
  hardwareAcceleration: true,
  thumbnailQuality: "high",

  // Search
  instantSearch: true,
  maxResults: 100,
  searchHistory: true,

  // Performance
  gpuRendering: true,
  preloadDatasets: true,
  lazyLoading: true,

  // Audio
  outputDevice: "default",
  audioVolume: 0.8,
  fadeInMs: 300,
  fadeOutMs: 300,
  muteOnStartup: false,

  // Video
  hardwareDecoding: true,
  frameRate: 60,

  // Security
  lockSettings: false,
  requirePassword: false,
  readOnlyMode: false,

  // Advanced
  factoryResetToken: "",
  developerMode: false,
  logLevel: "info",
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
