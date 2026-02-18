'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type SoundType = 'hover' | 'click' | 'success' | 'on' | 'error';

export function useSound() {
  const [isMuted, setIsMuted] = useState(false); // Default to UNMUTED
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
    } else if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }, [audioContext]);

  // Global event listener to unlock audio on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [initAudio]);

  // Removed localStorage logic as sound is now always on (miniscule fx)
  
  const toggleMute = useCallback(() => {
     // No-op or just log, since UI is removed
     console.log('Sound toggle removed');
  }, []);

  const play = useCallback((type: SoundType) => {
    // Attempt resume if context exists but suspended
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    if (isMuted || !audioContext || !gainNodeRef.current) return;

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
