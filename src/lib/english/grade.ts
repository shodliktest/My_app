export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[.?!,;:"“”]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function answersMatch(input: string, accepted: string[]): boolean {
  const n = normalizeAnswer(input);
  if (!n) return false;
  return accepted.some((a) => normalizeAnswer(a) === n);
}

export function xpFor(correct: boolean, leftover: boolean): number {
  if (correct) return leftover ? 8 : 12;
  return 2;
}
