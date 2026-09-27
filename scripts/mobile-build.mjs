#!/usr/bin/env node

/**
 * Builds the Shodlik Education web app for Capacitor Android.
 *
 * The Vercel preset may generate the static web output in:
 *   .vercel/output/static
 *
 * Capacitor expects:
 *   .output/public
 *
 * Therefore, when needed, this script copies the generated static
 * output into .output/public.
 */

import { spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        ...env,
      },
    });

    child.on("error", reject);

    child.on("exit", (code, signal) => {
      if (signal) {
        reject(
          new Error(${command} terminated by ${signal})
        );
      } else if (code !== 0) {
        reject(
          new Error(${command} exited with ${code})
        );
      } else {
        resolve();
      }
    });
  });
}

// Build Vite mobile application
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

// Capacitor expects the web files here.
const publicDir = join(
  root,
  ".output",
  "public"
);

// TanStack/Nitro Vercel preset generates static files here.
const vercelStaticDir = join(
  root,
  ".vercel",
  "output",
  "static"
);

const publicIndex = join(
  publicDir,
  "index.html"
);

const vercelIndex = join(
  vercelStaticDir,
  "index.html"
);

// If Nitro/Vercel generated the client output in
// .vercel/output/static, copy it to .output/public.
if (!existsSync(publicIndex) && existsSync(vercelIndex)) {
  mkdirSync(publicDir, {
    recursive: true,
  });

  cpSync(
    vercelStaticDir,
    publicDir,
    {
      recursive: true,
    }
  );

  console.log(
    "Mobile web build output copied:"
  );

  console.log(
    ".vercel/output/static -> .output/public"
  );
}

// Final verification
const index = join(
  publicDir,
  "index.html"
);

if (!existsSync(index)) {
  throw new Error(
    "Mobile build failed: neither .output/public/index.html nor .vercel/output/static/index.html was produced."
  );
}

// Mobile build marker
const marker = join(
  publicDir,
  "shodlik-mobile.json"
);

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
    2
  ) + "\n"
);

console.log(
  "Mobile web build ready: .output/public"
);
