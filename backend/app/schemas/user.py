import uuid
from pydantic import BaseModel, EmailStr

class UserSignUp(BaseModel): 
    name: str 
    email: EmailStr
    password: str
    state: str 
    city: str
    campus_name: str
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    campus_id: int
    
class User(BaseModel): 
    public_id: uuid.UUID
    name: str
    email: EmailStr
        
    class Config: 
        from_attributes = True