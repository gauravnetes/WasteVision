from pydantic import BaseModel
import uuid
from typing import Optional
class CampusBase(BaseModel): 
    name: str
    city: str
    state: str
    
class Campus(CampusBase): 
    public_id: uuid.UUID
    center_latitude: float
    center_longitude: float
    
    campus_area_sq_meters: Optional[float] = None
    class Config: 
        from_attributes = True
        