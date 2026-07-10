"use client";
import { useEffect, useRef } from "react";

const GIFS = {
  right: "/luffyreal/luffy_runrightreal.gif",
  left: "/luffyreal/luffy_runleftreal.gif",
  up: "/luffyreal/luffy_runbackreal.gif",
  down: "/luffyreal/luffy_runstraight.gif",
  still: "/luffyreal/still.png",
};

const NAV_SAFE_ZONE = 84; // keep clear of the fixed navbar up top
const SPEED = 1.1; // px per frame — slow, constant-velocity glide

export default function LuffyTracker() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const luffyRef = useRef<HTMLImageElement>(null);

  // Current position lives here, not read from the DOM — calling
  // getBoundingClientRect() every frame forces a synchronous layout, which
  // was the source of the stutter/jump.
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const luffy = luffyRef.current;
    if (!wrap || !luffy) return;

    let animFrame: number;
    let currentDirection: keyof typeof GIFS = "still";

    const showDirection = (dir: keyof typeof GIFS) => {
      if (!luffy) return;
      if (!luffy.src.includes(GIFS[dir])) luffy.src = GIFS[dir];
      currentDirection = dir;
    };

    const render = () => {
      wrap.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
    };

    // Spawn below the navbar instead of defaulting to (0,0), which sits
    // directly under the "SK" logo until the first click moves it away.
    pos.current.x = 24;
    pos.current.y = NAV_SAFE_ZONE + 24;
    render();

    const moveLuffy = (targetX: number, targetY: number) => {
      cancelAnimationFrame(animFrame);

      const clampedY = Math.max(targetY, NAV_SAFE_ZONE);

      const step = () => {
        const dx = targetX - pos.current.x;
        const dy = clampedY - pos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= SPEED) {
          pos.current.x = targetX;
          pos.current.y = clampedY;
          render();
          showDirection("still");
          return;
        }

        let direction: keyof typeof GIFS;
        if (Math.abs(dx) > Math.abs(dy)) direction = dx > 0 ? "right" : "left";
        else direction = dy > 0 ? "down" : "up";

        if (currentDirection !== direction) showDirection(direction);

        pos.current.x += (dx / distance) * SPEED;
        pos.current.y += (dy / distance) * SPEED;
        render();

        animFrame = requestAnimationFrame(step);
      };

      step();
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      let x: number, y: number;
      if (e instanceof TouchEvent) {
        const touch = e.touches[0];
        x = touch.clientX;
        y = touch.clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      // Center the sprite on the click point using its current rendered size.
      const rect = luffy.getBoundingClientRect();
      moveLuffy(x - rect.width / 2, y - rect.height / 2);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("touchstart", handleClick);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="fixed top-0 left-0 pointer-events-none z-40"
      style={{ transition: "none", willChange: "transform" }}
    >
      {/* Fixed-size box so swapping between the still frame and the run gifs
          (which may have slightly different intrinsic dimensions) never
          shifts the sprite's footprint — that mismatch was the "jump". */}
      <div className="w-8 h-8 sm:w-14 sm:h-14 lg:w-20 lg:h-20">
        <img
          ref={luffyRef}
          src={GIFS.still}
          alt="A small animated Luffy character that runs to wherever you click"
          className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          style={{ transition: "none" }}
        />
      </div>
    </div>
  );
}