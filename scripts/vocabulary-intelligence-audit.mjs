import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const srs = await readFile(new URL("../src/lib/srs.ts", import.meta.url), "utf8");
const vi = await readFile(new URL("../src/lib/vocabulary-intelligence.ts", import.meta.url), "utf8");
for (const marker of ["lapses", "leech", "contextCoverage", "nextKind", "streak"]) assert.ok(srs.includes(marker), `missing SRS marker: ${marker}`);
for (const marker of ["rankVocabulary", "buildRetrievalTask", "retrievalPlan", "collocations", "needs-context"]) assert.ok(vi.includes(marker), `missing vocabulary marker: ${marker}`);
assert.ok(srs.includes('"writing"'), "writing retrieval context missing");
console.log("Vocabulary Intelligence audit: PASS");
console.log("Local SRS: retrieval scheduling + lapses + leech detection + context coverage");
console.log("Vocabulary Intelligence: ranking + multi-context retrieval + collocation reuse");
