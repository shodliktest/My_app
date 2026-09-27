import type { ErrorCategory, Exercise, Lesson, LevelId, Mistake, Skill, SkillScores } from "@/lib/types";
import { analyzeError } from "@/lib/error-intelligence";
import { skillPct } from "@/lib/mastery";

export type TutorContext = {
  level: LevelId;
  englishOnly: boolean;
  teacherMode: boolean;
  skills: SkillScores;
  mistakes: Mistake[];
  lesson?: Lesson;
};

export type TutorTurn = {
  mode: "local";
  stage: "diagnose" | "hint" | "teach" | "retry" | "extend";
  category: ErrorCategory | null;
  title: string;
  message: string;
  hint?: string;
  microLesson?: string;
  task: string;
  expected?: string;
};

const LEVEL_CAP: Record<LevelId, number> = {
  "pre-a1": 1,
  a1: 1,
  a2: 2,
  b1: 2,
  "b1-plus": 3,
  b2: 3,
  "b2-plus": 4,
  c1: 4,
};

function clean(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

function normalize(s: string) {
  return clean(s).toLowerCase().replace(/[.?!,;:]+$/g, "");
}

function isPatternResolved(text: string, category: ErrorCategory): boolean {
  const s = normalize(text);
  if (category === "form-morphology") return /\b(have|has)\s+gone\b/.test(s) && !/\b(have|has)\s+went\b/.test(s);
  if (category === "tense-choice") return /\byesterday\b/.test(s) && !/\b(i|he|she|we|they)\s+(have|has)\b/.test(s);
  if (category === "auxiliary-word-order") return !/\bdoes\s+\w+\s+\w+s\b/.test(s);
  if (category === "prepositions") return !/\bdepend of\b/.test(s);
  if (category === "collocation") return /\bmake a decision\b/.test(s) && !/\bdo a decision\b/.test(s);
  return false;
}

function isQuestion(s: string) {
  return /^(why|what|when|where|which|how|can|could|should|would|do|does|did|is|are|was|were|have|has)\b/i.test(s.trim());
}

function detectLocalPattern(text: string): { category: ErrorCategory; concept: string; correction: string; explanation: string; hint: string } | null {
  const s = text.toLowerCase();
  if (/\bi have went\b|\bi has gone\b|\bhas went\b|\bhave went\b/.test(s)) {
    return {
      category: "form-morphology",
      concept: "Present Perfect + irregular past participle",
      correction: text.replace(/\b(have|has) went\b/gi, "$1 gone"),
      explanation: "Present Perfect uses have/has + past participle. The past participle of go is gone.",
      hint: "After have/has, use the past participle. Check the verb go.",
    };
  }
  if (/\byesterday\b/.test(s) && /\b(i|he|she|we|they)\s+(have|has)\b/i.test(s)) {
    return {
      category: "tense-choice",
      concept: "finished past time vs Present Perfect",
      correction: text.replace(/\b(have|has)\s+(gone|been|done|seen|eaten|taken|made|written|read|worked)\b/gi, "went"),
      explanation: "A finished time marker such as yesterday normally calls for Past Simple, not Present Perfect.",
      hint: "Look at the time marker. Is the time finished?",
    };
  }
  if (/\bdoes\s+\w+\s+\w+s\b/i.test(s)) {
    return {
      category: "auxiliary-word-order",
      concept: "do/does + base verb",
      correction: text.replace(/(does\s+\w+\s+)\w+s\b/i, "$1WORK"),
      explanation: "After does, the main verb returns to the base form.",
      hint: "After does, remove the -s from the main verb.",
    };
  }
  if (/\bdepend of\b/i.test(s)) {
    return {
      category: "prepositions",
      concept: "depend on",
      correction: text.replace(/depend of/gi, "depend on"),
      explanation: "The standard English collocation is depend on.",
      hint: "This verb has a fixed preposition. Think: depend ___ someone.",
    };
  }
  if (/\bmake a decision\b/i.test(s)) return null;
  if (/\bdo a decision\b/i.test(s)) {
    return {
      category: "collocation",
      concept: "make a decision",
      correction: text.replace(/do a decision/gi, "make a decision"),
      explanation: "English normally uses make a decision, not do a decision.",
      hint: "Think about the common verb that goes with decision.",
    };
  }
  return null;
}

function weakestSkill(skills: SkillScores): Skill | null {
  const candidates = Object.entries(skills)
    .filter(([, v]) => v.total >= 3)
    .sort((a, b) => skillPct(skills, a[0] as Skill) - skillPct(skills, b[0] as Skill));
  return (candidates[0]?.[0] as Skill | undefined) ?? null;
}

function lessonExerciseFor(text: string, lesson?: Lesson): Exercise | undefined {
  if (!lesson) return undefined;
  const words = text.toLowerCase().split(/\W+/).filter(Boolean).slice(0, 8);
  return [...lesson.exercises, ...lesson.test, ...lesson.reading.questions, ...lesson.listening.questions].find((ex) => {
    const hay = `${ex.prompt} ${ex.explanation} ${ex.assessment?.grammarTarget ?? ""}`.toLowerCase();
    return words.some((w) => w.length > 4 && hay.includes(w));
  });
}

export function buildTutorTurn(input: string, ctx: TutorContext, attempt = 0): TutorTurn {
  const text = clean(input);
  const pattern = detectLocalPattern(text);
  const normalized = normalize(text);
  const active = ctx.mistakes.find((m) => m.status !== "resolved" && (normalize(m.prompt).includes(normalized) || normalized.includes(normalize(m.userAnswer))));
  const exercise = lessonExerciseFor(text, ctx.lesson);
  const analysis = exercise ? analyzeError(exercise, text) : null;
  const category = pattern?.category ?? active?.category ?? analysis?.category ?? null;
  const weak = weakestSkill(ctx.skills);
  const level = ctx.level.toUpperCase().replace("-PLUS", "+");
  const cap = LEVEL_CAP[ctx.level];
  const uz = !ctx.englishOnly;

  if (!text) {
    return {
      mode: "local",
      stage: "diagnose",
      category: null,
      title: "Teacher check-in",
      message: uz ? `Bugun ${level} darajangiz uchun bitta kichik muammoni tanlaymiz. Gap yozing yoki savol bering.` : `Let's work on one small ${level}-level problem today. Write a sentence or ask a question.`,
      task: weak ? `Start with a sentence using your weaker ${weak} skill.` : "Write one English sentence about your day.",
    };
  }

  if (isQuestion(text) && !pattern && !active) {
    const lessonHint = ctx.lesson?.grammar;
    return {
      mode: "local",
      stage: "teach",
      category: null,
      title: "Teacher explanation",
      message: uz
        ? `${lessonHint?.titleUz ?? "Bu savolni"} bo‘yicha asosiy qoida: avval gapning vazifasi va tense/structure-ni aniqlaymiz. Keyin formani tekshiramiz.`
        : `${lessonHint?.title ?? "For this question"}, first identify the sentence function and tense/structure. Then check the form.`,
      microLesson: lessonHint ? (uz ? lessonHint.whyUz : lessonHint.why) : undefined,
      task: uz ? "Endi o‘z misolingizni yozing; men faqat keyingi qadam uchun hint beraman." : "Now write your own example; I will give only the next-step hint.",
    };
  }

  if (pattern) {
    if (isPatternResolved(text, pattern.category)) {
      return {
        mode: "local", stage: "extend", category: pattern.category, title: "Good correction",
        message: uz ? "To‘g‘ri tuzatdingiz. Endi shu qoidani yangi kontekstda tekshiramiz." : "Good correction. Now let’s check whether you can transfer the rule to a new context.",
        microLesson: uz ? pattern.explanation : undefined,
        task: pattern.category === "tense-choice" ? "Write one sentence with yesterday and one with since 2024." : `Write a new sentence using ${pattern.concept}.`,
      };
    }
    if (attempt === 0) {
      return {
        mode: "local", stage: "hint", category: pattern.category, title: "Bitta joyni tekshiramiz",
        message: uz ? `${pattern.concept} bo‘yicha kichik signal bor. Darhol javobni bermayman.` : `There is a small issue with ${pattern.concept}. I won't give the answer immediately.`,
        hint: pattern.hint,
        microLesson: uz ? pattern.explanation : undefined,
        task: uz ? "Gapni qayta yozing. Ayniqsa hint ko‘rsatgan joyni tekshiring." : "Rewrite the sentence. Check the part highlighted by the hint.",
        expected: pattern.correction,
      };
    }
    if (attempt === 1) {
      return {
        mode: "local", stage: "teach", category: pattern.category, title: "Qoida",
        message: uz ? pattern.explanation : pattern.explanation,
        hint: pattern.hint,
        task: "Rewrite the sentence using the rule above.",
        expected: pattern.correction,
      };
    }
    return {
      mode: "local", stage: "extend", category: pattern.category, title: "Transfer practice",
      message: uz ? "Endi shu qoidani yangi kontekstda ishlatamiz. Bu xatoni haqiqatan o‘zlashtirishga yordam beradi." : "Now transfer the rule to a new context. This checks whether the correction is truly learned.",
      task: pattern.category === "tense-choice" ? "Write one sentence with yesterday and one with since 2024." : `Write a new sentence using ${pattern.concept}.`,
    };
  }

  if (active || analysis) {
    const lessonText = active?.remediation?.microLesson ?? analysis?.microLesson;
    const steps = active?.remediation?.steps ?? analysis?.steps ?? [];
    const step = steps[Math.min(attempt, Math.max(steps.length - 1, 0))];
    return {
      mode: "local", stage: attempt === 0 ? "diagnose" : "retry", category,
      title: active ? "Your error bank found a target" : "Targeted teacher feedback",
      message: uz ? `Bu safar ${active?.concept ?? analysis?.concept ?? "shu strukturani"} ustida ishlaymiz.` : `This turn targets ${active?.concept ?? analysis?.concept ?? "this structure"}.`,
      microLesson: uz ? lessonText : undefined,
      hint: step,
      task: active ? "Xuddi shu qoidani boshqa gapda qo‘llang." : "Rewrite your sentence using the hint, then make one new example.",
    };
  }

  const scaffold = cap <= 1 ? "Use a short subject + verb + object sentence." : cap === 2 ? "Add one time, place, or reason phrase." : "Add a contrast, reason, or condition to make the idea more precise.";
  return {
    mode: "local", stage: "extend", category: null, title: "Teacher practice",
    message: uz ? `Gap tushunarli. Endi uni ${level} darajasiga mos ravishda biroz boyitamiz.` : `The sentence is workable. Now let's stretch it to your ${level} level.`,
    task: scaffold,
  };
}
