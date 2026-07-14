import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as db, c as acquireUrl, r as releaseUrl, q as formatDuration, a5 as formatBytes } from "./router-KP2FEINE.mjs";
import { p as Play, X } from "../_libs/lucide-react.mjs";
function MediaPreview({
  media,
  onClose,
  onProject
}) {
  const [url, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      const rec = await db().blobs.get(media.blobId);
      if (rec && !cancelled) setUrl(acquireUrl(media.blobId, rec.blob));
    })();
    const key = media.blobId;
    return () => {
      cancelled = true;
      releaseUrl(key);
    };
  }, [media.blobId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          className: "relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", title: media.name, children: media.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  media.type === "video" ? formatDuration(media.durationMs) : `${media.width ?? "?"}×${media.height ?? "?"}`,
                  " ",
                  "· ",
                  formatBytes(media.size)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: onProject,
                    className: "inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5" }),
                      " Project"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: onClose,
                    className: "rounded-md p-1.5 hover:bg-accent",
                    "aria-label": "Close",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center overflow-hidden bg-black", children: url ? media.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: media.name, className: "max-h-full max-w-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: url, controls: true, autoPlay: true, className: "max-h-full max-w-full" }) : null })
          ]
        }
      )
    }
  );
}
export {
  MediaPreview as M
};
