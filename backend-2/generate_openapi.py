# generate_openapi.py
import json
import yaml
from fastapi.openapi.utils import get_openapi
from fastapi import FastAPI
from pathlib import Path

def export_openapi_schema(app: FastAPI):
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    output_dir = Path("./open-api")
    output_dir.mkdir(exist_ok=True)

    # Export JSON
    with open(output_dir / "swagger.json", "w", encoding="utf-8") as f:
        json.dump(schema, f, indent=2)

    # Export YAML
    with open(output_dir / "swagger.yaml", "w", encoding="utf-8") as f:
        yaml.dump(schema, f, sort_keys=False)

    print("✅ Exported OpenAPI to ./open-api/swagger.json & swagger.yaml")
