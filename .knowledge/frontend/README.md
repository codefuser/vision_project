# Frontend Architecture & UI Structure

## 1. Frontend Technology Stack

* **Framework**: React 19.2.0 (`react`, `react-dom`)
* **Routing**: TanStack Router 1.168 (`@tanstack/react-router`, `@tanstack/router-plugin`)
* **Styling**: TailwindCSS v4 (`@tailwindcss/vite`, `tailwindcss`, `tw-animate-css`)
* **UI Components**: Radix UI headless primitives (Accordion, Alert Dialog, Aspect Ratio, Dialog, Dropdown, Popover, Select, Slider, Switch, Tabs, Tooltip, etc.)
* **List Virtualization**: TanStack Virtual 3.14 (`@tanstack/react-virtual`)
* **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
* **Split Resizing**: `react-resizable-panels` 4.6
* **Notifications**: `sonner` 2.0
* **Icons**: `lucide-react`

---

## 2. Routing Structure (`src/routes/`)

TanStack Router utilizes **file-based routing**. The route tree is auto-generated in `src/routeTree.gen.ts`.

| Route File | URL Path | Component Rendered | Purpose |
| :--- | :--- | :--- | :--- |
| `__root.tsx` | App Root | `RootShell` + `RootComponent` | Root HTML shell, fonts, meta tags, isolation routing, AppShell provider. |
| `index.tsx` | `/` | `IndexRoute` | Entry point. Reads `settings.defaultStartupPage` and redirects or renders Library. |
| `project.tsx` | `/project` | `ProjectRoute` | Branching route: renders `ProjectionWindow` in popup mode, `ProjectionWorkspace` in control mode. |
| `library.tsx` | `/library` | `LibraryPage` | Standalone media manager (driven by `FileManagerLayout`). |
| `playlists.tsx` | `/playlists` | `PlaylistsPage` | Playlist list, creation, duplication, and quick-projection. |
| `playlists.$id.tsx` | `/playlists/:id` | `PlaylistEditor` | Drag-and-drop playlist timeline editor with duration, transitions, and notes. |
| `service.$id.tsx` | `/service/:id` | `ServiceMode` | Distraction-free live service cue sheet runner for church operators. |
| `history.tsx` | `/history` | Layout / Outlet | Parent layout for session history. |
| `history.index.tsx`| `/history` | `SessionListPage` | Searchable list of past church services with event summary stats. |
| `history.$id.tsx` | `/history/:id` | `SessionDetailPage` | Chronological event timeline of projected verses, lyrics, media, and themes. |
| `remote.tsx` | `/remote` | `MobileRemoteApp` | Mobile phone remote control application for pastors and operators. |
| `live.tsx` | `/live` | `LiveViewerPage` | Public live projection viewer for congregation smartphones. |
| `settings.tsx` | `/settings` | `SettingsPage` | System settings, typography preferences, backup triggers. |
| `shortcuts.tsx` | `/shortcuts` | `ShortcutsPage` | Interactive searchable directory of all registered keyboard shortcuts. |
| `developer-hub.tsx`| `/developer-hub` | `DeveloperHubPage` | Project story, tech stack details, open source information. |
| `roadmap.tsx` | `/roadmap` | `RoadmapPage` | Version history, milestone progress, and planned features. |
| `contact.tsx` | `/contact` | `ContactPage` | Developer contact info, feedback form, and custom software inquiry. |

---

## 3. App Shell & Layout System

### Root Shell Isolation Logic (`src/routes/__root.tsx`)
```tsx
const isProjectorPopup = typeof window !== "undefined" && window.opener != null && window.name === "church-projector";
const isRemote = pathname === "/remote" || pathname.startsWith("/remote/");
const isLive = pathname === "/live" || pathname.startsWith("/live/");
const isIsolated = isProjectorPopup || isRemote || isLive;
```
* When `isIsolated === true`, the application renders **only** the target page `<Outlet />` without sidebar, top bars, keyboard handlers, or shortcut dialogs.
* When `isIsolated === false`, the application mounts:
  * `GlobalShortcuts`: Active global keyboard listener.
  * `ShortcutsDialog`: Modal listing shortcuts (`?`).
  * `CommandPalette`: Quick jump palette (`Ctrl+K`).
  * `AppShell`: Collapsible navigation sidebar.

### Workspace Split Layout (`src/features/workspace/ProjectionWorkspace.tsx`)
* **Left Panel**:
  * Top: `LivePreviewPanel` (true 16:9 mirror of projector output with transport controls, black screen, logo, clear).
  * Bottom: `TextFormattingPanel` (collapsible strip or accordion editor for Reference, Tamil, English typography, background, theme).
* **Right Panel**:
  * `WorkspaceTabsPanel` hosting 4 main modules:
    1. **Media** (`LibraryPage` / `FileManagerLayout`)
    2. **Bible** (`BiblePanel`)
    3. **Songs** (`SongsPanel`)
    4. **Text** (`TextPanel`)
* **`LazyKeepAlive` Optimization**:
  Tabs do not unmount when switching. Instead, once mounted, they remain in the DOM with `hidden` CSS to preserve scroll position, active input focus, and search state.

---

## 4. Virtualized Lists & Rendering Performance

* **Bible Verse Lists**: Uses `@tanstack/react-virtual` in `BiblePanel.tsx`. Allows instant scrolling through thousands of verse search hits or entire chapters without DOM lag.
* **Song Lists**: Uses `@tanstack/react-virtual` in `SongsPanel.tsx` coupled with Web Worker offloading for search computations.
* **Grapheme Truncation**: Tamil text is truncated using Unicode grapheme cluster boundary splitting (`src/lib/songs/grapheme.ts`) so Tamil vowel signs (*kombu*, *pulli*) never break across lines or truncation points.

---

## 5. Typography & Font System

Configured in `src/styles.css` and loaded from Google Fonts:
* **Tamil Fonts**:
  * `Latha` (traditional church presentation standard)
  * `Noto Sans Tamil`
  * `Noto Serif Tamil`
  * `Mukta Malar`
  * `Catamaran`
  * `Hind Madurai`
  * `Meera Inimai`
  * `Pavanam`
* **English Fonts**:
  * `Inter` (primary UI & slide default)
  * `Roboto`, `Outfit`, `Montserrat`, `Cinzel`, `Playfair Display`

---

## 6. SEO Architecture

### Static SEO Files (`public/`)
| File | Purpose |
| :--- | :--- |
| `robots.txt` | Allows `/`, `/developer-hub`, `/roadmap`, `/contact`, `/live`; Disallows all app-internal routes; References sitemap |
| `sitemap.xml` | 5 public indexable pages with canonical absolute URLs |
| `site.webmanifest` | PWA manifest with `description`, `start_url`, `lang` fields added |

### Root-Level Metadata (`src/routes/__root.tsx`)
All pages inherit these global tags (per-page `head()` can override):
* **Title**: `"VersoLyn - Church Presentation Software"`
* **Description**: 155-char keyword-rich copy
* **`<meta name="keywords">`**: 7 core church/worship software keywords
* **`<meta name="robots">`**: `index, follow` (public pages override with `noindex, nofollow`)
* **Open Graph**: `og:site_name`, `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:width/height/alt`, `og:locale`
* **Twitter/X Card**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`
* **JSON-LD** (injected in `RootShell` via `dangerouslySetInnerHTML`): Array of 3 schemas:
  * `Organization` — name, url, logo, description
  * `WebSite` — name, url, `SearchAction` potentialAction
  * `SoftwareApplication` — category `MultimediaApplication`, free offer, keywords

### Per-Route SEO Policy
| Route | Indexable | Canonical | Notes |
| :--- | :--- | :--- | :--- |
| `/` | ✅ `index, follow` | `https://versolyn.vercel.app/` | Primary landing page |
| `/developer-hub` | ✅ `index, follow` | `https://versolyn.vercel.app/developer-hub` | |
| `/roadmap` | ✅ `index, follow` | `https://versolyn.vercel.app/roadmap` | |
| `/contact` | ✅ `index, follow` | `https://versolyn.vercel.app/contact` | |
| `/live` | ❌ `noindex, nofollow` | — | Token-gated congregation viewer |
| `/settings` | ❌ `noindex, nofollow` | — | App-internal |
| `/shortcuts` | ❌ `noindex, nofollow` | — | App-internal |
| `/playlists` | ❌ `noindex, nofollow` | — | App-internal |
| `/history` | ❌ `noindex, nofollow` | — | App-internal |
| `/library`, `/project`, `/service/:id`, `/remote` | ❌ (via robots.txt Disallow) | — | App-internal |

### Sitemap URL
`https://versolyn.vercel.app/sitemap.xml`

### Robots URL
`https://versolyn.vercel.app/robots.txt`
