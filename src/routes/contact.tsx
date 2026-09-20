import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/features/devhub/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact VersoLyn - Church Software Support & Feedback" },
      {
        name: "description",
        content:
          "Contact the VersoLyn team for support, feedback, or custom church presentation software inquiries. We are happy to help your church.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://versolyn.vercel.app/contact" },
      { property: "og:title", content: "Contact VersoLyn - Church Software Support & Feedback" },
      {
        property: "og:description",
        content:
          "Reach the VersoLyn team for support, feedback, or custom church presentation software inquiries.",
      },
    ],
    links: [{ rel: "canonical", href: "https://versolyn.vercel.app/contact" }],
  }),
  component: () => <ContactPage />,
});
