import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Flame, Settings2, Target, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Onboarding } from "@/components/onboarding";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PHRASES, phraseOfTheDay } from "@/lib/english/phrases";
import { LEVELS, SKILLS, skillById } from "@/lib/english/skills";
import { speakEnglish } from "@/lib/english/speech";
import { todayKey, useProgress } from "@/lib/english/store";
import type { Level } from "@/lib/english/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function greeting(name: string): string {
  const h = new Date().getHours();
  const who = name.trim() ? name.trim() : "o'quvchi";
  if (h < 5) return `Xayrli tun, ${who}`;
  if (h < 12) return `Xayrli tong, ${who}`;
  if (h < 17) return `Xayrli kun, ${who}`;
  return `Xayrli kech, ${who}`;
}

function Home() {
  const onboarded = useProgress((s) => s.onboarded);
  if (!onboarded) return <Onboarding />;
  return (
    <AppShell>
      <HomeInner />
    </AppShell>
  );
}

function HomeInner() {
  const name = useProgress((s) => s.name);
  const level = useProgress((s) => s.level);
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const dailyDone = useProgress((s) => s.dailyDone);
  const dailyDate = useProgress((s) => s.dailyDate);
  const lastSkill = useProgress((s) => s.lastSkill);
  const weakIds = useProgress((s) => s.weakIds);
  const skillStats = useProgress((s) => s.skillStats);
  const sound = useProgress((s) => s.sound);

  const [hello, setHello] = useState("Xush kelibsiz");
  const [phrase, setPhrase] = useState(PHRASES[0]!);
  const [doneToday, setDoneToday] = useState(0);

  useEffect(() => {
    setHello(greeting(name));
    setPhrase(phraseOfTheDay(todayKey()));
    setDoneToday(dailyDate === todayKey() ? dailyDone : 0);
  }, [name, dailyDate, dailyDone]);

  const goalPct = Math.min(100, Math.round((doneToday / dailyGoal) * 100));
  const lastMeta = lastSkill && lastSkill !== "review" ? skillById(lastSkill) : null;

  return (
    <main className="px-5 pt-8">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{hello}</p>
          <h1 className="font-display mt-1 text-3xl font-medium tracking-tight">Elli</h1>
        </div>
        <SettingsDialog />
      </header>

      <section className="mt-6 grid grid-cols-3 gap-2">
        <StatCard icon={Flame} label="Seriya" value={`${streak} kun`} />
        <StatCard icon={Trophy} label="Tajriba" value={`${xp} XP`} />
        <StatCard icon={Target} label="Bugun" value={`${doneToday}/${dailyGoal}`} />
      </section>

      <section className="mt-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Kunlik maqsad</span>
          <span className="tabular-nums text-muted">{goalPct}%</span>
        </div>
        <Progress value={goalPct} />
      </section>

      <section className="mt-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Kun iborasi</p>
          <Badge variant="primary">{level}</Badge>
        </div>
        <p className="font-display mt-2 text-xl leading-snug">{phrase.en}</p>
        <p className="mt-1 text-sm text-muted">{phrase.uz}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => {
            if (sound) speakEnglish(phrase.en);
          }}
        >
          Tinglash
        </Button>
      </section>

      {lastMeta && (
        <Link
          to="/learn/$skillId"
          params={{ skillId: lastMeta.id }}
          className="mt-4 flex min-h-12 items-center justify-between rounded-xl bg-primary px-4 py-3 text-primary-foreground"
        >
          <span className="text-sm font-medium">Davom etish · {lastMeta.title}</span>
          <ChevronRight className="size-4" />
        </Link>
      )}

      {weakIds.length >= 3 && (
        <Link
          to="/learn/$skillId"
          params={{ skillId: "review" }}
          className="mt-2 flex min-h-12 items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
        >
          <span className="text-sm font-medium">Zaif joylar · {weakIds.length} ta mashq</span>
          <ChevronRight className="size-4 text-muted" />
        </Link>
      )}

      <h2 className="mt-8 text-sm font-medium tracking-wide text-muted">Mashqlar</h2>
      <div className="stagger-in mt-3 grid grid-cols-2 gap-2.5">
        {SKILLS.map((skill) => {
          const stats = skill.id === "mix" ? null : skillStats[skill.id];
          const pct =
            stats && stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;
          const Icon = skill.icon;
          return (
            <Link
              key={skill.id}
              to="/learn/$skillId"
              params={{ skillId: skill.id }}
              className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-surface-2 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="mt-3 font-medium">{skill.title}</div>
              <div className="mt-0.5 text-sm text-muted">{skill.blurb}</div>
              {pct !== null && (
                <div className="mt-2 text-xs tabular-nums text-subtle">{pct}% aniqlik</div>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-surface px-3 py-3 shadow-[var(--shadow-border)]">
      <Icon className="size-4 text-primary" />
      <div className="mt-2 text-xs text-muted">{label}</div>
      <div className="text-sm font-medium tabular-nums">{value}</div>
    </div>
  );
}

function SettingsDialog() {
  const name = useProgress((s) => s.name);
  const level = useProgress((s) => s.level);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const sound = useProgress((s) => s.sound);
  const setName = useProgress((s) => s.setName);
  const setLevel = useProgress((s) => s.setLevel);
  const setDailyGoal = useProgress((s) => s.setDailyGoal);
  const setSound = useProgress((s) => s.setSound);
  const resetProgress = useProgress((s) => s.resetProgress);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Sozlamalar">
          <Settings2 className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Sozlamalar</DialogTitle>
        <DialogDescription>Daraja, maqsad va ovoz.</DialogDescription>
        <div className="mt-4 flex flex-col gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Ism</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} />
          </label>
          <div>
            <p className="mb-1.5 text-sm text-muted">Daraja</p>
            <div className="grid gap-1.5">
              {LEVELS.map((lv) => (
                <button
                  key={lv.id}
                  type="button"
                  onClick={() => setLevel(lv.id as Level)}
                  className={cn(
                    "rounded-lg bg-surface-2 px-3 py-2.5 text-left text-sm",
                    level === lv.id && "ring-2 ring-primary/50",
                  )}
                >
                  {lv.title}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm text-muted">Kunlik mashqlar</p>
            <div className="flex gap-2">
              {[8, 12, 16].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDailyGoal(n)}
                  className={cn(
                    "h-10 flex-1 rounded-lg bg-surface-2 text-sm tabular-nums",
                    dailyGoal === n && "ring-2 ring-primary/50",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSound(!sound)}
            className="flex h-11 items-center justify-between rounded-lg bg-surface-2 px-3 text-sm"
          >
            <span>Ovoz</span>
            <span className="text-muted">{sound ? "Yoniq" : "O'chiq"}</span>
          </button>
          <Button
            variant="outline"
            onClick={() => {
              resetProgress();
              setOpen(false);
            }}
          >
            Natijani nolga tushirish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
