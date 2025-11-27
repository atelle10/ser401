from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenRequest(BaseModel):
    code: str
    redirect_uri: str

@app.post("/auth/token")
async def token_exchange(request: TokenRequest):
    valid_codes = {"admincode": "admin", "viewercode": "viewer", "mockcode": "analyst"}
    
    if request.code not in valid_codes:
        raise HTTPException(status_code=401, detail="Invalid access code")
    
    payload = {
        "role": valid_codes[request.code],
        "exp": 9999999999
    }
    token = jwt.encode(payload, "super-secret-key", algorithm="HS256")
    return {"access_token": token}

@app.get("/incidents")
async def get_incidents():
    return {"incidents": []}
