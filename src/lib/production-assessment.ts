import type { LevelId } from "@/lib/types";

export type AssessmentKind = "speaking" | "writing";
export type RubricKey = "task" | "grammar" | "vocabulary" | "coherence" | "accuracy" | "fluency";

export type RubricScore = {
  key: RubricKey;
  label: string;
  score: number;
  band: "developing" | "functional" | "strong" | "advanced";
  evidence: string;
};

export type LocalAssessment = {
  kind: AssessmentKind;
  level: LevelId;
  overall: number;
  cefrSignal: LevelId;
  wordCount: number;
  sentenceCount: number;
  rubric: RubricScore[];
  strengths: string[];
  priorities: string[];
  teacherFeedback: string;
  retryTask: string;
};

const LEVEL_INDEX: Record<LevelId, number> = {
  "pre-a1": 0, a1: 1, a2: 2, b1: 3, "b1-plus": 4, b2: 5, "b2-plus": 6, c1: 7,
};

const TARGET_WORDS: Record<LevelId, number> = {
  "pre-a1": 15, a1: 25, a2: 45, b1: 70, "b1-plus": 90, b2: 120, "b2-plus": 150, c1: 180,
};

const CONNECTORS = ["because", "although", "however", "therefore", "while", "whereas", "instead", "also", "first", "finally", "for example", "in addition", "on the other hand"];
const COMMON_VERB_FORMS = /\b(am|is|are|was|were|have|has|had|do|does|did|will|would|can|could|should|must)\b/i;
const PUNCTUATION = /[.!?]+/g;

function words(text: string) {
  return text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
}

function sentences(text: string) {
  return text.trim().split(PUNCTUATION).map((x) => x.trim()).filter(Boolean);
}

function band(score: number): RubricScore["band"] {
  if (score >= 85) return "advanced";
  if (score >= 70) return "strong";
  if (score >= 55) return "functional";
  return "developing";
}

function scoreRange(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function lexicalScore(ws: string[]) {
  if (!ws.length) return 0;
  const unique = new Set(ws).size;
  const ratio = unique / ws.length;
  return scoreRange(35 + ratio * 90);
}

function connectorScore(text: string) {
  const lower = text.toLowerCase();
  const found = CONNECTORS.filter((c) => lower.includes(c)).length;
  return scoreRange(45 + Math.min(found, 5) * 10);
}

function grammarScore(text: string, level: LevelId, kind: AssessmentKind) {
  const ws = words(text);
  if (!ws.length) return 0;
  let score = 52;
  const hasVerb = COMMON_VERB_FORMS.test(text) || /\b\w+(ed|ing|s)\b/i.test(text);
  if (hasVerb) score += 10;
  if (sentences(text).some((s) => /\b(i|he|she|it|we|they)\s+(go|goes|went|have|has|had|will)\b/i.test(s))) score += 5;
  if (/\b(have|has)\s+went\b/i.test(text)) score -= 20;
  if (/\bdoes\s+\w+\s+\w+s\b/i.test(text)) score -= 15;
  if (/\bdepend of\b/i.test(text)) score -= 10;
  if (/\ba informations?\b|\ban advice\b/i.test(text)) score -= 8;
  if (kind === "writing" && sentences(text).length >= 3) score += 5;
  if (LEVEL_INDEX[level] >= 5 && /\b(although|however|whereas|despite|unless)\b/i.test(text)) score += 8;
  if (LEVEL_INDEX[level] >= 6 && /\bwould have|could have|might have|having\s+\w+ed\b/i.test(text)) score += 7;
  return scoreRange(score);
}

function taskScore(text: string, prompt: string, level: LevelId) {
  const ws = words(text);
  const p = words(prompt);
  const target = TARGET_WORDS[level];
  const length = Math.min(100, 45 + (ws.length / Math.max(target, 1)) * 45);
  const overlap = p.length ? p.filter((w) => ws.includes(w)).length / Math.min(p.length, 10) : 0.2;
  return scoreRange(length * 0.72 + overlap * 28);
}

function accuracyScore(text: string) {
  const ws = words(text);
  if (!ws.length) return 0;
  const sentenceCount = Math.max(1, sentences(text).length);
  const avg = ws.length / sentenceCount;
  let score = 62 + Math.min(avg, 18) * 1.2;
  if (/\s{2,}/.test(text)) score -= 3;
  if (/\b(a|an|the)\s+(information|advice|homework)\b/i.test(text)) score -= 8;
  return scoreRange(score);
}

function fluencyScore(text: string) {
  const ws = words(text);
  const pauses = (text.match(/\.{2,}|\b(um|uh)\b/gi) ?? []).length;
  const base = Math.min(95, 45 + ws.length * 0.55);
  return scoreRange(base - pauses * 5);
}

function rubricItem(key: RubricKey, label: string, score: number, evidence: string): RubricScore {
  return { key, label, score, band: band(score), evidence };
}

function inferredCefr(overall: number, current: LevelId): LevelId {
  const currentIndex = LEVEL_INDEX[current];
  const delta = overall >= 88 ? 1 : overall < 55 ? -1 : 0;
  const next = Math.max(0, Math.min(7, currentIndex + delta));
  return (Object.keys(LEVEL_INDEX) as LevelId[]).find((x) => LEVEL_INDEX[x] === next) ?? current;
}

export function assessProduction(input: { kind: AssessmentKind; text: string; prompt: string; level: LevelId; englishOnly?: boolean }): LocalAssessment {
  const text = input.text.trim();
  const ws = words(text);
  const ss = sentences(text);
  const task = taskScore(text, input.prompt, input.level);
  const grammar = grammarScore(text, input.level, input.kind);
  const vocabulary = lexicalScore(ws);
  const coherence = connectorScore(text);
  const accuracy = accuracyScore(text);
  const fluency = fluencyScore(text);
  const rubric = input.kind === "speaking"
    ? [rubricItem("task", "Task achievement", task, `${ws.length} words in the response.`), rubricItem("grammar", "Grammar control", grammar, grammar < 60 ? "A few form/structure signals need review." : "Basic sentence control is visible."), rubricItem("vocabulary", "Vocabulary", vocabulary, `${new Set(ws).size} unique words.`), rubricItem("coherence", "Coherence", coherence, `${CONNECTORS.filter((c) => text.toLowerCase().includes(c)).length} linking signal(s) detected.`), rubricItem("fluency", "Fluency signal", fluency, "Estimated from transcript length and hesitation markers; not a direct pronunciation measurement.")]
    : [rubricItem("task", "Task achievement", task, `${ws.length} words; target for ${input.level.toUpperCase()} is about ${TARGET_WORDS[input.level]}.`), rubricItem("grammar", "Grammar range/control", grammar, "Rule-pattern checks plus sentence complexity signals."), rubricItem("vocabulary", "Vocabulary", vocabulary, `${new Set(ws).size} unique words.`), rubricItem("coherence", "Coherence", coherence, `${CONNECTORS.filter((c) => text.toLowerCase().includes(c)).length} linking signal(s) detected.`), rubricItem("accuracy", "Language accuracy", accuracy, "Spelling, article and sentence-level heuristic checks.")];
  const overall = scoreRange(rubric.reduce((sum, r) => sum + r.score, 0) / rubric.length);
  const strengths = rubric.filter((r) => r.score >= 70).slice(0, 2).map((r) => `${r.label}: ${r.score}/100`);
  const priorities = rubric.filter((r) => r.score < 65).slice(0, 3).map((r) => `${r.label}: ${r.score}/100`);
  if (!priorities.length) priorities.push("Keep the same control, then increase range and precision.");
  const weak = rubric.slice().sort((a, b) => a.score - b.score)[0];
  const uz = !input.englishOnly;
  const teacherFeedback = uz
    ? `Umumiy signal: ${overall}/100. Eng kuchli tomon: ${strengths[0] ?? "javobni bajarishga urinish"}. Keyingi asosiy ish: ${weak.label}. Bu avtomatik diagnostika; speaking pronunciation audio orqali to‘liq baholanmadi.`
    : `Overall signal: ${overall}/100. Strongest area: ${strengths[0] ?? "task engagement"}. Main next focus: ${weak.label}. This is an automated diagnostic; speaking pronunciation was not fully assessed from transcript alone.`;
  const retryTask = input.kind === "writing"
    ? `Rewrite the response with at least ${Math.max(1, Math.round(TARGET_WORDS[input.level] * 0.75))} words and improve: ${weak.label}.`
    : `Speak again for 30–60 seconds. Keep the same idea, but improve: ${weak.label}.`;
  return { kind: input.kind, level: input.level, overall, cefrSignal: inferredCefr(overall, input.level), wordCount: ws.length, sentenceCount: ss.length, rubric, strengths, priorities, teacherFeedback, retryTask };
}
