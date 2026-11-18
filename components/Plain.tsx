// Plain-English versions of the technical sections, for visitors who
// aren't developers. Shown when the "plain" view is switched on.

const FACTS = [
  { k: "What I do", v: "Build AI assistants that get real work done — and design the apps and systems around them." },
  { k: "Studying", v: "Master of Computer Applications at RV Institute of Technology and Management." },
  { k: "Client work", v: "Two projects delivered for real businesses — a real-estate company and a solar company." },
  { k: "Competitions", v: "Several wins at hackathons — events where teams build a working product in a day or two." },
  { k: "Right now", v: "Building an AI tool that turns plain descriptions into 3D designs for engineers." },
];

export function PlainAbout() {
  return (
    <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5">
      <div className="rounded-xl border border-line-2 bg-panel/90 p-6 sm:p-8">
        <p className="font-mono text-[12px] text-term mb-4">in plain English</p>
        <p className="text-[20px] sm:text-[22px] leading-snug tracking-tight text-ink">
          I&apos;m the person who can take an idea from a rough sketch to a finished, working product — and make
          sure it looks good and feels easy to use along the way.
        </p>
        <p className="mt-5 text-[15px] leading-relaxed text-dim">
          My titles — AI agent engineer, design engineer, system architect and full-stack developer — just mean I
          build AI assistants that carry out tasks on their own (not just chat), design how things look and work,
          plan how all the pieces of a system fit together, and build both the parts you see and the machinery
          behind them.
        </p>
      </div>
      <dl className="rounded-xl border border-line-2 bg-panel/90 divide-y divide-[var(--line)]">
        {FACTS.map((f) => (
          <div key={f.k} className="px-5 py-3.5">
            <dt className="text-[12px] text-faint">{f.k}</dt>
            <dd className="mt-0.5 text-[14px] leading-relaxed text-ink">{f.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const AGENT_STEPS = [
  { n: "1", t: "Understands", d: "You ask for something in everyday words — no forms, no settings." },
  { n: "2", t: "Does the work", d: "It makes a plan and uses the right tools, step by step, like a careful assistant." },
  { n: "3", t: "Checks itself", d: "Before handing anything back, it double-checks the result actually works." },
];

export function PlainAgents() {
  return (
    <div className="rounded-xl border border-line-2 bg-panel/90 p-6 sm:p-8">
      <p className="font-mono text-[12px] text-term mb-4">what is an AI agent?</p>
      <p className="text-[18px] sm:text-[20px] leading-snug tracking-tight text-ink max-w-2xl">
        Most AI chatbots only answer questions. An AI agent goes a step further — it actually carries out the task
        for you.
      </p>
      <div className="mt-7 grid sm:grid-cols-3 gap-4">
        {AGENT_STEPS.map((s) => (
          <div key={s.n} className="rounded-lg border border-line bg-panel-2/60 p-4">
            <span className="grid place-items-center w-7 h-7 rounded-full bg-sel/15 text-sel text-[13px] font-medium">
              {s.n}
            </span>
            <p className="mt-3 text-[15px] text-ink">{s.t}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-dim">{s.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-7 text-[15px] leading-relaxed text-dim">
        <span className="text-ink">Example:</span>{" "}you type &ldquo;make a 40 mm bracket with two screw holes&rdquo;.
        The agent works out the measurements, draws the shape, adds the holes and checks everything fits — then
        hands you a 3D model you can still adjust.
      </p>
    </div>
  );
}

const SKILLS_PLAIN = [
  { t: "AI that gets things done", d: "Assistants that can plan, use tools and finish tasks on their own." },
  { t: "Planning the big picture", d: "Deciding how all the parts of a system connect so it stays fast and reliable." },
  { t: "What you see and click", d: "Websites and app screens that look good and are easy to use." },
  { t: "What runs behind the scenes", d: "The servers, logic and data that make an app actually work." },
  { t: "Keeping data organised", d: "Databases that store your information safely and find it fast." },
];

export function PlainSkills() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SKILLS_PLAIN.map((s) => (
        <div key={s.t} className="rounded-xl border border-line-2 bg-panel/80 p-5">
          <p className="text-[16px] text-ink">{s.t}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-dim">{s.d}</p>
        </div>
      ))}
    </div>
  );
}
