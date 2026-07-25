import { create } from "zustand";

interface FileManagerLayoutState {
  leftWidth: number;
  rightWidth: number;
  setLeftWidth: (w: number) => void;
  setRightWidth: (w: number) => void;
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

export const useFileManagerLayoutStore = create<FileManagerLayoutState>((set) => ({
  leftWidth: getSavedNumber("lib_left_w", DEFAULT_LEFT),
  rightWidth: getSavedNumber("lib_right_w", DEFAULT_RIGHT),

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
}));
