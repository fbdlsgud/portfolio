# SCM Workflow

Use this for git status, staging, commits, branches, PR summaries, and changelog
work.

## Steps

1. Run `git status --short`.
2. Identify files changed by the current task.
3. Do not stage unrelated user changes.
4. Run relevant validation before commit when requested.
5. Write concise commit messages.
6. Include feature logs or docs when they are part of the change.

## Safety

- Do not run `git reset --hard`.
- Do not run destructive cleanup without explicit approval.
- Do not force push without explicit approval.

