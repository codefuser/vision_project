import { useEffect, type ReactNode } from "react";
import { preloadAllData, preloadAllPageData } from "@/lib/loader/data-preloader";

export function AppStartupProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    preloadAllData().then(() => {
      preloadAllPageData();
    }).catch(() => {});
  }, []);

  return <>{children}</>;
}
