import { createFileRoute } from "@tanstack/react-router";
import { DeveloperHubPage } from "@/features/devhub/DeveloperHubPage";

export const Route = createFileRoute("/developer-hub")({
  head: () => ({
    meta: [
      { title: "About VersoLyn - Free Church Presentation Software" },
      {
        name: "description",
        content:
          "Learn about VersoLyn, free and open-source church presentation software for projecting Bible verses, Tamil Christian songs, worship media, and live service content.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://versolyn.vercel.app/developer-hub" },
      { property: "og:title", content: "About VersoLyn - Free Church Presentation Software" },
      {
        property: "og:description",
        content:
          "Learn about VersoLyn, free church presentation software for Tamil & English Bible projection, worship songs, and live service management.",
      },
    ],
    links: [{ rel: "canonical", href: "https://versolyn.vercel.app/developer-hub" }],
  }),
  component: () => <DeveloperHubPage />,
});
