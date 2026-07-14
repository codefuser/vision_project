import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { b as useSettings, d as db, a as useSongsStore, D as DEFAULT_SETTINGS } from "./router-KP2FEINE.mjs";
import { s as strToU8, z as zip, u as unzip, a as strFromU8 } from "../_libs/fflate.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/dexie.mjs";
import { D as Download, U as Upload, i as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "module";
const BACKUP_VERSION = 2;
async function exportBackup() {
  const [folders, media, playlists, settingsRow, blobs] = await Promise.all([
    db().folders.toArray(),
    db().media.toArray(),
    db().playlists.toArray(),
    db().settings.get("app"),
    db().blobs.toArray()
  ]);
  const blobIndex = new Map(blobs.map((b) => [b.id, b]));
  const files = {};
  const mediaWithRefs = await Promise.all(
    media.map(async (m) => {
      const orig = blobIndex.get(m.blobId);
      const thumb = m.thumbBlobId ? blobIndex.get(m.thumbBlobId) : void 0;
      let blobFile;
      let thumbFile;
      if (orig) {
        blobFile = `blobs/${m.blobId}.bin`;
        files[blobFile] = new Uint8Array(await orig.blob.arrayBuffer());
      }
      if (thumb) {
        thumbFile = `blobs/${m.thumbBlobId}.bin`;
        files[thumbFile] = new Uint8Array(await thumb.blob.arrayBuffer());
      }
      return { ...m, blobFile, thumbFile };
    })
  );
  const manifest = {
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    folders,
    media: mediaWithRefs,
    playlists,
    settings: settingsRow?.value ?? DEFAULT_SETTINGS,
    userSongs: useSongsStore.getState().userSongs
  };
  files["manifest.json"] = strToU8(JSON.stringify(manifest));
  const zipped = await new Promise((resolve, reject) => {
    zip(files, { level: 6 }, (err, data) => err ? reject(err) : resolve(data));
  });
  return new Blob([zipped.buffer], { type: "application/zip" });
}
async function importBackup(file, opts) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const entries = await new Promise((resolve, reject) => {
    unzip(buf, (err, data) => err ? reject(err) : resolve(data));
  });
  const manifestRaw = entries["manifest.json"];
  if (!manifestRaw) throw new Error("Invalid backup: missing manifest.json");
  const manifest = JSON.parse(strFromU8(manifestRaw));
  if (manifest.version > BACKUP_VERSION)
    throw new Error(
      `Backup version ${manifest.version} is newer than supported (${BACKUP_VERSION})`
    );
  await db().transaction(
    "rw",
    [db().folders, db().media, db().blobs, db().playlists, db().settings],
    async () => {
      if (opts.mode === "replace") {
        await db().folders.clear();
        await db().media.clear();
        await db().blobs.clear();
        await db().playlists.clear();
      }
      for (const f of manifest.folders) await db().folders.put(f);
      for (const m of manifest.media) {
        if (m.blobFile && entries[m.blobFile]) {
          const u8 = entries[m.blobFile];
          await db().blobs.put({
            id: m.blobId,
            blob: new Blob([u8.buffer], { type: m.mime }),
            kind: "original"
          });
        }
        if (m.thumbBlobId && m.thumbFile && entries[m.thumbFile]) {
          const u8 = entries[m.thumbFile];
          await db().blobs.put({
            id: m.thumbBlobId,
            blob: new Blob([u8.buffer], { type: "image/webp" }),
            kind: "thumb"
          });
        }
        const { blobFile: _b, thumbFile: _t, ...clean } = m;
        await db().media.put(clean);
      }
      for (const p of manifest.playlists) await db().playlists.put(p);
      await db().settings.put({ key: "app", value: manifest.settings });
    }
  );
  if (manifest.userSongs && manifest.userSongs.length) {
    const store = useSongsStore.getState();
    if (opts.mode === "replace") {
      for (const u of store.userSongs) store.removeUserSong(u.id);
    }
    for (const u of manifest.userSongs) store.upsertUserSong(u);
  }
}
const THEMES = ["light", "dark", "system"];
const TRANSITIONS = ["fade", "crossfade", "zoom", "dissolve", "none"];
const LOOPS = ["none", "single", "playlist"];
function SettingsPage() {
  const { settings, update, load, loaded } = useSettings();
  const [busy, setBusy] = reactExports.useState(null);
  const [stats, setStats] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!loaded) void load();
  }, [load, loaded]);
  reactExports.useEffect(() => {
    (async () => {
      const [media, folders, playlists, blobs] = await Promise.all([
        db().media.count(),
        db().folders.count(),
        db().playlists.count(),
        db().blobs.toArray()
      ]);
      const totalBytes = blobs.reduce((sum, b) => sum + (b.blob.size ?? 0), 0);
      setStats({ media, folders, playlists, blobsMB: totalBytes / (1024 * 1024) });
    })();
  }, []);
  const set = (patch) => update(patch);
  const onExport = async () => {
    setBusy("export");
    try {
      const blob = await exportBackup();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `church-media-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded");
    } catch (e) {
      toast.error("Export failed: " + e.message);
    } finally {
      setBusy(null);
    }
  };
  const onImport = async (file) => {
    const replace = confirm("Replace existing library? Click Cancel to merge.");
    setBusy("import");
    try {
      await importBackup(file, { mode: replace ? "replace" : "merge" });
      toast.success("Backup restored — reloading…");
      setTimeout(() => window.location.reload(), 500);
    } catch (e) {
      toast.error("Import failed: " + e.message);
      setBusy(null);
    }
  };
  const wipeAll = async () => {
    if (!confirm("Delete ALL local data? This cannot be undone.")) return;
    await db().delete();
    window.location.reload();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "All data stored locally on this device." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "General", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Theme", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: settings.theme,
            onChange: (e) => set({ theme: e.target.value }),
            className: "select",
            children: THEMES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Language", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: settings.language,
            onChange: (e) => set({ language: e.target.value }),
            className: "select",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en", children: "English" })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Projection Defaults", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Default image duration (seconds)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: 1,
            max: 3600,
            value: Math.round(settings.defaultImageDurationMs / 1e3),
            onChange: (e) => set({ defaultImageDurationMs: Math.max(1, Number(e.target.value)) * 1e3 }),
            className: "input w-28"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Default transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: settings.defaultTransition,
            onChange: (e) => set({ defaultTransition: e.target.value }),
            className: "select",
            children: TRANSITIONS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Default loop mode", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: settings.defaultLoopMode,
            onChange: (e) => set({ defaultLoopMode: e.target.value }),
            className: "select",
            children: LOOPS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Video Defaults", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Default volume", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: 1,
              step: 0.05,
              value: settings.defaultVolume,
              onChange: (e) => set({ defaultVolume: Number(e.target.value) }),
              className: "w-48 accent-primary"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-sm text-muted-foreground", children: [
            Math.round(settings.defaultVolume * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Autoplay videos", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: settings.autoplayVideo,
            onChange: (e) => set({ autoplayVideo: e.target.checked }),
            className: "h-4 w-4 accent-primary"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mute on start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: settings.muteOnStart,
            onChange: (e) => set({ muteOnStart: e.target.checked }),
            className: "h-4 w-4 accent-primary"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Backup & Restore", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: onExport,
              disabled: busy === "export",
              className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
                " ",
                busy === "export" ? "Exporting…" : "Export Backup"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
            " ",
            busy === "import" ? "Importing…" : "Import Backup",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "file",
                accept: ".zip,application/zip",
                hidden: true,
                onChange: (e) => e.target.files?.[0] && onImport(e.target.files[0])
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Backup includes all folders, media, playlists, and settings." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Storage", children: [
        stats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Media", value: stats.media }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Folders", value: stats.folders }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Playlists", value: stats.playlists }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Used", value: `${stats.blobsMB.toFixed(1)} MB` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: wipeAll,
            className: "mt-4 inline-flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
              " Wipe All Data"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .input, .select { height: 36px; border-radius: 6px; border: 1px solid var(--border); background: var(--background); color: var(--foreground); padding: 0 10px; font-size: 14px; }
      ` })
  ] });
}
function Section({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children })
  ] });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children })
  ] });
}
function Stat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background p-3 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-lg font-semibold", children: value })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, {});
export {
  SplitComponent as component
};
