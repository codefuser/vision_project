import { createFileRoute } from "@tanstack/react-router";
import { RoadmapPage } from "@/features/devhub/RoadmapPage";

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
  component: () => <RoadmapPage />,
});
