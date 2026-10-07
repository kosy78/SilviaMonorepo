// @ts-check
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Domeniu canonic de producție; vezi operations/domain-and-launch.md.
  site: "https://despresine.ro",
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.endsWith("/design-system/") &&
        !page.endsWith("/reflectie-ghidata/rezultat/"),
    }),
  ],
  redirects: {
    "/despre-silvia/": {
      destination: "/competente/",
      status: 308,
    },
  },
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        // Local dependencies may be symlinked into the shared package cache.
        allow: [
          fileURLToPath(new URL(".", import.meta.url)),
          realpathSync(new URL("./node_modules", import.meta.url)),
        ],
      },
    },
  },
});
