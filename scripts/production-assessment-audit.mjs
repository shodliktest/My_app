import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const file = readFileSync("src/lib/production-assessment.ts", "utf8");
const route = readFileSync("src/routes/speak.tsx", "utf8");
const checks = [
  ["local assessment engine", file.includes("export function assessProduction")],
  ["speaking rubric", file.includes('"fluency"')],
  ["writing rubric", file.includes('"accuracy"')],
  ["CEFR target words", file.includes("TARGET_WORDS")],
  ["task achievement", file.includes("taskScore")],
  ["grammar diagnostics", file.includes("grammarScore")],
  ["retry task", file.includes("retryTask")],
  ["no API dependency", !file.includes("fetch(")],
  ["speaking/writing UI", route.includes('"speaking", "writing"')],
  ["skill recording", route.includes("recordSkill")],
];
for (const [name, ok] of checks) console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
if (checks.some(([, ok]) => !ok)) process.exit(1);
console.log("Production assessment audit: PASS");
