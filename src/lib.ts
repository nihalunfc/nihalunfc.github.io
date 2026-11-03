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

const TZ = 'America/Toronto';
export const fmtTime = (d: Date) => d.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: TZ });
export const dayKey = (d: Date) => d.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ });
export const fmtDay = (d: Date) => d.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: TZ });
