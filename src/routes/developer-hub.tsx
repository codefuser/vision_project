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

function DevHubRoute() {
  const [Comp, setComp] = useState<ComponentType | null>(null);
  useEffect(() => {
    import("@/features/devhub/DeveloperHubPage").then((m) => setComp(() => m.DeveloperHubPage));
  }, []);
  if (!Comp) return <Loading />;
  return <Comp />;
}
