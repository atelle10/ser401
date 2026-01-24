from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
from backend.ingestion.ingestion_service import IngestionService
from backend.ingestion.data_classes import DQPolicy, DQRule, DataSet
from backend.db_ops.relational_data_store import RelationalDataStore

policy = DQPolicy(
    policy_id="dq_001",
    name="BASIC_POLICY",
    rules=[DQRule.NAN, DQRule.NON_NUMERIC]
)

INGESTION_SERVICE = IngestionService(
    accepted_file_types=['.csv', '.xlsx'],
    max_col_count=100,
    max_row_count=100000,
    dq_policy=policy
)
DB_URL = os.getenv("DATABASE_URL", "postgresql://michael@localhost:5432/famar_db")
DATA_STORE = RelationalDataStore(DB_URL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    DATA_STORE.connect()
    yield
    DATA_STORE.disconnect()


app = FastAPI(title="FAMAAR backend api service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/api/upload")
async def upload_csv(
    file: UploadFile = File(...),
    data_type: str = Query(..., pattern="^(fire|ems)$")
):
    is_fire = data_type == "fire"

    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    try:
        uploaded = INGESTION_SERVICE.ingest_data(temp_path, is_fire)
        dataset = DataSet(id=file.filename, name=file.filename, data=uploaded.dataframe) # This writes to the db
        if not DATA_STORE.write_data(dataset, is_fire):
            raise HTTPException(status_code=500, detail="Failed to write to database")

        return {
            "success": True,
            "message": f"Uploaded {file.filename}",
            "rows": len(uploaded.dataframe)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        os.unlink(temp_path)
