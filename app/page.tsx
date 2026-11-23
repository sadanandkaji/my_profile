import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MousePointer2 } from "lucide-react";
import Selection from "@/components/Selection";
import EditorWindow from "@/components/EditorWindow";
import PaletteButton from "@/components/PaletteButton";
import AgentTrace from "@/components/AgentTrace";
import ViewSwitch, { PlainInvite } from "@/components/ViewSwitch";
import { PlainAbout, PlainAgents, PlainSkills } from "@/components/Plain";
import { SectionHead, STATUS_COLOR, shortHash } from "@/components/icons";
import { SOCIALS } from "@/lib/socials";
import { SKILLS } from "@/lib/skills";
import { PROJECTS } from "@/lib/projects";
import { STATS } from "@/lib/Stats";

const TOKENS = [
  { name: "bg", hex: "#09090B" },
  { name: "selection", hex: "#2F8CFF" },
  { name: "terminal", hex: "#5EE38B" },
  { name: "redline", hex: "#FF6B3D" },
];

export default function Home() {
  const featured = PROJECTS.find((p) => p.status === "In Progress") ?? PROJECTS[0];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 md:pt-36 pb-28">
      {/* ─────────────── Hero ─────────────── */}
      <section className="grid lg:grid-cols-[1fr_auto] gap-16 lg:gap-12 items-center mb-32" data-layer="Hero">
        <div>
          <p className="rise font-mono text-[12px] sm:text-[13px] mb-10" style={{ animationDelay: "60ms" }}>
            <ViewSwitch
              inline
              dev={
                <>
                  <span className="text-term">~/sadanand</span>
                  <span className="text-faint"> on </span>
                  <span style={{ color: "var(--syn-p)" }}>⎇ main</span>
                  <span className="text-faint"> $ </span>
                  <span className="text-ink">whoami</span>
                  <span className="caret ml-1" />
                </>
              }
              plain={<span className="font-sans text-[16px] text-dim">Hello, I&apos;m</span>}
            />
          </p>

          <div className="rise inline-block" style={{ animationDelay: "140ms" }}>
            <Selection label="h1 · Display/XL" inset={10}>
              <h1 className="text-[64px] sm:text-[96px] lg:text-[112px] font-semibold tracking-[-0.05em] leading-[0.9]">
                Sadanand
                <br />
                Kaji<span className="text-sel">.</span>
              </h1>
            </Selection>
          </div>

          <p className="rise mt-14 leading-[1.1] tracking-tight text-dim" style={{ animationDelay: "220ms" }}>
            <span className="font-serif italic text-ink text-[34px] sm:text-[46px]">AI Agent Engineer</span>
            <span className="text-sel text-[34px] sm:text-[46px]">.</span>
          </p>
          <ul
            className="rise mt-4 flex flex-wrap items-center gap-x-5 sm:gap-x-3 gap-y-1.5 text-[17px] sm:text-[20px] tracking-tight text-dim"
            style={{ animationDelay: "260ms" }}
            aria-label="Also"
          >
            {["Design Engineer", "System Architect", "Full-Stack Developer"].map((r, i) => (
              <li key={r} className="flex items-center gap-3">
                {i > 0 && <span className="hidden sm:block w-1 h-1 rounded-full bg-faint" aria-hidden="true" />}
                {r}
              </li>
            ))}
          </ul>

          <p
            className="rise mt-6 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-dim"
            style={{ animationDelay: "300ms" }}
          >
            <ViewSwitch
              inline
              dev={
                <>
                  I engineer AI agents that plan, call tools and check their own work — and I design the systems and
                  interfaces around them, with the same care for the pixel as for the pipeline. MCA at RVITM,
                  freelancer, and right now I&apos;m teaching a CAD tool to understand plain language.
                </>
              }
              plain={
                <>
                  I build AI assistants that can actually get work done for you — and I design and build the websites,
                  apps and systems around them, from how they look to how they work behind the scenes. I&apos;m
                  finishing my Master&apos;s in Computer Applications, I take on freelance projects, and right now
                  I&apos;m building an AI tool that turns a simple description into a 3D design for engineers.
                </>
              }
            />
          </p>

          <div className="rise flex flex-wrap items-center gap-3 mt-10" style={{ animationDelay: "380ms" }}>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-ink text-bg text-[14px] font-medium transition-transform hover:-translate-y-0.5"
            >
              View projects
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-line-2 text-[14px] text-ink hover:border-white/30 transition-colors"
            >
              Get in touch
            </Link>
            <PaletteButton />
          </div>
          <div className="rise mt-6" style={{ animationDelay: "440ms" }}>
            <PlainInvite />
          </div>
        </div>

        {/* Portrait as a canvas frame */}
        <div className="rise relative justify-self-center lg:justify-self-end" style={{ animationDelay: "260ms" }}>
          <div className="flex items-center justify-between font-mono text-[11px] text-dim mb-2">
            <span>◇ portrait.jpg</span>
            <span className="text-faint">3:4</span>
          </div>
          <Selection hoverOnly showSize label="Frame / Portrait" inset={6}>
            <div className="relative w-[260px] h-[346px] sm:w-[300px] sm:h-[400px] rounded-lg overflow-hidden border border-line-2 bg-panel">
              <Image
                src="/myimage2.jpg"
                alt="Portrait of Sadanand Kaji"
                fill
                sizes="300px"
                className="object-cover grayscale-[35%] contrast-[1.05] transition duration-500 group-hover/sel:grayscale-0"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute left-3 bottom-3 right-3 flex items-center justify-between font-mono text-[10px] text-white/80">
                <span>Sadanand Kaji</span>
                <span className="flex items-center gap-1.5 text-term">
                  <span className="live-dot w-1.5 h-1.5 rounded-full bg-term" /> online
                </span>
              </div>
            </div>
          </Selection>

          {/* comment pin */}
          <div className="absolute -left-10 sm:-left-16 top-24 hidden sm:flex items-start gap-2">
            <span className="grid place-items-center w-7 h-7 rounded-full rounded-bl-none bg-sel text-white text-[10px] font-mono font-semibold shadow-lg">
              SK
            </span>
            <span className="mt-1 px-2.5 py-1.5 rounded-md bg-panel-2 border border-line-2 text-[11px] text-ink shadow-xl max-w-[150px] leading-snug">
              shipping an AI CAD tool ✦
            </span>
          </div>

          {/* multiplayer cursor */}
          <div className="absolute -right-4 -bottom-8 flex items-start gap-1 animate-[bounce_3s_ease-in-out_infinite]">
            <MousePointer2 size={18} className="text-term fill-term -rotate-[8deg]" />
            <span className="mt-4 px-1.5 py-[2px] rounded-[4px] bg-term text-black font-mono text-[10px] font-medium">
              you
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────── Spec: code + properties ─────────────── */}
      <section className="mb-32" data-reveal>
        <SectionHead index="01" title="Spec sheet" note="same data, two views — the code and the panel" />
        <ViewSwitch
          dev={
            <>
              <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5">
                <EditorWindow title="sadanand.ts" right="TypeScript" bodyClassName="py-5">
                  <pre className="font-mono text-[12.5px] sm:text-[13px] leading-[1.75] overflow-x-auto">
                    <code>
                      {CODE.map((line, i) => (
                        <div key={i} className="flex hover:bg-white/[0.02]">
                          <span className="w-12 shrink-0 pr-4 text-right text-faint select-none">{i + 1}</span>
                          <span className="pr-5">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </EditorWindow>

                <div
                  className="rounded-xl border border-line-2 bg-panel/90 overflow-hidden font-mono text-[12px]"
                  data-layer="Panel / Properties"
                >
                  <div className="flex h-9 border-b border-line text-[11px]">
                    {["Design", "Inspect", "Code"].map((t) => (
                      <span
                        key={t}
                        className={`flex items-center px-4 ${t === "Inspect" ? "text-ink border-b border-sel" : "text-faint"}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <PanelGroup title="Identity">
                    <Row k="name" v="Sadanand Kaji" />
                    <Row k="role" v="AI Agent Engineer" />
                    <Row k="also" v="Design Engineer" />
                    <Row k="also" v="System Architect" />
                    <Row k="also" v="Full-Stack Developer" />
                  </PanelGroup>

                  <PanelGroup title="Facts">
                    {STATS.map((s) => (
                      <Row key={s.label} k={s.label.toLowerCase()} v={s.value} />
                    ))}
                  </PanelGroup>

                  <PanelGroup title="Tokens" last>
                    <div className="grid grid-cols-2 gap-2">
                      {TOKENS.map((t) => (
                        <div
                          key={t.name}
                          className="flex items-center gap-2 px-2 py-1.5 rounded border border-line bg-white/[0.015]"
                        >
                          <span
                            className="w-4 h-4 rounded-[3px] border border-white/15"
                            style={{ background: t.hex }}
                          />
                          <span className="text-dim truncate">{t.name}</span>
                          <span className="ml-auto text-faint text-[10px]">{t.hex}</span>
                        </div>
                      ))}
                    </div>
                  </PanelGroup>
                </div>
              </div>
            </>
          }
          plain={<PlainAbout />}
        />
      </section>

      {/* ─────────────── Currently building ─────────────── */}
      <section className="mb-32" data-reveal>
        <SectionHead index="02" title="Currently building" note={`${featured.year} · active`} />
        <EditorWindow
          title={`${featured.slug}/README.md`}
          dot={STATUS_COLOR[featured.status]}
          right={
            <span className="flex items-center gap-1.5 text-sel">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-sel" />
              {featured.status.toLowerCase()}
            </span>
          }
          bodyClassName="grid md:grid-cols-[1.4fr_1fr] gap-10 p-6 sm:p-8"
        >
          <div>
            <h3 className="text-[28px] sm:text-[34px] font-medium tracking-tight leading-tight">
              <span className="font-mono text-faint mr-2 text-[0.7em]">#</span>
              {featured.title}
            </h3>
            <p className="mt-4 text-[16px] leading-relaxed text-dim max-w-xl">{featured.summary}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {featured.stack.map((s) => (
                <span key={s} className="font-mono text-[11px] px-2 py-1 rounded border border-line-2 text-dim">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* pipeline */}
          <ViewSwitch
            dev={
              <>
                <div className="font-mono text-[11px]" data-layer="Diagram / Pipeline">
                  <p className="text-faint mb-3">{"// pipeline"}</p>
                  {[
                    { k: "input", v: "text prompt · sketch", c: "var(--syn-s)" },
                    { k: "understand", v: "intent → features", c: "var(--syn-p)" },
                    { k: "generate", v: "parametric model", c: "var(--syn-f)" },
                    { k: "output", v: "editable 3D", c: "var(--term)" },
                  ].map((step, i, arr) => (
                    <div key={step.k}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-line-2 bg-panel-2/60">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: step.c }} />
                        <span className="text-ink">{step.k}</span>
                        <span className="ml-auto text-dim">{step.v}</span>
                      </div>
                      {i < arr.length - 1 && <div className="ml-[17px] h-4 border-l border-dashed border-line-2" />}
                    </div>
                  ))}
                </div>
              </>
            }
            plain={
              <div className="rounded-lg border border-line-2 bg-panel-2/60 p-5">
                <p className="text-[12px] font-mono text-term mb-3">in simple terms</p>
                <p className="text-[15px] leading-relaxed text-ink">
                  Engineers spend hours drawing parts by hand in design software. With this tool you just describe the
                  part — or make a quick sketch — and it builds the 3D model for you. You can still change every
                  measurement afterwards.
                </p>
              </div>
            }
          />
        </EditorWindow>
      </section>

      {/* ─────────────── Agents ─────────────── */}
      <section className="mb-32" id="agents" data-reveal>
        <SectionHead index="03" title="Agents" note="plan → act → observe → verify" />
        <div className="grid lg:grid-cols-[1fr_2.2fr] gap-8 items-start">
          <div className="lg:sticky lg:top-32">
            <h3 className="text-[26px] sm:text-[30px] font-medium tracking-tight leading-tight">
              Software that <span className="font-serif italic font-normal">does</span> the work, not just answers.
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-dim">
              I build LLM agents the way I build any product: clear tools with tight contracts, a loop that plans and
              acts, and a verify step so the output can be trusted. This is an example run of the kind of loop behind
              the CAD tool.
            </p>
            <ul className="mt-6 space-y-2 font-mono text-[12px] text-dim">
              {[
                "tool / function calling",
                "multi-step planning",
                "self-checks & guardrails",
                "UI for agent output",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ background: "var(--syn-p)" }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <ViewSwitch dev={<AgentTrace />} plain={<PlainAgents />} />
        </div>
      </section>

      {/* ─────────────── Stack ─────────────── */}
      <section className="mb-32" data-reveal>
        <SectionHead index="04" title="Stack" note="components I reach for" />
        <ViewSwitch
          dev={
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                {SKILLS.map((group) => (
                  <div key={group.group}>
                    <p className="font-mono text-[11px] text-dim mb-2 flex items-center gap-1.5">
                      <span className="text-faint">#</span>
                      {group.group}
                      <span className="ml-auto text-faint">{group.ref}</span>
                    </p>
                    <Selection hoverOnly showSize={false} inset={4}>
                      <div className="sm:min-h-[124px] p-3 rounded-lg border border-line-2 bg-panel/70 flex flex-wrap content-start gap-2">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-line text-[13px] text-ink"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </Selection>
                  </div>
                ))}
              </div>
            </>
          }
          plain={<PlainSkills />}
        />
      </section>

      {/* ─────────────── Work log ─────────────── */}
      <section className="mb-32" data-reveal>
        <SectionHead index="05" title="Work log" note={`${PROJECTS.length} entries · newest first`} />
        <ul className="divide-y divide-[var(--line)] border-b border-line">
          {PROJECTS.map((p, i) => (
            <li key={p.slug} data-reveal style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
              <Link
                href="/projects"
                className="group grid grid-cols-[1fr_auto] sm:grid-cols-[80px_1fr_140px_60px_20px] items-center gap-4 sm:gap-6 py-5 px-2 -mx-2 rounded-md hover:bg-white/[0.025] transition-colors"
              >
                <span className="hidden sm:block font-mono text-[11px] text-faint">{shortHash(p.slug)}</span>
                <span className="min-w-0">
                  <span className="block text-[16px] sm:text-[17px] text-ink truncate">{p.title}</span>
                  <span className="block text-[13px] text-dim truncate mt-0.5">{p.summary}</span>
                </span>
                <span
                  className="hidden sm:flex items-center gap-2 font-mono text-[11px]"
                  style={{ color: STATUS_COLOR[p.status] }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLOR[p.status] }} />
                  {p.status.toLowerCase()}
                </span>
                <span className="hidden sm:block font-mono text-[11px] text-faint">{p.year}</span>
                <ArrowUpRight
                  size={16}
                  className="text-faint transition-all group-hover:text-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="grid lg:grid-cols-[1fr_1fr] gap-10 items-center" data-reveal>
        <div>
          <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.04em] leading-[0.95]">
            Have something
            <br />
            worth <span className="font-serif italic font-normal">building</span>?
          </h2>
          <p className="mt-5 text-dim text-[16px] max-w-md">
            Open to freelance work and interesting collaborations — from first sketch to production deploy.
          </p>
        </div>
        <ViewSwitch
          dev={
            <>
              <EditorWindow
                title="zsh — contact"
                dot="var(--term)"
                bodyClassName="p-5 font-mono text-[13px] leading-[1.9]"
              >
                <p>
                  <span className="text-term">❯</span> <span className="text-ink">echo</span>{" "}
                  <span className="tok-n">$STATUS</span>
                </p>
                <p className="text-dim pl-4">available for select freelance projects</p>
                <p className="mt-2">
                  <span className="text-term">❯</span> <span className="text-ink">open</span>{" "}
                  <span className="tok-s">--socials</span>
                </p>
                <div className="pl-4 flex flex-wrap gap-x-5 gap-y-1">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sel underline decoration-sel/30 underline-offset-4 hover:decoration-sel"
                    >
                      {s.label.toLowerCase()}
                    </a>
                  ))}
                </div>
                <p className="mt-2">
                  <span className="text-term">❯</span> <span className="caret" />
                </p>
              </EditorWindow>
            </>
          }
          plain={
            <div className="rounded-xl border border-line-2 bg-panel/90 p-6">
              <p className="text-[15px] text-ink">
                <span className="inline-block w-2 h-2 rounded-full bg-term mr-2" />
                I&apos;m available for freelance projects right now.
              </p>
              <p className="mt-2 text-[14px] text-dim">
                The quickest way to reach me is LinkedIn or X — I check both every day.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-line-2 text-[14px] text-ink hover:border-white/30 transition-colors"
                  >
                    {s.label} <ArrowUpRight size={13} className="text-dim" />
                  </a>
                ))}
              </div>
            </div>
          }
        />
      </section>
    </div>
  );
}

function PanelGroup({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`px-4 py-4 ${last ? "" : "border-b border-line"}`}>
      <p className="text-[10px] uppercase tracking-[0.14em] text-faint mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr] items-center gap-3">
      <span className="text-faint">{k}</span>
      <span className="px-2 py-1 rounded border border-line bg-white/[0.02] text-ink truncate">{v}</span>
    </div>
  );
}

const CODE: React.ReactNode[] = [
  <span key="c" className="tok-c">
    {"// the short version"}
  </span>,
  <>
    <span className="tok-k">export const</span> <span className="tok-f">sadanand</span> = {"{"}
  </>,
  <>
    {"  "}
    <span className="tok-p">role</span>: <span className="tok-s">&quot;AI Agent Engineer&quot;</span>,
  </>,
  <>
    {"  "}
    <span className="tok-p">also</span>: [<span className="tok-s">&quot;Design Engineer&quot;</span>,{" "}
    <span className="tok-s">&quot;System Architect&quot;</span>,
  </>,
  <>
    {"         "}
    <span className="tok-s">&quot;Full-Stack Developer&quot;</span>],
  </>,
  <>
    {"  "}
    <span className="tok-p">education</span>: <span className="tok-s">&quot;MCA · RVITM&quot;</span>,
  </>,
  <>
    {"  "}
    <span className="tok-p">stack</span>: [<span className="tok-s">&quot;Next.js&quot;</span>,{" "}
    <span className="tok-s">&quot;TypeScript&quot;</span>, <span className="tok-s">&quot;Go&quot;</span>,{" "}
    <span className="tok-s">&quot;Rust&quot;</span>],
  </>,
  <>
    {"  "}
    <span className="tok-p">clientsShipped</span>: <span className="tok-n">2</span>,
  </>,
  <>
    {"  "}
    <span className="tok-p">building</span>: <span className="tok-s">&quot;AI-based CAD&quot;</span>,
  </>,
  <>
    {"  "}
    <span className="tok-p">cares</span>: [<span className="tok-s">&quot;the pixel&quot;</span>,{" "}
    <span className="tok-s">&quot;the pipeline&quot;</span>],
  </>,
  <>
    {"  "}
    <span className="tok-p">openToWork</span>: <span className="tok-k">true</span>,
  </>,
  <>
    {"}"} <span className="tok-k">as const</span>;
  </>,
];
