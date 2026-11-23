"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Check, ChevronRight, Loader2, User, Wrench } from "lucide-react";
import EditorWindow from "@/components/EditorWindow";

type Step =
  | { kind: "user"; text: string }
  | { kind: "think"; text: string }
  | { kind: "tool"; name: string; args: string; result: string; ms: number }
  | { kind: "answer"; text: string };

// An example agent run, the kind of loop behind the AI CAD tool:
// prompt → plan → tool calls → checked result.
const RUN: Step[] = [
  { kind: "user", text: "Make a 40 mm L-bracket with two M5 mounting holes." },
  { kind: "think", text: "Plan: parse dimensions → sketch profile → extrude → add holes → validate." },
  { kind: "tool", name: "parse_intent", args: '{ part: "L-bracket", size: 40, holes: 2 }', result: "units=mm · features=3", ms: 182 },
  { kind: "tool", name: "sketch_profile", args: '{ shape: "L", w: 40, h: 40, t: 4 }', result: "closed profile · 6 edges", ms: 241 },
  { kind: "tool", name: "extrude", args: "{ depth: 20 }", result: "solid body created", ms: 96 },
  { kind: "tool", name: "add_holes", args: '{ spec: "M5", count: 2 }', result: "2 × Ø5.5 clearance holes", ms: 134 },
  { kind: "tool", name: "validate", args: "{ checks: [wall, edge_dist] }", result: "all constraints pass", ms: 77 },
  { kind: "answer", text: "Done — parametric model ready. Every dimension stays editable." },
];

export default function AgentTrace() {
  const [shown, setShown] = useState(0); // steps fully shown
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // start when scrolled into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(RUN.length);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRunning(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (shown >= RUN.length) {
      // pause on the finished run, then replay
      const id = setTimeout(() => setShown(0), 6000);
      return () => clearTimeout(id);
    }
    const step = RUN[shown];
    const delay = step.kind === "tool" ? 520 + step.ms : step.kind === "user" ? 500 : 900;
    const id = setTimeout(() => setShown((s) => s + 1), delay);
    return () => clearTimeout(id);
  }, [running, shown]);

  const done = shown >= RUN.length;
  const toolSteps = RUN.filter((s) => s.kind === "tool");
  const toolsDone = RUN.slice(0, shown).filter((s) => s.kind === "tool").length;
  const totalMs = RUN.slice(0, shown).reduce((a, s) => a + (s.kind === "tool" ? s.ms : 0), 0);

  return (
    <div ref={ref}>
      <EditorWindow
        title="agent.run — example"
        dot="var(--syn-p)"
        layer="Agent / Trace"
        right={
          <span className={`flex items-center gap-1.5 ${done ? "text-term" : ""}`} style={done ? undefined : { color: "var(--syn-p)" }}>
            {done ? <Check size={12} /> : <Loader2 size={12} className="animate-spin" />}
            {done ? "completed" : "running"}
          </span>
        }
        bodyClassName="grid md:grid-cols-[1fr_220px]"
      >
        {/* trace */}
        <ol className="p-5 sm:p-6 font-mono text-[12.5px] leading-relaxed space-y-3 min-h-[340px] md:min-h-[430px]">
          {RUN.map((s, i) => {
            if (i > shown) return null;
            const pending = i === shown;
            return <TraceRow key={i} step={s} pending={pending} />;
          })}
        </ol>

        {/* run stats */}
        <aside className="border-t md:border-t-0 md:border-l border-line p-5 font-mono text-[11px] space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-faint mb-2">tools</p>
            <ul className="space-y-1.5">
              {toolSteps.map((t, i) => (
                <li key={t.name} className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${i < toolsDone ? "bg-term" : "bg-faint"}`}
                  />
                  <span className={i < toolsDone ? "text-ink" : "text-faint"}>{t.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-faint mb-2">progress</p>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-sel transition-[width] duration-500"
                style={{ width: `${(Math.min(shown, RUN.length) / RUN.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-dim tabular-nums">
              {toolsDone}/{toolSteps.length} calls · {totalMs} ms
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-faint mb-2">loop</p>
            <p className="text-dim leading-relaxed">plan → act → observe → verify</p>
          </div>
        </aside>
      </EditorWindow>
    </div>
  );
}

function TraceRow({ step, pending }: { step: Step; pending: boolean }) {
  if (step.kind === "user") {
    return (
      <li className="flex gap-3 route-enter">
        <User size={14} className="mt-0.5 shrink-0 text-dim" />
        <p className="text-ink">{step.text}</p>
      </li>
    );
  }
  if (step.kind === "think") {
    return (
      <li className="flex gap-3 route-enter">
        <Bot size={14} className="mt-0.5 shrink-0" style={{ color: "var(--syn-p)" }} />
        <p className="text-dim italic">{pending ? "thinking…" : step.text}</p>
      </li>
    );
  }
  if (step.kind === "tool") {
    return (
      <li className="ml-7 route-enter rounded-md border border-line bg-panel-2/60">
        <div className="flex items-center gap-2 px-3 py-2">
          <Wrench size={12} className="text-sel shrink-0" />
          <span className="text-sel">{step.name}</span>
          <span className="text-faint truncate">{step.args}</span>
          <span className="ml-auto shrink-0">
            {pending ? (
              <Loader2 size={12} className="animate-spin text-dim" />
            ) : (
              <span className="text-faint tabular-nums">{step.ms}ms</span>
            )}
          </span>
        </div>
        {!pending && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-t border-line text-term">
            <ChevronRight size={12} /> {step.result}
          </div>
        )}
      </li>
    );
  }
  return (
    <li className="flex gap-3 route-enter">
      <Bot size={14} className="mt-0.5 shrink-0 text-term" />
      <p className={pending ? "text-dim" : "text-ink"}>{pending ? "writing…" : step.text}</p>
    </li>
  );
}
