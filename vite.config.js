import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "pv-5276f977aeec-9240c92c-d90d-4ed5-8604-ca000dbb8e39.style.dev",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/firebase/") || id.includes("node_modules/@firebase/")) {
            return "firebase-vendor";
          }
        },
      },
    },
  },
});
