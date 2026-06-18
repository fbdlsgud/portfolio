# Ralph Run: Obstacle Race Game

Started: 2026-06-18T11:15:47Z

## Goal

Build a 1-7 player party betting obstacle runner game with an original retro side-scroller feel, strong UI/UX, automatic runners, probabilistic obstacle jumps, stun penalties, finish ranking, and clear betting result.

## Criteria

| ID | Criterion | Verification | Status |
|---|---|---|---|
| C1 | A new 1-7 player party betting runner game is wired into the games page and routes. | Inspect `routes.jsx`, `Games.jsx`, and `Header.jsx` for `/obstacle-race` route/card/active-state wiring. | PASS |
| C2 | The game has a Super Mario-style original retro side-scrolling course with visible moving runners, obstacles, finish, and responsive UI. | Inspect `ObstacleRace.jsx` and `ObstacleRace.module.css` for course, runners, obstacle, finish, jump/stun classes, responsive media queries, and reduced-motion handling. | PASS |
| C3 | Race logic supports random obstacle jump success/failure, stun delays, finish order, and configurable penalty mode. | Inspect `ObstacleRace.jsx` for RAF loop, obstacle challenge logic, `stunUntil`/`stunCount`, `finishOrder`, player count, editable names, and first/last/most-stuns penalty modes. | PASS |
| C4 | The implementation is validated and documented. | Run `npm run build`, curl `/obstacle-race` on dev server when available, and inspect docs/ai feature log plus Ralph report. | PASS |

## Iteration 0

Criteria recorded before implementation.

## Iteration 1 Implementation

- Added `ObstacleRace.jsx` and `ObstacleRace.module.css`.
- Added `/obstacle-race` route, Games card, and Header active-route coverage.
- Added 1-7 player setup, editable names, first/last/most-stuns betting modes, automatic race loop, obstacle challenge logic, random jump success/failure, stun delays, finish ordering, and result panel.
- Added an original retro platformer UI: sky, hills, castle, fixed horizontal race lanes, progress lines, block/pipe/spike obstacles, finish flag, moving runner avatars, jump lift, foot run animation, stun shake, responsive media queries, and reduced-motion handling.
- Updated `docs/ai/conventions.md` and wrote feature log `docs/ai/feature-log/2026-06-18-obstacle-race-game.md`.

## JUDGE Result - Iteration 1

| Criterion | Status | Evidence |
|---|---|---|
| C1 | PASS | `rg -n "obstacle-race|ObstacleRace|isGamesRoute" src/components/page/games/Games.jsx src/components/routes/routes.jsx src/components/header/Header.jsx` found `/obstacle-race` card, route import/entry, and Header active-state coverage. |
| C2 | PASS | `rg -n "OBSTACLES|runner-jump|runner-stun|prefers-reduced-motion|@media" src/components/page/games/ObstacleRace.jsx src/components/page/games/ObstacleRace.module.css` found course obstacles, jump/stun visual states, responsive media queries, and reduced-motion handling. Source inspection also found sky/hill/castle/stage/track/finish flag CSS. |
| C3 | PASS | `rg -n "MAX_PLAYERS|penaltyMode|stunUntil|stunCount|jumpChance|requestAnimationFrame|finishOrder" src/components/page/games/ObstacleRace.jsx` found 1-7 setup, betting mode, random jump chance, stun counters, RAF loop, and finish order logic. |
| C4 | PASS | `git diff --check` exited 0. `npm run build` exited 0 with `Compiled successfully`. Dev server hot reload ended with `Compiled successfully`. `curl -I http://127.0.0.1:3000/obstacle-race` returned `HTTP/1.1 200 OK`. Feature log exists at `docs/ai/feature-log/2026-06-18-obstacle-race-game.md`. |

Verdict: PASS

## Final

All Ralph criteria passed in iteration 1. Browser screenshot tooling was not exposed in this session, so visual verification used source-level UI checks plus build, dev-server hot reload, and local route response evidence.

## Post-Feedback Ralph Rerun: World-Coordinate Overhaul

Started: 2026-06-18T12:05:00Z

User feedback superseded the first pass: the runner still read as standing in place, and the requested behavior is a Super Mario-style side-scrolling race where characters actually run along a fixed course and jump obstacles.

### Rerun Criteria

| ID | Criterion | Verification | Status |
|---|---|---|---|
| R1 | The race uses real world coordinates instead of percent-only progress. | Inspect `ObstacleRace.jsx` for `COURSE_LENGTH`, `FINISH_X`, runner `x`, obstacle `x`, and `cameraX`. | PASS |
| R2 | The UI renders a long fixed course with a following camera, fixed obstacles, start/finish gates, and runners moving through that world. | Inspect `ObstacleRace.jsx` and `ObstacleRace.module.css` for `.worldViewport`, `.world`, `.laneStrip`, `.obstacle`, `.finishGate`, and inline `translate3d(${-cameraX}px, 0, 0)`. | PASS |
| R3 | Runners visibly jump over obstacles or fail into stun states with dynamic motion. | Inspect source for `jumpLift`, `JUMP_DURATION`, `stunUntil`, `impactUntil`, `.runnerJump`, `.runnerStun`, `.impactBurst`, and per-runner transforms. | PASS |
| R4 | Visual/runtime evidence proves movement is not stationary. | Use bundled Playwright with local Chrome after START and capture world transform, runner transforms, obstacle count, and screenshot. | PASS |
| R5 | Build, route, and docs are current. | Run `git diff --check`, `npm run build`, curl `/obstacle-race`, and update feature/error/proposed-rule docs. | PASS |

### Rerun Implementation

- Replaced percent-track movement with a pixel course: `COURSE_LENGTH = 2680`, `FINISH_X = 2440`, `START_X = 72`.
- Rebuilt obstacles as world-positioned objects at `x` values from 360m to 2220m.
- Rebuilt runner state around `x`, `speed`, `jumpLift`, `jumpStart`, `jumpUntil`, `stunUntil`, `impactUntil`, and `finishedAt`.
- Added camera following via `cameraX`, easing toward the leader while the world moves underneath the viewport.
- Replaced the old static lane composition with a side-scrolling world, repeated lane strips, fixed obstacle instances, runner shadows, JUMP/STUN bubbles, impact bursts, and live result cards.

### JUDGE Result - Rerun

| Criterion | Status | Evidence |
|---|---|---|
| R1 | PASS | `rg -n "COURSE_LENGTH|FINISH_X|cameraX|jumpLift|runnerJump|runnerStun|worldViewport|obstacleClassMap" src/components/page/games/ObstacleRace.jsx src/components/page/games/ObstacleRace.module.css` found the pixel course constants, camera state, jump lift, world viewport, obstacle mapping, and motion state classes. |
| R2 | PASS | Source inspection found the long `.world` rendered at `2680px`, `translate3d(${-cameraX}px, 0, 0)`, lane strips at fixed world coordinates, obstacle instances at fixed `obstacle.x`, and a finish gate at `FINISH_X`. |
| R3 | PASS | Race loop branches into success/failure per obstacle, applies jump arcs through `Math.sin(...)*72`, stuns through `stunUntil`, and renders `.runnerJump`, `.runnerStun`, and `.impactBurst`. |
| R4 | PASS | Playwright visual QA after START at 2.7s recorded world transform `translate3d(-170.044px, 0px, 0px)`, runner transforms `690.964px`, `604.859px`, `506.44px`, `630.777px`, 32 obstacle nodes, JUMP/STUN text, and screenshot `/private/tmp/obstacle-race-visual-qa.png`. |
| R5 | PASS | `git diff --check` exited 0. `npm run build` exited 0 with `Compiled successfully`. `curl -I http://127.0.0.1:3000/obstacle-race` returned `HTTP/1.1 200 OK`. Feature log and error/proposed-rule docs were updated. |

Verdict: PASS
