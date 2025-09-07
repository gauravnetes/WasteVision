import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from . import campus as campus_schema

class UserSignUp(BaseModel): 
    name: str 
    email: EmailStr
    password: str
    campus_id: int  


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    campus_id: int


class EmailVerificationRequest(BaseModel):
    email: EmailStr

class EmailVerificationSubmit(BaseModel):
    email: EmailStr
    verification_code: str = Field(..., min_length=6, max_length=6)


class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetSubmit(BaseModel):
    email: EmailStr
    reset_code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)



class User(BaseModel): 
    public_id: Optional[uuid.UUID]  # optional since DB usually generates it
    id: Optional[int]               # primary key id from DB
    name: str
    email: EmailStr                
    is_email_verified: bool
    campus: campus_schema.Campus
    profile_image_url: Optional[str] = None
    
    class Config: 
        orm_mode = True              # (new name in Pydantic v2 is from_attributes = True)
        from_attributes = True