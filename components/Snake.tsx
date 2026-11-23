"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { sfx } from "@/components/sfx";
import { useWorkbench } from "@/components/Workbench";

// Grid matches the .canvas-dots background (22px tiles, dot at the centre).
const G = 22;
const OFF = 11;

type P = { x: number; y: number };
const eq = (a: P, b: P) => a.x === b.x && a.y === b.y;
const DIRS: Record<string, P> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};
const BEST_KEY = "sk-snake-best";
/** height reserved for the on-screen controller + status bar on touch devices */
const PAD_H = 250;

// A snake made of dots that lives on the background grid.
//  · idle: fixed length, roams and chases your cursor / finger — no food
//  · game ("s", status bar button, :snake): played inside a walled box,
//    with food, score, sounds, keyboard / swipe / on-screen d-pad
export default function Snake() {
  const { snake: playing, setSnake } = useWorkbench();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [muted, setMuted] = useState(false);

  const s = useRef({
    body: [] as P[],
    from: [] as P[],
    dir: { x: 1, y: 0 } as P,
    queue: [] as P[],
    food: { x: 10, y: 10 } as P,
    wander: { x: 10, y: 10 } as P,
    cols: 0,
    rows: 0,
    box: { x: 0, y: 0, w: 0, h: 0 }, // the game board, in grid cells
    best: 0,
    deadAt: 0,
    paused: false,
    coarse: false,
    lastTick: 0,
    step: 120,
    grow: 0,
    cursor: null as P | null,
    cursorAt: 0,
    playing: false,
    dead: false,
    score: 0,
  });

  const placeFood = useCallback(() => {
    const st = s.current;
    const b = st.box;
    for (let i = 0; i < 80; i++) {
      const f = {
        x: b.x + Math.floor(Math.random() * b.w),
        y: b.y + Math.floor(Math.random() * b.h),
      };
      if (!st.body.some((b) => eq(b, f))) {
        st.food = f;
        return;
      }
    }
  }, []);

  const reset = useCallback(
    (len: number) => {
      const st = s.current;
      const b = st.box;
      const cy = st.playing ? b.y + Math.floor(b.h / 2) : Math.floor(st.rows / 2);
      const cx = st.playing ? b.x + Math.floor(b.w / 3) : Math.floor(st.cols / 3);
      st.body = Array.from({ length: len }, (_, i) => ({ x: cx - i, y: cy }));
      st.from = st.body.map((p) => ({ ...p }));
      st.dir = { x: 1, y: 0 };
      st.queue = [];
      st.grow = 0;
      st.dead = false;
      st.score = 0;
      if (st.playing) placeFood();
    },
    [placeFood],
  );

  // ── main loop ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const st = s.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    try {
      st.best = Number(localStorage.getItem(BEST_KEY) || 0);
      setBest(st.best);
    } catch {}
    setMuted(sfx.isMuted());

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.cols = Math.ceil(w / G);
      st.rows = Math.ceil(h / G);
      st.coarse = window.matchMedia("(pointer: coarse)").matches;
      // the game box: centred, clear of the HUD, and above the d-pad on phones
      const topPx = st.coarse ? 142 : 150;
      const bottomPx = st.coarse ? h - PAD_H - 18 : h - 56;
      const side = st.coarse ? 12 : 64;
      const bw = Math.max(8, Math.min(Math.floor((w - side * 2) / G), st.coarse ? 99 : 36));
      const bh = Math.max(8, Math.min(Math.floor((bottomPx - topPx) / G), st.coarse ? 99 : 22));
      const bx = Math.round(w / G / 2 - bw / 2);
      const by = Math.max(Math.ceil(topPx / G), Math.round((topPx + bottomPx) / 2 / G - bh / 2));
      st.box = { x: bx, y: by, w: bw, h: bh };
      if (!st.body.length) reset(window.innerWidth < 640 ? 10 : 16);
      st.body = st.body.map((p) => ({ x: p.x % st.cols, y: p.y % st.rows }));
      st.from = st.body.map((p) => ({ ...p }));
      if (st.food.x >= st.cols || st.food.y >= st.rows) placeFood();
    };
    resize();
    window.addEventListener("resize", resize);

    const wrapDist = (a: number, b: number, n: number) => {
      const d = Math.abs(a - b);
      return Math.min(d, n - d);
    };

    const autoDir = (now: number): P => {
      const head = st.body[0];
      let target: P;
      if (st.cursor && now - st.cursorAt < 2600) target = st.cursor;
      else {
        // no food while idle — just roam between random points
        if (eq(head, st.wander) || Math.random() < 0.004) {
          st.wander = {
            x: Math.floor(Math.random() * st.cols),
            y: 4 + Math.floor(Math.random() * Math.max(1, st.rows - 7)),
          };
        }
        target = st.wander;
      }
      const options = [st.dir, { x: st.dir.y, y: -st.dir.x }, { x: -st.dir.y, y: st.dir.x }];
      let bestDir = st.dir;
      let bestScore = Infinity;
      for (const d of options) {
        const n = { x: (head.x + d.x + st.cols) % st.cols, y: (head.y + d.y + st.rows) % st.rows };
        let sc = wrapDist(n.x, target.x, st.cols) + wrapDist(n.y, target.y, st.rows);
        if (st.body.some((b) => eq(b, n))) sc += 1000;
        sc += Math.random() * 0.9; // a little wiggle so it looks alive
        if (sc < bestScore) {
          bestScore = sc;
          bestDir = d;
        }
      }
      return bestDir;
    };

    const tick = (now: number) => {
      if (st.dead || st.paused) return;
      if (st.playing) {
        while (st.queue.length) {
          const d = st.queue.shift()!;
          if (!(d.x === -st.dir.x && d.y === -st.dir.y) && !(d.x === st.dir.x && d.y === st.dir.y)) {
            st.dir = d;
            break;
          }
        }
      } else {
        st.dir = autoDir(now);
      }
      const head = st.body[0];
      const old = st.body;
      let nh: P;

      if (st.playing) {
        nh = { x: head.x + st.dir.x, y: head.y + st.dir.y };
        const b = st.box;
        const hitWall = nh.x < b.x || nh.x >= b.x + b.w || nh.y < b.y || nh.y >= b.y + b.h;
        const tail = st.grow > 0 ? old : old.slice(0, -1);
        if (hitWall || tail.some((p) => eq(p, nh))) {
          st.dead = true;
          st.deadAt = now;
          setOver(true);
          if (st.score > st.best) {
            st.best = st.score;
            setBest(st.best);
            try {
              localStorage.setItem(BEST_KEY, String(st.best));
            } catch {}
            sfx.best();
          } else sfx.over();
          navigator.vibrate?.([30, 40, 60]);
          return;
        }
      } else {
        nh = { x: (head.x + st.dir.x + st.cols) % st.cols, y: (head.y + st.dir.y + st.rows) % st.rows };
      }

      const body = [nh, ...old];
      if (st.playing && eq(nh, st.food)) {
        st.grow += 2;
        placeFood();
        sfx.eat();
        st.score += 1;
        setScore(st.score);
        st.step = Math.max(62, st.step - 3);
      }
      if (st.grow > 0) st.grow--;
      else body.pop();

      st.from = body.map((_, i) => old[i] ?? old[old.length - 1]);
      st.body = body;
      st.lastTick = now;
    };

    const draw = (now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const t = reduced ? 1 : Math.max(0, Math.min(1, (now - st.lastTick) / st.step));
      const ease = t * (2 - t);
      const alpha = st.playing ? 1 : 0.5;

      // the box — a design-tool frame with handles and a size label
      if (st.playing) {
        const b = st.box;
        const x0 = b.x * G;
        const y0 = b.y * G;
        const bw = b.w * G;
        const bh = b.h * G;
        const flash = st.dead ? Math.max(0, 1 - (now - st.deadAt) / 900) : 0;
        ctx.beginPath();
        ctx.roundRect(x0 - 2, y0 - 2, bw + 4, bh + 4, 10);
        ctx.fillStyle = "rgba(10,10,13,0.72)";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = st.dead ? `rgba(255,107,61,${0.5 + flash * 0.5})` : "rgba(47,140,255,0.75)";
        ctx.stroke();
        if (flash > 0) {
          ctx.lineWidth = 6 * flash;
          ctx.strokeStyle = `rgba(255,107,61,${0.25 * flash})`;
          ctx.stroke();
        }
        // grid dots inside the box
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        for (let gx = 0; gx < b.w; gx++)
          for (let gy = 0; gy < b.h; gy++) ctx.fillRect(x0 + gx * G + OFF - 0.75, y0 + gy * G + OFF - 0.75, 1.5, 1.5);
        // handles
        const hc = st.dead ? "#ff6b3d" : "#2f8cff";
        for (const [hx, hy] of [
          [x0 - 2, y0 - 2],
          [x0 + bw + 2, y0 - 2],
          [x0 - 2, y0 + bh + 2],
          [x0 + bw + 2, y0 + bh + 2],
        ]) {
          ctx.fillStyle = "#fff";
          ctx.fillRect(hx - 3.5, hy - 3.5, 7, 7);
          ctx.strokeStyle = hc;
          ctx.lineWidth = 1;
          ctx.strokeRect(hx - 3.5, hy - 3.5, 7, 7);
        }
        // label chip
        const label = `snake.board  ${b.w}×${b.h}`;
        ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = hc;
        ctx.beginPath();
        ctx.roundRect(x0 - 2, y0 - 22, tw + 12, 18, [3, 3, 0, 0]);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText(label, x0 + 4, y0 - 9);
      }

      // food — only in the game
      if (st.playing) {
        const pulse = 3.2 + Math.sin(now / 260) * 0.9;
        const fx = st.food.x * G + OFF;
        const fy = st.food.y * G + OFF;
        ctx.beginPath();
        ctx.arc(fx, fy, pulse + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,227,139,${0.12 * alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(fx, fy, pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,227,139,${0.95 * alpha})`;
        ctx.fill();
      }

      // snake — dots taper and shift from selection blue to terminal green
      const n = st.body.length;
      for (let i = n - 1; i >= 0; i--) {
        const to = st.body[i];
        const fr = st.from[i] ?? to;
        const jump = Math.abs(to.x - fr.x) > 1 || Math.abs(to.y - fr.y) > 1;
        const px = jump ? to.x : fr.x + (to.x - fr.x) * ease;
        const py = jump ? to.y : fr.y + (to.y - fr.y) * ease;
        const k = n > 1 ? i / (n - 1) : 0;
        const r = 4.4 - k * 2.8;
        const cr = Math.round(47 + (94 - 47) * k);
        const cg = Math.round(140 + (227 - 140) * k);
        const cb = Math.round(255 + (139 - 255) * k);
        const a = (1 - k * 0.7) * alpha;
        const x = px * G + OFF;
        const y = py * G + OFF;
        if (i === 0) {
          ctx.beginPath();
          ctx.arc(x, y, r + 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(47,140,255,${0.18 * alpha})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      if (!document.hidden) {
        if (!reduced && now - st.lastTick >= st.step) tick(now);
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // the snake chases your cursor / finger
    const toCell = (x: number, y: number) => ({
      x: Math.max(0, Math.min(st.cols - 1, Math.round((x - OFF) / G))),
      y: Math.max(0, Math.min(st.rows - 1, Math.round((y - OFF) / G))),
    });
    const onMove = (e: PointerEvent) => {
      st.cursor = toCell(e.clientX, e.clientY);
      st.cursorAt = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [placeFood, reset]);

  // ── play mode on / off ─────────────────────────────────────
  const start = useCallback(() => {
    const st = s.current;
    st.playing = true;
    st.paused = false;
    st.step = st.coarse ? 112 : 105;
    reset(5);
    st.lastTick = performance.now() + 550; // a short "ready" beat before it moves
    sfx.start();
    setScore(0);
    setOver(false);
    setPaused(false);
  }, [reset]);

  useEffect(() => {
    const st = s.current;
    const root = document.documentElement;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (playing) {
      start();
      root.classList.add("snake-playing");
      lenis?.stop();
    } else {
      st.playing = false;
      st.paused = false;
      st.dead = false;
      st.step = 120;
      st.grow = 0;
      const idleLen = window.innerWidth < 640 ? 10 : 16;
      if (st.body.length > idleLen) st.body = st.body.slice(0, idleLen);
      else if (st.body.length && st.body.length < idleLen) reset(idleLen);
      st.from = st.body.map((p) => ({ ...p }));
      setOver(false);
      root.classList.remove("snake-playing");
      lenis?.start();
    }
  }, [playing, start, reset]);

  // One steering entry point for keys, swipes and the d-pad. If the snake is
  // mid-step it turns on the very next frame instead of waiting a full tick.
  const steer = useCallback(
    (d: P) => {
      const st = s.current;
      if (st.dead) return start();
      if (st.paused) return;
      const last = st.queue.length ? st.queue[st.queue.length - 1] : st.dir;
      if ((d.x === -last.x && d.y === -last.y) || (d.x === last.x && d.y === last.y)) return;
      const now = performance.now();
      if (!st.queue.length && now - st.lastTick > st.step * 0.35) {
        st.queue.push(d);
        st.lastTick = now - st.step; // move now
      } else if (st.queue.length < 3) st.queue.push(d);
      navigator.vibrate?.(8);
      sfx.turn();
    },
    [start],
  );

  const togglePause = useCallback(() => {
    const st = s.current;
    if (st.dead) return;
    st.paused = !st.paused;
    if (!st.paused) st.lastTick = performance.now();
    setPaused(st.paused);
    if (st.paused) sfx.pause();
    else sfx.resume();
    navigator.vibrate?.(12);
  }, []);

  useEffect(() => setCoarse(window.matchMedia("(pointer: coarse)").matches), []);

  // keyboard steering
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      const d = DIRS[e.key];
      const st = s.current;
      if (d) {
        e.preventDefault();
        steer(d);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (st.dead) start();
        else togglePause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, start, steer, togglePause]);

  // swipe steering (phones)
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const t0 = touch.current;
    if (!t0) return;
    const t = e.touches[0];
    const dx = t.clientX - t0.x;
    const dy = t.clientY - t0.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
    const d = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
    if (!s.current.dead) steer(d);
    touch.current = { x: t.clientX, y: t.clientY }; // allow chained swipes in one gesture
  };
  const onTouchEnd = () => {
    if (s.current.dead) start();
    touch.current = null;
  };

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-[1] pointer-events-none" />

      {playing && (
        <>
          {/* touch surface */}
          <div
            className="fixed inset-0 z-[44] touch-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => s.current.dead && start()}
            data-inspector-ignore
          />
          {/* HUD */}
          <div
            className="fixed z-[46] left-1/2 -translate-x-1/2 top-16 md:top-[84px] route-enter"
            data-inspector-ignore
          >
            <div className="flex items-center gap-3 sm:gap-4 pl-4 pr-1.5 h-10 whitespace-nowrap rounded-full border border-line-2 bg-panel/90 backdrop-blur font-mono text-[12px] shadow-2xl">
              <span className="text-term">snake</span>
              <span className="text-ink tabular-nums">score {score}</span>
              <span className="text-faint tabular-nums">best {Math.max(best, score)}</span>
              <button
                type="button"
                onClick={() => {
                  const m = !muted;
                  sfx.setMuted(m);
                  setMuted(m);
                  if (!m) sfx.resume();
                }}
                aria-label={muted ? "Unmute sound" : "Mute sound"}
                aria-pressed={!muted}
                className="grid place-items-center w-7 h-7 rounded-full hover:bg-white/10 text-dim hover:text-ink"
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <button
                type="button"
                onClick={() => setSnake(false)}
                aria-label="Exit snake"
                className="grid place-items-center w-7 h-7 rounded-full hover:bg-white/10 text-dim hover:text-ink"
              >
                <X size={14} />
              </button>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-dim">
              {over ? (
                <span className="text-red">game over — {coarse ? "press A to retry" : "press space to retry"}</span>
              ) : paused ? (
                <span className="text-syn-n" style={{ color: "var(--syn-n)" }}>
                  paused
                </span>
              ) : (
                <>
                  <span className="hidden md:inline">arrow keys to steer · esc to quit</span>
                  <span className="md:hidden">d-pad or swipe to steer</span>
                </>
              )}
            </p>
          </div>

          {coarse && (
            <GamePad
              onDir={steer}
              onA={() => (s.current.dead ? start() : togglePause())}
              onB={() => setSnake(false)}
              aIcon={over ? "retry" : paused ? "play" : "pause"}
            />
          )}
        </>
      )}
    </>
  );
}

// ── on-screen controller (touch devices) ─────────────────────
function PadButton({
  onPress,
  label,
  className = "",
  children,
}: {
  onPress: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        sfx.unlock();
        onPress();
      }}
      onContextMenu={(e) => e.preventDefault()}
      className={`grid place-items-center select-none touch-none transition-[transform,background-color,box-shadow] duration-75 active:scale-[0.92] ${className}`}
    >
      {children}
    </button>
  );
}

function GamePad({
  onDir,
  onA,
  onB,
  aIcon,
}: {
  onDir: (d: P) => void;
  onA: () => void;
  onB: () => void;
  aIcon: "pause" | "play" | "retry";
}) {
  const dirBtn =
    "w-[50px] h-[50px] bg-panel-2 border border-line-2 text-ink active:bg-sel active:border-sel active:text-white active:shadow-[0_0_24px_rgba(47,140,255,0.55)]";
  return (
    <div
      className="fixed z-[47] left-0 right-0 bottom-[calc(36px+env(safe-area-inset-bottom))] px-3 pb-3 route-enter"
      data-inspector-ignore
    >
      <div className="relative mx-auto max-w-[440px] h-[200px] rounded-[30px] border border-line-2 bg-[rgba(15,15,18,0.92)] backdrop-blur-xl shadow-[0_-20px_60px_rgba(0,0,0,0.5)] flex items-center justify-between px-3 min-[380px]:px-4">
        {/* speaker grille */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-white/15" />
          ))}
        </div>

        {/* B — left */}
        <div className="flex flex-col items-center gap-1.5">
          <PadButton
            label="Quit"
            onPress={onB}
            className="w-[58px] h-[58px] rounded-full bg-red/90 text-black shadow-[0_6px_0_rgba(0,0,0,0.45)] active:shadow-[0_2px_0_rgba(0,0,0,0.45)] active:translate-y-[3px]"
          >
            <X size={20} />
          </PadButton>
          <span className="font-mono text-[10px] text-dim">B · quit</span>
        </div>

        {/* D-pad */}
        <div className="grid grid-cols-3 grid-rows-3 gap-[2px]" style={{ width: 154, height: 154 }}>
          <span />
          <PadButton label="Up" onPress={() => onDir({ x: 0, y: -1 })} className={`${dirBtn} rounded-t-xl`}>
            <ChevronUp size={24} />
          </PadButton>
          <span />
          <PadButton label="Left" onPress={() => onDir({ x: -1, y: 0 })} className={`${dirBtn} rounded-l-xl`}>
            <ChevronLeft size={24} />
          </PadButton>
          <span className="grid place-items-center bg-panel-2 border border-line-2">
            <span className="w-3 h-3 rounded-full bg-white/10" />
          </span>
          <PadButton label="Right" onPress={() => onDir({ x: 1, y: 0 })} className={`${dirBtn} rounded-r-xl`}>
            <ChevronRight size={24} />
          </PadButton>
          <span />
          <PadButton label="Down" onPress={() => onDir({ x: 0, y: 1 })} className={`${dirBtn} rounded-b-xl`}>
            <ChevronDown size={24} />
          </PadButton>
          <span />
        </div>

        {/* A — right */}
        <div className="flex flex-col items-center gap-1.5">
          <PadButton
            label={aIcon === "pause" ? "Pause" : aIcon === "play" ? "Resume" : "Retry"}
            onPress={onA}
            className="w-[58px] h-[58px] rounded-full bg-term/90 text-black shadow-[0_6px_0_rgba(0,0,0,0.45),0_0_30px_rgba(94,227,139,0.25)] active:shadow-[0_2px_0_rgba(0,0,0,0.45)] active:translate-y-[3px]"
          >
            {aIcon === "pause" ? <Pause size={22} /> : aIcon === "play" ? <Play size={22} /> : <RotateCcw size={22} />}
          </PadButton>
          <span className="font-mono text-[10px] text-dim">
            A · {aIcon === "pause" ? "pause" : aIcon === "play" ? "play" : "retry"}
          </span>
        </div>
      </div>
    </div>
  );
}
