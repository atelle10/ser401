from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt  # PyJWT standard import (from your pip install pyjwt[crypto])
from datetime import datetime, timedelta

app = FastAPI(title="Scottdale SSO API Stub - T1 (Sprint 3)")

# CORS for React localhost:3000 (from Task #385 placeholders)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "your-super-secret-key-change-in-prod-env"  # .env for HIPAA (Task 2 pg15)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class TokenRequest(BaseModel):
    code: str
    redirect_uri: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@app.post("/auth/token", response_model=TokenResponse)
async def auth_token(request: TokenRequest):
    # Mock Microsoft Graph exchange (real msal in T2)
    if request.code != "mockcode":
        raise HTTPException(status_code=400, detail="Invalid OAuth code")
    
    # JWT payload with US #315 roles/MFA (ties to SSO precondition in #385/#386/UC-01)
    payload = {
        "sub": "fire-dept-user-123",
        "role": "analyst",  # Change to "admin" or "viewer" for tests
        "mfa_enabled": True,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return TokenResponse(access_token=access_token)

@app.get("/")
def root():
    return {"msg": "FastAPI SSO Stub Ready – Visit /docs for Swagger UI"}

# Run: uvicorn main:app --reload --port 8000
