import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { answersMatch } from "@/lib/english/grade";
import { speakEnglish, stopSpeaking } from "@/lib/english/speech";
import type { Exercise } from "@/lib/english/types";
import { cn } from "@/lib/utils";

type Props = {
  exercise: Exercise;
  sound: boolean;
  onResolved: (correct: boolean) => void;
};

export function ExercisePlayer({ exercise, sound, onResolved }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [tapped, setTapped] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [shake, setShake] = useState(false);

  const bank = useMemo(() => {
    if (exercise.kind !== "order") return [];
    const used = new Map<string, number>();
    for (const w of picked) used.set(w, (used.get(w) ?? 0) + 1);
    return exercise.words.map((w, i) => {
      const countBefore = exercise.words.slice(0, i).filter((x) => x === w).length;
      const disabled = (used.get(w) ?? 0) > countBefore;
      return { w, i, disabled };
    });
  }, [exercise, picked]);

  useEffect(() => {
    setSelected(null);
    setTyped("");
    setPicked([]);
    setTapped(null);
    setChecked(false);
    setCorrect(false);
    setShake(false);
    if (
      sound &&
      (exercise.kind === "listen-mcq" || exercise.kind === "listen-type")
    ) {
      const t = window.setTimeout(() => speakEnglish(exercise.speak), 250);
      return () => {
        window.clearTimeout(t);
        stopSpeaking();
      };
    }
    return () => stopSpeaking();
  }, [exercise, sound]);

  function evaluate(): boolean {
    switch (exercise.kind) {
      case "mcq":
      case "listen-mcq":
        return selected === exercise.answer;
      case "type":
      case "listen-type":
        return answersMatch(typed, exercise.answers);
      case "order":
        return answersMatch(picked.join(" "), [exercise.answer]);
      case "tap-error":
        return tapped === exercise.wrongIndex;
    }
  }

  function onCheck() {
    if (checked) return;
    const ok = evaluate();
    setCorrect(ok);
    setChecked(true);
    if (!ok) {
      setShake(true);
      window.setTimeout(() => setShake(false), 300);
    }
  }

  function canCheck(): boolean {
    switch (exercise.kind) {
      case "mcq":
      case "listen-mcq":
        return selected !== null;
      case "type":
      case "listen-type":
        return typed.trim().length > 0;
      case "order":
        return picked.length === exercise.words.length;
      case "tap-error":
        return tapped !== null;
    }
  }

  function replay() {
    if (exercise.kind === "listen-mcq" || exercise.kind === "listen-type") {
      speakEnglish(exercise.speak);
    }
  }

  const prompt =
    exercise.kind === "listen-mcq" || exercise.kind === "listen-type"
      ? "Gapni tinglang va javob bering"
      : exercise.prompt;

  return (
    <div className={cn("flex flex-col gap-5", shake && "shake")}>
      <div>
        <p className="font-display text-[1.65rem] leading-snug font-medium tracking-tight text-fg">
          {prompt}
        </p>
        {(exercise.kind === "listen-mcq" || exercise.kind === "listen-type") && (
          <div className="mt-4 flex items-center gap-2">
            <Button type="button" variant="outline" size="lg" onClick={replay} className="pr-4">
              <Volume2 className="size-4" />
              Yana tinglash
            </Button>
          </div>
        )}
      </div>

      {(exercise.kind === "mcq" || exercise.kind === "listen-mcq") && (
        <div className="grid gap-2">
          {exercise.options.map((opt, i) => {
            const isSel = selected === i;
            const isAns = i === exercise.answer;
            const show = checked;
            return (
              <button
                key={opt}
                type="button"
                disabled={checked}
                onClick={() => setSelected(i)}
                className={cn(
                  "min-h-12 rounded-xl bg-surface px-4 py-3 text-left text-[15px] leading-snug shadow-[var(--shadow-border)] transition-[background-color,box-shadow] duration-150",
                  !show && isSel && "ring-2 ring-primary/50",
                  !show && !isSel && "hover:bg-surface-2",
                  show && isAns && "bg-success-soft text-success ring-2 ring-success/30",
                  show && isSel && !isAns && "bg-danger-soft text-danger ring-2 ring-danger/30",
                )}
              >
                <span className="mr-3 inline-block w-4 font-medium text-subtle tabular-nums">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {(exercise.kind === "type" || exercise.kind === "listen-type") && (
        <div>
          <Input
            value={typed}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={exercise.kind === "type" ? (exercise.placeholder ?? "Javobni yozing") : "Eshitganingizni yozing"}
            disabled={checked}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canCheck()) onCheck();
            }}
          />
        </div>
      )}

      {exercise.kind === "order" && (
        <div className="flex flex-col gap-4">
          <div className="flex min-h-14 flex-wrap gap-2 rounded-xl bg-surface-2 p-3">
            {picked.length === 0 && (
              <span className="self-center text-sm text-subtle">So'zlarni tartib bilan bosing</span>
            )}
            {picked.map((w, i) => (
              <button
                key={`${w}-${i}`}
                type="button"
                disabled={checked}
                onClick={() => setPicked((p) => p.filter((_, idx) => idx !== i))}
                className="rounded-lg bg-surface px-3 py-2 text-sm shadow-[var(--shadow-border)]"
              >
                {w}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {bank.map(({ w, i, disabled }) => (
              <button
                key={`${w}-${i}`}
                type="button"
                disabled={checked || disabled}
                onClick={() => setPicked((p) => [...p, w])}
                className={cn(
                  "rounded-lg bg-surface px-3 py-2 text-sm shadow-[var(--shadow-border)] transition-opacity duration-150",
                  disabled && "opacity-30",
                )}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {exercise.kind === "tap-error" && (
        <div>
          <div className="flex flex-wrap gap-1.5">
            {exercise.tokens.map((tok, i) => {
              const isTap = tapped === i;
              const isWrong = i === exercise.wrongIndex;
              return (
                <button
                  key={`${tok}-${i}`}
                  type="button"
                  disabled={checked}
                  onClick={() => setTapped(i)}
                  className={cn(
                    "rounded-lg px-2.5 py-2 text-[17px] leading-none transition-[background-color,box-shadow] duration-150",
                    !checked && "bg-surface shadow-[var(--shadow-border)] hover:bg-surface-2",
                    !checked && isTap && "ring-2 ring-primary/50",
                    checked && isWrong && "bg-success-soft text-success",
                    checked && isTap && !isWrong && "bg-danger-soft text-danger",
                    checked && !isTap && !isWrong && "bg-surface text-muted",
                  )}
                >
                  {tok}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {checked && (
        <div
          className={cn(
            "rounded-xl px-4 py-3",
            correct ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
          )}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {correct ? <Check className="size-4" /> : <X className="size-4" />}
            {correct ? "To'g'ri" : "Noto'g'ri"}
          </div>
          {!correct && <AnswerKey exercise={exercise} />}
          <p className="mt-1.5 text-sm text-fg/80">{exercise.explain}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!checked ? (
          <Button type="button" size="lg" className="w-full" disabled={!canCheck()} onClick={onCheck}>
            Tekshirish
          </Button>
        ) : (
          <Button type="button" size="lg" className="w-full" onClick={() => onResolved(correct)}>
            Davom etish
          </Button>
        )}
        {exercise.kind === "order" && !checked && picked.length > 0 && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setPicked([])}
            aria-label="Tozalash"
          >
            <RotateCcw className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function AnswerKey({ exercise }: { exercise: Exercise }) {
  let text = "";
  switch (exercise.kind) {
    case "mcq":
    case "listen-mcq":
      text = exercise.options[exercise.answer];
      break;
    case "type":
    case "listen-type":
      text = exercise.answers[0] ?? "";
      break;
    case "order":
      text = exercise.answer;
      break;
    case "tap-error":
      text = exercise.correction
        ? `${exercise.tokens[exercise.wrongIndex]} → ${exercise.correction}`
        : `${exercise.tokens[exercise.wrongIndex]} so'zini olib tashlang`;
      break;
  }
  if (!text) return null;
  return <p className="mt-1 text-sm font-medium text-fg">Javob: {text}</p>;
}
