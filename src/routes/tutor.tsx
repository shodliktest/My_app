import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { LESSONS } from "@/content";
import { useAppStore } from "@/lib/store";
import { buildTutorTurn, type TutorTurn } from "@/lib/tutor";
import { showUzbek } from "@/lib/lang";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tutor")({ component: Tutor });

function Tutor() {
  const profile = useAppStore((s) => s.profile);
  const skills = useAppStore((s) => s.skills);
  const mistakes = useAppStore((s) => s.mistakes);
  const progress = useAppStore((s) => s.lessonProgress);
  const addXp = useAppStore((s) => s.addXp);
  const addMission = useAppStore((s) => s.addMission);
  const [text, setText] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [turns, setTurns] = useState<TutorTurn[]>([]);

  const lesson = useMemo(() => {
    const current = LESSONS.find((l) => l.level === profile.level && !progress[l.id]?.completed);
    return current ?? LESSONS.find((l) => l.level === profile.level) ?? LESSONS[0];
  }, [profile.level, progress]);

  const activeMistakes = mistakes.filter((m) => m.status !== "resolved").slice(0, 5);
  const uz = showUzbek(profile.level, profile.immersion, profile.englishOnly);

  function submit() {
    const msg = text.trim();
    if (!msg) return;
    const result = buildTutorTurn(msg, {
      level: profile.level,
      englishOnly: profile.englishOnly,
      teacherMode: profile.teacherMode,
      skills,
      mistakes,
      lesson,
    }, attempt);
    setTurns((x) => [...x, result]);
    setText("");
    setAttempt((x) => Math.min(x + 1, 3));
    addXp(10);
    addMission("grammar", 35);
  }

  function newProblem() {
    setAttempt(0);
    setTurns([]);
    setText("");
  }

  return (
    <AppShell title="Teacher Tutor">
      <div className="flex flex-col gap-5">
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>LOCAL TEACHER ENGINE</Badge>
            <Badge>{profile.level.toUpperCase()}</Badge>
            <Badge>{profile.englishOnly ? "English mode" : "Uzbek support"}</Badge>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Shodlik Teacher Tutor</h1>
          <p className="mt-2 max-w-2xl text-muted">API bo‘lmasa ham ishlaydi. Tutor sizning CEFR darajangiz, xatolar banki, ko‘nikmalar va joriy darsga tayangan holda hint → explanation → retry → transfer usulida o‘rgatadi.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-subtle">Current target</p>
                <h2 className="mt-1 text-lg font-semibold">{lesson?.topic ?? "General English"}</h2>
              </div>
              <Button variant="secondary" onClick={newProblem}>New problem</Button>
            </div>
            <p className="mt-2 text-sm text-muted">{uz ? lesson?.topicUz : lesson?.topic}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(skills).filter(([, v]) => v.total).slice(0, 6).map(([skill, v]) => (
                <span key={skill} className="rounded-full bg-bg-subtle px-2.5 py-1 text-xs">{skill}: {Math.round((v.correct / v.total) * 100)}%</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs uppercase tracking-[0.14em] text-subtle">Active error targets</p>
            {activeMistakes.length ? (
              <div className="mt-3 space-y-2">
                {activeMistakes.map((m) => <div key={m.id} className="rounded-lg bg-bg-subtle p-2 text-sm"><b>{m.concept ?? m.type}</b><div className="text-xs text-muted">{m.category ?? "other"} · {m.count}x</div></div>)}
              </div>
            ) : <p className="mt-3 text-sm text-muted">Hozircha faol xato targetlari yo‘q.</p>}
          </div>
        </section>

        <section className="min-h-72 space-y-3 rounded-2xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
          {turns.length === 0 ? <div className="rounded-xl bg-bg-subtle p-4"><p className="font-medium">Teacher says</p><p className="mt-2 text-sm text-muted">{uz ? "Masalan: I have went to school yesterday. yoki grammar savolingizni yozing." : "Try: I have went to school yesterday. Or ask a grammar question."}</p></div> : null}
          {turns.map((t, i) => (
            <div key={i} className={cn("rounded-xl border border-border p-4", i % 2 ? "bg-bg-subtle" : "bg-bg")}>
              <div className="flex items-center gap-2"><Badge>{t.stage}</Badge>{t.category ? <span className="text-xs text-muted">{t.category}</span> : null}</div>
              <h3 className="mt-2 font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm leading-6">{t.message}</p>
              {t.microLesson ? <p className="mt-2 rounded-lg bg-primary-soft p-3 text-sm">{t.microLesson}</p> : null}
              {t.hint ? <p className="mt-2 text-sm"><b>Hint:</b> {t.hint}</p> : null}
              <p className="mt-3 rounded-lg border border-dashed border-border p-3 text-sm"><b>Task:</b> {t.task}</p>
              {t.expected && attempt >= 2 ? <p className="mt-2 text-xs text-muted">Teacher key: {t.expected}</p> : null}
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(); }} placeholder={uz ? "Inglizcha gap yoki savolingizni yozing… (Ctrl+Enter)" : "Write an English sentence or question… (Ctrl+Enter)"} />
          <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-muted">Deterministic/local · no API required</span><Button onClick={submit}>Ask teacher</Button></div>
        </div>
      </div>
    </AppShell>
  );
}
