import React, { useState, useRef, useContext } from 'react';

interface SoundContextType {
  isSoundEnabled: boolean;
  playSound: (type: 'hover' | 'click' | 'transition' | 'pop' | 'shutter' | 'scroll') => void;
}

const SoundContext = React.createContext<SoundContextType>({
  isSoundEnabled: true,
  playSound: () => {},
});

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  // Initialize audio on first interaction
  React.useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  const playSound = (type: 'hover' | 'click' | 'transition' | 'pop' | 'shutter' | 'scroll') => {
    if (!isSoundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const createOscillator = (freq: number, type: OscillatorType, startTime: number, duration: number, volume: number, endFreq?: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
      }
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const createNoise = (startTime: number, duration: number, volume: number, filterFreq: number, filterEndFreq?: number) => {
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, startTime);
      if (filterEndFreq) {
        filter.frequency.exponentialRampToValueAtTime(filterEndFreq, startTime + duration);
      }
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(startTime);
      noise.stop(startTime + duration);
    };

    switch (type) {
      case 'hover':
        // Ultra-short tactile "tick"
        createOscillator(1600, 'sine', now, 0.02, 0.015);
        break;
      case 'click':
        // Tactile "mechanical" click
        createOscillator(1000, 'sine', now, 0.04, 0.04);
        createOscillator(200, 'square', now, 0.03, 0.02);
        createNoise(now, 0.02, 0.01, 8000);
        break;
      case 'transition':
        // Deep cinematic whoosh
        createNoise(now, 1.2, 0.03, 4000, 50);
        createOscillator(80, 'sine', now, 1.2, 0.02, 40);
        break;
      case 'shutter':
        // Mechanical camera shutter
        createOscillator(200, 'square', now, 0.05, 0.1);
        createOscillator(1500, 'sine', now + 0.05, 0.04, 0.05);
        createNoise(now, 0.12, 0.03, 6000);
        createNoise(now + 0.06, 0.08, 0.02, 4000);
        break;
      case 'pop':
        // Cinematic impact "thud"
        createOscillator(50, 'sine', now, 0.5, 0.12, 30);
        createOscillator(1000, 'sine', now, 0.08, 0.03);
        createNoise(now, 0.25, 0.02, 10000);
        break;
      case 'scroll':
        // Subtle tactile scroll "tick"
        createOscillator(2000, 'sine', now, 0.01, 0.005);
        break;
    }
  };

  return (
    <SoundContext.Provider value={{ isSoundEnabled, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
