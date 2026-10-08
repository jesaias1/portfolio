import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === 'development';

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  `connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://raw.githack.com${isDevelopment ? ' ws: wss:' : ''}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDevelopment ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons', 'three', '@react-three/drei', '@react-three/fiber'],
  },
  turbopack: {
    root: process.cwd(),
  },
  poweredByHeader: false,
  async redirects() {
    return [
      // Keeps the Vercel preview hostname out of the page; swap the destination if a domain is added later.
      {
        source: '/play/ordbomben',
        destination: 'https://ordbomben-iicajd8io-jesaias-projects-402253d5.vercel.app',
        permanent: false,
      },
      {
        source: '/play/playhead',
        destination: 'https://playhead-sooty.vercel.app',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/((?!_next/).*)',
        headers: securityHeaders,
      },
      // Large media is revalidated daily rather than on every request; file names are not
      // versioned, so keep this short enough that a replaced video shows up quickly.
      ...['/reel/:path*', '/projects/videos/:path*', '/audio/products/:path*', '/video/:path*'].map((source) => ({
        source,
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      })),
    ];
  },
};


export default nextConfig;
