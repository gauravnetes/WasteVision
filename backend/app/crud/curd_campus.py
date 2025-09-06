from sqlalchemy.orm import Session
from app.models import models
from sqlalchemy import distinct
def get_campuses(db: Session, skip: int = 0, limit: int = 100): 
    return db.query(models.Campus).offset(skip).limit(limit).all()

def get_distinct_states(db: Session): 
    results = db.query(distinct(models.Campus.state)).order_by(models.Campus.state).all()
    return [results[0] for result in results]

def get_distinct_cities_by_state(db: Session, state: str): 
    results = db.query(distinct(models.Campus.city)).filter(models.Campus.state == state).order_by(models.Campus.city).all()
    return [results[0] for result in results]