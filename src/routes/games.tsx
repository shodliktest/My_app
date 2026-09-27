import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LESSONS, WORDS } from "@/content";
import { useAppStore, answersMatch } from "@/lib/store";
import { cn } from "@/lib/utils";
import { speak } from "@/lib/speech";

export const Route = createFileRoute("/games")({ component: Games });

const MODES = ["match", "order", "spell", "translate", "odd"] as const;
type Mode = (typeof MODES)[number];

function Games() {
  const [mode, setMode] = useState<Mode>("match");
  const profile = useAppStore((s) => s.profile);
  const addXp = useAppStore((s) => s.addXp);
  const pool = useMemo(
    () => WORDS.filter((w) => w.level === profile.level || w.level === "pre-a1").slice(0, 40),
    [profile.level],
  );
  const sentences = useMemo(
    () => LESSONS.flatMap((l) => l.exercises.filter((e) => e.type === "order")).slice(0, 20),
    [],
  );

  return (
    <AppShell title="Games">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Practice games</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)}>
            {m}
          </Button>
        ))}
      </div>
      <div className="mt-6">
        {mode === "match" ? <MatchGame words={pool} onXp={() => addXp(10)} /> : null}
        {mode === "order" ? <OrderGame items={sentences} onXp={() => addXp(10)} /> : null}
        {mode === "spell" ? <SpellGame words={pool} onXp={() => addXp(10)} /> : null}
        {mode === "translate" ? <TranslateGame words={pool} onXp={() => addXp(10)} /> : null}
        {mode === "odd" ? <OddGame words={pool} onXp={() => addXp(10)} /> : null}
      </div>
    </AppShell>
  );
}

function MatchGame({ words, onXp }: { words: typeof WORDS; onXp: () => void }) {
  const sample = words.slice(0, 6);
  const [left, setLeft] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const rights = useMemo(() => [...sample].sort(() => Math.random() - 0.5), [sample]);
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        {sample.map((w) => (
          <button
            key={w.id}
            type="button"
            disabled={done.includes(w.id)}
            onClick={() => setLeft(w.id)}
            className={cn(
              "w-full rounded-lg px-3 py-3 text-left shadow-[var(--shadow-border)]",
              left === w.id ? "bg-primary text-primary-fg" : "bg-bg-elevated",
              done.includes(w.id) && "opacity-40",
            )}
          >
            {w.word}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {rights.map((w) => (
          <button
            key={w.id}
            type="button"
            disabled={done.includes(w.id)}
            onClick={() => {
              if (left === w.id) {
                setDone((d) => [...d, w.id]);
                setLeft(null);
                onXp();
              } else setLeft(null);
            }}
            className="w-full rounded-lg bg-bg-elevated px-3 py-3 text-left shadow-[var(--shadow-border)]"
          >
            {w.uz}
          </button>
        ))}
      </div>
    </div>
  );
}

function OrderGame({ items, onXp }: { items: { id: string; tokens?: string[]; answer: string | string[] }[]; onXp: () => void }) {
  const item = items[0];
  const [picked, setPicked] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  if (!item?.tokens) return <p className="text-muted">Play a lesson first to unlock sentence builder.</p>;
  return (
    <div>
      <div className="flex min-h-14 flex-wrap gap-2 rounded-md bg-bg-subtle p-2">
        {picked.map((t, i) => (
          <button key={i} type="button" className="rounded-full bg-primary px-3 py-1 text-sm text-primary-fg" onClick={() => setPicked((p) => p.filter((_, j) => j !== i))}>
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.tokens.map((t, i) => (
          <button key={i} type="button" className="rounded-full border border-border-strong px-3 py-1 text-sm" onClick={() => setPicked((p) => [...p, t])}>
            {t}
          </button>
        ))}
      </div>
      <Button className="mt-4" onClick={() => {
        const ok = answersMatch(item.answer, picked.join(" "));
        setMsg(ok ? "Correct" : "Try again");
        if (ok) onXp();
      }}>Check</Button>
      <p className="mt-2 text-sm text-muted">{msg}</p>
    </div>
  );
}

function SpellGame({ words, onXp }: { words: typeof WORDS; onXp: () => void }) {
  const [i, setI] = useState(0);
  const [v, setV] = useState("");
  const [msg, setMsg] = useState("");
  const w = words[i];
  if (!w) return <p>No words.</p>;
  return (
    <div>
      <p className="text-muted">{w.uz} · {w.definition}</p>
      <Button className="mt-2" variant="ghost" onClick={() => speak(w.word)}>Hear</Button>
      <Input className="mt-3" value={v} onChange={(e) => setV(e.target.value)} placeholder="Spell the English word" />
      <Button className="mt-3" onClick={() => {
        const ok = v.trim().toLowerCase() === w.word.toLowerCase();
        setMsg(ok ? "Correct" : `It is ${w.word}`);
        if (ok) { onXp(); setI((n) => n + 1); setV(""); }
      }}>Check</Button>
      <p className="mt-2 text-sm">{msg}</p>
    </div>
  );
}

function TranslateGame({ words, onXp }: { words: typeof WORDS; onXp: () => void }) {
  const [i, setI] = useState(0);
  const [v, setV] = useState("");
  const w = words[i];
  if (!w) return null;
  return (
    <div>
      <h2 className="font-display text-2xl">{w.uz}</h2>
      <Input className="mt-3" value={v} onChange={(e) => setV(e.target.value)} />
      <Button className="mt-3" onClick={() => {
        if (v.trim().toLowerCase() === w.word.toLowerCase()) {
          onXp();
          setI((n) => n + 1);
          setV("");
        }
      }}>Check</Button>
    </div>
  );
}

function OddGame({ words, onXp }: { words: typeof WORDS; onXp: () => void }) {
  const cats = [...new Set(words.map((w) => w.category))];
  const cat = cats[0];
  const same = words.filter((w) => w.category === cat).slice(0, 3);
  const odd = words.find((w) => w.category !== cat);
  const mix = odd ? [...same, odd].sort(() => Math.random() - 0.5) : same;
  const [msg, setMsg] = useState("");
  return (
    <div className="grid gap-2">
      <p className="text-muted">Tap the odd one out.</p>
      {mix.map((w) => (
        <Button key={w.id} variant="secondary" onClick={() => {
          const ok = w.id === odd?.id;
          setMsg(ok ? "Yes — different category." : "That one belongs with the group.");
          if (ok) onXp();
        }}>{w.word}</Button>
      ))}
      <p className="text-sm text-muted">{msg}</p>
    </div>
  );
}
