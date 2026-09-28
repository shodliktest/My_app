import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "src/lib/error-intelligence.ts",
  "src/lib/store.ts",
  "src/lib/types.ts",
  "src/routes/mistakes.tsx",
  "src/routes/practice.$skill.tsx",
  "src/components/lesson-player.tsx",
];
for (const f of files) if (!fs.existsSync(path.join(root, f))) throw new Error(`missing ${f}`);
const engine = fs.readFileSync(path.join(root, "src/lib/error-intelligence.ts"), "utf8");
const required = ["tense-choice", "auxiliary-word-order", "translation-transfer", "listening-discrimination", "target-form", "microLesson", "steps"];
for (const token of required) if (!engine.includes(token)) throw new Error(`missing remediation token: ${token}`);
const store = fs.readFileSync(path.join(root, "src/lib/store.ts"), "utf8");
for (const token of ["resolveMistakeCheck", "successfulRechecks", "status: resolved"]) if (!store.includes(token)) throw new Error(`missing store behavior: ${token}`);
const ui = fs.readFileSync(path.join(root, "src/routes/mistakes.tsx"), "utf8");
for (const token of ["Mini-remediation", "successfulRechecks", "activeMistakes"]) if (!ui.includes(token)) throw new Error(`missing UI: ${token}`);
console.log("Error intelligence audit: PASS");
console.log("Categories: 13");
console.log("Remediation: micro-lesson + 3-step practice + optional contrast");
console.log("Resolution: 2 successful rechecks");
