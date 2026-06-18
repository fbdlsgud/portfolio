# 2026-06-18 Obstacle Race Stationary Motion

## Symptom

The obstacle race was intended to feel like a Super Mario-style side-scroller, but the first implementation still read as if runners were standing in place. The user specifically called out that characters should run along the track and jump obstacles, not stay visually static.

## Root Cause

The first implementation used percent progress inside fixed lane rows. Even with jump/stun CSS, the motion model was still tied to a progress bar rather than a long world coordinate system with fixed obstacles and a following camera. Source checks confirmed classes and logic existed, but they did not prove the visual experience was dynamic enough.

## Fix

Rebuilt the race around pixel world coordinates:

- `COURSE_LENGTH`, `FINISH_X`, runner `x`, obstacle `x`, and `cameraX`.
- A long `.world` translated by the camera inside a clipped `.worldViewport`.
- Fixed obstacle instances repeated per lane.
- Per-runner `translate3d(x, laneY - jumpLift, 0)` movement.
- Visible jump arcs, ground shadows, JUMP/STUN bubbles, and impact bursts.

## Validation

- `git diff --check` passed.
- `npm run build` passed with `Compiled successfully`.
- `curl -I http://127.0.0.1:3000/obstacle-race` returned `HTTP/1.1 200 OK`.
- Playwright visual QA after START at 2.7s recorded world transform `translate3d(-170.044px, 0px, 0px)`, runner transforms at `690.964px`, `604.859px`, `506.44px`, and `630.777px`, plus 32 obstacle nodes and JUMP/STUN text.

## Possible Future Rule

For motion-heavy game UI, do not accept source-level animation class checks as enough. Verify that the coordinate model creates changing screen/world positions and capture at least one runtime frame after interaction when browser tooling is available.
