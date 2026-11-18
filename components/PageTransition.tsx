"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Re-keys the page on route change so it plays a short rise-and-focus
// animation (opacity + translate + blur), like a panel opening in an editor.
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="route-enter">
      {children}
    </div>
  );
}
