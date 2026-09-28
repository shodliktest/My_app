import type { GrammarBlock } from "@/lib/types";

export function GrammarView({ g, showUz }: { g: GrammarBlock; showUz: boolean }) {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-3xl font-semibold tracking-tight">{g.title}</h2>
        {showUz ? <p className="mt-1 text-muted">{g.titleUz}</p> : null}
      </header>
      <Section k="Meaning" kUz="Ma’nosi" en={g.meaning} uz={g.meaningUz} showUz={showUz} />
      <Section k="Form" kUz="Shakli" en={g.form} uz={g.formUz} showUz={showUz} />
      <Section k="Why" kUz="Nega" en={g.why} uz={g.whyUz} showUz={showUz} />
      <div>
        <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Examples</h3>
        <ul className="mt-2 space-y-2">
          {g.examples.map((ex) => (
            <li key={ex.en} className="rounded-md bg-bg-elevated px-3 py-2 shadow-[var(--shadow-border)]">
              <p className="font-medium">{ex.en}</p>
              {showUz ? <p className="text-sm text-muted">{ex.uz}</p> : null}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Negative · {g.negative.form}</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {g.negative.examples.map((ex) => (
            <li key={ex.en}>
              {ex.en}
              {showUz ? <span className="text-muted"> — {ex.uz}</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Question · {g.question.form}</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {g.question.examples.map((ex) => (
            <li key={ex.en}>
              {ex.en}
              {showUz ? <span className="text-muted"> — {ex.uz}</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Common mistakes</h3>
        <ul className="mt-2 space-y-2">
          {g.mistakes.map((m) => (
            <li key={m.wrong} className="rounded-md border border-border px-3 py-2 text-sm">
              <p>
                <span className="text-danger line-through">{m.wrong}</span>
                {" → "}
                <span className="font-medium text-primary">{m.right}</span>
              </p>
              <p className="mt-1 text-muted">{showUz ? m.whyUz : m.why}</p>
            </li>
          ))}
        </ul>
      </div>
      {g.contrast ? (
        <div className="rounded-lg bg-primary-soft p-4">
          <h3 className="font-display text-lg font-semibold">{g.contrast.vs}</h3>
          <p className="mt-2 text-sm">
            <span className="font-medium">{g.contrast.a}</span>
            <span className="text-muted"> vs </span>
            <span className="font-medium">{g.contrast.b}</span>
          </p>
          <p className="mt-2 text-sm">{showUz ? g.contrast.noteUz : g.contrast.note}</p>
        </div>
      ) : null}
    </div>
  );
}

function Section({
  k, kUz, en, uz, showUz,
}: { k: string; kUz: string; en: string; uz: string; showUz: boolean }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">{showUz ? `${k} · ${kUz}` : k}</h3>
      <p className="mt-1 leading-relaxed">{en}</p>
      {showUz ? <p className="mt-1 text-sm text-muted">{uz}</p> : null}
    </div>
  );
}
