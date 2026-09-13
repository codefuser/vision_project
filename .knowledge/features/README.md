# Complete Feature Catalog & Workflows

## 1. Feature Matrix

| Feature | Primary Route / Component | Primary Stores / Services | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Bible Scripture Module** | `/project` (Tab 2)<br>`src/features/bible/BiblePanel.tsx` | `useBibleStore`<br>`useBibleRecent`<br>`useBibleCollections` | Instant verse search in Tamil and English; passage parser (`John 3:16`); bilingual parallel display; favorite verse pinning; custom verse collections; virtualized list. |
| **Song Lyrics & Hymnal** | `/project` (Tab 3)<br>`src/features/songs/SongsPanel.tsx` | `useSongsStore`<br>`useSongsRecent` | ~17,000 song database; Tanglish transliteration search; off-thread Web Worker search; split pane slide preview; custom user song editor (`SongEditorDialog`). |
| **File Manager & Media** | `/library` & `/project` (Tab 1)<br>`src/features/library/FileManagerLayout.tsx` | `useFileManagerLayoutStore`<br>`useMediaFavoritesStore`<br>`src/db/repo.ts` | Folder hierarchy tree; drag-and-drop media upload; grid/list views; automatic thumbnail generation; image & video duration tagging; move/rename/delete dialogs. |
| **Live Projection Control** | `/project`<br>`src/features/workspace/ProjectionWorkspace.tsx` | `useWorkspace`<br>`useProjection`<br>`projectionEngine` | Multi-panel resizable dock; real-time 16:9 live preview; collapsible text formatting drawer; workspace tab switcher with keep-alive. |
| **Dual Display Output** | `/project` (popup mode)<br>`src/features/projection/ProjectionWindow.tsx` | `useProjection`<br>`src/lib/display/screen-manager.ts` | Hardware-accelerated true fullscreen popup; Window Management API multi-screen auto-discovery; aspect ratio scaling (`fit`, `fill`, `stretch`); zero UI clutter. |
| **Playlists & Service Flow** | `/playlists`, `/playlists/:id`<br>`src/features/playlists/PlaylistsPage.tsx` | `db().playlists` (Dexie)<br>`MediaAdapter` | Drag-and-drop cue reordering; per-item duration and transition settings; operator cue notes; duplicate/export playlists. |
| **Service Mode** | `/service/:id`<br>`src/features/service/ServiceMode.tsx` | `useProjection`<br>`MediaAdapter` | High-contrast, distraction-free stage runner; live cue indicator; next cue preview; elapsed timer; single-key advance. |
| **Mobile Remote Control** | `/remote`<br>`src/features/remote/components/MobileRemoteApp.tsx` | `useHostRemote`<br>`useClientRemote`<br>`src/features/remote/remote-crypto.ts` | Wireless phone controller for pastors and operators; zero-knowledge SHA-256 challenge-response QR auth; offloaded search; transport buttons. |
| **Congregation Live QR** | `/live?t={token}`<br>`src/features/live-qr/components/LiveViewerPage.tsx` | `useHostLiveQr`<br>`useClientLiveQr` | Public QR code generation; view-only live stream for smartphones; downscaled 640px preview data URLs; typography mirroring. |
| **Service History Logger** | `/history`, `/history/:id`<br>`src/features/history/` | `sessionRecorder`<br>`useSessionHistory`<br>`sessionHistoryRepo` | Automatic event recording during church services; timeline detail page; event counter breakdown (Bible, song, media, themes); session export. |
| **Text & Styling Studio** | `src/features/workspace/TextFormattingPanel.tsx` | `useTextFormat`<br>`useBackground`<br>`useLogo` | Font family selection; font size, weight, line spacing, letter spacing; text color, opacity, drop shadow, text outline; background color/gradient/media. |
| **Theme Gallery** | `src/features/workspace/ThemeGalleryDialog.tsx` | `useThemeFavorites`<br>`src/lib/templates/presets.ts` | 40+ curated worship theme presets (Sapphire, Gold, Cathedral, Modern Dark); instant single-click theme application. |
| **Logo Watermark Layer** | `src/components/LogoLayer.tsx` | `useLogo` | Upload custom church PNG logo; position in 4 corners or custom coordinates; size percentage; opacity and corner rounding. |
| **Backup & Restore** | `src/features/backup/backup.ts`<br>`src/lib/backup-scheduler.ts` | `exportBackup`<br>`importBackup` | Full client-side `.zip` backup using `fflate`; exports database tables, settings, user songs, and raw media blobs; scheduled auto-backup alerts. |
| **Command Palette & Shortcuts** | `src/components/CommandPalette.tsx`<br>`src/routes/shortcuts.tsx` | `shortcutManager`<br>`useShortcut` | Global command palette (`Ctrl+K`); category-based searchable keyboard shortcut reference; scoped keyboard listeners. |

---

## 2. Keyboard Shortcuts Cheat Sheet

| Key Combination | Action | Scope |
| :--- | :--- | :--- |
| `1` | Switch to Media (File Manager) tab | Global |
| `2` | Switch to Bible Search tab | Global |
| `3` | Switch to Songs tab | Global |
| `4` | Switch to Text tab | Global |
| `F1` | Open / Focus Projector Window | Global |
| `Ctrl+K` | Open Command Palette | Global |
| `?` | Open Keyboard Shortcuts Modal | Global |
| `B` | Toggle Blackout Screen | Global |
| `C` | Clear Screen (Stop Projection) | Global |
| `Space` / `→` | Next Slide / Queue Item | Global |
| `←` | Previous Slide / Queue Item | Global |
| `Esc` | Close Dialogs / Clear Focus | Global |
| `Ctrl+B` | Toggle Sidebar Collapse | Global |
| `Ctrl+T` | Open Theme Gallery Dialog | Global |
| `Ctrl+R` | Open Mobile Remote Controller Dialog | Global |
| `Ctrl+L` | Open Live QR Stream Dialog | Global |
