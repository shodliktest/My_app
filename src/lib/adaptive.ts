import type { Lesson, LessonProgress, LevelId, Skill, SkillScores } from "@/lib/types";
import { LEVEL_ORDER, levelIndex } from "@/lib/cefr";
import { masteryFromProgress, lessonReadiness, skillPct } from "@/lib/mastery";

export type AdaptiveAction = "review" | "repair" | "continue" | "bridge" | "advance";

export type AdaptiveRecommendation = {
  lesson: Lesson;
  action: AdaptiveAction;
  reason: string;
  reasonUz: string;
  targetSkill: Skill | null;
  score: number;
  due: boolean;
};

const CORE_SKILLS: Skill[] = ["grammar", "vocabulary", "listening", "reading", "speaking", "writing"];

function weakestSkill(skills: SkillScores): Skill | null {
  const observed = CORE_SKILLS
    .filter((s) => skills[s].total >= 3)
    .sort((a, b) => skillPct(skills, a) - skillPct(skills, b));
  return observed[0] ?? null;
}

function lessonTargets(lesson: Lesson): Skill[] {
  const counts = new Map<Skill, number>();
  for (const ex of [...lesson.exercises, ...lesson.test, ...lesson.reading.questions, ...lesson.listening.questions]) {
    counts.set(ex.skill, (counts.get(ex.skill) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([skill]) => skill);
}

function actionFor(lesson: Lesson, progress: LessonProgress | undefined, now: number): AdaptiveAction {
  const mastery = masteryFromProgress(progress);
  const due = Boolean(progress?.nextReviewAt && progress.nextReviewAt <= now);
  if (progress && due) return "review";
  if (mastery.status === "review") return "repair";
  if (mastery.status === "learning") return "continue";
  if (lesson.curriculum?.reviewType === "bridge") return "bridge";
  if (mastery.status === "mastered") return "advance";
  return "continue";
}

export function adaptiveRecommendations(
  lessons: Lesson[],
  progress: Record<string, LessonProgress>,
  skills: SkillScores,
  currentLevel: LevelId,
  now = Date.now(),
): AdaptiveRecommendation[] {
  const weak = weakestSkill(skills);
  const currentIndex = levelIndex(currentLevel);
  const candidates: AdaptiveRecommendation[] = [];

  for (const lesson of lessons) {
    const p = progress[lesson.id];
    const readiness = lessonReadiness(lesson, progress);
    if (!readiness.ready) continue;

    const mastery = masteryFromProgress(p);
    const due = Boolean(p?.nextReviewAt && p.nextReviewAt <= now);
    const targets = lessonTargets(lesson);
    const targetSkill = weak && targets.includes(weak) ? weak : targets[0] ?? null;
    const distance = Math.abs(levelIndex(lesson.level) - currentIndex);
    let score = 0;

    // Recovery and due reviews always outrank ordinary new lessons.
    if (due) score += 1000;
    if (mastery.status === "review") score += 700;
    if (mastery.status === "learning") score += 350;
    if (weak && targets.includes(weak)) score += 260;
    if (lesson.isReview || lesson.curriculum?.reviewType === "retrieval") score += 140;
    if (!p?.completed) score += 100;
    if (lesson.level === currentLevel) score += 180;
    score -= distance * 75;
    score -= (lesson.curriculum?.levelSequence ?? lesson.day) * 0.01;

    const action = actionFor(lesson, p, now);
    const reason = due
      ? "Scheduled review is due."
      : mastery.status === "review"
        ? "Recent assessment shows this lesson needs repair."
        : weak && targets.includes(weak)
          ? `This lesson reinforces your weaker ${weak} skill.`
          : lesson.level === currentLevel
            ? "This is the next suitable lesson at your current study level."
            : "This lesson supports a controlled progression between levels.";
    const reasonUz = due
      ? "Rejalashtirilgan takrorlash vaqti keldi."
      : mastery.status === "review"
        ? "So‘nggi baholash bu darsni qayta mustahkamlash kerakligini ko‘rsatdi."
        : weak && targets.includes(weak)
          ? `Bu dars sizdagi nisbatan zaif ${weak} ko‘nikmasini mustahkamlaydi.`
          : lesson.level === currentLevel
            ? "Bu sizning hozirgi darajangiz uchun mos keyingi dars."
            : "Bu dars darajalar orasidagi bosqichma-bosqich o‘sishni qo‘llab-quvvatlaydi.";

    candidates.push({ lesson, action, reason, reasonUz, targetSkill, score, due });
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 8);
}

export function nextAdaptiveRecommendation(
  lessons: Lesson[],
  progress: Record<string, LessonProgress>,
  skills: SkillScores,
  currentLevel: LevelId,
  now = Date.now(),
): AdaptiveRecommendation | null {
  return adaptiveRecommendations(lessons, progress, skills, currentLevel, now)[0] ?? null;
}

export function adaptiveStage(currentLevel: LevelId, progress: Record<string, LessonProgress>, lessons: Lesson[]): "repair" | "build" | "bridge" | "advance" {
  const levelLessons = lessons.filter((l) => l.level === currentLevel);
  if (!levelLessons.length) return "build";
  const reviewCount = levelLessons.filter((l) => masteryFromProgress(progress[l.id]).status === "review").length;
  if (reviewCount >= Math.max(2, Math.ceil(levelLessons.length * 0.2))) return "repair";
  const mastered = levelLessons.filter((l) => masteryFromProgress(progress[l.id]).status === "mastered").length;
  if (mastered / levelLessons.length >= 0.8 && levelIndex(currentLevel) < LEVEL_ORDER.length - 1) return "advance";
  const bridge = levelLessons.some((l) => l.curriculum?.reviewType === "bridge" && !progress[l.id]?.completed);
  if (bridge) return "bridge";
  return "build";
}
