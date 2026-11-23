---
name: workflow-routing
description: "Select, activate, and inspect Agentic Dev Kit workflows through explicit workflow manifest keywords and workflow-declared skill lists. Use when requests mention workflows, Ralph, Ultrawork, orchestration, planning mode, workflow activation, skill declaration, or Korean equivalents such as 워크플로우, 랄프, 스킬 선언, 스킬선언, 작동, 활성화."
---

# Workflow Routing Skill

Use when a request should select, activate, or inspect a workflow.

Workflow routing has two explicit paths:

1. Keyword routing: workflow keywords in `.agents/workflows/manifest.yaml`
   select a workflow.
2. Declared-skill routing: a selected workflow's `skills` list in
   `.agents/workflows/manifest.yaml` adds the SKILL.md files that must be read
   before work.

## Process

1. Read `.agents/workflows/manifest.yaml`.
2. Match the user request against workflow `keywords`.
3. Read the selected workflow file from `path`.
4. Read only the SKILL.md files listed in the selected workflow's `skills`.
5. If multiple workflows match, prefer the most specific workflow:
   `ralph` > `ultrawork` > `orchestrate` > domain workflow > `implement`.
6. For persistent workflows, let `.codex/hooks/workflow-state.sh` activate or
   clear runtime state.

## Rules

- Do not rely on hidden assumptions about which skills a workflow needs.
- Keep workflow `skills` explicit and validated by `scripts/check.sh`.
- Keep workflow keyword routing and skill keyword routing both available.
- If a workflow needs a new skill, add it to both the skills manifest and the
  workflow's `skills` list.
