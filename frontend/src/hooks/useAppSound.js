import { useCallback } from 'react';

// Simple Web Audio API synthesizer for sound effects
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

const playTone = (freq, type, duration, vol = 0.1) => {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
};

export default function useAppSound() {
    const playClick = useCallback(() => playTone(800, 'sine', 0.1, 0.05), []);
    const playHover = useCallback(() => playTone(400, 'sine', 0.05, 0.02), []);
    
    const playAnvil = useCallback(() => {
        // Heavy metallic clang
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        
        // Low impact thud
        playTone(100, 'sawtooth', 0.8, 0.3);
        playTone(150, 'square', 0.6, 0.2);
        
        // Metallic resonance
        const metalOsc = audioCtx.createOscillator();
        const metalGain = audioCtx.createGain();
        metalOsc.type = 'triangle';
        metalOsc.frequency.setValueAtTime(800, now);
        metalGain.gain.setValueAtTime(0.1, now);
        metalGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        
        metalOsc.connect(metalGain);
        metalGain.connect(audioCtx.destination);
        metalOsc.start();
        metalOsc.stop(now + 1.5);
    }, []);

    const playChime = useCallback(() => {
        // High pure bell
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        
        // Fundamental
        playTone(1000, 'sine', 2.0, 0.1);
        // Harmonic
        playTone(2000, 'sine', 2.5, 0.05);
        // Sparkle
        setTimeout(() => playTone(4000, 'sine', 0.5, 0.02), 100);
    }, []);

    return {
        playClick,
        playHover,
        playAnvil,
        playChime,
        playSuccess: playChime,
        playFailure: playAnvil,
        playError: playAnvil, // Add alias for playError to fix UI crash
        // Stub unused ones
        playGodMode: () => {},
        playAsuraMode: () => {},
        playThunder: () => {},
        playLightningStrike: () => {}
    };
}
