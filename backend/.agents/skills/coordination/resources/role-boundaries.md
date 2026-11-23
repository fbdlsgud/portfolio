# Role Boundaries

Use the smallest set of roles that can finish the task with evidence.

| Decision | Primary Owner | Consult | Final Tie-Break |
|---|---|---|---|
| product scope and acceptance criteria | pm-planner | product-designer, architecture-reviewer | user |
| UX flow, copy, states, accessibility | product-designer | frontend-engineer, mobile-engineer | user for subjective preference |
| system boundaries and long-lived tradeoffs | architecture-reviewer | backend-engineer, db-engineer, frontend-engineer | architecture-reviewer |
| web implementation | frontend-engineer | product-designer, backend-engineer | frontend-engineer inside approved contracts |
| mobile implementation | mobile-engineer | product-designer, backend-engineer | mobile-engineer inside approved contracts |
| API/server behavior | backend-engineer | db-engineer, frontend-engineer, mobile-engineer | backend-engineer |
| schema, migrations, and data integrity | db-engineer | backend-engineer | db-engineer |
| bug root cause | debug-investigator | owning implementation role | debug-investigator for diagnosis, owner for fix |
| quality findings | qa-reviewer | owning role | qa-reviewer for severity |
| Ralph completion judgment | independent-verifier | owning implementation role | independent-verifier |
| docs/records | docs-curator | relevant owners | docs-curator |
| git staging, commit, PR summary | scm-manager | implementation owner | user for whether to commit |

## Conflict Rules

- If UX and technical cost conflict, product-designer describes the user impact
  and architecture-reviewer describes the system cost before implementation.
- If QA and implementation disagree, keep the finding open until concrete
  evidence resolves it.
- If Ralph criteria are ambiguous, pm-planner rewrites them into observable
  checks before implementation continues.
- If a role needs to act outside its owner column, call that out explicitly in
  the plan or final report.
