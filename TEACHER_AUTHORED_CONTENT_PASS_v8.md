# Shodlik Education — v8 Teacher-Authored Content Pass

## Goal
Move the advanced pathway from generic/template lesson text toward lesson-specific teaching contexts.

## What changed
- Added `src/content/teacher-authored-context.ts` with 54 lesson-specific contextual packs.
- Every B1+ / B2 / B2+ / C1 lesson now has its own:
  - reading context in English + Uzbek
  - 4-turn listening dialogue
  - speaking task
  - writing task
  - contextual comprehension/translation/listening activities
- `src/content/pro-authoring.ts` now consumes these authored contexts for advanced lessons.
- Lower levels retain their existing material so the editorial process can be applied level-by-level instead of replacing content indiscriminately.
- Added `scripts/teacher-content-audit.mjs` and `audit:teacher-content`.
- Existing advanced content validator still passes.

## Pedagogical rule
The grammar target is taught through a situation where the structure has a communicative reason to exist. The learner is asked to notice, understand, use, and transfer the structure rather than only identify a grammar label.

## QA
- 54/54 advanced contexts present.
- 54/54 English readings present.
- 54/54 Uzbek reading versions present.
- 54/54 listening dialogues present.
- 54/54 speaking tasks present.
- 54/54 writing tasks present.
- No duplicate context IDs.
- No placeholder/template markers detected by the editorial audit.
- `npm run validate:content` passes.

## Known environment limitation
`npm run typecheck` remains blocked in the current runtime because TypeScript cannot resolve the configured `node` and `vite/client` type definition entries. This is an environment/dependency installation issue, not treated as a passing build check.

## Next editorial target
Apply the same lesson-by-lesson authoring process to Pre-A1 through B1, then add deeper assessment design: CEFR-aligned reading/listening questions, distractor quality, speaking rubrics, writing rubrics, and mastery gates.
