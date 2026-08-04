import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// Dedicated Vite config for Electron SPA build (no SSR, no server)
export default defineConfig({
  plugins: [tailwindcss(), react(), tsconfigPaths()],
  base: "./",
  build: {
    outDir: "dist-electron/renderer",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "index.electron.html"),
      output: {
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  define: {
    "process.env.IS_ELECTRON": JSON.stringify("true"),
    "import.meta.env.IS_ELECTRON": JSON.stringify("true"),
  },
});
