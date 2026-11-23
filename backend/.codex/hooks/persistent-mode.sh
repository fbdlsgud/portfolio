#!/usr/bin/env bash
set -euo pipefail

STATE_FILE=".agents/runtime/active-workflow"
RALPH_STATE_FILE=".agents/runtime/ralph-state.yaml"

if [[ -f "$STATE_FILE" ]]; then
  WORKFLOW="$(tr -d '\n' < "$STATE_FILE")"
  case "$WORKFLOW" in
    ralph|ultrawork|orchestrate)
      printf 'Persistent workflow active: %s. Do not stop until gates pass, safeguard triggers, or user says workflow done.\n' "$WORKFLOW"
      if [[ "$WORKFLOW" == "ralph" ]]; then
        if [[ -f "$RALPH_STATE_FILE" ]]; then
          awk '
            /^iteration:/ || /^max_iterations:/ || /^repeated_failure_block_threshold:/ {
              print "Ralph state " $0
            }
            /^report_path:/ {
              print "Ralph report " $0
            }
          ' "$RALPH_STATE_FILE"
          printf '%s\n' 'Append criteria, iteration evidence, and final verdict to the Ralph report before completion.'
        else
          printf '%s\n' 'Ralph state file missing: .agents/runtime/ralph-state.yaml. Initialize criteria before continuing.'
        fi
      fi
      ;;
  esac
fi

printf '%s\n' "If meaningful work completed, update docs/ai/feature-log or relevant case records."
