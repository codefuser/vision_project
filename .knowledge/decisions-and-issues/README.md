# Important Development Decisions & Known Issues

## 1. Important Development Decisions

### A. Offline-First Architecture via IndexedDB (`Dexie` & `idb-keyval`)
* **Decision**: All application assets (Bible verses, ~17,000 songs, uploaded media files, themes, playlists, and settings) are stored locally in the browser's IndexedDB.
* **Rationale**: Church sanctuaries frequently suffer from weak, congested, or non-existent Wi-Fi during worship services. Once initial datasets are downloaded, the software runs **100% offline** without any network dependency.

### B. Local Dual-Screen IPC via `BroadcastChannel`
* **Decision**: Communication between the operator workspace and the projector popup uses browser `BroadcastChannel` rather than a local WebSocket server.
* **Rationale**:
  * Delivers sub-millisecond local message delivery.
  * Zero setup required by the church media operator (no localhost ports, no firewall warnings).
  * Works natively across separate browser tabs and popups on the same origin.

### C. Supabase Realtime for Remote & Live QR
* **Decision**: Mobile remote and Live QR streaming use Supabase Realtime WebSocket broadcast channels rather than WebRTC or local LAN HTTP.
* **Rationale**: Churches often have guest Wi-Fi networks isolated from production networks, or pastors using mobile cellular data (4G/5G). Cloud broadcast channels bridge these network gaps instantly with zero router configuration.

### D. Zero-Knowledge Cryptographic Remote Auth
* **Decision**: Challenge-response authentication via SHA-256 with client nonces and random salts.
* **Rationale**: Prevents session hijacking, replay attacks, and eavesdropping. The plaintext password is never transmitted across the wire, even in encrypted form.

### E. Framework-Free `ProjectionEngine` Singleton
* **Decision**: The core projection engine (`src/projection/engine.ts`) is written in pure TypeScript without any React hooks or JSX.
* **Rationale**: Decouples the projection domain logic from UI rendering lifecycles. Makes the engine effortlessly portable to web workers, headless testing suites, or an Electron main process.

### F. Dedicated Web Worker for Song Search
* **Decision**: Song search operations run inside `song-search.worker.ts`.
* **Rationale**: Evaluating multi-stage fuzzy ranking, Tanglish transliteration checks, and phonetic stemming across ~17,000 songs on every keystroke consumes significant CPU. Offloading to a Web Worker keeps the operator UI at a fluid 60fps.

---

## 2. Known Issues, Gotchas & Mitigation

| Issue / Gotcha | Root Cause | Implemented Mitigation |
| :--- | :--- | :--- |
| **Popup Blocking on Projector Launch** | Modern browsers block `window.open` unless called inside a direct, synchronous user gesture (click/key event). | `openProjector()` is strictly called from button clicks. If blocked, `OpenProjectorResult` returns `reason: "popup-blocked"` and prompts the user with an actionable toast to allow popups. |
| **Cross-Screen Placement Security** | Browsers restrict arbitrary window placement across external monitors unless the user grants Window Management permission. | Uses `requestScreenDetails()`. If permission is denied, it opens the popup on the current screen and allows the operator to drag it to the second monitor. |
| **SSR Crash on IndexedDB Access** | IndexedDB (`window.indexedDB`) does not exist in the Node/Nitro SSR environment. | `db()` throws if `typeof window === "undefined"`. All components performing DB operations are shielded by `useEffect`, client route boundaries, or `typeof window !== "undefined"` checks. |
| **Nitro / h3 Error Swallowing** | Nitro's h3 server engine catches in-handler SSR errors and converts them to JSON `{"unhandled":true,"message":"HTTPError"}` without triggering standard catch blocks. | `src/server.ts` uses `normalizeCatastrophicSsrResponse` to inspect response content-type and body, intercepting swallowed 500s and rendering a custom error page. |
| **Tamil Grapheme Cluster Splitting** | Standard JavaScript `.slice()` or string truncation splits multi-byte Tamil characters, leaving orphaned vowel markers (*kombu*, *pulli*). | `src/lib/songs/grapheme.ts` uses `Intl.Segmenter` (`granularity: "grapheme"`) to safely truncate Tamil strings without corrupting glyphs. |
| **Browser Storage Quota Limits** | Large 4K video uploads can fill the browser's IndexedDB quota (typically 50-80% of free disk space). | Warns users when media sizes are exceptionally large. `fflate` compression is utilized during backup export to minimize memory footprint. |

---

## 3. Desktop Readiness (Electron Roadmap)

The repository contains `tsconfig.electron.json` and build exclusions in `.gitignore`.
* **Planned Desktop Integration**: Wrapping the Vite output in Electron will allow:
  1. Direct hardware window positioning without browser popup permission prompts.
  2. Native file system access for large video libraries.
  3. Auto-start on system boot for dedicated church media PCs.
