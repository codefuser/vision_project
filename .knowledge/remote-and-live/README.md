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
* **0ms Optimistic Feedback & Anti-Jitter**: Verse cards, song slides, and media cards use local optimistic live state (`optimisticLiveVerse`, `optimisticLiveSlide`, `optimisticLiveMediaId`). Tapping a verse or slide instantly renders the glowing `LIVE` badge in 0ms without waiting for WebSocket roundtrips or being reverted by out-of-order in-flight network packets.
* **Lightweight Delta Broadcasting**: Fast projection actions (`PROJECT_VERSE`, `PROJECT_SONG_SLIDE`, `PROJECT_MEDIA`, `PROJECT_TEXT`) bypass heavy Dexie database queries and broadcast sub-kilobyte `STATE_DELTA` packets directly to connected clients for near-instant latency.
* **Bottom Navigation**: Fixed thumb-zone navigation bar switching between **Verse**, **Song**, **Media**, and **Text**.
* **Docked "Now Playing" Mini-Bar**: Docked above the bottom navigation, providing real-time live projection status, current slide counters (`Slide X/Y`), and inline `Prev`/`Next` slide triggers without opening a modal.
* **Bible Tab**: Book picker with instant text filtering, dedicated rapid Chapter Picker Grid modal, and Tamil/English bilingual switching.
* **Song Tab**: Instant search against ~17,000 songs, split slide cards with slide sequence badges, active live glowing borders, and floating quick navigation.
* **Media Tab**: 16:9 aspect-ratio media cards with uncropped `object-contain` framing, high-resolution 640x360 thumbnail streaming, type indicators, and active live projection badges.
* **Text Tab**: Quick one-tap preset announcement chips (*Welcome*, *Opening Prayer*, *Offering & Tithes*, *Benediction*), custom message authoring, and saved church announcements.
* **Transport Dock**: Dedicated Blackout toggle, Stage Clear, and instant stage simulation preview.
* **Offloaded Host Search**: Mobile phones do not download the 30MB+ Bible or song datasets. Instead, search queries are transmitted to the laptop host (`SEARCH_SONGS`, `SEARCH_VERSES`), and only the matching results are broadcast back to the phone!

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
