import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

def upload_image_to_cloudinary(file: UploadFile) -> dict:
    """
    Uploads an image file to Cloudinary and returns the response.
    """
    # The folder parameter is optional but helps organize uploads in Cloudinary
    result = cloudinary.uploader.upload(file.file, folder="waste_vision_uploads")
    return result