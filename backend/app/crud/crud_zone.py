from sqlalchemy.orm import Session
from app.models import models
from typing import List
from app.schemas import zone as zone_schema
from typing import Optional
from sqlalchemy import func
import uuid

def get_zones_by_campus(db: Session, campus_id: int): 
    return db.query(models.Zone).filter(models.Zone.campus_id == campus_id).all()


def bulk_update_zones(db: Session, zones_data: list[zone_schema.ZoneUpdate], campus_id: int):
    """
    Sync zones for a given campus with the payload from frontend.
    - Create new zones if missing
    - Update existing ones if geo_boundary changed
    - Delete zones not in payload
    """

    # 1. Fetch existing zones for this campus
    existing_zones = db.query(models.Zone).filter(models.Zone.campus_id == campus_id).all()
    existing_map = {str(z.public_id): z for z in existing_zones}

    created, updated, kept = 0, 0, 0
    incoming_ids = set()

    # 2. Handle new/update zones
    for zone in zones_data:
        incoming_ids.add(str(zone.public_id))

        if str(zone.public_id) in existing_map:
            db_zone = existing_map[str(zone.public_id)]
            if db_zone.geo_boundary != zone.geo_boundary:
                db_zone.geo_boundary = zone.geo_boundary
                updated += 1
            else:
                kept += 1
        else:
            new_zone = models.Zone(
                public_id=zone.public_id or uuid.uuid4(),
                campus_id=campus_id,
                geo_boundary=zone.geo_boundary,
            )
            db.add(new_zone)
            created += 1

    # 3. Delete zones not in payload
    deleted = 0
    for db_zone in existing_zones:
        if str(db_zone.public_id) not in incoming_ids:
            db.delete(db_zone)
            deleted += 1

    db.commit()

    return {
        "created": created,
        "updated": updated,
        "deleted": deleted,
        "kept": kept,
        "total": len(zones_data)
    }


def find_zone_by_coords(db: Session, lat: float, lon: float, campus_id: int) -> Optional[models.Zone]:
    """
    Finds a zone that contains the given GPS coordinates for a specific campus.
    Uses PostGIS for efficient geospatial querying.
    """
    # ST_MakePoint creates a geometry point from lon/lat.
    # ST_SetSRID assigns the standard GPS coordinate system (4326).
    # ST_Contains checks if the geo_boundary polygon contains that point.
    return db.query(models.Zone).filter(
        models.Zone.campus_id == campus_id,
        func.ST_Contains(
            func.ST_GeomFromGeoJSON(models.Zone.geo_boundary),
            func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326)
        )
    ).first()