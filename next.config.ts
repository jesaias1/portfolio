import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};


export default nextConfig;
