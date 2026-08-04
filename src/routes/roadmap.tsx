import { createFileRoute } from "@tanstack/react-router";
import { RoadmapPage } from "@/features/devhub/RoadmapPage";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Version History — VersoLyn" },
      {
        name: "description",
        content: "View the version history and release notes for VersoLyn.",
      },
    ],
  }),
  component: () => <RoadmapPage />,
});
