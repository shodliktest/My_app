# Shodlik Education — v10 Adaptive Learning Engine

## Goal
Choose the next study action from evidence rather than a fixed lesson sequence.

## Decision model
1. Scheduled review due date is highest priority.
2. Lessons with `review` mastery status are prioritised for repair.
3. The engine detects the user's weakest observed core skill.
4. Lessons containing that skill receive a targeting bonus.
5. Current CEFR level receives a progression bonus.
6. Prerequisite gates are respected.
7. Bridge/retrieval lessons receive additional support when appropriate.
8. Level distance is penalised to avoid uncontrolled jumps.

## Actions
- `review`: scheduled retrieval is due.
- `repair`: assessment evidence indicates a weak lesson.
- `continue`: continue building the current level.
- `bridge`: use a curriculum bridge/retrieval lesson.
- `advance`: current level evidence is strong enough to move toward the next stage.

## Methodological limitation
This is adaptive sequencing, not an automatic CEFR certification. CEFR readiness still requires repeated evidence across skills and appropriate assessment tasks.
