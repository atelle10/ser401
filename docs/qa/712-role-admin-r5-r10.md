# US 712 — Role matrix, viewer upload denial, admin console verification

**SQP:** R5, R10.

| Field | Value |
|--------|--------|
| Date | 2026-04-22 |
| Branch | `US-716-Role-matrix-viewer-upload-denial-admin-console-tests` |
| Commit | `72430d02d4de2250aa9577730a01ddbf3b2fdba8` |
| Environment | Local Docker target (`http://localhost:3000`) |
| Scope in this increment | API upload regression evidence + role/admin matrix and run checklist |

## Completed in this increment

### 1) Upload API regression run (automated baseline)

Run command:

```bash
source .venv/bin/activate
PYTHONPATH=. pytest backend/api/tests/test_upload.py -v
```

Result: **8 passed, 0 failed** (`~0.14s`).

Notes:
- This confirms endpoint behavior for `POST /api/upload` request validation and ingestion/write error handling.
- These tests do not include authenticated role tokens; viewer/analyst/admin enforcement is validated through UI/admin flows below.

### 2) Role rules from current staging code (for matrix expectations)

- Upload visibility and access checks are implemented in `kpi_dashboard/src/Components/NavBar.jsx` and `kpi_dashboard/src/Components/Home.jsx`.
- Admin view gating is implemented in `kpi_dashboard/src/Components/Home.jsx`.
- Admin user-management actions are implemented in `kpi_dashboard/src/Components/AdminMenu.jsx`.

## Role matrix (UI and admin API flows)

| Action | Viewer | Analyst | Admin | Evidence status |
|--------|--------|---------|-------|-----------------|
| View dashboard (`/home`) | Allow | Allow | Allow | Pending manual run |
| Open Upload view from nav | Deny/hidden | Allow | Allow | Pending manual run |
| Upload Fire file | Deny | Allow | Allow | Pending manual run |
| Upload EMS file | Deny | Allow | Allow | Pending manual run |
| Open Admin console | Deny | Deny | Allow | Pending manual run |
| List users from admin console | Deny | Deny | Allow | Pending manual run |
| Approve user | Deny | Deny | Allow | Pending manual run |
| Change user role | Deny | Deny | Allow | Pending manual run |
| Remove user | Deny | Deny | Allow | Pending manual run |

## Viewer upload denial checks (to execute)

Use a viewer account label only (example: `viewer-test-1`), no credentials in docs.

1. Log in as viewer.
2. Try Upload from nav/sidebar.
3. Try forcing Upload view via direct route/view state if available.
4. If a network request is made to `/api/upload`, capture status code and response.
5. Record each attempt as blocked or incorrectly allowed.

## Admin console checks (to execute)

Use an admin account label only (example: `admin-test-1`).

1. Open Admin console.
2. List users.
3. Approve an unverified user if present.
4. Change one non-admin role (viewer <-> analyst).
5. Remove/disable one test account if feature is available.
6. Record pass/fail or blocked-by-environment with reason.

## Current blockers / gaps

| ID | Description |
|----|-------------|
| B1 | Manual role-account runs not executed in this increment. |
| B2 | No `docs/README.md` exists on this branch; optional docs index link deferred. |

## Next step to finish US 712

- Execute the pending viewer/analyst/admin manual matrix in Docker/staging and replace "Pending manual run" with pass/fail outcomes.
