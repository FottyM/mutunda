import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    tags: z.array(z.string().min(1)).min(1),
    draft: z.boolean().default(false),
    canonicalUrl: z.url().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    description: z.string().min(1),
    role: z.string().min(1),
    year: z.number().int(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    technologies: z.array(z.string().min(1)).min(1),
    links: z.object({
      live: z.url().optional(),
      repository: z.url().optional(),
    }),
  }),
});

export const collections = { writing, projects };
