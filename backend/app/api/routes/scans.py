# app/api/routes/scans.py
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.api import utils  # <-- FIX 1: Use the consistent 'deps' import
from app.crud import crud_scan
from app.core.cloudinary_utils import upload_image_to_cloudinary
from app.models import models
from app.schemas import scan as scan_schema
from celery_worker import process_scan_image
from typing import List
router = APIRouter()

@router.post("/", response_model=scan_schema.ScanJobResponse, status_code=202) # <-- FIX 2: Corrected spelling to ScanJobResponse
def create_scan(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    db: Session = Depends(utils.get_db),
    current_user: models.User = Depends(utils.get_current_user)
):
    job = crud_scan.create_scan_job(db=db, user_id=current_user.id)
    if not job:
        raise HTTPException(status_code=500, detail="Could not create scan job")

    upload_result = upload_image_to_cloudinary(file)
    image_url = upload_result.get("secure_url")
    if not image_url:
        raise HTTPException(status_code=500, detail="Could not upload image to Cloudinary.")

    process_scan_image.delay(
        image_url=image_url,  # <-- FIX 3: Use a clearer parameter name
        lat=latitude,
        lon=longitude,
        job_id=job.id,
        user_id=current_user.id, 
        campus_id=current_user.campus_id 
    )

    return {
        "job_id": job.public_id,
        "status": "pending",
        "message": "Scan has been received and is scheduled for processing."
    }
    
@router.get("/results", response_model=List[scan_schema.ScanResultResponse])
def get_scan_results(
    db: Session = Depends(utils.get_db),
    current_user: models.User = Depends(utils.get_current_user)
):
    """
    Gets the most recent scan results for the logged-in user's campus.
    """
    results = crud_scan.get_scan_results_for_campus(db, campus_id=current_user.campus_id)
    return results