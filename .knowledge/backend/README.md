# Backend Architecture & Server Functions

## 1. Backend Technology Stack

* **Full-Stack Server Framework**: TanStack Start (`@tanstack/react-start`)
* **Underlying Server Engine**: Nitro (`nitro/vite` with preset: `"vercel"`)
* **Vite Server Integration**: Configured in `vite.config.ts`:
  ```ts
  tanstackStart({ server: { entry: "server" } }),
  nitro({ preset: "vercel" }),
  ```
* **Validation & Schemas**: `zod` 3.24

---

## 2. Server Entry & Request Lifecycle

### `src/server.ts` Lifecycle Pipeline
1. **Error Capture Initialization**: Imports `src/lib/error-capture.ts` to hook global unhandled errors.
2. **Route Validation Before SSR**:
   ```ts
   const url = new URL(request.url);
   if (isNotFoundRequest(url.pathname)) {
     return new Response(renderNotFoundPage(), {
       status: 404,
       headers: { "content-type": "text/html; charset=utf-8" },
     });
   }
   ```
   Prevents unknown URLs from triggering heavy React SSR rendering crashes.
3. **SSR Stream Execution**: Invokes `createStartHandler(defaultStreamHandler).fetch(request, env, ctx)`.
4. **Catastrophic SSR Normalization**:
   Nitro/h3 catches in-handler throws and converts them to JSON `{"unhandled":true,"message":"HTTPError"}`. `normalizeCatastrophicSsrResponse` intercepts these responses and replaces them with a polished standalone HTML 500 recovery page.

### `src/start.ts` Middleware
Defines `errorMiddleware` that wraps all incoming server requests and renders custom error fallback HTML if unhandled runtime exceptions escape the React tree.

---

## 3. Server Functions (`createServerFn`)

TanStack Start provides RPC-style type-safe server functions that can be directly called from client code:

### Standard Pattern (`src/lib/api/example.functions.ts`)
```ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerConfig } from "../config.server";

export const getGreeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data }) => {
    const config = getServerConfig();
    return {
      greeting: `Hello, ${data.name}!`,
      mode: config.nodeEnv ?? "unknown",
    };
  });
```

### Critical Rules for Server Code:
1. **Module Suffixes**: Any file containing database secrets, private API keys, or server-only utilities must use the `.server.ts` suffix (e.g. `config.server.ts`). Vite will automatically tree-shake these files out of the browser client bundle.
2. **Environment Variables**:
   * **Client/Public Vars**: Use `import.meta.env.VITE_*` (defined in `.env`). Safe to ship to browser.
   * **Server Secrets**: Use `process.env.*` inside `.server.ts` or inside `createServerFn.handler()`. Never put database connection strings or service role keys in `VITE_*` variables.
   * **Per-Request Binding**: In Cloudflare Workers and serverless environments, `process.env` binds per-request. Always access environment variables inside functions rather than at top-level module scope.

---

## 4. Supabase Backend Services

VersoLyn relies on Supabase as its cloud backend:
* **Client File**: `src/lib/supabase.ts`
* **Configuration**:
  * `VITE_SUPABASE_URL`: Supabase project URL (`https://opygyrrmtfvwwatxqhft.supabase.co`)
  * `VITE_SUPABASE_ANON_KEY`: Supabase anon/public key
* **Core Responsibilities**:
  1. **Dataset Hosting**:
     * `songs`: Remote database of Tamil worship songs.
     * `english_bible`: Complete 31,102 verses (KJV).
     * `tamil_bible`: Complete 31,102 verses (BSI Tamil translation).
  2. **Realtime WebSocket Channels**:
     * Used for low-latency peer-to-peer style broadcast messaging between host laptop and mobile devices without requiring dedicated backend microservices.
