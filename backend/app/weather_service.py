"""
Weather service.

Backbone version returns a fixed sample payload so the frontend can be wired
and tested without network calls or an API key.

To go live: call Open-Meteo (no key needed), e.g.:
    GET https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,wind_speed_10m,precipitation
and map the JSON into WeatherOut. Add PAGASA-sourced warnings separately
since Open-Meteo doesn't provide PH wind signals.
"""
from datetime import datetime, timezone
from .schemas import WeatherOut, WeatherWarning


def get_weather(location: str = "Rosario, Batangas") -> WeatherOut:
    # TODO: replace with real Open-Meteo call + PAGASA warning parsing.
    return WeatherOut(
        location=location,
        temperature_c=27.5,
        condition="Cloudy with rain showers",
        wind_kph=45.0,
        rain_mm=12.0,
        warnings=[
            WeatherWarning(
                signal=2,
                headline="Wind Signal #2 in effect",
                description="Damaging winds expected. Secure outdoor structures.",
            )
        ],
        fetched_at=datetime.now(timezone.utc).isoformat(),
    )
