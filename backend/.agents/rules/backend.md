# Backend Rules

- Inspect existing API, service, and repository patterns before editing.
- Keep validation close to request boundaries.
- Keep business logic in the established service/use-case layer.
- Do not hardcode secrets.
- Use parameterized queries or ORM-safe APIs.
- Preserve tenant/user/project isolation where the app has multi-tenant data.
- Add tests for new behavior when risk is non-trivial.
- Record meaningful API/server work in `docs/ai/feature-log/`.

