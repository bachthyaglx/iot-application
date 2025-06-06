from redis.asyncio import Redis
from decouple import config

_redis: Redis | None = None  # internal cache

async def init_redis() -> Redis:
    global _redis
    if _redis is None:
        _redis = Redis.from_url(config("REDIS_URL"), decode_responses=True)
        try:
            await _redis.ping()
            print("✅ Redis initialized")
        except Exception as e:
            print("❌ Redis connection failed:", e)
            raise
    return _redis

def get_redis() -> Redis:
    if _redis is None:
        raise RuntimeError("Redis has not been initialized yet.")
    return _redis
