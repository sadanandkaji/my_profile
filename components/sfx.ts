// Tiny synthesized sound effects for the snake game — no audio files.
// Uses the Web Audio API; the context is created on the first user gesture.

const MUTE_KEY = "sk-snake-muted";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

try {
  if (typeof window !== "undefined") muted = localStorage.getItem(MUTE_KEY) === "1";
} catch {}

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Note = { f: number; t: number; d: number; type?: OscillatorType; v?: number; slide?: number };

function play(notes: Note[]) {
  if (muted) return;
  const ac = audio();
  if (!ac || !master) return;
  const now = ac.currentTime;
  for (const n of notes) {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = n.type ?? "square";
    o.frequency.setValueAtTime(n.f, now + n.t);
    if (n.slide) o.frequency.exponentialRampToValueAtTime(n.slide, now + n.t + n.d);
    const v = n.v ?? 0.5;
    g.gain.setValueAtTime(0.0001, now + n.t);
    g.gain.exponentialRampToValueAtTime(v, now + n.t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
    o.connect(g).connect(master);
    o.start(now + n.t);
    o.stop(now + n.t + n.d + 0.02);
  }
}

export const sfx = {
  /** call from a click/tap so browsers allow audio */
  unlock: () => audio(),
  start: () =>
    play([
      { f: 392, t: 0, d: 0.09 },
      { f: 523, t: 0.08, d: 0.09 },
      { f: 659, t: 0.16, d: 0.09 },
      { f: 784, t: 0.24, d: 0.16 },
    ]),
  turn: () => play([{ f: 1400, t: 0, d: 0.025, type: "triangle", v: 0.18 }]),
  eat: () =>
    play([
      { f: 660, t: 0, d: 0.06, v: 0.45 },
      { f: 990, t: 0.05, d: 0.09, v: 0.45 },
    ]),
  pause: () => play([{ f: 520, t: 0, d: 0.07, type: "triangle", v: 0.4 }]),
  resume: () => play([{ f: 780, t: 0, d: 0.07, type: "triangle", v: 0.4 }]),
  over: () =>
    play([
      { f: 440, t: 0, d: 0.16, type: "sawtooth", v: 0.35 },
      { f: 330, t: 0.15, d: 0.16, type: "sawtooth", v: 0.35 },
      { f: 220, t: 0.3, d: 0.42, type: "sawtooth", v: 0.35, slide: 90 },
    ]),
  best: () =>
    play([
      { f: 784, t: 0, d: 0.08 },
      { f: 988, t: 0.07, d: 0.08 },
      { f: 1319, t: 0.14, d: 0.2 },
    ]),
  isMuted: () => muted,
  setMuted: (m: boolean) => {
    muted = m;
    try {
      localStorage.setItem(MUTE_KEY, m ? "1" : "0");
    } catch {}
  },
};
