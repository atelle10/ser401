# US 672 — KPI API pytest

**SQP:** R3 (KPI Generation Coverage — API contract).

| Field | Value |
|--------|--------|
| Date | 2026-04-07 |
| Branch | `US-672-KPI-API-automated-test` |
| Commit | `d07b4fb3e678cea58181b3a469ab4bf5773db7c0` |
| OS / Python | Linux / 3.12 |
| DB | Not used — `RelationalDataStore` mocked |

**Run (repo root):**

```bash
python3 -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r backend/api/requirements.txt -r backend/api/requirements-dev.txt
cd "$(git rev-parse --show-toplevel)"
PYTHONPATH=. pytest backend/api/tests/ -v
```

**Outcome:** 21 collected, 21 passed, 0 failed (~0.21s, pytest 9.0.2). Warnings: `httpx`/`TestClient` deprecation only.

**Log (excerpt):**

```
collected 21 items
======================= 21 passed, 21 warnings in 0.21s ========================
```

**Defects:** none.
