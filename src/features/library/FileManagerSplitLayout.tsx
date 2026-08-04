import React from "react";
import { LibraryShell } from "./LibraryShell";

/**
 * FileManagerSplitLayout is the unified single-source split-pane layout engine
 * shared identically between Standalone File Manager (/library) and
 * Embedded File Manager inside the Project workspace tab (/project).
 *
 * It owns pointer capture handlers, delta-X live resizing, panel constraints,
 * and 60fps requestAnimationFrame performance.
 */
export function FileManagerSplitLayout() {
  return <LibraryShell />;
}
