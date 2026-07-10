import BlueprintCard from "@/components/BlueprintCard";
import { SOCIALS } from "@/lib/socials";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-36 pb-24">
     
      <h1 className="font-display italic text-4xl sm:text-6xl mb-6" style={{ color: "var(--ink)" }}>
        Let&apos;s talk <span className="text-sm align-super not-italic">✉️</span>
      </h1>
      <p className="text-lg leading-relaxed max-w-xl mb-16" style={{ color: "var(--ink-dim)" }}>
        Open to freelance work and interesting collaborations. The fastest
        way to reach me is LinkedIn or X — I check both daily.
      </p>

      <section className="mb-16">
        <BlueprintCard label="fig. a — availability">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--teal)" }} />
            <p style={{ color: "var(--ink)" }}>Currently available for select freelance projects</p>
          </div>
        </BlueprintCard>
      </section>

      <section>
      
        <div className="grid sm:grid-cols-2 gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between px-5 py-4 rounded-lg transition-colors hover:border-[var(--gold)]"
              style={{ border: "1px solid var(--line)", background: "rgba(255,255,255,0.02)" }}
            >
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--ink)" }}>{s.label}</p>
                <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}>
                  {s.handle}
                </p>
              </div>
              <span
                className="text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                style={{ color: "var(--gold)" }}
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
