import type { Exercise, GrammarBlock, Lesson, ListeningMaterial, Phrase, ReadingMaterial, Word } from "@/lib/types";
import { errx, gap, listen, mcq, order, reading, tr } from "@/lib/content/helpers";

export function pack(p: {
  id: string;
  day: number;
  level: Lesson["level"];
  topic: string;
  topicUz: string;
  cefrCanDo: string;
  cefrCanDoUz: string;
  grammar: GrammarBlock;
  vocabulary: Word[];
  phrases: Phrase[];
  listenTitle: string;
  listenTitleUz: string;
  lines: { en: string; uz: string }[];
  readTitle: string;
  readTitleUz: string;
  readText: string;
  speaking: Lesson["speaking"];
  writing: Lesson["writing"];
  extras?: Exercise[];
  isReview?: boolean;
}): Lesson {
  const pid = p.id;
  const g = p.grammar;
  const ex0 = g.examples[0];
  const ex1 = g.examples[1] ?? g.examples[0];
  const m0 = g.mistakes[0];
  const m1 = g.mistakes[1] ?? g.mistakes[0];
  const w0 = p.vocabulary[0]!;
  const w1 = p.vocabulary[1] ?? w0;
  const w2 = p.vocabulary[2] ?? w0;
  const sent = ex0?.en ?? `I use ${w0.word}.`;
  const tokens = sent.replace(/[.,!?]/g, "").split(" ").filter(Boolean);

  const listenQs: Exercise[] = [
    mcq(
      `${pid}-lq1`,
      `Listening: which line is in the dialogue?`,
      [p.lines[0]?.en ?? sent, "See you on Mars.", "I have 400 books only.", "Good night, class, at 9am."],
      p.lines[0]?.en ?? sent,
      "It is the first line of the audio.",
      "Bu audio birinchi qatori.",
      { skill: "listening" },
    ),
    gap(
      `${pid}-lq2`,
      `Key word from the topic: ___ (${w0.uz})`,
      w0.word,
      `${w0.word} means ${w0.definition}.`,
      `${w0.word} — ${w0.uz}.`,
      { skill: "listening", audioText: p.lines.map((l) => l.en).join(" ") },
    ),
  ];

  const readQs: Exercise[] = [
    mcq(
      `${pid}-rq1`,
      "What is the reading mainly about?",
      [p.topic, "Space travel only", "Cooking pasta only", "Football scores only"],
      p.topic,
      "The title and first lines match the topic.",
      "Mavzu matn bilan mos.",
      { skill: "reading" },
    ),
    mcq(
      `${pid}-rq2`,
      `Which word appears in this lesson’s vocabulary?`,
      [w0.word, "photosynthesis", "quantum", "bureaucracy"],
      w0.word,
      `${w0.word} is a target word.`,
      `${w0.word} — dars so‘zi.`,
      { skill: "reading" },
    ),
  ];

  const generated: Exercise[] = [
    mcq(
      `${pid}-e1`,
      g.examples[0] ? `Choose the correct sentence.` : `Choose the form.`,
      [ex0?.en ?? sent, m0?.wrong ?? "I is student.", "Me am go.", "She are here."],
      ex0?.en ?? sent,
      g.why,
      g.whyUz,
    ),
    gap(`${pid}-e2`, `Write the English for: ${w0.uz}`, w0.word, w0.definition, `${w0.word} — ${w0.uz}.`, { skill: "vocabulary" }),
    order(`${pid}-e3`, tokens.length >= 3 ? tokens : ["I", "am", "ready"], sent.replace(/[.,!?]/g, ""), g.form, g.formUz),
    errx(`${pid}-e4`, m0.wrong, m0.right, m0.why, m0.whyUz),
    tr(`${pid}-e5`, ex0?.uz ?? w0.uz, ex0?.en ?? w0.word, g.meaning, { explanationUz: g.meaningUz }),
    mcq(
      `${pid}-e6`,
      `${w1.word} is a…`,
      [w1.pos, "preposition", "emoji", "silence"],
      w1.pos,
      `${w1.word} is a ${w1.pos}.`,
      `${w1.word} — ${w1.pos}.`,
      { skill: "vocabulary" },
    ),
    gap(`${pid}-e7`, w1.example.replace(new RegExp(w1.word, "i"), "___"), w1.word, w1.example, w1.exampleUz, { skill: "vocabulary" }),
    errx(`${pid}-e8`, m1.wrong, m1.right, m1.why, m1.whyUz),
    tr(`${pid}-e9`, w2.uz, w2.word, w2.definition, { explanationUz: w2.uz, skill: "vocabulary" }),
    mcq(
      `${pid}-e10`,
      `Negative idea: ${g.negative.form}`,
      [g.negative.examples[0]?.en ?? "I am not ready.", "I no am ready.", "I not ready am.", "Ready I no."],
      g.negative.examples[0]?.en ?? "I am not ready.",
      g.negative.form,
      g.formUz,
    ),
    ...(p.extras ?? []),
  ];

  const test: Exercise[] = [
    mcq(`${pid}-t1`, `Topic check: ${p.topic}`, [ex1?.en ?? sent, "I no understand nothing.", "Yesterday I going.", "She have 20 years."], ex1?.en ?? sent, g.why, g.whyUz),
    gap(`${pid}-t2`, `Translate to English concept: ${w0.uz} →`, w0.word, w0.definition, w0.uz, { skill: "vocabulary" }),
    order(`${pid}-t3`, (ex1?.en ?? sent).replace(/[.,!?]/g, "").split(" ").filter(Boolean), (ex1?.en ?? sent).replace(/[.,!?]/g, ""), g.form, g.formUz),
    errx(`${pid}-t4`, m0.wrong, m0.right, m0.why, m0.whyUz),
    tr(`${pid}-t5`, ex1?.uz ?? w1.uz, ex1?.en ?? w1.word, g.meaning, { explanationUz: g.meaningUz }),
    mcq(`${pid}-t6`, `Question form: ${g.question.form}`, [g.question.examples[0]?.en ?? "Are you ready?", "You are ready?", "Ready you are?", "Do is you ready?"], g.question.examples[0]?.en ?? "Are you ready?", g.question.form, g.formUz),
    gap(`${pid}-t7`, w2.example.includes(w2.word) ? w2.example.replace(w2.word, "___") : `Write: ${w2.word}`, w2.word, w2.definition, w2.uz, { skill: "vocabulary" }),
    mcq(`${pid}-t8`, `${w0.word} — meaning?`, [w0.definition, "a kind of silence", "a colour of zero", "a past tense of please"], w0.definition, w0.definition, w0.uz, { skill: "vocabulary" }),
  ];

  const listening: ListeningMaterial = listen(p.listenTitle, p.listenTitleUz, p.lines, listenQs);
  const read: ReadingMaterial = reading(p.readTitle, p.readTitleUz, p.readText, readQs, `Summarise: ${p.topic}`);

  return {
    id: p.id,
    day: p.day,
    level: p.level,
    topic: p.topic,
    topicUz: p.topicUz,
    cefrCanDo: p.cefrCanDo,
    cefrCanDoUz: p.cefrCanDoUz,
    grammar: p.grammar,
    vocabulary: p.vocabulary,
    phrases: p.phrases,
    listening,
    reading: read,
    speaking: p.speaking,
    writing: p.writing,
    exercises: generated,
    test,
    isReview: p.isReview,
  };
}

export function W(
  level: Word["level"],
  id: string,
  word: string,
  uz: string,
  pos: Word["pos"],
  ipa: string,
  definition: string,
  example: string,
  exampleUz: string,
  category: string,
  icon: string,
  extra: Partial<Word> = {},
): Word {
  return {
    id, word, uz, pos, ipa, definition, example, exampleUz,
    collocations: extra.collocations ?? [],
    synonyms: extra.synonyms ?? [],
    antonyms: extra.antonyms ?? [],
    family: extra.family ?? [],
    level, category, icon,
  };
}

export function ph(id: string, phrase: string, uz: string, ipa: string, example: string, exampleUz: string, speakingTask: string): Phrase {
  return { id, phrase, uz, ipa, example, exampleUz, speakingTask };
}
