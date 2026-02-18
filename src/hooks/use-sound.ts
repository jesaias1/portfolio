'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type SoundType = 'hover' | 'click' | 'success' | 'on' | 'error';

export function useSound() {
  const [isMuted, setIsMuted] = useState(true); // Default to muted for policy compliance
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize audio context on first interaction
  const initAudio = useCallback(() => {
    if (!audioContext) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const gainNode = ctx.createGain();
        gainNode.connect(ctx.destination);
        gainNode.gain.value = 0.1; // Master volume
        gainNodeRef.current = gainNode;
        setAudioContext(ctx);
        
        // Resume if suspended (browser policy)
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      }
    }
  }, [audioContext]);

  // Load mute state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sound-muted');
    if (saved !== null) {
      setIsMuted(JSON.parse(saved));
    } else {
        // If never saved, keep default (true) or set to false?
        // User requested "remember all our previous changes".
        // Let's default to MUTED until user enables it, then remember.
        setIsMuted(true);
    }
  }, []);

  const toggleMute = useCallback(() => {
    initAudio(); // Ensure context exists
    setIsMuted(prev => {
      const next = !prev;
      localStorage.setItem('sound-muted', JSON.stringify(next));
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      return next;
    });
  }, [initAudio, audioContext]);

  const play = useCallback((type: SoundType) => {
    if (isMuted || !audioContext || !gainNodeRef.current) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(gainNodeRef.current);

    const now = audioContext.currentTime;

    switch (type) {
      case 'hover':
        // High-pitched blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'click':
        // Sharper tick
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'success':
        // Rising arpeggio
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554, now + 0.1); // C#
        osc.frequency.setValueAtTime(659, now + 0.2); // E
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.setValueAtTime(0.05, now + 0.2);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'on':
        // Power up
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
        
      case 'error':
        // Low buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
    }
  }, [isMuted, audioContext]);

  return { play, isMuted, toggleMute, initAudio };
}
