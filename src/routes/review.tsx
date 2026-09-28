import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Volume2, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { dueCards, nextKind, retrievalSummary } from "@/lib/srs";
import { WORD_BY_ID } from "@/content";
import { speak } from "@/lib/speech";
import { showUzbek } from "@/lib/lang";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/review")({ component: Review });

function normalize(value: string) {
  return value.toLowerCase().trim().replace(/[’‘]/g, "'").replace(/[.,!?;:]+$/g, "").replace(/\s+/g, " ");
}

function Review() {
  const cards = useAppStore((s) => s.cards);
  const gradeCard = useAppStore((s) => s.gradeCard);
  const addXp = useAppStore((s) => s.addXp);
  const addMission = useAppStore((s) => s.addMission);
  const touchStreak = useAppStore((s) => s.touchStreak);
  const profile = useAppStore((s) => s.profile);
  const due = useMemo(() => dueCards(Object.values(cards)), [cards]);
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [show, setShow] = useState(false);
  const [selfGrade, setSelfGrade] = useState<0 | 1 | 2 | 3 | null>(null);
  const card = due[i];
  const word = card ? WORD_BY_ID[card.wordId] : undefined;
  const kind = card ? nextKind(card) : "word-meaning";
  const showUz = showUzbek(profile.level, profile.immersion, profile.englishOnly);
  const newCount = Object.values(cards).filter((c) => c.state === "new").length;
  const learning = Object.values(cards).filter((c) => c.state === "learning").length;
  const reviewN = Object.values(cards).filter((c) => c.state === "review").length;

  function submitRetrieval() {
    if (!card || !word) return;
    const expected = kind === "uz-en" ? word.word : kind === "en-uz" ? word.uz : word.word;
    const correct = normalize(answer) === normalize(expected);
    setSelfGrade(correct ? 2 : 0);
    setShow(true);
  }

  function grade(g: 0 | 1 | 2 | 3) {
    if (!card) return;
    gradeCard(card.wordId, g, kind);
    addXp(g === 0 ? 2 : 10);
    touchStreak();
    addMission("vocabulary", Math.min(100, ((i + 1) / Math.max(1, due.length)) * 100));
    setAnswer(""); setShow(false); setSelfGrade(null); setI((n) => n + 1);
  }

  const prompt = !word ? "" : kind === "uz-en" ? word.uz : kind === "en-uz" ? word.word : kind === "audio-word" ? "Listen and type the word" : kind === "sentence-gap" ? word.example.replace(new RegExp(word.word, "ig"), "_____ ") : kind === "speaking" ? `Say a sentence using “${word.word}”.` : word.word;
  const stats = card ? retrievalSummary(card) : null;

  return (
    <AppShell title="Review">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Spaced retrieval</h1>
      <p className="mt-2 text-muted">{due.length} due · {newCount} new · {learning} learning · {reviewN} review</p>
      {!word || i >= due.length ? (
        <div className="mt-8 rounded-xl bg-bg-elevated p-6 shadow-[var(--shadow-border)]">
          <CheckCircle2 className="size-7 text-primary" />
          <p className="mt-3 font-display text-2xl font-semibold">Review complete</p>
          <p className="mt-2 text-muted">No due cards remain. Come back when the next retrieval interval is due.</p>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-bg-elevated p-6 shadow-[var(--shadow-border)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge>{kind}</Badge>
            {card.leech ? <Badge variant="outline"><AlertTriangle className="mr-1 size-3" /> Needs a new context</Badge> : null}
          </div>
          <p className="mt-4 text-sm text-subtle">{prompt}</p>
          {kind === "audio-word" ? <Button className="mt-4" variant="secondary" onClick={() => speak(word.word)}><Volume2 className="size-4" /> Play audio</Button> : null}
          {kind === "speaking" ? <Button className="mt-4" variant="secondary" onClick={() => speak(word.word)}><Volume2 className="size-4" /> Hear model</Button> : null}
          {kind !== "audio-word" && kind !== "speaking" ? <Input className="mt-5" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitRetrieval(); }} placeholder="Type your answer…" /> : null}
          {!show ? <Button className="mt-4" onClick={() => kind === "audio-word" || kind === "sentence-gap" || kind === "uz-en" || kind === "en-uz" ? submitRetrieval() : setShow(true)}>{kind === "speaking" ? "I retrieved it" : "Check retrieval"}</Button> : null}
          {show ? (
            <div className="mt-5 rounded-xl bg-bg-subtle p-4">
              <p className="text-lg font-semibold">{word.word} · {word.uz}</p>
              <p className="mt-1 font-mono text-sm text-muted">{word.ipa}</p>
              <p className="mt-2 text-sm">{word.definition}</p>
              <p className="mt-2 text-sm font-medium">{word.example}</p>
              {showUz ? <p className="mt-1 text-sm text-muted">{word.exampleUz}</p> : null}
              {selfGrade === 0 ? <p className="mt-3 text-sm text-red-500">Not quite — this retrieval will be scheduled again soon.</p> : null}
              <div className="mt-5 grid grid-cols-4 gap-2">
                <Button variant="outline" onClick={() => grade(0)}><RotateCcw className="size-4" /> Again</Button>
                <Button variant="secondary" onClick={() => grade(1)}>Hard</Button>
                <Button onClick={() => grade(2)}>Good</Button>
                <Button variant="soft" onClick={() => grade(3)}>Easy</Button>
              </div>
            </div>
          ) : null}
          {stats ? <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-muted md:grid-cols-5"><div className="rounded-lg bg-bg-subtle p-2">Accuracy<br /><b>{stats.accuracy}%</b></div><div className="rounded-lg bg-bg-subtle p-2">Contexts<br /><b>{stats.coverage}/7</b></div><div className="rounded-lg bg-bg-subtle p-2">Lapses<br /><b>{stats.lapses}</b></div><div className="rounded-lg bg-bg-subtle p-2">Interval<br /><b>{stats.intervalDays}d</b></div><div className={cn("rounded-lg bg-bg-subtle p-2", card.leech && "text-amber-600")}>Status<br /><b>{card.leech ? "leech" : card.state}</b></div></div> : null}
        </div>
      )}
    </AppShell>
  );
}
