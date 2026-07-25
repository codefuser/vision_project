import React from "react";
import { LibraryShell } from "./LibraryShell";

/**
 * FileManagerLayout is the unified single-source layout engine
 * shared identically between Standalone File Manager (/library) and
 * Embedded File Manager inside the Project workspace tab (/project).
 */
export function FileManagerLayout() {
  return <LibraryShell />;
}
