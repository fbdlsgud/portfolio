# Project Conventions

## Project Summary

- Name:
- Purpose:
- Main users:
- Current phase:

## Product Plan

### Confirmed Features

- 

### Suggested MVP Additions

- 

### Later Ideas

- 

### Open Questions

- 

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

- 

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
