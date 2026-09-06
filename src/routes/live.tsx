import { createFileRoute } from "@tanstack/react-router";
import { LiveViewerPage } from "@/features/live-qr/components/LiveViewerPage";

export const Route = createFileRoute("/live")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      t: typeof search.t === "string" ? search.t : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Vision Projector — Live" },
      { name: "description", content: "Live projection stream for congregation and online viewers." },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      },
      { name: "theme-color", content: "#070b14" },
    ],
  }),
  component: LiveRouteComponent,
});

function LiveRouteComponent() {
  const { t } = Route.useSearch();
  return <LiveViewerPage tokenFromQuery={t} />;
}
