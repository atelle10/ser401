# FAMAR KPI Dashboard API

FastAPI backend for incident data.

## Setup

```bash
pip install -r requirements.txt
export DATABASE_URL='postgresql://michael@localhost/famar_db'
uvicorn main:app --reload --port 8000
```

## Endpoints

### GET /api/incidents/kpi-data
Query params: start_date, end_date, region (south/north/all)

Returns detailed incident data with unit responses.

### GET /api/incidents/summary
Query params: start_date, end_date, region (south/north/all)

Returns aggregated KPI metrics for performance.

### GET /api/incidents/response-times
Query params: start_date, end_date, region (south/north/all)

Only unit responses with `apparatus_resource_id` in `fire_ems.scottsdale_units` are included (overall and per_unit use the same rows). Records with non-positive or out-of-order response-time timestamps are excluded from these KPIs.

Returns response-time KPIs (in minutes) for:
- call processing (PSAP → dispatch)
- turnout (dispatch → en route)
- travel (en route → arrival)

Response shape:
- `overall`: avg and 90th percentile for each metric.
- `per_unit`: one row per unit with `unit_id`, `calls`, and avg / 90th percentile for each metric.

## Database

Connects to PostgreSQL fire_ems schema.
Tables: incident, unit_response

## Region Filtering

- south: postal code < 85260
- north: postal code >= 85260
- all: no filter
