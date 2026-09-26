export const SKILL_IDS = [
  "vocab",
  "translate",
  "grammar",
  "writing",
  "listening",
  "mix",
] as const;

export type SkillId = (typeof SKILL_IDS)[number];
export type ContentSkill = Exclude<SkillId, "mix">;
export type Level = "A1" | "A2" | "B1";

export type McqExercise = {
  id: string;
  skill: ContentSkill;
  level: Level;
  kind: "mcq";
  prompt: string;
  promptEn?: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explain: string;
};

export type TypeExercise = {
  id: string;
  skill: ContentSkill;
  level: Level;
  kind: "type";
  prompt: string;
  answers: string[];
  placeholder?: string;
  explain: string;
};

export type OrderExercise = {
  id: string;
  skill: ContentSkill;
  level: Level;
  kind: "order";
  prompt: string;
  words: string[];
  answer: string;
  explain: string;
};

export type TapErrorExercise = {
  id: string;
  skill: ContentSkill;
  level: Level;
  kind: "tap-error";
  prompt: string;
  tokens: string[];
  wrongIndex: number;
  correction: string;
  explain: string;
};

export type ListenMcqExercise = {
  id: string;
  skill: ContentSkill;
  level: Level;
  kind: "listen-mcq";
  speak: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explain: string;
};

export type ListenTypeExercise = {
  id: string;
  skill: ContentSkill;
  level: Level;
  kind: "listen-type";
  speak: string;
  answers: string[];
  explain: string;
};

export type Exercise =
  | McqExercise
  | TypeExercise
  | OrderExercise
  | TapErrorExercise
  | ListenMcqExercise
  | ListenTypeExercise;

export type Phrase = {
  id: string;
  category: string;
  en: string;
  uz: string;
};
