"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CornerDownLeft, Crosshair, FileCode2, Search } from "lucide-react";
import { useWorkbench } from "@/components/Workbench";
import { sfx } from "@/components/sfx";
import { NAV_ITEMS } from "@/components/Nav";
import { SOCIALS } from "@/lib/socials";
import { PROJECTS } from "@/lib/projects";

type Cmd = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: "file" | "link" | "tool";
  run: () => void;
};

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, toggleInspect, plain, setPlain, setHelpOpen, setSnake } = useWorkbench();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Cmd[]>(() => {
    const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer");
    return [
      ...NAV_ITEMS.map((n) => ({
        id: `go-${n.href}`,
        group: "Go to",
        label: n.name,
        hint: n.label,
        icon: "file" as const,
        run: () => router.push(n.href),
      })),
      {
        id: "plain",
        group: "Tools",
        label: plain ? "Switch to developer view" : "Switch to plain English (non-technical)",
        hint: plain ? ":dev" : ":plain",
        icon: "tool",
        run: () => setPlain(!plain),
      },
      {
        id: "snake",
        group: "Tools",
        label: "Play snake on the grid",
        hint: "S",
        icon: "tool",
        run: () => {
          sfx.unlock();
          setSnake(true);
        },
      },
      {
        id: "vim",
        group: "Tools",
        label: "Show vim keybindings",
        hint: "?",
        icon: "tool",
        run: () => setHelpOpen(true),
      },
      {
        id: "agent",
        group: "Tools",
        label: "Watch the agent demo",
        hint: "/#agents",
        icon: "tool",
        run: () => router.push("/#agents"),
      },
      {
        id: "inspect",
        group: "Tools",
        label: "Toggle inspect mode",
        hint: "I",
        icon: "tool",
        run: toggleInspect,
      },
      ...PROJECTS.filter((p) => p.demoHref).map((p) => ({
        id: `demo-${p.slug}`,
        group: "Live demos",
        label: p.title,
        hint: new URL(p.demoHref!).host,
        icon: "link" as const,
        run: () => open(p.demoHref!),
      })),
      ...SOCIALS.map((s) => ({
        id: `social-${s.label}`,
        group: "Elsewhere",
        label: s.label,
        hint: `@${s.handle}`,
        icon: "link" as const,
        run: () => open(s.href),
      })),
    ];
  }, [router, toggleInspect, plain, setPlain, setHelpOpen, setSnake]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.group} ${c.label} ${c.hint ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (paletteOpen) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [paletteOpen]);

  useEffect(() => setActive(0), [query]);

  if (!paletteOpen) return null;

  const runAt = (i: number) => {
    const cmd = filtered[i];
    if (!cmd) return;
    setPaletteOpen(false);
    cmd.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(active);
    }
  };

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-[14vh] px-4 bg-black/60 backdrop-blur-sm"
      onMouseDown={() => setPaletteOpen(false)}
      data-inspector-ignore
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl rounded-xl border border-line-2 bg-panel shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden route-enter"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-12 border-b border-line">
          <Search size={15} className="text-dim" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-faint"
            aria-label="Search commands"
          />
          <kbd className="font-mono text-[10px] text-faint border border-line-2 rounded px-1.5 py-0.5">esc</kbd>
        </div>

        <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center font-mono text-[12px] text-faint">no matches for “{query}”</li>
          )}
          {filtered.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            const Icon = c.icon === "file" ? FileCode2 : c.icon === "tool" ? Crosshair : ArrowUpRight;
            return (
              <li key={c.id}>
                {header && (
                  <p className="px-4 pt-3 pb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                    {header}
                  </p>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => runAt(i)}
                  className={`w-[calc(100%-16px)] mx-2 flex items-center gap-3 px-3 h-10 rounded-md text-left text-[13px] ${
                    i === active ? "bg-sel/15 text-ink" : "text-dim"
                  }`}
                >
                  <Icon size={14} className={i === active ? "text-sel" : "text-faint"} />
                  <span className="flex-1 truncate">{c.label}</span>
                  {c.hint && <span className="font-mono text-[11px] text-faint">{c.hint}</span>}
                  {i === active && <CornerDownLeft size={12} className="text-dim" />}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 px-4 h-9 border-t border-line font-mono text-[10px] text-faint">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span className="ml-auto">⌘K / ctrl K</span>
        </div>
      </div>
    </div>
  );
}
