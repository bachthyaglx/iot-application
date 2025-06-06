from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ---------- Auth ----------
class UserLogin(BaseModel):
  username: str
  password: str

# ---------- Device Info (for PUT updates) ----------
class DeviceInfo(BaseModel):
  deviceClass: Optional[str] = None
  manufacturer: Optional[str] = None
  manufacturerUri: Optional[str] = None
  model: Optional[str] = None
  productCode: Optional[int] = None
  hardwareRevision: Optional[str] = None
  softwareRevision: Optional[str] = None
  serialNumber: Optional[str] = None
  productInstanceUri: Optional[str] = None
  webshopUri: Optional[str] = None
  sysDescr: Optional[str] = None
  sysName: Optional[str] = None
  sysContact: Optional[str] = None
  sysLocation: Optional[str] = None
  user: Optional[str] = None

# ---------- Picture ----------
class Picture(BaseModel):
  filename: str
  contentType: str
  data: bytes
  user: Optional[str] = None

# ---------- Sensor Data ----------
class SensorData(BaseModel):
  timestamp: datetime
  temperature: float
  voltage: float
  humidity: float
  user: Optional[str] = None
