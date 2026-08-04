import { defineConfig } from "vite";
import { resolve } from "path";

// Builds the Electron main process and preload scripts into dist-electron/main/ as .cjs
export default defineConfig({
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, "electron/main.ts"),
        preload: resolve(__dirname, "electron/preload.ts"),
      },
      formats: ["cjs"],
    },
    outDir: "dist-electron/main",
    emptyOutDir: true,
    rollupOptions: {
      external: [
        "electron",
        "path",
        "url",
        "fs",
        "os",
        "crypto",
        "child_process",
        "stream",
        "http",
        "https",
        "net",
        "tls",
        "zlib",
        "util",
        "events",
        "buffer",
        "assert",
        "querystring",
      ],
      output: {
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name].cjs",
        format: "cjs",
      },
    },
    target: "node22",
    minify: false,
    sourcemap: false,
  },
  resolve: {
    conditions: ["node"],
  },
});
