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
    optimizePackageImports: ['framer-motion', 'react-icons', 'three', '@react-three/drei', '@react-three/fiber'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
};


export default nextConfig;
