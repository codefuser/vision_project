import { createFileRoute } from "@tanstack/react-router";
import { SessionListPage } from "@/features/history/SessionListPage";

export const Route = createFileRoute("/history/")({
  head: () => ({
    meta: [
      { title: "Service History — Vision Projector" },
      {
        name: "description",
        content:
          "View and search all past service sessions with complete event timelines.",
      },
    ],
  }),
  component: () => <SessionListPage />,
});
