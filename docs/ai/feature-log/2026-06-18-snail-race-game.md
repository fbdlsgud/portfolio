# 2026-06-18 Snail Race Game

## Goal

Add a party betting race game where 1-7 friends can pick colored snails and decide whether the first or last finisher is caught.

## Touched Files

- `src/components/page/games/SnailRace.jsx`
- `src/components/page/games/SnailRace.module.css`
- `src/components/page/games/Games.jsx`
- `src/components/routes/routes.jsx`
- `src/components/header/Header.jsx`

## Implementation Shape

- Added `/snail-race` route and a Games page card.
- Added configurable player count, editable lane names, first/last penalty mode, random race loop, finish ordering, and result panel.
- Built the UI as a retro race track with a hanging sign, dirt lanes, finish flags, and CSS-drawn colored snails.
- Strengthened race UX with faster visible lane movement, START/GOAL gates, progress wake, moving track texture, dust trails, speed lines, leader lane highlight, and finish pop.
- Ralph redesign pass added smoothed visual progress, distance markers, slime trail, body crawl, shell roll, and reduced-motion handling.
- Post-feedback pass removed camera/track movement and changed the scene to match the reference: fixed forest/sky field, fixed dirt lanes, right-side finish flags, and snail-only forward motion.
- Progress-mapping pass changed the runner from layout `left` movement to transform-based movement driven by the same visual progress value used for the percent label, progress wake, and slime trail.
- The race loop now waits until all snails visually reach the finish before switching to the finished state, preventing the animation from stopping before the goal line.
- Updated Games nav active state to include `/dodge` and `/snail-race`.

## Validation

- `npm install` completed so local `react-scripts` is available.
- `npm run build` passed.
- `HOST=127.0.0.1 PORT=3000 BROWSER=none npm run start` compiled successfully.
- `curl -I http://127.0.0.1:3000/snail-race` returned `HTTP/1.1 200 OK`.
- After motion feedback, `npm run build` passed again and the dev server hot-reloaded successfully.
- Ralph iteration 1 passed all criteria in `docs/ai/ralph-runs/20260618T102153Z-snail-race-ralph.md`.
- After fixed-track feedback, `npm run build` passed again, the dev server hot-reloaded successfully, and `curl -I http://127.0.0.1:3000/snail-race` returned `HTTP/1.1 200 OK`.
- After progress-mapping feedback, `git diff --check` passed, `npm run build` passed, the dev server hot-reloaded successfully, and `curl -I http://127.0.0.1:3000/snail-race` returned `HTTP/1.1 200 OK`.

## Follow-Up Risks

- In-app browser attach timed out twice, so live visual inspection could not be completed in the browser tool.
- Existing `src/App.test.js` still appears to target Create React App starter text and was not updated in this feature.
