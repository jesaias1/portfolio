'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type SoundType = 'hover' | 'click' | 'success' | 'on' | 'error' | 'typing';

// Module-scoped singleton for ambient audio to prevent multiple loops
let globalAmbientAudio: HTMLAudioElement | null = null;
let globalGainNode: GainNode | null = null;
let globalAudioContext: AudioContext | null = null;

export function useSound() {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jesaias-muted');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  const [audioContext, setAudioContext] = useState<AudioContext | null>(globalAudioContext);

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;

    // 1. Web Audio Context (SFX)
    if (!globalAudioContext) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const gainNode = ctx.createGain();
        gainNode.connect(ctx.destination);
        gainNode.gain.value = 0.25; // Increased from 0.15
        
        globalGainNode = gainNode;
        globalAudioContext = ctx;
        setAudioContext(ctx);
      }
    }

    // 2. Ambient Music (Singleton)
    if (!globalAmbientAudio) {
      const audio = new Audio('/audio/background.mp3');
      audio.loop = true;
      audio.volume = 0.5; // Increased from 0.3 for better audibility
      globalAmbientAudio = audio;

      // Media Session API for mobile/OS control
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'Portfolio Ambient',
          artist: 'Jesaias',
          album: 'Next-Level Experience',
          artwork: [{ src: '/og-image.png', sizes: '512x512', type: 'image/png' }]
        });

        navigator.mediaSession.setActionHandler('play', () => {
          globalAmbientAudio?.play();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          globalAmbientAudio?.pause();
        });
        navigator.mediaSession.setActionHandler('stop', () => {
          globalAmbientAudio?.pause();
          if (globalAmbientAudio) globalAmbientAudio.currentTime = 0;
        });
      }
    }
    
    // CRITICAL: Force resume/play during user interaction for Safari/iOS
    if (globalAudioContext?.state === 'suspended' && !isMuted) {
      globalAudioContext.resume().catch(() => {});
    }

    if (globalAmbientAudio && !isMuted && globalAmbientAudio.paused) {
      globalAmbientAudio.play().catch(() => {});
    }
  }, [isMuted]);

  // Handle Mute & Visibility Sync
  useEffect(() => {
    localStorage.setItem('jesaias-muted', JSON.stringify(isMuted));

    const syncAudio = () => {
      const isHidden = document.hidden;
      
      // Ambient Sync
      if (globalAmbientAudio) {
        globalAmbientAudio.muted = isMuted;
        if (isMuted || isHidden) {
          globalAmbientAudio.pause();
          if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
        } else if (globalAmbientAudio.paused) {
           globalAmbientAudio.play().catch(() => {});
           if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
        }
      }

      // SFX Sync
      if (globalAudioContext) {
        if (isMuted || isHidden) {
          globalAudioContext.suspend().catch(() => {});
        } else {
          globalAudioContext.resume().catch(() => {});
        }
      }
    };

    syncAudio();

    document.addEventListener('visibilitychange', syncAudio);
    return () => document.removeEventListener('visibilitychange', syncAudio);
  }, [isMuted]);

  // Global interaction unlock (Safari/iOS compatibility)
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      // Only remove if initialized
      if (globalAudioContext || globalAmbientAudio) {
        ['click', 'touchstart', 'keydown'].forEach(evt => 
          window.removeEventListener(evt, handleInteraction)
        );
      }
    };

    ['click', 'touchstart', 'keydown'].forEach(evt => 
      window.addEventListener(evt, handleInteraction, { once: true, capture: true })
    );

    return () => {
      ['click', 'touchstart', 'keydown'].forEach(evt => 
        window.removeEventListener(evt, handleInteraction)
      );
    };
  }, [initAudio]);

  const toggleMute = useCallback(() => {
     setIsMuted((prev: boolean) => !prev);
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
