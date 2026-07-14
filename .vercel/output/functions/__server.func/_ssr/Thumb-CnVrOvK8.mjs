import { R as touchMedia, ab as projectionEngine, d as db, c as acquireUrl, r as releaseUrl, S as getSettings, g as getMedia } from "./router-KP2FEINE.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { _ as Film, I as Image } from "../_libs/lucide-react.mjs";
function styleFromMedia(media, override) {
  return {
    background: "#000",
    transition: override?.transition,
    durationMs: media.durationMs,
    ...override
  };
}
function mediaToContent(media) {
  const now = Date.now();
  const base = {
    id: `media:${media.id}`,
    title: media.name,
    source: { module: "media", refId: media.id },
    metadata: {
      mime: media.mime,
      size: media.size,
      width: media.width,
      height: media.height,
      folderId: media.folderId
    },
    style: styleFromMedia(media),
    createdAt: media.createdAt ?? now,
    updatedAt: media.updatedAt ?? now
  };
  if (media.type === "video") {
    return {
      ...base,
      type: "video",
      body: { mediaId: media.id, blobId: media.blobId, loop: false }
    };
  }
  return {
    ...base,
    type: "image",
    body: { mediaId: media.id, blobId: media.blobId }
  };
}
async function projectMedia(media) {
  void touchMedia(media.id).catch(() => void 0);
  return projectionEngine.project(mediaToContent(media));
}
async function projectPlaylist(playlist, startIndex = 0) {
  if (!playlist.items.length) return null;
  const settings = await getSettings();
  const items = [];
  for (const item of playlist.items) {
    const m = await getMedia(item.mediaId);
    if (!m) continue;
    const content = mediaToContent(m);
    content.id = `media:${m.id}#${item.id}`;
    content.style = {
      ...content.style,
      transition: item.transition || settings.defaultTransition,
      durationMs: item.durationMs || settings.defaultImageDurationMs
    };
    content.source = { module: "media", refId: playlist.id };
    items.push(content);
  }
  if (!items.length) return null;
  const safeIndex = Math.min(Math.max(0, startIndex), items.length - 1);
  void touchMedia(playlist.items[safeIndex].mediaId).catch(() => void 0);
  return projectionEngine.projectQueue(items, safeIndex);
}
function Thumb({ media, className }) {
  const [url, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    let key = null;
    (async () => {
      const id = media.thumbBlobId ?? media.blobId;
      if (!id) return;
      const rec = await db().blobs.get(id);
      if (!rec || cancelled) return;
      key = id;
      setUrl(acquireUrl(id, rec.blob));
    })();
    return () => {
      cancelled = true;
      if (key) releaseUrl(key);
    };
  }, [media.thumbBlobId, media.blobId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `relative flex items-center justify-center overflow-hidden bg-muted ${className ?? ""}`,
      children: [
        url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: media.name, className: "h-full w-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: media.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-6 w-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-6 w-6" }) }),
        media.type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white", children: "VIDEO" })
      ]
    }
  );
}
export {
  Thumb as T,
  projectPlaylist as a,
  projectMedia as p
};
