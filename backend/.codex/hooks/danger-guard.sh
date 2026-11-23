#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat || true)"
LOWER="$(printf '%s' "$INPUT" | tr '[:upper:]' '[:lower:]')"

APPROVED=0
case "$LOWER" in
  *"aikit_approved_dangerous=1"*|*"ai-safety-approved"*|*"ai safety approved"*)
    APPROVED=1
    ;;
esac

HIGH_RISK_HITS=()
CAUTION_HITS=()

add_high_risk() {
  HIGH_RISK_HITS+=("$1")
}

add_caution() {
  CAUTION_HITS+=("$1")
}

matches() {
  local pattern="$1"

  printf '%s\n' "$LOWER" | grep -Eiq "$pattern"
}

if matches '(^|[^[:alnum:]_])(sudo[[:space:]]+)?rm[[:space:]][^"\n;]*-[^"\n;]*r[^"\n;]*f|(^|[^[:alnum:]_])rm[[:space:]][^"\n;]*-[^"\n;]*f[^"\n;]*r'; then
  add_high_risk "recursive force delete"
fi

if matches 'git[[:space:]]+reset[[:space:]]+--hard|git[[:space:]]+clean[[:space:]][^"\n;]*-[^"\n;]*f|git[[:space:]]+checkout[[:space:]]+--|git[[:space:]]+restore[[:space:]]+(\.|--source)'; then
  add_high_risk "destructive git operation"
fi

if matches 'drop[[:space:]]+database|truncate[[:space:]]+table|delete[[:space:]]+from|prisma[[:space:]]+migrate[[:space:]]+reset|rails[[:space:]]+db:drop'; then
  add_high_risk "destructive database operation"
fi

if matches 'terraform[[:space:]]+destroy|pulumi[[:space:]]+destroy|kubectl[[:space:]][^"\n;]*delete|oc[[:space:]][^"\n;]*delete|aws[[:space:]][^"\n;]*delete|gcloud[[:space:]][^"\n;]*delete|az[[:space:]][^"\n;]*delete|railway[[:space:]][^"\n;]*(delete|down)|fly[[:space:]][^"\n;]*destroy|docker[[:space:]]+system[[:space:]]+prune'; then
  add_high_risk "destructive cloud or infrastructure operation"
fi

if matches '(prod|production)[^"\n;]*(deploy|delete|drop|truncate|migrate|destroy|reset)|[^[:alnum:]_](deploy|migrate|destroy|delete)[^"\n;]*(prod|production)'; then
  add_high_risk "production-affecting operation"
fi

if matches 'cat[[:space:]][^"\n;]*(\.env|id_rsa|credentials|secret|token)|grep[[:space:]][^"\n;]*(secret|token|password|\.env)|printenv|env[[:space:]]*\|'; then
  add_caution "secret or environment value exposure"
fi

if [[ "${#CAUTION_HITS[@]}" -gt 0 ]]; then
  printf 'AI safety caution: %s. Avoid exposing secrets; inspect names or config structure instead of values.\n' "$(IFS=', '; echo "${CAUTION_HITS[*]}")"
fi

if [[ "${#HIGH_RISK_HITS[@]}" -eq 0 ]]; then
  exit 0
fi

if [[ "$APPROVED" -eq 1 ]]; then
  printf 'AI safety guard: high-risk command marker present. Proceed only if the user explicitly approved this exact destructive action.\n'
  exit 0
fi

printf 'AI safety block: high-risk Bash command detected: %s.\n' "$(IFS=', '; echo "${HIGH_RISK_HITS[*]}")"
printf 'Stop and ask the user for explicit approval before running it. If approved, rerun with AIKIT_APPROVED_DANGEROUS=1 and explain the rollback/backup plan.\n'
exit 2
