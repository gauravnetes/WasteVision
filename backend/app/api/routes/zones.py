from typing import List 
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import utils
from app.crud import crud_zone, crud_campus
from app.models import models
from app.schemas import zone as zone_schema 
from app.schemas import campus as campus_schema

router =  APIRouter()



@router.get("/map", response_model=List[zone_schema.MapZone])
def get_campus_map_data(
    db: Session = Depends(utils.get_db), 
    current_user: models.User = Depends(utils.get_current_user)                    
):
    
    # Fetches all the zones for the logged-in user's campus. 
    return crud_zone.get_zones_by_campus(db, campus_id=current_user.campus_id)


@router.put("/", response_model=dict) 
def update_zones_bulk(
    zones_data: List[zone_schema.ZoneUpdate], 
    db: Session = Depends(utils.get_db), 
    current_user: models.User = Depends(utils.get_current_user)
): 
    return crud_zone.bulk_update_zones(db=db, zones_data=zones_data)
    