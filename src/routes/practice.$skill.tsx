import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ExercisePlayer } from "@/components/exercise-player";
import { Button } from "@/components/ui/button";
import { LESSONS } from "@/content";
import { useAppStore, exerciseXp } from "@/lib/store";
import { showUzbek } from "@/lib/lang";
import type { Exercise, Skill } from "@/lib/types";
import { analyzeError } from "@/lib/error-intelligence";

export const Route = createFileRoute("/practice/$skill")({ component: SkillPractice });

function SkillPractice() {
  const { skill } = Route.useParams();
  const profile = useAppStore((s) => s.profile);
  const recordSkill = useAppStore((s) => s.recordSkill);
  const recordMistake = useAppStore((s) => s.recordMistake);
  const resolveMistakeCheck = useAppStore((s) => s.resolveMistakeCheck);
  const addXp = useAppStore((s) => s.addXp);
  const addMission = useAppStore((s) => s.addMission);
  const mistakes = useAppStore((s) => s.mistakes);
  const showUz = showUzbek(profile.level, profile.immersion, profile.englishOnly);

  const items = useMemo(() => {
    const skillKey = skill as Skill;
    const fromLessons: Exercise[] = LESSONS.filter((l) => l.level === profile.level || l.level === "pre-a1" || l.level === "a1")
      .flatMap((l) => [...l.exercises, ...l.test, ...l.listening.questions, ...l.reading.questions])
      .filter((e) => e.skill === skillKey || (skillKey === "grammar" && ["mcq", "gap", "order", "error"].includes(e.type)));
    const targeted = mistakes
      .filter((m) => m.skill === skillKey && m.status !== "resolved")
      .sort((a, b) => Number(b.count) - Number(a.count) || Number(a.nextReviewAt ?? 0) - Number(b.nextReviewAt ?? 0))
      .slice(0, 6)
      .map((m, i) => ({
        id: `err-${m.id}-${i}`,
        type: "error" as const,
        skill: m.skill,
        prompt: m.prompt,
        text: m.userAnswer,
        answer: m.correctAnswer,
        explanation: m.explanation,
        explanationUz: m.explanation,
      }));
    return [...targeted, ...fromLessons].slice(0, 16);
  }, [skill, profile.level, mistakes]);

  const [i, setI] = useState(0);
  const ex = items[i];

  return (
    <AppShell>
      <p className="text-xs uppercase tracking-[0.14em] text-subtle">Practice</p>
      <h1 className="font-display text-3xl font-semibold capitalize">{skill}</h1>
      {!ex ? (
        <p className="mt-4 text-muted">No items yet. Complete a lesson first.</p>
      ) : (
        <div className="mt-5">
          <p className="mb-3 text-sm text-subtle">{i + 1} / {items.length}</p>
          <ExercisePlayer
            key={ex.id}
            exercise={ex}
            showUz={showUz}
            teacherMode={profile.teacherMode}
            onResult={(ok, given) => {
              recordSkill(ex.skill, ok);
              addXp(ok ? exerciseXp(ex) : 2);
              addMission(ex.skill, ((i + 1) / items.length) * 100);
              const correctAnswer = Array.isArray(ex.answer) ? String(ex.answer[0]) : ex.answer;
              if (ok) {
                resolveMistakeCheck(ex.prompt, correctAnswer);
              } else {
                const analysis = analyzeError(ex, given);
                recordMistake({
                  type: ex.type,
                  skill: ex.skill,
                  prompt: ex.prompt,
                  userAnswer: given,
                  correctAnswer,
                  explanation: ex.explanation,
                  category: analysis.category,
                  concept: analysis.concept,
                  grammarTarget: analysis.grammarTarget,
                  remediation: { microLesson: analysis.microLesson, steps: analysis.steps, contrast: analysis.contrast },
                  status: "active",
                  successfulRechecks: 0,
                  nextReviewAt: Date.now(),
                });
              }
            }}
          />
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => setI((n) => Math.min(items.length - 1, n + 1))}
              disabled={i >= items.length - 1}
            >
              Next
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/practice">All skills</Link>
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
