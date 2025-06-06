from fastapi import APIRouter, HTTPException
from models.schemas import UserLogin
from utils.jwt_auth import create_token
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/login", tags=["Authentication"])
async def login(user: UserLogin):
  if user.username == "admin" and user.password == "password":
    expires = datetime.utcnow() + timedelta(hours=1)
    token = create_token({"username": user.username, "exp": expires})
    return {
      "token": token,
      "token_type": "bearer",
      "expires_at": expires.isoformat()
    }
  raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/logout", tags=["Authentication"])
async def logout():
  return {"message": "Logged out"}
