# 2026-06-18 Obstacle Race Distance Overflow

## Symptom

Finish-state screenshots showed the stage meter reading values above the course target, such as `2680m / 2440m`.

## Root Cause

The distance label used `cameraX + stageWidth`, which represents the right edge of the camera viewport. At the end of the course this can exceed `FINISH_X`, because the camera can see beyond the finish line inside the longer `COURSE_LENGTH`.

## Fix

Use the leading runner's actual `x` value, clamped to `FINISH_X`, for the visible distance label:

```text
leaderDistance = clamp(leader.x, 0, FINISH_X)
```

## Validation

- Full finish audit passed desktop 1P, desktop 7P, and mobile 7P.
- Each full finish scenario reported `finished: true`, `consoleErrors: []`, `maxOverflowX: 0`, `bodyOverlapCount: 0`, and `resultPresent: true`.
- Finish screenshots showed `2440m / 2440m`.

## Possible Future Rule

Do not use camera viewport coordinates as player progress. Progress labels should come from the actor, objective, or domain state being communicated.
