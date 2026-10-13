import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Entry ids look like `sk/bistro-lipa`: the folder is the language, the file name is the slug. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      type: z.enum(['website', 'webapp', 'automation', 'mobile']),
      /** Omit when there is no permission to name the client. */
      client: z.string().optional(),
      year: z.number().int(),
      stack: z.array(z.string()).min(1),
      problem: z.string(),
      solution: z.string(),
      /** Real numbers only. Concept projects have none, so the default is empty. */
      results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      cover: image(),
      gallery: z.array(image()).optional(),
      demoUrl: z.url().optional(),
      repoUrl: z.url().optional(),
      featured: z.boolean().default(false),
      order: z.number().int().default(0),
      /** Drafts never appear in production builds. */
      draft: z.boolean().default(false),
      /** Marks a demo project: the card and page show "Koncept / Demo project". */
      concept: z.boolean().default(false),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    /** Starting price in EUR. */
    priceFrom: z.number().nonnegative(),
    duration: z.string(),
    includes: z.array(z.string()).min(1),
    order: z.number().int(),
  }),
});

export const collections = { projects, services };
