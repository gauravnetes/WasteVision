# app/models/models.py
import uuid
from sqlalchemy import Column, Integer, String, Double, ForeignKey, TIMESTAMP, JSON, Float, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base 
from  datetime import datetime, timezone
# app/models/models.py
import uuid
from sqlalchemy import (Column, Integer, String, Double, ForeignKey, TIMESTAMP,
                        JSON, Float, UniqueConstraint, Boolean)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class Campus(Base): 
    __tablename__ = "campuses"
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    center_latitude = Column(Double, nullable=False)
    center_longitude = Column(Double, nullable=False)
    campus_area_sq_meters = Column(Float, nullable=True)
    
    boundary_padding_meters = Column(Integer, default = 100, nullable=False)

    admin = relationship("User", back_populates="campus", uselist=False)
    zones = relationship("Zone", back_populates="campus")

    __table_args__ = (UniqueConstraint('name', 'city', 'state', name='_name_city_state_uc'),)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    campus_id = Column(Integer, ForeignKey("campuses.id"), unique=True)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    verification_code = Column(String(6), nullable=True)
    verification_code_expires_at = Column(TIMESTAMP, nullable=True)
    reset_password_code = Column(String(6), nullable=True)
    reset_password_code_expires_at = Column(TIMESTAMP, nullable=True)
    profile_image_url = Column(String(512), nullable=True)
    campus = relationship("Campus", back_populates="admin")

class Zone(Base):
    __tablename__ = "zones"
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False, index=True)
    campus_id = Column(Integer, ForeignKey("campuses.id"), nullable=False)
    zone_code = Column(String(50), nullable=False, index=True)
    geo_boundary = Column(JSON, nullable=False)
    current_status = Column(String(10), nullable=False, default='Green')
    last_waste_score = Column(Integer, default=0)
    last_scanned_at = Column(TIMESTAMP, nullable=True)

    campus = relationship("Campus", back_populates="zones")

class ScanJob(Base): 
    __tablename__ = "scan_jobs"
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False, index=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default='pending', nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now(timezone.utc), nullable=False)
    completed_at = Column(TIMESTAMP, nullable=True)
    
    owner = relationship("User")
    results = relationship("ScanResult", back_populates="job")
    
    
class ScanResult(Base): 
    __tablename__ = "scan_results"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("scan_jobs.id"), nullable=False)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    image_url = Column(String(512), nullable=False)
    waste_volume_estimate = Column(Float, nullable=True)
    processed_at = Column(TIMESTAMP, default=datetime.now(timezone.utc))
    
    job = relationship("ScanJob", back_populates="results")
    zone = relationship("Zone")
    
    