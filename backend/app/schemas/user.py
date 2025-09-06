import uuid
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    campus_id: int
    
class User(BaseModel): 
    public_id: uuid.UUID
    name: str
    email: EmailStr
    campus_id: int
    
    class Config: 
        from_attributes = True