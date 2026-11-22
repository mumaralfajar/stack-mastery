// Opt-in pentatonic & alert Web Audio synthesizer for the Landing Page Packet Reactor.
const PENTATONIC: readonly number[] = [
  293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46, 783.99, 880.0, 1046.5,
];

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

export interface LandingAudioController {
  isSoundOn(): boolean;
  setSound(on: boolean): void;
  playChime(idx: number, gainVal?: number, isAlert?: boolean): void;
  destroy(): void;
}

export function createLandingAudio(): LandingAudioController {
  let soundOn = false;
  let audioCtx: AudioContext | null = null;
  let voiceCount = 0;

  const ensureAudio = (): AudioContext | null => {
    if (!audioCtx && typeof window !== 'undefined') {
      const AC = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  };

  const playChime = (idx: number, gainVal = 0.045, isAlert = false): void => {
    if (!soundOn || voiceCount >= 6) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      voiceCount++;
      osc.type = isAlert ? 'triangle' : 'sine';
      const freq = isAlert ? 165 : PENTATONIC[Math.abs(idx) % PENTATONIC.length];
      osc.frequency.setValueAtTime(freq, now);
      if (isAlert) osc.frequency.exponentialRampToValueAtTime(78, now + 0.24);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gainVal, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.onended = () => {
        voiceCount = Math.max(0, voiceCount - 1);
      };
      osc.start(now);
      osc.stop(now + 0.29);
    } catch {
      voiceCount = Math.max(0, voiceCount - 1);
    }
  };

  return {
    isSoundOn: () => soundOn,
    setSound(on: boolean): void {
      soundOn = on;
      if (soundOn) {
        ensureAudio();
        playChime(4, 0.05);
      }
    },
    playChime,
    destroy(): void {
      soundOn = false;
      if (audioCtx) {
        audioCtx.close().catch(() => {});
        audioCtx = null;
      }
    },
  };
}
