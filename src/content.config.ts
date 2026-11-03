import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(['Business intelligence', 'Applied AI', 'Kaggle', 'Tools']),
    status: z.enum(['Live', 'Ongoing', 'Complete']),
    date: z.coerce.date(),
    order: z.number().default(50),
    featured: z.boolean().default(false),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects };
