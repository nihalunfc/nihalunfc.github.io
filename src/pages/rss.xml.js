import rss from '@astrojs/rss';
import { getPosts } from '../lib';
import { SITE_URL } from '../site';
export async function GET() {
  const posts = await getPosts();
  return rss({
    title: 'Nihal Sulaiman · Blog',
    description: 'Data engineering, BI, Kaggle and machine-learning notes from building real projects.',
    site: SITE_URL,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `/blog/${p.id}/`, categories: p.data.tags })),
    customData: '<language>en-ca</language>',
  });
}
