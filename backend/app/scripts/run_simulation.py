import requests
import random
import glob
import os
import argparse
import sys
from pathlib import Path

script_dir = Path(__file__).resolve().parent
backend_dir = script_dir.parent.parent
sys.path.append(str(backend_dir))

from app.core.database import SessionLocal
from app.models import models

AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnb3VyYXYuYy5sZWFybmluZ0BnbWFpbC5jb20iLCJleHAiOjE3NTcxMTg5NDh9.VPKnFrGI6nsr8RKOAtAqICr30rex7rgbz4e7y_aRru8"

API_BASE_URL = "http://127.0.0.1:8000"
TEST_IMAGES_DIR = backend_dir / "ml" / "test_images"

def get_random_point_in_polygon(polygon_coords): 
    
    lons = [p[0] for p in polygon_coords]
    lats = [p[1] for p in polygon_coords]
    
    min_lon, max_lon = min(lons), max(lons)
    min_lat, max_lat = min(lats), max(lats)
    
    rand_lon = random.uniform(min_lon, max_lon)
    rand_lat = random.uniform(min_lat, max_lat)
    
    return rand_lat, rand_lon

def run_simulation(campus_public_id: str): 
    db = SessionLocal()
    try: 
        campus = db.query(models.Campus).filter(models.Campus.public_id == campus_public_id).first()
        if not campus or not campus.zones:
            print(f"ERROR: No campus or zones found for public_id '{campus_public_id}'.")
            print("Please run the `generate_zones.py` script for this campus first.")
            return
        
        campus_zones = campus.zones
        print(f"Found {len(campus_zones)} zones for campus '{campus.name}'.")

        
        image_paths = glob.glob(os.path.join(TEST_IMAGES_DIR, "*.jpg")) + \
                      glob.glob(os.path.join(TEST_IMAGES_DIR, "*.png"))
        if not image_paths:
            print(f"ERROR: No images found in '{TEST_IMAGES_DIR}'.")
            
        
        print(f"Found {len(image_paths)} test images.")
        
        headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}
        
        for image_path in image_paths: 
            random_zone = random.choice(campus_zones)
            zone_boundary = random_zone.geo_boundary['coordinates'][0]
            
            lat, lon = get_random_point_in_polygon(zone_boundary)
            print(f"Submitting '{os.path.basename(image_path)}' with coords ({lat:.4f}, {lon:.4f}) to zone {random_zone.zone_code}...")

            # Prepare the multipart/form-data payload
            files = {
                'file': (os.path.basename(image_path), open(image_path, 'rb'), 'image/jpeg')
            }
            data = {
                'latitude': lat,
                'longitude': lon
            }
            
            response = requests.post(f"{API_BASE_URL}/api/scans", headers=headers, files=files, data=data)
            
            if response.status_code == 202:
                print("-> SUCCESS: API accepted the task.")
            else:
                print(f"-> FAILED: API responded with {response.status_code}. Response: {response.text}")
                
    finally: 
        db.close()
        
        
if __name__ == "__main__": 
    parser = argparse.ArgumentParser(description="Simulate image uploads for a campus to test the backend pipeline.")
    parser.add_argument("campus_public_id", type=str, help="The public_id (UUID) of the campus to simulate.")
    args = parser.parse_args()
    
    run_simulation(args.campus_public_id)
