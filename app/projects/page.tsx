import BlueprintCard from "@/components/BlueprintCard";
import { PROJECTS, Project } from "@/lib/projects";
import { Globe } from "lucide-react";

function GithubIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const STATUS_COLOR: Record<string, string> = {
  "In Progress": "var(--teal)",
  Shipped: "var(--gold)",
  "Client Work": "var(--ink-dim)",
};

const SECTIONS: { status: Project["status"]; label: string; blurb: string }[] = [
  {
    status: "In Progress",
    label: "In Progress",
    blurb: "Currently building.",
  },
  {
    status: "Shipped",
    label: "Shipped",
    blurb: "Personal projects, live and out in the world.",
  },
  {
    status: "Client Work",
    label: "Client Work",
    blurb: "Freelance engagements delivered end-to-end.",
  },
];

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <BlueprintCard label={`fig. ${String(i + 1).padStart(2, "0")}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLOR[p.status] }} />
        <span className="text-[10px] uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-mono)", color: STATUS_COLOR[p.status] }}>
          {p.status}
        </span>
        <span className="text-[10px] ml-auto" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}>
          {p.year}
        </span>
      </div>
      <h2 className="font-display italic text-xl mb-2" style={{ color: "var(--ink)" }}>
        {p.title}
      </h2>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ink-dim)" }}>
        {p.summary}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {p.stack.map((s) => (
          <span
            key={s}
            className="text-[10px] px-2 py-1 rounded"
            style={{ fontFamily: "var(--font-mono)", color: "var(--gold)", border: "1px solid var(--line)" }}
          >
            {s}
          </span>
        ))}

        {(p.githubHref || p.demoHref) && (
          <span className="flex items-center gap-2 ml-auto">
            {p.githubHref && (
              <a
                href={p.githubHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.title} on GitHub`}
                className="p-1.5 rounded transition-opacity hover:opacity-70"
                style={{ border: "1px solid var(--line)" }}
              >
                <GithubIcon size={13} color="var(--ink-dim)" />
              </a>
            )}
            {p.demoHref && (
              <a
                href={p.demoHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.title} live demo`}
                className="p-1.5 rounded transition-opacity hover:opacity-70"
                style={{ border: "1px solid var(--line)" }}
              >
                <Globe size={13} style={{ color: "var(--gold)" }} />
              </a>
            )}
          </span>
        )}
      </div>
    </BlueprintCard>
  );
}

export default function Projects() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-36 pb-24">

      <h1 className="font-display italic text-4xl sm:text-6xl mb-6" style={{ color: "var(--ink)" }}>
        Things I&apos;ve built
      </h1>
      <p className="text-lg leading-relaxed max-w-2xl mb-16" style={{ color: "var(--ink-dim)" }}>
        A running log of personal builds, hackathon projects, and freelance
        client work  updated as new ones ship.
      </p>

      {SECTIONS.map((section) => {
        const items = PROJECTS.filter((p) => p.status === section.status);
        if (items.length === 0) return null;

        return (
          <div key={section.status} className="mb-20 last:mb-0">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLOR[section.status] }} />
              <h3
                className="text-xs uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)", color: STATUS_COLOR[section.status] }}
              >
                {section.label}
              </h3>
              <span
                className="text-[10px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}
              >
                ({items.length})
              </span>
            </div>
            <p className="text-sm mb-8" style={{ color: "var(--ink-dim)" }}>
              {section.blurb}
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-16">
              {items.map((p, i) => (
                <ProjectCard key={p.slug} p={p} i={i} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}