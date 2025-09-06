from typing import List 
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import utils
from app.crud import crud_zone, crud_campus
from app.models import models
from app.schemas import zone as zone_schema 
from app.schemas import campus as campus_schema

router =  APIRouter()

@router.get("/campuses", response_model=List[campus_schema.Campus])
def read_campuses(db: Session = Depends(utils.get_db), skip: int = 0, limit: int = 100): 
    return crud_campus.get_campuses(db, skip=skip, limit=limit)

@router.get("/zones/map", response_model=List[zone_schema.MapZone])
def get_campus_map_data(
    db: Session = Depends(utils.get_db), 
    current_user: models.User = Depends(utils.get_current_user)                    
):
    
    # Fetches all the zones for the logged-in user's campus. 
    return crud_zone.get_zones_by_campus(db, campus_id=current_user.campus_id)