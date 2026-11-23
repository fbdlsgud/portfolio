# Project Conventions

## Project Summary

- Name: Portfolio
- Purpose: Personal portfolio and browser games
- Main users:
- Current phase:

## Product Plan

### Confirmed Features

- Duck Jump and Duck Dodge are available from the Games page.

### Suggested MVP Additions

-

### Later Ideas

-

### Open Questions

-

## Stack

- Frontend: React with Create React App
- Backend: Spring Boot on Java 17
- Database: MySQL
- Package managers: npm and Gradle Wrapper

## Directory Structure

```text
frontend/  React app
backend/   Spring Boot API
deploy/    Docker Compose and Caddy
docs/ai/   Shared project conventions and work records
```

## Commands

Run commands from the repository root.

| Purpose | Command |
|---|---|
| Frontend install | `npm --prefix frontend ci` |
| Frontend development | `npm --prefix frontend start` |
| Frontend test | `npm --prefix frontend test -- --watchAll=false` |
| Frontend build | `npm --prefix frontend run build` |
| Backend build | `cd backend && ./gradlew bootJar` |

## Feature Areas

- Games: `/games` lists Duck Jump (`/jump`) and Duck Dodge (`/dodge`). The retired `/obstacle-race` URL redirects to `/games`.

## Coding Conventions

- Organize app code by feature under `frontend/src/features`.
- Keep shared UI, utilities, constants, and cross-feature helpers under `frontend/src/shared`.
- Keep API clients, Firebase clients, or external service wrappers under `frontend/src/shared/api` or `src/shared/services`.
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
