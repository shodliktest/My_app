# Shodlik Education v18 — Final Production Release Candidate

## Release goal
v18 is the final hardening layer over the Local-First learning platform. The product is designed to remain usable without an AI API or premium speech provider.

## Included learning systems
- CEFR curriculum and teacher-authored contexts
- assessment item bank and mastery
- adaptive learning and review scheduling
- Error Intelligence and remediation
- Local-First Teacher Tutor
- local speaking/writing assessment
- vocabulary intelligence + spaced retrieval
- listening intelligence + dictation
- centralized natural-voice provider with native fallback
- progress backup/restore

## v18 hardening
- fixed the Tutor route registration gap in the generated TanStack route tree
- added final release static audit
- verified Teacher navigation target against the route tree
- verified speech providers are centralized in `src/lib/speech.ts`
- verified ResponsiveVoice key is optional and not hard-coded
- verified native speech fallback exists
- verified progress export/import wiring
- verified release scripts are registered

## Verification status
All repository-level audits that do not require installed dependencies pass.

The verification environment could not complete dependency installation from the npm registry/cache. Therefore `npm run typecheck` and `npm run build` are **not represented as passed** here. Before public deployment, run:

```bash
npm ci
npm run typecheck
npm run test
npm run lint
npm run validate:content
npm run audit:teacher-content
npm run audit:mastery
npm run audit:adaptive
npm run audit:item-bank
npm run audit:error-intelligence
npm run audit:tutor
npm run audit:vocabulary-intelligence
npm run audit:listening-intelligence
npm run audit:final-release
npm run build
```

## Speech configuration
Optional:

```env
VITE_RESPONSIVEVOICE_KEY=
```

If unset or unavailable, the app falls back to the device's installed English speech synthesis. No learning feature depends on this provider.
