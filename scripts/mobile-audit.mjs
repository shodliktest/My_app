#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../capacitor.config.json", import.meta.url), "utf8"));
const workflow = readFileSync(new URL("../.github/workflows/android-apk.yml", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const checks = [
  [config.appId === "uz.shodlik.education", "Capacitor app id"],
  [config.webDir === ".output/public", "Capacitor uses local build output"],
  [!config.server, "No Capacitor remote server URL"],
  [workflow.includes("VITE_AUTH_ENABLED: \"false\""), "Mobile auth disabled in CI"],
  [workflow.includes("npm run build:mobile"), "Offline mobile build step"],
  [workflow.includes("assembleDebug"), "Android debug APK build"],
  [workflow.includes("upload-artifact@v4"), "APK artifact upload"],
  [pkg.scripts["build:mobile"] === "node scripts/mobile-build.mjs", "mobile build script"],
  [pkg.scripts["mobile:prepare"] === "node scripts/capacitor-prepare.mjs", "Capacitor prepare script"],
  [existsSync(new URL("../OFFLINE_ANDROID_v19.md", import.meta.url)), "offline Android documentation"],
];
let failed = 0;
for (const [ok, label] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
console.log("Mobile/Android audit: PASS");
