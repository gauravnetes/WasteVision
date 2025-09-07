from sqlalchemy.orm import Session, joinedload
from app.models import models
from datetime import datetime, timezone
from typing import List

def create_scan_job(db: Session, user_id: int) -> models.ScanJob: 
    new_job = models.ScanJob(user_id = user_id, status = "pending")
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

def create_scan_result(db: Session, job_id: int, zone_id: int, image_url: str, waste_volume_estimate: float): 
    new_result = models.ScanResult(
        job_id=job_id, 
        zone_id=zone_id, 
        image_url=image_url, 
        waste_volume_estimate=waste_volume_estimate, 
        processed_at = datetime.now(timezone.utc)
    )
    
    db.add(new_result)
    db.commit()
    return new_result

def get_scan_results_for_campus(db: Session, campus_id: int, limit: int = 50) -> List[models.ScanResult]:
    """
    Gets the most recent scan results for a given campus.
    """
    return db.query(models.ScanResult).options(
        joinedload(models.ScanResult.zone) # Eagerly load the related Zone object
    ).join(
        models.ScanJob
    ).join(
        models.User
    ).filter(
        models.User.campus_id == campus_id
    ).order_by(
        models.ScanResult.processed_at.desc()
    ).limit(limit).all()