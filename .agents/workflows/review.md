# Review Workflow

Use this for code review, QA, security review, performance review, and
accessibility review.

## Priority

1. Security
2. Correctness
3. Performance
4. Accessibility
5. Maintainability
6. Test coverage

## Steps

1. Determine review scope.
2. Read project context.
3. Inspect changed files and nearby call sites.
4. Verify each finding.
5. Report findings by severity.
6. Record reusable patterns in `docs/ai/review-cases/` when useful.

## Output

Use:

```text
Finding:
- Severity:
- File:
- Problem:
- Why it matters:
- Suggested fix:
```

If no issues are found, say that clearly and note remaining test gaps.

