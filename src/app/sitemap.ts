import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Evaluated at build time, so it moves forward with every deploy.
const lastModified = new Date();

const routes: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/audio', priority: 0.9 },
  { path: '/audio/orvo', priority: 0.9 },
  { path: '/audio/midium', priority: 0.8 },
  { path: '/audio/abyx', priority: 0.8 },
  { path: '/projects/kvizy', priority: 0.8 },
  { path: '/projects/playhead', priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }));
}
