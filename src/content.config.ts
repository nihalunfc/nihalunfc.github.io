import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { FIELD_IDS, KIND_IDS } from './data/fields';

const field = z.enum(FIELD_IDS);   // one of the eight fields, see src/data/fields.ts
const kind = z.enum(KIND_IDS);     // bi | optimisation | tools | pipelines | ml
// Progress ticker parts. `added` marks a part added after the original plan.
const parts = z.array(z.object({ name: z.string(), done: z.boolean().default(false), added: z.coerce.date().optional() })).default([]);

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
    field,
    kind,
    parts,
    status: z.enum(['Live', 'Ongoing', 'Complete']),
    date: z.coerce.date(),
    order: z.number().default(50),
    featured: z.boolean().default(false),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    demo: z.string().optional(),   // the live dashboard or demo, shown as the first button under the title
    repo: z.string().optional(),   // the code, shown as the second button
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
    field,
    kind,
    parts,
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
    parts,
    href: z.string(),                                // where the course lives, e.g. /learn/etl-course/
    length: z.string(),                              // e.g. "7 weeks · 49 days · about 4 hours a day"
    level: z.string().default('Intermediate'),
    topics: z.array(z.string()).default([]),
    who: z.string().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    duration: z.string().optional(),                 // calendar length, e.g. "7 weeks" or "Self-paced, 3 to 4 weeks"
    hours: z.number().optional(),                    // total study time in hours, shown on the card
    lessons: z.number().optional(),                  // number of lessons or days (taken from the lessons collection when it has them)
    progressKey: z.string().optional(),              // localStorage key the course saves ticks under, so the card can show the learner's progress
    // Module names for the card's drop-down. Courses written in src/content/lessons/<id>/ number their lessons by `module`.
    modules: z.array(z.object({ name: z.string(), summary: z.string().optional(), size: z.string().optional() })).default([]),
  }),
});

// Lessons for courses that are written in this repo and built by Astro (rather than a static
// site in public/learn/<id>/). One file per lesson: src/content/lessons/<course>/<NN>-<slug>.md,
// served at /learn/<course>/lessons/<slug>/. `page: true` files are course pages at /learn/<course>/pages/<slug>/.
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    module: z.number().default(0),
    minutes: z.number().default(20),
    page: z.boolean().default(false),
    outcomes: z.array(z.string()).default([]),
    quiz: z.array(z.object({ q: z.string(), options: z.array(z.string()), answer: z.number(), why: z.string() })).default([]),
  }),
});

// Swarm: the flagship section. One file per swarm application in src/content/swarm/<id>.md;
// the live demo is a static page at public/swarm/<id>/ (or anywhere `demo` points).
const swarm = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/swarm' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    field,
    parts,
    status: z.enum(['Live', 'In progress', 'Planned']),
    order: z.number().default(50),
    date: z.coerce.date(),
    demo: z.string().optional(),
    code: z.string().optional(),      // where the demo's code lives (a GitHub repo or folder URL)
    stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    project: z.string().optional(),   // a related project id, e.g. warl-wildfire
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
    ref: z.string().optional(),      // id of the project or tool page this updates, e.g. tools/shift-scheduler, projects/bi-toolkit, courses/etl-course, swarm/grid-batteries
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects, tools, courses, lessons, swarm, log };
