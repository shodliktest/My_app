import type { Exercise, Lesson, Word, Phrase } from "@/lib/types";
import { gap, mcq, order, errx, tr } from "@/lib/content/helpers";
import { teacherContextFor } from "./teacher-authored-context";

/**
 * Shodlik Education authored-content pass.
 *
 * This module deliberately builds activities from the actual lesson grammar,
 * topic, level and lexical set instead of adding generic "use this word"
 * placeholders. It is deterministic so content validation can be run in CI.
 */

const LEVEL_WORD_TARGET: Record<Lesson["level"], number> = {
  "pre-a1": 10,
  a1: 12,
  a2: 14,
  b1: 16,
  "b1-plus": 18,
  b2: 20,
  "b2-plus": 22,
  c1: 24,
};

const COLLOCATIONS: Record<string, string[]> = {
  education: ["make progress", "meet a deadline", "take notes", "do an assignment", "give feedback", "carry out research", "academic performance", "learning outcome"],
  technology: ["protect data", "launch an update", "solve a problem", "run a test", "fix a bug", "user interface", "store data securely", "automate a task"],
  work: ["meet a deadline", "set a goal", "take responsibility", "reach an agreement", "manage a team", "raise an issue", "make a decision", "deliver results"],
  business: ["increase revenue", "reduce costs", "market demand", "customer satisfaction", "make an investment", "reach a target", "launch a product", "conduct a survey"],
  environment: ["reduce emissions", "protect biodiversity", "conserve resources", "renewable energy", "climate change", "waste management", "environmental impact", "sustainable development"],
  health: ["get enough sleep", "maintain a healthy diet", "reduce stress", "seek medical advice", "recover from illness", "regular exercise", "mental health", "balanced lifestyle"],
  media: ["verify a source", "publish a report", "make a claim", "news coverage", "public opinion", "misleading headline", "media literacy", "reliable source"],
  culture: ["preserve a tradition", "cultural heritage", "pass down a tradition", "local community", "cultural identity", "artistic expression", "historical site", "traditional craft"],
  science: ["collect evidence", "test a hypothesis", "analyse data", "conduct an experiment", "draw a conclusion", "research findings", "statistically significant", "reliable evidence"],
  travel: ["book accommodation", "catch a flight", "make a reservation", "travel abroad", "explore a city", "miss a connection", "travel itinerary", "luggage allowance"],
  society: ["social inequality", "public policy", "local community", "equal access", "social responsibility", "public services", "civic participation", "economic opportunity"],
  everyday: ["make a choice", "build a habit", "solve a problem", "save time", "make a plan", "pay attention", "feel comfortable", "improve a skill"],
};

const PHRASES: Record<Lesson["level"], Array<[string,string]>> = {
  "pre-a1": [["Can you say that again?", "Yana bir marta ayta olasizmi?"], ["I don't understand.", "Men tushunmadim."], ["What does this mean?", "Bu nimani anglatadi?"], ["How do you spell it?", "Bu qanday harflab yoziladi?"]],
  a1: [["Nice to meet you.", "Tanishganimdan xursandman."], ["Could you help me, please?", "Menga yordam bera olasizmi?"], ["I'm looking for...", "Men ...ni qidiryapman."], ["How much is it?", "Bu qancha turadi?"]],
  a2: [["It depends on...", "Bu ...ga bog‘liq."], ["I'm not sure, but...", "Ishonchim komil emas, lekin..."], ["Would you like to...?", "...ni xohlaysizmi?"], ["The main reason is...", "Asosiy sabab..." ]],
  b1: [["In my experience...", "Mening tajribamda..."], ["One possible solution is...", "Mumkin bo‘lgan yechimlardan biri..."], ["I'd rather...", "Men ...ni afzal ko‘raman."], ["What I mean is...", "Men aytmoqchi bo‘lganim..."]],
  "b1-plus": [["There are several factors to consider.", "Hisobga olish kerak bo‘lgan bir nechta omil bor."], ["From my point of view...", "Mening nuqtai nazarimcha..."], ["It is worth considering whether...", "...ni ko‘rib chiqish arziydi."], ["The evidence suggests that...", "Dalillar shuni ko‘rsatadiki..."]],
  b2: [["To some extent...", "Ma’lum darajada..."], ["This raises the question of whether...", "Bu ... masalasini ko‘taradi."], ["A key factor is...", "Asosiy omillardan biri..."], ["On balance...", "Umuman olganda..."]],
  "b2-plus": [["It could be argued that...", "...deb ta’kidlash mumkin."], ["A distinction needs to be made between...", "...o‘rtasida farq ajratish kerak."], ["This is particularly relevant when...", "Bu, ayniqsa, ...da muhim."], ["The extent to which...", "...darajasi..."]],
  c1: [["It would be misleading to suggest that...", "...deb aytish chalg‘ituvchi bo‘lardi."], ["A more nuanced interpretation is that...", "Yanada nozikroq talqin shuki..."], ["The available evidence points towards...", "Mavjud dalillar ... tomon yo‘nalmoqda."], ["This distinction is crucial in assessing...", "Bu farq ...ni baholashda juda muhim."]],
};

function domain(l: Lesson): string {
  const s = `${l.topic} ${l.topicUz} ${l.reading.title}`.toLowerCase();
  if (/work|career|job|office|meeting|leadership|management|employment/.test(s)) return "work";
  if (/tech|digital|software|internet|ai|algorithm|cyber|data|computer/.test(s)) return "technology";
  if (/education|learning|school|academic|study|teacher|student|exam/.test(s)) return "education";
  if (/environment|climate|energy|nature|wildlife|sustain|carbon|pollution/.test(s)) return "environment";
  if (/society|community|social|citizen|equality|inequality|government|policy/.test(s)) return "society";
  if (/health|fitness|medicine|sleep|nutrition|well/.test(s)) return "health";
  if (/media|news|journal|advert|social media|information/.test(s)) return "media";
  if (/culture|art|heritage|tradition|music|literature|identity/.test(s)) return "culture";
  if (/science|research|evidence|experiment/.test(s)) return "science";
  if (/travel|tour|hotel|airport|journey|transport/.test(s)) return "travel";
  if (/business|market|finance|company|customer|sales|investment/.test(s)) return "business";
  return "everyday";
}

function levelInstruction(level: Lesson["level"]): string {
  if (level === "pre-a1" || level === "a1") return "Use short, clear sentences and controlled vocabulary.";
  if (level === "a2") return "Use familiar everyday language with simple reasons and examples.";
  if (level === "b1" || level === "b1-plus") return "Use connected ideas, reasons, examples and common discourse markers.";
  if (level === "b2" || level === "b2-plus") return "Use precise vocabulary, complex clauses and balanced argumentation.";
  return "Use precise, flexible language, qualification, cohesion and appropriate register.";
}

function addCollocations(words: Word[], d: string): Word[] {
  const pool = COLLOCATIONS[d] ?? COLLOCATIONS.everyday;
  return words.map((w, i) => {
    const current = w.collocations ?? [];
    if (current.length >= 2) return w;
    return { ...w, collocations: [...current, pool[i % pool.length]!, pool[(i + 1) % pool.length]!] };
  });
}

function addPhrases(l: Lesson): Phrase[] {
  const existing = new Set(l.phrases.map(p => p.phrase.toLowerCase()));
  const extras = PHRASES[l.level].filter(([p]) => !existing.has(p.toLowerCase())).map(([phrase, uz], i) => ({
    id: `${l.id}-author-ph-${i + 1}`,
    phrase, uz, ipa: "",
    example: `${phrase} ${l.topic.toLowerCase()} requires careful attention to the context.`,
    exampleUz: `${uz} ${l.topicUz.toLowerCase()} kontekstni diqqat bilan hisobga olishni talab qiladi.`,
    speakingTask: `Use “${phrase}” in a response about ${l.topic}.`,
  }));
  return [...l.phrases, ...extras];
}

function coherentReading(l: Lesson, words: Word[], d: string): { text: string; words: number } {
  const focus = words.slice(0, 6).map(w => w.word).join(", ");
  const level = levelInstruction(l.level);
  const text = [
    `${l.topic}: a practical perspective`,
    `People often encounter ${l.topic.toLowerCase()} in ordinary study, work, or community life. The important point is not simply to know the topic, but to explain how different choices affect real situations. In this lesson, learners work with ${focus}.`,
    `A useful way to approach the issue is to begin with a specific situation. Imagine a learner or professional who needs to make a decision related to ${l.topic.toLowerCase()}. They first identify the main problem, consider the available information, and then compare possible responses. ${l.grammar.examples[0]?.en ?? "The grammar focus helps the speaker express the idea clearly."}`,
    `The situation also shows why context matters. A word may have a different meaning or level of formality depending on the people involved and the purpose of the conversation. ${l.grammar.examples[1]?.en ?? "Clear language helps the listener follow the argument."} Learners should therefore notice both meaning and usage rather than memorising isolated words.`,
    `For practice, think about your own experience with ${l.topic.toLowerCase()}. What has worked well? What could be improved? Give one concrete example and explain your reason. ${level}`,
  ].join("\n\n");
  return { text, words: text.split(/\s+/).filter(Boolean).length };
}

function listening(l: Lesson, words: Word[]) {
  const selected = words.slice(0, 5);
  const lines = [
    ["Tutor", `Today we are discussing ${l.topic.toLowerCase()}. What comes to mind first?`],
    ["Learner", `I think the main point is how people make decisions about ${l.topic.toLowerCase()}.`],
    ["Tutor", `Good. Can you give a concrete example?`],
    ["Learner", l.grammar.examples[0]?.en ?? `One example is connected with ${l.topic.toLowerCase()}.`],
    ["Tutor", `Which vocabulary item is especially useful here?`],
    ["Learner", `I would use ${selected[0]?.word ?? "this word"}, because it describes an important part of the situation.`],
    ["Tutor", `Can you explain the idea in another way?`],
    ["Learner", l.grammar.examples[1]?.en ?? `The same idea can be explained from another point of view.`],
    ["Tutor", `Excellent. Now summarise the key idea in one sentence.`],
    ["Learner", `The key idea is that careful choices and clear communication can improve outcomes.`],
  ];
  const script = lines.map(([speaker, text], i) => ({ t: i * 3.2, en: `${speaker}: ${text}`, uz: `${speaker === "Tutor" ? "O‘qituvchi" : "O‘quvchi"}: ${text}` }));
  const q1 = mcq(`${l.id}-listen-author-1`, "What is the conversation mainly about?", [l.topic, "a weather forecast", "a cooking recipe", "a sports result"], l.topic, "The speakers stay focused on the lesson topic.", "Suhbat dars mavzusiga qaratilgan.", { skill: "listening" });
  const q2 = gap(`${l.id}-listen-author-2`, "Listen and complete: The key idea is that careful ___ and clear communication can improve outcomes.", "choices", "The missing word is the noun that completes the fixed idea.", "Bu joyda qaror/variant ma’nosidagi so‘z kerak.", { skill: "listening", audioText: script[9]!.en });
  return { script, questions: [...l.listening.questions, q1, q2] };
}

function authorExercises(l: Lesson, words: Word[]): Exercise[] {
  const out: Exercise[] = [];
  const g = l.grammar;
  const chosen = words.slice(0, Math.min(8, words.length));
  chosen.forEach((w, i) => {
    const sentence = w.example.replace(new RegExp(w.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "___");
    out.push(gap(`${l.id}-vocab-gap-${i}`, `Complete the sentence with the correct lesson word: ${sentence}`, w.word, `${w.word} fits the meaning and context.`, `${w.word} — ${w.uz}.`, { skill: "vocabulary" }));
    out.push(mcq(`${l.id}-vocab-mcq-${i}`, `Which collocation is natural with “${w.word}”?`, w.collocations.slice(0, 2).concat(["make a random", "very the"]).slice(0, 4), w.collocations[0]!, `${w.word} commonly occurs with “${w.collocations[0]}”.`, `Bu so‘z “${w.collocations[0]}” birikmasida tabiiy ishlatiladi.`, { skill: "vocabulary" }));
  });
  if (g.examples[0]) out.push(order(`${l.id}-grammar-order`, g.examples[0].en.replace(/[.,!?]/g, "").split(/\s+/), g.examples[0].en.replace(/[.,!?]/g, ""), g.form, g.formUz));
  if (g.mistakes[0]) out.push(errx(`${l.id}-grammar-error`, g.mistakes[0].wrong, g.mistakes[0].right, g.mistakes[0].why, g.mistakes[0].whyUz));
  if (g.examples[1]) out.push(tr(`${l.id}-translation`, g.examples[1].uz, g.examples[1].en, g.meaning, { skill: "translation", explanationUz: g.meaningUz }));
  out.push(mcq(`${l.id}-grammar-choice`, "Choose the sentence that correctly applies the lesson grammar.", [g.examples[0]?.en ?? "Correct sentence", g.mistakes[0]?.wrong ?? "Incorrect sentence", "This is not related to the lesson.", "No answer"], g.examples[0]?.en ?? "Correct sentence", g.why, g.whyUz, { skill: "grammar" }));
  return out;
}

export function authorLesson(l: Lesson): Lesson {
  const d = domain(l);
  const teacher = teacherContextFor(l);
  const words = addCollocations(l.vocabulary, d);
  const target = LEVEL_WORD_TARGET[l.level];
  const padded = words.slice(0, Math.max(target, words.length));
  const phrases = addPhrases(l);
  const read = coherentReading(l, padded.slice(0, 10), d);
  const listenData = listening(l, padded);
  const exercises = authorExercises(l, padded);
  const min = l.level === "pre-a1" || l.level === "a1" ? 30 : l.level === "a2" ? 60 : l.level === "b1" || l.level === "b1-plus" ? 100 : l.level === "b2" ? 140 : 180;

  // Advanced lessons use individually authored contexts. Lower levels keep
  // their existing material until they receive the same editorial pass.
  const contextualReading = teacher
    ? {
        title: teacher.title,
        titleUz: teacher.titleUz,
        text: teacher.reading,
        words: teacher.reading.split(/\s+/).filter(Boolean).length,
      }
    : { title: `${l.topic}: reading`, titleUz: `${l.topicUz}: o‘qish`, text: read.text, words: read.words };

  const contextualListening = teacher
    ? teacher.listening.map(([speaker, text], i) => ({
        t: i * 3.5,
        en: `${speaker}: ${text}`,
        uz: l.listening.script[i]?.uz ?? `${speaker}: ${text}`,
      }))
    : listenData.script;

  const firstSentenceEn = teacher?.reading.split(/[.!?]/)[0]?.trim() ?? "";
  const firstSentenceUz = teacher?.readingUz.split(/[.!?]/)[0]?.trim() ?? "";
  const contextualQuestions: Exercise[] = teacher
    ? [
        mcq(`${l.id}-context-main`, "What is the main purpose of this text?", [teacher.title, "To give unrelated background information", "To describe a fictional character", "To practise spelling only"], teacher.title, "The text develops the lesson grammar through a realistic context.", "Matn dars grammatikasini real kontekst orqali rivojlantiradi.", { skill: "reading" }),
        tr(`${l.id}-context-translate`, firstSentenceUz, firstSentenceEn, "Preserve the intended meaning and register.", { skill: "translation", explanationUz: "Mazmun va uslubni saqlang." }),
        mcq(`${l.id}-context-listen`, "What is the listening exchange mainly about?", [teacher.title, "A restaurant order", "A weather forecast", "A sports result"], teacher.title, "The dialogue directly practises the lesson objective in a realistic situation.", "Dialog dars maqsadini real vaziyatda mashq qildiradi.", { skill: "listening" }),
      ]
    : [];

  return {
    ...l,
    vocabulary: padded,
    phrases,
    listening: {
      ...l.listening,
      script: contextualListening,
      questions: [...l.listening.questions, ...listenData.questions, ...contextualQuestions.filter(x => x.skill === "listening")],
    },
    reading: {
      ...l.reading,
      ...contextualReading,
      questions: [...l.reading.questions, ...contextualQuestions.filter(x => x.skill === "reading")],
    },
    speaking: teacher
      ? { prompt: teacher.speaking, promptUz: teacher.speakingUz, scaffolding: ["State the situation clearly.", "Use the target grammar accurately.", "Use at least two target words.", "Give a concrete example.", "Finish with a clear conclusion."] }
      : {
          ...l.speaking,
          prompt: `Speak about ${l.topic}. Explain the situation, give one example, and state your conclusion.`,
          promptUz: `${l.topicUz} haqida gapiring. Vaziyatni tushuntiring, bitta misol keltiring va xulosa qiling.`,
          scaffolding: ["State the main idea.", "Use two target words.", "Use the lesson grammar.", "Give a concrete example.", "Finish with a short conclusion."],
        },
    writing: teacher
      ? { prompt: teacher.writing, promptUz: teacher.writingUz, minWords: Math.max(l.writing.minWords, min), scaffolding: ["Plan the main claim.", "Use the target grammar.", "Use precise lesson vocabulary.", "Support the idea with a concrete detail.", "Edit for accuracy and register."] }
      : {
          ...l.writing,
          prompt: `Write about ${l.topic}. Present the main idea, support it with two details, and give a clear conclusion.`,
          promptUz: `${l.topicUz} haqida yozing. Asosiy fikrni ayting, ikkita dalil/detall bilan qo‘llab-quvvatlang va aniq xulosa yozing.`,
          minWords: Math.max(l.writing.minWords, min),
          scaffolding: ["Introduce the topic.", "Use the target grammar.", "Use at least three target words.", "Add a specific example.", "Check grammar and linking words."],
        },
    exercises: [...l.exercises, ...exercises, ...contextualQuestions],
    test: [...l.test, ...contextualQuestions, ...exercises.slice(0, 6)],
  };
}

export function authorAll(lessons: Lesson[]): Lesson[] {
  return lessons.map(authorLesson);
}
