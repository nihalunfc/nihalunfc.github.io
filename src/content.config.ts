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
    sectors: z.array(z.string()).default([]),       // who it's for, e.g. Hotels, Retail, Any business
    editions: z.array(z.object({ sector: z.string(), href: z.string().optional(), status: z.enum(['Live', 'In progress', 'Planned']) })).default([]),
    limitations: z.array(z.string()).default([]),
    roadmap: z.array(z.string()).default([]),
    updated: z.coerce.date().optional(),
  }),
});

// Tools: one file per tool, written to read as general, with sector editions.
// The #UpdateLog rules (public/update-log-rules.md) say when to add or change one.
const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    group: z.enum(['Pricing and revenue', 'Forecasting and planning', 'People and scheduling', 'Operations', 'Reporting', 'Energy and cost', 'Personal']),
    status: z.enum(['Live', 'Beta', 'In progress', 'Planned']),
    order: z.number().default(50),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    sectors: z.array(z.string()).default(['Any business']),
    editions: z.array(z.object({ sector: z.string(), href: z.string().optional(), status: z.enum(['Live', 'In progress', 'Planned']) })).default([]),
    open: z.string().optional(),                     // main link to use the tool
    code: z.string().optional(),
    who: z.array(z.string()).default([]),            // who can use it
    where: z.array(z.string()).default([]),          // where it's used: sectors and situations
    howto: z.array(z.string()).default([]),          // steps to use it
    limitations: z.array(z.string()).default([]),
    roadmap: z.array(z.string()).default([]),
    selfhost: z.array(z.string()).default([]),       // what a server, database or warehouse adds for this tool
    method: z.array(z.string()).default([]),         // techniques and stack
  }),
});

// Courses: one file per course in src/content/courses/<id>.md. The course itself is a
// static site in public/learn/<id>/ (progress saved in the learner's browser).
const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['Live', 'In progress', 'Planned']),
    order: z.number().default(50),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    href: z.string(),                                // where the course lives, e.g. /learn/etl-course/
    length: z.string(),                              // e.g. "7 weeks · 49 days · about 4 hours a day"
    level: z.string().default('Intermediate'),
    topics: z.array(z.string()).default([]),
    who: z.string().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
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
    ref: z.string().optional(),      // id of the project or tool page this updates, e.g. tools/shift-scheduler or courses/etl-course
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects, tools, courses, log };
