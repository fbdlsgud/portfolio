# Debug Workflow

Use this for bugs, errors, failed builds, failed tests, crashes, and regressions.

## Steps

1. Capture the symptom and exact error.
2. Reproduce or inspect the failing path.
3. Trace root cause through real code.
4. Apply the smallest fix.
5. Add or update regression coverage when practical.
6. Run validation.
7. Search for similar patterns if the issue is systemic.
8. Record repeated or instructive failures in `docs/ai/error-cases/`.
9. Propose a future rule only if it prevents recurrence.

## Avoid

- broad refactors
- guessing from error messages without reading code
- hiding validation failures

