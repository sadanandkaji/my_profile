"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crosshair, Search } from "lucide-react";
import { useWorkbench } from "@/components/Workbench";
import { ViewToggle } from "@/components/ViewSwitch";

// Nav items are presented as editor tabs — each route is a "file".
export const NAV_ITEMS = [
  { label: "index.tsx", name: "Home", href: "/", dot: "var(--syn-f)" },
  { label: "about.md", name: "About", href: "/about", dot: "var(--syn-p)" },
  { label: "projects/", name: "Projects", href: "/projects", dot: "var(--syn-n)" },
  { label: "contact.sh", name: "Contact", href: "/contact", dot: "var(--term)" },
];

export default function Nav() {
  const pathname = usePathname();
  const { inspect, toggleInspect, setPaletteOpen } = useWorkbench();

  return (
    <header className="fixed z-50 top-0 left-0 right-0 md:top-5 md:left-5">
      <div className="h-12 flex items-stretch border-b border-line bg-[rgba(9,9,11,0.78)] backdrop-blur-xl">
        {/* file title */}
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center gap-2.5 pl-4 pr-5 border-r border-line shrink-0"
        >
          <span className="relative grid place-items-center w-6 h-6 rounded-[5px] bg-sel text-white font-mono text-[10px] font-semibold">
            SK
          </span>
          <span className="hidden sm:flex items-center gap-1.5 font-mono text-[12px]">
            <span className="text-dim">sadanand</span>
            <span className="text-faint">/</span>
            <span className="text-ink">portfolio</span>
          </span>
        </Link>

        {/* tabs */}
        <nav className="flex items-stretch overflow-x-auto [scrollbar-width:none] min-w-0">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-2 px-3.5 sm:px-4 border-r border-line font-mono text-[12px] whitespace-nowrap transition-colors ${
                  active ? "text-ink bg-panel-2" : "text-dim hover:text-ink hover:bg-white/[0.02]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.dot, opacity: active ? 1 : 0.5 }} />
                {item.label}
                {active && <span className="absolute left-0 right-0 top-0 h-[1.5px] bg-sel" />}
              </Link>
            );
          })}
        </nav>

        {/* tools */}
        <div className="ml-auto flex items-center gap-2 px-3 shrink-0">
          <span className="hidden sm:block">
            <ViewToggle />
          </span>
          <span className="sm:hidden">
            <ViewToggle compact />
          </span>
          <button
            type="button"
            onClick={toggleInspect}
            aria-pressed={inspect}
            title="Inspect mode (I)"
            className={`hidden md:flex items-center gap-2 h-7 px-2.5 rounded-md border font-mono text-[11px] transition-colors ${
              inspect
                ? "border-red/60 text-red bg-red/10"
                : "border-line-2 text-dim hover:text-ink hover:border-white/25"
            }`}
          >
            <Crosshair size={13} />
            inspect
            <kbd className="text-[10px] px-1 rounded border border-current/30 opacity-70">I</kbd>
          </button>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            title="Command palette (Ctrl/⌘ K)"
            className="flex items-center gap-2 h-7 px-2.5 rounded-md border border-line-2 text-dim hover:text-ink hover:border-white/25 font-mono text-[11px] transition-colors"
          >
            <Search size={13} />
            <span className="hidden sm:inline">search</span>
            <kbd className="hidden sm:inline text-[10px] px-1 rounded border border-white/15 opacity-70">⌘K</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
