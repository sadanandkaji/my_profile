"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { GitBranch, Check, Crosshair, Gamepad2 } from "lucide-react";
import { useWorkbench } from "@/components/Workbench";
import { sfx } from "@/components/sfx";

const FILES: Record<string, string> = {
  "/": "app/page.tsx",
  "/about": "app/about/page.tsx",
  "/projects": "app/projects/page.tsx",
  "/contact": "app/contact/page.tsx",
};

function useIST() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// IDE-style status bar pinned to the bottom of the viewport.
export default function StatusBar() {
  const pathname = usePathname();
  const { inspect, toggleInspect, vimMode, vimMessage, plain, setHelpOpen, snake, setSnake } = useWorkbench();
  const time = useIST();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() =>
        setPos({ x: Math.round(e.clientX), y: Math.round(e.clientY + window.scrollY) }),
      );
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const file = FILES[pathname] ?? `app${pathname}/page.tsx`;

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 h-9 md:h-7 pb-[env(safe-area-inset-bottom)] box-content flex items-center justify-between gap-3 md:gap-4 px-3 border-t border-line bg-panel font-mono text-[11px] text-dim select-none"
      data-inspector-ignore
    >
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          title="Vim keys — press ? for help"
          className={`hidden md:block -ml-3 h-7 px-2.5 font-semibold tracking-wide ${
            vimMode === "COMMAND" ? "text-black" : "bg-sel text-white"
          }`}
          style={vimMode === "COMMAND" ? { background: "var(--syn-n)" } : undefined}
        >
          {vimMode}
        </button>
        {vimMessage ? (
          <span className={`truncate ${vimMessage.startsWith("E") ? "text-red" : "text-ink"}`}>{vimMessage}</span>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-ink">
              <GitBranch size={12} /> main
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Check size={12} className="text-term" /> build passing
            </span>
            <span className="truncate hidden min-[420px]:inline">{file}</span>
            <span className="hidden xl:inline text-faint">
              {plain ? "plain english" : "dev view"} · press <span className="text-dim">?</span> for vim keys
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="hidden lg:inline tabular-nums">
          x {pos.x} · y {pos.y}
        </span>
        <button
          type="button"
          onClick={toggleInspect}
          className={`hidden md:flex items-center gap-1.5 hover:text-ink ${inspect ? "text-red" : ""}`}
        >
          <Crosshair size={12} /> inspect: {inspect ? "on" : "off"}
        </button>
        <span className="hidden sm:inline tabular-nums">IST {time}</span>
        <button
          type="button"
          onClick={() => {
            sfx.unlock();
            setSnake(!snake);
          }}
          title="Play snake (S)"
          className={`flex items-center gap-1.5 h-6 md:h-5 px-2.5 md:px-2 rounded-full border transition-colors ${
            snake ? "border-red/50 text-red bg-red/10" : "border-term/30 text-term bg-term/[0.06] hover:bg-term/15"
          }`}
        >
          <Gamepad2 size={12} />
          {snake ? "quit" : "snake"}
        </button>
        <span className="flex items-center gap-1.5 text-term">
          <span className="live-dot w-1.5 h-1.5 rounded-full bg-term" /> open to work
        </span>
      </div>
    </footer>
  );
}
