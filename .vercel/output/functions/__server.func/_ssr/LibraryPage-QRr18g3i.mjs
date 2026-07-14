import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a6 as useMediaFavorites, h as cn, l as listAllMedia, Z as listMediaInFolder, _ as listFolders, $ as renameFolder, a0 as createFolder, a1 as deleteFolderDeep, a2 as deleteFolderOnly, Y as listPlaylists, a7 as duplicateMedia, q as formatDuration, a5 as formatBytes, a8 as renameMedia, k as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, s as DialogFooter, p as DialogDescription, a9 as deleteMedia, a3 as moveMedia, aa as addMediaToPlaylist, a4 as importFiles } from "./router-KP2FEINE.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as RenameDialog } from "./RenameDialog-BApqqlGm.mjs";
import { p as projectMedia, T as Thumb } from "./Thumb-CnVrOvK8.mjs";
import { M as MediaPreview } from "./MediaPreview-Bh211P_H.mjs";
import { h as Search, a2 as Funnel, F as FolderTree$1, P as PanelLeftClose, a8 as ListPlus, a9 as FolderInput, a5 as Copy, a6 as Pencil, i as Trash2, aa as FolderPlus, ab as House, U as Upload, c as Star, E as Eye, ac as Info, ad as TriangleAlert, ae as FolderOpen, af as Folder, a3 as Plus, W as Check } from "../_libs/lucide-react.mjs";
import { c as create } from "../_libs/zustand.mjs";
const useLibrary = create((set, get) => ({
  folders: [],
  media: [],
  currentFolderId: null,
  selection: /* @__PURE__ */ new Set(),
  search: "",
  filter: "all",
  loading: false,
  refreshFolders: async () => {
    set({ folders: await listFolders() });
  },
  refreshMedia: async () => {
    set({ loading: true });
    const { currentFolderId, filter } = get();
    let media;
    if (filter === "recent-added") {
      media = (await listAllMedia()).sort((a, b) => b.createdAt - a.createdAt).slice(0, 200);
    } else if (filter === "recent-used") {
      media = (await listAllMedia()).filter((m) => m.lastUsedAt).sort((a, b) => (b.lastUsedAt ?? 0) - (a.lastUsedAt ?? 0)).slice(0, 200);
    } else if (currentFolderId === null) {
      media = await listAllMedia();
    } else {
      media = await listMediaInFolder(currentFolderId);
    }
    set({ media, loading: false });
  },
  refreshAll: async () => {
    await get().refreshFolders();
    await get().refreshMedia();
  },
  setFolder: async (id) => {
    set({ currentFolderId: id, selection: /* @__PURE__ */ new Set() });
    await get().refreshMedia();
  },
  setSearch: (s) => set({ search: s }),
  setFilter: (f) => {
    set({ filter: f, selection: /* @__PURE__ */ new Set() });
    void get().refreshMedia();
  },
  toggleSelect: (id, additive = false) => {
    const sel = new Set(additive ? get().selection : []);
    if (sel.has(id)) sel.delete(id);
    else sel.add(id);
    set({ selection: sel });
  },
  clearSelection: () => set({ selection: /* @__PURE__ */ new Set() }),
  selectAll: (ids) => set({ selection: new Set(ids) })
}));
function filterMedia(items, search, filter) {
  let out = items;
  if (filter === "images") out = out.filter((m) => m.type === "image");
  else if (filter === "videos") out = out.filter((m) => m.type === "video");
  const q = search.trim().toLowerCase();
  if (q) out = out.filter((m) => m.name.toLowerCase().includes(q));
  return out;
}
function FolderCreateDialog({
  open,
  siblingNames,
  parentLabel,
  onCancel,
  onSubmit
}) {
  const [value, setValue] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (open) {
      setValue("");
      setError(null);
      setBusy(false);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);
  const validate = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return "Folder name cannot be empty";
    if (trimmed.length > 200) return "Folder name is too long";
    const lower = trimmed.toLowerCase();
    if (siblingNames.some((n) => n.trim().toLowerCase() === lower))
      return "A folder with this name already exists here";
    return null;
  };
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const err = validate(value);
    if (err) {
      setError(err);
      return;
    }
    try {
      setBusy(true);
      await onSubmit(value.trim());
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && !busy && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New folder" }),
      parentLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        "Inside: ",
        parentLabel
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Folder name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          value,
          onChange: (e) => {
            setValue(e.target.value);
            if (error) setError(null);
          },
          placeholder: "e.g. Sunday Service",
          className: "h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
          "aria-label": "Folder name",
          "aria-invalid": !!error,
          disabled: busy
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-destructive", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            disabled: busy,
            className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: busy,
            className: "cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
            children: "Create"
          }
        )
      ] })
    ] })
  ] }) });
}
function FolderDeleteDialog({
  open,
  folderName,
  onCancel,
  onConfirm
}) {
  const [mode, setMode] = reactExports.useState("folder-only");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open) {
      setMode("folder-only");
      setBusy(false);
    }
  }, [open]);
  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm(mode);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && !busy && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Folder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        '"',
        folderName,
        '" — choose what to delete.'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "radio",
            name: "folder-delete-mode",
            checked: mode === "folder-only",
            onChange: () => setMode("folder-only"),
            className: "mt-0.5 h-4 w-4 cursor-pointer accent-primary"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Delete Folder Only" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-xs text-muted-foreground", children: "Folder removed. Files remain and automatically move to All Media." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "radio",
            name: "folder-delete-mode",
            checked: mode === "folder-and-files",
            onChange: () => setMode("folder-and-files"),
            className: "mt-0.5 h-4 w-4 cursor-pointer accent-destructive"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-destructive", children: "Delete Folder And Files" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-xs text-muted-foreground", children: "Folder removed. All files inside are permanently deleted." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          disabled: busy,
          className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleConfirm,
          disabled: busy,
          className: "cursor-pointer rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50",
          children: busy ? "Deleting…" : "Delete"
        }
      )
    ] })
  ] }) });
}
function buildTree(folders) {
  const byParent = /* @__PURE__ */ new Map();
  for (const f of folders) {
    const arr = byParent.get(f.parentId) ?? [];
    arr.push(f);
    byParent.set(f.parentId, arr);
  }
  const make = (parentId) => (byParent.get(parentId) ?? []).sort((a, b) => a.name.localeCompare(b.name)).map((folder) => ({ folder, children: make(folder.id) }));
  return make(null);
}
function FolderTree() {
  const folders = useLibrary((s) => s.folders);
  const currentFolderId = useLibrary((s) => s.currentFolderId);
  const setFolder = useLibrary((s) => s.setFolder);
  const refreshFolders = useLibrary((s) => s.refreshFolders);
  const refreshMedia = useLibrary((s) => s.refreshMedia);
  const selection = useLibrary((s) => s.selection);
  const clearSelection = useLibrary((s) => s.clearSelection);
  const tree = reactExports.useMemo(() => buildTree(folders), [folders]);
  const [renameTarget, setRenameTarget] = reactExports.useState(null);
  const [createFor, setCreateFor] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  reactExports.useEffect(() => {
    void refreshFolders();
  }, [refreshFolders]);
  const siblingNamesFor = (parentId) => folders.filter((f) => f.parentId === parentId).map((f) => f.name);
  const onDropMedia = async (e, folderId) => {
    e.preventDefault();
    const ids = e.dataTransfer.getData("application/x-media-ids");
    if (!ids) return;
    const parsed = JSON.parse(ids);
    await moveMedia(parsed, folderId);
    clearSelection();
    await refreshMedia();
    toast.success(`Moved ${parsed.length} item${parsed.length > 1 ? "s" : ""}`);
  };
  const renderNode = (n, depth) => {
    const active = currentFolderId === n.folder.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => setFolder(n.folder.id),
          onDragOver: (e) => e.preventDefault(),
          onDrop: (e) => onDropMedia(e, n.folder.id),
          className: cn(
            "group flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-xs",
            active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
          ),
          style: { paddingLeft: depth * 10 + 6 },
          title: n.folder.name,
          children: [
            active ? /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-3.5 w-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: n.folder.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invisible flex items-center gap-0.5 group-hover:visible", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setCreateFor({ parentId: n.folder.id, parentLabel: n.folder.name });
                  },
                  className: "cursor-pointer rounded p-0.5 hover:bg-background",
                  "aria-label": "New subfolder",
                  title: "New subfolder",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setRenameTarget(n.folder);
                  },
                  className: "cursor-pointer rounded p-0.5 hover:bg-background",
                  "aria-label": "Rename folder",
                  title: "Rename",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setDeleteTarget(n.folder);
                  },
                  className: "cursor-pointer rounded p-0.5 hover:bg-background",
                  "aria-label": "Delete folder",
                  title: "Delete",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                }
              )
            ] })
          ]
        }
      ),
      n.children.map((c) => renderNode(c, depth + 1))
    ] }, n.folder.id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center justify-between gap-1 px-2 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Folders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setCreateFor({
            parentId: currentFolderId,
            parentLabel: currentFolderId === null ? "All Media" : folders.find((f) => f.id === currentFolderId)?.name
          }),
          className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground hover:bg-accent",
          "aria-label": "New folder",
          title: "New folder",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "h-3 w-3" }),
            "New"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-1 pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => setFolder(null),
          onDragOver: (e) => e.preventDefault(),
          onDrop: (e) => onDropMedia(e, null),
          className: cn(
            "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs",
            currentFolderId === null ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "All Media" }),
            selection.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground", children: selection.size })
          ]
        }
      ),
      tree.map((n) => renderNode(n, 0))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RenameDialog,
      {
        open: !!renameTarget,
        initialName: renameTarget?.name ?? "",
        title: "Folder",
        onCancel: () => setRenameTarget(null),
        onSubmit: async (name) => {
          if (!renameTarget) return;
          await renameFolder(renameTarget.id, name);
          setRenameTarget(null);
          await refreshFolders();
          toast.success("Folder renamed");
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FolderCreateDialog,
      {
        open: !!createFor,
        siblingNames: createFor ? siblingNamesFor(createFor.parentId) : [],
        parentLabel: createFor?.parentLabel,
        onCancel: () => setCreateFor(null),
        onSubmit: async (name) => {
          const parentId = createFor?.parentId ?? null;
          const rec = await createFolder(name, parentId);
          setCreateFor(null);
          await refreshFolders();
          await setFolder(rec.id);
          toast.success(`Folder "${rec.name}" created`);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FolderDeleteDialog,
      {
        open: !!deleteTarget,
        folderName: deleteTarget?.name ?? "",
        onCancel: () => setDeleteTarget(null),
        onConfirm: async (mode) => {
          if (!deleteTarget) return;
          if (mode === "folder-and-files") {
            await deleteFolderDeep(deleteTarget.id);
            toast.success("Folder and files deleted");
          } else {
            await deleteFolderOnly(deleteTarget.id);
            toast.success("Folder deleted · files moved to All Media");
          }
          if (currentFolderId === deleteTarget.id) await setFolder(null);
          setDeleteTarget(null);
          await refreshFolders();
          await refreshMedia();
        }
      }
    )
  ] });
}
function Dropzone({ folderId, onDone, className }) {
  const [hover, setHover] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(null);
  const onFiles = async (files) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    setProgress({ done: 0, total: arr.length });
    try {
      const { imported, skipped } = await importFiles(arr, folderId, (p) => setProgress(p));
      if (imported.length)
        toast.success(`Imported ${imported.length} file${imported.length > 1 ? "s" : ""}`);
      if (skipped.length)
        toast.error(`Skipped ${skipped.length} file${skipped.length > 1 ? "s" : ""}`);
      onDone?.();
    } catch (e) {
      toast.error("Import failed: " + e.message);
    } finally {
      setProgress(null);
    }
  };
  const onDrop = (e) => {
    e.preventDefault();
    setHover(false);
    if (e.dataTransfer?.files) void onFiles(e.dataTransfer.files);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onDragOver: (e) => {
        e.preventDefault();
        setHover(true);
      },
      onDragLeave: () => setHover(false),
      onDrop,
      className: `relative rounded-lg border-2 border-dashed p-6 text-center transition ${hover ? "border-primary bg-primary/5" : "border-border"} ${className ?? ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "file-input",
            type: "file",
            multiple: true,
            accept: "image/*,video/mp4,video/webm,video/quicktime",
            className: "hidden",
            onChange: (e) => e.target.files && onFiles(e.target.files)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground", children: "Drag & drop images, posters, or videos here" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center justify-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Images" }),
          ["JPG", "JPEG", "PNG", "WEBP", "GIF"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground/80",
              children: f
            },
            f
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 text-muted-foreground/40", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Videos" }),
          ["MP4", "WEBM", "MOV"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground/80",
              children: f
            },
            f
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "file-input",
            className: "mt-3 inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90",
            children: "Choose Files"
          }
        ),
        progress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/95", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", children: [
            "Importing ",
            progress.done,
            "/",
            progress.total
          ] }),
          progress.current && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[80%] truncate text-xs text-muted-foreground", children: progress.current }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-3/4 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-primary transition-all",
              style: { width: `${progress.done / progress.total * 100}%` }
            }
          ) })
        ] })
      ]
    }
  );
}
function MediaDeleteDialog({
  open,
  items,
  folders,
  onCancel,
  onConfirm
}) {
  const [busy, setBusy] = reactExports.useState(false);
  const confirmRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (open) {
      setBusy(false);
      const t = setTimeout(() => confirmRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Enter" && !busy) {
        e.preventDefault();
        void run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);
  const run = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };
  const folderName = (id) => id === null ? "All Media" : folders.find((f) => f.id === id)?.name ?? "Unknown folder";
  const single = items.length === 1 ? items[0] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && !busy && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive" }),
        "Delete ",
        single ? "file" : `${items.length} files`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "This action cannot be undone." })
    ] }),
    single ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/30 p-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Name", value: single.name, mono: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Type", value: single.type === "video" ? "Video" : "Image" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Folder", value: folderName(single.folderId) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/30 p-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground", children: [
        items.length,
        " items"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "max-h-32 space-y-0.5 overflow-y-auto text-xs", children: [
        items.slice(0, 8).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "truncate text-foreground/80", children: [
          "• ",
          m.name
        ] }, m.id)),
        items.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-muted-foreground", children: [
          "…and ",
          items.length - 8,
          " more"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          disabled: busy,
          className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          ref: confirmRef,
          type: "button",
          onClick: run,
          disabled: busy,
          className: "cursor-pointer rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50",
          children: busy ? "Deleting…" : "Delete"
        }
      )
    ] })
  ] }) });
}
function Row({ label, value, mono }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3 py-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-16 shrink-0 text-xs uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "min-w-0 flex-1 truncate " + (mono ? "font-mono text-xs" : "text-sm"),
        title: value,
        children: value
      }
    )
  ] });
}
function MoveMediaDialog({
  open,
  count,
  folders,
  currentFolderId,
  onCancel,
  onConfirm
}) {
  const [target, setTarget] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open) {
      setTarget(currentFolderId);
      setBusy(false);
    }
  }, [open, currentFolderId]);
  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm(target);
    } finally {
      setBusy(false);
    }
  };
  const sorted = [...folders].sort((a, b) => a.name.localeCompare(b.name));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && !busy && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Move ",
        count,
        " ",
        count === 1 ? "file" : "files"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Select a destination folder." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-64 overflow-y-auto rounded-md border border-border bg-muted/20 p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FolderRow,
        {
          label: "All Media (root)",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-4 w-4" }),
          selected: target === null,
          current: currentFolderId === null,
          onClick: () => setTarget(null)
        }
      ),
      sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4 text-center text-xs text-muted-foreground", children: "No folders. Create one in the folder rail first." }) : sorted.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        FolderRow,
        {
          label: f.name,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4" }),
          selected: target === f.id,
          current: currentFolderId === f.id,
          onClick: () => setTarget(f.id)
        },
        f.id
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          disabled: busy,
          className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleConfirm,
          disabled: busy || target === currentFolderId,
          className: "cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50",
          children: busy ? "Moving…" : "Move"
        }
      )
    ] })
  ] }) });
}
function FolderRow({
  label,
  icon,
  selected,
  current,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition",
        selected ? "bg-primary/15 text-foreground" : "hover:bg-accent"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate", children: label }),
        current && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground", children: "Current" }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-primary" })
      ]
    }
  );
}
function MediaDetailsDialog({ open, media, folders, onClose }) {
  if (!media) return null;
  const folderName = media.folderId === null ? "All Media (root)" : folders.find((f) => f.id === media.folderId)?.name ?? "Unknown folder";
  const uploaded = new Date(media.createdAt).toLocaleString();
  const resolution = media.width && media.height ? `${media.width} × ${media.height}` : "—";
  const rows = media.type === "video" ? [
    ["Name", media.name],
    ["Type", "Video"],
    ["Size", formatBytes(media.size)],
    ["Duration", formatDuration(media.durationMs)],
    ["Resolution", resolution],
    ["Folder", folderName],
    ["Uploaded", uploaded]
  ] : [
    ["Name", media.name],
    ["Type", "Image"],
    ["Size", formatBytes(media.size)],
    ["Resolution", resolution],
    ["Folder", folderName],
    ["Uploaded", uploaded]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Media details" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "divide-y divide-border rounded-md border border-border bg-muted/20 text-sm", children: rows.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "w-24 shrink-0 text-xs uppercase tracking-wide text-muted-foreground", children: k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "min-w-0 flex-1 break-words text-foreground", title: v, children: v })
    ] }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onClose,
        className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent",
        children: "Close"
      }
    ) })
  ] }) });
}
const FILTERS = [
  { value: "all", label: "All" },
  { value: "images", label: "Images" },
  { value: "videos", label: "Videos" },
  { value: "recent-used", label: "Recently Used" }
];
function LibraryPage() {
  const {
    media,
    search,
    filter,
    selection,
    currentFolderId,
    folders,
    setSearch,
    setFilter,
    toggleSelect,
    clearSelection,
    selectAll,
    refreshAll,
    refreshMedia
  } = useLibrary();
  const favIds = useMediaFavorites((s) => s.ids);
  const toggleFav = useMediaFavorites((s) => s.toggle);
  const favSet = reactExports.useMemo(() => new Set(favIds), [favIds]);
  const [preview, setPreview] = reactExports.useState(null);
  const [playlists, setPlaylists] = reactExports.useState([]);
  const [showAddTo, setShowAddTo] = reactExports.useState(false);
  const [renameTarget, setRenameTarget] = reactExports.useState(null);
  const [detailsTarget, setDetailsTarget] = reactExports.useState(null);
  const [deleteTargets, setDeleteTargets] = reactExports.useState(null);
  const [showMove, setShowMove] = reactExports.useState(false);
  const [selectionMode, setSelectionMode] = reactExports.useState(false);
  const [foldersCollapsed, setFoldersCollapsed] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("church-media-folders-collapsed-v1") === "1";
  });
  reactExports.useEffect(() => {
    try {
      window.localStorage.setItem(
        "church-media-folders-collapsed-v1",
        foldersCollapsed ? "1" : "0"
      );
    } catch {
    }
  }, [foldersCollapsed]);
  const anchorIndexRef = reactExports.useRef(null);
  const gridRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    void refreshAll();
  }, [refreshAll]);
  const visible = reactExports.useMemo(() => filterMedia(media, search, filter), [media, search, filter]);
  const selectedIds = reactExports.useMemo(() => Array.from(selection), [selection]);
  reactExports.useEffect(() => {
    if (selectionMode && selection.size === 0) setSelectionMode(false);
  }, [selection, selectionMode]);
  const projectOne = reactExports.useCallback(async (m) => {
    await projectMedia(m);
  }, []);
  const handleTileClick = reactExports.useCallback(
    (e, m, index) => {
      if (selectionMode) {
        if (e.shiftKey) {
          const anchor = anchorIndexRef.current ?? index;
          const [start, end] = anchor <= index ? [anchor, index] : [index, anchor];
          const ids = visible.slice(start, end + 1).map((x) => x.id);
          selectAll(ids);
          return;
        }
        anchorIndexRef.current = index;
        toggleSelect(m.id, true);
        return;
      }
      anchorIndexRef.current = index;
      void projectOne(m);
    },
    [projectOne, selectAll, selectionMode, toggleSelect, visible]
  );
  const enterSelectionWith = reactExports.useCallback(
    (m, index) => {
      setSelectionMode(true);
      anchorIndexRef.current = index;
      toggleSelect(m.id, true);
    },
    [toggleSelect]
  );
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        const target = e.target;
        const tag = target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
        const grid = gridRef.current;
        if (!grid) return;
        e.preventDefault();
        selectAll(visible.map((m) => m.id));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectAll, visible]);
  const requestDeleteSelection = () => {
    if (!selectedIds.length) return;
    const items = visible.filter((m) => selection.has(m.id));
    if (items.length) setDeleteTargets(items);
  };
  const confirmDelete = async () => {
    if (!deleteTargets) return;
    await deleteMedia(deleteTargets.map((m) => m.id));
    setDeleteTargets(null);
    clearSelection();
    await refreshMedia();
    toast.success("Deleted");
  };
  const onDuplicate = async () => {
    await duplicateMedia(selectedIds);
    await refreshMedia();
    toast.success("Duplicated");
  };
  const confirmMove = async (folderId) => {
    await moveMedia(selectedIds, folderId);
    setShowMove(false);
    clearSelection();
    await refreshMedia();
    toast.success("Moved");
  };
  const onAddToPlaylist = async () => {
    setPlaylists(await listPlaylists());
    setShowAddTo(true);
  };
  const onRenameSubmit = async (name) => {
    if (!renameTarget) return;
    await renameMedia(renameTarget.id, name);
    setRenameTarget(null);
    await refreshMedia();
    toast.success("Renamed");
  };
  const grouped = reactExports.useMemo(() => {
    if (filter !== "all" && filter !== "recent-added") return null;
    const sorted = [...visible].sort((a, b) => b.createdAt - a.createdAt);
    const groups = /* @__PURE__ */ new Map();
    const order = [];
    const today = startOfDay(Date.now());
    const yesterday = today - 864e5;
    const lastWeekStart = today - 7 * 864e5;
    for (const m of sorted) {
      const day = startOfDay(m.createdAt);
      let label;
      if (day === today) label = "Today";
      else if (day === yesterday) label = "Yesterday";
      else if (day >= lastWeekStart) label = "Last Week";
      else
        label = new Date(day).toLocaleDateString(void 0, {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      if (!groups.has(label)) {
        groups.set(label, []);
        order.push(label);
      }
      groups.get(label).push(m);
    }
    return order.map((label) => ({ label, items: groups.get(label) }));
  }, [filter, visible]);
  const renderCard = (m, idx) => {
    const selected = selection.has(m.id);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        draggable: true,
        onDragStart: (e) => {
          const ids = selected ? selectedIds : [m.id];
          e.dataTransfer.setData("application/x-media-ids", JSON.stringify(ids));
        },
        onClick: (e) => handleTileClick(e, m, idx),
        onDoubleClick: (e) => {
          e.stopPropagation();
          if (!selectionMode) setPreview(m);
        },
        title: selectionMode ? "Click to select · Shift-click range" : "Click to project · Double-click to preview",
        className: cn(
          "group relative cursor-pointer overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
          selected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: m, className: "aspect-video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "absolute left-1.5 top-1.5 transition",
                  selectionMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: selected,
                    onChange: (e) => {
                      e.stopPropagation();
                      if (!selectionMode) enterSelectionWith(m, idx);
                      else {
                        anchorIndexRef.current = idx;
                        toggleSelect(m.id, true);
                      }
                    },
                    onClick: (e) => e.stopPropagation(),
                    className: "h-4 w-4 cursor-pointer rounded border-border accent-primary",
                    title: selectionMode ? "Toggle selection" : "Enter selection mode"
                  }
                )
              }
            ),
            m.type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "VIDEO" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatDuration(m.durationMs) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  toggleFav(m.id);
                },
                title: favSet.has(m.id) ? "Unfavorite" : "Favorite",
                "aria-label": favSet.has(m.id) ? "Unfavorite" : "Favorite",
                className: cn(
                  "absolute right-1.5 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-background/90 shadow-sm backdrop-blur transition hover:bg-background",
                  m.type === "video" ? "top-9" : "top-1.5",
                  favSet.has(m.id) ? "text-amber-500 opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-3.5 w-3.5", favSet.has(m.id) && "fill-current") })
              }
            ),
            !selectionMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-x-1.5 bottom-1.5 flex items-center justify-end gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardAction, { label: "Preview", onClick: () => setPreview(m), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardAction, { label: "Details", onClick: () => setDetailsTarget(m), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardAction, { label: "Rename", onClick: () => setRenameTarget(m), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardAction, { label: "Delete", variant: "danger", onClick: () => setDeleteTargets([m]), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[13px] font-medium text-foreground", title: m.name, children: m.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex items-center justify-between gap-2 text-[10.5px] text-muted-foreground", children: m.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted px-1 text-[9px] font-bold uppercase tracking-wide", children: "Video" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatDuration(m.durationMs) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatBytes(m.size) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted px-1 text-[9px] font-bold uppercase tracking-wide", children: "Image" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatBytes(m.size) })
            ] }) })
          ] })
        ]
      },
      m.id
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2 border-b border-border px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search media…",
            className: "h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-md border border-input bg-background p-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "ml-2 h-3.5 w-3.5 text-muted-foreground" }),
        FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setFilter(f.value),
            className: cn(
              "cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition",
              filter === f.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            ),
            children: f.label
          },
          f.value
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "aside",
        {
          style: { width: foldersCollapsed ? 36 : 180, willChange: "width" },
          className: "relative flex shrink-0 flex-col overflow-hidden border-r border-border bg-card/30 transition-[width] duration-200 ease-out",
          children: foldersCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFoldersCollapsed(false),
              title: "Expand folders",
              "aria-label": "Expand folders",
              className: "mt-2 inline-flex h-8 w-8 cursor-pointer items-center justify-center self-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree$1, { className: "h-4 w-4" })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setFoldersCollapsed(true),
                title: "Collapse folders",
                "aria-label": "Collapse folders",
                className: "absolute right-1 top-1 z-10 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftClose, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
        (selectionMode || selectedIds.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-accent/40 px-4 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            selectedIds.length,
            " selected",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary", children: "Selection mode" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: onAddToPlaylist,
              className: "ml-3 inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 hover:bg-accent",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ListPlus, { className: "h-3.5 w-3.5" }),
                " Add to playlist"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowMove(true),
              className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 hover:bg-accent",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderInput, { className: "h-3.5 w-3.5" }),
                " Move"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: onDuplicate,
              className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 hover:bg-accent",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
                " Duplicate"
              ]
            }
          ),
          selectedIds.length === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                const m = visible.find((x) => x.id === selectedIds[0]);
                if (m) setRenameTarget(m);
              },
              className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 hover:bg-accent",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
                " Rename"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: requestDeleteSelection,
              className: "inline-flex cursor-pointer items-center gap-1 rounded-md border border-destructive/40 bg-destructive/10 px-2.5 py-1 text-destructive hover:bg-destructive/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                " Delete"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                clearSelection();
                setSelectionMode(false);
              },
              className: "ml-auto cursor-pointer text-xs text-muted-foreground hover:text-foreground",
              children: "Exit selection"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 overflow-y-auto p-4",
            onMouseDown: (e) => {
              if (e.target === e.currentTarget) clearSelection();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dropzone, { folderId: currentFolderId, onDone: refreshMedia, className: "mb-4" }),
              visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-16 text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No media here yet." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    visible.length,
                    " item",
                    visible.length !== 1 ? "s" : "",
                    !selectionMode && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary", children: "Click to project" })
                  ] }),
                  !selectionMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setSelectionMode(true),
                      className: "cursor-pointer hover:text-foreground",
                      children: "Select"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => selectAll(visible.map((m) => m.id)),
                      className: "cursor-pointer hover:text-foreground",
                      children: "Select all"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: gridRef, children: grouped ? grouped.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", children: [
                    g.label,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[10px] font-normal opacity-70", children: g.items.length })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "grid gap-3",
                      style: {
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 180px), 1fr))"
                      },
                      children: g.items.map((m) => renderCard(m, visible.indexOf(m)))
                    }
                  )
                ] }, g.label)) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "grid gap-3",
                    style: {
                      gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 180px), 1fr))"
                    },
                    children: visible.map((m, idx) => renderCard(m, idx))
                  }
                ) })
              ] })
            ]
          }
        )
      ] })
    ] }),
    preview && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MediaPreview,
      {
        media: preview,
        onClose: () => setPreview(null),
        onProject: () => {
          void projectOne(preview);
          setPreview(null);
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
        onSubmit: onRenameSubmit
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MediaDetailsDialog,
      {
        open: !!detailsTarget,
        media: detailsTarget,
        folders,
        onClose: () => setDetailsTarget(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MediaDeleteDialog,
      {
        open: !!deleteTargets,
        items: deleteTargets ?? [],
        folders,
        onCancel: () => setDeleteTargets(null),
        onConfirm: confirmDelete
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MoveMediaDialog,
      {
        open: showMove,
        count: selectedIds.length,
        folders,
        currentFolderId,
        onCancel: () => setShowMove(false),
        onConfirm: confirmMove
      }
    ),
    showAddTo && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddToPlaylistDialog,
      {
        playlists,
        mediaIds: selectedIds,
        onClose: () => setShowAddTo(false),
        onDone: () => {
          setShowAddTo(false);
          clearSelection();
        }
      }
    )
  ] });
}
function startOfDay(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function CardAction({
  children,
  label,
  onClick,
  variant
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: (e) => {
        e.stopPropagation();
        onClick();
      },
      title: label,
      "aria-label": label,
      className: cn(
        "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-background/90 shadow-sm backdrop-blur transition hover:bg-background",
        variant === "danger" ? "text-destructive hover:bg-destructive/10" : "text-foreground"
      ),
      children
    }
  );
}
function AddToPlaylistDialog({
  playlists,
  mediaIds,
  onClose,
  onDone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          className: "w-full max-w-md rounded-lg border border-border bg-card p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-semibold", children: [
              "Add ",
              mediaIds.length,
              " item(s) to playlist"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 max-h-72 space-y-1 overflow-y-auto", children: [
              playlists.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No playlists yet. Create one first." }),
              playlists.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: async () => {
                    await addMediaToPlaylist(p.id, mediaIds);
                    toast.success(`Added to ${p.name}`);
                    onDone();
                  },
                  className: "flex w-full cursor-pointer items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-left text-sm hover:bg-accent",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      p.items.length,
                      " items"
                    ] })
                  ]
                },
                p.id
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent",
                children: "Cancel"
              }
            ) })
          ]
        }
      )
    }
  );
}
export {
  LibraryPage as L
};
