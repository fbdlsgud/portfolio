# 2026-06-18 Obstacle Race Transform Conflict

## Symptom

During automated play QA, runner overlap appeared in some frames even after lane spacing had been increased. The screenshots looked mostly separated, but stunned runners could still appear to jump or stack incorrectly.

## Root Cause

The `.runnerStun` class animated `transform` on the root `.runner` element. That root element also receives the JS position transform:

```text
translate3d(runner.x, laneY - runner.jumpLift, 0)
```

CSS animation on the same `transform` property can override the inline world-position transform, so stunned runners could temporarily lose their track coordinates.

## Fix

Moved stun shake from the root `.runnerStun` selector to `.runnerStun .runnerBody`. The root runner keeps the JS world coordinate transform, while the body can still shake visually.

## Validation

- `git diff --check` passed.
- `npm run build` passed with `Compiled successfully`.
- Playwright audit passed desktop 4P, desktop 7P, mobile 4P, and mobile 7P. Every sampled frame had `consoleErrors: []`, `bodyOverlaps: []`, and `pageOverflowX: 0`.

## Possible Future Rule

For moving game entities, never animate `transform` on the same root node used for JS/camera positioning. Put visual shakes, bobs, and tilts on a child element.
