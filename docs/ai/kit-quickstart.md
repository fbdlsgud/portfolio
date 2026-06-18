# Agentic Kit Quickstart

Managed by Agentic Dev Kit. Put project-specific conventions in `docs/ai/conventions.md`.

## Installed Setup

- Kit path: `/Users/ryu/Desktop/codex-agentic-dev-kit`
- Kit version: `0.2.0`
- Profile: `react-vite`
- Mode: `full`

## First Run Checklist

1. Run the setup check: `bash "/Users/ryu/Desktop/codex-agentic-dev-kit/scripts/check.sh"`
2. Run command detection from this project root: `bash "/Users/ryu/Desktop/codex-agentic-dev-kit/scripts/detect-commands.sh"`
3. Review the detector `recommendation` and `profile_patch` blocks, then copy confirmed values into `.ai-local/project-profile.yaml`.
4. Give Codex the First Prompt below and ask it to run `project-onboarding`.
5. Rerun the setup check after onboarding changes.

## Available Roles

- `orchestrator` (workspace-write): Routing and coordination for broad work.
- `pm-planner` (read-only): Requirements, scope, acceptance criteria, and task breakdown.
- `architecture-reviewer` (read-only): Architecture, boundaries, tradeoffs, and durable decisions.
- `product-designer` (read-only): UX flows, interaction states, visual hierarchy, accessibility, and design QA.
- `frontend-engineer` (workspace-write): Web UI, client state, styling, accessibility, and browser-visible behavior.
- `mobile-engineer` (workspace-write): Mobile UI, device flows, React Native, Flutter, and native app work.
- `backend-engineer` (workspace-write): Backend APIs, services, auth, integrations, and server-side behavior.
- `db-engineer` (workspace-write): Schema design, migrations, queries, and data integrity.
- `debug-investigator` (workspace-write): Bug reproduction, root-cause diagnosis, minimal fixes, and regression checks.
- `qa-reviewer` (read-only): Security, correctness, performance, accessibility, quality, and test gap review.
- `independent-verifier` (read-only): Ralph criteria judging, evidence collection, and regression detection.
- `docs-curator` (workspace-write): Feature logs, error cases, review cases, decisions, and docs sync.
- `scm-manager` (workspace-write): Git status, staging, commits, branches, PR summaries, and changelog hygiene.

## Available Skills

These are Agentic Dev Kit repo-local skills from `.agents/skills/manifest.yaml`.
They are routed by hooks and workflow manifests; they are not Codex `/` palette entries unless separately installed as global Codex skills.

- `architecture`: Structural decisions, module boundaries, data ownership, tradeoffs, and ADRs.
- `backend`: Backend APIs, services, authentication, integrations, and server-side behavior.
- `coordination`: Multi-agent routing, workflow selection, and coordination.
- `db`: Database design, migrations, queries, and data integrity.
- `debug`: Bug reproduction, root-cause diagnosis, minimal fixes, and regression checks.
- `design`: Product UX, interaction design, visual hierarchy, accessibility, and design QA.
- `dev-workflow`: Setup commands, validation pipelines, scripts, CI, and local developer workflow.
- `docs`: Feature logs, error cases, review cases, decisions, and documentation sync.
- `frontend`: Web UI, client-side behavior, styling, accessibility, and browser-visible changes.
- `mobile`: React Native, Flutter, native mobile UI, device flows, and emulator checks.
- `orchestrate`: Broad work split across focused subagents and workflow gates.
- `product-discovery`: App idea shaping, MVP suggestions, feature boundaries, and open questions.
- `project-onboarding`: Project stack, conventions, commands, planned features, and local context setup.
- `qa`: Security, correctness, performance, accessibility, maintainability, and test coverage review.
- `ralph`: Repeat-until-done loop with mechanical criteria, safeguards, and independent verification.
- `review`: Code review and QA findings with severity, evidence, and remediation.
- `scm`: Git status, staging, commits, branches, PR summaries, and changelog hygiene.
- `ultrawork`: Plan, implement, verify, refine, and ship loop for high-risk implementation.
- `workflow-routing`: Workflow selection, activation, and manifest-declared workflow skill routing.

## Available Workflows

- `plan`: Plan broad, unclear, or multi-area work before implementation.
- `project-onboarding`: Turn project stack, conventions, commands, and planned features into local AI context.
- `product-discovery`: Shape rough app ideas into MVP suggestions, feature boundaries, and open questions.
- `architecture`: Frame structural decisions, boundaries, tradeoffs, and ADR-style records.
- `implement`: Normal feature implementation with scoped validation and feature logs.
- `work`: Step-by-step implementation with validation and one remediation pass.
- `debug`: Reproduce bugs, diagnose root cause, fix minimally, and record reusable failures.
- `review`: Code review and QA findings by severity with evidence and remediation.
- `docs`: Feature logs, error cases, decisions, proposed rules, and documentation sync.
- `scm`: Git status, staging, commits, branches, PR summaries, and changelog work.
- `orchestrate`: Split broad work across focused subagents and verify coordination.
- `ultrawork`: Plan, implement, verify, refine, and ship quality-sensitive work.
- `ralph`: Repeat ultrawork and independent verification until criteria pass or safeguards stop.
- `eval`: Evaluate whether AI setup changes improved or regressed behavior.

## Commands

```bash
# Show available profiles and modes for future projects
bash "/Users/ryu/Desktop/codex-agentic-dev-kit/scripts/install.sh" --list

# Validate this installed project setup
bash "/Users/ryu/Desktop/codex-agentic-dev-kit/scripts/check.sh"

# Detect likely profile/mode and commands during onboarding, then copy profile_patch into .ai-local/project-profile.yaml
bash "/Users/ryu/Desktop/codex-agentic-dev-kit/scripts/detect-commands.sh"

# Refresh this project from the kit
bash "/Users/ryu/Desktop/codex-agentic-dev-kit/scripts/update.sh"

# Validate the kit source before updating other projects
bash "/Users/ryu/Desktop/codex-agentic-dev-kit/scripts/check-kit.sh"
```

## First Prompt

```text
이 프로젝트의 스택, 컨벤션, 기능 계획을 설명할테니
실제 package/build 파일을 보고 검증 명령도 확인해서
docs/ai/conventions.md와 .ai-local/project-profile.yaml에 반영하고
앞으로 작업할 때 이 내용을 항상 참고해줘.
```

## Useful Prompts

```text
새 프로젝트 세팅하고 컨벤션이랑 명령어를 실제 파일 기준으로 잡아줘.
docs/ai/conventions.md와 .ai-local/project-profile.yaml까지 업데이트해줘.
```

```text
아키텍트, 기획, 디자인, 개발, QA 역할을 나눠서 계획 세우고 진행해줘.
큰 작업이면 orchestrate로 분담하고, 필요한 스킬을 먼저 읽어줘.
```

```text
이 기능을 구현하고 검증까지 돌려줘. 의미 있는 변경이면 docs/ai/feature-log에 기록해줘.
```

```text
코드리뷰하고 버그 재현해서 수정하고 테스트까지 확인해줘.
보안, 정확성, 성능, 접근성, 회귀 위험 순서로 봐줘.
```

```text
이 변경을 QA/code review 관점으로 봐줘. 보안, 정확성, 성능, 접근성 순서로 findings를 줘.
```

```text
랄프 방식으로 돌려줘. 완료 기준을 먼저 기계적으로 정의하고, 실패한 기준만 반복해서 보강해줘.
반복별 근거와 최종 판정은 docs/ai/ralph-runs에 남겨줘.
```
