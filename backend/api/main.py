from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import tempfile
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
from backend.db_ops.relational_data_store import RelationalDataStore
from backend.ingestion.ingestion_service import IngestionService
from backend.ingestion.data_classes import DQPolicy, DQRule, DataSet

app = FastAPI(title="FAMAR KPI Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://michael@localhost/famar_db')

UPLOAD_POLICY = DQPolicy(
    policy_id="dq_001",
    name="BASIC_POLICY",
    rules=[DQRule.NAN, DQRule.NON_NUMERIC]
)

UPLOAD_INGESTION_SERVICE = IngestionService(
    accepted_file_types=['.csv', '.xlsx'],
    max_col_count=100,
    max_row_count=100000,
    dq_policy=UPLOAD_POLICY
)

@app.get("/")
async def root():
    return {"status": "healthy", "service": "FAMAR KPI Dashboard API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/incidents/kpi-data")
async def get_kpi_data(
    start_date: str = Query(...),
    end_date: str = Query(...),
    region: str = Query("all")
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
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
            ur.apparatus_resource_arrival_date_time AS arrival_time
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
            incident_id = int(row['incident_id'])
            
            if incident_id not in incidents_dict:
                incidents_dict[incident_id] = {
                    'incident_id': incident_id,
                    'timestamp': row['timestamp'].isoformat() if row['timestamp'] else None,
                    'postal_code': str(row['postal_code']) if row['postal_code'] else None,
                    'incident_type': str(row['incident_type']) if row['incident_type'] else None,
                    'units': []
                }
            
            if row['unit_id']:
                unit = {
                    'unit_id': str(row['unit_id']),
                    'dispatch_time': row['dispatch_time'].isoformat() if row['dispatch_time'] else None,
                    'arrival_time': row['arrival_time'].isoformat() if row['arrival_time'] else None,
                }
                incidents_dict[incident_id]['units'].append(unit)
        
        return {
            'incidents': list(incidents_dict.values()),
            'total_count': len(incidents_dict),
            'time_window': {'start': start_date, 'end': end_date}
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")

@app.post("/api/upload")
async def upload_csv(
    file: UploadFile = File(...),
    data_type: str = Query(..., pattern="^(fire|ems)$")
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
            dataset = DataSet(id=file.filename or "uploaded", name=file.filename or "uploaded", data=uploaded.dataframe)
            ok = db.write_data(dataset, is_fire=is_fire)
        finally:
            db.disconnect()

        if not ok:
            raise HTTPException(status_code=500, detail="Failed to write to database")

        return {
            "success": True,
            "message": f"Uploaded {file.filename}",
            "rows": int(uploaded.dataframe.shape[0])
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
    start_date: str = Query(...),
    end_date: str = Query(...),
    region: str = Query("all")
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
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
                'avg_response_time_minutes': None,
                'total_incidents': 0,
                'active_units': 0,
                'peak_load_factor': None,
                'peak_hour': None,
                'time_window': {'start': start_date, 'end': end_date}
            }
        
        row = df.iloc[0]
        peak_count = float(row['peak_count']) if row['peak_count'] else 0
        avg_count = float(row['avg_count']) if row['avg_count'] else 0
        
        return {
            'avg_response_time_minutes': float(row['avg_response_time']) if row['avg_response_time'] else None,
            'total_incidents': int(row['total_incidents']),
            'active_units': int(row['active_units']),
            'peak_load_factor': (peak_count / avg_count) if avg_count > 0 else None,
            'peak_hour': int(row['peak_hour']) if row['peak_hour'] is not None else None,
            'time_window': {'start': start_date, 'end': end_date}
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.get("/api/incidents/heatmap")
async def get_incident_heatmap(
    start_date: str = Query(...),
    end_date: str = Query(...),
    region: str = Query("all")
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
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
            count = int(row['incident_count'])
            max_count = max(max_count, count)
            total += count
            heatmap_data.append({
                'day_index': int(row['day_index']),
                'hour': int(row['hour']),
                'count': count
            })

        return {
            'heatmap_data': heatmap_data,
            'total_incidents': total,
            'max_count': max_count,
            'region': region,
            'time_window': {'start': start_date, 'end': end_date}
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@app.get("/api/incidents/call-volume")
async def get_call_volume(
    start_date: str = Query(...),
    end_date: str = Query(...),
    region: str = Query("all"),
    granularity: str = Query("daily", pattern="^(daily|weekly|monthly)$")
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
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
            count = int(row['incident_count'])
            total += count
            trend_data.append({
                'date': row['period'].isoformat() if row['period'] else None,
                'count': count
            })

        return {
            'trend_data': trend_data,
            'total_incidents': total,
            'granularity': granularity,
            'region': region,
            'time_window': {'start': start_date, 'end': end_date}
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")
