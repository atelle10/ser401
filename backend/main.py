from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt
import httpx
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REAL APP REGISTRATION
TENANT_ID = "41f88ecb-ca63-404d-97dd-ab0a169fd138"
CLIENT_ID = "a972773a-46e3-47dd-aea6-80fb76f1f6a6"
JWKS_URL = f"https://login.microsoftonline.com/{TENANT_ID}/discovery/v2.0/keys"

async def get_jwks():
    async with httpx.AsyncClient() as client:
        resp = await client.get(JWKS_URL)
        resp.raise_for_status()
        return resp.json()

class TokenExchange(BaseModel):
    token: str

@app.post("/auth/exchange")
async def exchange_microsoft_token(req: TokenExchange):
    try:
        jwks = await get_jwks()
        header = jwt.get_unverified_header(req.token)
        rsa_key = next(k for k in jwks["keys"] if k["kid"] == header["kid"])
        payload = jwt.decode(
            req.token,
            rsa_key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            issuer=f"https://login.microsoftonline.com/{TENANT_ID}/v2.0",
        )
    except Exception as e:
        print("Token validation failed:", e)
        raise HTTPException(status_code=401, detail="Invalid Microsoft token")

    roles_claim = payload.get("roles", [])
    role = "viewer"
    if isinstance(roles_claim, list):
        if any(r == "admin" for r in roles_claim if isinstance(r, str)):
            role = "admin"
        elif any(r == "analyst" for r in roles_claim if isinstance(r, str)):
            role = "analyst"
        elif any(r == "viewer" for r in roles_claim if isinstance(r, str)):
            role = "viewer"

    print(f"User {payload.get('name')}: Microsoft roles {roles_claim} → Assigned role: {role}")

    our_payload = {
        "role": role,
        "sub": payload.get("oid") or payload.get("sub"),
        "name": payload.get("name", "User"),
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    our_token = jwt.encode(our_payload, "super-secret-key", algorithm="HS256")
    return {"access_token": our_token}

# Email/password login (mock for dev — replace with DB later)
class EmailLogin(BaseModel):
    email: str
    password: str

MOCK_USERS = {
    "admin@example.com": {"password": "admin123", "role": "admin"},
    "analyst@example.com": {"password": "analyst123", "role": "analyst"},
    "viewer@example.com": {"password": "viewer123", "role": "viewer"},
}

@app.post("/auth/email")
async def email_login(req: EmailLogin):
    user = MOCK_USERS.get(req.email)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    our_payload = {
        "role": user["role"],
        "sub": req.email,
        "name": req.email.split("@")[0],
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    our_token = jwt.encode(our_payload, "super-secret-key", algorithm="HS256")
    return {"access_token": our_token}

@app.get("/api/test")
async def test():
    return {"message": "Backend ready with dual login!"}