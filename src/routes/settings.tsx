import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportProgressBackup, importProgressBackup, useAppStore } from "@/lib/store";
import { LEVEL_META, LEVEL_ORDER } from "@/lib/cefr";
import type { DailyGoal, ImmersionMode, LevelId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const profile = useAppStore((s) => s.profile);
  const setName = useAppStore((s) => s.setName);
  const setLevel = useAppStore((s) => s.setLevel);
  const setDailyGoal = useAppStore((s) => s.setDailyGoal);
  const setImmersion = useAppStore((s) => s.setImmersion);
  const setEnglishOnly = useAppStore((s) => s.setEnglishOnly);
  const setTeacherMode = useAppStore((s) => s.setTeacherMode);
  const reset = useAppStore((s) => s.resetProgress);
  const fileRef = useRef<HTMLInputElement>(null);
  const [backupNote, setBackupNote] = useState("");

  function downloadBackup() {
    const blob = new Blob([exportProgressBackup()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shodlik-education-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupNote("Progress backup yuklandi.");
  }

  async function restoreBackup(file: File) {
    const result = importProgressBackup(await file.text());
    setBackupNote(result.ok ? "Progress muvaffaqiyatli tiklandi." : result.error);
  }

  return (
    <AppShell title="Settings">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
      <label className="mt-6 block text-sm font-medium">Name</label>
      <Input className="mt-1" value={profile.name} onChange={(e) => setName(e.target.value)} />

      <p className="mt-6 text-sm font-medium">Level</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {LEVEL_ORDER.map((id) => (
          <Chip key={id} active={profile.level === id} onClick={() => setLevel(id as LevelId)}>
            {LEVEL_META[id].short}
          </Chip>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium">Daily goal</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["quick", "normal", "full"] as DailyGoal[]).map((g) => (
          <Chip key={g} active={profile.dailyGoal === g} onClick={() => setDailyGoal(g)}>{g}</Chip>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium">Immersion</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["auto", "uz", "en"] as ImmersionMode[]).map((m) => (
          <Chip key={m} active={profile.immersion === m} onClick={() => setImmersion(m)}>{m}</Chip>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <Toggle label="English only mode" on={profile.englishOnly} onClick={() => setEnglishOnly(!profile.englishOnly)} />
        <Toggle label="Teacher mode (hints, second attempt)" on={profile.teacherMode} onClick={() => setTeacherMode(!profile.teacherMode)} />
      </div>

      <section className="mt-8 rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-xl font-semibold">Progress backup</h2>
        <p className="mt-1 text-sm text-muted">Darslar, SRS kartalari, xatolar va statistikalaringizni JSON backup qilib saqlang.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={downloadBackup}>Export progress</Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>Import progress</Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void restoreBackup(f); e.currentTarget.value = ""; }} />
        </div>
        {backupNote ? <p className="mt-2 text-sm text-muted">{backupNote}</p> : null}
      </section>

      <Button className="mt-6" variant="outline" onClick={() => reset()}>Reset local progress</Button>
      <p className="mt-3 text-xs text-subtle">Progress stays on this device. You can export a backup before changing device or clearing browser data.</p>
    </AppShell>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 rounded-full px-4 text-sm font-medium",
        active ? "bg-primary text-primary-fg" : "bg-bg-subtle",
      )}
    >
      {children}
    </button>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-12 w-full items-center justify-between rounded-lg bg-bg-elevated px-4 shadow-[var(--shadow-border)]">
      <span>{label}</span>
      <span className={cn("h-6 w-10 rounded-full p-0.5", on ? "bg-primary" : "bg-bg-subtle")}>
        <span className={cn("block size-5 rounded-full bg-cream transition-transform", on && "translate-x-4")} />
      </span>
    </button>
  );
}
