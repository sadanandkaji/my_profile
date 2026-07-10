const BASE = "#15100A";

// Signature backdrop: two "archive plates" — a soft photograph of the coil
// rig and its halftone-printed twin — sit behind every page like specimen
// plates in an old instrument catalog. Both are blurred and pushed low in
// opacity/contrast so body copy always wins the read.
export default function Background() {
  return (
    <>
      {/* base wash */}
      <div className="fixed inset-0 pointer-events-none -z-30" style={{ background: BASE }} />

      {/* primary plate — the photograph, visible through a light blur, sepia and pushed contrast */}
      <div
        className="fixed inset-0 pointer-events-none -z-20 plate"
        style={{
          backgroundImage: "url(/textures/plate-photograph.png)",
          backgroundSize: "cover",
          backgroundPosition: "center 26%",
          opacity: 0.42,
          filter: "sepia(0.65) contrast(1.15) brightness(0.5) saturate(0.8) blur(3px)",
          transform: "scale(1.08)",
        }}
      />

      {/* darken pass over the plate so body copy still wins the read at this higher opacity */}
      <div
        className="fixed inset-0 pointer-events-none -z-20"
        style={{ background: "linear-gradient(180deg, rgba(21,16,10,0.55) 0%, rgba(21,16,10,0.72) 45%, rgba(21,16,10,0.88) 100%)" }}
      />

      {/* secondary plate — the halftone print, a rotated proof sheet. Smaller + lower on mobile, larger top-right on desktop */}
      <div
        className="fixed pointer-events-none -z-20"
        style={{
          top: "auto",
          bottom: "-10%",
          right: "-18%",
          width: "72vw",
          maxWidth: 320,
          aspectRatio: "0.55",
          backgroundImage: "url(/textures/plate-halftone.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.14,
          mixBlendMode: "screen",
          filter: "sepia(0.3) contrast(1.15) blur(0.5px)",
          transform: "rotate(6deg)",
        }}
      />
      <div
        className="fixed pointer-events-none -z-20 hidden sm:block"
        style={{
          top: "-6%",
          right: "-8%",
          width: "46vw",
          maxWidth: 560,
          aspectRatio: "0.55",
          backgroundImage: "url(/textures/plate-halftone.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.11,
          mixBlendMode: "screen",
          filter: "sepia(0.3) contrast(1.15) blur(0.5px)",
          transform: "rotate(-4deg)",
        }}
      />

      {/* foxing — the brownish age-spots that bloom on old paper stock */}
      <div className="fixed inset-0 pointer-events-none -z-10 foxing" />

      {/* halftone dot screen over everything, like re-scanning a printed page */}
      <div className="fixed inset-0 pointer-events-none -z-10 halftone" style={{ opacity: 0.07, mixBlendMode: "overlay" }} />

      {/* film grain */}
      <div className="fixed inset-0 pointer-events-none -z-10 grain" style={{ opacity: 0.07 }} />

      {/* blueprint grid, kept faint — the CAD-tool thread still runs underneath */}
      

      {/* top glow */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,179,77,0.09), transparent 60%)",
        }}
      />

      {/* vignette — presses the eye back to the center column */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 100% 70% at 50% 30%, transparent 30%, var(--vignette) 100%)",
        }}
      />

      {/* deckled edge — a rough, uneven border framing the whole viewport like a torn sheet */}
      <div className="fixed inset-0 pointer-events-none z-40 deckle-frame" />
    </>
  );
}