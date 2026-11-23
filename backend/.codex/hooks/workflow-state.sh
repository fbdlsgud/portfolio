#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat || true)"
LOWER="$(printf '%s' "$INPUT" | tr '[:upper:]' '[:lower:]')"

RUNTIME_DIR=".agents/runtime"
ACTIVE_FILE="$RUNTIME_DIR/active-workflow"
RALPH_STATE_FILE="$RUNTIME_DIR/ralph-state.yaml"
DEFAULTS_FILE=".agents/config/defaults.yaml"
RALPH_TEMPLATE_FILE=".agents/workflows/ralph/resources/state-template.yaml"
RALPH_RUNS_DIR="docs/ai/ralph-runs"
WORKFLOWS_MANIFEST=".agents/workflows/manifest.yaml"

keyword_matches() {
  local input="$1"
  local keyword="$2"

  case "$keyword" in
    *[!a-z0-9_-]*)
      case "$input" in
        *"$keyword"*) return 0 ;;
      esac
      return 1
      ;;
  esac

  printf '%s\n' "$input" | awk -v keyword="$keyword" '
    BEGIN { found = 0 }
    {
      gsub(/[^[:alnum:]_-]+/, " ")
      for (i = 1; i <= NF; i++) {
        if ($i == keyword) {
          found = 1
        }
      }
    }
    END { exit found ? 0 : 1 }
  '
}

workflow_priority() {
  case "$1" in
    ralph) echo 100 ;;
    ultrawork) echo 90 ;;
    orchestrate) echo 80 ;;
    project-onboarding) echo 70 ;;
    product-discovery) echo 60 ;;
    architecture) echo 60 ;;
    debug) echo 60 ;;
    review) echo 55 ;;
    eval) echo 50 ;;
    implement) echo 40 ;;
    work) echo 30 ;;
    docs) echo 25 ;;
    scm) echo 20 ;;
    *) echo 10 ;;
  esac
}

read_default() {
  local key="$1"
  local fallback="$2"
  local value=""

  if [[ -f "$DEFAULTS_FILE" ]]; then
    value="$(awk -F': *' -v key="$key" '$1 == "  " key { gsub(/"/, "", $2); print $2; exit }' "$DEFAULTS_FILE")"
  fi

  if [[ -n "$value" ]]; then
    printf '%s\n' "$value"
  else
    printf '%s\n' "$fallback"
  fi
}

clear_workflow() {
  local previous="none"
  local ended_at report_path

  if [[ -f "$ACTIVE_FILE" ]]; then
    previous="$(tr -d '\n' < "$ACTIVE_FILE")"
  fi

  if [[ -f "$RALPH_STATE_FILE" ]]; then
    report_path="$(awk -F': *' '$1 == "report_path" { gsub(/"/, "", $2); print $2; exit }' "$RALPH_STATE_FILE")"
    if [[ -n "$report_path" && -f "$report_path" ]]; then
      ended_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
      {
        printf '\n## Workflow Closed\n\n'
        printf -- '- ended_at: `%s`\n' "$ended_at"
        printf -- '- closed_by: `%s`\n' "workflow-state"
        printf -- '- previous_workflow: `%s`\n' "$previous"
      } >> "$report_path"
    fi
  fi

  rm -f "$ACTIVE_FILE" "$RALPH_STATE_FILE"
  printf 'Persistent workflow cleared: %s.\n' "$previous"
}

init_ralph_state() {
  local now run_id max_iterations failure_threshold report_path request_snapshot

  now="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  run_id="$(date -u '+%Y%m%dT%H%M%SZ')"
  max_iterations="$(read_default "max_ralph_iterations" "5")"
  failure_threshold="$(read_default "repeated_failure_block_threshold" "3")"
  report_path="$RALPH_RUNS_DIR/$run_id-ralph.md"
  request_snapshot="$(printf '%s' "$INPUT" | tr '\n' ' ' | sed 's/[[:space:]][[:space:]]*/ /g' | cut -c 1-500)"

  if [[ -f "$RALPH_STATE_FILE" ]]; then
    return
  fi

  mkdir -p "$RALPH_RUNS_DIR"

  cat > "$RALPH_STATE_FILE" <<EOF
workflow: ralph
status: active
started_at: "$now"
iteration: 0
max_iterations: $max_iterations
repeated_failure_block_threshold: $failure_threshold
report_path: "$report_path"
criteria: []
judge_results: []
notes:
  - "Define concrete criteria in the assistant response before implementation."
  - "Update fail counts during judge/replan loops."
  - "Append iteration evidence to the report_path before final response."
EOF

  if [[ -f "$RALPH_TEMPLATE_FILE" ]]; then
    printf 'state_template: "%s"\n' "$RALPH_TEMPLATE_FILE" >> "$RALPH_STATE_FILE"
  fi

  cat > "$report_path" <<EOF
# Ralph Run $run_id

- status: active
- started_at: \`$now\`
- state_file: \`$RALPH_STATE_FILE\`
- max_iterations: $max_iterations
- repeated_failure_block_threshold: $failure_threshold

## Request Snapshot

\`\`\`text
$request_snapshot
\`\`\`

## Completion Criteria

- [ ] Define observable criteria before implementation.

## Iterations

Record each loop with failed criteria, implementation focus, verification commands, and evidence.

## Final Verdict

Pending.
EOF
}

activate_workflow() {
  local workflow="$1"

  mkdir -p "$RUNTIME_DIR"
  printf '%s\n' "$workflow" > "$ACTIVE_FILE"

  if [[ "$workflow" == "ralph" ]]; then
    init_ralph_state
  fi

  printf 'Persistent workflow activated: %s.\n' "$workflow"
}

if [[ ! -f "$WORKFLOWS_MANIFEST" ]]; then
  exit 0
fi

while IFS=$'\t' read -r workflow_id keyword; do
  keyword_lower="$(printf '%s' "$keyword" | tr '[:upper:]' '[:lower:]')"
  if keyword_matches "$LOWER" "$keyword_lower"; then
    clear_workflow
    exit 0
  fi
done < <(
  awk '
    /^  - id:/ {
      id = $0
      sub(/^  - id: /, "", id)
      gsub(/"/, "", id)
      in_clear = 0
      next
    }
    /^    clear_keywords:/ {
      in_clear = 1
      next
    }
    /^    [A-Za-z_-]+:/ {
      in_clear = 0
      next
    }
    in_clear && /^      - / {
      keyword = $0
      sub(/^      - "/, "", keyword)
      sub(/"$/, "", keyword)
      print id "\t" keyword
    }
  ' "$WORKFLOWS_MANIFEST"
)

BEST_ID=""
BEST_PATH=""
BEST_PERSISTENT="false"
BEST_RANK=0

while IFS=$'\t' read -r workflow_id workflow_path persistent keyword; do
  keyword_lower="$(printf '%s' "$keyword" | tr '[:upper:]' '[:lower:]')"
  if keyword_matches "$LOWER" "$keyword_lower"; then
    rank="$(workflow_priority "$workflow_id")"
    if [[ "$rank" -gt "$BEST_RANK" ]]; then
      BEST_ID="$workflow_id"
      BEST_PATH="$workflow_path"
      BEST_PERSISTENT="$persistent"
      BEST_RANK="$rank"
    fi
  fi
done < <(
  awk '
    function emit() {
      if (id == "" || path == "") {
        return
      }
      for (i = 1; i <= keyword_count; i++) {
        print id "\t" path "\t" persistent "\t" keywords[i]
      }
    }
    function reset_entry() {
      id = ""
      path = ""
      persistent = "false"
      keyword_count = 0
      in_keywords = 0
      delete keywords
    }
    BEGIN {
      reset_entry()
    }
    /^  - id:/ {
      emit()
      reset_entry()
      id = $0
      sub(/^  - id: /, "", id)
      gsub(/"/, "", id)
      next
    }
    /^    path: / {
      path = $0
      sub(/^    path: "/, "", path)
      sub(/"$/, "", path)
      next
    }
    /^    persistent: / {
      persistent = $0
      sub(/^    persistent: /, "", persistent)
      next
    }
    /^    keywords:/ {
      in_keywords = 1
      next
    }
    /^    [A-Za-z_-]+:/ {
      in_keywords = 0
      next
    }
    in_keywords && /^      - / {
      keyword = $0
      sub(/^      - "/, "", keyword)
      sub(/"$/, "", keyword)
      keywords[++keyword_count] = keyword
      next
    }
    END {
      emit()
    }
  ' "$WORKFLOWS_MANIFEST"
)

if [[ -n "$BEST_ID" ]]; then
  if [[ "$BEST_PERSISTENT" == "true" ]]; then
    activate_workflow "$BEST_ID"
  else
    printf 'Recommended workflow from manifest: %s (%s).\n' "$BEST_ID" "$BEST_PATH"
  fi
fi
