import { useMemo, useState } from "react";
import { Check, Lightbulb, Volume2, X } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { answersMatch, normalizeAnswer } from "@/lib/store";
import { speak } from "@/lib/speech";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function ExercisePlayer({
  exercise,
  showUz,
  teacherMode,
  onResult,
}: {
  exercise: Exercise;
  showUz: boolean;
  teacherMode: boolean;
  onResult: (correct: boolean, given: string) => void;
}) {
  const [given, setGiven] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "ok" | "bad" | "revealed">("idle");
  const [hint, setHint] = useState(0);
  const [second, setSecond] = useState(false);

  const tokens = useMemo(
    () => shuffle(exercise.tokens ?? (typeof exercise.answer === "string" ? exercise.answer.split(" ") : [])),
    [exercise.id],
  );

  const expectedText = Array.isArray(exercise.answer) ? exercise.answer[0] ?? "" : exercise.answer;

  function submit(raw?: string) {
    const value =
      raw ??
      (exercise.type === "order" ? picked.join(" ") : given);
    const ok = answersMatch(exercise.answer, value);
    if (ok) {
      setStatus("ok");
      onResult(true, value);
      return;
    }
    if (teacherMode && !second && status !== "bad") {
      setStatus("bad");
      setSecond(true);
      onResult(false, value);
      return;
    }
    setStatus("bad");
    onResult(false, value);
  }

  const hints = [
    exercise.hint1 ?? expectedText.slice(0, 1),
    exercise.hint2 ?? exercise.explanation,
    exercise.hint3 ?? `Starts like: ${expectedText.slice(0, Math.min(8, expectedText.length))}`,
    expectedText,
  ];

  return (
    <div className="rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">{exercise.type} · {exercise.skill}</p>
      <h3 className="mt-2 font-display text-xl font-semibold">{exercise.prompt}</h3>
      {showUz && exercise.promptUz ? <p className="mt-1 text-sm text-muted">{exercise.promptUz}</p> : null}
      {exercise.text ? (
        <p className="mt-3 rounded-md bg-bg-subtle px-3 py-2 font-display text-lg">{exercise.text}</p>
      ) : null}
      {exercise.audioText ? (
        <Button
          type="button"
          variant="soft"
          className="mt-3"
          onClick={() => speak(exercise.audioText ?? "")}
        >
          <Volume2 className="size-4" /> Play audio
        </Button>
      ) : null}

      {exercise.type === "mcq" || exercise.type === "tense" ? (
        <div className="mt-4 grid gap-2">
          {(exercise.options ?? []).map((opt) => {
            const chosen = normalizeAnswer(given) === normalizeAnswer(opt);
            const isAnswer = answersMatch(exercise.answer, opt);
            return (
              <button
                key={opt}
                type="button"
                disabled={status === "ok"}
                onClick={() => {
                  setGiven(opt);
                  submit(opt);
                }}
                className={cn(
                  "min-h-12 rounded-md px-4 text-left text-sm font-medium shadow-[var(--shadow-border)] transition-colors duration-150",
                  status === "idle" && "bg-cream hover:bg-bg-subtle",
                  status !== "idle" && chosen && isAnswer && "bg-primary text-primary-fg",
                  status !== "idle" && chosen && !isAnswer && "bg-danger/10 text-danger",
                  status !== "idle" && !chosen && isAnswer && "bg-primary-soft",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : null}

      {exercise.type === "order" || exercise.type === "question-form" ? (
        <div className="mt-4">
          <div className="flex min-h-14 flex-wrap gap-2 rounded-md bg-bg-subtle p-2">
            {picked.length === 0 ? <span className="px-2 py-2 text-sm text-subtle">Tap words to build the sentence</span> : null}
            {picked.map((t, i) => (
              <button
                key={`${t}-${i}`}
                type="button"
                className="rounded-full bg-primary px-3 py-2 text-sm text-primary-fg"
                onClick={() => setPicked((p) => p.filter((_, j) => j !== i))}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tokens.map((t, i) => {
              const used = picked.filter((x) => x === t).length >= tokens.filter((x) => x === t).length;
              const already = picked.includes(t) && tokens.filter((x) => x === t).length === 1;
              const disabled = already || (used && tokens.filter((x) => x === t).length > 1 && picked.filter((x) => x === t).length >= tokens.filter((x) => x === t).length);
              return (
                <button
                  key={`${t}-opt-${i}`}
                  type="button"
                  disabled={disabled || status === "ok"}
                  onClick={() => setPicked((p) => [...p, t])}
                  className="rounded-full border border-border-strong bg-bg-elevated px-3 py-2 text-sm disabled:opacity-30"
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {["gap", "translate", "error", "rewrite", "complete", "dictation", "listen-gap", "transform", "find-mistake"].includes(
        exercise.type,
      ) ? (
        <Input
          className="mt-4"
          value={given}
          placeholder="Type your answer"
          onChange={(e) => setGiven(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          disabled={status === "ok"}
        />
      ) : null}

      {status !== "ok" && exercise.type !== "mcq" && exercise.type !== "tense" ? (
        <Button className="mt-4" onClick={() => submit()}>
          Check
        </Button>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => setHint((h) => Math.min(4, h + 1))}>
          <Lightbulb className="size-4" /> Hint {hint < 4 ? hint + 1 : ""}
        </Button>
        {exercise.audioText || exercise.prompt ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => speak(exercise.audioText || expectedText)}>
            <Volume2 className="size-4" /> Listen
          </Button>
        ) : null}
      </div>
      {hint > 0 ? (
        <p className="mt-2 text-sm text-muted">
          {hint >= 4 ? `Answer: ${expectedText}` : hints[hint - 1]}
        </p>
      ) : null}

      {status === "ok" ? (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-primary-soft p-3 text-sm">
          <Check className="mt-0.5 size-4 text-primary" />
          <div>
            <p className="font-medium">Correct</p>
            <p className="text-muted">{showUz ? exercise.explanationUz : exercise.explanation}</p>
          </div>
        </div>
      ) : null}
      {status === "bad" ? (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-danger/10 p-3 text-sm">
          <X className="mt-0.5 size-4 text-danger" />
          <div>
            <p className="font-medium">Not yet</p>
            <p>
              <span className="text-danger">{given || picked.join(" ")}</span>
              {" → "}
              <span className="font-medium">{expectedText}</span>
            </p>
            <p className="mt-1 text-muted">{showUz ? exercise.explanationUz : exercise.explanation}</p>
            {teacherMode && second ? <p className="mt-2 font-medium">Try a second attempt above.</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
