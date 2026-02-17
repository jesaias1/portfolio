'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Glitch 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mb-8"
        >
          <h1 
            className="text-[8rem] md:text-[12rem] font-mono font-bold leading-none glitch-text text-[#4ddbff]"
            data-text="404"
            style={{ textShadow: '0 0 40px rgba(77, 219, 255, 0.3), 0 0 80px rgba(77, 219, 255, 0.1)' }}
          >
            404
          </h1>
        </motion.div>

        {/* Terminal error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="border border-white/10 bg-[#0c0c0c] inline-block text-left w-full max-w-lg">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] text-gray-600 font-mono ml-1">error.log</span>
            </div>
            
            {/* Terminal body */}
            <div className="p-6 space-y-2 font-mono text-sm">
              <div className="text-red-400">
                {'>'} ERROR: File not found
              </div>
              <div className="text-gray-600">
                {'>'} Path: <span className="text-gray-400">{typeof window !== 'undefined' ? window.location.pathname : '/unknown'}</span>
              </div>
              <div className="text-gray-600">
                {'>'} Status: <span className="text-[#4ddbff]">404 NOT_FOUND</span>
              </div>
              <div className="text-gray-700 mt-4">
                {'>'} The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="px-8 py-3 font-mono text-sm bg-[#4ddbff]/10 border border-[#4ddbff]/40 text-[#4ddbff] hover:bg-[#4ddbff]/20 hover:border-[#4ddbff]/70 transition-all"
            style={{ boxShadow: '0 0 20px rgba(77, 219, 255, 0.1)' }}
          >
            ./go_home
          </Link>
          <Link
            href="/#projects"
            className="px-8 py-3 font-mono text-sm border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-all"
          >
            ./view_projects
          </Link>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 font-mono text-[10px] text-gray-700"
        >
          process exited with code 1
        </motion.div>
      </div>
    </div>
  );
}
