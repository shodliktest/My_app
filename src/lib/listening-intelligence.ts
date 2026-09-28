export type DictationItem = {
  source: string;
  masked: string;
  answers: string[];
};

function normalize(value: string) {
  return value.toLowerCase().trim().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/gi, "").replace(/\s+/g, " ");
}

/** Creates a deterministic dictation challenge without an AI/API dependency. */
export function makeDictation(text: string, level = "b1"): DictationItem {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const frequency = level.startsWith("c1") || level.startsWith("b2") ? 4 : level.startsWith("a") ? 6 : 5;
  const indexes = words.map((_, i) => i).filter((i) => words[i].replace(/[^A-Za-z']/g, "").length >= 4 && i % frequency === 0).slice(0, 5);
  const selected = indexes.length ? indexes : [Math.min(1, Math.max(0, words.length - 1))];
  const answers = selected.map((i) => words[i].replace(/[^A-Za-z']/g, ""));
  const masked = words.map((word, i) => selected.includes(i) ? "_____" : word).join(" ");
  return { source: text, masked, answers };
}

export function scoreDictation(item: DictationItem, answer: string): { score: number; matched: number; total: number } {
  const given = normalize(answer).split(" ").filter(Boolean);
  const expected = item.answers.map(normalize);
  let matched = 0;
  expected.forEach((word, i) => { if (given[i] === word) matched += 1; });
  return { score: Math.round((matched / Math.max(1, expected.length)) * 100), matched, total: expected.length };
}

export function listeningDifficulty(score: number, attempts: number) {
  if (score >= 90 && attempts <= 1) return "advance" as const;
  if (score < 60 || attempts >= 3) return "repair" as const;
  return "build" as const;
}
