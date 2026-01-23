from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
from backend.db_ops.relational_data_store import RelationalDataStore

app = FastAPI(title="FAMAR KPI Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://michael@localhost/famar_db')

@app.get("/")
async def root():
    return {"status": "healthy", "service": "FAMAR KPI Dashboard API"}

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
