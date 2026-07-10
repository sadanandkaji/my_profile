"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "home", href: "/" },
  { label: "about", href: "/about" },
  { label: "projects", href: "/projects" },
  { label: "contact", href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 sm:p-4">
      <div className="w-full max-w-5xl">
        <div
          className="flex justify-between items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-full backdrop-blur-lg shadow-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--line)",
          }}
        >
          <Link
            href="/"
            aria-label="Home"
            className="w-8 h-8 flex items-center justify-center text-xs font-medium rounded-md shrink-0"
            style={{ fontFamily: "var(--font-mono)", border: "1px solid var(--gold)", color: "var(--gold)" }}
          >
            SK
          </Link>
          <div className="flex gap-4 sm:gap-8">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative py-2 -my-2 px-0.5 uppercase text-[11px] sm:text-sm tracking-[0.12em] sm:tracking-[0.15em] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: active ? "var(--gold)" : "var(--ink-dim)",
                    ["--tw-ring-color" as string]: "var(--gold)",
                    ["--tw-ring-offset-color" as string]: "var(--bg)",
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--gold)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}