#!/usr/bin/env node
/**
 * Mobile web bundle for Capacitor.
 * Production APK uses server.url (Vercel). Local .output/public is fallback shell.
 */
import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  cpSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const out = join(root, ".output", "public");

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

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

await run(
  process.platform === "win32" ? "node.exe" : "node",
  [
    join(root, "scripts", "with-app-env.mjs"),
    process.platform === "win32" ? "npx.cmd" : "npx",
    "vite",
    "build",
    "--mode",
    "mobile",
  ],
  { VITE_AUTH_ENABLED: "false" },
);

mkdirSync(out, { recursive: true });

const candidates = [
  join(root, ".output", "public"),
  join(root, ".vercel", "output", "static"),
  join(root, "dist", "client"),
  join(root, "dist"),
];

let source = null;
for (const c of candidates) {
  if (existsSync(join(c, "index.html")) || existsSync(join(c, "assets"))) {
    source = c;
    break;
  }
}

if (!source) {
  console.error("No static build output found.");
  process.exit(1);
}

if (source !== out) {
  console.log("Copying", source, "->", out);
  copyDir(source, out);
}

const indexPath = join(out, "index.html");
if (!existsSync(indexPath)) {
  const assetsDir = join(out, "assets");
  let js = "";
  let css = "";
  if (existsSync(assetsDir)) {
    for (const f of readdirSync(assetsDir)) {
      if (!js && /^index-.*\.js$/.test(f)) js = f;
      if (!css && /^styles-.*\.css$/.test(f)) css = f;
    }
  }
  writeFileSync(
    indexPath,
    `<!DOCTYPE html><html lang="uz"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>Shodlik Education</title>
${css ? `<link rel="stylesheet" href="/assets/${css}"/>` : ""}
</head><body style="margin:0;background:#F7FBF9"><div id="root"></div>
${js ? `<script type="module" src="/assets/${js}"></script>` : ""}
</body></html>`,
  );
}

writeFileSync(
  join(out, "shodlik-mobile.json"),
  JSON.stringify(
    {
      app: "Shodlik Education",
      mode: "hybrid-vercel",
      server: "https://myapp-rose-alpha.vercel.app",
      auth: "disabled",
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  ) + "\n",
);

console.log("Mobile web build ready:", out);
