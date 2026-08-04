'use client';

type SoundType = 'hover' | 'click' | 'success' | 'on' | 'error' | 'typing';

// Keep the existing component API while interaction sounds are intentionally disabled.
// This avoids creating an AudioContext and makes it easy to reintroduce opt-in audio later.
const playSilently = (type: SoundType) => {
  void type;
};

const noOp = () => {};

export function useSound() {
  return {
    play: playSilently,
    isMuted: true,
    toggleMute: noOp,
    initAudio: noOp,
  };
}
