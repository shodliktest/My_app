#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";

const checks = [];
const check = (name, ok, detail = "") => checks.push({ name, ok: Boolean(ok), detail });

const lessonRoute = "src/routes/learn.$lessonId.tsx";
const learnRoute = "src/routes/learn.tsx";
const router = "src/router.tsx";
const tree = "src/routeTree.gen.ts";

check("dynamic lesson route exists", existsSync(lessonRoute));
check("learn route exists", existsSync(learnRoute));
check("route tree exists", existsSync(tree));
check("web uses browser history", readFileSync(router, "utf8").includes("createBrowserHistory"));
check("route tree contains /learn/$lessonId", readFileSync(tree, "utf8").includes("'/learn/$lessonId'"));
const lesson = readFileSync(lessonRoute, "utf8");
check("lesson route uses createFileRoute", lesson.includes('createFileRoute("/learn/$lessonId")'));
check("lesson route resolves params in loader", lesson.includes("loader: ({ params })"));
check("lesson route reads LESSON_BY_ID", lesson.includes("LESSON_BY_ID[params.lessonId]"));
check("lesson route renders LessonPlayer", lesson.includes("<LessonPlayer lesson={lesson} />"));
check("lesson route has no hydration redirect", !lesson.includes('navigate({ to: "/learn", replace: true })'));
const vercel = readFileSync("vercel.json", "utf8");
check("Vercel does not omit dev dependencies", !vercel.includes("--omit=dev"));

const failed = checks.filter((x) => !x.ok);
for (const x of checks) console.log(`${x.ok ? "PASS" : "FAIL"} ${x.name}${x.detail ? ` — ${x.detail}` : ""}`);
console.log(`WEB ROUTE AUDIT: ${checks.length - failed.length}/${checks.length} PASS`);
if (failed.length) process.exit(1);
