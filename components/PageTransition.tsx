"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type Phase = "idle" | "leaving" | "entering";

// Wraps {children} from the root layout. Next.js only swaps the `children`
// prop on navigation — the layout itself doesn't remount — so this client
// component can hold the outgoing page on screen just long enough to run a
// leave animation before swapping in the new one, like turning a leaf in an
// old bound gazette.
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [shown, setShown] = useState(children);
  const [shownPath, setShownPath] = useState(pathname);
  const [phase, setPhase] = useState<Phase>("idle");
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>();
  const settleTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (pathname === shownPath) {
      // Same route, content updated in place (e.g. query params) — no flip needed.
      setShown(children);
      return;
    }

    setPhase("leaving");
    leaveTimer.current = setTimeout(() => {
      setShown(children);
      setShownPath(pathname);
      setPhase("entering");
      settleTimer.current = setTimeout(() => setPhase("idle"), 480);
    }, 380);

    return () => {
      clearTimeout(leaveTimer.current);
      clearTimeout(settleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="page-turn-stage">
      <div key={shownPath} className={`page-turn-sheet page-turn-${phase}`}>
        {shown}
      </div>
    </div>
  );
}