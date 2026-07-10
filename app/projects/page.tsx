import BlueprintCard from "@/components/BlueprintCard";
import { PROJECTS } from "@/lib/projects";

const STATUS_COLOR: Record<string, string> = {
  "In Progress": "var(--teal)",
  Shipped: "var(--gold)",
  "Client Work": "var(--ink-dim)",
};

export default function Projects() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-36 pb-24">
     
      <h1 className="font-display italic text-4xl sm:text-6xl mb-6" style={{ color: "var(--ink)" }}>
        Things I&apos;ve built
      </h1>
      <p className="text-lg leading-relaxed max-w-2xl mb-16" style={{ color: "var(--ink-dim)" }}>
        A running log of personal builds, hackathon projects, and freelance
        client work — updated as new ones ship.
      </p>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-16">
        {PROJECTS.map((p, i) => (
          <BlueprintCard key={p.slug} label={`fig. ${String(i + 1).padStart(2, "0")}`}>
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
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-2 py-1 rounded"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--gold)", border: "1px solid var(--line)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </BlueprintCard>
        ))}

      
      </div>
    </div>
  );
}
