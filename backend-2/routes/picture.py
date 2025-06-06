from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from utils.cache import get_cache, set_cache
from services.supabase import supabase
from utils.jwt_auth import get_current_user
import base64
import io

router = APIRouter()
CACHE_KEY = "pictureMeta"

async def fetch_first_picture():
    result = supabase.table("pictures").select("*").limit(1).execute()
    if not result.data or not isinstance(result.data, list):
        raise HTTPException(status_code=404, detail="No image found in database")
    return result.data[0]

def decode_image(base64_str: str) -> bytes:
    try:
        return base64.b64decode(base64_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Invalid base64 image data")

def stream_image(data: bytes, content_type: str):
    return StreamingResponse(io.BytesIO(data), media_type=content_type)

async def get_picture_from_cache_or_db(request: Request):
    cached = await get_cache(CACHE_KEY, request)
    if cached:
        data = decode_image(cached["data"])
        return stream_image(data, cached["contentType"])

    picture = await fetch_first_picture()
    await set_cache(CACHE_KEY, picture, request)
    data = decode_image(picture["data"])
    return stream_image(data, picture["contentType"])

@router.get("/picture", tags=["Picture"])
async def get_picture(request: Request):
    return await get_picture_from_cache_or_db(request)

@router.put("/picture", tags=["Picture"])
async def update_picture(request: Request, user=Depends(get_current_user)):
    picture = await fetch_first_picture()
    await set_cache(CACHE_KEY, picture, request)
    data = decode_image(picture["data"])
    return stream_image(data, picture["contentType"])
