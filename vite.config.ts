import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
  ssr: {
    // Leaflet and react-leaflet access `window` at import time and must never run in Node.js SSR.
    // Mark them as external so the server bundle skips them entirely.
    external: ["leaflet", "react-leaflet"],
  },
});
