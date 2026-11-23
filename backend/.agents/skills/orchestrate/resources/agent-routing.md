# Agent Routing

| Need | Agent |
|---|---|
| scope and acceptance criteria | pm-planner |
| architecture tradeoff | architecture-reviewer |
| UX flow, interaction states, visual hierarchy | product-designer |
| web UI | frontend-engineer |
| mobile UI/device flow | mobile-engineer |
| API/server | backend-engineer |
| schema/data | db-engineer |
| root-cause bugfix | debug-investigator |
| final QA | qa-reviewer |
| Ralph judge | independent-verifier |
| records/docs | docs-curator |
| commit/PR | scm-manager |

## Ownership Rules

- Scope and acceptance criteria come from `pm-planner`.
- UX, UI copy, interaction states, and accessibility come from `product-designer`.
- Durable structure and boundary tradeoffs come from `architecture-reviewer`.
- Code changes stay with the owning implementation agent.
- Final Ralph criteria judgment stays with `independent-verifier`.
- Commit and PR actions stay with `scm-manager` and require user intent.
