import { createFileRoute } from "@tanstack/react-router";
import { RemoteDesktopPage } from "@/features/remote-desktop/RemoteDesktopPage";

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
  component: () => <RemoteDesktopPage />,
});
