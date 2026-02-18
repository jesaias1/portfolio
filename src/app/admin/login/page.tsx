'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Ugyldige loginoplysninger');
      } else {
        toast.success('Login vellykket!');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      toast.error('Der opstod en fejl');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-block border border-[#4ddbff]/20 bg-[#0c0c0c] px-4 py-1 mb-6">
              <span className="font-mono text-[10px] text-[#4ddbff]" style={{ textShadow: '0 0 8px rgba(77, 219, 255, 0.3)' }}>
                {'>'} secure_login --admin
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Access Granted?
            </h1>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em]">Dashboard Authentication Required</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
                User Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/5 focus:border-[#4ddbff]/40 focus:outline-none transition-all font-mono text-sm"
                placeholder="admin@jesaias.dk"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
                Access Token
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/5 focus:border-[#4ddbff]/40 focus:outline-none transition-all font-mono text-sm"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(77, 219, 255, 0.15)' }}
              whileTap={{ scale: 0.99 }}
              className="w-full px-8 py-4 bg-[#4ddbff] text-black font-bold hover:bg-[#99eaff] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-[0.2em] relative overflow-hidden group"
            >
              <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Establish Connection'}</span>
              <motion.div 
                className="absolute inset-x-0 bottom-0 h-[2px] bg-white opacity-20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <a href="/" className="font-mono text-[10px] text-gray-600 hover:text-[#4ddbff] transition-colors uppercase tracking-widest group">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">{'<'}</span> Exit To Terminal
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
