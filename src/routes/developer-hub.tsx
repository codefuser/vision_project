import { createFileRoute } from "@tanstack/react-router";
import { DeveloperHubPage } from "@/features/devhub/DeveloperHubPage";

export const Route = createFileRoute("/developer-hub")({
  head: () => ({
    meta: [
      { title: "Developer Hub — VersoLyn" },
      {
        name: "description",
        content:
          "Learn about VersoLyn, the free and open-source church presentation software.",
      },
    ],
  }),
  component: () => <DeveloperHubPage />,
});
