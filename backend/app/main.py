# app/main.py
from fastapi import FastAPI
from app.api.routes import auth, zones
from app.models.models import Base, engine

# This is the crucial line that creates the database tables.
# It uses the "blueprints" from your models.py file.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WasteVision API",
    description="Backend for the WasteVision.",
    version="1.0.0",
)

# Include API routers from other files
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(zones.router, prefix="/api", tags=["Map & Zones"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Waste Management API!"}