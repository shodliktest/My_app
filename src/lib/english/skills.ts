import {
  BookOpen,
  Headphones,
  Languages,
  PenLine,
  Shuffle,
  SpellCheck,
  type LucideIcon,
} from "lucide-react";
import type { SkillId } from "./types";

export type SkillMeta = {
  id: SkillId;
  title: string;
  blurb: string;
  icon: LucideIcon;
};

export const SKILLS: SkillMeta[] = [
  { id: "vocab", title: "Lug'at", blurb: "So'zlar va ma'nolar", icon: BookOpen },
  { id: "translate", title: "Tarjima", blurb: "O'zbekcha va inglizcha", icon: Languages },
  { id: "grammar", title: "Grammatika", blurb: "Xatolarni toping", icon: SpellCheck },
  { id: "writing", title: "Yozish", blurb: "Gap tuzing va yozing", icon: PenLine },
  { id: "listening", title: "Eshitish", blurb: "Tinglab tushuning", icon: Headphones },
  { id: "mix", title: "Aralash", blurb: "Barchasini birga", icon: Shuffle },
];

export function skillById(id: string): SkillMeta | undefined {
  return SKILLS.find((s) => s.id === id);
}

export const LEVELS: { id: "A1" | "A2" | "B1"; title: string; blurb: string }[] = [
  { id: "A1", title: "A1 · Boshlang'ich", blurb: "Salom, oddiy so'zlar va gaplar" },
  { id: "A2", title: "A2 · Oddiy", blurb: "Kundalik suhbat va asosiy grammatika" },
  { id: "B1", title: "B1 · O'rta", blurb: "Erkinroq yozish, eshitish va iboralar" },
];
