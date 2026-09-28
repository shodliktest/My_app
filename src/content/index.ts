import type { Lesson, Word } from "@/lib/types";
import { lessons as preA1a } from "./pre-a1";
import { lessons as preA1b } from "./pre-a1-more";
import { lessons as a1 } from "./a1";
import { lessons as a2 } from "./a2";
import { lessons as a2b } from "./a2-more";
import { lessons as b1 } from "./b1";
import { lessons as b1plus } from "./b1plus";
import { lessons as b2 } from "./b2";
import { lessons as b2plus } from "./b2plus";
import { lessons as c1 } from "./c1";
import { LEVEL_ORDER } from "@/lib/cefr";
import { enrichAll } from "./production";
import { authorAll } from "./pro-authoring";
import { applyCurriculum } from "./curriculum";

function merge(parts: Lesson[][]): Lesson[] {
  const seen = new Set<string>();
  const out: Lesson[] = [];
  for (const list of parts) {
    for (const l of list ?? []) {
      if (seen.has(l.id)) continue;
      seen.add(l.id);
      out.push(l);
    }
  }
  return out.sort((a, b) => a.day - b.day);
}

export const LESSONS: Lesson[] = applyCurriculum(authorAll(enrichAll(merge([preA1a, preA1b, a1, a2, a2b, b1, b1plus, b2, b2plus, c1]))));

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export const WORDS: Word[] = (() => {
  const map = new Map<string, Word>();
  for (const lesson of LESSONS) {
    for (const w of lesson.vocabulary) {
      if (!map.has(w.id)) map.set(w.id, w);
    }
  }
  return [...map.values()];
})();

export const WORD_BY_ID: Record<string, Word> = Object.fromEntries(WORDS.map((w) => [w.id, w]));

export function lessonsForLevel(level: Lesson["level"]) {
  return LESSONS.filter((l) => l.level === level);
}

export function nextLesson(completedIds: Set<string>, preferredLevel: Lesson["level"]): Lesson | undefined {
  const same = LESSONS.find((l) => l.level === preferredLevel && !completedIds.has(l.id));
  if (same) return same;
  const i = LEVEL_ORDER.indexOf(preferredLevel);
  for (let k = i + 1; k < LEVEL_ORDER.length; k++) {
    const n = LESSONS.find((l) => l.level === LEVEL_ORDER[k] && !completedIds.has(l.id));
    if (n) return n;
  }
  return LESSONS.find((l) => !completedIds.has(l.id));
}

export function countByLevel() {
  const out: Record<string, number> = {};
  for (const l of LESSONS) out[l.level] = (out[l.level] ?? 0) + 1;
  return out;
}
