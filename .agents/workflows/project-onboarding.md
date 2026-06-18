# Project Onboarding Workflow

Use this when the user describes project conventions, stack, commands, planned
features, architecture, or preferences.

## Goal

Convert user-provided project knowledge into durable project-local context.
When the user only gives an app idea and stack, infer likely MVP needs and
present suggestions instead of waiting passively for a perfect spec.

## Steps

1. Read:
   - `AGENTS.md`
   - `.ai-local/project-profile.yaml`
   - `docs/ai/conventions.md`
   - `<kit-path>/scripts/detect-commands.sh` output when the kit path is known,
     especially the `profile_patch` block
2. Extract:
   - app type
   - target users
   - confirmed features
   - likely missing MVP features
   - optional later features
   - stack
   - package manager
   - folder conventions
   - feature areas
   - validation commands
   - whether validation commands were confirmed from real package/build files
   - forbidden changes
   - quality expectations
3. Update:
   - `docs/ai/conventions.md`
   - `.ai-local/project-profile.yaml`
   - `commands`, `stack.package_manager`, and `command_policy` from the
     detector's reviewed `profile_patch` block
   - set `command_policy.source` to `detected-project-files` after package or
     build files have been inspected
4. Create or update a product section in `docs/ai/conventions.md`:
   - confirmed requirements
   - suggested MVP additions
   - deferred ideas
   - open questions
5. Keep project-specific rules in `.ai-local/project-profile.yaml` or
   `docs/ai/*`; `AGENTS.md` is managed by the shared kit update flow.
6. If a reusable kit improvement is implied, write a proposal to:
   - `docs/ai/proposed-rules/YYYY-MM-DD-short-title.md`
7. Summarize what changed.

## Product Discovery Defaults

When the user says "I want to build an app like X with stack Y", suggest:

- authentication and account lifecycle
- onboarding
- core CRUD flows
- profile/settings
- notifications
- empty/loading/error states
- permissions and privacy
- analytics or event tracking if useful
- admin/moderation tools when relevant
- backup/export/delete-account needs when relevant
- MVP vs later-phase split

## Do Not

- Do not overwrite existing project context without preserving useful details.
- Do not promote temporary preferences into permanent rules.
- Do not add secrets or credentials.
- Do not treat suggested features as confirmed requirements until the user
  approves them.
