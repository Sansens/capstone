import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build khusus untuk file HTML tunggal (tanpa server, bisa dibuka via file://)
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist-standalone",
    assetsDir: "assets",
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      input: "index.standalone.html",
      output: {
        format: "iife",
        inlineDynamicImports: true,
      },
    },
  },
});
