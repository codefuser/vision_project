# Projection Engine & Rendering Pipeline

## 1. Universal Projection Content Model

Defined in `src/projection/content.types.ts`:

Every projectable item in VersoLyn — scripture verse, song slide, video, photo, announcement, or live sermon note — is normalized into a unified structure before reaching the projection engine:

```ts
export interface ProjectionContent<TBody extends ProjectionBody = ProjectionBody> {
  id: string;
  type: ProjectionContentType; // "image" | "video" | "bible_verse" | "song_slide" | "live_text" | "announcement" | "sermon_point" | "service_item"
  title: string;
  source: {
    module: "media" | "bible" | "songs" | "text" | "announcements" | "sermon" | "service" | "system";
    refId?: string;
  };
  metadata: Record<string, unknown>;
  style: ProjectionStyle;
  body: TBody;
  createdAt: number;
  updatedAt: number;
}
```

---

## 2. `ProjectionEngine` Singleton (`src/projection/engine.ts`)

The `ProjectionEngine` is a **framework-free, UI-agnostic singleton** (pure TypeScript, zero React coupling). This guarantees it can be executed from web workers, node scripts, or an Electron main process.

### Primary Lifecycle Methods:
* `bootstrap()`: Idempotent. Wires the engine to the underlying `useProjection` store and BroadcastChannel.
* `project(content)`: Projects a single item, replacing current output. Dispatches wire command, emits bus events, and records history.
* `projectQueue(items, startIndex)`: Projects an ordered sequence (e.g. playlist or song slides).
* `replace(patch)`: Live edit-in-place without reloading media. Used for real-time font, background, or alignment adjustments.
* `clear()`: Sends `STOP` command to projector and blanks the screen.
* `setBlack(value)`: Toggles projector blackout state without losing current media/verse location.
* Transport Controls: `play()`, `pause()`, `stop()`, `next()`, `prev()`, `setVolume(0..1)`, `setMuted(boolean)`, `seek(seconds)`.

---

## 3. Projection Event Bus (`src/projection/event-bus.ts`)

A strongly-typed in-memory pub/sub event bus:
```ts
projectionEvents.on("CONTENT_PROJECTED", (e) => { ... });
projectionEvents.onAny((event) => { ... });
```

### Event Types:
* `CONTENT_PROJECTED`: Fired on verse, song, or media transition. Carries `content` and `previous`.
* `CONTENT_UPDATED`: Fired on live style or text edits.
* `CONTENT_CLEARED`: Fired on screen clear.
* `QUEUE_ADVANCED`: Fired when a playlist moves to the next cue item.
* `PLAYBACK_STARTED` / `PLAYBACK_PAUSED` / `PLAYBACK_STOPPED`
* `BLACK_SCREEN_ENABLED` / `BLACK_SCREEN_DISABLED`
* `PROJECTOR_CONNECTED` / `PROJECTOR_DISCONNECTED`

---

## 4. Projection Adapters (`src/projection/adapters/`)

Adapters sit between module UI panels and the `ProjectionEngine`:

| Adapter | File Path | Wire Command Dispatched | Content Type | Special Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Bible Adapter** | `bible.adapter.ts` | `LOAD_TEXT` | `bible_verse` | Populates `textTa`, `textEn`, `referenceTa`, `referenceEn` and switches mode (`ta`, `en`, `both`). |
| **Song Adapter** | `song.adapter.ts` | `LOAD_TEXT` | `song_slide` | Populates `textTa` with lyrics. Clears all reference fields so the header block is hidden. |
| **Media Adapter** | `media.adapter.ts` | `LOAD` or `LOAD_PLAYLIST` | `image` / `video` | Resolves media blobs and routes playlists through cue sequencer. |
| **Text Adapter** | `text.adapter.ts` | `LOAD_TEXT` | `live_text` | Packages custom church announcements, tithes, or sermon slides. |

---

## 5. Visual Renderers & Canvas Geometry

### 16:9 Stage Math (`src/components/ProjectionRenderer.tsx`)
* **Reference Dimensions**: `STAGE_WIDTH = 1920`, `STAGE_HEIGHT = 1080` (`16:9` ratio).
* **Fitted Stage Hook (`useFittedStage`)**:
  Calculates the maximal 16:9 bounding box that fits the viewport without distortion:
  $$\text{Target Height} = \frac{\text{Width}}{16/9}$$
  If calculated height exceeds container height, it clamps height and scales width proportionally. Ensures pixel-perfect letterboxing on phone screens, ultra-wide monitors, and 4:3 church projectors.

### Binary Search Auto-Fit Font Algorithm (`src/components/TextOverlayRenderer.tsx`)
To ensure Tamil and English verses never clip off the screen:
1. Measures container client height and width.
2. Performs a **binary search** between min font size ($1.2\text{vw}$) and max font size ($12\text{vw}$).
3. Evaluates `scrollHeight <= clientHeight` on each iteration to select the largest legible font that fits completely within the stage boundaries.

### Background Layers (`src/components/BackgroundLayer.tsx`)
* **Color / Gradient Layer**: Supports CSS linear and radial gradient definitions.
* **Media Layer**: Hardware-accelerated image or looping muted video.
* **Animated Presets**: Built-in CSS particle/ray animations (`golden-stage`, `aurora-curtain`, `ocean-horizon`, `cathedral-glass`, etc.).
* **Color Overlay**: Semi-transparent dark/tinted scrim between background media and text to maximize contrast.

### Watermark Logo Layer (`src/components/LogoLayer.tsx`)
Broadcasts PNG church logo overlay to 4 corners (`top-left`, `top-right`, `bottom-left`, `bottom-right`) or custom X/Y coordinates with customizable width percentage and border radius.
