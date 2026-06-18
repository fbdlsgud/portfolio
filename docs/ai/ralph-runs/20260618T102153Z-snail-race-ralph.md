# Ralph Run: Snail Race Game Feel

Started: 2026-06-18T10:21:53Z

## Goal

Make the snail race feel like a real game: a longer course, natural snail motion, clearer race HUD, and a more convincing finish sequence. UI/UX may be redesigned.

## Criteria

| ID | Criterion | Verification |
|---|---|---|
| C1 | Snail race presents a visibly long racecourse with start, distance markers, camera/scroll framing, and finish line instead of a short static lane. | Inspect SnailRace JSX/CSS for long track viewport/world structure, start/finish markers, distance markers, and camera transform logic. |
| C2 | Snails move naturally from start to finish with smooth easing, body animation, trail/stride effects, and visible forward travel. | Inspect SnailRace race loop for target/visual progress interpolation and CSS for transform-based runner motion, shell/body animation, dust/slime/speed effects. |
| C3 | The screen feels like an actual betting race game with pre-race controls, live race HUD, rankings, finish celebration, and clear caught-person result. | Inspect DOM structure and visible labels for pre-race setup, live leader/rank board, race status, finish result, and replay/reset actions. |
| C4 | The redesign remains responsive and avoids motion-only dependence by preserving readable status text and reduced-motion behavior. | Inspect CSS media queries and prefers-reduced-motion handling plus JSX text/status outputs. |
| C5 | Project builds and local /snail-race route responds successfully after the redesign. | Run `npm run build` and `curl -I http://127.0.0.1:3000/snail-race`. |

## Iteration 0

Criteria recorded before implementation.

## Iteration 1 Implementation

- Reworked `SnailRace.jsx` from a short static lane into a long-course race model.
- Added `visualProgress` separate from target runner progress so snails ease toward their true position instead of jumping.
- Added camera-follow behavior through `cameraShift` and `--camera-offset`.
- Added `DISTANCE_MARKS`, `trackViewport`, `trackWorld`, START/GOAL gates, race HUD, live standings, and race timer.
- Added longer-track CSS with moving track texture, distance markers, progress wake, slime trail, dust, speed lines, body crawl, shell roll, eye motion, and reduced-motion handling.

## JUDGE Result - Iteration 1

| Criterion | Status | Evidence |
|---|---|---|
| C1 | PASS | Source check found `DISTANCE_MARKS`, `trackViewport`, `trackWorld`, `startGate`, `finishGate`, `distanceMark`, and `--camera-offset` in `src/components/page/games/SnailRace.jsx` / `SnailRace.module.css`. |
| C2 | PASS | Source check found `visualProgressRef` smoothing in the RAF loop, transform-based `trackWorld` camera movement, `snailRunner` movement, `slimeTrail`, `snailMoving`, `bodyCrawl`, `shellRoll`, and eye animation CSS. |
| C3 | PASS | Source check found race setup controls, `raceHud`, `liveStandings`, `rankSlots`, `liveCallout`, `resultPanel`, replay, and reset actions in `SnailRace.jsx`. |
| C4 | PASS | Source check found responsive rules for 860px and 560px plus `@media (prefers-reduced-motion: reduce)` preserving text status and disabling heavy motion. |
| C5 | PASS | `npm run build` exited 0 with `Compiled successfully`; `curl -I http://127.0.0.1:3000/snail-race` returned `HTTP/1.1 200 OK`; dev server hot reload ended with `Compiled successfully`. |

Verdict: PASS

## Post-Ralph Correction

The user clarified that the track UI itself must not move. The camera-follow interpretation from C1 was superseded by a fixed-track requirement that better matches the provided reference screenshot.

- Removed the `trackWorld`, `cameraShift`, and `--camera-offset` structure.
- Kept the racecourse visually long through fixed horizontal dirt lanes, distance ticks, start dust, and right-side finish flags.
- Preserved the natural snail motion through smoothed visual progress, snail body/shell/eye animation, dust, slime trail, speed lines, and finish pop.
- Restyled the scene toward the reference: fixed sky, mountains, forest rows, central hanging sign, and static field.
- Validation after the correction: `npm run build` passed, the dev server hot-reloaded successfully, and `curl -I http://127.0.0.1:3000/snail-race` returned `HTTP/1.1 200 OK`.

## Final

Ralph iteration 1 passed, then the fixed-track user feedback superseded the camera-follow portion of C1. Final verification used build output, local route response, dev-server logs, and source-level checks. In-app browser screenshots were not used because the browser webview had previously timed out attaching in this session.
