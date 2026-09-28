#!/usr/bin/env node
/**
 * Builds the same Shodlik Education source for a self-contained Capacitor APK.
 *
 * Mobile mode deliberately disables remote authentication. The learning engine
 * is local-first (Zustand + PGLite/client data), while optional AI/TTS providers
 * remain graceful enhancements. No Vercel URL is embedded into the APK.
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) reject(new Error(`${command} terminated by ${signal}`));
      else if (code !== 0) reject(new Error(`${command} exited with ${code}`));
      else resolve();
    });
  });
}

await run(process.platform === "win32" ? "node.exe" : "node", [
  join(root, "scripts", "with-app-env.mjs"),
  process.platform === "win32" ? "npx.cmd" : "npx",
  "vite",
  "build",
  "--mode",
  "mobile",
], {
  VITE_AUTH_ENABLED: "false",
});

const publicDir = join(root, ".output", "public");
const vercelStaticDir = join(root, ".vercel", "output", "static");
const publicIndex = join(publicDir, "index.html");
const vercelIndex = join(vercelStaticDir, "index.html");

// TanStack Start/Nitro with the Vercel preset writes the static client
// output to .vercel/output/static. Capacitor expects the web assets under
// .output/public, so copy the generated static output when necessary.
if (!existsSync(publicIndex) && existsSync(vercelIndex)) {
  const { cpSync, mkdirSync } = await import("node:fs");

  mkdirSync(publicDir, { recursive: true });
  cpSync(vercelStaticDir, publicDir, { recursive: true });

  console.log(
    "Mobile web build output copied: .vercel/output/static -> .output/public",
  );
}

const index = join(publicDir, "index.html");
if (!existsSync(index)) {
  throw new Error(
    "Mobile build failed: neither .output/public/index.html nor .vercel/output/static/index.html was produced.",
  );
}

const marker = join(publicDir, "shodlik-mobile.json");
writeFileSync(
  marker,
  JSON.stringify(
    {
      app: "Shodlik Education",
      mode: "offline-first",
      auth: "disabled",
      remoteRequired: false,
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  ) + "\n",
);

console.log("Mobile web build ready: .output/public");
