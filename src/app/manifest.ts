import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jesaias — Creative Developer',
    short_name: 'Jesaias',
    description: 'Code, sound and playful systems — built with intent.',
    start_url: '/?demo=app',
    scope: '/',
    display: 'standalone',
    background_color: '#050607',
    theme_color: '#050607',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/app-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
