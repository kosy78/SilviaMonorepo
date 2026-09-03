// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Domeniu canonic de producție; vezi operations/domain-and-launch.md.
  site: "https://despresine.ro",
  integrations: [
    react(),
    mdx(),
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
  },
});
