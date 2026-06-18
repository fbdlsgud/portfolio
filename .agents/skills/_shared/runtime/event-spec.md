# Event Spec

Use lightweight event notes in final summaries or docs/ai records.

## Event Types

- `plan.created`
- `implementation.completed`
- `validation.failed`
- `validation.passed`
- `review.completed`
- `decision.made`
- `rule.proposed`
- `workflow.safeguard`

## Format

```text
event: <type>
subject: <short subject>
evidence: <file, command, or record>
```

