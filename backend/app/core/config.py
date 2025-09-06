from pydantic_settings import BaseSettings

class Settings(BaseSettings): 
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    GEOAPIFY_API_KEY: str
    
    # Email settings
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "Waste Vision"
    
    
    
    
    
    class Config: 
        env_file = ".env"
        
    
settings = Settings()