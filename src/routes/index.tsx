import { createFileRoute } from "@tanstack/react-router";
import { LibraryPage } from "@/features/library/LibraryPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Church Media — Projection Software" },
      { name: "description", content: "Offline-first media projection software for churches." },
    ],
  }),
  component: () => <LibraryPage />,
});
