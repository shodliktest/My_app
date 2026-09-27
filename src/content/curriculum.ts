import type { Lesson, LevelId } from "@/lib/types";
import { LEVEL_ORDER } from "@/lib/cefr";

const PHASES: Record<LevelId, string[]> = {
  "pre-a1": ["foundation"],
  a1: ["survival communication", "core sentence building"],
  a2: ["everyday expansion", "past and comparison"],
  b1: ["independent communication", "complex time and condition"],
  "b1-plus": ["range expansion", "connected discourse"],
  b2: ["precision and complexity", "argument and control"],
  "b2-plus": ["register and cohesion", "formal flexibility"],
  c1: ["precision", "synthesis and mastery"],
};

function phaseFor(level: LevelId, levelSequence: number, count: number) {
  const phases = PHASES[level];
  if (phases.length === 1) return phases[0]!;
  return levelSequence <= Math.ceil(count / 2) ? phases[0]! : phases[1]!;
}

function isExplicitReview(l: Lesson) {
  return l.isReview || /\b(review|revision|diagnostic|assessment|mastery)\b/i.test(`${l.topic} ${l.grammar.title}`);
}

/**
 * Curriculum metadata is deliberately derived from the authored lesson order.
 * It does not invent prerequisite grammar: it only records sequencing and
 * retrieval targets so the UI can present a coherent progression.
 */
export function applyCurriculum(lessons: Lesson[]): Lesson[] {
  const byLevel = new Map<LevelId, Lesson[]>();
  for (const level of LEVEL_ORDER) {
    byLevel.set(level, lessons.filter(l => l.level === level).sort((a, b) => a.day - b.day));
  }

  let sequence = 0;
  const finalByLevel = new Map<LevelId, Lesson>();
  const out: Lesson[] = [];

  for (const level of LEVEL_ORDER) {
    const list = byLevel.get(level) ?? [];
    const previousLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) - 1];
    const previousFinal = previousLevel ? finalByLevel.get(previousLevel) : undefined;

    list.forEach((lesson, i) => {
      sequence += 1;
      const levelSequence = i + 1;
      const prior = list[i - 1];
      const spaced = [list[i - 2], list[i - 4]].filter(Boolean).map(x => x!.id);
      const prerequisiteIds = prior ? [prior.id] : previousFinal ? [previousFinal.id] : [];
      const reviewType = isExplicitReview(lesson)
        ? /mastery|assessment/i.test(`${lesson.topic} ${lesson.grammar.title}`) ? "mastery" : "retrieval"
        : undefined;

      out.push({
        ...lesson,
        isReview: isExplicitReview(lesson),
        curriculum: {
          sequence,
          levelSequence,
          unit: Math.ceil(levelSequence / 4),
          phase: phaseFor(level, levelSequence, list.length),
          prerequisiteIds,
          spacedReviewIds: spaced,
          ...(reviewType ? { reviewType } : {}),
        },
      });
    });

    const last = list.at(-1);
    if (last) finalByLevel.set(level, last);
  }
  return out;
}
