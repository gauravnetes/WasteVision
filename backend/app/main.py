from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, zones, locations, campuses, users, scans
from app.core.database import Base, engine   # 👈 use new database.py
from app.models import models  # 👈 ensure models are imported so tables get registered


# Create all tables
Base.metadata.create_all(bind=engine)

origins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001", "http://localhost:8000", "http://127.0.0.1:8000"]

app = FastAPI(
    title="WasteVision API",
    description="Backend for the WasteVision.",
    version="1.0.0",
)

# CORS - Add middleware before registering routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use the defined origins list instead of "*"
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)


# Register routers
app.include_router(campuses.router, prefix="/api/campuses", tags=["Campuses"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(zones.router, prefix="/api/zones", tags=["Map & Zones"])
app.include_router(locations.router, prefix="/api", tags=['Locations'])
app.include_router(scans.router, prefix="/api/scans", tags=['Locations'])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Waste Management API!"}