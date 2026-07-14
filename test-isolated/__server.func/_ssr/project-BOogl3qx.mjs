import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { X as Xt, Z as Zt, t as tn } from "../_libs/react-resizable-panels.mjs";
import { i as DEFAULT_TEXT_STYLE, e as DEFAULT_GROUPED_STYLES, Q as getChannel, R as touchMedia, S as getSettings, z as useWorkspace, j as useProjection, h as cn, g as getMedia, d as db, c as acquireUrl, r as releaseUrl, t as useTextFormat, O as useShortcutScope, T as getPlaylist, l as listAllMedia, k as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, p as DialogDescription, q as formatDuration, s as DialogFooter, P as useShortcutTooltip, A as useBibleStore, E as getBible, B as BIBLE_BOOKS, F as useShortcut, I as Input, a as useSongsStore, J as getSongs, C as projectVerse, L as projectSongSlide, K as buildSlides, v as DEFAULT_BACKGROUND, w as DEFAULT_ENGLISH_STYLE, x as DEFAULT_TAMIL_STYLE, y as DEFAULT_REFERENCE_STYLE, G as songLower, H as songStem, M as projectionEvents, N as projectionHistory } from "./router-KP2FEINE.mjs";
import { c as create, p as persist, a as createJSONStorage } from "../_libs/zustand.mjs";
import { S as Switch$1, a as SwitchThumb } from "../_libs/radix-ui__react-switch.mjs";
import { T as Thumb } from "./Thumb-CnVrOvK8.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { L as LibraryPage } from "./LibraryPage-QRr18g3i.mjs";
import { S as Select$2, a as SelectValue$1, b as SelectTrigger$1, c as SelectIcon, d as SelectPortal, e as SelectContent$1, f as SelectViewport, g as SelectItem$1, h as SelectItemIndicator, i as SelectItemText, j as SelectScrollUpButton$1, k as SelectScrollDownButton$1, l as SelectLabel$1, m as SelectSeparator$1 } from "../_libs/radix-ui__react-select.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, L as Label2, S as Separator2, I as Item2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/dexie.mjs";
import { M as MonitorPlay, T as Type, j as LayoutGrid, k as ChevronUp, l as ChevronDown, m as MonitorOff, n as SkipBack, R as Rewind, o as Pause, p as Play, q as FastForward, r as SkipForward, s as Square, t as RotateCcw, u as Repeat, G as Gauge, E as Eye, v as EyeOff, w as Minimize2, x as Maximize2, V as VolumeX, y as Volume2, z as Palette, A as Bold, H as TextAlignStart, J as Sparkles, S as Sun, N as Move, I as Image$1, X, B as BookOpen, e as Music, O as PanelRightOpen, Q as PanelRightClose, W as Check, Y as Save, Z as Layers, U as Upload, i as Trash2, h as Search, _ as Film, $ as Hash, a0 as Languages, a1 as LoaderCircle, c as Star, f as Send, a2 as Funnel, a3 as Plus, a4 as FileText, a5 as Copy, a6 as Pencil, d as ChevronRight, a7 as Circle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "./RenameDialog-BApqqlGm.mjs";
import "./MediaPreview-Bh211P_H.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
function normalizeTanglish(s) {
  let t = s.toLowerCase();
  t = t.replace(/aa+/g, "a").replace(/ee+/g, "e").replace(/oo+/g, "u").replace(/uu+/g, "u").replace(/ii+/g, "i").replace(/dh/g, "d").replace(/th/g, "t").replace(/zh/g, "l").replace(/sh/g, "s").replace(/ph/g, "f").replace(/v([aeiou])/g, "$1").replace(/([bcdfghjklmnpqrstvwxyz])\1+/g, "$1").replace(/(ae|ai|ay)$/g, "").replace(/[^a-z\s]/g, "").replace(/^y/, "").trim();
  return t;
}
function normalizeTamil(s) {
  return s.replace(/[\u0BBE-\u0BD7]/g, "").replace(/\s+/g, " ").trim();
}
function normalizeForSearch(s) {
  if (/[\u0B80-\u0BFF]/.test(s)) return normalizeTamil(s);
  return normalizeTanglish(s);
}
function parseReference(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  const tailMatch = lower.match(
    /^(.*?)(?:[\s:]*?)(\d+)(?:\s*[:.\s-]\s*(\d+))?(?:\s*-\s*(\d+))?\s*$/
  );
  let bookToken = lower;
  let chapter;
  let verse;
  let verseEnd;
  if (tailMatch && tailMatch[1].trim().length > 0) {
    bookToken = tailMatch[1].trim();
    chapter = Number(tailMatch[2]);
    verse = tailMatch[3] ? Number(tailMatch[3]) : void 0;
    verseEnd = tailMatch[4] ? Number(tailMatch[4]) : void 0;
  }
  if (chapter == null) {
    const glued = bookToken.match(/^([\p{L}\s]+?)(\d+)(?:[:.\s-](\d+))?(?:-(\d+))?$/u);
    if (glued) {
      bookToken = glued[1].trim();
      chapter = Number(glued[2]);
      verse = glued[3] ? Number(glued[3]) : void 0;
      verseEnd = glued[4] ? Number(glued[4]) : void 0;
    }
  }
  const book = matchBook(bookToken);
  if (!book) return null;
  return { book, chapter, verse, verseEnd };
}
function matchBook(token) {
  const t = token.toLowerCase().replace(/\s+/g, " ").trim();
  if (!t) return null;
  const tNoSpace = t.replace(/\s+/g, "");
  for (const b of BIBLE_BOOKS) if (b.aliases.includes(t) || b.aliases.includes(tNoSpace)) return b;
  let best = null;
  for (const b of BIBLE_BOOKS)
    for (const a of b.aliases) {
      if (a.length < t.length) continue;
      if (a.startsWith(t) || a.startsWith(tNoSpace)) {
        if (!best || a.length < best.len) best = { b, len: a.length };
      }
    }
  if (best) return best.b;
  if (t.length >= 3)
    for (const b of BIBLE_BOOKS)
      for (const a of b.aliases) {
        if (a.includes(t) || a.includes(tNoSpace)) return b;
      }
  let fuzzy = null;
  for (const b of BIBLE_BOOKS)
    for (const a of b.aliases) {
      if (Math.abs(a.length - t.length) > 2) continue;
      const d = editDistance(a, t);
      const max = a.length >= 6 ? 2 : 1;
      if (d <= max && (!fuzzy || d < fuzzy.d)) fuzzy = { b, d };
    }
  const nt = normalizeTanglish(t);
  if (!fuzzy && nt.length >= 2) {
    for (const b of BIBLE_BOOKS)
      for (const a of b.aliases) {
        const na = normalizeTanglish(a);
        if (!na) continue;
        if (na === nt || na.startsWith(nt) || nt.startsWith(na)) return b;
      }
  }
  return fuzzy?.b ?? null;
}
function editDistance(a, b) {
  if (a === b) return 0;
  const al = a.length, bl = b.length;
  if (Math.abs(al - bl) > 3) return 4;
  const dp = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) dp[j] = j;
  for (let i = 1; i <= al; i++) {
    let prev = dp[0];
    dp[0] = i;
    let rowMin = dp[0];
    for (let j = 1; j <= bl; j++) {
      const tmp = dp[j];
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
      if (dp[j] < rowMin) rowMin = dp[j];
    }
    if (rowMin > 3) return 4;
  }
  return dp[bl];
}
const LANG_NAME = (lang, b) => lang === "ta" ? b.nameTa : b.name;
function search(query, data, lang, limit = 80) {
  const q = query.trim();
  if (!q) return [];
  const ref = parseReference(q);
  if (ref) return resolveReference(ref, data, lang);
  return fullTextSearch(q, data, lang, limit);
}
function getChapterVerses(book, chapter, data, lang) {
  const meta = BIBLE_BOOKS[book];
  if (!meta) return [];
  const ch = data[book]?.[chapter - 1];
  if (!ch) return [];
  return ch.map((text, i) => verseHit(meta, chapter, i + 1, text, lang, 100));
}
function resolveReference(ref, data, lang) {
  const { book } = ref;
  const chapters = data[book.index];
  if (!chapters) return [];
  if (ref.chapter == null) {
    const verses = chapters[0] ?? [];
    return verses.map((text, i) => verseHit(book, 1, i + 1, text, lang, 100));
  }
  const ch = chapters[ref.chapter - 1];
  if (!ch) return [];
  if (ref.verse == null)
    return ch.map((text, i) => verseHit(book, ref.chapter, i + 1, text, lang, 100));
  const start = ref.verse;
  const end = ref.verseEnd ?? start;
  const out = [];
  for (let v = start; v <= end; v++) {
    const text = ch[v - 1];
    if (text) out.push(verseHit(book, ref.chapter, v, text, lang, 200));
  }
  return out;
}
function verseHit(book, chapter, verse, text, lang, score, matched) {
  return {
    book: book.index,
    bookName: book.name,
    bookNameLocal: LANG_NAME(lang, book),
    chapter,
    verse,
    text,
    score,
    matched
  };
}
function fullTextSearch(query, data, lang, limit) {
  const qLower = query.toLowerCase();
  const tokensRaw = qLower.split(/\s+/).filter(Boolean);
  const tokensNorm = tokensRaw.map(normalizeForSearch).filter(Boolean);
  const isTamilQuery = /[\u0B80-\u0BFF]/.test(query);
  const hits = [];
  for (let b = 0; b < data.length; b++) {
    const book = BIBLE_BOOKS[b];
    if (!book) continue;
    const chapters = data[b];
    for (let c = 0; c < chapters.length; c++) {
      const verses = chapters[c];
      for (let v = 0; v < verses.length; v++) {
        const text = verses[v];
        const lower = text.toLowerCase();
        const norm = isTamilQuery ? normalizeTamil(text) : normalizeTanglish(text);
        let exactHits = 0;
        let normHits = 0;
        const matched = [];
        for (let i = 0; i < tokensRaw.length; i++) {
          const rt = tokensRaw[i];
          const nt = tokensNorm[i];
          if (rt && lower.includes(rt)) {
            exactHits++;
            matched.push(rt);
            continue;
          }
          if (nt && nt.length >= 2 && norm.includes(nt)) {
            normHits++;
            matched.push(rt);
          }
        }
        const totalHits = exactHits + normHits;
        if (totalHits < tokensRaw.length) continue;
        let score = totalHits * 50 + exactHits * 30;
        if (lower.includes(qLower)) score += 100;
        if (lower.startsWith(tokensRaw[0])) score += 15;
        score -= Math.floor(text.length / 80);
        hits.push(verseHit(book, c + 1, v + 1, text, lang, score, matched));
        if (hits.length >= limit * 5) break;
      }
      if (hits.length >= limit * 5) break;
    }
    if (hits.length >= limit * 5) break;
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
const FocusContext = reactExports.createContext(null);
function FocusManagerProvider({ children }) {
  const [active, setActive] = reactExports.useState(null);
  const handlersRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const focus = reactExports.useCallback((zone) => setActive(zone), []);
  const registerHandler = reactExports.useCallback(
    (zone, handler) => {
      handlersRef.current.set(zone, handler);
      return () => {
        handlersRef.current.delete(zone);
      };
    },
    []
  );
  const value = reactExports.useMemo(
    () => ({ active, focus, registerHandler }),
    [active, focus, registerHandler]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FocusContext.Provider, { value, children });
}
function useFocusManager() {
  const ctx = reactExports.useContext(FocusContext);
  if (!ctx) throw new Error("useFocusManager must be used inside FocusManagerProvider");
  return ctx;
}
function useFocusZone(zone) {
  const { active, focus } = useFocusManager();
  return {
    isActive: active === zone,
    onFocus: () => focus(zone),
    tabIndex: 0
  };
}
const useBackground = create()(
  persist(
    (set) => ({
      backgroundEnabled: true,
      logoEnabled: true,
      themeBackgroundEnabled: true,
      customBackgroundEnabled: false,
      motionEnabled: true,
      particlesEnabled: true,
      textShadowEnabled: true,
      textStrokeEnabled: true,
      set: (key, value) => set({ [key]: value }),
      setMany: (partial) => set(partial)
    }),
    {
      name: "vision-background-toggles",
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
);
function canThemeWriteBackground() {
  const s = useBackground.getState();
  return s.themeBackgroundEnabled && !s.customBackgroundEnabled;
}
function withDefaults(bg) {
  return {
    kind: bg.kind,
    color: bg.color,
    mediaId: bg.mediaId,
    fit: bg.fit ?? "cover",
    opacity: bg.opacity ?? 1,
    blur: bg.blur ?? 0,
    brightness: bg.brightness ?? 1,
    contrast: bg.contrast ?? 1,
    zoom: bg.zoom ?? 1,
    positionX: bg.positionX ?? 50,
    positionY: bg.positionY ?? 50,
    gradient: bg.gradient ?? null,
    animation: bg.animation ?? "none",
    overlayColor: bg.overlayColor ?? "#000000",
    overlayOpacity: bg.overlayOpacity ?? 0,
    videoLoop: bg.videoLoop ?? true,
    videoMuted: bg.videoMuted ?? true,
    videoSpeed: bg.videoSpeed ?? 1
  };
}
function BackgroundLayer({ background }) {
  const bg = withDefaults(background);
  const backgroundEnabled = useBackground((s) => s.backgroundEnabled);
  const motionEnabled = useBackground((s) => s.motionEnabled);
  const particlesEnabled = useBackground((s) => s.particlesEnabled);
  const [media, setMedia] = reactExports.useState(null);
  const [url, setUrl] = reactExports.useState(null);
  const videoRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    if (bg.kind !== "media" || !bg.mediaId) {
      setMedia(null);
      return;
    }
    (async () => {
      const m = await getMedia(bg.mediaId);
      if (!cancelled) setMedia(m ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [bg.kind, bg.mediaId]);
  reactExports.useEffect(() => {
    let cancelled = false;
    let key = null;
    (async () => {
      if (!media) {
        setUrl(null);
        return;
      }
      const rec = await db().blobs.get(media.blobId);
      if (!rec || cancelled) return;
      key = media.blobId;
      setUrl(acquireUrl(key, rec.blob));
    })();
    return () => {
      cancelled = true;
      if (key) releaseUrl(key);
    };
  }, [media]);
  reactExports.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.loop = bg.videoLoop;
    v.muted = bg.videoMuted;
    v.playbackRate = Math.max(0.1, Math.min(4, bg.videoSpeed));
  }, [bg.videoLoop, bg.videoMuted, bg.videoSpeed]);
  if (!backgroundEnabled) return null;
  const animationKind = (() => {
    if (!motionEnabled) return "none";
    const isParticle = bg.animation === "particles" || bg.animation === "golden-particles" || bg.animation === "sparkles" || bg.animation === "floating-dust" || bg.animation === "star-field";
    if (isParticle && !particlesEnabled) return "none";
    return bg.animation;
  })();
  const overlay = bg.overlayOpacity > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "pointer-events-none absolute inset-0",
      style: { background: bg.overlayColor, opacity: bg.overlayOpacity }
    }
  ) : null;
  if (bg.kind === "none")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      overlay,
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimationOverlay, { kind: animationKind })
    ] });
  if (bg.kind === "color" || !media || !url) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: { background: bg.gradient ?? bg.color } }),
      overlay,
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimationOverlay, { kind: animationKind })
    ] });
  }
  const objectFit = bg.fit === "contain" ? "contain" : bg.fit === "stretch" ? "fill" : "cover";
  const style = {
    objectFit,
    objectPosition: `${bg.positionX}% ${bg.positionY}%`,
    opacity: bg.opacity,
    transform: `scale(${bg.zoom})`,
    transformOrigin: `${bg.positionX}% ${bg.positionY}%`,
    filter: `blur(${bg.blur}px) brightness(${bg.brightness}) contrast(${bg.contrast})`
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    media.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        ref: videoRef,
        src: url,
        className: "absolute inset-0 h-full w-full",
        style,
        autoPlay: true,
        loop: bg.videoLoop,
        muted: bg.videoMuted,
        playsInline: true
      },
      media.id
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: url,
        alt: "",
        className: "absolute inset-0 h-full w-full",
        style,
        draggable: false
      }
    ),
    overlay,
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimationOverlay, { kind: animationKind })
  ] });
}
function AnimationOverlay({ kind }) {
  if (!kind || kind === "none") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `pointer-events-none absolute inset-0 overflow-hidden bg-anim-${kind}`,
      "aria-hidden": true
    }
  );
}
function LogoLayer({ logo }) {
  const logoEnabled = useBackground((s2) => s2.logoEnabled);
  if (!logoEnabled) return null;
  if (!logo || !logo.enabled || !logo.current) return null;
  const s = logo.settings;
  const style = {
    position: "absolute",
    width: `${s.widthPct}%`,
    height: "auto",
    opacity: s.opacity,
    borderRadius: `${s.radius}px`,
    pointerEvents: "none",
    objectFit: "contain",
    filter: s.shadow ? "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" : void 0
  };
  switch (s.position) {
    case "top-left":
      style.top = "3%";
      style.left = "3%";
      break;
    case "top-right":
      style.top = "3%";
      style.right = "3%";
      break;
    case "bottom-left":
      style.bottom = "3%";
      style.left = "3%";
      break;
    case "bottom-right":
      style.bottom = "3%";
      style.right = "3%";
      break;
    case "custom":
      style.left = `${s.xPct}%`;
      style.top = `${s.yPct}%`;
      break;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo.current.dataUrl, alt: "", style, draggable: false });
}
function TextOverlayRenderer({
  overlay,
  style,
  styles,
  withBackground = true,
  className
}) {
  const grouped = styles ?? DEFAULT_GROUPED_STYLES;
  const effective = styles ? grouped : style ? {
    reference: { ...grouped.reference, color: style.color },
    tamil: { ...style, visible: true, fontFamily: "Latha" },
    english: { ...style, visible: true },
    background: grouped.background
  } : grouped;
  const isBilingual = overlay.mode === "both" && overlay.textEn && overlay.textTa;
  const showEnglish = effective.english.visible && overlay.mode !== "ta";
  const showTamil = effective.tamil.visible && (overlay.mode === "ta" || overlay.mode === "both");
  const referenceLines = [];
  if (effective.reference.visible) {
    if (overlay.mode === "ta" && overlay.referenceTa) referenceLines.push(overlay.referenceTa);
    else if (overlay.mode === "en" && overlay.referenceEn) referenceLines.push(overlay.referenceEn);
    else if (overlay.mode === "both") {
      if (overlay.referenceTa) referenceLines.push(overlay.referenceTa);
      if (overlay.referenceEn) referenceLines.push(overlay.referenceEn);
    } else if (overlay.reference) {
      referenceLines.push(overlay.reference);
    }
  }
  const tamilText = overlay.textTa ?? (overlay.mode === "ta" ? overlay.text : overlay.subtext) ?? "";
  const englishText = overlay.textEn ?? (overlay.mode === "en" ? overlay.text : !isBilingual ? overlay.text : "") ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn("absolute inset-0 flex flex-col overflow-hidden", className),
      style: {
        background: withBackground && effective.background.kind === "color" ? effective.background.color : "transparent"
      },
      children: [
        referenceLines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ReferenceBlock, { lines: referenceLines, style: effective.reference }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-0 flex-1 flex-col", children: [
          showTamil && tamilText && /* @__PURE__ */ jsxRuntimeExports.jsx(VerseBlock, { text: tamilText, style: effective.tamil, flex: showEnglish ? 1 : 1 }),
          showEnglish && englishText && /* @__PURE__ */ jsxRuntimeExports.jsx(VerseBlock, { text: englishText, style: effective.english, flex: 1 }),
          !showTamil && !showEnglish && overlay.text && /* @__PURE__ */ jsxRuntimeExports.jsx(VerseBlock, { text: overlay.text, style: effective.english, flex: 1 })
        ] })
      ]
    }
  );
}
function ReferenceBlock({ lines, style }) {
  const stageRef = reactExports.useRef(null);
  const lineRefs = reactExports.useRef([]);
  reactExports.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const apply = () => {
      const width = stage.clientWidth;
      if (!width) return;
      const fontPx = style.fontSizeVw / 100 * width;
      const paddingPx = style.paddingVw / 100 * width;
      stage.style.padding = `${paddingPx}px ${paddingPx}px 0 ${paddingPx}px`;
      for (const el of lineRefs.current) {
        if (el) el.style.fontSize = `${fontPx}px`;
      }
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [style.fontSizeVw, style.paddingVw]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: stageRef,
      className: "shrink-0",
      style: {
        textAlign: style.align
      },
      children: lines.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: (el) => {
            lineRefs.current[i] = el;
          },
          style: { ...textCss(style), fontSize: 0 },
          children: l
        },
        i
      ))
    }
  );
}
function VerseBlock({ text, style, flex }) {
  const stageRef = reactExports.useRef(null);
  const textRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const stage = stageRef.current;
    const t = textRef.current;
    if (!stage || !t) return;
    const fit = () => {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (w === 0 || h === 0) return;
      const pad = style.paddingVw / 100 * w;
      stage.style.padding = `${pad}px`;
      const maxW = w - pad * 2;
      const maxH = h - pad * 2;
      const startPx = style.fontSizeVw / 100 * w;
      const minPx = Math.max(10, w * 0.012);
      let lo = minPx, hi = startPx, best = lo;
      for (let i = 0; i < 8; i++) {
        const mid = (lo + hi) / 2;
        t.style.fontSize = `${mid}px`;
        const overflow = t.scrollWidth > maxW + 1 || t.scrollHeight > maxH + 1;
        if (overflow) hi = mid;
        else {
          best = mid;
          lo = mid;
        }
        if (hi - lo < 0.5) break;
      }
      t.style.fontSize = `${best}px`;
    };
    fit();
    const ro = new ResizeObserver(() => fit());
    ro.observe(stage);
    return () => ro.disconnect();
  }, [
    text,
    style.fontSizeVw,
    style.fontFamily,
    style.fontWeight,
    style.lineHeight,
    style.letterSpacing,
    style.paddingVw
  ]);
  const vAlignClass = style.vAlign === "top" ? "items-start" : style.vAlign === "bottom" ? "items-end" : "items-center";
  const justifyClass = style.align === "left" ? "justify-start" : style.align === "right" ? "justify-end" : "justify-center";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: stageRef,
      className: cn("relative flex min-h-0 w-full overflow-hidden", vAlignClass, justifyClass),
      style: { flex },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: textRef,
          className: "whitespace-pre-line",
          style: {
            ...textCss(style),
            maxWidth: "100%",
            wordBreak: "break-word",
            textAlign: style.align
          },
          children: text
        }
      )
    }
  );
}
function textCss(style) {
  const s = useBackground.getState();
  const shadowOn = s.textShadowEnabled;
  const strokeOn = s.textStrokeEnabled;
  const textShadow = style.shadow && shadowOn ? `0 4px ${style.shadowBlur}px ${mixAlpha(style.shadowColor, 0.6)}` : "none";
  return {
    fontFamily: `"${style.fontFamily}", system-ui, sans-serif`,
    fontWeight: style.fontWeight,
    fontStyle: style.italic ? "italic" : "normal",
    textDecoration: style.underline ? "underline" : "none",
    color: style.color,
    opacity: style.textOpacity,
    lineHeight: style.lineHeight,
    letterSpacing: `${style.letterSpacing}px`,
    textShadow,
    WebkitTextStrokeWidth: strokeOn && style.outlineWidth > 0 ? `${style.outlineWidth}px` : void 0,
    WebkitTextStrokeColor: strokeOn && style.outlineWidth > 0 ? style.outlineColor : void 0
  };
}
function mixAlpha(hex, alpha) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  let h = m[1];
  if (h.length === 3)
    h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}
const STAGE_ASPECT = 16 / 9;
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
function ProjectionTextStage({
  overlay,
  textStyle,
  groupedStyles,
  logo,
  className
}) {
  const hostRef = reactExports.useRef(null);
  const size = useFittedStage(hostRef, STAGE_ASPECT);
  const effectiveGroups = groupedStyles ?? DEFAULT_GROUPED_STYLES;
  const scale = size ? size.width / STAGE_WIDTH : 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: hostRef,
      className: cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-black",
        className
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "relative shrink-0 overflow-hidden bg-black",
          style: {
            width: size ? `${size.width}px` : "100%",
            height: size ? `${size.height}px` : "100%",
            aspectRatio: "16 / 9"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative overflow-hidden bg-black",
              style: {
                width: `${STAGE_WIDTH}px`,
                height: `${STAGE_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BackgroundLayer, { background: effectiveGroups.background }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TextOverlayRenderer,
                  {
                    overlay,
                    style: textStyle ?? DEFAULT_TEXT_STYLE,
                    styles: effectiveGroups,
                    withBackground: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogoLayer, { logo })
              ]
            }
          )
        }
      )
    }
  );
}
function useFittedStage(ref, aspect) {
  const [size, setSize] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const measure = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      let width = rect.width;
      let height = width / aspect;
      if (height > rect.height) {
        height = rect.height;
        width = height * aspect;
      }
      setSize((current) => {
        if (current && Math.abs(current.width - width) < 0.5 && Math.abs(current.height - height) < 0.5) {
          return current;
        }
        return { width, height };
      });
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, [aspect, ref]);
  return size;
}
const DEFAULT_LOGO_SETTINGS = {
  widthPct: 10,
  opacity: 1,
  radius: 0,
  shadow: false,
  position: "top-right",
  xPct: 80,
  yPct: 5
};
const MAX_LOGOS = 5;
const MAX_DIM = 512;
async function fileToDownscaledDataUrl(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}
function broadcast(s) {
  try {
    const cfg = { enabled: s.enabled, current: s.current, settings: s.settings };
    useProjection.getState().send({ type: "UPDATE_LOGO", logo: cfg });
  } catch {
  }
}
const useLogo = create()(
  persist(
    (set, get) => ({
      enabled: false,
      current: null,
      gallery: [],
      settings: DEFAULT_LOGO_SETTINGS,
      setEnabled: (v) => {
        set({ enabled: v });
        broadcast(get());
      },
      addFromFile: async (file) => {
        const dataUrl = await fileToDownscaledDataUrl(file);
        const item = { id: crypto.randomUUID(), dataUrl, name: file.name };
        set((s) => {
          const gallery = [item, ...s.gallery].slice(0, MAX_LOGOS);
          return { gallery, current: item, enabled: true };
        });
        broadcast(get());
      },
      selectFromGallery: (id) => {
        const item = get().gallery.find((g) => g.id === id);
        if (!item) return;
        set({ current: item, enabled: true });
        broadcast(get());
      },
      removeFromGallery: (id) => {
        set((s) => {
          const gallery = s.gallery.filter((g) => g.id !== id);
          const current = s.current?.id === id ? gallery[0] ?? null : s.current;
          return { gallery, current };
        });
        broadcast(get());
      },
      patch: (partial) => {
        set((s) => ({ settings: { ...s.settings, ...partial } }));
        broadcast(get());
      },
      clearCurrent: () => {
        set({ current: null });
        broadcast(get());
      }
    }),
    {
      name: "vision-logo",
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
);
function LivePreviewPanel() {
  const { state, projectorOpen, openProjector, closeProjector, send } = useProjection();
  const [media, setMedia] = reactExports.useState(null);
  const [url, setUrl] = reactExports.useState(null);
  const videoRef = reactExports.useRef(null);
  const stageRef = reactExports.useRef(null);
  const [localTime, setLocalTime] = reactExports.useState(0);
  const [localDuration, setLocalDuration] = reactExports.useState(0);
  const [scrubbing, setScrubbing] = reactExports.useState(null);
  const [fullPreview, setFullPreview] = reactExports.useState(false);
  const focus = useFocusZone("preview");
  const logoEnabled = useLogo((s) => s.enabled);
  const logoCurrent = useLogo((s) => s.current);
  const logoSettings = useLogo((s) => s.settings);
  const localLogo = { enabled: logoEnabled, current: logoCurrent, settings: logoSettings };
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!state?.currentMediaId) {
        setMedia(null);
        return;
      }
      const m = await getMedia(state.currentMediaId);
      if (!cancelled) setMedia(m ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [state?.currentMediaId]);
  reactExports.useEffect(() => {
    let cancelled = false;
    let activeKey = null;
    (async () => {
      if (!media) {
        setUrl(null);
        return;
      }
      const rec = await db().blobs.get(media.blobId);
      if (!rec || cancelled) return;
      activeKey = media.blobId;
      const u = acquireUrl(activeKey, rec.blob);
      setUrl(u);
    })();
    return () => {
      cancelled = true;
      if (activeKey) releaseUrl(activeKey);
    };
  }, [media]);
  reactExports.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setLocalTime(0);
  }, [url]);
  reactExports.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const ready = state?.videoReady !== false;
    if (state?.playing && ready) {
      v.play().catch(() => void 0);
    } else {
      v.pause();
    }
  }, [state?.playing, state?.videoReady, url]);
  reactExports.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (state?.playbackRate && isFinite(state.playbackRate)) {
      v.playbackRate = state.playbackRate;
    }
  }, [state?.playbackRate, url]);
  reactExports.useEffect(() => {
    const v = videoRef.current;
    const t = state?.videoCurrentTime;
    if (!v || t == null || scrubbing != null) return;
    if (Math.abs(v.currentTime - t) > 0.25) v.currentTime = t;
  }, [state?.videoCurrentTime, scrubbing]);
  const black = state?.black ?? false;
  const isVideo = media?.type === "video";
  const currentTime = scrubbing != null ? scrubbing : state?.videoCurrentTime != null ? state.videoCurrentTime : localTime;
  const duration = state?.videoDurationMs != null && state.videoDurationMs > 0 ? state.videoDurationMs / 1e3 : localDuration;
  const handleSeek = (t) => {
    send({ type: "SEEK", time: t });
    const v = videoRef.current;
    if (v) v.currentTime = t;
  };
  const jump = (delta) => {
    if (!isVideo) return;
    const next = Math.max(0, Math.min(duration || 0, currentTime + delta));
    handleSeek(next);
  };
  const remaining = Math.max(0, (duration || 0) - currentTime);
  const rate = state?.playbackRate ?? 1;
  const isLooping = state?.loop ?? false;
  const cycleRate = () => {
    const steps = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const i = steps.findIndex((s) => Math.abs(s - rate) < 0.01);
    const next = steps[(i + 1) % steps.length];
    send({ type: "RATE", value: next });
    const v = videoRef.current;
    if (v) v.playbackRate = next;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: stageRef,
      className: cn(
        "flex h-full min-h-0 flex-col bg-card",
        focus.isActive && "ring-1 ring-primary/40",
        fullPreview && "fixed inset-0 z-50"
      ),
      onFocus: focus.onFocus,
      onMouseDown: focus.onFocus,
      tabIndex: focus.tabIndex,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PanelHeader,
          {
            title: "Live Preview",
            subtitle: projectorOpen ? "Mirroring projector" : "Projector not open",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => projectorOpen ? closeProjector() : void openProjector(),
                className: cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition",
                  projectorOpen ? "bg-destructive/15 text-destructive hover:bg-destructive/25" : "bg-primary text-primary-foreground hover:opacity-90"
                ),
                children: projectorOpen ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorOff, { className: "h-3.5 w-3.5" }),
                  " Close"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorPlay, { className: "h-3.5 w-3.5" }),
                  " Open"
                ] })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-0 flex-1 items-center justify-center bg-black", children: [
          !media && !black && !state?.textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "No media projecting" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 opacity-60", children: "Send media to the projector to preview it here" })
          ] }),
          media && !black && url && media.type === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: url,
              alt: "",
              className: "max-h-full max-w-full object-contain",
              draggable: false
            }
          ),
          media && !black && url && media.type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              ref: videoRef,
              src: url,
              className: "max-h-full max-w-full object-contain",
              muted: true,
              playsInline: true,
              loop: true,
              onLoadedMetadata: (e) => {
                const v = e.currentTarget;
                v.currentTime = 0;
                setLocalDuration(isFinite(v.duration) ? v.duration : 0);
              },
              onTimeUpdate: (e) => {
                if (scrubbing == null) setLocalTime(e.currentTarget.currentTime);
              },
              onDurationChange: (e) => setLocalDuration(isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0)
            }
          ),
          !media && !black && state?.textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProjectionTextStage,
            {
              overlay: state.textOverlay,
              textStyle: state.textStyle,
              groupedStyles: state.groupedStyles,
              logo: localLogo
            }
          ),
          black && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black" }),
          !black && !state?.textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx(LogoLayer, { logo: localLogo }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "h-1.5 w-1.5 rounded-full",
                  projectorOpen ? "bg-red-500 animate-pulse" : "bg-neutral-500"
                )
              }
            ),
            "Live"
          ] }),
          state && state.total > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur", children: [
            state.index + 1,
            " / ",
            state.total
          ] })
        ] }),
        isVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(
          TimelineScrubber,
          {
            src: url,
            duration,
            currentTime,
            onScrub: (t) => setScrubbing(t),
            onCommit: (t) => {
              setScrubbing(null);
              handleSeek(t);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 border-t border-border bg-background/60 px-2 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => send({ type: "PREV" }), title: "Previous", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipBack, { className: "h-3.5 w-3.5" }) }),
          isVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => jump(-10), title: "Back 10s", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold", children: "-10" }) }),
          isVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => jump(-5), title: "Back 5s", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Rewind, { className: "h-3.5 w-3.5" }) }),
          state?.playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => send({ type: "PAUSE" }), title: "Pause", primary: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-3.5 w-3.5" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => send({ type: "PLAY" }), title: "Play", primary: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5" }) }),
          isVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => jump(5), title: "Forward 5s", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FastForward, { className: "h-3.5 w-3.5" }) }),
          isVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => jump(10), title: "Forward 10s", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold", children: "+10" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => send({ type: "NEXT" }), title: "Next", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => send({ type: "STOP" }), title: "Stop", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-3.5 w-3.5" }) }),
          isVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => handleSeek(0), title: "Restart", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" }) }),
          isVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconBtn,
            {
              onClick: () => send({ type: "LOOP", value: !isLooping }),
              title: isLooping ? "Disable loop" : "Loop",
              active: isLooping,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "h-3.5 w-3.5" })
            }
          ),
          isVideo && /* @__PURE__ */ jsxRuntimeExports.jsxs(IconBtn, { onClick: cycleRate, title: `Playback speed (${rate}x)`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-[10px] font-semibold tabular-nums", children: [
              rate,
              "x"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-4 w-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconBtn,
            {
              onClick: () => send({ type: "BLACK", value: !state?.black }),
              title: state?.black ? "Show" : "Black screen",
              active: state?.black,
              children: state?.black ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconBtn,
            {
              onClick: () => setFullPreview((v) => !v),
              title: fullPreview ? "Exit full preview" : "Full preview",
              active: fullPreview,
              children: fullPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-4 w-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconBtn,
            {
              onClick: () => send({ type: "MUTE", value: !state?.muted }),
              title: state?.muted ? "Unmute" : "Mute",
              children: state?.muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: 1,
              step: 0.01,
              value: state?.volume ?? 0.8,
              onChange: (e) => send({ type: "VOLUME", value: Number(e.target.value) }),
              className: "h-1 w-20 cursor-pointer accent-primary",
              "aria-label": "Volume"
            }
          ),
          isVideo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-1 flex items-center gap-1 font-mono text-[10px] tabular-nums text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "Current", children: fmtTime(currentTime) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "Duration", children: fmtTime(duration) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-60", title: "Remaining", children: [
              "-",
              fmtTime(remaining)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2 truncate text-[11px] text-muted-foreground", children: [
            isVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "rounded px-1.5 py-0.5 font-medium uppercase tracking-wide",
                  state?.playing ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                ),
                children: state?.playing ? state?.videoReady === false ? "Buffering" : "Playing" : "Paused"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: media ? media.name : "—" })
          ] })
        ] })
      ]
    }
  );
}
function fmtTime(s) {
  if (!isFinite(s) || s < 0) s = 0;
  const total = Math.floor(s);
  const h = Math.floor(total / 3600);
  const m = Math.floor(total % 3600 / 60);
  const sec = total % 60;
  const pad = (n) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}
function PanelHeader({
  title,
  subtitle,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-9 shrink-0 items-center justify-between border-b border-border bg-muted/30 px-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-baseline gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-foreground", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] text-muted-foreground", children: subtitle })
    ] }),
    children
  ] });
}
function IconBtn({
  children,
  onClick,
  title,
  primary,
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      title,
      "aria-label": title,
      className: cn(
        "inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-md border px-1.5 text-xs transition",
        primary ? "border-transparent bg-primary text-primary-foreground hover:opacity-90" : active ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"
      ),
      children
    }
  );
}
function TimelineScrubber({
  src,
  duration,
  currentTime,
  onScrub,
  onCommit
}) {
  const rowRef = reactExports.useRef(null);
  const trackRef = reactExports.useRef(null);
  const previewVideoRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  const rafRef = reactExports.useRef(null);
  const pendingSeekRef = reactExports.useRef(null);
  const draggingRef = reactExports.useRef(false);
  const [hover, setHover] = reactExports.useState(null);
  const scheduleSeek = (t) => {
    pendingSeekRef.current = t;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const v = previewVideoRef.current;
      const target = pendingSeekRef.current;
      pendingSeekRef.current = null;
      if (!v || target == null || !isFinite(target)) return;
      try {
        const anyV = v;
        if (typeof anyV.fastSeek === "function") anyV.fastSeek(target);
        else v.currentTime = target;
      } catch {
      }
    });
  };
  const paintFrame = () => {
    const v = previewVideoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const vw = v.videoWidth || 16;
    const vh = v.videoHeight || 9;
    const cw = c.width;
    const ch = c.height;
    const scale = Math.min(cw / vw, ch / vh);
    const dw = vw * scale;
    const dh = vh * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cw, ch);
    try {
      ctx.drawImage(v, dx, dy, dw, dh);
    } catch {
    }
  };
  reactExports.useEffect(() => {
    const v = previewVideoRef.current;
    if (!v) return;
    const onSeeked = () => paintFrame();
    const onLoaded = () => paintFrame();
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("loadeddata", onLoaded);
    return () => {
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("loadeddata", onLoaded);
    };
  }, [src]);
  reactExports.useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );
  const timeFromClientX = (clientX) => {
    const track = trackRef.current;
    if (!track || !duration) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * duration;
  };
  const xWithinRow = (clientX) => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return 0;
    const rowRect = row.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - trackRect.left) / trackRect.width));
    return trackRect.left - rowRect.left + ratio * trackRect.width;
  };
  const handlePointerMove = (clientX) => {
    if (!duration) return;
    const t = timeFromClientX(clientX);
    const x = xWithinRow(clientX);
    setHover({ x, t });
    scheduleSeek(t);
    if (draggingRef.current) onScrub(t);
  };
  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: rowRef,
      className: "relative flex items-center gap-2 border-t border-border bg-background/60 px-2.5 pt-1.5 pb-1",
      onMouseLeave: () => setHover(null),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-12 text-right font-mono text-[11px] tabular-nums text-muted-foreground", children: fmtTime(currentTime) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: trackRef,
            className: "group relative h-3 flex-1 cursor-pointer",
            onMouseMove: (e) => handlePointerMove(e.clientX),
            onPointerDown: (e) => {
              e.target.setPointerCapture?.(e.pointerId);
              draggingRef.current = true;
              const t = timeFromClientX(e.clientX);
              onScrub(t);
            },
            onPointerMove: (e) => {
              if (!draggingRef.current) return;
              handlePointerMove(e.clientX);
            },
            onPointerUp: (e) => {
              if (!draggingRef.current) return;
              draggingRef.current = false;
              const t = timeFromClientX(e.clientX);
              onCommit(t);
            },
            role: "slider",
            "aria-label": "Seek",
            "aria-valuemin": 0,
            "aria-valuemax": Math.max(0, duration),
            "aria-valuenow": Math.min(currentTime, duration || 0),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary",
                  style: { width: `${progressRatio * 100}%` }
                }
              ),
              hover && duration > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "pointer-events-none absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-primary/60",
                  style: { left: `${hover.t / duration * 100}%` }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/40 bg-primary shadow",
                  style: { left: `${progressRatio * 100}%` }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-12 font-mono text-[11px] tabular-nums text-muted-foreground", children: fmtTime(duration) }),
        src && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: previewVideoRef,
            src,
            muted: true,
            playsInline: true,
            preload: "auto",
            className: "pointer-events-none absolute h-0 w-0 opacity-0"
          }
        ),
        hover && src && (() => {
          const POPUP_WIDTH = 152;
          const rowWidth = rowRef.current?.getBoundingClientRect().width ?? 0;
          const half = POPUP_WIDTH / 2;
          const clampedX = Math.max(half, Math.min(rowWidth - half, hover.x));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "pointer-events-none absolute bottom-full mb-2 flex flex-col items-center",
              style: { left: clampedX, transform: "translateX(-50%)", width: POPUP_WIDTH },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "overflow-hidden rounded-md border border-border bg-black shadow-lg",
                    style: { width: 144, height: 80 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "canvas",
                      {
                        ref: canvasRef,
                        width: 144,
                        height: 80,
                        style: { width: 144, height: 80, display: "block" }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-white", children: fmtTime(hover.t) })
              ]
            }
          );
        })()
      ]
    }
  );
}
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Switch$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchThumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Switch$1.displayName;
function MediaPickerDialog({ open, onCancel, onAdd }) {
  const [media, setMedia] = reactExports.useState([]);
  const [query, setQuery] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open) return;
    setQuery("");
    setFilter("all");
    setSelected(/* @__PURE__ */ new Set());
    setBusy(false);
    void (async () => {
      const all = await listAllMedia();
      setMedia(all.sort((a, b) => b.createdAt - a.createdAt));
    })();
  }, [open]);
  const visible = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    return media.filter((m) => {
      if (filter !== "all" && m.type !== filter) return false;
      if (q && !m.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [media, query, filter]);
  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };
  const handleAdd = async () => {
    if (!selected.size) return;
    try {
      setBusy(true);
      await onAdd(Array.from(selected));
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && !busy && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "flex h-[80vh] max-h-[720px] max-w-3xl flex-col gap-3 sm:max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add media to playlist" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Select one or more items. They will be appended in the order you select them." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            autoFocus: true,
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Search media…",
            className: "h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 rounded-md border border-input bg-background p-0.5", children: ["all", "image", "video"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setFilter(f),
          className: cn(
            "cursor-pointer rounded px-2.5 py-1 text-xs font-medium capitalize",
            filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          ),
          children: f === "all" ? "All" : f + "s"
        },
        f
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto rounded-md border border-border bg-card/40 p-2", children: visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: "No media matches." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4", children: visible.map((m) => {
      const isSelected = selected.has(m.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => toggle(m.id),
          className: cn(
            "group relative cursor-pointer overflow-hidden rounded-md border bg-background text-left transition",
            isSelected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { media: m, className: "aspect-video" }),
            isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2 py-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs font-medium", title: m.name, children: m.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground", children: m.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatDuration(m.durationMs) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Image" })
              ] }) })
            ] })
          ]
        },
        m.id
      );
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mr-auto self-center text-xs text-muted-foreground", children: [
        selected.size,
        " selected"
      ] }),
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleAdd,
          disabled: busy || !selected.size,
          className: "cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
          children: [
            "Add ",
            selected.size > 0 ? `(${selected.size})` : ""
          ]
        }
      )
    ] })
  ] }) });
}
const useBackgroundGallery = create()(
  persist(
    (set) => ({
      items: [],
      addColor: (color) => set((s) => ({
        items: [{ id: crypto.randomUUID(), kind: "color", color }, ...s.items].slice(
          0,
          50
        )
      })),
      addMedia: (mediaId, name) => set((s) => {
        if (s.items.some((i) => i.kind === "media" && i.mediaId === mediaId)) return s;
        return {
          items: [
            { id: crypto.randomUUID(), kind: "media", mediaId, name },
            ...s.items
          ].slice(0, 50)
        };
      }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
    }),
    { name: "vision-bg-gallery", storage: createJSONStorage(() => localStorage), version: 1 }
  )
);
const TEMPLATE_CATEGORIES = [
  "Classic Worship",
  "Modern Worship",
  "Prayer Meeting",
  "Sunday Service",
  "Youth Service",
  "Revival Meeting",
  "Conference",
  "Bible Study",
  "Christmas",
  "Good Friday",
  "Easter",
  "Palm Sunday",
  "Harvest Festival",
  "New Year Service",
  "Wedding Service",
  "Thanksgiving Service",
  "Children Ministry",
  "Women's Fellowship",
  "Men's Fellowship",
  "Fasting Prayer",
  "Holy Communion",
  "Mission Sunday",
  "Nature Themes",
  "Cross Themes",
  "Heaven Themes",
  "Fire Themes",
  "Light Themes",
  "Dark Themes",
  "Minimal Themes",
  "Animated Themes",
  "Cinematic Themes"
];
const shadowSoft = { shadow: true, shadowColor: "#000000", shadowBlur: 22 };
const shadowDeep = { shadow: true, shadowColor: "#000000", shadowBlur: 36 };
const T = (text) => ({
  align: "center",
  vAlign: "middle",
  lineHeight: 1.3,
  ...shadowSoft,
  ...text
});
const build = (o) => {
  const fontEn = o.fontEn ?? "Inter";
  const fontTa = o.fontTa ?? "Latha";
  const color = o.color ?? "#ffffff";
  const sh = o.shadow === "none" ? { shadow: false, shadowBlur: 0 } : o.shadow === "deep" ? shadowDeep : shadowSoft;
  return {
    id: o.id,
    name: o.name,
    category: o.category,
    description: o.description ?? `${o.name} — worship preset.`,
    text: { ...T({ fontFamily: fontEn, color, fontWeight: o.weight ?? 500 }), ...sh },
    perGroup: {
      reference: o.refColor ? { color: o.refColor } : void 0,
      tamil: { fontFamily: fontTa, fontSizeVw: o.tamilSize ?? 5.2 },
      english: { fontFamily: fontEn }
    },
    background: {
      kind: "color",
      color: o.bg,
      gradient: o.gradient ?? null,
      animation: o.animation ?? "none"
    },
    logo: o.logo
  };
};
const TEMPLATE_PRESETS = [
  // Classic Worship (8)
  build({
    id: "cw-navy",
    name: "Classic Navy",
    category: "Classic Worship",
    bg: "#0b1d3a",
    fontEn: "Georgia",
    fontTa: "Latha",
    description: "White serif on deep navy. Timeless church look."
  }),
  build({
    id: "cw-burgundy",
    name: "Classic Burgundy",
    category: "Classic Worship",
    bg: "#4a0e1a",
    color: "#fdf6e3",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Ivory serif on burgundy. Traditional and warm."
  }),
  build({
    id: "cw-emerald",
    name: "Classic Emerald",
    category: "Classic Worship",
    bg: "#064e3b",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Gold-tinted serif on emerald."
  }),
  build({
    id: "cw-ivory",
    name: "Classic Ivory",
    category: "Classic Worship",
    bg: "#fdf6e3",
    color: "#1f2937",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "none",
    description: "Dark serif on warm ivory. Bible-page calm."
  }),
  build({
    id: "cw-royal",
    name: "Royal Sapphire",
    category: "Classic Worship",
    bg: "#1e3a8a",
    gradient: "linear-gradient(135deg,#1e3a8a,#1e40af)",
    fontEn: "Georgia",
    description: "Regal sapphire gradient."
  }),
  build({
    id: "cw-velvet",
    name: "Velvet Hymn",
    category: "Classic Worship",
    bg: "#3f0610",
    gradient: "linear-gradient(135deg,#3f0610,#7f1d1d)",
    color: "#fde68a",
    fontEn: "Georgia",
    description: "Hymnbook velvet with gold serif."
  }),
  build({
    id: "cw-walnut",
    name: "Walnut Pulpit",
    category: "Classic Worship",
    bg: "#3b2412",
    color: "#fef3c7",
    fontEn: "Georgia",
    description: "Warm walnut wood feel."
  }),
  build({
    id: "cw-stone",
    name: "Sanctuary Stone",
    category: "Classic Worship",
    bg: "#3f3f46",
    color: "#f5f5f4",
    fontEn: "Georgia",
    description: "Quiet stone sanctuary."
  }),
  // Modern Worship (10)
  build({
    id: "mw-slate",
    name: "Modern Slate",
    category: "Modern Worship",
    bg: "#0f172a",
    fontTa: "Mukta Malar",
    description: "Crisp sans on charcoal slate."
  }),
  build({
    id: "mw-indigo",
    name: "Modern Indigo",
    category: "Modern Worship",
    bg: "#1e1b4b",
    gradient: "linear-gradient(135deg,#1e1b4b,#4338ca 50%,#7c3aed)",
    fontTa: "Catamaran",
    description: "Indigo→violet gradient."
  }),
  build({
    id: "mw-aqua-glow",
    name: "Aqua Glow",
    category: "Modern Worship",
    bg: "#0f3a44",
    gradient: "radial-gradient(circle at 50% 40%,#0e7490,#082f49 80%)",
    animation: "soft-glow",
    fontTa: "Mukta Malar",
    description: "Teal with pulsing glow."
  }),
  build({
    id: "mw-violet-mist",
    name: "Violet Mist",
    category: "Modern Worship",
    bg: "#312e81",
    gradient: "linear-gradient(180deg,#312e81,#1e1b4b)",
    animation: "fog",
    fontTa: "Catamaran",
    description: "Violet with drifting mist."
  }),
  build({
    id: "mw-cyan-pulse",
    name: "Cyan Pulse",
    category: "Modern Worship",
    bg: "#083344",
    animation: "soft-glow",
    fontTa: "Catamaran",
    description: "Cyan pulse under bold sans."
  }),
  build({
    id: "mw-rose-modern",
    name: "Rose Modern",
    category: "Modern Worship",
    bg: "#831843",
    gradient: "linear-gradient(135deg,#500724,#9d174d)",
    fontTa: "Catamaran",
    description: "Rose gradient."
  }),
  build({
    id: "mw-teal-graphite",
    name: "Teal Graphite",
    category: "Modern Worship",
    bg: "#134e4a",
    gradient: "linear-gradient(135deg,#042f2e,#115e59)",
    fontTa: "Catamaran",
    description: "Teal on graphite."
  }),
  build({
    id: "mw-mono-bold",
    name: "Mono Bold",
    category: "Modern Worship",
    bg: "#18181b",
    color: "#fafafa",
    weight: 700,
    description: "Mono black with bold sans."
  }),
  build({
    id: "mw-skyline",
    name: "Skyline",
    category: "Modern Worship",
    bg: "#0c4a6e",
    gradient: "linear-gradient(180deg,#0c4a6e,#1e3a8a)",
    fontTa: "Mukta Malar",
    description: "Layered skyline blue."
  }),
  build({
    id: "mw-blush",
    name: "Blush Modern",
    category: "Modern Worship",
    bg: "#4a1d1d",
    gradient: "linear-gradient(135deg,#4a1d1d,#9f1239)",
    color: "#fff1f2",
    fontTa: "Catamaran",
    description: "Blush warmth."
  }),
  // Prayer Meeting (8)
  build({
    id: "pr-amber",
    name: "Prayer Warm Amber",
    category: "Prayer Meeting",
    bg: "#1c1917",
    color: "#fde68a",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "deep",
    description: "Amber serif on near-black. Quiet and reverent."
  }),
  build({
    id: "pr-candle",
    name: "Candlelight",
    category: "Prayer Meeting",
    bg: "#1a0f08",
    gradient: "radial-gradient(circle at 50% 70%,#3a1e0a,#0a0604 80%)",
    animation: "candle-glow",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Flickering candle warmth."
  }),
  build({
    id: "pr-twilight",
    name: "Twilight",
    category: "Prayer Meeting",
    bg: "#1e1b4b",
    gradient: "linear-gradient(180deg,#0f0a2e,#312e81)",
    animation: "particles",
    color: "#e0e7ff",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Indigo twilight with particles."
  }),
  build({
    id: "pr-quiet-night",
    name: "Quiet Night",
    category: "Prayer Meeting",
    bg: "#0a0a0a",
    animation: "soft-glow",
    color: "#e5e7eb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Stillness with a soft halo."
  }),
  build({
    id: "pr-incense",
    name: "Incense Smoke",
    category: "Prayer Meeting",
    bg: "#1c0f1a",
    animation: "fog",
    color: "#fbcfe8",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Soft drifting fog."
  }),
  build({
    id: "pr-altar",
    name: "Altar Hush",
    category: "Prayer Meeting",
    bg: "#0f0f17",
    animation: "candle-glow",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Hushed altar tones."
  }),
  build({
    id: "pr-deep-wine",
    name: "Deep Wine",
    category: "Prayer Meeting",
    bg: "#3f0610",
    color: "#fecaca",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Deep wine with crimson text."
  }),
  build({
    id: "pr-monastery",
    name: "Monastery",
    category: "Prayer Meeting",
    bg: "#1f1612",
    color: "#fde68a",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Quiet monastery warmth."
  }),
  // Sunday Service (8)
  build({
    id: "ss-sky",
    name: "Sunday Bright Sky",
    category: "Sunday Service",
    bg: "#0c4a6e",
    gradient: "linear-gradient(180deg,#0c4a6e,#0369a1 50%,#0284c7)",
    fontTa: "Mukta Malar",
    description: "Morning service sky-blue."
  }),
  build({
    id: "ss-gold",
    name: "Sunday Warm Gold",
    category: "Sunday Service",
    bg: "#78350f",
    gradient: "linear-gradient(135deg,#451a03,#92400e 50%,#b45309)",
    animation: "bokeh",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    color: "#fffbeb",
    description: "Warm gold with soft bokeh."
  }),
  build({
    id: "ss-sunrise",
    name: "Sunday Sunrise",
    category: "Sunday Service",
    bg: "#7c2d12",
    gradient: "linear-gradient(180deg,#7c2d12,#fb923c 70%,#fde68a)",
    animation: "sunrise",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    color: "#1f2937",
    shadow: "none",
    description: "Sunrise resurrection morning."
  }),
  build({
    id: "ss-clean-blue",
    name: "Clean Sunday Blue",
    category: "Sunday Service",
    bg: "#1e3a8a",
    fontTa: "Mukta Malar",
    description: "Clean blue worship."
  }),
  build({
    id: "ss-warm-day",
    name: "Warm Day",
    category: "Sunday Service",
    bg: "#ea580c",
    gradient: "linear-gradient(135deg,#7c2d12,#ea580c)",
    description: "Sunday morning warmth."
  }),
  build({
    id: "ss-pastoral",
    name: "Pastoral Calm",
    category: "Sunday Service",
    bg: "#0c4a6e",
    animation: "clouds",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Drifting clouds."
  }),
  build({
    id: "ss-blessing",
    name: "Blessing Light",
    category: "Sunday Service",
    bg: "#0b1d3a",
    animation: "light-rays",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Light through stained glass."
  }),
  build({
    id: "ss-festive",
    name: "Festive Sunday",
    category: "Sunday Service",
    bg: "#7c2d12",
    gradient: "linear-gradient(135deg,#7c2d12,#dc2626)",
    fontTa: "Catamaran",
    description: "Festive worship colours."
  }),
  // Youth Service (8)
  build({
    id: "ys-violet",
    name: "Electric Violet",
    category: "Youth Service",
    bg: "#3b0764",
    gradient: "linear-gradient(135deg,#3b0764,#7e22ce 50%,#ec4899)",
    fontTa: "Catamaran",
    weight: 700,
    description: "Vibrant violet energy."
  }),
  build({
    id: "ys-neon-mint",
    name: "Neon Mint",
    category: "Youth Service",
    bg: "#022c22",
    gradient: "linear-gradient(135deg,#022c22,#064e3b)",
    animation: "sparkles",
    color: "#a7f3d0",
    fontTa: "Catamaran",
    weight: 700,
    description: "Dark base with mint sparkles."
  }),
  build({
    id: "ys-sunset",
    name: "Sunset Blaze",
    category: "Youth Service",
    bg: "#7c2d12",
    gradient: "linear-gradient(135deg,#7c2d12,#ea580c 50%,#db2777)",
    fontTa: "Catamaran",
    weight: 700,
    description: "Orange→magenta blaze."
  }),
  build({
    id: "ys-cyber",
    name: "Cyber Worship",
    category: "Youth Service",
    bg: "#020617",
    animation: "abstract-worship",
    fontTa: "Catamaran",
    weight: 700,
    description: "Cyber abstract motion."
  }),
  build({
    id: "ys-stage",
    name: "Stage Lights",
    category: "Youth Service",
    bg: "#0a0a0a",
    animation: "stage-lights",
    fontTa: "Catamaran",
    weight: 700,
    description: "Sweeping stage spotlights."
  }),
  build({
    id: "ys-fire",
    name: "Youth Fire",
    category: "Youth Service",
    bg: "#450a0a",
    animation: "fire-glow",
    fontTa: "Catamaran",
    weight: 700,
    description: "Hot, fired-up youth night."
  }),
  build({
    id: "ys-pop",
    name: "Pop Pulse",
    category: "Youth Service",
    bg: "#831843",
    gradient: "linear-gradient(135deg,#500724,#be185d,#ec4899)",
    fontTa: "Catamaran",
    weight: 700,
    description: "Popping pink pulse."
  }),
  build({
    id: "ys-skater",
    name: "Street Indigo",
    category: "Youth Service",
    bg: "#1e1b4b",
    animation: "abstract-worship",
    fontTa: "Catamaran",
    weight: 700,
    description: "Street-feel indigo."
  }),
  // Revival Meeting (8)
  build({
    id: "rv-fire",
    name: "Revival Fire",
    category: "Revival Meeting",
    bg: "#450a0a",
    gradient: "radial-gradient(circle at 50% 100%,#dc2626,#7f1d1d 40%,#1c0606 90%)",
    animation: "fire-glow",
    fontTa: "Catamaran",
    weight: 700,
    color: "#fff7ed",
    description: "Holy Spirit fire."
  }),
  build({
    id: "rv-glory",
    name: "Glory Rays",
    category: "Revival Meeting",
    bg: "#78350f",
    gradient: "radial-gradient(circle at 50% 50%,#d97706,#78350f 60%,#1c1006)",
    animation: "light-rays",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    weight: 600,
    color: "#fffbeb",
    description: "Golden glory rays."
  }),
  build({
    id: "rv-outpouring",
    name: "Outpouring",
    category: "Revival Meeting",
    bg: "#1e1b4b",
    animation: "golden-particles",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    color: "#fef3c7",
    description: "Golden outpouring particles."
  }),
  build({
    id: "rv-thunder",
    name: "Thunder Sky",
    category: "Revival Meeting",
    bg: "#0c1c33",
    animation: "cross-beam",
    fontTa: "Catamaran",
    weight: 600,
    description: "Thundering glory beam."
  }),
  build({
    id: "rv-altar-fire",
    name: "Altar Fire",
    category: "Revival Meeting",
    bg: "#1c0606",
    animation: "fire-glow",
    color: "#fed7aa",
    fontTa: "Catamaran",
    weight: 700,
    description: "Smoldering altar fire."
  }),
  build({
    id: "rv-aurora-glory",
    name: "Aurora Glory",
    category: "Revival Meeting",
    bg: "#0a0e2c",
    animation: "aurora",
    fontTa: "Catamaran",
    weight: 600,
    description: "Aurora of glory."
  }),
  build({
    id: "rv-rain-spirit",
    name: "Latter Rain",
    category: "Revival Meeting",
    bg: "#0c2340",
    animation: "rain",
    color: "#dbeafe",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Latter rain outpouring."
  }),
  build({
    id: "rv-deep-call",
    name: "Deep Calls Deep",
    category: "Revival Meeting",
    bg: "#082f49",
    animation: "ocean",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    color: "#e0f2fe",
    description: "Deep waters of revival."
  }),
  // Conference (6)
  build({
    id: "cf-navy-pro",
    name: "Conference Navy Pro",
    category: "Conference",
    bg: "#0c1c33",
    fontTa: "Catamaran",
    weight: 600,
    description: "Wide sans, navy backdrop, logo top right.",
    logo: { enabled: true, settings: { position: "top-right", widthPct: 8 } }
  }),
  build({
    id: "cf-graphite",
    name: "Conference Graphite",
    category: "Conference",
    bg: "#1f2937",
    gradient: "linear-gradient(135deg,#0f172a,#1f2937)",
    fontTa: "Mukta Malar",
    weight: 400,
    description: "Graphite gradient elegance."
  }),
  build({
    id: "cf-broadcast",
    name: "Broadcast Black",
    category: "Conference",
    bg: "#000000",
    fontTa: "Catamaran",
    weight: 500,
    description: "Broadcast-grade black.",
    logo: { enabled: true, settings: { position: "bottom-right", widthPct: 7 } }
  }),
  build({
    id: "cf-keynote",
    name: "Keynote Charcoal",
    category: "Conference",
    bg: "#0a0a0a",
    gradient: "radial-gradient(ellipse at 50% 50%,#262626,#0a0a0a 80%)",
    fontTa: "Catamaran",
    weight: 500,
    description: "Keynote-style charcoal."
  }),
  build({
    id: "cf-summit",
    name: "Summit Indigo",
    category: "Conference",
    bg: "#1e1b4b",
    fontTa: "Catamaran",
    weight: 600,
    description: "Summit indigo."
  }),
  build({
    id: "cf-press",
    name: "Press Stage",
    category: "Conference",
    bg: "#111827",
    animation: "stage-lights",
    fontTa: "Catamaran",
    weight: 600,
    description: "Press-stage spotlight motion."
  }),
  // Bible Study (6)
  build({
    id: "bs-parchment",
    name: "Parchment Page",
    category: "Bible Study",
    bg: "#fdf6e3",
    color: "#1c1917",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "none",
    description: "Cream parchment with dark ink."
  }),
  build({
    id: "bs-scholar",
    name: "Scholar Dark",
    category: "Bible Study",
    bg: "#0a0a0a",
    color: "#ffffff",
    refColor: "#fcd34d",
    fontEn: "Georgia",
    fontTa: "Latha",
    description: "Black backdrop, gold reference."
  }),
  build({
    id: "bs-spotlight",
    name: "Scripture Spotlight",
    category: "Bible Study",
    bg: "#000000",
    gradient: "radial-gradient(ellipse at 50% 50%,#1f2937,#000000 80%)",
    fontEn: "Georgia",
    fontTa: "Latha",
    description: "Centred spotlight on scripture."
  }),
  build({
    id: "bs-ink",
    name: "Ink and Paper",
    category: "Bible Study",
    bg: "#f5f5f4",
    color: "#0c0a09",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "none",
    description: "Ink-on-paper readability."
  }),
  build({
    id: "bs-study-blue",
    name: "Study Blue",
    category: "Bible Study",
    bg: "#0c2340",
    refColor: "#93c5fd",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Calm study blue."
  }),
  build({
    id: "bs-quiet-cream",
    name: "Quiet Cream",
    category: "Bible Study",
    bg: "#f5efe0",
    color: "#1c1917",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "none",
    description: "Soft cream for daylight rooms."
  }),
  // Christmas (8)
  build({
    id: "xm-evergreen",
    name: "Christmas Evergreen",
    category: "Christmas",
    bg: "#064e3b",
    color: "#fbbf24",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Festive evergreen + gold."
  }),
  build({
    id: "xm-snow",
    name: "Christmas Snowfall",
    category: "Christmas",
    bg: "#0c2340",
    gradient: "linear-gradient(180deg,#0c2340,#1e3a8a)",
    animation: "particles",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Snowy midnight blue."
  }),
  build({
    id: "xm-starry",
    name: "Starry Night",
    category: "Christmas",
    bg: "#0a0e2c",
    animation: "star-field",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Twinkling stars over Bethlehem."
  }),
  build({
    id: "xm-velvet-red",
    name: "Velvet Red",
    category: "Christmas",
    bg: "#7f1d1d",
    gradient: "linear-gradient(135deg,#450a0a,#991b1b)",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Velvet red and gold."
  }),
  build({
    id: "xm-candles",
    name: "Christmas Candles",
    category: "Christmas",
    bg: "#1a0f08",
    animation: "candle-glow",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Advent candle warmth."
  }),
  build({
    id: "xm-emmanuel",
    name: "Emmanuel Gold",
    category: "Christmas",
    bg: "#1c1006",
    animation: "golden-particles",
    color: "#fde68a",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Golden hush of the Saviour's birth."
  }),
  build({
    id: "xm-frost",
    name: "Frosted Night",
    category: "Christmas",
    bg: "#082f49",
    gradient: "linear-gradient(135deg,#082f49,#0c4a6e)",
    animation: "sparkles",
    color: "#e0f2fe",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Cool frosted sparkle."
  }),
  build({
    id: "xm-nativity",
    name: "Nativity Glow",
    category: "Christmas",
    bg: "#1c1006",
    animation: "soft-glow",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Manger glow."
  }),
  // Good Friday (6)
  build({
    id: "gf-solemn",
    name: "Solemn Cross",
    category: "Good Friday",
    bg: "#000000",
    animation: "floating-cross",
    color: "#e5e7eb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "deep",
    description: "Pure black with drifting cross."
  }),
  build({
    id: "gf-crimson",
    name: "Crimson Sorrow",
    category: "Good Friday",
    bg: "#0a0000",
    gradient: "radial-gradient(circle at 50% 50%,#450a0a,#0a0000 75%)",
    animation: "floating-cross",
    color: "#fecaca",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "deep",
    description: "Crimson sorrow."
  }),
  build({
    id: "gf-veil",
    name: "Torn Veil",
    category: "Good Friday",
    bg: "#0a0000",
    animation: "cross-beam",
    color: "#fee2e2",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "deep",
    description: "Light through the torn veil."
  }),
  build({
    id: "gf-grief",
    name: "Garden of Grief",
    category: "Good Friday",
    bg: "#0f1410",
    animation: "fog",
    color: "#e5e7eb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Gethsemane fog."
  }),
  build({
    id: "gf-thorn",
    name: "Crown of Thorns",
    category: "Good Friday",
    bg: "#1c0606",
    color: "#fecaca",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Deep crimson reverence."
  }),
  build({
    id: "gf-stillness",
    name: "Tomb Stillness",
    category: "Good Friday",
    bg: "#0a0a0a",
    color: "#cbd5e1",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "deep",
    description: "Quiet stillness of the tomb."
  }),
  // Easter (6)
  build({
    id: "es-lavender",
    name: "Easter Lavender",
    category: "Easter",
    bg: "#4c1d95",
    gradient: "linear-gradient(135deg,#4c1d95,#7c3aed)",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Soft lavender on white serif."
  }),
  build({
    id: "es-dawn",
    name: "Resurrection Dawn",
    category: "Easter",
    bg: "#7c2d12",
    gradient: "linear-gradient(180deg,#7c2d12,#fb923c 60%,#fde68a)",
    animation: "sunrise",
    color: "#fff7ed",
    weight: 600,
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Dawn of resurrection."
  }),
  build({
    id: "es-empty-tomb",
    name: "Empty Tomb",
    category: "Easter",
    bg: "#e0f2fe",
    color: "#0c4a6e",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "none",
    animation: "light-rays",
    description: "Bright morning at the empty tomb."
  }),
  build({
    id: "es-alive",
    name: "He Is Alive",
    category: "Easter",
    bg: "#7c3aed",
    gradient: "linear-gradient(135deg,#4c1d95,#a78bfa)",
    animation: "golden-particles",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Joy of resurrection."
  }),
  build({
    id: "es-bloom",
    name: "Easter Bloom",
    category: "Easter",
    bg: "#fce7f3",
    color: "#831843",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "none",
    description: "Spring-bloom pink."
  }),
  build({
    id: "es-glory",
    name: "Risen Glory",
    category: "Easter",
    bg: "#78350f",
    gradient: "radial-gradient(circle at 50% 50%,#fbbf24,#78350f 70%)",
    animation: "light-rays",
    color: "#fffbeb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Risen Lord glory."
  }),
  // Palm Sunday (4)
  build({
    id: "pm-palms",
    name: "Palm Procession",
    category: "Palm Sunday",
    bg: "#14532d",
    gradient: "linear-gradient(135deg,#14532d,#16a34a)",
    color: "#fefce8",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Green palms of welcome."
  }),
  build({
    id: "pm-hosanna",
    name: "Hosanna Gold",
    category: "Palm Sunday",
    bg: "#365314",
    gradient: "linear-gradient(135deg,#365314,#a16207)",
    color: "#fefce8",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Hosanna joy with golden warmth."
  }),
  build({
    id: "pm-jerusalem",
    name: "Jerusalem Sky",
    category: "Palm Sunday",
    bg: "#7c2d12",
    gradient: "linear-gradient(180deg,#7c2d12,#fbbf24)",
    animation: "sunrise",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Jerusalem morning sky."
  }),
  build({
    id: "pm-branches",
    name: "Olive Branches",
    category: "Palm Sunday",
    bg: "#1a2e05",
    color: "#ecfccb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Deep olive branches."
  }),
  // Harvest Festival (4)
  build({
    id: "hv-wheat",
    name: "Wheat Harvest",
    category: "Harvest Festival",
    bg: "#78350f",
    gradient: "linear-gradient(135deg,#78350f,#d97706,#fbbf24)",
    color: "#fffbeb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Golden wheat fields."
  }),
  build({
    id: "hv-autumn",
    name: "Autumn Harvest",
    category: "Harvest Festival",
    bg: "#7c2d12",
    gradient: "linear-gradient(135deg,#7c2d12,#c2410c)",
    color: "#fff7ed",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Warm autumn rust."
  }),
  build({
    id: "hv-firstfruits",
    name: "First Fruits",
    category: "Harvest Festival",
    bg: "#92400e",
    animation: "golden-particles",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "First fruits gold."
  }),
  build({
    id: "hv-barn",
    name: "Barn Warmth",
    category: "Harvest Festival",
    bg: "#451a03",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Warm barn glow."
  }),
  // New Year Service (4)
  build({
    id: "ny-sparkle",
    name: "New Year Sparkle",
    category: "New Year Service",
    bg: "#0a0e2c",
    animation: "sparkles",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Midnight countdown sparkle."
  }),
  build({
    id: "ny-fireworks",
    name: "Fireworks",
    category: "New Year Service",
    bg: "#0a0e2c",
    animation: "golden-particles",
    color: "#fffbeb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Bursts of golden light."
  }),
  build({
    id: "ny-gold",
    name: "Golden Year",
    category: "New Year Service",
    bg: "#78350f",
    gradient: "linear-gradient(135deg,#451a03,#a16207,#fbbf24)",
    animation: "sparkles",
    color: "#fffbeb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    weight: 600,
    description: "Golden year ahead."
  }),
  build({
    id: "ny-fresh",
    name: "Fresh Start",
    category: "New Year Service",
    bg: "#082f49",
    gradient: "linear-gradient(135deg,#082f49,#0369a1)",
    animation: "sunrise",
    description: "Fresh sunrise start."
  }),
  // Wedding Service (4)
  build({
    id: "wd-rose-gold",
    name: "Rose Gold",
    category: "Wedding Service",
    bg: "#9d174d",
    gradient: "linear-gradient(135deg,#831843,#db2777,#fbcfe8)",
    color: "#fff1f2",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Rose-gold wedding."
  }),
  build({
    id: "wd-blush",
    name: "Blush Petals",
    category: "Wedding Service",
    bg: "#fce7f3",
    color: "#831843",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "none",
    description: "Soft blush petals."
  }),
  build({
    id: "wd-cathedral",
    name: "Cathedral Glow",
    category: "Wedding Service",
    bg: "#0c1c33",
    animation: "light-rays",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Cathedral light."
  }),
  build({
    id: "wd-vows",
    name: "Vows Lavender",
    category: "Wedding Service",
    bg: "#4c1d95",
    gradient: "linear-gradient(135deg,#4c1d95,#a78bfa)",
    color: "#fff",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Tender lavender vows."
  }),
  // Thanksgiving Service (4)
  build({
    id: "tg-harvest-gold",
    name: "Thanksgiving Gold",
    category: "Thanksgiving Service",
    bg: "#78350f",
    gradient: "linear-gradient(135deg,#451a03,#a16207)",
    color: "#fffbeb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Grateful golden warmth."
  }),
  build({
    id: "tg-grateful",
    name: "Grateful Heart",
    category: "Thanksgiving Service",
    bg: "#7c2d12",
    gradient: "linear-gradient(135deg,#7c2d12,#dc2626)",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Warm grateful tones."
  }),
  build({
    id: "tg-cornucopia",
    name: "Cornucopia",
    category: "Thanksgiving Service",
    bg: "#92400e",
    animation: "bokeh",
    color: "#fffbeb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Bountiful bokeh."
  }),
  build({
    id: "tg-praise",
    name: "Praise Amber",
    category: "Thanksgiving Service",
    bg: "#451a03",
    animation: "golden-particles",
    color: "#fde68a",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Amber praise particles."
  }),
  // Children Ministry (4)
  build({
    id: "ch-rainbow",
    name: "Rainbow Sunday",
    category: "Children Ministry",
    bg: "#0ea5e9",
    gradient: "linear-gradient(135deg,#fbbf24,#22c55e,#0ea5e9,#a855f7)",
    color: "#ffffff",
    weight: 800,
    fontTa: "Catamaran",
    description: "Bright rainbow joy."
  }),
  build({
    id: "ch-sky-fun",
    name: "Sky Fun",
    category: "Children Ministry",
    bg: "#38bdf8",
    gradient: "linear-gradient(180deg,#bae6fd,#38bdf8)",
    color: "#0c4a6e",
    shadow: "none",
    weight: 800,
    fontTa: "Catamaran",
    description: "Cheerful sky."
  }),
  build({
    id: "ch-meadow",
    name: "Meadow Joy",
    category: "Children Ministry",
    bg: "#22c55e",
    gradient: "linear-gradient(135deg,#16a34a,#86efac)",
    color: "#ffffff",
    weight: 800,
    fontTa: "Catamaran",
    description: "Bright green meadow."
  }),
  build({
    id: "ch-bubbles",
    name: "Soap Bubbles",
    category: "Children Ministry",
    bg: "#0284c7",
    animation: "bokeh",
    color: "#fff",
    weight: 700,
    fontTa: "Catamaran",
    description: "Floating soap bubbles."
  }),
  // Women's Fellowship (4)
  build({
    id: "wf-rose",
    name: "Rose Fellowship",
    category: "Women's Fellowship",
    bg: "#9f1239",
    gradient: "linear-gradient(135deg,#500724,#be185d,#f9a8d4)",
    color: "#fff1f2",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Rose fellowship warmth."
  }),
  build({
    id: "wf-lavender",
    name: "Lavender Grace",
    category: "Women's Fellowship",
    bg: "#4c1d95",
    gradient: "linear-gradient(135deg,#3b0764,#7c3aed)",
    color: "#faf5ff",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Lavender grace."
  }),
  build({
    id: "wf-pearl",
    name: "Pearl Soft",
    category: "Women's Fellowship",
    bg: "#fdf2f8",
    color: "#831843",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "none",
    description: "Soft pearl pink."
  }),
  build({
    id: "wf-bloom",
    name: "Garden Bloom",
    category: "Women's Fellowship",
    bg: "#831843",
    animation: "bokeh",
    color: "#fce7f3",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Garden bloom bokeh."
  }),
  // Men's Fellowship (4)
  build({
    id: "mf-steel",
    name: "Steel Brotherhood",
    category: "Men's Fellowship",
    bg: "#1e293b",
    gradient: "linear-gradient(135deg,#0f172a,#334155)",
    weight: 600,
    description: "Steel brotherhood."
  }),
  build({
    id: "mf-iron",
    name: "Iron Sharpens",
    category: "Men's Fellowship",
    bg: "#1c1917",
    color: "#fafaf9",
    weight: 700,
    description: "Iron-grey strength."
  }),
  build({
    id: "mf-leather",
    name: "Leather Brown",
    category: "Men's Fellowship",
    bg: "#3b2412",
    color: "#fde68a",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Warm leather brown."
  }),
  build({
    id: "mf-fortress",
    name: "Fortress Navy",
    category: "Men's Fellowship",
    bg: "#0c1c33",
    weight: 600,
    description: "Solid fortress navy."
  }),
  // Fasting Prayer (4)
  build({
    id: "fp-ash",
    name: "Ash Quiet",
    category: "Fasting Prayer",
    bg: "#1c1917",
    color: "#e7e5e4",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "deep",
    description: "Quiet ash and humility."
  }),
  build({
    id: "fp-wilderness",
    name: "Wilderness",
    category: "Fasting Prayer",
    bg: "#451a03",
    animation: "fog",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Wilderness fasting."
  }),
  build({
    id: "fp-sackcloth",
    name: "Sackcloth Brown",
    category: "Fasting Prayer",
    bg: "#292524",
    color: "#fde68a",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Sackcloth tones."
  }),
  build({
    id: "fp-deep-night",
    name: "Watch Night",
    category: "Fasting Prayer",
    bg: "#020617",
    animation: "candle-glow",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Watch night candle."
  }),
  // Holy Communion (4)
  build({
    id: "hc-wine",
    name: "Communion Wine",
    category: "Holy Communion",
    bg: "#3f0610",
    color: "#fde68a",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Deep wine reverence."
  }),
  build({
    id: "hc-bread",
    name: "Bread of Life",
    category: "Holy Communion",
    bg: "#78350f",
    gradient: "linear-gradient(135deg,#451a03,#92400e)",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Warm bread tones."
  }),
  build({
    id: "hc-table",
    name: "Lord's Table",
    category: "Holy Communion",
    bg: "#1c0606",
    animation: "candle-glow",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Lord's table by candlelight."
  }),
  build({
    id: "hc-covenant",
    name: "Covenant Crimson",
    category: "Holy Communion",
    bg: "#450a0a",
    color: "#fecaca",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Covenant crimson."
  }),
  // Mission Sunday (4)
  build({
    id: "ms-globe",
    name: "Mission Globe",
    category: "Mission Sunday",
    bg: "#0c4a6e",
    gradient: "linear-gradient(135deg,#082f49,#0e7490)",
    color: "#f0fdfa",
    fontTa: "Catamaran",
    description: "Mission-blue worldview."
  }),
  build({
    id: "ms-go-ye",
    name: "Go Ye Therefore",
    category: "Mission Sunday",
    bg: "#064e3b",
    gradient: "linear-gradient(135deg,#064e3b,#0f766e)",
    color: "#ecfccb",
    fontTa: "Catamaran",
    description: "Green mission call."
  }),
  build({
    id: "ms-harvest-field",
    name: "Harvest Field",
    category: "Mission Sunday",
    bg: "#7c2d12",
    gradient: "linear-gradient(135deg,#7c2d12,#fbbf24)",
    color: "#fff7ed",
    fontTa: "Catamaran",
    description: "Harvest field gold."
  }),
  build({
    id: "ms-nations",
    name: "All Nations",
    category: "Mission Sunday",
    bg: "#1e1b4b",
    animation: "star-field",
    color: "#e0e7ff",
    fontTa: "Catamaran",
    description: "All nations starfield."
  }),
  // Nature Themes (8)
  build({
    id: "nt-forest",
    name: "Forest Pines",
    category: "Nature Themes",
    bg: "#14532d",
    gradient: "linear-gradient(180deg,#14532d,#166534)",
    color: "#ecfccb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Deep forest pines."
  }),
  build({
    id: "nt-mountain",
    name: "Mountain Stone",
    category: "Nature Themes",
    bg: "#1e293b",
    gradient: "linear-gradient(180deg,#0f172a,#475569)",
    fontTa: "Mukta Malar",
    description: "Stone-cool mountain."
  }),
  build({
    id: "nt-autumn",
    name: "Autumn Hills",
    category: "Nature Themes",
    bg: "#7c2d12",
    gradient: "linear-gradient(135deg,#7c2d12,#c2410c)",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    color: "#fffbeb",
    description: "Warm autumn hills."
  }),
  build({
    id: "nt-river",
    name: "River Flow",
    category: "Nature Themes",
    bg: "#0c4a6e",
    animation: "water",
    color: "#e0f7fa",
    fontTa: "Mukta Malar",
    description: "Flowing river."
  }),
  build({
    id: "nt-ocean",
    name: "Ocean Tide",
    category: "Nature Themes",
    bg: "#082f49",
    animation: "ocean",
    color: "#e0f2fe",
    fontTa: "Mukta Malar",
    description: "Slow ocean tide."
  }),
  build({
    id: "nt-sky",
    name: "Open Sky",
    category: "Nature Themes",
    bg: "#0284c7",
    animation: "clouds",
    color: "#fff",
    fontTa: "Mukta Malar",
    description: "Open drifting sky."
  }),
  build({
    id: "nt-meadow",
    name: "Spring Meadow",
    category: "Nature Themes",
    bg: "#16a34a",
    gradient: "linear-gradient(180deg,#16a34a,#86efac)",
    color: "#fff",
    fontTa: "Mukta Malar",
    description: "Bright spring meadow."
  }),
  build({
    id: "nt-dawn-mist",
    name: "Dawn Mist",
    category: "Nature Themes",
    bg: "#1e3a8a",
    animation: "fog",
    color: "#e0e7ff",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Misty dawn."
  }),
  // Cross Themes (6)
  build({
    id: "cr-shadow",
    name: "Cross Shadow",
    category: "Cross Themes",
    bg: "#0a0a0a",
    animation: "floating-cross",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Drifting cross silhouettes."
  }),
  build({
    id: "cr-redemption",
    name: "Cross Redemption",
    category: "Cross Themes",
    bg: "#1c0606",
    gradient: "linear-gradient(180deg,#450a0a,#0a0000)",
    animation: "floating-cross",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Crimson-to-black redemption."
  }),
  build({
    id: "cr-beam",
    name: "Cross of Light",
    category: "Cross Themes",
    bg: "#000",
    animation: "cross-beam",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Glowing cross beam."
  }),
  build({
    id: "cr-old-rugged",
    name: "Old Rugged Cross",
    category: "Cross Themes",
    bg: "#3b2412",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Rugged wooden cross."
  }),
  build({
    id: "cr-finished",
    name: "It Is Finished",
    category: "Cross Themes",
    bg: "#0a0000",
    color: "#fecaca",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "deep",
    description: "It is finished."
  }),
  build({
    id: "cr-empty-cross",
    name: "Empty Cross",
    category: "Cross Themes",
    bg: "#0c4a6e",
    animation: "light-rays",
    color: "#fefce8",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Empty cross morning."
  }),
  // Heaven Themes (6)
  build({
    id: "hv-light",
    name: "Heaven Light",
    category: "Heaven Themes",
    bg: "#e0f2fe",
    gradient: "radial-gradient(circle at 50% 30%,#ffffff,#e0f2fe 70%)",
    animation: "light-rays",
    color: "#0c4a6e",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    shadow: "none",
    description: "Sky-white rays of glory."
  }),
  build({
    id: "hv-cloud",
    name: "Heaven Cloud",
    category: "Heaven Themes",
    bg: "#7dd3fc",
    gradient: "linear-gradient(180deg,#bae6fd,#38bdf8)",
    animation: "clouds",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Floating heavenly clouds."
  }),
  build({
    id: "hv-glory",
    name: "Throne Glory",
    category: "Heaven Themes",
    bg: "#78350f",
    animation: "light-rays",
    color: "#fffbeb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Golden throne glory."
  }),
  build({
    id: "hv-streets-gold",
    name: "Streets of Gold",
    category: "Heaven Themes",
    bg: "#92400e",
    animation: "golden-particles",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Streets-of-gold shimmer."
  }),
  build({
    id: "hv-aurora",
    name: "Heaven Aurora",
    category: "Heaven Themes",
    bg: "#0a0e2c",
    animation: "aurora",
    color: "#e0e7ff",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Heavenly aurora."
  }),
  build({
    id: "hv-jasper",
    name: "Jasper Sea",
    category: "Heaven Themes",
    bg: "#0c4a6e",
    animation: "water",
    color: "#e0f7fa",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Sea of jasper."
  }),
  // Fire Themes (6)
  build({
    id: "ft-ember",
    name: "Fire Ember",
    category: "Fire Themes",
    bg: "#450a0a",
    gradient: "radial-gradient(circle at 50% 100%,#dc2626,#450a0a 70%)",
    animation: "fire-glow",
    weight: 700,
    fontTa: "Catamaran",
    description: "Ember red with rising sparks."
  }),
  build({
    id: "ft-coal",
    name: "Fire Coal",
    category: "Fire Themes",
    bg: "#1c0606",
    gradient: "radial-gradient(ellipse at 50% 90%,#7f1d1d,#1c0606 80%)",
    animation: "soft-glow",
    color: "#fed7aa",
    fontTa: "Catamaran",
    description: "Glowing coal underlay."
  }),
  build({
    id: "ft-pentecost",
    name: "Pentecost Fire",
    category: "Fire Themes",
    bg: "#7c2d12",
    animation: "fire-glow",
    color: "#fff7ed",
    weight: 700,
    fontTa: "Catamaran",
    description: "Tongues of Pentecost fire."
  }),
  build({
    id: "ft-burning-bush",
    name: "Burning Bush",
    category: "Fire Themes",
    bg: "#451a03",
    animation: "fire-glow",
    color: "#fff7ed",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Burning bush warmth."
  }),
  build({
    id: "ft-furnace",
    name: "Furnace Heat",
    category: "Fire Themes",
    bg: "#1c0606",
    animation: "fire-glow",
    color: "#fed7aa",
    fontTa: "Catamaran",
    weight: 700,
    description: "Furnace deep heat."
  }),
  build({
    id: "ft-altar",
    name: "Altar Flame",
    category: "Fire Themes",
    bg: "#0a0000",
    animation: "candle-glow",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Single altar flame."
  }),
  // Light Themes (6)
  build({
    id: "lt-soft-white",
    name: "Soft White",
    category: "Light Themes",
    bg: "#fafaf9",
    color: "#1c1917",
    shadow: "none",
    fontEn: "Inter",
    fontTa: "Noto Sans Tamil",
    description: "Soft white, dark text."
  }),
  build({
    id: "lt-cream",
    name: "Cream Bright",
    category: "Light Themes",
    bg: "#fef3c7",
    color: "#451a03",
    shadow: "none",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Warm cream daylight."
  }),
  build({
    id: "lt-sky-light",
    name: "Sky Light",
    category: "Light Themes",
    bg: "#e0f2fe",
    color: "#0c4a6e",
    shadow: "none",
    fontTa: "Mukta Malar",
    description: "Clear sky light."
  }),
  build({
    id: "lt-paper",
    name: "Paper White",
    category: "Light Themes",
    bg: "#ffffff",
    color: "#111827",
    shadow: "none",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Pure paper white."
  }),
  build({
    id: "lt-rays-day",
    name: "Daylight Rays",
    category: "Light Themes",
    bg: "#fef9c3",
    animation: "light-rays",
    color: "#3f3f46",
    shadow: "none",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Daylight rays."
  }),
  build({
    id: "lt-pearl",
    name: "Pearl Glow",
    category: "Light Themes",
    bg: "#fce7f3",
    color: "#831843",
    shadow: "none",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Pearl-glow blush."
  }),
  // Dark Themes (6)
  build({
    id: "dk-onyx",
    name: "Onyx",
    category: "Dark Themes",
    bg: "#000000",
    description: "Pure onyx."
  }),
  build({
    id: "dk-graphite",
    name: "Graphite",
    category: "Dark Themes",
    bg: "#0a0a0a",
    description: "Graphite black."
  }),
  build({
    id: "dk-midnight",
    name: "Midnight Indigo",
    category: "Dark Themes",
    bg: "#0a0e2c",
    description: "Midnight indigo."
  }),
  build({
    id: "dk-charcoal",
    name: "Warm Charcoal",
    category: "Dark Themes",
    bg: "#1c1917",
    color: "#f5f5f4",
    description: "Warm charcoal."
  }),
  build({
    id: "dk-obsidian",
    name: "Obsidian Blue",
    category: "Dark Themes",
    bg: "#020617",
    gradient: "linear-gradient(135deg,#020617,#0f172a)",
    description: "Obsidian blue."
  }),
  build({
    id: "dk-ink",
    name: "Ink Black",
    category: "Dark Themes",
    bg: "#0c0a09",
    color: "#f5f5f4",
    description: "Ink black."
  }),
  // Minimal Themes (6)
  build({
    id: "mn-dark",
    name: "Minimal Dark",
    category: "Minimal Themes",
    bg: "#000",
    weight: 300,
    shadow: "none",
    description: "Pure black, thin sans."
  }),
  build({
    id: "mn-light",
    name: "Minimal Light",
    category: "Minimal Themes",
    bg: "#fdf6e3",
    color: "#1f2937",
    weight: 400,
    shadow: "none",
    description: "Warm off-white, dark ink."
  }),
  build({
    id: "mn-charcoal",
    name: "Minimal Charcoal",
    category: "Minimal Themes",
    bg: "#1c1917",
    color: "#f5f5f4",
    weight: 400,
    shadow: "none",
    description: "Editorial charcoal."
  }),
  build({
    id: "mn-slate",
    name: "Minimal Slate",
    category: "Minimal Themes",
    bg: "#1e293b",
    weight: 400,
    shadow: "none",
    description: "Minimal slate."
  }),
  build({
    id: "mn-warm",
    name: "Minimal Warm",
    category: "Minimal Themes",
    bg: "#292524",
    color: "#fef3c7",
    weight: 400,
    shadow: "none",
    description: "Warm minimal."
  }),
  build({
    id: "mn-cool",
    name: "Minimal Cool",
    category: "Minimal Themes",
    bg: "#0f172a",
    weight: 400,
    shadow: "none",
    description: "Cool minimal."
  }),
  // Animated Themes (12)
  build({
    id: "an-clouds",
    name: "Moving Clouds",
    category: "Animated Themes",
    bg: "#0c4a6e",
    animation: "clouds",
    fontTa: "Mukta Malar",
    description: "Slowly drifting clouds."
  }),
  build({
    id: "an-light-rays",
    name: "Light Rays",
    category: "Animated Themes",
    bg: "#78350f",
    animation: "light-rays",
    color: "#fffbeb",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Rotating rays of glory."
  }),
  build({
    id: "an-golden-particles",
    name: "Golden Particles",
    category: "Animated Themes",
    bg: "#1c1006",
    animation: "golden-particles",
    color: "#fde68a",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Rising golden particles."
  }),
  build({
    id: "an-floating-dust",
    name: "Floating Dust",
    category: "Animated Themes",
    bg: "#0a0a0a",
    animation: "floating-dust",
    description: "Quiet floating dust."
  }),
  build({
    id: "an-fog",
    name: "Slow Fog",
    category: "Animated Themes",
    bg: "#1c1917",
    animation: "fog",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Slow drifting fog."
  }),
  build({
    id: "an-fire-glow",
    name: "Fire Glow",
    category: "Animated Themes",
    bg: "#450a0a",
    animation: "fire-glow",
    color: "#fff7ed",
    fontTa: "Catamaran",
    weight: 700,
    description: "Living fire glow."
  }),
  build({
    id: "an-cross-beam",
    name: "Cross Light Beam",
    category: "Animated Themes",
    bg: "#000",
    animation: "cross-beam",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Cross-shaped light beam."
  }),
  build({
    id: "an-bokeh",
    name: "Soft Bokeh",
    category: "Animated Themes",
    bg: "#1a0f08",
    animation: "bokeh",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Warm soft bokeh."
  }),
  build({
    id: "an-water",
    name: "Water Reflection",
    category: "Animated Themes",
    bg: "#082f49",
    animation: "water",
    color: "#e0f7fa",
    fontTa: "Mukta Malar",
    description: "Gentle water reflections."
  }),
  build({
    id: "an-sky",
    name: "Sky Motion",
    category: "Animated Themes",
    bg: "#0c4a6e",
    animation: "sky-motion",
    fontTa: "Mukta Malar",
    description: "Slow sky colour-shift."
  }),
  build({
    id: "an-stage",
    name: "Worship Stage Lights",
    category: "Animated Themes",
    bg: "#0a0a0a",
    animation: "stage-lights",
    fontTa: "Catamaran",
    weight: 600,
    description: "Sweeping stage lights."
  }),
  build({
    id: "an-aurora",
    name: "Aurora Motion",
    category: "Animated Themes",
    bg: "#0a0e2c",
    animation: "aurora",
    color: "#e0e7ff",
    fontTa: "Catamaran",
    description: "Soft aurora motion."
  }),
  // Cinematic Themes (8)
  build({
    id: "cn-star-field",
    name: "Star Field",
    category: "Cinematic Themes",
    bg: "#0a0e2c",
    animation: "star-field",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Cinematic starfield."
  }),
  build({
    id: "cn-gentle-rain",
    name: "Gentle Rain",
    category: "Cinematic Themes",
    bg: "#0c1c33",
    animation: "rain",
    color: "#dbeafe",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Quiet gentle rain."
  }),
  build({
    id: "cn-candle-glow",
    name: "Candle Glow",
    category: "Cinematic Themes",
    bg: "#1a0f08",
    animation: "candle-glow",
    color: "#fef3c7",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Cinematic candle glow."
  }),
  build({
    id: "cn-sunrise",
    name: "Sunrise Motion",
    category: "Cinematic Themes",
    bg: "#7c2d12",
    animation: "sunrise",
    color: "#fff7ed",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    weight: 600,
    description: "Cinematic sunrise."
  }),
  build({
    id: "cn-ocean",
    name: "Ocean Motion",
    category: "Cinematic Themes",
    bg: "#082f49",
    animation: "ocean",
    color: "#e0f2fe",
    fontEn: "Georgia",
    fontTa: "Noto Serif Tamil",
    description: "Wide ocean motion."
  }),
  build({
    id: "cn-abstract",
    name: "Abstract Worship Motion",
    category: "Cinematic Themes",
    bg: "#1e1b4b",
    animation: "abstract-worship",
    fontTa: "Catamaran",
    weight: 600,
    description: "Abstract worship motion."
  }),
  build({
    id: "cn-particles-dark",
    name: "Drifting Particles",
    category: "Cinematic Themes",
    bg: "#0a0a0a",
    animation: "particles",
    fontTa: "Mukta Malar",
    description: "Soft drifting particles."
  }),
  build({
    id: "cn-soft-pulse",
    name: "Soft Pulse",
    category: "Cinematic Themes",
    bg: "#0f172a",
    animation: "soft-glow",
    fontTa: "Mukta Malar",
    weight: 500,
    description: "Cinematic soft pulse."
  })
];
const useCustomTemplates = create()(
  persist(
    (set) => ({
      templates: [],
      saveCurrent: (name, description = "Custom saved theme.") => {
        const groups = useTextFormat.getState().groups;
        const logo = useLogo.getState();
        const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        const preset = {
          id,
          name: name.trim() || "Untitled Theme",
          description,
          category: "Animated Themes",
          text: { ...groups.english },
          perGroup: {
            reference: { ...groups.reference },
            tamil: { ...groups.tamil },
            english: { ...groups.english }
          },
          background: { ...groups.background },
          logo: { enabled: logo.enabled, settings: { ...logo.settings } }
        };
        set((s) => ({ templates: [preset, ...s.templates] }));
        return preset;
      },
      duplicate: (source, name) => {
        const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        const preset = {
          ...source,
          id,
          name: name?.trim() || `${source.name} (Copy)`,
          description: source.description,
          category: "Animated Themes"
        };
        set((s) => ({ templates: [preset, ...s.templates] }));
        return preset;
      },
      remove: (id) => set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
      rename: (id, name) => set((s) => ({ templates: s.templates.map((t) => t.id === id ? { ...t, name } : t) }))
    }),
    { name: "vision-custom-templates", storage: createJSONStorage(() => localStorage), version: 1 }
  )
);
const MAX_RECENT = 12;
const useThemeFavorites = create()(
  persist(
    (set, get) => ({
      favorites: [],
      recents: [],
      usage: {},
      toggleFavorite: (id) => set((s) => ({
        favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [id, ...s.favorites]
      })),
      pushRecent: (id) => set((s) => ({
        recents: [id, ...s.recents.filter((x) => x !== id)].slice(0, MAX_RECENT),
        usage: { ...s.usage, [id]: (s.usage[id] ?? 0) + 1 }
      })),
      isFavorite: (id) => get().favorites.includes(id),
      mostUsed: (limit = 8) => Object.entries(get().usage).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id]) => id)
    }),
    { name: "vision-theme-favorites", storage: createJSONStorage(() => localStorage), version: 1 }
  )
);
function resolvePreset(id) {
  const builtin = TEMPLATE_PRESETS.find((t) => t.id === id);
  if (builtin) return builtin;
  return useCustomTemplates.getState().templates.find((t) => t.id === id) ?? null;
}
function applyTemplate(id, opts = {}) {
  const preset = resolvePreset(id);
  if (!preset) return null;
  const groups = ["reference", "tamil", "english"];
  const tf = useTextFormat.getState();
  for (const g of groups) {
    const merged = { ...preset.text, ...preset.perGroup?.[g] ?? {} };
    if (Object.keys(merged).length > 0) tf.patchGroup(g, merged);
  }
  const bgMode = opts.background ?? "auto";
  const shouldWriteBg = preset.background && (bgMode === "force" || bgMode === "auto" && canThemeWriteBackground());
  if (shouldWriteBg) {
    tf.setBackground({
      gradient: preset.background.gradient ?? null,
      animation: preset.background.animation ?? "none",
      ...preset.background
    });
  }
  const logoMode = opts.logo ?? "auto";
  const logoEnabled = useBackground.getState().logoEnabled;
  const shouldWriteLogo = preset.logo && (logoMode === "force" || logoMode === "auto" && logoEnabled);
  if (shouldWriteLogo) {
    const logo = useLogo.getState();
    logo.setEnabled(preset.logo.enabled);
    if (preset.logo.settings) logo.patch(preset.logo.settings);
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("vision-active-template", id);
    } catch {
    }
    try {
      useThemeFavorites.getState().pushRecent(id);
    } catch {
    }
  }
  return preset;
}
function activeTemplateId() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("vision-active-template");
  } catch {
    return null;
  }
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const SAMPLE_OVERLAY = {
  reference: "சங்கீதம் 23:1",
  text: "கர்த்தர் என் மேய்ப்பராயிருக்கிறார்",
  subtext: "The Lord is my shepherd",
  translation: "தமிழ்",
  subtranslation: "ENG",
  kind: "song_slide"
};
function presetToGroups(preset) {
  const baseText = preset.text ?? {};
  return {
    reference: { ...DEFAULT_REFERENCE_STYLE, ...baseText, ...preset.perGroup?.reference ?? {} },
    tamil: { ...DEFAULT_TAMIL_STYLE, ...baseText, ...preset.perGroup?.tamil ?? {} },
    english: { ...DEFAULT_ENGLISH_STYLE, ...baseText, ...preset.perGroup?.english ?? {} },
    background: {
      ...DEFAULT_BACKGROUND,
      ...preset.background,
      animation: preset.background.animation ?? "none",
      gradient: preset.background.gradient ?? null
    }
  };
}
function presetToLogo(preset, fallback) {
  if (preset.logo) {
    return {
      enabled: preset.logo.enabled,
      current: fallback.current,
      settings: { ...fallback.settings, ...preset.logo.settings ?? {} }
    };
  }
  return { enabled: false, current: fallback.current, settings: fallback.settings };
}
function ThemeGalleryDialog({ open, onOpenChange }) {
  const custom = useCustomTemplates((s) => s.templates);
  const removeCustom = useCustomTemplates((s) => s.remove);
  const saveCurrent = useCustomTemplates((s) => s.saveCurrent);
  const duplicateCustom = useCustomTemplates((s) => s.duplicate);
  const logo = useLogo();
  const favorites = useThemeFavorites((s) => s.favorites);
  const recents = useThemeFavorites((s) => s.recents);
  const toggleFavorite = useThemeFavorites((s) => s.toggleFavorite);
  const mostUsedFn = useThemeFavorites((s) => s.mostUsed);
  const [bucket, setBucket] = reactExports.useState("All");
  const [query, setQuery] = reactExports.useState("");
  const [previewing, setPreviewing] = reactExports.useState(null);
  const [appliedId, setAppliedId] = reactExports.useState(activeTemplateId());
  const [saveOpen, setSaveOpen] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const all = reactExports.useMemo(() => [...custom, ...TEMPLATE_PRESETS], [custom]);
  const byId = reactExports.useMemo(() => new Map(all.map((t) => [t.id, t])), [all]);
  const mostUsedIds = reactExports.useMemo(() => mostUsedFn(12), [mostUsedFn, recents, favorites]);
  const bucketList = reactExports.useMemo(() => {
    let list;
    if (bucket === "All") list = all;
    else if (bucket === "Custom") list = custom;
    else if (bucket === "Favorites")
      list = favorites.map((id) => byId.get(id)).filter(Boolean);
    else if (bucket === "Recents")
      list = recents.map((id) => byId.get(id)).filter(Boolean);
    else if (bucket === "Most Used")
      list = mostUsedIds.map((id) => byId.get(id)).filter(Boolean);
    else list = all.filter((t) => t.category === bucket);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [bucket, all, custom, favorites, recents, mostUsedIds, byId, query]);
  const onApply = (preset) => {
    applyTemplate(preset.id);
    setAppliedId(preset.id);
    setPreviewing(null);
    onOpenChange(false);
  };
  const onSave = () => {
    if (!newName.trim()) return;
    saveCurrent(newName.trim());
    setNewName("");
    setSaveOpen(false);
    setBucket("Custom");
  };
  const sideButtons = [
    { key: "All", label: "All", count: all.length },
    { key: "Favorites", label: "★ Favorites", count: favorites.length },
    { key: "Recents", label: "Recents", count: recents.length },
    { key: "Most Used", label: "Most Used", count: mostUsedIds.length },
    { key: "Custom", label: "Custom", count: custom.length },
    ...TEMPLATE_CATEGORIES.map((c) => ({
      key: c,
      label: c,
      count: all.filter((t) => t.category === c).length
    }))
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "!max-w-[1320px] h-[90vh] flex flex-col gap-0 p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
        "Theme Gallery",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground", children: [
          TEMPLATE_PRESETS.length + custom.length,
          " themes"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Search themes…",
              className: "h-8 w-56 pl-7 text-xs"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setSaveOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
          " Save Current as Template"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "w-48 shrink-0 overflow-y-auto border-r border-border bg-muted/20 p-2 text-[12px]", children: sideButtons.map(({ key, label, count }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setBucket(key),
          className: cn(
            "flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition",
            bucket === key ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "ml-1 rounded px-1 text-[10px]",
                  bucket === key ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                ),
                children: count
              }
            )
          ]
        },
        key
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-3", children: bucketList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full place-items-center text-sm text-muted-foreground", children: bucket === "Custom" ? "No saved themes yet. Use “Save Current as Template”." : bucket === "Favorites" ? "No favourite themes yet. Tap ★ on any theme." : bucket === "Recents" ? "No recently applied themes yet." : bucket === "Most Used" ? "No usage data yet." : "No themes match this filter." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: bucketList.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ThumbCard,
        {
          preset,
          isActive: appliedId === preset.id,
          isCustom: preset.id.startsWith("custom-"),
          isFavorite: favorites.includes(preset.id),
          onClick: () => setPreviewing(preset),
          onToggleFavorite: () => toggleFavorite(preset.id),
          onDuplicate: () => duplicateCustom(preset),
          onDelete: () => {
            removeCustom(preset.id);
            if (appliedId === preset.id) setAppliedId(null);
          },
          logoBase: logo
        },
        preset.id
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!previewing, onOpenChange: (v) => !v && setPreviewing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "!max-w-[1100px] gap-3 p-4", children: previewing && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: previewing.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: previewing.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "overflow-hidden rounded-lg border border-border bg-black",
          style: { aspectRatio: "16 / 9" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProjectionTextStage,
            {
              overlay: SAMPLE_OVERLAY,
              textStyle: DEFAULT_TEXT_STYLE,
              groupedStyles: presetToGroups(previewing),
              logo: presetToLogo(previewing, logo)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => duplicateCustom(previewing), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
          " Duplicate as Custom"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setPreviewing(null), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
            " Cancel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => onApply(previewing), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
            " Apply Theme"
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: saveOpen, onOpenChange: setSaveOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "!max-w-md gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Save current style as template" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          autoFocus: true,
          placeholder: "Theme name (e.g. Sunday Worship)",
          value: newName,
          onChange: (e) => setNewName(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") onSave();
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Captures current Reference / Tamil / English styles, background, animation and logo settings." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setSaveOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onSave, disabled: !newName.trim(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
          " Save"
        ] })
      ] })
    ] }) })
  ] }) });
}
function ThumbCard({
  preset,
  isActive,
  isCustom,
  isFavorite,
  onClick,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  logoBase
}) {
  const ref = reactExports.useRef(null);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);
  const groups = reactExports.useMemo(() => visible ? presetToGroups(preset) : null, [visible, preset]);
  const logo = reactExports.useMemo(
    () => visible ? presetToLogo(preset, logoBase) : null,
    [visible, preset, logoBase]
  );
  const placeholderBg = preset.background.gradient ?? preset.background.color ?? "#000";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: cn(
        "group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition",
        isActive ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/60"
      ),
      style: { contentVisibility: "auto", containIntrinsicSize: "240px 180px" },
      onClick,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: { aspectRatio: "16 / 9" }, children: [
          visible && groups && logo ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProjectionTextStage,
            {
              overlay: SAMPLE_OVERLAY,
              textStyle: DEFAULT_TEXT_STYLE,
              groupedStyles: groups,
              logo
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: { background: placeholderBg } }),
          isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute right-1.5 top-1.5 z-10 inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-primary-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-2.5 w-2.5" }),
            " Active"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-1.5 top-1.5 z-10 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                },
                title: isFavorite ? "Remove from favourites" : "Add to favourites",
                className: cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded bg-black/60 transition hover:bg-black/80",
                  isFavorite ? "text-yellow-300 opacity-100" : "text-white opacity-0 group-hover:opacity-100"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-3 w-3", isFavorite && "fill-current") })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onDuplicate();
                },
                title: "Duplicate as custom theme",
                className: "inline-flex h-5 w-5 items-center justify-center rounded bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/80",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" })
              }
            ),
            isCustom && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onDelete();
                },
                title: "Delete custom theme",
                className: "inline-flex h-5 w-5 items-center justify-center rounded bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-destructive",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[12px] font-semibold", children: preset.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded bg-muted px-1 text-[9px] uppercase tracking-wide text-muted-foreground", children: isCustom ? "Custom" : preset.category })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 line-clamp-1 text-[10px] text-muted-foreground", children: preset.description })
        ] })
      ]
    }
  );
}
const QUICK_IDS = [
  "cw-navy",
  "mw-indigo",
  "pr-candle",
  "ys-violet",
  "bs-scholar",
  "rv-glory",
  "an-clouds",
  "mn-dark"
];
function TemplatesStrip() {
  const [open, setOpen] = reactExports.useState(true);
  const [active, setActive] = reactExports.useState(activeTemplateId());
  const [galleryOpen, setGalleryOpen] = reactExports.useState(false);
  const saveCurrent = useCustomTemplates((s) => s.saveCurrent);
  const customCount = useCustomTemplates((s) => s.templates.length);
  const quick = reactExports.useMemo(
    () => QUICK_IDS.map((id) => TEMPLATE_PRESETS.find((t) => t.id === id)).filter(
      (t) => !!t
    ),
    []
  );
  const onSaveQuick = () => {
    const name = window.prompt("Theme name:", "My Theme");
    if (!name || !name.trim()) return;
    saveCurrent(name.trim());
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border bg-muted/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        className: "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent/40",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Themes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 rounded bg-muted px-1 text-[9px] normal-case tracking-normal", children: [
            TEMPLATE_PRESETS.length,
            customCount > 0 ? ` +${customCount}` : ""
          ] }),
          active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 truncate text-[10px] font-medium normal-case tracking-normal text-primary", children: TEMPLATE_PRESETS.find((t) => t.id === active)?.name ?? "Custom" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }) })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 px-3 pb-2.5 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto", children: quick.map((t) => {
        const isActive = active === t.id;
        const bgStyle = {
          background: t.background.gradient ?? t.background.color ?? "#000"
        };
        const textColor = t.text.color ?? "#ffffff";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              applyTemplate(t.id);
              setActive(t.id);
            },
            title: `${t.name} — ${t.description}`,
            className: cn(
              "group relative flex w-[112px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-md border text-left transition",
              isActive ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/60"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-12 items-center justify-center", style: bgStyle, children: [
                t.background.animation && t.background.animation !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `pointer-events-none absolute inset-0 overflow-hidden bg-anim-${t.background.animation}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "relative z-10 text-[18px] font-bold leading-none",
                    style: {
                      color: textColor,
                      fontFamily: t.text.fontFamily,
                      textShadow: t.text.shadow ? "0 1px 3px rgba(0,0,0,.6)" : void 0
                    },
                    children: "Aa"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-card px-1.5 py-1 text-[10px] font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: t.name }),
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "ml-auto h-3 w-3 shrink-0 text-primary" })
              ] })
            ]
          },
          t.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setGalleryOpen(true),
            className: "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/15",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-3.5 w-3.5" }),
              " Browse All Themes"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onSaveQuick,
            title: "Save current style as a custom template",
            className: "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-[11px] hover:bg-accent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
              " Save"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ThemeGalleryDialog,
      {
        open: galleryOpen,
        onOpenChange: (v) => {
          setGalleryOpen(v);
          if (!v) setActive(activeTemplateId());
        }
      }
    )
  ] });
}
const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Georgia",
  "Times New Roman",
  "Arial",
  "Verdana",
  "Tahoma",
  // Tamil presentation fonts
  "Latha",
  "Nirmala UI",
  "Vijaya",
  "Akshar Unicode",
  "Noto Sans Tamil",
  "Noto Serif Tamil",
  "Noto Sans Tamil UI",
  "Mukta Malar",
  "Catamaran",
  "Hind Madurai",
  "Meera Inimai",
  "Pavanam",
  "Arima Madurai",
  "Anek Tamil",
  "Kavivanar",
  "Pathway Gothic One",
  "Tiro Tamil",
  "Mukta",
  "Baloo Thambi 2",
  "Cousine"
];
const WEIGHTS = [
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Black", value: 900 }
];
const GROUP_LABELS = {
  reference: "Reference",
  tamil: "Tamil",
  english: "English"
};
function TextFormattingPanel() {
  const focus = useFocusZone("text-format");
  const collapsed = useWorkspace((s) => s.textFormatCollapsed);
  const toggle = useWorkspace((s) => s.toggleTextFormatCollapsed);
  const activeTab = useWorkspace((s) => s.activeTab);
  const groups = useTextFormat((s) => s.groups);
  const setField = useTextFormat((s) => s.setField);
  const patchGroup = useTextFormat((s) => s.patchGroup);
  const setBackground = useTextFormat((s) => s.setBackground);
  const resetGroup = useTextFormat((s) => s.resetGroup);
  const reset = useTextFormat((s) => s.reset);
  const songsMode = activeTab === "songs";
  const visibleGroups = songsMode ? ["tamil"] : Object.keys(GROUP_LABELS);
  const [activeRaw, setActive] = reactExports.useState("reference");
  const active = songsMode ? "tamil" : activeRaw;
  const [pickerOpen, setPickerOpen] = reactExports.useState(false);
  const [bgName, setBgName] = reactExports.useState(null);
  const style = groups[active];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "@container flex h-full min-h-0 flex-col bg-card",
        focus.isActive && "ring-1 ring-primary/40"
      ),
      onFocus: focus.onFocus,
      onMouseDown: focus.onFocus,
      tabIndex: focus.tabIndex,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/30 px-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 items-baseline gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 text-[11px] font-semibold uppercase tracking-wide", children: "Text Formatting" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden truncate text-[10px] text-muted-foreground @sm:block", children: collapsed ? "Collapsed — click to expand" : songsMode ? "Songs · Tamil + Background" : "Per-group · Reference / Tamil / English / BG / Logo" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: reset,
                title: "Reset all groups",
                className: "inline-flex h-6 shrink-0 cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden @sm:inline", children: "Reset all" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: toggle,
                title: collapsed ? "Expand" : "Collapse",
                className: "inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
                children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx(TemplatesStrip, {}),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-center gap-1 rounded-md border border-border bg-background p-0.5", children: [
            visibleGroups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setActive(g),
                disabled: songsMode,
                className: cn(
                  "min-w-[60px] flex-1 cursor-pointer rounded px-2 py-1 text-[11px] font-medium transition",
                  active === g ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                ),
                children: songsMode ? "Tamil Song" : GROUP_LABELS[g]
              },
              g
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => patchGroup(active, { visible: !style.visible }),
                title: style.visible ? "Hide this section in projection" : "Show this section in projection",
                className: cn(
                  "ml-1 inline-flex h-6 w-7 shrink-0 cursor-pointer items-center justify-center rounded border text-[10px]",
                  style.visible ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"
                ),
                children: style.visible ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => resetGroup(active),
                title: `Reset ${GROUP_LABELS[active]}`,
                className: "ml-1 inline-flex h-6 w-7 shrink-0 cursor-pointer items-center justify-center rounded border border-border bg-background text-[10px] text-muted-foreground hover:bg-accent",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 @md:grid-cols-2 @2xl:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Group, { icon: Type, title: "Typography", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Font Family", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Select$1,
                {
                  value: style.fontFamily,
                  onChange: (v) => setField(active, "fontFamily", v),
                  options: FONT_FAMILIES.map((f) => ({ label: f, value: f }))
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Size", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: style.fontSizeVw,
                    step: 0.2,
                    min: 0.5,
                    suffix: "vw",
                    onChange: (v) => setField(active, "fontSizeVw", v)
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Weight", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Select$1,
                  {
                    value: String(style.fontWeight),
                    onChange: (v) => setField(active, "fontWeight", Number(v)),
                    options: WEIGHTS.map((w) => ({ label: w.label, value: String(w.value) }))
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Line Height", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: style.lineHeight,
                    step: 0.05,
                    min: 0.8,
                    max: 3,
                    onChange: (v) => setField(active, "lineHeight", v)
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Letter Spacing", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: style.letterSpacing,
                    step: 0.1,
                    min: -5,
                    max: 20,
                    suffix: "px",
                    onChange: (v) => setField(active, "letterSpacing", v)
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { icon: Palette, title: "Color", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Color", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ColorInput, { value: style.color, onChange: (v) => setField(active, "color", v) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberInput,
                {
                  value: Math.round(style.textOpacity * 100),
                  step: 1,
                  min: 0,
                  max: 100,
                  suffix: "%",
                  onChange: (v) => setField(active, "textOpacity", v / 100)
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { icon: Bold, title: "Style", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Toggle,
                {
                  label: "B",
                  active: style.fontWeight >= 700,
                  onClick: () => setField(active, "fontWeight", style.fontWeight >= 700 ? 500 : 700)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Toggle,
                {
                  label: "I",
                  active: style.italic,
                  onClick: () => setField(active, "italic", !style.italic)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Toggle,
                {
                  label: "U",
                  active: style.underline,
                  onClick: () => setField(active, "underline", !style.underline)
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { icon: TextAlignStart, title: "Alignment", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Horizontal", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["left", "center", "right"].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Toggle,
                {
                  label: a[0].toUpperCase() + a.slice(1),
                  active: style.align === a,
                  onClick: () => setField(active, "align", a)
                },
                a
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Vertical", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["top", "middle", "bottom"].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Toggle,
                {
                  label: a[0].toUpperCase() + a.slice(1),
                  active: style.vAlign === a,
                  onClick: () => setField(active, "vAlign", a)
                },
                a
              )) }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Group, { icon: Sparkles, title: "Shadow", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Enabled", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Toggle,
                  {
                    label: style.shadow ? "On" : "Off",
                    active: style.shadow,
                    onClick: () => setField(active, "shadow", !style.shadow)
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: style.shadowBlur,
                    step: 1,
                    min: 0,
                    max: 80,
                    suffix: "px",
                    onChange: (v) => setField(active, "shadowBlur", v)
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Color", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ColorInput,
                {
                  value: style.shadowColor,
                  onChange: (v) => setField(active, "shadowColor", v)
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { icon: Sun, title: "Outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Width", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberInput,
                {
                  value: style.outlineWidth,
                  step: 0.5,
                  min: 0,
                  max: 10,
                  suffix: "px",
                  onChange: (v) => setField(active, "outlineWidth", v)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Color", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ColorInput,
                {
                  value: style.outlineColor,
                  onChange: (v) => setField(active, "outlineColor", v)
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { icon: Move, title: "Position", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Margin", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                value: style.paddingVw,
                step: 0.5,
                min: 0,
                max: 30,
                suffix: "%",
                onChange: (v) => setField(active, "paddingVw", v)
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { icon: Square, title: `${GROUP_LABELS[active]} background tint`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Color", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ColorInput,
                {
                  value: style.background,
                  onChange: (v) => setField(active, "background", v)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberInput,
                {
                  value: Math.round(style.bgOpacity * 100),
                  step: 1,
                  min: 0,
                  max: 100,
                  suffix: "%",
                  onChange: (v) => setField(active, "bgOpacity", v / 100)
                }
              ) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayerSwitchesPanel, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-md border border-primary/30 bg-primary/5 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-3.5 w-3.5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-primary", children: "Projection Background" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto text-[10px] text-muted-foreground", children: "None · Color · Media" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex items-center gap-1 rounded-md border border-border bg-background p-0.5", children: ["none", "color", "media"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setBackground({ kind: k }),
                className: cn(
                  "flex-1 cursor-pointer rounded px-2 py-1 text-[11px] font-medium transition",
                  groups.background.kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                ),
                children: k[0].toUpperCase() + k.slice(1)
              },
              k
            )) }),
            groups.background.kind === "color" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-background p-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: "Background color" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ColorInput,
                {
                  value: groups.background.color,
                  onChange: (v) => setBackground({ color: v })
                }
              )
            ] }),
            groups.background.kind === "media" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded border border-border bg-background p-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Library media" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Toggle,
                    {
                      label: "Cover",
                      active: groups.background.fit === "cover",
                      onClick: () => setBackground({ fit: "cover" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Toggle,
                    {
                      label: "Contain",
                      active: groups.background.fit === "contain",
                      onClick: () => setBackground({ fit: "contain" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Toggle,
                    {
                      label: "Stretch",
                      active: groups.background.fit === "stretch",
                      onClick: () => setBackground({ fit: "stretch" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setPickerOpen(true),
                    className: "inline-flex h-7 flex-1 cursor-pointer items-center justify-center gap-1 rounded border border-border bg-background px-2 text-[11px] hover:bg-accent",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-3 w-3" }),
                      bgName ?? (groups.background.mediaId ? "Library media set" : "Select from library")
                    ]
                  }
                ),
                groups.background.mediaId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setBackground({ mediaId: null });
                      setBgName(null);
                    },
                    title: "Clear background media",
                    className: "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-border bg-background text-muted-foreground hover:bg-accent",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: Math.round((groups.background.opacity ?? 1) * 100),
                    step: 1,
                    min: 0,
                    max: 100,
                    suffix: "%",
                    onChange: (v) => setBackground({ opacity: v / 100 })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Brightness", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: Math.round((groups.background.brightness ?? 1) * 100),
                    step: 1,
                    min: 0,
                    max: 200,
                    suffix: "%",
                    onChange: (v) => setBackground({ brightness: v / 100 })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: groups.background.blur ?? 0,
                    step: 1,
                    min: 0,
                    max: 60,
                    suffix: "px",
                    onChange: (v) => setBackground({ blur: v })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Zoom", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: Math.round((groups.background.zoom ?? 1) * 100),
                    step: 5,
                    min: 50,
                    max: 300,
                    suffix: "%",
                    onChange: (v) => setBackground({ zoom: v / 100 })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Position X", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: groups.background.positionX ?? 50,
                    step: 1,
                    min: 0,
                    max: 100,
                    suffix: "%",
                    onChange: (v) => setBackground({ positionX: v })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Position Y", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: groups.background.positionY ?? 50,
                    step: 1,
                    min: 0,
                    max: 100,
                    suffix: "%",
                    onChange: (v) => setBackground({ positionY: v })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Contrast", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: Math.round((groups.background.contrast ?? 1) * 100),
                    step: 1,
                    min: 0,
                    max: 200,
                    suffix: "%",
                    onChange: (v) => setBackground({ contrast: v / 100 })
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 border-t border-border/60 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Overlay Color", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ColorInput,
                  {
                    value: groups.background.overlayColor ?? "#000000",
                    onChange: (v) => setBackground({ overlayColor: v })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Overlay Opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: Math.round((groups.background.overlayOpacity ?? 0) * 100),
                    step: 1,
                    min: 0,
                    max: 100,
                    suffix: "%",
                    onChange: (v) => setBackground({ overlayOpacity: v / 100 })
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 border-t border-border/60 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SwitchRow,
                  {
                    label: "Loop video",
                    checked: groups.background.videoLoop ?? true,
                    onChange: (v) => setBackground({ videoLoop: v })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SwitchRow,
                  {
                    label: "Mute video",
                    checked: groups.background.videoMuted ?? true,
                    onChange: (v) => setBackground({ videoMuted: v })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1 text-[10px] text-muted-foreground", children: [
                  "Speed",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    NumberInput,
                    {
                      value: groups.background.videoSpeed ?? 1,
                      step: 0.25,
                      min: 0.25,
                      max: 4,
                      suffix: "x",
                      onChange: (v) => setBackground({ videoSpeed: v })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Pulls from your Media Library — images, videos, GIFs supported." })
            ] }),
            groups.background.kind === "none" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded border border-dashed border-border bg-background/40 p-2 text-[10px] text-muted-foreground", children: "No background. The projector stage will be transparent (black) behind text." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BackgroundGallerySection, { onPickFromLibrary: () => setPickerOpen(true) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogoSection, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MediaPickerDialog,
          {
            open: pickerOpen,
            onCancel: () => setPickerOpen(false),
            onAdd: async (ids) => {
              const id = ids[0];
              if (!id) return;
              const m = await getMedia(id);
              setBackground({ mediaId: id, kind: "media" });
              setBgName(m?.name ?? null);
              useBackgroundGallery.getState().addMedia(id, m?.name);
              setPickerOpen(false);
            }
          }
        )
      ]
    }
  );
}
function Group({
  icon: Icon,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background/40 p-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
      title
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children })
  ] });
}
function Row({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children })
  ] });
}
function NumberInput({
  value,
  onChange,
  step = 1,
  min,
  max,
  suffix
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-7 items-center rounded border border-border bg-background px-2 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "number",
        value,
        step,
        min,
        max,
        onChange: (e) => {
          const v = Number(e.target.value);
          if (!isNaN(v)) onChange(v);
        },
        className: "w-full bg-transparent outline-none"
      }
    ),
    suffix && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] opacity-60", children: suffix })
  ] });
}
function Select$1({
  value,
  onChange,
  options
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "select",
    {
      value,
      onChange: (e) => onChange(e.target.value),
      className: "h-7 w-full cursor-pointer rounded border border-border bg-background px-1.5 text-xs",
      children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
    }
  );
}
function ColorInput({ value, onChange }) {
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => setMounted(true), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-7 items-center gap-2 rounded border border-border bg-background px-1.5",
      suppressHydrationWarning: true,
      children: [
        mounted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "color",
            value,
            onChange: (e) => onChange(e.target.value),
            className: "h-5 w-6 cursor-pointer rounded border-none bg-transparent p-0",
            suppressHydrationWarning: true
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-5 w-6 rounded", style: { background: value } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value,
            onChange: (e) => onChange(e.target.value),
            className: "w-full bg-transparent text-xs outline-none"
          }
        )
      ]
    }
  );
}
function Toggle({
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: cn(
        "inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded border px-2 text-xs transition",
        active ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:bg-accent"
      ),
      children: label
    }
  );
}
function SwitchRow({
  label,
  checked,
  onChange,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "label",
    {
      className: cn(
        "flex items-center gap-2 text-[11px]",
        disabled ? "opacity-50" : "cursor-pointer"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked, onCheckedChange: onChange, disabled }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
      ]
    }
  );
}
function LayerSwitchesPanel() {
  const bg = useBackground();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-md border border-border bg-background/60 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wide", children: "Layers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto text-[10px] text-muted-foreground", children: "Themes never overwrite layers below" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-3 gap-y-2 @md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchRow,
        {
          label: "Background",
          checked: bg.backgroundEnabled,
          onChange: (v) => bg.set("backgroundEnabled", v)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchRow,
        {
          label: "Logo",
          checked: bg.logoEnabled,
          onChange: (v) => bg.set("logoEnabled", v)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchRow,
        {
          label: "Theme Background",
          checked: bg.themeBackgroundEnabled,
          disabled: bg.customBackgroundEnabled,
          onChange: (v) => bg.set("themeBackgroundEnabled", v)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchRow,
        {
          label: "Custom Background",
          checked: bg.customBackgroundEnabled,
          onChange: (v) => bg.set("customBackgroundEnabled", v)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchRow,
        {
          label: "Motion Effects",
          checked: bg.motionEnabled,
          onChange: (v) => bg.set("motionEnabled", v)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchRow,
        {
          label: "Particles",
          checked: bg.particlesEnabled,
          disabled: !bg.motionEnabled,
          onChange: (v) => bg.set("particlesEnabled", v)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchRow,
        {
          label: "Text Shadow",
          checked: bg.textShadowEnabled,
          onChange: (v) => bg.set("textShadowEnabled", v)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchRow,
        {
          label: "Text Stroke",
          checked: bg.textStrokeEnabled,
          onChange: (v) => bg.set("textStrokeEnabled", v)
        }
      )
    ] }),
    bg.customBackgroundEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] text-amber-700 dark:text-amber-300", children: "Custom Background is ON — applying a theme will NOT change your background." })
  ] });
}
function BackgroundGallerySection({ onPickFromLibrary }) {
  const items = useBackgroundGallery((s) => s.items);
  const remove = useBackgroundGallery((s) => s.remove);
  const addColor = useBackgroundGallery((s) => s.addColor);
  const setBackground = useTextFormat((s) => s.setBackground);
  const bgColor = useTextFormat((s) => s.groups.background.color);
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onPickFromLibrary,
          className: "inline-flex h-7 flex-1 cursor-pointer items-center justify-center gap-1 rounded border border-dashed border-border bg-background px-2 text-[11px] hover:bg-accent",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-3 w-3" }),
            " Add background from library"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => addColor(bgColor),
          className: "inline-flex h-7 cursor-pointer items-center justify-center gap-1 rounded border border-dashed border-border bg-background px-2 text-[11px] hover:bg-accent",
          children: "+ Color"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Saved backgrounds (",
        items.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onPickFromLibrary, className: "cursor-pointer text-primary hover:underline", children: "+ Add" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1.5 @md:grid-cols-6", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      BackgroundThumb,
      {
        item: it,
        onSelect: () => {
          if (it.kind === "color") setBackground({ kind: "color", color: it.color });
          else setBackground({ kind: "media", mediaId: it.mediaId });
        },
        onRemove: () => remove(it.id)
      },
      it.id
    )) })
  ] });
}
function BackgroundThumb({
  item,
  onSelect,
  onRemove
}) {
  const [url, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (item.kind !== "media" || !item.mediaId) return;
    let cancelled = false;
    let key = null;
    (async () => {
      const m = await getMedia(item.mediaId);
      if (!m) return;
      const rec = await db().blobs.get(m.thumbBlobId ?? m.blobId);
      if (!rec || cancelled) return;
      key = m.thumbBlobId ?? m.blobId;
      setUrl(acquireUrl(key, rec.blob));
    })();
    return () => {
      cancelled = true;
      if (key) releaseUrl(key);
    };
  }, [item]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative aspect-video overflow-hidden rounded border border-border bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onSelect,
        className: "absolute inset-0 cursor-pointer",
        title: item.name ?? item.color ?? "",
        children: item.kind === "color" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full", style: { background: item.color } }) : url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "h-full w-full object-cover", draggable: false }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-[9px] text-muted-foreground", children: "…" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onRemove,
        className: "absolute right-0.5 top-0.5 hidden h-4 w-4 cursor-pointer items-center justify-center rounded bg-black/60 text-white group-hover:flex",
        title: "Remove",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" })
      }
    )
  ] });
}
function LogoSection() {
  const enabled = useLogo((s) => s.enabled);
  const current = useLogo((s) => s.current);
  const gallery = useLogo((s) => s.gallery);
  const settings = useLogo((s) => s.settings);
  const setEnabled = useLogo((s) => s.setEnabled);
  const addFromFile = useLogo((s) => s.addFromFile);
  const selectFromGallery = useLogo((s) => s.selectFromGallery);
  const removeFromGallery = useLogo((s) => s.removeFromGallery);
  const patch = useLogo((s) => s.patch);
  const [open, setOpen] = reactExports.useState(true);
  const fileRef = reactExports.useRef(null);
  const POSITIONS = [
    { id: "top-left", label: "TL" },
    { id: "top-right", label: "TR" },
    { id: "bottom-left", label: "BL" },
    { id: "bottom-right", label: "BR" },
    { id: "custom", label: "Custom" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md border border-primary/30 bg-primary/5 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-3.5 w-3.5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-primary", children: "Projection Logo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "ml-auto inline-flex items-center gap-1.5 text-[10px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: enabled, onChange: (e) => setEnabled(e.target.checked) }),
        enabled ? "Enabled" : "Disabled"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setOpen((v) => !v),
          className: "inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-accent",
          children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    open && enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileRef,
            type: "file",
            accept: "image/*",
            hidden: true,
            onChange: (e) => {
              const f = e.target.files?.[0];
              if (f) void addFromFile(f);
              e.currentTarget.value = "";
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => fileRef.current?.click(),
            className: "inline-flex h-7 flex-1 cursor-pointer items-center justify-center gap-1 rounded border border-border bg-background px-2 text-[11px] hover:bg-accent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3 w-3" }),
              " Upload logo"
            ]
          }
        )
      ] }),
      gallery.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: [
          "Gallery (",
          gallery.length,
          "/5)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-1.5", children: gallery.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "group relative aspect-square overflow-hidden rounded border bg-background",
              current?.id === g.id ? "border-primary ring-1 ring-primary/40" : "border-border"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => selectFromGallery(g.id),
                  className: "absolute inset-0 cursor-pointer",
                  title: g.name,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: g.dataUrl,
                      alt: "",
                      className: "h-full w-full object-contain",
                      draggable: false
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => removeFromGallery(g.id),
                  className: "absolute right-0.5 top-0.5 hidden h-4 w-4 cursor-pointer items-center justify-center rounded bg-black/60 text-white group-hover:flex",
                  title: "Remove",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-2.5 w-2.5" })
                }
              )
            ]
          },
          g.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Width %", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            value: settings.widthPct,
            step: 1,
            min: 2,
            max: 80,
            suffix: "%",
            onChange: (v) => patch({ widthPct: v })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            value: Math.round(settings.opacity * 100),
            step: 1,
            min: 0,
            max: 100,
            suffix: "%",
            onChange: (v) => patch({ opacity: v / 100 })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Radius", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            value: settings.radius,
            step: 1,
            min: 0,
            max: 200,
            suffix: "px",
            onChange: (v) => patch({ radius: v })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Toggle,
          {
            label: settings.shadow ? "On" : "Off",
            active: settings.shadow,
            onClick: () => patch({ shadow: !settings.shadow })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Position", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: POSITIONS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Toggle,
        {
          label: p.label,
          active: settings.position === p.id,
          onClick: () => patch({ position: p.id })
        },
        p.id
      )) }) }),
      settings.position === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "X %", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            value: settings.xPct,
            step: 1,
            min: 0,
            max: 100,
            suffix: "%",
            onChange: (v) => patch({ xPct: v })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Y %", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            value: settings.yPct,
            step: 1,
            min: 0,
            max: 100,
            suffix: "%",
            onChange: (v) => patch({ yPct: v })
          }
        ) })
      ] })
    ] }),
    open && !enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded border border-dashed border-border bg-background/40 p-2 text-[10px] text-muted-foreground", children: "Logo is disabled. Toggle Enabled above to configure and project it." })
  ] });
}
const Select = Select$2;
const SelectValue = SelectValue$1;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectTrigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectTrigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollUpButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollDownButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectContent$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectViewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectContent$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectLabel$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectLabel$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectItem$1,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectItem$1.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectSeparator$1,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function verseTextAt(lang, c) {
  return getBible(lang)?.[c.book]?.[c.chapter - 1]?.[c.verse - 1] ?? null;
}
function projectVerseAt(c) {
  const meta = BIBLE_BOOKS[c.book];
  if (!meta) return false;
  const { displayMode, lang } = useBibleStore.getState();
  const primary = displayMode === "ta" ? "ta" : "en";
  const enTxt = verseTextAt("en", c) ?? "";
  const taTxt = verseTextAt("ta", c) ?? "";
  const primaryText = primary === "ta" ? taTxt : enTxt;
  if (!primaryText) return false;
  const refEn = `${meta.name} ${c.chapter}:${c.verse}`;
  const refTa = `${meta.nameTa} ${c.chapter}:${c.verse}`;
  const primaryLabel = displayMode === "ta" || displayMode === "both" && lang === "ta" ? "தமிழ்" : "KJV";
  const refPrimary = primary === "ta" ? refTa : refEn;
  const refSecondary = displayMode === "both" ? primary === "ta" ? refEn : refTa : null;
  const pairText = displayMode === "both" ? primary === "ta" ? enTxt : taTxt : void 0;
  const reference = refSecondary ? `${refPrimary} | ${refSecondary}` : refPrimary;
  projectVerse({
    reference,
    text: primaryText,
    translation: primaryLabel,
    subtext: pairText,
    subtranslation: pairText ? primaryLabel === "KJV" ? "தமிழ்" : "KJV" : void 0,
    referenceEn: refEn,
    referenceTa: refTa,
    textEn: enTxt,
    textTa: taTxt,
    mode: displayMode === "both" ? "both" : primary,
    book: c.book,
    chapter: c.chapter,
    verse: c.verse
  });
  return true;
}
const MAX$1 = 30;
const useBibleRecent = create()(
  persist(
    (set) => ({
      items: [],
      push: (v) => set((s) => {
        const key = `${v.book}:${v.chapter}:${v.verse}`;
        const filtered = s.items.filter((x) => `${x.book}:${x.chapter}:${x.verse}` !== key);
        return { items: [{ ...v, at: Date.now() }, ...filtered].slice(0, MAX$1) };
      }),
      clear: () => set({ items: [] })
    }),
    { name: "vision-bible-recent", storage: createJSONStorage(() => localStorage), version: 1 }
  )
);
function favKey(book, chapter, verse) {
  return `${book}:${chapter}:${verse}`;
}
function BiblePanel() {
  const {
    lang,
    displayMode,
    query,
    loading,
    loaded,
    error,
    favorites,
    setLang,
    setDisplayMode,
    setQuery,
    ensureLoaded,
    ensureBoth,
    addFavorite,
    removeFavorite
  } = useBibleStore();
  const inputRef = reactExports.useRef(null);
  const [results, setResults] = reactExports.useState([]);
  const [activeIdx, setActiveIdx] = reactExports.useState(0);
  const [searchMs, setSearchMs] = reactExports.useState(null);
  const [chapterCtx, setChapterCtx] = reactExports.useState(null);
  const [searchMode, setSearchMode] = reactExports.useState("reference");
  const projectedRef = useProjection((s) => s.state?.textOverlay?.reference ?? null);
  const selectedKeyRef = reactExports.useRef(null);
  const lastQueryRef = reactExports.useRef("");
  const recent = useBibleRecent((s) => s.items);
  const pushRecent = useBibleRecent((s) => s.push);
  reactExports.useEffect(() => {
    if (displayMode === "both") void ensureBoth();
    else void ensureLoaded(displayMode);
  }, [displayMode, ensureBoth, ensureLoaded]);
  reactExports.useEffect(() => {
    const q = query.trim();
    if (!q) return;
    if (searchMode === "verse") return;
    const ref = parseReference(q);
    if (ref && ref.chapter != null) setSearchMode("reference");
  }, [query, searchMode]);
  reactExports.useEffect(() => {
    const primary = displayMode === "ta" ? "ta" : "en";
    const other = displayMode === "both" ? primary === "en" ? "ta" : "en" : null;
    if (!loaded[primary] || other && !loaded[other]) return;
    const dataPrimary = getBible(primary);
    const dataOther = other ? getBible(other) : null;
    if (!dataPrimary) return;
    const buildPair = (h) => {
      if (!dataOther || !other) return void 0;
      const t = dataOther[h.book]?.[h.chapter - 1]?.[h.verse - 1];
      if (!t) return void 0;
      const meta = BIBLE_BOOKS[h.book];
      return {
        book: h.book,
        bookName: meta.name,
        bookNameLocal: other === "ta" ? meta.nameTa : meta.name,
        chapter: h.chapter,
        verse: h.verse,
        text: t,
        score: 0
      };
    };
    const q = query.trim();
    const queryChanged = q !== lastQueryRef.current;
    lastQueryRef.current = q;
    if (!q) {
      const out = [];
      const seen = /* @__PURE__ */ new Set();
      for (const r of recent) {
        const t = dataPrimary[r.book]?.[r.chapter - 1]?.[r.verse - 1];
        if (!t) continue;
        const meta = BIBLE_BOOKS[r.book];
        const hit = {
          book: r.book,
          bookName: meta.name,
          bookNameLocal: primary === "ta" ? meta.nameTa : meta.name,
          chapter: r.chapter,
          verse: r.verse,
          text: t,
          score: 0
        };
        out.push({ hit, pair: buildPair(hit) });
        seen.add(favKey(r.book, r.chapter, r.verse));
      }
      if (out.length === 0) {
        const fHits = [
          { b: 42, c: 3, v: 16 },
          { b: 18, c: 23, v: 1 },
          { b: 0, c: 1, v: 1 }
        ];
        for (const f of fHits) {
          const t = dataPrimary[f.b]?.[f.c - 1]?.[f.v - 1];
          if (!t) continue;
          const meta = BIBLE_BOOKS[f.b];
          const hit = {
            book: f.b,
            bookName: meta.name,
            bookNameLocal: primary === "ta" ? meta.nameTa : meta.name,
            chapter: f.c,
            verse: f.v,
            text: t,
            score: 0
          };
          out.push({ hit, pair: buildPair(hit) });
        }
      }
      setResults(out);
      setSearchMs(null);
      setChapterCtx(null);
      if (queryChanged) {
        setActiveIdx(0);
        selectedKeyRef.current = null;
      }
      return;
    }
    const start = performance.now();
    let primaryHits;
    if (searchMode === "reference") {
      const ref = parseReference(q);
      if (ref && ref.chapter != null && ref.verse == null) {
        primaryHits = getChapterVerses(ref.book.index, ref.chapter, dataPrimary, primary);
        setChapterCtx({ book: ref.book.index, chapter: ref.chapter });
      } else if (ref) {
        primaryHits = search(q, dataPrimary, primary, 200);
        setChapterCtx(ref.chapter != null ? { book: ref.book.index, chapter: ref.chapter } : null);
      } else {
        primaryHits = search(q, dataPrimary, primary, 80);
        setChapterCtx(null);
      }
    } else {
      primaryHits = search(q, dataPrimary, primary, 200);
      setChapterCtx(null);
    }
    const list = primaryHits.map((h) => ({ hit: h, pair: buildPair(h) }));
    setSearchMs(performance.now() - start);
    setResults(list);
    if (queryChanged) {
      setActiveIdx(0);
      selectedKeyRef.current = list[0] ? favKey(list[0].hit.book, list[0].hit.chapter, list[0].hit.verse) : null;
    } else if (selectedKeyRef.current) {
      const idx = list.findIndex(
        (d) => favKey(d.hit.book, d.hit.chapter, d.hit.verse) === selectedKeyRef.current
      );
      if (idx >= 0) setActiveIdx(idx);
    }
  }, [query, loaded, displayMode, lang, searchMode, recent]);
  const project = (dh) => {
    const h = dh.hit;
    const pair = dh.pair;
    const primaryLabel = displayMode === "ta" || displayMode === "both" && lang === "ta" ? "தமிழ்" : "KJV";
    const metaPrimary = BIBLE_BOOKS[h.book];
    const refPrimary = `${h.bookNameLocal} ${h.chapter}:${h.verse}`;
    const refSecondary = pair ? `${pair.bookNameLocal} ${pair.chapter}:${pair.verse}` : null;
    const reference = displayMode === "both" && refSecondary ? `${refPrimary} / ${refSecondary}` : refPrimary;
    const refEn = `${metaPrimary.name} ${h.chapter}:${h.verse}`;
    const refTa = `${metaPrimary.nameTa} ${h.chapter}:${h.verse}`;
    const primary = displayMode === "ta" ? "ta" : "en";
    const enTxt = primary === "en" ? h.text : pair?.text ?? "";
    const taTxt = primary === "ta" ? h.text : pair?.text ?? "";
    projectVerse({
      reference,
      text: h.text,
      translation: primaryLabel,
      subtext: pair?.text,
      subtranslation: pair ? primaryLabel === "KJV" ? "தமிழ்" : "KJV" : void 0,
      referenceEn: refEn,
      referenceTa: refTa,
      textEn: enTxt,
      textTa: taTxt,
      mode: displayMode === "both" ? "both" : primary === "ta" ? "ta" : "en",
      book: h.book,
      chapter: h.chapter,
      verse: h.verse
    });
    selectedKeyRef.current = favKey(h.book, h.chapter, h.verse);
    pushRecent({
      book: h.book,
      chapter: h.chapter,
      verse: h.verse,
      ref: `${metaPrimary.name} ${h.chapter}:${h.verse}`,
      text: h.text
    });
    toast.success(`Projecting ${metaPrimary.name} ${h.chapter}:${h.verse}`);
  };
  const projectAt = (i) => {
    const dh = results[i];
    if (dh) project(dh);
  };
  const selectIdx = (i) => {
    setActiveIdx(i);
    const dh = results[i];
    if (dh) selectedKeyRef.current = favKey(dh.hit.book, dh.hit.chapter, dh.hit.verse);
  };
  const navigateChapter = (delta) => {
    const ctx = chapterCtx;
    if (!ctx) return;
    const meta = BIBLE_BOOKS[ctx.book];
    if (!meta) return;
    const next = Math.max(1, Math.min(meta.chapters, ctx.chapter + delta));
    if (next === ctx.chapter) return;
    setQuery(`${meta.name} ${next}`);
  };
  const navigateVerse = (delta) => {
    const projected = useProjection.getState().state?.textOverlay;
    if (projected?.kind === "bible_verse") {
      const cur = results[activeIdx]?.hit;
      let book = cur?.book, chapter = cur?.chapter, verse = cur?.verse;
      if (book == null || chapter == null || verse == null) {
        if (chapterCtx) {
          book = chapterCtx.book;
          chapter = chapterCtx.chapter;
          verse = 1;
        }
      }
      if (book != null && chapter != null && verse != null) {
        const meta = BIBLE_BOOKS[book];
        const chData = getBible(displayMode === "ta" ? "ta" : "en")?.[book]?.[chapter - 1];
        if (meta && chData) {
          let nv = verse + delta;
          let nc = chapter;
          if (nv < 1) {
            nc = Math.max(1, chapter - 1);
            const prevCh = getBible(displayMode === "ta" ? "ta" : "en")?.[book]?.[nc - 1];
            nv = prevCh?.length ?? 1;
          } else if (nv > chData.length) {
            nc = Math.min(meta.chapters, chapter + 1);
            nv = 1;
          }
          if (projectVerseAt({ book, chapter: nc, verse: nv })) {
            const idx = results.findIndex(
              (r) => r.hit.book === book && r.hit.chapter === nc && r.hit.verse === nv
            );
            if (idx >= 0) selectIdx(idx);
          }
          return;
        }
      }
    }
    navigateChapter(delta);
  };
  useShortcut({
    id: "bible.focus-search",
    label: "Focus Bible search",
    category: "bible",
    keys: ["/"],
    scope: "bible",
    handler: () => {
      inputRef.current?.focus();
    }
  });
  useShortcut({
    id: "bible.next-verse",
    label: "Next verse in list",
    category: "bible",
    keys: ["ArrowDown"],
    scope: "bible",
    allowInInput: true,
    priority: 20,
    handler: () => selectIdx(Math.min(activeIdx + 1, Math.max(0, results.length - 1)))
  });
  useShortcut({
    id: "bible.prev-verse",
    label: "Previous verse in list",
    category: "bible",
    keys: ["ArrowUp"],
    scope: "bible",
    allowInInput: true,
    priority: 20,
    handler: () => selectIdx(Math.max(0, activeIdx - 1))
  });
  useShortcut({
    id: "bible.next",
    label: "Next (chapter)",
    category: "bible",
    keys: ["ArrowRight"],
    scope: "bible",
    allowInInput: true,
    priority: 20,
    handler: () => navigateVerse(1)
  });
  useShortcut({
    id: "bible.prev",
    label: "Previous (chapter)",
    category: "bible",
    keys: ["ArrowLeft"],
    scope: "bible",
    allowInInput: true,
    priority: 20,
    handler: () => navigateVerse(-1)
  });
  useShortcut({
    id: "bible.project-selected",
    label: "Project selected verse",
    category: "bible",
    keys: ["Enter"],
    scope: "bible",
    allowInInput: true,
    priority: 20,
    handler: () => {
      if (results.length > 0) projectAt(activeIdx);
    }
  });
  useShortcut({
    id: "bible.reproject",
    label: "Re-project current verse",
    category: "bible",
    keys: ["Space"],
    scope: "bible",
    allowInInput: false,
    priority: 20,
    handler: () => projectAt(activeIdx)
  });
  useShortcut({
    id: "bible.lang.tamil",
    label: "Switch to Tamil",
    category: "bible",
    keys: ["Alt+T"],
    scope: "bible",
    allowInInput: true,
    priority: 15,
    handler: () => {
      void setDisplayMode("ta");
      void setLang("ta");
    }
  });
  useShortcut({
    id: "bible.lang.english",
    label: "Switch to English",
    category: "bible",
    keys: ["Alt+E"],
    scope: "bible",
    allowInInput: true,
    priority: 15,
    handler: () => {
      void setDisplayMode("en");
      void setLang("en");
    }
  });
  useShortcut({
    id: "bible.lang.bilingual",
    label: "Switch to Bilingual",
    category: "bible",
    keys: ["Alt+B"],
    scope: "bible",
    allowInInput: true,
    priority: 15,
    handler: () => {
      void setDisplayMode("both");
    }
  });
  useShortcut({
    id: "bible.mode.reference",
    label: "Reference search mode",
    category: "bible",
    keys: ["Alt+R"],
    scope: "bible",
    allowInInput: true,
    priority: 15,
    handler: () => {
      setSearchMode("reference");
      inputRef.current?.focus();
    }
  });
  useShortcut({
    id: "bible.mode.verse",
    label: "Verse content search mode",
    category: "bible",
    keys: ["Alt+F"],
    scope: "bible",
    allowInInput: true,
    priority: 15,
    handler: () => {
      setSearchMode("verse");
      inputRef.current?.focus();
    }
  });
  const fav = reactExports.useMemo(
    () => new Set(favorites.map((f) => favKey(f.book, f.chapter, f.verse))),
    [favorites]
  );
  const primaryLang = displayMode === "ta" ? "ta" : "en";
  const showingRecent = !query.trim() && recent.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "@container flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 border-b border-border bg-muted/20 px-2 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 shrink-0 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: searchMode, onValueChange: (v) => setSearchMode(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[130px] shrink-0 text-[11px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "reference", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "mr-2 inline h-3 w-3" }),
            " Reference"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "verse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mr-2 inline h-3 w-3" }),
            " Verse Text"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          ref: inputRef,
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: searchMode === "reference" ? "John 3:16, யோவான் 3, PSA 23" : "yesu, anbu, grace, vaazhvu, ஆதியிலே",
          className: "h-8 min-w-[160px] flex-1 text-sm",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex overflow-hidden rounded-md border border-border bg-background text-[11px]", children: ["en", "ta", "both"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            void setDisplayMode(m);
            if (m !== "both") void setLang(m);
          },
          className: cn(
            "cursor-pointer px-2 py-1 transition",
            displayMode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
          ),
          title: m === "en" ? "English (Alt+E)" : m === "ta" ? "Tamil (Alt+T)" : "Bilingual (Alt+B)",
          children: m === "en" ? "EN" : m === "ta" ? "தமிழ்" : "EN+தமிழ்"
        },
        m
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-2.5 py-1 text-[10px] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        loading ? "Loading bible…" : showingRecent ? `Recent verses · ${results.length}` : `${results.length} result${results.length === 1 ? "" : "s"}${searchMs != null ? ` · ${searchMs.toFixed(1)}ms` : ""}`,
        chapterCtx && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 opacity-70", children: "· Chapter · ← prev · → next" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "h-3 w-3" }),
        displayMode === "both" ? "Bilingual" : primaryLang === "en" ? "KJV" : "தமிழ்"
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-2 py-1 text-[11px] text-destructive", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto p-2", children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full items-center justify-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        "Loading bible…"
      ] }),
      !loading && !results.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-6 text-center text-xs text-muted-foreground", children: "No matches. Try a book name, abbreviation, Tamil, or any phrase." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2.5 @md:grid-cols-2 @3xl:grid-cols-3", children: results.map((dh, i) => {
        const h = dh.hit;
        const pair = dh.pair;
        const stableKey = favKey(h.book, h.chapter, h.verse);
        const isFav = fav.has(stableKey);
        const refPrimary = `${h.bookNameLocal} ${h.chapter}:${h.verse}`;
        const refSecondary = pair ? `${pair.bookNameLocal} ${pair.chapter}:${pair.verse}` : null;
        const isProjected = (projectedRef ?? "").includes(refPrimary);
        const isActive = activeIdx === i;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => {
              selectIdx(i);
              project(dh);
            },
            className: cn(
              "group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 bg-card/80 backdrop-blur-sm transition-all",
              "hover:-translate-y-px hover:border-primary/70 hover:bg-card hover:shadow-lg hover:shadow-primary/10",
              isProjected ? "border-primary ring-2 ring-primary/40 shadow-lg shadow-primary/25" : isActive ? "border-primary/70 ring-1 ring-primary/20" : "border-border"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-2 py-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[11px] font-bold tracking-tight text-primary", children: refSecondary ? `${refPrimary} / ${refSecondary}` : refPrimary }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex shrink-0 items-center gap-1", children: [
                  isFav && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-amber-500 text-amber-500" }),
                  isProjected && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-primary px-1 py-px text-[9px] font-bold uppercase text-primary-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 animate-pulse rounded-full bg-primary-foreground" }),
                    "Live"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5 px-2.5 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12.5px] leading-snug text-foreground/95 break-words whitespace-pre-wrap", children: h.text }),
                pair && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-dashed border-border/50 pt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] leading-snug text-muted-foreground break-words whitespace-pre-wrap", children: pair.text }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex items-center gap-0.5 border-t border-border/40 bg-muted/20 px-1.5 py-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      if (isFav) removeFavorite(stableKey);
                      else
                        addFavorite({
                          lang: primaryLang,
                          book: h.book,
                          chapter: h.chapter,
                          verse: h.verse,
                          ref: `${h.bookName} ${h.chapter}:${h.verse}`,
                          text: h.text
                        });
                    },
                    className: cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded transition",
                      isFav ? "text-amber-500 hover:bg-amber-500/10" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    ),
                    title: isFav ? "Remove favorite" : "Add favorite",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-3.5 w-3.5", isFav && "fill-current") })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      selectIdx(i);
                      project(dh);
                    },
                    className: "ml-auto inline-flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground transition hover:opacity-90",
                    title: "Project verse (Enter)",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3" }),
                      " Project"
                    ]
                  }
                )
              ] })
            ]
          },
          stableKey + ":" + i
        );
      }) }),
      !query.trim() && favorites.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-border pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1 pb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Favorites" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 @md:grid-cols-2 @3xl:grid-cols-3", children: favorites.slice(0, 30).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => projectVerseAt({ book: f.book, chapter: f.chapter, verse: f.verse }),
            className: "flex cursor-pointer flex-col gap-1 rounded-md border border-border bg-card px-2.5 py-2 text-left hover:border-primary/40 hover:bg-accent/40",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold text-primary", children: f.ref }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground break-words whitespace-pre-wrap", children: f.text })
            ]
          },
          f.id
        )) })
      ] })
    ] })
  ] });
}
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
const MAX = 30;
const useSongsRecent = create()(
  persist(
    (set) => ({
      items: [],
      counts: {},
      push: (v) => set((s) => {
        const key = `${v.songId}:${v.slideIndex}`;
        const filtered = s.items.filter((x) => `${x.songId}:${x.slideIndex}` !== key);
        return {
          items: [{ ...v, at: Date.now() }, ...filtered].slice(0, MAX),
          counts: { ...s.counts, [v.songId]: (s.counts[v.songId] ?? 0) + 1 }
        };
      }),
      clear: () => set({ items: [], counts: {} })
    }),
    { name: "vision-songs-recent", storage: createJSONStorage(() => localStorage), version: 2 }
  )
);
function searchSongs(query, songs, limit = 80) {
  const q = query.trim();
  if (!q) return [];
  const hits = runSearch(q, songs, limit);
  if (hits.length > 0) return hits;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const variants = /* @__PURE__ */ new Set();
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.length < 3) continue;
    for (let j = 0; j < t.length; j++) {
      const trimmed = t.slice(0, j) + t.slice(j + 1);
      const v = [...tokens.slice(0, i), trimmed, ...tokens.slice(i + 1)].join(" ");
      variants.add(v);
    }
  }
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const v of variants) {
    const h = runSearch(v, songs, limit);
    for (const x of h) {
      if (seen.has(x.song.id)) continue;
      seen.add(x.song.id);
      out.push({ ...x, score: x.score - 50 });
      if (out.length >= limit) break;
    }
    if (out.length >= limit) break;
  }
  return out;
}
function runSearch(query, songs, limit) {
  const q = query.trim();
  if (!q) return [];
  const qLower = songLower(q);
  const qStem = songStem(q);
  const rawTokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  const tokens = rawTokens.map((t) => ({
    raw: t,
    lower: songLower(t),
    stem: songStem(t)
  })).filter((t) => t.stem.length >= 1 || t.lower.length >= 2);
  if (!tokens.length) return [];
  const hits = [];
  for (let i = 0; i < songs.length; i++) {
    const s = songs[i];
    let titleHits = 0;
    let titleStemHits = 0;
    let contentHits = 0;
    let contentStemHits = 0;
    const matched = [];
    let allMatched = true;
    for (const tok of tokens) {
      let found = false;
      if (tok.lower && s.titleLower.includes(tok.lower)) {
        titleHits++;
        matched.push(tok.raw);
        found = true;
      } else if (tok.stem.length >= 2 && s.titleStem.includes(tok.stem)) {
        titleStemHits++;
        matched.push(tok.raw);
        found = true;
      } else if (tok.lower && s.contentLower.includes(tok.lower)) {
        contentHits++;
        matched.push(tok.raw);
        found = true;
      } else if (tok.stem.length >= 2 && s.contentStem.includes(tok.stem)) {
        contentStemHits++;
        matched.push(tok.raw);
        found = true;
      }
      if (!found) {
        allMatched = false;
        break;
      }
    }
    if (!allMatched) continue;
    let score = titleHits * 220 + titleStemHits * 140 + contentHits * 30 + contentStemHits * 18;
    if (qLower && s.titleLower.includes(qLower)) score += 320;
    if (qStem && s.titleStem.includes(qStem)) score += 80;
    if (qLower && s.contentLower.includes(qLower)) score += 90;
    score -= Math.min(40, Math.floor(s.content.length / 400));
    let bestSlide = 0, bestScore = -1;
    for (let j = 0; j < s.slides.length; j++) {
      const sl = s.slides[j].toLowerCase();
      const st = s.slideStems[j] ?? "";
      let sc = 0;
      for (const tok of tokens) {
        if (tok.lower && sl.includes(tok.lower)) sc += 6;
        else if (tok.stem.length >= 2 && st.includes(tok.stem)) sc += 4;
      }
      if (qLower && sl.includes(qLower)) sc += 12;
      if (sc > bestScore) {
        bestScore = sc;
        bestSlide = j;
      }
    }
    hits.push({ song: s, score, slideIndex: bestSlide, matched });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
function SongEditorDialog({ open, onOpenChange, editingId }) {
  const userSongs = useSongsStore((s) => s.userSongs);
  const addUserSong = useSongsStore((s) => s.addUserSong);
  const upsertUserSong = useSongsStore((s) => s.upsertUserSong);
  const selectSong = useSongsStore((s) => s.selectSong);
  const editing = reactExports.useMemo(() => {
    if (!editingId) return null;
    const u = userSongs.find((x) => x.id === editingId);
    if (u) return { ...u, isUser: true };
    const lib = getSongs()?.find((s) => s.id === editingId);
    if (lib)
      return {
        id: lib.id,
        title: lib.title,
        content: lib.content,
        artist: lib.artist,
        album: lib.album,
        scale: lib.scale,
        isUser: false
      };
    return null;
  }, [editingId, userSongs, open]);
  const [title, setTitle] = reactExports.useState("");
  const [lyrics, setLyrics] = reactExports.useState("");
  const [artist, setArtist] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!open) return;
    setTitle(editing?.title ?? "");
    setLyrics(editing?.content ?? "");
    setArtist(editing?.artist ?? "");
  }, [open, editing]);
  const slides = reactExports.useMemo(() => buildSlides(lyrics), [lyrics]);
  const save = () => {
    const t = title.trim();
    const c = lyrics.trim();
    if (!t) {
      toast.error("Title is required");
      return;
    }
    if (!c) {
      toast.error("Lyrics are required");
      return;
    }
    if (editing) {
      upsertUserSong({
        id: editing.id,
        title: t,
        content: c,
        artist: artist.trim(),
        album: editing.album,
        scale: editing.scale
      });
      toast.success(editing.isUser ? "Song updated" : "Library song overridden");
    } else {
      const id = addUserSong({ title: t, content: c, artist: artist.trim() });
      selectSong(id);
      toast.success("Song created");
    }
    onOpenChange(false);
  };
  const swallowKeys = (e) => {
    if (e.key === "Escape") return;
    e.stopPropagation();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl", onKeyDown: swallowKeys, onKeyDownCapture: swallowKeys, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Song" : "New Song" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-muted-foreground", children: "Title (தமிழ்)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: title,
              onChange: (e) => setTitle(e.target.value),
              placeholder: "பாடல் தலைப்பு",
              autoFocus: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-muted-foreground", children: "Artist (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: artist,
              onChange: (e) => setArtist(e.target.value),
              placeholder: "இசையமைப்பாளர் / பாடகர்"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-muted-foreground", children: "Lyrics — one blank line = new slide" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: lyrics,
              onChange: (e) => setLyrics(e.target.value),
              rows: 16,
              placeholder: "இயேசு என் இரட்சகர்\nஇயேசு என் ஆண்டவர்\n\n(chorus)\nஅல்லேலூயா அல்லேலூயா",
              className: "font-mono text-sm"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground", children: [
          "Slide preview · ",
          slides.length,
          " slide",
          slides.length === 1 ? "" : "s"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[420px] space-y-2 overflow-y-auto rounded-md border border-border bg-muted/20 p-2", children: [
          slides.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center text-xs text-muted-foreground", children: "Paste lyrics to generate slides." }),
          slides.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-card p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: [
              "Slide ",
              i + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap font-sans text-[13px] leading-snug", children: s })
          ] }, i))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, children: editing ? "Save changes" : "Create song" })
    ] })
  ] }) });
}
function firstLineOf(song) {
  const src = song.slides[0] ?? song.content ?? "";
  for (const line of src.split("\n")) {
    const t = line.trim();
    if (t) return t;
  }
  return song.title;
}
function matchedLineOf(song, query) {
  const q = query.trim();
  if (!q) return null;
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  const qStem = songStem(q);
  const lines = (song.content ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const titleLine = song.title.trim();
  for (const line of lines) {
    if (line === titleLine) continue;
    const lower = line.toLowerCase();
    if (tokens.some((t) => t && lower.includes(t))) return line;
  }
  if (qStem.length >= 2) {
    for (const line of lines) {
      if (line === titleLine) continue;
      if (songStem(line).includes(qStem)) return line;
    }
  }
  return null;
}
const FILTER_LABELS$1 = {
  all: "All Songs",
  favorites: "Favorites",
  recent: "Recently Used",
  added: "Recently Added",
  most: "Most Used",
  mine: "My Songs",
  author: "Author"
};
function SongsPanel() {
  const {
    query,
    loading,
    loaded,
    error,
    favorites,
    selectedSongId,
    userSongs,
    setQuery,
    ensureLoaded,
    addFavorite,
    removeFavorite,
    selectSong,
    removeUserSong
  } = useSongsStore();
  const inputRef = reactExports.useRef(null);
  const [results, setResults] = reactExports.useState([]);
  const [activeIdx, setActiveIdx] = reactExports.useState(0);
  const [searchMs, setSearchMs] = reactExports.useState(null);
  const [activeSlideById, setActiveSlideById] = reactExports.useState({});
  const [editorOpen, setEditorOpen] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("all");
  const [authorFilter, setAuthorFilter] = reactExports.useState(null);
  const projectedRef = useProjection((s) => s.state?.textOverlay?.text ?? null);
  const recent = useSongsRecent((s) => s.items);
  const counts = useSongsRecent((s) => s.counts);
  const pushRecent = useSongsRecent((s) => s.push);
  reactExports.useEffect(() => {
    void ensureLoaded();
  }, [ensureLoaded]);
  const authors = reactExports.useMemo(() => {
    if (!loaded) return [];
    const songs = getSongs();
    if (!songs) return [];
    const set = /* @__PURE__ */ new Set();
    for (const s of songs) {
      const a = (s.artist || "").trim();
      if (a) set.add(a);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [loaded, userSongs]);
  reactExports.useEffect(() => {
    if (!loaded) return;
    const songs = getSongs();
    if (!songs) return;
    const q = query.trim();
    const favIds = new Set(favorites.map((f) => f.id));
    const userIds = new Set(userSongs.map((u) => u.id));
    const recentIds = new Set(recent.map((r) => r.songId));
    const applyFilter = (s) => {
      if (filter === "favorites") return favIds.has(s.id);
      if (filter === "mine") return userIds.has(s.id);
      if (filter === "recent") return recentIds.has(s.id);
      if (filter === "added") return userIds.has(s.id);
      if (filter === "most") return (counts[s.id] ?? 0) > 0;
      if (filter === "author") return !!authorFilter && (s.artist || "").trim() === authorFilter;
      return true;
    };
    if (!q) {
      const out = [];
      const seen = /* @__PURE__ */ new Set();
      const push = (s, slideIndex = 0) => {
        if (seen.has(s.id) || !applyFilter(s)) return;
        out.push({ song: s, score: 0, slideIndex, matched: [] });
        seen.add(s.id);
      };
      if (filter === "all" || filter === "mine" || filter === "added") {
        const list = filter === "added" ? [...userSongs].sort((a, b) => b.id - a.id) : userSongs;
        for (const u of list) {
          const s = songs.find((x) => x.id === u.id);
          if (s) push(s);
        }
      }
      if (filter === "all" || filter === "recent") {
        for (const r of recent) {
          const s = songs.find((x) => x.id === r.songId);
          if (s) push(s, r.slideIndex);
        }
      }
      if (filter === "most") {
        const ranked = Object.entries(counts).map(([id, n]) => ({ id: Number(id), n })).sort((a, b) => b.n - a.n);
        for (const r of ranked) {
          const s = songs.find((x) => x.id === r.id);
          if (s) push(s);
        }
      }
      if (filter === "favorites") {
        for (const f of favorites) {
          const s = songs.find((x) => x.id === f.id);
          if (s) push(s);
        }
      }
      if (filter === "author" && authorFilter) {
        for (const s of songs) push(s);
      }
      const limit = filter === "all" ? 80 : 500;
      if (filter === "all") {
        for (let i = 0; i < songs.length && out.length < limit; i++) push(songs[i]);
      }
      setResults(out);
      setSearchMs(null);
      setActiveIdx(0);
      return;
    }
    const t0 = performance.now();
    const hits = searchSongs(q, songs, 200).filter((h) => applyFilter(h.song)).slice(0, 120);
    setSearchMs(performance.now() - t0);
    setResults(hits);
    setActiveIdx(0);
  }, [query, loaded, recent, userSongs, favorites, filter, authorFilter, counts]);
  const selectedSong = reactExports.useMemo(() => {
    if (!selectedSongId) return null;
    const songs = getSongs();
    return songs?.find((s) => s.id === selectedSongId) ?? null;
  }, [selectedSongId, userSongs, loaded]);
  const project = (song, slideIndex) => {
    const text = song.slides[slideIndex] ?? song.content;
    projectSongSlide({
      songId: song.id,
      slideIndex,
      totalSlides: song.slides.length || 1,
      title: song.title,
      text
    });
    setActiveSlideById((m) => ({ ...m, [song.id]: slideIndex }));
    pushRecent({ songId: song.id, slideIndex, title: song.title, preview: text.slice(0, 80) });
    toast.success(`${song.title} · slide ${slideIndex + 1}`);
  };
  const openSong = (song) => {
    selectSong(song.id);
    setActiveSlideById((m) => ({ ...m, [song.id]: m[song.id] ?? 0 }));
  };
  const guarded = (fn) => ((...a) => {
    if (editorOpen) return false;
    return fn(...a);
  });
  useShortcut({
    id: "songs.focus-search",
    label: "Focus song search",
    category: "songs",
    keys: ["/"],
    scope: "songs",
    handler: guarded(() => inputRef.current?.focus())
  });
  useShortcut({
    id: "songs.next",
    label: "Next song",
    category: "songs",
    keys: ["ArrowDown"],
    scope: "songs",
    allowInInput: true,
    priority: 20,
    handler: guarded(() => setActiveIdx((i) => Math.min(i + 1, Math.max(0, results.length - 1))))
  });
  useShortcut({
    id: "songs.prev",
    label: "Previous song",
    category: "songs",
    keys: ["ArrowUp"],
    scope: "songs",
    allowInInput: true,
    priority: 20,
    handler: guarded(() => setActiveIdx((i) => Math.max(0, i - 1)))
  });
  useShortcut({
    id: "songs.open",
    label: "Open selected song",
    category: "songs",
    keys: ["Enter"],
    scope: "songs",
    allowInInput: true,
    priority: 20,
    handler: guarded(() => {
      const h = results[activeIdx];
      if (!h) return;
      if (selectedSongId === h.song.id) project(h.song, activeSlideById[h.song.id] ?? 0);
      else openSong(h.song);
    })
  });
  useShortcut({
    id: "songs.next-slide",
    label: "Next slide",
    category: "songs",
    keys: ["ArrowRight"],
    scope: "songs",
    allowInInput: true,
    priority: 20,
    handler: guarded(() => {
      if (!selectedSong) return;
      const cur = activeSlideById[selectedSong.id] ?? 0;
      const next = Math.min(cur + 1, selectedSong.slides.length - 1);
      if (next !== cur) project(selectedSong, next);
    })
  });
  useShortcut({
    id: "songs.prev-slide",
    label: "Previous slide",
    category: "songs",
    keys: ["ArrowLeft"],
    scope: "songs",
    allowInInput: true,
    priority: 20,
    handler: guarded(() => {
      if (!selectedSong) return;
      const cur = activeSlideById[selectedSong.id] ?? 0;
      const prev = Math.max(0, cur - 1);
      if (prev !== cur) project(selectedSong, prev);
    })
  });
  useShortcut({
    id: "songs.close",
    label: "Close song",
    category: "songs",
    keys: ["Escape"],
    scope: "songs",
    allowInInput: true,
    handler: guarded(() => selectSong(null))
  });
  const favSet = reactExports.useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "@container flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 border-b border-border bg-muted/20 px-2 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "h-4 w-4 shrink-0 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[160px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            ref: inputRef,
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "yesu · anbu · vaazhvu · இயேசு · title · lyric…",
            className: "h-8 pl-7 text-sm",
            autoFocus: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            title: "Filter",
            className: cn(
              "inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border border-border px-2 text-xs font-medium transition hover:bg-accent",
              filter !== "all" && "border-primary/50 bg-primary/10 text-primary"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden max-w-[140px] truncate @sm:inline", children: filter === "author" && authorFilter ? authorFilter : FILTER_LABELS$1[filter] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "max-h-[70vh] w-56 overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          ["all", "favorites", "recent", "added", "most", "mine"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            DropdownMenuItem,
            {
              onClick: () => {
                setFilter(f);
                setAuthorFilter(null);
              },
              className: cn("text-xs", filter === f && "bg-accent font-semibold text-primary"),
              children: FILTER_LABELS$1[f]
            },
            f
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuLabel, { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: [
            "Author ",
            authorFilter ? `· ${authorFilter}` : ""
          ] }),
          authors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1.5 text-[11px] text-muted-foreground", children: "No authors" }),
          authors.slice(0, 200).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            DropdownMenuItem,
            {
              onClick: () => {
                setFilter("author");
                setAuthorFilter(a);
              },
              className: cn(
                "text-xs",
                filter === "author" && authorFilter === a && "bg-accent font-semibold text-primary"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: a })
            },
            a
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setEditingId(null);
            setEditorOpen(true);
          },
          title: "New song",
          className: "inline-flex h-8 cursor-pointer items-center gap-1 rounded-md bg-primary px-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " New"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-2.5 py-1 text-[10px] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: loading ? "Loading songs…" : !query.trim() ? `${results.length} song${results.length === 1 ? "" : "s"} · ${userSongs.length} mine` : `${results.length} match${results.length === 1 ? "" : "es"}${searchMs != null ? ` · ${searchMs.toFixed(1)}ms` : ""}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "தமிழ் • Tanglish · fuzzy · sound-alike" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-2 py-1 text-[11px] text-destructive", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 flex-1 overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full items-center justify-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      " Loading song library…"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid h-full min-h-0 grid-cols-1 @lg:grid-cols-[minmax(260px,1fr)_1.4fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SongList,
        {
          results,
          activeIdx,
          setActiveIdx,
          onOpen: openSong,
          onProject: (song) => project(song, activeSlideById[song.id] ?? 0),
          projectedText: projectedRef,
          favSet,
          addFav: addFavorite,
          removeFav: removeFavorite,
          activeSlideById,
          selectedId: selectedSong?.id ?? null,
          userSongs,
          onEdit: (id) => {
            setEditingId(id);
            setEditorOpen(true);
          },
          onDelete: removeUserSong,
          query,
          compact: true
        }
      ),
      selectedSong ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        SlidePane,
        {
          song: selectedSong,
          activeSlide: activeSlideById[selectedSong.id] ?? 0,
          onSelect: (i) => setActiveSlideById((m) => ({ ...m, [selectedSong.id]: i })),
          onProject: (i) => project(selectedSong, i),
          onEdit: () => {
            setEditingId(selectedSong.id);
            setEditorOpen(true);
          },
          projectedText: projectedRef
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(SlideEmptyState, {})
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SongEditorDialog, { open: editorOpen, onOpenChange: setEditorOpen, editingId })
  ] });
}
function SongList(p) {
  const userIds = reactExports.useMemo(() => new Set(p.userSongs.map((u) => u.id)), [p.userSongs]);
  if (!p.results.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("min-h-0 overflow-y-auto", p.compact && "border-r border-border"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-8 text-center text-xs text-muted-foreground", children: "No matches. Try Tamil, Tanglish, a misspelling, or any lyric." }) });
  }
  if (p.compact) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 overflow-y-auto border-r border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: p.results.map((h, i) => {
      const song = h.song;
      const slideIdx = p.activeSlideById[song.id] ?? h.slideIndex ?? 0;
      const slide = song.slides[slideIdx] ?? song.content;
      const isSelected = p.selectedId === song.id;
      const isActive = p.activeIdx === i;
      const isProjected = !!p.projectedText && slide && p.projectedText.startsWith(slide.slice(0, 24));
      const isFav = p.favSet.has(song.id);
      const isMine = userIds.has(song.id);
      const first = firstLineOf(song);
      const match = matchedLineOf(song, p.query);
      const showMatch = match && match !== first;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          onClick: () => {
            p.setActiveIdx(i);
            p.onOpen(song);
          },
          onDoubleClick: (e) => {
            e.stopPropagation();
            p.onProject(song);
          },
          className: cn(
            "group relative flex cursor-pointer flex-col gap-1 px-3 py-2 transition hover:bg-accent/60",
            isSelected ? "bg-primary/10 border-l-[3px] border-l-primary pl-[9px]" : isActive ? "bg-accent/40 border-l-[3px] border-l-transparent" : "border-l-[3px] border-l-transparent"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "truncate text-[13px] font-semibold leading-tight",
                    isSelected ? "text-primary" : "text-foreground"
                  ),
                  children: song.title
                }
              ),
              isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded bg-emerald-500/15 px-1 text-[9px] font-bold text-emerald-500", children: "MINE" }),
              isFav && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 shrink-0 fill-amber-500 text-amber-500" }),
              isProjected && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto inline-flex items-center gap-1 rounded bg-primary px-1.5 py-px text-[9px] font-bold uppercase text-primary-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 animate-pulse rounded-full bg-primary-foreground" }),
                " ",
                "Live"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[11.5px] leading-snug text-foreground/80", children: first }),
            showMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate text-[11px] leading-snug text-primary/90", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "…" }),
              match,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "…" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                song.slides.length || 1,
                " slide",
                song.slides.length === 1 ? "" : "s"
              ] }),
              song.artist && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: song.artist })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      if (isFav) p.removeFav(song.id);
                      else p.addFav({ id: song.id, title: song.title });
                    },
                    title: isFav ? "Unfavorite" : "Favorite",
                    className: cn(
                      "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded transition",
                      isFav ? "text-amber-500" : "text-muted-foreground hover:bg-accent"
                    ),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-3 w-3", isFav && "fill-current") })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      p.onEdit(song.id);
                    },
                    title: "Edit lyrics",
                    className: "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-accent",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" })
                  }
                ),
                isMine && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${song.title}"?`)) p.onDelete(song.id);
                    },
                    title: "Delete",
                    className: "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded text-destructive hover:bg-destructive/10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] })
          ]
        },
        song.id
      );
    }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2.5 p-2 @4xl:grid-cols-2", children: p.results.map((h, i) => {
    const song = h.song;
    const slideIdx = p.activeSlideById[song.id] ?? h.slideIndex ?? 0;
    const slide = song.slides[slideIdx] ?? song.content;
    const isSelected = p.selectedId === song.id;
    const isActive = p.activeIdx === i;
    const isProjected = !!p.projectedText && slide && p.projectedText.startsWith(slide.slice(0, 24));
    const isFav = p.favSet.has(song.id);
    const isMine = userIds.has(song.id);
    const first = firstLineOf(song);
    const match = matchedLineOf(song, p.query);
    const showMatch = !!match && match !== first;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => {
          p.setActiveIdx(i);
          p.onOpen(song);
        },
        onDoubleClick: (e) => {
          e.stopPropagation();
          p.onProject(song);
        },
        className: cn(
          "group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-lg border bg-card/80 p-3 transition-all",
          "hover:-translate-y-px hover:border-primary/60 hover:shadow-md",
          isProjected ? "border-primary ring-2 ring-primary/40" : isSelected ? "border-primary/60 bg-primary/5" : isActive ? "border-accent" : "border-border"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex min-w-0 items-start gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "truncate text-[14px] font-semibold leading-tight",
                    isSelected ? "text-primary" : "text-foreground"
                  ),
                  children: song.title
                }
              ),
              isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded bg-emerald-500/15 px-1 text-[9px] font-bold text-emerald-500", children: "MINE" }),
              isFav && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 shrink-0 fill-amber-500 text-amber-500" })
            ] }) }),
            isProjected && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex shrink-0 items-center gap-1 rounded bg-primary px-1 py-px text-[9px] font-bold uppercase text-primary-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 animate-pulse rounded-full bg-primary-foreground" }),
              " ",
              "Live"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[12.5px] leading-snug text-foreground/85", children: first }),
          showMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 rounded-sm border-l-2 border-primary/60 bg-primary/5 px-2 py-1 text-[11.5px] leading-snug text-primary/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1 text-[9px] font-bold uppercase tracking-wide opacity-70", children: "Match" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "…" }),
            match,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 text-[10.5px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              song.slides.length || 1,
              " Slide",
              song.slides.length === 1 ? "" : "s"
            ] }),
            song.artist && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: song.artist })
            ] }),
            song.scale && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted px-1 text-[9px]", children: song.scale }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    if (isFav) p.removeFav(song.id);
                    else p.addFav({ id: song.id, title: song.title });
                  },
                  title: isFav ? "Unfavorite" : "Favorite",
                  className: cn(
                    "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded transition",
                    isFav ? "text-amber-500" : "text-muted-foreground hover:bg-accent"
                  ),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-3.5 w-3.5", isFav && "fill-current") })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    p.onEdit(song.id);
                  },
                  title: "Edit lyrics",
                  className: "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-accent",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                }
              ),
              isMine && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${song.title}"?`)) p.onDelete(song.id);
                  },
                  title: "Delete",
                  className: "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded text-destructive hover:bg-destructive/10",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    p.onProject(song);
                  },
                  title: "Project",
                  className: "ml-1 inline-flex h-7 items-center gap-1 rounded bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground transition hover:opacity-90",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3" }),
                    " Project"
                  ]
                }
              )
            ] })
          ] })
        ]
      },
      song.id
    );
  }) }) });
}
function SlideEmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-2 border-l border-border bg-muted/10 p-8 text-center text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "h-8 w-8 opacity-40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground/70", children: "No song selected" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: "Select a song from the list to view its slides." })
  ] });
}
function SlidePane({ song, activeSlide, onSelect, onProject, onEdit, projectedText }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col border-l border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border bg-muted/20 px-2 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "h-3.5 w-3.5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[12px] font-semibold", children: song.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
          song.slides.length,
          " slide",
          song.slides.length === 1 ? "" : "s",
          song.artist ? ` · ${song.artist}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onEdit,
          title: "Edit song",
          className: "inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 text-[11px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
            " Edit"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto p-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 @md:grid-cols-2", children: song.slides.map((s, i) => {
      const isActive = activeSlide === i;
      const isProjected = !!projectedText && projectedText.startsWith(s.slice(0, 24));
      const lines = s.split("\n").length;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => {
            onSelect(i);
            onProject(i);
          },
          className: cn(
            "group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-lg border-2 bg-card/80 transition-all",
            "hover:-translate-y-px hover:border-primary/70 hover:shadow-md",
            isProjected ? "border-primary ring-2 ring-primary/40" : isActive ? "border-primary/60" : "border-border"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Slide ",
                i + 1
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/60", children: [
                "· ",
                lines,
                " line",
                lines === 1 ? "" : "s"
              ] }),
              isProjected && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto inline-flex items-center gap-1 rounded bg-primary px-1.5 py-px text-[9px] text-primary-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 animate-pulse rounded-full bg-primary-foreground" }),
                " ",
                "Live"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "flex-1 whitespace-pre-wrap break-words px-3 py-2.5 font-sans text-[14px] leading-relaxed", children: s }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end border-t border-border/40 bg-muted/20 px-2 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onProject(i);
                },
                className: "inline-flex items-center gap-1 rounded bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3" }),
                  " Project"
                ]
              }
            ) })
          ]
        },
        i
      );
    }) }) })
  ] });
}
const newId = () => `txt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const RECENT_MAX = 30;
const useTextItems = create()(
  persist(
    (set) => ({
      items: [],
      recents: [],
      create: (init) => {
        const id = newId();
        const now = Date.now();
        set((s) => ({
          items: [
            {
              id,
              title: init?.title?.trim() || "Untitled",
              content: init?.content ?? "",
              collection: init?.collection ?? null,
              favorite: false,
              createdAt: now,
              updatedAt: now
            },
            ...s.items
          ]
        }));
        return id;
      },
      update: (id, patch) => set((s) => ({
        items: s.items.map(
          (it) => it.id === id ? { ...it, ...patch, updatedAt: Date.now() } : it
        )
      })),
      remove: (id) => set((s) => ({
        items: s.items.filter((it) => it.id !== id),
        recents: s.recents.filter((r) => r.itemId !== id)
      })),
      duplicate: (id) => {
        let newId2 = null;
        set((s) => {
          const src = s.items.find((it) => it.id === id);
          if (!src) return s;
          newId2 = `txt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
          const now = Date.now();
          return {
            ...s,
            items: [
              { ...src, id: newId2, title: `${src.title} (copy)`, createdAt: now, updatedAt: now },
              ...s.items
            ]
          };
        });
        return newId2;
      },
      toggleFavorite: (id) => set((s) => ({
        items: s.items.map(
          (it) => it.id === id ? { ...it, favorite: !it.favorite, updatedAt: Date.now() } : it
        )
      })),
      pushRecent: (itemId, slideIndex) => set((s) => {
        const filtered = s.recents.filter(
          (r) => !(r.itemId === itemId && r.slideIndex === slideIndex)
        );
        return {
          recents: [{ itemId, slideIndex, at: Date.now() }, ...filtered].slice(0, RECENT_MAX)
        };
      })
    }),
    { name: "vision-text-items", storage: createJSONStorage(() => localStorage), version: 1 }
  )
);
function splitTextSlides(content) {
  const trimmed = (content ?? "").replace(/\r\n/g, "\n").trim();
  if (!trimmed) return [];
  return trimmed.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
}
function projectTextSlide(input) {
  const overlay = {
    reference: "",
    referenceEn: "",
    referenceTa: "",
    text: input.text,
    textEn: "",
    textTa: input.text,
    translation: "",
    mode: "ta",
    kind: "live_text"
  };
  const groups = useTextFormat.getState().groups;
  const style = useTextFormat.getState().style;
  const store = useProjection.getState();
  if (!store.projectorOpen) store.openProjector();
  const send = () => useProjection.getState().send({ type: "LOAD_TEXT", overlay, style, styles: groups });
  if (store.projectorOpen) send();
  else setTimeout(send, 400);
  const now = Date.now();
  const content = {
    id: `text:${input.itemId}:${input.slideIndex}`,
    type: "live_text",
    title: `${input.title} (slide ${input.slideIndex + 1}/${input.totalSlides})`,
    source: { module: "text" },
    metadata: { itemId: input.itemId, slideIndex: input.slideIndex },
    style: {
      background: style.background,
      color: style.color,
      align: style.align,
      vAlign: style.vAlign
    },
    body: { text: input.text },
    createdAt: now,
    updatedAt: now
  };
  projectionEvents.emit({ type: "CONTENT_PROJECTED", content, previous: null });
  projectionHistory.append(content);
  return content;
}
const CHURCH_DICTIONARY = {
  // ── Names of God / Jesus ─────────────────────────────────────────────
  yesu: ["யேசு", "இயேசு", "யேசுவே", "யேசுவின்"],
  iyesu: ["இயேசு", "இயேசுவே", "இயேசுவின்"],
  jesus: ["இயேசு", "யேசு", "இயேசுவே"],
  esu: ["ஏசு", "ஏசுவே"],
  christ: ["கிறிஸ்து", "கிறிஸ்துவே", "கிறிஸ்துவின்"],
  kiristu: ["கிறிஸ்து", "கிறிஸ்துவின்"],
  karthar: ["கர்த்தர்", "கர்த்தரே", "கர்த்தராகிய", "கர்த்தருடைய"],
  kartharr: ["கர்த்தர்", "கர்த்தரே"],
  karthr: ["கர்த்தர்", "கர்த்தரே"],
  kartharh: ["கர்த்தர்", "கர்த்தரே"],
  karthare: ["கர்த்தரே"],
  kartharae: ["கர்த்தரே"],
  kartharin: ["கர்த்தருடைய", "கர்த்தரின்"],
  devan: ["தேவன்", "தேவனே", "தேவனாகிய", "தேவனுடைய"],
  devane: ["தேவனே"],
  thevan: ["தேவன்", "தேவனே"],
  thevane: ["தேவனே"],
  appa: ["அப்பா", "அப்பாவே"],
  yesappa: ["யேசப்பா", "யேசப்பாவே"],
  pitha: ["பிதா", "பிதாவே", "பிதாவாகிய"],
  pidha: ["பிதா", "பிதாவே"],
  pithavae: ["பிதாவே"],
  pithave: ["பிதாவே"],
  aaviyanavar: ["ஆவியானவர்", "ஆவியானவரே", "ஆவியானவருடைய"],
  aaviyanavare: ["ஆவியானவரே"],
  parisutha: ["பரிசுத்த"],
  parisuththa: ["பரிசுத்த"],
  parisuthamana: ["பரிசுத்தமான"],
  parisuthaaviyanavar: ["பரிசுத்த ஆவியானவர்"],
  emmanuel: ["இம்மானுவேல்", "இம்மானுவேலே"],
  immanuel: ["இம்மானுவேல்"],
  alpha: ["ஆல்பா"],
  omega: ["ஓமேகா"],
  trinity: ["திரியேக"],
  trieka: ["திரியேக"],
  abba: ["அப்பா"],
  yahweh: ["யேகோவா"],
  jehovah: ["யேகோவா"],
  rabbi: ["ரபீ"],
  meshiah: ["மேசியா"],
  messiah: ["மேசியா"],
  // ── Greetings / common ───────────────────────────────────────────────
  vanakkam: ["வணக்கம்"],
  vanakam: ["வணக்கம்"],
  nandri: ["நன்றி"],
  amen: ["ஆமென்", "ஆமென்!"],
  aamen: ["ஆமென்"],
  halleluya: ["அல்லேலூயா", "அல்லேலூயா!"],
  hallelujah: ["அல்லேலூயா"],
  alleluya: ["அல்லேலூயா"],
  praise: ["துதி", "ஸ்தோத்திரம்"],
  hosanna: ["ஓசன்னா"],
  osanna: ["ஓசன்னா"],
  glory: ["மகிமை"],
  bless: ["ஆசீர்வதியும்"],
  blessing: ["ஆசீர்வாதம்"],
  blessed: ["ஆசீர்வதிக்கப்பட்ட"],
  asirvadham: ["ஆசீர்வாதம்"],
  aasirvadham: ["ஆசீர்வாதம்"],
  // ── Concepts ─────────────────────────────────────────────────────────
  anbu: ["அன்பு", "அன்பே", "அன்பான"],
  anbae: ["அன்பே"],
  anbe: ["அன்பே"],
  kirubai: ["கிருபை", "கிருபையே", "கிருபையினால்"],
  kirubaiyae: ["கிருபையே"],
  kirubaiye: ["கிருபையே"],
  kirubaiyinal: ["கிருபையினால்"],
  irakkam: ["இரக்கம்", "இரக்கமே"],
  santhi: ["சாந்தி"],
  samadhanam: ["சமாதானம்", "சமாதானமே"],
  magizhchi: ["மகிழ்ச்சி", "மகிழ்ச்சியே"],
  magizhci: ["மகிழ்ச்சி"],
  santhosham: ["சந்தோஷம்"],
  nambikkai: ["நம்பிக்கை", "நம்பிக்கையே"],
  vishuvasam: ["விசுவாசம்", "விசுவாசமே"],
  visuvasam: ["விசுவாசம்", "விசுவாசமே"],
  visvasam: ["விசுவாசம்"],
  jebam: ["ஜெபம்", "ஜெபமே", "ஜெபத்தினால்"],
  jepam: ["ஜெபம்", "ஜெபமே"],
  jebamm: ["ஜெபம்"],
  prarthanai: ["பிரார்த்தனை", "பிரார்த்தனையே"],
  aaradhanai: ["ஆராதனை", "ஆராதனையே"],
  aradhanai: ["ஆராதனை", "ஆராதனையே"],
  aarathanai: ["ஆராதனை", "ஆராதனையே"],
  arathanai: ["ஆராதனை"],
  worship: ["ஆராதனை"],
  thuthi: ["துதி", "துதியே"],
  sthothiram: ["ஸ்தோத்திரம்", "ஸ்தோத்திரமே"],
  sthothram: ["ஸ்தோத்திரம்"],
  stothiram: ["ஸ்தோத்திரம்"],
  mahimai: ["மகிமை", "மகிமையே"],
  oli: ["ஒளி", "ஒளியே"],
  irul: ["இருள்"],
  vazhi: ["வழி", "வழியே"],
  unmai: ["உண்மை", "உண்மையே"],
  jeevan: ["ஜீவன்", "ஜீவனே", "ஜீவனுள்ள"],
  jivan: ["ஜீவன்"],
  marivu: ["மரிவு"],
  paavam: ["பாவம்"],
  pavam: ["பாவம்"],
  manippu: ["மன்னிப்பு"],
  mannippu: ["மன்னிப்பு"],
  manithan: ["மனிதன்"],
  rajan: ["ராஜன்", "ராஜாவே"],
  raja: ["ராஜா", "ராஜாவே"],
  rajadhi: ["ராஜாதி"],
  rajadhiraja: ["ராஜாதி ராஜா"],
  vetri: ["வெற்றி", "வெற்றியே"],
  victory: ["வெற்றி"],
  ratchipu: ["இரட்சிப்பு"],
  iratchipu: ["இரட்சிப்பு"],
  ratchakar: ["இரட்சகர்", "இரட்சகரே"],
  iratchakar: ["இரட்சகர்", "இரட்சகரே"],
  meetparr: ["மீட்பர்"],
  meetpar: ["மீட்பர்", "மீட்பரே"],
  uyirthezhuthal: ["உயிர்த்தெழுதல்"],
  uyirthezhudal: ["உயிர்த்தெழுதல்"],
  uyirthezhunthar: ["உயிர்த்தெழுந்தார்"],
  upavasam: ["உபவாசம்"],
  upavaasam: ["உபவாசம்"],
  saatchi: ["சாட்சி", "சாட்சியம்"],
  satchi: ["சாட்சி"],
  saatchiyam: ["சாட்சியம்"],
  satchiyam: ["சாட்சியம்"],
  testimony: ["சாட்சியம்"],
  abhishekam: ["அபிஷேகம்"],
  abishekam: ["அபிஷேகம்"],
  anugraham: ["அநுக்கிரகம்"],
  varam: ["வரம்"],
  varangal: ["வரங்கள்"],
  satyam: ["சத்தியம்"],
  sathyam: ["சத்தியம்"],
  punithar: ["புனிதர்"],
  parisuthavan: ["பரிசுத்தவான்"],
  // ── Church / service ─────────────────────────────────────────────────
  thiruchabai: ["திருச்சபை"],
  sabai: ["சபை", "சபையே"],
  sungeetham: ["சங்கீதம்"],
  sangeetham: ["சங்கீதம்"],
  vasanam: ["வசனம்", "வசனமே"],
  vethagamam: ["வேதாகமம்"],
  vedhagamam: ["வேதாகமம்"],
  vethaagamam: ["வேதாகமம்"],
  vedham: ["வேதம்"],
  paadal: ["பாடல்"],
  padal: ["பாடல்"],
  paattu: ["பாட்டு"],
  pattu: ["பாட்டு"],
  bible: ["வேதாகமம்"],
  thirumarai: ["திருமறை"],
  vacanam: ["வசனம்"],
  sermon: ["பிரசங்கம்"],
  prasangam: ["பிரசங்கம்"],
  pirasangam: ["பிரசங்கம்"],
  kuripu: ["குறிப்பு"],
  pasthar: ["பாஸ்டர்"],
  pastor: ["போதகர்", "பாஸ்டர்"],
  bothakar: ["போதகர்", "போதகரே"],
  pothakar: ["போதகர்"],
  mootha: ["மூத்த"],
  sangam: ["சங்கம்"],
  thiruvasan: ["திருவசனம்"],
  // ── Time / events ────────────────────────────────────────────────────
  gnayiru: ["ஞாயிறு"],
  njayiru: ["ஞாயிறு"],
  sunday: ["ஞாயிற்றுக்கிழமை"],
  kootam: ["கூட்டம்"],
  koottam: ["கூட்டம்"],
  visheshamana: ["விசேஷமான"],
  vizha: ["விழா"],
  vizhaa: ["விழா"],
  conference: ["மாநாடு"],
  manadu: ["மாநாடு"],
  retreat: ["தனிமைப் பயிற்சி"],
  youth: ["இளைஞர்"],
  meeting: ["கூட்டம்"],
  // ── People ───────────────────────────────────────────────────────────
  achchan: ["அச்சன்"],
  amma: ["அம்மா"],
  thai: ["தாய்"],
  tagappan: ["தகப்பன்"],
  thagappan: ["தகப்பன்"],
  makkal: ["மக்கள்"],
  pillaigal: ["பிள்ளைகள்"],
  pillaikal: ["பிள்ளைகள்"],
  illuvanthor: ["இளைஞர்"],
  ilaignar: ["இளைஞர்"],
  sabaiyar: ["சபையார்"],
  sahodharar: ["சகோதரர்"],
  sahodhari: ["சகோதரி"],
  sagothara: ["சகோதரர்"],
  // ── Pronouns / particles / verbs ─────────────────────────────────────
  naan: ["நான்"],
  nee: ["நீ"],
  neer: ["நீர்"],
  ungal: ["உங்கள்"],
  enathu: ["எனது"],
  unathu: ["உனது"],
  avar: ["அவர்"],
  avarude: ["அவருடைய"],
  enru: ["என்று"],
  endru: ["என்று"],
  enna: ["என்ன"],
  illai: ["இல்லை"],
  irukku: ["இருக்கு"],
  irukkum: ["இருக்கும்"],
  irukirar: ["இருக்கிறார்"],
  varugiraar: ["வருகிறார்"],
  varugirar: ["வருகிறார்"],
  varuvar: ["வருவார்"],
  vaarungal: ["வாருங்கள்"],
  vanga: ["வாங்க"],
  pogalam: ["போகலாம்"],
  seyvom: ["செய்வோம்"],
  paadalam: ["பாடலாம்"],
  paaduvom: ["பாடுவோம்"],
  thuthipom: ["துதிப்போம்"],
  jepippom: ["ஜெபிப்போம்"],
  aaradhippom: ["ஆராதிப்போம்"],
  nambuvom: ["நம்புவோம்"],
  yeshu: ["இயேசு", "யேசு"]
};
const TAMIL_CORPUS = {
  // ── Pronouns ─────────────────────────────────────────────────────────
  naan: ["நான்"],
  naa: ["நா", "நான்"],
  naam: ["நாம்", "நாமும்"],
  naangal: ["நாங்கள்"],
  nangal: ["நாங்கள்"],
  nee: ["நீ"],
  neenga: ["நீங்க", "நீங்கள்"],
  neengal: ["நீங்கள்"],
  nenga: ["நீங்க"],
  neer: ["நீர்"],
  avan: ["அவன்"],
  aval: ["அவள்"],
  avar: ["அவர்"],
  avarkal: ["அவர்கள்"],
  avargal: ["அவர்கள்"],
  ivan: ["இவன்"],
  ival: ["இவள்"],
  ivar: ["இவர்"],
  ivargal: ["இவர்கள்"],
  athu: ["அது"],
  adhu: ["அது"],
  ithu: ["இது"],
  idhu: ["இது"],
  avai: ["அவை"],
  ivai: ["இவை"],
  thaan: ["தான்"],
  than: ["தான்"],
  thaane: ["தானே"],
  enathu: ["எனது", "என்"],
  ennudaiya: ["என்னுடைய"],
  unathu: ["உனது", "உன்"],
  unnudaiya: ["உன்னுடைய"],
  ungal: ["உங்கள்"],
  ungalathu: ["உங்களது"],
  ungaludaiya: ["உங்களுடைய"],
  avarudaiya: ["அவருடைய"],
  avarathu: ["அவரது"],
  namathu: ["நமது"],
  nammudaiya: ["நம்முடைய"],
  nammal: ["நம்மால்"],
  ennai: ["என்னை"],
  unnai: ["உன்னை"],
  ungalai: ["உங்களை"],
  avarai: ["அவரை"],
  avalai: ["அவளை"],
  avanai: ["அவனை"],
  athai: ["அதை"],
  ithai: ["இதை"],
  enakku: ["எனக்கு"],
  unakku: ["உனக்கு"],
  ungalukku: ["உங்களுக்கு"],
  avarukku: ["அவருக்கு"],
  avalukku: ["அவளுக்கு"],
  avanukku: ["அவனுக்கு"],
  namakku: ["நமக்கு"],
  enkitta: ["என்கிட்ட", "என்னிடம்"],
  unkitta: ["உன்கிட்ட", "உன்னிடம்"],
  ungakitta: ["உங்ககிட்ட", "உங்களிடம்"],
  ennidam: ["என்னிடம்"],
  unnidam: ["உன்னிடம்"],
  ungalidam: ["உங்களிடம்"],
  // ── Question words ───────────────────────────────────────────────────
  enna: ["என்ன"],
  yaar: ["யார்"],
  yaaru: ["யாரு", "யார்"],
  enge: ["எங்கே"],
  engae: ["எங்கே"],
  engeh: ["எங்கே"],
  enga: ["எங்க", "எங்கே"],
  eppadi: ["எப்படி"],
  eppidi: ["எப்படி"],
  eppdi: ["எப்படி"],
  eppo: ["எப்போ", "எப்போது"],
  eppothu: ["எப்போது"],
  eppozhuthu: ["எப்பொழுது"],
  ethu: ["எது"],
  edhu: ["எது"],
  edhukku: ["எதுக்கு", "எதற்கு"],
  ethukku: ["எதுக்கு", "எதற்கு"],
  ethanai: ["எத்தனை"],
  evvalavu: ["எவ்வளவு"],
  yenn: ["ஏன்"],
  yen: ["ஏன்"],
  een: ["ஏன்"],
  enin: ["எனின்"],
  enbathu: ["என்பது"],
  enru: ["என்று"],
  endru: ["என்று"],
  enpathu: ["என்பது"],
  // ── Common verbs (root, present, past, future, imperative) ──────────
  iru: ["இரு"],
  iruku: ["இருக்கு"],
  irukku: ["இருக்கு"],
  irukkum: ["இருக்கும்"],
  irukirathu: ["இருக்கிறது"],
  irukiren: ["இருக்கிறேன்"],
  irukiraan: ["இருக்கிறான்"],
  irukiral: ["இருக்கிறாள்"],
  irukirar: ["இருக்கிறார்"],
  irukirarkal: ["இருக்கிறார்கள்"],
  irukeenga: ["இருக்கீங்க", "இருக்கிறீர்கள்"],
  irukinga: ["இருக்கீங்க", "இருக்கிறீர்கள்"],
  irukireergal: ["இருக்கிறீர்கள்"],
  irundhal: ["இருந்தால்"],
  irunthal: ["இருந்தால்"],
  irunthen: ["இருந்தேன்"],
  irundhen: ["இருந்தேன்"],
  irundhar: ["இருந்தார்"],
  irundhargal: ["இருந்தார்கள்"],
  irunthaargal: ["இருந்தார்கள்"],
  iruppen: ["இருப்பேன்"],
  iruppar: ["இருப்பார்"],
  iruppargal: ["இருப்பார்கள்"],
  iru_imp: ["இரு"],
  vaa: ["வா"],
  vaarungal: ["வாருங்கள்"],
  vanga: ["வாங்க"],
  vaanga: ["வாங்க"],
  varuven: ["வருவேன்"],
  varuvar: ["வருவார்"],
  varugiraar: ["வருகிறார்"],
  varugirar: ["வருகிறார்"],
  varugiren: ["வருகிறேன்"],
  varuthu: ["வருது", "வருகிறது"],
  vandhar: ["வந்தார்"],
  vanthar: ["வந்தார்"],
  vandhen: ["வந்தேன்"],
  vanthen: ["வந்தேன்"],
  pogalam: ["போகலாம்"],
  poganum: ["போகணும்", "போக வேண்டும்"],
  poreen: ["போறேன்", "போகிறேன்"],
  poren: ["போறேன்"],
  poraan: ["போறான்"],
  poraar: ["போறார்"],
  ponen: ["போனேன்"],
  ponar: ["போனார்"],
  pongal: ["போங்கள்", "போங்க"],
  pongal_imp: ["போங்க"],
  po: ["போ"],
  pannu: ["பண்ணு"],
  pannunga: ["பண்ணுங்க"],
  pannuvom: ["பண்ணுவோம்"],
  pannuven: ["பண்ணுவேன்"],
  pannina: ["பண்ணின", "பண்ணினேன்"],
  panrathu: ["பண்றது", "பண்ணுகிறது"],
  sei: ["செய்"],
  seyya: ["செய்ய"],
  seyvom: ["செய்வோம்"],
  seyven: ["செய்வேன்"],
  seythar: ["செய்தார்"],
  seythen: ["செய்தேன்"],
  seyungal: ["செய்யுங்கள்"],
  paadu: ["பாடு"],
  paadalam: ["பாடலாம்"],
  paaduvom: ["பாடுவோம்"],
  paaduven: ["பாடுவேன்"],
  paadinen: ["பாடினேன்"],
  paadinar: ["பாடினார்"],
  paadinargal: ["பாடினார்கள்"],
  paadungal: ["பாடுங்கள்"],
  pesu: ["பேசு"],
  pesungal: ["பேசுங்கள்"],
  pesuvom: ["பேசுவோம்"],
  pesuven: ["பேசுவேன்"],
  pesinen: ["பேசினேன்"],
  pesinar: ["பேசினார்"],
  ketkka: ["கேட்க"],
  kekka: ["கேக்க"],
  ketkungal: ["கேட்குங்கள்"],
  ketten: ["கேட்டேன்"],
  kettar: ["கேட்டார்"],
  ketkiren: ["கேட்கிறேன்"],
  ketkirar: ["கேட்கிறார்"],
  sollu: ["சொல்லு"],
  sollunga: ["சொல்லுங்க", "சொல்லுங்கள்"],
  solluvom: ["சொல்லுவோம்"],
  solluven: ["சொல்லுவேன்"],
  sonnen: ["சொன்னேன்"],
  sonnar: ["சொன்னார்"],
  sonnargal: ["சொன்னார்கள்"],
  solgiren: ["சொல்கிறேன்"],
  solgirar: ["சொல்கிறார்"],
  paaru: ["பாரு", "பார்"],
  par: ["பார்"],
  parungal: ["பாருங்கள்"],
  paarungal: ["பாருங்கள்"],
  paartthar: ["பார்த்தார்"],
  parthar: ["பார்த்தார்"],
  parthen: ["பார்த்தேன்"],
  parkiren: ["பார்க்கிறேன்"],
  parkirar: ["பார்க்கிறார்"],
  paarkiraen: ["பார்க்கிறேன்"],
  ketpiren: ["கேட்பேன்", "கேட்பேன்"],
  enni: ["எண்ணி"],
  ennungal: ["எண்ணுங்கள்"],
  ennuven: ["எண்ணுவேன்"],
  unnu: ["உண்ணு"],
  unnungal: ["உண்ணுங்கள்"],
  saappidu: ["சாப்பிடு"],
  saappidunga: ["சாப்பிடுங்க"],
  saaptaen: ["சாப்டேன்", "சாப்பிட்டேன்"],
  saappitten: ["சாப்பிட்டேன்"],
  saappittar: ["சாப்பிட்டார்"],
  paditthu: ["படித்து"],
  padikka: ["படிக்க"],
  padikkanum: ["படிக்கணும்", "படிக்க வேண்டும்"],
  padichen: ["படிச்சேன்", "படித்தேன்"],
  padithen: ["படித்தேன்"],
  padithar: ["படித்தார்"],
  ezhuthu: ["எழுது"],
  ezhuthungal: ["எழுதுங்கள்"],
  ezhuthuvom: ["எழுதுவோம்"],
  ezhuthinen: ["எழுதினேன்"],
  ezhuthinar: ["எழுதினார்"],
  thuthi_v: ["துதி"],
  thuthippom: ["துதிப்போம்"],
  thuthippen: ["துதிப்பேன்"],
  thuthithen: ["துதித்தேன்"],
  thuthithar: ["துதித்தார்"],
  thuthiyungal: ["துதியுங்கள்"],
  aaradhi: ["ஆராதி"],
  aaradhippom: ["ஆராதிப்போம்"],
  aaradhippen: ["ஆராதிப்பேன்"],
  aaradhithar: ["ஆராதித்தார்"],
  aaradhithen: ["ஆராதித்தேன்"],
  aaradhiyungal: ["ஆராதியுங்கள்"],
  jebi: ["ஜெபி"],
  jepi: ["ஜெபி"],
  jebippom: ["ஜெபிப்போம்"],
  jepippom: ["ஜெபிப்போம்"],
  jebippen: ["ஜெபிப்பேன்"],
  jebithar: ["ஜெபித்தார்"],
  jebithen: ["ஜெபித்தேன்"],
  jebiyungal: ["ஜெபியுங்கள்"],
  nambu: ["நம்பு"],
  nambungal: ["நம்புங்கள்"],
  nambuvom: ["நம்புவோம்"],
  nambuven: ["நம்புவேன்"],
  nambinen: ["நம்பினேன்"],
  nambinar: ["நம்பினார்"],
  ninai: ["நினை"],
  ninaivu: ["நினைவு"],
  ninai_imp: ["நினையுங்கள்"],
  ninaiyungal: ["நினையுங்கள்"],
  ninaithen: ["நினைத்தேன்"],
  ninaithar: ["நினைத்தார்"],
  marakkadhe: ["மறக்காதே"],
  marandhar: ["மறந்தார்"],
  maranthen: ["மறந்தேன்"],
  thiru: ["திரு"],
  thiruppi: ["திருப்பி"],
  vaazh: ["வாழ்"],
  vaazhga: ["வாழ்க"],
  vaazhvom: ["வாழ்வோம்"],
  vaazhven: ["வாழ்வேன்"],
  vaazhndhar: ["வாழ்ந்தார்"],
  vaazhndhen: ["வாழ்ந்தேன்"],
  // ── Adjectives / qualifiers ─────────────────────────────────────────
  nalla: ["நல்ல"],
  nalavan: ["நல்லவன்"],
  nallavan: ["நல்லவன்"],
  nallaval: ["நல்லவள்"],
  nallavar: ["நல்லவர்"],
  nallavargal: ["நல்லவர்கள்"],
  nalathu: ["நலது", "நலம்"],
  nalam: ["நலம்"],
  nalamana: ["நலமான"],
  nalamudan: ["நலமுடன்"],
  periya: ["பெரிய"],
  peridhu: ["பெரிது"],
  periyavar: ["பெரியவர்"],
  chinna: ["சின்ன"],
  siriya: ["சிறிய"],
  chinnathu: ["சின்னது"],
  azhagana: ["அழகான"],
  azhagu: ["அழகு"],
  azhagaai: ["அழகாய்"],
  azhagiya: ["அழகிய"],
  pudhiya: ["புதிய"],
  puthiya: ["புதிய"],
  pazhaya: ["பழைய"],
  uyarndha: ["உயர்ந்த"],
  thaazhndha: ["தாழ்ந்த"],
  pugazhntha: ["புகழ்ந்த"],
  pugazh: ["புகழ்"],
  vallamai: ["வல்லமை"],
  vallamaiyana: ["வல்லமையான"],
  vallamaiyana_one: ["வல்லமையான"],
  vallamaiyulla: ["வல்லமையுள்ள"],
  vallamaiyaai: ["வல்லமையாய்"],
  parisuthamulla: ["பரிசுத்தமுள்ள"],
  unmaiyana: ["உண்மையான"],
  unmaiyaai: ["உண்மையாய்"],
  vivekam: ["விவேகம்"],
  vivekamana: ["விவேகமான"],
  vivekamaanavan: ["விவேகமானவன்"],
  vivekamulla: ["விவேகமுள்ள"],
  vivekamullavan: ["விவேகமுள்ளவன்"],
  ganamulla: ["ஞானமுள்ள"],
  gnanamulla: ["ஞானமுள்ள"],
  gnanam: ["ஞானம்"],
  gnani: ["ஞானி"],
  arivu: ["அறிவு"],
  arivulla: ["அறிவுள்ள"],
  arivumulla: ["அறிவுமுள்ள"],
  arivuMaan: ["அறிவாளன்"],
  perumai: ["பெருமை"],
  pasi: ["பசி"],
  thaagam: ["தாகம்"],
  santhosham_adj: ["சந்தோஷமான"],
  santhoshamana: ["சந்தோஷமான"],
  sandhoshamana: ["சந்தோஷமான"],
  thunbamana: ["துன்பமான"],
  kashtamaana: ["கஷ்டமான"],
  kashtam: ["கஷ்டம்"],
  thunbam: ["துன்பம்"],
  sogham: ["சோகம்"],
  vimochanam: ["விமோசனம்"],
  veguvana: ["வெகுவான"],
  ezhmaiyana: ["எளிமையான"],
  ezhmai: ["எளிமை"],
  parisuthamana: ["பரிசுத்தமான"],
  parisuthavanaana: ["பரிசுத்தவனாகிய"],
  // ── Time ─────────────────────────────────────────────────────────────
  indru: ["இன்று"],
  intru: ["இன்று"],
  innaikku: ["இன்னைக்கு", "இன்று"],
  innikki: ["இன்னிக்கி", "இன்று"],
  naalai: ["நாளை"],
  nalaiki: ["நாளைக்கு"],
  nethu: ["நேத்து", "நேற்று"],
  netru: ["நேற்று"],
  ippo: ["இப்போ", "இப்போது"],
  ippothu: ["இப்போது"],
  appo: ["அப்போ", "அப்போது"],
  appothu: ["அப்போது"],
  ennaikum: ["என்னைக்கும்", "என்றென்றும்"],
  enrum: ["என்றும்"],
  enrenrum: ["என்றென்றும்"],
  kalai: ["காலை"],
  maalai: ["மாலை"],
  iravu: ["இரவு"],
  pagal: ["பகல்"],
  vaaram: ["வாரம்"],
  maatham: ["மாதம்"],
  varudam: ["வருடம்"],
  aandu: ["ஆண்டு"],
  varudangal: ["வருடங்கள்"],
  neram: ["நேரம்"],
  manithulai: ["மணித்துளி"],
  nodi: ["நொடி"],
  vinaadi: ["விநாடி"],
  // ── Numbers ─────────────────────────────────────────────────────────
  ondru: ["ஒன்று"],
  ondu: ["ஒண்ணு", "ஒன்று"],
  oru: ["ஒரு"],
  irandu: ["இரண்டு"],
  rendu: ["ரெண்டு", "இரண்டு"],
  moondru: ["மூன்று"],
  munu: ["மூணு", "மூன்று"],
  naalu: ["நாலு", "நான்கு"],
  naangu: ["நான்கு"],
  ainthu: ["ஐந்து"],
  anju: ["அஞ்சு", "ஐந்து"],
  aaru: ["ஆறு"],
  ezhu: ["ஏழு"],
  ettu: ["எட்டு"],
  onbathu: ["ஒன்பது"],
  paththu: ["பத்து"],
  pathu: ["பத்து"],
  nooru: ["நூறு"],
  aayiram: ["ஆயிரம்"],
  ilakku: ["இலக்கம்", "இலட்சம்"],
  ilatcham: ["இலட்சம்"],
  // ── Worship vocabulary (extends church-dictionary) ───────────────────
  paadalgal: ["பாடல்கள்"],
  padalgal: ["பாடல்கள்"],
  geetham: ["கீதம்"],
  geethangal: ["கீதங்கள்"],
  paatu: ["பாட்டு"],
  paatugal: ["பாட்டுகள்"],
  isai: ["இசை"],
  raagam: ["ராகம்"],
  thaalam: ["தாளம்"],
  archanai: ["அர்ச்சனை"],
  thiyaanam: ["தியானம்"],
  thiyanam: ["தியானம்"],
  dhyanam: ["தியானம்"],
  ozhungai: ["ஒழுங்கை"],
  pirasangi: ["பிரசங்கி"],
  pirasangippom: ["பிரசங்கிப்போம்"],
  pirasangam_v: ["பிரசங்கம்"],
  vetiyalaalan: ["வேதியலாளன்"],
  meditation: ["தியானம்"],
  praayachitham: ["பிராயச்சித்தம்"],
  prayer: ["ஜெபம்"],
  fasting: ["உபவாசம்"],
  // ── Church / building / community ───────────────────────────────────
  alayam: ["ஆலயம்"],
  aalayam: ["ஆலயம்"],
  koilukku: ["கோவிலுக்கு"],
  koil: ["கோவில்"],
  chapel: ["தேவாலயம்"],
  church: ["சபை", "திருச்சபை"],
  mukkadu: ["முக்காடு"],
  manram: ["மன்றம்"],
  pasanai: ["பாசனை"],
  vazhipaadu: ["வழிபாடு"],
  aaradhanai_sv: ["ஆராதனை"],
  // ── Emotions / spiritual states ─────────────────────────────────────
  bayam: ["பயம்"],
  bayamillai: ["பயமில்லை"],
  thairyam: ["தைரியம்"],
  thairiyam: ["தைரியம்"],
  dhairyam: ["தைரியம்"],
  porumai: ["பொறுமை"],
  amaithi: ["அமைதி"],
  sandhippu: ["சந்திப்பு"],
  ninaivagam: ["நினைவகம்"],
  azhugai: ["அழுகை"],
  sirippu: ["சிரிப்பு"],
  punnagai: ["புன்னகை"],
  thavippu: ["தவிப்பு"],
  thazhndha: ["தாழ்ந்த"],
  pannbu: ["பண்பு"],
  paribu: ["பரிவு"],
  manaviraagam: ["மனவிராகம்"],
  manam: ["மனம்"],
  manasu: ["மனசு"],
  manathil: ["மனதில்"],
  manathukul: ["மனதுக்குள்"],
  manathodu: ["மனதோடு"],
  ullam: ["உள்ளம்"],
  ullaththil: ["உள்ளத்தில்"],
  ullaththodu: ["உள்ளத்தோடு"],
  // ── Body / health ───────────────────────────────────────────────────
  udal: ["உடல்"],
  udambu: ["உடம்பு"],
  thalai: ["தலை"],
  kann: ["கண்"],
  kanngal: ["கண்கள்"],
  kaan: ["காண்"],
  kaadhu: ["காது"],
  kai: ["கை"],
  kaal: ["கால்"],
  vaai: ["வாய்"],
  iruthayam: ["இருதயம்"],
  ratham: ["இரத்தம்"],
  raktham: ["இரத்தம்"],
  // ── Places ──────────────────────────────────────────────────────────
  veedu: ["வீடு"],
  vidu: ["வீடு"],
  ooru: ["ஊரு", "ஊர்"],
  oor: ["ஊர்"],
  desam: ["தேசம்"],
  desathin: ["தேசத்தின்"],
  nadu: ["நாடு"],
  nagaram: ["நகரம்"],
  kiramam: ["கிராமம்"],
  ulagam: ["உலகம்"],
  ulaga: ["உலக"],
  vaanam: ["வானம்"],
  parathesam: ["பரதேசம்"],
  parathesi: ["பரதேசி"],
  parakkam: ["பரக்கம்"],
  pumi: ["பூமி"],
  bhoomi: ["பூமி"],
  sorgam: ["சொர்க்கம்"],
  varam_place: ["வாரம்"],
  desathai: ["தேசத்தை"],
  desathukku: ["தேசத்துக்கு"],
  // ── Verbs related to relationship with God ───────────────────────────
  kartharai: ["கர்த்தரை"],
  kartharukku: ["கர்த்தருக்கு"],
  kartharin: ["கர்த்தரின்"],
  kartharudaiya: ["கர்த்தருடைய"],
  kartharum: ["கர்த்தரும்"],
  yesuvai: ["யேசுவை", "இயேசுவை"],
  yesuvin: ["யேசுவின்", "இயேசுவின்"],
  yesuvukku: ["யேசுவுக்கு", "இயேசுவுக்கு"],
  yesuvudan: ["யேசுவுடன்"],
  devanai: ["தேவனை"],
  devanin: ["தேவனின்"],
  devanudaiya: ["தேவனுடைய"],
  devanukku: ["தேவனுக்கு"],
  devanodu: ["தேவனோடு"],
  thevanai: ["தேவனை"],
  thevanin: ["தேவனின்"],
  // ── Common particles / connectors ───────────────────────────────────
  matrum: ["மற்றும்"],
  aanal: ["ஆனால்"],
  aana: ["ஆனா", "ஆனால்"],
  illana: ["இல்லைனா", "இல்லையென்றால்"],
  illayel: ["இல்லையேல்"],
  pinnar: ["பின்னர்"],
  munpu: ["முன்பு"],
  pinpu: ["பின்பு"],
  poludhu: ["பொழுது"],
  pothilum: ["போதிலும்"],
  pothum: ["போதும்"],
  pothume: ["போதுமே"],
  poge: ["போகே"],
  kude: ["கூடே", "கூட"],
  kooda: ["கூட"],
  oodu: ["ஓடு"],
  innum: ["இன்னும்"],
  innumkooda: ["இன்னும் கூட"],
  yellam: ["எல்லாம்"],
  ellam: ["எல்லாம்"],
  ellorum: ["எல்லோரும்"],
  yellorum: ["எல்லோரும்"],
  ovvonna: ["ஒவ்வொன்னா", "ஒவ்வொன்றாக"],
  ovvoru: ["ஒவ்வொரு"],
  vendam: ["வேண்டாம்"],
  vendum: ["வேண்டும்"],
  venumna: ["வேணும்னா"],
  venum: ["வேணும்", "வேண்டும்"],
  alada: ["அல்லாத"],
  illadha: ["இல்லாத"],
  illama: ["இல்லாமா", "இல்லாமல்"],
  illamal: ["இல்லாமல்"],
  aagavum: ["ஆகவும்"],
  aagave: ["ஆகவே"],
  aanapadiyaal: ["ஆனபடியால்"],
  aakavae: ["ஆகவே"],
  ena: ["என"],
  enaivve: ["எனவே"],
  enavae: ["எனவே"],
  // ── Greetings / phrases ──────────────────────────────────────────────
  vaazhthukkal: ["வாழ்த்துக்கள்"],
  vazhthukkal: ["வாழ்த்துக்கள்"],
  vazhthu: ["வாழ்த்து"],
  nanri: ["நன்றி"],
  manippu_n: ["மன்னிப்பு"],
  mannippom: ["மன்னிப்போம்"],
  mannikkavum: ["மன்னிக்கவும்"],
  mannithu: ["மன்னித்து"],
  vidaipei: ["விடைபெய்"],
  vidaipeyiren: ["விடைபெறுகிறேன்"],
  sandhippom: ["சந்திப்போம்"],
  paarpom: ["பார்ப்போம்"],
  // ── Announcement / meeting vocabulary ───────────────────────────────
  arivippu: ["அறிவிப்பு"],
  arivippugal: ["அறிவிப்புகள்"],
  arivikkappadugiradhu: ["அறிவிக்கப்படுகிறது"],
  thakaval: ["தகவல்"],
  seithi: ["செய்தி"],
  arikkai: ["அறிக்கை"],
  kuripugal: ["குறிப்புகள்"],
  agendaa: ["நிகழ்ச்சி நிரல்"],
  niraivu: ["நிறைவு"],
  niraiveetham: ["நிறைவேற்றம்"],
  niraivetru: ["நிறைவேற்று"],
  thodakkam: ["தொடக்கம்"],
  mudivu: ["முடிவு"],
  mudippom: ["முடிப்போம்"],
  thodanguvom: ["தொடங்குவோம்"],
  thodangugiradhu: ["தொடங்குகிறது"],
  itruvarai: ["இதுவரை"],
  varuvai: ["வருகை"],
  varugai: ["வருகை"],
  varuga: ["வருக"],
  varugaibura: ["வருகைபுரிய"],
  visehsamaaga: ["விசேஷமாக"],
  visegamana: ["விசேஷமான"],
  vishesamana: ["விசேஷமான"],
  pirathana: ["பிரதான"],
  pradhana: ["பிரதான"],
  mukkiyamana: ["முக்கியமான"],
  mukkiyam: ["முக்கியம்"],
  thavarakudathu: ["தவறக்கூடாது"],
  kalanthukolla: ["கலந்துகொள்ள"],
  kalanthukollavum: ["கலந்துகொள்ளவும்"],
  anaivarum: ["அனைவரும்"],
  anaivarukum: ["அனைவருக்கும்"],
  ellarum: ["எல்லாரும்"],
  varavendum: ["வரவேண்டும்"],
  varuga_imp: ["வருக"],
  // ── Family / relations ──────────────────────────────────────────────
  kudumbam: ["குடும்பம்"],
  kudumba: ["குடும்ப"],
  thaai: ["தாய்"],
  thanthai: ["தந்தை"],
  thandai: ["தந்தை"],
  thandhai: ["தந்தை"],
  magan: ["மகன்"],
  magal: ["மகள்"],
  makkal_sv: ["மக்கள்"],
  nanban: ["நண்பன்"],
  nanbar: ["நண்பர்"],
  nanbargal: ["நண்பர்கள்"],
  paethaan: ["பேரன்"],
  pethi: ["பேத்தி"],
  // ── Often-used short particles ──────────────────────────────────────
  oh: ["ஓ"],
  aam: ["ஆம்"],
  ille: ["இல்ல", "இல்லை"],
  illa: ["இல்ல", "இல்லை"],
  illey: ["இல்லை"],
  sari: ["சரி"],
  saridhan: ["சரிதான்"],
  sariyana: ["சரியான"],
  thavaru: ["தவறு"],
  thavaraana: ["தவறான"],
  unmaiyile: ["உண்மையிலே"],
  meyyaai: ["மெய்யாய்"],
  uyyaai: ["உய்யாய்"]
};
let MERGED = null;
let PREFIX_INDEX = null;
let KEYS_BY_LEN = null;
function normalize(key) {
  return key.toLowerCase().replace(/(.)\1+/g, "$1").replace(/h(?=[^aeiou]|$)/g, "").replace(/[^a-z]/g, "");
}
function buildIndex() {
  MERGED = /* @__PURE__ */ new Map();
  PREFIX_INDEX = /* @__PURE__ */ new Map();
  KEYS_BY_LEN = /* @__PURE__ */ new Map();
  const add = (key, candidates, source) => {
    const lk = key.toLowerCase();
    const existing = MERGED.get(lk);
    if (existing) {
      const merged = existing.source === "church" ? existing.candidates : candidates;
      const extras = existing.source === "church" ? candidates : existing.candidates;
      const seen = new Set(merged);
      for (const c of extras) if (!seen.has(c)) merged.push(c);
      MERGED.set(lk, { candidates: merged, source: existing.source });
      return;
    }
    MERGED.set(lk, { candidates: [...candidates], source });
    for (let i = 1; i <= Math.min(lk.length, 6); i++) {
      const p = lk.slice(0, i);
      const arr = PREFIX_INDEX.get(p);
      if (arr) arr.push(lk);
      else PREFIX_INDEX.set(p, [lk]);
    }
    const len = lk.length;
    const bucket = KEYS_BY_LEN.get(len);
    if (bucket) bucket.push(lk);
    else KEYS_BY_LEN.set(len, [lk]);
  };
  for (const [k, v] of Object.entries(CHURCH_DICTIONARY)) add(k, v, "church");
  for (const [k, v] of Object.entries(TAMIL_CORPUS)) add(k, v, "corpus");
}
function ensure() {
  if (!MERGED) buildIndex();
}
function bounded(a, b, max) {
  const al = a.length;
  const bl = b.length;
  if (Math.abs(al - bl) > max) return Infinity;
  let prev = new Array(bl + 1);
  let curr = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) prev[j] = j;
  for (let i = 1; i <= al; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= bl; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return Infinity;
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }
  return prev[bl];
}
function lookup(key) {
  ensure();
  const lk = key.toLowerCase();
  const hit = MERGED.get(lk);
  if (hit) return hit.candidates;
  const nk = normalize(lk);
  if (nk && nk !== lk) {
    const hit2 = MERGED.get(nk);
    if (hit2) return hit2.candidates;
  }
  return null;
}
function suggest(prefix, limit = 6) {
  const p = (prefix ?? "").toLowerCase().trim();
  if (!p) return [];
  ensure();
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const push = (tamil, key, score, source) => {
    if (seen.has(tamil)) return;
    seen.add(tamil);
    out.push({ tamil, key, score, source });
  };
  const sourceBoost = (s) => s === "church" ? 0 : 0.1;
  const exact = MERGED.get(p);
  if (exact)
    for (const t of exact.candidates) push(t, p, 0 + sourceBoost(exact.source), exact.source);
  const np = normalize(p);
  if (np && np !== p) {
    const nh = MERGED.get(np);
    if (nh) for (const t of nh.candidates) push(t, np, 0.5 + sourceBoost(nh.source), nh.source);
  }
  const idxKey = p.slice(0, Math.min(p.length, 6));
  const prefixKeys = PREFIX_INDEX.get(idxKey) ?? [];
  prefixKeys.sort((a, b) => a.length - b.length || a.localeCompare(b));
  for (const k of prefixKeys) {
    if (k === p) continue;
    const entry = MERGED.get(k);
    if (!entry) continue;
    for (const t of entry.candidates) push(t, k, 1 + sourceBoost(entry.source), entry.source);
    if (out.length >= limit * 2) break;
  }
  if (out.length < limit && p.length >= 3) {
    const max = p.length <= 4 ? 1 : 2;
    for (let len = p.length - max; len <= p.length + max; len++) {
      const bucket = KEYS_BY_LEN.get(len);
      if (!bucket) continue;
      for (const k of bucket) {
        if (seen.size >= limit * 3) break;
        const d = bounded(p, k, max);
        if (d === Infinity) continue;
        const entry = MERGED.get(k);
        if (!entry) continue;
        for (const t of entry.candidates)
          push(t, k, 2 + d + sourceBoost(entry.source), entry.source);
      }
    }
  }
  return out.sort((a, b) => a.score - b.score).slice(0, limit);
}
Object.fromEntries(
  Object.entries(CHURCH_DICTIONARY).map(([k, v]) => [k, v[0]])
);
const VOWELS_INDEP = [
  ["aa", "ஆ"],
  ["ee", "ஏ"],
  ["ii", "ஈ"],
  ["oo", "ஓ"],
  ["uu", "ஊ"],
  ["ai", "ஐ"],
  ["au", "ஔ"],
  ["a", "அ"],
  ["i", "இ"],
  ["u", "உ"],
  ["e", "எ"],
  ["o", "ஒ"]
];
const VOWEL_SIGNS = {
  a: "",
  aa: "ா",
  i: "ி",
  ii: "ீ",
  u: "ு",
  uu: "ூ",
  e: "ெ",
  ee: "ே",
  ai: "ை",
  o: "ொ",
  oo: "ோ",
  au: "ௌ"
};
const CONSONANTS = [
  ["zh", "ழ"],
  ["ng", "ங"],
  ["nj", "ஞ"],
  ["ch", "ச"],
  ["sh", "ஷ"],
  ["th", "த"],
  ["dh", "த"],
  ["kh", "க"],
  ["gh", "க"],
  ["ph", "ப"],
  ["k", "க"],
  ["g", "க"],
  ["c", "ச"],
  ["j", "ஜ"],
  ["s", "ஸ"],
  ["t", "ட"],
  ["d", "ட"],
  ["n", "ன"],
  ["p", "ப"],
  ["b", "ப"],
  ["m", "ம"],
  ["y", "ய"],
  ["r", "ர"],
  ["l", "ல"],
  ["v", "வ"],
  ["w", "வ"],
  ["h", "ஹ"],
  ["f", "ப"],
  ["z", "ஜ"],
  ["q", "க"],
  ["x", "க்ஸ"]
];
const PULLI = "்";
function matchAt(s, i, table) {
  for (const [pat, out] of table) if (s.startsWith(pat, i)) return [pat, out];
  return null;
}
function matchVowelKey(s, i) {
  for (const [pat] of VOWELS_INDEP) if (s.startsWith(pat, i)) return [pat, pat];
  return null;
}
function phoneticToTamil(word) {
  const s = word.toLowerCase();
  let out = "";
  let i = 0;
  while (i < s.length) {
    const cons = matchAt(s, i, CONSONANTS);
    if (cons) {
      const [cpat, cout] = cons;
      i += cpat.length;
      const v = matchVowelKey(s, i);
      if (v) {
        const [vpat, vkey] = v;
        out += cout + (VOWEL_SIGNS[vkey] ?? "");
        i += vpat.length;
      } else {
        out += cout + PULLI;
      }
      continue;
    }
    const vowel = matchAt(s, i, VOWELS_INDEP);
    if (vowel) {
      const [vpat, vout] = vowel;
      out += vout;
      i += vpat.length;
      continue;
    }
    out += s[i];
    i += 1;
  }
  return out;
}
const ASCII_WORD = /^[a-zA-Z][a-zA-Z']*$/;
function convertWord(word) {
  if (!word) return word;
  if (!ASCII_WORD.test(word)) return word;
  const lower = word.toLowerCase();
  const exact = lookup(lower);
  if (exact && exact[0]) return exact[0];
  if (lower.length >= 3) {
    const ranked = suggest(lower, 1);
    if (ranked.length && ranked[0].score <= 3) return ranked[0].tamil;
  }
  return phoneticToTamil(lower);
}
function convertText(text) {
  if (!text) return text;
  return text.replace(/[A-Za-z][A-Za-z']*/g, (m) => convertWord(m));
}
function convertCompleted(text) {
  if (!text) return { converted: "", trailing: "" };
  const match = /[A-Za-z][A-Za-z']*$/.exec(text);
  if (!match) return { converted: convertText(text), trailing: "" };
  const cut = match.index;
  const head = text.slice(0, cut);
  const tail = text.slice(cut);
  return { converted: convertText(head), trailing: tail };
}
function lev(a, b, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
      if (dp[j] < rowMin) rowMin = dp[j];
    }
    if (rowMin > max) return max + 1;
  }
  return dp[b.length];
}
function searchTextItems(items, query, recentIds) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...items].sort((a, b) => b.updatedAt - a.updatedAt).map((item) => ({ item, score: 0 }));
  }
  const qTamil = /[A-Za-z]/.test(q) ? convertCompleted(q).converted : "";
  const hits = [];
  for (const it of items) {
    const title = it.title.toLowerCase();
    const content = it.content.toLowerCase();
    let score = 0;
    if (title === q) score += 100;
    else if (title.startsWith(q)) score += 60;
    else if (title.includes(q)) score += 40;
    if (content.includes(q)) score += 20;
    if (qTamil) {
      if (it.title.includes(qTamil)) score += 50;
      if (it.content.includes(qTamil)) score += 25;
    }
    if (score === 0) {
      const titleWords = title.split(/\s+/);
      for (const w of titleWords) {
        if (lev(w, q, 2) <= 2) {
          score += 15;
          break;
        }
      }
    }
    if (score > 0) {
      if (recentIds.has(it.id)) score += 5;
      if (it.favorite) score += 3;
      hits.push({ item: it, score });
    }
  }
  return hits.sort((a, b) => b.score - a.score || b.item.updatedAt - a.item.updatedAt);
}
const FILTER_LABELS = {
  all: "All Texts",
  favorites: "Favorites",
  recent: "Recently Used"
};
const MODE_LABELS = {
  english: "English",
  tamil: "Tamil",
  tanglish: "Tanglish → தமிழ்"
};
const MODE_SHORT = {
  english: "EN",
  tamil: "தமிழ்",
  tanglish: "Tang→த"
};
const BOUNDARY_RE = /[\s.,;:!?()[\]{}"'\u0964\u0965/\\-]/;
function formatAgo(ts) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1e3));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}
const STARTER_SAMPLES = [
  { title: "Welcome", content: "Welcome to our service\n\nMay God bless you abundantly" },
  {
    title: "Prayer Points",
    content: "Pray for the sick\n\nPray for the nation\n\nPray for revival"
  }
];
function TextPanel() {
  const items = useTextItems((s) => s.items);
  const recents = useTextItems((s) => s.recents);
  const create2 = useTextItems((s) => s.create);
  const update = useTextItems((s) => s.update);
  const remove = useTextItems((s) => s.remove);
  const duplicate = useTextItems((s) => s.duplicate);
  const toggleFavorite = useTextItems((s) => s.toggleFavorite);
  const pushRecent = useTextItems((s) => s.pushRecent);
  const projectedText = useProjection((s) => s.state?.textOverlay?.text ?? null);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [query, setQuery] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const [activeSlide, setActiveSlide] = reactExports.useState(0);
  const [draftTitle, setDraftTitle] = reactExports.useState("");
  const [draftContent, setDraftContent] = reactExports.useState("");
  const [typingMode, setTypingMode] = reactExports.useState("english");
  const [savedAt, setSavedAt] = reactExports.useState(null);
  const [savingPending, setSavingPending] = reactExports.useState(false);
  const [, forceTick] = reactExports.useState(0);
  const textareaRef = reactExports.useRef(null);
  const handleContentChange = (e) => {
    const next = e.target.value;
    const caret = e.target.selectionStart ?? next.length;
    setSavingPending(true);
    if (typingMode !== "tanglish") {
      setDraftContent(next);
      return;
    }
    const tailFromCaret = next.length - caret;
    const justTypedBoundary = caret > 0 && BOUNDARY_RE.test(next.charAt(caret - 1)) && next.length >= draftContent.length;
    if (!justTypedBoundary) {
      setDraftContent(next);
      return;
    }
    const head = next.slice(0, caret);
    const tail = next.slice(caret);
    const { converted, trailing } = convertCompleted(head);
    const newHead = converted + trailing;
    const newValue = newHead + tail;
    setDraftContent(newValue);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      const pos = newValue.length - tailFromCaret;
      el.setSelectionRange(pos, pos);
    });
  };
  const selected = reactExports.useMemo(
    () => items.find((it) => it.id === selectedId) ?? null,
    [items, selectedId]
  );
  reactExports.useEffect(() => {
    if (selected) {
      setDraftTitle(selected.title);
      setDraftContent(selected.content);
      setActiveSlide(0);
      setSavedAt(selected.updatedAt);
      setSavingPending(false);
    } else {
      setDraftTitle("");
      setDraftContent("");
      setSavedAt(null);
      setSavingPending(false);
    }
  }, [selectedId]);
  reactExports.useEffect(() => {
    if (!selected) return;
    if (draftTitle === selected.title && draftContent === selected.content) {
      setSavingPending(false);
      return;
    }
    const t = setTimeout(() => {
      update(selected.id, { title: draftTitle.trim() || "Untitled", content: draftContent });
      setSavedAt(Date.now());
      setSavingPending(false);
    }, 2e3);
    return () => clearTimeout(t);
  }, [draftTitle, draftContent, selected, update]);
  reactExports.useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 15e3);
    return () => clearInterval(t);
  }, []);
  const visible = reactExports.useMemo(() => {
    const recentIds = new Set(recents.map((r) => r.itemId));
    let pool = items;
    if (filter === "favorites") pool = pool.filter((it) => it.favorite);
    else if (filter === "recent") pool = pool.filter((it) => recentIds.has(it.id));
    return searchTextItems(pool, query, recentIds).map((h) => h.item);
  }, [items, recents, filter, query]);
  const slides = reactExports.useMemo(() => splitTextSlides(draftContent), [draftContent]);
  const handleNew = () => {
    const id = create2({ title: "Untitled", content: "" });
    setSelectedId(id);
  };
  const handleStarter = (sample) => {
    const id = create2(sample);
    setSelectedId(id);
  };
  const handleDuplicate = () => {
    if (!selected) return;
    const id = duplicate(selected.id);
    if (id) setSelectedId(id);
  };
  const handleDelete = (it) => {
    if (!confirm(`Delete "${it.title}"?`)) return;
    remove(it.id);
    if (selectedId === it.id) setSelectedId(null);
  };
  const project = (i) => {
    if (!selected) return;
    const text = slides[i];
    if (!text) return;
    projectTextSlide({
      itemId: selected.id,
      slideIndex: i,
      totalSlides: slides.length,
      title: selected.title,
      text
    });
    setActiveSlide(i);
    pushRecent(selected.id, i);
    toast.success(`${selected.title} · slide ${i + 1}`);
  };
  const projectAll = async () => {
    if (!selected || slides.length === 0) return;
    for (let i = 0; i < slides.length; i++) {
      project(i);
      await new Promise((r) => setTimeout(r, 80));
    }
    toast.success(`Queued ${slides.length} slides`);
  };
  useShortcut({
    id: "text.project-current",
    label: "Project current text slide",
    category: "text",
    keys: ["Ctrl+Enter", "Meta+Enter"],
    scope: "workspace",
    allowInInput: true,
    handler: () => {
      if (selected && slides.length) project(activeSlide);
    }
  });
  useShortcut({
    id: "text.project-all",
    label: "Project all text slides in sequence",
    category: "text",
    keys: ["Ctrl+Shift+Enter", "Meta+Shift+Enter"],
    scope: "workspace",
    allowInInput: true,
    handler: () => {
      void projectAll();
    }
  });
  useShortcut({
    id: "text.duplicate",
    label: "Duplicate current text item",
    category: "text",
    keys: ["Ctrl+D", "Meta+D"],
    scope: "workspace",
    allowInInput: true,
    handler: () => {
      if (selected) handleDuplicate();
    }
  });
  const saveLabel = !selected ? null : savingPending ? "Saving…" : savedAt ? `Saved · ${formatAgo(savedAt)}` : "Saved";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "@container flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 border-b border-border bg-muted/20 px-2 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-4 w-4 shrink-0 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[160px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Search text items…",
            className: "h-8 pl-7 text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            title: "Filter",
            className: cn(
              "inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border border-border px-2 text-xs font-medium transition hover:bg-accent",
              filter !== "all" && "border-primary/50 bg-primary/10 text-primary"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden @sm:inline", children: FILTER_LABELS[filter] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          ["all", "favorites", "recent"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            DropdownMenuItem,
            {
              onClick: () => setFilter(f),
              className: cn("text-xs", filter === f && "bg-accent font-semibold text-primary"),
              children: FILTER_LABELS[f]
            },
            f
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleNew,
          title: "New text",
          className: "inline-flex h-8 cursor-pointer items-center gap-1 rounded-md bg-primary px-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " New"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid h-full min-h-0 grid-cols-1 @lg:grid-cols-[minmax(220px,1fr)_minmax(280px,1.4fr)_minmax(260px,1.2fr)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 overflow-y-auto border-r border-border", children: visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-7 w-7 opacity-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground/70", children: "No text items yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Create one or start from a sample:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1 pt-1", children: STARTER_SAMPLES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleStarter(s),
            className: "cursor-pointer rounded border border-dashed border-border px-2 py-1 text-[11px] text-foreground/80 hover:bg-accent",
            children: s.title
          },
          s.title
        )) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: visible.map((it) => {
        const isSel = selectedId === it.id;
        const slidesCount = splitTextSlides(it.content).length || 1;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            onClick: () => setSelectedId(it.id),
            className: cn(
              "group cursor-pointer px-3 py-2 transition hover:bg-accent/60",
              isSel ? "bg-primary/10 border-l-[3px] border-l-primary pl-[9px]" : "border-l-[3px] border-l-transparent"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "truncate text-[13px] font-semibold",
                      isSel ? "text-primary" : "text-foreground"
                    ),
                    children: it.title
                  }
                ),
                it.favorite && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 shrink-0 fill-amber-500 text-amber-500" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[11px] text-muted-foreground", children: it.content.split("\n").find((l) => l.trim()) ?? "Empty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  slidesCount,
                  " slide",
                  slidesCount === 1 ? "" : "s"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        toggleFavorite(it.id);
                      },
                      title: it.favorite ? "Unfavorite" : "Favorite",
                      className: cn(
                        "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded",
                        it.favorite ? "text-amber-500" : "text-muted-foreground hover:bg-accent"
                      ),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-3 w-3", it.favorite && "fill-current") })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        const id = duplicate(it.id);
                        if (id) setSelectedId(id);
                      },
                      title: "Duplicate",
                      className: "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-accent",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        handleDelete(it);
                      },
                      title: "Delete",
                      className: "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded text-destructive hover:bg-destructive/10",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                    }
                  )
                ] })
              ] })
            ]
          },
          it.id
        );
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full min-h-0 flex-col border-r border-border", children: !selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-8 w-8 opacity-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground/70", children: "No text selected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: "Select an item on the left or create a new one." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border bg-muted/20 px-2 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: draftTitle,
              onChange: (e) => {
                setDraftTitle(e.target.value);
                setSavingPending(true);
              },
              placeholder: "Title",
              className: "h-8 flex-1 text-sm font-semibold"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                title: `Typing mode: ${MODE_LABELS[typingMode]}`,
                className: cn(
                  "inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border border-border px-2 text-[11px] font-semibold transition hover:bg-accent",
                  typingMode === "tanglish" && "border-primary/60 bg-primary/10 text-primary"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "h-3.5 w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: MODE_SHORT[typingMode] })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Typing mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
              ["english", "tamil", "tanglish"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                DropdownMenuItem,
                {
                  onClick: () => setTypingMode(m),
                  className: cn(
                    "text-xs",
                    typingMode === m && "bg-accent font-semibold text-primary"
                  ),
                  children: [
                    MODE_LABELS[m],
                    m === "tanglish" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground", children: "auto-convert" })
                  ]
                },
                m
              ))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleDuplicate,
              title: "Duplicate (Ctrl+D)",
              className: "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => handleDelete(selected),
              title: "Delete",
              className: "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-destructive hover:bg-destructive/10",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => toggleFavorite(selected.id),
              title: selected.favorite ? "Unfavorite" : "Favorite",
              className: cn(
                "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md",
                selected.favorite ? "text-amber-500" : "text-muted-foreground hover:bg-accent"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-3.5 w-3.5", selected.favorite && "fill-current") })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex min-h-0 flex-1 flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            ref: textareaRef,
            value: draftContent,
            onChange: handleContentChange,
            placeholder: typingMode === "tanglish" ? "Type Tanglish — e.g. yesu, karthar, jebam.\nWords auto-convert to Tamil on space.\n\nBlank line = new slide." : "Type or paste content…\n\nSeparate slides with a blank line.",
            className: cn(
              "flex-1 resize-none rounded-none border-0 font-sans text-[14px] leading-relaxed focus-visible:ring-0",
              typingMode === "tamil" && "text-[15px]"
            ),
            lang: typingMode === "english" ? "en" : "ta"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-x-3 border-t border-border bg-muted/10 px-2 py-1 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground/80", children: slides.length }),
            " slide",
            slides.length === 1 ? "" : "s"
          ] }),
          saveLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: cn(
                "ml-auto inline-flex items-center gap-1 rounded px-1.5 py-px",
                savingPending ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-600"
              ),
              children: [
                !savingPending && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
                saveLabel
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full min-h-0 flex-col", children: !selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-8 w-8 opacity-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground/70", children: "No slides yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: "Slide previews appear here." })
      ] }) : slides.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-8 w-8 opacity-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: "Start typing to generate slides." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto p-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3", children: slides.map((s, i) => {
        const isActive = activeSlide === i;
        const isProjected = !!projectedText && projectedText.startsWith(s.slice(0, 24));
        const lineCount = s.split("\n").length;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => {
              setActiveSlide(i);
              project(i);
            },
            className: cn(
              "group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-lg border-2 bg-card/80 transition-all",
              "hover:-translate-y-px hover:border-primary/70 hover:shadow-md",
              isProjected ? "border-primary ring-2 ring-primary/40" : isActive ? "border-primary/60" : "border-border"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Slide ",
                  i + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/60", children: [
                  "· ",
                  lineCount,
                  " line",
                  lineCount === 1 ? "" : "s"
                ] }),
                isProjected && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto inline-flex items-center gap-1 rounded bg-primary px-1.5 py-px text-[9px] text-primary-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 animate-pulse rounded-full bg-primary-foreground" }),
                  " ",
                  "Live"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "flex-1 whitespace-pre-wrap break-words px-3 py-2.5 font-sans text-[14px] leading-relaxed", children: s }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end border-t border-border/40 bg-muted/20 px-2 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    project(i);
                  },
                  className: "inline-flex items-center gap-1 rounded bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3" }),
                    " Project"
                  ]
                }
              ) })
            ]
          },
          i
        );
      }) }) }) })
    ] }) })
  ] });
}
const TABS = [
  { id: "media", label: "Media", icon: Image$1, focus: "media", shortcutId: "tab.media" },
  { id: "bible", label: "Bible", icon: BookOpen, focus: "bible", shortcutId: "tab.bible" },
  { id: "songs", label: "Songs", icon: Music, focus: "songs", shortcutId: "tab.songs" },
  { id: "text", label: "Text", icon: Type, focus: "text", shortcutId: "tab.text" }
];
function WorkspaceTabsPanel() {
  const { activeTab, setActiveTab } = useWorkspace();
  const collapsed = useWorkspace((s) => s.tabsCollapsed);
  const toggleCollapsed = useWorkspace((s) => s.toggleTabsCollapsed);
  const active = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const focus = useFocusZone(active.focus);
  useShortcutScope("bible", activeTab === "bible");
  useShortcutScope("songs", activeTab === "songs");
  if (collapsed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full w-12 flex-col items-center gap-1 border-l border-border bg-card py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: toggleCollapsed,
          title: "Expand workspace",
          "aria-label": "Expand workspace",
          className: "mb-1 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(PanelRightOpen, { className: "h-4 w-4" })
        }
      ),
      TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabRailButton,
        {
          tab: t,
          isActive: t.id === activeTab,
          onClick: () => {
            setActiveTab(t.id);
            toggleCollapsed();
          }
        },
        t.id
      ))
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex h-full min-h-0 flex-col bg-card",
        focus.isActive && "ring-1 ring-primary/40"
      ),
      onFocus: focus.onFocus,
      onMouseDown: focus.onFocus,
      tabIndex: focus.tabIndex,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-9 shrink-0 items-center gap-0.5 border-b border-border bg-muted/30 px-1", children: [
          TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabBarButton,
            {
              tab: t,
              isActive: t.id === activeTab,
              onClick: () => setActiveTab(t.id)
            },
            t.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: toggleCollapsed,
              title: "Collapse workspace",
              "aria-label": "Collapse workspace",
              className: "ml-auto inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PanelRightClose, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-0 flex-1 overflow-hidden", children: [
          activeTab === "media" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LibraryPage, {}) }),
          activeTab === "bible" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BiblePanel, {}) }),
          activeTab === "songs" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SongsPanel, {}) }),
          activeTab === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextPanel, {}) })
        ] })
      ]
    }
  );
}
function TabRailButton({
  tab,
  isActive,
  onClick
}) {
  const tooltip = useShortcutTooltip(tab.shortcutId, tab.label);
  const Icon = tab.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      title: tooltip,
      "aria-label": tooltip,
      className: cn(
        "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" })
    }
  );
}
function TabBarButton({
  tab,
  isActive,
  onClick
}) {
  const tooltip = useShortcutTooltip(tab.shortcutId, tab.label);
  const Icon = tab.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      title: tooltip,
      "aria-label": tooltip,
      className: cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition",
        isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
        tab.label
      ]
    }
  );
}
const LAYOUT_KEYS = {
  leftWidth: "church-media-ws-left-width-v3",
  left: "church-media-ws-left-v2"
};
const TEXT_FORMAT_COLLAPSED_SIZE = 6;
const TEXT_FORMAT_DEFAULT_SIZE = 40;
const LEFT_DEFAULT_WIDTH = 250;
const LEFT_MIN_WIDTH = 200;
const RIGHT_MIN_WIDTH = 320;
const TABS_COLLAPSED_WIDTH = 48;
function readLayout(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return void 0;
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function writeLayout(key, layout) {
  try {
    localStorage.setItem(key, JSON.stringify(layout));
  } catch {
  }
}
function readSavedLeftWidth() {
  try {
    const raw = localStorage.getItem(LAYOUT_KEYS.leftWidth);
    if (!raw) return void 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function writeLeftWidth(width) {
  try {
    localStorage.setItem(LAYOUT_KEYS.leftWidth, String(Math.round(width)));
  } catch {
  }
}
function ProjectionWorkspace() {
  const { visible, togglePanel, showPanel } = useWorkspace();
  const textFormatCollapsed = useWorkspace((s) => s.textFormatCollapsed);
  const setTextFormatCollapsed = useWorkspace((s) => s.setTextFormatCollapsed);
  const tabsCollapsed = useWorkspace((s) => s.tabsCollapsed);
  const [resetNonce, setResetNonce] = reactExports.useState(0);
  const [leftWidthDefault, setLeftWidthDefault] = reactExports.useState(
    () => readSavedLeftWidth() ?? LEFT_DEFAULT_WIDTH
  );
  const [isDraggingHorizontal, setIsDraggingHorizontal] = reactExports.useState(false);
  const workspaceRef = reactExports.useRef(null);
  const init = useProjection((s) => s.init);
  const send = useProjection((s) => s.send);
  reactExports.useEffect(() => {
    init();
    send({ type: "PING" });
  }, [init, send]);
  const savedLeft = reactExports.useMemo(() => readLayout(LAYOUT_KEYS.left), []);
  const allHidden = !visible.preview && !visible.textFormat && !visible.tabs;
  const leftVisible = visible.preview || visible.textFormat;
  const leftLayout = visible.preview && visible.textFormat ? savedLeft : void 0;
  const outerKey = `outer-${leftVisible ? 1 : 0}-${visible.tabs ? 1 : 0}-${tabsCollapsed ? "c" : "o"}`;
  const leftKey = `left-${visible.preview ? 1 : 0}-${visible.textFormat ? 1 : 0}-${resetNonce}`;
  const rightWidth = visible.tabs && tabsCollapsed ? TABS_COLLAPSED_WIDTH : void 0;
  const textFormatPanelRef = reactExports.useRef(null);
  const didHydrateRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!didHydrateRef.current) {
      didHydrateRef.current = true;
      return;
    }
    const p = textFormatPanelRef.current;
    if (!p) return;
    try {
      if (textFormatCollapsed && !p.isCollapsed()) p.collapse();
      if (!textFormatCollapsed && p.isCollapsed()) p.expand();
    } catch {
    }
  }, [textFormatCollapsed, visible.textFormat, visible.preview]);
  const startHorizontalDrag = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDraggingHorizontal(true);
    const updateWidth = (clientX) => {
      const workspace = workspaceRef.current;
      if (!workspace) return;
      const bounds = workspace.getBoundingClientRect();
      const reservedRightWidth = visible.tabs && tabsCollapsed ? TABS_COLLAPSED_WIDTH : visible.tabs ? RIGHT_MIN_WIDTH : 0;
      const maxLeftWidth = Math.max(LEFT_MIN_WIDTH, bounds.width - reservedRightWidth);
      const nextWidth = Math.min(Math.max(clientX - bounds.left, LEFT_MIN_WIDTH), maxLeftWidth);
      setLeftWidthDefault(nextWidth);
      writeLeftWidth(nextWidth);
    };
    updateWidth(event.clientX);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onPointerMove = (moveEvent) => updateWidth(moveEvent.clientX);
    const stopDragging = () => {
      setIsDraggingHorizontal(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDragging, { once: true });
    window.addEventListener("pointercancel", stopDragging, { once: true });
  };
  const resetLayout = () => {
    try {
      localStorage.removeItem(LAYOUT_KEYS.leftWidth);
      localStorage.removeItem("church-media-ws-outer-v2");
      localStorage.removeItem(LAYOUT_KEYS.left);
    } catch {
    }
    useWorkspace.setState({
      visible: { preview: true, textFormat: true, tabs: true },
      textFormatCollapsed: false,
      tabsCollapsed: false
    });
    setLeftWidthDefault(LEFT_DEFAULT_WIDTH);
    setResetNonce((n) => n + 1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FocusManagerProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-10 shrink-0 items-center gap-1 border-b border-border bg-muted/20 px-2 pr-44", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DockButton,
        {
          label: "Preview",
          icon: MonitorPlay,
          active: visible.preview,
          onClick: () => togglePanel("preview")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DockButton,
        {
          label: "Text",
          icon: Type,
          active: visible.textFormat,
          onClick: () => togglePanel("textFormat")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DockButton,
        {
          label: "Tabs",
          icon: LayoutGrid,
          active: visible.tabs,
          onClick: () => togglePanel("tabs")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: resetLayout,
          className: "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground",
          title: "Reset Workspace Layout to defaults",
          children: "Reset Layout"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 flex-1", children: allHidden ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyDock, { onShow: showPanel, visible }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: workspaceRef, className: "flex h-full min-w-0 overflow-hidden", children: [
      leftVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-workspace-left-panel": true,
          style: visible.tabs ? { width: leftWidthDefault, minWidth: LEFT_MIN_WIDTH } : { minWidth: LEFT_MIN_WIDTH },
          className: cn("min-h-0 min-w-0", visible.tabs ? "shrink-0" : "flex-1"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Xt,
            {
              orientation: "vertical",
              className: "h-full",
              defaultLayout: leftLayout,
              onLayoutChanged: (l) => {
                if (visible.preview && visible.textFormat) writeLayout(LAYOUT_KEYS.left, l);
              },
              children: [
                visible.preview && /* @__PURE__ */ jsxRuntimeExports.jsx(Zt, { id: "preview", defaultSize: 60, minSize: 8, className: "min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LivePreviewPanel, {}) }),
                visible.preview && visible.textFormat && /* @__PURE__ */ jsxRuntimeExports.jsx(VHandle, {}),
                visible.textFormat && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Zt,
                  {
                    id: "text-format",
                    panelRef: (handle) => {
                      textFormatPanelRef.current = handle;
                    },
                    defaultSize: textFormatCollapsed ? TEXT_FORMAT_COLLAPSED_SIZE : TEXT_FORMAT_DEFAULT_SIZE,
                    minSize: 6,
                    collapsible: true,
                    collapsedSize: TEXT_FORMAT_COLLAPSED_SIZE,
                    onResize: (size) => {
                      const isCollapsed = size.asPercentage <= TEXT_FORMAT_COLLAPSED_SIZE + 0.5;
                      if (isCollapsed !== textFormatCollapsed) {
                        setTextFormatCollapsed(isCollapsed);
                      }
                    },
                    className: "min-h-0",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextFormattingPanel, {})
                  }
                )
              ]
            },
            leftKey
          )
        }
      ),
      leftVisible && visible.tabs && /* @__PURE__ */ jsxRuntimeExports.jsx(HHandle, { onPointerDown: startHorizontalDrag, active: isDraggingHorizontal }),
      visible.tabs && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-workspace-right-panel": true,
          style: rightWidth ? { width: rightWidth, minWidth: rightWidth } : { minWidth: RIGHT_MIN_WIDTH },
          className: cn(
            "min-h-0 min-w-0 overflow-hidden",
            rightWidth ? "shrink-0" : "flex-1"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceTabsPanel, {})
        }
      )
    ] }, outerKey) })
  ] }) });
}
function DockButton({
  label,
  icon: Icon,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium transition",
        active ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
      ),
      title: active ? `Hide ${label}` : `Show ${label}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
        label,
        active ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3 opacity-60" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 opacity-60" })
      ]
    }
  );
}
function HHandle({
  onPointerDown,
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      role: "separator",
      "aria-orientation": "vertical",
      onPointerDown,
      className: cn(
        "relative w-1.5 shrink-0 cursor-col-resize bg-transparent transition hover:bg-primary/40",
        active && "bg-primary/60"
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" })
    }
  );
}
function VHandle() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(tn, { className: "relative h-1.5 bg-transparent transition data-[separator-state=hover]:bg-primary/40 data-[separator-state=drag]:bg-primary/60 hover:bg-primary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" }) });
}
function EmptyDock({
  onShow,
  visible
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "All panels are collapsed." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-2", children: [
      !visible.preview && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onShow("preview"),
          className: "cursor-pointer rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90",
          children: "Show Preview"
        }
      ),
      !visible.textFormat && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onShow("textFormat"),
          className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent",
          children: "Show Text Formatting"
        }
      ),
      !visible.tabs && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onShow("tabs"),
          className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent",
          children: "Show Workspace Tabs"
        }
      )
    ] })
  ] });
}
function ProjectionWindow() {
  const channelRef = reactExports.useRef(null);
  const [mode, setMode] = reactExports.useState("idle");
  const [items, setItems] = reactExports.useState([]);
  const [index, setIndex] = reactExports.useState(0);
  const [playing, setPlaying] = reactExports.useState(true);
  const [black, setBlack] = reactExports.useState(false);
  const [muted, setMuted] = reactExports.useState(false);
  const [volume, setVolume] = reactExports.useState(0.8);
  const [playbackRate, setPlaybackRate] = reactExports.useState(1);
  const [loop, setLoop] = reactExports.useState(false);
  const [videoReady, setVideoReady] = reactExports.useState(false);
  const [prevItem, setPrevItem] = reactExports.useState(null);
  const [transitioning, setTransitioning] = reactExports.useState(false);
  const [textOverlay, setTextOverlay] = reactExports.useState(null);
  const [textStyle, setTextStyle] = reactExports.useState(DEFAULT_TEXT_STYLE);
  const [groupedStyles, setGroupedStyles] = reactExports.useState(DEFAULT_GROUPED_STYLES);
  const [logo, setLogo] = reactExports.useState(null);
  const videoRef = reactExports.useRef(null);
  const timerRef = reactExports.useRef(null);
  const urlsRef = reactExports.useRef([]);
  const idleHideTimer = reactExports.useRef(null);
  const [cursorHidden, setCursorHidden] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onMove = () => {
      setCursorHidden(false);
      if (idleHideTimer.current) clearTimeout(idleHideTimer.current);
      idleHideTimer.current = window.setTimeout(() => setCursorHidden(true), 2e3);
    };
    window.addEventListener("mousemove", onMove);
    onMove();
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (idleHideTimer.current) clearTimeout(idleHideTimer.current);
    };
  }, []);
  reactExports.useEffect(() => {
    const ch = getChannel();
    channelRef.current = ch;
    ch.postMessage({ type: "PROJECTOR_OPEN" });
    const onUnload = () => ch.postMessage({ type: "PROJECTOR_CLOSED" });
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      ch.postMessage({ type: "PROJECTOR_CLOSED" });
      ch.close();
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);
  const broadcastState = reactExports.useCallback(() => {
    const cur2 = items[index];
    const v = videoRef.current;
    const state = {
      type: "STATE",
      mode,
      currentMediaId: cur2?.media.id ?? null,
      index,
      total: items.length,
      playing,
      black,
      muted,
      volume,
      playbackRate,
      loop,
      videoReady: cur2?.media.type === "video" ? videoReady : void 0,
      videoCurrentTime: v && cur2?.media.type === "video" ? v.currentTime : void 0,
      videoDurationMs: v && cur2?.media.type === "video" && isFinite(v.duration) ? v.duration * 1e3 : void 0,
      textOverlay,
      textStyle,
      groupedStyles,
      logo
    };
    channelRef.current?.postMessage(state);
  }, [
    mode,
    items,
    index,
    playing,
    black,
    muted,
    volume,
    playbackRate,
    loop,
    videoReady,
    textOverlay,
    textStyle,
    groupedStyles,
    logo
  ]);
  reactExports.useEffect(() => {
    broadcastState();
  }, [broadcastState]);
  reactExports.useEffect(() => {
    const cur2 = items[index];
    if (!cur2 || cur2.media.type !== "video") return;
    const id = window.setInterval(() => broadcastState(), 250);
    return () => clearInterval(id);
  }, [items, index, broadcastState]);
  const loadMediaUrl = async (m) => {
    const rec = await db().blobs.get(m.blobId);
    if (!rec) throw new Error("Missing blob");
    const url = URL.createObjectURL(rec.blob);
    urlsRef.current.push(url);
    return url;
  };
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const scheduleAdvance = reactExports.useCallback(
    (cur2) => {
      clearTimer();
      if (!cur2 || !playing) return;
      if (cur2.media.type === "image" && items.length > 1) {
        timerRef.current = window.setTimeout(() => goNext(), cur2.durationMs);
      }
    },
    [playing, items.length]
    // eslint-disable-line react-hooks/exhaustive-deps
  );
  const goNext = reactExports.useCallback(() => {
    setPrevItem(items[index] ?? null);
    setTransitioning(true);
    setIndex((i) => {
      if (items.length === 0) return 0;
      const next = (i + 1) % items.length;
      return next;
    });
    setTimeout(() => setTransitioning(false), 600);
  }, [items, index]);
  const goPrev = reactExports.useCallback(() => {
    setPrevItem(items[index] ?? null);
    setTransitioning(true);
    setIndex((i) => items.length === 0 ? 0 : (i - 1 + items.length) % items.length);
    setTimeout(() => setTransitioning(false), 600);
  }, [items, index]);
  reactExports.useEffect(() => {
    scheduleAdvance(items[index]);
    if (items[index]) void touchMedia(items[index].media.id);
    return () => clearTimer();
  }, [index, items, scheduleAdvance]);
  const onVideoEnded = () => {
    if (items.length > 1) goNext();
    else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      void videoRef.current.play();
    }
  };
  const loadSingle = async (mediaId) => {
    const m = await getMedia(mediaId);
    if (!m) return;
    const settings = await getSettings();
    const url = await loadMediaUrl(m);
    setPrevItem(items[index] ?? null);
    setTransitioning(true);
    setItems([
      {
        id: "single",
        media: m,
        blobUrl: url,
        durationMs: settings.defaultImageDurationMs,
        transition: settings.defaultTransition
      }
    ]);
    setIndex(0);
    setMode("single");
    setPlaying(true);
    setBlack(false);
    setTimeout(() => setTransitioning(false), 600);
  };
  const loadPlaylist = async (playlistId, startIndex = 0) => {
    const p = await getPlaylist(playlistId);
    if (!p || p.items.length === 0) return;
    const settings = await getSettings();
    const runtime = [];
    for (const it of p.items) {
      const m = await getMedia(it.mediaId);
      if (!m) continue;
      const url = await loadMediaUrl(m);
      runtime.push({
        id: it.id,
        media: m,
        blobUrl: url,
        durationMs: it.durationMs || settings.defaultImageDurationMs,
        transition: it.transition || settings.defaultTransition
      });
    }
    if (!runtime.length) return;
    setItems(runtime);
    setIndex(Math.min(startIndex, runtime.length - 1));
    setMode("slideshow");
    setPlaying(true);
    setBlack(false);
  };
  reactExports.useEffect(() => {
    const ch = channelRef.current;
    if (!ch) return;
    const handler = async (ev) => {
      const cmd = ev.data;
      if (!cmd?.type) return;
      switch (cmd.type) {
        case "LOAD":
          setVideoReady(false);
          setTextOverlay(null);
          await loadSingle(cmd.mediaId);
          break;
        case "LOAD_PLAYLIST":
          setVideoReady(false);
          setTextOverlay(null);
          await loadPlaylist(cmd.playlistId, cmd.startIndex ?? 0);
          break;
        case "LOAD_TEXT":
          setVideoReady(false);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.removeAttribute("src");
            videoRef.current.load();
          }
          clearTimer();
          urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
          urlsRef.current = [];
          setItems([]);
          setPrevItem(null);
          setTransitioning(false);
          setIndex(0);
          setMode("text");
          setPlaying(false);
          setBlack(false);
          setTextOverlay(cmd.overlay);
          if (cmd.style) setTextStyle(cmd.style);
          if (cmd.styles) setGroupedStyles(cmd.styles);
          break;
        case "UPDATE_TEXT_STYLE":
          setTextStyle(cmd.style);
          break;
        case "UPDATE_STYLES":
          setGroupedStyles(cmd.styles);
          break;
        case "UPDATE_BACKGROUND":
          setGroupedStyles((g) => ({ ...g, background: cmd.background }));
          break;
        case "UPDATE_LOGO":
          setLogo(cmd.logo);
          break;
        case "PLAY":
          setPlaying(true);
          if (videoRef.current) void videoRef.current.play();
          break;
        case "PAUSE":
          setPlaying(false);
          if (videoRef.current) videoRef.current.pause();
          clearTimer();
          break;
        case "NEXT":
          goNext();
          break;
        case "PREV":
          goPrev();
          break;
        case "STOP":
          setPlaying(false);
          setItems([]);
          setIndex(0);
          setMode("idle");
          setTextOverlay(null);
          clearTimer();
          urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
          urlsRef.current = [];
          break;
        case "SEEK":
          if (videoRef.current) videoRef.current.currentTime = cmd.time;
          break;
        case "VOLUME":
          setVolume(cmd.value);
          if (videoRef.current) videoRef.current.volume = cmd.value;
          break;
        case "MUTE":
          setMuted(cmd.value);
          if (videoRef.current) videoRef.current.muted = cmd.value;
          break;
        case "RATE":
          setPlaybackRate(cmd.value);
          if (videoRef.current) videoRef.current.playbackRate = cmd.value;
          break;
        case "LOOP":
          setLoop(cmd.value);
          if (videoRef.current) videoRef.current.loop = cmd.value;
          break;
        case "BLACK":
          setBlack(cmd.value);
          break;
        case "PING":
          broadcastState();
          break;
      }
    };
    ch.addEventListener("message", handler);
    return () => ch.removeEventListener("message", handler);
  }, [goNext, goPrev, broadcastState]);
  reactExports.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);
  reactExports.useEffect(() => {
    (async () => {
      const s = await getSettings();
      setVolume(s.defaultVolume);
      setMuted(s.muteOnStart);
    })();
  }, []);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key.toLowerCase() === "b") setBlack((b) => !b);
      else if (e.key === "Escape") window.close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);
  const cur = items[index];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 overflow-hidden bg-black",
      style: { cursor: cursorHidden ? "none" : "default" },
      children: [
        prevItem && transitioning && prevItem.media.type === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: prevItem.blobUrl,
            alt: "",
            className: "absolute inset-0 h-full w-full object-contain transition-opacity duration-500",
            style: { opacity: transitioning ? 0 : 1 }
          },
          "prev-" + prevItem.id
        ),
        cur && !black && cur.media.type === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: cur.blobUrl,
            alt: "",
            className: `absolute inset-0 h-full w-full object-contain ${transitionClass(cur.transition)}`
          },
          "cur-" + cur.id + "-" + index
        ),
        cur && !black && cur.media.type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            src: cur.blobUrl,
            autoPlay: playing,
            loop,
            onEnded: onVideoEnded,
            onLoadedMetadata: (e) => {
              const v = e.currentTarget;
              v.currentTime = 0;
              v.playbackRate = playbackRate;
              v.volume = volume;
              v.muted = muted;
              broadcastState();
            },
            onCanPlay: () => {
              setVideoReady(true);
              broadcastState();
            },
            onPlaying: () => {
              setVideoReady(true);
              broadcastState();
            },
            onWaiting: () => {
              setVideoReady(false);
              broadcastState();
            },
            onTimeUpdate: () => broadcastState(),
            onDurationChange: () => broadcastState(),
            className: "absolute inset-0 h-full w-full object-contain",
            playsInline: true
          },
          "vid-" + cur.id + "-" + index + "-" + cur.blobUrl
        ),
        textOverlay && !black && !cur && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProjectionTextStage,
          {
            overlay: textOverlay,
            textStyle,
            groupedStyles,
            logo
          }
        ),
        black && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black" }),
        !black && !textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx(LogoLayer, { logo }),
        !cur && !black && !textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-neutral-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: "Church Media — Projector" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm", children: "Waiting for media…" })
        ] }) })
      ]
    }
  );
}
function transitionClass(t) {
  switch (t) {
    case "fade":
    case "crossfade":
    case "dissolve":
      return "animate-in fade-in duration-500";
    case "zoom":
      return "animate-in fade-in zoom-in-95 duration-500";
    case "none":
    default:
      return "";
  }
}
function ProjectRoute() {
  const [mode] = reactExports.useState(() => {
    if (typeof window === "undefined") return "control";
    return window.opener && window.name === "church-projector" ? "popup" : "control";
  });
  if (mode === "popup") return /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectionWindow, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectionWorkspace, {});
}
export {
  ProjectRoute as component
};
