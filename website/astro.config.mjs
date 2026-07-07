// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Domeniu canonic de producție; vezi operations/domain-and-launch.md.
  site: "https://despresine.ro",
  integrations: [react(), mdx(), sitemap()],
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
});
