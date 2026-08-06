import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({
      preset: "vercel",
      hooks: {
        compiled(nitroApp) {
          try {
            const configPath = path.resolve(nitroApp.options.output.dir, "config.json");
            if (fs.existsSync(configPath)) {
              const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
              if (Array.isArray(config.routes)) {
                config.routes = config.routes.map((route: any) => {
                  if (route.headers && !route.dest && !route.handle) {
                    return { ...route, continue: true };
                  }
                  return route;
                });
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                console.log("[Nitro Hook] Successfully patched .vercel/output/config.json with continue: true");
              }
            }
          } catch (e) {
            console.error("[Nitro Hook] Error patching config.json:", e);
          }
        },
      },
    }),
    tailwindcss(),
    react(),
    tsconfigPaths(),
  ],
  server: {},
});
