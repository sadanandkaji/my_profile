import BlueprintCard from "@/components/BlueprintCard";
import { TIMELINE } from "@/lib/timeline";
import { SKILLS } from "@/lib/skills";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-36 pb-24">
    
      <h1 className="font-display italic text-4xl sm:text-6xl mb-8" style={{ color: "var(--ink)" }}>
        A bit about me
      </h1>
      <p className="text-lg leading-relaxed max-w-2xl mb-6" style={{ color: "var(--ink-dim)" }}>
        I&apos;m Sadanand, a full-stack developer currently completing my MCA
        at RVITM. I like building things end to end from schema to
        interface and I take on freelance client work alongside my own
        projects.
      </p>
      <p className="text-lg leading-relaxed max-w-2xl mb-20" style={{ color: "var(--ink-dim)" }}>
        Two client projects delivered, a handful of hackathon wins, and right
        now most of my attention goes to an AI-based CAD application that
        turns plain descriptions into real, editable models.
      </p>

      {/* Education */}
      <section className="mb-20">
        <BlueprintCard label="education">
          <p className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--teal)" }}>
            2023 — present
          </p>
          <h2 className="font-display italic text-2xl mb-1" style={{ color: "var(--ink)" }}>
            Master of Computer Applications
          </h2>
          <p style={{ color: "var(--ink-dim)" }}>RV Institute of Technology and Management (RVITM)</p>
        </BlueprintCard>
      </section>

      {/* Timeline */}
      <section className="mb-20">
       
        <div className="relative pl-8" style={{ borderLeft: "1px solid var(--line)" }}>
          {TIMELINE.map((item, i) => (
            <div key={i} className="relative pb-10 last:pb-0">
              <span
                className="absolute -left-[calc(2rem+4.5px)] top-1.5 w-2 h-2 rounded-full"
                style={{ background: "var(--gold)" }}
              />
              <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ fontFamily: "var(--font-mono)", color: "var(--gold)" }}>
                {item.year}
              </p>
              <h3 className="text-lg mb-1" style={{ color: "var(--ink)" }}>{item.title}</h3>
              <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--ink-dim)" }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
      
        <div className="grid sm:grid-cols-2 gap-6">
          {SKILLS.map((group) => (
            <div key={group.group} className="flex gap-4">
              <span className="text-[10px] shrink-0 w-10 pt-1" style={{ fontFamily: "var(--font-mono)", color: "var(--gold)" }}>
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
    </div>
  );
}
