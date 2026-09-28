import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LEVEL_META, LEVEL_ORDER } from "@/lib/cefr";
import { useAppStore } from "@/lib/store";
import type { DailyGoal, LevelId } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const navigate = useNavigate();
  const complete = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<LevelId>("pre-a1");
  const [goal, setGoal] = useState<DailyGoal>("normal");

  function finish(placement: boolean) {
    complete({ name: name.trim() || "Learner", level, dailyGoal: goal, placementDone: !placement });
    navigate({ to: placement ? "/placement" : "/" });
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-10">
      <LogoMark className="size-14" />
      {step === 0 ? (
        <>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">Shodlik Education</h1>
          <p className="mt-3 text-lg text-muted">
            0 dan C1 gacha ingliz tili. Grammar, vocabulary, listening, reading, speaking va writing — bitta mavzu atrofida.
          </p>
          <Button className="mt-8" size="lg" onClick={() => setStep(1)}>Begin</Button>
        </>
      ) : null}
      {step === 1 ? (
        <>
          <h1 className="mt-6 font-display text-3xl font-semibold">What should we call you?</h1>
          <Input className="mt-4" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          <Button className="mt-6" onClick={() => setStep(2)} disabled={!name.trim()}>Continue</Button>
        </>
      ) : null}
      {step === 2 ? (
        <>
          <h1 className="mt-6 font-display text-3xl font-semibold">Daily study length</h1>
          <div className="mt-4 grid gap-2">
            {([
              ["quick", "Quick day", "About 30 minutes"],
              ["normal", "Normal day", "About 60 minutes"],
              ["full", "Full day", "About 120 minutes"],
            ] as const).map(([id, t, d]) => (
              <button
                key={id}
                type="button"
                onClick={() => setGoal(id)}
                className={cn(
                  "rounded-xl px-4 py-3 text-left shadow-[var(--shadow-border)]",
                  goal === id ? "bg-primary text-primary-fg" : "bg-bg-elevated",
                )}
              >
                <p className="font-medium">{t}</p>
                <p className={cn("text-sm", goal === id ? "text-primary-fg/80" : "text-muted")}>{d}</p>
              </button>
            ))}
          </div>
          <Button className="mt-6" onClick={() => setStep(3)}>Continue</Button>
        </>
      ) : null}
      {step === 3 ? (
        <>
          <h1 className="mt-6 font-display text-3xl font-semibold">Starting point</h1>
          <p className="mt-2 text-muted">Take a short placement test, or pick a CEFR level.</p>
          <Button className="mt-6" size="lg" onClick={() => finish(true)}>Placement test</Button>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {LEVEL_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setLevel(id)}
                className={cn(
                  "rounded-lg px-3 py-3 text-left text-sm shadow-[var(--shadow-border)]",
                  level === id ? "bg-primary text-primary-fg" : "bg-bg-elevated",
                )}
              >
                <p className="font-medium">{LEVEL_META[id].short}</p>
                <p className={cn("text-xs", level === id ? "text-primary-fg/75" : "text-muted")}>{LEVEL_META[id].uz}</p>
              </button>
            ))}
          </div>
          <Button className="mt-4" variant="secondary" onClick={() => finish(false)}>Start at {LEVEL_META[level].short}</Button>
        </>
      ) : null}
    </div>
  );
}
