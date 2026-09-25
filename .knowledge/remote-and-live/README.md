# Remote Control & Live QR Streaming

VersoLyn features two independent real-time wireless projection systems powered by **Supabase Realtime WebSocket Broadcast Channels**:

1. **Remote Control**: Bidirectional authenticated control for operators, pastors, and worship leaders.
2. **Live QR**: View-only streaming for the congregation and overflow rooms.

---

## 1. Remote Control Architecture (`src/features/remote/`)

```
┌─────────────────────────────────┐                       ┌─────────────────────────────────┐
│     Laptop Host Controller      │                       │      Mobile Phone Controller    │
│  (src/routes/project.tsx /      │                       │     (src/routes/remote.tsx)     │
│   src/features/remote/)         │                       │                                 │
│                                 │                       │                                 │
│ 1. Generates sessionId & salt   │                       │                                 │
│ 2. Subscribes to Realtime:      │                       │                                 │
│    channel 'vp_remote_{id}'     │                       │                                 │
│ 3. Displays QR code on screen   │                       │                                 │
│                                 │      Scan QR Code     │                                 │
│                                 │◄──────────────────────┤ 4. Reads sessionId & password   │
│                                 │                       │ 5. Generates random clientNonce │
│                                 │     AUTH_REQUEST      │ 6. Computes SHA-256 authProof   │
│                                 │◄──────────────────────┤    (salted challenge-response)  │
│ 7. Verifies proof locally       │                       │                                 │
│ 8. Computes sessionToken        │     AUTH_RESPONSE     │                                 │
│ 9. Sends full syncState         ├──────────────────────►│ 10. Stores sessionToken         │
│                                 │                       │                                 │
│                                 │        COMMAND        │                                 │
│ 12. Validates sessionToken      │◄──────────────────────┤ 11. Dispatches projection cue   │
│ 13. Calls Projection Adapter    │                       │     (Verse / Song / Media / Tr.)│
│ 14. Projects live on screen     │      STATE_DELTA      │                                 │
│                                 ├──────────────────────►│ 15. Updates UI to live preview  │
└─────────────────────────────────┘                       └─────────────────────────────────┘
```

---

## 2. Zero-Knowledge Cryptographic Authentication Flow

Implemented using the standard Web Crypto API in `src/features/remote/remote-crypto.ts`.

### Security Invariant
**The plaintext password is NEVER transmitted across the network.**

### The Handshake Steps:
1. **Host Setup**:
   * Host generates `sessionId` (e.g. `vp-48kmz2`).
   * Host generates 16-character cryptographic salt (`generateSalt()`).
   * Host creates 6-character user-friendly passphrase (`passwordPlain`).
2. **Client Challenge Computation**:
   * Client generates a unique random `clientNonce`.
   * Client calculates:
     $$\text{authProof} = \text{SHA256}(\text{password} + \text{"::"} + \text{salt} + \text{"::"} + \text{sessionId} + \text{"::"} + \text{clientNonce})$$
3. **Verification**:
   * Client sends `AUTH_REQUEST { clientNonce, authProof, device }`.
   * Host independently calculates the exact same hash using its local `passwordPlain`.
   * If `calculatedProof === receivedProof`:
     * Host issues `sessionToken = SHA256("TOKEN::" + sessionId + "::" + clientNonce + "::" + password)`.
     * Host responds with `AUTH_RESPONSE { success: true, sessionToken, syncState }`.
4. **Command Execution**:
   * Every incoming `COMMAND` payload is verified against `sessionToken`. Unauthorized commands are dropped immediately.

---

## 3. Remote Capabilities & Ergonomics

The mobile remote app is optimized for single-thumb smartphone operation during live church services:
* **Bidirectional Tab & Song Synchronization**: When **Sync** mode (`remoteControlMode === "full"`) is enabled, switching tabs on the phone dispatches `SYNC_TAB` to switch the laptop view, and switching tabs on the laptop dispatches `STATE_DELTA { activeTab }` to switch the phone view. Selecting a song on the phone dispatches `SYNC_SELECT_SONG` which immediately switches the laptop to the Songs tab and selects the song to display its lyric slides.
* **Full Song Slide Delivery (`selectedSongData`)**: When the laptop selects a song, the host broadcasts `STATE_DELTA { selectedSongId, selectedSongData: { id, title, slides[], scale } }`. The phone's `MobileSongTab` uses this to auto-open the slide view with **all slides** instantly — no phone-side search needed. This fixes the "only 1 slide" bug that occurred when the laptop-selected song wasn't in the phone's search results.
* **0ms Optimistic Feedback & Anti-Jitter**: Verse cards, song slides, and media cards use local optimistic live state (`optimisticLiveVerse`, `optimisticLiveSlide`, `optimisticLiveMediaId`). Tapping a verse or slide instantly renders the glowing `LIVE` badge in 0ms without waiting for WebSocket roundtrips or being reverted by out-of-order in-flight network packets.
* **Lightweight Delta Broadcasting**: Fast projection actions (`PROJECT_VERSE`, `PROJECT_SONG_SLIDE`, `PROJECT_MEDIA`, `PROJECT_TEXT`) bypass heavy Dexie database queries and broadcast sub-kilobyte `STATE_DELTA` packets directly to connected clients for near-instant latency.
* **Debounced Full-Sync (50ms coalesce)**: `projectionEngine.onAny()`, `projectionEvents.on("CONTENT_PROJECTED")`, and `useProjection.subscribe()` all share a single `makeDebouncedSync(50)` debouncer. All rapid-fire events collapse into one `broadcastSyncState()` per 50ms burst — eliminating the 3× redundant full-syncs that previously fired per projection action.
* **Fast-Projection Suppression Guard**: After every `broadcastDelta()` for a `PROJECT_*` action, `suppressNextDebouncedSync(120)` is called. This suppresses the debounced full-sync for 120ms, preventing a redundant full STATE_SYNC from following a fast STATE_DELTA.
* **Bottom Navigation**: Fixed thumb-zone navigation bar switching between **Verse**, **Song**, **Media**, and **Text**.
* **Docked "Now Playing" Mini-Bar**: Docked above the bottom navigation, providing real-time live projection status, current slide counters (`Slide X/Y`), and inline `Prev`/`Next` slide triggers without opening a modal.
* **Bible Tab**: Book picker with instant text filtering, dedicated rapid Chapter Picker Grid modal, and Tamil/English bilingual switching.
* **Song Tab**: Instant search against ~17,000 songs, split slide cards with slide sequence badges, active live glowing borders, and floating quick navigation.
* **Media Tab**: 16:9 aspect-ratio media cards with uncropped `object-contain` framing, high-resolution 640x360 thumbnail streaming, type indicators, and active live projection badges.
* **Text Tab**: Quick one-tap preset announcement chips (*Welcome*, *Opening Prayer*, *Offering & Tithes*, *Benediction*), custom message authoring, and saved church announcements.
* **Transport Dock**: Dedicated Blackout toggle, Stage Clear, and instant stage simulation preview.
* **Offloaded Host Search**: Mobile phones do not download the 30MB+ Bible or song datasets. Instead, search queries are transmitted to the laptop host (`SEARCH_SONGS`, `SEARCH_VERSES`), and only the matching results are broadcast back to the phone!

### Key Invariants (added 2026-09-20)
| Invariant | Detail |
|---|---|
| `selectedSongData` in `RemoteHostSyncState` | Carries `{ id, title, slides[], scale? }` — always populated when `selectedSongId` is set and songs are loaded |
| `selectedVerseData` in `RemoteHostSyncState` | Carries `{ book, chapter, lang, verses[] }` — populated from `PROJECT_VERSE` fast delta AND `buildSyncState()` when `currentLive` is `bible_verse` |
| `suppressNextDebouncedSync(ms)` | Must be called after every `PROJECT_*` `broadcastDelta()` in the host COMMAND handler |
| `debouncedSync` coalesces 3 listeners | `projectionEngine.onAny`, `CONTENT_PROJECTED`, `useProjection.subscribe` — all share one 50ms debouncer |
| `MobileSongTab` auto-opens slide view | `useEffect([selectedSongData])` auto-sets `activeSong` when host pushes new `selectedSongData` |
| `MobileVerseTab` auto-navigates on verse project | `useEffect([currentLive, debouncedQuery])` sets `activeBook`+`activeChapter` when `currentLive.type === "bible_verse"` and not actively searching |
| `MobileVerseTab` skips GET_CHAPTER_VERSES | `useEffect([selectedVerseData])` populates `chapterVerses` directly; chapter load effect short-circuits when `selectedVerseData` matches current book+chapter |

---

## 4. Live QR Congregation Streaming (`src/features/live-qr/`)

A dedicated public broadcast service completely decoupled from the remote control:

* **Host Store**: `src/features/live-qr/live-qr-host.store.ts`
* **Client Store**: `src/features/live-qr/live-qr-client.store.ts`
* **Route**: `/live?t={token}` (`src/routes/live.tsx`)
* **Realtime Channel**: `vp_live_{token}`

### Performance Optimizations for Congregation Wi-Fi:
* **High-Definition Image Streaming**: Projected images are rendered to an off-screen canvas up to $1280\text{px}$ wide with `imageSmoothingQuality = "high"` and compressed as JPEG ($0.82$ quality) providing sharp HD projection for mobile screens while maintaining sub-100KB payload efficiency.
* **Text Priority Overlays**: Text projections (`bible_verse`, `song_slide`, `live_text`) immediately take precedence over earlier background media in the live QR broadcast resolver.
* **Text Mirroring**: Verses and lyrics are transmitted as raw text objects with typographic styling tokens. The phone reconstructs the exact visual layout on its local GPU without consuming video streaming bandwidth.
* **Auto-Expiration**: Presets for 1 hour, 3 hours, 6 hours, 12 hours, 1 day, 3 days, or 7 days.

---

## 5. Browser-Based Remote Desktop Control (`src/features/remote-desktop/`)

VersoLyn features a secure peer-to-peer browser-based Remote Desktop system (`/remote-desktop`):
* **Signaling & ICE Buffering**: Supabase Realtime channel `rd_session_{sessionId}` exchanges SDP offers, answers, and ICE candidates. Implements `earlyCandidatesQueue` to prevent candidates from being discarded when arriving before `setRemoteDescription()`.
* **Media Streaming**: WebRTC `RTCPeerConnection` with H.264/VP9 screen capture (`getDisplayMedia()`). Controller uses a composite `MediaStream` binding with `track.onunmute`, `track.onmute`, and `track.onended` listeners.
* **Live Display Switching**: Host can switch shared screens or monitors live using `sender.replaceTrack(newTrack)` without tearing down WebRTC or renegotiating sessions.
* **Zero-Black-Screen State Machine**: `RemoteDesktopViewer` replaces blank screens with real-time contextual overlays:
  - "Waiting for Host screen..." (when screen capture has not started)
  - "Host stopped screen sharing." (with `[Request Screen Share]` trigger)
  - "Remote video connection failed." (with `[Retry Connection]` re-negotiation trigger)
* **Diagnostics & Telemetry**: Toggleable development diagnostics HUD tracking WebRTC peer state, ICE state, signaling channel status, video/audio track counts, video resolution (width x height), FPS, bitrate (Mbps), RTT latency, and ICE candidate counts.
* **Input Synchronization**: Low-latency `RTCDataChannel` transmitting normalized `(u, v)` coordinates accounting for letterboxing, pillarboxing, zoom, and fullscreen, plus mouse events, wheel scrolls, drag-and-drop, and keystrokes.
* **Security & Approval**:
  * 6-digit numeric pairing PIN with automatic expiry.
  * Explicit host approval modal showing controller device details before establishing connection.
  * Sticky host banner: "REMOTE CONTROL ACTIVE" with "Pause Input" and "STOP REMOTE ACCESS" emergency cutoff.
* **Native Companion Agent (`native-agent/`)**:
  * Lightweight Node.js bridge communicating with Windows OS via Win32 `SetCursorPos`, `mouse_event`, and `keybd_event` using PowerShell P/Invoke runner.
  * Multi-monitor detection querying `[System.Windows.Forms.Screen]::AllScreens`.
  * Expanded keyboard shortcuts: `Win+D` (Show Desktop), `Ctrl+S` (Save), `Ctrl+C` (Copy), `Ctrl+V` (Paste), `Alt+Tab`, `Esc`, `Task Manager`, and Function keys `F1-F12`.
  * **Security Protections**:
    - Strict WebSocket `Origin` validation restricting connections to `https://versolyn.vercel.app` and local dev hosts (`localhost`, `127.0.0.1`).
    - Pairing PIN/Token handshake requirement issuing ephemeral `sessionToken` before accepting privileged commands.
    - Base64 clipboard data transport to PowerShell with strict character validation (`/^[A-Za-z0-9+/=]+$/`), preventing command injection and quote breakout.

---

## 6. Performance Architecture & Instant Tab Navigation

To prevent UI thread freezes during tab transitions, the application employs:
* **Route-Level Code Splitting**: All major routes (`/library`, `/playlists`, `/project`, `/settings`, `/remote-desktop`) are lazy loaded with React `Suspense` and render instant (<16ms) glassmorphic skeletons (`src/components/skeletons/RouteSkeletons.tsx`).
* **Internal Workspace Tab Isolation**: `WorkspaceTabsPanel.tsx` dynamically loads `LibraryPage`, `BiblePanel`, `SongsPanel`, and `TextPanel` on-demand using `React.lazy()` with `LazyKeepAlive` preservation so inactive tabs don't consume memory or block tab switching.
* **Progressive Dataset Streaming**:
  * Songs (`src/lib/songs/loader.ts`): Immediate tier-1 batch of 150 songs unblocks search UI in ~80ms; remaining ~17,000 songs stream in the background with micro-yield thread pauses. Removed synchronous 85,000-line slide stemming loop from the main thread.
  * Bible (`src/lib/bible/loader.ts`): Foundation batch (2,000 verses in ~120ms) loads instantly; remaining books background stream without 32 concurrent request spikes. `ensureChapterLoaded(lang, book, chapter)` delivers <30ms on-demand lookups.
* **Startup Contention Elimination**: `startup-manager.ts` deferred bulk downloads to idle time via `requestIdleCallback` (4.5s delay).
* **Search Debouncing**: Library toolbar search queries are debounced by 150ms.
* **Playlist Thumbnail Caching**: `PlaylistCard` prioritizes the first 4 items for thumbnail mosaics with an in-memory `Map<string, MediaRecord>` cache, avoiding hundreds of concurrent IndexedDB queries.
