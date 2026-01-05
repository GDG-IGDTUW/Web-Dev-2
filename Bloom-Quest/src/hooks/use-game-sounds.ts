import { useCallback } from 'react';

// Simple sound synthesizer using Web Audio API
// No assets required! 🎵
export function useGameSounds() {

    const playTone = useCallback((freq: number, type: OscillatorType, duration: number, delay = 0) => {
        if (typeof window === 'undefined') return;

        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

            gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + delay + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + duration);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const playPop = useCallback(() => {
        // High pitched short sine
        playTone(800, 'sine', 0.1);
    }, [playTone]);

    const playClick = useCallback(() => {
        // Wooden click
        playTone(400, 'triangle', 0.05);
    }, [playTone]);

    const playSuccess = useCallback(() => {
        // Major chord arpeggio
        playTone(523.25, 'sine', 0.3, 0);    // C5
        playTone(659.25, 'sine', 0.3, 0.1);  // E5
        playTone(783.99, 'sine', 0.4, 0.2);  // G5
        playTone(1046.50, 'sine', 0.6, 0.3); // C6
    }, [playTone]);

    const playCoin = useCallback(() => {
        // Mario-style coin
        playTone(987.77, 'square', 0.1, 0); // B5
        playTone(1318.51, 'square', 0.3, 0.1); // E6
    }, [playTone]);

    return { playPop, playClick, playSuccess, playCoin };
}
