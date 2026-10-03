import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [mdx(), sitemap()],
  output: "static",
  site: process.env.SITE_URL ?? "https://mutunda.me",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "et"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
