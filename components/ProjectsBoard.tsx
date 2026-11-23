"use client";

import { useState } from "react";
import { ArrowUpRight, Globe } from "lucide-react";
import Selection from "@/components/Selection";
import { GithubIcon, STATUS_COLOR, shortHash } from "@/components/icons";
import type { Project } from "@/lib/projects";

const FILTERS = ["All", "In Progress", "Shipped", "Client Work"] as const;
type Filter = (typeof FILTERS)[number];

export default function ProjectsBoard({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const items = filter === "All" ? projects : projects.filter((p) => p.status === filter);

  return (
    <>
      {/* filter bar — styled like a segmented control in a design tool */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <div
          role="tablist"
          aria-label="Filter projects"
          className="inline-flex max-w-full overflow-x-auto [scrollbar-width:none] p-1 rounded-lg border border-line-2 bg-panel/80"
        >
          {FILTERS.map((f) => {
            const count = f === "All" ? projects.length : projects.filter((p) => p.status === f).length;
            const active = f === filter;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className={`flex shrink-0 items-center gap-1.5 sm:gap-2 h-8 px-2.5 sm:px-3 rounded-md font-mono text-[11.5px] sm:text-[12px] transition-colors ${
                  active ? "bg-white/[0.08] text-ink" : "text-dim hover:text-ink"
                }`}
              >
                {f !== "All" && <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLOR[f] }} />}
                {f === "Client Work" ? (
                  <>
                    <span className="sm:hidden">client</span>
                    <span className="hidden sm:inline">client work</span>
                  </>
                ) : (
                  f.toLowerCase()
                )}
                <span className="text-faint">{count}</span>
              </button>
            );
          })}
        </div>
        <span className="hidden sm:inline font-mono text-[11px] text-faint">showing {items.length}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-x-6 gap-y-12">
        {items.map((p, i) => (
          <ProjectCard key={`${filter}-${p.slug}`} p={p} wide={filter === "All" && i === 0} delay={i * 70} />
        ))}
      </div>
    </>
  );
}

function ProjectCard({ p, wide, delay }: { p: Project; wide: boolean; delay: number }) {
  const color = STATUS_COLOR[p.status];
  return (
    <div className={`rise ${wide ? "md:col-span-2" : ""}`} style={{ animationDelay: `${delay}ms` }}>
      <Selection hoverOnly label={`Card / ${p.slug}`} inset={6} className="h-full">
        <article className="h-full flex flex-col rounded-xl border border-line-2 bg-panel/85 overflow-hidden">
          {/* tab bar */}
          <div className="flex items-center h-9 border-b border-line bg-panel-2/60 font-mono text-[11px]">
            <span className="flex items-center gap-2 h-full px-3.5 border-r border-line bg-panel text-ink">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              {p.slug}
            </span>
            <span className="px-3 text-faint">{shortHash(p.slug)}</span>
            <span className="ml-auto pr-3.5 flex items-center gap-1.5" style={{ color }}>
              {p.status === "In Progress" && (
                <span className="live-dot w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              )}
              {p.status.toLowerCase()}
            </span>
          </div>

          <div className={`flex-1 p-6 ${wide ? "md:grid md:grid-cols-[1.3fr_1fr] md:gap-10" : ""}`}>
            <div>
              <p className="font-mono text-[11px] text-faint mb-3">{p.year}</p>
              <h2 className="text-[22px] sm:text-[24px] font-medium tracking-tight leading-snug">{p.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-dim">{p.summary}</p>
            </div>
            <div className={wide ? "mt-6 md:mt-0" : "mt-6"}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint mb-2.5">stack</p>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="font-mono text-[11px] px-2 py-1 rounded border border-line-2 text-dim">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-6 py-3.5 border-t border-line font-mono text-[12px]">
            {p.githubHref && (
              <a
                href={p.githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-line-2 text-dim hover:text-ink hover:border-white/25 transition-colors"
              >
                <GithubIcon size={13} /> source
              </a>
            )}
            {p.demoHref && (
              <a
                href={p.demoHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink text-bg hover:opacity-90 transition-opacity"
              >
                <Globe size={13} /> live <ArrowUpRight size={12} />
              </a>
            )}
            {!p.githubHref && !p.demoHref && (
              <span className="text-faint">
                {p.status === "Client Work" ? "private client repo" : "in development · not public yet"}
              </span>
            )}
          </div>
        </article>
      </Selection>
    </div>
  );
}
