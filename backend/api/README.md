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

## Database

Connects to PostgreSQL fire_ems schema.
Tables: incident, unit_response

## Region Filtering

- south: postal code < 85260
- north: postal code >= 85260
- all: no filter
