# 포트폴리오 모노레포 통합

## 목표

프론트엔드와 백엔드를 기존 `fbdlsgud/portfolio`에서 함께 관리하고 Mac mini 배포 설정의 기준 위치를 정한다.

## 변경

- React 파일을 `frontend/`로 이동했다.
- Spring Boot 저장소를 원본 커밋 이력과 함께 `backend/`에 병합했다.
- Docker Compose와 Caddy 설정을 `deploy/`에 추가했다. 운영 환경 파일과 백업은 Mac mini의 런타임 디렉터리에 둔다.
- README와 프로젝트 프로필에 새 애플리케이션 경로와 빌드 명령을 반영했다.

## 검증

- 두 원본 브랜치의 마지막 커밋이 통합 이력에 남고 앱 소스가 기존과 동일한지 확인했다.
- 프론트엔드 테스트 2개와 백엔드 Gradle 테스트를 실행했다.
- 별도 포트와 MySQL 볼륨을 사용하는 Docker Compose에서 페이지, API, 게임 점수 저장과 조회를 확인했다.

## 운영 참고

운영 프로젝트명은 `portfolio-mac`, MySQL 볼륨은 `portfolio-mac_mysql-data`이다. Cloudflare Tunnel의 원본 주소는 `127.0.0.1:28180`이다.
