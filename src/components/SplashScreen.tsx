'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';

export const ASCII_LOGO = `
                                                           +
                                 +++++++++++             +++++
                           ++++++++++++++++++++        +++++++++
                    +++++++++++++++++++++++++++++        +++++
              ++++++++++++++++++++++          +++++        +
         +++++++++++++++++++++                   +++
    ++++++++++++++++++++                           ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                                                                    ++
              +++++++++++
           +++++++++++++++++
         ++++++++++++  +++++++
      +++++++++++           +++++++++++++++++++++++++++++++++++
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    ++++++++++++++++++++++++++++++++++++++                  ++++++++++
                                    +++++                     +++++++++++++++
                                      ++++++          ++++++++++++++++++++++++++
                                        +++++++++++++++++++++++++++++++++++++++++
                                          +++++++++++++++++++++++             ++++
                                             +++++++++++++                       ++
`;

interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'progress' | 'success' | 'ascii' | 'blank';
  delay: number;
}

const FULL_TERMINAL_SEQUENCE: TerminalLine[] = [
  { text: '', type: 'blank', delay: 300 },
  { text: 'jesaias@dk:~$ node portfolio.js', type: 'command', delay: 0 },
  { text: '', type: 'blank', delay: 400 },
  { text: '[init] Loading modules...', type: 'output', delay: 200 },
  { text: '[init] Compiling components...', type: 'output', delay: 300 },
  { text: '[init] Connecting to database...', type: 'output', delay: 250 },
  { text: '[ok] All systems operational', type: 'success', delay: 400 },
  { text: '', type: 'blank', delay: 200 },
  { text: 'LOGO', type: 'ascii', delay: 100 },
  { text: '', type: 'blank', delay: 300 },
  { text: '[render] Building interface...', type: 'output', delay: 200 },
  { text: '[render] Injecting styles...', type: 'output', delay: 150 },
  { text: '[render] Mounting DOM...', type: 'output', delay: 200 },
  { text: '', type: 'blank', delay: 100 },
  { text: 'PROGRESS', type: 'progress', delay: 0 },
  { text: '', type: 'blank', delay: 200 },
  { text: '[ok] Portfolio ready. Launching...', type: 'success', delay: 500 },
];

const SHORT_TERMINAL_SEQUENCE: TerminalLine[] = [
  { text: 'jesaias@dk:~$ node portfolio.js', type: 'command', delay: 80 },
  { text: '[init] Loading portfolio...', type: 'output', delay: 180 },
  { text: 'LOGO', type: 'ascii', delay: 620 },
  { text: '[ok] Portfolio ready.', type: 'success', delay: 160 },
];

export default function SplashScreen({
  onComplete,
  mode = 'short',
}: {
  onComplete: () => void;
  mode?: 'short' | 'full';
}) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedText, setTypedText] = useState('');
  const [currentTypingLine, setCurrentTypingLine] = useState(-1);
  const [progressValue, setProgressValue] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const timersRef = useRef<number[]>([]);
  const intervalsRef = useRef<number[]>([]);
  const sequence = mode === 'full' ? FULL_TERMINAL_SEQUENCE : SHORT_TERMINAL_SEQUENCE;
  const isShortMode = mode === 'short';

  const clearPendingWork = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    intervalsRef.current.forEach((interval) => window.clearInterval(interval));
    timersRef.current = [];
    intervalsRef.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  const finishSplash = useCallback((exitDelay = isShortMode ? 500 : 600) => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearPendingWork();
    setIsExiting(true);
    schedule(() => onCompleteRef.current(), exitDelay);
  }, [clearPendingWork, isShortMode, schedule]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const processLine = useCallback((lineIndex: number) => {
    if (completedRef.current) return;

    if (lineIndex >= sequence.length) {
      schedule(() => finishSplash(), isShortMode ? 180 : 400);
      return;
    }

    const line = sequence[lineIndex];
    
    if (line.type === 'command') {
      // Type out command character by character
      setCurrentTypingLine(lineIndex);
      setVisibleLines(lineIndex + 1);
      const fullText = line.text;
      let charIndex = 0;
      
      const typeInterval = window.setInterval(() => {
        if (completedRef.current) {
          window.clearInterval(typeInterval);
          return;
        }
        charIndex++;
        setTypedText(fullText.slice(0, charIndex));
        
        if (charIndex >= fullText.length) {
          window.clearInterval(typeInterval);
          setCurrentTypingLine(-1);
          schedule(() => processLine(lineIndex + 1), line.delay + (isShortMode ? 45 : 200));
        }
      }, isShortMode ? 7 : 25 + Math.random() * 30);
      intervalsRef.current.push(typeInterval);
    } else if (line.type === 'progress') {
      setVisibleLines(lineIndex + 1);
      setShowProgress(true);
      // Animate progress bar
      let prog = 0;
      const progressInterval = window.setInterval(() => {
        if (completedRef.current) {
          window.clearInterval(progressInterval);
          return;
        }
        prog += 3 + Math.random() * 5;
        if (prog >= 100) {
          prog = 100;
          window.clearInterval(progressInterval);
          schedule(() => processLine(lineIndex + 1), 300);
        }
        setProgressValue(prog);
      }, 40);
      intervalsRef.current.push(progressInterval);
    } else {
      // Instant reveal for output/success/blank/ascii
      setVisibleLines(lineIndex + 1);
      schedule(() => processLine(lineIndex + 1), line.delay + (isShortMode ? 25 : 50));
    }
  }, [finishSplash, isShortMode, schedule, sequence]);

  useEffect(() => {
    // Start the sequence
    const timer = schedule(() => processLine(0), isShortMode ? 180 : 500);
    return () => {
      window.clearTimeout(timer);
      clearPendingWork();
    };
    // Run the splash sequence once per mode. State updates during typing should
    // not restart or clear the active timers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

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
          className="text-[#4ddbff] text-[0.5rem] leading-tight font-mono select-none whitespace-pre overflow-visible origin-left scale-[0.44] sm:scale-[0.62] md:scale-100 transition-transform"
          style={{ textShadow: '0 0 10px rgba(77, 219, 255, 0.5)' }}
        >
          {ASCII_LOGO}
        </motion.pre>
      );
    }

    if (line.type === 'progress') {
      if (!showProgress) return null;
      const filled = Math.floor(progressValue / 4);
      const bar = '#'.repeat(filled) + '.'.repeat(25 - filled);
      return (
        <div key={index} className="font-mono text-sm text-gray-400">
          <span className="text-[#4ddbff]">[</span>
          <span className="text-[#4ddbff]">{bar}</span>
          <span className="text-[#4ddbff]">]</span>
          <span className="text-gray-500 ml-2">{Math.floor(progressValue)}%</span>
        </div>
      );
    }

    if (line.type === 'command' && currentTypingLine === index) {
      return (
        <div key={index} className="font-mono text-sm">
          <span className="text-gray-500">{typedText}</span>
          <span className="cursor-blink text-[#4ddbff] text-lg leading-none">|</span>
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
          className="font-mono text-sm text-[#4ddbff]"
          style={{ textShadow: '0 0 8px rgba(77, 219, 255, 0.4)' }}
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
              jesaias.dk - terminal
            </span>
            <span className="ml-auto text-[10px] text-gray-700 font-mono">
              bash
            </span>
          </div>

          {/* Terminal body */}
          <div 
            ref={containerRef}
            className="bg-[#0c0c0c] border border-[#333] p-5 min-h-[300px] max-h-[70vh] overflow-y-auto space-y-1 sm:p-6 sm:min-h-[400px]"
          >
            {/* Initial prompt */}
            <div className="font-mono text-sm text-gray-600 mb-2">
              jesaias.dk - terminal v2.0
            </div>
            <div className="font-mono text-sm text-gray-600 mb-4">
              Type &apos;help&apos; for available commands.
            </div>

            {sequence.map((line, index) => renderLine(line, index))}

            {/* Blinking cursor at the end when idle */}
            {visibleLines === 0 && (
              <div className="font-mono text-sm">
                <span className="text-gray-500">jesaias@dk:~$ </span>
                <span className="cursor-blink text-[#4ddbff] text-lg leading-none">|</span>
              </div>
            )}
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={() => {
            finishSplash(isShortMode ? 160 : 500);
          }}
          className="absolute bottom-6 right-6 font-mono text-xs text-gray-600 hover:text-[#4ddbff] transition-colors z-10 cursor-pointer"
        >
          {'skip ->'}
        </button>

        {/* Corner decoration */}
        <div className="absolute bottom-4 left-4 font-mono text-[10px] text-gray-700">
          portfolio v2.0.0
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
