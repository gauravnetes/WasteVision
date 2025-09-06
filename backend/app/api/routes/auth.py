from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import utils
from app.crud import crud_user, crud_campus
from app.core import security
from app.core import email as email_utils
from app.schemas import user as user_schema 
from app.schemas import token as token_schema

router = APIRouter()

@router.post("/signup", response_model=user_schema.User, status_code=201)
def create_user(
    user_data: user_schema.UserSignUp, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(utils.get_db)
): 
    # Check if user's email already exists
    db_user = crud_user.get_user_by_email(db, email=user_data.email)
    if db_user: 
        raise HTTPException(status_code=400, detail="Email already registered")

    # Validate campus_id directly
    campus = crud_campus.get_campus_by_id(db=db, campus_id=user_data.campus_id)
    if not campus: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The selected campus was not found."
        )

    # Create user with validated data
    user_to_create = user_schema.UserCreate(
        name=user_data.name, 
        email=user_data.email, 
        password=user_data.password, 
        campus_id=user_data.campus_id
    )
    user = crud_user.create_user(db=db, user=user_to_create)
    
    # Send verification email in background
    background_tasks.add_task(
        email_utils.send_verification_email,
        user.email,
        user.verification_code,
        user.name
    )
    
    return user


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
    
    # Check if email is verified
    if user.is_email_verified != True:
        raise HTTPException(
            status_code = status.HTTP_403_FORBIDDEN,
            detail = "Email not verified. Please verify your email before logging in.",
            headers = {"WWW-Authenticate": "Bearer"}
        )
        
    # Generate access token
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-email/request", status_code=status.HTTP_200_OK)
def request_email_verification(
    verification_request: user_schema.EmailVerificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(utils.get_db)
):
    """Request a new email verification code"""
    user = crud_user.get_user_by_email(db, email=verification_request.email)
    if not user:
        # Don't reveal that the email doesn't exist
        return {"message": "If your email is registered, a verification code has been sent."}
    
    # If already verified, no need to send another code
    if user.is_email_verified == True:
        return {"message": "Email already verified."}
    
    # Generate new verification code
    user = crud_user.create_email_verification(db, verification_request.email)
    
    # Send verification email in background
    background_tasks.add_task(
        email_utils.send_verification_email,
        user.email,
        user.verification_code,
        user.name
    )
    
    return {"message": "Verification code sent to your email."}

@router.post("/verify-email/submit", status_code=status.HTTP_200_OK)
def submit_email_verification(
    verification_submit: user_schema.EmailVerificationSubmit,
    db: Session = Depends(utils.get_db)
):
    """Submit email verification code"""
    success = crud_user.verify_email(
        db, 
        verification_submit.email, 
        verification_submit.verification_code
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code."
        )
    
    return {"message": "Email verified successfully."}

@router.post("/reset-password/request", status_code=status.HTTP_200_OK)
def request_password_reset(
    reset_request: user_schema.PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(utils.get_db)
):
    """Request a password reset code"""
    user = crud_user.get_user_by_email(db, email=reset_request.email)
    if not user:
        # Don't reveal that the email doesn't exist
        return {"message": "If your email is registered, a password reset code has been sent."}
    
    # Generate new reset code
    user = crud_user.create_password_reset(db, reset_request.email)
    
    # Send reset email in background
    background_tasks.add_task(
        email_utils.send_password_reset_email,
        user.email,
        user.reset_password_code,
        user.name
    )
    
    return {"message": "Password reset code sent to your email."}

@router.post("/reset-password/submit", status_code=status.HTTP_200_OK)
def submit_password_reset(
    reset_submit: user_schema.PasswordResetSubmit,
    db: Session = Depends(utils.get_db)
):
    """Submit password reset code and new password"""
    success = crud_user.reset_password(
        db, 
        reset_submit.email, 
        reset_submit.reset_code, 
        reset_submit.new_password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset code."
        )
    
    return {"message": "Password reset successfully."}