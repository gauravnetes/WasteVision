from pydantic import BaseModel
import uuid

class CampusBase(BaseModel): 
    name: str
    city: str
    state: str
    
class Campus(CampusBase): 
    public_id: uuid.UUID
    center_latitude: float
    center_longitude: float
    class Config: 
        from_attributes = True
        