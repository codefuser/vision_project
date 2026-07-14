import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as useSensors, d as useSensor, D as DndContext, e as closestCenter, P as PointerSensor } from "../_libs/dnd-kit__core.mjs";
import { S as SortableContext, v as verticalListSortingStrategy, a as arrayMove, u as useSortable } from "../_libs/dnd-kit__sortable.mjs";
import { C as CSS } from "../_libs/dnd-kit__utilities.mjs";
import { af as Route, j as useProjection, T as getPlaylist, l as listAllMedia, q as formatDuration, h as cn, a8 as renameMedia, a5 as formatBytes, aa as addMediaToPlaylist, ad as uid, ae as updatePlaylistItems } from "./router-KP2FEINE.mjs";
import { p as projectMedia, a as projectPlaylist, T as Thumb } from "./Thumb-CnVrOvK8.mjs";
import { M as MediaPreview } from "./MediaPreview-Bh211P_H.mjs";
import { R as RenameDialog } from "./RenameDialog-BApqqlGm.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/dexie.mjs";
import { ag as ArrowLeft, I as Image, ai as StickyNote, D as Download, p as Play, ah as Radio, h as Search, k as ChevronUp, l as ChevronDown, a5 as Copy, i as Trash2, a3 as Plus, _ as Film, aj as GripVertical, E as Eye, a6 as Pencil, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/dnd-kit__accessibility.mjs";
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
const TRANSITIONS = ["fade", "crossfade", "zoom", "dissolve", "none"];
const STORAGE_PREFIX = "vp-playlist-editor-v1";
function storageKey(playlistId, k) {
  return `${STORAGE_PREFIX}:${playlistId}:${k}`;
}
function loadString(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
function saveString(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
  }
}
function PlaylistEditor({ id }) {
  const navigate = useNavigate();
  const projectionState = useProjection((s) => s.state);
  const [playlist, setPlaylist] = reactExports.useState(null);
  const [allMedia, setAllMedia] = reactExports.useState([]);
  const [libSearch, setLibSearch] = reactExports.useState(() => loadString(storageKey(id, "libSearch"), ""));
  const [libFilter, setLibFilter] = reactExports.useState(
    () => loadString(storageKey(id, "libFilter"), "all")
  );
  const [tlSearch, setTlSearch] = reactExports.useState(() => loadString(storageKey(id, "tlSearch"), ""));
  const [tlFilter, setTlFilter] = reactExports.useState(
    () => loadString(storageKey(id, "tlFilter"), "all")
  );
  const [showInfo, setShowInfo] = reactExports.useState(
    () => loadString(storageKey(id, "showInfo"), "1") === "1"
  );
  const [showLibrary, setShowLibrary] = reactExports.useState(
    () => loadString(storageKey(id, "showLibrary"), "1") === "1"
  );
  reactExports.useEffect(() => {
    saveString(storageKey(id, "libSearch"), libSearch);
  }, [id, libSearch]);
  reactExports.useEffect(() => {
    saveString(storageKey(id, "libFilter"), libFilter);
  }, [id, libFilter]);
  reactExports.useEffect(() => {
    saveString(storageKey(id, "tlSearch"), tlSearch);
  }, [id, tlSearch]);
  reactExports.useEffect(() => {
    saveString(storageKey(id, "tlFilter"), tlFilter);
  }, [id, tlFilter]);
  reactExports.useEffect(() => {
    saveString(storageKey(id, "showInfo"), showInfo ? "1" : "0");
  }, [id, showInfo]);
  reactExports.useEffect(() => {
    saveString(storageKey(id, "showLibrary"), showLibrary ? "1" : "0");
  }, [id, showLibrary]);
  const [selection, setSelection] = reactExports.useState(() => {
    const raw = loadString(storageKey(id, "selection"), "");
    if (!raw) return /* @__PURE__ */ new Set();
    try {
      return new Set(JSON.parse(raw));
    } catch {
      return /* @__PURE__ */ new Set();
    }
  });
  reactExports.useEffect(() => {
    saveString(storageKey(id, "selection"), JSON.stringify(Array.from(selection)));
  }, [id, selection]);
  const [focusId, setFocusId] = reactExports.useState(
    () => loadString(storageKey(id, "focusId"), "") || null
  );
  reactExports.useEffect(() => {
    saveString(storageKey(id, "focusId"), focusId ?? "");
  }, [id, focusId]);
  const [renameTarget, setRenameTarget] = reactExports.useState(null);
  const [previewTarget, setPreviewTarget] = reactExports.useState(null);
  const [notesFor, setNotesFor] = reactExports.useState(null);
  const playlistRef = reactExports.useRef(null);
  playlistRef.current = playlist;
  const refresh = reactExports.useCallback(async () => {
    const p = await getPlaylist(id);
    if (!p) return;
    setPlaylist(p);
    setAllMedia(await listAllMedia());
  }, [id]);
  reactExports.useEffect(() => {
    void refresh();
  }, [refresh]);
  const mediaMap = reactExports.useMemo(() => new Map(allMedia.map((m) => [m.id, m])), [allMedia]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const persistItems = async (items) => {
    if (!playlistRef.current) return;
    setPlaylist({ ...playlistRef.current, items, updatedAt: Date.now() });
    await updatePlaylistItems(playlistRef.current.id, items);
  };
  const visibleItems = reactExports.useMemo(() => {
    if (!playlist) return [];
    const q = tlSearch.trim().toLowerCase();
    return playlist.items.filter((it) => {
      const m = mediaMap.get(it.mediaId);
      if (tlFilter !== "all" && m?.type !== tlFilter) return false;
      if (!q) return true;
      const hay = (it.label ?? m?.name ?? "").toLowerCase();
      return hay.includes(q) || (m?.type ?? "").includes(q);
    });
  }, [playlist, mediaMap, tlSearch, tlFilter]);
  reactExports.useEffect(() => {
    if (!playlist) return;
    const valid = new Set(playlist.items.map((i) => i.id));
    setSelection((prev) => {
      const next = /* @__PURE__ */ new Set();
      for (const s of prev) if (valid.has(s)) next.add(s);
      return next.size === prev.size ? prev : next;
    });
  }, [playlist]);
  const addMedia = async (mediaIds, insertAt) => {
    if (!playlist || !mediaIds.length) return;
    {
      await addMediaToPlaylist(playlist.id, mediaIds);
    }
    await refresh();
    toast.success(`Added ${mediaIds.length} item${mediaIds.length > 1 ? "s" : ""}`);
  };
  const removeItems = async (ids) => {
    if (!playlist || !ids.length) return;
    const set = new Set(ids);
    await persistItems(playlist.items.filter((it) => !set.has(it.id)));
    setSelection((prev) => {
      const next = new Set(prev);
      for (const x of ids) next.delete(x);
      return next;
    });
  };
  const duplicateItems = async (ids) => {
    if (!playlist || !ids.length) return;
    const orderedIds = playlist.items.filter((it) => ids.includes(it.id)).map((it) => it.id);
    const idToCopyId = /* @__PURE__ */ new Map();
    const next = [];
    for (const it of playlist.items) {
      next.push(it);
      if (orderedIds.includes(it.id)) {
        const copyId = uid();
        idToCopyId.set(it.id, copyId);
        next.push({ ...it, id: copyId });
      }
    }
    await persistItems(next);
    setSelection(new Set(Array.from(idToCopyId.values())));
  };
  const updateItem = async (itemId, patch) => {
    if (!playlist) return;
    await persistItems(playlist.items.map((it) => it.id === itemId ? { ...it, ...patch } : it));
  };
  const moveSelection = async (dir) => {
    if (!playlist) return;
    const items = playlist.items.slice();
    const indices = items.map((it, i) => selection.has(it.id) ? i : -1).filter((i) => i >= 0);
    if (!indices.length) return;
    if (dir === -1) {
      if (indices[0] === 0) return;
      for (const i of indices) [items[i - 1], items[i]] = [items[i], items[i - 1]];
    } else {
      if (indices[indices.length - 1] === items.length - 1) return;
      for (let k = indices.length - 1; k >= 0; k--) {
        const i = indices[k];
        [items[i + 1], items[i]] = [items[i], items[i + 1]];
      }
    }
    await persistItems(items);
  };
  const projectIndex = (i) => {
    if (!playlist) return;
    void projectPlaylist(playlist, i);
  };
  const projectSelected = async () => {
    if (!playlist || !selection.size) return;
    const items = playlist.items.filter((it) => selection.has(it.id));
    if (!items.length) return;
    const tmp = { ...playlist, items };
    await projectPlaylist(tmp, 0);
  };
  const exportPlaylist = () => {
    if (!playlist) return;
    const payload = {
      version: 1,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      playlist: { id: playlist.id, name: playlist.name },
      items: playlist.items.map((it) => {
        const m = mediaMap.get(it.mediaId);
        return {
          order: playlist.items.indexOf(it) + 1,
          mediaId: it.mediaId,
          mediaName: m?.name ?? null,
          mediaType: m?.type ?? null,
          durationMs: it.durationMs,
          transition: it.transition,
          label: it.label ?? null,
          notes: it.notes ?? null
        };
      })
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${playlist.name.replace(/[^a-z0-9-_ ]/gi, "_")}.playlist.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    toast.success("Playlist exported");
  };
  const handleRowClick = (e, itemId) => {
    if (!playlist) return;
    const ids = visibleItems.map((it) => it.id);
    if (e.shiftKey && focusId) {
      const a = ids.indexOf(focusId);
      const b = ids.indexOf(itemId);
      if (a >= 0 && b >= 0) {
        const [s, t] = a <= b ? [a, b] : [b, a];
        const range = ids.slice(s, t + 1);
        const next = new Set(e.ctrlKey || e.metaKey ? selection : []);
        for (const rid of range) next.add(rid);
        setSelection(next);
        setFocusId(itemId);
        return;
      }
    }
    if (e.ctrlKey || e.metaKey) {
      const next = new Set(selection);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      setSelection(next);
      setFocusId(itemId);
      return;
    }
    setSelection(/* @__PURE__ */ new Set([itemId]));
    setFocusId(itemId);
  };
  const onDragEnd = async (e) => {
    if (!playlist || !e.over || e.active.id === e.over.id) return;
    const oldIdx = playlist.items.findIndex((it) => it.id === e.active.id);
    const newIdx = playlist.items.findIndex((it) => it.id === e.over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    await persistItems(arrayMove(playlist.items, oldIdx, newIdx));
  };
  const onTimelineDrop = async (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/x-media-ids");
    if (!raw) return;
    try {
      const ids = JSON.parse(raw);
      await addMedia(ids);
    } catch {
    }
  };
  reactExports.useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      const p = playlistRef.current;
      if (!p) return;
      const ids = visibleItems.map((it) => it.id);
      const cur = focusId ? ids.indexOf(focusId) : -1;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setSelection(new Set(ids));
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d" && selection.size) {
        e.preventDefault();
        void duplicateItems(Array.from(selection));
        return;
      }
      if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        void moveSelection(e.key === "ArrowDown" ? 1 : -1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const n = Math.min(ids.length - 1, cur < 0 ? 0 : cur + 1);
        if (ids[n]) {
          setFocusId(ids[n]);
          if (!e.shiftKey) setSelection(/* @__PURE__ */ new Set([ids[n]]));
          else setSelection((prev) => new Set(prev).add(ids[n]));
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const n = Math.max(0, cur < 0 ? 0 : cur - 1);
        if (ids[n]) {
          setFocusId(ids[n]);
          if (!e.shiftKey) setSelection(/* @__PURE__ */ new Set([ids[n]]));
          else setSelection((prev) => new Set(prev).add(ids[n]));
        }
      } else if (e.key === "Enter" && cur >= 0) {
        e.preventDefault();
        const realIdx = p.items.findIndex((it) => it.id === ids[cur]);
        if (realIdx >= 0) projectIndex(realIdx);
      } else if ((e.key === "Delete" || e.key === "Backspace") && selection.size) {
        e.preventDefault();
        void removeItems(Array.from(selection));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusId, selection, visibleItems]);
  const stats = reactExports.useMemo(() => {
    if (!playlist) return null;
    let videos = 0, images = 0, totalMs = 0, videoMs = 0, largestSize = 0;
    let largest = null;
    for (const it of playlist.items) {
      const m = mediaMap.get(it.mediaId);
      if (!m) continue;
      if (m.type === "video") {
        videos++;
        const ms = m.durationMs ?? it.durationMs ?? 0;
        videoMs += ms;
        totalMs += ms;
      } else {
        images++;
        totalMs += it.durationMs ?? 0;
      }
      if ((m.size ?? 0) > largestSize) {
        largestSize = m.size ?? 0;
        largest = m;
      }
    }
    return {
      total: playlist.items.length,
      videos,
      images,
      totalMs,
      avgVideoMs: videos > 0 ? Math.round(videoMs / videos) : 0,
      largest
    };
  }, [playlist, mediaMap]);
  const currentMediaId = projectionState?.currentMediaId ?? null;
  const currentItemIndex = reactExports.useMemo(() => {
    if (!playlist || !currentMediaId) return -1;
    return playlist.items.findIndex((it) => it.mediaId === currentMediaId);
  }, [playlist, currentMediaId]);
  if (!playlist) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Loading…" });
  }
  const selectionCount = selection.size;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/playlists",
            className: "rounded-md p-1.5 hover:bg-accent",
            title: "Back to playlists",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate text-lg font-semibold", children: playlist.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            playlist.items.length,
            " cue",
            playlist.items.length === 1 ? "" : "s",
            stats && stats.totalMs > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              " · est. ",
              formatDuration(stats.totalMs)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              " · updated ",
              new Date(playlist.updatedAt).toLocaleString()
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowLibrary((v) => !v),
            className: cn(
              "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs",
              showLibrary ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"
            ),
            title: "Toggle media library",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3.5 w-3.5" }),
              " Library"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowInfo((v) => !v),
            className: cn(
              "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs",
              showInfo ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"
            ),
            title: "Toggle info panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "h-3.5 w-3.5" }),
              " Info"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: exportPlaylist,
            className: "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs hover:bg-accent",
            title: "Export playlist as JSON",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
              " Export"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => projectIndex(0),
            className: "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs hover:bg-accent",
            title: "Project from start",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5" }),
              " Project"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              if (!playlist.items.length)
                return toast.error("Add at least one cue before starting Service Mode");
              navigate({ to: "/service/$id", params: { id: playlist.id } });
            },
            className: "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90",
            title: "Start Service Mode",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-3.5 w-3.5" }),
              " Service Mode"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-0 flex-1 overflow-hidden", children: [
      showLibrary && /* @__PURE__ */ jsxRuntimeExports.jsx(
        LibraryPanel,
        {
          media: allMedia,
          search: libSearch,
          setSearch: setLibSearch,
          filter: libFilter,
          setFilter: setLibFilter,
          onAdd: (ids) => addMedia(ids)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex min-w-0 flex-1 flex-col overflow-hidden",
          onDragOver: (e) => {
            if (Array.from(e.dataTransfer.types).includes("application/x-media-ids")) {
              e.preventDefault();
            }
          },
          onDrop: onTimelineDrop,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-4 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xs flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: tlSearch,
                    onChange: (e) => setTlSearch(e.target.value),
                    placeholder: "Search in playlist…",
                    className: "h-8 w-full rounded-md border border-input bg-background pl-8 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 rounded-md border border-input bg-background p-0.5", children: ["all", "image", "video"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setTlFilter(f),
                  className: cn(
                    "cursor-pointer rounded px-2 py-0.5 text-[11px] font-medium capitalize",
                    tlFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  ),
                  children: f === "all" ? "All" : f + "s"
                },
                f
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-[11px] text-muted-foreground", children: [
                visibleItems.length,
                " of ",
                playlist.items.length,
                " shown",
                tlSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTlSearch(""), className: "ml-2 cursor-pointer underline", children: "clear" })
              ] })
            ] }),
            selectionCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-accent/40 px-4 py-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                selectionCount,
                " item",
                selectionCount === 1 ? "" : "s",
                " selected"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => moveSelection(-1),
                  className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-1 hover:bg-accent",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }),
                    " Move up"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => moveSelection(1),
                  className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-1 hover:bg-accent",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" }),
                    " Move down"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => duplicateItems(Array.from(selection)),
                  className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-1 hover:bg-accent",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }),
                    " Duplicate"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: projectSelected,
                  className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-1 hover:bg-accent",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3" }),
                    " Project selected"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => removeItems(Array.from(selection)),
                  className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-destructive hover:bg-destructive/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
                    " Remove"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setSelection(/* @__PURE__ */ new Set()),
                  className: "ml-auto cursor-pointer text-muted-foreground hover:text-foreground",
                  children: "Clear selection"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 overflow-y-auto p-4",
                onMouseDown: (e) => {
                  if (e.target === e.currentTarget) setSelection(/* @__PURE__ */ new Set());
                },
                children: playlist.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground", children: [
                  "Drag media from the library on the left, or click",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "inline h-3.5 w-3.5" }),
                  " on any item to add it."
                ] }) : visibleItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground", children: "No cues match the current search or filter." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DndContext,
                  {
                    sensors,
                    collisionDetection: closestCenter,
                    onDragEnd,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SortableContext,
                      {
                        items: visibleItems.map((i) => i.id),
                        strategy: verticalListSortingStrategy,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: visibleItems.map((item) => {
                          const realIdx = playlist.items.findIndex((it) => it.id === item.id);
                          const media = mediaMap.get(item.mediaId);
                          const selected = selection.has(item.id);
                          const isCurrent = realIdx === currentItemIndex;
                          const isNext = currentItemIndex >= 0 && realIdx === currentItemIndex + 1;
                          const isUpcoming = currentItemIndex >= 0 && realIdx > currentItemIndex + 1;
                          return /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SortableRow,
                            {
                              item,
                              media,
                              index: realIdx,
                              selected,
                              focused: focusId === item.id,
                              isCurrent,
                              isNext,
                              isUpcoming,
                              notesOpen: notesFor === item.id,
                              onClick: (e) => handleRowClick(e, item.id),
                              onChange: (patch) => updateItem(item.id, patch),
                              onProject: () => projectIndex(realIdx),
                              onPreview: () => media && setPreviewTarget(media),
                              onRename: () => media && setRenameTarget(media),
                              onDuplicate: () => duplicateItems([item.id]),
                              onRemove: () => removeItems([item.id]),
                              onToggleNotes: () => setNotesFor((c) => c === item.id ? null : item.id)
                            },
                            item.id
                          );
                        }) })
                      }
                    )
                  }
                )
              }
            )
          ]
        }
      ),
      showInfo && stats && /* @__PURE__ */ jsxRuntimeExports.jsx(
        InfoPanel,
        {
          playlist,
          stats,
          mediaMap,
          currentIndex: currentItemIndex
        }
      )
    ] }),
    previewTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MediaPreview,
      {
        media: previewTarget,
        onClose: () => setPreviewTarget(null),
        onProject: () => {
          void projectMedia(previewTarget);
          setPreviewTarget(null);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RenameDialog,
      {
        open: !!renameTarget,
        initialName: renameTarget?.name ?? "",
        title: "File",
        onCancel: () => setRenameTarget(null),
        onSubmit: async (name) => {
          if (!renameTarget) return;
          await renameMedia(renameTarget.id, name);
          setRenameTarget(null);
          await refresh();
          toast.success("Renamed");
        }
      }
    )
  ] });
}
function LibraryPanel({
  media,
  search,
  setSearch,
  filter,
  setFilter,
  onAdd
}) {
  const visible = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return media.filter((m) => filter === "all" ? true : m.type === filter).filter((m) => !q ? true : m.name.toLowerCase().includes(q)).sort((a, b) => b.createdAt - a.createdAt);
  }, [media, search, filter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-card/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 border-b border-border p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Media Library" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search media…",
            className: "h-7 w-full rounded-md border border-input bg-background pl-7 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 flex items-center gap-0.5 rounded-md border border-input bg-background p-0.5", children: ["all", "image", "video"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setFilter(f),
          className: cn(
            "flex-1 cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-medium capitalize",
            filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          ),
          children: f === "all" ? "All" : f + "s"
        },
        f
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-1.5", children: visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-center text-xs text-muted-foreground", children: "No media." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: visible.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        draggable: true,
        onDragStart: (e) => e.dataTransfer.setData("application/x-media-ids", JSON.stringify([m.id])),
        onDoubleClick: () => onAdd([m.id]),
        className: "group flex cursor-grab items-center gap-2 rounded-md border border-transparent p-1 hover:border-border hover:bg-accent/50",
        title: "Drag into timeline or double-click to add",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: m, className: "h-9 w-14 shrink-0 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[11px] font-medium", title: m.name, children: m.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground", children: m.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDuration(m.durationMs) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatBytes(m.size) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onAdd([m.id]);
              },
              className: "invisible inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground group-hover:visible",
              title: "Add to playlist",
              "aria-label": "Add",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
            }
          )
        ]
      },
      m.id
    )) }) })
  ] });
}
function InfoPanel({
  playlist,
  stats,
  mediaMap,
  currentIndex
}) {
  const items = playlist.items;
  const current = currentIndex >= 0 ? items[currentIndex] : null;
  const next = currentIndex >= 0 ? items[currentIndex + 1] : items[0] ?? null;
  const upcoming = currentIndex >= 0 ? items[currentIndex + 2] : items[1] ?? null;
  const renderCueRow = (label, item, tone) => {
    const m = item ? mediaMap.get(item.mediaId) : null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "rounded-md border p-2",
          tone === "live" ? "border-primary/60 bg-primary/10" : tone === "next" ? "border-primary/30 bg-accent/40" : "border-border bg-background"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "mb-1 text-[9px] font-bold uppercase tracking-widest",
                tone === "live" ? "text-primary" : "text-muted-foreground"
              ),
              children: label
            }
          ),
          item && m ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: m, className: "h-9 w-14 shrink-0 rounded" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[12px] font-medium", children: item.label || m.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: m.type === "video" ? `Video · ${formatDuration(m.durationMs)}` : `Image · ${Math.round(item.durationMs / 1e3)}s` })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "—" })
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "flex w-72 shrink-0 flex-col overflow-hidden border-l border-border bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 overflow-y-auto p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Up Now" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        renderCueRow("Current", current, "live"),
        renderCueRow("Next", next, "next"),
        renderCueRow("Upcoming", upcoming, "upcoming")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Statistics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-1.5 text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Total items", value: String(stats.total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Total duration", value: formatDuration(stats.totalMs) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatTile,
          {
            label: "Videos",
            value: String(stats.videos),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-3 w-3" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatTile,
          {
            label: "Images",
            value: String(stats.images),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3 w-3" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatTile,
          {
            label: "Avg video",
            value: stats.avgVideoMs ? formatDuration(stats.avgVideoMs) : "—"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatTile,
          {
            label: "Largest file",
            value: stats.largest ? formatBytes(stats.largest.size) : "—",
            title: stats.largest?.name
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "text-[11px] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "Created ",
        new Date(playlist.createdAt).toLocaleString()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "Updated ",
        new Date(playlist.updatedAt).toLocaleString()
      ] })
    ] })
  ] }) });
}
function StatTile({
  label,
  value,
  icon,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background p-2", title, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[9px] uppercase tracking-wide text-muted-foreground", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 truncate text-sm font-semibold", children: value })
  ] });
}
function SortableRow({
  item,
  media,
  index,
  selected,
  focused,
  isCurrent,
  isNext,
  isUpcoming,
  notesOpen,
  onClick,
  onChange,
  onProject,
  onPreview,
  onRename,
  onDuplicate,
  onRemove,
  onToggleNotes
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: setNodeRef,
      style,
      onClick,
      className: cn(
        "group rounded-md border bg-card p-1.5 transition",
        isCurrent ? "border-primary ring-2 ring-primary/60" : selected ? "border-primary/60 ring-1 ring-primary/40" : isNext ? "border-primary/30" : "border-border",
        focused && !selected && "ring-1 ring-ring"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              ...attributes,
              ...listeners,
              onClick: (e) => e.stopPropagation(),
              className: "cursor-grab p-1 text-muted-foreground",
              "aria-label": "Drag",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 shrink-0 text-center text-[11px] font-medium tabular-nums text-muted-foreground", children: index + 1 }),
          media ? /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media, className: "h-10 w-16 shrink-0 rounded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-16 shrink-0 rounded bg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[13px] font-medium", children: item.label || media?.name || "Missing media" }),
              isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground", children: "Currently Projecting" }),
              isNext && !isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded border border-primary/40 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary", children: "Next" }),
              isUpcoming && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded border border-border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground", children: "Upcoming" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-muted-foreground", children: [
              media?.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-3 w-3" }),
                  " Video"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatDuration(media.durationMs) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatBytes(media.size) })
              ] }) : media?.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3 w-3" }),
                  " Image"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatBytes(media.size) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "Missing" }),
              item.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 italic opacity-80", children: "· note" })
            ] })
          ] }),
          media?.type === "image" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: "hidden items-center gap-1 text-[10px] text-muted-foreground sm:flex",
              onClick: (e) => e.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: 1,
                    max: 3600,
                    step: 1,
                    value: Math.round(item.durationMs / 1e3),
                    onChange: (e) => onChange({ durationMs: Math.max(1, Number(e.target.value)) * 1e3 }),
                    className: "h-7 w-14 rounded border border-input bg-background px-1.5 text-xs",
                    "aria-label": "Image duration in seconds"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "s" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: item.transition,
              onChange: (e) => onChange({ transition: e.target.value }),
              onClick: (e) => e.stopPropagation(),
              className: "hidden h-7 rounded border border-input bg-background px-1.5 text-[11px] md:block",
              children: TRANSITIONS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RowAction,
              {
                label: "Preview",
                onClick: (e) => {
                  e.stopPropagation();
                  onPreview();
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RowAction,
              {
                label: "Project",
                onClick: (e) => {
                  e.stopPropagation();
                  onProject();
                },
                variant: "primary",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RowAction,
              {
                label: "Notes",
                onClick: (e) => {
                  e.stopPropagation();
                  onToggleNotes();
                },
                active: notesOpen || !!item.notes,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RowAction,
              {
                label: "Rename",
                onClick: (e) => {
                  e.stopPropagation();
                  onRename();
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RowAction,
              {
                label: "Duplicate",
                onClick: (e) => {
                  e.stopPropagation();
                  onDuplicate();
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RowAction,
              {
                label: "Remove",
                onClick: (e) => {
                  e.stopPropagation();
                  onRemove();
                },
                variant: "danger",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        notesOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mt-1.5 space-y-1.5 border-t border-border pt-1.5",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: item.label ?? "",
                  onChange: (e) => onChange({ label: e.target.value }),
                  placeholder: media?.name ?? "Cue label",
                  className: "h-7 w-full rounded border border-input bg-background px-2 text-xs"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: item.notes ?? "",
                  onChange: (e) => onChange({ notes: e.target.value }),
                  rows: 2,
                  placeholder: "Operator notes for this cue…",
                  className: "w-full rounded border border-input bg-background px-2 py-1 text-xs"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function RowAction({
  children,
  onClick,
  label,
  variant,
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      "aria-label": label,
      title: label,
      className: cn(
        "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded border",
        variant === "primary" ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20" : variant === "danger" ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20" : active ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
      ),
      children
    }
  );
}
function PlaylistEditorRoute() {
  const {
    id
  } = Route.useParams();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PlaylistEditor, { id });
}
export {
  PlaylistEditorRoute as component
};
