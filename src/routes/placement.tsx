import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ExercisePlayer } from "@/components/exercise-player";
import { Button } from "@/components/ui/button";
import { PLACEMENT, placementLevel } from "@/content/placement";
import { LEVEL_META } from "@/lib/cefr";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/placement")({ component: Placement });

function Placement() {
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(0);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const setLevel = useAppStore((s) => s.setLevel);
  const recordSkill = useAppStore((s) => s.recordSkill);
  const navigate = useNavigate();
  const ex = PLACEMENT[i];
  const level = placementLevel(ok, Math.max(1, n));

  if (done) {
    return (
      <AppShell>
        <h1 className="font-display text-3xl font-semibold">Recommended start: {LEVEL_META[level].short}</h1>
        <p className="mt-2 text-muted">
          {ok}/{n} correct. {LEVEL_META[level].canDo}
        </p>
        <p className="mt-2">{LEVEL_META[level].canDoUz}</p>
        <Button
          className="mt-6"
          onClick={() => {
            setLevel(level);
            navigate({ to: "/" });
          }}
        >
          Start at {LEVEL_META[level].label}
        </Button>
      </AppShell>
    );
  }

  if (!ex) return null;

  return (
    <AppShell>
      <p className="text-xs uppercase tracking-[0.14em] text-subtle">Placement · {i + 1}/{PLACEMENT.length}</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Find your level</h1>
      <div className="mt-5">
        <ExercisePlayer
          key={ex.id}
          exercise={ex}
          showUz
          teacherMode={false}
          onResult={(correct) => {
            recordSkill(ex.skill, correct);
            setOk((v) => v + (correct ? 1 : 0));
            setN((v) => v + 1);
          }}
        />
        <Button
          className="mt-4"
          onClick={() => {
            if (i + 1 >= PLACEMENT.length) setDone(true);
            else setI(i + 1);
          }}
        >
          {i + 1 >= PLACEMENT.length ? "See result" : "Next"}
        </Button>
      </div>
    </AppShell>
  );
}
