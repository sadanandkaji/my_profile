"use client";

import { useEffect, useState } from "react";
import EditorWindow from "@/components/EditorWindow";

export type Line = { cmd: string; out: React.ReactNode };

// Types each command out character by character, then prints its output.
export default function Terminal({ lines, title = "zsh — ~/sadanand" }: { lines: Line[]; title?: string }) {
  const [step, setStep] = useState(0); // which command is being typed
  const [chars, setChars] = useState(0); // chars typed of current command

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(lines.length);
      return;
    }
  }, [lines.length]);

  useEffect(() => {
    if (step >= lines.length) return;
    const cmd = lines[step].cmd;
    const id = setTimeout(
      () => {
        if (chars < cmd.length) setChars((c) => c + 1);
        else {
          setStep((s) => s + 1);
          setChars(0);
        }
      },
      chars === 0 ? 380 : chars < cmd.length ? 38 + Math.random() * 40 : 260
    );
    return () => clearTimeout(id);
  }, [step, chars, lines]);

  return (
    <EditorWindow title={title} dot="var(--term)" bodyClassName="p-5 sm:p-6 font-mono text-[13px] leading-[1.85] min-h-[230px] md:min-h-[300px]">
      {lines.map((l, i) => {
        if (i > step) return null;
        const typing = i === step;
        return (
          <div key={i} className="mb-3 last:mb-0">
            <p>
              <span className="text-term">❯</span>{" "}
              <span className="text-ink">{typing ? l.cmd.slice(0, chars) : l.cmd}</span>
              {typing && <span className="caret ml-0.5" />}
            </p>
            {!typing && <div className="pl-4 text-dim">{l.out}</div>}
          </div>
        );
      })}
      {step >= lines.length && (
        <p>
          <span className="text-term">❯</span> <span className="caret" />
        </p>
      )}
    </EditorWindow>
  );
}
