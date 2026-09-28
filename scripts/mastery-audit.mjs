import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const types = readFileSync(join(root, "src/lib/types.ts"), "utf8");
const mastery = readFileSync(join(root, "src/lib/mastery.ts"), "utf8");
const store = readFileSync(join(root, "src/lib/store.ts"), "utf8");
const player = readFileSync(join(root, "src/components/lesson-player.tsx"), "utf8");

const checks = [
  ["mastery threshold", mastery.includes("MASTERY_THRESHOLD = 80")],
  ["review threshold", mastery.includes("REVIEW_THRESHOLD = 60")],
  ["weak-skill extraction", mastery.includes("weakSkillsFromExercises")],
  ["review scheduling", mastery.includes("nextReviewAt")],
  ["progress stores mastery attempts", types.includes("masteryAttempts")],
  ["progress stores best test score", types.includes("bestTestScore")],
  ["store records assessment", store.includes("masteryAttempts") && store.includes("lastTestScore")],
  ["lesson player records test results", player.includes("setTestResults")],
  ["lesson player sends mastery assessment", player.includes("weakSkillsFromExercises") && player.includes("MASTERY_THRESHOLD")],
];
let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed++;
}
process.exitCode = failed ? 1 : 0;
