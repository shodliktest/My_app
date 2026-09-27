# Shodlik Education — v14 Production Hardening

## Changes
- Hardened local-first Teacher Tutor correction flow.
- Added correction validation for supported deterministic grammar patterns.
- Tutor no longer immediately exposes a correction as the retry task; it asks the learner to rewrite using the hint.
- Improved mistake reactivation: a previously resolved mistake becomes active again if the same error is recorded.
- Refreshed structured error metadata when an existing mistake is encountered again.
- Added `scripts/production-readiness-audit.mjs`.

## Verification
Passed:
- Tutor audit
- Error Intelligence audit
- Adaptive Learning audit
- Item Bank audit
- Mastery audit
- Content validation
- Production hardening static audit

## Environment limitation
The verification workspace could not complete `npm ci` within the available execution window. Therefore `npm run typecheck` and the Vite production build were not honestly marked as passed. The source and package configuration contain the required scripts and lockfile; final CI/deployment verification should run `npm ci`, `npm run typecheck`, `npm run build`, and browser smoke tests in a network-enabled build environment.
