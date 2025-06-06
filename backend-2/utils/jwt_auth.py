import jwt
from decouple import config
from datetime import datetime, timedelta
from fastapi import Request, HTTPException, status
from typing import Optional

SECRET_KEY = config("SECRET")
ALGORITHM = "HS256"

def create_token(data: dict, expires_delta: int = 3600):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(seconds=expires_delta)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(request: Request, strict: bool = True) -> Optional[dict]:
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        if strict:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid Authorization header"
            )
        return None

    token = auth_header[len("Bearer "):]
    try:
        return decode_token(token)
    except Exception:
        if strict:
            raise
        return None

