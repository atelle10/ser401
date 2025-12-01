# ser401
SER401 Capstone Project | Authors: Zachary Alexander, Mike Krasnik, Damian Dray, Leroy Sturdivent, Andrew Tellez

## Requirements
- Node.js 18+ (for Vite + Better Auth)
- PostgreSQL running locally
  - Database name must be `famar_db`
  - Password can be whatever your local `postgres` user uses
  - Port is fixed at `5432`

## Environment setup
Create a local `.env` (gitignored) from the template:

```bash
cp auth_server/.env.example auth_server/.env
Fill in values for your machine, especially the database host, user, and password. .env
is loaded at startup via dotenv. The auth server reads DB_HOST, DB_USER, and
DB_PASSWORD.
Sharing Microsoft OAuth secrets (dev only)
Use MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET as defined in the shared team Google Drive. The file is named authentication_values.txt.
Database setup (Better Auth)
The auth server expects the auth schema in the same famar_db database.

Create the database if needed.
Create the schema and run the migration SQL:

Bashpsql "postgresql://postgres:YOUR_PASSWORD@localhost:5432/famar_db" \
  -v ON_ERROR_STOP=1 \
  -c "CREATE SCHEMA IF NOT EXISTS auth;" \
  -c "SET search_path TO auth;" \
  -f auth_server/better-auth_migrations/2026-01-18T00-43-36.982Z.sql
Note: once Better Auth is installed with npm, you can also run the CLI migrator from the auth_server directory:
Bashcd auth_server
npx @better-auth/cli migrate
This uses the same connection parameters (env vars) as the auth server.
Run the auth server
In one terminal:
Bashcd auth_server
npm install

# Environment (PowerShell examples)
$env:DB_HOST="localhost"
$env:DB_USER="postgres"
$env:DB_PASSWORD="YOUR_LOCAL_DB_PASSWORD"
$env:AUTH_PORT="3001"
$env:BETTER_AUTH_URL="http://localhost:5173"
$env:BETTER_AUTH_BASE_PATH="/api/auth"
$env:BETTER_AUTH_TRUSTED_ORIGINS="http://localhost:5173"
$env:MICROSOFT_CLIENT_ID="YOUR_SHARED_DEV_CLIENT_ID"
$env:MICROSOFT_CLIENT_SECRET="YOUR_SHARED_DEV_CLIENT_SECRET"

npm run dev
Notes:

The auth server reads env vars from the shell or .env (loaded via dotenv).
BETTER_AUTH_TRUSTED_ORIGINS must include the Vite dev URL to avoid invalid origin errors.
Dev-only: email changes bypass verification; TODO in auth_server/src/auth.ts to enable email verification before production.