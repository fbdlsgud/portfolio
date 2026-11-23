# Retire Obstacle Race

## Goal

Remove Obstacle Race from the public portfolio and leave Duck Jump and Duck Dodge as the playable games.

## Files Changed

- `src/components/page/games/Games.jsx` and `Games.module.css`
- `src/components/page/games/ObstacleRace.jsx` and `ObstacleRace.module.css` (removed)
- `src/components/header/Header.jsx`, `src/components/header/Header.module.css`, and `src/components/routes/routes.jsx`
- `src/components/page/main/Main.jsx` and `src/App.test.js`
- `docs/ai/conventions.md` and `docs/ai/error-cases/2026-11-23-main-non-json-response.md`

## Implementation

The Games list shows the two playable titles. It uses the available grid space without the old placeholder or launch badges. The retired game URL redirects to `/games` so bookmarked links land on the current list. Both full-screen games show a dedicated link back to Games.

The main page checks the shape of project, comment, and visit count responses before rendering their data. When a response has an unexpected shape, the page keeps its initial empty lists and zero counts.

## Validation

- `git diff --check`
- `CI=true npm test -- --watchAll=false --runInBand` passed both tests.
- `CI=true npm run build` compiled successfully.
- Desktop and mobile Chromium verified navigation from Main to Games, the start and return links for both games, and the retired URL redirect. The Games page fit the mobile viewport.

## Follow-Up Risks

- The production host must serve the SPA for the retired URL so the client can redirect it to Games.
- Create React App still reports outdated Browserslist data during the build.
