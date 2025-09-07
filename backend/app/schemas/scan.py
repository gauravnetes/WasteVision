# app/schemas/scan.py
import uuid
from datetime import datetime
from pydantic import BaseModel
from . import zone as zone_schema # Import the zone schemas

class ScanJobResponse(BaseModel):
    job_id: uuid.UUID
    status: str
    message: str

# ADD THIS NEW SCHEMA
class ScanResultResponse(BaseModel):
    image_url: str
    waste_volume_estimate: float
    processed_at: datetime
    zone: zone_schema.MapZone # Nest the full zone object

    class Config:
        from_attributes = True