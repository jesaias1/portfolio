import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-08-04T00:00:00.000Z');

  return [
    {
      url: 'https://jesaias.dk',
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://jesaias.dk/audio',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://jesaias.dk/audio/orvo',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://jesaias.dk/audio/midium',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://jesaias.dk/audio/abyx',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://jesaias.dk/projects/kvizy',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
