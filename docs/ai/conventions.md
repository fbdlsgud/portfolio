# Project Conventions

## Project Summary

- Name:
- Purpose:
- Main users:
- Current phase:

## Product Plan

### Confirmed Features

- Party betting mini-game direction: 1-7 players race on one horizontal runner map, Super Mario-style, where each character automatically runs and probabilistically jumps over obstacles or fails, causing a short stun.

### Suggested MVP Additions

- Player setup: choose 1-7 participants, edit names, and assign visible colors/characters.
- Betting mode: decide whether the first finisher, last finisher, or obstacle-hit/stun loser is caught.
- Race feedback: fixed course, moving runners, obstacle jump/fail animations, stun state, finish ranking, and clear result panel.

### Later Ideas

- Round history and local party scoreboard.
- Character skins, obstacle themes, and item events.
- Shareable result image for friends.

### Open Questions

- Whether the default penalty target should be first finisher, last finisher, most stuns, or selectable before every race.

## Stack

- Frontend:
- Backend:
- Database:
- Mobile:
- Package manager:

## Directory Structure

```text
src/
├── features/
│   └── <feature>/
├── shared/
│   ├── api/
│   ├── services/
│   ├── ui/
│   └── utils/
└── app/
```

## Commands

Source: profile defaults until confirmed from real package/build files.

| Purpose | Command |
|---|---|
| install | |
| dev | |
| lint | |
| typecheck | |
| test | |
| build | |

## Feature Areas

- Games: existing `/games`, `/jump`, and `/dodge` routes, with planned party runner betting game under `src/components/page/games/`.

## Coding Conventions

- Organize app code by feature under `src/features`.
- Keep shared UI, utilities, constants, and cross-feature helpers under `src/shared`.
- Keep API clients, Firebase clients, or external service wrappers under `src/shared/api` or `src/shared/services`.
- Keep feature-specific components, hooks, screens, models, and services inside that feature's folder.

## UI Conventions

- 

## API Conventions

- 

## Data Conventions

- 

## Quality Rules

- Record meaningful feature work in `docs/ai/feature-log/`.
- Record repeated errors or instructive failures in `docs/ai/error-cases/`.
- Record review findings in `docs/ai/review-cases/`.
- Record architecture/product decisions in `docs/ai/decisions/`.

## Things The Agent Must Not Do

- 

## Notes For Future Work

- 
