from fastapi import APIRouter, Request
from utils.jwt_auth import get_current_user
from datetime import datetime

router = APIRouter()

@router.get("/", tags=["Root"])
async def get_root(request: Request):
    user = await get_current_user(request, strict=False)  # ✅ Optional auth
    is_authenticated = user is not None

    protocol = request.url.scheme
    hostname = request.client.host or "localhost"
    base_url = f"{protocol}://{hostname}"
    build_date = datetime.utcnow().isoformat()

    links = (
        [
            {"href": "/information", "rel": "information", "method": "GET"},
            {"href": "/picture", "rel": "picture", "method": "GET"},
            {"href": "/data", "rel": "data", "method": "GET"},
            {"href": "/logout", "rel": "logout", "method": "POST"},
        ]
        if is_authenticated
        else [
            {"href": "/identification", "rel": "identification", "method": "GET"},
            {"href": "/picture", "rel": "picture", "method": "GET"},
            {"href": "/login", "rel": "login", "method": "POST"},
        ]
    )

    return {
        "context": "https://www.w3.org/2022/wot/td/v1.1",
        "id": base_url,
        "title": "Sensor",
        "version": {
            "instance": "1.0.0",
            "model": "58841"
        },
        "created": build_date,
        "base": base_url,
        "security": "basic_sc",
        "links": links,
    }
