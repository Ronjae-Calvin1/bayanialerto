"""
Backbone: map slice only.
Facilities in SQLite -> one FastAPI endpoint -> frontend fetches it.
Weather/AI modules still exist in the folder but aren't wired in yet.
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .database import Base, engine, SessionLocal, get_db
from .models import Facility
from .schemas import FacilityOut

Base.metadata.create_all(bind=engine)


def seed_facilities():
    """Insert a couple of sample facilities on first run so the map has data."""
    db = SessionLocal()
    try:
        if db.query(Facility).count() == 0:
            db.add_all([
                Facility(
                    name="Rosario District Hospital",
                    type="hospital",
                    latitude=13.8459,
                    longitude=121.2044,
                    address="Rosario, Batangas",
                    contact="N/A",
                ),
                Facility(
                    name="Barangay Evacuation Center (Sample)",
                    type="evacuation_center",
                    latitude=13.8500,
                    longitude=121.2100,
                    address="Sample Barangay, Rosario, Batangas",
                    contact="N/A",
                ),
                Facility(
                    name="Rosario Rural Health Clinic",
                    type="clinic",
                    latitude=13.8430,
                    longitude=121.2010,
                    address="Poblacion, Rosario, Batangas",
                    contact="N/A",
                ),
            ])
            db.commit()
    finally:
        db.close()


seed_facilities()

app = FastAPI(title="Typhoon Prep API — map slice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/facilities", response_model=List[FacilityOut])
def list_facilities(db: Session = Depends(get_db)):
    return db.query(Facility).all()
