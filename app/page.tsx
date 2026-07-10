import Link from "next/link";
import BlueprintCard from "@/components/BlueprintCard";
import { SOCIALS } from "@/lib/socials";
import { SKILLS } from "@/lib/skills";
import { PROJECTS } from "@/lib/projects";
import { STATS } from "@/lib/Stats";

export default function Home() {
  const featured = PROJECTS.find((p) => p.status === "In Progress") ?? PROJECTS[0];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-36 pb-24">
      {/* Hero */}
      <section className="mb-28">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-5"
          style={{ fontFamily: "var(--font-mono)", color: "var(--gold)" }}
        >
        </p>
        <h1
          className="font-display italic text-5xl sm:text-7xl leading-[1.05] mb-6"
          style={{ color: "var(--ink)" }}
        >
          Sadanand Kaji <span className="text-sm align-super not-italic" aria-hidden="true">👋</span>
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl leading-relaxed" style={{ color: "var(--ink-dim)" }}>
          Full-stack developer and freelancer, MCA at RVITM. I design and ship
          products end to end — right now that means teaching a CAD tool to
          understand plain language.
        </p>

        <div className="flex flex-wrap gap-3 mt-10">
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-md text-sm tracking-wide transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--gold)", color: "var(--bg)", fontFamily: "var(--font-mono)" }}
          >
            View projects
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-md text-sm tracking-wide transition-colors hover:border-[var(--gold)]"
            style={{ border: "1px solid var(--line)", color: "var(--ink)", fontFamily: "var(--font-mono)" }}
          >
            Get in touch
          </Link>
        </div>
      </section>

      {/* Stat strip */}
      <section
        className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-28 rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--line)" }}
        aria-label="Quick facts"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}>
              {stat.label}
            </p>
            <p className="text-sm sm:text-base" style={{ color: "var(--ink)" }}>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Currently building */}
      <section className="mb-28">
        <BlueprintCard label="fig. a — currently building">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--teal)" }} />
                <span className="text-[10px] uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-mono)", color: "var(--teal)" }}>
                  {featured.status}
                </span>
              </div>
              <h2 className="font-display italic text-2xl sm:text-3xl mb-2" style={{ color: "var(--ink)" }}>
                {featured.title}
              </h2>
              <p className="max-w-xl leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                {featured.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end shrink-0">
              {featured.stack.map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-2 py-1 rounded"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--gold)", border: "1px solid var(--line)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </BlueprintCard>
      </section>

      {/* Skills legend */}
      <section className="mb-28">
       
        <div className="grid sm:grid-cols-2 gap-6">
          {SKILLS.map((group) => (
            <div key={group.group} className="flex gap-4">
              <span
                className="text-[10px] shrink-0 w-10 pt-1"
                style={{ fontFamily: "var(--font-mono)", color: "var(--gold)" }}
              >
                {group.ref}
              </span>
              <div>
                <p className="text-sm mb-2" style={{ color: "var(--ink)" }}>{group.group}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                  {group.items.join(" · ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Socials */}
      <section>
        
        <div className="flex flex-wrap gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md text-sm transition-colors hover:border-[var(--gold)]"
              style={{ border: "1px solid var(--line)", color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}