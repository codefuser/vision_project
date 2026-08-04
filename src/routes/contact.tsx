import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/features/devhub/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — VersoLyn" },
      { name: "description", content: "Get in touch with the VersoLyn team." },
    ],
  }),
  component: () => <ContactPage />,
});
