# app/api/routes/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import utils
from app.models import models
from app.schemas import user as user_schema


router = APIRouter()

@router.get("/me", response_model=user_schema.User)
def read_users_me(current_user: models.User = Depends(utils.get_current_user)):
    """
    Get details for the currently logged-in user.
    """
    return current_user