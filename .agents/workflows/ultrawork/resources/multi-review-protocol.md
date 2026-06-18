# Multi-Review Protocol

Use these checks during Ultrawork VERIFY.

## 1. Requirement Review

Does the implementation match the requested behavior?

## 2. Scope Review

Were unrelated files or behaviors changed?

## 3. Security Review

Check auth, access control, secrets, injection, unsafe external calls, and
sensitive logging.

## 4. Correctness Review

Check edge cases, state transitions, error paths, and data consistency.

## 5. Performance Review

Check unnecessary re-renders, N+1 queries, expensive loops, large payloads, and
blocking operations.

## 6. Accessibility Review

For UI work, check semantic HTML, labels, keyboard navigation, focus, contrast,
and responsive text.

## 7. Test Review

Check whether new behavior has appropriate regression coverage.

## 8. Integration Review

Check whether frontend/backend/API/data contracts still align.

## 9. Maintainability Review

Check naming, boundaries, duplication, and complexity.

## 10. Documentation Review

Check whether `docs/ai` records are updated when useful.

## 11. Meta Review

Check whether the review itself was evidence-based and not speculative.

