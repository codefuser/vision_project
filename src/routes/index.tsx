import { createFileRoute } from "@tanstack/react-router";
import { LibraryPage } from "@/features/library/LibraryPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VersoLyn — Presentation Software" },
      { name: "description", content: "Media presentation software for churches." },
    ],
  }),
  component: () => <LibraryPage />,
});
