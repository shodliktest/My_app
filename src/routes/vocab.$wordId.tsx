import { createFileRoute, Link } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WORD_BY_ID } from "@/content";
import { speak } from "@/lib/speech";
import { IconByName } from "@/components/icon-by-name";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/vocab/$wordId")({ component: WordPage });

function WordPage() {
  const { wordId } = Route.useParams();
  const word = WORD_BY_ID[wordId];
  const ensureCard = useAppStore((s) => s.ensureCard);
  if (!word) {
    return (
      <AppShell>
        <p>Word not found.</p>
        <Button asChild className="mt-3"><Link to="/learn">Learn</Link></Button>
      </AppShell>
    );
  }
  return (
    <AppShell>
      <div className="flex items-center gap-3">
        <span className="flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <IconByName name={word.icon} className="size-7" />
        </span>
        <div>
          <h1 className="font-display text-4xl font-semibold">{word.word}</h1>
          <p className="font-mono text-muted">{word.ipa}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Badge>{word.pos}</Badge>
        <Badge variant="outline">{word.level}</Badge>
      </div>
      <p className="mt-4 text-xl">{word.uz}</p>
      <p className="mt-2">{word.definition}</p>
      <p className="mt-4 font-medium">{word.example}</p>
      <p className="text-muted">{word.exampleUz}</p>
      {word.collocations.length ? <p className="mt-4 text-sm">Collocations: {word.collocations.join(" · ")}</p> : null}
      {word.synonyms.length ? <p className="text-sm">Synonyms: {word.synonyms.join(" · ")}</p> : null}
      {word.antonyms.length ? <p className="text-sm">Antonyms: {word.antonyms.join(" · ")}</p> : null}
      {word.family.length ? (
        <p className="text-sm">Family: {word.family.map((f) => `${f.form} (${f.pos})`).join(" · ")}</p>
      ) : null}
      <div className="mt-5 flex gap-2">
        <Button variant="secondary" onClick={() => speak(word.word)}><Volume2 className="size-4" /> Pronounce</Button>
        <Button onClick={() => ensureCard(word.id)}>Add to flashcards</Button>
      </div>
    </AppShell>
  );
}
