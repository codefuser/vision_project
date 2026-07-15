import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { isPreloaded, ensurePreloaded, BlurLoadingOverlay } from "@/features/devhub/devhub-loader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vision Projector" },
      { name: "description", content: "Get in touch with the Vision Projector team." },
    ],
  }),
  component: ContactRoute,
});

let cached: ComponentType | null = null;

function ContactRoute() {
  const [ready, setReady] = useState(!!cached);

  useEffect(() => {
    if (cached) {
      setReady(true);
      return;
    }
    (isPreloaded() ? Promise.resolve() : ensurePreloaded())
      .then(() => import("@/features/devhub/ContactPage"))
      .then((m) => {
        cached = m.ContactPage;
        setReady(true);
      });
  }, []);

  if (!ready || !cached) return <BlurLoadingOverlay message="Loading Contact…" />;
  const Page = cached;
  return <Page />;
}
