# US 673 — Upload verification

**SQP:** R1 — Upload Validation Success Rate; Rejected File Blocking Rate.

| Field | Value |
|--------|--------|
| Date | 2026-04-08 |
| Branch | `US-673-upload-verification` |
| Commit | — |
| Scope | `POST /api/upload`, `TestClient`; mocked ingestion on success paths; DB via `conftest` |

**Run:** same as [672-kpi-api-evidence.md](672-kpi-api-evidence.md) — `PYTHONPATH=. pytest backend/api/tests/ -v` (includes `test_upload.py`).

## API matrix (automated)

| Case | Expected | Result |
|------|----------|--------|
| Missing `data_type` | 422 | pass |
| Invalid `data_type` (not fire/ems) | 422 | pass |
| `.pdf` upload | 400, rejected before DB | pass |
| Empty `.csv` | 400 | pass |
| Binary garbage as `.csv` | 400 | pass |
| Valid Fire (ingest + DB mocked) | 200, `success`, row count | pass |
| Valid EMS (ingest + DB mocked) | 200, `is_fire=False` on write | pass |
| DB write returns false | 500 | pass |

**Outcome:** `test_upload.py`: 8 passed; `backend/api/tests/`: 29 passed.

**E2E:** NFIRS file → live DB → KPI read, and UI upload, require Docker/staging; not covered by this pytest log.

**Defects:** none.
