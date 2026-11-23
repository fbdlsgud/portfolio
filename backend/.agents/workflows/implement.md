# Implementation Workflow

Use this for normal feature work.

## Steps

1. Read project context:
   - `AGENTS.md`
   - `.ai-local/project-profile.yaml`
   - `docs/ai/conventions.md`
2. Identify the smallest relevant files.
3. Inspect existing patterns before editing.
4. Choose subagents only if the task crosses boundaries.
5. Implement scoped changes.
6. Run validation commands from `.ai-local/project-profile.yaml`.
7. Update `docs/ai/feature-log/` for meaningful work.
8. If failures revealed a reusable lesson, write an error case or proposed rule.

## Completion Report

Include:

- changed files
- behavior implemented
- validation run
- feature log path, if created
- remaining risks

