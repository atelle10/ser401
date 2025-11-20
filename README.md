# ser401
SER401 Capstone Project | Authors: Zachary Alexander, Mike Krasnik, Damian Dray, Leroy Sturdivent, Andrew Tellez

# FAMAR Dashboard – T1 SSO Login (COMPLETE – November 19, 2025)

**Task:** T1 / US #315 – Role-Based Access Control & Login  
**Branch:** `sprint-3-task-475-login-flow`  

## How to Run (2 terminals)

### 1. Backend – FastAPI mock server (multi-role support)
```bash
# From the frontend/backend folder
uvicorn main:app --port 8000 --reload
2. Frontend – React app
Bash# From the frontend folder
npm start
Open → http://localhost:3000
Instant Role Demo Links

Admin   → http://localhost:3000/auth/callback?code=admincode
Analyst → http://localhost:3000/auth/callback?code=mockcode
Viewer  → http://localhost:3000/auth/callback?code=viewercode

What This Delivers

Production-grade FAMAR login screen (gradient background, large centered text, official Microsoft logo)
Huge readable toasts (24px font, no duplicates via toastId)
Full JWT decoding + role extraction on the frontend
Protected routes and role-based rendering fully implemented
Dashboard correctly displays “Logged in as: ADMIN / ANALYST / VIEWER”
Tiny FastAPI mock backend (frontend/backend/main.py) that returns properly signed JWTs based on the code
