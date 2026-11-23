import EditorWindow from "@/components/EditorWindow";
import Selection from "@/components/Selection";
import { SectionHead, shortHash } from "@/components/icons";
import { TIMELINE } from "@/lib/timeline";
import { SKILLS } from "@/lib/skills";
import ViewSwitch from "@/components/ViewSwitch";
import { PlainSkills } from "@/components/Plain";

const PRINCIPLES = [
  {
    k: "01",
    title: "Design is a spec, not a picture",
    body: "Spacing, type and states get decided up front, so the code has something real to match.",
  },
  {
    k: "02",
    title: "Own it end to end",
    body: "From schema and API to the last hover state — fewer hand-offs, fewer things lost in them.",
  },
  {
    k: "03",
    title: "Agents need contracts",
    body: "An agent is only as good as its tools — typed inputs, clear outputs, and a check before anything ships.",
  },
  {
    k: "04",
    title: "Ship, then sharpen",
    body: "Hackathons taught me to get a working version out fast, and client work taught me to polish it.",
  },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 md:pt-36 pb-28">
      {/* Header */}
      <header className="mb-24">
        <p className="font-mono text-[12px] text-faint mb-10">
          <span className="text-term">❯</span> cat about.md
        </p>
        <div className="inline-block">
          <Selection label="h1 · Display/L" inset={8}>
            <h1 className="text-[48px] sm:text-[72px] font-semibold tracking-[-0.045em] leading-[0.95]">
              A bit <span className="font-serif italic font-normal">about</span> me
            </h1>
          </Selection>
        </div>
        <div className="mt-14 grid md:grid-cols-2 gap-8 text-[17px] leading-relaxed text-dim">
          <p>
            I&apos;m <span className="text-ink">Sadanand</span> — an <span className="text-ink">AI Agent Engineer</span>{" "}
            first, and a design engineer, system architect and full-stack developer around it. I&apos;m completing my
            MCA at RVITM. I like building things end to end — from the schema to the interface — and I sweat the details
            in both.
          </p>
          <p>
            Two client projects delivered, a handful of hackathon wins, and right now most of my attention goes to an{" "}
            <span className="text-ink">AI-based CAD application</span> that turns plain descriptions into real, editable
            models.
          </p>
        </div>
      </header>

      {/* Principles */}
      <section className="mb-28" data-reveal>
        <SectionHead index="01" title="How I work" note="principles.md" />
        <div className="grid sm:grid-cols-2 gap-5">
          {PRINCIPLES.map((p) => (
            <Selection key={p.k} hoverOnly showSize={false} inset={5}>
              <div className="h-full p-5 rounded-xl border border-line-2 bg-panel/80">
                <p className="font-mono text-[11px] text-sel mb-6">{p.k}</p>
                <h3 className="text-[18px] font-medium tracking-tight mb-2">{p.title}</h3>
                <p className="text-[14px] leading-relaxed text-dim">{p.body}</p>
              </div>
            </Selection>
          ))}
        </div>
      </section>

      {/* Git log */}
      <section className="mb-28" data-reveal>
        <SectionHead index="02" title="git log" note="--graph --oneline" />
        <ViewSwitch
          dev={
            <>
              <EditorWindow title="history" dot="var(--syn-n)" right="main" bodyClassName="p-5 sm:p-7">
                <ol className="relative font-mono">
                  {TIMELINE.map((item, i) => (
                    <li key={i} className="relative grid grid-cols-[28px_1fr] gap-4 pb-9 last:pb-0">
                      {/* graph rail */}
                      {i < TIMELINE.length - 1 && (
                        <span className="absolute left-[13px] top-5 bottom-0 w-px bg-line-2" aria-hidden="true" />
                      )}
                      <span
                        className={`relative mt-1.5 w-[11px] h-[11px] ml-2 rounded-full border-2 ${
                          i === 0 ? "border-sel bg-sel/30" : "bg-bg"
                        }`}
                        style={i === 0 ? undefined : { borderColor: "var(--syn-n)" }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-[12px] flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span style={{ color: "var(--syn-n)" }}>{shortHash(item.title)}</span>
                          {i === 0 && (
                            <span className="px-1.5 rounded border border-sel/40 text-sel text-[10px]">
                              HEAD → main
                            </span>
                          )}
                          <span className="text-faint">{item.year}</span>
                        </p>
                        <h3 className="mt-1.5 font-sans text-[17px] sm:text-[18px] text-ink first-letter:uppercase">
                          {item.title}
                        </h3>
                        <p className="mt-1 font-sans text-[14px] leading-relaxed text-dim max-w-xl">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </EditorWindow>
            </>
          }
          plain={
            <ol className="rounded-xl border border-line-2 bg-panel/80 divide-y divide-[var(--line)]">
              {TIMELINE.map((item, i) => (
                <li key={i} className="grid sm:grid-cols-[140px_1fr] gap-1 sm:gap-6 px-6 py-5">
                  <p className="text-[13px] text-faint capitalize">{item.year.replace("-", " · ")}</p>
                  <div>
                    <h3 className="text-[17px] text-ink first-letter:uppercase">{item.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-dim">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          }
        />
      </section>

      {/* Education */}
      <section className="mb-28" data-reveal>
        <SectionHead index="03" title="Education" />
        <div className="grid sm:grid-cols-[1fr_auto] items-end gap-6 p-6 rounded-xl border border-line-2 bg-panel/80">
          <div>
            <p className="font-mono text-[11px] text-term mb-3">● in progress</p>
            <h3 className="text-[24px] sm:text-[28px] font-medium tracking-tight">Master of Computer Applications</h3>
            <p className="mt-1 text-dim">RV Institute of Technology and Management (RVITM)</p>
          </div>
          <p className="font-mono text-[12px] text-faint">2023 → present</p>
        </div>
      </section>

      {/* Skills as dependencies */}
      <section data-reveal>
        <SectionHead index="04" title="Dependencies" note="package.json" />
        <ViewSwitch
          dev={
            <>
              <EditorWindow title="package.json" dot="var(--syn-n)" bodyClassName="py-5">
                <pre className="font-mono text-[13px] leading-[1.8] overflow-x-auto px-6">
                  <code>
                    {"{\n"}
                    {SKILLS.map((g, gi) => (
                      <span key={g.group}>
                        {"  "}
                        <span className="tok-p">&quot;{g.group.toLowerCase()}&quot;</span>: [
                        {g.items.map((it, ii) => (
                          <span key={it}>
                            <span className="tok-s">&quot;{it}&quot;</span>
                            {ii < g.items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                        ]{gi < SKILLS.length - 1 ? "," : ""}
                        {"\n"}
                      </span>
                    ))}
                    {"}"}
                  </code>
                </pre>
              </EditorWindow>
            </>
          }
          plain={<PlainSkills />}
        />
      </section>
    </div>
  );
}
