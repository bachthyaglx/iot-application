from fastapi import FastAPI
from fastapi.routing import APIRouter
from contextlib import asynccontextmanager
from services.redis import init_redis
from routes import auth, data, information, picture, root
from generate_openapi import export_openapi_schema
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Redis init
    app.state.redis = await init_redis()
    print("✅ Redis initialized")

    # Export OpenAPI schema
    export_openapi_schema(app)

    yield
    # (Optional: cleanup)

    # Shutdown logic (if needed)
    # await app.state.redis.close()

app = FastAPI(
    lifespan=lifespan,
    docs_url="/api-docs",             # 🚀 Swagger UI here
    redoc_url=None,                   # Optional: disable ReDoc
    openapi_url="/openapi.json",      # URL for OpenAPI schema
    openapi_tags=[
        {"name": "Root", "description": "Root API for service metadata"},
        {"name": "Authentication", "description": "Login and logout endpoints"},
        {"name": "Information", "description": "Device information APIs"},
        {"name": "Picture", "description": "Image upload/view API"},
        {"name": "Sensor", "description": "General data APIs"},
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register /api routes
api_router = APIRouter(prefix="/api")
api_router.include_router(root.router)
api_router.include_router(auth.router)
api_router.include_router(data.router)
api_router.include_router(information.router)
api_router.include_router(picture.router)
app.include_router(api_router)
