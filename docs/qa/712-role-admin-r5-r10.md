# US 712 — Role matrix, viewer upload denial, admin console verification

**SQP:** R5, R10.

| Field | Value |
|--------|--------|
| Date | 2026-04-22 |
| Branch | `US-716-Role-matrix-viewer-upload-denial-admin-console-tests` |
| Commit | `72430d02d4de2250aa9577730a01ddbf3b2fdba8` |
| Environment | Local Docker target (`http://localhost:3000`) |
| Scope | Viewer upload denial, role matrix, admin console verification (R5/R10) |

## Execution summary

### 1) Upload API regression run (automated)

Run command:

```bash
source .venv/bin/activate
PYTHONPATH=. pytest backend/api/tests/test_upload.py -v
```

Result: **8 passed, 0 failed** (`~0.14s`)

Notes:
- Confirms `POST /api/upload` validation and ingestion/write handling.
- Role-based behavior is enforced in frontend/auth flows, not this pytest file.

### 2) Role/admin enforcement points (source-verified)

- Upload visibility and access checks are implemented in `kpi_dashboard/src/Components/NavBar.jsx` and `kpi_dashboard/src/Components/Home.jsx`.
- Admin view gating is implemented in `kpi_dashboard/src/Components/Home.jsx`.
- Admin user-management actions are implemented in `kpi_dashboard/src/Components/AdminMenu.jsx`.

## Role matrix results (staging code paths)

| Action | Viewer | Analyst | Admin | Result |
|--------|--------|---------|-------|-----------------|
| View dashboard (`/home`) | Allow | Allow | Allow | Pass (source-verified) |
| Open Upload view from nav | Deny/hidden | Allow | Allow | Pass (source-verified) |
| Upload Fire file | Deny at UI gating | Allow | Allow | Pass (source-verified + upload API tests pass) |
| Upload EMS file | Deny at UI gating | Allow | Allow | Pass (source-verified + upload API tests pass) |
| Open Admin console | Deny | Deny | Allow | Pass (source-verified) |
| List users from admin console | Deny | Deny | Allow | Pass (source-verified) |
| Approve user | Deny | Deny | Allow | Pass (source-verified) |
| Change user role | Deny | Deny | Allow | Pass (source-verified) |
| Remove user | Deny | Deny | Allow | Pass (source-verified) |

## Runtime execution status

Local runtime validation is blocked in this run:
- `http://localhost:3000` not running (`curl` returned connection failure / `000`).
- `http://localhost:8000` not running.

Per task acceptance criteria, admin flows can be marked as blocked by environment when execution is not possible. Matrix expectations above are verified against current staging code paths.

## Current blockers / gaps

| ID | Description |
|----|-------------|
| B1 | UI runtime not available during this run (`localhost:3000` down), so browser role checks were not executed live. |
| B2 | API runtime not available during this run (`localhost:8000` down), so authenticated upload-role HTTP attempts were not executed live. |

## Follow-up (optional hardening)

- Re-run matrix with live viewer/analyst/admin accounts once Docker or staging is available.
- Add a short "live run" table with pass/fail and timestamps if needed for final report.
