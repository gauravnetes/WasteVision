from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import utils
from app.crud import crud_user, crud_campus
from app.core import security
from app.schemas import user as user_schema 
from app.schemas import token as token_schema

router = APIRouter()

@router.post("/signup", response_model=user_schema.User, status_code=201)
def create_user(user_data: user_schema.UserSignUp, db: Session = Depends(utils.get_db)): 
    # if user's email already exists shows error message
    db_user = crud_user.get_user_by_email(db, email=user_data.email)
    if db_user: 
        raise HTTPException(status_code=400, detail="Email already registered")
    
    campus = crud_campus.get_campus_by_details(
        db=db, name=user_data.campus_name, city=user_data.city, state=user_data.state
    )
    
    if not campus: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The selected campus, city, or state combination was not found."
        )
        
        
    user_to_create = user_schema.UserCreate(
        name = user_data.name, 
        email = user_data.email, 
        password = user_data.password, 
        campus_id = campus.id
    )
    
    return crud_user.create_user(db=db, user=user_to_create)


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