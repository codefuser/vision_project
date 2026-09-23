import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { GlobalShortcuts } from "@/components/GlobalShortcuts";
import { ShortcutsDialog } from "@/components/ShortcutsDialog";
import { ErrorPage } from "@/components/ErrorPage";
import { NotFoundPage } from "@/components/NotFoundPage";

const KNOWN_ROUTE_PREFIXES = [
  "/",
  "/library",
  "/history",
  "/playlists",
  "/project",
  "/service",
  "/settings",
  "/shortcuts",
  "/contact",
  "/roadmap",
  "/developer-hub",
  "/remote",
  "/live",
  "/remote-desktop",
];

function isKnownRoute(pathname: string): boolean {
  if (pathname === "/" || pathname === "/index.html" || pathname.includes("index.html")) {
    return true;
  }
  return KNOWN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <ErrorPage
      errorCode="VP-500"
      title="Something Went Wrong"
      message="The application encountered an unexpected issue. Our team has been notified. You can try again or head home."
      error={error}
      recoverable
      recommendedAction="retry"
      onRetry={() => {
        router.invalidate();
        reset();
      }}
      showHistory={false}
    />
  );
}

const SITE_URL = "https://versolyn.vercel.app";
const OG_IMAGE = `${SITE_URL}/favicon-512x512.png`;

const JSON_LD = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VersoLyn",
    legalName: "VersoLyn",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-512x512.png`,
    brand: {
      "@type": "Brand",
      name: "VersoLyn",
    },
    description:
      "VersoLyn is a modern church presentation software for projecting Bible verses, Tamil Christian songs, English songs, images, videos, live text, themes and worship service content.",
    sameAs: [`${SITE_URL}/developer-hub`],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VersoLyn",
    alternateName: "VersoLyn Church Presentation Software",
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: "VersoLyn",
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VersoLyn",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Church Presentation Software",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "VersoLyn is free church presentation software for projecting Bible verses, Tamil Christian songs, English songs, images, videos, live text, themes and worship service content.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "VersoLyn",
      url: SITE_URL,
      logo: OG_IMAGE,
    },
    author: {
      "@type": "Organization",
      name: "VersoLyn",
      url: SITE_URL,
    },
    brand: {
      "@type": "Brand",
      name: "VersoLyn",
    },
    keywords:
      "VersoLyn, church presentation software, church projection software, Bible projection software, worship presentation software, Tamil church presentation software, Christian song projection software, church media software",
  },
]);

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        httpEquiv: "Content-Security-Policy",
        content:
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co ws://127.0.0.1:* ws://localhost:* data: blob:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
      },
      // ── Primary SEO ──────────────────────────────────────────────────────────
      { title: "VersoLyn - Church Presentation Software" },
      {
        name: "description",
        content:
          "VersoLyn is free church presentation software for projecting Bible verses, Tamil & English worship songs, media, and live service content on any screen.",
      },
      { name: "keywords", content: "VersoLyn, church presentation software, church projection software, Bible projection software, worship presentation software, Tamil church presentation software, Christian song projection software, church media software" },
      { name: "robots", content: "index, follow" },
      { name: "application-name", content: "VersoLyn" },
      { name: "apple-mobile-web-app-title", content: "VersoLyn" },
      { name: "google-site-verification", content: "MFh43OIJgQvNHdHLomg8gcEjRUQa8-HxZSt_1vCe-HE" },
      { name: "theme-color", content: "#0a0a0a" },
      // ── Canonical ────────────────────────────────────────────────────────────
      // Per-page canonical is set in each route's head(). Root provides fallback.
      // ── Open Graph ───────────────────────────────────────────────────────────
      { property: "og:site_name", content: "VersoLyn" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: "VersoLyn - Church Presentation Software" },
      {
        property: "og:description",
        content:
          "VersoLyn is free church presentation software for projecting Bible verses, Tamil & English worship songs, media, and live service content on any screen.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { property: "og:image:alt", content: "VersoLyn church presentation software logo" },
      { property: "og:locale", content: "en_US" },
      // ── Twitter / X Card ─────────────────────────────────────────────────────
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "VersoLyn - Church Presentation Software" },
      {
        name: "twitter:description",
        content:
          "VersoLyn is free church presentation software for projecting Bible verses, Tamil & English worship songs, media, and live service content on any screen.",
      },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "VersoLyn church presentation software logo" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "128x128", href: "/favicon-128x128.png" },
      { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon-64x64.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@300;400;500;600;700&family=Noto+Serif+Tamil:wght@400;500;600;700&family=Mukta+Malar:wght@400;500;700&family=Catamaran:wght@400;500;700&family=Hind+Madurai:wght@400;500;600&family=Meera+Inimai&family=Pavanam&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundPage,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        {/* JSON-LD Structured Data: Organization + WebSite + SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON_LD }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { AppShell } from "@/components/AppShell";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { CommandPalette } from "@/components/CommandPalette";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Detect projector popup
  const isProjectorPopup =
    typeof window !== "undefined" && window.opener != null && window.name === "church-projector";

  // Detect mobile remote page & live viewer page
  const isRemote = pathname === "/remote" || pathname.startsWith("/remote/");
  const isLive = pathname === "/live" || pathname.startsWith("/live/");
  const isIsolated = isProjectorPopup || isRemote || isLive;

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        {!isIsolated && <GlobalShortcuts />}
        {!isIsolated && <ShortcutsDialog />}
        {!isIsolated && <CommandPalette />}
        {isIsolated ? (
          <Outlet />
        ) : (
          <AppShell>
            <Outlet />
          </AppShell>
        )}
        <Toaster position="top-right" richColors closeButton />
      </GlobalErrorBoundary>
    </QueryClientProvider>
  );
}
