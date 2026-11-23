import { ArrowUpRight } from "lucide-react";
import Selection from "@/components/Selection";
import Terminal from "@/components/Terminal";
import { SectionHead } from "@/components/icons";
import { SOCIALS } from "@/lib/socials";
import ViewSwitch from "@/components/ViewSwitch";

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 md:pt-36 pb-28">
      <header className="mb-20">
        <p className="font-mono text-[12px] text-faint mb-10">
          <span className="text-term">❯</span> ./contact.sh
        </p>
        <div className="inline-block">
          <Selection label="h1 · Display/L" inset={8}>
            <h1 className="text-[48px] sm:text-[72px] font-semibold tracking-[-0.045em] leading-[0.95]">
              Let&apos;s <span className="font-serif italic font-normal">talk</span>
            </h1>
          </Selection>
        </div>
        <p className="mt-12 text-[17px] leading-relaxed text-dim max-w-xl">
          Open to freelance work and interesting collaborations. The fastest way to reach me is LinkedIn or X — I check
          both daily.
        </p>
      </header>

      <section className="mb-24" data-reveal>
        <ViewSwitch
          dev={
            <>
              <Terminal
                lines={[
                  {
                    cmd: "whoami",
                    out: "sadanand kaji — AI agent engineer · design engineer · system architect · full-stack developer",
                  },
                  {
                    cmd: "cat status.txt",
                    out: (
                      <span className="flex items-center gap-2 text-term">
                        <span className="live-dot w-1.5 h-1.5 rounded-full bg-term" />
                        available for select freelance projects
                      </span>
                    ),
                  },
                  {
                    cmd: "ls ./socials",
                    out: (
                      <span className="flex flex-wrap gap-x-6">
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
                      </span>
                    ),
                  },
                ]}
              />
            </>
          }
          plain={
            <div className="rounded-xl border border-line-2 bg-panel/90 p-6 sm:p-8">
              <p className="flex items-center gap-2 text-[18px] text-ink">
                <span className="w-2 h-2 rounded-full bg-term" /> I&apos;m available for freelance projects.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-dim max-w-xl">
                Have an idea for a website, an app or an AI assistant for your business? Send me a message on LinkedIn
                or X with a few lines about what you need — I&apos;ll get back to you quickly.
              </p>
            </div>
          }
        />
      </section>

      <section data-reveal>
        <SectionHead index="01" title="Elsewhere" note="opens in a new tab" />
        <div className="grid sm:grid-cols-2 gap-5">
          {SOCIALS.map((s) => (
            <Selection key={s.label} hoverOnly showSize={false} inset={5}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-5 py-5 rounded-xl border border-line-2 bg-panel/80"
              >
                <div>
                  <p className="text-[17px] text-ink">{s.label}</p>
                  <p className="mt-1 font-mono text-[12px] text-dim">@{s.handle}</p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-faint transition-all group-hover:text-sel group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Selection>
          ))}
        </div>
      </section>
    </div>
  );
}
