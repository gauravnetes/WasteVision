from sqlalchemy.orm import Session, joinedload
import random
import string
from datetime import datetime, timedelta
from app.models import models
from app.schemas import user as user_schema
from app.core.security import get_password_hash
from typing import Optional
from typing import List


def get_user_by_email(db: Session, email: str): 
    return db.query(models.User).options(
        joinedload(models.User.campus)
    ).filter(models.User.email == email).first()


def create_user(db: Session, user: user_schema.UserCreate): 
    hashed_password = get_password_hash(user.password)
    verification_code = generate_verification_code()
    expires_at = datetime.now() + timedelta(hours=24)
    
    db_user = models.User(
        email = user.email,
        name = user.name, 
        hashed_password = hashed_password, 
        campus_id = user.campus_id,
        verification_code = verification_code,
        verification_code_expires_at = expires_at
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def generate_verification_code():
    """Generate a random 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def create_email_verification(db: Session, email: str):
    """Create a new verification code for an existing user"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    
    verification_code = generate_verification_code()
    expires_at = datetime.now() + timedelta(hours=24)
    
    user.verification_code = verification_code
    user.verification_code_expires_at = expires_at
    db.commit()
    
    return user

def verify_email(db: Session, email: str, verification_code: str):
    """Verify a user's email with the provided verification code"""
    user = get_user_by_email(db, email)
    if not user:
        return False
    
    if user.verification_code != verification_code:
        return False
    
    if user.verification_code_expires_at < datetime.now():
        return False
    
    user.is_email_verified = True
    user.verification_code = None
    user.verification_code_expires_at = None
    db.commit()
    
    return True

def create_password_reset(db: Session, email: str):
    """Create a password reset code for a user"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    
    reset_code = generate_verification_code()
    expires_at = datetime.now() + timedelta(hours=1)
    
    user.reset_password_code = reset_code
    user.reset_password_code_expires_at = expires_at
    db.commit()
    
    return user

def reset_password(db: Session, email: str, reset_code: str, new_password: str):
    """Reset a user's password using the reset code"""
    user = get_user_by_email(db, email)
    if not user:
        return False
    
    if user.reset_password_code != reset_code:
        return False
    
    if user.reset_password_code_expires_at < datetime.now():
        return False
    
    user.hashed_password = get_password_hash(new_password)
    user.reset_password_code = None
    user.reset_password_code_expires_at = None
    db.commit()
    
    return True
    
    
def update_profile_image_url(db: Session, user_id: int, image_url: str) -> Optional[models.User]:
    """Updates the profile image URL for a user."""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.profile_image_url = image_url
        db.commit()
        db.refresh(db_user)
    return db_user

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