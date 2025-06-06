import asyncio, json, random, time, os
import redis.asyncio as redis
from dotenv import load_dotenv
from data_simulator.types import sensorTypes

# Load environment variables
load_dotenv()
REDIS_URL = os.getenv("REDIS_URL")

# Redis client
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

async def publish_loop():
    while True:
        for sensor in sensorTypes:
            msg = {
                "value": round(random.uniform(10, 100), 1),
                "timestamp": time.time()
            }
            await r.publish(f"sensor:{sensor}", json.dumps(msg))
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(publish_loop())
