/**
 * Electron SPA entry point.
 * This is a pure client-side React app — no SSR, no TanStack Start server.
 * Uses TanStack Router in hash-history mode for Electron file:// compatibility.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRouter,
  RouterProvider,
  createHashHistory,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Ensure initial hash location is #/ in Electron file:// mode
if (typeof window !== "undefined" && (!window.location.hash || window.location.hash === "#")) {
  window.location.hash = "#/";
}

// Use hash history so file:// URLs work correctly in Electron
const hashHistory = createHashHistory();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

const router = createRouter({
  routeTree,
  history: hashHistory,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreloadStaleTime: 60_000,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootEl = document.getElementById("root")!;

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
