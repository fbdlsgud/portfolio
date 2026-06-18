# 2026-06-18 Obstacle Race Game

## Goal

Build a 1-7 player party betting runner game where automatic racers cross a retro side-scroller course, probabilistically jump over obstacles, fail into stun states, and produce a clear penalty target.

## Touched Files

- `src/components/page/games/ObstacleRace.jsx`
- `src/components/page/games/ObstacleRace.module.css`
- `src/App.js`
- `src/App.test.js`
- `src/components/page/games/Games.jsx`
- `src/components/routes/routes.jsx`
- `src/components/header/Header.jsx`
- `docs/ai/conventions.md`
- `docs/ai/ralph-runs/20260618T111547Z-obstacle-race-ralph.md`
- `docs/ai/error-cases/2026-06-18-obstacle-race-stationary-motion.md`
- `docs/ai/error-cases/2026-06-18-obstacle-race-transform-conflict.md`
- `docs/ai/proposed-rules/2026-06-18-motion-game-visual-qa.md`

## Implementation Shape

- Added `/obstacle-race` route and Games page card.
- Added configurable 1-7 player setup with editable names and color-coded runners.
- Added three betting modes: first finisher, last finisher, and most stuns.
- Built an automatic `requestAnimationFrame` race loop with per-runner speed, obstacle index, random jump success, collision failure, stun delay, finish order, and result selection.
- Built an original retro platformer UI with sky, hills, castle, fixed lanes, brick/pipe/spike obstacles, moving runners, jump lift, run feet animation, stun shake, progress line, finish flag, result panel, responsive layouts, and reduced-motion handling.

## Post-Feedback Overhaul

- Replaced percent-track movement with pixel-based world coordinates: `COURSE_LENGTH`, `FINISH_X`, per-runner `x`, obstacle `x`, and a following `cameraX`.
- Rebuilt the race stage as a long side-scrolling world where the map, obstacles, start gate, finish gate, and runners share the same coordinate system.
- Added visible jump arcs with `jumpLift`, runner shadows pinned to the lane ground, JUMP/STUN bubbles, impact burst, and live meter cards so the race reads as a platformer instead of a progress bar.
- Repeated each obstacle on every lane so 1-7 players run the same fixed course and independently succeed/fail with probabilistic jump checks.

## Indie Polish And Bugfix Pass

- Fixed a real motion bug where `.runnerStun` animated `transform` on the same root element that receives the JS world-position `translate3d(...)`, causing stunned runners to lose their track coordinates.
- Moved stun shake to `.runnerBody` so the character shakes without overriding world movement.
- Increased lane spacing and reduced runner/jump proportions so 1-7 player races no longer stack characters across lanes.
- Reordered the screen so the live stage appears before the name/status panels, especially on mobile.
- Added a stage progress meter, READY/RESULT stage overlays, obstacle warning markers, stronger viewport vignette, and compact mobile header treatment.
- Enabled React Router future flags in `BrowserRouter` to remove runtime console warnings during QA.
- Replaced the stale CRA default App test with a real app navigation render test and mocked the project axios wrapper to keep tests network-free.

## Validation

- `git diff --check` passed.
- Source checks found `/obstacle-race` route/card/header wiring.
- Source checks found `MAX_PLAYERS`, `OBSTACLES`, `requestAnimationFrame`, `jumpChance`, `stunUntil`, `stunCount`, `finishOrder`, `runner-jump`, `runner-stun`, responsive media queries, and reduced-motion handling.
- `npm run build` passed with `Compiled successfully`.
- `CI=true npm test -- --watchAll=false` passed with 1 test suite and 1 test.
- Dev server hot reload ended with `Compiled successfully`.
- `curl -I http://127.0.0.1:3000/obstacle-race` returned `HTTP/1.1 200 OK`.
- Playwright visual QA with bundled runtime and local Chrome passed after START at 2.7s: world transform was `translate3d(-170.044px, 0px, 0px)`, runner transforms included `690.964px`, `604.859px`, `506.44px`, and `630.777px`, obstacle count was 32, and screenshot was written to `/private/tmp/obstacle-race-visual-qa.png`.
- Post-polish Playwright audit passed on desktop 4P, desktop 7P, mobile 4P, and mobile 7P. Every sampled frame reported `consoleErrors: []`, `bodyOverlaps: []`, and `pageOverflowX: 0`. Screenshots were written to `/private/tmp/obstacle-race-desktop-4p.png`, `/private/tmp/obstacle-race-desktop-7p.png`, `/private/tmp/obstacle-race-mobile-4p.png`, and `/private/tmp/obstacle-race-mobile-7p.png`.

## Follow-Up Risks

- In-app browser screenshot tooling was not exposed in this session, so visual QA used bundled Playwright plus local Chrome instead.
- Existing CRA test command was not run because this task's configured required validation gates only expose build, while lint/typecheck are empty in `.ai-local/project-profile.yaml`.
