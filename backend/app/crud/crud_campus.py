from sqlalchemy.orm import Session
from app.models import models
from sqlalchemy import distinct, or_
from typing import Optional, List


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

def search_campuses(
    db: Session, 
    state: Optional[str] = None, 
    city: Optional[str] = None, 
    q: Optional[str] = None, 
    limit: int = 20
):
    query = db.query(models.Campus)
    
    if state:
        query = query.filter(models.Campus.state.ilike(f"%{state}%"))
        
    if city:
        query = query.filter(models.Campus.city.ilike(f"%{city}%"))
        
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                models.Campus.name.ilike(search_pattern),
                models.Campus.city.ilike(search_pattern),
                models.Campus.state.ilike(search_pattern),
            )
        )
        results = query.order_by(models.Campus.name).limit(limit).all()
        print(f"🔍 Search campuses q='{q}' state='{state}' city='{city}' -> {len(results)} results")
        return results
    if not q and not city and not state:
        return []


    return query.order_by(models.Campus.name).limit(limit).all()
    


def get_campus_by_details(db: Session, name: str, city: str, state: str) -> Optional[models.Campus]: 
    return db.query(models.Campus).filter_by(
        name=name, 
        city=city, 
        state=state
    ).first()


def get_campus_by_id(db: Session, campus_id: int) -> Optional[models.Campus]:
    return db.query(models.Campus).filter(models.Campus.id == campus_id).first()


# campus location getting updated by the user 
def update_campus_location(db: Session, campus_id: int, lat: float, lon: float) -> models.Campus: 
    db_campus = db.query(models.Campus).filter(models.Campus.id == campus_id).first()
    if db_campus: 
        db_campus.center_latitude = lat
        db_campus.center_longitude = lon
        db.commit()
        db.refresh(db_campus)
        
    return db_campus
        