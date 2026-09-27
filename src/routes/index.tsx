import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, Brain, Mic, PenLine, Headphones, Languages } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAppStore, skillPct } from "@/lib/store";
import { LEVEL_META } from "@/lib/cefr";
import { LESSONS, nextLesson } from "@/content";
import { dueCards } from "@/lib/srs";
import { SKILLS, type Skill } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const hydrated = useAppStore((s) => s.hydrated);
  const profile = useAppStore((s) => s.profile);
  const lessonProgress = useAppStore((s) => s.lessonProgress);
  const todayMission = useAppStore((s) => s.todayMission);
  const skills = useAppStore((s) => s.skills);
  const cards = useAppStore((s) => s.cards);
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !profile.onboardingDone) navigate({ to: "/onboarding" });
  }, [hydrated, profile.onboardingDone, navigate]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-muted">
        Loading Shodlik…
      </div>
    );
  }

  const completed = new Set(
    Object.values(lessonProgress).filter((p) => p.completed).map((p) => p.lessonId),
  );
  const next = nextLesson(completed, profile.level);
  const due = dueCards(Object.values(cards)).length;
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const missionSkills: Skill[] = ["grammar", "vocabulary", "listening", "reading", "speaking", "writing"];
  const missionAvg = Math.round(missionSkills.reduce((a, k) => a + todayMission[k], 0) / missionSkills.length);
  const meta = LEVEL_META[profile.level];

  return (
    <AppShell>
      <section>
        <p className="text-sm text-muted">{hello}{profile.name ? `, ${profile.name}` : ""}</p>
        <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight">Continue your English.</h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>{meta.short} · {meta.label}</Badge>
          <Badge variant="outline">{profile.streak} day streak</Badge>
          <Badge variant="outline" className="tabular-nums">{profile.xp} XP</Badge>
        </div>
      </section>

      <section className="mt-8 rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-subtle">Today's mission</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{missionAvg}%</p>
          </div>
          {next ? (
            <Button asChild>
              <Link to="/learn/$lessonId" params={{ lessonId: next.id }}>
                {completed.size ? `Day ${next.day}` : "Start Day 1"}
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/learn">Course map</Link>
            </Button>
          )}
        </div>
        <Progress value={missionAvg} className="mt-4" />
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {missionSkills.map((s) => (
            <li key={s}>
              <p className="text-xs capitalize text-muted">{s}</p>
              <Progress value={todayMission[s]} className="mt-1 h-1.5" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <DashCard to="/review" icon={Brain} title="Review" hint={`${due} cards due`} />
        <DashCard to="/practice" icon={BookOpen} title="Practice" hint="Grammar, vocab, skills" />
        <DashCard to="/tutor" icon={Mic} title="Teacher Tutor" hint="Local-first teacher + optional AI" />
        <DashCard to="/mistakes" icon={PenLine} title="Error bank" hint="Fix repeated mistakes" />
        <DashCard to="/games" icon={Languages} title="Games" hint="Match, build, spell" />
        <DashCard to="/progress" icon={Headphones} title="Progress" hint="CEFR map and stats" />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Skill snapshot</h2>
        <ul className="mt-3 space-y-2">
          {SKILLS.slice(0, 6).map((s) => (
            <li key={s} className="flex items-center gap-3">
              <span className="w-28 capitalize text-sm text-muted">{s}</span>
              <Progress value={skillPct(skills, s)} className="flex-1" />
              <span className="w-10 text-right text-sm tabular-nums">{skillPct(skills, s)}%</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-sm text-subtle">
        {LESSONS.length} written lessons · Pre-A1 to C1 · {profile.lessonsCompleted} completed
      </p>
    </AppShell>
  );
}

function DashCard({
  to, icon: Icon, title, hint,
}: { to: string; icon: typeof BookOpen; title: string; hint: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)] transition-shadow duration-150 hover:shadow-[var(--shadow-border-hover)]"
    >
      <span className="flex size-11 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="text-sm text-muted">{hint}</span>
      </span>
    </Link>
  );
}
