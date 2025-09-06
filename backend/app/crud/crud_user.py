from sqlalchemy.orm import Session
from app.models import models
from app.schemas import user as user_schema
from app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str): 
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: user_schema.UserCreate): 
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email = user.email,
        name = user.name, 
        hashed_password = hashed_password, 
        campus_id = user.campus_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user
    