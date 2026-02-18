'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type SoundType = 'hover' | 'click' | 'success' | 'on' | 'error' | 'typing';

// Module-scoped singleton for ambient audio to prevent multiple loops
let globalAmbientAudio: HTMLAudioElement | null = null;
let globalGainNode: GainNode | null = null;
let globalAudioContext: AudioContext | null = null;

export function useSound() {
  const [isMuted, setIsMuted] = useState(false); 
  const [audioContext, setAudioContext] = useState<AudioContext | null>(globalAudioContext);

  const initAudio = useCallback(() => {
    // 1. Web Audio Context (SFX)
    if (!globalAudioContext) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const gainNode = ctx.createGain();
        gainNode.connect(ctx.destination);
        gainNode.gain.value = 0.15;
        
        globalGainNode = gainNode;
        globalAudioContext = ctx;
        setAudioContext(ctx);
        
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      }
    } else if (globalAudioContext.state === 'suspended' && !isMuted) {
      globalAudioContext.resume();
    }

    // 2. Ambient Music (Singleton)
    if (!globalAmbientAudio) {
      // Optimized path: /audio/background.mp3
      const audio = new Audio('/audio/background.mp3');
      audio.loop = true;
      audio.volume = 0.1; // Low volume as requested
      globalAmbientAudio = audio;
      
      // Auto-play if not muted
      // Wait for interaction (initAudio called on interaction)
      // audio.play().catch(e => console.log('Ambient play failed'));
    }
    
    // Play logic: handled by effect syncing with isMuted
  }, [isMuted]);

  // Sync Mute State
  useEffect(() => {
    // SFX
    if (globalAudioContext) {
      if (isMuted) {
        globalAudioContext.suspend().catch(() => {});
      } else {
        globalAudioContext.resume().catch(() => {});
      }
    }

    // Ambient
    if (globalAmbientAudio) {
      globalAmbientAudio.muted = isMuted;
      if (!isMuted && globalAmbientAudio.paused) {
          // Attempt to play if unmuted (and was created)
          globalAmbientAudio.play().catch(e => console.log('Ambient resume failed:', e));
      }
    }
  }, [isMuted]);

  // Global event listener to unlock audio
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

  const toggleMute = useCallback(() => {
     setIsMuted(prev => !prev);
  }, []);

  const play = useCallback((type: SoundType) => {
    const ctx = globalAudioContext;
    const gainNode = globalGainNode;

    // Attempt resume if context exists but suspended
    if (ctx && ctx.state === 'suspended' && !isMuted) {
      ctx.resume().catch(() => {});
    }

    if (isMuted || !ctx || !gainNode) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(gainNode);

    const now = ctx.currentTime;

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

      case 'typing':
        // Mechanical click for typing
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.02);
        break;
    }
  }, [isMuted, audioContext]);

  return { play, isMuted, toggleMute, initAudio };
}
