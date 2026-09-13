# System Architecture & Topology

## 1. High-Level Architecture Overview

VersoLyn is a hybrid **Offline-First Full-Stack Web Application** built using **TanStack Start**, **Vite 7**, **React 19**, **Nitro**, **TailwindCSS v4**, **Dexie.js (IndexedDB)**, and **Supabase**.

```
                           ┌────────────────────────────────────────────────┐
                           │          Nitro / TanStack Start Server         │
                           │   (Vercel Preset / Node / Cloudflare Workers)  │
                           └───────────────────────┬────────────────────────┘
                                                   │ SSR HTML & Static Assets
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           Client Browser Runtime                                        │
│                                                                                                        │
│  ┌─────────────────────────────────┐        BroadcastChannel       ┌─────────────────────────────────┐ │
│  │     Operator Control Window     │      ('church-projection')    │     Projector Window Popup      │ │
│  │         (/project, /)           ├──────────────────────────────►│    (/project in pop-up mode)    │ │
│  │                                 │◄──────────────────────────────┤                                 │ │
│  │  - AppShell + Navigation        │        Wire State Sync        │  - True 16:9 Fullscreen Canvas  │ │
│  │  - ProjectionWorkspace          │                               │  - TextOverlayRenderer          │ │
│  │  - LivePreviewPanel             │                               │  - BackgroundLayer (Video/Img)  │ │
│  │  - WorkspaceTabsPanel           │                               │  - LogoLayer                    │ │
│  │  - TextFormattingPanel          │                               │  - Adaptive Aspect Ratio Fit    │ │
│  │  - ProjectionEngine Singleton   │                               └─────────────────────────────────┘ │
│  └────────────────┬────────────────┘                                                                    │
│                   │                                                                                    │
│                   ├──────────────────────────────────┐                                                 │
│                   ▼                                  ▼                                                 │
│    ┌──────────────────────────────┐   ┌──────────────────────────────┐                                 │
│    │     Local IndexedDB Cache    │   │      Browser Web Workers     │                                 │
│    │  - Dexie (church-media-db)   │   │  - song-search.worker.ts     │                                 │
│    │  - idb-keyval (Bible, Songs) │   │    (off-thread ~17k search)  │                                 │
│    └──────────────────────────────┘   └──────────────────────────────┘                                 │
└───────────────────▲──────────────────────────────────────────────────▲─────────────────────────────────┘
                    │                                                  │
                    │ Delta Sync & Datasets                            │ Bidirectional Broadcasts
                    ▼                                                  ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      Supabase Backend Cloud                                            │
│                                                                                                        │
│   ┌─────────────────────────────────────────┐          ┌────────────────────────────────────────────┐  │
│   │             Postgres Database           │          │              Realtime Channels             │  │
│   │  - songs (~17,000 Tamil lyrics)         │          │  - vp_remote_{sessionId} (Phone Control)   │  │
│   │  - english_bible (31,102 KJV verses)    │          │  - vp_live_{token} (Congregation Live QR)  │  │
│   │  - tamil_bible (31,102 Tamil verses)    │          │                                            │  │
│   └─────────────────────────────────────────┘          └────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Window Execution Environments

The application detects its execution context and isolates behavior dynamically:

### A. Operator Workspace Window
* **Routes**: `/`, `/project`, `/library`, `/playlists`, `/history`, `/settings`, etc.
* **Layout**: Wrapped inside `AppShell` with full sidebar navigation, status bar, command palette (`Ctrl+K`), global shortcuts, and diagnostics.
* **Responsibilities**: Media preparation, live cueing, scripture and song searching, playlist ordering, session recording.

### B. Projector Output Window (Popup Mode)
* **Route**: `/project` opened via `window.open('/project', 'church-projector', ...)`
* **Detection Invariant**: `window.opener != null && window.name === 'church-projector'`
* **Layout**: Complete isolation (`isIsolated = true` in `__root.tsx`). Strips `AppShell`, `GlobalShortcuts`, `ShortcutsDialog`, and command palettes.
* **Rendering**: Mounts `ProjectionWindow.tsx`, maintaining a pure 16:9 canvas with hardware-accelerated text rendering, video playback, and logo watermarks.

### C. Mobile Remote Controller
* **Route**: `/remote`
* **Layout**: `isIsolated = true` in `__root.tsx`. Mobile-first responsive touch layout with bottom navigation tabs (Verse, Song, Media, Text), slide cue buttons, and transport controls.
* **Communication**: Connects over Supabase Realtime channel `vp_remote_{sessionId}`.

### D. Congregation Live Viewer
* **Route**: `/live?t={token}`
* **Layout**: `isIsolated = true` in `__root.tsx`. Minimal mobile/desktop presentation viewer streaming the authoritative projection in near-real-time.
* **Communication**: Connects over Supabase Realtime channel `vp_live_{token}`.

---

## 3. Inter-Process Communication (IPC)

### Local IPC: `BroadcastChannel`
* **Channel Name**: `church-projection`
* **Implementation**: `src/lib/broadcast.ts` and `src/stores/projection.store.ts`
* **Protocol Commands**:
  * `LOAD`: Load media ID into projector.
  * `LOAD_PLAYLIST`: Load playlist with `startIndex`.
  * `LOAD_TEXT`: Transmit `TextOverlay`, `TextStyle`, and `GroupedStyles`.
  * `UPDATE_TEXT_STYLE` / `UPDATE_STYLES`: Live styling updates.
  * `UPDATE_BACKGROUND`: Live background color/gradient/media changes.
  * `UPDATE_LOGO`: Toggle or reposition church logo watermark.
  * `UPDATE_SCALING`: Toggle projection aspect scaling (`auto`, `fit`, `fill`, `stretch`, `original`).
  * `PLAY`, `PAUSE`, `STOP`, `NEXT`, `PREV`, `SEEK`, `VOLUME`, `MUTE`, `BLACK`, `RATE`, `LOOP`, `PING`.
* **State Reporting**: The projector popup emits `STATE` frames back to the operator window to sync playhead positions, video durations, and transport flags.

### Remote IPC: Supabase Realtime Broadcast
* **Host-to-Remote**: Supabase WebSocket broadcast channel `vp_remote_{sessionId}`.
* **Host-to-Viewer**: Supabase WebSocket broadcast channel `vp_live_{token}`.
* **Latency**: Sub-100ms globally over WebSocket without requiring custom backend servers or port forwarding on church routers.

---

## 4. Multi-Display Screen Management

Implemented in `src/lib/display/screen-manager.ts` and `src/stores/projection.store.ts`:
* Uses the modern browser **Window Management API** (`window.getScreenDetails()`).
* **Auto-Discovery**: Automatically enumerates connected screens, distinguishes primary (laptop) screen from secondary (projector/TV) screens.
* **Placement**: Opens the popup directly at coordinates `{ left: screen.availLeft, top: screen.availTop, width: screen.availWidth, height: screen.availHeight }`.
* **Fallback**: Gracefully falls back to browser standard popup dimensions if screen details permission is denied or unsupported.

---

## 5. State Management Topology

The application uses **Zustand 5** stores segmented by domain:

| Store Name | Path | Persistence | Scope & Responsibility |
| :--- | :--- | :--- | :--- |
| `useProjection` | `src/stores/projection.store.ts` | Memory + IPC | Projector window handle, BroadcastChannel communication, wire transport. |
| `useWorkspace` | `src/features/workspace/workspace.store.ts` | `localStorage` | Operator layout dimensions, panel collapse states, active workspace tab. |
| `useSettings` | `src/stores/settings.store.ts` | Dexie DB | System settings, typography defaults, startup behavior, dark/light theme. |
| `useTextFormat` | `src/lib/text-format/store.ts` | `localStorage` | Live text styling (Reference, Tamil, English), fonts, sizes, colors, shadows. |
| `useBackground` | `src/stores/background.store.ts` | `localStorage` | Projection background configuration (color, gradient, media, animation). |
| `useLogo` | `src/stores/logo.store.ts` | `localStorage` | Logo watermark image, placement, opacity, sizing. |
| `useBibleStore` | `src/lib/bible/store.ts` | Memory + idb | Bible language selection, verse queries, loaded state, favorites. |
| `useSongsStore` | `src/lib/songs/store.ts` | Memory + idb | Song library state, search query, selected song, user songs. |
| `useTextItems` | `src/stores/text-items.store.ts` | `localStorage` | Quick live text items, announcements, prayer points. |
| `useHostRemote` | `src/features/remote/remote-host.store.ts` | Memory + session | Laptop remote control host server, authorized devices, state broadcast. |
| `useClientRemote` | `src/features/remote/remote-client.store.ts` | Memory + local | Mobile phone remote client, auth token, command dispatch. |
| `useHostLiveQr` | `src/features/live-qr/live-qr-host.store.ts` | `localStorage` | Laptop Live QR broadcast session, expiration timer, viewer presence. |
| `useClientLiveQr` | `src/features/live-qr/live-qr-client.store.ts` | Memory | Congregation viewer client state, live projection frame renderer. |
| `useSessionHistory` | `src/features/history/session-history.store.ts` | Dexie DB | Service session history, active session tracker, search filter. |
