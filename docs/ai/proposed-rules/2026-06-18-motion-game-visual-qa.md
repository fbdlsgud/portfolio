# 2026-06-18 Motion Game Visual QA

## Source Case

`docs/ai/error-cases/2026-06-18-obstacle-race-stationary-motion.md`

## Proposed Rule

When implementing or revising a motion-heavy game UI, verification must include runtime evidence that the primary actor changes position in the intended coordinate system. Source checks for animation class names are not enough.

## Target File

`AGENTS.md` or shared workflow QA guidance.

## Reason

The obstacle race initially passed source/build checks while still feeling stationary to the user. A runtime frame after START showed the meaningful evidence: world transform, runner transforms, fixed obstacle count, and JUMP/STUN state text.

## Risk Of Adding The Rule

Visual QA can add time and may require browser permissions or local runtime support. The rule should allow a documented fallback when browser tooling is unavailable.

## Eval That Should Catch Regression

Create a motion-game QA checklist that fails if no runtime evidence records changing actor/world coordinates after user interaction.
