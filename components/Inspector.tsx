"use client";

import { useEffect, useRef, useState } from "react";
import { useWorkbench } from "@/components/Workbench";

type Info = {
  x: number;
  y: number;
  w: number;
  h: number;
  pad: [number, number, number, number]; // t r b l
  tag: string;
  layer: string | null;
  font: string | null;
  color: string;
  radius: string;
};

function rgbToHex(rgb: string) {
  const m = rgb.match(/\d+(\.\d+)?/g);
  if (!m) return rgb;
  const [r, g, b] = m.map(Number);
  return "#" + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function hasOwnText(el: Element) {
  return Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent?.trim());
}

// Inspect mode — hover any element to see its box, padding, size and type
// spec, the way a design tool's dev mode would. Toggle with "I".
export default function Inspector() {
  const { inspect } = useWorkbench();
  const [info, setInfo] = useState<Info | null>(null);
  const last = useRef<Element | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!inspect) {
      setInfo(null);
      last.current = null;
      return;
    }
    const root = document.documentElement;
    root.classList.add("inspecting");

    const measure = (el: Element) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const layerEl = el.closest("[data-layer]");
      const family = cs.fontFamily.split(",")[0].replace(/['"]/g, "").replace(/^__|_[a-f0-9]+$/gi, "");
      setInfo({
        x: r.left,
        y: r.top,
        w: r.width,
        h: r.height,
        pad: [
          parseFloat(cs.paddingTop),
          parseFloat(cs.paddingRight),
          parseFloat(cs.paddingBottom),
          parseFloat(cs.paddingLeft),
        ],
        tag: el.tagName.toLowerCase(),
        layer: layerEl?.getAttribute("data-layer") ?? null,
        font: hasOwnText(el)
          ? `${family.replace(/Fallback$/, "").trim() || "sans"} · ${Math.round(parseFloat(cs.fontSize))}/${
              cs.lineHeight === "normal" ? "auto" : Math.round(parseFloat(cs.lineHeight))
            } · ${cs.fontWeight}`
          : null,
        color: rgbToHex(cs.color),
        radius: cs.borderRadius,
      });
    };

    const onMove = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el || el === document.body || el === root || el.closest("[data-inspector-ignore]")) {
        last.current = null;
        setInfo(null);
        return;
      }
      last.current = el;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => measure(el));
    };
    const onScroll = () => last.current && measure(last.current);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.classList.remove("inspecting");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, [inspect]);

  if (!inspect) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none" data-inspector-ignore aria-hidden="true">
      {!info && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 px-3 py-1.5 rounded-md bg-red text-black font-mono text-[11px]">
          inspect mode · hover anything · esc to exit
        </div>
      )}
      {info && <Overlay info={info} />}
    </div>
  );
}

function Overlay({ info }: { info: Info }) {
  const { x, y, w, h, pad } = info;
  const [pt, pr, pb, pl] = pad;
  const cardBelow = y < 120;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const cardLeft = Math.min(Math.max(x, 8), vw - 268);

  return (
    <>
      {/* padding areas */}
      {pt > 0 && <div className="absolute hatch" style={{ left: x, top: y, width: w, height: pt }} />}
      {pb > 0 && <div className="absolute hatch" style={{ left: x, top: y + h - pb, width: w, height: pb }} />}
      {pl > 0 && <div className="absolute hatch" style={{ left: x, top: y + pt, width: pl, height: h - pt - pb }} />}
      {pr > 0 && (
        <div className="absolute hatch" style={{ left: x + w - pr, top: y + pt, width: pr, height: h - pt - pb }} />
      )}

      {/* box */}
      <div className="absolute border border-sel" style={{ left: x, top: y, width: w, height: h }}>
        <span className="handle -left-[4px] -top-[4px]" />
        <span className="handle -right-[4px] -top-[4px]" />
        <span className="handle -left-[4px] -bottom-[4px]" />
        <span className="handle -right-[4px] -bottom-[4px]" />
      </div>

      {/* guides to viewport edges */}
      <div className="absolute border-t border-dashed border-sel/40" style={{ left: 0, width: x, top: y + h / 2 }} />
      <div className="absolute border-l border-dashed border-sel/40" style={{ top: 0, height: y, left: x + w / 2 }} />

      {/* size chip */}
      <div
        className="absolute -translate-x-1/2 px-1.5 py-[2px] rounded-[3px] bg-sel text-white font-mono text-[10px] tabular-nums whitespace-nowrap"
        style={{ left: x + w / 2, top: y + h + 6 }}
      >
        {Math.round(w)} × {Math.round(h)}
      </div>

      {/* spec card */}
      <div
        className="absolute w-[260px] rounded-md border border-line-2 bg-[rgba(15,15,18,0.96)] shadow-2xl font-mono text-[11px] overflow-hidden"
        style={cardBelow ? { left: cardLeft, top: y + h + 28 } : { left: cardLeft, top: y - 8, transform: "translateY(-100%)" }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-line">
          <span className="text-sel">&lt;{info.tag}&gt;</span>
          <span className="text-faint truncate ml-3">{info.layer ?? "layer"}</span>
        </div>
        <dl className="grid grid-cols-[72px_1fr] gap-y-1 px-3 py-2 text-dim">
          <dt>size</dt>
          <dd className="text-ink tabular-nums">
            {Math.round(w)} × {Math.round(h)}
          </dd>
          <dt>padding</dt>
          <dd className="text-red tabular-nums">{pad.map((p) => Math.round(p)).join(" ")}</dd>
          {info.radius !== "0px" && (
            <>
              <dt>radius</dt>
              <dd className="text-ink">{info.radius}</dd>
            </>
          )}
          {info.font && (
            <>
              <dt>type</dt>
              <dd className="text-ink truncate">{info.font}</dd>
              <dt>color</dt>
              <dd className="flex items-center gap-1.5 text-ink">
                <span className="w-2.5 h-2.5 rounded-[2px] border border-white/20" style={{ background: info.color }} />
                {info.color}
              </dd>
            </>
          )}
        </dl>
      </div>
    </>
  );
}
