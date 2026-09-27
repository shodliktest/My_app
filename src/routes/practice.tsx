import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { skillPct, useAppStore } from "@/lib/store";
import { Progress } from "@/components/ui/progress";
import { SKILLS } from "@/lib/types";

const LINKS = [
  { to: "/practice/grammar", skill: "grammar", title: "Grammar", uz: "Grammatika" },
  { to: "/practice/vocabulary", skill: "vocabulary", title: "Vocabulary", uz: "Lug‘at" },
  { to: "/practice/listening", skill: "listening", title: "Listening", uz: "Tinglash" },
  { to: "/practice/reading", skill: "reading", title: "Reading", uz: "O‘qish" },
  { to: "/practice/writing", skill: "writing", title: "Writing", uz: "Yozish" },
  { to: "/speak", skill: "speaking", title: "Speaking", uz: "Gapirish" },
  { to: "/practice/translation", skill: "translation", title: "Translation", uz: "Tarjima" },
  { to: "/mistakes", skill: "grammar", title: "Mistakes", uz: "Xatolar" },
] as const;

export const Route = createFileRoute("/practice")({ component: Practice });

function Practice() {
  const skills = useAppStore((s) => s.skills);
  return (
    <AppShell title="Practice">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Practice</h1>
      <p className="mt-2 text-muted">Drill one skill. Weak areas surface first from your error bank and scores.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {LINKS.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="block rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]"
            >
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted">{item.uz}</p>
              <Progress value={skillPct(skills, item.skill)} className="mt-3" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-subtle">{SKILLS.length} tracked skills</p>
    </AppShell>
  );
}
