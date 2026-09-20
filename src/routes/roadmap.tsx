import { createFileRoute } from "@tanstack/react-router";
import { RoadmapPage } from "@/features/devhub/RoadmapPage";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "VersoLyn Roadmap - Version History & Planned Features" },
      {
        name: "description",
        content:
          "View the VersoLyn version history, release notes, and planned features for this free church presentation and Bible projection software.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://versolyn.vercel.app/roadmap" },
      { property: "og:title", content: "VersoLyn Roadmap - Version History & Planned Features" },
      {
        property: "og:description",
        content:
          "VersoLyn version history, release notes, and upcoming features for church presentation software.",
      },
    ],
    links: [{ rel: "canonical", href: "https://versolyn.vercel.app/roadmap" }],
  }),
  component: () => <RoadmapPage />,
});
