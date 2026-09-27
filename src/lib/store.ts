import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  DailyGoal,
  Exercise,
  Flashcard,
  ImmersionMode,
  LessonProgress,
  LevelId,
  Mistake,
  Profile,
  Skill,
  SkillScores,
} from "@/lib/types";
import { emptyCard, markContext, reviewCard } from "@/lib/srs";
import { LEVEL_ORDER } from "@/lib/cefr";

const emptySkills = (): SkillScores => ({
  grammar: { correct: 0, total: 0 },
  vocabulary: { correct: 0, total: 0 },
  listening: { correct: 0, total: 0 },
  reading: { correct: 0, total: 0 },
  speaking: { correct: 0, total: 0 },
  writing: { correct: 0, total: 0 },
  pronunciation: { correct: 0, total: 0 },
  translation: { correct: 0, total: 0 },
});

const defaultProfile = (): Profile => ({
  name: "",
  level: "pre-a1",
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  dailyGoal: "normal",
  immersion: "auto",
  englishOnly: false,
  teacherMode: true,
  onboardingDone: false,
  placementDone: false,
  wordsLearned: 0,
  listeningMinutes: 0,
  speakingMinutes: 0,
  writingWords: 0,
  lessonsCompleted: 0,
  achievements: [],
});

export type AppState = {
  hydrated: boolean;
  profile: Profile;
  skills: SkillScores;
  cards: Record<string, Flashcard>;
  mistakes: Mistake[];
  lessonProgress: Record<string, LessonProgress>;
  todayMission: Record<Skill, number>;
  todayDate: string;
  setHydrated: (v: boolean) => void;
  completeOnboarding: (data: {
    name: string;
    level: LevelId;
    dailyGoal: DailyGoal;
    placementDone: boolean;
  }) => void;
  setName: (name: string) => void;
  setLevel: (level: LevelId) => void;
  setDailyGoal: (g: DailyGoal) => void;
  setImmersion: (m: ImmersionMode) => void;
  setEnglishOnly: (v: boolean) => void;
  setTeacherMode: (v: boolean) => void;
  addXp: (n: number) => void;
  touchStreak: () => void;
  ensureCard: (wordId: string) => void;
  gradeCard: (wordId: string, grade: 0 | 1 | 2 | 3, kind?: Flashcard["lastKind"]) => void;
  recordSkill: (skill: Skill, correct: boolean) => void;
  recordMistake: (m: Omit<Mistake, "id" | "count" | "lastSeen">) => void;
  resolveMistakeCheck: (prompt: string, correctAnswer: string) => void;
  clearMistake: (id: string) => void;
  startLesson: (lessonId: string) => void;
  completeLessonStep: (lessonId: string, step: string, score?: number) => void;
  finishLesson: (lessonId: string, score: number, mastery?: { testScore?: number; weakSkills?: Skill[]; threshold?: number }) => void;
  addMission: (skill: Skill, pct: number) => void;
  addListeningMinutes: (m: number) => void;
  addSpeakingMinutes: (m: number) => void;
  addWritingWords: (n: number) => void;
  unlockAchievement: (id: string) => void;
  resetProgress: () => void;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayIso() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const emptyMission = (): Record<Skill, number> => ({
  grammar: 0,
  vocabulary: 0,
  listening: 0,
  reading: 0,
  speaking: 0,
  writing: 0,
  pronunciation: 0,
  translation: 0,
});

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,
      profile: defaultProfile(),
      skills: emptySkills(),
      cards: {},
      mistakes: [],
      lessonProgress: {},
      todayMission: emptyMission(),
      todayDate: todayIso(),
      setHydrated: (v) => set({ hydrated: v }),
      completeOnboarding: ({ name, level, dailyGoal, placementDone }) =>
        set((s) => ({
          profile: {
            ...s.profile,
            name,
            level,
            dailyGoal,
            placementDone,
            placementResult: level,
            onboardingDone: true,
          },
        })),
      setName: (name) => set((s) => ({ profile: { ...s.profile, name } })),
      setLevel: (level) => set((s) => ({ profile: { ...s.profile, level } })),
      setDailyGoal: (dailyGoal) => set((s) => ({ profile: { ...s.profile, dailyGoal } })),
      setImmersion: (immersion) => set((s) => ({ profile: { ...s.profile, immersion } })),
      setEnglishOnly: (englishOnly) => set((s) => ({ profile: { ...s.profile, englishOnly } })),
      setTeacherMode: (teacherMode) => set((s) => ({ profile: { ...s.profile, teacherMode } })),
      addXp: (n) => set((s) => ({ profile: { ...s.profile, xp: s.profile.xp + n } })),
      touchStreak: () =>
        set((s) => {
          const today = todayIso();
          if (s.profile.lastStudyDate === today) return s;
          const streak = s.profile.lastStudyDate === yesterdayIso() ? s.profile.streak + 1 : 1;
          return {
            profile: {
              ...s.profile,
              streak,
              longestStreak: Math.max(s.profile.longestStreak, streak),
              lastStudyDate: today,
            },
          };
        }),
      ensureCard: (wordId) =>
        set((s) => {
          if (s.cards[wordId]) return s;
          return { cards: { ...s.cards, [wordId]: emptyCard(wordId) } };
        }),
      gradeCard: (wordId, grade, kind) =>
        set((s) => {
          const card = s.cards[wordId] ?? emptyCard(wordId);
          const contextKind = kind ?? card.lastKind ?? "word-meaning";
          const graded = reviewCard(markContext(card, contextKind), grade);
          const learned = Object.values({ ...s.cards, [wordId]: graded }).filter(
            (c) => c.state !== "new",
          ).length;
          return {
            cards: { ...s.cards, [wordId]: graded },
            profile: { ...s.profile, wordsLearned: learned },
          };
        }),
      recordSkill: (skill, correct) =>
        set((s) => {
          const cur = s.skills[skill];
          return {
            skills: {
              ...s.skills,
              [skill]: { correct: cur.correct + (correct ? 1 : 0), total: cur.total + 1 },
            },
          };
        }),
      recordMistake: (m) =>
        set((s) => {
          const existing = s.mistakes.find(
            (x) => x.prompt === m.prompt && x.correctAnswer === m.correctAnswer,
          );
          if (existing) {
            return {
              mistakes: s.mistakes.map((x) =>
                x.id === existing.id
                  ? {
                      ...x,
                      count: x.count + 1,
                      lastSeen: Date.now(),
                      userAnswer: m.userAnswer,
                      category: m.category ?? x.category,
                      concept: m.concept ?? x.concept,
                      grammarTarget: m.grammarTarget ?? x.grammarTarget,
                      remediation: m.remediation ?? x.remediation,
                      status: x.status === "resolved" ? "active" : x.status,
                      nextReviewAt: Date.now(),
                    }
                  : x,
              ),
            };
          }
          const item: Mistake = {
            ...m,
            status: m.status ?? "active",
            successfulRechecks: m.successfulRechecks ?? 0,
            nextReviewAt: m.nextReviewAt ?? Date.now(),
            id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            count: 1,
            lastSeen: Date.now(),
          };
          return { mistakes: [item, ...s.mistakes].slice(0, 400) };
        }),
      resolveMistakeCheck: (prompt, correctAnswer) =>
        set((s) => ({
          mistakes: s.mistakes.map((m) => {
            if (m.prompt !== prompt || m.correctAnswer !== correctAnswer) return m;
            const checks = (m.successfulRechecks ?? 0) + 1;
            const resolved = checks >= 2;
            return {
              ...m,
              successfulRechecks: checks,
              status: resolved ? "resolved" : "recovering",
              nextReviewAt: Date.now() + (resolved ? 7 : 1) * 86400000,
            };
          }),
        })),
      clearMistake: (id) => set((s) => ({ mistakes: s.mistakes.filter((x) => x.id !== id) })),
      startLesson: (lessonId) =>
        set((s) => ({
          lessonProgress: {
            ...s.lessonProgress,
            [lessonId]: s.lessonProgress[lessonId] ?? {
              lessonId,
              completed: false,
              step: 0,
              completedSteps: [],
              score: 0,
              startedAt: Date.now(),
            },
          },
        })),
      completeLessonStep: (lessonId, step, score = 0) =>
        set((s) => {
          const cur = s.lessonProgress[lessonId] ?? {
            lessonId,
            completed: false,
            step: 0,
            completedSteps: [],
            score: 0,
            startedAt: Date.now(),
          };
          const steps = cur.completedSteps.includes(step)
            ? cur.completedSteps
            : [...cur.completedSteps, step];
          return {
            lessonProgress: {
              ...s.lessonProgress,
              [lessonId]: { ...cur, completedSteps: steps, score: cur.score + score, step: steps.length },
            },
          };
        }),
      finishLesson: (lessonId, score, mastery) =>
        set((s) => {
          const cur = s.lessonProgress[lessonId];
          const already = cur?.completed;
          const completedCount = already ? s.profile.lessonsCompleted : s.profile.lessonsCompleted + 1;
          const achievements = [...s.profile.achievements];
          if (completedCount >= 1 && !achievements.includes("first-lesson")) achievements.push("first-lesson");
          return {
            lessonProgress: {
              ...s.lessonProgress,
              [lessonId]: {
                ...(cur ?? {
                  lessonId,
                  step: 0,
                  completedSteps: [],
                  score: 0,
                  startedAt: Date.now(),
                }),
                completed: true,
                score,
                completedAt: Date.now(),
                masteryAttempts: (cur?.masteryAttempts ?? 0) + (mastery ? 1 : 0),
                lastTestScore: mastery?.testScore ?? cur?.lastTestScore ?? score,
                bestTestScore: Math.max(cur?.bestTestScore ?? 0, mastery?.testScore ?? score),
                masteryThreshold: mastery?.threshold ?? cur?.masteryThreshold ?? 80,
                masteryWeakSkills: mastery?.weakSkills ?? cur?.masteryWeakSkills ?? [],
                nextReviewAt: mastery
                  ? Date.now() + ((mastery.testScore ?? score) >= 90 ? 14 : (mastery.testScore ?? score) >= 80 ? 7 : (mastery.testScore ?? score) >= 70 ? 3 : 1) * 86400000
                  : cur?.nextReviewAt ?? null,
              },
            },
            profile: { ...s.profile, lessonsCompleted: completedCount, achievements },
          };
        }),
      addMission: (skill, pct) =>
        set((s) => {
          const today = todayIso();
          const mission = s.todayDate === today ? s.todayMission : emptyMission();
          return {
            todayDate: today,
            todayMission: { ...mission, [skill]: Math.max(mission[skill], pct) },
          };
        }),
      addListeningMinutes: (m) =>
        set((s) => ({ profile: { ...s.profile, listeningMinutes: s.profile.listeningMinutes + m } })),
      addSpeakingMinutes: (m) =>
        set((s) => ({ profile: { ...s.profile, speakingMinutes: s.profile.speakingMinutes + m } })),
      addWritingWords: (n) =>
        set((s) => ({ profile: { ...s.profile, writingWords: s.profile.writingWords + n } })),
      unlockAchievement: (id) =>
        set((s) =>
          s.profile.achievements.includes(id)
            ? s
            : { profile: { ...s.profile, achievements: [...s.profile.achievements, id] } },
        ),
      resetProgress: () =>
        set({
          profile: defaultProfile(),
          skills: emptySkills(),
          cards: {},
          mistakes: [],
          lessonProgress: {},
          todayMission: emptyMission(),
          todayDate: todayIso(),
        }),
    }),
    {
      name: "shodlik-education-v1",
      version: 2,
      migrate: (persisted: unknown) => {
        const value = (persisted ?? {}) as Partial<AppState>;
        const cards = Object.fromEntries(
          Object.entries(value.cards ?? {}).map(([id, raw]) => {
            const card = raw as Flashcard;
            return [id, {
              ...emptyCard(card.wordId ?? id),
              ...card,
              lapses: card.lapses ?? card.wrong ?? 0,
              streak: card.streak ?? 0,
              lastReviewedAt: card.lastReviewedAt ?? null,
              introducedAt: card.introducedAt ?? Date.now(),
              leech: card.leech ?? false,
              contexts: {
                ...emptyCard(card.wordId ?? id).contexts,
                ...(card.contexts ?? {}),
              },
            } satisfies Flashcard];
          }),
        );
        return { ...value, cards };
      },
      skipHydration: true,
      partialize: (s) => ({
        profile: s.profile,
        skills: s.skills,
        cards: s.cards,
        mistakes: s.mistakes,
        lessonProgress: s.lessonProgress,
        todayMission: s.todayMission,
        todayDate: s.todayDate,
      }),
    },
  ),
);

export function skillPct(skills: SkillScores, skill: Skill) {
  const s = skills[skill];
  if (!s.total) return 0;
  return Math.round((s.correct / s.total) * 100);
}

export function weakestSkills(skills: SkillScores, n = 2): Skill[] {
  return (Object.keys(skills) as Skill[])
    .filter((k) => skills[k].total >= 4)
    .sort((a, b) => skillPct(skills, a) - skillPct(skills, b))
    .slice(0, n);
}

export function recommendedLevel(from: LevelId, skills: SkillScores): LevelId {
  const avg =
    (skillPct(skills, "grammar") +
      skillPct(skills, "vocabulary") +
      skillPct(skills, "reading") +
      skillPct(skills, "listening")) /
    4;
  const i = LEVEL_ORDER.indexOf(from);
  if (avg >= 85 && i < LEVEL_ORDER.length - 1) return LEVEL_ORDER[i + 1]!;
  if (avg < 45 && i > 0) return LEVEL_ORDER[i - 1]!;
  return from;
}

export function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ");
}

export function answersMatch(expected: string | string[], given: string) {
  const g = normalizeAnswer(given);
  const list = Array.isArray(expected) ? expected : [expected];
  return list.some((e) => normalizeAnswer(e) === g);
}

export function exerciseXp(ex: Exercise) {
  if (ex.skill === "speaking" || ex.skill === "writing") return 30;
  if (ex.skill === "listening") return 20;
  return 10;
}

export type ProgressBackup = {
  version: 1;
  exportedAt: string;
  profile: Profile;
  skills: SkillScores;
  cards: Record<string, Flashcard>;
  mistakes: Mistake[];
  lessonProgress: Record<string, LessonProgress>;
  todayMission: Record<Skill, number>;
  todayDate: string;
};

export function exportProgressBackup(): string {
  const s = useAppStore.getState();
  const backup: ProgressBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: s.profile,
    skills: s.skills,
    cards: s.cards,
    mistakes: s.mistakes,
    lessonProgress: s.lessonProgress,
    todayMission: s.todayMission,
    todayDate: s.todayDate,
  };
  return JSON.stringify(backup, null, 2);
}

export function importProgressBackup(raw: string): { ok: true } | { ok: false; error: string } {
  try {
    const value = JSON.parse(raw) as Partial<ProgressBackup>;
    if (value.version !== 1 || !value.profile || !value.skills || !value.cards || !value.lessonProgress) {
      return { ok: false, error: "Backup fayli Shodlik Education formatida emas." };
    }
    if (!LEVEL_ORDER.includes(value.profile.level)) {
      return { ok: false, error: "Backupdagi CEFR darajasi noto‘g‘ri." };
    }
    if (!Array.isArray(value.mistakes)) {
      return { ok: false, error: "Backupdagi xatolar bo‘limi noto‘g‘ri." };
    }
    useAppStore.setState({
      profile: value.profile,
      skills: value.skills,
      cards: value.cards,
      mistakes: value.mistakes,
      lessonProgress: value.lessonProgress,
      todayMission: value.todayMission ?? emptyMission(),
      todayDate: value.todayDate ?? todayIso(),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Backup faylini o‘qib bo‘lmadi." };
  }
}
