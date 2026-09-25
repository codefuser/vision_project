# VersoLyn — Security Audit & Remediation Report

**Date**: September 25, 2026  
**Auditor**: Senior Application Security Engineer & Full-Stack Developer  
**Target Application**: VersoLyn (Vision Projector)  
**Production URL**: [https://versolyn.vercel.app/](https://versolyn.vercel.app/)  
**Audit Scope**: Full Codebase, Dependencies, Supabase RLS, API & Server Handlers, Native Companion Agent, Client Security & Headers  
**Status**: Confirmed Vulnerabilities Fixed & Regression Tested

---

## Executive Summary

VersoLyn is a modern, high-performance, offline-first church presentation application. Unlike traditional cloud multi-tenant web applications, VersoLyn stores user media, playlists, session events, and application settings locally on the client machine using browser IndexedDB (`Dexie.js` and `idb-keyval`). Supabase is utilized as a read-only distribution repository for public Tamil and English worship songs and Scripture, and as a signaling/broadcast transport for remote control, congregation live streaming, and remote desktop pairing.

All confirmed vulnerabilities identified during Phase 1 have been remediated with defense-in-depth architectural controls and thoroughly regression-tested:
* **VULN-01 (CRITICAL)**: Command Injection and Cross-Site WebSocket Hijacking in the Native Companion Agent were eliminated through strict Origin validation, an application pairing token handshake, ephemeral session tokens, and structurally invariant Base64 clipboard transport into PowerShell.
* **VULN-02 (HIGH)**: DOM-based Cross-Site Scripting in Session History print export was resolved through strict HTML entity encoding of all user-controlled variables.
* **RISK-01 (MEDIUM)**: Enterprise HTTP security headers (`nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`, `Permissions-Policy`, and strict `Content-Security-Policy`) were configured in `vercel.json`.
* **RISK-02 (LOW)**: `'unsafe-eval'` was removed from `<meta http-equiv="Content-Security-Policy">`.
* **RISK-03 (LOW)**: Direct `innerHTML` assignment in drag-and-drop ghost elements was replaced with safe DOM element construction.

---

## Vulnerabilities Fixed & Verification Status

### VULN-01
* **Severity**: CRITICAL
* **Vulnerability**: Command Injection & Cross-Site WebSocket Hijacking (CSWSH) in Native Host Companion Agent
* **Affected File**: `native-agent/server.mjs`
* **Client Handlers**: `src/features/remote-desktop/services/native-agent-client.ts`, `src/features/remote-desktop/stores/rd-host.store.ts`, `src/features/remote-desktop/components/RemoteDesktopHostView.tsx`
* **Status**: **FIXED**
* **Fix**:
  1. **Strict WebSocket Origin Validation**: Added `verifyClient` checking incoming `Origin` against `https://versolyn.vercel.app` and local development hosts (`localhost`, `127.0.0.1`). Unauthorized origins are rejected with HTTP 403 / closed with code 1008.
  2. **Application-Level Pairing & Session Authentication**: The agent manages a persistent/configurable pairing token in `.agent-token`. On connection, the client must present the pairing token during `HANDSHAKE` or via `AUTHENTICATE`. Upon verification, the agent issues an ephemeral cryptographic `sessionToken` (`crypto.randomBytes(24)`). All subsequent `INPUT_EVENT` payloads must include the valid `sessionToken` or they are dropped immediately.
  3. **Structurally Invariant Base64 Data Transport**: `CLIPBOARD_PASTE` converts the input text to UTF-8 bytes and encodes it as Base64. A strict regex (`/^[A-Za-z0-9+/=]+$/`) validates the Base64 string before it is passed to PowerShell. Inside PowerShell, `[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String(...))` decodes the string safely as data, eliminating newline breakout and quote escape attacks.
  4. **Strict Handler Input Validation**: Mouse coordinates, wheel deltas, keyboard codes, and shortcuts are verified as finite numbers or against whitelists before execution.
* **Testing**:
  - Authorized connection (`https://versolyn.vercel.app`): **PASS**
  - Unauthorized origin rejection (`https://malicious-website.com`): **PASS (HTTP 403 / Closed 1008)**
  - Unauthenticated command rejection (`INPUT_EVENT` without token): **PASS (Blocked with ERROR response)**
  - Authenticated handshake with pairing token: **PASS (Issued sessionToken)**
  - Malicious clipboard payloads (`'; Start-Process calc; #\n`nGet-Process\n`): **PASS (Pasted as literal text, zero command execution)**
  - Normal clipboard paste: **PASS**

---

### VULN-02
* **Severity**: HIGH
* **Vulnerability**: DOM-based Cross-Site Scripting (XSS) in Session History Print Export
* **Affected File**: `src/features/history/SessionExportMenu.tsx`
* **Status**: **FIXED**
* **Fix**:
  Implemented a dedicated HTML escaping utility `escapeHtml(str)` that safely sanitizes `&`, `<`, `>`, `"`, and `'`. Applied `escapeHtml` to all user-controlled dynamic interpolations (`session.name`, `session.date`, `e.label`, `e.detail`, `e.module`, and `duration`) before constructing the print export HTML string.
* **Testing**:
  - Script tag injection (`<script>alert(1)</script>`): **PASS (Escaped to `&lt;script&gt;alert(1)&lt;/script&gt;`)**
  - Image onerror injection (`<img src=x onerror=alert(1)>`): **PASS (Escaped to `&lt;img src=x onerror=alert(1)&gt;`)**
  - Quote breakout (`"><script>alert(1)</script>`): **PASS (Escaped to `&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;`)**
  - Special characters (`& < > " '`): **PASS (Escaped to `&amp; &lt; &gt; &quot; &#39;`)**
  - Normal session text rendering: **PASS**

---

### RISK-01
* **Severity**: MEDIUM
* **Vulnerability**: Missing Production HTTP Security Headers
* **Affected File**: `vercel.json`
* **Status**: **FIXED** (Code configuration fixed in `vercel.json`; production deployment verification pending deployment to Vercel)
* **Fix**:
  Configured enterprise HTTP security headers in `vercel.json` for all routes:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN` (allows legitimate dual-window projection popup while preventing cross-origin clickjacking)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), display-capture=(self)` (permits screen sharing for Remote Desktop while restricting camera, mic, and location)
  - `Content-Security-Policy`: Strictest practical policy supporting Supabase, WebSockets, WebRTC, Google Fonts, and local blob media without `'unsafe-eval'`.
* **Testing**:
  - Configuration syntax and Vercel output validation: **PASS**
  - Production build generation (`vite build` -> Nitro Vercel preset): **PASS**

---

### RISK-02
* **Severity**: LOW
* **Vulnerability**: Overly Permissive Directives in Meta Content Security Policy (`'unsafe-eval'`)
* **Affected File**: `src/routes/__root.tsx`
* **Status**: **FIXED**
* **Fix**:
  Removed `'unsafe-eval'` from `<meta http-equiv="Content-Security-Policy">` and harmonized the meta directives with the HTTP header policy.
* **Testing**:
  - Codebase audited for `eval()`, `new Function()`, `setTimeout(string)`: None found.
  - Production build and client bundle generation: **PASS**

---

### RISK-03
* **Severity**: LOW
* **Vulnerability**: Direct `innerHTML` Assignment in Drag-and-Drop Ghost Element
* **Affected File**: `src/features/library/LibraryExplorerGrid.tsx`
* **Status**: **FIXED**
* **Fix**:
  Replaced direct `ghost.innerHTML = ...` with safe DOM element construction using `document.createElement("span")` and `span.textContent = ...`.
* **Testing**:
  - DOM element creation test: **PASS**
  - Drag-and-drop visual representation: **PASS**

---

## Phase 1 Reconnaissance Summary Table

| # | Inspection Item | Value / Finding | Security Context |
|---|---|---|---|
| **1** | **Framework** | TanStack Start (`@tanstack/react-start` v1.167.50) + TanStack Router (`@tanstack/react-router` v1.168.25) running on Vite 7 (`vite` v7.3.1) with Nitro (`nitro/vite` preset: `"vercel"`). | Modern SSR & client hydration architecture. |
| **2** | **Next.js Version** | **Not Applicable / Not Installed** | Application is built using TanStack Start on Vite. |
| **3** | **React Version** | `19.2.0` (`react` & `react-dom`) | Stable React 19 with default automatic JSX escaping. |
| **4** | **Node.js Version** | Target: `@types/node` v22.16.5; Local runtime: Node.js v24.18.0 | Active LTS environment. |
| **5** | **Package Manager** | `npm` (`package-lock.json` lockfile v3 present; `bun.lock` also present) | Standard npm toolchain. |
| **6** | **Supabase Integration** | `@supabase/supabase-js` v2.110.7 in `src/lib/supabase.ts` | Read-only public catalog & WebSockets for real-time broadcasts. |
| **7** | **Authentication System** | Decentralized / Offline-First | No cloud user accounts or password tables in Supabase. Mobile Remote uses zero-knowledge SHA-256 challenge-response; Remote Desktop uses 6-digit PIN + host approval; Live QR uses ephemeral token. |
| **8** | **API Routes** | `src/lib/api/example.functions.ts` (`getGreeting` via `createServerFn`) | Single RPC-style server function. No exposed REST APIs. |
| **9** | **Server Actions** | **Not Applicable** | TanStack Start RPC `createServerFn` used instead of Next.js Server Actions. |
| **10** | **Middleware** | `src/start.ts` (`errorMiddleware`), `src/server.ts` (`isNotFoundRequest` route validation & SSR normalization) | Shields server against unhandled exceptions escaping React SSR. |
| **11** | **Database Access Patterns** | Client: Dexie (IndexedDB `church-media-db`), `idb-keyval`. Cloud: Supabase PostgREST (read-only) & Realtime channels. | Strictly local writes; cloud writes are not performed by client code. |
| **12** | **Environment Variables** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `process.env.NODE_ENV` | Managed via `.env` and `src/lib/config.server.ts`. |
| **13** | **Client-Exposed Variables** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Public publishable anon key. Not a secret. |
| **14** | **Admin Functionality** | Local Operator Controls | No cloud admin dashboard. Local operator manages screen projection, remote connections, and presentation state. |
| **15** | **File Upload Functionality** | Local Browser IndexedDB Only | Media imports store raw binary Blobs in Dexie `blobs` table. No remote cloud uploads or cloud bucket storage. |
| **16** | **User-Generated Content** | Song titles/lyrics, Bible bookmarks, playlists, session names, custom announcement text, media tags. | Stored in IndexedDB and rendered via React JSX (auto-escaped) with print export sanitized via `escapeHtml()`. |
| **17** | **External API Integrations** | Supabase REST/Realtime; Google Fonts stylesheets. | No external payment processors, OAuth, or external webhooks. |
| **18** | **URL Fetching Functionality** | None. No server-side arbitrary URL fetching (`fetch(userInput)`). | SSRF is **NOT APPLICABLE**. |
| **19** | **Dynamic HTML Rendering** | `SessionExportMenu.tsx` (`exportPDF`), `ProjectionControl.tsx` (test window), `error-page.ts` (static SSR error page). | HTML string generation for popups now strictly sanitized. |
| **20** | **dangerouslySetInnerHTML** | `src/routes/__root.tsx` (JSON-LD metadata), `src/components/ui/chart.tsx` (theme CSS vars). | Verified safe: uses hardcoded constants and theme colors. |
| **21** | **iframe Usage** | None. | No iframe elements found across the entire codebase. |
| **22** | **Redirect Logic** | `src/routes/index.tsx` checks `settings.defaultStartupPage`. | Whitelisted internal route navigation only (`/project`, `/library`, `/playlists`). |
| **23** | **Auth / Authorization Checks** | Remote Host checks cryptographic `sessionToken` on all command payloads and verifies `device.enabled`. Remote Desktop requires operator approval in `HostApprovalModal`. | Enforced locally before executing actions. |

---

## Dependency Security Audit

Audited via `npm audit` on Node.js v24.18.0:
* Core production dependencies (`react` 19.2.0, `@tanstack/react-start` 1.167.50, `@supabase/supabase-js` 2.110.7, `dexie` 4.4.3) have **zero confirmed production CVEs**.
* Reported advisory packages (`brace-expansion`, `browserslist`, `js-yaml`, `nanoid`, `postcss`, `sharp`) are build-time tools, compiler plugins, or linter dependencies. None of these vulnerabilities are exploitable in the client runtime or production web application.

---

## Supabase & Database Security Audit

Direct automated verification was performed against the live Supabase instance (`https://opygyrrmtfvwwatxqhft.supabase.co`):
1. **`songs` table**:
   - `SELECT`: Allowed for public worship catalog (Returns HTTP 200).
   - `INSERT`: **DENIED** by RLS (`42501: new row violates row-level security policy for table "songs"`).
   - `UPDATE`: **DENIED** by RLS (0 rows updated).
   - `DELETE`: **DENIED** by RLS (0 rows deleted).
2. **`english_bible` table**:
   - `SELECT`: Allowed for public Bible reading (Returns HTTP 200).
   - `INSERT`: **DENIED** by RLS (`42501: new row violates row-level security policy for table "english_bible"`).
3. **`tamil_bible` table**:
   - `SELECT`: Allowed for public Bible reading (Returns HTTP 200).
   - `INSERT`: **DENIED** by RLS (`42501: new row violates row-level security policy for table "tamil_bible"`).
4. **`users` / `profiles` tables**:
   - Do not exist in the public schema (HTTP 404 `PGRST205`). No unintended user data exposure.
5. **Secrets & Keys**:
   - No `service_role` key is committed, bundled, or referenced in the repository.

---

## Remaining Risks

1. **Production Deployment Header Activation**: The HTTP security headers configured in `vercel.json` will become active on `https://versolyn.vercel.app/` once the updated repository is deployed to Vercel. Until deployment occurs, the live domain continues to serve the previous Vercel configuration without `X-Content-Type-Options` or `X-Frame-Options`.
2. **Native Companion Agent Host Security**: The Native Companion Agent (`native-agent/server.mjs`) provides OS-level hardware input injection on Windows. Although protected by Origin checking and pairing PIN authentication, users running this optional bridge should ensure they keep their 6-digit pairing PIN private and only run the agent on trusted networks.
