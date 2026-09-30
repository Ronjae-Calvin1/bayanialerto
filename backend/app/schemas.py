"""Pydantic schemas — request/response shapes for the API."""
from typing import Optional, List
from pydantic import BaseModel


# ---- Facilities ----

class FacilityOut(BaseModel):
    id: int
    name: str
    type: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    contact: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True


# ---- Weather ----

class WeatherWarning(BaseModel):
    signal: Optional[int] = None  # PAGASA wind signal number, if applicable
    headline: str
    description: str


class WeatherOut(BaseModel):
    location: str
    temperature_c: float
    condition: str
    wind_kph: float
    rain_mm: float
    warnings: List[WeatherWarning] = []
    fetched_at: str


# ---- AI: personalized prep plan ----

class HouseholdInput(BaseModel):
    household_size: int
    has_infant: bool = False
    has_elderly: bool = False
    has_pets: bool = False
    has_medical_needs: bool = False
    house_type: Optional[str] = None  # e.g. "concrete", "wood", "low-lying area"


class PrepPlanOut(BaseModel):
    checklist: List[str]
    notes: Optional[str] = None


# ---- AI: weather explainer ----

class WeatherExplainerOut(BaseModel):
    summary: str
    recommended_actions: List[str]


# ---- AI: damage report drafter ----

class DamageReportInput(BaseModel):
    description: str  # free text from the user, any language


class DamageReportOut(BaseModel):
    structured_report: str
    affected_count: Optional[int] = None
    needs: List[str] = []


# ---- AI: ask box (fallback / online mode) ----

class AskInput(BaseModel):
    question: str
    stage: Optional[str] = None  # "before" | "during" | "after"


class AskOut(BaseModel):
    answer: str
    source: str  # "ai" | "local_guide"
