# 포트폴리오

[ryudoll-dev.com](https://www.ryudoll-dev.com/)의 React 프론트엔드와 Spring Boot API입니다.

| 경로 | 내용 |
| --- | --- |
| `frontend/` | React 앱과 npm 잠금 파일 |
| `backend/` | Java 17 Spring Boot API와 Gradle Wrapper |
| `deploy/` | Mac mini 운영용 Docker Compose와 Caddy 설정 |

## 개발

- 프론트엔드 설치 및 실행은 루트에서 `npm --prefix frontend ci`, `npm --prefix frontend start`를 사용합니다. 개발용 API 주소가 필요하면 `frontend/.env.local`에 `REACT_APP_API_URL`을 설정합니다.
- 백엔드는 Java 17에서 `cd backend && ./gradlew bootJar`로 빌드합니다. 실행할 때는 로컬 MySQL 접속 정보를 Spring Boot 환경변수로 전달합니다.

## Mac mini 배포

저장소 루트에서 실행합니다. 런타임 환경 파일에는 `PORTFOLIO_DB_PASSWORD`와 `PORTFOLIO_DB_ROOT_PASSWORD`가 필요합니다.

```sh
docker compose --env-file "$HOME/Library/Application Support/Portfolio/.env" \
  -f deploy/compose.yaml up -d --build
```

Cloudflare Tunnel은 Mac의 `127.0.0.1:28180`으로 요청을 전달합니다. Caddy는 React 정적 파일을 제공하고 `/api/*`는 Spring Boot로 연결합니다. 운영 MySQL 데이터는 `portfolio-mac_mysql-data` 볼륨에 저장합니다. 환경 파일, 터널 자격 증명, DB 백업은 Mac의 운영 디렉터리에 보관합니다.
