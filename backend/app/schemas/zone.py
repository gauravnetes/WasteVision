import uuid 
from pydantic import BaseModel
from typing import Any

class MapZone(BaseModel): 
    public_id: uuid.UUID
    zone_code: str
    geo_boundary: Any
    current_status: str
    
    class Config: 
        from_attributes = True