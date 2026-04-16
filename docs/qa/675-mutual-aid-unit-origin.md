# US-675 — Mutual aid and unit-origin verification

## Scope

Automated checks for `UnitOriginHelper` behavior and KPI-related endpoints:

- `GET /api/incidents/mutual-aid`
- `GET /api/incidents/unit-origin`

## Branch and #664 reference

| Item | Value |
|------|--------|
| Branch | `US-675-Mutual-aid` |
| Integration merge | `e6d1bae` — merges `US-663-Extend-Scottsdale-unit-ID` (task **#664** Scottsdale unit classification) into this branch |
| US-663 commits (classification rules) | `f69491f`, `e517b0f` |

## Pytest

Command:

```bash
PYTHONPATH=. pytest backend/api/tests/test_mutual_aid.py backend/api/tests/test_unit_origin.py -v
```

Log: `docs/qa/675-pytest.txt`

Summary: **4 passed** (same modules as command above).

## API smoke (shape)

Query parameters: `start_date`, `end_date` (ISO-8601 strings), optional `region` (`all` \| `north` \| `south`).

Example paths (replace `{base}` with your API origin, e.g. `http://localhost:8000` for local):

- `{base}/api/incidents/mutual-aid?start_date=2024-01-01T00:00:00%2B00:00&end_date=2024-12-31T23:59:59%2B00:00&region=all`
- `{base}/api/incidents/unit-origin?start_date=2024-01-01T00:00:00%2B00:00&end_date=2024-12-31T23:59:59%2B00:00&region=all`

Expected **HTTP 200** and top-level JSON:

**mutual-aid:** `scottsdale_units_outside`, `other_units_in_scottsdale`, `other_units_in_scottsdale_detail`, `region`, `time_window` (`start`, `end`).

**unit-origin:** `units` (array of per-unit summaries), `scottsdale_uhu`, `non_scottsdale_uhu`, `region`, `time_window` (`start`, `end`).

Live/staging runs need a reachable database and valid date range with data; failures may be environmental (DB empty, wrong `DATABASE_URL`), not necessarily classification logic.

## Defects

None filed from this verification run.
