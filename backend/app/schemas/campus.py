# app/schemas/campus.py
from pydantic import BaseModel, field_validator
import uuid
from typing import Optional
import math

# --- Base Schema ---
class CampusBase(BaseModel):
    name: str
    city: str
    state: str

# --- Main Output Schema ---
class Campus(CampusBase):
    id: int
    public_id: uuid.UUID
    center_latitude: float
    center_longitude: float
    campus_area_sq_meters: Optional[float] = None
    boundary_padding_meters: int

    # This validator is a great way to handle bad data from the DB
    @field_validator("campus_area_sq_meters", mode="before")
    def clean_area(cls, v):
        try:
            if v is None:
                return None
            val = float(v)
            if math.isnan(val) or math.isinf(val):
                return None
            return val
        except Exception:
            return None

    class Config:
        from_attributes = True

# --- Input Schema for Updating Location ---
class CampusLocationUpdate(BaseModel):
    latitude: float
    longitude: float
    
class CampusBoundaryUpdate(BaseModel): 
    boundary_padding: int

