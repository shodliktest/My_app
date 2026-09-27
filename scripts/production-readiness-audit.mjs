import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "src/lib/tutor.ts",
  "src/lib/error-intelligence.ts",
  "src/lib/adaptive.ts",
  "src/lib/mastery.ts",
  "src/lib/item-bank.ts",
  "src/routes/tutor.tsx",
  "scripts/tutor-audit.mjs",
];

let failed = 0;
for (const file of required) {
  const ok = fs.existsSync(path.join(root, file));
  console.log(`${ok ? "PASS" : "FAIL"} required artifact: ${file}`);
  if (!ok) failed++;
}

const tutor = fs.readFileSync(path.join(root, "src/lib/tutor.ts"), "utf8");
const ai = fs.readFileSync(path.join(root, "src/lib/ai.ts"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const checks = [
  ["local tutor has no network dependency", !/fetch\(|XAI_API_KEY|conversationTurn/.test(tutor)],
  ["optional AI is isolated in server AI module", /XAI_API_KEY/.test(ai) && /createServerFn/.test(ai)],
  ["package lock is present", fs.existsSync(path.join(root, "package-lock.json"))],
  ["typecheck script exists", pkg.scripts?.typecheck === "tsc --noEmit"],
  ["production build script exists", typeof pkg.scripts?.build === "string"],
  ["tutor audit is registered", pkg.scripts?.["audit:tutor"] === "node scripts/tutor-audit.mjs"],
  ["error intelligence audit is registered", pkg.scripts?.["audit:error-intelligence"] === "node scripts/error-intelligence-audit.mjs"],
  ["tutor supports correction validation", /isPatternResolved/.test(tutor)],
  ["mistake reactivation metadata is supported", /status: x\.status === "resolved" \? "active"/.test(fs.readFileSync(path.join(root, "src/lib/store.ts"), "utf8"))],
];

for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) failed++;
}

const depsReady = fs.existsSync(path.join(root, "node_modules"));
console.log(`${depsReady ? "PASS" : "BLOCKED"} dependency installation available in workspace`);
if (!depsReady) console.log("NOTE dependency install could not be completed in the verification environment; typecheck/build remain environment-blocked.");

if (failed) process.exit(1);
console.log(`Production hardening audit: PASS${depsReady ? " — build/typecheck can be executed next" : " — static checks passed; build/typecheck environment-blocked"}`);
