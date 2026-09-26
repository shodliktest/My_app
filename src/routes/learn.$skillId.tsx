import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ExercisePlayer } from "@/components/exercise-player";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { exercisesFor, pickSession } from "@/lib/english/exercises";
import { xpFor } from "@/lib/english/grade";
import { skillById } from "@/lib/english/skills";
import { stopSpeaking, warmVoices } from "@/lib/english/speech";
import { useProgress } from "@/lib/english/store";
import type { ContentSkill, Exercise, SkillId } from "@/lib/english/types";

export const Route = createFileRoute("/learn/$skillId")({
  component: LearnPage,
});

function isSkillId(id: string): id is SkillId | "review" {
  return (
    id === "review" ||
    id === "vocab" ||
    id === "translate" ||
    id === "grammar" ||
    id === "writing" ||
    id === "listening" ||
    id === "mix"
  );
}

function LearnPage() {
  const { skillId } = Route.useParams();
  const level = useProgress((s) => s.level);
  const seenIds = useProgress((s) => s.seenIds);
  const weakIds = useProgress((s) => s.weakIds);
  const sound = useProgress((s) => s.sound);
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const finishSession = useProgress((s) => s.finishSession);

  const valid = isSkillId(skillId);
  const title =
    skillId === "review" ? "Zaif joylar" : (skillById(skillId)?.title ?? "Mashq");

  const [run, setRun] = useState(0);
  const frozenSeen = useRef(seenIds);
  const frozenWeak = useRef(weakIds);

  const session = useMemo(() => {
    if (!valid) return [] as Exercise[];
    const pool = exercisesFor(skillId, level, frozenWeak.current);
    return pickSession(
      pool,
      8,
      frozenSeen.current,
      `${skillId}-${run}-${frozenSeen.current.length}-${level}`,
    );
  }, [skillId, level, valid, run]);

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [earned, setEarned] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    warmVoices();
    return () => stopSpeaking();
  }, []);

  if (!valid) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-muted">Bunday mashq yo'q.</p>
        <Button asChild>
          <Link to="/">Bosh sahifa</Link>
        </Button>
      </main>
    );
  }

  if (session.length === 0) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pt-6">
        <Header title={title} />
        <p className="mt-10 text-muted">
          {skillId === "review"
            ? "Hozircha zaif mashqlar yo'q. Avval darsni yeching."
            : "Bu darajada mashq topilmadi."}
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Bosh sahifa</Link>
        </Button>
      </main>
    );
  }

  const current = session[index]!;
  const pct = Math.round((index / session.length) * 100);

  function onResolved(ok: boolean) {
    const xp = xpFor(ok, false);
    const skill: ContentSkill = current.skill;
    recordAnswer({ exerciseId: current.id, skill, correct: ok, xp });
    setEarned((n) => n + xp);
    if (ok) setCorrectCount((n) => n + 1);
    if (index + 1 >= session.length) {
      finishSession(skillId as SkillId | "review");
      setDone(true);
      stopSpeaking();
    } else {
      setIndex((i) => i + 1);
    }
  }

  function retry() {
    frozenSeen.current = useProgress.getState().seenIds;
    frozenWeak.current = useProgress.getState().weakIds;
    setDone(false);
    setIndex(0);
    setCorrectCount(0);
    setEarned(0);
    setRun((r) => r + 1);
  }

  if (done) {
    const acc = Math.round((correctCount / session.length) * 100);
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pt-6 pb-10">
        <Header title={title} />
        <div className="mt-10 flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="font-display mt-5 text-3xl font-medium tracking-tight">Yaxshi ish</h1>
          <p className="mt-2 text-muted">
            {correctCount}/{session.length} to'g'ri · {acc}% aniqlik
          </p>
          <p className="mt-1 text-sm tabular-nums text-primary">+{earned} XP</p>
          <div className="mt-8 flex w-full flex-col gap-2">
            <Button type="button" size="lg" onClick={retry}>
              Yana shu mashq
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/">Bosh sahifa</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pt-5 pb-8">
      <Header title={title} />
      <div className="mt-4 flex items-center gap-3">
        <Progress value={pct} className="flex-1" />
        <span className="text-xs tabular-nums text-muted">
          {index + 1}/{session.length}
        </span>
      </div>
      <div className="mt-6 flex-1">
        <ExercisePlayer
          key={current.id}
          exercise={current}
          sound={sound}
          onResolved={onResolved}
        />
      </div>
    </main>
  );
}

function Header({ title }: { title: string }) {
  return (
    <header className="flex items-center gap-2">
      <Link
        to="/"
        className="flex size-11 items-center justify-center rounded-lg text-fg hover:bg-surface-2"
        aria-label="Orqaga"
        onClick={() => stopSpeaking()}
      >
        <ArrowLeft className="size-5" />
      </Link>
      <h1 className="font-display text-lg font-medium tracking-tight">{title}</h1>
    </header>
  );
}
