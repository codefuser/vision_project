import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GroupedStyles } from "@/lib/broadcast";

export type WorkspaceTab = "media" | "bible" | "songs" | "text";

export type GroupedStylesSnapshot = Pick<GroupedStyles, "reference" | "tamil" | "english" | "background">;

export interface PanelVisibility {
  preview: boolean;
  textFormat: boolean;
  tabs: boolean;
}

export interface SongsSearchState {
  query: string;
  filter: string;
  authorFilter: string | null;
}

export interface BibleSearchState {
  query: string;
  searchMode: "reference" | "verse";
}

export interface MediaSearchState {
  query: string;
  filter: string;
  currentFolderId: string | null;
}

export interface TextSearchState {
  query: string;
  filter: string;
}

export const DEFAULT_SECTION_ORDER = [
  "theme",
  "quick-text",
  "color",
  "alignment",
  "effects",
  "animation",
  "layers",
  "background",
  "logo",
  "advanced-typography",
  "safe-area",
  "quick-presets",
  "history",
] as const;

const DEFAULT_SECTIONS: Record<string, boolean> = {
  theme: true,
  "quick-text": true,
  color: true,
  alignment: true,
  effects: false,
  animation: false,
  layers: true,
  background: true,
  logo: true,
  "advanced-typography": false,
  "safe-area": false,
  "quick-presets": false,
  history: false,
};

interface WorkspaceState {
  activeTab: WorkspaceTab;
  visible: PanelVisibility;
  textFormatCollapsed: boolean;
  tabsCollapsed: boolean;
  sidebarCollapsed: boolean;
  leftPanelWidth: number;
  leftPanelLayout: Record<string, number> | null;
  textFormatActiveSection: string;
  textFormatThemesOpen: boolean;
  textFormatSections: Record<string, boolean>;
  historyStack: GroupedStylesSnapshot[];
  historyIndex: number;
  songsSearch: SongsSearchState;
  bibleSearch: BibleSearchState;
  mediaSearch: MediaSearchState;
  textSearch: TextSearchState;
  selectedSongId: number | null;
  selectedTextId: string | null;
  activeTemplateId: string | null;
  scrollPositions: {
    songs: number;
    bible: number;
    media: number;
    text: number;
  };
  _hydrated: boolean;
  galleryOpen: boolean;
  galleryBucket: string;
  galleryQuery: string;
  setGalleryOpen: (open: boolean) => void;
  setGalleryBucket: (bucket: string) => void;
  setGalleryQuery: (query: string) => void;
  setActiveTab: (t: WorkspaceTab) => void;
  togglePanel: (key: keyof PanelVisibility) => void;
  showPanel: (key: keyof PanelVisibility) => void;
  setTextFormatCollapsed: (v: boolean) => void;
  toggleTextFormatCollapsed: () => void;
  setTabsCollapsed: (v: boolean) => void;
  toggleTabsCollapsed: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setLeftPanelWidth: (w: number) => void;
  setLeftPanelLayout: (l: Record<string, number> | null) => void;
  setTextFormatActiveSection: (s: string) => void;
  setTextFormatThemesOpen: (v: boolean) => void;
  setTextFormatSectionOpen: (id: string, open: boolean) => void;
  pushHistory: (snapshot: GroupedStylesSnapshot) => void;
  undoHistory: () => GroupedStylesSnapshot | null;
  redoHistory: () => GroupedStylesSnapshot | null;
  setSongsSearch: (s: Partial<SongsSearchState>) => void;
  setBibleSearch: (s: Partial<BibleSearchState>) => void;
  setMediaSearch: (s: Partial<MediaSearchState>) => void;
  setTextSearch: (s: Partial<TextSearchState>) => void;
  setSelectedSongId: (id: number | null) => void;
  setSelectedTextId: (id: string | null) => void;
  setActiveTemplateId: (id: string | null) => void;
  setScrollPosition: (tab: WorkspaceTab, position: number) => void;
  resetLayout: () => void;
}

const DEFAULTS = {
  activeTab: "songs" as WorkspaceTab,
  visible: { preview: true, textFormat: true, tabs: true } as PanelVisibility,
  textFormatCollapsed: false,
  tabsCollapsed: false,
  sidebarCollapsed: false,
  leftPanelWidth: 320,
  leftPanelLayout: null as Record<string, number> | null,
  textFormatActiveSection: "reference",
  textFormatThemesOpen: true,
  textFormatSections: { ...DEFAULT_SECTIONS },
  historyStack: [] as GroupedStylesSnapshot[],
  historyIndex: -1,
  songsSearch: { query: "", filter: "all", authorFilter: null } as SongsSearchState,
  bibleSearch: { query: "", searchMode: "reference" } as BibleSearchState,
  mediaSearch: { query: "", filter: "all", currentFolderId: null } as MediaSearchState,
  textSearch: { query: "", filter: "all" } as TextSearchState,
  selectedSongId: null as number | null,
  selectedTextId: null as string | null,
  activeTemplateId: null as string | null,
  scrollPositions: { songs: 0, bible: 0, media: 0, text: 0 },
  _hydrated: false,
  galleryOpen: false,
  galleryBucket: "All",
  galleryQuery: "",
};

const MAX_HISTORY = 50;

export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,

      setActiveTab: (t) => set({ activeTab: t }),
      togglePanel: (key) =>
        set((s) => ({ visible: { ...s.visible, [key]: !s.visible[key] } })),
      showPanel: (key) =>
        set((s) => ({ visible: { ...s.visible, [key]: true } })),
      setTextFormatCollapsed: (v) => set({ textFormatCollapsed: v }),
      toggleTextFormatCollapsed: () =>
        set((s) => ({ textFormatCollapsed: !s.textFormatCollapsed })),
      setTabsCollapsed: (v) => set({ tabsCollapsed: v }),
      toggleTabsCollapsed: () => set((s) => ({ tabsCollapsed: !s.tabsCollapsed })),

      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setLeftPanelWidth: (w) => set({ leftPanelWidth: w }),
      setLeftPanelLayout: (l) => set({ leftPanelLayout: l }),
      setTextFormatActiveSection: (s) => set({ textFormatActiveSection: s }),
      setTextFormatThemesOpen: (v) => set({ textFormatThemesOpen: v }),
      setTextFormatSectionOpen: (id, open) =>
        set((s) => ({ textFormatSections: { ...s.textFormatSections, [id]: open } })),

      pushHistory: (snapshot) =>
        set((s) => {
          const stack = s.historyStack.slice(0, s.historyIndex + 1);
          stack.push(snapshot);
          if (stack.length > MAX_HISTORY) stack.shift();
          return { historyStack: stack, historyIndex: stack.length - 1 };
        }),
      undoHistory: () => {
        const s = get();
        if (s.historyIndex < 0) return null;
        const idx = s.historyIndex - 1;
        set({ historyIndex: idx });
        return idx >= 0 ? (s.historyStack[idx] ?? null) : null;
      },
      redoHistory: () => {
        const s = get();
        if (s.historyIndex >= s.historyStack.length - 1) return null;
        const idx = s.historyIndex + 1;
        set({ historyIndex: idx });
        return s.historyStack[idx] ?? null;
      },

      setSongsSearch: (patch) =>
        set((s) => ({ songsSearch: { ...s.songsSearch, ...patch } })),
      setBibleSearch: (patch) =>
        set((s) => ({ bibleSearch: { ...s.bibleSearch, ...patch } })),
      setMediaSearch: (patch) =>
        set((s) => ({ mediaSearch: { ...s.mediaSearch, ...patch } })),
      setTextSearch: (patch) =>
        set((s) => ({ textSearch: { ...s.textSearch, ...patch } })),
      setSelectedSongId: (id) => set({ selectedSongId: id }),
      setSelectedTextId: (id) => set({ selectedTextId: id }),
      setActiveTemplateId: (id) => set({ activeTemplateId: id }),
      setScrollPosition: (tab, position) =>
        set((s) => ({
          scrollPositions: { ...s.scrollPositions, [tab]: position },
        })),
      setGalleryOpen: (open) => set({ galleryOpen: open }),
      setGalleryBucket: (bucket) => set({ galleryBucket: bucket }),
      setGalleryQuery: (query) => set({ galleryQuery: query }),

      resetLayout: () => {
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem("vision-active-template");
          } catch { /* ignore */ }
        }
        set(DEFAULTS);
      },
    }),
    {
      name: "church-media-workspace",
      storage: createJSONStorage(() => localStorage),
      version: 7,
      partialize: (s) => {
        const { _hydrated, galleryOpen, ...rest } = s;
        return rest;
      },
      onRehydrateStorage: () => () => {
        useWorkspace.setState({ _hydrated: true });
      },
      migrate: (persisted: unknown) => {
        const p = persisted as Record<string, unknown> | undefined;
        return {
          ...DEFAULTS,
          ...p,
          leftPanelLayout: (p?.leftPanelLayout && typeof p.leftPanelLayout === "object" ? p.leftPanelLayout : null) as Record<string, number> | null ?? DEFAULTS.leftPanelLayout,
          sidebarCollapsed: typeof p?.sidebarCollapsed === "boolean" ? p.sidebarCollapsed : DEFAULTS.sidebarCollapsed,
          leftPanelWidth: typeof p?.leftPanelWidth === "number" ? p.leftPanelWidth : DEFAULTS.leftPanelWidth,
          textFormatActiveSection: typeof p?.textFormatActiveSection === "string" ? p.textFormatActiveSection : DEFAULTS.textFormatActiveSection,
          textFormatThemesOpen: typeof p?.textFormatThemesOpen === "boolean" ? p.textFormatThemesOpen : DEFAULTS.textFormatThemesOpen,
          textFormatSections: p?.textFormatSections ? { ...DEFAULTS.textFormatSections, ...(p.textFormatSections as object) } : DEFAULTS.textFormatSections,
          songsSearch: p?.songsSearch ? { ...DEFAULTS.songsSearch, ...(p.songsSearch as object) } : DEFAULTS.songsSearch,
          bibleSearch: p?.bibleSearch ? { ...DEFAULTS.bibleSearch, ...(p.bibleSearch as object) } : DEFAULTS.bibleSearch,
          mediaSearch: p?.mediaSearch ? { ...DEFAULTS.mediaSearch, ...(p.mediaSearch as object) } : DEFAULTS.mediaSearch,
          textSearch: p?.textSearch ? { ...DEFAULTS.textSearch, ...(p.textSearch as object) } : DEFAULTS.textSearch,
          selectedSongId: typeof p?.selectedSongId === "number" ? p.selectedSongId : DEFAULTS.selectedSongId,
          selectedTextId: typeof p?.selectedTextId === "string" ? p.selectedTextId : DEFAULTS.selectedTextId,
          activeTemplateId: typeof p?.activeTemplateId === "string" ? p.activeTemplateId : DEFAULTS.activeTemplateId,
          scrollPositions: p?.scrollPositions ? { ...DEFAULTS.scrollPositions, ...(p.scrollPositions as object) } : DEFAULTS.scrollPositions,
          _hydrated: false,
          galleryOpen: false,
          galleryBucket: typeof p?.galleryBucket === "string" ? p.galleryBucket : DEFAULTS.galleryBucket,
          galleryQuery: typeof p?.galleryQuery === "string" ? p.galleryQuery : DEFAULTS.galleryQuery,
        } as WorkspaceState;
      },
    },
  ),
);
