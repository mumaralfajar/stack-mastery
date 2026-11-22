// Opt-in Web Audio synthesizer for the Flower Meadow Break Room:
// Lydian celesta sparkles, 8-bar ambient folk progression (pad + harp + flute),
// and a gentle Lydian end-of-break chime. Starts silent (musicOn = false, soundOn = false).
type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

interface ChordBar {
  pad: readonly number[];
  arp: readonly number[];
  melody: readonly number[];
}

interface MusicBus {
  master: GainNode;
  filter: BiquadFilterNode;
}

const LYDIAN_CHIMES: readonly number[] = [
  293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0, 987.77, 1174.66,
];

const CHORD_PROG: readonly ChordBar[] = [
  {
    pad: [196.0, 293.66, 369.99],
    arp: [196.0, 293.66, 369.99, 493.88, 587.33, 493.88, 369.99, 293.66],
    melody: [587.33, 0, 659.25, 0, 739.99, 0, 587.33, 0],
  },
  {
    pad: [220.0, 293.66, 329.63],
    arp: [220.0, 329.63, 440.0, 554.37, 659.25, 554.37, 440.0, 329.63],
    melody: [659.25, 0, 0, 587.33, 554.37, 0, 440.0, 0],
  },
  {
    pad: [246.94, 293.66, 369.99],
    arp: [246.94, 369.99, 440.0, 587.33, 739.99, 587.33, 440.0, 369.99],
    melody: [493.88, 0, 587.33, 0, 739.99, 0, 880.0, 0],
  },
  {
    pad: [185.0, 277.18, 329.63],
    arp: [185.0, 277.18, 369.99, 440.0, 554.37, 440.0, 369.99, 277.18],
    melody: [739.99, 0, 0, 659.25, 554.37, 0, 440.0, 0],
  },
  {
    pad: [196.0, 246.94, 329.63],
    arp: [196.0, 293.66, 369.99, 440.0, 587.33, 493.88, 440.0, 293.66],
    melody: [493.88, 0, 587.33, 659.25, 739.99, 0, 987.77, 0],
  },
  {
    pad: [185.0, 293.66, 329.63],
    arp: [185.0, 293.66, 369.99, 440.0, 659.25, 587.33, 440.0, 369.99],
    melody: [880.0, 0, 739.99, 0, 659.25, 0, 587.33, 0],
  },
  {
    pad: [164.81, 246.94, 293.66],
    arp: [164.81, 246.94, 329.63, 392.0, 493.88, 587.33, 493.88, 392.0],
    melody: [493.88, 0, 587.33, 0, 659.25, 0, 587.33, 0],
  },
  {
    pad: [220.0, 277.18, 369.99],
    arp: [220.0, 329.63, 440.0, 554.37, 587.33, 440.0, 369.99, 329.63],
    melody: [554.37, 0, 587.33, 0, 659.25, 0, 587.33, 0],
  },
];

export interface BreakAudioController {
  isMusicOn(): boolean;
  isSoundOn(): boolean;
  setMusic(on: boolean): void;
  setSound(on: boolean): void;
  unlockOnGesture(): void;
  playCelesta(idx: number, gainVal?: number, duration?: number): void;
  playChord(baseIdx?: number): void;
  playEndOfBreakChime(): void;
  destroy(): void;
}

export function createBreakAudio(): BreakAudioController {
  let musicOn = false;
  let soundOn = false;
  let destroyed = false;
  let audioCtx: AudioContext | null = null;
  let voiceCount = 0;
  let musicTimer: ReturnType<typeof setInterval> | null = null;
  let musicStep = 0;
  let musicBus: MusicBus | null = null;
  const pendingTimeouts = new Set<ReturnType<typeof setTimeout>>();

  const schedule = (fn: () => void, ms: number): void => {
    const id = setTimeout(() => {
      pendingTimeouts.delete(id);
      if (!destroyed) fn();
    }, ms);
    pendingTimeouts.add(id);
  };

  const ensureAudio = (resume = false): AudioContext | null => {
    if (destroyed) return null;
    if (!audioCtx && typeof window !== 'undefined') {
      const AC = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (resume && audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  };

  const ensureMusicBus = (ctx: AudioContext): MusicBus => {
    if (musicBus) return musicBus;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1750, ctx.currentTime);
    const delay = ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.34, ctx.currentTime);
    const feedback = ctx.createGain();
    feedback.gain.setValueAtTime(0.26, ctx.currentTime);
    const wet = ctx.createGain();
    wet.gain.setValueAtTime(0.32, ctx.currentTime);

    filter.connect(master);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);
    musicBus = { master, filter };
    return musicBus;
  };

  const playPadChord = (freqs: readonly number[]): void => {
    const ctx = ensureAudio();
    if (!ctx || !musicOn) return;
    const bus = ensureMusicBus(ctx);
    const now = ctx.currentTime;
    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      sub.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      sub.frequency.setValueAtTime(freq * 1.002, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.036, now + 1.1);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);
      const subG = ctx.createGain();
      subG.gain.setValueAtTime(0.25, now);
      osc.connect(g);
      sub.connect(subG);
      subG.connect(g);
      g.connect(bus.filter);
      osc.start(now);
      sub.start(now);
      osc.stop(now + 3.5);
      sub.stop(now + 3.5);
    }
  };

  const playHarpPluck = (freq: number): void => {
    const ctx = ensureAudio();
    if (!ctx || !musicOn) return;
    const bus = ensureMusicBus(ctx);
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const g = ctx.createGain();
    const og = ctx.createGain();
    osc.type = 'triangle';
    overtone.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    overtone.frequency.setValueAtTime(freq * 2, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.048, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
    og.gain.setValueAtTime(0.22, now);
    osc.connect(g);
    overtone.connect(og);
    og.connect(g);
    g.connect(bus.filter);
    osc.start(now);
    overtone.start(now);
    osc.stop(now + 1.2);
    overtone.stop(now + 1.2);
  };

  const playFluteNote = (freq: number): void => {
    const ctx = ensureAudio();
    if (!ctx || !musicOn) return;
    const bus = ensureMusicBus(ctx);
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    vib.type = 'sine';
    vib.frequency.setValueAtTime(5.2, now);
    vibGain.gain.setValueAtTime(3.4, now);
    vib.connect(vibGain);
    vibGain.connect(osc.frequency);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.044, now + 0.14);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.96);
    osc.connect(g);
    g.connect(bus.filter);
    osc.start(now);
    vib.start(now);
    osc.stop(now + 1.0);
    vib.stop(now + 1.0);
  };

  const stepMusic = (): void => {
    if (destroyed || !musicOn || document.hidden) return;
    const ctx = ensureAudio(false);
    if (!ctx || ctx.state !== 'running') return;
    const barIdx = Math.floor(musicStep / 8) % CHORD_PROG.length;
    const beat = musicStep % 8;
    const bar = CHORD_PROG[barIdx];
    try {
      if (beat === 0) playPadChord(bar.pad);
      playHarpPluck(bar.arp[beat]);
      const mel = bar.melody[beat];
      if (mel > 0) playFluteNote(mel);
    } catch {
      /* ignore audio errors */
    }
    musicStep = (musicStep + 1) % (CHORD_PROG.length * 8);
  };

  const startMusic = (fromGesture = false): void => {
    const ctx = ensureAudio(fromGesture);
    if (!ctx) return;
    const bus = ensureMusicBus(ctx);
    bus.master.gain.cancelScheduledValues(ctx.currentTime);
    bus.master.gain.setValueAtTime(Math.max(0.0001, bus.master.gain.value), ctx.currentTime);
    bus.master.gain.linearRampToValueAtTime(0.95, ctx.currentTime + 0.6);
    if (musicTimer) clearInterval(musicTimer);
    stepMusic();
    musicTimer = setInterval(stepMusic, 380);
  };

  const stopMusic = (): void => {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
    if (audioCtx && musicBus) {
      try {
        const now = audioCtx.currentTime;
        musicBus.master.gain.cancelScheduledValues(now);
        musicBus.master.gain.setValueAtTime(Math.max(0.0001, musicBus.master.gain.value), now);
        musicBus.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      } catch {
        /* ignore */
      }
    }
  };

  const playNote = (idx: number, gainVal: number, duration: number, ignoreSoundFlag = false): void => {
    if (destroyed || (!soundOn && !ignoreSoundFlag) || voiceCount >= 8) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const freq = LYDIAN_CHIMES[Math.abs(idx) % LYDIAN_CHIMES.length];
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      voiceCount++;
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gainVal, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.22, now);
      osc1.connect(gain);
      osc2.connect(subGain);
      subGain.connect(gain);
      gain.connect(ctx.destination);
      osc1.onended = () => {
        voiceCount = Math.max(0, voiceCount - 1);
      };
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.02);
      osc2.stop(now + duration + 0.02);
    } catch {
      voiceCount = Math.max(0, voiceCount - 1);
    }
  };

  const playCelesta = (idx: number, gainVal = 0.04, duration = 0.85): void => {
    playNote(idx, gainVal, duration, false);
  };

  const playChord = (baseIdx = 0): void => {
    [0, 2, 4, 6].forEach((offset, k) => {
      schedule(() => playCelesta(baseIdx + offset, 0.032, 1.15), k * 75);
    });
  };

  // Gentle Lydian ascending chime when a Break timer reaches 00:00 (strictly opt-in).
  const playEndOfBreakChime = (): void => {
    if (destroyed || (!musicOn && !soundOn)) return;
    ensureAudio(false);
    [0, 2, 4, 5, 7, 10].forEach((noteIdx, k) => {
      schedule(() => playNote(noteIdx, 0.048, 1.45, true), k * 140);
    });
  };

  return {
    isMusicOn: () => musicOn,
    isSoundOn: () => soundOn,
    setMusic(on: boolean): void {
      musicOn = on;
      if (musicOn) startMusic(true);
      else stopMusic();
    },
    setSound(on: boolean): void {
      soundOn = on;
      if (soundOn) {
        ensureAudio(true);
        playChord(2);
      }
    },
    unlockOnGesture(): void {
      if (destroyed || !musicOn) return;
      const ctx = ensureAudio(true);
      if (ctx && ctx.state === 'suspended') {
        ctx
          .resume()
          .then(() => {
            if (!destroyed && musicOn) stepMusic();
          })
          .catch(() => {});
      }
    },
    playCelesta,
    playChord,
    playEndOfBreakChime,
    destroy(): void {
      destroyed = true;
      musicOn = false;
      soundOn = false;
      stopMusic();
      for (const id of pendingTimeouts) clearTimeout(id);
      pendingTimeouts.clear();
      if (audioCtx) {
        audioCtx.close().catch(() => {});
        audioCtx = null;
        musicBus = null;
      }
    },
  };
}
