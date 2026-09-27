import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tutor = fs.readFileSync(path.join(root, "src/lib/tutor.ts"), "utf8");
const route = fs.readFileSync(path.join(root, "src/routes/tutor.tsx"), "utf8");
const shell = fs.readFileSync(path.join(root, "src/components/app-shell.tsx"), "utf8");

const checks = [
  ["local tutor engine", /export function buildTutorTurn/.test(tutor)],
  ["no API dependency in tutor core", !/conversationTurn|fetch\(|XAI_API_KEY/.test(tutor)],
  ["CEFR-aware scaffolding", /LEVEL_CAP|ctx\.level/.test(tutor)],
  ["error intelligence integration", /analyzeError/.test(tutor)],
  ["mistake bank integration", /ctx\.mistakes/.test(tutor) && /activeMistakes/.test(route)],
  ["guided hint before key", /attempt === 0/.test(tutor) && /expected/.test(tutor)],
  ["retry stage", /stage: attempt === 0 \? "diagnose" : "retry"/.test(tutor)],
  ["transfer practice", /stage: "extend"/.test(tutor)],
  ["tutor route", /createFileRoute\("\/tutor"\)/.test(route)],
  ["navigation entry", /to: "\/tutor"/.test(shell)],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
console.log("Tutor audit: PASS");
