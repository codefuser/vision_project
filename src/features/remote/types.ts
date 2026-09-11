/**
 * Remote Control protocol definitions and payload types.
 */
import type { ProjectVerseInput } from "@/projection/adapters/bible.adapter";
import type { ProjectSlideInput } from "@/projection/adapters/song.adapter";
import type { ProjectTextInput } from "@/projection/adapters/text.adapter";

export type RemoteSessionStatus = "idle" | "waiting" | "connected" | "ended";

export type ActiveRemoteTab = "verse" | "song" | "media" | "text";

export interface RemoteDevice {
  id: string;
  name: string;
  userAgent: string;
  connectedAt: number;
  lastSeenAt: number;
  enabled?: boolean;
  remoteMode?: "full" | "projection_only";
}

export interface RemoteSession {
  sessionId: string;
  salt: string;
  passwordPlain: string;
  passwordHash: string;
  status: RemoteSessionStatus;
  createdAt: number;
  connectedDevices: RemoteDevice[];
}

export interface RemoteRecentItem {
  id: string;
  title: string;
  type: string;
  projectedAt: number;
  metadata?: Record<string, any>;
}

export interface RemoteHostSyncState {
  activeTab?: ActiveRemoteTab;
  searchQuery?: {
    verse?: string;
    song?: string;
    media?: string;
    text?: string;
  };
  selectedSongId: number | null;
  selectedTextId: string | null;
  currentLive: {
    id?: string;
    title: string;
    type: string;
    details?: string;
    metadata?: Record<string, any>;
  } | null;
  blackScreen: boolean;
  recentHistory: RemoteRecentItem[];
  mediaList: Array<{
    id: string;
    name: string;
    type: "image" | "video";
    durationMs?: number;
    thumbnailUrl?: string;
  }>;
  mediaThumbnails?: Record<string, string>;
  textList: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

// ── Wire Message Payloads (Supabase Realtime Broadcast) ────────────────────────

export interface RemoteAuthRequestPayload {
  type: "AUTH_REQUEST";
  clientNonce: string;
  authProof: string;
  device: {
    id: string;
    name: string;
    userAgent: string;
  };
}

export interface RemoteAuthResponsePayload {
  type: "AUTH_RESPONSE";
  clientNonce: string;
  success: boolean;
  sessionToken?: string;
  error?: string;
  syncState?: RemoteHostSyncState;
}

export interface RemoteStateSyncPayload {
  type: "STATE_SYNC";
  syncState: RemoteHostSyncState;
}

export interface RemoteStateDeltaPayload {
  type: "STATE_DELTA";
  origin: "host" | "remote";
  originClientId?: string;
  delta: Partial<RemoteHostSyncState>;
}

export interface RemoteDevicePermissionPayload {
  type: "DEVICE_PERMISSION_STATUS";
  deviceId: string;
  clientId?: string;
  enabled: boolean;
}

export interface RemoteDeviceDisconnectedPayload {
  type: "DEVICE_DISCONNECTED";
  deviceId: string;
  clientId?: string;
  reason?: string;
}

export interface RemoteSessionEndedPayload {
  type: "SESSION_ENDED";
  reason?: string;
}

export type RemoteCommandAction =
  | {
      action: "PROJECT_VERSE";
      verseData: {
        book: number;
        chapter: number;
        verse: number;
      };
      directInput?: ProjectVerseInput;
    }
  | {
      action: "PROJECT_SONG_SLIDE";
      input: ProjectSlideInput;
    }
  | {
      action: "PROJECT_MEDIA";
      mediaId: string;
    }
  | {
      action: "PROJECT_TEXT";
      input: ProjectTextInput;
    }
  | {
      action: "TRANSPORT";
      subAction: "BLACK" | "CLEAR" | "PLAY" | "PAUSE" | "NEXT" | "PREV";
      value?: boolean | number;
    }
  | {
      action: "SYNC_TAB";
      tab: ActiveRemoteTab;
      originClientId?: string;
    }
  | {
      action: "SET_DEVICE_REMOTE_MODE";
      mode: "full" | "projection_only";
    }
  | {
      action: "SYNC_SEARCH";
      tab: ActiveRemoteTab;
      query: string;
    }
  | {
      action: "SYNC_SELECT_SONG";
      songId: number | null;
    }
  | {
      action: "SYNC_SELECT_TEXT";
      textId: string | null;
    }
  | {
      action: "REPROJECT_HISTORY";
      item: RemoteRecentItem;
    }
  | {
      action: "REQUEST_MEDIA_THUMBS";
    }
  | {
      action: "SEARCH_SONGS";
      query: string;
      requestId: string;
    }
  | {
      action: "SEARCH_VERSES";
      query: string;
      lang: "en" | "ta";
      requestId: string;
    }
  | {
      action: "GET_CHAPTER_VERSES";
      book: number;
      chapter: number;
      lang: "en" | "ta";
      requestId: string;
    };

export interface RemoteCommandPayload {
  type: "COMMAND";
  sessionId: string;
  sessionToken: string;
  clientId: string;
  command: RemoteCommandAction;
}

export interface RemoteSongSearchResultsPayload {
  type: "SONG_SEARCH_RESULTS";
  requestId: string;
  hits: Array<{
    id: number;
    title: string;
    slides: string[];
    scale: string;
  }>;
}

export interface RemoteVerseSearchResultsPayload {
  type: "VERSE_SEARCH_RESULTS";
  requestId: string;
  hits: Array<{
    book: number;
    chapter: number;
    verse: number;
    text: string;
    bookName: string;
  }>;
}

export interface RemoteChapterVersesPayload {
  type: "CHAPTER_VERSES_RESPONSE";
  requestId: string;
  book: number;
  chapter: number;
  verses: string[];
}

export interface RemoteHeartbeatPayload {
  type: "HEARTBEAT";
  clientId: string;
  sessionId: string;
}

export type RemoteBroadcastMessage =
  | RemoteAuthRequestPayload
  | RemoteAuthResponsePayload
  | RemoteStateSyncPayload
  | RemoteStateDeltaPayload
  | RemoteSessionEndedPayload
  | RemoteCommandPayload
  | RemoteHeartbeatPayload
  | RemoteSongSearchResultsPayload
  | RemoteVerseSearchResultsPayload
  | RemoteChapterVersesPayload
  | RemoteDevicePermissionPayload
  | RemoteDeviceDisconnectedPayload;
