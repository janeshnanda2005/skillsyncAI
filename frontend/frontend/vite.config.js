import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src").replace(/\\/g, "/"),
      "@/components": path.resolve(__dirname, "components").replace(/\\/g, "/"),
      "@/pages": path.resolve(__dirname, "pages").replace(/\\/g, "/"),
      "@/lib": path.resolve(__dirname, "lib").replace(/\\/g, "/"),
      "@/hooks": path.resolve(__dirname, "hooks").replace(/\\/g, "/"),
      "@/context": path.resolve(__dirname, "context").replace(/\\/g, "/"),
      "@/api": path.resolve(__dirname, "api").replace(/\\/g, "/"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});