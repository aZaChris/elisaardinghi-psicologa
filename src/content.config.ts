import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string().max(200),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true)
  })
});

export const collections = {
  blog: blogCollection,
};
