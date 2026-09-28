export const LEVELS = [
  "pre-a1",
  "a1",
  "a2",
  "b1",
  "b1-plus",
  "b2",
  "b2-plus",
  "c1",
] as const;

export type LevelId = (typeof LEVELS)[number];

export const SKILLS = [
  "grammar",
  "vocabulary",
  "listening",
  "reading",
  "speaking",
  "writing",
  "pronunciation",
  "translation",
] as const;

export type Skill = (typeof SKILLS)[number];

export type DailyGoal = "quick" | "normal" | "full";
export type ImmersionMode = "auto" | "uz" | "en";
export type CardKind =
  | "image-word"
  | "word-meaning"
  | "uz-en"
  | "en-uz"
  | "audio-word"
  | "sentence-gap"
  | "picture-sentence"
  | "speaking"
  | "writing";

export type VocabStatus = "new" | "learning" | "review" | "mastered";

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "determiner"
  | "phrase"
  | "interjection"
  | "numeral";

export type Word = {
  id: string;
  word: string;
  uz: string;
  pos: PartOfSpeech;
  ipa: string;
  definition: string;
  example: string;
  exampleUz: string;
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  family: { form: string; pos: PartOfSpeech }[];
  level: LevelId;
  category: string;
  icon: string;
};

export type Phrase = {
  id: string;
  phrase: string;
  uz: string;
  ipa: string;
  example: string;
  exampleUz: string;
  dialogue?: [string, string][];
  speakingTask: string;
};

export type GrammarBlock = {
  title: string;
  titleUz: string;
  meaning: string;
  meaningUz: string;
  form: string;
  formUz: string;
  why: string;
  whyUz: string;
  examples: { en: string; uz: string }[];
  negative: { form: string; examples: { en: string; uz: string }[] };
  question: { form: string; examples: { en: string; uz: string }[] };
  mistakes: { wrong: string; right: string; why: string; whyUz: string }[];
  contrast?: { vs: string; a: string; b: string; note: string; noteUz: string };
};

export type ExerciseType =
  | "mcq"
  | "gap"
  | "order"
  | "error"
  | "translate"
  | "transform"
  | "question-form"
  | "tense"
  | "find-mistake"
  | "rewrite"
  | "complete"
  | "dictation"
  | "listen-gap"
  | "speaking"
  | "ai-correct";

export type AssessmentMetadata = {
  cefr: LevelId;
  difficulty: 1 | 2 | 3 | 4 | 5;
  cognitiveDemand: "recognition" | "controlled-use" | "application" | "analysis" | "synthesis";
  itemType: "selected-response" | "constructed-response" | "ordering" | "transformation" | "listening" | "speaking";
  grammarTarget?: string;
  commonError?: string;
  discriminationTag?: string;
};

export type Exercise = {
  id: string;
  type: ExerciseType;
  skill: Skill;
  prompt: string;
  promptUz?: string;
  text?: string;
  audioText?: string;
  options?: string[];
  tokens?: string[];
  answer: string | string[];
  explanation: string;
  explanationUz: string;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  similarId?: string;
  assessment?: AssessmentMetadata;
};

export type ListeningMaterial = {
  title: string;
  titleUz: string;
  script: { t: number; en: string; uz: string }[];
  questions: Exercise[];
};

export type ReadingMaterial = {
  title: string;
  titleUz: string;
  text: string;
  words: number;
  questions: Exercise[];
  inference?: string;
  summaryPrompt: string;
};

export type Lesson = {
  id: string;
  day: number;
  level: LevelId;
  topic: string;
  topicUz: string;
  cefrCanDo: string;
  cefrCanDoUz: string;
  grammar: GrammarBlock;
  vocabulary: Word[];
  phrases: Phrase[];
  listening: ListeningMaterial;
  reading: ReadingMaterial;
  speaking: { prompt: string; promptUz: string; scaffolding: string[] };
  writing: { prompt: string; promptUz: string; minWords: number; scaffolding: string[] };
  exercises: Exercise[];
  test: Exercise[];
  isReview?: boolean;
  curriculum?: {
    sequence: number;
    levelSequence: number;
    unit: number;
    phase: string;
    prerequisiteIds: string[];
    spacedReviewIds: string[];
    reviewType?: "retrieval" | "bridge" | "mastery";
  };
};

export type Flashcard = {
  wordId: string;
  state: VocabStatus;
  intervalDays: number;
  ease: number;
  due: number;
  reviews: number;
  correct: number;
  wrong: number;
  lapses: number;
  streak: number;
  lastReviewedAt: number | null;
  introducedAt: number;
  lastKind: CardKind | null;
  leech: boolean;
  contexts: {
    meaning: boolean;
    enUz: boolean;
    uzEn: boolean;
    audio: boolean;
    sentence: boolean;
    speaking: boolean;
    writing: boolean;
  };
};

export type ErrorCategory =
  | "tense-choice"
  | "auxiliary-word-order"
  | "form-morphology"
  | "articles-determiners"
  | "prepositions"
  | "lexical-choice"
  | "collocation"
  | "translation-transfer"
  | "listening-discrimination"
  | "meaning-inference"
  | "target-form"
  | "spelling"
  | "other";

export type ErrorStatus = "active" | "recovering" | "resolved";

export type Mistake = {
  id: string;
  type: string;
  skill: Skill;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  count: number;
  lastSeen: number;
  lessonId?: string;
  category?: ErrorCategory;
  concept?: string;
  grammarTarget?: string;
  status?: ErrorStatus;
  successfulRechecks?: number;
  nextReviewAt?: number | null;
  remediation?: {
    microLesson: string;
    steps: string[];
    contrast?: string;
  };
};

export type SkillScores = Record<Skill, { correct: number; total: number }>;

export type LessonProgress = {
  lessonId: string;
  completed: boolean;
  step: number;
  completedSteps: string[];
  score: number;
  startedAt: number;
  completedAt?: number;
  masteryAttempts?: number;
  lastTestScore?: number;
  bestTestScore?: number;
  masteryThreshold?: number;
  masteryWeakSkills?: Skill[];
  nextReviewAt?: number | null;
};

export type Profile = {
  name: string;
  level: LevelId;
  xp: number;
  streak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  dailyGoal: DailyGoal;
  immersion: ImmersionMode;
  englishOnly: boolean;
  teacherMode: boolean;
  onboardingDone: boolean;
  placementDone: boolean;
  placementResult?: LevelId;
  wordsLearned: number;
  listeningMinutes: number;
  speakingMinutes: number;
  writingWords: number;
  lessonsCompleted: number;
  achievements: string[];
};

export type DayModeStep =
  | "mission"
  | "srs"
  | "vocab"
  | "grammar"
  | "grammar-practice"
  | "listening"
  | "shadowing"
  | "reading"
  | "speaking"
  | "writing"
  | "test"
  | "done";
