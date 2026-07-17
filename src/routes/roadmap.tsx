import { createFileRoute } from "@tanstack/react-router";
import { RoadmapPage } from "@/features/devhub/RoadmapPage";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Version History — Vision Projector" },
      {
        name: "description",
        content: "View the version history and release notes for Vision Projector.",
      },
    ],
  }),
  component: () => <RoadmapPage />,
});
