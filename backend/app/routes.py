from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from . import ai_service, weather_service
from .database import get_db
from .models import Facility
from .schemas import (
    FacilityOut, WeatherOut,
    HouseholdInput, PrepPlanOut,
    WeatherExplainerOut,
    DamageReportInput, DamageReportOut,
    AskInput, AskOut,
)

router = APIRouter()


# ---- Facilities (map) ----

@router.get("/facilities", response_model=List[FacilityOut])
def list_facilities(db: Session = Depends(get_db)):
    return db.query(Facility).all()


# ---- Weather ----

@router.get("/weather", response_model=WeatherOut)
def get_weather(location: str = "Rosario, Batangas"):
    return weather_service.get_weather(location)


# ---- AI features ----

@router.post("/ai/prep-plan", response_model=PrepPlanOut)
def prep_plan(household: HouseholdInput):
    return ai_service.generate_prep_plan(household)


@router.get("/ai/weather-explainer", response_model=WeatherExplainerOut)
def weather_explainer(location: str = "Rosario, Batangas"):
    w = weather_service.get_weather(location)
    signal = w.warnings[0].signal if w.warnings else None
    return ai_service.explain_weather(w.condition, w.wind_kph, w.rain_mm, signal)


@router.post("/ai/damage-report", response_model=DamageReportOut)
def damage_report(payload: DamageReportInput):
    return ai_service.draft_damage_report(payload.description)


@router.post("/ai/ask", response_model=AskOut)
def ask(payload: AskInput):
    return ai_service.ask(payload.question, payload.stage)
