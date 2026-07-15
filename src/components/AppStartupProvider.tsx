import { useEffect, type ReactNode } from "react";
import { useWorkspace } from "@/features/workspace/workspace.store";
import { preloadAllData } from "@/lib/loader/data-preloader";

export function AppStartupProvider({ children }: { children: ReactNode }) {
  const hydrated = useWorkspace((s) => s._hydrated);

  useEffect(() => {
    if (!hydrated) return;
    preloadAllData();
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}
