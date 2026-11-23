"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isTyping, useWorkbench } from "@/components/Workbench";
import { NAV_ITEMS } from "@/components/Nav";

type LenisLike = { scroll: number; limit: number; scrollTo(t: number, o?: { immediate?: boolean }): void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;
const scrollToY = (y: number) => {
  const l = lenis();
  if (l) l.scrollTo(Math.max(0, Math.min(y, l.limit)));
  else window.scrollTo({ top: y, behavior: "smooth" });
};
const scrollByY = (dy: number) => scrollToY((lenis()?.scroll ?? window.scrollY) + dy);

export const VIM_KEYS: [string, string][] = [
  ["j / k", "scroll down / up"],
  ["d / u", "half page down / up"],
  ["gg / G", "jump to top / bottom"],
  ["h / l", "previous / next page"],
  ["/", "search (command palette)"],
  [":", "command line"],
  ["i", "toggle inspect mode"],
  ["s", "play snake"],
  ["?", "this help"],
];

export const VIM_COMMANDS: [string, string][] = [
  [":home  :about  :projects  :contact", "open a page"],
  [":agents", "jump to the agent demo"],
  [":plain  :dev", "switch plain-English / developer view"],
  [":inspect", "toggle inspect mode"],
  [":snake", "play snake on the grid"],
  [":help", "show keybindings"],
  [":q", "try to quit"],
];

// Vim emulation for the whole site: motions, page switching, and a
// ":" command line that lives in the status bar.
export default function Vim() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    vimMode,
    setVimMode,
    flash,
    paletteOpen,
    setPaletteOpen,
    toggleInspect,
    setPlain,
    helpOpen,
    setHelpOpen,
    snake,
    setSnake,
  } = useWorkbench();
  const [cmd, setCmd] = useState("");
  const lastG = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const pageIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)))
  );

  // motions
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (paletteOpen || snake || vimMode === "COMMAND" || isTyping(e.target)) return;
      const half = window.innerHeight / 2;
      switch (e.key) {
        case "j":
          scrollByY(110);
          break;
        case "k":
          scrollByY(-110);
          break;
        case "d":
          scrollByY(half);
          break;
        case "u":
          scrollByY(-half);
          break;
        case "G":
          scrollToY(document.body.scrollHeight);
          break;
        case "g": {
          const now = Date.now();
          if (now - lastG.current < 500) {
            scrollToY(0);
            lastG.current = 0;
          } else lastG.current = now;
          break;
        }
        case "h":
          router.push(NAV_ITEMS[(pageIndex - 1 + NAV_ITEMS.length) % NAV_ITEMS.length].href);
          break;
        case "l":
          router.push(NAV_ITEMS[(pageIndex + 1) % NAV_ITEMS.length].href);
          break;
        case "/":
          e.preventDefault();
          setPaletteOpen(true);
          break;
        case ":":
          e.preventDefault();
          setCmd("");
          setVimMode("COMMAND");
          break;
        case "?":
          setHelpOpen(!helpOpen);
          break;
        default:
          return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, snake, vimMode, pageIndex, router, setPaletteOpen, setVimMode, helpOpen, setHelpOpen]);

  useEffect(() => {
    if (vimMode === "COMMAND") requestAnimationFrame(() => inputRef.current?.focus());
  }, [vimMode]);

  const run = (raw: string) => {
    const c = raw.trim().replace(/^:/, "").toLowerCase();
    const pages: Record<string, string> = { home: "/", about: "/about", projects: "/projects", contact: "/contact" };
    const target = c.replace(/^e(dit)?\s+/, "");
    if (!c) return;
    if (pages[target]) router.push(pages[target]);
    else if (c === "agents") router.push("/#agents");
    else if (c === "plain") {
      setPlain(true);
      flash("plain-English view on");
    } else if (c === "dev") {
      setPlain(false);
      flash("developer view on");
    } else if (c === "inspect") toggleInspect();
    else if (c === "snake") setSnake(true);
    else if (c === "help" || c === "h") setHelpOpen(true);
    else if (["q", "q!", "wq", "x", "qa"].includes(c)) flash("E37: nobody ever really quits vim. stay a while :)");
    else if (c === "w") flash('"portfolio" written — already deployed');
    else flash(`E492: Not an editor command: ${c}`);
  };

  return (
    <>
      {vimMode === "COMMAND" && (
        <form
          className="fixed bottom-0 left-0 right-0 z-[55] h-7 flex items-center px-3 bg-bg border-t border-line font-mono text-[12px]"
          data-inspector-ignore
          onSubmit={(e) => {
            e.preventDefault();
            run(cmd);
            setVimMode("NORMAL");
          }}
        >
          <span className="text-ink">:</span>
          <input
            ref={inputRef}
            autoFocus
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || (e.key === "Backspace" && cmd === "")) {
                e.preventDefault();
                setVimMode("NORMAL");
              }
            }}
            onBlur={() => setVimMode("NORMAL")}
            className="flex-1 bg-transparent outline-none text-ink caret-sel"
            aria-label="Vim command"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="text-faint hidden sm:inline">try :projects · :plain · :help</span>
        </form>
      )}

      {helpOpen && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center px-4 bg-black/60 backdrop-blur-sm"
          onMouseDown={() => setHelpOpen(false)}
          data-inspector-ignore
          role="dialog"
          aria-modal="true"
          aria-label="Vim keybindings"
        >
          <div
            className="w-full max-w-lg rounded-xl border border-line-2 bg-panel overflow-hidden route-enter font-mono text-[12px]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 h-10 border-b border-line">
              <span className="text-ink">:help vim</span>
              <span className="text-faint">esc to close</span>
            </div>
            <div className="p-4 space-y-5">
              <KeyList title="motions" rows={VIM_KEYS} />
              <KeyList title="commands" rows={VIM_COMMANDS} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function KeyList({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] text-faint mb-2">{title}</p>
      <dl className="grid grid-cols-[minmax(0,1.2fr)_1fr] gap-x-4 gap-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-term">{k}</dt>
            <dd className="text-dim">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
