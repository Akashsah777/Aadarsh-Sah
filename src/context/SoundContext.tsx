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
        // Very soft, short sine "blip"
        createOscillator(800, 'sine', now, 0.01, 0.005);
        break;
      case 'click':
        // Soft, rounded click
        createOscillator(400, 'sine', now, 0.03, 0.02);
        break;
      case 'transition':
        // Gentle, slow whoosh
        createNoise(now, 1.0, 0.01, 1000, 20);
        createOscillator(60, 'sine', now, 1.0, 0.01, 20);
        break;
      case 'shutter':
        // Soft, mechanical click
        createOscillator(120, 'sine', now, 0.04, 0.03);
        break;
      case 'pop':
        // Soft, low-frequency thud
        createOscillator(40, 'sine', now, 0.3, 0.05, 20);
        break;
      case 'scroll':
        // Extremely subtle tick
        createOscillator(1000, 'sine', now, 0.005, 0.002);
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
