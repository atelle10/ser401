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
