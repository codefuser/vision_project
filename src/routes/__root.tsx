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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        httpEquiv: "Content-Security-Policy",
        content:
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co data: blob:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
      },
      { title: "VersoLyn — Church Presentation Software" },
      {
        name: "description",
        content:
          "VersoLyn is a modern church presentation software. Tamil & English Bible verses, song lyrics, media, and service flow management.",
      },
      { name: "theme-color", content: "#0a0a0a" },
      { property: "og:title", content: "VersoLyn — Church Presentation Software" },
      {
        property: "og:description",
        content: "VersoLyn church presentation software.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
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
