import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(true),
    localPreview: z.boolean().default(false),
    author: z.literal("Silvia Dinu"),
    cover: z
      .object({
        src: z.string().startsWith("/images/blog/"),
        alt: z.string(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
  }),
});

const areas = defineCollection({
  loader: glob({
    base: "./src/content/arii-de-lucru",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    reviewedAt: z.coerce.date().optional(),
    draft: z.boolean().default(true),
    localPreview: z.boolean().default(false),
  }),
});

export const collections = { blog, areas };
