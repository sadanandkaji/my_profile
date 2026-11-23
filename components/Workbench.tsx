"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type VimMode = "NORMAL" | "COMMAND";

type Workbench = {
  inspect: boolean;
  toggleInspect: () => void;
  setInspect: (v: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  /** Plain-English view for non-technical visitors */
  plain: boolean;
  setPlain: (v: boolean) => void;
  /** Vim emulation state */
  vimMode: VimMode;
  setVimMode: (m: VimMode) => void;
  vimMessage: string;
  flash: (msg: string) => void;
  helpOpen: boolean;
  setHelpOpen: (v: boolean) => void;
  /** Snake game on the background grid */
  snake: boolean;
  setSnake: (v: boolean) => void;
};

const Ctx = createContext<Workbench | null>(null);

export function useWorkbench() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkbench must be used inside <WorkbenchProvider>");
  return ctx;
}

export function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

const PLAIN_KEY = "sk-view-plain";

// Global UI state for the "workbench": inspect mode, the ⌘K palette,
// the plain-English view, and vim mode.
export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [inspect, setInspect] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [plain, setPlainState] = useState(false);
  const [vimMode, setVimMode] = useState<VimMode>("NORMAL");
  const [vimMessage, setVimMessage] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [snake, setSnake] = useState(false);
  const toggleInspect = useCallback(() => setInspect((v) => !v), []);

  // remember the visitor's view choice
  useEffect(() => {
    try {
      if (localStorage.getItem(PLAIN_KEY) === "1") setPlainState(true);
    } catch {}
  }, []);
  const setPlain = useCallback((v: boolean) => {
    setPlainState(v);
    try {
      localStorage.setItem(PLAIN_KEY, v ? "1" : "0");
    } catch {}
  }, []);

  const flash = useCallback((msg: string) => setVimMessage(msg), []);
  useEffect(() => {
    if (!vimMessage) return;
    const id = setTimeout(() => setVimMessage(""), 3500);
    return () => clearTimeout(id);
  }, [vimMessage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setInspect(false);
        setHelpOpen(false);
        setSnake(false);
        return;
      }
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "s") {
        setSnake((v) => !v);
        return;
      }
      if (
        e.key.toLowerCase() === "i" &&
        !document.documentElement.classList.contains("snake-playing") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isTyping(e.target)
      ) {
        setInspect((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({
      inspect,
      toggleInspect,
      setInspect,
      paletteOpen,
      setPaletteOpen,
      plain,
      setPlain,
      vimMode,
      setVimMode,
      vimMessage,
      flash,
      helpOpen,
      setHelpOpen,
      snake,
      setSnake,
    }),
    [inspect, toggleInspect, paletteOpen, plain, setPlain, vimMode, vimMessage, flash, helpOpen, snake]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
