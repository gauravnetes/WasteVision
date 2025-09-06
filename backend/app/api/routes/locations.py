from typing import List, Optional 
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import utils
from app.crud import crud_campus
from app.schemas import campus as campus_schema 

router = APIRouter()

@router.get("/locations/states", response_model=List[str])
def read_states(db: Session = Depends(utils.get_db)): 
    return crud_campus.get_distinct_states(db=db)

@router.get("/locations/cities", response_model=List[str])
def read_cities_by_state(state: str, db: Session = Depends(utils.get_db)): 
    return crud_campus.get_distinct_cities_by_state(db=db, state=state)

@router.get("/campuses", response_model=List[campus_schema.Campus])
def read_campuses(city: Optional[str] = None, db: Session = Depends(utils.get_db)): 
    return crud_campus.get_campuses(db=db, city=city)