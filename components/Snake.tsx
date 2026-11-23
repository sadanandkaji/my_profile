"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
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

// A snake made of dots that lives on the background grid.
//  · idle: it wanders, eats food and chases your cursor / finger
//  · play mode ("s", status bar button, :snake): arrows or swipes steer it
export default function Snake() {
  const { snake: playing, setSnake } = useWorkbench();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);

  const s = useRef({
    body: [] as P[],
    from: [] as P[],
    dir: { x: 1, y: 0 } as P,
    queue: [] as P[],
    food: { x: 10, y: 10 } as P,
    cols: 0,
    rows: 0,
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
    const top = 4; // keep clear of the top bar
    const bottom = Math.max(top + 2, st.rows - 3);
    for (let i = 0; i < 50; i++) {
      const f = {
        x: 1 + Math.floor(Math.random() * Math.max(1, st.cols - 2)),
        y: top + Math.floor(Math.random() * (bottom - top)),
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
      const cy = Math.floor(st.rows / 2);
      const cx = Math.floor(st.cols / 3);
      st.body = Array.from({ length: len }, (_, i) => ({ x: cx - i, y: cy }));
      st.from = st.body.map((p) => ({ ...p }));
      st.dir = { x: 1, y: 0 };
      st.queue = [];
      st.grow = 0;
      st.dead = false;
      st.score = 0;
      placeFood();
    },
    [placeFood]
  );

  // ── main loop ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const st = s.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    try {
      setBest(Number(localStorage.getItem(BEST_KEY) || 0));
    } catch {}

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
      const target = st.cursor && now - st.cursorAt < 2600 ? st.cursor : st.food;
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
      if (st.dead) return;
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
      const nh = { x: (head.x + st.dir.x + st.cols) % st.cols, y: (head.y + st.dir.y + st.rows) % st.rows };
      const old = st.body;

      if (st.playing) {
        const tail = st.grow > 0 ? old : old.slice(0, -1);
        if (tail.some((b) => eq(b, nh))) {
          st.dead = true;
          setOver(true);
          setBest((b) => {
            const nb = Math.max(b, st.score);
            try {
              localStorage.setItem(BEST_KEY, String(nb));
            } catch {}
            return nb;
          });
          return;
        }
      }

      const body = [nh, ...old];
      if (eq(nh, st.food)) {
        st.grow += st.playing ? 2 : 3;
        placeFood();
        if (st.playing) {
          st.score += 1;
          setScore(st.score);
          st.step = Math.max(62, st.step - 3);
        }
      }
      if (st.grow > 0) st.grow--;
      else body.pop();
      if (!st.playing && body.length > 46) body.length = 18; // keep the idle snake tidy

      st.from = body.map((_, i) => old[i] ?? old[old.length - 1]);
      st.body = body;
      st.lastTick = now;
    };

    const draw = (now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const t = reduced ? 1 : Math.min(1, (now - st.lastTick) / st.step);
      const ease = t * (2 - t);
      const alpha = st.playing ? 1 : 0.5;

      // food
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
    st.step = 105;
    reset(5);
    setScore(0);
    setOver(false);
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
      st.dead = false;
      st.step = 120;
      setOver(false);
      root.classList.remove("snake-playing");
      lenis?.start();
    }
  }, [playing, start]);

  // keyboard steering
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      const d = DIRS[e.key];
      const st = s.current;
      if (d) {
        e.preventDefault();
        if (st.dead) start();
        else if (st.queue.length < 3) st.queue.push(d);
      } else if ((e.key === " " || e.key === "Enter") && st.dead) {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, start]);

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
    const st = s.current;
    if (!st.dead && st.queue.length < 3) st.queue.push(d);
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
                onClick={() => setSnake(false)}
                aria-label="Exit snake"
                className="grid place-items-center w-7 h-7 rounded-full hover:bg-white/10 text-dim hover:text-ink"
              >
                <X size={14} />
              </button>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-dim">
              {over ? (
                <span className="text-red">game over — tap or press space to retry</span>
              ) : (
                <>
                  <span className="hidden md:inline">arrow keys to steer · esc to quit</span>
                  <span className="md:hidden">swipe to steer · ✕ to quit</span>
                </>
              )}
            </p>
          </div>
        </>
      )}
    </>
  );
}
