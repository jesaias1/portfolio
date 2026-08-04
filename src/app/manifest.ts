import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jesaias — Creative Developer',
    short_name: 'Jesaias',
    description: 'Code, sound and playful systems — built with intent.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050607',
    theme_color: '#050607',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
