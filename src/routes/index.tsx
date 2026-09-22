import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LibraryPage } from "@/features/library/LibraryPage";
import { useSettings } from "@/stores/settings.store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VersoLyn - Church Presentation Software" },
      {
        name: "description",
        content:
          "VersoLyn is free church presentation software for projecting Bible verses, Tamil & English worship songs, media, and live service content. Built for modern churches.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "VersoLyn" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://versolyn.vercel.app/" },
      { property: "og:title", content: "VersoLyn - Church Presentation Software" },
      {
        property: "og:description",
        content:
          "VersoLyn is free church presentation software for projecting Bible verses, Tamil & English worship songs, media, and live service content. Built for modern churches.",
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "VersoLyn - Church Presentation Software" },
      {
        name: "twitter:description",
        content:
          "VersoLyn is free church presentation software for projecting Bible verses, Tamil & English worship songs, media, and live service content. Built for modern churches.",
      },
    ],
    links: [{ rel: "canonical", href: "https://versolyn.vercel.app/" }],
  }),
  component: IndexRoute,
});

function IndexRoute() {
  const navigate = useNavigate();
  const { settings, loaded } = useSettings();

  // Honor the "Startup Page" setting — redirect to the preferred route on
  // launch (replace: true keeps the back stack clean).
  useEffect(() => {
    if (!loaded) return;
    const page = settings.defaultStartupPage;
    if (page === "library") return;
    const target = page === "project" ? "/project" : `/${page}`;
    if (target !== "/") void navigate({ to: target, replace: true });
  }, [loaded, settings.defaultStartupPage, navigate]);

  return <LibraryPage />;
}
