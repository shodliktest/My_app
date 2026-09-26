import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentSkill, Level, SkillId } from "./types";

export type SkillStats = { correct: number; total: number; xp: number };

const EMPTY_STATS: SkillStats = { correct: 0, total: 0, xp: 0 };

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayKey(d = new Date()): string {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return todayKey(y);
}

export type ProgressState = {
  onboarded: boolean;
  name: string;
  level: Level;
  xp: number;
  streak: number;
  lastActiveDate: string;
  dailyGoal: number;
  dailyDone: number;
  dailyDate: string;
  sound: boolean;
  lastSkill: SkillId | "review" | null;
  seenIds: string[];
  weakIds: string[];
  skillStats: Record<ContentSkill, SkillStats>;
  completeOnboarding: (level: Level, name: string) => void;
  setName: (name: string) => void;
  setLevel: (level: Level) => void;
  setDailyGoal: (n: number) => void;
  setSound: (on: boolean) => void;
  recordAnswer: (opts: {
    exerciseId: string;
    skill: ContentSkill;
    correct: boolean;
    xp: number;
  }) => void;
  finishSession: (skill: SkillId | "review") => void;
  resetProgress: () => void;
};

const initialStats = (): Record<ContentSkill, SkillStats> => ({
  vocab: { ...EMPTY_STATS },
  translate: { ...EMPTY_STATS },
  grammar: { ...EMPTY_STATS },
  writing: { ...EMPTY_STATS },
  listening: { ...EMPTY_STATS },
});

function withDayRollover<
  T extends Pick<ProgressState, "dailyDate" | "dailyDone" | "streak" | "lastActiveDate">,
>(state: T): T {
  const today = todayKey();
  if (state.dailyDate === today) return state;
  return { ...state, dailyDate: today, dailyDone: 0 };
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      name: "",
      level: "A1",
      xp: 0,
      streak: 0,
      lastActiveDate: "",
      dailyGoal: 8,
      dailyDone: 0,
      dailyDate: "",
      sound: true,
      lastSkill: null,
      seenIds: [],
      weakIds: [],
      skillStats: initialStats(),
      completeOnboarding: (level, name) =>
        set({
          onboarded: true,
          level,
          name: name.trim(),
        }),
      setName: (name) => set({ name }),
      setLevel: (level) => set({ level }),
      setDailyGoal: (n) => set({ dailyGoal: n }),
      setSound: (on) => set({ sound: on }),
      recordAnswer: ({ exerciseId, skill, correct, xp }) => {
        const today = todayKey();
        const rolled = withDayRollover(get());
        let streak = rolled.streak;
        let lastActiveDate = rolled.lastActiveDate;
        if (lastActiveDate !== today) {
          if (lastActiveDate === yesterdayKey()) streak += 1;
          else streak = 1;
          lastActiveDate = today;
        }
        const stats = { ...rolled.skillStats };
        const cur = stats[skill];
        stats[skill] = {
          correct: cur.correct + (correct ? 1 : 0),
          total: cur.total + 1,
          xp: cur.xp + xp,
        };
        const seenIds = rolled.seenIds.includes(exerciseId)
          ? rolled.seenIds
          : [...rolled.seenIds, exerciseId];
        let weakIds = rolled.weakIds.filter((id) => id !== exerciseId);
        if (!correct) weakIds = [...weakIds, exerciseId];
        set({
          ...rolled,
          xp: rolled.xp + xp,
          streak,
          lastActiveDate,
          dailyDone: rolled.dailyDone + 1,
          skillStats: stats,
          seenIds,
          weakIds,
        });
      },
      finishSession: (skill) => set({ lastSkill: skill }),
      resetProgress: () =>
        set({
          xp: 0,
          streak: 0,
          lastActiveDate: "",
          dailyDone: 0,
          dailyDate: todayKey(),
          seenIds: [],
          weakIds: [],
          lastSkill: null,
          skillStats: initialStats(),
        }),
    }),
    {
      name: "elli-progress-v1",
      partialize: (s) => ({
        onboarded: s.onboarded,
        name: s.name,
        level: s.level,
        xp: s.xp,
        streak: s.streak,
        lastActiveDate: s.lastActiveDate,
        dailyGoal: s.dailyGoal,
        dailyDone: s.dailyDone,
        dailyDate: s.dailyDate,
        sound: s.sound,
        lastSkill: s.lastSkill,
        seenIds: s.seenIds,
        weakIds: s.weakIds,
        skillStats: s.skillStats,
      }),
    },
  ),
);
