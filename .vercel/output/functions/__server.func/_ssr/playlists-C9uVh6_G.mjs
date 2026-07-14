import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { U as duplicatePlaylist, V as renamePlaylist, W as createPlaylist, X as deletePlaylist, Y as listPlaylists, g as getMedia, k as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, p as DialogDescription, s as DialogFooter } from "./router-KP2FEINE.mjs";
import { a as projectPlaylist, T as Thumb } from "./Thumb-CnVrOvK8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as RenameDialog } from "./RenameDialog-BApqqlGm.mjs";
import "../_libs/dexie.mjs";
import { a3 as Plus, L as ListVideo, E as Eye, _ as Film, I as Image, p as Play, a6 as Pencil, a5 as Copy, i as Trash2 } from "../_libs/lucide-react.mjs";
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
function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onCancel,
  onConfirm
}) {
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open) setBusy(false);
  }, [open]);
  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && !busy && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          disabled: busy,
          className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50",
          children: cancelLabel
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleConfirm,
          disabled: busy,
          className: "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-50 " + (destructive ? "bg-destructive text-destructive-foreground hover:opacity-90" : "bg-primary text-primary-foreground hover:opacity-90"),
          children: busy ? "Working…" : confirmLabel
        }
      )
    ] })
  ] }) });
}
function PlaylistPreviewDialog({
  playlist,
  onClose
}) {
  const [items, setItems] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!playlist) {
        setItems([]);
        return;
      }
      const resolved = await Promise.all(
        playlist.items.map(async (it) => ({
          id: it.id,
          media: await getMedia(it.mediaId) ?? null
        }))
      );
      if (!cancelled) setItems(resolved);
    })();
    return () => {
      cancelled = true;
    };
  }, [playlist]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!playlist, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { className: "h-5 w-5 text-primary" }),
        playlist?.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        playlist?.items.length ?? 0,
        " item",
        (playlist?.items.length ?? 0) === 1 ? "" : "s",
        playlist && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " · Updated ",
          formatRelative$1(playlist.updatedAt)
        ] })
      ] })
    ] }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "This playlist is empty." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: items.map((it, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-right font-mono text-xs text-muted-foreground", children: idx + 1 }),
      it.media ? /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: it.media, className: "h-12 w-16 shrink-0 rounded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-16 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground", children: "?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", children: it.media?.name ?? "Missing media" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: it.media?.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-3 w-3" }),
          " Video"
        ] }) : it.media?.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3 w-3" }),
          " Image"
        ] }) : "Unknown" })
      ] }),
      playlist && it.media && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => projectPlaylist(playlist, idx),
          className: "inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:opacity-90",
          title: "Project from here",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3" })
        }
      )
    ] }, it.id)) }) })
  ] }) });
}
function formatRelative$1(ts) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1e3);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
function PlaylistsPage() {
  const [playlists, setPlaylists] = reactExports.useState([]);
  const [renameTarget, setRenameTarget] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [previewTarget, setPreviewTarget] = reactExports.useState(null);
  const refresh = async () => setPlaylists(await listPlaylists());
  reactExports.useEffect(() => {
    void refresh();
  }, []);
  const projectPlaylist$1 = async (p) => {
    if (!p.items.length) return toast.error("Playlist is empty");
    await projectPlaylist(p, 0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-y-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Playlists" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Organize media into ordered sequences for services." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setCreating(true),
          className: "inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " New Playlist"
          ]
        }
      )
    ] }),
    playlists.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-dashed border-border p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-foreground", children: "No playlists yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create one to group media for a service." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: playlists.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlaylistCard,
      {
        playlist: p,
        onProject: () => projectPlaylist$1(p),
        onPreview: () => setPreviewTarget(p),
        onRename: () => setRenameTarget(p),
        onDuplicate: async () => {
          await duplicatePlaylist(p.id);
          await refresh();
        },
        onDelete: () => setDeleteTarget(p)
      },
      p.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RenameDialog,
      {
        open: !!renameTarget,
        initialName: renameTarget?.name ?? "",
        title: "Playlist",
        onCancel: () => setRenameTarget(null),
        onSubmit: async (name) => {
          if (!renameTarget) return;
          await renamePlaylist(renameTarget.id, name);
          setRenameTarget(null);
          await refresh();
          toast.success("Playlist renamed");
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RenameDialog,
      {
        open: creating,
        initialName: "",
        title: "New playlist",
        label: "Playlist name",
        onCancel: () => setCreating(false),
        onSubmit: async (name) => {
          await createPlaylist(name);
          setCreating(false);
          await refresh();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteTarget,
        title: "Delete Playlist",
        description: deleteTarget ? `Delete playlist "${deleteTarget.name}" only? The playlist is removed. Media files remain untouched.` : "",
        confirmLabel: "Delete Playlist",
        destructive: true,
        onCancel: () => setDeleteTarget(null),
        onConfirm: async () => {
          if (!deleteTarget) return;
          await deletePlaylist(deleteTarget.id);
          setDeleteTarget(null);
          await refresh();
          toast.success("Playlist deleted");
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PlaylistPreviewDialog, { playlist: previewTarget, onClose: () => setPreviewTarget(null) })
  ] }) });
}
function PlaylistCard({
  playlist,
  onProject,
  onPreview,
  onRename,
  onDuplicate,
  onDelete
}) {
  const [thumbs, setThumbs] = reactExports.useState([]);
  const [allItems, setAllItems] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      const records = await Promise.all(playlist.items.map((i) => getMedia(i.mediaId)));
      const filtered = records.filter((m) => !!m);
      if (!cancelled) {
        setAllItems(filtered);
        setThumbs(filtered.slice(0, 4));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [playlist.items]);
  const counts = reactExports.useMemo(() => {
    let videos = 0;
    let images = 0;
    for (const t of allItems) {
      if (t.type === "video") videos++;
      else if (t.type === "image") images++;
    }
    return { videos, images };
  }, [allItems]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: onPreview,
        className: "relative block aspect-video w-full cursor-pointer overflow-hidden bg-muted",
        title: "Preview playlist",
        children: [
          thumbs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { className: "h-8 w-8 opacity-50" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbMosaic, { items: thumbs }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur opacity-0 transition-opacity group-hover:opacity-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }),
            " Preview"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { className: "h-3 w-3" }),
            playlist.items.length
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/playlists/$id",
          params: { id: playlist.id },
          className: "cursor-pointer truncate text-sm font-semibold leading-tight hover:text-primary",
          title: playlist.name,
          children: playlist.name
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Updated ",
          formatRelative(playlist.updatedAt)
        ] }),
        (counts.videos > 0 || counts.images > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          counts.videos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-3 w-3" }),
            counts.videos
          ] }),
          counts.images > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3 w-3" }),
            counts.images
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onProject,
            className: "inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90",
            title: "Project playlist",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3" }),
              " Project"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { onClick: onPreview, label: "Preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { onClick: onRename, label: "Rename", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { onClick: onDuplicate, label: "Duplicate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { onClick: onDelete, label: "Delete", destructive: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] })
  ] });
}
function ThumbMosaic({ items }) {
  const slots = items.slice(0, 4);
  if (slots.length === 1) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: slots[0], className: "h-full w-full" });
  }
  if (slots.length === 2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full w-full grid-cols-2 gap-px bg-border", children: slots.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: m, className: "h-full w-full" }, m.id)) });
  }
  if (slots.length === 3) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid h-full w-full grid-cols-2 grid-rows-2 gap-px bg-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: slots[0], className: "row-span-2 h-full w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: slots[1], className: "h-full w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: slots[2], className: "h-full w-full" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full w-full grid-cols-2 grid-rows-2 gap-px bg-border", children: slots.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: m, className: "h-full w-full" }, m.id)) });
}
function IconAction({
  children,
  onClick,
  label,
  destructive
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      "aria-label": label,
      title: label,
      className: "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border transition " + (destructive ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20" : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"),
      children
    }
  );
}
function formatRelative(ts) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1e3);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(PlaylistsPage, {});
export {
  SplitComponent as component
};
