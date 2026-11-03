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

// Activity log, written by the #UpdateLog skill: one file per activity,
// src/content/log/YYYY-MM-DD-HHMM-slug.md, committed with its real time as the commit date.
const log = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/log' }),
  schema: z.object({
    time: z.coerce.date(),
    title: z.string(),
    project: z.string(),
    status: z.enum(['started', 'progress', 'done', 'blocked', 'idea']).default('progress'),
    link: z.string().optional(),     // the page or demo to look at
    repo: z.string().optional(),     // the code: a GitHub repo, folder or file URL
    commit: z.string().optional(),   // the commit with the actual work, in any repo
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects, log };
