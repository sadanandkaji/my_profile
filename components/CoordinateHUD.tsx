"use client";
import { useEffect, useRef } from "react";

// Signature element: a small fixed HUD, styled like the coordinate readout
// in the corner of CAD software, that tracks the cursor live. It's a quiet
// nod to the AI-based CAD application this site's owner is building.
export default function CoordinateHUD() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!el) return;
        el.textContent = `X ${String(e.clientX).padStart(4, "0")}  Y ${String(
          e.clientY
        ).padStart(4, "0")}`;
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed bottom-4 left-4 z-40 hidden sm:block select-none pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="px-3 py-1.5 rounded-md text-[10px] tracking-wider"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--gold)",
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span ref={ref}>X 0000  Y 0000</span>
      </div>
    </div>
  );
}
