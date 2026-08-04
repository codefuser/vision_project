import { create } from "zustand";

interface FileManagerLayoutState {
  leftWidth: number;
  rightWidth: number;
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
  autoProjectEnabled: boolean;
  setLeftWidth: (w: number) => void;
  setRightWidth: (w: number) => void;
  toggleLeftCollapsed: () => void;
  toggleRightCollapsed: () => void;
  setLeftCollapsed: (collapsed: boolean) => void;
  setRightCollapsed: (collapsed: boolean) => void;
  toggleAutoProject: () => void;
  setAutoProject: (enabled: boolean) => void;
}

const DEFAULT_LEFT = 360;
const DEFAULT_RIGHT = 420;
const MIN_LEFT = 280;
const MAX_LEFT = 520;
const MIN_RIGHT = 320;
const MAX_RIGHT = 650;

function getSavedNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  try {
    const val = Number(window.localStorage.getItem(key));
    return val && !isNaN(val) ? val : fallback;
  } catch {
    return fallback;
  }
}

function getSavedBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const val = window.localStorage.getItem(key);
    return val !== null ? val === "true" : fallback;
  } catch {
    return fallback;
  }
}

export const useFileManagerLayoutStore = create<FileManagerLayoutState>((set) => ({
  leftWidth: getSavedNumber("lib_left_w", DEFAULT_LEFT),
  rightWidth: getSavedNumber("lib_right_w", DEFAULT_RIGHT),
  isLeftCollapsed: getSavedBool("lib_left_col", false),
  isRightCollapsed: getSavedBool("lib_right_col", true), // Default hidden right details panel
  autoProjectEnabled: getSavedBool("lib_auto_proj", true), // Default auto project on click

  setLeftWidth: (w: number) => {
    const clamped = Math.max(MIN_LEFT, Math.min(MAX_LEFT, w));
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lib_left_w", String(clamped));
      }
    } catch {}
    set({ leftWidth: clamped });
  },

  setRightWidth: (w: number) => {
    const clamped = Math.max(MIN_RIGHT, Math.min(MAX_RIGHT, w));
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lib_right_w", String(clamped));
      }
    } catch {}
    set({ rightWidth: clamped });
  },

  toggleLeftCollapsed: () => {
    set((state) => {
      const next = !state.isLeftCollapsed;
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("lib_left_col", String(next));
        }
      } catch {}
      return { isLeftCollapsed: next };
    });
  },

  toggleRightCollapsed: () => {
    set((state) => {
      const next = !state.isRightCollapsed;
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("lib_right_col", String(next));
        }
      } catch {}
      return { isRightCollapsed: next };
    });
  },

  setLeftCollapsed: (collapsed: boolean) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lib_left_col", String(collapsed));
      }
    } catch {}
    set({ isLeftCollapsed: collapsed });
  },

  setRightCollapsed: (collapsed: boolean) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lib_right_col", String(collapsed));
      }
    } catch {}
    set({ isRightCollapsed: collapsed });
  },

  toggleAutoProject: () => {
    set((state) => {
      const next = !state.autoProjectEnabled;
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("lib_auto_proj", String(next));
        }
      } catch {}
      return { autoProjectEnabled: next };
    });
  },

  setAutoProject: (enabled: boolean) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lib_auto_proj", String(enabled));
      }
    } catch {}
    set({ autoProjectEnabled: enabled });
  },
}));
