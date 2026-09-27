#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const CAP = "8.5.2";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit", env: process.env });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) reject(new Error(`${command} terminated by ${signal}`));
      else if (code !== 0) reject(new Error(`${command} exited with ${code}`));
      else resolve();
    });
  });
}

for (const f of ["index.html", "logo.png", "offline-no-internet.png"]) {
  if (!existsSync(join(root, "mobile-shell", f))) {
    throw new Error("mobile-shell/" + f + " missing");
  }
}

await run(npm, [
  "install", "--no-save", "--no-package-lock",
  `@capacitor/core@${CAP}`, `@capacitor/cli@${CAP}`, `@capacitor/android@${CAP}`,
]);

if (!existsSync(join(root, "android"))) {
  await run(npx, ["cap", "add", "android"]);
}
await run(npx, ["cap", "sync", "android"]);
console.log("Capacitor Android ready (splash + offline shell).");
