import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useRegisteredShortcuts, I as Input, f as formatCombo } from "./router-KP2FEINE.mjs";
import "../_libs/sonner.mjs";
import "../_libs/dexie.mjs";
import { K as Keyboard, h as Search } from "../_libs/lucide-react.mjs";
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
const ORDER = [{
  id: "general",
  label: "General",
  hint: "App-wide actions"
}, {
  id: "navigation",
  label: "Navigation",
  hint: "Tabs and routes"
}, {
  id: "media",
  label: "Media",
  hint: "Library & playback"
}, {
  id: "bible",
  label: "Bible",
  hint: "Search & navigate"
}, {
  id: "songs",
  label: "Songs",
  hint: "Lyrics"
}, {
  id: "text",
  label: "Text",
  hint: "Free-form text"
}, {
  id: "projector",
  label: "Projection",
  hint: "Projector control"
}, {
  id: "favorites",
  label: "Favorites",
  hint: "Quick recall"
}, {
  id: "playlist",
  label: "Playlist",
  hint: "Playlist editor"
}, {
  id: "playlists",
  label: "Playlists",
  hint: "Playlist browser"
}];
function ShortcutsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ShortcutsBody, {});
}
function ShortcutsBody() {
  const all = useRegisteredShortcuts();
  const [filter, setFilter] = reactExports.useState("");
  const grouped = reactExports.useMemo(() => {
    const f = filter.trim().toLowerCase();
    const matches = all.filter((s) => !f || s.label.toLowerCase().includes(f) || s.id.toLowerCase().includes(f) || s.keys.some((k) => k.toLowerCase().includes(f)));
    const map = /* @__PURE__ */ new Map();
    for (const s of matches) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    for (const arr of map.values()) arr.sort((a, b) => a.label.localeCompare(b.label));
    return map;
  }, [all, filter]);
  const total = all.length;
  const visible = [...grouped.values()].reduce((n, arr) => n + arr.length, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "Shortcut Center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          "Every keyboard shortcut registered across the app. Auto-generated — new shortcuts appear here instantly. Showing",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: visible }),
          " of ",
          total,
          "."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: filter, onChange: (e) => setFilter(e.target.value), placeholder: "Filter by action, key, or category…", className: "h-10 pl-9", autoFocus: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      ORDER.map((cat) => {
        const items = grouped.get(cat.id);
        if (!items || items.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-lg border border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-baseline justify-between border-b border-border px-4 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: cat.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: [
              cat.hint,
              " · ",
              items.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: items.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-4 px-4 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm", children: s.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] text-muted-foreground", children: s.id })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 flex-wrap items-center justify-end gap-1", children: s.keys.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px]", children: formatCombo(k) }, k)) })
          ] }, s.id)) })
        ] }, cat.id);
      }),
      visible === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-dashed border-border bg-card/40 py-12 text-center text-sm text-muted-foreground", children: [
        "No shortcuts match “",
        filter,
        "”."
      ] })
    ] })
  ] }) });
}
export {
  ShortcutsPage as component
};
