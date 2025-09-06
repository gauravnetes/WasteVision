from sqlalchemy.orm import Session
from app.models import models

def get_zones_by_campus(db: Session, campus_id: int): 
    return db.query(models.Zone).filter(models.Zone.campus_id == campus_id).all()
