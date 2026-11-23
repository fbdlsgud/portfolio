#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat || true)"
LOWER="$(printf '%s' "$INPUT" | tr '[:upper:]' '[:lower:]')"

case "$LOWER" in
  *"rm -rf /"*|*"git reset --hard"*|*"git clean -fd"*|*"drop database"*|*"truncate table"*)
    printf '%s\n' "Dangerous command pattern detected. Require explicit user approval before proceeding."
    ;;
  *"npm install"*|*"pnpm install"*|*"yarn install"*|*"npx "*)
    printf '%s\n' "Network or dependency command detected. Run only when needed and report failures clearly."
    ;;
esac

