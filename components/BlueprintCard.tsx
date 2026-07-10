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
      <div
        className="relative rounded-lg p-6 overflow-hidden torn-edge"
        style={{
          border: "1px solid var(--line)",
          background: "rgba(239, 231, 214, 0.045)",
          boxShadow: "inset 0 1px 0 rgba(239,231,214,0.04)",
        }}
      >
        {/* faint paper grain + foxing, contained to the card so it doesn't fight the page background */}
        <div className="absolute inset-0 grain pointer-events-none" style={{ opacity: 0.04 }} />
        <div className="absolute inset-0 foxing pointer-events-none" style={{ opacity: 0.6 }} />
        <span className="tick tick-tl" />
        <span className="tick tick-tr" />
        <span className="tick tick-bl" />
        <span className="tick tick-br" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}