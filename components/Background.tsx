// Design-canvas backdrop: a faint dot grid plus two soft light pools —
// one in selection blue, one in terminal green — the two halves of the job.
export default function Background() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 canvas-dots" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-[70%] w-[46rem] h-[30rem] rounded-full blur-[120px] opacity-[0.13]"
        style={{ background: "var(--sel)" }}
      />
      <div
        className="absolute top-[30rem] right-[-10rem] w-[30rem] h-[24rem] rounded-full blur-[130px] opacity-[0.06]"
        style={{ background: "var(--term)" }}
      />
    </div>
  );
}
