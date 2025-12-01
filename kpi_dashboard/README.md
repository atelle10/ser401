# FAMAR KPI Dashboard
AI-Powered BI Dashboard for Scottsdale Fire Department (FAMAR KPI Dashboard).

## Task #561: Role-Based Access Control & Login
Implemented secure Microsoft Entra ID SSO with 3-tier RBAC (user story #315 from security epic #285):
- **Viewer** (default/general/read-only): Basic KPI placeholders + restricted message. No Upload or Settings access.
- **Analyst**: Advanced KPIs/filters + full Upload page. No Settings.
- **Admin**: Advanced KPIs + Upload + Settings page.
- Backend (`main.py`): Validates Microsoft id_token, extracts "roles" claim from Azure app roles, issues custom JWT with role.
- Frontend: View switching + conditionals hide/protect features (no "Access Denied" tease — clean UI).
- Polished Sidebar/NavBar/User to match staging (responsive, hover effects, navigation).
- Tested all roles (normal logins, logout between).
Roles assigned in Azure (Enterprise applications → Users and groups). Unassigned = viewer (safe fallback).

## Prerequisites
- Node.js (latest LTS recommended)
- Python 3.12+
- Git
- Microsoft account for login (ASU emails or assigned test accounts for role testing)

## How to Run Locally
The project has a **frontend** (React/Vite) and **backend** (FastAPI).

1. Backend Setup (FastAPI)
   ```bash
   cd backend
   python -m venv venv # Create virtual env (once)
   source venv/bin/activate # Activate (every session)
   pip install fastapi uvicorn[standard] python-jose[cryptography] httpx pydantic
   uvicorn main:app --reload --port 8000