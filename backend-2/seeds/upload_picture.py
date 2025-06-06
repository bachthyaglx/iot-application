import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.supabase import supabase
import base64
import asyncio

async def upload_picture():
  filename = "device-2.jpg"
  file_path = os.path.join("static", filename)

  if not os.path.exists(file_path):
    print(f"❌ File '{file_path}' not found.")
    return

  with open(file_path, "rb") as f:
    data = f.read()

  user = supabase.table("users").select("*").eq("username", "admin").execute().data[0]

  exists = supabase.table("pictures").select("*").eq("filename", filename).execute()
  if exists.data:
    print("✅ Picture already exists.")
    return

  supabase.table("pictures").insert({
    "filename": filename,
    "ontentType": "image/jpeg",
    "data": base64.b64encode(data).decode("utf-8"),
    "user": user["id"]
  }).execute()

  print("✅ Picture seeded.")

if __name__ == "__main__":
  asyncio.run(upload_picture())
