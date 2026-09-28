# Shodlik Education v16 — Vocabulary Intelligence & Spaced Retrieval 2.0

## Principle
Vocabulary is learned through repeated retrieval across meaning, translation, audio, sentence, speaking and writing contexts. The engine is deterministic and works without an AI API.

## Retrieval model
- short first interval for new/failed items
- adaptive interval growth
- ease factor
- streak tracking
- lapses
- leech detection after repeated failure
- overdue priority
- context coverage priority

## Context chain
Meaning → Uzbek→English → English→Uzbek → Audio → Sentence → Speaking → Writing → mixed retrieval.

## Personalisation
The vocabulary intelligence layer ranks words using CEFR level, due time, context gaps, accuracy, lapses and leech state. It can produce a deterministic retrieval plan without an LLM.

## Backward compatibility
Persisted v1 cards are migrated with defaults for new SRS fields and missing context flags.
