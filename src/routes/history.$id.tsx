import { createFileRoute } from "@tanstack/react-router";
import { SessionDetailPage } from "@/features/history/SessionDetailPage";

export const Route = createFileRoute("/history/$id")({
  head: () => ({
    meta: [
      { title: "Session Detail — Vision Projector" },
      { name: "description", content: "Full event timeline for this service session." },
    ],
  }),
  component: function SessionDetailRoute() {
    const { id } = Route.useParams();
    return <SessionDetailPage id={id} />;
  },
});
