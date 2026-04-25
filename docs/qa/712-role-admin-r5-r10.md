# US 712 — Role matrix, viewer upload denial, admin console verification

**SQP:** R5, R10.

| Field | Value |
|--------|--------|
| Date | 2026-04-23 |
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

### 1a) Runtime health check

Live services during this run:
- `http://localhost:3000` → HTTP 200
- `http://localhost:8000/docs` → HTTP 200

### 2) Role/admin enforcement points (source-verified)

- Upload visibility and access checks are implemented in `kpi_dashboard/src/Components/NavBar.jsx` and `kpi_dashboard/src/Components/Home.jsx`.
- Admin view gating is implemented in `kpi_dashboard/src/Components/Home.jsx`.
- Admin user-management actions are implemented in `kpi_dashboard/src/Components/AdminMenu.jsx`.

## Role matrix results (staging code paths)

Legend: **A = Allow**, **D = Deny**

| Area      | Action                         | Viewer | Analyst | Admin | Evidence                                      |
|-----------|--------------------------------|--------|---------|-------|-----------------------------------------------|
| Dashboard | View dashboard (`/home`)       | A      | A       | A     | Pass (source-verified)                        |
| Upload    | Open Upload view from nav      | D      | A       | A     | Pass (source-verified)                        |
| Upload    | Upload Fire file               | D      | A       | A     | Pass (source-verified + upload API tests pass)|
| Upload    | Upload EMS file                | D      | A       | A     | Pass (source-verified + upload API tests pass)|
| Admin     | Open Admin console             | D      | D       | A     | Pass (source-verified)                        |
| Admin     | List users from admin console  | D      | D       | A     | Pass (source-verified)                        |
| Admin     | Approve user                   | D      | D       | A     | Pass (source-verified)                        |
| Admin     | Change user role               | D      | D       | A     | Pass (source-verified)                        |
| Admin     | Remove user                    | D      | D       | A     | Pass (source-verified)                        |

## Live role checks (runtime)

Test account labels used:
- `viewer-test-716` (role: viewer)
- `analyst-test-716` (role: analyst)
- `admin-test-716` (role: admin)

### Admin endpoint permission checks (`http://localhost:3001/api/auth`)

All requests used valid signed-in sessions for each role and an `Origin: http://localhost:3000` header.

| Endpoint/action                  | Viewer | Analyst | Admin | Result |
|----------------------------------|--------|---------|-------|--------|
| `GET /api/auth/admin/list-users` | 403    | 403     | 200   | Pass   |
| `POST /api/auth/admin/set-role`  | 403    | 403     | 200   | Pass   |
| `POST /api/auth/admin/update-user` | 403  | 403     | 200   | Pass   |

### Upload endpoint attempt by role (`http://localhost:8000/api/upload`)

Uploaded a `.pdf` test file with each role session and no-auth baseline.

| Attempt        | HTTP status | Response                 |
|----------------|-------------|--------------------------|
| Viewer session | 400         | `Unsupported file type.` |
| Analyst session | 400        | `Unsupported file type.` |
| Admin session  | 400         | `Unsupported file type.` |
| No auth cookie | 400         | `Unsupported file type.` |

Interpretation:
- Viewer upload remains denied in UI per role gating (`NavBar` + `Home` checks).
- Backend upload endpoint behavior for this request is file-validation based; no role-based difference was observed for this invalid file upload.

## Current blockers / gaps

| ID | Description          |
|----|----------------------|
| —  | None for this run.   |


