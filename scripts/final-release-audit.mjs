import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
let failed = 0;
const pass = (name) => console.log(`PASS ${name}`);
const fail = (name) => { console.log(`FAIL ${name}`); failed++; };
const note = (name) => console.log(`NOTE ${name}`);

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const pkg = JSON.parse(read("package.json"));
const routeTree = read("src/routeTree.gen.ts");
const shell = read("src/components/app-shell.tsx");
const speech = read("src/lib/speech.ts");
const env = read(".env.example");
const settings = read("src/routes/settings.tsx");
const store = read("src/lib/store.ts");

for (const file of ["src/routes/tutor.tsx", "src/routes/speak.tsx", "src/routes/review.tsx", "src/routes/progress.tsx", "src/routes/mistakes.tsx", "src/lib/tutor.ts", "src/lib/vocabulary-intelligence.ts", "src/lib/listening-intelligence.ts"]) {
  fs.existsSync(path.join(root, file)) ? pass(`release artifact: ${file}`) : fail(`release artifact: ${file}`);
}

routeTree.includes("TutorRouteImport") && routeTree.includes("'/tutor'") && routeTree.includes("TutorRoute: TutorRoute")
  ? pass("tutor route is registered in generated route tree")
  : fail("tutor route is registered in generated route tree");

shell.includes('to: "/tutor"') ? pass("Teacher navigation target exists") : fail("Teacher navigation target exists");

const directSpeech = [];
for (const dir of ["src/components", "src/routes", "src/lib"]) {
  const base = path.join(root, dir);
  for (const name of fs.readdirSync(base, { recursive: true })) {
    if (!String(name).endsWith(".ts") && !String(name).endsWith(".tsx")) continue;
    const rel = path.join(dir, String(name));
    const text = read(rel);
    if (rel !== "src/lib/speech.ts" && /responsiveVoice\.speak|speechSynthesis\.speak/.test(text)) directSpeech.push(rel);
  }
}
directSpeech.length === 0 ? pass("speech providers are centralized") : fail(`speech providers centralized; direct calls: ${directSpeech.join(", ")}`);

speech.includes("VITE_RESPONSIVEVOICE_KEY") && env.includes("VITE_RESPONSIVEVOICE_KEY=")
  ? pass("ResponsiveVoice is optional and environment-configured")
  : fail("ResponsiveVoice optional configuration");

!/responsivevoice\.org|responsivevoice\.com/i.test(env) && !/ftro4Sxr/.test(speech)
  ? pass("no hard-coded ResponsiveVoice key")
  : fail("no hard-coded ResponsiveVoice key");

speech.includes("nativeSpeak") && speech.includes("loadResponsiveVoice") && speech.includes("onerror")
  ? pass("natural voice provider has native fallback")
  : fail("natural voice provider has native fallback");

settings.includes("exportProgressBackup") && settings.includes("importProgressBackup") && store.includes("exportProgressBackup") && store.includes("importProgressBackup")
  ? pass("progress backup and restore are wired")
  : fail("progress backup and restore are wired");

const requiredScripts = [
  "audit:tutor", "audit:error-intelligence", "audit:vocabulary-intelligence", "audit:listening-intelligence",
  "typecheck", "build", "test", "lint"
];
for (const script of requiredScripts) pkg.scripts?.[script] ? pass(`package script: ${script}`) : fail(`package script: ${script}`);

const routeFiles = fs.readdirSync(path.join(root, "src/routes")).filter((f) => f.endsWith(".tsx"));
for (const f of routeFiles) {
  const text = read(path.join("src/routes", f));
  if (!/createFileRoute\(/.test(text)) note(`route file requires generated tree review: ${f}`);
}

const forbidden = [/api\.x\.ai/i, /XAI_API_KEY/];
const localTutor = read("src/lib/tutor.ts");
for (const pattern of forbidden) pattern.test(localTutor) ? fail(`local tutor contains forbidden API dependency: ${pattern}`) : null;
pass("local tutor remains API-independent");

if (fs.existsSync(path.join(root, "node_modules"))) {
  note("node_modules exists; run typecheck/build in CI before publishing");
} else {
  note("dependency install is unavailable in this verification environment; typecheck/build are not claimed as passed");
}

if (failed) process.exit(1);
console.log("Final release audit: PASS — static production gates passed; runtime build gates must be executed in a dependency-complete CI environment.");
