# VersoLyn Project Knowledge Base (Project Memory)

Welcome to the persistent knowledge base for **VersoLyn (Vision Projector)** — a high-performance, offline-first church presentation web application built with React 19, Vite 7, TanStack Start & Router, TailwindCSS v4, Dexie (IndexedDB), and Supabase.

This repository memory is structured so that any future AI agent or human engineer can quickly retrieve domain-specific context without having to scan the entire workspace.

---

## 🗂️ Knowledge Base Directory Structure

| Document | Primary Domain & Coverage |
| :--- | :--- |
| **[Architecture](architecture/README.md)** | System topology, dual-window projector architecture, SSR boundary, BroadcastChannel IPC, screen management. |
| **[Frontend & UI](frontend/README.md)** | Routing structure, AppShell, workspace split-panels, virtualized lists, responsive layouts, Radix UI dialogs. |
| **[Backend & APIs](backend/README.md)** | TanStack Start server entry, Nitro (Vercel preset), catastrophic SSR shielding, server functions, environment config. |
| **[Database & Storage](database/README.md)** | Dexie (IndexedDB) schema v1/v2, `idb-keyval` stores, Supabase tables, blob storage, backup ZIP format. |
| **[Projection Engine](projection-engine/README.md)** | Universal Projection Content Model, `ProjectionEngine` singleton, event bus, adapters, rendering pipeline, scaling math. |
| **[Remote & Live QR](remote-and-live/README.md)** | Mobile remote controller, SHA-256 challenge-response auth, Live QR streaming, Supabase Realtime broadcast channels. |
| **[Business Logic](business-logic/README.md)** | Tanglish phonetic transliteration, Bible reference parser, song stemming & Web Worker search, playlist cues. |
| **[Feature Catalog](features/README.md)** | Detailed documentation of all 14 major application features, operator workflows, and shortcut system. |
| **[Decisions & Known Issues](decisions-and-issues/README.md)** | Key architectural decisions, trade-offs, performance constraints, known bugs, and Electron roadmap. |
| **[Relationships Matrix](relationships/README.md)** | Explicit relationship graph connecting entities, files, components, stores, APIs, and features. |
| **[Knowledge Graph (`.json`)](knowledge-graph.json)** | Machine-readable JSON graph containing all nodes, edges, dependencies, and fast task lookup indices. |

---

## ⚡ Quick Task Lookup

When starting a task, consult the table below to jump directly to the files you need:

| Task Domain | Key Implementation Files | Key Store / State |
| :--- | :--- | :--- |
| **Bible Search & Projection** | `src/features/bible/BiblePanel.tsx`<br>`src/lib/bible/search.ts`<br>`src/lib/bible/loader.ts`<br>`src/projection/adapters/bible.adapter.ts` | `useBibleStore`<br>`useBibleRecent`<br>`useBibleCollections` |
| **Song Lyrics & Tanglish** | `src/features/songs/SongsPanel.tsx`<br>`src/lib/songs/search.ts`<br>`src/lib/songs/loader.ts`<br>`src/lib/songs/song-search.worker.ts`<br>`src/projection/adapters/song.adapter.ts` | `useSongsStore`<br>`useSongsRecent` |
| **File Manager & Media** | `src/features/library/FileManagerLayout.tsx`<br>`src/features/library/LibraryShell.tsx`<br>`src/db/repo.ts`<br>`src/projection/adapters/media.adapter.ts` | `useFileManagerLayoutStore`<br>`useMediaFavoritesStore` |
| **Projector Screen & Styling** | `src/routes/project.tsx`<br>`src/features/projection/ProjectionWindow.tsx`<br>`src/components/ProjectionRenderer.tsx`<br>`src/components/TextOverlayRenderer.tsx`<br>`src/lib/display/screen-manager.ts` | `useProjection`<br>`useTextFormat`<br>`useBackground`<br>`useLogo` |
| **Mobile Remote Control** | `src/features/remote/remote-host.store.ts`<br>`src/features/remote/remote-client.store.ts`<br>`src/features/remote/remote-crypto.ts`<br>`src/features/remote/RemoteControlDialog.tsx`<br>`src/routes/remote.tsx` | `useHostRemote`<br>`useClientRemote` |
| **Congregation Live QR** | `src/features/live-qr/live-qr-host.store.ts`<br>`src/features/live-qr/live-qr-client.store.ts`<br>`src/features/live-qr/components/LiveViewerPage.tsx`<br>`src/routes/live.tsx` | `useHostLiveQr`<br>`useClientLiveQr` |
| **Service History Logging** | `src/features/history/session-recorder.ts`<br>`src/features/history/session-history.repo.ts`<br>`src/features/history/SessionListPage.tsx` | `useSessionHistory` |
| **Service Mode & Playlists** | `src/features/playlists/PlaylistsPage.tsx`<br>`src/features/playlists/PlaylistEditor.tsx`<br>`src/features/service/ServiceMode.tsx` | `db().playlists` (Dexie) |
| **Remote Desktop Control** | `src/routes/remote-desktop.tsx`<br>`src/features/remote-desktop/RemoteDesktopPage.tsx`<br>`src/features/remote-desktop/remote-desktop-session.store.ts`<br>`src/features/remote-desktop/remote-desktop-channel.ts`<br>`native-agent/agent.js` | `useRemoteDesktopSession` |
| **Performance & Skeletons** | `src/components/skeletons/RouteSkeletons.tsx`<br>`src/features/workspace/WorkspaceTabsPanel.tsx`<br>`src/lib/songs/loader.ts`<br>`src/lib/bible/loader.ts`<br>`src/lib/startup/startup-manager.ts` | Lazy Suspense & Cache |
| **SEO & Brand Recognition** | `src/routes/__root.tsx`<br>`src/routes/index.tsx`<br>`src/components/AppShell.tsx`<br>`public/site.webmanifest` | Head meta / JSON-LD |

---

## 🤖 How Future Agents Should Retrieve Information

1. **Step 1: Check `quickLookup` in `knowledge-graph.json` or this README**
   Identify the task domain. Read the 2-4 primary source files instead of searching the entire codebase.
2. **Step 2: Read the Relevant Domain README**
   Read the specific topic in `.knowledge/<domain>/README.md` for architectural invariants, design patterns, and edge cases.
3. **Step 3: Consult `relationships/README.md` before editing**
   Check what other components or stores depend on the files you intend to modify.
4. **Step 4: Verify against active code**
   Always cross-reference the knowledge base patterns with the current codebase before applying code edits.

---

## 🔄 How to Update This Knowledge Base When Code Changes

When you introduce new features, modify architecture, add database tables, or change wire protocols:
1. **Update `knowledge-graph.json`**:
   - Add new files/components to `"nodes"`.
   - Add connections to `"edges"`.
   - Update `"quickLookup"` if a new feature domain is created.
2. **Update Domain READMEs**:
   - For database schema changes: update `database/README.md`.
   - For projection changes: update `projection-engine/README.md`.
   - For remote/live updates: update `remote-and-live/README.md`.
3. **Keep `README.md` in subdirectories**:
   - Maintain the `README.md` naming convention inside subdirectories so that all documentation files are tracked cleanly by git without conflict with the `.gitignore` rule.
