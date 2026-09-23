import React, { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LibrarySkeleton } from "@/components/skeletons/RouteSkeletons";

const LibraryPage = React.lazy(() =>
  import("@/features/library/LibraryPage").then((m) => ({ default: m.LibraryPage })),
);

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Media Library — VersoLyn" },
      { name: "description", content: "Manage VersoLyn media files, images, posters, and videos for projection." },
    ],
  }),
  component: () => (
    <Suspense fallback={<LibrarySkeleton />}>
      <LibraryPage />
    </Suspense>
  ),
});
