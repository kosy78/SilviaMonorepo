// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Domeniu substituent până la decizia finală; vezi operations/domain-and-launch.md.
  site: "https://silvia-dinu.example",
  adapter: vercel(),
  integrations: [react(), mdx(), sitemap()],
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
});
