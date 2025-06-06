import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.supabase import supabase

async def create_deviceinfo():
  existing = supabase.table("device_info").select("*").limit(1).execute()
  if existing.data:
    print("✅ Device already exists.")
    return

  user = supabase.table("users").select("*").eq("username", "admin").execute().data[0]

  supabase.table("device_info").insert({
    "deviceClass": "BEAM US-91231231",
    "manufacturer": "Siemens",
    "manufacturerUri": "https://siemens.com",
    "model": "S1-1234",
    "productCode": 51231,
    "hardwarereVision": "v1.1",
    "softwareRevision": "v2.0.1",
    "serialNumber": "SN1234567890",
    "productInstanceUri": "https://siemens.com/s7-1200",
    "webshopUri": "https://shop.siemens.com/s7-1200",
    "sysDescr": "Temperature Sensor Module",
    "sysName": "TempSensor02",
    "sysContact": "support@siemens.com",
    "sysLocation": "Berlin Factory 1",
    "user": user["id"]
  }).execute()

  print("✅ Device info seeded.")

if __name__ == "__main__":
  import asyncio
  asyncio.run(create_deviceinfo())
