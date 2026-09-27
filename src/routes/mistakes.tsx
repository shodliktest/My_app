import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/mistakes")({ component: Mistakes });

function Mistakes() {
  const mistakes = useAppStore((s) => s.mistakes);
  const clearMistake = useAppStore((s) => s.clearMistake);
  const activeMistakes = mistakes.filter((m) => m.status !== "resolved");
  const groups = new Map<string, number>();
  for (const m of activeMistakes) groups.set(m.category ?? m.type, (groups.get(m.category ?? m.type) ?? 0) + m.count);

  return (
    <AppShell title="Mistakes">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Error bank</h1>
      <p className="mt-2 text-muted">Wrong answers become the next lesson. Open an item, read why, then clear it when it feels automatic.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[...groups.entries()].map(([t, n]) => (
          <Badge key={t}>{t} · {n}</Badge>
        ))}
      </div>
      {activeMistakes.length === 0 ? (
        <p className="mt-8 text-muted">Xatolar banki hozircha bo‘sh. Xato qilganingizda bu yerda sabab va remediation paydo bo‘ladi.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {activeMistakes.map((m) => (
            <li key={m.id} className="rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-subtle">{m.skill} · {m.category ?? m.type} · ×{m.count}</p>
                  <p className="mt-1 font-medium">{m.prompt}</p>
                  {m.concept ? <p className="mt-1 text-xs text-muted">Muammo turi: {m.concept}</p> : null}
                  <p className="mt-2 text-sm">
                    <span className="text-danger">{m.userAnswer}</span>
                    {" → "}
                    <span className="text-primary">{m.correctAnswer}</span>
                  </p>
                  <p className="mt-2 text-sm text-muted">{m.explanation}</p>
                  {m.remediation ? (
                    <div className="mt-3 rounded-lg bg-bg-subtle p-3">
                      <p className="font-medium">Mini-remediation</p>
                      <p className="mt-1 text-sm text-muted">{m.remediation.microLesson}</p>
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                        {m.remediation.steps.map((step, i) => <li key={i}>{step}</li>)}
                      </ol>
                      {m.remediation.contrast ? <p className="mt-2 text-sm"><span className="font-medium">Contrast:</span> {m.remediation.contrast}</p> : null}
                    </div>
                  ) : null}
                  <p className="mt-2 text-xs text-subtle">Qayta to‘g‘ri yechish: {m.successfulRechecks ?? 0}/2 · holat: {m.status ?? "active"}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => clearMistake(m.id)}>Got it</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
