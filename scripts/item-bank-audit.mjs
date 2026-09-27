import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "src");
const types = fs.readFileSync(path.join(root, "lib/types.ts"), "utf8");
const bank = fs.readFileSync(path.join(root, "lib/item-bank.ts"), "utf8");
const player = fs.readFileSync(path.join(root, "components/lesson-player.tsx"), "utf8");
const checks = [
  ["assessment metadata type", /export type AssessmentMetadata/.test(types)],
  ["CEFR difficulty model", /LEVEL_BASE/.test(bank) && /difficultyFor/.test(bank)],
  ["cognitive demand", /cognitiveDemand/.test(bank) && /synthesis/.test(bank)],
  ["common error mapping", /commonErrorFor/.test(bank)],
  ["item bank builder", /buildItemBank/.test(bank)],
  ["skill targeting", /targetSkill/.test(bank) && /item\.skill === opts\.targetSkill/.test(bank)],
  ["difficulty targeting", /targetDifficulty/.test(bank)],
  ["diversity selection", /usedSkills/.test(bank) && /usedTypes/.test(bank)],
  ["lesson player integration", /getLessonItemBank/.test(player) && /selectAssessmentItems/.test(player)],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "✓" : "✗"} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
console.log(`Item bank audit passed: ${checks.length} checks`);
