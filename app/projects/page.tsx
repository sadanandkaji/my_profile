import Selection from "@/components/Selection";
import ProjectsBoard from "@/components/ProjectsBoard";
import { PROJECTS } from "@/lib/projects";

export default function Projects() {
  const shipped = PROJECTS.filter((p) => p.status !== "In Progress").length;
  const active = PROJECTS.length - shipped;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 md:pt-36 pb-28">
      <header className="mb-16">
        <p className="font-mono text-[12px] text-faint mb-10">
          <span className="text-term">❯</span> ls -la ./projects
        </p>
        <div className="inline-block">
          <Selection label="h1 · Display/L" inset={8}>
            <h1 className="text-[48px] sm:text-[72px] font-semibold tracking-[-0.045em] leading-[0.95]">
              Things I&apos;ve <span className="font-serif italic font-normal">built</span>
            </h1>
          </Selection>
        </div>
        <p className="mt-12 text-[17px] leading-relaxed text-dim max-w-2xl">
          A running log of personal builds, hackathon projects and freelance client work — designed and
          engineered end to end. <span className="font-mono text-[13px] text-faint">{shipped} shipped · {active} in progress</span>
        </p>
      </header>

      <ProjectsBoard projects={PROJECTS} />
    </div>
  );
}
