import os
import requests
import uuid
from pathlib import Path
from celery import Celery
import sys

backend_dir = Path(__file__).resolve().parent
sys.path.append(str(backend_dir))


from app.core.config import settings
from app.core.database import SessionLocal
from ml.pipeline import process_waste_image
from app.crud import crud_zone, crud_scan, crud_logic


celery_app = Celery(
    "tasks", 
    broker=settings.REDIS_URL, 
    backend=settings.REDIS_URL
)

TEMP_IMAGE_DIR = backend_dir / "temp_images"
os.makedirs(TEMP_IMAGE_DIR, exist_ok=True)

def download_image(image_url: str) -> str | None: 
    try: 
        response = requests.get(image_url, stream=True)
        response.raise_for_status()
        
        local_filename = TEMP_IMAGE_DIR / f"{uuid.uuid4()}.jpg"
        
        with open(local_filename, "wb") as f: 
            for chunk in response.iter_content(chunk_size=8192): 
                f.write(chunk)
                
        return str(local_filename)
    
    except Exception as e: 
        print(f"Error downloading {image_url}: {e}")
        return None
        
# process_scan_image.delay(
#         image_url=image_url,  # <-- FIX 3: Use a clearer parameter name
#         lat=latitude,
#         lon=longitude,
#         job_id=job.id,
#         user_id=current_user.id, 
#         campus_id=current_user.campus_id 
#     )
@celery_app.task
def process_scan_image(image_url: str, lat: float, lon: float, job_id: int, user_id: int, campus_id:  int): 
    
    # running the complete ml streamlined pipeline (waste detection + reconstruction)
    
    print(f"WORKER: Received task for job {job_id}. Processing image: {image_url}")
    
    local_image_path = download_image(image_url)
    if not local_image_path: 
        return f"Failed to download image: {image_url}"
    
    # complete ml pipeline 
    waste_volume = process_waste_image(local_image_path)
    
    db = SessionLocal()
    try: 
        zone = crud_zone.find_zone_by_coords(db, lat=lat, lon=lon, campus_id=campus_id)
        
        if not zone: 
            print(f"WARNING: No Zone found for coords ({lat}, {lon}) on campus {campus_id}.")
            return f"No zone found for coords."
    
        crud_scan.create_scan_result(
            db=db, 
            job_id=job_id, 
            zone_id=zone.id, 
            image_url=image_url, 
            waste_volume_estimate=waste_volume
        )
    
        print(f"-> Saved result to DB for zone {zone.zone_code}.")

        crud_logic.update_zone_status(db, zone_id=zone.id)
    finally: 
        if os.path.exists(local_image_path): 
            os.remove(local_image_path)
        db.close()
        
        
    import time
    time.sleep(10)
    print(f"WORKER: Finished processing for image: {image_url}")
    return {"status": "success", "image_url": image_url}