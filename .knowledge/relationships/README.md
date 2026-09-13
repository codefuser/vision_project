# Entity & Component Relationships Matrix

This document defines the clear relationship structure between all entities, files, components, APIs, and features across the VersoLyn codebase.

---

## 1. System-Wide Relationship Graph

```
                                      ┌────────────────────────┐
                                      │   src/routes/__root    │
                                      └───────────┬────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         │                                                 │
                         ▼                                                 ▼
             ┌───────────────────────┐                         ┌───────────────────────┐
             │   Regular Operator    │                         │    Isolated Routes    │
             │       AppShell        │                         │  (/project, /remote,  │
             └───────────┬───────────┘                         │        /live)         │
                         │                                     └───────────┬───────────┘
                         ▼                                                 │
             ┌───────────────────────┐                                     │
             │  ProjectionWorkspace  │                                     │
             └───────────┬───────────┘                                     │
                         │                                                 │
          ┌──────────────┴──────────────┐                                  │
          ▼                             ▼                                  │
┌───────────────────┐         ┌───────────────────┐                        │
│  LivePreviewPanel │         │ WorkspaceTabsPanel│                        │
└─────────┬─────────┘         └─────────┬─────────┘                        │
          │                             │                                  │
          │                             ├─────────────┬─────────────┐      │
          │                             ▼             ▼             ▼      │
          │                        BiblePanel    SongsPanel     TextPanel  │
          │                             │             │             │      │
          │                             ▼             ▼             ▼      │
          │                        bible.adapter  song.adapter text.adapter│
          │                             │             │             │      │
          └─────────────────────────────┼─────────────┴─────────────┘      │
                                        ▼                                  │
                              ┌───────────────────┐                        │
                              │ ProjectionEngine  │                        │
                              └─────────┬─────────┘                        │
                                        │                                  │
                   ┌────────────────────┴────────────────────┐             │
                   ▼                                         ▼             │
         ┌───────────────────┐                     ┌───────────────────┐   │
         │   projectionEvents│                     │useProjection.send │   │
         │     (EventBus)    │                     │ (BroadcastChannel)│   │
         └─────────┬─────────┘                     └─────────┬─────────┘   │
                   │                                         │             │
                   ▼                                         ▼             ▼
         ┌───────────────────┐                     ┌───────────────────────────┐
         │  sessionRecorder  │                     │     ProjectionWindow      │
         │  (SessionHistory) │                     │   (External Projector)    │
         └─────────┬─────────┘                     └─────────┬─────────────────┘
                   │                                         │
                   ▼                                         ▼
         ┌───────────────────┐                     ┌───────────────────────────┐
         │ Dexie (sessions)  │                     │   TextOverlayRenderer     │
         │  IndexedDB Store  │                     │  & ProjectionRenderer     │
         └───────────────────┘                     └───────────────────────────┘
```

---

## 2. Cross-Entity Dependency Map

### A. Bible Presentation Flow
1. **Trigger**: User selects a verse or submits a reference search in `BiblePanel.tsx`.
2. **Data Source**: Fetches verse text from `idb-keyval` cache via `src/lib/bible/loader.ts`.
3. **Adapter**: Calls `projectVerse()` in `src/projection/adapters/bible.adapter.ts`.
4. **Engine**: Adapter invokes `ProjectionEngine.project(content)` (`src/projection/engine.ts`).
5. **IPC Dispatch**: `ProjectionEngine` dispatches `LOAD_TEXT` via `useProjection.send()` to `BroadcastChannel`.
6. **Local State**: `useProjection` store optimistically updates `LivePreviewPanel.tsx`.
7. **External Window**: `ProjectionWindow.tsx` receives `LOAD_TEXT` and renders `TextOverlayRenderer.tsx`.
8. **Logging**: `ProjectionEngine` emits `CONTENT_PROJECTED` on `projectionEvents` bus.
9. **History**: `sessionRecorder` captures the event and persists it in Dexie table `session_events`.

### B. Song Presentation Flow
1. **Search**: Keystroke in `SongsPanel.tsx` is posted to `src/lib/songs/song-search.worker.ts`.
2. **Scoring**: Worker executes phonetic Tanglish and normalized stemming ranking against cached songs.
3. **Slide Select**: Operator clicks a slide card in the split-view panel.
4. **Adapter**: Calls `projectSongSlide()` in `src/projection/adapters/song.adapter.ts`.
5. **Engine**: Formats slide into `TextOverlay` (`textTa` populated, reference blanked) and calls `ProjectionEngine`.
6. **Projector**: Projector window renders lyrics without title metadata for clean worship projection.
7. **History**: Logged as `SONG_PROJECTED` in session history.

### C. Media & Playlist Flow
1. **Selection**: Operator clicks a media item in `LibraryExplorerGrid.tsx` or plays a cue in `PlaylistEditor.tsx`.
2. **Adapter**: `MediaAdapter.projectMedia()` or `MediaAdapter.projectPlaylist()`.
3. **Engine**: Issues `LOAD { mediaId }` or `LOAD_PLAYLIST { playlistId, startIndex }`.
4. **Blob Resolution**: Projector receives ID, queries Dexie table `blobs`, and generates an object URL.
5. **Render**: `BackgroundLayer.tsx` displays image or video with transitions.

### D. Mobile Remote Flow
1. **Connection**: Phone connects to `vp_remote_{sessionId}` via Supabase Realtime.
2. **Auth**: Phone submits `AUTH_REQUEST` with salted SHA-256 challenge response.
3. **Host Verification**: `remote-host.store.ts` validates proof, issues session token, and transmits `syncState`.
4. **Action**: User taps a verse or song slide on phone.
5. **Execution**: Phone emits `COMMAND`. Host verifies session token and invokes the matching local adapter (`projectVerse`, `projectSongSlide`, etc.).
6. **Re-Broadcast**: Host emits `STATE_DELTA` to update all connected remote devices.

### E. Live QR Viewer Flow
1. **Host Broadcaster**: `live-qr-host.store.ts` listens to `projectionEvents` bus.
2. **Downscale**: For images, host generates $<25\text{KB}$ 640px JPEG data URLs.
3. **Broadcast**: Transmits `LIVE_PROJECTION_UPDATE` over channel `vp_live_{token}`.
4. **Viewer**: Phone renders `LiveViewerPage.tsx`, displaying identical typography, styling, and verse layout.

---

## 3. Store Dependency Matrix

| Store | Depends On | Consumed By |
| :--- | :--- | :--- |
| `useProjection` | `src/lib/broadcast.ts`<br>`src/lib/display/screen-manager.ts` | `ProjectionWorkspace`<br>`LivePreviewPanel`<br>`ProjectionWindow`<br>`AppShell`<br>`GlobalShortcuts` |
| `useWorkspace` | `localStorage` | `ProjectionWorkspace`<br>`WorkspaceTabsPanel`<br>`BiblePanel`<br>`SongsPanel`<br>`TextPanel` |
| `useSettings` | `src/db/repo.ts` (Dexie) | `AppShell`<br>`SettingsPage`<br>`IndexRoute`<br>`TextFormattingPanel` |
| `useTextFormat` | `localStorage` | `TextFormattingPanel`<br>`TextOverlayRenderer`<br>`LivePreviewPanel`<br>`ProjectionWindow` |
| `useBackground` | `localStorage` | `BackgroundLayer`<br>`ThemeGalleryDialog`<br>`TextFormattingPanel` |
| `useLogo` | `localStorage` | `LogoLayer`<br>`TextFormattingPanel`<br>`ProjectionWindow` |
| `useBibleStore` | `src/lib/bible/loader.ts`<br>`idb-keyval` | `BiblePanel`<br>`remote-host.store.ts` |
| `useSongsStore` | `src/lib/songs/loader.ts`<br>`src/lib/songs/song-search.worker.ts` | `SongsPanel`<br>`SongEditorDialog`<br>`remote-host.store.ts` |
| `useHostRemote` | `src/lib/supabase.ts`<br>`src/features/remote/remote-crypto.ts` | `RemoteControlDialog`<br>`AppShell` |
| `useHostLiveQr` | `src/lib/supabase.ts`<br>`src/projection/event-bus.ts` | `LiveQrDialog`<br>`AppShell` |
| `useSessionHistory` | `src/features/history/session-history.repo.ts` | `SessionListPage`<br>`SessionDetailPage`<br>`AppShell` |
