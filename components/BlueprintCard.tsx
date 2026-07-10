import type { ReactNode } from "react";

export default function BlueprintCard({
  label,
  children,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <div
          className="absolute -top-5 left-0 text-[10px] tracking-[0.15em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}
        >
          {label}
        </div>
      )}

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="torn-paper-edge">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.045"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="relative rounded-[2px]">
        {/* PAPER LAYER — only this gets distorted. No text lives here. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: "1px solid var(--line)",
            background: "rgba(239, 231, 214, 0.045)",
            boxShadow:
              "inset 0 1px 0 rgba(239,231,214,0.04), inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 0 10px rgba(0,0,0,0.12)",
            filter: "url(#torn-paper-edge)",
          }}
        >
          <div className="absolute inset-0 grain" style={{ opacity: 0.04 }} />
          <div className="absolute inset-0 foxing" style={{ opacity: 0.6 }} />
          <div
            className="absolute inset-0"
            style={{
              boxShadow: "inset 0 0 0 2px rgba(239,231,214,0.06)",
              mixBlendMode: "screen",
            }}
          />
        </div>

        {/* CONTENT LAYER — crisp, no filter, sits above the paper */}
        <div className="relative p-6">
          <span className="tick tick-tl" />
          <span className="tick tick-tr" />
          <span className="tick tick-bl" />
          <span className="tick tick-br" />
          {children}
        </div>
      </div>
    </div>
  );
}