import type {
  Exercise,
  GrammarBlock,
  Lesson,
  ListeningMaterial,
  Phrase,
  ReadingMaterial,
  Word,
} from "@/lib/types";

export function word(w: Word): Word {
  return w;
}

export function phrase(p: Phrase): Phrase {
  return p;
}

export function mcq(
  id: string,
  prompt: string,
  options: string[],
  answer: string,
  explanation: string,
  explanationUz: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return {
    id,
    type: "mcq",
    skill: extra.skill ?? "grammar",
    prompt,
    options,
    answer,
    explanation,
    explanationUz,
    hint1: extra.hint1 ?? answer.slice(0, 1),
    hint2: extra.hint2 ?? explanation,
    hint3: extra.hint3 ?? `Look at: ${answer}`,
    ...extra,
  };
}

export function gap(
  id: string,
  prompt: string,
  answer: string,
  explanation: string,
  explanationUz: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return {
    id,
    type: "gap",
    skill: extra.skill ?? "grammar",
    prompt,
    answer,
    explanation,
    explanationUz,
    hint1: extra.hint1 ?? answer.slice(0, 1),
    hint2: extra.hint2 ?? explanation,
    hint3: extra.hint3 ?? answer,
    ...extra,
  };
}

export function order(
  id: string,
  tokens: string[],
  answer: string,
  explanation: string,
  explanationUz: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return {
    id,
    type: "order",
    skill: extra.skill ?? "grammar",
    prompt: extra.prompt ?? "Put the words in the correct order.",
    promptUz: extra.promptUz ?? "So‘zlarni to‘g‘ri tartibda joylashtiring.",
    tokens,
    answer,
    explanation,
    explanationUz,
    ...extra,
  };
}

export function errx(
  id: string,
  text: string,
  answer: string,
  explanation: string,
  explanationUz: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return {
    id,
    type: "error",
    skill: extra.skill ?? "grammar",
    prompt: extra.prompt ?? "Correct the mistake.",
    promptUz: extra.promptUz ?? "Xatoni tuzating.",
    text,
    answer,
    explanation,
    explanationUz,
    ...extra,
  };
}

export function tr(
  id: string,
  prompt: string,
  answer: string,
  explanation: string,
  extra: Partial<Exercise> = {},
): Exercise {
  return {
    id,
    type: "translate",
    skill: extra.skill ?? "translation",
    prompt,
    promptUz: extra.promptUz,
    answer,
    explanation,
    explanationUz: extra.explanationUz ?? explanation,
    ...extra,
  };
}

export function listen(
  title: string,
  titleUz: string,
  lines: { en: string; uz: string }[],
  questions: Exercise[],
): ListeningMaterial {
  let t = 0;
  return {
    title,
    titleUz,
    script: lines.map((line) => {
      const item = { t, en: line.en, uz: line.uz };
      t += Math.max(2, Math.round(line.en.split(" ").length * 0.45));
      return item;
    }),
    questions,
  };
}

export function reading(
  title: string,
  titleUz: string,
  text: string,
  questions: Exercise[],
  summaryPrompt: string,
): ReadingMaterial {
  return {
    title,
    titleUz,
    text,
    words: text.trim().split(/\s+/).length,
    questions,
    summaryPrompt,
  };
}

export function lesson(l: Lesson): Lesson {
  return l;
}

export function grammar(g: GrammarBlock): GrammarBlock {
  return g;
}
