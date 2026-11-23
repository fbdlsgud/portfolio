# Agent Instructions

## 1. Operating Principles

- Read the smallest relevant context before editing.
- Prefer existing project conventions over new abstractions.
- Preserve user changes unless explicitly asked to revert them.
- Keep edits scoped to the requested behavior.
- Run relevant validation before reporting completion.
- Record meaningful work in `docs/ai/feature-log/`.
- Record repeated failures in `docs/ai/error-cases/`.
- Propose reusable AI setup improvements in `docs/ai/proposed-rules/`.
- Do not silently promote proposed rules into permanent configuration.

## 2. Project Context Sources

Use these files as the project memory surface:

- `.ai-local/project-profile.yaml`: stack, commands, project type, active profile
- `.ai-local/agent-mode.yaml`: active mode (`light`, `standard`, or `full`)
- `.ai-local/kit.yaml`: installed kit version, selected profile, selected mode
- `.codex/agents/manifest.yaml`: available subagents, ownership, access, and skills
- `.agents/skills/manifest.yaml`: available skills, paths, descriptions, and trigger keywords
- `.agents/workflows/manifest.yaml`: available workflows, purpose, keywords,
  persistence, and workflow-declared skills
- `docs/ai/conventions.md`: project conventions and architecture notes
- `docs/ai/ralph-runs/`: Ralph criteria, iteration evidence, and final verdict reports
- `docs/ai/feature-log/`: completed feature implementation records
- `docs/ai/error-cases/`: failures and lessons
- `docs/ai/review-cases/`: QA and review findings
- `docs/ai/decisions/`: architecture and process decisions
- `docs/ai/proposed-rules/`: candidate improvements to AI instructions

When the user describes project conventions, planned features, folder structure,
commands, or quality rules, update the project context files before relying on
memory.

Commands in `.ai-local/project-profile.yaml` start as profile defaults. During
project onboarding or before the first meaningful validation run, inspect the
real package/build files and update commands plus `command_policy` if they
differ.

Before every non-trivial task, read `docs/ai/conventions.md` and
`.ai-local/agent-mode.yaml`. Search `docs/ai/feature-log`,
`docs/ai/error-cases`, `docs/ai/review-cases`, and `docs/ai/decisions` for
task-relevant prior context.

## 2.1 Agent Mode

Use the active mode to decide how much process to apply:

- `light`: prefer direct implement/debug/review. Avoid heavy loops unless asked.
- `standard`: use subagents and records for meaningful work. Use heavy loops only
  when risk justifies them or the user asks.
- `full`: use mature workflows. Prefer orchestrate for broad work, ultrawork for
  risky implementation, and ralph for repeat-until-done criteria.

## 3. Default Project Conventions

Use these defaults unless the user or existing project clearly says otherwise:

- Organize app code by feature under `src/features`.
- Keep shared UI, utilities, constants, and cross-feature helpers under
  `src/shared`.
- Keep API clients, Firebase clients, or external service wrappers under
  `src/shared/api` or `src/shared/services`.
- Keep feature-specific components, hooks, screens, models, and services inside
  that feature's folder.
- Record meaningful feature work in `docs/ai/feature-log/`.
- Record repeated errors or instructive failures in `docs/ai/error-cases/`.
- Record review findings in `docs/ai/review-cases/`.
- Record architecture/product decisions in `docs/ai/decisions/`.

These defaults are starting points, not hard rules. If a project already has a
different convention, follow the project.

## 4. Project Discovery And Onboarding Rule

If the user says anything like:

- "이 프로젝트 컨벤션은 ..."
- "앞으로 이 프로젝트는 ..."
- "이 기능들을 만들 거야 ..."
- "이 규칙으로 작업해 ..."
- "프로젝트 세팅 반영해 ..."
- "이런 앱 만들 거야 ..."
- "React Native랑 Firebase로 할 거야 ..."

Then:

1. Summarize the new project context.
2. Identify the likely product type and target users.
3. Suggest missing MVP features, edge cases, and admin/ops needs that naturally
   follow from the app idea.
4. Separate confirmed user requirements from suggested optional features.
5. Update `docs/ai/conventions.md`.
6. Update `.ai-local/project-profile.yaml` when stack, commands, paths, or
   validation rules change.
7. Keep project-specific rules in `.ai-local/project-profile.yaml` or
   `docs/ai/*`, because `AGENTS.md` is managed by the shared kit update flow.
8. Propose reusable kit-level rules in `docs/ai/proposed-rules/` instead of
   editing `.agents` or `.codex` directly.
9. Avoid putting temporary preferences into permanent files.

## 5. Workflow Selection

Use the lightest workflow that fits:

- `ralph`: keep looping through ultrawork + independent verification until
  verifiable criteria pass or safeguards stop the loop
- `ultrawork`: high-quality plan -> implementation -> QA -> refine -> ship loop
- `orchestrate`: broad multi-role work
- `project-onboarding`: project rules, conventions, commands, planned features
- `product-discovery`: rough app idea -> MVP suggestions and feature plan
- `architecture`: structural decisions, boundaries, and ADRs
- `work`: step-by-step implementation with validation and one remediation pass
- `implement`: normal feature work
- `debug`: bug reproduction and root cause fix
- `review`: QA/code review
- `eval`: check whether AI setup changes improved or regressed quality
- `docs`: feature log or documentation sync

Workflow routing is explicit:

1. Match the user request against `.agents/workflows/manifest.yaml` `keywords`.
2. Load the selected workflow `path`.
3. Load the SKILL.md files listed in that workflow's `skills`.
4. Also allow direct skill keyword routing through `.agents/skills/manifest.yaml`.

Do not rely on unstated workflow-to-skill assumptions. If a workflow needs a
skill, declare that skill in the workflow manifest and in the central skills
manifest.
- `scm`: branch, commit, PR, changelog work

## 6. Subagent Use

Split work by role when the task is broad:

- `orchestrator`: route and coordinate multi-agent work
- `pm-planner`: scope and acceptance criteria
- `architecture-reviewer`: structure and tradeoffs
- `product-designer`: UX flows, interaction states, visual hierarchy, accessibility
- `frontend-engineer`: UI/client work
- `mobile-engineer`: mobile UI, device, and app flow work
- `backend-engineer`: API/server work
- `db-engineer`: data modeling and query work
- `debug-investigator`: reproduction and root cause fixes
- `qa-reviewer`: review only
- `independent-verifier`: Ralph judge, verification only
- `docs-curator`: docs and records
- `scm-manager`: git operations

Do not use many subagents for tiny tasks.

## 7. Implementation Rules

- Inspect the real files before changing code.
- Prefer small, focused changes.
- Add tests when behavior risk justifies it.
- Run project validation commands listed in `.ai-local/project-profile.yaml`.
- If `command_policy.confirm_before_first_use` is true, inspect the project's
  package/build files before treating profile-default commands as authoritative.
- If validation cannot run, state why.
- Do not invent APIs, routes, folders, or conventions without checking.

## 8. Feature Log Rule

After meaningful implementation, create or update:

```text
docs/ai/feature-log/YYYY-MM-DD-short-title.md
```

Include:

- goal
- touched files
- implementation shape
- validation
- follow-up risks

## 9. Error Case Rule

When a failure happens or a repeated mistake is discovered, create:

```text
docs/ai/error-cases/YYYY-MM-DD-short-title.md
```

Include:

- symptom
- root cause
- fix
- validation
- possible future rule

## 10. Proposed Rule Rule

If a case should improve future AI behavior, create:

```text
docs/ai/proposed-rules/YYYY-MM-DD-short-title.md
```

Proposals must include:

- source case
- proposed rule
- target file
- reason
- risk of adding the rule
- eval that should catch regression

Permanent configuration changes require review.

## 11. Safety

- Do not store secrets in agent files or docs.
- Do not run destructive commands without explicit permission.
- The PreToolUse danger guard blocks high-risk Bash patterns unless the exact
  action was explicitly approved.
- Before destructive filesystem, git, database, cloud, or production commands,
  explain target, expected effect, backup/rollback plan, and validation.
- Do not print secret values from `.env`, credentials, tokens, or private keys.
- Do not modify generated files unless the task requires it.
- Do not change `.agents` or `.codex` files unless the user is working on the
  AI setup itself.
