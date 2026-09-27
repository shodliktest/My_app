# Shodlik Education — v9 Assessment & Mastery Engine

## Purpose
Turn lesson completion from a binary checkbox into evidence-based mastery tracking.

## Model
- **Lesson score**: performance across the lesson session.
- **Test score**: the final assessment is tracked separately from practice.
- **Mastery threshold**: 80% by default.
- **Review band**: 60–79%.
- **Weak-skill extraction**: the final assessment is grouped by exercise skill and the lowest-performing skills are stored for future review.
- **Review scheduling**: higher assessment scores create longer review intervals; low scores return the lesson to short review.
- **Adaptive level signal**: the progress screen combines completed/mastered lesson evidence with weighted skill evidence to produce a study-level recommendation.

## Important methodological rule
The engine does **not** claim that one short test proves CEFR mastery. The 80% threshold is an in-app mastery checkpoint for lesson progression. CEFR placement/readiness should use multiple skills and repeated evidence.

## Current implementation
- `src/lib/mastery.ts` — mastery calculations and review policy.
- `src/lib/types.ts` — persisted lesson assessment fields.
- `src/lib/store.ts` — assessment persistence.
- `src/components/lesson-player.tsx` — separate final-test tracking and mastery result.
- `src/routes/progress.tsx` — mastery dashboard and study-level recommendation.
- `src/routes/learn.tsx` — lesson mastery badges.
- `scripts/mastery-audit.mjs` — structural QA.

## Next pedagogical expansion
The next assessment pass should replace the current mostly lesson-level test bank with larger item pools, calibrated distractors, delayed retesting, and explicit speaking/writing rubrics. Those require content authoring and calibration rather than merely adding a percentage field.
