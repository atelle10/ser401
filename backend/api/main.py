import json
import os
import sys
import tempfile
from datetime import datetime
from pathlib import Path

from fastapi import Body, FastAPI, File, HTTPException, Query, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from openai import OpenAI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from backend.db_ops.relational_data_store import RelationalDataStore
from backend.ingestion.data_classes import DataSet, DQPolicy, DQRule
from backend.ingestion.ingestion_service import IngestionService
from backend.local_unit_def import UnitOriginHelper

app = FastAPI(title="FAMAR KPI Dashboard API")

# Rate limiter for chatbot - 10 requests per minute per IP
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://michael@localhost/famar_db")

# OpenAI config for chatbot
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
CHATBOT_MODEL = "gpt-4o-mini"  # cheapest model, good enough for our use case

RESPONSE_TIME_TARGETS_PATH = (
    Path(__file__).resolve().parent / "data" / "response_time_targets.json"
)
DEFAULT_RESPONSE_TIME_TARGETS = {
    "call_processing": {"national": 2.0, "local": 2.5},
    "turnout": {"national": 1.5, "local": 2.0},
    "travel": {"national": 4.0, "local": 5.0},
}


def _merge_response_time_targets_payload(payload: dict) -> dict:
    merged = json.loads(json.dumps(DEFAULT_RESPONSE_TIME_TARGETS))
    for metric in ("call_processing", "turnout", "travel"):
        block = payload.get(metric)
        if not isinstance(block, dict):
            continue
        for key in ("national", "local"):
            if key not in block:
                continue
            try:
                val = float(block[key])
            except (TypeError, ValueError):
                continue
            if val >= 0:
                merged[metric][key] = val
    return merged


def _read_response_time_targets() -> dict:
    if not RESPONSE_TIME_TARGETS_PATH.exists():
        return json.loads(json.dumps(DEFAULT_RESPONSE_TIME_TARGETS))
    try:
        raw = json.loads(RESPONSE_TIME_TARGETS_PATH.read_text())
        return _merge_response_time_targets_payload(raw)
    except Exception:
        return json.loads(json.dumps(DEFAULT_RESPONSE_TIME_TARGETS))


def _write_response_time_targets(data: dict) -> None:
    RESPONSE_TIME_TARGETS_PATH.parent.mkdir(parents=True, exist_ok=True)
    RESPONSE_TIME_TARGETS_PATH.write_text(json.dumps(data, indent=2) + "\n")

UPLOAD_POLICY = DQPolicy(
    policy_id="dq_001", name="BASIC_POLICY", rules=[DQRule.NAN, DQRule.NON_NUMERIC]
)

UPLOAD_INGESTION_SERVICE = IngestionService(
    accepted_file_types=[".csv", ".xlsx"],
    max_col_count=100,
    max_row_count=100000,
    dq_policy=UPLOAD_POLICY,
)


@app.get("/")
async def root():
    return {"status": "healthy", "service": "FAMAR KPI Dashboard API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/incidents/kpi-data")
async def get_kpi_data(
    start_date: str = Query(...), end_date: str = Query(...), region: str = Query("all")
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        region_filter = ""
        if region == "south":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
        elif region == "north":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

        query = f"""
        SELECT 
            i.incident_id,
            i.basic_incident_psap_date_time AS timestamp,
            i.basic_incident_postal_code AS postal_code,
            i.basic_incident_type AS incident_type,
            ur.apparatus_resource_id AS unit_id,
            ur.apparatus_resource_dispatch_date_time AS dispatch_time,
            ur.apparatus_resource_arrival_date_time AS arrival_time,
            ur.apparatus_resource_clear_date_time AS clear_time
        FROM fire_ems.incident i
        LEFT JOIN fire_ems.unit_response ur ON i.incident_id = ur.incident_id
        WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
        {region_filter}
        ORDER BY i.incident_id
        """

        df = db.read_table(f"({query}) as subquery")
        db.disconnect()

        incidents_dict = {}
        for _, row in df.iterrows():
            incident_id = int(row["incident_id"])

            if incident_id not in incidents_dict:
                incidents_dict[incident_id] = {
                    "incident_id": incident_id,
                    "timestamp": row["timestamp"].isoformat()
                    if row["timestamp"]
                    else None,
                    "postal_code": str(row["postal_code"])
                    if row["postal_code"]
                    else None,
                    "incident_type": str(row["incident_type"])
                    if row["incident_type"]
                    else None,
                    "units": [],
                }

            if row["unit_id"]:
                unit = {
                    "unit_id": str(row["unit_id"]),
                    "dispatch_time": row["dispatch_time"].isoformat()
                    if row["dispatch_time"]
                    else None,
                    "arrival_time": row["arrival_time"].isoformat()
                    if row["arrival_time"]
                    else None,
                    "clear_time": row["clear_time"].isoformat()
                    if row["clear_time"]
                    else None,
                }
                incidents_dict[incident_id]["units"].append(unit)

        return {
            "incidents": list(incidents_dict.values()),
            "total_count": len(incidents_dict),
            "time_window": {"start": start_date, "end": end_date},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.post("/api/upload")
async def upload_csv(
    file: UploadFile = File(...), data_type: str = Query(..., pattern="^(fire|ems)$")
):
    is_fire = data_type == "fire"

    suffix = os.path.splitext(file.filename or "")[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        temp_path = tmp.name

    try:
        uploaded = UPLOAD_INGESTION_SERVICE.ingest_data(temp_path, is_fire=is_fire)

        db = RelationalDataStore(DATABASE_URL)
        db.connect()
        try:
            dataset = DataSet(
                id=file.filename or "uploaded",
                name=file.filename or "uploaded",
                data=uploaded.dataframe,
            )
            ok = db.write_data(dataset, is_fire=is_fire)
        finally:
            db.disconnect()

        if not ok:
            raise HTTPException(status_code=500, detail="Failed to write to database")

        return {
            "success": True,
            "message": f"Uploaded {file.filename}",
            "rows": int(uploaded.dataframe.shape[0]),
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            os.unlink(temp_path)
        except Exception:
            pass


@app.get("/api/incidents/summary")
async def get_kpi_summary(
    start_date: str = Query(...), end_date: str = Query(...), region: str = Query("all")
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        region_filter = ""
        if region == "south":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
        elif region == "north":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

        summary_query = f"""
        WITH response_times AS (
            SELECT 
                EXTRACT(EPOCH FROM (ur.apparatus_resource_arrival_date_time - ur.apparatus_resource_dispatch_date_time)) / 60.0 AS response_minutes
            FROM fire_ems.incident i
            JOIN fire_ems.unit_response ur ON i.incident_id = ur.incident_id
            WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
            {region_filter}
            AND ur.apparatus_resource_dispatch_date_time IS NOT NULL
            AND ur.apparatus_resource_arrival_date_time IS NOT NULL
        ),
        hourly_counts AS (
            SELECT 
                EXTRACT(HOUR FROM i.basic_incident_psap_date_time) AS hour,
                COUNT(*) AS count
            FROM fire_ems.incident i
            WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
            {region_filter}
            GROUP BY EXTRACT(HOUR FROM i.basic_incident_psap_date_time)
        )
        SELECT 
            (SELECT AVG(response_minutes) FROM response_times) AS avg_response_time,
            (SELECT COUNT(DISTINCT i.incident_id) FROM fire_ems.incident i 
             WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}' {region_filter}) AS total_incidents,
            (SELECT COUNT(DISTINCT ur.apparatus_resource_id) FROM fire_ems.incident i
             JOIN fire_ems.unit_response ur ON i.incident_id = ur.incident_id
             WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}' {region_filter}) AS active_units,
            (SELECT MAX(count) FROM hourly_counts) AS peak_count,
            (SELECT AVG(count) FROM hourly_counts) AS avg_count,
            (SELECT hour FROM hourly_counts ORDER BY count DESC LIMIT 1) AS peak_hour
        """

        df = db.read_table(f"({summary_query}) as subquery")
        db.disconnect()

        if df.empty:
            return {
                "avg_response_time_minutes": None,
                "total_incidents": 0,
                "active_units": 0,
                "peak_load_factor": None,
                "peak_hour": None,
                "time_window": {"start": start_date, "end": end_date},
            }

        row = df.iloc[0]
        peak_count = float(row["peak_count"]) if row["peak_count"] else 0
        avg_count = float(row["avg_count"]) if row["avg_count"] else 0

        return {
            "avg_response_time_minutes": float(row["avg_response_time"])
            if row["avg_response_time"]
            else None,
            "total_incidents": int(row["total_incidents"]),
            "active_units": int(row["active_units"]),
            "peak_load_factor": (peak_count / avg_count) if avg_count > 0 else None,
            "peak_hour": int(row["peak_hour"])
            if row["peak_hour"] is not None
            else None,
            "time_window": {"start": start_date, "end": end_date},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.get("/api/incidents/response-times")
async def get_response_times(
    start_date: str = Query(...), end_date: str = Query(...), region: str = Query("all")
):
    """
    Compute response-time KPIs (call processing, turnout, travel) for unit responses.
    Returns overall averages and 90th percentiles plus per-unit aggregates.
    """
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        region_filter = ""
        if region == "south":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
        elif region == "north":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

        base_cte = f"""
        WITH base AS (
            SELECT
                ur.apparatus_resource_id AS unit_id,
                EXTRACT(
                    EPOCH FROM (
                        ur.apparatus_resource_dispatch_date_time - i.basic_incident_psap_date_time
                    )
                ) / 60.0 AS call_processing_minutes,
                EXTRACT(
                    EPOCH FROM (
                        ur.apparatus_resource_en_route_date_time - ur.apparatus_resource_dispatch_date_time
                    )
                ) / 60.0 AS turnout_minutes,
                EXTRACT(
                    EPOCH FROM (
                        ur.apparatus_resource_arrival_date_time - ur.apparatus_resource_en_route_date_time
                    )
                ) / 60.0 AS travel_minutes
            FROM fire_ems.incident i
            JOIN fire_ems.unit_response ur ON i.incident_id = ur.incident_id
            JOIN fire_ems.scottsdale_units su ON su.unit_id = ur.apparatus_resource_id
            WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
            {region_filter}
            AND i.basic_incident_psap_date_time IS NOT NULL
            AND ur.apparatus_resource_id IS NOT NULL
            AND ur.apparatus_resource_dispatch_date_time IS NOT NULL
            AND ur.apparatus_resource_en_route_date_time IS NOT NULL
            AND ur.apparatus_resource_arrival_date_time IS NOT NULL
            AND ur.apparatus_resource_dispatch_date_time > i.basic_incident_psap_date_time
            AND ur.apparatus_resource_en_route_date_time > ur.apparatus_resource_dispatch_date_time
            AND ur.apparatus_resource_arrival_date_time > ur.apparatus_resource_en_route_date_time
            AND ur.apparatus_resource_dispatch_date_time - i.basic_incident_psap_date_time <= INTERVAL '24 hours'
            AND ur.apparatus_resource_en_route_date_time - ur.apparatus_resource_dispatch_date_time <= INTERVAL '24 hours'
            AND ur.apparatus_resource_arrival_date_time - ur.apparatus_resource_en_route_date_time <= INTERVAL '24 hours'
        )
        """

        overall_query = (
            base_cte
            + """
        SELECT
            AVG(call_processing_minutes) AS call_processing_avg,
            PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY call_processing_minutes) AS call_processing_p90,
            AVG(turnout_minutes) AS turnout_avg,
            PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY turnout_minutes) AS turnout_p90,
            AVG(travel_minutes) AS travel_avg,
            PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY travel_minutes) AS travel_p90
        FROM base
        """
        )

        per_unit_query = (
            base_cte
            + """
        SELECT
            unit_id,
            COUNT(*) AS calls,
            AVG(call_processing_minutes) AS call_processing_avg,
            PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY call_processing_minutes) AS call_processing_p90,
            AVG(turnout_minutes) AS turnout_avg,
            PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY turnout_minutes) AS turnout_p90,
            AVG(travel_minutes) AS travel_avg,
            PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY travel_minutes) AS travel_p90
        FROM base
        GROUP BY unit_id
        """
        )

        overall_df = db.read_table(f"({overall_query}) as subquery")
        per_unit_df = db.read_table(f"({per_unit_query}) as subquery")

        db.disconnect()

        overall = None
        if not overall_df.empty:
            row = overall_df.iloc[0]
            # If all aggregates are null, treat as no data
            if not (
                row["call_processing_avg"] is None
                and row["turnout_avg"] is None
                and row["travel_avg"] is None
            ):
                overall = {
                    "call_processing": {
                        "avg": float(row["call_processing_avg"])
                        if row["call_processing_avg"] is not None
                        else None,
                        "p90": float(row["call_processing_p90"])
                        if row["call_processing_p90"] is not None
                        else None,
                    },
                    "turnout": {
                        "avg": float(row["turnout_avg"])
                        if row["turnout_avg"] is not None
                        else None,
                        "p90": float(row["turnout_p90"])
                        if row["turnout_p90"] is not None
                        else None,
                    },
                    "travel": {
                        "avg": float(row["travel_avg"])
                        if row["travel_avg"] is not None
                        else None,
                        "p90": float(row["travel_p90"])
                        if row["travel_p90"] is not None
                        else None,
                    },
                }

        per_unit = []
        if not per_unit_df.empty:
            for _, row in per_unit_df.iterrows():
                per_unit.append(
                    {
                        "unit_id": str(row["unit_id"]),
                        "calls": int(row["calls"]),
                        "call_processing_avg": float(row["call_processing_avg"])
                        if row["call_processing_avg"] is not None
                        else None,
                        "call_processing_p90": float(row["call_processing_p90"])
                        if row["call_processing_p90"] is not None
                        else None,
                        "turnout_avg": float(row["turnout_avg"])
                        if row["turnout_avg"] is not None
                        else None,
                        "turnout_p90": float(row["turnout_p90"])
                        if row["turnout_p90"] is not None
                        else None,
                        "travel_avg": float(row["travel_avg"])
                        if row["travel_avg"] is not None
                        else None,
                        "travel_p90": float(row["travel_p90"])
                        if row["travel_p90"] is not None
                        else None,
                    }
                )

        return {
            "overall": overall,
            "per_unit": per_unit,
            "region": region,
            "time_window": {"start": start_date, "end": end_date},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.get("/api/admin/response-time-targets")
async def get_response_time_targets_admin():
    return _read_response_time_targets()


@app.put("/api/admin/response-time-targets")
async def put_response_time_targets_admin(payload: dict = Body(...)):
    merged = _merge_response_time_targets_payload(payload)
    _write_response_time_targets(merged)
    return merged


@app.get("/api/incidents/heatmap")
async def get_incident_heatmap(
    start_date: str = Query(...), end_date: str = Query(...), region: str = Query("all")
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        region_filter = ""
        if region == "south":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
        elif region == "north":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

        query = f"""
        SELECT
            CAST(EXTRACT(DOW FROM i.basic_incident_psap_date_time) AS INTEGER) AS day_index,
            CAST(EXTRACT(HOUR FROM i.basic_incident_psap_date_time) AS INTEGER) AS hour,
            COUNT(*) AS incident_count
        FROM fire_ems.incident i
        WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
        {region_filter}
        GROUP BY
            EXTRACT(DOW FROM i.basic_incident_psap_date_time),
            EXTRACT(HOUR FROM i.basic_incident_psap_date_time)
        ORDER BY day_index, hour
        """
        df = db.read_table(f"({query}) as subquery")
        db.disconnect()
        heatmap_data = []
        max_count = 0
        total = 0

        for _, row in df.iterrows():
            count = int(row["incident_count"])
            max_count = max(max_count, count)
            total += count
            heatmap_data.append(
                {
                    "day_index": int(row["day_index"]),
                    "hour": int(row["hour"]),
                    "count": count,
                }
            )

        return {
            "heatmap_data": heatmap_data,
            "total_incidents": total,
            "max_count": max_count,
            "region": region,
            "time_window": {"start": start_date, "end": end_date},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.get("/api/incidents/postal-breakdown")
async def get_postal_breakdown(
    start_date: str = Query(...), end_date: str = Query(...), region: str = Query("all")
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        region_filter = ""
        if region == "south":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
        elif region == "north":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

        query = f"""
        SELECT
            i.basic_incident_postal_code AS postal_code,
            COUNT(*) AS incident_count,
            AVG(
                EXTRACT(EPOCH FROM (uresp.apparatus_resource_arrival_date_time - uresp.apparatus_resource_dispatch_date_time)) / 60.0
            ) AS avg_response_minutes
        FROM fire_ems.incident i
        LEFT JOIN fire_ems.unit_response uresp ON i.incident_id = uresp.incident_id
            AND uresp.apparatus_resource_dispatch_date_time IS NOT NULL
            AND uresp.apparatus_resource_arrival_date_time IS NOT NULL
        WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
        {region_filter}
        AND i.basic_incident_postal_code IS NOT NULL
        GROUP BY i.basic_incident_postal_code
        ORDER BY incident_count DESC
        """
        df = db.read_table(f"({query}) as subquery")
        db.disconnect()

        postal_data = []
        for _, row in df.iterrows():
            postal_data.append(
                {
                    "zip": str(row["postal_code"]),
                    "count": int(row["incident_count"]),
                    "avg_response_minutes": round(float(row["avg_response_minutes"]), 1)
                    if row["avg_response_minutes"] is not None
                    else None,
                }
            )

        return {
            "postal_data": postal_data,
            "total_postal_codes": len(postal_data),
            "region": region,
            "time_window": {"start": start_date, "end": end_date},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.get("/api/incidents/call-volume")
async def get_call_volume(
    start_date: str = Query(...),
    end_date: str = Query(...),
    region: str = Query("all"),
    granularity: str = Query("daily", pattern="^(daily|weekly|monthly)$"),
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")

    trunc = {"daily": "day", "weekly": "week", "monthly": "month"}[granularity]

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        region_filter = ""
        if region == "south":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
        elif region == "north":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

        query = f"""
        SELECT
            DATE_TRUNC('{trunc}', i.basic_incident_psap_date_time) AS period,
            COUNT(*) AS incident_count
        FROM fire_ems.incident i
        WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
        {region_filter}
        GROUP BY DATE_TRUNC('{trunc}', i.basic_incident_psap_date_time)
        ORDER BY period
        """
        df = db.read_table(f"({query}) as subquery")
        db.disconnect()
        trend_data = []
        total = 0

        for _, row in df.iterrows():
            count = int(row["incident_count"])
            total += count
            trend_data.append(
                {
                    "date": row["period"].isoformat() if row["period"] else None,
                    "count": count,
                }
            )

        return {
            "trend_data": trend_data,
            "total_incidents": total,
            "granularity": granularity,
            "region": region,
            "time_window": {"start": start_date, "end": end_date},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.get("/api/incidents/unit-origin")
async def get_unit_origin(
    start_date: str = Query(...), end_date: str = Query(...), region: str = Query("all")
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        region_filter = ""
        if region == "south":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
        elif region == "north":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

        query = f"""
        SELECT
            ur.apparatus_resource_id AS unit_id,
            ur.apparatus_resource_dispatch_date_time AS dispatch_time,
            ur.apparatus_resource_clear_date_time AS clear_time
        FROM fire_ems.incident i
        JOIN fire_ems.unit_response ur ON i.incident_id = ur.incident_id
        WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
        {region_filter}
        AND ur.apparatus_resource_id IS NOT NULL
        """

        df = db.read_table(f"({query}) as subquery")

        breakdown = UnitOriginHelper.get_unit_origin_breakdown(df, db)

        time_period_hours = (end_dt - start_dt).total_seconds() / 3600
        uhu_by_origin = UnitOriginHelper.compute_uhu_by_origin(df, time_period_hours)

        db.disconnect()

        return {
            "units": breakdown,
            "scottsdale_uhu": uhu_by_origin["scottsdale_uhu"],
            "non_scottsdale_uhu": uhu_by_origin["non_scottsdale_uhu"],
            "region": region,
            "time_window": {"start": start_date, "end": end_date},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.get("/api/incidents/type-breakdown")
async def get_type_breakdown(
    start_date: str = Query(...),
    end_date: str = Query(...),
    region: str = Query("all"),
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        region_filter = ""
        if region == "south":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
        elif region == "north":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

        query = f"""
        WITH type_counts AS (
            SELECT
                COALESCE(i.basic_incident_type, 'Unknown') AS incident_type,
                COUNT(*) AS incident_count
            FROM fire_ems.incident i
            WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
            {region_filter}
            GROUP BY COALESCE(i.basic_incident_type, 'Unknown')
        ),
        total AS (
            SELECT SUM(incident_count) AS total_count FROM type_counts
        )
        SELECT
            tc.incident_type,
            tc.incident_count,
            ROUND((tc.incident_count * 100.0 / t.total_count)::numeric, 1) AS percentage
        FROM type_counts tc, total t
        ORDER BY tc.incident_count DESC
        LIMIT 8
        """
        df = db.read_table(f"({query}) as subquery")
        db.disconnect()

        types = []
        total_displayed = 0
        for _, row in df.iterrows():
            count = int(row["incident_count"])
            total_displayed += count
            types.append(
                {
                    "type": str(row["incident_type"]),
                    "count": count,
                    "percentage": float(row["percentage"]),
                }
            )

        return {
            "types": types,
            "total_displayed": total_displayed,
            "region": region,
            "time_window": {"start": start_date, "end": end_date},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.get("/api/incidents/mutual-aid")
async def get_mutual_aid(
    start_date: str = Query(...),
    end_date: str = Query(...),
    region: str = Query("all"),
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date: {str(e)}")

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        region_filter = ""
        if region == "south":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
        elif region == "north":
            region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

        query = f"""
        SELECT
            i.basic_incident_postal_code AS postal_code,
            ur.apparatus_resource_id AS unit_id
        FROM fire_ems.incident i
        JOIN fire_ems.unit_response ur ON i.incident_id = ur.incident_id
        WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
        {region_filter}
        AND ur.apparatus_resource_id IS NOT NULL
        """
        df = db.read_table(f"({query}) as subquery")

        mutual_aid = UnitOriginHelper.compute_mutual_aid(df, db)

        db.disconnect()

        return {
            **mutual_aid,
            "region": region,
            "time_window": {"start": start_date, "end": end_date},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


# Chatbot models - adding these for the new chat feature
class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    context: dict = Field(default_factory=dict)


class ChatResponse(BaseModel):
    answer: str


@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat_endpoint(request: Request, chat_request: ChatRequest):
    """
    Chatbot endpoint for asking questions about KPI data.
    Fetches KPI summary based on date/region context to provide to the AI.
    Rate limited to 10 requests per minute per IP.
    """
    # Get context from request, use defaults if not provided
    region = chat_request.context.get('region', 'all')
    start_date = chat_request.context.get('start_date')
    end_date = chat_request.context.get('end_date')

    # Default to last 7 days if dates missing
    if not start_date or not end_date:
        end_dt = datetime.now()
        start_dt = datetime.fromtimestamp(end_dt.timestamp() - 7 * 24 * 60 * 60)
        start_date = start_dt.isoformat()
        end_date = end_dt.isoformat()

    try:
        # Parse dates
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")

    # Build region filter like other endpoints do
    region_filter = ""
    if region == "south":
        region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) < 85260"
    elif region == "north":
        region_filter = "AND CAST(i.basic_incident_postal_code AS INTEGER) >= 85260"

    try:
        db = RelationalDataStore(DATABASE_URL)
        db.connect()

        # Query for summary stats - copied from the summary endpoint logic
        summary_query = f"""
        WITH response_times AS (
            SELECT
                EXTRACT(EPOCH FROM (ur.apparatus_resource_arrival_date_time - ur.apparatus_resource_dispatch_date_time)) / 60.0 AS response_minutes
            FROM fire_ems.incident i
            JOIN fire_ems.unit_response ur ON i.incident_id = ur.incident_id
            WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
            {region_filter}
            AND ur.apparatus_resource_dispatch_date_time IS NOT NULL
            AND ur.apparatus_resource_arrival_date_time IS NOT NULL
        ),
        hourly_counts AS (
            SELECT
                EXTRACT(HOUR FROM i.basic_incident_psap_date_time) AS hour,
                COUNT(*) AS count
            FROM fire_ems.incident i
            WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}'
            {region_filter}
            GROUP BY EXTRACT(HOUR FROM i.basic_incident_psap_date_time)
        )
        SELECT
            (SELECT AVG(response_minutes) FROM response_times) AS avg_response_time,
            (SELECT COUNT(DISTINCT i.incident_id) FROM fire_ems.incident i
             WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}' {region_filter}) AS total_incidents,
            (SELECT COUNT(DISTINCT ur.apparatus_resource_id) FROM fire_ems.incident i
             JOIN fire_ems.unit_response ur ON i.incident_id = ur.incident_id
             WHERE i.basic_incident_psap_date_time BETWEEN '{start_dt.isoformat()}' AND '{end_dt.isoformat()}' {region_filter}) AS active_units,
            (SELECT MAX(count) FROM hourly_counts) AS peak_count,
            (SELECT AVG(count) FROM hourly_counts) AS avg_count,
            (SELECT hour FROM hourly_counts ORDER BY count DESC LIMIT 1) AS peak_hour
        """

        df = db.read_table(f"({summary_query}) as subquery")
        db.disconnect()

        # Build the data summary
        if df.empty:
            data_summary = {
                "total_incidents": 0,
                "avg_response_time": None,
                "active_units": 0,
                "peak_hour": None
            }
        else:
            row = df.iloc[0]
            data_summary = {
                "total_incidents": int(row["total_incidents"]) if row["total_incidents"] else 0,
                "avg_response_time": float(row["avg_response_time"]) if row["avg_response_time"] else None,
                "active_units": int(row["active_units"]) if row["active_units"] else 0,
                "peak_hour": int(row["peak_hour"]) if row["peak_hour"] is not None else None
            }

        # Build the system prompt for OpenAI
        avg_text = f"{data_summary['avg_response_time']:.1f} minutes" if data_summary['avg_response_time'] else "not available"
        peak_text = f"hour {data_summary['peak_hour']}" if data_summary['peak_hour'] is not None else "not available"

        system_prompt = f"""You are Fammy, a helpful assistant for the FAMAR Fire/EMS KPI Dashboard.
Answer questions about the current dashboard data based on the context provided.

Current Dashboard Context:
- Date range: {start_date[:10]} to {end_date[:10]}
- Region: {region}
- Total incidents: {data_summary['total_incidents']}
- Average response time: {avg_text}
- Active units: {data_summary['active_units']}
- Peak activity: {peak_text}

Keep responses short (2-3 sentences). Be helpful and direct.
If asked about something not in the data, say you don't have that information."""

        # Check if we have an API key
        if not OPENAI_API_KEY:
            # Fallback response without AI - useful for testing
            return ChatResponse(
                answer=f"There were {data_summary['total_incidents']} incidents with an average response time of {avg_text}. Peak activity was at {peak_text}. (AI responses disabled - no API key)"
            )

        try:
            # Call OpenAI
            client = OpenAI(api_key=OPENAI_API_KEY)
            response = client.chat.completions.create(
                model=CHATBOT_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": chat_request.question}
                ],
                temperature=0.7,
                max_tokens=150
            )

            ai_answer = response.choices[0].message.content
            return ChatResponse(answer=ai_answer)

        except Exception as ai_error:
            # If AI fails, return data summary as fallback
            return ChatResponse(
                answer=f"Based on the data: {data_summary['total_incidents']} incidents, avg response {avg_text}. (AI service temporarily unavailable)"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
