# Spring Kotlin Profile

## Assumptions

- Backend source lives under `src/main/kotlin` unless the project says otherwise.
- Keep controller, service/use-case, repository, and domain boundaries clear.
- Keep transactions at the service/use-case layer when the project follows that pattern.
- Validate request input.
- Add or update tests for non-trivial behavior.

## Agent Notes

- Inspect existing module structure before adding new classes.
- Do not invent API response shapes without checking nearby controllers.
- Record meaningful backend work in `docs/ai/feature-log/`.

