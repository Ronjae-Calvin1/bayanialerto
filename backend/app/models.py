"""
SQL models.

Facility: clinics, hospitals, evacuation centers — the map data.
CachedResponse: generic key/value cache for AI outputs (prep plans, weather
    explainers, etc.) so the frontend can fetch-once and reuse offline.
"""
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func

from .database import Base


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "hospital" | "clinic" | "evacuation_center"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=True)
    contact = Column(String, nullable=True)
    notes = Column(Text, nullable=True)


class CachedResponse(Base):
    """
    Generic cache row for AI-generated content.
    `key` examples: "prep_plan:household_hash", "weather_explainer:2026-09-29"
    Frontend stores the same thing in IndexedDB for offline use; this table
    is the server-side source of truth / fallback.
    """
    __tablename__ = "cached_responses"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    kind = Column(String, nullable=False)  # "prep_plan" | "weather_explainer" | "report_draft" | "hazard_assessment"
    content = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
