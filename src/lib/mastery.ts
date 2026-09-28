import type { Exercise, Lesson, LessonProgress, LevelId, Skill, SkillScores } from "@/lib/types";
import { LEVEL_ORDER } from "@/lib/cefr";

export type MasteryStatus = "not-started" | "learning" | "mastered" | "review";

export type LessonMastery = {
  status: MasteryStatus;
  score: number;
  bestScore: number;
  attempts: number;
  threshold: number;
  weakSkills: Skill[];
  nextReviewAt: number | null;
};

export const MASTERY_THRESHOLD = 80;
export const REVIEW_THRESHOLD = 60;

/** Return a learner skill as a rounded percentage (0 when untracked). */
export function skillPct(skills: SkillScores, skill: Skill): number {
  const score = skills[skill];
  if (!score || score.total <= 0) return 0;
  return Math.round((score.correct / score.total) * 100);
}

const SKILL_WEIGHTS: Partial<Record<Skill, number>> = {
  grammar: 1.2,
  vocabulary: 1,
  listening: 1,
  reading: 1,
  speaking: 1,
  writing: 1,
  pronunciation: 0.8,
  translation: 0.9,
};

export function scoreExercises(exercises: Exercise[], results: Record<string, boolean>) {
  const eligible = exercises.filter((x) => x.id in results);
  if (!eligible.length) return { score: 0, answered: 0, total: exercises.length };
  const correct = eligible.filter((x) => results[x.id]).length;
  return { score: Math.round((correct / eligible.length) * 100), answered: eligible.length, total: exercises.length };
}

export function masteryFromProgress(progress?: LessonProgress): LessonMastery {
  const attempts = progress?.masteryAttempts ?? 0;
  const bestScore = progress?.bestTestScore ?? 0;
  const score = progress?.lastTestScore ?? bestScore;
  const threshold = progress?.masteryThreshold ?? MASTERY_THRESHOLD;
  const weakSkills = progress?.masteryWeakSkills ?? [];
  let status: MasteryStatus = "not-started";
  if (attempts > 0 && bestScore >= threshold) status = "mastered";
  else if (attempts > 0 && bestScore >= REVIEW_THRESHOLD) status = "learning";
  else if (attempts > 0) status = "review";
  return { status, score, bestScore, attempts, threshold, weakSkills, nextReviewAt: progress?.nextReviewAt ?? null };
}

export function reviewDelayDays(score: number, attempts: number) {
  if (score >= 90) return Math.min(28, 7 + attempts * 2);
  if (score >= 80) return 7;
  if (score >= 70) return 3;
  if (score >= 60) return 1;
  return 0;
}

export function nextReviewAt(score: number, attempts: number, now = Date.now()) {
  const days = reviewDelayDays(score, attempts);
  return days ? now + days * 86400000 : now;
}

export function weakSkillsFromExercises(
  exercises: Exercise[],
  results: Record<string, boolean>,
): Skill[] {
  const bySkill = new Map<Skill, { ok: number; total: number }>();
  for (const ex of exercises) {
    if (!(ex.id in results)) continue;
    const row = bySkill.get(ex.skill) ?? { ok: 0, total: 0 };
    row.total += 1;
    if (results[ex.id]) row.ok += 1;
    bySkill.set(ex.skill, row);
  }
  return [...bySkill.entries()]
    .filter(([, x]) => x.total >= 1)
    .sort((a, b) => a[1].ok / a[1].total - b[1].ok / b[1].total)
    .map(([skill]) => skill)
    .slice(0, 3);
}

export function lessonReadiness(
  lesson: Lesson,
  progress: Record<string, LessonProgress>,
): { ready: boolean; reason: "first" | "prerequisite" | "mastery"; missing: string[] } {
  const prereqs = lesson.curriculum?.prerequisiteIds ?? [];
  const missing = prereqs.filter((id) => !progress[id]?.completed);
  if (!prereqs.length) return { ready: true, reason: "first", missing: [] };
  if (missing.length) return { ready: false, reason: "prerequisite", missing };
  return { ready: true, reason: "mastery", missing: [] };
}

export function levelReadiness(level: LevelId, lessons: Lesson[], progress: Record<string, LessonProgress>) {
  const list = lessons.filter((l) => l.level === level);
  if (!list.length) return { ready: false, completion: 0, mastered: 0 };
  const completed = list.filter((l) => progress[l.id]?.completed).length;
  const mastered = list.filter((l) => masteryFromProgress(progress[l.id]).status === "mastered").length;
  return {
    ready: completed / list.length >= 0.8,
    completion: Math.round((completed / list.length) * 100),
    mastered,
  };
}

export function recommendedLevel(current: LevelId, lessons: Lesson[], progress: Record<string, LessonProgress>, skills: SkillScores): LevelId {
  const currentIndex = LEVEL_ORDER.indexOf(current);
  const level = levelReadiness(current, lessons, progress);
  const tracked = Object.values(skills).filter((x) => x.total >= 4);
  const avg = tracked.length ? tracked.reduce((sum, x) => sum + (x.correct / x.total) * 100, 0) / tracked.length : 0;
  if (level.ready && avg >= 80 && currentIndex < LEVEL_ORDER.length - 1) return LEVEL_ORDER[currentIndex + 1]!;
  if (avg < 55 && currentIndex > 0) return LEVEL_ORDER[currentIndex - 1]!;
  return current;
}

export function weightedSkillScore(skills: SkillScores) {
  let weighted = 0;
  let weight = 0;
  for (const [skill, score] of Object.entries(skills) as [Skill, SkillScores[Skill]][]) {
    if (!score.total) continue;
    const w = SKILL_WEIGHTS[skill] ?? 1;
    weighted += (score.correct / score.total) * 100 * w;
    weight += w;
  }
  return weight ? Math.round(weighted / weight) : 0;
}
