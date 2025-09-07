from typing import List 
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
import uuid

from app.api import utils
from app.crud import crud_zone
from app.models import models
from app.schemas import zone as zone_schema 

router = APIRouter()


# ✅ Get all zones for the current user's campus
@router.get("/map", response_model=List[zone_schema.MapZone])
def get_campus_map_data(
    db: Session = Depends(utils.get_db), 
    current_user: models.User = Depends(utils.get_current_user)                    
):
    return crud_zone.get_zones_by_campus(db, campus_id=current_user.campus_id)



@router.put("/bulk", response_model=dict)
def update_zones_bulk(
    zones_data: List[zone_schema.ZoneUpdate], 
    db: Session = Depends(utils.get_db), 
    current_user: models.User = Depends(utils.get_current_user)
): 
    return crud_zone.bulk_update_zones(
        db=db, 
        zones_data=zones_data, 
        campus_id=current_user.campus_id
    )


# ✅ Create a single new zone
@router.post("/", response_model=zone_schema.MapZone, status_code=201)
def create_new_zone(
    zone_data: zone_schema.ZoneCreate, 
    db: Session = Depends(utils.get_db), 
    current_user: models.User = Depends(utils.get_current_user)
): 
    return crud_zone.create_zone(
        db=db, 
        zone=zone_data, 
        campus_id=current_user.campus_id
    )


# ✅ Delete a zone by its public_id
@router.delete("/{zone_public_id}", status_code=204)
def delete_a_zone(
    zone_public_id: uuid.UUID, 
    db: Session = Depends(utils.get_db), 
    current_user: models.User = Depends(utils.get_current_user)
): 
    success = crud_zone.delete_zone(
        db=db, 
        zone_public_id=zone_public_id, 
        campus_id=current_user.campus_id
    )
    if not success: 
        raise HTTPException(
            status_code=404, 
            detail="Zone not found or you do not have permission to delete it."
        )
    return Response(status_code=204)
