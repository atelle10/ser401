# FAMAR KPI Dashboard

AI-Powered BI Dashboard for Scottsdale Fire Department (FAMAR KPI Dashboard).

## Task #561: Role-Based Access Control & Login

Implemented secure Microsoft Entra ID SSO with 3-tier RBAC (user story #315 from security epic #285):

- **Viewer** (default/general/read-only): Basic KPI placeholders + restricted message. No Upload or Settings access.
- **Analyst**: Advanced KPIs/filters + full Upload page. No Settings.
- **Admin**: Advanced KPIs + Upload + Settings page.

- Backend (`main.py`): Validates Microsoft id_token, extracts "roles" claim from Azure app roles, issues custom JWT with role.
- Frontend: View switching + conditionals hide/protect features (clean UI, no "Access Denied" tease).
- Polished Sidebar/NavBar/User for responsive hover effects and navigation.
- Tested all roles (normal logins, logout between accounts).

Roles assigned in Azure (Enterprise applications → Users and groups). Unassigned = viewer (safe fallback).

## Prerequisites

- Node.js 18+ (latest LTS recommended)
- Python 3.12+
- PostgreSQL (for auth server)
- Git
- Microsoft account for login (ASU emails or assigned test accounts for role testing)

## Environment Setup

1. Create a `.env` in `auth_server` from the template:

```bash
cp auth_server/.env.example auth_server/.env
Fill in values for your machine (database host, user, password, Microsoft client ID/secret).

Database setup for Better Auth:

bash
Copy code
psql "postgresql://postgres:YOUR_PASSWORD@localhost:5432/famar_db" \
  -v ON_ERROR_STOP=1 \
  -c "CREATE SCHEMA IF NOT EXISTS auth;" \
  -c "SET search_path TO auth;" \
  -f auth_server/better-auth_migrations/2026-01-18T00-43-36.982Z.sql
Alternatively, run the CLI migrator:

bash
Copy code
cd auth_server
npx @better-auth/cli migrate
Run the Auth Server
bash
Copy code
cd auth_server
npm install
# set environment variables as needed
npm run dev
Auth server reads env vars via shell or .env.

BETTER_AUTH_TRUSTED_ORIGINS must include Vite dev URL to avoid invalid origin errors.

Run the Frontend (React/Vite)
bash
Copy code
cd kpi_dashboard
npm install
npm run dev
Open browser at http://localhost:5173 → Sign in with Microsoft. Roles are enforced from Azure.

Testing Roles
Assign roles in Azure: Enterprise applications → app → Users and groups → Edit assignment.

Logout → login with assigned account → confirm role-specific view (Viewer / Analyst / Admin).