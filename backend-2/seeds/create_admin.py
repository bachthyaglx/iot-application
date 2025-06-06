import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.supabase import supabase
import bcrypt
import asyncio

async def create_admin():
  result = supabase.table("users").select("*").eq("username", "admin").execute()
  if result.data:
    print("✅ Admin already exists.")
    return

  password = "password"
  hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

  supabase.table("users").insert({
    "username": "admin",
    "passwordhash": hashed 
  }).execute()

  print("✅ Admin user created.")

if __name__ == "__main__":
  asyncio.run(create_admin())
