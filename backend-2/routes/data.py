import os
import json
import redis.asyncio as redis
from fastapi import APIRouter, Request, Depends, HTTPException
from data_simulator.cache import latest_data
from utils.jwt_auth import get_current_user
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
REDIS_URL = os.getenv("REDIS_URL")

# Redis client
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

router = APIRouter()

@router.get("/data", tags=["Sensor"])
async def get_latest_data(request: Request, user=Depends(get_current_user)):
    result = {}
    for sensor in ["temperature", "voltage", "humidity"]:
        data = latest_data.get(sensor)
        if not data:
            raw = await r.get(f"latest:{sensor}")
            data = json.loads(raw) if raw else None
        result[sensor] = data
    return result
