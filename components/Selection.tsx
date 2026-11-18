"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Layer name shown in the blue chip above the frame */
  label?: string;
  /** Show the live W × H chip under the frame */
  showSize?: boolean;
  /** Only show the selection while hovering (for cards) */
  hoverOnly?: boolean;
  className?: string;
  /** Gap between content and selection outline, in px */
  inset?: number;
};

// A Figma-style selection frame: blue outline, four handles, a layer-name
// chip, and a live dimension readout measured with ResizeObserver.
export default function Selection({
  children,
  label,
  showSize = true,
  hoverOnly = false,
  className = "",
  inset = 8,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.target.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const vis = hoverOnly ? "opacity-0 group-hover/sel:opacity-100 transition-opacity duration-200" : "";

  return (
    <div ref={ref} className={`group/sel relative ${className}`} data-layer={label}>
      {children}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute border border-sel ${vis}`}
        style={{ inset: -inset }}
      >
        <span className="handle -left-[4px] -top-[4px]" />
        <span className="handle -right-[4px] -top-[4px]" />
        <span className="handle -left-[4px] -bottom-[4px]" />
        <span className="handle -right-[4px] -bottom-[4px]" />
        {label && (
          <span className="absolute -top-[22px] -left-px px-1.5 py-[2px] rounded-t-[3px] bg-sel text-white font-mono text-[10px] leading-[14px] whitespace-nowrap">
            {label}
          </span>
        )}
        {showSize && size && (
          <span className="absolute -bottom-[24px] left-1/2 -translate-x-1/2 px-1.5 py-[2px] rounded-[3px] bg-sel text-white font-mono text-[10px] leading-[14px] tabular-nums whitespace-nowrap">
            {size.w} × {size.h}
          </span>
        )}
      </div>
    </div>
  );
}
