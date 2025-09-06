# app/api/routes/campuses.py
import math
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.models import Campus
from app.crud import crud_campus
from app.schemas import campus as campus_schema

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
    """
    try:
        campuses_from_db = crud_campus.search_campuses(db=db, state=state, city=city, q=q)
        
        for campus in campuses_from_db: 
            if campus.campus_area_sq_meters and math.isnan(campus.campus_area_sq_meters): 
                campus.campus_area_sq_meters = None
                
        return campuses_from_db
    
    
    except Exception as e:
        import traceback
        print(f"Error in search_campuses: {str(e)}")
        print(traceback.format_exc())
        # Return an empty list instead of raising an error
        return []

@router.get("/test", response_model=dict)
def test_endpoint():
    """
    Simple test endpoint to verify API is working.
    """
    return {"status": "ok", "message": "API is working"}