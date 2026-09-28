import type { CardKind, Flashcard, VocabStatus } from "@/lib/types";

// Local-first retrieval schedule. The first interval is deliberately short so
// a newly learned word is retrieved again before the learner can forget it.
const INTERVALS = [10 / (60 * 24), 1, 3, 7, 14, 30, 60, 90, 180, 365];
const DAY = 24 * 60 * 60 * 1000;

export function emptyCard(wordId: string, now = Date.now()): Flashcard {
  return {
    wordId,
    state: "new",
    intervalDays: 0,
    ease: 2.5,
    due: now,
    reviews: 0,
    correct: 0,
    wrong: 0,
    lapses: 0,
    streak: 0,
    lastReviewedAt: null,
    introducedAt: now,
    lastKind: null,
    leech: false,
    contexts: {
      meaning: false,
      enUz: false,
      uzEn: false,
      audio: false,
      sentence: false,
      speaking: false,
      writing: false,
    },
  };
}

function intervalIndex(days: number) {
  let best = 0;
  for (let i = 0; i < INTERVALS.length; i += 1) {
    if (INTERVALS[i] <= days + 1e-9) best = i;
    else break;
  }
  return best;
}

/**
 * Grade a retrieval event without requiring a server or AI service.
 * 0=Again, 1=Hard, 2=Good, 3=Easy.
 */
export function reviewCard(card: Flashcard, grade: 0 | 1 | 2 | 3, now = Date.now()): Flashcard {
  const next = {
    ...card,
    reviews: card.reviews + 1,
    lastReviewedAt: now,
    lastKind: card.lastKind,
  };

  if (grade === 0) {
    next.wrong += 1;
    next.lapses += 1;
    next.streak = 0;
    next.ease = Math.max(1.3, card.ease - 0.2);
    next.intervalDays = INTERVALS[0];
    next.state = "learning";
    next.due = now + 10 * 60 * 1000;
    // Six or more failed retrievals marks a leech: the word needs a
    // different teaching context rather than endless repetition.
    next.leech = next.lapses >= 6;
    return next;
  }

  next.correct += 1;
  next.streak = card.streak + 1;
  const currentIndex = intervalIndex(card.intervalDays);
  const jump = grade === 3 ? 2 : grade === 2 ? 1 : 0;
  const nextIdx = Math.min(INTERVALS.length - 1, Math.max(1, currentIndex + jump));
  const easeDelta = grade === 3 ? 0.12 : grade === 2 ? 0.04 : -0.08;
  next.ease = Math.min(3.2, Math.max(1.3, card.ease + easeDelta));
  const baseDays = INTERVALS[nextIdx];
  const easeFactor = grade === 3 ? next.ease / 2.5 : grade === 1 ? 0.75 : 1;
  next.intervalDays = Math.max(1, baseDays * easeFactor);
  next.due = now + next.intervalDays * DAY;
  next.state = nextIdx >= 4 && next.streak >= 3 ? "mastered" : nextIdx >= 2 ? "review" : "learning";
  // A sustained successful retrieval sequence can rehabilitate a leech.
  if (next.streak >= 4) next.leech = false;
  return next;
}

export function dueCards(cards: Flashcard[], now = Date.now()): Flashcard[] {
  return cards
    .filter((c) => c.due <= now)
    .sort((a, b) => {
      // Leech cards first, then overdue cards, then cards with fewer contexts.
      if (a.leech !== b.leech) return a.leech ? -1 : 1;
      const overdueA = now - a.due;
      const overdueB = now - b.due;
      if (overdueA !== overdueB) return overdueB - overdueA;
      return contextCoverage(a) - contextCoverage(b);
    });
}

export function contextCoverage(card: Flashcard) {
  return Object.values(card.contexts).filter(Boolean).length;
}

export function markContext(card: Flashcard, kind: CardKind): Flashcard {
  const contexts = { ...card.contexts };
  if (kind === "word-meaning" || kind === "image-word") contexts.meaning = true;
  if (kind === "en-uz") contexts.enUz = true;
  if (kind === "uz-en") contexts.uzEn = true;
  if (kind === "audio-word") contexts.audio = true;
  if (kind === "sentence-gap" || kind === "picture-sentence") contexts.sentence = true;
  if (kind === "speaking") contexts.speaking = true;
  // Writing is tracked as a retrieval context too. Existing persisted cards
  // without the field are safely upgraded by this spread.
  if ((kind as string) === "writing") contexts.writing = true;

  const masteredContexts = contexts.meaning && contexts.enUz && contexts.uzEn && contexts.audio && contexts.sentence;
  const mastered = masteredContexts && card.correct >= 4 && card.wrong <= Math.max(2, card.correct / 2) && card.streak >= 3;
  const state: VocabStatus = mastered ? "mastered" : card.state;
  return { ...card, contexts, lastKind: kind, state };
}

export function nextKind(card: Flashcard): CardKind {
  const c = card.contexts;
  if (!c.meaning) return "word-meaning";
  if (!c.uzEn) return "uz-en";
  if (!c.enUz) return "en-uz";
  if (!c.audio) return "audio-word";
  if (!c.sentence) return "sentence-gap";
  if (!c.speaking) return "speaking";
  const cycle: CardKind[] = ["uz-en", "en-uz", "audio-word", "sentence-gap", "speaking", "writing"];
  return cycle[card.reviews % cycle.length] ?? "uz-en";
}

export function isDue(card: Flashcard, now = Date.now()) {
  return card.due <= now;
}

export function retrievalSummary(card: Flashcard) {
  const total = card.correct + card.wrong;
  const accuracy = total ? Math.round((card.correct / total) * 100) : 0;
  return {
    accuracy,
    coverage: contextCoverage(card),
    coverageTotal: 7,
    lapses: card.lapses,
    leech: card.leech,
    intervalDays: Math.round(card.intervalDays * 10) / 10,
  };
}
