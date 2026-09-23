import React, { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PlaylistsSkeleton } from "@/components/skeletons/RouteSkeletons";

const PlaylistsPage = React.lazy(() =>
  import("@/features/playlists/PlaylistsPage").then((m) => ({ default: m.PlaylistsPage })),
);

export const Route = createFileRoute("/playlists")({
  head: () => ({
    meta: [
      { title: "Playlists — VersoLyn" },
      { name: "description", content: "Create and manage VersoLyn service playlists and cues for church services." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <Suspense fallback={<PlaylistsSkeleton />}>
      <PlaylistsPage />
    </Suspense>
  ),
});
