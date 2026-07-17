/**
 * Session Recorder — Auto-logging singleton.
 *
 * Subscribes to the existing projectionEvents bus and the useProjection
 * Zustand store. Translates every engine event into a SessionEventRecord
 * stored in IndexedDB. No React. No UI coupling.
 *
 * Usage:
 *   sessionRecorder.start(sessionId)  — called on app startup
 *   sessionRecorder.stop()            — called on beforeunload / End Service
 */
import { projectionEvents } from "@/projection";
import type { ProjectionEvent } from "@/projection";
import { useProjection } from "@/stores/projection.store";
import {
  logEvent,
  endSession,
  bumpSessionCounter,
} from "./session-history.repo";
import type { SessionEventType } from "@/db/schema";
import type { Unsubscribe } from "@/projection";

interface RecorderState {
  sessionId: string | null;
  unsubscribers: Unsubscribe[];
  projectorWasOpen: boolean;
}

class SessionRecorder {
  private state: RecorderState = {
    sessionId: null,
    unsubscribers: [],
    projectorWasOpen: false,
  };

  get sessionId(): string | null {
    return this.state.sessionId;
  }

  /** Begin recording for the given session. Idempotent. */
  start(sessionId: string): void {
    if (this.state.sessionId === sessionId) return;
    this.stop();

    this.state.sessionId = sessionId;

    // Log the session-started event
    void logEvent(sessionId, "SESSION_STARTED", "Software Started", {
      module: "system",
    });

    // 1. Subscribe to the typed projection event bus
    const unsubProjection = projectionEvents.onAny(
      (event: ProjectionEvent) => {
        this.handleProjectionEvent(sessionId, event);
      },
    );

    // 2. Watch projector open/close via Zustand subscription
    const unsubProjector = useProjection.subscribe((s) => {
      const wasOpen = this.state.projectorWasOpen;
      if (s.projectorOpen !== wasOpen) {
        this.state.projectorWasOpen = s.projectorOpen;
        const eventType: SessionEventType = s.projectorOpen
          ? "PROJECTOR_OPENED"
          : "PROJECTOR_CLOSED";
        void logEvent(
          sessionId,
          eventType,
          s.projectorOpen ? "Projector Opened" : "Projector Closed",
          { module: "system" },
        );
        bumpSessionCounter(sessionId, "totalEvents");
      }
    });

    // 3. Auto-end on page unload
    const onUnload = () => this.stop();
    window.addEventListener("beforeunload", onUnload);
    const unsubUnload = () =>
      window.removeEventListener("beforeunload", onUnload);

    this.state.unsubscribers = [
      unsubProjection,
      unsubProjector,
      unsubUnload,
    ];
  }

  /** End the current session and clean up all subscriptions. */
  stop(): void {
    const { sessionId, unsubscribers } = this.state;
    if (!sessionId) return;

    void logEvent(sessionId, "SESSION_ENDED", "Session Ended", {
      module: "system",
    });
    void endSession(sessionId);

    for (const unsub of unsubscribers) {
      try {
        unsub();
      } catch {
        /* ignore */
      }
    }

    this.state = {
      sessionId: null,
      unsubscribers: [],
      projectorWasOpen: false,
    };
  }

  // ─── Event translation ───────────────────────────────────────────────────

  private handleProjectionEvent(
    sessionId: string,
    event: ProjectionEvent,
  ): void {
    switch (event.type) {
      case "CONTENT_PROJECTED": {
        const content = event.content;
        let evtType: SessionEventType | null = null;
        let label = content.title || "Content";
        let detail: string | null = null;
        let module = "system";
        let counter: Parameters<typeof bumpSessionCounter>[1] | null = null;

        switch (content.type) {
          case "bible_verse": {
            evtType = "BIBLE_PROJECTED";
            module = "bible";
            counter = "bibleCount";
            const body = content.body as {
              reference?: string;
              text?: string;
              translation?: string;
            };
            label = body.reference ?? content.title;
            detail = body.text ?? null;
            break;
          }
          case "song_slide": {
            evtType = "SONG_PROJECTED";
            module = "songs";
            counter = "songCount";
            const songBody = content.body as {
              lines?: string[];
              slideIndex?: number;
            };
            label = content.title;
            detail = songBody.lines?.join("\n") ?? null;
            break;
          }
          case "image": {
            evtType = "IMAGE_PROJECTED";
            module = "media";
            counter = "imageCount";
            label = content.title;
            break;
          }
          case "video": {
            evtType = "VIDEO_PROJECTED";
            module = "media";
            counter = "videoCount";
            label = content.title;
            break;
          }
          case "live_text": {
            evtType = "TEXT_PROJECTED";
            module = "text";
            counter = "textCount";
            const liveBody = content.body as { text?: string };
            label = "Custom Text";
            detail = liveBody.text ?? null;
            break;
          }
          case "announcement": {
            evtType = "ANNOUNCEMENT_PROJECTED";
            module = "text";
            counter = "textCount";
            const annBody = content.body as { title?: string; text?: string };
            label = annBody.title ?? "Announcement";
            detail = annBody.text ?? null;
            break;
          }
          default:
            break;
        }

        if (evtType) {
          void logEvent(sessionId, evtType, label, {
            detail,
            module,
            metadata: {
              contentId: content.id,
              contentType: content.type,
              sourceModule: content.source.module,
              sourceRefId: content.source.refId,
            },
          });
          if (counter) bumpSessionCounter(sessionId, counter);
          bumpSessionCounter(sessionId, "totalEvents");
        }
        break;
      }

      case "PLAYBACK_STARTED":
        void logEvent(sessionId, "PLAYBACK_STARTED", "Playback Started", {
          module: "system",
        });
        bumpSessionCounter(sessionId, "totalEvents");
        break;

      case "PLAYBACK_PAUSED":
        void logEvent(sessionId, "PLAYBACK_PAUSED", "Playback Paused", {
          module: "system",
        });
        bumpSessionCounter(sessionId, "totalEvents");
        break;

      case "PLAYBACK_STOPPED":
        void logEvent(sessionId, "PLAYBACK_STOPPED", "Playback Stopped", {
          module: "system",
        });
        bumpSessionCounter(sessionId, "totalEvents");
        break;

      case "BLACK_SCREEN_ENABLED":
        void logEvent(sessionId, "BLACK_SCREEN_ON", "Black Screen ON", {
          module: "system",
        });
        bumpSessionCounter(sessionId, "totalEvents");
        break;

      case "BLACK_SCREEN_DISABLED":
        void logEvent(sessionId, "BLACK_SCREEN_OFF", "Black Screen OFF", {
          module: "system",
        });
        bumpSessionCounter(sessionId, "totalEvents");
        break;

      case "QUEUE_ADVANCED":
        void logEvent(
          sessionId,
          "PLAYLIST_ADVANCED",
          `Cue ${event.index + 1} of ${event.total}`,
          { module: "system", detail: `Index ${event.index}` },
        );
        bumpSessionCounter(sessionId, "totalEvents");
        break;

      default:
        break;
    }
  }

  /** Log a theme change. Called by theme-selection components. */
  logThemeChange(themeName: string, themeId?: string): void {
    const { sessionId } = this.state;
    if (!sessionId) return;
    void logEvent(sessionId, "THEME_CHANGED", `Theme → ${themeName}`, {
      module: "theme",
      detail: themeId ?? null,
    });
    bumpSessionCounter(sessionId, "themeCount");
    bumpSessionCounter(sessionId, "totalEvents");
  }

  /** Log a search query. Called by search components. */
  logSearch(query: string, module: string): void {
    const { sessionId } = this.state;
    if (!sessionId || !query.trim()) return;
    void logEvent(sessionId, "SEARCH_PERFORMED", `Search: "${query}"`, {
      module,
    });
    bumpSessionCounter(sessionId, "totalEvents");
  }

  /** Log media import. */
  logMediaImported(names: string[]): void {
    const { sessionId } = this.state;
    if (!sessionId) return;
    void logEvent(
      sessionId,
      "MEDIA_IMPORTED",
      `Imported: ${names.slice(0, 3).join(", ")}${names.length > 3 ? ` +${names.length - 3} more` : ""}`,
      { module: "media", detail: `${names.length} files` },
    );
    bumpSessionCounter(sessionId, "totalEvents");
  }

  /** Log media deletion. */
  logMediaDeleted(names: string[]): void {
    const { sessionId } = this.state;
    if (!sessionId) return;
    void logEvent(
      sessionId,
      "MEDIA_DELETED",
      `Deleted: ${names.slice(0, 3).join(", ")}`,
      { module: "media" },
    );
    bumpSessionCounter(sessionId, "totalEvents");
  }
}

/** Global singleton — import and use anywhere in the app. */
export const sessionRecorder = new SessionRecorder();
