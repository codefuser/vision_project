import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";

function Loading() {
  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

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

function RoadmapRoute() {
  const [Comp, setComp] = useState<ComponentType | null>(null);
  useEffect(() => {
    import("@/features/devhub/RoadmapPage").then((m) => setComp(() => m.RoadmapPage));
  }, []);
  if (!Comp) return <Loading />;
  return <Comp />;
}
