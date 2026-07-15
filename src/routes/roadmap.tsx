import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { isPreloaded, ensurePreloaded, BlurLoadingOverlay } from "@/features/devhub/devhub-loader";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — Vision Projector" },
      {
        name: "description",
        content:
          "View the product roadmap, version history, and future plans for Vision Projector.",
      },
    ],
  }),
  component: RoadmapRoute,
});

let cached: ComponentType | null = null;

function RoadmapRoute() {
  const [ready, setReady] = useState(!!cached);

  useEffect(() => {
    if (cached) {
      setReady(true);
      return;
    }
    (isPreloaded() ? Promise.resolve() : ensurePreloaded())
      .then(() => import("@/features/devhub/RoadmapPage"))
      .then((m) => {
        cached = m.RoadmapPage;
        setReady(true);
      });
  }, []);

  if (!ready || !cached) return <BlurLoadingOverlay message="Loading Roadmap…" />;
  const Page = cached;
  return <Page />;
}
