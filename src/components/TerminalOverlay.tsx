'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/use-sound';

interface TerminalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminalOverlay({ isOpen, onClose }: TerminalOverlayProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['SYS_BOOT: OK', 'AUTH: GRANTED', 'Welcome to the Jesaias OS v2.0. Type "help" for a list of commands.']);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { play } = useSound();

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => inputRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    setHistory(prev => [...prev, `> ${input}`]);
    setInput('');
    play('typing'); // Typing click SFX

    // Command Logic
    switch (cmd) {
      case 'help':
        setHistory(prev => [...prev, 'Available commands:', '- about: Brief bio', '- work: Go to projects', '- social: Links', '- clear: Clear display', '- exit: Shutdown terminal']);
        break;
      case 'about':
        setHistory(prev => [...prev, 'BIO: Full-stack engineer and creative developer. Building premium digital experiences with modern web technologies.']);
        break;
      case 'work':
      case 'projects':
        setHistory(prev => [...prev, 'INITIALIZING NAVIGATION...']);
        window.dispatchEvent(new CustomEvent('glitch-trigger'));
        setTimeout(() => {
          onClose();
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }, 400); // Sync with cover time
        break;
      case 'social':
        setHistory(prev => [...prev, 'FIND ME ON:', 'GitHub: @jesaias1', 'LinkedIn: Jesaias G.', 'Instagram: @jesaias_music']);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
        setHistory(prev => [...prev, 'SHUTDOWN INITIATED...']);
        setTimeout(onClose, 500);
        break;
      case 'root':
      case 'admin':
      case '/admin':
        setHistory(prev => [...prev, 'ACCESSING CORE SYSTEM...', 'REDIRECTING TO ADMIN LOGIN...']);
        window.dispatchEvent(new CustomEvent('glitch-trigger'));
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 400);
        break;
      default:
        setHistory(prev => [...prev, `ERR: Command "${cmd}" not found. Type "help" for assistance.`]);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        ref={dialogRef}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl aspect-[4/3] bg-[#0a0a0a] border border-[#4ddbff]/30 rounded-lg shadow-[0_0_50px_rgba(77,219,255,0.15)] flex flex-col overflow-hidden relative"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terminal-title"
      >
        {/* CRT Scanline Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10 opacity-30" />
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#4ddbff]/20 bg-[#111]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span id="terminal-title" className="text-[10px] font-mono text-[#4ddbff]/70 uppercase tracking-widest">Jesaias_OS_v2.0</span>
          <button type="button" onClick={onClose} aria-label="Close terminal" className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#4ddbff]/70 hover:text-[#4ddbff]">
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div 
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="flex-1 overflow-y-auto p-6 font-mono text-xs md:text-sm text-[#4ddbff]/80 space-y-2 scrollbar-hide"
        >
          {history.map((line, i) => (
            <div key={i} className={line.startsWith('>') ? 'text-[#4ddbff]' : 'text-[#4ddbff]/60'}>
              {line}
            </div>
          ))}
          
          <form onSubmit={handleCommand} className="flex items-center space-x-2">
            <span className="text-[#4ddbff] shrink-0">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => {
                setInput(e.target.value);
                if (e.target.value.length > input.length) play('typing'); // Sound per character
              }}
              className="bg-transparent border-none outline-none text-[#4ddbff] w-full caret-[#4ddbff]"
              aria-label="Terminal command"
              autoComplete="off"
              autoFocus
            />
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
