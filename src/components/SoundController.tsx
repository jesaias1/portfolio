'use client';

import { useSound } from '@/hooks/use-sound';
import { motion } from 'framer-motion';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import { useEffect, useState } from 'react';

export default function SoundController() {
  const { isMuted, toggleMute } = useSound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={toggleMute}
      className={`
        fixed bottom-6 left-6 z-50 p-3 rounded-full border transition-all duration-300
        ${isMuted 
          ? 'bg-black/50 border-white/10 text-gray-500 hover:text-white hover:border-white/30' 
          : 'bg-[#4ddbff]/10 border-[#4ddbff]/30 text-[#4ddbff] hover:bg-[#4ddbff]/20 hover:border-[#4ddbff]/50 shadow-[0_0_15px_rgba(77,219,255,0.2)]'
        }
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {isMuted ? <HiVolumeOff size={20} /> : <HiVolumeUp size={20} />}
      
      {/* Sound wave animation when active */}
      {!isMuted && (
        <span className="absolute inset-0 rounded-full border border-[#4ddbff] animate-ping opacity-20" />
      )}
    </motion.button>
  );
}
