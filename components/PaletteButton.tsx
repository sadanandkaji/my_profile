"use client";

import { Command } from "lucide-react";
import { useWorkbench } from "@/components/Workbench";

export default function PaletteButton() {
  const { setPaletteOpen } = useWorkbench();
  return (
    <button
      type="button"
      onClick={() => setPaletteOpen(true)}
      className="hidden sm:inline-flex items-center gap-2 h-11 px-4 rounded-lg text-[13px] text-dim hover:text-ink font-mono transition-colors"
    >
      <Command size={14} />
      press <kbd className="px-1.5 py-0.5 rounded border border-line-2 text-[11px]">⌘K</kbd>
    </button>
  );
}
