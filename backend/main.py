from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt

app = FastAPI()

# Allow the React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenRequest(BaseModel):
    code: str
    redirect_uri: str

@app.post("/auth/token")
async def token_exchange(request: TokenRequest):
    # Simple mock role selector based on the code
    if request.code == "admincode":
        role = "admin"
    elif request.code == "viewercode":
        role = "viewer"
    else:
        # Default (including our original "mockcode")
        role = "analyst"

    # Build the JWT payload
    payload = {
        "user_id": f"{role}@scottdalefire.gov",
        "role": role,
        "mfa_enabled": False,          # Change to True later to test MFA warning
        "exp": 9999999999              # Never expires (for testing only)
    }

    # Encode the token (same secret your frontend expects)
    token = jwt.encode(payload, "super-secret-key", algorithm="HS256")

    return {"access_token": token}
