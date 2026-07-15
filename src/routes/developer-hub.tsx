import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { isPreloaded, ensurePreloaded, BlurLoadingOverlay } from "@/features/devhub/devhub-loader";

export const Route = createFileRoute("/developer-hub")({
  head: () => ({
    meta: [
      { title: "Developer Hub — Vision Projector" },
      {
        name: "description",
        content:
          "Learn about Vision Projector, the free and open-source church presentation software.",
      },
    ],
  }),
  component: DevHubRoute,
});

let cached: ComponentType | null = null;

function DevHubRoute() {
  const [ready, setReady] = useState(!!cached);

  useEffect(() => {
    if (cached) {
      setReady(true);
      return;
    }
    (isPreloaded() ? Promise.resolve() : ensurePreloaded())
      .then(() => import("@/features/devhub/DeveloperHubPage"))
      .then((m) => {
        cached = m.DeveloperHubPage;
        setReady(true);
      });
  }, []);

  if (!ready || !cached) return <BlurLoadingOverlay message="Loading Developer Hub…" />;
  const Page = cached;
  return <Page />;
}
