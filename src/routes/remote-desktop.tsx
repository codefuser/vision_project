import React, { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SettingsSkeleton } from "@/components/skeletons/RouteSkeletons";

const RemoteDesktopPage = React.lazy(() =>
  import("@/features/remote-desktop/RemoteDesktopPage").then((m) => ({
    default: m.RemoteDesktopPage,
  })),
);

export const Route = createFileRoute("/remote-desktop")({
  head: () => ({
    meta: [
      { title: "Remote Desktop Control — VersoLyn" },
      {
        name: "description",
        content:
          "Secure browser-based remote desktop control system. Stream full desktop and remotely control mouse and keyboard with low latency.",
      },
    ],
  }),
  component: () => (
    <Suspense fallback={<SettingsSkeleton />}>
      <RemoteDesktopPage />
    </Suspense>
  ),
});
