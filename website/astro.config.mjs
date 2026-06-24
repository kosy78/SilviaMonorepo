// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  adapter: vercel(),
  integrations: [react(), mdx()],
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
});
