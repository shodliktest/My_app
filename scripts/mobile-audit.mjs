#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

const config = JSON.parse(
  readFileSync(new URL("../capacitor.config.json", import.meta.url), "utf8"),
);
const workflow = readFileSync(
  new URL("../.github/workflows/android-apk.yml", import.meta.url),
  "utf8",
);
const mobileBuild = readFileSync(
  new URL("./mobile-build.mjs", import.meta.url),
  "utf8",
);
const vite = readFileSync(
  new URL("../vite.config.ts", import.meta.url),
  "utf8",
);
const mastery = readFileSync(
  new URL("../src/lib/mastery.ts", import.meta.url),
  "utf8",
);
const lessonPlayer = readFileSync(
  new URL("../src/components/lesson-player.tsx", import.meta.url),
  "utf8",
);
const router = readFileSync(
  new URL("../src/router.tsx", import.meta.url),
  "utf8",
);
const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const checks = [
  [config.appId === "uz.shodlik.education", "Capacitor app id"],
  [config.webDir === ".output/public", "Capacitor uses local build output"],
  [!config.server, "No Capacitor remote server URL"],
  [workflow.includes('VITE_AUTH_ENABLED: "false"'), "Mobile auth disabled in CI"],
  [workflow.includes("npm run build:mobile"), "Offline mobile build step"],
  [workflow.includes("npm run typecheck"), "Typecheck before Android build"],
  [workflow.includes("assembleDebug"), "Android debug APK build"],
  [workflow.includes("upload-artifact@v4"), "APK artifact upload"],
  [workflow.includes('platforms;android-${COMPILE_SDK}'), "Android platform SDK installation"],
  [workflow.includes('build-tools;36.0.0'), "Android 36 build-tools installation"],
  [pkg.scripts["build:mobile"] === "node scripts/mobile-build.mjs", "mobile build script"],
  [pkg.scripts["mobile:prepare"] === "node scripts/capacitor-prepare.mjs", "Capacitor prepare script"],
  [vite.includes('mode === "mobile"'), "Mobile build mode"],
  [vite.includes("spa:") && vite.includes("enabled: true"), "TanStack Start SPA mode"],
  [vite.includes('outputPath: "/index.html"'), "Mobile SPA shell emitted as index.html"],
  [vite.includes('mode !== "mobile"'), "Nitro/Vercel server skipped for mobile"],
  [mobileBuild.includes(".vercel") && mobileBuild.includes("output") && mobileBuild.includes("static"), "Legacy Vercel static output fallback"],
  [mobileBuild.includes("_shell.html"), "TanStack SPA shell fallback"],
  [mobileBuild.includes(".output/public"), "Normalized Capacitor web directory"],
  [mastery.includes("export function skillPct"), "skillPct exported from mastery"],
  [lessonPlayer.includes("makeDictation(line.en, lesson.level) : null"), "Lesson player dictation syntax"],
  [router.includes("createHashHistory") && router.includes('import.meta.env.MODE === "mobile"'), "Android uses hash history for local deep links"],
  [existsSync(new URL("../OFFLINE_ANDROID_v19.md", import.meta.url)), "offline Android documentation"],
];

let failed = 0;
for (const [ok, label] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed += 1;
}

if (failed) process.exit(1);
console.log(`Mobile/Android audit: PASS (${checks.length} checks)`);
