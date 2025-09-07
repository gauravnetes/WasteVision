#!/usr/bin/env python3
import os
import uvicorn

# Set environment variables
os.environ["DATABASE_URL"] = "sqlite:///./waste_vision.db"
os.environ["SECRET_KEY"] = "your-secret-key-here-change-in-production"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
os.environ["GEOAPIFY_API_KEY"] = "your-geoapify-api-key-here"

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
