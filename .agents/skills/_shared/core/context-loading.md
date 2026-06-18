# Context Loading

Load the smallest useful context.

## Baseline For Non-Trivial Work

- Read `AGENTS.md` first.
- Read `.ai-local/project-profile.yaml` only when commands, paths, stack, or
  quality gates matter.
- Read `.ai-local/agent-mode.yaml` only when workflow intensity matters.
- Read `docs/ai/conventions.md` only when editing, reviewing, or planning
  project behavior.

## Skill Loading

- Start with the skill entrypoints named by the prompt or `skill-injector`.
- Do not load every skill in the repo.
- Follow a skill's resource links only when they are relevant to the current
  task.
- For broad Ralph or orchestration work, load coordination and Ralph workflow
  files first, then load role-specific skills only for active criteria.

## Search When Relevant

- `docs/ai/feature-log/`
- `docs/ai/error-cases/`
- `docs/ai/review-cases/`
- `docs/ai/decisions/`
- `docs/ai/proposed-rules/`

## Avoid

- reading entire large files when a focused excerpt is enough
- loading all records when a search by feature/error keyword is enough
- trusting stale records over current code
- carrying passed Ralph criteria back into implementation context unless a
  regression check needs them
