#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat || true)"
LOWER="$(printf '%s' "$INPUT" | tr '[:upper:]' '[:lower:]')"

emit() {
  printf '%s\n' "$1"
}

case "$LOWER" in
  *ralph*|*랄프*|*끝까지*|*완료될\ 때까지*|*될\ 때까지*)
    emit "Detected Ralph-style request. Use .agents/workflows/ralph.md and define mechanical completion criteria."
    ;;
  *ultrawork*|*ultra\ work*|*울트라워크*|*검증\ 루프*)
    emit "Detected Ultrawork request. Use .agents/workflows/ultrawork.md."
    ;;
  *컨벤션*|*프로젝트\ 세팅*|*이런\ 앱*|*만들\ 거야*|*project\ setup*|*project\ convention*)
    emit "Detected project onboarding/product discovery. Use .agents/workflows/project-onboarding.md."
    ;;
  *아키텍처*|*architecture*|*구조*|*경계*|*adr*)
    emit "Detected architecture work. Use .agents/workflows/architecture.md."
    ;;
  *eval*|*평가*|*품질\ 비교*|*성능\ 비교*)
    emit "Detected AI setup evaluation. Use .agents/workflows/eval.md."
    ;;
  *버그*|*에러*|*오류*|*재현*|*원인*|*debug*|*bug*|*error*|*exception*)
    emit "Detected debug work. Use .agents/workflows/debug.md and record reusable failures in docs/ai/error-cases/."
    ;;
  *리뷰*|*검토*|*qa*|*보안*|*성능*|*접근성*|*review*|*audit*)
    emit "Detected review work. Use .agents/workflows/review.md."
    ;;
  *구현*|*기능*|*feature*|*implement*|*build*)
    emit "Detected implementation work. Use .agents/workflows/implement.md; use ultrawork for risky multi-file work."
    ;;
esac
