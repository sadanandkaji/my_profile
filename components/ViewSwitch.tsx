"use client";

import type { ReactNode } from "react";
import { Code2, Type } from "lucide-react";
import { useWorkbench } from "@/components/Workbench";

/** Shows `dev` content normally, `plain` content in plain-English view. */
export default function ViewSwitch({
  dev,
  plain,
  inline = false,
  className = "",
}: {
  dev: ReactNode;
  plain: ReactNode;
  inline?: boolean;
  className?: string;
}) {
  const { plain: isPlain } = useWorkbench();
  const Tag = inline ? "span" : "div";
  return (
    <Tag key={isPlain ? "plain" : "dev"} className={`route-enter ${className}`}>
      {isPlain ? plain : dev}
    </Tag>
  );
}

/** Segmented control: developer view ↔ plain English. */
export function ViewToggle({ compact = false }: { compact?: boolean }) {
  const { plain, setPlain } = useWorkbench();
  const base = "flex items-center gap-1.5 h-[22px] px-2 rounded-[4px] font-mono text-[11px] transition-colors";
  return (
    <div
      role="group"
      aria-label="Choose how this site reads"
      className="flex items-center p-[2px] rounded-md border border-line-2 bg-panel"
    >
      <button
        type="button"
        aria-pressed={!plain}
        onClick={() => setPlain(false)}
        className={`${base} ${!plain ? "bg-white/[0.09] text-ink" : "text-faint hover:text-ink"}`}
        title="Developer view"
      >
        <Code2 size={12} />
        {!compact && "dev"}
      </button>
      <button
        type="button"
        aria-pressed={plain}
        onClick={() => setPlain(true)}
        className={`${base} ${plain ? "bg-term/15 text-term" : "text-faint hover:text-ink"}`}
        title="Plain English — no tech talk"
      >
        <Type size={12} />
        {!compact && "plain"}
      </button>
    </div>
  );
}

/** Inline invitation for non-technical visitors. */
export function PlainInvite() {
  const { plain, setPlain } = useWorkbench();
  return (
    <button
      type="button"
      onClick={() => setPlain(!plain)}
      className="group inline-flex items-center gap-2 text-[14px] text-dim hover:text-ink transition-colors"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-term" />
      {plain ? (
        <>Back to the developer view</>
      ) : (
        <>
          Not a developer? <span className="underline decoration-term/40 underline-offset-4 group-hover:decoration-term">Read it in plain English</span>
        </>
      )}
    </button>
  );
}
