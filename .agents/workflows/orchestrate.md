# Orchestrate Workflow

Use this for broad work that crosses multiple domains or benefits from role
separation.

## Goal

Coordinate focused agents so planning, implementation, QA, and documentation do
not blur together.

## Steps

1. Read:
   - `AGENTS.md`
   - `.ai-local/project-profile.yaml`
   - `docs/ai/conventions.md`
2. Define the work boundary.
3. Decide whether orchestration is justified.
   - If the user says to keep going until completion criteria pass, use
     `ralph` instead.
   - If the task needs a strict quality loop but not repeated judging, use
     `ultrawork`.
4. If yes, split work by role:
   - `pm-planner` for requirements and acceptance criteria
   - `architecture-reviewer` for structural tradeoffs
   - `product-designer` for UX flows, interaction states, and design QA
   - `frontend-engineer` for UI/client work
   - `mobile-engineer` for mobile UI/device work
   - `backend-engineer` for API/server work
   - `db-engineer` for schema/data work
   - `debug-investigator` for bug/root cause work
   - `qa-reviewer` for final review
   - `independent-verifier` for Ralph judge loops
   - `docs-curator` for logs and docs
   - `scm-manager` for git work when requested
5. Run implementation agents only after scope is clear.
6. Run QA/review after implementation.
7. Ensure feature logs, error cases, review cases, or decisions are recorded.
8. Summarize outcome and validation.

## When Not To Use

- one-file edits
- simple explanations
- tiny formatting changes
- tasks where the user asked for direct implementation only

## Output

Include:

- roles used
- files changed
- validation run
- records written under `docs/ai`
- follow-up risks
