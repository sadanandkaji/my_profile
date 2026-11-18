import type { ReactNode } from "react";

type Props = {
  /** File name shown in the active tab */
  title: string;
  /** Colored dot in the tab */
  dot?: string;
  /** Right side of the tab bar */
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  layer?: string;
};

// A code-editor panel: tab strip on top, content below.
export default function EditorWindow({
  title,
  dot = "var(--syn-f)",
  right,
  children,
  className = "",
  bodyClassName = "p-5 sm:p-6",
  layer,
}: Props) {
  return (
    <div
      className={`rounded-xl border border-line-2 bg-panel/90 backdrop-blur-sm overflow-hidden ${className}`}
      data-layer={layer ?? title}
    >
      <div className="flex items-stretch h-9 border-b border-line bg-panel-2/60">
        <div className="relative flex items-center gap-2 px-3.5 border-r border-line bg-panel font-mono text-[11px] text-ink">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
          {title}
          <span className="text-faint ml-1">×</span>
          <span className="absolute left-0 right-0 top-0 h-px bg-sel" />
        </div>
        {right && <div className="ml-auto flex items-center pr-3.5 font-mono text-[11px] text-dim">{right}</div>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
