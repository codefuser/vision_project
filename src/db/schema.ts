import Dexie, { type Table } from "dexie";

export type MediaType = "image" | "video";
export type TransitionType = "fade" | "crossfade" | "zoom" | "dissolve" | "none";
export type LoopMode = "single" | "playlist" | "none";
export type ThemeMode = "light" | "dark" | "system";

// ─── Session History ──────────────────────────────────────────────────────────

export type SessionEventType =
  // System lifecycle
  | "SESSION_STARTED"
  | "SESSION_ENDED"
  | "PROJECTOR_OPENED"
  | "PROJECTOR_CLOSED"
  // Content projected
  | "BIBLE_PROJECTED"
  | "SONG_PROJECTED"
  | "IMAGE_PROJECTED"
  | "VIDEO_PROJECTED"
  | "TEXT_PROJECTED"
  | "ANNOUNCEMENT_PROJECTED"
  // Playback transport
  | "PLAYBACK_STARTED"
  | "PLAYBACK_PAUSED"
  | "PLAYBACK_STOPPED"
  // Screen states
  | "BLACK_SCREEN_ON"
  | "BLACK_SCREEN_OFF"
  | "BLANK_SCREEN_ON"
  | "BLANK_SCREEN_OFF"
  // Style / theme
  | "THEME_CHANGED"
  | "FONT_CHANGED"
  // Navigation / queue
  | "PLAYLIST_OPENED"
  | "PLAYLIST_ADVANCED"
  // Misc
  | "SEARCH_PERFORMED"
  | "MEDIA_IMPORTED"
  | "MEDIA_DELETED";

export type SessionStatus = "active" | "ended";

export interface SessionRecord {
  id: string;
  name: string;
  date: string;          // ISO date YYYY-MM-DD — indexed for date filters
  startedAt: number;     // Unix ms
  endedAt: number | null; // null = still active
  status: SessionStatus;
  version: string;       // App version
  // Cached counters (updated when session ends or on each log)
  totalEvents: number;
  bibleCount: number;
  songCount: number;
  imageCount: number;
  videoCount: number;
  textCount: number;
  themeCount: number;
}

export interface SessionEventRecord {
  id: string;
  sessionId: string;           // FK → sessions.id
  ts: number;                  // Unix ms — monotonically increasing
  eventType: SessionEventType;
  label: string;               // Human-readable: "Psalm 23:1", "Appa Pithave"
  detail: string | null;       // Optional extra text: verse text, theme name
  module: string;              // Source: "bible", "songs", "media", "system", "theme"
  metadata: string | null;     // JSON string for restore payloads
}

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

export type AspectRatio = "16:9" | "4:3" | "16:10" | "21:9";
export type TextAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "middle" | "bottom";
export type VerseSplit = "single" | "range" | "chapter";
export type SongSearchMode = "title" | "lyrics" | "both";
export type ScalingMode = "fill" | "fit" | "stretch" | "tile";
export type AnimationPreset =
  | "none"
  | "light-rays"
  | "soft-particles"
  | "golden-worship"
  | "blue-nebula"
  | "aurora"
  | "floating-dust"
  | "moving-clouds"
  | "wave-mesh";

export interface AppSettings {
  // General
  theme: ThemeMode;
  language: string;
  autoSave: boolean;
  startupBehavior: "restore" | "new" | "blank";
  defaultStartupPage: "library" | "project" | "playlists" | "settings";

  // Projection
  defaultDisplay: string;
  projectorResolution: string;
  aspectRatio: AspectRatio;
  defaultTransition: TransitionType;
  transitionDuration: number;
  fadeDurationMs: number;
  defaultImageDurationMs: number;
  defaultVolume: number;
  muteOnStart: boolean;
  defaultBackground: string;
  blackScreen: boolean;
  logoScreen: boolean;
  countdownSeconds: number;
  safeMargins: number;
  autoTransition: boolean;

  // Text Formatting
  tamilFont: string;
  englishFont: string;
  referenceFont: string;
  fontSize: number;
  fontWeight: number;
  lineSpacing: number;
  letterSpacing: number;
  textWidth: number;
  textAlign: TextAlign;
  verticalAlign: VerticalAlign;
  shadowEnabled: boolean;
  shadowBlur: number;
  shadowOpacity: number;
  outlineEnabled: boolean;
  outlineWidth: number;
  outlineColor: string;
  glowEnabled: boolean;
  glowColor: string;
  textOpacity: number;
  referenceOpacity: number;

  // Themes
  defaultThemeId: string;
  animatedThemesEnabled: boolean;
  themeTransitionSpeed: number;
  backgroundOpacity: number;
  animationPreset: AnimationPreset;

  // Bible
  defaultTranslation: string;
  tamilVersion: string;
  englishVersion: string;
  tamilFirst: boolean;
  parallelMode: boolean;
  verseNumbering: boolean;
  showReference: boolean;
  referencePosition: "top" | "bottom" | "overlay";
  referenceSize: number;
  verseSplit: VerseSplit;
  verseAnimation: boolean;

  // Songs
  defaultSearchMode: SongSearchMode;
  defaultSorting: string;
  autoLoadLyrics: boolean;

  // Media
  imageDurationMs: number;
  videoAutoplay: boolean;
  mediaLoop: boolean;
  imageScaling: ScalingMode;
  videoScaling: ScalingMode;

  // Remote Control
  remoteEnabled: boolean;
  qrCodeEnabled: boolean;
  pinCode: string;
  remoteReconnect: boolean;

  // Backup
  automaticBackup: boolean;
  backupInterval: number;
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
  language: "en",
  autoSave: true,
  startupBehavior: "restore",
  defaultStartupPage: "library",

  // Projection
  defaultDisplay: "default",
  projectorResolution: "1920x1080",
  aspectRatio: "16:9",
  defaultTransition: "fade",
  transitionDuration: 500,
  fadeDurationMs: 500,
  defaultImageDurationMs: 5000,
  defaultVolume: 0.8,
  muteOnStart: false,
  defaultBackground: "#000000",
  blackScreen: false,
  logoScreen: false,
  countdownSeconds: 10,
  safeMargins: 5,
  autoTransition: false,

  // Text Formatting
  tamilFont: "Noto Sans Tamil",
  englishFont: "Inter",
  referenceFont: "Inter",
  fontSize: 48,
  fontWeight: 700,
  lineSpacing: 1.5,
  letterSpacing: 0,
  textWidth: 80,
  textAlign: "center",
  verticalAlign: "middle",
  shadowEnabled: true,
  shadowBlur: 4,
  shadowOpacity: 60,
  outlineEnabled: false,
  outlineWidth: 2,
  outlineColor: "#000000",
  glowEnabled: false,
  glowColor: "#ffffff",
  textOpacity: 100,
  referenceOpacity: 70,

  // Themes
  defaultThemeId: "worship-royal-sapphire",
  animatedThemesEnabled: true,
  themeTransitionSpeed: 300,
  backgroundOpacity: 100,
  animationPreset: "none",

  // Bible
  defaultTranslation: "en",
  tamilVersion: "TCV",
  englishVersion: "KJV",
  tamilFirst: true,
  parallelMode: false,
  verseNumbering: true,
  showReference: true,
  referencePosition: "bottom",
  referenceSize: 14,
  verseSplit: "single",
  verseAnimation: false,

  // Songs
  defaultSearchMode: "both",
  defaultSorting: "title",
  autoLoadLyrics: true,

  // Media
  imageDurationMs: 5000,
  videoAutoplay: true,
  mediaLoop: false,
  imageScaling: "fit",
  videoScaling: "fit",

  // Remote Control
  remoteEnabled: false,
  qrCodeEnabled: true,
  pinCode: "",
  remoteReconnect: true,

  // Backup
  automaticBackup: false,
  backupInterval: 24,
};

export class ChurchMediaDB extends Dexie {
  folders!: Table<FolderRecord, string>;
  media!: Table<MediaRecord, string>;
  blobs!: Table<BlobRecord, string>;
  playlists!: Table<PlaylistRecord, string>;
  settings!: Table<SettingsRecord, "app">;
  logs!: Table<LogRecord, number>;
  sessions!: Table<SessionRecord, string>;
  session_events!: Table<SessionEventRecord, string>;

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
    // v2 — Service History & Session Manager
    this.version(2).stores({
      folders: "id, parentId, name, updatedAt",
      media: "id, folderId, type, name, createdAt, lastUsedAt, updatedAt",
      blobs: "id, kind",
      playlists: "id, name, updatedAt",
      settings: "key",
      logs: "++id, ts, level",
      sessions: "id, date, startedAt, status",
      session_events: "id, sessionId, ts, eventType, module",
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
