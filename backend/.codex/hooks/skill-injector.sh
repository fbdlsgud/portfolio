#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat || true)"
LOWER="$(printf '%s' "$INPUT" | tr '[:upper:]' '[:lower:]')"
SKILLS_MANIFEST=".agents/skills/manifest.yaml"
WORKFLOWS_MANIFEST=".agents/workflows/manifest.yaml"

SKILLS=()
WORKFLOWS=()

add_skill() {
  SKILLS+=("$1")
}

add_workflow() {
  WORKFLOWS+=("$1")
}

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

if [[ -f "$SKILLS_MANIFEST" ]]; then
  while IFS=$'\t' read -r skill_path keyword; do
    keyword_lower="$(printf '%s' "$keyword" | tr '[:upper:]' '[:lower:]')"

    if keyword_matches "$LOWER" "$keyword_lower"; then
      add_skill "$skill_path"
    fi
  done < <(
    awk '
      /^  - id:/ {
        path = ""
        in_keywords = 0
        next
      }
      /^    path: / {
        path = $0
        sub(/^    path: "/, "", path)
        sub(/"$/, "", path)
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
        if (path != "") {
          print path "\t" keyword
        }
      }
    ' "$SKILLS_MANIFEST"
  )
fi

if [[ -f "$WORKFLOWS_MANIFEST" ]]; then
  while IFS=$'\t' read -r workflow_path keyword skill_path; do
    keyword_lower="$(printf '%s' "$keyword" | tr '[:upper:]' '[:lower:]')"

    if keyword_matches "$LOWER" "$keyword_lower"; then
      add_workflow "$workflow_path"
      [[ -n "$skill_path" ]] && add_skill "$skill_path"
    fi
  done < <(
    awk '
      function emit() {
        if (workflow_path == "" || keyword_count == 0) {
          return
        }
        for (i = 1; i <= keyword_count; i++) {
          if (skill_count == 0) {
            print workflow_path "\t" keywords[i] "\t"
          } else {
            for (j = 1; j <= skill_count; j++) {
              print workflow_path "\t" keywords[i] "\t" skills[j]
            }
          }
        }
      }
      function reset_entry() {
        workflow_path = ""
        keyword_count = 0
        skill_count = 0
        in_keywords = 0
        in_skills = 0
        delete keywords
        delete skills
      }
      BEGIN {
        reset_entry()
      }
      /^  - id:/ {
        emit()
        reset_entry()
        next
      }
      /^    path: / {
        workflow_path = $0
        sub(/^    path: "/, "", workflow_path)
        sub(/"$/, "", workflow_path)
        next
      }
      /^    keywords:/ {
        in_keywords = 1
        in_skills = 0
        next
      }
      /^    skills:/ {
        in_keywords = 0
        in_skills = 1
        next
      }
      /^    [A-Za-z_-]+:/ {
        in_keywords = 0
        in_skills = 0
        next
      }
      in_keywords && /^      - / {
        keyword = $0
        sub(/^      - "/, "", keyword)
        sub(/"$/, "", keyword)
        keywords[++keyword_count] = keyword
        next
      }
      in_skills && /^      - ".agents\/skills\// {
        skill = $0
        sub(/^      - "/, "", skill)
        sub(/"$/, "", skill)
        skills[++skill_count] = skill
        next
      }
      END {
        emit()
      }
    ' "$WORKFLOWS_MANIFEST"
  )
fi

if [[ "${#SKILLS[@]}" -gt 0 || "${#WORKFLOWS[@]}" -gt 0 ]]; then
  printf 'Context loading rule: read listed SKILL.md entrypoints first; follow only task-relevant resource links.\n'
fi

if [[ "${#WORKFLOWS[@]}" -gt 0 ]]; then
  printf 'Relevant workflows from manifest:\n'
  printf -- '- %s\n' "${WORKFLOWS[@]}" | sort -u
fi

if [[ "${#SKILLS[@]}" -gt 0 ]]; then
  printf 'Relevant skills to read before work:\n'
  printf -- '- %s\n' "${SKILLS[@]}" | sort -u
fi
