from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import models
from datetime import datetime, timezone
RED_THRESHOLD_CM3 = 30000
YELLOW_THRESHOLD_CM3 = 10000

def update_zone_status(db: Session, zone_id: int): 
    # aggregate of the waste vol for a comppleted scan job, sums the waste, and gets the zone object 
    print(f"Recalculating total waste for zone ID: {zone_id}")
    
    # This query sums ALL waste results for the given zone_id
    total_waste_result = db.query(
        func.sum(models.ScanResult.waste_volume_estimate)
    ).filter(
        models.ScanResult.zone_id == zone_id
    ).scalar()
    
    # if no results yet, sum will be None. Default to 0
    total_waste = total_waste_result or 0.0
    
    # getting the zone to be updated 
    zone = db.query(models.Zone).filter(models.Zone.id == zone_id).first()
    if not zone:
        return
    
 
    new_status = "Green"
    if total_waste >= RED_THRESHOLD_CM3: 
        new_status = "Red"
    elif total_waste >= YELLOW_THRESHOLD_CM3: 
        new_status = "Yellow"
        
    zone.current_status = new_status
    zone.last_waste_score = total_waste
    zone.last_scanned_at = datetime.now(timezone.utc)
    db.commit()
    
    print(f"Updating Zone {zone.zone_code}: Total Waste = {total_waste: .2f} cm3, New Status = {new_status}")
        
    db.commit()