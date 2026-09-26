import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LEVELS } from "@/lib/english/skills";
import type { Level } from "@/lib/english/types";
import { useProgress } from "@/lib/english/store";
import { cn } from "@/lib/utils";

export function Onboarding() {
  const complete = useProgress((s) => s.completeOnboarding);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level>("A1");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-5 py-10">
      <div className="stagger-in flex flex-col gap-8">
        <div>
          <p className="text-sm font-medium tracking-wide text-primary">Ingliz tili mashqlari</p>
          <h1 className="font-display mt-2 text-5xl leading-none font-medium tracking-tight">Elli</h1>
          <p className="mt-4 max-w-sm text-pretty text-muted">
            Quiz, tarjima, grammatik xatolar, yozish va eshitish — barchasi bitta joyda. Darajangizni tanlang.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-muted">Ismingiz (ixtiyoriy)</span>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masalan, Madina"
            maxLength={24}
          />
        </label>

        <div className="grid gap-2">
          {LEVELS.map((lv) => (
            <button
              key={lv.id}
              type="button"
              onClick={() => setLevel(lv.id)}
              className={cn(
                "rounded-xl bg-surface px-4 py-3.5 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150",
                level === lv.id && "ring-2 ring-primary/55",
              )}
            >
              <div className="text-sm font-medium">{lv.title}</div>
              <div className="text-sm text-muted">{lv.blurb}</div>
            </button>
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={() => complete(level, name)}>
          Boshlash
        </Button>
      </div>
    </main>
  );
}
