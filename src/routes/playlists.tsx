import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PlaylistsPage } from "@/features/playlists/PlaylistsPage";

export const Route = createFileRoute("/playlists")({
  head: () => ({
    meta: [
      { title: "Playlists — VersoLyn" },
      { name: "description", content: "Create and manage media playlists for services." },
    ],
  }),
  component: () => <PlaylistsPage />,
});
