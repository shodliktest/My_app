#!/usr/bin/env node
/**
 * Build the Shodlik Education client for a self-contained Capacitor APK.
 *
 * Mobile mode uses TanStack Start SPA mode and MUST NOT depend on a Vercel/Nitro
 * server at runtime. The script normalizes the static build output into the
 * directory declared by capacitor.config.json: .output/public.
 */
import { spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const publicDir = join(root, ".output", "public");

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

// Remove the previous normalized output so stale files cannot accidentally
// make a broken build look valid.
rmSync(publicDir, { recursive: true, force: true });

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
  {
    VITE_AUTH_ENABLED: "false",
  },
);

/**
 * TanStack Start's output location can differ by the active build adapter.
 * Prefer the direct public output, then known static adapter locations.
 */
const candidates = [
  {
    dir: publicDir,
    index: join(publicDir, "index.html"),
    shell: join(publicDir, "_shell.html"),
  },
  {
    dir: join(root, ".vercel", "output", "static"),
    index: join(root, ".vercel", "output", "static", "index.html"),
    shell: join(root, ".vercel", "output", "static", "_shell.html"),
  },
  {
    dir: join(root, "dist"),
    index: join(root, "dist", "index.html"),
    shell: join(root, "dist", "_shell.html"),
  },
  {
    dir: join(root, "dist", "client"),
    index: join(root, "dist", "client", "index.html"),
    shell: join(root, "dist", "client", "_shell.html"),
  },
  {
    dir: join(root, "build"),
    index: join(root, "build", "index.html"),
    shell: join(root, "build", "_shell.html"),
  },
  {
    dir: join(root, "build", "client"),
    index: join(root, "build", "client", "index.html"),
    shell: join(root, "build", "client", "_shell.html"),
  },
];

const source = candidates.find(
  (candidate) => existsSync(candidate.index) || existsSync(candidate.shell),
);

if (!source) {
  throw new Error(
    [
      "Mobile build failed: no static HTML entry was produced.",
      "Checked:",
      ...candidates.map((candidate) => `- ${candidate.index}`),
      ...candidates.map((candidate) => `- ${candidate.shell}`),
    ].join("\n"),
  );
}

// Normalize adapter output into Capacitor's webDir.
if (source.dir !== publicDir) {
  mkdirSync(publicDir, { recursive: true });
  cpSync(source.dir, publicDir, { recursive: true });
}

const normalizedIndex = join(publicDir, "index.html");
const normalizedShell = join(publicDir, "_shell.html");

// Capacitor loads index.html directly. TanStack Start's SPA shell may be named
// _shell.html, so promote it to index.html when necessary.
if (!existsSync(normalizedIndex) && existsSync(normalizedShell)) {
  renameSync(normalizedShell, normalizedIndex);
}

if (!existsSync(normalizedIndex)) {
  throw new Error(
    "Mobile build failed: normalized .output/public/index.html was not produced.",
  );
}

// Sanity-check that the normalized entry is actually HTML, not an empty file.
const html = readFileSync(normalizedIndex, "utf8");
if (!/<html[\s>]/i.test(html) || !/<script[\s>]/i.test(html)) {
  throw new Error(
    "Mobile build failed: .output/public/index.html is not a valid app shell.",
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
      output: ".output/public",
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  ) + "\n",
);

console.log("Mobile web build ready: .output/public");
console.log(`Mobile entry: ${normalizedIndex}`);
