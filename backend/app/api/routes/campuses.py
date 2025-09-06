from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.crud import crud_campus
from app.schemas import campus as campus_schema

from app.models import models
from app.api import utils

router = APIRouter()

@router.get("/", response_model=List[campus_schema.Campus])
def search_campuses(
    q: Optional[str] = Query(None, description="Search by name, city or state"),
    state: Optional[str] = Query(None, description="Filter by exact state name"),
    city: Optional[str] = Query(None, description="Filter by city"),
    db: Session = Depends(get_db)
):
    """
    Search campuses by partial match on name, city or state.
    Sanitization of campus_area_sq_meters is now handled in the schema (validators).
    """
    try:
        campuses_from_db = crud_campus.search_campuses(db=db, state=state, city=city, q=q)
        return campuses_from_db
    except Exception as e:
        import traceback
        print(f"Error in search_campuses: {str(e)}")
        print(traceback.format_exc())
        # Return an empty list instead of raising an error
        return []
    

@router.put("/me/location", response_model=campus_schema.Campus)
def update_my_campus_location(
    location_data: campus_schema.CampusLocationUpdate,
    db: Session = Depends(utils.get_db),
    current_user: models.User = Depends(utils.get_current_user)
):

    updated_campus = crud_campus.update_campus_location(
        db=db,
        campus_id=current_user.campus_id,
        lat=location_data.latitude,
        lon=location_data.longitude
    )
    return updated_campus

@router.get("/test", response_model=dict)
def test_endpoint():
    """
    Simple test endpoint to verify API is working.
    """
    return {"status": "ok", "message": "API is working"}
