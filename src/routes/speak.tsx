import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { SPEAK_SCENES } from "@/content/scenes";
import { useAppStore } from "@/lib/store";
import { showUzbek } from "@/lib/lang";
import { startRecognition } from "@/lib/speech";
import { assessProduction, type AssessmentKind, type LocalAssessment } from "@/lib/production-assessment";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/speak")({ component: Speak });

function Speak() {
  const profile = useAppStore((s) => s.profile);
  const addXp = useAppStore((s) => s.addXp);
  const addSpeakingMinutes = useAppStore((s) => s.addSpeakingMinutes);
  const addWritingWords = useAppStore((s) => s.addWritingWords);
  const addMission = useAppStore((s) => s.addMission);
  const recordSkill = useAppStore((s) => s.recordSkill);
  const unlock = useAppStore((s) => s.unlockAchievement);
  const showUz = showUzbek(profile.level, profile.immersion, profile.englishOnly);
  const [kind, setKind] = useState<AssessmentKind>("speaking");
  const [scene, setScene] = useState<(typeof SPEAK_SCENES)[number]>(SPEAK_SCENES[0]);
  const [text, setText] = useState("");
  const [assessment, setAssessment] = useState<LocalAssessment | null>(null);

  const writingPrompt = useMemo(() => {
    const topics = {
      "pre-a1": "Write 3–5 simple sentences about your day.",
      a1: "Write a short message about your daily routine.",
      a2: "Describe a memorable weekend and explain why you liked it.",
      b1: "Describe a problem you solved and explain what you learned.",
      "b1-plus": "Discuss a change in technology that affects everyday life.",
      b2: "Discuss whether online education can replace some classroom learning. Give reasons and examples.",
      "b2-plus": "Evaluate a difficult decision and discuss alternative consequences.",
      c1: "Write a balanced argument about how education should respond to rapid technological change.",
    } as const;
    return topics[profile.level];
  }, [profile.level]);

  const prompt = kind === "writing" ? writingPrompt : scene.prompt;

  function submit() {
    const value = text.trim();
    if (!value) return;
    const result = assessProduction({ kind, text: value, prompt, level: profile.level, englishOnly: profile.englishOnly });
    setAssessment(result);
    recordSkill(kind as "speaking" | "writing", result.overall >= 70);
    addXp(Math.max(10, Math.round(result.overall / 3)));
    addMission(kind as "speaking" | "writing", result.overall);
    if (kind === "speaking") { addSpeakingMinutes(1); unlock("first-talk"); }
    else addWritingWords(result.wordCount);
  }

  function reset() { setAssessment(null); setText(""); }

  return (
    <AppShell title="Speaking & Writing">
      <div className="flex flex-col gap-5">
        <section>
          <div className="flex flex-wrap items-center gap-2"><Badge>LOCAL ASSESSMENT ENGINE</Badge><Badge>{profile.level.toUpperCase()}</Badge><Badge>NO API REQUIRED</Badge></div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Speaking & Writing Assessment Studio</h1>
          <p className="mt-2 max-w-3xl text-muted">Teacher-style CEFR diagnostics without depending on an AI API. The engine scores task achievement, grammar, vocabulary, coherence and either fluency-signal or writing accuracy.</p>
        </section>

        <div className="flex gap-2">
          {(["speaking", "writing"] as AssessmentKind[]).map((item) => <button key={item} type="button" onClick={() => { setKind(item); reset(); }} className={cn("rounded-full px-4 py-2 text-sm", kind === item ? "bg-primary text-primary-fg" : "bg-bg-subtle")}>{item === "speaking" ? "🎙 Speaking" : "✍️ Writing"}</button>)}
        </div>

        {kind === "speaking" ? <div className="flex flex-wrap gap-2">{SPEAK_SCENES.map((s) => <button key={s.id} type="button" onClick={() => { setScene(s); reset(); }} className={cn("rounded-full px-3 py-1.5 text-sm", scene.id === s.id ? "bg-primary text-primary-fg" : "bg-bg-subtle")}>{s.title}</button>)}</div> : null}

        <section className="rounded-2xl bg-bg-elevated p-5 shadow-[var(--shadow-border)]">
          <div className="flex flex-wrap items-center gap-2"><Badge>{kind}</Badge><span className="text-sm text-muted">{showUz ? (kind === "writing" ? "Yozish topshirig‘i" : scene.titleUz) : prompt}</span></div>
          <p className="mt-3 text-sm leading-6">{prompt}</p>
          <Textarea className="mt-4 min-h-40" value={text} onChange={(e) => setText(e.target.value)} placeholder={kind === "writing" ? "Write your response here…" : "Type your spoken response, or use Mic…"} />
          <div className="mt-3 flex flex-wrap gap-2"><Button onClick={submit}>Assess locally</Button>{kind === "speaking" ? <Button variant="secondary" onClick={() => startRecognition((t) => setText(t))}>Mic</Button> : null}<Button variant="secondary" onClick={reset}>Reset</Button></div>
          <p className="mt-2 text-xs text-muted">{text.trim().split(/\s+/).filter(Boolean).length} words · browser speech recognition may vary by device.</p>
        </section>

        {assessment ? <section className="space-y-4 rounded-2xl bg-bg-elevated p-5 shadow-[var(--shadow-border)]">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.14em] text-subtle">Teacher diagnostic</p><h2 className="mt-1 text-3xl font-semibold">{assessment.overall}/100</h2></div><div className="text-right"><Badge>CEFR signal: {assessment.cefrSignal.toUpperCase()}</Badge><p className="mt-1 text-xs text-muted">{assessment.wordCount} words · {assessment.sentenceCount} sentences</p></div></div>
          <div className="grid gap-3 md:grid-cols-2">{assessment.rubric.map((r) => <div key={r.key} className="rounded-xl bg-bg-subtle p-3"><div className="flex items-center justify-between gap-2"><b>{r.label}</b><span>{r.score}/100</span></div><div className="mt-1 text-xs uppercase text-subtle">{r.band}</div><p className="mt-2 text-sm text-muted">{r.evidence}</p></div>)}</div>
          <div className="rounded-xl bg-primary-soft p-4"><b>Teacher feedback</b><p className="mt-2 text-sm leading-6">{assessment.teacherFeedback}</p></div>
          <div className="grid gap-3 md:grid-cols-2"><div><b className="text-sm">Strengths</b><ul className="mt-2 list-disc pl-5 text-sm text-muted">{assessment.strengths.map((x) => <li key={x}>{x}</li>)}</ul></div><div><b className="text-sm">Priorities</b><ul className="mt-2 list-disc pl-5 text-sm text-muted">{assessment.priorities.map((x) => <li key={x}>{x}</li>)}</ul></div></div>
          <div className="rounded-xl border border-dashed border-border p-4"><b>Retry task</b><p className="mt-2 text-sm">{assessment.retryTask}</p></div>
        </section> : null}
      </div>
    </AppShell>
  );
}
