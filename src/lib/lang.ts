import type { ImmersionMode, LevelId } from "@/lib/types";
import { levelIndex } from "@/lib/cefr";

export function showUzbek(level: LevelId, immersion: ImmersionMode, englishOnly: boolean) {
  if (englishOnly || immersion === "en") return false;
  if (immersion === "uz") return true;
  return levelIndex(level) <= 3;
}

export function uzRatioLabel(level: LevelId) {
  const i = levelIndex(level);
  if (i <= 1) return "90% o‘zbek / 10% ingliz";
  if (i === 2) return "70% / 30%";
  if (i === 3 || i === 4) return "50% / 50%";
  if (i === 5 || i === 6) return "20% / 80%";
  return "English only";
}
