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
