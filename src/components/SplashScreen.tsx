'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';

// ASCII logo placeholder — user will provide their own
const ASCII_LOGO = `
     ██╗███████╗███████╗ █████╗ ██╗ █████╗ ███████╗
     ██║██╔════╝██╔════╝██╔══██╗██║██╔══██╗██╔════╝
     ██║█████╗  ███████╗███████║██║███████║███████╗
██   ██║██╔══╝  ╚════██║██╔══██║██║██╔══██║╚════██║
╚█████╔╝███████╗███████║██║  ██║██║██║  ██║███████║
 ╚════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝
`;

interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'progress' | 'success' | 'ascii' | 'blank';
  delay: number;
}

const TERMINAL_SEQUENCE: TerminalLine[] = [
  { text: '', type: 'blank', delay: 300 },
  { text: 'PS C:\\Users\\jesaias> node portfolio.js', type: 'command', delay: 0 },
  { text: '', type: 'blank', delay: 400 },
  { text: '[init] Loading modules...', type: 'output', delay: 200 },
  { text: '[init] Compiling components...', type: 'output', delay: 300 },
  { text: '[init] Connecting to database...', type: 'output', delay: 250 },
  { text: '[✓] All systems operational', type: 'success', delay: 400 },
  { text: '', type: 'blank', delay: 200 },
  { text: 'LOGO', type: 'ascii', delay: 100 },
  { text: '', type: 'blank', delay: 300 },
  { text: '[render] Building interface...', type: 'output', delay: 200 },
  { text: '[render] Injecting styles...', type: 'output', delay: 150 },
  { text: '[render] Mounting DOM...', type: 'output', delay: 200 },
  { text: '', type: 'blank', delay: 100 },
  { text: 'PROGRESS', type: 'progress', delay: 0 },
  { text: '', type: 'blank', delay: 200 },
  { text: '[✓] Portfolio ready. Launching...', type: 'success', delay: 500 },
];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedText, setTypedText] = useState('');
  const [currentTypingLine, setCurrentTypingLine] = useState(-1);
  const [progressValue, setProgressValue] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  const processLine = useCallback((lineIndex: number) => {
    if (lineIndex >= TERMINAL_SEQUENCE.length) {
      // All lines done — start exit
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, 600);
      }, 400);
      return;
    }

    const line = TERMINAL_SEQUENCE[lineIndex];
    
    if (line.type === 'command') {
      // Type out command character by character
      setCurrentTypingLine(lineIndex);
      setVisibleLines(lineIndex + 1);
      const fullText = line.text;
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        charIndex++;
        setTypedText(fullText.slice(0, charIndex));
        
        if (charIndex >= fullText.length) {
          clearInterval(typeInterval);
          setCurrentTypingLine(-1);
          setTimeout(() => processLine(lineIndex + 1), line.delay + 200);
        }
      }, 25 + Math.random() * 30);
    } else if (line.type === 'progress') {
      setVisibleLines(lineIndex + 1);
      setShowProgress(true);
      // Animate progress bar
      let prog = 0;
      const progressInterval = setInterval(() => {
        prog += 3 + Math.random() * 5;
        if (prog >= 100) {
          prog = 100;
          clearInterval(progressInterval);
          setTimeout(() => processLine(lineIndex + 1), 300);
        }
        setProgressValue(prog);
      }, 40);
    } else {
      // Instant reveal for output/success/blank/ascii
      setVisibleLines(lineIndex + 1);
      setTimeout(() => processLine(lineIndex + 1), line.delay + 50);
    }
  }, [onComplete]);

  useEffect(() => {
    // Start the sequence
    const timer = setTimeout(() => processLine(0), 500);
    return () => clearTimeout(timer);
  }, [processLine]);

  // Auto-scroll terminal
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines, typedText, progressValue]);

  const renderLine = (line: TerminalLine, index: number) => {
    if (index >= visibleLines) return null;

    if (line.type === 'blank') {
      return <div key={index} className="h-4" />;
    }

    if (line.type === 'ascii') {
      return (
        <motion.pre
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[#00ff41] text-[0.45rem] sm:text-[0.55rem] md:text-xs leading-tight font-mono select-none whitespace-pre"
          style={{ textShadow: '0 0 10px rgba(0, 255, 65, 0.5)' }}
        >
          {ASCII_LOGO}
        </motion.pre>
      );
    }

    if (line.type === 'progress') {
      if (!showProgress) return null;
      const filled = Math.floor(progressValue / 4);
      const bar = '█'.repeat(filled) + '░'.repeat(25 - filled);
      return (
        <div key={index} className="font-mono text-sm text-gray-400">
          <span className="text-[#00ff41]">[</span>
          <span className="text-[#00ff41]">{bar}</span>
          <span className="text-[#00ff41]">]</span>
          <span className="text-gray-500 ml-2">{Math.floor(progressValue)}%</span>
        </div>
      );
    }

    if (line.type === 'command' && currentTypingLine === index) {
      return (
        <div key={index} className="font-mono text-sm">
          <span className="text-gray-500">{typedText}</span>
          <span className="cursor-blink text-[#00ff41] text-lg leading-none">▌</span>
        </div>
      );
    }

    if (line.type === 'command') {
      return (
        <div key={index} className="font-mono text-sm text-gray-500">
          {line.text}
        </div>
      );
    }

    if (line.type === 'success') {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-mono text-sm text-[#00ff41]"
          style={{ textShadow: '0 0 8px rgba(0, 255, 65, 0.4)' }}
        >
          {line.text}
        </motion.div>
      );
    }

    // output
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm text-gray-500"
      >
        {line.text}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
      >
        {/* Subtle scanlines */}
        <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />
        
        {/* Terminal window */}
        <div className="w-full max-w-3xl mx-4">
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333] border-b-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-xs text-gray-500 font-mono ml-2">
              Windows PowerShell
            </span>
          </div>

          {/* Terminal body */}
          <div 
            ref={containerRef}
            className="bg-[#0c0c0c] border border-[#333] p-6 min-h-[400px] max-h-[70vh] overflow-y-auto space-y-1"
          >
            {/* Initial prompt */}
            <div className="font-mono text-sm text-gray-600 mb-2">
              Windows PowerShell
            </div>
            <div className="font-mono text-sm text-gray-600 mb-4">
              Copyright (C) Microsoft Corporation. All rights reserved.
            </div>

            {TERMINAL_SEQUENCE.map((line, index) => renderLine(line, index))}

            {/* Blinking cursor at the end when idle */}
            {visibleLines === 0 && (
              <div className="font-mono text-sm">
                <span className="text-gray-500">PS C:\Users\jesaias{'>'} </span>
                <span className="cursor-blink text-[#00ff41] text-lg leading-none">▌</span>
              </div>
            )}
          </div>
        </div>

        {/* Corner decoration */}
        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-gray-700">
          portfolio.exe v2.0.0
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
