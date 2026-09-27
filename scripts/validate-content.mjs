import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "src/content/pre-a1.ts",
  "src/content/pre-a1-more.ts",
  "src/content/a1.ts",
  "src/content/a2.ts",
  "src/content/a2-more.ts",
  "src/content/b1.ts",
  "src/content/advanced.ts",
];
const source = files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");
const lessonIds = [...source.matchAll(/id:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const generatedIds = [...source.matchAll(/makeLesson\(["']([^"']+)["']/g)].map((m) => m[1]);
const duplicateIds = lessonIds.filter((id, i) => lessonIds.indexOf(id) !== i);
const expectedLevels = ["b1-plus", "b2", "b2-plus", "c1"];
const levelCounts = Object.fromEntries(expectedLevels.map((level) => [level, generatedIds.filter((id) => id.startsWith(`${level}-`) && (level !== "b2" || !id.startsWith("b2-plus-"))).length]));
const checks = [
  [generatedIds.length === 54, `advanced curriculum: ${generatedIds.length} generated lessons (expected 54)`],
  [duplicateIds.length === 0, duplicateIds.length ? `duplicate ids: ${[...new Set(duplicateIds)].join(", ")}` : "no duplicate lesson ids"],
  [Object.values(levelCounts).every(Boolean), `advanced level coverage: ${JSON.stringify(levelCounts)}`],
];
for (const [ok, message] of checks) console.log(`${ok ? "✓" : "✗"} ${message}`);
if (checks.some(([ok]) => !ok)) process.exit(1);
