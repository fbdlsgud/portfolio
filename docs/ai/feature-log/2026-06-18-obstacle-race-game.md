# 2026-06-18 Obstacle Race Game

## Goal

Build a 1-7 player party betting runner game where automatic racers cross a retro side-scroller course, probabilistically jump over obstacles, fail into stun states, and produce a clear penalty target.

## Touched Files

- `src/components/page/games/ObstacleRace.jsx`
- `src/components/page/games/ObstacleRace.module.css`
- `src/components/page/games/Games.jsx`
- `src/components/routes/routes.jsx`
- `src/components/header/Header.jsx`
- `docs/ai/conventions.md`
- `docs/ai/ralph-runs/20260618T111547Z-obstacle-race-ralph.md`

## Implementation Shape

- Added `/obstacle-race` route and Games page card.
- Added configurable 1-7 player setup with editable names and color-coded runners.
- Added three betting modes: first finisher, last finisher, and most stuns.
- Built an automatic `requestAnimationFrame` race loop with per-runner speed, obstacle index, random jump success, collision failure, stun delay, finish order, and result selection.
- Built an original retro platformer UI with sky, hills, castle, fixed lanes, brick/pipe/spike obstacles, moving runners, jump lift, run feet animation, stun shake, progress line, finish flag, result panel, responsive layouts, and reduced-motion handling.

## Validation

- `git diff --check` passed.
- Source checks found `/obstacle-race` route/card/header wiring.
- Source checks found `MAX_PLAYERS`, `OBSTACLES`, `requestAnimationFrame`, `jumpChance`, `stunUntil`, `stunCount`, `finishOrder`, `runner-jump`, `runner-stun`, responsive media queries, and reduced-motion handling.
- `npm run build` passed with `Compiled successfully`.
- Dev server hot reload ended with `Compiled successfully`.
- `curl -I http://127.0.0.1:3000/obstacle-race` returned `HTTP/1.1 200 OK`.

## Follow-Up Risks

- In-app browser screenshot tooling was not exposed in this session, so visual QA used source inspection and build/runtime route checks.
- Existing CRA test command was not run because this task's configured required validation gates only expose build, while lint/typecheck are empty in `.ai-local/project-profile.yaml`.
