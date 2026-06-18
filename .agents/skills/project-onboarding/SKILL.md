# Project Onboarding Skill

Use when the user describes a new project's stack, conventions, features,
commands, folder structure, or quality expectations.

## Goal

Convert user-provided project context into files the agent will read every time.

## Process

1. Read current context:
   - `AGENTS.md`
   - `.ai-local/project-profile.yaml`
   - `docs/ai/conventions.md`
   - output from `<kit-path>/scripts/detect-commands.sh` when available,
     especially the `profile_patch` block
2. Extract durable information:
   - stack
   - package manager
   - source directories
   - test/build/lint commands
   - whether commands came from profile defaults or real project files
   - planned features
   - architecture preferences
   - forbidden changes
   - review expectations
3. Update:
   - `docs/ai/conventions.md`
   - `.ai-local/project-profile.yaml`
   - `commands`, `stack.package_manager`, and `command_policy` from the
     detector's reviewed `profile_patch` block
   - use `command_policy.source: "detected-project-files"` only after commands
     are checked against package/build files
4. Keep project-specific rules out of `AGENTS.md`; it is refreshed by
   `update.sh` as a managed kit file.
5. If a reusable kit-level lesson appears, write a proposed rule instead of
   directly editing the kit.

## Output

Summarize:

- what context was added
- which files changed
- what the agent will do differently next time
