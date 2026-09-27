import type { CardKind, Flashcard, LevelId, Word } from "@/lib/types";
import { contextCoverage, nextKind, retrievalSummary } from "@/lib/srs";

export type RetrievalTask = {
  kind: CardKind;
  prompt: string;
  promptUz: string;
  expected: string;
  explanation: string;
  context: "meaning" | "form" | "audio" | "sentence" | "speaking" | "writing";
};

/**
 * Selects vocabulary work using only deterministic learner data. No LLM is
 * required: level, retrieval history, context coverage and lapses determine
 * the next activity.
 */
export function rankVocabulary(
  words: Word[],
  cards: Record<string, Flashcard>,
  level: LevelId,
  now = Date.now(),
) {
  const levelWords = words.filter((w) => w.level === level || !cards[w.id]);
  return levelWords
    .map((word) => {
      const card = cards[word.id];
      if (!card) return { word, score: 100, reason: "new" as const };
      const due = card.due <= now ? 40 : Math.max(0, 20 - (card.due - now) / 86_400_000);
      const coverage = (7 - contextCoverage(card)) * 5;
      const lapse = Math.min(30, card.lapses * 5);
      const leech = card.leech ? 25 : 0;
      const accuracy = retrievalSummary(card).accuracy;
      return { word, score: due + coverage + lapse + leech + (100 - accuracy) * 0.2, reason: card.leech ? "leech" : card.due <= now ? "due" : "needs-context" as const };
    })
    .sort((a, b) => b.score - a.score);
}

export function buildRetrievalTask(word: Word, card?: Flashcard): RetrievalTask {
  const kind = card ? nextKind(card) : "word-meaning";
  if (kind === "word-meaning") return { kind, prompt: `What does “${word.word}” mean?`, promptUz: `“${word.word}” nimani anglatadi?`, expected: word.uz, explanation: word.definition, context: "meaning" };
  if (kind === "uz-en") return { kind, prompt: `Translate into English: ${word.uz}`, promptUz: `Inglizchaga tarjima qiling: ${word.uz}`, expected: word.word, explanation: `${word.word} — ${word.uz}.`, context: "form" };
  if (kind === "en-uz") return { kind, prompt: `Translate into Uzbek: ${word.word}`, promptUz: `O‘zbekchaga tarjima qiling: ${word.word}`, expected: word.uz, explanation: `${word.word} means ${word.uz}.`, context: "meaning" };
  if (kind === "audio-word") return { kind, prompt: `Listen and identify the word: ${word.word}`, promptUz: `Eshitib so‘zni aniqlang: ${word.word}`, expected: word.word, explanation: `${word.word} — ${word.uz}.`, context: "audio" };
  if (kind === "sentence-gap") return { kind, prompt: word.example.replace(new RegExp(word.word, "i"), "_____"), promptUz: `${word.word} so‘zini gapda to‘ldiring.`, expected: word.word, explanation: word.example, context: "sentence" };
  if (kind === "speaking") return { kind, prompt: `Say one natural sentence using “${word.word}”.`, promptUz: `“${word.word}” so‘zi bilan tabiiy gap ayting.`, expected: word.word, explanation: word.example, context: "speaking" };
  return { kind: "writing", prompt: `Write one sentence using “${word.word}” and one of its collocations.`, promptUz: `“${word.word}” va uning birikmalaridan biri bilan bitta gap yozing.`, expected: word.word, explanation: word.collocations[0] ? `${word.word} · ${word.collocations[0]}` : word.example, context: "writing" };
}

export function retrievalPlan(words: Word[], cards: Record<string, Flashcard>, level: LevelId, limit = 10) {
  return rankVocabulary(words, cards, level).slice(0, limit).map(({ word }) => buildRetrievalTask(word, cards[word.id]));
}
