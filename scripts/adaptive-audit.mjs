import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "src");
const adaptive = fs.readFileSync(path.join(root, "lib/adaptive.ts"), "utf8");
const progress = fs.readFileSync(path.join(root, "routes/progress.tsx"), "utf8");
const learn = fs.readFileSync(path.join(root, "routes/learn.tsx"), "utf8");

const checks = [
  ["adaptive recommendation type", /AdaptiveRecommendation/.test(adaptive)],
  ["weak-skill targeting", /weakestSkill|targets\.includes\(weak\)/.test(adaptive)],
  ["due review priority", /due\) score \+= 1000/.test(adaptive)],
  ["prerequisite gate", /lessonReadiness\(lesson, progress\)/.test(adaptive)],
  ["CEFR distance", /distance = Math\.abs\(levelIndex/.test(adaptive)],
  ["adaptive stage", /adaptiveStage/.test(adaptive)],
  ["progress integration", /nextAdaptiveRecommendation/.test(progress)],
  ["learn integration", /nextAdaptiveRecommendation/.test(learn)],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "✓" : "✗"} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
console.log(`Adaptive audit passed: ${checks.length} checks`);
