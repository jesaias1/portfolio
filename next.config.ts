import type { NextConfig } from "next";

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
};


export default nextConfig;
