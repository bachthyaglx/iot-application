from fastapi import APIRouter, Request, Depends, HTTPException
from models.schemas import DeviceInfo
from services.supabase import supabase
from utils.cache import get_cache, set_cache
from utils.jwt_auth import get_current_user

router = APIRouter()
CACHE_KEY = "deviceInfo"
EXCLUDED_KEYS = {"id", "user", "created_at"}

def filter_fields(data: dict) -> dict:
    return {k: v for k, v in data.items() if k not in EXCLUDED_KEYS}

async def get_first_device():
    result = supabase.table("device_info").select("*").limit(1).execute()
    return result.data[0] if result.data and isinstance(result.data, list) else None

@router.get("/information", tags=["Information"])
async def get_information(request: Request):
    cached = await get_cache(CACHE_KEY, request)
    if cached:
        return filter_fields(cached)

    device = await get_first_device()
    if not device:
        raise HTTPException(status_code=404, detail="No device info found")

    await set_cache(CACHE_KEY, device, request)
    return filter_fields(device)

@router.put("/information", tags=["Information"])
async def update_device_information(
    data: DeviceInfo,
    request: Request,
    user=Depends(get_current_user)
):
    device = await get_first_device()
    if not device:
        raise HTTPException(status_code=404, detail="No device info found")

    updates = {k: v for k, v in data.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields provided")

    update_response = supabase.table("device_info").update(updates).eq("id", device["id"]).execute()
    updated = update_response.data[0] if update_response.data else {}

    await set_cache(CACHE_KEY, updated, request)
    return {"refreshed": True, "data": filter_fields(updated)}
