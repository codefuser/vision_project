import { useEffect, type ReactNode } from "react";
import { preloadAllData } from "@/lib/loader/data-preloader";

export function AppStartupProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    preloadAllData().catch(() => {});
  }, []);

  return <>{children}</>;
}
