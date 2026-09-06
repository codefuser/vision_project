import { createFileRoute } from "@tanstack/react-router";
import { MobileRemoteApp } from "@/features/remote/components/MobileRemoteApp";

export const Route = createFileRoute("/remote")({
  head: () => ({
    meta: [
      { title: "Remote Control — VersoLyn" },
      { name: "description", content: "Mobile remote controller for live church projection." },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
    ],
  }),
  component: MobileRemoteRoute,
});

function MobileRemoteRoute() {
  return <MobileRemoteApp />;
}
