import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), {
    name: "aventra-indexing-gate",
    transformIndexHtml(html) {
      return process.env.VITE_PRODUCTION_READY === "true" ? html.replace("noindex, nofollow", "index, follow") : html;
    },
  }],
  base: command === "build" ? (process.env.VITE_BASE_PATH || "/rent-car-react/") : "/",
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
}));