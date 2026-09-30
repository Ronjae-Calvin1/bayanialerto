"""
AI service layer.

Every AI feature goes through here so there's exactly one place that:
  1. Talks to the LLM API
  2. Grounds answers in verified local content (RAG-lite)
  3. Gets swapped for a real API call later without touching routes.py

STUBBED for the backbone: functions return canned/rule-based output so the
rest of the app can be wired and tested before an API key is plugged in.

To go live: replace the body of each function with an actual call, e.g.
using `anthropic` Python SDK, and keep the same return shape.
"""
from typing import List
from .schemas import HouseholdInput, PrepPlanOut, WeatherExplainerOut, DamageReportOut, AskOut


def generate_prep_plan(household: HouseholdInput) -> PrepPlanOut:
    """Personalized go-bag / prep checklist based on household details."""
    checklist: List[str] = [
        "3-day supply of water (4L per person per day)",
        "Non-perishable food for 3 days",
        "Flashlight and extra batteries",
        "Power bank, fully charged",
        "Copies of important documents in a waterproof bag",
        "First aid kit",
        "Whistle for signaling",
        "Cash in small bills",
    ]
    if household.has_infant:
        checklist += ["Diapers and infant formula", "Baby medications"]
    if household.has_elderly:
        checklist += ["Extra maintenance medications", "Mobility aids charged/ready"]
    if household.has_pets:
        checklist += ["Pet food and water", "Pet carrier"]
    if household.has_medical_needs:
        checklist += ["Medical device backup power (e.g. CPAP battery)"]

    notes = None
    if household.house_type and "low-lying" in household.house_type.lower():
        notes = "Your area type suggests higher flood risk — consider early evacuation before the signal is raised."

    # TODO: replace with LLM call, e.g.:
    # prompt = f"Generate a typhoon prep checklist for: {household.model_dump()}"
    # response = call_llm(prompt, system=PREP_PLAN_SYSTEM_PROMPT)
    return PrepPlanOut(checklist=checklist, notes=notes)


def explain_weather(condition: str, wind_kph: float, rain_mm: float, signal: int | None) -> WeatherExplainerOut:
    """Turn raw forecast numbers into plain-language guidance."""
    actions = ["Monitor official PAGASA updates.", "Charge devices and power banks now."]
    if signal and signal >= 3:
        actions.insert(0, "Consider early evacuation if you're in a flood-prone or coastal area.")
    elif signal and signal >= 1:
        actions.insert(0, "Secure loose outdoor items and prepare your go-bag.")

    summary = (
        f"Current conditions: {condition}, wind at {wind_kph} kph, rainfall {rain_mm} mm."
        + (f" Wind Signal #{signal} is in effect." if signal else " No wind signal currently in effect.")
    )

    # TODO: replace with LLM call for more natural phrasing / translation.
    return WeatherExplainerOut(summary=summary, recommended_actions=actions)


def draft_damage_report(description: str) -> DamageReportOut:
    """Turn free-text damage description into a structured report."""
    # TODO: replace with LLM call to actually parse `description`.
    return DamageReportOut(
        structured_report=f"Report (auto-drafted, unedited input below):\n{description}",
        affected_count=None,
        needs=[],
    )


def ask(question: str, stage: str | None) -> AskOut:
    """Fallback ask-box handler. Online: would call the LLM grounded in guide content."""
    # TODO: replace with LLM call grounded in the before/during/after JSON guides.
    return AskOut(
        answer="AI answer generation is not yet connected. This is a placeholder response.",
        source="ai",
    )
