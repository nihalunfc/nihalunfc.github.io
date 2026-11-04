import { getCollection } from 'astro:content';

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const catClass = (c: string) => (c === 'Kaggle' ? 'cat-kaggle' : c === 'Business intelligence' ? 'cat-bi' : '');

export async function getPosts() {
  const all = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjects() {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getTools() {
  const all = await getCollection('tools');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getCourses() {
  const all = await getCollection('courses');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getUpdates(ref: string) {
  return (await getLog()).filter((e) => e.data.ref === ref);
}

export function readingTime(body = '') {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getLog() {
  const all = await getCollection('log');
  return all.sort((a, b) => b.data.time.valueOf() - a.data.time.valueOf());
}

// Entry number: #1 is the oldest entry, so numbers never change when new ones are added.
export async function logNumbers() {
  const all = await getLog();
  const m = new Map<string, number>();
  all.slice().reverse().forEach((e, i) => m.set(e.id, i + 1));
  return m;
}

// One colour per project, the same everywhere (log, filters). Eight muted hues that read in light and dark.
const HUES = [212, 152, 28, 280, 350, 190, 48, 100];
export function projectHue(name: string) {
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return HUES[h % HUES.length];
}

// Progress ticker. `parts` in frontmatter: [{ name, done, added }]; a part with `added`
// was added after the original plan (an extension). Without `parts`, the ticker is derived:
// live editions are done parts, planned editions and roadmap items are open parts.
export type Part = { name: string; done: boolean; added?: Date };
export function partsFor(d: { parts?: Part[]; editions?: { sector: string; status: string }[]; roadmap?: string[] }): Part[] {
  if (d.parts && d.parts.length) return d.parts;
  return [
    ...(d.editions || []).map((e) => ({ name: `${e.sector} edition`, done: e.status === 'Live' })),
    ...(d.roadmap || []).map((r) => ({ name: r, done: false })),
  ];
}

const TZ = 'America/Toronto';
export const fmtTime = (d: Date) => d.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: TZ });
export const dayKey = (d: Date) => d.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ });
export const fmtDay = (d: Date) => d.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: TZ });

// Lessons of a course written in src/content/lessons/<course>/ (see content.config.ts).
// Files are named NN-slug.md; the number sets the order and is dropped from the URL.
export async function getLessons(course: string) {
  const all = (await getCollection('lessons')).filter((l) => l.id.startsWith(course + '/'));
  return all
    .map((l) => {
      const file = l.id.slice(course.length + 1);
      const n = parseInt(file, 10) || 0;
      const slug = file.replace(/^\d+-/, '');
      const base = l.data.page ? 'pages' : 'lessons';
      return { entry: l, n, slug, href: `/learn/${course}/${base}/${slug}/` };
    })
    .sort((a, b) => a.n - b.n);
}
