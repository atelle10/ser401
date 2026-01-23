# ser401
SER401 Capstone Project | Authors: Zachary Alexander, Mike Krasnik, Damian Dray, Leroy Sturdivent, Andrew Tellez

## Requirements
- Node.js 18+ (for Vite + Better Auth)
- PostgreSQL running locally
  - Database name must be `famar_db`
  - Password must match the master password used for the deployed database

## Database setup (Better Auth)
The auth server expects the `auth` schema in the same `famar_db` database.

1. Create the database if needed.
2. Create the schema and run the migration SQL:

```bash
psql "postgresql://postgres:YOUR_PASSWORD@localhost:5432/famar_db" \
  -v ON_ERROR_STOP=1 \
  -c "CREATE SCHEMA IF NOT EXISTS auth;" \
  -c "SET search_path TO auth;" \
  -f auth_server/better-auth_migrations/2026-01-18T00-43-36.982Z.sql
```

Note: once Better Auth is installed with npm, you can also run the CLI migrator from the `auth_server` directory:

```bash
cd auth_server
npx @better-auth/cli migrate
```

This uses the same connection parameters (env vars) as the auth server.

## Run the auth server
In one terminal:

```bash
cd auth_server
npm install

# Environment (PowerShell examples)
$env:PGHOST="localhost"
$env:PGPORT="5432"
$env:PGUSER="postgres"
$env:PGPASSWORD="YOUR_MASTER_PASSWORD"
$env:PGDATABASE="famar_db"
$env:BETTER_AUTH_URL="http://localhost:3001"
$env:BETTER_AUTH_BASE_PATH="/api/auth"
$env:BETTER_AUTH_TRUSTED_ORIGINS="http://localhost:5173"

npm run dev
```

Notes:
- The auth server reads env vars from the shell (no automatic .env loading).
- `BETTER_AUTH_TRUSTED_ORIGINS` must include the Vite dev URL to avoid invalid origin errors.
- Dev-only: email changes bypass verification; TODO in `auth_server/src/auth.ts` to enable email verification before production.

## Run the SPA (Vite)
In another terminal:

```bash
cd kpi_dashboard
npm install
npm run dev
```

Notes:
- Vite proxies `/api/auth` to `http://localhost:3001` by default.
- If you want a full URL client config, set these in `kpi_dashboard/.env`:
  - `VITE_BETTER_AUTH_URL=http://localhost:3001`
  - `VITE_BETTER_AUTH_BASE_PATH=/api/auth`
