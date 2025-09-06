import uuid
from sqlalchemy import (Column, Integer, String, Double, ForeignKey, 
                        TIMESTAMP, JSON, create_engine)
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autoflush=False, bind=engine)
Base = declarative_base()

class Campus(Base): 
    __tablename__ = "campuses"
    id = Column(Integer, primary_key=True, index=True) # id SERIAL PRIMARY KEY
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True) # name VARCHAR(255) NOT NULL, UNIQUE
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    center_latitude = Column(Double, nullable=False) # center_latitude DOUBLE PRECISION NOT NULL
    center_longitude = Column(Double, nullable=False)
    admin = relationship("User", back_populates="campus", uselist=False) # uselist = False enforce a one-to-one relationship
    zones = relationship("Zone", back_populates="campus")
    
class User(Base): 
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    campus_id = Column(Integer, ForeignKey("campuses.id"), unique=True)
    campus = relationship("Campus", back_populates="admin")
    
class Zone(Base): 
    __tablename__ = "zones"
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False, index=True)
    campus_id = Column(Integer, ForeignKey("campuses.id"), nullable=False)
    zone_code = Column(String(20), nullable=False, index=True)
    geo_boundary = Column(JSON, nullable=False)
    current_status = Column(String(10), nullable=False, default='Green')
    last_waste_score = Column(Integer, default=0)
    last_scnned_at = Column(TIMESTAMP, nullable=True)
    camups = relationship("Campus", back_populates="zones")