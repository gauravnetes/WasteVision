from sqlalchemy.orm import Session
from app.models import models
from sqlalchemy import distinct, or_
from typing import Optional
def get_campuses(db: Session, city: Optional[str] = None, search_term: Optional[str] = None, skip: int = 0, limit: int = 100): 
    query = db.query(models.Campus)
    
    if city: 
        query = query.filter(models.Campus.city == city)
    
    if search_term:
        query = query.filter(
            or_(
                models.Campus.name.ilike(f"%{search_term}%"),
                models.Campus.city.ilike(f"%{search_term}%"),
                models.Campus.state.ilike(f"%{search_term}%")
            )
        )
        
    return query.order_by(models.Campus.name).offset(skip).limit(limit).all()

def get_distinct_states(db: Session): 
    results = db.query(distinct(models.Campus.state)).order_by(models.Campus.state).all()
    return [result[0] for result in results]

def get_distinct_cities_by_state(db: Session, state: str): 
    results = db.query(distinct(models.Campus.city)).filter(models.Campus.state == state).order_by(models.Campus.city).all()
    return [result[0] for result in results]

def get_campus_by_details(db: Session, name: str, city: str, state: str) -> Optional[models.Campus]: 
    return db.query(models.Campus).filter_by(
        name=name, 
        city=city, 
        state=state
    ).first()