import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore, skillPct } from "@/lib/store";
import { SKILLS } from "@/lib/types";
import { LEVEL_META, LEVEL_ORDER } from "@/lib/cefr";
import { LESSONS, lessonsForLevel, WORDS } from "@/content";
import { ACHIEVEMENTS } from "@/content/achievements";
import { masteryFromProgress, recommendedLevel, weightedSkillScore } from "@/lib/mastery";
import { adaptiveStage, nextAdaptiveRecommendation } from "@/lib/adaptive";

export const Route = createFileRoute("/progress")({ component: ProgressPage });

function ProgressPage() {
  const profile = useAppStore((s) => s.profile);
  const skills = useAppStore((s) => s.skills);
  const cards = useAppStore((s) => s.cards);
  const progress = useAppStore((s) => s.lessonProgress);
  const recognized = Object.keys(cards).length;
  const recalled = Object.values(cards).filter((c) => c.correct >= 1).length;
  const active = Object.values(cards).filter((c) => c.contexts.sentence || c.contexts.speaking).length;
  const mastered = Object.values(cards).filter((c) => c.state === "mastered").length;
  const recommendation = nextAdaptiveRecommendation(LESSONS, progress, skills, profile.level);
  const stage = adaptiveStage(profile.level, progress, LESSONS);

  return (
    <AppShell title="Progress">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Your CEFR map</h1>
      <p className="mt-2 text-muted">Not one fake score — six skills, plus how well you can actually use words.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat label="Recognized" n={recognized} />
        <Stat label="Recalled" n={recalled} />
        <Stat label="Used actively" n={active} />
        <Stat label="Mastered" n={mastered} />
      </div>
      <section className="mt-8">
        {LEVEL_ORDER.map((id) => {
          const list = lessonsForLevel(id);
          const done = list.filter((l) => progress[l.id]?.completed).length;
          const pct = list.length ? Math.round((done / list.length) * 100) : 0;
          return (
            <div key={id} className="mb-3 flex items-center gap-3">
              <span className="w-16 text-sm font-medium">{LEVEL_META[id].short}</span>
              <Progress value={pct} className="flex-1" />
              <span className="w-16 text-right text-sm tabular-nums text-muted">{pct}%</span>
            </div>
          );
        })}
      </section>
      <section className="mt-8 rounded-xl border border-primary/20 bg-primary-soft/40 p-5 shadow-[var(--shadow-border)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Adaptive coach · {stage}</p>
            <h2 className="mt-1 font-display text-xl font-semibold">Next best study action</h2>
            <p className="mt-1 text-sm text-muted">The engine combines review due dates, lesson mastery, skill weaknesses and CEFR sequence.</p>
          </div>
          {recommendation?.targetSkill ? <Badge variant="soft">Focus · {recommendation.targetSkill}</Badge> : null}
        </div>
        {recommendation ? (
          <div className="mt-4 flex flex-col gap-4 rounded-lg bg-bg-elevated p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-subtle">{recommendation.action.toUpperCase()}</p>
              <p className="mt-1 font-display text-lg font-semibold">{recommendation.lesson.topic}</p>
              <p className="text-sm text-muted">{recommendation.reason}</p>
              <p className="mt-1 text-sm text-muted">{recommendation.reasonUz}</p>
            </div>
            <Button asChild>
              <Link to="/learn/$lessonId" params={{ lessonId: recommendation.lesson.id }}>Start</Link>
            </Button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">No eligible lesson yet. Complete the placement or current prerequisite lesson first.</p>
        )}
      </section>
      <section className="mt-8 rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-border)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Mastery engine</p>
            <h2 className="mt-1 font-display text-xl font-semibold">What to work on next</h2>
            <p className="mt-1 text-sm text-muted">Recommendations use your assessed skills and completed lesson evidence, not a single overall score.</p>
          </div>
          <Badge variant="soft">Weighted skill score · {weightedSkillScore(skills)}%</Badge>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-subtle">Current level</p>
            <p className="mt-1 font-display text-2xl font-semibold">{LEVEL_META[profile.level].short}</p>
            <p className="mt-1 text-sm text-muted">Recommended study level: {LEVEL_META[recommendedLevel(profile.level, LESSONS, progress, skills)].short}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-subtle">Lesson mastery</p>
            <p className="mt-1 text-sm text-muted">{Object.values(progress).filter((p) => masteryFromProgress(p).status === "mastered").length} mastered · {Object.values(progress).filter((p) => masteryFromProgress(p).status === "review").length} need review</p>
          </div>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Skills</h2>
        <ul className="mt-3 space-y-2">
          {SKILLS.map((s) => (
            <li key={s} className="flex items-center gap-3">
              <span className="w-32 capitalize text-sm">{s}</span>
              <Progress value={skillPct(skills, s)} className="flex-1" />
              <span className="w-12 text-right text-sm tabular-nums">{skillPct(skills, s)}%</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Stat label="Lessons" n={profile.lessonsCompleted} />
        <Stat label="Listening min" n={Math.round(profile.listeningMinutes)} />
        <Stat label="Speaking min" n={Math.round(profile.speakingMinutes)} />
        <Stat label="Writing words" n={profile.writingWords} />
      </section>
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Achievements</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => (
            <li key={a.id} className="rounded-lg bg-bg-elevated px-4 py-3 shadow-[var(--shadow-border)]">
              <div className="flex items-center justify-between">
                <p className="font-medium">{a.title}</p>
                {profile.achievements.includes(a.id) ? <Badge>Earned</Badge> : <Badge variant="outline">Locked</Badge>}
              </div>
              <p className="text-sm text-muted">{a.titleUz} · {a.need}</p>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-6 text-sm text-subtle">{WORDS.length} unique words in the written course</p>
      <Button className="mt-4" variant="secondary" asChild>
        <Link to="/settings">Settings</Link>
      </Button>
    </AppShell>
  );
}

function Stat({ label, n }: { label: string; n: number }) {
  return (
    <div className="rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{n}</p>
    </div>
  );
}
