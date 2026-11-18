"use client";

import { useEffect, useRef, useState } from "react";

// Design-tool rulers along the top and left edge of the viewport.
// The cursor is tracked on both, and the vertical ruler scrolls with the page
// so its numbers are real page coordinates.
export default function Rulers() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [scrollY, setScrollY] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    const onScroll = () => setScrollY(window.scrollY);
    onResize();
    onScroll();
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const R = 20; // ruler thickness
  const xLabels = Array.from({ length: Math.ceil(size.w / 100) + 1 }, (_, i) => i * 100);
  const yStart = Math.floor(scrollY / 100) * 100;
  const yLabels = Array.from({ length: Math.ceil(size.h / 100) + 2 }, (_, i) => yStart + i * 100);

  return (
    <div aria-hidden="true" className="hidden md:block" data-inspector-ignore>
      {/* corner */}
      <div
        className="fixed top-0 left-0 z-[45] border-r border-b border-line bg-panel flex items-center justify-center"
        style={{ width: R, height: R }}
      >
        <span className="block w-1.5 h-1.5 border border-faint" />
      </div>

      {/* top ruler */}
      <div
        className="fixed top-0 right-0 z-40 bg-panel border-b border-line ruler-x overflow-hidden"
        style={{ left: R, height: R, backgroundPositionX: -R }}
      >
        {xLabels.map((v) => (
          <span
            key={v}
            className="absolute top-[3px] font-mono text-[9px] leading-none text-faint"
            style={{ left: v - R + 3 }}
          >
            {v}
          </span>
        ))}
        {pos.x >= R && (
          <>
            <span className="absolute top-0 bottom-0 w-px bg-sel" style={{ left: pos.x - R }} />
            <span
              className="absolute top-[3px] font-mono text-[9px] leading-none px-1 py-[1px] rounded-[2px] bg-sel text-white"
              style={{ left: pos.x - R + 4 }}
            >
              {Math.round(pos.x)}
            </span>
          </>
        )}
      </div>

      {/* left ruler */}
      <div
        className="fixed left-0 bottom-0 z-40 bg-panel border-r border-line ruler-y overflow-hidden"
        style={{ top: R, width: R, backgroundPositionY: -scrollY - R }}
      >
        {yLabels.map((v) => (
          <span
            key={v}
            className="absolute left-[4px] font-mono text-[9px] leading-none text-faint origin-top-left -rotate-90"
            style={{ top: v - scrollY - R + 22 }}
          >
            {v}
          </span>
        ))}
        {pos.y >= R && (
          <>
            <span className="absolute left-0 right-0 h-px bg-sel" style={{ top: pos.y - R }} />
            <span
              className="absolute left-[3px] font-mono text-[9px] leading-none px-[1px] py-1 rounded-[2px] bg-sel text-white [writing-mode:vertical-rl] rotate-180"
              style={{ top: pos.y - R + 4 }}
            >
              {Math.round(pos.y + scrollY)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
