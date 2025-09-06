from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import utils
from app.crud import crud_user
from app.core import security
from app.schemas import user as user_schema 
from app.schemas import token as token_schema

router = APIRouter()

@router.post("/signup", response_model=user_schema.User, status_code=201)
def create_user(user: user_schema.UserCreate, db: Session = Depends(utils.get_db)): 
    db_user = crud_user.get_user_by_email(db, email=user.email)
    if db_user: 
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud_user.create_user(db=db, user=user)

@router.post("/login", response_model=token_schema.Token)
def login_for_access_token(
   db: Session = Depends(utils.get_db), 
   form_data: OAuth2PasswordRequestForm = Depends()
): 
    user = crud_user.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password): 
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED, 
            detail = "Incorrect email or password", 
            headers = {"WWW-Authenticate": "Bearer"}
        )
        
    access_token = security.create_access_token(data={"sub": user.email})
    return  {"access_token": access_token, "token_type": "bearer"}