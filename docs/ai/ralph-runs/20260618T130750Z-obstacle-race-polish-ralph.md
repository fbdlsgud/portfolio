# Ralph Run: Obstacle Race Indie Polish

Started: 2026-06-18T13:07:50Z

## Goal

Fix remaining obstacle-race bugs and raise the screen toward a polished indie-game feel with verifiable runtime evidence.

## Criteria

| ID | Criterion | Verification | Status |
|---|---|---|---|
| P1 | Runner motion must preserve world coordinates in run, jump, stun, and finish states. | Inspect CSS/JS for root runner transform ownership and run Playwright frame audit. | PASS |
| P2 | 1-7 player lanes must avoid visible character body overlap during active play. | Playwright audit desktop 4P, desktop 7P, mobile 4P, mobile 7P with `bodyOverlaps: []`. | PASS |
| P3 | The screen must feel more game-like and surface the stage earlier, especially on mobile. | Inspect `ObstacleRace.jsx`/CSS for stage-first order, meter, overlays, obstacle markers, and mobile compacting; verify screenshots. | PASS |
| P4 | Runtime must be clean of app console errors/warnings caused by this screen. | Playwright audit `consoleErrors: []`; inspect `BrowserRouter` future flags. | PASS |
| P5 | Build, route, screenshots, and docs must be current. | Run `git diff --check`, `npm run build`, route curl, Playwright screenshots, feature/error logs. | PASS |

## Implementation

- Increased lane gap to `96` and reduced jump height to `42`.
- Added stage meter, READY/RESULT overlays, obstacle warning markers, and stronger viewport treatment.
- Reordered layout so `worldCard` appears before name/status panels.
- Fixed `.runnerStun` transform conflict by moving shake animation to `.runnerStun .runnerBody`.
- Enabled React Router future flags to remove runtime warnings.
- Replaced the stale default App test with a real navigation render test and axios wrapper mock.
- Updated feature log and recorded the transform conflict error case.

## JUDGE Result

| Criterion | Status | Evidence |
|---|---|---|
| P1 | PASS | `.runner` remains positioned by inline `translate3d(...)`; `.runnerStun .runnerBody` owns the shake animation, avoiding root transform override. |
| P2 | PASS | `/private/tmp/obstacle-race-audit.mjs` passed desktop 4P, desktop 7P, mobile 4P, and mobile 7P. Every sampled frame had `bodyOverlaps: []`. |
| P3 | PASS | Screenshots `/private/tmp/obstacle-race-desktop-7p.png` and `/private/tmp/obstacle-race-mobile-7p.png` show separated lanes, stage progress, obstacle markers, and mobile stage visible directly after setup controls. |
| P4 | PASS | Playwright audit for all four viewport/player combinations reported `consoleErrors: []`; `src/App.js` sets `v7_relativeSplatPath` and `v7_startTransition`. |
| P5 | PASS | `git diff --check` exited 0. `npm run build` exited 0 with `Compiled successfully`. `CI=true npm test -- --watchAll=false` exited 0 with 1 passing suite. Local `/obstacle-race` returned `HTTP/1.1 200 OK` during final route verification. |

Verdict: PASS
