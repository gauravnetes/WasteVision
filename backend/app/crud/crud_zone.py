from sqlalchemy.orm import Session
from app.models import models
from typing import List
from app.schemas import zone as zone_schema
from typing import Optional
from sqlalchemy import func

def get_zones_by_campus(db: Session, campus_id: int): 
    return db.query(models.Zone).filter(models.Zone.campus_id == campus_id).all()


def bulk_update_zones(db: Session, zones_data: List[zone_schema.ZoneUpdate]): 
    for zone_data in zones_data: 
        db.query(models.Zone)\
            .filter(models.Zone.public_id == zone_data.public_id)\
            .update({"geo_boundary": zone_data.geo_boundary})
        
    db.commit()
    return {"status": "success"}


def find_zone_by_coords(db: Session, lat: float, lon: float, campus_id: int) -> Optional[models.Zone]: 
    # finding the zone that contains the given GPS coordinates for a 
    # specific campus. Uses PostGIS for efficient geospatial querying. 
    return db.query(models.Zone).filter(
        models.Zone.campus_id == campus_id, 
        func.ST_Contains(
            func.ST_GeomFromGeoJSON(models.Zone.geo_boundary), 
            func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326)
        )        
    ).first()
    
    