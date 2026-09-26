import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EXERCISES } from "@/lib/english/exercises";
import { SKILLS } from "@/lib/english/skills";
import { useProgress } from "@/lib/english/store";
import type { ContentSkill } from "@/lib/english/types";

export const Route = createFileRoute("/progress")({ component: ProgressPage });

function ProgressPage() {
  const onboarded = useProgress((s) => s.onboarded);
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const level = useProgress((s) => s.level);
  const seenIds = useProgress((s) => s.seenIds);
  const weakIds = useProgress((s) => s.weakIds);
  const skillStats = useProgress((s) => s.skillStats);
  const dailyDone = useProgress((s) => s.dailyDone);
  const dailyGoal = useProgress((s) => s.dailyGoal);

  const totalPool = EXERCISES.filter((e) => {
    const rank = { A1: 1, A2: 2, B1: 3 };
    return rank[e.level] <= rank[level];
  }).length;

  const contentSkills = SKILLS.filter((s) => s.id !== "mix");

  return (
    <AppShell>
      <main className="px-5 pt-8 pb-6">
        <h1 className="font-display text-3xl font-medium tracking-tight">Natija</h1>
        <p className="mt-2 text-sm text-muted">
          {onboarded ? `Daraja ${level}` : "Avval darajani tanlang."}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs text-muted">Tajriba</p>
            <p className="mt-1 text-2xl font-medium tabular-nums">{xp}</p>
          </div>
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs text-muted">Seriya</p>
            <p className="mt-1 text-2xl font-medium tabular-nums">{streak} kun</p>
          </div>
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs text-muted">Yechilgan</p>
            <p className="mt-1 text-2xl font-medium tabular-nums">
              {seenIds.length}
              <span className="text-sm text-muted">/{totalPool}</span>
            </p>
          </div>
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs text-muted">Bugun</p>
            <p className="mt-1 text-2xl font-medium tabular-nums">
              {dailyDone}
              <span className="text-sm text-muted">/{dailyGoal}</span>
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-sm font-medium tracking-wide text-muted">Bo'limlar</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {contentSkills.map((s) => {
            const st = skillStats[s.id as ContentSkill];
            const pct = st.total === 0 ? 0 : Math.round((st.correct / st.total) * 100);
            return (
              <li key={s.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium">{s.title}</span>
                  <span className="text-xs tabular-nums text-muted">
                    {st.correct}/{st.total} · {pct}%
                  </span>
                </div>
                <Progress value={pct} className="mt-2" />
              </li>
            );
          })}
        </ul>

        {weakIds.length > 0 && (
          <div className="mt-6">
            <Button asChild size="lg" className="w-full">
              <Link to="/learn/$skillId" params={{ skillId: "review" }}>
                Zaif joylarni takrorlash ({weakIds.length})
              </Link>
            </Button>
          </div>
        )}
      </main>
    </AppShell>
  );
}
