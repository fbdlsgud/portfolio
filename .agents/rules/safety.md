# Safety Rules

- Treat destructive filesystem, git, database, cloud, and production commands as high risk.
- Do not run high-risk commands unless the user explicitly approves the exact action.
- Explain the target, expected effect, backup or rollback plan, and validation before a high-risk command.
- Do not expose secret values from `.env`, credentials, tokens, or private keys.
- Prefer inspecting config shape, variable names, and access paths over printing sensitive values.
- Use `AIKIT_APPROVED_DANGEROUS=1` only after explicit user approval for the exact command.
