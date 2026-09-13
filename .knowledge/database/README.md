# Database Architecture & Storage Models

## 1. Local IndexedDB Architecture (Dexie.js)

The client database is named **`church-media-db`** managed via `src/db/schema.ts` and `src/db/repo.ts`.

### SSR Safety Guard
Dexie is strictly browser-only. Calling `db()` on the server during TanStack Start SSR will throw a clean descriptive error:
```ts
export function db(): ChurchMediaDB {
  if (typeof window === "undefined") {
    throw new Error("DB is browser-only");
  }
  if (!_db) _db = new ChurchMediaDB();
  return _db;
}
```

---

## 2. Table Schemas & Indices

### Version 1 & 2 Table Definitions

| Table Name | Primary Key | Indices | Record Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| `folders` | `id` | `parentId`, `name`, `updatedAt` | `FolderRecord` | Virtual directory tree hierarchy for media files. |
| `media` | `id` | `folderId`, `type`, `name`, `createdAt`, `lastUsedAt`, `updatedAt` | `MediaRecord` | Metadata for images and videos (dimensions, duration, blob IDs). |
| `blobs` | `id` | `kind` | `BlobRecord` | Binary storage for media originals and WebP thumbnails (`Blob`). |
| `playlists` | `id` | `name`, `updatedAt` | `PlaylistRecord` | Ordered collection of media cues, transitions, and operator notes. |
| `settings` | `key` | None (singleton) | `SettingsRecord` | Key `"app"` storing complete `AppSettings` configuration. |
| `logs` | `++id` (auto) | `ts`, `level` | `LogRecord` | Error and warning events recorded by the application. |
| `sessions` | `id` | `date`, `startedAt`, `status` | `SessionRecord` | v2 — Church service sessions with auto-counted event metrics. |
| `session_events` | `id` | `sessionId`, `ts`, `eventType`, `module` | `SessionEventRecord` | v2 — Individual chronological projection events in a service. |

---

## 3. Data Models Detail

### Media & Blobs
```ts
export interface MediaRecord {
  id: string;
  name: string;
  type: "image" | "video";
  mime: string;
  size: number;
  durationMs?: number;
  width?: number;
  height?: number;
  folderId: string | null;
  blobId: string;          // FK → blobs.id (kind: "original")
  thumbBlobId: string | null; // FK → blobs.id (kind: "thumb")
  createdAt: number;
  updatedAt: number;
  lastUsedAt: number | null;
}
```

### Playlists & Cues
```ts
export interface PlaylistItem {
  id: string;
  mediaId: string;
  durationMs: number;
  transition: "fade" | "crossfade" | "zoom" | "dissolve" | "none";
  muted?: boolean;
  notes?: string;   // Operator cue notes in Service Mode
  label?: string;   // Optional cue title override
}
```

### Service Sessions & Timeline Events
```ts
export interface SessionRecord {
  id: string;
  name: string;            // e.g. "Sunday Morning Service"
  date: string;            // ISO YYYY-MM-DD
  startedAt: number;
  endedAt: number | null;
  status: "active" | "ended";
  version: string;
  totalEvents: number;
  bibleCount: number;
  songCount: number;
  imageCount: number;
  videoCount: number;
  textCount: number;
  themeCount: number;
}
```

---

## 4. `idb-keyval` High-Performance Stores

Large read-only datasets are stored separately using **`idb-keyval`** to avoid blocking Dexie transactions and eliminate relational overhead:

### A. Bible Verse Store (`src/lib/bible/loader.ts`)
* **Storage Keys**: `vision_bible_en_v1`, `vision_bible_ta_v1`
* **Data Structure**: `BibleData = string[][][]` (indexed directly as `data[book][chapter - 1][verse - 1]`).
* **Performance**: Direct array access resolves verses in **< 15ms** without SQL or search indexing overhead.
* **Cold-Boot Strategy**: Parallel download of 31,102 rows across 6 concurrent batches (pageSize 1000) from Supabase once. Persisted permanently to IndexedDB.

### B. Song Precomputed Store (`src/lib/songs/loader.ts`)
* **Storage Keys**:
  * `vision_songs_precomputed_v4`: Array of fully normalized and stemmed `Song` objects.
  * `vision_songs_last_sync_timestamp`: ISO timestamp of latest remote sync.
* **Performance**: Pre-stems ~17,000 song titles and lyrics once during download. On subsequent reloads, song loading takes **< 30ms** with zero main-thread CPU penalty.
* **Delta Sync Algorithm**:
  1. Requests remote `updated_at` from Supabase `songs` table (`limit(1)`).
  2. If local timestamp matches remote: **0 bytes downloaded**.
  3. If remote is newer: queries only `updated_at > lastSync`, merges changed songs into local store, updates cache timestamp.

---

## 5. Backup & Restore Serialization (`src/features/backup/backup.ts`)

VersoLyn exports and imports full database snapshots as `.zip` files using `fflate`:
* **Manifest (`manifest.json`)**: Contains schema version, folders, media records, playlists, app settings, and user-created songs.
* **Binary Media Archive (`blobs/*.bin`)**: Contains raw bytes of all uploaded images, videos, and generated thumbnails.
* **Restore Modes**:
  * `merge`: Upserts missing folders, media, and playlists without deleting existing content.
  * `replace`: Clears local database inside a single atomic Dexie transaction (`[folders, media, blobs, playlists, settings]`) and replaces it completely with the backup archive.
