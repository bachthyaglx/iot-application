import os, asyncio, json
import redis.asyncio as redis
from fastapi import FastAPI
from socketio import AsyncServer, ASGIApp, AsyncRedisManager
from data_simulator.types import sensorTypes
from data_simulator.cache import latest_data
from dotenv import load_dotenv

load_dotenv()
REDIS_URL = os.getenv("REDIS_URL")

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)
mgr = AsyncRedisManager(REDIS_URL)

sio = AsyncServer(client_manager=mgr, async_mode="asgi", cors_allowed_origins="*")
app = FastAPI()
socket_app = ASGIApp(sio, other_asgi_app=app)

@sio.event
async def connect(sid, environ):
    print("🔌 Client connected:", sid)

@sio.event
async def subscribe(sid, data):
    sensor_type = data.get("type")
    room = f"sensor:{sensor_type}"
    await sio.enter_room(sid, room)
    print(f"📡 Client {sid} subscribed to {room}")

@sio.event
async def get_latest(sid, data):
    sensor_type = data.get("type")
    latest = latest_data.get(sensor_type)
    if latest:
        await sio.emit(f"latest-{sensor_type}", latest, to=sid)

async def redis_listener():
    pubsub = r.pubsub()
    await pubsub.psubscribe("sensor:*")

    async for msg in pubsub.listen():
        if msg["type"] != "pmessage":
            continue
        channel = msg["channel"]
        sensor_type = channel.split(":")[1]
        payload = json.loads(msg["data"])
        latest_data[sensor_type] = payload
        await r.set(f"latest:{sensor_type}", json.dumps(payload))
        await sio.emit(f"{sensor_type}:update", payload, room=f"sensor:{sensor_type}")

@app.on_event("startup")
async def startup():
    asyncio.create_task(redis_listener())
