import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LESSONS, lessonsForLevel } from "@/content";
import { LEVEL_META, LEVEL_ORDER } from "@/lib/cefr";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { masteryFromProgress } from "@/lib/mastery";
import { nextAdaptiveRecommendation } from "@/lib/adaptive";
import type { LevelId } from "@/lib/types";

export const Route = createFileRoute("/learn")({ component: Learn });

function Learn() {
  const progress = useAppStore((s) => s.lessonProgress);
  const profile = useAppStore((s) => s.profile);
  const skills = useAppStore((s) => s.skills);

  return (
    <AppShell title="Learn">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Course map</h1>
      <p className="mt-2 text-muted">
        {LESSONS.length} written days from Pre-A1 to C1. One topic drives grammar, vocabulary, listening, reading, speaking and writing.
      </p>
      {(() => {
        const next = nextAdaptiveRecommendation(LESSONS, progress, skills, profile.level);
        if (!next) return null;
        return (
          <section className="mt-6 rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-border)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Adaptive next</p>
                <h2 className="mt-1 font-display text-xl font-semibold">{next.lesson.topic}</h2>
                <p className="mt-1 text-sm text-muted">{next.reason}</p>
              </div>
              <Button asChild><Link to="/learn/$lessonId" params={{ lessonId: next.lesson.id }}>Start next</Link></Button>
            </div>
          </section>
        );
      })()}
      <div className="mt-8 space-y-8">
        {LEVEL_ORDER.map((level) => (
          <LevelBlock key={level} level={level} current={profile.level} progress={progress} />
        ))}
      </div>
    </AppShell>
  );
}

function LevelBlock({
  level, current, progress,
}: {
  level: LevelId;
  current: LevelId;
  progress: ReturnType<typeof useAppStore.getState>["lessonProgress"];
}) {
  const list = lessonsForLevel(level);
  if (!list.length) {
    return (
      <section>
        <header className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">{LEVEL_META[level].label}</h2>
            <p className="text-sm text-muted">{LEVEL_META[level].canDoUz}</p>
          </div>
          <Badge variant="outline">Coming in this build</Badge>
        </header>
      </section>
    );
  }
  const done = list.filter((l) => progress[l.id]?.completed).length;
  const pct = Math.round((done / list.length) * 100);
  return (
    <section>
      <header className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">{LEVEL_META[level].label}</h2>
          <p className="text-sm text-muted">{LEVEL_META[level].canDo}</p>
        </div>
        <Badge variant={level === current ? "default" : "soft"}>{done}/{list.length}</Badge>
      </header>
      <Progress value={pct} className="mb-3" />
      <ol className="grid gap-2 sm:grid-cols-2">
        {list.map((lesson) => {
          const st = progress[lesson.id];
          return (
            <li key={lesson.id}>
              <Link
                to="/learn/$lessonId"
                params={{ lessonId: lesson.id }}
                className={cn(
                  "group flex min-h-16 items-center justify-between rounded-lg px-4 py-3 shadow-[var(--shadow-border)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)] active:translate-y-0",
                  st?.completed ? "bg-primary-soft" : "bg-bg-elevated",
                )}
              >
                <span>
                  <span className="block text-xs text-subtle">Day {lesson.day}{lesson.isReview ? " · Review" : ""}</span>
                  <span className="font-medium">{lesson.topic}</span>
                  <span className="block text-sm text-muted">{lesson.grammar.title}</span>
                </span>
                <span className="flex items-center gap-2">
                  {masteryFromProgress(st).status === "mastered" ? <Badge variant="soft">Mastered</Badge> : null}
                  {masteryFromProgress(st).status === "review" ? <Badge variant="outline">Review needed</Badge> : null}
                  <span className="rounded-full px-3 py-1 text-xs font-medium tabular-nums text-primary group-hover:bg-primary group-hover:text-primary-fg">{st?.completed ? "Review" : "Open"}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
