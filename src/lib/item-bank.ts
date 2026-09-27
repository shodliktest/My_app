import type { AssessmentMetadata, Exercise, Lesson, LevelId, Skill } from "@/lib/types";
import { levelIndex } from "@/lib/cefr";

export type AssessmentItem = Exercise & {
  lessonId: string;
  lessonTopic: string;
  level: LevelId;
  assessment: AssessmentMetadata;
};

const TYPE_META: Record<Exercise["type"], Pick<AssessmentMetadata, "itemType" | "cognitiveDemand">> = {
  mcq: { itemType: "selected-response", cognitiveDemand: "recognition" },
  gap: { itemType: "constructed-response", cognitiveDemand: "controlled-use" },
  order: { itemType: "ordering", cognitiveDemand: "application" },
  error: { itemType: "constructed-response", cognitiveDemand: "analysis" },
  translate: { itemType: "constructed-response", cognitiveDemand: "application" },
  transform: { itemType: "transformation", cognitiveDemand: "application" },
  "question-form": { itemType: "transformation", cognitiveDemand: "application" },
  tense: { itemType: "selected-response", cognitiveDemand: "recognition" },
  "find-mistake": { itemType: "selected-response", cognitiveDemand: "analysis" },
  rewrite: { itemType: "transformation", cognitiveDemand: "synthesis" },
  complete: { itemType: "constructed-response", cognitiveDemand: "application" },
  dictation: { itemType: "listening", cognitiveDemand: "controlled-use" },
  "listen-gap": { itemType: "listening", cognitiveDemand: "application" },
  speaking: { itemType: "speaking", cognitiveDemand: "synthesis" },
  "ai-correct": { itemType: "constructed-response", cognitiveDemand: "analysis" },
};

const LEVEL_BASE: Record<LevelId, number> = {
  "pre-a1": 1, a1: 1, a2: 2, b1: 3, "b1-plus": 3, b2: 4, "b2-plus": 4, c1: 5,
};

function difficultyFor(ex: Exercise, level: LevelId): 1 | 2 | 3 | 4 | 5 {
  const base = LEVEL_BASE[level];
  const typeBoost = ex.type === "rewrite" || ex.type === "ai-correct" ? 1 : ex.type === "mcq" || ex.type === "tense" ? 0 : 0.4;
  const lengthBoost = ex.prompt.length > 120 ? 0.4 : ex.prompt.length > 70 ? 0.2 : 0;
  return Math.max(1, Math.min(5, Math.round(base + typeBoost + lengthBoost))) as 1 | 2 | 3 | 4 | 5;
}

function commonErrorFor(ex: Exercise): string | undefined {
  const explicit = ex.explanationUz || ex.explanation;
  if (ex.type === "tense") return "tense selection based on time reference";
  if (ex.type === "gap") return "form selection inside sentence context";
  if (ex.type === "translate") return "literal translation instead of natural English";
  if (ex.type === "question-form") return "auxiliary / word-order control";
  if (ex.type === "transform") return "preserving meaning while changing structure";
  if (ex.type === "find-mistake" || ex.type === "error") return "not noticing the target form error";
  return explicit ? "see explanation after response" : undefined;
}

export function metadataFor(ex: Exercise, level: LevelId): AssessmentMetadata {
  const type = TYPE_META[ex.type];
  return ex.assessment ?? {
    cefr: level,
    difficulty: difficultyFor(ex, level),
    cognitiveDemand: type.cognitiveDemand,
    itemType: type.itemType,
    commonError: commonErrorFor(ex),
    discriminationTag: `${ex.skill}:${ex.type}`,
  };
}

function allAssessmentExercises(lesson: Lesson): Exercise[] {
  return [
    ...lesson.test,
    ...lesson.reading.questions,
    ...lesson.listening.questions,
  ];
}

export function buildItemBank(lessons: Lesson[]): AssessmentItem[] {
  const seen = new Set<string>();
  const items: AssessmentItem[] = [];
  for (const lesson of lessons) {
    for (const ex of allAssessmentExercises(lesson)) {
      if (seen.has(ex.id)) continue;
      seen.add(ex.id);
      items.push({ ...ex, lessonId: lesson.id, lessonTopic: lesson.topic, level: lesson.level, assessment: metadataFor(ex, lesson.level) });
    }
  }
  return items;
}

export function getLessonItemBank(lesson: Lesson): AssessmentItem[] {
  return allAssessmentExercises(lesson).map((ex) => ({
    ...ex,
    lessonId: lesson.id,
    lessonTopic: lesson.topic,
    level: lesson.level,
    assessment: metadataFor(ex, lesson.level),
  }));
}

export function selectAssessmentItems(
  items: AssessmentItem[],
  count: number,
  opts: { targetSkill?: Skill | null; targetDifficulty?: number; excludeIds?: string[] } = {},
): AssessmentItem[] {
  const excluded = new Set(opts.excludeIds ?? []);
  const pool = items.filter((x) => !excluded.has(x.id));
  const scored = pool.map((item) => {
    let score = 0;
    if (opts.targetSkill && item.skill === opts.targetSkill) score += 50;
    if (opts.targetDifficulty != null) score += Math.max(0, 20 - Math.abs(item.assessment.difficulty - opts.targetDifficulty) * 6);
    score += item.assessment.cognitiveDemand === "application" ? 5 : 0;
    return { item, score };
  }).sort((a, b) => b.score - a.score || levelIndex(a.item.level) - levelIndex(b.item.level));

  const selected: AssessmentItem[] = [];
  const usedSkills = new Set<Skill>();
  const usedTypes = new Set<Exercise["type"]>();
  for (const { item } of scored) {
    if (selected.length >= count) break;
    const skillBonus = !usedSkills.has(item.skill);
    const typeBonus = !usedTypes.has(item.type);
    if (selected.length >= Math.ceil(count / 2) && !skillBonus && !typeBonus) continue;
    selected.push(item);
    usedSkills.add(item.skill);
    usedTypes.add(item.type);
  }
  if (selected.length < count) {
    for (const { item } of scored) {
      if (selected.length >= count) break;
      if (!selected.some((x) => x.id === item.id)) selected.push(item);
    }
  }
  return selected;
}

export function itemBankStats(items: AssessmentItem[]) {
  const byLevel = Object.fromEntries(Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      acc[item.level] = (acc[item.level] ?? 0) + 1;
      return acc;
    }, {}),
  ));
  const bySkill = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.skill] = (acc[item.skill] ?? 0) + 1;
    return acc;
  }, {});
  const byType = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});
  return { total: items.length, byLevel, bySkill, byType };
}
