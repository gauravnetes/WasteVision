# app/api/routes/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import utils
from app.models import models
from app.schemas import user as user_schema
# app/api/routes/users.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
# ... other imports
from app.core.cloudinary_utils import upload_image_to_cloudinary
from app.crud import crud_user

router = APIRouter()

@router.get("/me", response_model=user_schema.User)
def read_users_me(current_user: models.User = Depends(utils.get_current_user)):
    """
    Get details for the currently logged-in user.
    """
    return current_user

# ... (keep your /me endpoint)

@router.put("/me/profile-image", response_model=user_schema.User)
def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(utils.get_db),
    current_user: models.User = Depends(utils.get_current_user)
):
    """
    Uploads a profile image for the current user.
    """
    # 1. Upload the image to Cloudinary
    upload_result = upload_image_to_cloudinary(file)
    image_url = upload_result.get("secure_url")
    if not image_url:
        raise HTTPException(status_code=500, detail="Could not upload image.")

    # 2. Update the user's record in the database with the new URL
    updated_user = crud_user.update_profile_image_url(
        db=db, user_id=current_user.id, image_url=image_url
    )
    
    return updated_user