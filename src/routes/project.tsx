import React, { Suspense, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectionWindow } from "@/features/projection/ProjectionWindow";
import { WorkspaceSkeleton } from "@/components/skeletons/RouteSkeletons";

const ProjectionWorkspace = React.lazy(() =>
  import("@/features/workspace/ProjectionWorkspace").then((m) => ({
    default: m.ProjectionWorkspace,
  })),
);

export const Route = createFileRoute("/project")({
  head: () => ({
    meta: [
      { title: "Project — VersoLyn" },
      { name: "description", content: "VersoLyn live projection control room." },
    ],
  }),
  component: ProjectRoute,
});

function ProjectRoute() {
  // Compute mode synchronously to avoid the "loading" black-flash on every nav.
  const [mode] = useState<"popup" | "control">(() => {
    if (typeof window === "undefined") return "control";
    return window.opener && window.name === "church-projector" ? "popup" : "control";
  });

  if (mode === "popup") return <ProjectionWindow />;

  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <ProjectionWorkspace />
    </Suspense>
  );
}
