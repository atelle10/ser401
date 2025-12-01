<<<<<<< HEAD
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
```

Fill in values for your machine, especially the database host, user, and password. `.env`
is loaded at startup via `dotenv`. The auth server reads `DB_HOST`, `DB_USER`, and
`DB_PASSWORD`.

## Sharing Microsoft OAuth secrets (dev only)
Use `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET` as defined in the shared team Google Drive. The file is named `authentication_values.txt`.

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
```

Notes:
- The auth server reads env vars from the shell or `.env` (loaded via `dotenv`).
- `BETTER_AUTH_TRUSTED_ORIGINS` must include the Vite dev URL to avoid invalid origin errors.
- Dev-only: email changes bypass verification; TODO in `auth_server/src/auth.ts` to enable email verification before production.

## Production TODO
- Use separate secrets for database credentials and Microsoft OAuth.
- Update README with production deployment steps and required env vars per environment.

## Run the SPA (Vite)
In another terminal:

```bash
cd kpi_dashboard
npm install
npm run dev
```
=======
# Task-504: KPI Dashboard with Role-Based FastAPI Backend and Real Microsoft Entra ID SSO

**Completed & Fully Working**

### Features
- Real FAMAR login screen (original design preserved)
- Authentication via Microsoft Entra ID SSO using MSAL.js
- Backend validates real Microsoft ID tokens via JWKS and issues our own role-based JWT
- Role-based login: Default to "viewer" role. Sponsor can assign "admin", "analyst", or "viewer" via Azure app roles or groups. Admin/analyst see additional KPIs/stats (e.g., advanced charts/reports); viewer sees basic view. Role is extracted from token claims and used in frontend to render role-specific content (per #315).
- JWT stored in localStorage
- Real FAMAR dashboard with sidebar, chatbot, and full fire department theme
- Protected routes


### Dependencies
**Backend** (Python):
- fastapi
- uvicorn
- python-jose[cryptography]
- pydantic
- httpx

**Frontend** (Node.js):
- @azure/msal-browser
- @azure/msal-react
- jwt-decode
- react-router-dom
- All other dependencies in package.json (e.g., recharts, tailwindcss)

### How to Run
**Backend**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-jose[cryptography] pydantic httpx
uvicorn main:app --reload --port 8000
Frontend
Bashcd kpi_dashboard
npm install --legacy-peer-deps
npm run dev
Open → http://localhost:5173
Azure Setup Instructions

Go to portal.azure.com and sign in.
Search for "App registrations" → New registration.
Name: "FAMAR KPI Dashboard"
Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
Redirect URI: SPA → http://localhost:5173
Register.
Copy Application (client) ID and Directory (tenant) ID from Overview.
Paste into backend/main.py and frontend/src/App.jsx (search for CLIENT_ID and TENANT_ID).

Setting Up Role-Based Access (Admin/Analyst/Viewer)
Brief description: The app supports role-based access, where the backend extracts the user's role from the Microsoft token (app roles or groups claims). Default is "viewer". Users with "admin" or "analyst" roles see additional KPI stats/charts in the dashboard (e.g., advanced analytics). Viewer sees basic view.

In Azure Portal → Your app registration → App roles → Add app role (e.g., Name: "admin", Value: "admin", Description: "Admin access").
Repeat for "analyst" and "viewer".
Assign roles: Go to Entra ID → Enterprise applications → Your app → Users and groups → Add user/group → Assign the role.
Alternative (groups fallback): Create Azure groups (e.g., "AdminGroup") → assign users to groups → backend extracts from "groups" claim.
No code changes needed — backend auto-extracts on next login.
Test: Log in with assigned user → backend issues JWT with correct role → dashboard shows role-specific KPIs (per #315 implementation).

To add external users (e.g., personal Gmail for testing):

In Azure Portal → Microsoft Entra ID → Users → New guest user.
Invite the external email (e.g., dray111@gmail.com).
They accept the invite.
Now they can log in.

For sponsor (fire dept) hand-off:

Sponsor creates their own app registration in their Azure tenant (same steps above).
They send you the new Client ID and Tenant ID.
Update the 2 lines in backend/main.py and frontend/src/App.jsx — zero other code changes.
Their department accounts now log in seamlessly.

Testing/Demo

Use ASU (@asu.edu) accounts or added external users.
First login: Shows consent screen (normal for real Entra ID).
Subsequent logins: Email → password → dashboard (session persists).
For demo, use incognito window or clear localStorage to show full flow every time:
F12 → Application → Local Storage → http://localhost:5173 → Clear all.


>>>>>>> 41fbf86 (feat(task-504): cherry-pick real Microsoft Entra ID SSO implementation with MSAL and backend validationfeat(task-504): implement real Microsoft Entra ID SSO with MSAL and backend token validation; cleanup duplicates; update README)
