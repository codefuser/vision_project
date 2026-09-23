import React, { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SettingsSkeleton } from "@/components/skeletons/RouteSkeletons";

const SettingsPage = React.lazy(() =>
  import("@/features/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — VersoLyn" },
      { name: "description", content: "Configure VersoLyn app settings, typography, and backup options." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPage />
    </Suspense>
  ),
});
