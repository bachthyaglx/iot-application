from fastapi import Request
import json

DEFAULT_TTL = 60 * 60 * 24  # 1 day

async def get_cache(key: str, request: Request):
  redis = request.app.state.redis
  raw = await redis.get(key)
  return json.loads(raw) if raw else None

async def set_cache(key: str, value: dict, request: Request, ttl: int = DEFAULT_TTL):
  redis = request.app.state.redis
  await redis.setex(key, ttl, json.dumps(value))  # ⏰ TTL added here

async def del_cache(key: str, request: Request):
  redis = request.app.state.redis
  await redis.delete(key)
