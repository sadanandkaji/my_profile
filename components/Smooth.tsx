"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Smooth, inertial wheel scrolling on desktop (Lenis). Phones keep their
 * native momentum scrolling, which already feels right there.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95, anchors: true });
    window.__lenis = lenis;
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // new page → start at the top (or at the #hash target)
  useEffect(() => {
    const l = window.__lenis;
    if (!l) return;
    const hash = window.location.hash;
    if (hash && document.querySelector(hash)) {
      setTimeout(() => l.scrollTo(hash, { offset: -80 }), 60);
    } else {
      l.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}

/**
 * Fades + lifts every [data-reveal] element as it scrolls into view.
 * Add data-reveal to any element; optional style={{ "--d": "120ms" }} for a delay.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    // wait a frame so the new route's DOM is in place
    const id = requestAnimationFrame(() => {
      document.querySelectorAll("[data-reveal]:not(.revealed)").forEach((el) => io.observe(el));
    });
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
