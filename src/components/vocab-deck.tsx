import { useState } from "react";
import { Volume2 } from "lucide-react";
import type { Word } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconByName } from "@/components/icon-by-name";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

export function VocabDeck({
  words,
  showUz,
  onDone,
}: {
  words: Word[];
  showUz: boolean;
  onDone: () => void;
}) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const word = words[i];
  if (!word) return null;

  function next() {
    if (i + 1 >= words.length) onDone();
    else {
      setI(i + 1);
      setFlipped(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">
        Word {i + 1} / {words.length}
      </p>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="mt-3 w-full rounded-xl bg-bg-elevated p-6 text-left shadow-[var(--shadow-border)]"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <IconByName name={word.icon} className="size-6" />
          </span>
          <Badge>{word.pos}</Badge>
          <Badge variant="outline">{word.level}</Badge>
        </div>
        <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight">{word.word}</h2>
        <p className="mt-1 font-mono text-sm text-muted">{word.ipa}</p>
        {showUz ? <p className="mt-3 text-lg">{word.uz}</p> : null}
        {flipped ? (
          <div className="mt-5 space-y-2 text-sm leading-relaxed">
            <p>{word.definition}</p>
            <p className="font-medium">{word.example}</p>
            {showUz ? <p className="text-muted">{word.exampleUz}</p> : null}
            {word.collocations.length ? (
              <p className="text-muted">Collocations: {word.collocations.join(" · ")}</p>
            ) : null}
            {word.family.length ? (
              <p className="text-muted">
                Family: {word.family.map((f) => `${f.form} (${f.pos})`).join(" · ")}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-6 text-sm text-subtle">Tap to reveal definition, example and collocations</p>
        )}
      </button>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" onClick={() => speak(word.word)}>
          <Volume2 className="size-4" /> Pronounce
        </Button>
        <Button className="flex-1" onClick={next}>
          {i + 1 >= words.length ? "Continue" : "Next word"}
        </Button>
      </div>
      <div className="mt-4 flex gap-1">
        {words.map((w, idx) => (
          <span
            key={w.id}
            className={cn("h-1 flex-1 rounded-full", idx <= i ? "bg-primary" : "bg-bg-subtle")}
          />
        ))}
      </div>
    </div>
  );
}
