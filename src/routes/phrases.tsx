import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PHRASES, PHRASE_CATEGORIES } from "@/lib/english/phrases";
import { speakEnglish } from "@/lib/english/speech";
import { useProgress } from "@/lib/english/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/phrases")({ component: PhrasesPage });

function PhrasesPage() {
  const onboarded = useProgress((s) => s.onboarded);
  const sound = useProgress((s) => s.sound);
  const [cat, setCat] = useState<(typeof PHRASE_CATEGORIES)[number]>(PHRASE_CATEGORIES[0]);
  const list = useMemo(() => PHRASES.filter((p) => p.category === cat), [cat]);

  return (
    <AppShell>
      <main className="px-5 pt-8">
        <h1 className="font-display text-3xl font-medium tracking-tight">Iboralar</h1>
        <p className="mt-2 text-sm text-muted">
          Kundalik gaplar. Tinglang, takrorlang, yodlab oling.
        </p>

        <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {PHRASE_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-sm",
                cat === c ? "bg-primary text-primary-foreground" : "bg-surface text-fg shadow-[var(--shadow-border)]",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="mt-4 mb-6 flex flex-col gap-2">
          {list.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  if (sound) speakEnglish(p.en);
                }}
                className="flex w-full items-center gap-3 rounded-xl bg-surface px-4 py-3.5 text-left shadow-[var(--shadow-border)]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary">
                  <Volume2 className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium leading-snug">{p.en}</span>
                  <span className="block text-sm text-muted">{p.uz}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {!onboarded && (
          <p className="mb-6 text-sm text-subtle">Mashqlarni boshlash uchun asosiy sahifaga o'ting.</p>
        )}
      </main>
    </AppShell>
  );
}
