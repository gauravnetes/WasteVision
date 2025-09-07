from fastapi import APIRouter
from app.api.routes import auth, locations, zones, campuses  # 👈 removed utils

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(locations.router, prefix="/locations", tags=["Locations"])
api_router.include_router(zones.router, prefix="/zones", tags=["Zones"])
api_router.include_router(campuses.router, prefix="/campuses", tags=["Campuses"])
