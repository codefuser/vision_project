import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/features/devhub/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vision Projector" },
      { name: "description", content: "Get in touch with the Vision Projector team." },
    ],
  }),
  component: () => <ContactPage />,
});
