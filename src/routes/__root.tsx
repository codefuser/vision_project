import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
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
];

function isKnownRoute(pathname: string): boolean {
  if (pathname === "/") return true;
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
      { title: "Church Media - Projection Software" },
      {
        name: "description",
        content:
          "Offline-first media projection software for churches. Images, posters, and videos.",
      },
      { name: "theme-color", content: "#0a0a0a" },
      { property: "og:title", content: "Church Media - Projection Software" },
      {
        property: "og:description",
        content: "Offline-first media projection software for churches.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
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
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
import { useRouterState } from "@tanstack/react-router";
import { CommandPalette } from "@/components/CommandPalette";

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { queryClient } = Route.useRouteContext();

  // 404 gate: render standalone NotFoundPage before any providers
  if (!isKnownRoute(pathname)) {
    return <NotFoundPage />;
  }

  // Detect projector popup
  const isProjectorPopup =
    typeof window !== "undefined" && window.opener != null && window.name === "church-projector";

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        {!isProjectorPopup && <GlobalShortcuts />}
        {!isProjectorPopup && <ShortcutsDialog />}
        {!isProjectorPopup && <CommandPalette />}
        {isProjectorPopup ? (
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
