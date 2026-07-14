import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { ac as Route$1, j as useProjection, T as getPlaylist, l as listAllMedia, ab as projectionEngine, q as formatDuration, h as cn } from "./router-KP2FEINE.mjs";
import { p as projectMedia, T as Thumb } from "./Thumb-CnVrOvK8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/dexie.mjs";
import { ag as ArrowLeft, ah as Radio, C as ChevronLeft, o as Pause, p as Play, v as EyeOff, s as Square, d as ChevronRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function ServiceMode({ id }) {
  const navigate = useNavigate();
  const [playlist, setPlaylist] = reactExports.useState(null);
  const [mediaMap, setMediaMap] = reactExports.useState(/* @__PURE__ */ new Map());
  const [cursor, setCursor] = reactExports.useState(0);
  const projection = useProjection();
  const armedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    void (async () => {
      const p = await getPlaylist(id);
      if (!p) return;
      setPlaylist(p);
      const all = await listAllMedia();
      setMediaMap(new Map(all.map((m) => [m.id, m])));
    })();
  }, [id]);
  reactExports.useEffect(() => {
    if (!playlist || armedRef.current) return;
    armedRef.current = true;
    if (!projection.projectorOpen) projection.openProjector();
    void projectAt(0, playlist);
  }, [playlist]);
  const projectAt = reactExports.useCallback(
    async (idx, p) => {
      const list = p ?? playlist;
      if (!list || !list.items.length) return;
      const safe = Math.max(0, Math.min(list.items.length - 1, idx));
      const item = list.items[safe];
      const record = mediaMap.get(item.mediaId);
      if (record) {
        await projectMedia(record);
      } else {
        const { getMedia } = await import("./router-KP2FEINE.mjs").then((n) => n.ag);
        const fetched = await getMedia(item.mediaId);
        if (fetched) await projectMedia(fetched);
        else toast.error("Missing media for this cue");
      }
      setCursor(safe);
    },
    [playlist, mediaMap]
  );
  const goNext = reactExports.useCallback(() => {
    if (!playlist) return;
    if (cursor >= playlist.items.length - 1) {
      toast.info("End of service flow");
      return;
    }
    void projectAt(cursor + 1);
  }, [playlist, cursor, projectAt]);
  const goPrev = reactExports.useCallback(() => {
    if (!playlist || cursor <= 0) return;
    void projectAt(cursor - 1);
  }, [playlist, cursor, projectAt]);
  const goTo = reactExports.useCallback((i) => void projectAt(i), [projectAt]);
  const togglePlay = reactExports.useCallback(() => {
    const playing2 = projection.state?.playing ?? false;
    if (playing2) projectionEngine.pause();
    else projectionEngine.play();
  }, [projection.state?.playing]);
  const toggleBlack = reactExports.useCallback(() => {
    projectionEngine.setBlack(!(projection.state?.black ?? false));
  }, [projection.state?.black]);
  const stopAll = reactExports.useCallback(() => {
    projectionEngine.stop();
  }, []);
  const exit = reactExports.useCallback(() => {
    navigate({ to: "/playlists/$id", params: { id } });
  }, [navigate, id]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (e.key === " " || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleBlack();
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "Escape") {
        e.preventDefault();
        exit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, toggleBlack, togglePlay, exit]);
  const currentItem = playlist?.items[cursor];
  const nextItem = playlist?.items[cursor + 1];
  const currentMedia = currentItem ? mediaMap.get(currentItem.mediaId) : void 0;
  const nextMedia = nextItem ? mediaMap.get(nextItem.mediaId) : void 0;
  const remainingMs = reactExports.useMemo(() => {
    if (!playlist) return 0;
    let sum = 0;
    for (let i = cursor; i < playlist.items.length; i++) {
      const it = playlist.items[i];
      const m = mediaMap.get(it.mediaId);
      if (m?.type === "video") sum += m.durationMs ?? it.durationMs ?? 0;
      else sum += it.durationMs ?? 0;
    }
    return sum;
  }, [playlist, mediaMap, cursor]);
  if (!playlist) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: "Loading service…" });
  }
  if (!playlist.items.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-3 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This playlist has no cues." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/playlists/$id",
          params: { id },
          className: "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90",
          children: "Back to editor"
        }
      )
    ] });
  }
  const playing = projection.state?.playing ?? false;
  const black = projection.state?.black ?? false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center justify-between border-b border-border px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: exit,
            className: "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs hover:bg-accent",
            title: "Exit Service Mode (Esc)",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
              " Exit"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-3.5 w-3.5" }),
          " Service Mode"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-semibold", children: playlist.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
            "Cue ",
            cursor + 1,
            " of ",
            playlist.items.length,
            " · est. remaining",
            " ",
            formatDuration(remainingMs)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-2 text-[11px] text-muted-foreground md:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "rounded border px-1.5 py-0.5", children: "Space" }),
        " Next ·",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "rounded border px-1.5 py-0.5", children: "←" }),
        " Prev ·",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "rounded border px-1.5 py-0.5", children: "B" }),
        " Black ·",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "rounded border px-1.5 py-0.5", children: "P" }),
        " Play/Pause ·",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "rounded border px-1.5 py-0.5", children: "Esc" }),
        " Exit"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-[1fr_360px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-0 flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CuePanel, { title: "ON SCREEN", accent: "primary", item: currentItem, media: currentMedia }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CuePanel,
            {
              title: "NEXT UP",
              accent: "muted",
              item: nextItem,
              media: nextMedia,
              empty: "End of service"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 items-stretch gap-2 sm:grid-cols-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ControlButton,
            {
              onClick: goPrev,
              disabled: cursor === 0,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" }),
              children: "Prev"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ControlButton,
            {
              onClick: togglePlay,
              icon: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-5 w-5" }),
              children: playing ? "Pause" : "Play"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ControlButton,
            {
              onClick: toggleBlack,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-5 w-5" }),
              tone: black ? "warning" : void 0,
              children: black ? "Unblack" : "Black"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ControlButton, { onClick: stopAll, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-5 w-5" }), tone: "danger", children: "Stop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: goNext,
              disabled: cursor >= playlist.items.length - 1,
              className: "col-span-2 inline-flex h-16 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary text-base font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-1",
              title: "Next cue (Space)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-6 w-6" }),
                " NEXT"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Cue list" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-1.5", children: playlist.items.map((it, idx) => {
          const m = mediaMap.get(it.mediaId);
          const isCurrent = idx === cursor;
          const isNext = idx === cursor + 1;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => goTo(idx),
              className: cn(
                "mb-1 flex w-full cursor-pointer items-center gap-2 rounded-md border px-1.5 py-1.5 text-left transition",
                isCurrent ? "border-primary bg-primary/10" : isNext ? "border-primary/30 bg-accent/40" : "border-transparent hover:bg-accent/40"
              ),
              title: it.notes || it.label || m?.name,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 shrink-0 text-center text-[11px] tabular-nums text-muted-foreground", children: idx + 1 }),
                m ? /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: m, className: "h-10 w-16 shrink-0 rounded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-16 shrink-0 rounded bg-muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs font-medium", children: it.label || m?.name || "Missing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] text-muted-foreground", children: m?.type === "video" ? `Video · ${formatDuration(m.durationMs)}` : m?.type === "image" ? `Image · ${Math.round(it.durationMs / 1e3)}s` : "Missing media" })
                ] }),
                isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground", children: "Live" }),
                isNext && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded border border-primary/40 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-primary", children: "Next" })
              ]
            },
            it.id
          );
        }) })
      ] })
    ] })
  ] });
}
function CuePanel({
  title,
  accent,
  item,
  media,
  empty
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex min-h-0 flex-col overflow-hidden rounded-lg border bg-card",
        accent === "primary" ? "border-primary/60 shadow-[0_0_0_1px_rgba(0,0,0,0)]" : "border-border"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "shrink-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest",
              accent === "primary" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: title
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center bg-black/80", children: media ? /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media, className: "h-full w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: empty ?? "—" }) }),
        item && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 border-t border-border bg-card px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", children: item.label || media?.name || "Cue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: media?.type === "video" ? `Video · ${formatDuration(media.durationMs)}` : media?.type === "image" ? `Image · ${Math.round(item.durationMs / 1e3)}s` : "" }),
          item.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 rounded bg-accent/40 px-2 py-1 text-[11px] italic text-foreground", children: item.notes })
        ] })
      ]
    }
  );
}
function ControlButton({
  children,
  icon,
  onClick,
  disabled,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      disabled,
      className: cn(
        "inline-flex h-16 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
        tone === "danger" ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20" : tone === "warning" ? "border-amber-500/50 bg-amber-500/15 text-amber-600 hover:bg-amber-500/25" : "border-border bg-background text-foreground hover:bg-accent"
      ),
      children: [
        icon,
        children
      ]
    }
  );
}
function ServiceModeRoute() {
  const {
    id
  } = Route$1.useParams();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceMode, { id });
}
export {
  ServiceModeRoute as component
};
