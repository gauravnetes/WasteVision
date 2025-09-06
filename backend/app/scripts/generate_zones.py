import math 
import argparse
import uuid
import sys
from pathlib import Path

script_dir = Path(__file__).resolve().parent
backend_dir = script_dir.parent.parent
sys.path.append(str(backend_dir))

from sqlalchemy.orm import Session
from app.models import models
from app.core.database import SessionLocal

# constants 
ZONE_SIZE_METERS = 100.0
DEFAULT_AREA_SQ_METERS = 250000.0

def generate_zones_for_campus(db: Session, campus_public_id: str): 
    
    # fetching campus 
    campus = db.query(models.Campus).filter(models.Campus.public_id == campus_public_id).first()
    
    if not campus: 
        print(f"ERROR: Campus with public_id '{campus_public_id} not found")
        return 
    
    # check for existing zones for a specific campus 
    existing_zones = db.query(models.Zone).filter(models.Zone.campus_id == campus.id)
    if existing_zones.count() > 0: 
        print(f"SKIPPING: Zones already exist for '{campus.name}.'")
        return
    
    print(f"Generating zones for {campus.name}...")
    
    # grid size calculation
    area = campus.campus_area_sq_meters
    
    if not area or math.isnan(area) or area <= 0: 
        print(f"WARNING: Campus are not available. Using default size.")
        area = DEFAULT_AREA_SQ_METERS
        
    side_length_meters = math.sqrt(area)
    grid_size = math.ceil(side_length_meters / ZONE_SIZE_METERS)
    print(f"Campus area suggests a grid of {grid_size}x{grid_size} zones")
    
    lat = campus.center_latitude
    METERS_PER_DEGREE_LAT = 111132
    METERS_PER_DEGREE_LON = 111132 * math.cos(math.radians(lat))
    
    offset_lat_deg = ZONE_SIZE_METERS / METERS_PER_DEGREE_LAT
    offset_lon_deg = ZONE_SIZE_METERS / METERS_PER_DEGREE_LON
    
    total_grid_width_deg = grid_size * offset_lon_deg
    total_grid_height_deg = grid_size * offset_lat_deg
    
    start_lon = campus.center_longitude - (total_grid_width_deg / 2)
    start_lat = campus.center_latitude + (total_grid_height_deg / 2)
    
    new_zones = []
    
    for i in range(grid_size): 
        for j in range(grid_size): 
            campus_short_name = campus.name.split(' ')[0].upper() if campus.name else "CAMPUS"
            zone_code = f"{campus_short_name}-{chr(65+i)}{j+1}"
            
            top_left_lat = start_lat - (i * offset_lat_deg)
            top_left_lon = start_lon + (j * offset_lon_deg)
            
            geo_boundary = [
                [top_left_lon, top_left_lat], # top-left
                [top_left_lon + offset_lon_deg, top_left_lat], # top-right
                [top_left_lon + offset_lon_deg, top_left_lat - offset_lat_deg], # bottom-right
                [top_left_lon, top_left_lat - offset_lat_deg], # bottom-left
                [top_left_lon, top_left_lat] # close the loop
            ]
            
            zone = models.Zone(
                public_id = uuid.uuid4(), 
                campus_id = campus.id, 
                zone_code = zone_code, 
                geo_boundary= {"type": "Polygon", "coordinates": [geo_boundary]}
            )
            
            new_zones.append(zone)
            
    print(f"Adding {len(new_zones)} new zones to the DB..")
    db.add_all(new_zones)
    db.commit()
    print(f"Successfully saved zones.")
    
if __name__ == "__main__": 
    print("Starting process to generate zones for ALL campuses...")
    db_session = SessionLocal()
    
    try: 
        
        all_campuses = db_session.query(models.Campus).all()
        
        if not all_campuses: 
            print("No campuses found in DB")
        else: 
            print(f"Found {len(all_campuses)} campuses in process")
            for campus in all_campuses: 
                generate_zones_for_campus(db_session, str(campus.public_id))
                
    finally: 
        db_session.close()
        print("\nProcess Finished")
