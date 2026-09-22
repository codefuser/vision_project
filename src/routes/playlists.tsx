import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PlaylistsPage } from "@/features/playlists/PlaylistsPage";

export const Route = createFileRoute("/playlists")({
  head: () => ({
    meta: [
      { title: "Playlists — VersoLyn" },
      { name: "description", content: "Create and manage VersoLyn service playlists and cues for church services." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <PlaylistsPage />,
});
