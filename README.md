# ser401
SER401 Capstone Project | Authors: Zachary Alexander, Mike Krasnik, Damian Dray, Leroy Sturdivent, Andrew Tellez

## Requirements (Docker + Just)
- Docker Desktop
- Just (`brew install just` on macOS, `winget install Casey.Just` on Windows)

## Setup (preferred)
0. Pull the latest `staging` branch.
1. Create `deployment/.env` with:

```
VITE_API_URL=http://localhost:8000
POSTGRES_USER=famar_admin
POSTGRES_PASSWORD=famar_pass92934
POSTGRES_DB=famar_db
MICROSOFT_CLIENT_ID=<get from team>
MICROSOFT_CLIENT_SECRET=<get from team>
DEV_ADMIN_EMAIL=dev-admin@example.com
DEV_ADMIN_PASSWORD=change-me
```

2. Add `fire.csv` and `ems.csv` to `deployment/db` (used to initialize the database).
3. Start everything:

```bash
just start-clean-all
```

The `justfile` in the repo root includes helpers for starting/stopping individual
services, checking logs, and viewing status.

## Notes
- Better Auth expects the `auth` schema in `famar_db` (the Docker setup handles this).
- Dev-only admin seeding runs on auth server startup if `DEV_ADMIN_EMAIL` and
  `DEV_ADMIN_PASSWORD` are set.
- Dev-only: email changes bypass verification; see TODO in `auth_server/src/auth.ts`
  for enabling email verification before production.

## Manual (non-Docker) setup
If you prefer running services locally without Docker, you can still use:

```bash
cp auth_server/.env.example auth_server/.env
```

Then fill in DB + OAuth values and run the auth server + SPA manually.
