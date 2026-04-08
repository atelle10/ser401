# US 672 — KPI API automated test evidence (pytest)

**Software Quality Plan:** R3 — KPI Generation Coverage (API contract / health via automated tests).

## Environment

| Field | Value |
|--------|--------|
| Date | 2026-04-07 |
| Branch | `US-672-KPI-API-automated-test` |
| Commit | `d07b4fb3e678cea58181b3a469ab4bf5773db7c0` |
| OS | Linux |
| Python | 3.12 |
| Database | Not required — tests mock `RelationalDataStore` |

## How to run (repo root)

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r backend/api/requirements.txt -r backend/api/requirements-dev.txt
cd "$(git rev-parse --show-toplevel)"
PYTHONPATH=. pytest backend/api/tests/ -v
```

Working directory: **repository root** (so `backend` imports resolve via `PYTHONPATH=.`).

## Result

| Metric | Value |
|--------|--------|
| Tests collected | 21 |
| Passed | 21 |
| Failed | 0 |

**Summary:** `21 passed` in ~0.21s (pytest 9.0.2). Deprecation warnings from `httpx`/`TestClient` only; no failures.

## Log excerpt

```
============================= test session starts ==============================
...
collected 21 items
...
======================= 21 passed, 21 warnings in 0.21s ========================
```

(Full log can be reproduced with the command above.)

## Defects

None for this run.
