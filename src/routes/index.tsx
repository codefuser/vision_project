import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LibraryPage } from "@/features/library/LibraryPage";
import { useSettings } from "@/stores/settings.store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VersoLyn — Presentation Software" },
      { name: "description", content: "Media presentation software for churches." },
    ],
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
