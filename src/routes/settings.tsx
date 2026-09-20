import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — VersoLyn" },
      { name: "description", content: "Configure VersoLyn app settings, typography, and backup options." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <SettingsPage />,
});
