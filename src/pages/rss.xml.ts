import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const entries = (await getCollection("writing", ({ data }) => !data.draft && data.locale === "en"))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "Fortunat Mutunda — Field notes",
    description: "Technical notes about software systems and the work behind them.",
    site: context.site ?? "https://mutunda.me",
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/writing/${entry.id}/`,
    })),
  });
};
